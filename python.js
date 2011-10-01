/**
 * Python functions for ECMAScript implementations
 * 
 * @requires object.js
 */

if (typeof jsx == "undefined")
{
  var jsx = {};
}

jsx.python = {
  /**
   * @version
   */
  version:   "$Revision: $ ($Date: $)",
  copyright: "Copyright \xA9 2011",
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
 */
jsx.python.list = (function() {
  var jsx_object = jsx.object;
  var getClass = jsx_object.getClass;
  var _hasOwnProperty = jsx_object._hasOwnProperty;

  /**
   * @return {Array}
   */
  return function(iterable) {
    var result = [];
    
    if (getClass(iterable) == "Array")
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
 * Returns a reference to an object
 * 
 * @param mapping
 * @returns {Object}
 */
jsx.python.dict = function(mapping, values) {
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
 * 
 * @param list : Object
 * @returns {Array}
 */
jsx.python.set = function(list) {
  var result = [];
  
  for (var prop in list)
  {
    result.push(list[prop]);
  }
  
  for (var i = 0, len = result.length; i < len; ++i)
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

/**
 * Return an Array of Arrays, where each inner Array contains the i-th
 * element from each of the argument Arrays.  The returned Array is
 * truncated in length to the length of the shortest argument Array.
 *
 * @param arg1 : Array
 * @returns {Array}
 */
jsx.python.zip = function(arg1, arg2) {
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
 * Different from Array.prototype.concat() in that the Array is modified.
 * 
 * @param list1 : Array which is to be extended
 * @param list2 : Array which elements should be appended to <var>list1</var>
 */
jsx.python.extend = function(list1, list2) {
  for (var elem in list2)
  {
    Array.prototype.push.call(list1, list2[elem]);
  }

};