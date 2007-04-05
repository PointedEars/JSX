/**
 * <title>PointedEars' Array Library</title>
 * @partof PointedEars' JavaScript Extensions (JSX)
 * 
 * @section Copyright & Disclaimer
 * 
 * @author
 *   (C) 2004  Thomas Lahn &lt;array.js@PointedEars.de&gt;
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public Licnse
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License (GPL) for more details.
 *
 * You should have received a copy of the GNU GPL along with this
 * program (COPYING file); if not, go to [1] or write to the Free
 * Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA.
 * 
 * [1] <http://www.gnu.org/licenses/licenses.html#GPL>
 */
/*
 * Refer array.htm file for a printable
 * documentation. 
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSDoc/
 * for details.
 */

if (typeof Array == "undefined")
{
  var Array = new Object();
}
Array.version   = "0.1.2007040519";
Array.copyright = "Copyright \xA9 2004-2007";
Array.author    = "Thomas Lahn";
Array.email     = "array.js@PointedEars.de";
Array.path      = "http://pointedears.de/scripts/"
// Array.docURL = Array.path + "array.htm";

function ArrayException(/** @argument optional string */ sMsg)
{
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
}

/**
 * Splits the array @{(a)} into several arrays with
 * @{(iSize)} values in them.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   types#isArray()
 * @@optional Array a
 *   Array which should be split.  Is used instead of the
 *   @{jsref#Array} object the function is applied to.
 * @argument number iSize
 *   Maximum size of the resulting arrays.
 * @return type Array
 *   An array of arrays indexed with numbers starting from zero.
 */
function array_chunk(a, iSize)
{
  if (!isArray(a) && isArray(this))
  {
    iSize = a;
    a = this;
  }

  var arrays = new Array(new Array());

  var i = 0;
  if (isMethodType(typeof a.slice))
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
      
      array_push(arrays[index], a[i]);
    }
  }
}

/**
 * Returns an object using the values of the array @{(a)}
 * as properties and their frequency in @{(a)} as values.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   types#isArray()
 * @optional Array a
 *   Array which values should be counted.  Is used instead of
 *   the @{jsref#Array} object the function is applied to.
 * @return type Object
 */
function array_countValues(a)
{
  if (!isArray(a) && isArray(this))
  {
    a = this;
  }
  
  var o = new Object();
  
  for (var i = 0; i < a.length; i++)
  {
    if (typeof o[a[i]] != "undefined")
      o[a[i]]++;
    else
      o[a[i]] = 1;
  }
  
  return o;
}

/**
 * Fills an array with @{(iNumber)} entries of the value
 * of the @{(value)} argument, indexes starting at the
 * value of the @{(iStart)} argument.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   types#isArray()
 * @optional Array a
 *   Array which should be filled.  Is used instead of the
 *   @{jsref#Array} object the function is applied to.
 * @argument number iStart
 *   Index where to start filling.
 * @argument number iNumber
 *   Number of elements to be filled, starting from
 *   @{(iStart)}.
 * @optional * value
 * @return type Array
 *   The filled array.
 */
function array_fill(a, iStart, iNumber, value)
{
  if (!isArray(a) && isArray(this))
  {
    a = this;
  }

  if (!isArray(a))
  {
    a = new Array();
  }
  
  for (var i = iStart; i < iStart + iNumber; i++)
  {
    a[i] = value;
  }
  
  return a;
}

/**
 * Returns an array containing all the elements of @{(a)}
 * filtered according a callback function @{(fCallback)}.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   types#isArray()
 * @argument Function fCallback
 *   A function accepting a single argument that returns
 *   a value to be interpreted either as <code>true</code>
 *   or <code>false</code>.  If it returns <code>true</code>
 *   for the element of @{(a)}, that element is
 *   included in the resulting array, otherwise it is not.
 * @optional Array a
 *   Array which should be filtered.  Is used instead of the
 *   @{jsref#Array} object the function is applied to.
 * @return type Array
 */
