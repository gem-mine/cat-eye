import { connect } from 'react-redux'
import axios from 'axios'
import model from './model'
import smart from './connect'
import { actions } from './actions'
import render from './render'
import hook from './hook'
import defaults from './defaults'
import request from './request'
import * as ZI from 'zero-immutable'
import Router from './router'
import * as rr from 'rr4i'
import queryString from 'gem-mine-qs'
import { urlFor, router, Routes } from './routerHelper'
import { store } from './middleware'
import pathToRegexp from 'path-to-regexp'
const { Route, Redirect, Switch, Prompt, withRouter, Link, NavLink } = rr
const { setIn, getIn } = ZI
const getState = function () {
  return store.getState()
}

export default {
  model,
  actions,
  hook,
  defaults,
  connect,
  smart,
  render,
  getState,
  ZI,
  setIn,
  getIn,

  axios,
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
  router,
  Routes
}

export {
  model,
  actions,
  hook,
  defaults,
  connect,
  smart,
  render,
  getState,
  ZI,
  setIn,
  getIn,

  axios,
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
  router,
  Routes
}
