/**
 * @fileOverview <title>Array Library</title>
 * @file $Id$
 *
 * @author (C) 2004-2013 <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
 *
 * @partof PointedEars' JavaScript Extensions (JSX)
 * <pre>
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
 * </pre>
 */

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

if (typeof jsx.array == "undefined")
{
  jsx.array = {};
}

/**
 * @type jsx.array
 * @memberOf __jsx.array
 * @namespace
 */
jsx.array = (/** @constructor */ function () {
  /* Imports */
  var _jsx = jsx;
  var _jsx_object = _jsx.object;
  var _defineProperty = _jsx_object.defineProperty;
  var _getClass = _jsx_object.getClass;
  var _getKeys = _jsx_object.getKeys;
  var _hasOwnProperty = _jsx_object._hasOwnProperty;
  var _isArray = _jsx_object.isArray;
  var _isNativeObject = _jsx_object.isNativeObject;

  /* Constant-like variables */
  var _MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;
  var _isNativeMethod = _jsx_object.isNativeMethod;

  /**
   * @param {Array} a (optional)
   *   Array to which an element should be appended.  Is used instead
   *   of the <code>Array</code> object the function is applied to.
   * @param value (optional)
   * @return {Array}
   *   The changed array.
   */
  function _array_push (a, value)
  {
    if (!_isArray(a) && _isArray(this))
    {
      value = a;
      a = this;
    }

    for (var i = 0, len = arguments.length; i < len; i++)
    {
      a[a.length] = arguments[i];
    }

    return a;
  }

  /**
   * Takes input array <code>a</code> or the <code>Array</code> object
   * it is applied to as method and returns a new <code>Array</code>
   * object with all string elements (optionally all elements regardless
   * of their type) either lowercased or uppercased.
   *
   * @param {Array} a (optional)
   *   Array which elements should be changed.  Is used instead
   *   of the Array object the function is applied to.
   * @param {boolean} bUppercase = false
   *   If <code>false</code> (default), changes the elements to
   *   be all lowercase.  If <code>true</code>, changes them to
   *   be all uppercase.
   * @param {boolean} bConvertNonStrings = false
   *   If <code>false</code> default, changes only the case of
   *   string elements.  If <code>true</code>, converts non-string
   *   elements to <code>string</code> and changes their case.
   * @return {Array}
   *   A copy of <code>a</code> or the Array object with its
   *   elements' value uppercased or lowercased.  If <code>a</code>
   *   has no elements, an empty array is returned.
   */
  function _changeCase (a, bUppercase, bConvertNonStrings) {
    if (!_isArray(a) && _isArray(this))
    {
      bConvertNonStrings = bUppercase;
      bUpperCase = a;
      a = this;
    }

    if (_isArray(a))
    {
      for (var i = 0; i < a.length; i++)
      {
        if (bConvertNonStrings || typeof a[i] == "string")
        {
          if (bUppercase)
          {
            a[i] = String(a[i]).toUpperCase();
          }
          else
          {
            a[i] = String(a[i]).toLowerCase();
          }
        }
      }

      return a;
    }

    return [];
  }

  /**
   * Array index out of range
   *
   * @type jsx.array.RangeError
   * @extends RangeError|jsx.InvalidArgumentError
   * @constructor
   */
  var _RangeError = (
    function (sReason, sGot, sExpected) {
      _jsx.InvalidArgumentError.apply(this, arguments);
    }
  ).extend(
    typeof RangeError == "function"
      ? RangeError
      : _jsx.InvalidArgumentError,
    {
      name: "jsx.array.RangeError"
    });

  /**
   * @param {Object} target
   * @param {Object} traps
   * @return {Proxy}
   */
  function _getProxy (target, traps)
  {
    return jsx.tryThis(
      function () {
        return new Proxy(target, traps);
      },

      function () {
        return jsx.tryThis(
          function () {
            return Proxy.create(target, traps);
          },
          function (e) {
            return jsx.rethrowThis(e);
          }
        );
      }
    );
  }

  /**
   * An <code>Array</code> whose last elements can be accessed
   * by negative index.  This additional functionality requires
   * support for <code>Proxy</code> (ECMAScript Edition 6 “Harmony”
   * proposal); if not available, a regular <code>Array</code>
   * is returned.
   *
   * @constructor
   * @param {int} length
   * @return {jsx.array.Array|Array}
   */
  var _Array = function jsx_array_Array (length) {
    var me = Array.construct(arguments);

    if (typeof Proxy != "undefined")
    {
      return _getProxy(me, {
        "get": function (target, propertyName) {
          var index;
          if (!isNaN(index = parseInt(propertyName, 10)))
          {
            if (index < 0)
            {
              propertyName = target.length + index;
            }
          }

          return target[propertyName];
        },
        "set": function (target, propertyName, value) {
          var index;
          if (!isNaN(index = parseInt(propertyName, 10)))
          {
            if (index < 0)
            {
              propertyName = target.length + index;
            }
          }

          return (target[propertyName] = value);
        }
      });
    }

    return me;
  }.extend(Array, {
    "get": function (propertyName) {
      var index;
      if (!isNaN(index = parseInt(propertyName, 10)))
      {
        if (index < 0)
        {
          propertyName = target.length + index;
        }
      }

      return target[propertyName];
    },

    "set": function (propertyName, value) {
      var index;
      if (!isNaN(index = parseInt(propertyName, 10)))
      {
        if (index < 0)
        {
          propertyName = target.length + index;
        }
      }

      return (target[propertyName] = value);
    }
  });

  /**
   * Array-like object which can hold up to 2<sup>53</sup> elements
   *
   * @function
   * @type jsx.array.BigArray
   * @extends Array
   * @constructor
   */
  var _BigArray = jsx.object.extend(
    /**
     * @type __jsx.array.BigArray
     * @param {Array|Object} src (optional)
     *   Array-like object to be converted
     * @return {jsx.arrayBigArray}
     */
    function jsx_array_BigArray (src) {
      if (!(this instanceof jsx_array_BigArray))
      {
        return jsx_array_BigArray.construct(arguments);
      }

      /**
       * @memberOf __jsx.array.BigArray
       * @private
       */
      var _length = 0;

      /**
       * Sets the real length of this array
       *
       * @param {int} value
       * @throws jsx.array.RangeError
       *   if the value is less than <code>0</code> or
       *   greater than {@link BigArray.MAX_LENGTH}
       */
      this.setLength = function BigArray_setLength (value) {
        if (value < 0 || value > _BigArray.MAX_LENGTH)
        {
          return _jsx.throwThis(_RangeError,
            ["Invalid length", value,
             "0.." + _BigArray.MAX_LENGTH
             + " (2^" + Math.floor(Math.log(_BigArray.MAX_LENGTH) / Math.log(2)) + ")"],
            BigArray_setLength);
        }

        _length = Math.floor(value);

        return this;
      };

      /**
       * Returns the real length of this array
       *
       * @return {int}
       */
      this.getLength = function () {
        return _length;
      };

      /**
       * @memberOf jsx.array.BigArray
       * @name length
       */
      _defineProperty(this, "length", {
        "get": this.getLength,
        "set": this.setLength
      }, "jsx.array.BigArray");

      this.clear();

      var arglen = arguments.length;
      if (arglen > 1)
      {
        for (var i = arglen; i--;)
        {
          this.set(i, arguments[i]);
        }
      }
      else if (arglen == 1)
      {
        var t = typeof src;
        if (t == "number")
        {
          this.setLength(src);
        }
        else
        {
          if (!_isArray(src) && _isNativeObject(src)
              && _getClass(src) != "Object")
          {
            this.set(0, src);
          }
          else
          {
            this.setAll(src);
          }
        }
      }

      if (typeof Proxy != "undefined")
      {
        return _getProxy(this, {
          "get": function (target, propertyName) {
            var index;
            if (!isNaN(index = parseInt(propertyName, 10)))
            {
              this.get(index);
            }

            return target[propertyName];
          },
          "set": function (target, propertyName, value) {
            var index;
            if (!isNaN(index = parseInt(propertyName, 10)))
            {
              this.set(index, value);
            }

            return (target[propertyName] = value);
          }
        });
      }
    },
    {
      /**
       * Maximum number of elements that can be stored in
       * a <code>BigArray</code>. Successor of the greatest
       * integer value that can be used as index.
       *
       * @memberOf jsx.array.BigArray
       */
      MAX_LENGTH: Math.pow(2, 53),

      /**
       * Determines if a value can be used as <code>BigArray</code>
       * index.
       *
       * @param {any} i
       */
      isIndex: function (i) {
        return parseInt(i, 10).toString() == i
          && i > -1 && i < _BigArray.MAX_LENGTH;
      },

      /**
       * Determines if an object is a <code>BigArray</code>.
       *
       * @param {Object} o
       * @return {boolean}
       */
      isInstance: function (o) {
        return o.constructor == _BigArray;
      }
    }
  ).extend(_Array, {
    /**
     * Removes all elements from the array
     *
     * @memberOf jsx.array.BigArray.prototype
     */
    clear: function () {
      for (var i in this)
      {
        if (_BigArray.isIndex(i))
        {
          delete this[i];
        }
      }

      this.setLength(0);
    },

    /**
     * @param {int} index
     * @return {any} the element of this array at <var>index</var>
     */
    "get": function BigArray_get (index) {
      if (arguments.length < 1)
      {
        return jsx.throwThis(jsx.InvalidArgumentError,
          ["Not enough arguments", "", "(int)"],
          BigArray_get);
      }

      if (index < 0)
      {
        index = this.getLength() + Math.ceil(index);
      }
      else
      {
        index = Math.floor(index);
      }

      return this[index];
    },

    /**
     * Sets the element at <var>index</var> to <var>value</var>
     *
     * @param {int} index
     * @param {any} value
     */
    "set": function (index, value) {
      var length = this.getLength();

      if (index < 0)
      {
        index = length + Math.ceil(index);
      }
      else
      {
        index = Math.floor(index);
      }

      if (length < index + 1)
      {
        this.setLength(index + 1);
      }

      this[index] = value;

      return this;
    },

    /**
     * Sets all elements based on another object.
     *
     * @param {Object} src
     *   If an <code>Array</code> or </code>BigArray</code>,
     *   copies all array elements (enumerable properties whose
     *   name is an array index) to this array.
     *   Otherwise, copies all properties with numeric name, from
     *   0 to the name specified by the value of the object's
     *   <code>length</code> property, to this array.
     */
    setAll: function (src) {
      if (_isArray(src) || src instanceof _BigArray)
      {
        for (var i in src)
        {
          if (_BigArray.isIndex(i))
          {
            this.set(i, src[i]);
          }
        }
      }
      else
      {
        for (i = src.length; i--;)
        {
          if (_BigArray.isIndex(i))
          {
            this.set(i, src[i]);
          }
        }
      }
    },

    /**
     * Returns the string representations of this array's
     * elements, separated by another string (representation).
     *
     * @param {String} glue
     *   The separator between the string representations
     * @return {string}
     */
    join: function (glue) {
      var len = this.getLength();
      var _join = [].join;

      if (len <= _MAX_ARRAY_LENGTH)
      {
        return _join.apply(this, arguments);
      }

      if (arguments.length < 1)
      {
        glue = ",";
      }

      var chunks = [];
      var chunk_index = 0;

      for (var i = 0; i < len; ++i)
      {
        var chunk = chunks[chunk_index];
        if (typeof chunk == "undefined")
        {
          chunk = chunks[chunk_index] = [];
        }

        if (chunk.length < _MAX_ARRAY_LENGTH)
        {
          chunk.push(this.get(i))
        }
        else
        {
          chunks[chunk_index++] = _join.apply(chunk, arguments);
        }
      }

      return _join.apply(chunks, arguments);
    },

    /**
     * Returns this <code>BigArray</code> as an {@link Array},
     * with extra indexes if necessary.
     *
     * <em>Note that the returned <code>Array</code>'s {@link Array#length}
     * property does not reflect the highest index in the array if
     * it is greater than the one supported by the implementation
     * for <code>Array</code>s (ES 5.x: 2³²−1).  However, the extra
     * indexes are enumerable.</em>
     *
     * <strong>There is no point in calling this method unless you
     * really need an <code>Array</code>.  The original object
     * inherits from <code>Array.prototype</code>, known methods are
     * overridden if necessary, and all its indexes are enumerable.</strong>
     *
     * @return {Array}
     */
    toArray: function () {
      var a = [];

      /* Speed up addition of elements */
      a.length = Math.min(_MAX_ARRAY_LENGTH, this.getLength());

      for (var i in this)
      {
        if (_BigArray.isIndex(i))
        {
          a[i] = this.get(i);
        }
      }

      return a;
    },

    /**
     * Returns the string representation of this array
     * as a comma-separated list.
     */
    toString: function () {
      return this.join(",");
    }
  });

  return {
    /**
     * @memberOf jsx.array
     */
    version: "0.1.$Rev$",
    copyright: "Copyright \xA9 2004-2013",
    author: "Thomas Lahn",
    email: "js@PointedEars.de",
    path: "http://pointedears.de/scripts/",

    Array: _Array,

    /**
     * @param {string} sMsg (optional)
     * @return {boolean} false
     */
    ArrayError: function(sMsg) {
      alert(
        "array.js "
          + Array.version
          + "\n"
          + Array.copyright
          + "  "
          + Array.author
          + " <"
          + Array.Email
          + ">\n\n"
          + sMsg);
      return false;
    },

    BigArray: _BigArray,
    RangeError: _RangeError,

    /**
     * Splits the array <code>a</code> into several arrays with
     * <code>iSize</code> values in them.
     *
     * @param {Array} a
     *   (optional) Array which should be split.  Is used instead of
     *   the <code>Array</code> instance the function is applied to.
     * @param {Number} iSize
     *   Maximum size of the resulting arrays.
     *   An array of arrays indexed with numbers starting from zero.
     */
    chunk: function (a, iSize) {
      if (!_isArray(a) && _isArray(this))
      {
        iSize = a;
        a = this;
      }

      var arrays = new Array([]);

      var i = 0;
      if (_jsx_object.isMethod(a, "slice"))
      {
        while (i < a.length)
        {
          arrays[arrays.length] = a.slice(i, i + iSize);
          i += iSize;
        }
      }
      else
      {
        var index;
        for (i = 0, index = 0; i < a.length; i++)
        {
          if (arrays[index].length == iSize)
          {
            arrays[++index] = [];
          }

          _array_push(arrays[index], a[i]);
        }
      }
    },

    /**
     * Returns an object using the values of the array <code>a</code>
     * as properties and their frequency in <code>a</code> as values.
     *
     * @param {Array} a
     *   (optional) Array which values should be counted.  Is used
     *   instead of the <code>Array</code> instance the function is
     *   applied to.
     * @return {Object}
     */
    countValues: function (a) {
      if (!_isArray(a) && _isArray(this))
      {
        a = this;
      }

      var o = {};

      for (var i = 0; i < a.length; i++)
      {
        if (typeof o[a[i]] != "undefined")
        {
          o[a[i]]++;
        }
        else
        {
          o[a[i]] = 1;
        }
      }

      return o;
    },

    /**
     * Fills an array with <code>iNumber</code> entries of the value
     * of the <code>value</code> argument, indexes starting at the
     * value of the <code>iStart</code> argument.
     *
     * @param {Array} a
     *   (optional) Array which should be filled.  Is used instead
     *   of the {@link Array} object the function is applied to.
     * @param {Number} iStart
     *   Index where to start filling
     * @param {Number} iNumber
     *   Number of elements to be filled, starting from <code>iStart</code>
     * @param value (optional)
     *   The value the array should be filled with
     * @return {Array} The filled array
     */
    fill: function (a, iStart, iNumber, value) {
      if (!_isArray(a) && _isArray(this))
      {
        a = this;
      }

      if (!_isArray(a))
      {
        a = [];
      }

      for (var i = iStart; i < iStart + iNumber; i++)
      {
        a[i] = value;
      }

      return a;
    },

    /**
     * Returns an array containing all the elements of another
     * array filtered according to a callback function.
     *
     * @param {Function} fCallback
     *   A function accepting a single argument that returns
     *   a value to be interpreted either as <code>true</code>
     *   or <code>false</code>.  If it returns <code>true</code>
     *   for the element of <code>a</code>, that element is
     *   included in the resulting array, otherwise it is not.
     * @param {Array} a (optional)
     *   Array which should be filtered.  Is used instead of the
     *   <code>Array</code> object the function is applied to.
     * @return Array
     */
    filter: function (fCallback, a) {
      if (a)
      {
        /* support for old-style calls */
        if (typeof a == "function")
        {
          if (_isArray(fCallback))
          {
            var tmp = a;
            fCallback = a;
            a = tmp;
          }
          else
          {
            _jsx.throwThis('TypeError');
          }
        }
        else
        {
          /* intentionally generic */
          a = this;
        }
      }

      var len = this.length;

      if (typeof fCallback != "function")
      {
        _jsx.throwThis('TypeError');
      }

      var res = [];

      for (var i = 0; i < len; i++)
      {
        if (i in this)
        {
          /* mozilla.org: in case fCallback mutates `this'(?) */
          var val = this[i];

          if (fCallback.call(a, val, i, this))
          {
            res.push(val);
          }
        }
      }

      return res;
    },

    /**
     * Returns a function that can be used for filtering an {@link Array}
     * by the property values of its elements.
     *
     * @param {Object} filter
     *   Object whose property names are the elements' property
     *   names, and whose property values are the element's property
     *   values to compare against
     * @param {boolean} bStrict = false
     *   If <code>true</code>, perform strict comparison.
     * @return {Function}
     *   The filter function
     * @see jsx.array.filter
     */
    createFilter: function (filter, bStrict) {
      var keys = _getKeys(filter);

      /**
       * @param {any} element
       * @return {boolean}
       */
      return function (element) {
        for (var i = 0, len = keys.length; i < len; ++i)
        {
          var key = keys[i];
          if (bStrict)
          {
            if (element[key] === filter[key])
            {
              return true;
            }
          }
          else
          {
            if (element[key] == filter[key])
            {
              return true;
            }
          }
        }
      };
    },

    /**
     * Removes the last element from an array and returns that
     * element.  This method changes the length of the array, if
     * applied directly to an array object.
     *
     * @param {Array} a (optional)
     *   Array from which the last element should be removed.  Is used
     *   instead of the {@link Array} object the function is
     *   applied to.
     * @return {any}
     *   The element removed from the array changed array.
     */
    pop: function (a) {
      if (!_isArray(a) && _isArray(this))
      {
        a = this;
      }

      var result = null;

      if (a.length > 0)
      {
        result = a[a.length - 1];
        if (_isArray(this))
        {
          this.length = this.length - 1;
        }
      }

      return result;
    },

    push: _array_push,

    /**
     * Takes input array <code>a</code> or the calling <code>Array</code>
     * object and returns a new <code>Array</code> object with the
     * order of the elements reversed.
     *
     * @param {Array} a (optional)
     *   <code>Array</code> object which order of elements should be
     *   reversed.  Is used instead of the calling <code>Array</code>
     *   object.
     * @return {Array}
     *   A copy of <code>a</code> or the calling <code>Array</code>
     *   object with its elements in reverse order.  If <code>a</code>
     *   has no elements, an empty array is returned.
     */
    reverse: function (a) {
      if (!_isArray(a) && _isArray(this))
      {
        a = this;
      }

      var result = [];

      if (_isArray(a))
      {
        for (var i = a.length - 1; i > -1; i--) {result[result.length] = a[i];}
      }

      return result;
    },

    /**
     * Searches an array for a given value and returns
     * the corresponding index or vector if successful.
     *
     * @param needle
     *   Value to be searched for.
     * @param {Array} aHaystack
     *   <code>Array</code> to be searched for.  Is used instead of
     *   the calling <code>Array</code> object.
     * @param {boolean} bStrict (optional)
     *   If <code>true</code> then the function will also check the
     *   types of the <code>needle</code> in the <code>aHaystack</code>.
     * @param {boolean} bDeepSearch (optional)
     *   If <code>true</code>, a deep search, if necessary, will be
     *   performed, i.e. also elements of the array are searched if
     *   they refer to <code>Array</code> objects.  (Note that this
     *   method pays attention to the possibility that an element may
     *   refer to one of its parents, so that infinite recursion is
     *   not performed in this case.  However, this additional check
     *   reduces efficiency as another {@link jsx.array#search()}
     *   must be invoked for every ancestor relationship.  Also
     *   note that this compares only references, not content.
     *   If <code>needle</code> is a reference to an <code>Array</code>
     *   object, it is compared as reference with every single
     *   element, not its content with the content of elements
     *   [that refer to <code>Array</code> objects].)
     * @param {Array} aAncestors (optional)
     *   Used internally by {@linkplain (bDeepSearch) deep search} to refer
     *   to an <code>Array</code> object storing the ancestors of a
     *   "child" array element that refers to an <code>Array</code>
     *   object itself.  Usage prevents infinite recursion, see
     *   <code>bDeepSearch</code>.
     * @param {Array} aResultVector (optional)
     *   Used internally by {@linkplain (bDeepSearch) deep search}
     *   to refer to an <code>Array</code> object storing the
     *   vector of a matching array element that refers to an
     *   <code>Array</code> object itself.
     * @param {number} iLevel (optional)
     *   Used internally by {@linkplain (bDeepSearch) deep search}
     *   to specify the level for index of the coordinate of
     *   <code>aResultVector</code> if there is a match.  The default
     *   level (also used for non-deep searches) is 0 for the
     *   first coordinate of <code>aResultVector</code>.
     * @param {number} index (optional)
     *   Used internally by {@linkplain (bDeepSearch) deep search}
     *   to specify the current index for the coordinate of
     *   <code>aResultVector</code> if there is a match.
     * @return {number}
     *   Without {@linkplain (bDeepSearch) deep search}:
     *     The zero-based index of the first matching element
     *       if <code>needle</code> is found in the array,
     *     -1
     *       otherwise.
     *
     *   With {@linkplain (bDeepSearch) deep search}:
     *     A reference to an Array object indicating the vector of
     *     the first matching element (i.e. its coordinates)
     *       if <code>needle</code> is found in the array,
     *     <code>null</code>
     *       otherwise.
     *
     *   If neither the calling object is an <code>Array</code>
     *   object nor <code>aHaystack</code> is a reference to such:
     *     0 or <code>index</code>
     *       if <code>needle</code> is equal to <code>aHaystack</code>
     *       (<code>bStrict</code> is noted),
     *    -1
     *       otherwise.
     */
    search: function array_search (needle, aHaystack, bStrict, bDeepSearch,
      aAncestors, aResultVector, iLevel, index) {
      var result = -1;

      if (typeof index == "undefined" || index < 0)
      {
        index = 0;
      }

    /*
     array_search(4, [[1, 2, 3], [4, 5, 6], [7, 8, 9]], true, true);

     {0: {0: 1,
          1: 2,
          2: 3},
      1: {0: 4,
          1: 5,
          2: 6},
      2: {0: 7,
          1: 8,
          2: 9}}

     array_search(4, [[1, 2, 3], [4, 5, 6], [7, 8, 9]], true, true) == [1, 0]
     array_search(4, [1, 2, 3], true, true) == null
     array_search(4, [4, 5, 6], true, true) == 0
     array_search(4, [7, 8, 9], true, true) == null
    */

      if (_isArray(aHaystack))
      {
        for (var i = 0; i < aHaystack.length; i++)
        {
          if (bDeepSearch)
          {
            result = null;

            if (!aAncestors)
            {
              aAncestors = [];
            }

            /* avoid dupes */
            if (aAncestors.length == 0
                || aAncestors[aAncestors.length - 1] != aHaystack)
            {
              _array_push(aAncestors, aHaystack);
            }

            if (!aResultVector)
            {
              aResultVector = [];
            }

            if (typeof iLevel == "undefined")
            {
              iLevel = 0;
            }

            /* avoid inf. recursion */
            if (!inArray(aHaystack[i], aAncestors, false))
            {
              var res =
                array_search(
                  needle,
                  aHaystack[i],
                  bStrict,
                  bDeepSearch,
                  aAncestors,
                  aResultVector,
                  iLevel + 1,
                  i);

              if (res != null && res > -1)
              {
                result = aResultVector;
                break;
              }
            }
          }
          else
          {
            if (bStrict)
            {
              eval(
                  'if (aHaystack[i] === needle) {'
                + '  result = i;'
                + '  break;'
                + '}');
            }

            if (aHaystack[i] == needle)
            {
              result = i;
              break;
            }
          }
        }
      }
      else
      {
        if (bStrict)
        {
          eval(
              'if (aHaystack === needle) {'
            + '  if (bDeepSearch) {'
            + '    aResultVector[iLevel - 1] = index;'
            + '  }'
            + '  result = index;'
            + '}');
        }

        if (aHaystack == needle)
        {
          if (bDeepSearch)
          {
            aResultVector[iLevel - 1] = index;
          }
          result = index;
        }
      }

      return result;
    },

    /**
     * @param value
     * @param {Array} a
     *   Array which should be searched.  Is used instead of the
     *   <code>Array</code> object the function is applied to.
     * @param {boolean} bExactMatch
     *   If <code>true</code> then the function will also check the
     *   types of the <code>needle</code> in the <code>aHaystack</code>
     *   (optional).
     * @param {boolean} bDeepSearch = false
     *   If <code>true</code>, a {@linkplain #array_search(bDeepSearch)
     *   deep search}, if necessary, will be performed.
     * @return {boolean}
     *   <code>true</code> if <code>value</code> is an element of
     *   <code>a</code>, <code>false</code> otherwise.
     */
    contains: function (value, a, bExactMatch, bDeepSearch) {
      var result = null;

      if (bDeepSearch)
      {
        result = !!array_search(value, a, bExactMatch, true);
      }
      else
      {
        result = array_search(value, a, bExactMatch, false) > -1;
      }

      return result;
    },

    /**
     * @function
     */
    changeCase: _changeCase,

    /**
     * Takes input array <code>a</code> or the Array object it is
     * applied to as method and returns a new Array object with all
     * string elements (optionally all elements regardless of their
     * type) lowercased.
     *
     * @param {Array} a (optional)
     *   Array which elements should be converted.  Is used instead
     *   of the Array object the function is applied to.
     * @param {boolean} bConvertNonStrings = false
     *   If <code>false</code> (default), changes only the case of
     *   string elements.  If <code>true</code>, converts non-string
     *   elements to <code>string</code> and changes their case.
     * @return {Array}
     *   A copy of <code>a</code> or the Array object with its
     *   elements' value lowercased.  If <code>a</code> has no
     *   elements, an empty array is returned.
     */
    toLowerCase: function (a, bConvertNonStrings) {
      if (!_isArray(a) && _isArray(this))
      {
        bConvertNonStrings = a;
        a = this;
      }

      return _changeCase.call(a, a, false, bConvertNonStrings);
    },

    /**
     * Takes input array <code>a</code> or the Array object it is
     * applied to as method and returns a new Array object with all
     * string elements (optionally all elements regardless of their
     * type) uppercased.
     *
     * @param {Array} a (optional)
     *   Array which elements should be converted.  Is used instead
     *   of the Array object the function is applied to.
     * @param {boolean} bConvertNonStrings = false
     *   If <code>false</code> default, changes only the case of
     *   string elements.  If <code>true</code>, converts non-string
     *   elements to <code>string</code> and changes their case.
     * @return {Array}
     *   A copy of <code>a</code> or the Array object with its
     *   elements' value uppercased.  If <code>a</code> has no
     *   elements, an empty array is returned.
     */
    toUpperCase: function (a, bConvertNonStrings) {
      if (!_isArray(a) && _isArray(this))
      {
        bConvertNonStrings = a;
        a = this;
      }

      return _changeCase.call(a, a, true, bConvertNonStrings);
    },

    /**
     * @function
     */
    splice: (function() {
      if (typeof _jsx.global.array_splice != "undefined")
      {
        return _jsx.global.array_splice;
      }
      else if (typeof Array != "undefined"
               && _jsx_object.isNativeMethod(Array, "prototype", "splice"))
      {
        return function(a, start, del, ins) {
          var proto = Array.prototype;
          ins = proto.slice.call(arguments, 3);
          return proto.splice.apply(a, [start, del].concat(ins));
        };
      }

      return function(a, start, del, ins) {
        var aDeleted = [];

        for (var i = start + del, len = a.length; i < len; i++)
        {
          aDeleted[aDeleted.length] = a[i - del];
          a[i - del] = a[i];
        }

        a.length = len - del;

        for (i = 3, len = arguments.length; i < len; i++)
        {
          a[a.length] = arguments[i];
        }

        return aDeleted;
      };
    }()),

    every: function (callback, thisObject) {
      /* NOTE: Checks for null or undefined */
      if (thisObject == null && _isArray(this))
      {
        thisObject = this;
      }

      if (_isNativeMethod(thisObject, "every"))
      {
        return thisObject.every(callback);
      }

      for (var i = 0, len = thisObject.length; i < len; i++)
      {
        if (!callback(thisObject[i]))
        {
          return false;
        }
      }

      return true;
    },

    equals: function (otherObject, thisObject, strict) {
      /* NOTE: Check for null or undefined */
      if (thisObject == null && _isArray(this))
      {
        thisObject = this;
      }

      if (thisObject.length != otherObject.length)
      {
        return false;
      }

      for (var i = 0, len = thisObject.length; i < len; ++i)
      {
        if (strict)
        {
          if (thisObject[i] !== otherObject[i])
          {
            return false;
          }
        }
        else
        {
          if (thisObject[i] != otherObject[i])
          {
            return false;
          }
        }
      }

      return true;
    },

    /**
     * Returns an {@link Array} from which all duplicates
     * have been removed.
     *
     * NOTE: Warns and falls back to {@link #uniqStr()} if
     * {@link jsx.map.Map()} is unavailable.
     *
     * @function
     */
    uniq: (function () {
      var _Map;

      /**
       * @param {Object} thisObject
       *   The object to operate on.  Is used instead of the calling
       *   object if this method is called as a method of an
       *   {@link Array}.
       */
      return function (thisObject) {
        /* NOTE: Check for null or undefined */
        if (thisObject == null && _isArray(this))
        {
          thisObject = this;
        }

        if (!_Map)
        {
          _Map = jsx.object.getFeature(jsx, "map", "Map");
          if (!_Map)
          {
            jsx.warn("jsx.array.uniq(): jsx.map.Map N/A, falling back to jsx.array.uniqStr()");
            return jsx.array.uniqStr(thisObject);
          }
        }

        var condensed = new _Map();

        for (var i = 0, len = thisObject.length; i < len; ++i)
        {
          if (_hasOwnProperty(thisObject, i))
          {
            condensed.put(thisObject[i], true);
          }
        }

        return condensed.getKeys();
      };
    }()),

    /**
     * Returns an {@link Array} from which all {@link String}
     * duplicates have been removed.
     *
     * This method is more efficient than {@link #uniq} if you
     * can be sure that either all elements are string values
     * or their string representations can be compared.  However,
     * different to <code>uniq()</code>, the order of the
     * resulting elements is implementation-dependent.
     *
     * @param {Object} thisObject
     *   The object to operate on.  Is used instead of the calling
     *   object if this method is called as a method of an
     *   {@link Array}.
     */
    uniqStr: function (thisObject) {
      /* NOTE: Check for null or undefined */
      if (thisObject == null && _isArray(this))
      {
        thisObject = this;
      }

      var condensed = jsx.object.getDataObject();

      for (var i = 0, len = thisObject.length; i < len; ++i)
      {
        if (_hasOwnProperty(thisObject, i))
        {
          condensed[thisObject[i]] = true;
        }
      }

      return _getKeys(condensed);
    },

    /**
     * Returns a function that can be used for sorting an {@link Array}.
     *
     * @author (C) 2013 Thomas 'PointedEars' Lahn &lt;js@PointedEars.de&gt;
     */
    createComparator: (function () {
      var _isObject = _jsx_object.isObject;

      /**
       * @param {Array} aKeys
       *   Array of keys that should be sorted by, in order.
       *   A key may be a {@link string} value or a native object.
       *   If it is a <code>string</code>, it specifies the property name
       *   of the sort key.  If it is another native object, the following
       *   of its properties are used as options.  See the <var>options</var>
       *   parameter for the default values of these options.
       *   <table>
       *     <tr>
       *       <th><code>key</code></th>
       *       <td>The name of the property of the elements whose values
       *           should be sorted by (sort values).  If this option is
       *           not present or a false-value, the element values are
       *           used as sort values.</td>
       *     </tr>
       *     <tr>
       *       <th><code>callback</code></th>
       *       <td>A reference to the <code>Function</code> whose
       *           return value, when passed the current sort value,
       *           defines the new sort value.</td>
       *     </tr>
       *     <tr>
       *       <th><code>constructor</code></th>
       *       <td>A reference to the <code>Function</code> whose
       *           return value when passed the current sort value
       *           and called as a constructor, defines the new
       *           sort value.  This is useful if data can be converted
       *           to an object whose <code>toString</code> or
       *           <code>valueOf</code> methods can return a
       *           valid sort value.  If both <code>callback</code>
       *           and <code>constructor</code> are specified, the
       *           return value of the callback is passed to
       *           the constructor.</td>
       *     </tr>
       *     <tr>
       *       <th><code>comparator</code></th>
       *       <td>A reference to the <code>Function</code> that
       *           should be passed the first and second current
       *           sort values and whose return value defines
       *           the relation between the first and second sort
       *           value.  If the return value is not (loosely) equal
       *           to 0 or if the key is the last key, its return
       *           value is returned.  Otherwise the subsequent
       *           sort values are compared.</td>
       *     </tr>
       *     <tr>
       *       <th><code>descending</code></th>
       *       <td>If a true-value, the sort order for this key
       *           is descending.</td>
       *     </tr>
       *     <tr>
       *       <th><code>numeric</code></th>
       *       <td>If a true-value, the sort values are compared as if
       *           both of them were <code>Number</code> values.</td>
       *     </tr>
       *     <tr>
       *       <th><code>strict</code></th>
       *       <td>If a true-value, the sort values are sorted
       *           using the <code>===</code> operator.</td>
       *     </tr>
       *   </table>
       * @param {Object} options (optional)
       *   Default sort options.  The following properties are used:
       *   <table>
       *     <tr>
       *       <th><code>callback</code></th>
       *       <td>A reference to the <code>Function</code> whose
       *           return value, when passed the current sort value,
       *           defines the new sort value.  The factory default
       *           is not to use a callback.</td>
       *     </tr>
       *     <tr>
       *       <th><code>constructor</code></th>
       *       <td>A reference to the <code>Function</code> whose
       *           return value when passed the current sort value
       *           and called as a constructor, defines the new
       *           sort value.  The factory default is not to use
       *           a constructor.</td>
       *     </tr>
       *     <tr>
       *       <th><code>comparator</code></th>
       *       <td>A reference to the <code>Function</code> that
       *           should be passed the first and second current
       *           sort values and whose return value defines
       *           the relation between the first and second sort
       *           value.  The factory default is not to use a
       *           special sort value comparator.</td>
       *     </tr>
       *     <tr>
       *       <th><code>descending</code></th>
       *       <td>If a true-value, the default sort order is
       *           descending.  The factory default is ascending.</td>
       *     </tr>
       *     <tr>
       *       <th><code>numeric</code></th>
       *       <td>If a true-value, by default the sort values are compared
       *           as if they were <code>Number</code> values.  The factory
       *           default is a generic comparison that uses the operators
       *           <code>==</code> (non-strict) or <code>===</code>
       *           (strict), and <code>&lt;</code>, and <code>></code>.</td>
       *     </tr>
       *     <tr>
       *       <th><code>strict</code></th>
       *       <td>If a true-value, use strict comparison by default.
       *           The factory default is non-strict comparison.</td>
       *     </tr>
       *   </table>
       * @return {Function}
       */
      function _createComparator (aKeys, options)
      {
        if (aKeys == null || !_isArray(aKeys))
        {
          aKeys = [aKeys];
        }

        if (options == null || !_isObject(options))
        {
          options = {};
        }

        return function (el1, el2) {
          for (var i = 0, len = aKeys.length; i < len; ++i)
          {
            var key = aKeys[i];
            var propertyName = ((key == null || typeof key.valueOf() == "string")
              ? key
              : key.key);

            var el1Value = (propertyName != null ? el1[propertyName] : el1);
            var el2Value = (propertyName != null ? el2[propertyName] : el2);

            if (key && typeof key.callback == "function")
            {
              el1Value = key.callback(el1Value);
              el2Value = key.callback(el2Value);
            }
            else if (typeof options.callback == "function")
            {
              el1Value = options.callback(el1Value);
              el2Value = options.callback(el2Value);
            }

            if (key && _hasOwnProperty(key, "constructor"))
            {
              el1Value = new key.constructor(el1Value);
              el2Value = new key.constructor(el2Value);
            }
            else if (_hasOwnProperty(options, "constructor"))
            {
              el1Value = new options.constructor(el1Value);
              el2Value = new options.constructor(el2Value);
            }

            var isLastKey = (i == len - 1);
            var hasKeySpecificComparator = (typeof key.comparator == "function");
            if (hasKeySpecificComparator
                || (typeof options.comparator == "function"))
            {
              var comparatorResult = (hasKeySpecificComparator
                ? key.comparator(el1Value, el2Value)
                : options.comparator(el1Value, el2Value));

              if (isLastKey || comparatorResult != 0)
              {
                return comparatorResult;
              }

              continue;
            }

            var equals = ((key && key.strict) || (options.strict)
              ? (el1Value === el2Value)
              : (el1Value == el2Value));

            if (equals)
            {
              if (isLastKey)
              {
                /* last key, same value */
                return 0;
              }
            }
            else
            {
              var descending = ((key && key.descending) || options.descending);

              return ((key && key.numeric) || options.numeric
                ? (descending
                    ? el2Value - el1Value
                    : el1Value - el2Value)
                : (descending
                    ? (el1Value > el2Value ? -1 : 1)
                    : (el1Value < el2Value ? -1 : 1)));
            }
          }
        };
      }

      return _createComparator;
    }())
  };
}());

//jsx.array.docURL = jsx.array.path + "array.htm";

if (jsx.options.augmentPrototypes)
{
  jsx.object.extend(Array.prototype, {
    /**
     * @memberOf Array.prototype
     */
    chunk:            jsx.array.chunk,
    changeCase:       jsx.array.changeCase,
    contains:         jsx.array.contains,
    countValues:      jsx.array.countValues,
    equals:           jsx.array.equals,
    fill:             jsx.array.fill,
    filter:           jsx.array.filter,
    pop:              jsx.array.pop,
    push:             jsx.array.push,
    reverse:          jsx.array.reverse,
    search:           jsx.array.search,
    splice:           jsx.array.splice,
    toLowerCase:      jsx.array.toLowerCase,
    toUpperCase:      jsx.array.toUpperCase,
    uniq:             jsx.array.uniq,
    uniqStr:          jsx.array.uniqStr,

    /* JavaScript 1.6 (1.5 in Gecko 1.8b2 and later) emulation */
    every:            jsx.array.every,

    /* TODO */
    iterate: function () {
      var a = [];

      for (var i = 0, len = this.length; i < len; i++)
      {
        a.push(this[i]);
      }

      return a;
    }
  });
}