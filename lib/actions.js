'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = undefined;
exports.addActions = addActions;
exports.resolveReducers = resolveReducers;

var _middleware = require('./middleware');

var _defaults = require('./defaults');

var SEP = '/';

// 存放所有的 action，此 action 非 redux action 存放结构如下： {namespace: {actionName:
// actionCreator}}
var actions = exports.actions = {};

function addActions(modelName) {
  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var effects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // 在 actions 中挂载命名空间
  if (Object.keys(reducers).length || Object.keys(effects).length) {
    actions[modelName] = actions[modelName] || {};
  }

  // 把 reducers 挂到 actions 中对应的命名空间里
  each(reducers, function (actionName) {
    // A single-argument function, whose argument is the payload data of a normal
    // redux action, and also the `data` param of corresponding method defined in
    // model.reducers.
    actions[modelName][actionName] = actionCreator(modelName, actionName);
  });

  // 把 effects 也挂载到 actions 中对应的命名空间里
  var scope = {
    actions: actions[modelName],
    getState: function getState() {
      return (0, _middleware.getState)()[modelName];
    }
  };

  each(effects, function (effectName) {
    if (actions[modelName][effectName]) {
      throw new Error('Action name "' + effectName + '" has been used! Please select another name as effect name!');
    }

    // 放入 全局的 effects 缓存 dispatch(action) 时过中间件，会检查 全局 effects 中是否存在，如果存在，则执行
    _defaults.options.addEffect('' + modelName + SEP + effectName, effects[effectName].bind(scope));

    // Effect is like normal action, except it is handled by mirror middleware
    actions[modelName][effectName] = actionCreator(modelName, effectName);
  });
}

/**
 * 把某个 model 的 reducers 汇集成一个 object 输出
 * object 格式为：
 *    key: ${modelName}${SEP}${reducer的key}
 *    value: 对应的 reducer 的 value，是个 function(){}
 * @param {String} modelName
 * @param {Object<String, function>} reducers
 */
function resolveReducers(modelName) {
  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return Object.keys(reducers).reduce(function (acc, cur) {
    acc['' + modelName + SEP + cur] = reducers[cur];
    return acc;
  }, {});
}

function each(obj, callback) {
  Object.keys(obj).forEach(callback);
}

/**
 * action 生成器
 * 返回一个 function(data) {}，执行该函数将 dispatch action
 * @param {String} modelName 命名空间，是 model 的 name 字段
 * @param {String} actionName action name，是 model 中 reduces 或者 effects 的 key
 */
function actionCreator(modelName, actionName) {
  return function (data) {
    return (0, _middleware.dispatch)({ type: '' + modelName + SEP + actionName, data: data });
  };
}