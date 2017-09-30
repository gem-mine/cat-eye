'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = exports.getIn = exports.setIn = exports.ZI = exports.render = exports.connect = exports.defaults = exports.hook = exports.actions = exports.model = undefined;

var _reactRedux = require('react-redux');

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _actions = require('./actions');

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _hook = require('./hook');

var _hook2 = _interopRequireDefault(_hook);

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _zeroImmutable = require('zero-immutable');

var ZI = _interopRequireWildcard(_zeroImmutable);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Router from './router';
// import { Route, Redirect, Switch, Prompt, withRouter, Link, NavLink } from 'rr4i';

var setIn = ZI.setIn,
    getIn = ZI.getIn;
exports.default = {
  model: _model2.default,
  actions: _actions.actions,
  hook: _hook2.default,
  defaults: _defaults2.default,
  connect: _reactRedux.connect,
  render: _render2.default,
  ZI: ZI,
  setIn: setIn,
  getIn: getIn,

  request: _request2.default

  // Router,
  // Route,
  // Redirect,
  // Switch,
  // Prompt,
  // withRouter,
  // Link,
  // NavLink
};
exports.model = _model2.default;
exports.actions = _actions.actions;
exports.hook = _hook2.default;
exports.defaults = _defaults2.default;
exports.connect = _reactRedux.connect;
exports.render = _render2.default;
exports.ZI = ZI;
exports.setIn = setIn;
exports.getIn = getIn;
exports.request = _request2.default;