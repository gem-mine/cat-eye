'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = exports.urlFor = exports.pathToRegexp = exports.queryString = exports.NavLink = exports.Link = exports.withRouter = exports.Prompt = exports.Switch = exports.Redirect = exports.Route = exports.Router = exports.rr = exports.request = exports.getIn = exports.setIn = exports.ZI = exports.render = exports.smart = exports.connect = exports.defaults = exports.hook = exports.actions = exports.model = undefined;

var _reactRedux = require('react-redux');

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

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

var rr = _interopRequireWildcard(_rr4i);

var _queryString = require('./queryString');

var _queryString2 = _interopRequireDefault(_queryString);

var _routerHelper = require('./routerHelper');

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Route = rr.Route,
    Redirect = rr.Redirect,
    Switch = rr.Switch,
    Prompt = rr.Prompt,
    withRouter = rr.withRouter,
    Link = rr.Link,
    NavLink = rr.NavLink;
var setIn = ZI.setIn,
    getIn = ZI.getIn;
exports.default = {
  model: _model2.default,
  actions: _actions.actions,
  hook: _hook2.default,
  defaults: _defaults2.default,
  connect: _reactRedux.connect,
  smart: _connect2.default,
  render: _render2.default,
  ZI: ZI,
  setIn: setIn,
  getIn: getIn,

  request: _request2.default,

  rr: rr,
  Router: _router2.default,
  Route: Route,
  Redirect: Redirect,
  Switch: Switch,
  Prompt: Prompt,
  withRouter: withRouter,
  Link: Link,
  NavLink: NavLink,

  queryString: _queryString2.default,
  pathToRegexp: _pathToRegexp2.default,
  urlFor: _routerHelper.urlFor,
  router: _routerHelper.router
};
exports.model = _model2.default;
exports.actions = _actions.actions;
exports.hook = _hook2.default;
exports.defaults = _defaults2.default;
exports.connect = _reactRedux.connect;
exports.smart = _connect2.default;
exports.render = _render2.default;
exports.ZI = ZI;
exports.setIn = setIn;
exports.getIn = getIn;
exports.request = _request2.default;
exports.rr = rr;
exports.Router = _router2.default;
exports.Route = Route;
exports.Redirect = Redirect;
exports.Switch = Switch;
exports.Prompt = Prompt;
exports.withRouter = withRouter;
exports.Link = Link;
exports.NavLink = NavLink;
exports.queryString = _queryString2.default;
exports.pathToRegexp = _pathToRegexp2.default;
exports.urlFor = _routerHelper.urlFor;
exports.router = _routerHelper.router;