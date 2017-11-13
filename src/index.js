import { connect } from 'react-redux';
import model from './model';
import smart from './connect';
import { actions } from './actions';
import render from './render';
import hook from './hook';
import defaults from './defaults';
import request from './request';
import * as ZI from 'zero-immutable';
import Router from './router';
import * as rr from 'rr4i';
import queryString from './queryString';
import { urlFor, router } from './routerHelper';
import pathToRegexp from 'path-to-regexp';
const { Route, Redirect, Switch, Prompt, withRouter, Link, NavLink } = rr;
const { setIn, getIn } = ZI;

export default {
  model,
  actions,
  hook,
  defaults,
  connect,
  smart,
  render,
  ZI,
  setIn,
  getIn,

  request,

  rr,
  Router,
  Route,
  Redirect,
  Switch,
  Prompt,
  withRouter,
  Link,
  NavLink,

  queryString,
  pathToRegexp,
  urlFor,
  router
};

export {
  model,
  actions,
  hook,
  defaults,
  connect,
  smart,
  render,
  ZI,
  setIn,
  getIn,
  request,
  rr,
  Router,
  Route,
  Redirect,
  Switch,
  Prompt,
  withRouter,
  Link,
  NavLink,
  queryString,
  pathToRegexp,
  urlFor,
  router
};
