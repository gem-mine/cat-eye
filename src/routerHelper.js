import React from 'react';
import { Route, Switch, Redirect } from 'rr4i';
import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import smart from './connect';

// 缓存拍扁的路由
const _routers = {};
// 缓存拍扁的子路由
const _sub = {
  __root__: [] // 根的子路由
};

// 添加路由
function add(item) {
  // key: 路由别名
  // path: 路由路径
  // component: 对应组件
  // description: 可选，说明
  // permission: 可选，需要权限验证的提供一个function，返回 true 表示通过验证，否则返回一个无权限的 Component
  const { key, path, component, description, permission } = item;
  if (path === undefined) {
    console.warn(`router: ${key} ${description} miss path config`);
  }

  _sub.__root__.push(item);
  _routers[key] = item;
  parseSub(item);
}

function parseSub(parent) {
  const sub = parent.sub;
  if (sub) {
    const arr = [];
    Object.keys(sub).forEach(key => {
      const item = sub[key];
      item.path = `${parent.path}${item.path}`.replace(/\/\//g, '/');
      item.key = `${parent.key}.${key}`;
      arr.push(item);
      _routers[item.key] = item;
      parseSub(item);
    });
    _sub[parent.key] = arr;
  }
}

const Permission = receiveProps => {
  const { component: Component, permission, ...rest } = receiveProps;
  return (
    <Route
      {...rest}
      render={props => {
        const path = props.match.path;

        let p;
        if (typeof permission === 'function') {
          p = permission(receiveProps);
        } else {
          p = true;
        }
        if (p === true) {
          // 合法
          return <Component {...props} />;
        } else {
          // 不合法
          if (p) {
            // 验证函数返回Component，直接显示
            return p;
          }
          return <div>permission denied</div>;
        }
      }}
    />
  );
};

export const Routes = props => {
  const { path, mapStateToProps, children } = props;
  return (
    <Switch>
      {router.get(path, mapStateToProps)}
      {children}
    </Switch>
  );
};

export const router = {
  get(path, mapStateToProps) {
    let rs;
    let result = [];
    const PermissionRoute = smart(mapStateToProps)(Permission);
    if (path) {
      rs = _sub[path];
    } else {
      rs = _sub.__root__;
    }

    if (rs && rs.length) {
      result = result.concat(
        rs.map(route => {
          const rest = { ...route };
          if (rest.sub) {
            delete rest.exact;
          }
          return <PermissionRoute {...rest} key={rest.key} />;
        })
      );
    }
    return result;
  },
  // 路由统一注册入口
  register(items) {
    Object.keys(items).forEach(key => {
      const item = items[key];
      item.key = key;
      add(item);
    });
  },
  Routes,
  getFlat() {
    return _routers;
  }
};

/**
 * 解析 url
 * @param {String} key，对应路由定义中的 key
 * @param {Object} params 参数列表，url中有的替换，没有的作为查询参数
 */
export function urlFor(key, params) {
  const router = _routers[key];
  if (!router) {
    console.warn(`router: ${key} not register`);
    return '';
  }

  const { path } = router;
  if (!params) {
    return path;
  }

  const keys = [];
  pathToRegexp(path, keys);

  let url = path;
  const temp = {};
  keys.forEach(item => {
    const { name, prefix, pattern } = item;
    if (params.hasOwnProperty(name)) {
      url = url.replace(new RegExp(`${prefix}(:${name})\\/?`, 'g'), function(str, match) {
        return str.replace(match, params[name]);
      });
      temp[name] = true;
    } else {
      console.error(`${path}: ${name} missing value`);
    }
  });

  const obj = {};
  Object.keys(params).forEach(key => {
    if (!temp.hasOwnProperty(key)) {
      obj[key] = params[key];
    }
  });

  const c = url.indexOf('?') > -1 ? '&' : '?';

  url = `${url}${c}${queryString.stringify(obj)}`;
  return url;
}
