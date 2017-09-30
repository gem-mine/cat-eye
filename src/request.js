import axios from 'axios';

const whenToShowLoading = 1500;

const defaults = {
  timeout: 10000,
  withCredentials: false,

  whenToShowLoading,
  before: null,
  loading: function() {
    console.warn(`当你看到此提示时，说明存在服务端超过 ${whenToShowLoading} ms 的请求，并且没有进行全局 loading 配置，请参看 request.config 进行配置`);
  },
  verify: function(data) {
    // 服务端返回200时候根据数据进行处理，验证合法进入success，否则进入error
    return true;
  },
  success: null,
  error: function(err) {
    console.warn(`当你看到此提示时，说明存在请求异常，并且没有全局 error 配置，请参看 request.config 进行配置`);
  },
  throwError: false, // 是否继续传递异常
  complete: null
};

const KEYS = ['whenToShowLoading', 'before', 'loading', 'verify', 'success', 'error', 'throwError', 'complete'];

function isFunction(fn) {
  return typeof fn === 'function';
}

function request(url, options = {}) {
  if (typeof url === 'object') {
    options = url;
  } else {
    options.url = url;
  }
  const params = { ...defaults, ...options };
  const throwError = params.throwError;
  const callback = {};
  for (let i = 1; i < KEYS.length; i++) {
    const key = KEYS[i];
    callback[key] = params[key];
  }
  let goon = true;
  if (isFunction(callback.before)) {
    goon = callback.before(params) !== false;
  }

  if (goon) {
    let timer;
    if (isFunction(callback.loading)) {
      timer = setTimeout(() => {
        callback.loading(params);
      }, params.whenToShowLoading);
    }

    function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    }

    function success(data) {
      if (isFunction(callback.success)) {
        const result = callback.success(data, params);
        return result;
      } 
    }

    function cb(name, data) {
      if (isFunction(callback[name])) {
        return callback[name](data, params);
      }
    }

    KEYS.forEach(key => {
      delete params[key];
    });

    return axios(params)
      .then(res => {
        clear();
        let flag = true;
        const data = res.data;
        if (isFunction(callback.verify)) {
          flag = callback.verify(data) !== false;
        }
        if (flag) {
          cb('success', data);
          cb('complete', data);
          return data;
        } else {
          throw res; // 进入 catch
        }
      })
      .catch(error => {
        let err;
        try {
          clear();
          if (error.code) {
            // 客户端异常，目前只有客户端超时后主动abort
            err = {
              // 按服务端超时处理
              data: { code: error.code },
              status: 408,
              statusText: error.message
            };
          } else {
            if (error.response) {
              // http status error
              const { data, status, statusText } = error.response;
              err = { data, status, statusText };
            } else {
              // 根据verify返回false认为的error
              err = { data: error.data, status: 400 };
            }
          }
          cb('error', err);
          cb('complete', err);
          if (throwError === true) {
            // 继续传递
            return Promise.reject(err);
          }
        } catch (e) {
          // 非请求造成异常，直接报错
          clear();
          throw error;
        }
      });
  }
}

for (const key in axios) {
  request[key] = axios[key];
}

// 对 request, get, post, delete, put, head, patch 进行处理
request.request = function(config) {
  return request(config);
};
['get', 'post', 'delete', 'put', 'head', 'patch'].forEach(key => {
  request[key] = function(url, config) {
    config.method = key;
    return request(url, config);
  };
});

request.config = function(options) {
  request.config = function() {
    throw new Error('只能调用一次，多次调用容易造成难以查找的错误');
  };

  for (const key in options) {
    defaults[key] = options[key];
  }
};

module.exports = request;
