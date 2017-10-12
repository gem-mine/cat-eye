'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactRedux = require('react-redux');

function smart(mapStateToProps, mapDispatchToProps) {
  return (0, _reactRedux.connect)(function (state, ownProps) {
    return mapStateToProps(state, ownProps);
  }, null, function (stateProps, dispatchProps, ownProps) {
    if (mapDispatchToProps) {
      return _extends({}, stateProps, dispatchProps, mapDispatchToProps(stateProps), ownProps);
    }
    return _extends({}, stateProps, dispatchProps, ownProps);
  });
}

exports.default = smart;