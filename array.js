/**
 * @fileOverview <title>Array Library</title>
 * @file $Id$
 *
 * @author (C) 2004-2013 <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
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

if (typeof jsx.array == "undefined")
{
  /**
   * @namespace
   */
  jsx.array = {};
}

jsx.array.version = "0.1.$Rev$";
jsx.array.copyright = "Copyright \xA9 2004-2013";
jsx.array.author = "Thomas Lahn";
jsx.array.email = "js@PointedEars.de";
jsx.array.path = "http://pointedears.de/scripts/";
// jsx.array.docURL = jsx.array.path + "array.htm";

if (typeof jsx.array.emulate == "undefined")
{
  jsx.array.emulate = false;
}

/**
 * @param sMsg
 * @return boolean false
 */
jsx.array.ArrayError = function(/** @argument optional string */ sMsg) {
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
};

/**
 * Splits the array <code>a</code> into several arrays with
 * <code>iSize</code> values in them.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param a : optional Array
 *   Array which should be split.  Is used instead of the
 *   <code>Array</code> object the function is applied to.
 * @param iSize : number
 *   Maximum size of the resulting arrays.
 *   An array of arrays indexed with numbers starting from zero.
 */
jsx.array.chunk = (function () {
  var _isArray = jsx.object.isArray;

  return function (a, iSize) {
    if (!_isArray(a) && _isArray(this))
    {
      iSize = a;
      a = this;
    }

    var arrays = new Array(new Array());

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
          arrays[++index] = new Array();
        }

        jsx.array.push(arrays[index], a[i]);
      }
    }
  };
}());

/**
 * Returns an object using the values of the array <code>a</code>
 * as properties and their frequency in <code>a</code> as values.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param a : optional Array
 *   Array which values should be counted.  Is used instead of
 *   the <code>Array</code> object the function is applied to.
 * @return Object
 */
jsx.array.countValues = (function () {
  var _isArray = jsx.object.isArray;

  return function (a) {
    if (!_isArray(a) && _isArray(this))
    {
      a = this;
    }

    var o = new Object();

    for (var i = 0; i < a.length; i++)
    {
      if (typeof o[a[i]] != "undefined"){o[a[i]]++;} else {o[a[i]] = 1;}
    }

    return o;
  };
}());

/**
 * Fills an array with <code>iNumber</code> entries of the value
 * of the <code>value</code> argument, indexes starting at the
 * value of the <code>iStart</code> argument.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param a : optional Array
 *   Array which should be filled.  Is used instead of the
 *   {@link Array} object the function is applied to.
 * @param iStart : number
 *   Index where to start filling.
 * @param iNumber : number
 *   Number of elements to be filled, starting from <code>iStart</code>.
 * @param value : optional *
 * @type Array
 * @return The filled array.
 */
jsx.array.fill = (function () {
  var _isArray = jsx.object.isArray;

  return function (a, iStart, iNumber, value) {
    if (!_isArray(a) && _isArray(this))
    {
      a = this;
    }

    if (!jsx.object.isArray(a))
    {
      a = new Array();
    }

    for (var i = iStart; i < iStart + iNumber; i++)
    {
      a[i] = value;
    }

    return a;
  };
}());

/**
 * Returns an array containing all the elements of <code>a</code>
 * filtered according a callback function <code>fCallback</code>.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param fCallback : Function
 *   A function accepting a single argument that returns
 *   a value to be interpreted either as <code>true</code>
 *   or <code>false</code>.  If it returns <code>true</code>
 *   for the element of <code>a</code>, that element is
 *   included in the resulting array, otherwise it is not.
 * @param a : optional Array
 *   Array which should be filtered.  Is used instead of the
 *   <code>Array</code> object the function is applied to.
 * @return Array
 */
jsx.array.filter = (function () {
  var _isArray = jsx.object.isArray;

  return function (fCallback, a) {
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
          jsx.throwThis('TypeError');
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
      jsx.throwThis('TypeError');
    }

    var res = new Array();

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
  };
}());

/**
 * Removes the last element from an array and returns that
 * element.  This method changes the length of the array, if
 * applied directly to an array object.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param a : optional Array
 *   Array from which the last element should be removed.  Is used
 *   instead of the {@link Array} object the function is
 *   applied to.
 * @return
 *   The element removed from the array changed array.
 */
