'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _defaults = require('./defaults');

var _model = require('./model');

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var started = false;
var Root = void 0;

function render(component, container, callback) {
  var initialState = _defaults.options.initialState,
      middlewares = _defaults.options.middlewares,
      reducers = _defaults.options.reducers;


  if (started) {

    // If app has rendered, do `store.replaceReducer` to update store.
    (0, _store.replaceReducer)(_store.store, _model.models, reducers);

    // Call `render` without arguments means *re-render*. Since store has updated,
    // `component` will automatically be updated, so no need to `ReactDOM.render` again.
    if (arguments.length === 0) {
      return Root;
    }
  } else {
    (0, _store.createStore)(_model.models, reducers, initialState, middlewares);
  }

  // Use named function get a proper displayName
  Root = function Root() {
    return _react2.default.createElement(
      _reactRedux.Provider,
      { store: _store.store },
      component
    );
  };

  started = true;

  global.document && _reactDom2.default.render(_react2.default.createElement(Root, null), container, callback);

  return Root;
}