'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = exports.Routes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.urlFor = urlFor;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rr4i = require('rr4i');

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// 缓存拍扁的路由
var _routers = {};
// 缓存拍扁的子路由
var _sub = {
  __root__: [] // 根的子路由
};

// 添加路由
function add(item) {
  // key: 路由别名
  // path: 路由路径
  // component: 对应组件
  // description: 可选，说明
  // permission: 可选，需要权限验证的提供一个function，返回 true 表示通过验证，否则返回一个无权限的 Component
  var key = item.key,
      path = item.path,
      component = item.component,
      description = item.description,
      permission = item.permission;

  if (path === undefined) {
    console.warn('router: ' + key + ' ' + description + ' miss path config');
  }

  _sub.__root__.push(item);
  _routers[key] = item;
  parseSub(item);
}

function parseSub(parent) {
  var sub = parent.sub;
  if (sub) {
    var arr = [];
    Object.keys(sub).forEach(function (key) {
      var item = sub[key];
      item.path = ('' + parent.path + item.path).replace(/\/\//g, '/');
      item.key = parent.key + '.' + key;
      arr.push(item);
      _routers[item.key] = item;
      parseSub(item);
    });
    _sub[parent.key] = arr;
  }
}

var Permission = function Permission(receiveProps) {
  var Component = receiveProps.component,
      permission = receiveProps.permission,
      rest = _objectWithoutProperties(receiveProps, ['component', 'permission']);

  return _react2.default.createElement(_rr4i.Route, _extends({}, rest, {
    render: function render(props) {
      var path = props.match.path;

      var p = void 0;
      if (typeof permission === 'function') {
        p = permission(receiveProps);
      } else {
        p = true;
      }
      if (p === true) {
        // 合法
        return _react2.default.createElement(Component, props);
      } else {
        // 不合法
        if (p) {
          // 验证函数返回Component，直接显示
          return p;
        }
        return _react2.default.createElement(
          'div',
          null,
          'permission denied'
        );
      }
    }
  }));
};

var Routes = exports.Routes = function Routes(props) {
  var path = props.path,
      mapStateToProps = props.mapStateToProps,
      children = props.children;

  return _react2.default.createElement(
    _rr4i.Switch,
    null,
    router.get(path, mapStateToProps),
    children
  );
};

var router = exports.router = {
  get: function get(path, mapStateToProps) {
    var rs = void 0;
    var result = [];
    var PermissionRoute = (0, _connect2.default)(mapStateToProps)(Permission);
    if (path) {
      rs = _sub[path];
    } else {
      rs = _sub.__root__;
    }

    if (rs && rs.length) {
      result = result.concat(rs.map(function (route) {
        var rest = _extends({}, route);
        if (rest.sub) {
          delete rest.exact;
        }
        return _react2.default.createElement(PermissionRoute, _extends({}, rest, { key: rest.key }));
      }));
    }
    return result;
  },

  // 路由统一注册入口
  register: function register(items) {
    Object.keys(items).forEach(function (key) {
      var item = items[key];
      item.key = key;
      add(item);
    });
  },

  Routes: Routes,
  log: function log() {
    if (console && console.table) {
      console.table(_routers);
    }
  }
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
        prefix = item.prefix,
        pattern = item.pattern;

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