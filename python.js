"use strict";
/**
 * @fileOverview <title>Pythonic functions for ECMAScript implementations</title>
 * @file $Id$
 * @requires object.js
 *
 * @author (C) 2011-2013 <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
 *
 * @partof PointedEars' JavaScript Extensions (JSX)
 *
 * JSX is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JSX is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSX.  If not, see <http://www.gnu.org/licenses/>.
 */

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

/**
 * @namespace
 */
jsx.python = {
  /**
   * @version
   */
  version:   "$Revision$ ($Date$)",
  copyright: "Copyright \xA9 2011-2013",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://PointedEars.de/scripts/"
};

/**
 * Returns a reference to an <code>Array</code> instance whose
 * items are the numbers from <var>start</var> inclusive to
 * <var>end</var> exclusive using step width <var>step</var>
 * (may be negative).
 *
 * @param {number} start
 * @param {number} end
 * @param {number} step = 1
 * @return {Array}
 */
jsx.python.range = function (start, end, step) {
  var result = [];

  if (!step)
  {
    if (step === 0)
    {
      jsx.throwThis(
        "jsx.InvalidArgumentError", "step argument must not be zero");
    }

    step = 1;
  }

  end = +end;
  step = +step;

  for (var i = +start; (step > 0) ? (i < end) : (i > end); i += step)
  {
    result.push(i);
  }

  return result;
};

/**
 * Returns a reference to an Array instance containing
 * the names of the enumerable properties of another object;
 * returns a reference to a passed Array.
 *
 * @function
 */
jsx.python.list = (function () {
  var _jsx_object = jsx.object;
  var _isArray = _jsx_object.isArray;
  var _hasOwnProperty = _jsx_object._hasOwnProperty;

  /**
   * @param {Object} iterable
   * @return {Array}
   */
  return function (iterable) {
    var result = [];

    if (_isArray(iterable))
    {
      return iterable;
    }

    for (var property in iterable)
    {
      if (_hasOwnProperty(iterable, property))
      {
        result.push(property);
      }
    }

    return result;
  };
}());

/**
 * List comprehension.
 *
 * Returns a reference to an <code>Array</code>
 * instance containing the result of passing each item
 * of <var>list</var> to <var>mapper</var> (or <var>mapper</var>
 * itself if <var>mapper</var> is not a function) for which
 * <var>condition</var> returns a true-value (or all items
 * if <var>condition</var> is a <code>true-value</code> or
 * <code>undefined</code>, and no items if it is another
 * false-value).
 */
jsx.python.list.from = (function () {
  var _jsx_object = jsx.object;
  var _getKeys = _jsx_object.getKeys;
  var _isArray = _jsx_object.isArray;
  var _isObject = _jsx_object.isObject;
  var _range = jsx.python.range;

  /**
   * @param {Function|any} mapper
   * @param {Object} iterable
   * @param {Function|boolean} condition
   * @return {Array}
   */
  return function (mapper, iterable, condition) {
    var result = [];

    var iterableIsArray = _isArray(iterable);
    if (iterableIsArray)
    {
      var len = iterable.length;
      var keys = _range(0, len);
    }
    else
    {
      keys = _isObject(iterable) && _getKeys(iterable);
      len = keys.length;
    }

    var hasCondition = (typeof condition == "function");
    for (var i = 0; i < len; ++i)
    {
      if (iterableIsArray && !(i in iterable))
      {
        continue;
      }

      var key = keys[i];
      var item = iterable[key];

      if (hasCondition)
      {
        var conditionMet = condition(item, key, iterable);
      }
      else
      {
        conditionMet = condition;
      }

      if (!hasCondition || conditionMet)
      {
        if (typeof mapper == "function")
        {
          var value = mapper(item, key, iterable);
        }
        else
        {
          value = mapper;
        }

        result.push(value);
      }
    }

    return result;
  };
}());

/**
 * Returns a reference to an object
 *
 * @param mapping
 * @return {Object}
 */