jsx.array.pop = (function () {
  var _isArray = jsx.object.isArray;

  return function (a) {
    if (!_isArray(a) && _isArray(this))
    {
      a = this;
    }

    var result = null;

    if (a.length > 0)
    {
      result = a[a.length - 1];
      if (jsx.object.isArray(this))
      {
        this.length = this.length - 1;
      }
    }

    return result;
  };
}());

/**
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param a : optional Array
 *   Array which should be added an element.  Is used instead
 *   of the <code>Array</code> object the function is applied to.
 * @param value : optional *
 * @return type Array
 *   The changed array.
 */
jsx.array.push = (function () {
  var _isArray = jsx.object.isArray;

  return function (a, value) {
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
  };
}());

/**
 * Takes input array <code>a</code> or the calling <code>Array</code>
 * object and returns a new <code>Array</code> object with the
 * order of the elements reversed.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param a : optional Array
 *   <code>Array</code> object which order of elements should be
 *   reversed.  Is used instead of the calling <code>Array</code>
 *   object.
 * @return type Array
 *   A copy of <code>a</code> or the calling <code>Array</code>
 *   object with its elements in reverse order.  If <code>a</code>
 *   has no elements, an empty array is returned.
 */
jsx.array.reverse = (function () {
  var _isArray = jsx.object.isArray;

  return function (a) {
    if (!_isArray(a) && _isArray(this))
    {
      a = this;
    }

    var result = new Array();

    if (jsx.object.isArray(a))
    {
      for (var i = a.length - 1; i > -1; i--) {result[result.length] = a[i];}
    }

    return result;
  };
}());

/**
 * Searches an array for a given value and returns
 * the corresponding index or vector if successful.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param needle
 *   Value to be searched for.
 * @param aHaystack : Array
 *   <code>Array</code> to be searched for.  Is used instead of
 *   the calling <code>Array</code> object.
 * @param bStrict : optional boolean
 *   If <code>true</code> then the function will also check the
 *   types of the <code>needle</code> in the <code>aHaystack</code>.
 * @param bDeepSearch : optional boolean
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
 * @param aAncestors : optional Array
 *   Used internally by {@linkplain (bDeepSearch) deep search} to refer
 *   to an <code>Array</code> object storing the ancestors of a
 *   "child" array element that refers to an <code>Array</code>
 *   object itself.  Usage prevents infinite recursion, see
 *   <code>bDeepSearch</code>.
 * @param aResultVector : optional Array
 *   Used internally by {@linkplain (bDeepSearch) deep search}
 *   to refer to an <code>Array</code> object storing the
 *   vector of a matching array element that refers to an
 *   <code>Array</code> object itself.
 * @param iLevel : optional number
 *   Used internally by {@linkplain (bDeepSearch) deep search}
 *   to specify the level for index of the coordinate of
 *   <code>aResultVector</code> if there is a match.  The default
 *   level (also used for non-deep searches) is 0 for the
 *   first coordinate of <code>aResultVector</code>.
 * @param index : optional number
 *   Used internally by {@linkplain (bDeepSearch) deep search}
 *   to specify the current index for the coordinate of
 *   <code>aResultVector</code> if there is a match.
 * @type number
 * @return
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
jsx.array.search = (function () {
  var _isArray = jsx.object.isArray;

  return function array_search (needle, aHaystack, bStrict, bDeepSearch,
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
            aAncestors = new Array();
          }

          /* avoid dupes */
          if (aAncestors.length == 0
              || aAncestors[aAncestors.length - 1] != aHaystack)
          {
            array_push(aAncestors, aHaystack);
          }

          if (!aResultVector)
          {
            aResultVector = new Array();
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
  };
}());

/**
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param value : *
 * @param a : Array
 *   Array which should be searched.  Is used instead of the
 *   <code>Array</code> object the function is applied to.
 * @param bExactMatch : optional boolean
 *   If <code>true</code> then the function will also check the
 *   types of the <code>needle</code> in the <code>aHaystack</code>.
 * @param bDeepSearch : optional boolean
 *   If <code>true</code>, a {@linkplain #array_search(bDeepSearch)
 *   deep search}, if necessary, will be performed.
 * @return type boolean
 *   <code>true</code> if <code>value</code> is an element of
 *   <code>a</code>, <code>false</code> otherwise.
 */
