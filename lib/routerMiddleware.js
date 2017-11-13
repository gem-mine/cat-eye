'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routerMiddleware;

var _rr4i = require('rr4i');

var _router = require('./router');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * @credit react-router-redux
                                                                                                                                                                                                     * @see https://github.com/ReactTraining/react-router/blob/master/packages/react-router-redux/modules/middleware.js
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * This is the routerMiddleware from react-router-redux, but to use
                                                                                                                                                                                                     * the global `history` object instead of the passed one.
                                                                                                                                                                                                     */

function routerMiddleware() {
  return function () {
    return function (next) {
      return function (action) {
        if (action.type !== _rr4i.CALL_HISTORY_METHOD) {
          return next(action);
        }

        var _action$payload = action.payload,
            method = _action$payload.method,
            args = _action$payload.args;

        _router.history[method].apply(_router.history, _toConsumableArray(args));
      };
    };
  };
}
module.exports = exports['default'];