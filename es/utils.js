import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from 'react';
export function renderElement(renderer, props) {
  if (React.isValidElement(renderer)) {
    return React.cloneElement(renderer, props);
  } else if (typeof renderer === 'function') {
    if (renderer.prototype && renderer.prototype.isReactComponent) {
      return React.createElement(renderer, props);
    } else if (renderer.defaultProps) {
      return renderer(_objectSpread({}, renderer.defaultProps, {}, props));
    }

    return renderer(props);
  } else {
    return null;
  }
}
export function normalizeColumns(elements) {
  var columns = [];
  React.Children.forEach(elements, function (element) {
    if (React.isValidElement(element) && element.key) {
      var column = _objectSpread({}, element.props, {
        key: element.key
      });

      columns.push(column);
    }
  });
  return columns;
}
export function isObjectEqual(objA, objB) {
  if (objA === objB) return true;
  if (objA === null && objB === null) return true;
  if (objA === null || objB === null) return false;
  if (typeof objA !== 'object' || typeof objB !== 'object') return false;
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    var key = keysA[i];
    var valueA = objA[key];
    var valueB = objB[key];
    if (typeof valueA !== typeof valueB) return false;
    if (typeof valueA === 'function') continue;

    if (typeof valueA === 'object') {
      if (!isObjectEqual(valueA, valueB)) return false;else continue;
    }

    if (valueA !== valueB) return false;
  }

  return true;
}
export function callOrReturn(funcOrValue) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return typeof funcOrValue === 'function' ? funcOrValue.apply(void 0, args) : funcOrValue;
}
export function hasChildren(data) {
  return Array.isArray(data.children) && data.children.length > 0;
}
export function unflatten(array, rootId, dataKey, parentKey) {
  if (rootId === void 0) {
    rootId = null;
  }

  if (dataKey === void 0) {
    dataKey = 'id';
  }

  if (parentKey === void 0) {
    parentKey = 'parentId';
  }

  var tree = [];
  var childrenMap = {};
  var length = array.length;

  for (var i = 0; i < length; i++) {
    var item = _objectSpread({}, array[i]);

    var id = item[dataKey];
    var parentId = item[parentKey];

    if (Array.isArray(item.children)) {
      childrenMap[id] = item.children.concat(childrenMap[id] || []);
    } else if (!childrenMap[id]) {
      childrenMap[id] = [];
    }

    item.children = childrenMap[id];

    if (parentId !== undefined && parentId !== rootId) {
      if (!childrenMap[parentId]) childrenMap[parentId] = [];
      childrenMap[parentId].push(item);
    } else {
      tree.push(item);
    }
  }

  return tree;
}
export function flattenOnKeys(tree, keys, depthMap, dataKey) {
  if (depthMap === void 0) {
    depthMap = {};
  }

  if (dataKey === void 0) {
    dataKey = 'id';
  }

  if (!keys || !keys.length) return tree;
  var array = [];
  var keysSet = new Set();
  keys.forEach(function (x) {
    return keysSet.add(x);
  });
  var stack = [].concat(tree);
  stack.forEach(function (x) {
    return depthMap[x[dataKey]] = 0;
  });

  var _loop = function _loop() {
    var item = stack.shift();
    array.push(item);

    if (keysSet.has(item[dataKey]) && Array.isArray(item.children) && item.children.length > 0) {
      stack = [].concat(item.children, stack);
      item.children.forEach(function (x) {
        return depthMap[x[dataKey]] = depthMap[item[dataKey]] + 1;
      });
    }
  };

  while (stack.length > 0) {
    _loop();
  }

  return array;
} // Babel7 changed the behavior of @babel/plugin-transform-spread in https://github.com/babel/babel/pull/6763
// [...array] is transpiled to array.concat() while it was [].concat(array) before
// this change breaks immutable array(seamless-immutable), [...array] should always return mutable array

export function cloneArray(array) {
  if (!Array.isArray(array)) return [];
  return [].concat(array);
}
export function noop() {}
export function toString(value) {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return value.toString ? value.toString() : '';
}

function getPathSegments(path) {
  var pathArray = path.split('.');
  var parts = [];

  for (var i = 0; i < pathArray.length; i++) {
    var p = pathArray[i];

    while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
      p = p.slice(0, -1) + '.';
      p += pathArray[++i];
    }

    parts.push(p);
  }

  return parts;
} // changed from https://github.com/sindresorhus/dot-prop/blob/master/index.js


export function getValue(object, path, defaultValue) {
  if (object === null || typeof object !== 'object' || typeof path !== 'string') {
    return defaultValue;
  }

  var pathArray = getPathSegments(path);

  for (var i = 0; i < pathArray.length; i++) {
    if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i])) {
      return defaultValue;
    }

    object = object[pathArray[i]];

    if (object === undefined || object === null) {
      if (i !== pathArray.length - 1) {
        return defaultValue;
      }

      break;
    }
  }

  return object;
} // copied from https://30secondsofcode.org/function#throttle

export function throttle(fn, wait) {
  var inThrottle, lastFn, lastTime;
  return function () {
    var context = this,
        args = arguments;

    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function () {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
} // copied from https://github.com/react-bootstrap/dom-helpers

var scrollbarSize;
export function getScrollbarSize(recalculate) {
  if (!scrollbarSize && scrollbarSize !== 0 || recalculate) {
    if (typeof window !== 'undefined' && window.document && window.document.createElement) {
      var scrollDiv = document.createElement('div');
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';
      document.body.appendChild(scrollDiv);
      scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }

  return scrollbarSize;
}
export function addClassName(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!el.className.match(new RegExp("(?:^|\\s)" + className + "(?!\\S)"))) {
      el.className += " " + className;
    }
  }
}
export function removeClassName(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp("(?:^|\\s)" + className + "(?!\\S)", 'g'), '');
  }
}
//# sourceMappingURL=utils.js.map