import { connect } from 'react-redux';
import model from './model';
import { actions } from './actions';
import render from './render';
import hook from './hook';
import defaults from './defaults';
import request from './request'
import * as ZI from 'zero-immutable';
// import Router from './router';
// import { Route, Redirect, Switch, Prompt, withRouter, Link, NavLink } from 'rr4i';

const { setIn, getIn } = ZI;

export default {
  model,
  actions,
  hook,
  defaults,
  connect,
  render,
  ZI,
  setIn,
  getIn,

  request,

  // Router,
  // Route,
  // Redirect,
  // Switch,
  // Prompt,
  // withRouter,
  // Link,
  // NavLink
};

export {
  model,
  actions,
  hook,
  defaults,
  connect,
  render,
  ZI,
  setIn,
  getIn,
  request,
  // Router,
  // Route,
  // Redirect,
  // Switch,
  // Prompt,
  // withRouter,
  // Link,
  // NavLink
};
