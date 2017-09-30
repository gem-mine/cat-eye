'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getState = exports.dispatch = undefined;
exports.default = createMiddleware;

var _effects = require('./effects');

var _hook = require('./hook');

function warning() {
  throw new Error('You are calling "dispatch" or "getState" without applying mirrorMiddleware! ' + 'Please create your store with mirrorMiddleware first!');
}

var dispatch = exports.dispatch = warning;

var getState = exports.getState = warning;

// 只在 store.js 中被使用
function createMiddleware() {
  return function (middlewareAPI) {
    exports.dispatch = dispatch = middlewareAPI.dispatch;
    exports.getState = getState = middlewareAPI.getState;

    return function (next) {
      return function (action) {
        var effectResult = void 0;
        // 异步的话这里其实只是为了最终能到 reducer，日志中能看到 dispatch，并无实际作用
        var result = next(action);

        // 处理 effects
        if (typeof _effects.effects[action.type] === 'function') {
          effectResult = _effects.effects[action.type](action.data, getState);
        }

        _hook.hooks.forEach(function (hook) {
          return hook(action, getState);
        });

        return effectResult || result;
      };
    };
  };
}