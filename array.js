/**
 * <title>Array Library</title>
 */
if (typeof Array == "undefined")
{
  var Array = new Object();
}
Array.version   = "0.1.2004012014";
/**
 * @file array.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (C) 2004  Thomas Lahn &lt;array.js@PointedEars.de&gt;
 */
Array.copyright = "Copyright \xA9 2004";
Array.author    = "Thomas Lahn";
Array.email     = "array.js@PointedEars.de";
Array.path      = "http://pointedears.de.vu/scripts/"
// Array.docURL = Array.path + "array.htm";
/**
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
 * Refer array.htm file for documentation. 
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de.vu/scripts/JSDoc/
 * for details.
 */

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

function array_chunk(
  /** @optional Array  */ a,
  /** @argument number */ iSize)
/**
 * Splits the array <code>a</code>into several arrays with
 * <code>iSize</code> values in them.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   types#isArray()
 * @param a
 *   Array which should be split.
 *   Is used instead of the <code>Array</code> object
 *   the function is applied to.
 * @param iSize
 *   Maximum size of the resulting arrays.
 * @returns
 *   An array of arrays indexed with numbers starting from
 *   zero.
 */
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
        index++;
        arrays[index] = new Array();
      }
      
      array_push(arrays[index], a[i]);
    }
  }
}

function /** @type Object */ array_countValues(/** @optional Array  */ a)
/**
 * Returns an object using the values of the array <code>a</code>
 * as properties and their frequency in <code>a</code> as values.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   types#isArray()
 * @param a
 *   Array which values should be counted.
 *   Is used instead of the <code>Array</code> object
 *   the function is applied to.
 */
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

function array_fill(
  /** @optional Array  */ a,
  /** @argument number */ iStart,
  /** @argument number */ iNumber,
  value)
/**
 * Fills an array with <code>iNumber</code> entries of the
 * value of the <code>value</code> argument, indexes starting
 * at the value of the <code>iStart</code> argument.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   types#isArray()
 * @param a
 *   Array which should be filled.
 *   Is used instead of the <code>Array</code> object
 *   the function is applied to.
 * @param iStart
 *   Index where to start filling.
 * @param iNumber
 *   Number of elements to be filled, starting from
 *   <code>iStart</code>.
 */
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

function array_filter(
  /** @optional Array    */ a,
  /** @argument Function */ fCallback)
/**
 * Returns an array containing all the elements of <code>a</code>
 * filtered according a callback function <code>fCallback</code>.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   types#isArray()
 * @param a
 *   Array which should be filtered.
 *   Is used instead of the <code>Array</code> object
 *   the function is applied to.
 * @param fCallback
 *   A function accepting a single argument that returns a value
 *   to be interpreted either as <code>true</code> or
 *   <code>false</code>.  If it returns <code>true</code> for the
 *   element of <code>a</code>, that element is included in the
 *   resulting array, otherwise it is not.
 */
{
  if (!isArray(a) && isArray(this))
  {
    a = this;
  }

  if (!isArray(a))
  {
    a = new Array();
  }
  
  var result = new Array();
  
  for (var i = iStart; i < iStart + iNumber; i++)
  {
    if (fCallback(a[i]))
    {
      result = array_push(result, a[i]);
    }
  }
  
  return result;
}

function array_push(
  /** @optional Array */ a,
  /** @optional       */ value)
/**
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   types#isArray()
 * @param a
 *   Array which should be added an element.
 *   Is used instead of the <code>Array</code> object
 *   the function is applied to.
 */
{
  if (!isArray(a) && isArray(this))
  {
    value = a;
    a = this;
  }
  
  a[a.length] = value;

  return a;
}

function array_reverse(/** @optional Array */ a)
/**
 * Takes input array <code>a</code> or the Array object
 * it is applied to as method and returns a new Array
 * object with the order of the elements reversed.
 * 
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   types#isArray()
 * @param a
 *   Array which order of elements should be reversed.
 *   Is used instead of the Array object the
 *   function is applied to.
 * @returns
 *   A copy of <code>a</code> or the Array object with its
 *   elements in reverse order.  If <code>a</code> has no
 *   elements, an empty array is returned.
 */
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

function /** @type number */ array_search(
  needle,
  /** @optional Array   */ aHaystack,
  /** @optional boolean */ bStrict)