jsx.python.dict = function (mapping, values) {
  var result = {};

  if (typeof mapping == "undefined")
  {
    return result;
  }

  if (mapping.length)
  {
    if (arguments.length > 1)
    {
      for (var index in mapping)
      {
        result[mapping[index]] = values[index];
      }

      return result;
    }

    var props = mapping[0];
    var vals = mapping[1];
    for (var index2 in props)
    {
      result[props[index2]] = vals[index2];
    }
  }
  else
  {
    for (var name in mapping)
    {
      result[name] = mapping[name];
    }
  }

  return result;
};

/**
 * Build an unordered collection of unique elements.
 */
jsx.python.set = (function () {
  var _jsx = jsx;
  var _jsx_object = _jsx.object;
  var _Map;
  var _getKeys = _jsx_object.getKeys;
  var _isMethod = _jsx_object.isMethod;

  /**
   * @param {Object} iterable
   * @return {Array}
   */
  return function jsx_python_set (iterable) {
    if (!(this instanceof jsx_python_set))
    {
      return new jsx_python_set(iterable);
    }

    if (_isMethod(iterable, "slice"))
    {
      var result = iterable.slice();
    }
    else
    {
      result = [];

      for (var i = 0, keys = _getKeys(iterable), len = keys.length;
           i < len;
           ++i)
      {
        result.push(iterable[keys[i]]);
      }
    }

    /* Prefer more efficient (best case: O(n)) Map approach if possible */
    if (_Map || typeof _jsx.map != "undefined")
    {
      if (!_Map)
      {
        _Map = _jsx.map.Map;
      }

      var map = new _Map();
      for (i = 0, len = result.length; i < len; ++i)
      {
        map.put(result[i], true);
      }

      result = map.keys();
    }
    else
    {
      /* comparisons(n) = (n^2 - n)/2 ~ O(n^2) */
      for (var i = 0, len = result.length; i < len; ++i)
      {
        for (var j = i + 1; j < len; ++j)
        {
          if (result[i] === result[j])
          {
            result.splice(j, 1);
            --j;
            --len;
          }
        }
      }
    }

    this._elements = result;
    this.length = this._elements.length;
  };
}());

jsx.python.set.extend(null, {
  intersection: function (other) {
    if (!(other instanceof jsx.python.set))
    {
      other = new jsx.python.set(other);
    }

    var elements = this._elements;
    elements.sort();
    other.sort();

    var intersection = [];

    /* FIXME: Identical elements need not sort to the same position */
    for (var i = 0, len = elements.length; i < len; ++i)
    {
      var element = elements[i];
      if (element === other[i])
      {
        intersection.push(element);
      }
    }

    return new jsx.python.set(intersection);
  },

  isdisjoint: function (other) {
    return (this.intersection(other).length === 0);
  },

  toArray: function () {
    return this._elements;
  }
});

/**
 * Return an Array of Arrays, where each inner Array contains the i-th
 * element from each of the argument Arrays.  The returned Array is
 * truncated in length to the length of the shortest argument Array.
 *
 * @param {Array} arg1
 * @return {Array}
 */
jsx.python.zip = function (arg1, arg2) {
  var result = [];

  for (var i = 0, len = arguments[0].length; i < len; ++i)
  {
    result[i] = [];

    for (var j = 0, len2 = arguments.length; j < len2; ++j)
    {
      if (arguments[j].length - 1 < i)
      {
        delete result[i];
        break;
      }

      result[i][j] = arguments[j][i];
    }
  }

  return result;
};

/**
 * Extends an Array with elements from another Array.
 *
 * Different from Array.prototype.concat() in that the first Array is modified.
 * To emphasize this, there is no explicit return value (i.e. returns
 * <code>undefined</code>).
 *
 * @param {Array} list1
 *   Array which is to be extended
 * @param {Array} list2
 *   Array which elements should be appended to <var>list1</var>
 */
jsx.python.extend = function (list1, list2) {
  for (var i = 0, len = list2.length; i < len; ++i)
  {
    Array.prototype.push.call(list1, list2[i]);
  }
};