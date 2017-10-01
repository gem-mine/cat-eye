'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createStore = createStore;
exports.replaceReducer = replaceReducer;

var _redux = require('redux');

var _rr4i = require('rr4i');

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _routerMiddleware = require('./routerMiddleware');

var _routerMiddleware2 = _interopRequireDefault(_routerMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var store = exports.store = void 0;

function createStore(models, reducers, initialState) {
  var middlewares = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  var middleware = _redux.applyMiddleware.apply(undefined, [(0, _routerMiddleware2.default)()].concat(_toConsumableArray(middlewares), [(0, _middleware2.default)()]));

  var enhancers = [middleware];

  var composeEnhancers = _redux.compose;

  if (process.env.NODE_ENV !== 'production') {
    // Redux devtools extension support.
    if (global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }
  }

  var reducer = createReducer(models, reducers);
  var enhancer = composeEnhancers.apply(undefined, enhancers);

  exports.store = store = (0, _redux.createStore)(reducer, initialState, enhancer);

  return store;
}

function replaceReducer(store, models, reducers) {
  var reducer = createReducer(models, reducers);
  store.replaceReducer(reducer);
}

function createReducer(models, reducers) {
  var modelReducers = models.reduce(function (acc, cur) {
    acc[cur.name] = cur.reducer;
    return acc;
  }, {});

  return (0, _redux.combineReducers)(_extends({}, reducers, modelReducers, {
    routing: _rr4i.routerReducer
  }));
}