/**
 * Searches an array for a given value and returns
 * the corresponding index if successful.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   types#isArray()
 * @param needle
 *   Value to be searched for.
 * @param aHaystack
 *   Array to be searched for.  Is used instead of the
 *   <code>Array</code> object on which this function
 *   may be applied as method.
 * @param bStrict
 *    If <code>true</code> then the function will also
 *    check the types of the <code>needle</code> in the
 *    <code>aHaystack</code>.
 * @returns
 *   The index of <code>needle</code> if it is found in
 *   the array, -1 otherwise.
 */
{
  if (!isArray(aHaystack) && isArray(this))
  {
    bStrict = aHaystack;
    aHaystack = this;
  }
  
  for (var i = 0; i < aHaystack.length; i++)
  {
    if (bStrict)
    {
      eval('if (aHaystack[i] === needle) return i;');
      if (aHaystack[i] == needle)
      {
        return i;
      }
    }
    else
    {
      if (aHaystack[i] == needle)
      {
        return i;
      }
    }
  }
  return false;
}

function /** @type boolean */ inArray(
  /** @argument         */ value,
  /** @argument Array   */ a,
  /** @optional boolean */ bExactMatch)
/**
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   types#isArray()
 * @param a
 *   Array which should be searched.
 *   Is used instead of the <code>Array</code> object
 *   the function is applied to.
 * @returns
 *   <code>true</code> if <code>value</code> is an element
 *   of <code>a</code>, <code>false</code> otherwise.
 */
{
  return (array_search(value, a, bExactMatch) >= 0)
}

function array_changeCase(
  /** @optional Array                 */ a,
  /** @optional boolean default false */ bUppercase,
  /** @optional boolean default false */ bConvertNonStrings)
/**
 * Takes input array <code>a</code> or the Array object it is
 * applied to as method and returns a new Array object with
 * all string elements (optionally all elements regardless of
 * their type) either lowercased or uppercased.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   types#isArray()
 * @param a
 *   Array which elements should be changed.
 *   Is used instead of the Array object the
 *   function is applied to.
 * @param bUppercase
 *   If <code>false</code> (default), changes the elements
 *   to be all lowercase.  If <code>true</code>, changes
 *   them to be all uppercase.
 * @param bConvertNonStrings
 *   If <code>false</code> default, changes only the case
 *   of string elements.  If <code>true</code>, converts
 *   non-string elements to String and changes their case.
 * @returns
 *   A copy of <code>a</code> or the Array object with its
 *   elements' value uppercased or lowercased.  If
 *   <code>a</code> has no elements, an empty array is
 *   returned.
 */
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

function array_toLowerCase(
  /** @optional Array */ a,
  /** @optional boolean default false */ bConvertNonStrings)
/**
 * Takes input array <code>a</code> or the Array object it is
 * applied to as method and returns a new Array object with
 * all string elements (optionally all elements regardless of
 * their type) lowercased.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   #array_changeCase()
 * @param a
 *   Array which elements should be converted.
 *   Is used instead of the Array object the
 *   function is applied to.
 *
 * @param bConvertNonStrings
 *   If <code>false</code> default, changes only the case
 *   of string elements.  If <code>true</code>, converts
 *   non-string elements to String and changes their case.
 * @returns
 *   A copy of <code>a</code> or the Array object with its
 *   elements' value lowercased.  If <code>a</code> has no
 *   elements, an empty array is returned.
 */
{
  if (!isArray(a) && isArray(this))
  {
    bConvertNonStrings = a;
    a = this;
  }

  return array_changeCase(a, false, bConvertNonStrings);
}

function array_toUpperCase(
  /** @optional Array */ a,
  /** @optional boolean default false */ bConvertNonStrings)
/**
 * Takes input array <code>a</code> or the Array object it is
 * applied to as method and returns a new Array object with
 * all string elements (optionally all elements regardless of
 * their type) uppercased.
 *
 * @author
 *   (C) 2004 Thomas Lahn  &lt;array.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/array.js
 * @requires
 *   #array_changeCase()
 * @param a
 *   Array which elements should be converted.
 *   Is used instead of the Array object the
 *   function is applied to.
 * @param bConvertNonStrings
 *   If <code>false</code> default, changes only the case
 *   of string elements.  If <code>true</code>, converts
 *   non-string elements to String and changes their case.
 * @returns
 *   A copy of <code>a</code> or the Array object with its
 *   elements' value uppercased.  If <code>a</code> has no
 *   elements, an empty array is returned.
 */
{
  if (!isArray(a) && isArray(this))
  {
    bConvertNonStrings = a;
    a = this;
  }

  return array_changeCase(a, true, bConvertNonStrings);
}

Array.addToPrototype = function array_addToPrototype()
{
  var p = this.prototype;
  if (p)
  {
    p.isElementOf = inArray;
    p.chunk       = array_chunk;
    p.countValues = array_countValues;
    p.fill        = array_fill;
    if (!isMethodType(typeof p.push))
    {
      p.push      = array_push;
    }
    if (!isMethodType(typeof p.reverse))
    {
      p.reverse   = array_reverse;
    }
    p.search      = array_search;
    p.toUpperCase = array_toUpperCase;
  }
}
Array.addToPrototype();
