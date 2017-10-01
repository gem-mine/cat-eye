'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavLink = exports.Link = exports.withRouter = exports.Prompt = exports.Switch = exports.Redirect = exports.Route = exports.Router = exports.rr = exports.request = exports.getIn = exports.setIn = exports.ZI = exports.render = exports.connect = exports.defaults = exports.hook = exports.actions = exports.model = undefined;

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

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _rr4i = require('rr4i');

var _rr4i2 = _interopRequireDefault(_rr4i);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  request: _request2.default,

  rr: _rr4i2.default,
  Router: _router2.default,
  Route: _rr4i.Route,
  Redirect: _rr4i.Redirect,
  Switch: _rr4i.Switch,
  Prompt: _rr4i.Prompt,
  withRouter: _rr4i.withRouter,
  Link: _rr4i.Link,
  NavLink: _rr4i.NavLink
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
exports.rr = _rr4i2.default;
exports.Router = _router2.default;
exports.Route = _rr4i.Route;
exports.Redirect = _rr4i.Redirect;
exports.Switch = _rr4i.Switch;
exports.Prompt = _rr4i.Prompt;
exports.withRouter = _rr4i.withRouter;
exports.Link = _rr4i.Link;
exports.NavLink = _rr4i.NavLink;