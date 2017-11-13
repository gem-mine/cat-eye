'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.options = undefined;
exports.default = defaults;

var _effects = require('./effects');

var options = exports.options = {
  // global initial state
  // state: undefined,

  // Should be one of ['browser', 'hash', 'memory']
  // Learn more: https://github.com/ReactTraining/history/blob/master/README.md
  historyMode: 'hash',

  // A list of the standard Redux middleware
  middlewares: [],

  // `options.reducers` will be directly handled by `combineReducers`,
  // so reducers defined here must be standard Redux reducer:
  //
  // reducers: {
  //   add: (state, action) => {}
  // }
  //
  reducers: {},

  // An overwrite of the existing effect handler
  addEffect: (0, _effects.addEffect)(_effects.effects)

};

var historyModes = ['browser', 'hash', 'memory'];
var isObject = function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]';
};

function defaults() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var historyMode = opts.historyMode,
      middlewares = opts.middlewares,
      reducers = opts.reducers,
      addEffect = opts.addEffect;


  if (historyMode && !historyModes.includes(historyMode)) {
    throw new Error('historyMode "' + historyMode + '" is invalid, must be one of ' + historyModes.join(', ') + '!');
  }

  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error('middlewares "' + middlewares + '" is invalid, must be an Array!');
  }

  if (reducers && !isObject(reducers)) {
    throw new Error('middlewares "' + reducers + '" is invalid, must be an Object!');
  }

  if (addEffect) {
    if (typeof addEffect !== 'function' || typeof addEffect({}) !== 'function') {
      throw new Error('addEffect "' + addEffect + '" is invalid, must be a function that returns a function');
    } else {
      // create effects handler with initial effects object
      opts.addEffect = opts.addEffect(_effects.effects);
    }
  }

  Object.keys(opts).forEach(function (key) {
    options[key] = opts[key];
  });
}