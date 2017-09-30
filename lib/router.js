'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.history = undefined;
exports.default = Router;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rr4i = require('rr4i');

var _defaults = require('./defaults');

var _middleware = require('./middleware');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var history = exports.history = null;

function Router(_ref) {
  var _history = _ref.history,
      children = _ref.children,
      others = _objectWithoutProperties(_ref, ['history', 'children']);

  // Add `push`, `replace`, `go`, `goForward` and `goBack` methods to actions.routing,
  // when called, will dispatch the crresponding action provided by react-router-redux.
  _actions.actions.routing = Object.keys(_rr4i.routerActions).reduce(function (memo, action) {
    memo[action] = function () {
      (0, _middleware.dispatch)(_rr4i.routerActions[action].apply(_rr4i.routerActions, arguments));
    };
    return memo;
  }, {});

  // Support for `basename` etc props for Router,
  // see https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md
  if (!_history) {
    _history = createHistory(others);
  }

  exports.history = history = _history;

  // ConnectedRouter will use the store from Provider automatically
  return _react2.default.createElement(
    _rr4i.ConnectedRouter,
    { history: _history },
    children
  );
}

function createHistory(props) {
  var historyMode = _defaults.options.historyMode;


  var historyModes = {
    browser: _rr4i.createBrowserHistory,
    hash: _rr4i.createHashHistory,
    memory: _rr4i.createMemoryHistory
  };

  exports.history = history = historyModes[historyMode](props);

  return history;
}