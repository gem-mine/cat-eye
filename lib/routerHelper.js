'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = exports.Routes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.urlFor = urlFor;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rr4i = require('rr4i');

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _queryString = require('./queryString');

var _queryString2 = _interopRequireDefault(_queryString);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ROOT = '__root__';

// 缓存拍扁的路由信息
var _routers = {};
// 缓存拍扁的子路由
var _sub = _defineProperty({}, ROOT, []);
// 缓存 config
var _config = {
  components: {
    NotFound: function NotFound(props) {
      return _react2.default.createElement(
        'div',
        null,
        '404 not found'
      );
    },
    Forbidden: function Forbidden(props) {
      return _react2.default.createElement(
        'div',
        null,
        '403 forbidden'
      );
    }
  }
};

function parseRedirect(route) {
  var to = route.redirect;
  // 有子路由的不处理 redirect，防止是跳转进入子路由引起死循环
  if (!route.sub && to) {
    if ((typeof to === 'undefined' ? 'undefined' : _typeof(to)) === 'object') {
      to = urlFor(to.key, to.params);
    } else {
      var t = _routers[to];
      if (t) {
        to = t.path;
      } else {
        console.warn('route ' + route.redirect + ' not exist, redirect fail, please check route config');
      }
    }
    if (to) {
      if (route.path !== to) {
        return _react2.default.createElement(_rr4i.Redirect, { exact: true, from: route.path, to: to, key: route.key });
      }
    }
  }
}

/**
 * 添加一个路由
 */
function add(parent, items) {
  var keyPath = '';
  var pathPrefix = '';
  if (parent) {
    if (parent.keyPath) {
      keyPath = parent.keyPath + '.' + parent.key;
    } else {
      keyPath = parent.key;
    }
    if (parent.path && parent.path !== '/') {
      pathPrefix = parent.path;
    }
  }
  Object.keys(items).forEach(function (key) {
    var item = items[key];
    item.key = key;
    item.keyPath = keyPath;
    if (item.path) {
      item.path = ('' + pathPrefix + item.path).replace(/\/\/|\/$/g, '') || '/';
    } else {
      item.path = '/';
      if (item.component) {
        item.exact = true;
      }
    }
    var subKey = ROOT;
    if (parent) {
      item.parent = parent;
      var kp = getParentKeyPath(keyPath);
      // 祖先存在是子路由, 应往最近的具有子路由的祖先中添加
      if (kp) {
        subKey = kp;
      }
    }
    _sub[subKey].push(item);
    var selfPath = keyPath ? keyPath + '.' + item.key : item.key;
    _routers[selfPath] = item;

    if (item.index) {
      var target = _extends({}, item);
      delete target.index;
      if (item.component) {
        target.path = pathPrefix || '/';
        target.exact = true;
      } else if (item.redirect) {
        target = {
          key: item.parent.key,
          path: item.parent.path,
          redirect: item.redirect
        };
      }
      _sub[subKey].push(target);
    }

    // 具有子路由
    if (item.sub) {
      _sub[selfPath] = [];
      add(item, item.sub);
    }
    // 具有子模块
    if (item.module) {
      add(item, item.module);
    }
  });
}

function getParentKeyPath(keyPath) {
  var arr = keyPath.split('.');
  var i = arr.length;
  var p = void 0;
  while (i >= 0) {
    var key = arr.slice(0, i).join('.');
    p = _sub[key];
    if (p) {
      return key;
    }
    i -= 1;
  }
  return false;
}

var Permission = function Permission(receiveProps) {
  var Component = receiveProps.component,
      permission = receiveProps.permission,
      rest = _objectWithoutProperties(receiveProps, ['component', 'permission']);

  return _react2.default.createElement(_rr4i.Route, _extends({}, rest, {
    render: function render(props) {
      var p = receiveProps;
      var arr = [];
      while (p) {
        if (typeof p.permission === 'function') {
          arr.push(p.permission);
        }
        p = p.parent;
      }

      var flag = true;
      for (var i = 0; i < arr.length; i++) {
        flag = arr[i](receiveProps);
        if (flag !== true) {
          break;
        }
      }
      if (flag === true) {
        // 合法
        return _react2.default.createElement(Component, props);
      } else {
        // 不合法
        if (flag) {
          // 验证函数返回Component，直接显示
          return flag;
        }
        return _react2.default.createElement(_config.components.Forbidden, props);
      }
    }
  }));
};

/**
 * 解析 url
 * @param {String} key，对应路由定义中的 key
 * @param {Object} params 参数列表，url中有的替换，没有的作为查询参数
 */
function urlFor(key, params) {
  var router = _routers[key];
  if (!router) {
    console.warn('router: ' + key + ' not register');
    return '';
  }

  var path = router.path;

  if (!params) {
    return path;
  }

  var keys = [];
  (0, _pathToRegexp2.default)(path, keys);

  var url = path;
  var temp = {};
  keys.forEach(function (item) {
    var name = item.name,
        prefix = item.prefix;

    if (params.hasOwnProperty(name)) {
      url = url.replace(new RegExp(prefix + '(:' + name + ')\\/?', 'g'), function (str, match) {
        return str.replace(match, params[name]);
      });
      temp[name] = true;
    } else {
      console.error(path + ': ' + name + ' missing value');
    }
  });

  var obj = {};
  Object.keys(params).forEach(function (key) {
    if (!temp.hasOwnProperty(key)) {
      obj[key] = params[key];
    }
  });

  var c = url.indexOf('?') > -1 ? '&' : '?';

  url = '' + url + c + _queryString2.default.stringify(obj);
  return url;
}

var Routes = exports.Routes = function Routes(props) {
  var path = props.path,
      children = props.children; // eslint-disable-line

  var rs = void 0;
  var mapStateToProps = props.mapStateToProps; // eslint-disable-line
  if (!mapStateToProps) {
    mapStateToProps = _config.mapStateToProps;
  }
  var PermissionRoute = (0, _connect2.default)(mapStateToProps)(Permission);
  if (path) {
    rs = _sub[path];
  } else {
    rs = _sub.__root__;
  }

  if (rs && rs.length) {
    var routes = [];
    var redirects = [];

    rs.forEach(function (route) {
      if (route) {
        if (route.redirect) {
          redirects.push(parseRedirect(route));
        } else if (route.component) {
          routes.push(_react2.default.createElement(PermissionRoute, _extends({}, route, { key: route.key })));
        }
      }
    });

    return _react2.default.createElement(
      _rr4i.Switch,
      null,
      routes,
      redirects,
      children,
      _react2.default.createElement(_rr4i.Route, { component: _config.components.NotFound })
    );
  }
};

var router = exports.router = {
  // 配置
  config: function config(params) {
    var mapStateToProps = params.mapStateToProps,
        components = params.components;

    _config.mapStateToProps = mapStateToProps;
    if (components) {
      var NotFound = components.NotFound,
          Forbidden = components.Forbidden;

      if (NotFound) {
        _config.components.NotFound = NotFound;
      }
      if (Forbidden) {
        _config.components.Forbidden = Forbidden;
      }
    }
  },

  // 路由统一注册入口
  register: function register(keyPath, items, isSub) {
    if ((typeof keyPath === 'undefined' ? 'undefined' : _typeof(keyPath)) === 'object') {
      items = keyPath;
      keyPath = '';
    }
    var parent = _routers[keyPath];

    add(parent, items);
  },

  Routes: Routes,
  getFlat: function getFlat() {
    return _routers;
  }
};