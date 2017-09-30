"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Registry of namespaced effects
var effects = exports.effects = {};

var addEffect = exports.addEffect = function addEffect(effects) {
  return function (name, handler) {
    effects[name] = handler;
  };
};