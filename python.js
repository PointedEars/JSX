/**
 * @fileOverview <title>Pythonic functions for ECMAScript implementations</title>
 * @file $Id$
 * @requires object.js
 * 
 * @author (C) 2011, 2012 <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
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
  copyright: "Copyright \xA9 2011, 2012",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://PointedEars.de/scripts/"
};

/**
 * Returns a reference to an Array instance containing
 * the names of the enumerable properties of another object;
 * returns a reference to a passed Array.
 * 
 * @function
 * @param iterable : Object
 * @return {Array}
 */
jsx.python.list = (function () {
  var jsx_object = jsx.object;
  var _getClass = jsx_object.getClass;
  var _hasOwnProperty = jsx_object._hasOwnProperty;

  /**
   * @return {Array}
   */
  return function (iterable) {
    var result = [];
    
    if (_getClass(iterable) == "Array")
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
 * of <var>list</var> to <var>builder</var> (or the item
 * if <var>builder</var> is a false-value) for which
 * <var>condition</var> returns a true-value (or all items
 * if <var>condition</var> is a false-value).
 * 
 * @param builder : Function
 * @param iterable : Object
 * @param condition : Function
 * @return {Array}
 */
jsx.python.list.from = (function () {
  var jsx_object = jsx.object;
  var _getClass = jsx_object.getClass;
  var _hasOwnProperty = jsx_object._hasOwnProperty;
  
  return function (builder, iterable, condition) {
    var result = [];
    
    if (_getClass(iterable) == "Array")
    {
      result = iterable;
    }
    else
    {
      for (var property in iterable)
      {
        if (_hasOwnProperty(iterable, property))
        {
          result.push(property);
        }
      }
    }
  
    if (condition)
    {
      result = result.filter(condition);
    }
  
    if (builder)
    {
      result = result.map(builder);
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
 * Returns a reference to an <code>Array</code> instance whose
 * items are the numbers from <var>start</var> inclusive to
 * <var>end</var> exclusive using step width <var>step</var>
 * (may be negative).
 *
 * @param start : Number
 * @param end : Number
 * @param step : optional Number = 1
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
 * Build an unordered collection of unique elements.
 * 
 * @param iterable : Object
 * @return {Array}
 */
jsx.python.set = (function () {
  var jsx_object = jsx.object;
  var isMethod = jsx_object.isMethod;

  return function (iterable) {
    var result = [];
    
    if (isMethod(iterable, "slice"))
    {
      result = iterable.slice();
    }
    else
    {
      for (var prop in iterable)
      {
        result.push(iterable[prop]);
      }
    }
    
    for (i = 0, len = result.length; i < len; ++i)
    {
      for (var j = i + 1, max = Math.floor(Math.sqrt(len)); j < max; ++j)
      {
        if (result[i] === result[j])
        {
          delete result[j];
          --j;
          --max;
          --len;
        }
      }
    }
    
    return result;
  };
}());

/**
 * Return an Array of Arrays, where each inner Array contains the i-th
 * element from each of the argument Arrays.  The returned Array is
 * truncated in length to the length of the shortest argument Array.
 *
 * @param arg1 : Array
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
 * @param list1 : Array which is to be extended
 * @param list2 : Array which elements should be appended to <var>list1</var>
 */
jsx.python.extend = function (list1, list2) {
  for (var i = 0, len = list2.length; i < len; ++i)
  {
    Array.prototype.push.call(list1, list2[i]);
  }
};