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
  before: null, // function，返回false会阻止请求发送
  loading: function loading() {
    console.warn('\u5F53\u4F60\u770B\u5230\u6B64\u63D0\u793A\u65F6\uFF0C\u8BF4\u660E\u5B58\u5728\u670D\u52A1\u7AEF\u8D85\u8FC7 ' + whenToShowLoading + ' ms \u7684\u8BF7\u6C42\uFF0C\u5E76\u4E14\u6CA1\u6709\u8FDB\u884C\u5168\u5C40 loading \u914D\u7F6E\uFF0C\u8BF7\u53C2\u770B request.config \u8FDB\u884C\u914D\u7F6E');
  },
  verify: function verify(res) {
    return true;
  },
  transform: null, // function, 转换接收到的数据
  success: null, // function, 请求成功，处理转换后的数据
  error: null, // function, 请求失败处理函数
  customError: false, // 是否自定义处理异常，不使用全局异常处理
  complete: null
};

var KEYS = ['whenToShowLoading', 'before', 'loading', 'verify', 'transform', 'success', 'error', 'customError', 'complete'];

function isFunction(fn) {
  return typeof fn === 'function';
}

var METHODS = ['get', 'post', 'delete', 'put', 'head', 'patch'];

function proxy(cfg) {
  var ins = _axios2.default.create();
  var name = cfg.name;

  function request(url, options) {
    if ((typeof url === 'undefined' ? 'undefined' : _typeof(url)) === 'object') {
      options = url;
    } else {
      options = options || {};
      options.url = url;
    }

    if (cfg.prefix) {
      options.url = cfg.prefix.replace(/^\/$/, '') + '/' + options.url.replace(/^\//, '');
    }

    if (cfg.mode === 'cors' && !cfg.wds) {
      options.url = cfg.url.replace(/^\/$/, '') + '/' + options.url.replace(/^\//, '');
    }
    var params = _extends({}, defaults, domainDefaultConfig[name], options);

    this.params = params;
    this.request = ins;
    var customError = params.customError;
    var callback = {};
    for (var i = 1; i < KEYS.length; i++) {
      var key = KEYS[i];
      if (isFunction(params[key])) {
        callback[key] = params[key].bind(this);
      }
    }
    if (isFunction(callback.before)) {
      params = callback.before(params, ins, cfg);
    }

    if (params !== false) {
      var timer = void 0;
      if (isFunction(callback.loading)) {
        timer = setTimeout(function () {
          callback.loading(params, ins, cfg);
        }, params.whenToShowLoading);
      }

      var clear = function clear() {
        if (timer) {
          clearTimeout(timer);
          timer = undefined;
        }
      };

      var success = function success(data) {
        if (isFunction(callback.success)) {
          if (isFunction(callback.transform)) {
            data = callback.transform(data, params, ins, cfg);
          }
          var result = callback.success(data, params, ins, cfg);
          return result;
        }
      };

      var cb = function cb(name, data) {
        if (isFunction(callback[name])) {
          return callback[name](data, params, ins, cfg);
        }
      };

      KEYS.forEach(function (key) {
        delete params[key];
      });

      return ins(params).then(function (res) {
        clear();
        var flag = true;
        var data = res.data;
        if (isFunction(callback.verify)) {
          flag = callback.verify(res) !== false;
        }
        if (flag) {
          success(data);
          cb('complete', data); // eslint-disable-line
          return Promise.resolve(data);
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
          cb('complete', err); // eslint-disable-line
          if (customError === true) {
            // 继续传递，自行 .catch 捕获处理
            return Promise.reject(err);
          } else {
            cb('error', err); // eslint-disable-line
            return new Promise(function () {});
          }
        } catch (e) {
          // 非请求造成异常，直接报错
          clear();
          throw error;
        }
      });
    } else {
      return new Promise(function () {});
    }
  }

  for (var key in ins) {
    request[key] = ins[key];
  }

  // 对 request, get, post, delete, put, head, patch 进行处理
  request.request = function (config) {
    return new request(config); // eslint-disable-line
  };
  METHODS.forEach(function (key) {
    request[key] = function (url, config) {
      config = config || {};
      config.method = key.toUpperCase();
      return new request(url, config); // eslint-disable-line
    };
  });

  return request;
}

/**
 * 全局配置
 */
function config(options) {
  for (var key in options) {
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
var domainDefaultConfig = {};
function init(configs) {
  Object.keys(configs).forEach(function (key) {
    var cfg = configs[key];
    if (proxy.hasOwnProperty(key)) {
      throw new Error(key + ' \u4E0D\u80FD\u4F5C\u4E3A\u8BF7\u6C42\u547D\u540D');
    }

    cfg.name = key;
    proxy[key] = proxy(cfg);
    domainDefaultConfig[key] = {};

    proxy[key].config = function (options) {
      domainDefaultConfig[key] = _extends(domainDefaultConfig[key], options);
    };
  });
  return proxy;
}

proxy.config = config;
proxy.init = init;
module.exports = proxy;