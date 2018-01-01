'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.models = undefined;
exports.default = model;

var _actions = require('./actions');

var _zeroImmutable = require('zero-immutable');

var models = exports.models = [];

function model(m) {
  m = validateModel(m);
  if (!m.reducers) {
    m.reducers = {};
  }
  // 为所有 model 的 reducer 注入 setField 方法，这样 可以使用 actions[name].setField
  m.reducers.setField = function (data, getState) {
    return (0, _zeroImmutable.setIn)(this.getState(), data);
  };

  var reducer = getReducer((0, _actions.resolveReducers)(m.name, m.reducers), m.state);

  var _model = {
    name: m.name,
    reducer: reducer
  };

  models.push(_model);

  // 挂到 actions 和 effects
  (0, _actions.addActions)(m.name, m.reducers, m.effects);

  return _model;
}

function validateModel() {
  var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var name = m.name,
      reducers = m.reducers,
      effects = m.effects;


  var isObject = function isObject(target) {
    return Object.prototype.toString.call(target) === '[object Object]';
  };

  if (!name || typeof name !== 'string') {
    throw new Error('Model name must be a valid string!');
  }

  if (name === 'routing') {
    throw new Error('Model name can not be "routing", it is used by react-router-redux!');
  }

  if (models.some(function (item) {
    return item.name === name;
  })) {
    throw new Error('Model "' + name + '" has been created, please select another name!');
  }

  if (reducers !== undefined && !isObject(reducers)) {
    throw new Error('Model reducers must be a valid object!');
  }

  if (effects !== undefined && !isObject(effects)) {
    throw new Error('Model effects must be a valid object!');
  }

  m.reducers = filterReducers(reducers);
  m.effects = filterReducers(effects);

  return m;
}

/**
 * 生成了 redux 中标准的 reducer（就是switch分支的那个函数）
 * @param {Object} reducers
 * @param {Object} initialState
 */
// If initialState is not specified, then set it to null
function getReducer(reducers) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    if (typeof reducers[action.type] === 'function') {
      return reducers[action.type](state, action.data);
    }
    return state;
  };
}

/**
 * 过滤 reducers 或 effects，去掉值非 function 的
 * @param {Object} reducers
 */
function filterReducers(reducers) {
  if (!reducers) {
    return reducers;
  }

  return Object.keys(reducers).reduce(function (acc, action) {
    // Filter out non-function entries
    if (typeof reducers[action] === 'function') {
      acc[action] = reducers[action];
    }
    return acc;
  }, {});
}