function array_filter(fCallback, a)
{
  if (a)
  {
    // support for old-style calls
    if (typeof a == "function")
    {
      if (isArray(fCallback))
      {
        var tmp = a;
        fCallback = a;
        a = tmp;
      }
      else
      {
        eval('throw new TypeError();');
      }        
    }
    else
    {
      // intentionally generic
      a = this;      
    }
  }

  var len = this.length;
  
  if (typeof fCallback != "function")
  {
    eval('throw new TypeError();');
  }  

  var res = new Array();

  for (var i = 0; i < len; i++)
  {
    if (i in this)
    {
      // mozilla.org: in case fCallback mutates `this'(?)
      var val = this[i];
      
      if (fCallback.call(a, val, i, this))
      {
        res.push(val);
      }
    }
  }

  return res;
}
  
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
 *   types#isArray()
 * @param a: optional Array
 *   Array from which the last element should be removed.  Is used
 *   instead of the @{jsref#Array} object the function is
 *   applied to.
 * @returns
 *   The element removed from the array changed array.
 */
function array_pop(a)
{
  if (!isArray(a) && isArray(this))
  {
    value = a;
    a = this;
  }
   
  var result = null;

  if (a.length > 0)
  {
    result = a[a.length - 1];
    if (isArray(this))
    {
      this.length = this.length - 1;
    }
  }

  return result;
}

/**
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   types#isArray()
 * @optional Array a
 *   Array which should be added an element.  Is used instead
 *   of the @{jsref#Array} object the function is applied to.
 * @optional * value
 * @return type Array
 *   The changed array.
 */
function array_push(a, value)
{
  if (!isArray(a) && isArray(this))
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
 * Takes input array @{(a)} or the calling @{jsref#Array}
 * object and returns a new <code>Array</code> object with the
 * order of the elements reversed.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   types#isArray()
 * @optional Array a
 *   @{jsref#Array} object which order of elements should be
 *   reversed.  Is used instead of the calling <code>Array</code>
 *   object.
 * @return type Array
 *   A copy of @{(a)} or the calling @{jsref#Array}
 *   object with its elements in reverse order.  If @{(a)}
 *   has no elements, an empty array is returned.
 */
function array_reverse(a)
{
  if (!isArray(a) && isArray(this))
  {
    a = this;
  }
  
  var result = new Array();

  if (isArray(a))
  {
    for (var i = a.length - 1; i > -1; i--)
      result[result.length] = a[i];
  }
  
  return result;
}

/**
 * Searches an @{jsref#Array} for a given value and
 * returns the corresponding index or vector if successful.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   types#isArray()
 * @argument * needle
 *   Value to be searched for.
 * @argument * aHaystack
 *   @{jsref#Array} to be searched for.  Is used instead of
 *   the calling @{jsref#Array} object.
 * @optional boolean bStrict
 *   If <code>true</code> then the function will also check the
 *   types of the @{(needle)} in the @{(aHaystack)}.
 * @optional boolean bDeepSearch
 *   If <code>true</code>, a deep search, if necessary, will be
 *   performed, i.e. also elements of the array are searched if
 *   they refer to <code>Array</code> objects.  (Note that this
 *   method pays attention to the possibility that an element may
 *   refer to one of its parents, so that infinite recursion is
 *   not performed in this case.  However, this additional check
 *   reduces efficiency as another <code>array_search()</code>
 *   must be invoked for every ancestor relationship.  Also
 *   note that this compares only references, not content.
 *   If @{(needle)} is a reference to an <code>Array</code>
 *   object, it is compared as reference with every single
 *   element, not its content with the content of elements
 *   [that refer to <code>Array</code> objects].)
 * @optional Array aAncestors
 *   Used internally by @{(bDeepSearch), deep search} to refer
 *   to an @{jsref#Array} object storing the ancestors of a
 *   "child" array element that refers to an <code>Array</code>
 *   object itself.  Usage prevents infinite recursion, see
 *   @{(bDeepSearch)}.
 * @optional Array aResultVector
 *   Used internally by @{(bDeepSearch), deep search}
 *   to refer to an @{jsref#Array} object storing the
 *   vector of a matching array element that refers to an
 *   <code>Array</code> object itself.
 * @optional number iLevel
 *   Used internally by @{(bDeepSearch), deep search}
 *   to specify the level for index of the coordinate of
 *   @{(aResultVector)} if there is a match.  The default
 *   level (also used for non-deep searches) is 0 for the
 *   first coordinate of <code>aResultVector</code>.
 * @optional number index
 *   Used internally by @{(bDeepSearch), deep search}
 *   to specify the current index for the coordinate of
 *   @{(aResultVector)} if there is a match.
 * @return type number
 *   Without @{(bDeepSearch), deep search}:
 *     The zero-based index of the first matching element
 *       if @{(needle)} is found in the array,
 *     -1
 *       otherwise.
 * 
 *   With deep search:
 *     A reference to an Array object indicating the vector of
 *     the first matching element (i.e. its coordinates)
 *       if <code>needle</code> is found in the array,
 *     <code>null</code>
 *       otherwise.
 * 
 *   If neither the calling object is an <code>Array</code>
 *   object nor <code>aHaystack</code> is a reference to such:
 *     0 or @{(index)}
 *       if <code>needle</code> is equal to <code>aHaystack</code>
 *       (@{(bStrict)} is noted),
 *    -1
 *       otherwise.
 */
function array_search(needle, aHaystack, bStrict, bDeepSearch, aAncestors,
  aResultVector, iLevel, index)
{
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

  if (isArray(aHaystack))
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
        
        if (aAncestors.length == 0
            || aAncestors[aAncestors.length - 1] != aHaystack) // avoid dupes
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

        if (!inArray(aHaystack[i], aAncestors, false)) // avoid inf. recursion
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
}

/**
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   types#isArray()
 * @param * value
 * @argument Array
 *   Array which should be searched.  Is used instead of the
 *   @{jsref#Array} object the function is applied to.
 * @optional boolean bExactMatch
 *   If <code>true</code> then the function will also check the
 *   types of the @{(needle)} in the @{(aHaystack)}.
 * @optional boolean bDeepSearch
 *   If <code>true</code>, a @{#array_search(bDeepSearch),deep
 *   search}, if necessary, will be performed.
 * @return type boolean
 *   <code>true</code> if <code>value</code> is an element of
 *   @{(a)}, <code>false</code> otherwise.
 */
function inArray(value, a, bExactMatch, bDeepSearch)
{
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
}

/**
 * Takes input array @{(a)} or the Array object it is applied
 * to as method and returns a new Array object with all string
 * elements (optionally all elements regardless of their type)
 * either lowercased or uppercased.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/array.js
 * @requires
 *   types#isArray()
 * @optional Array a
 *   Array which elements should be changed.  Is used instead
 *   of the Array object the function is applied to.
 * @optional boolean bUppercase = false
 *   If <code>false</code> (default), changes the elements to
 *   be all lowercase.  If <code>true</code>, changes them to
 *   be all uppercase.
 * @optional boolean bConvertNonStrings = false
 *   If <code>false</code> default, changes only the case of
 *   string elements.  If <code>true</code>, converts non-string
 *   elements to String and changes their case.
 * @return type Array
 *   A copy of @{(a)} or the Array object with its
 *   elements' value uppercased or lowercased.  If @{(a)}
 *   has no elements, an empty array is returned.
 */
function array_changeCase(a, bUppercase, bConvertNonStrings)
{
  if (!isArray(a) && isArray(this))
  {
    bConvertNonStrings = bUpperCase;
    bUpperCase = a;
    a = this;
  }
  
  if (isArray(a))
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
  else
  {
    return new Array();
  }
}

/**
 * Takes input array @{(a)} or the Array object it is
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
 * @optional Array a
 *   Array which elements should be converted.  Is used instead
 *   of the Array object the function is applied to.
 * @optional boolean bConvertNonStrings = false
 *   If <code>false</code> default, changes only the case of
 *   string elements.  If <code>true</code>, converts non-string
 *   elements to String and changes their case.
 * @return type Array
 *   A copy of @{(a)} or the Array object with its
 *   elements' value lowercased.  If @{(a)} has no
 *   elements, an empty array is returned.
 */
function array_toLowerCase(a, bConvertNonStrings)
{
  if (!isArray(a) && isArray(this))
  {
    bConvertNonStrings = a;
    a = this;
  }

  return array_changeCase(a, false, bConvertNonStrings);
}

/**
 * Takes input array @{(a)} or the Array object it is
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
 * @optional Array a
 *   Array which elements should be converted.  Is used instead
 *   of the Array object the function is applied to.
 * @optional boolean bConvertNonStrings = false
 *   If <code>false</code> default, changes only the case of
 *   string elements.  If <code>true</code>, converts non-string
 *   elements to String and changes their case.
 * @return type Array
 *   A copy of @{(a)} or the Array object with its
 *   elements' value uppercased.  If @{(a)} has no
 *   elements, an empty array is returned.
 */
function array_toUpperCase(a, bConvertNonStrings)
{
  if (!isArray(a) && isArray(this))
  {
    bConvertNonStrings = a;
    a = this;
  }

  return array_changeCase(a, true, bConvertNonStrings);
}

Array.prototype.addProperties({
  contains:    inArray,
  chunk:       array_chunk,
  changeCase:  array_changeCase,
  countValues: array_countValues,
  fill:        array_fill,
  pop:         array_pop,
  push:        array_push,
  reverse:     array_reverse,
  search:      array_search,
  toUpperCase: array_toUpperCase,
  
  // JavaScript 1.6 (1.5 in Gecko 1.8b2 and later) emulation   
  every: function(callback, thisObject) {
    if (arguments.length < 2)
    {
      thisObject = this;
    }
    
    for (var i = 0, len = thisObject.length; i < len; i++)
    {
      if (!thisObject.callback())
      {
        return false;
      };
    }

    return true;
  },
  
  filter: array_filter,
     
  iterate: function() {
    var a = new Array();
    
    for (var i = 0, len = this.length; i < len; i++)
    {
      a.push(this[i]);
    }
    
    return a;
  }
 });