jsx.array.contains = function (value, a, bExactMatch, bDeepSearch) {
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
};

/**
 * Takes input array <code>a</code> or the <code>Array</code> object
 * it is applied to as method and returns a new <code>Array</code>
 * object with all string elements (optionally all elements regardless
 * of their type) either lowercased or uppercased.
 *
 * @author
 *   (C) 2004, 2008 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   jsx.object#isArray()
 * @param a : optional Array
 *   Array which elements should be changed.  Is used instead
 *   of the Array object the function is applied to.
 * @param bUppercase : optional boolean = false
 *   If <code>false</code> (default), changes the elements to
 *   be all lowercase.  If <code>true</code>, changes them to
 *   be all uppercase.
 * @param bConvertNonStrings : optional boolean = false
 *   If <code>false</code> default, changes only the case of
 *   string elements.  If <code>true</code>, converts non-string
 *   elements to String and changes their case.
 * @return type Array
 *   A copy of <code>a</code> or the Array object with its
 *   elements' value uppercased or lowercased.  If <code>a</code>
 *   has no elements, an empty array is returned.
 */
jsx.array.changeCase = (function () {
  var _isArray = jsx.object.isArray;

  return function (a, bUppercase, bConvertNonStrings) {
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

    return new Array();
  };
}());

/**
 * Takes input array <code>a</code> or the Array object it is
 * applied to as method and returns a new Array object with all
 * string elements (optionally all elements regardless of their
 * type) lowercased.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   #array_changeCase()
 * @param a : optional Array
 *   Array which elements should be converted.  Is used instead
 *   of the Array object the function is applied to.
 * @param bConvertNonStrings : optional boolean = false
 *   If <code>false</code> default, changes only the case of
 *   string elements.  If <code>true</code>, converts non-string
 *   elements to String and changes their case.
 * @return Array
 *   A copy of <code>a</code> or the Array object with its
 *   elements' value lowercased.  If <code>a</code> has no
 *   elements, an empty array is returned.
 */
jsx.array.toLowerCase = (function () {
  var _isArray = jsx.object.isArray;

  return function (a, bConvertNonStrings) {
    if (!_isArray(a) && _isArray(this))
    {
      bConvertNonStrings = a;
      a = this;
    }

    return jsx.array.changeCase.call(a, a, false, bConvertNonStrings);
  };
}());

/**
 * Takes input array <code>a</code> or the Array object it is
 * applied to as method and returns a new Array object with all
 * string elements (optionally all elements regardless of their
 * type) uppercased.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   #array_changeCase()
 * @param a : optional Array
 *   Array which elements should be converted.  Is used instead
 *   of the Array object the function is applied to.
 * @param bConvertNonStrings : optional boolean = false
 *   If <code>false</code> default, changes only the case of
 *   string elements.  If <code>true</code>, converts non-string
 *   elements to String and changes their case.
 * @return type Array
 *   A copy of <code>a</code> or the Array object with its
 *   elements' value uppercased.  If <code>a</code> has no
 *   elements, an empty array is returned.
 */
jsx.array.toUpperCase = (function () {
  var _isArray = jsx.object.isArray;

  return function (a, bConvertNonStrings) {
    if (!_isArray(a) && _isArray(this))
    {
      bConvertNonStrings = a;
      a = this;
    }

    return jsx.array.changeCase.call(a, a, true, bConvertNonStrings);
  };
}());

