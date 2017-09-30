'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var whenToShowLoading = 1500;

var defaults = {
  timeout: 10000,
  withCredentials: false,

  whenToShowLoading: whenToShowLoading,
  before: null,
  loading: function loading() {
    console.warn('\u5F53\u4F60\u770B\u5230\u6B64\u63D0\u793A\u65F6\uFF0C\u8BF4\u660E\u5B58\u5728\u670D\u52A1\u7AEF\u8D85\u8FC7 ' + whenToShowLoading + ' ms \u7684\u8BF7\u6C42\uFF0C\u5E76\u4E14\u6CA1\u6709\u8FDB\u884C\u5168\u5C40 loading \u914D\u7F6E\uFF0C\u8BF7\u53C2\u770B request.config \u8FDB\u884C\u914D\u7F6E');
  },
  verify: function verify(data) {
    // 服务端返回200时候根据数据进行处理，验证合法进入success，否则进入error
    return true;
  },
  success: null,
  error: function error(err) {
    console.warn('\u5F53\u4F60\u770B\u5230\u6B64\u63D0\u793A\u65F6\uFF0C\u8BF4\u660E\u5B58\u5728\u8BF7\u6C42\u5F02\u5E38\uFF0C\u5E76\u4E14\u6CA1\u6709\u5168\u5C40 error \u914D\u7F6E\uFF0C\u8BF7\u53C2\u770B request.config \u8FDB\u884C\u914D\u7F6E');
  },
  throwError: false, // 是否继续传递异常
  complete: null
};

var KEYS = ['whenToShowLoading', 'before', 'loading', 'verify', 'success', 'error', 'throwError', 'complete'];

function isFunction(fn) {
  return typeof fn === 'function';
}

function request(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if ((typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object') {
    options = url;
  } else {
    options.url = url;
  }
  var params = _extends({}, defaults, options);
  var throwError = params.throwError;
  var callback = {};
  for (var i = 1; i < KEYS.length; i++) {
    var key = KEYS[i];
    callback[key] = params[key];
  }
  var goon = true;
  if (isFunction(callback.before)) {
    goon = callback.before(params) !== false;
  }

  if (goon) {
    var clear = function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    };

    var success = function success(data) {
      if (isFunction(callback.success)) {
        var result = callback.success(data, params);
        return result;
      }
    };

    var cb = function cb(name, data) {
      if (isFunction(callback[name])) {
        return callback[name](data, params);
      }
    };

    var timer = void 0;
    if (isFunction(callback.loading)) {
      timer = setTimeout(function () {
        callback.loading(params);
      }, params.whenToShowLoading);
    }

    KEYS.forEach(function (key) {
      delete params[key];
    });

    return (0, _axios2.default)(params).then(function (res) {
      clear();
      var flag = true;
      var data = res.data;
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
    }).catch(function (error) {
      var err = void 0;
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
            var _error$response = error.response,
                data = _error$response.data,
                status = _error$response.status,
                statusText = _error$response.statusText;

            err = { data: data, status: status, statusText: statusText };
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

for (var key in _axios2.default) {
  request[key] = _axios2.default[key];
}

// 对 request, get, post, delete, put, head, patch 进行处理
request.request = function (config) {
  return request(config);
};
['get', 'post', 'delete', 'put', 'head', 'patch'].forEach(function (key) {
  request[key] = function (url, config) {
    config.method = key;
    return request(url, config);
  };
});

request.config = function (options) {
  request.config = function () {
    throw new Error('只能调用一次，多次调用容易造成难以查找的错误');
  };

  for (var _key in options) {
    defaults[_key] = options[_key];
  }
};

module.exports = request;