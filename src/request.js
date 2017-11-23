import axios from 'axios';

const whenToShowLoading = 1500;

const defaults = {
  timeout: 10000,
  withCredentials: false,

  whenToShowLoading,
  before: null, // function，返回false会阻止请求发送
  loading: function() {
    console.warn(`当你看到此提示时，说明存在服务端超过 ${whenToShowLoading} ms 的请求，并且没有进行全局 loading 配置，请参看 request.config 进行配置`);
  },
  verify: function(res) {
    return true;
  },
  transform: null, // function, 转换接收到的数据
  success: null, // function, 请求成功，处理转换后的数据
  error: function(err) {
    console.warn(`当你看到此提示时，说明存在请求异常，并且没有全局 error 配置，请参看 request.config 进行配置`);
  },
  customError: false, // 是否自定义处理异常，不使用全局异常处理
  complete: null,
  withCredentials: true
};

const KEYS = [
  'whenToShowLoading',
  'before',
  'loading',
  'verify',
  'transform',
  'success',
  'error',
  'customError',
  'complete'
];

function isFunction(fn) {
  return typeof fn === 'function';
}

const METHODS = ['get', 'post', 'delete', 'put', 'head', 'patch'];

function proxy(cfg) {
  const ins = axios.create();
  const name = cfg.name;

  function request(url, options) {
    if (typeof url === 'object') {
      options = url;
    } else {
      options = options || {};
      options.url = url;
    }
    if (cfg.prefix) {
      options.url = cfg.prefix.replace(/^\/$/, '') + '/' + options.url.replace(/^\//, '');
    }
    let params = { ...defaults, ...domain_default_config[name], ...options };
    this.params = params;
    this.request = ins;
    const customError = params.customError;
    const callback = {};
    for (let i = 1; i < KEYS.length; i++) {
      const key = KEYS[i];
      if (isFunction(params[key])) {
        callback[key] = params[key].bind(this);
      }
    }
    if (isFunction(callback.before)) {
      params = callback.before(params, ins, cfg);
    }

    if (params !== false) {
      let timer;
      if (isFunction(callback.loading)) {
        timer = setTimeout(() => {
          callback.loading(params, ins, cfg);
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
          if (isFunction(callback.transform)) {
            data = callback.transform(data, params, ins, cfg);
          }
          const result = callback.success(data, params, ins, cfg);
          return result;
        }
      }

      function cb(name, data) {
        if (isFunction(callback[name])) {
          return callback[name](data, params, ins, cfg);
        }
      }

      KEYS.forEach(key => {
        delete params[key];
      });

      return ins(params)
        .then(res => {
          clear();
          let flag = true;
          const data = res.data;
          if (isFunction(callback.verify)) {
            flag = callback.verify(res) !== false;
          }
          if (flag) {
            success(data);
            cb('complete', data);
            return Promise.resolve(data);
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
            cb('complete', err);
            if (customError === true) {
              // 继续传递，自行 .catch 捕获处理
              return Promise.reject(err);
            } else {
              cb('error', err);
            }
          } catch (e) {
            // 非请求造成异常，直接报错
            clear();
            throw error;
          }
        });
    }
  }

  for (const key in ins) {
    request[key] = ins[key];
  }

  // 对 request, get, post, delete, put, head, patch 进行处理
  request.request = function(config) {
    return new request(config);
  };
  METHODS.forEach(key => {
    request[key] = function(url, config) {
      config = config || {};
      config.method = key;
      return new request(url, config);
    };
  });

  return request;
}

/**
 * 全局配置
 */
function config(options) {
  for (const key in options) {
    defaults[key] = options[key];
  }
}

/**
 * 为多个跨域进行代理
 * :params configs: 
 *   {
 *     name: {
 *       prefix: 路由前缀，用来匹配转发,
 *       url: {
 *         local: 代理地址,
 *         dev: 代理地址,
 *         production: 代理地址
 *       }        
 *     },
 *     ...
 *   }
 */
const domain_default_config = {};
function init(configs) {
  Object.keys(configs).forEach(function(key) {
    const cfg = configs[key];
    if (proxy.hasOwnProperty(key)) {
      throw new Error(`${key} 不能作为请求命名`);
    }

    cfg.name = key;
    proxy[key] = proxy(cfg);
    domain_default_config[key] = {};

    proxy[key].config = function(options) {
      domain_default_config[key] = Object.assign(domain_default_config[key], options);
    };
  });
  return proxy;
}

proxy.config = config;
proxy.init = init;
module.exports = proxy;