jsx.array.splice = (function() {
  var jsx_object = jsx.object;

  if (jsx_object.isMethod(jsx.global, "array_splice"))
  {
    return array_splice;
  }
  else if (typeof Array != "undefined"
           && jsx_object.isMethod(Array, "prototype", "splice"))
  {
    return function(a, start, del, ins) {
      var proto = Array.prototype;
      ins = proto.slice.call(arguments, 3);
      return proto.splice.apply(a, [start, del].concat(ins));
    };
  }
  else
  {
    return function(a, start, del, ins) {
      var aDeleted = new Array();

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
  }
}());

jsx.array.every = (function () {
  var _isNativeMethod = jsx.object.isNativeMethod;
  var _isArray = jsx.object.isArray;

  return function (callback, thisObject) {
    /* NOTE: null or undefined */
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
  };
}());

jsx.array.equals = (function () {
  var _isArray = jsx.object.isArray;

  return function (otherObject, thisObject, strict) {
    /* NOTE: null or undefined */
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
  };
}());

/**
 * Sorts an array in place, optionally by a property of
 * the elements as key.
 *
 * @param a : Array
 *   Array to be sorted
 * @param aKeys : Array[String]|Array[Object]
 *   Array of keys that <var>a</var> should be sorted by, in order.
 *   A key may be a {@link String} or another native object.
 *   If it is a <code>String</code>, it specifies the property name
 *   of the sort key.  If it is another native object, the following
 *   of its properties are used as options:
 *   <table>
 *     <tr>
 *       <th><code>key</code></th>
 *       <td>The name of the property of the elements of <var>a</var>
 *           whose value <var>a</var> should be sorted by.  If this
 *           option is not present or a false-value, <var>a</var>
 *           is sorted using the element value as key.</td>
 *     </tr>
 *     <tr>
 *       <th><code>descending</code></th>
 *       <td>If a true-value, the sort order is descending
 *           instead of the default ascending.</td>
 *     </tr>
 *     <tr>
 *       <th><code>numeric</code></th>
 *       <td>If a true-value, the values are sorted as if they were
 *           <code>Number</code> values instead of the default
 *           generic sort order that uses the operators <code>==</code>
 *           (non-strict) or <code>===</code> (strict), and
 *           <code>&lt;</code>, and <code>></code>.</td>
 *     </tr>
 *     <tr>
 *       <th><code>strict</code></th>
 *       <td>If a true-value, the values are sorted
 *           using the <code>===</code> operator.  The value of
 *           this property is overridden by <var>bStrict</var>
 *           if that argument is not <code>undefined</code>.</td>
 *     </tr>
 *   </table>
 * @param bStrict : boolean
 *   If a true-value, use strict comparison.  If not
 *   <code>undefined</code>, the argument overrides
 *   the <var>strict</var> property of <var>aKeys</var> elements.
 */
jsx.array.sortBy = function (a, aKeys, bStrict) {
  if (jsx.object.isArray(this))
  {
    /* shift arguments */
    bStrict = aKeys;
    aKeys = a;
    a = this;
  }

  var comparator = function (el1, el2) {
    for (var i = 0, len = aKeys.length; i < len; ++i)
    {
      var key = aKeys[i];
      var propertyName = (typeof key.valueOf() == "string") ? key : key && key.key;

      var el1Value = (propertyName != null ? el1[propertyName] : el1);
      var el2Value = (propertyName != null ? el2[propertyName] : el2);

      var equals = ((typeof bStrict != "undefined" && bStrict) || key.strict
        ? (el1Value === el2Value)
        : (el1Value == el2Value)
      );
      if (equals)
      {
        if (i == len - 1)
        {
          /* last key, same value */
          return 0;
        }
      }
      else
      {
        var descending = key.descending;
        return (
          key.numeric
            ? (descending
                ? el1Value - el2Value
                : el2Value - el1Value)
            : (descending
                ? (el1Value < el2Value ? -1 : 1)
                : (el1Value > el2Value ? -1 : 1))
        );
      }
    }
  };

  return a.sort(comparator);
};

if (jsx.array.emulate)
{
  jsx.object.addProperties(
    {
      contains:    jsx.array.contains,
      chunk:       jsx.array.chunk,
      changeCase:  jsx.array.changeCase,
      countValues: jsx.array.countValues,
      equals:      jsx.array.equals,
      fill:        jsx.array.fill,
      pop:         jsx.array.pop,
      push:        jsx.array.push,
      reverse:     jsx.array.reverse,
      search:      jsx.array.search,
      sortBy:      jsx.array.sortBy,
      splice:      jsx.array.splice,
      toUpperCase: jsx.array.toUpperCase,

      /* JavaScript 1.6 (1.5 in Gecko 1.8b2 and later) emulation */
      every:       jsx.array.every,

      filter:      jsx.array.filter,

      iterate: function() {
        var a = new Array();

        for (var i = 0, len = this.length; i < len; i++)
        {
          a.push(this[i]);
        }

        return a;
      }
    },
    Array.prototype);
}