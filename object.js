/**
 * <title>Object Library</title>
 */
/** @version */ Object.version   = "0.1.2004090622";
/**
 * @file object.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (C) 2004  Thomas Lahn &lt;object.js@PointedEars.de&gt;
 */
Object.copyright = "Copyright \xA9 2004";
Object.author    = "Thomas Lahn";
Object.email     = "object.js@PointedEars.de";
Object.path      = "http://pointedears.de/scripts/";
// Object.docURL = Object.path + "object.htm";
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
 * Refer object.htm file for documentation.
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSDoc/
 * for details.
 */

// NOTE: Cannot use addProperties() for the following
// because values have not been defined yet!
/**
 * @property number
 *   Used by @{#addProperties()} to overwrite existing
 *   properties.
 */
Object.ADD_OVERWRITE = 1;

/**
 * @property number
 *   Used by @{#addProperties()}, @{#clone()}
 *   and @{#clone()} to make a shallow copy of all
 *   enumerable properties (default).
 */
Object.COPY_ENUM = 0;

/**
 * @property number
 *   Used by @{#addProperties()}, @{#clone()}
 *   and @{#clone()} to make a deep copy of all
 *   enumerable properties.
 */
Object.COPY_ENUM_DEEP = 2;

/**
 * @property number
 *   Used by @{#addProperties()}, @{#clone()}
 *   and @{#clone()} to copy a property by inheritance.
 */
Object.COPY_INHERIT = 4;

/**
 * Adds/replaces properties of an object.
 *
 * @prototype method
 * @argument Object oSource
 *   Object specifying the properties to be added/replaced.
 *   The name of each property serves as the name for the
 *   property of the target object, its value as the value
 *   of that property.
 * @optional number iFlags
 *   Flags for the modification, see @{#Object.ADD_OVERWRITE,
 *   ADD_*} and @{#Object.COPY_ENUM, COPY_*}.
 * @optional Object oOwner
 *   If provided, used as target object instead of the
 *   calling object.  This makes it possible to call
 *   the method without an explicit calling object.
 */
function addProperties(oSource, iFlags, oOwner)
{
  if (typeof iFlags == "object")
  {
    oOwner = iFlags;
    iFlags = 0;
  }

  if (!oOwner)
  {
    oOwner = this;
  }

  if (typeof oOwner == "object")
  {
    for (var i in oSource)
    {
      if (typeof oOwner[i] == "undefined"
          || typeof iFlags == "undefined"
          || (iFlags & Object.ADD_OVERWRITE))
      {
        oOwner[i] = clone(
          iFlags & (Object.COPY_ENUM_DEEP | Object.COPY_INHERIT),
          oSource[i]);
      }
    }
  }
}
addProperties.PE = true;

/**
 * Creates a duplicate (clone) of an object.
 *
 * @optional number iLevel
 *   Use the Object @{#Object.COPY_ENUM, COPY*}
 *   properties to specify the level of cloning.
 * @optional object oSource
 *   Reference to the object to be cloned.
 *   If omitted, the calling object is cloned.
 * @return type object
 *   A reference to the clone.
 */
function clone(iLevel, oSource)
{
  if (typeof iLevel == "object")
  {
    oSource = iLevel;
    iLevel = 0;
  }

  if (!oSource)
  {
    oSource = this;
  }

  if (!iLevel || (iLevel & Object.COPY_ENUM_DEEP))
  {
    var o2 = oSource.valueOf(), c, i;

    // just in case "var i in ..." does not copy the array elements
    if (typeof Array != "undefined" && (c = o2.constructor) && c == Array)
    {
      for (i = oSource.length; i--;)
      {
        if (iLevel && typeof oSource[i] == "object")
        {
          o2[i] = clone(iLevel, oSource[i]);
        }
        else
        {
          o2[i] = oSource[i];
        }
      }
    }

    for (i in oSource)
    {
      if (iLevel && typeof oSource[i] == "object")
      {
        o2[i] = clone(iLevel, oSource[i]);
      }
      else
      {
        o2[i] = oSource[i];
      }
    }
    return o2;
  }
  else if (iLevel & Object.COPY_INHERIT)
  {
    return inheritFrom(oSource);
  }
  else
  {
    return null;
  }
}
clone.PE = true;

/**
 * @argument Object o
 * @return type string
 *   The name of a non-existing property of o if
 *   @{Object.hasOwnProperty()} is supported, or
 *   the name of a property with value `undefined'
 *   if it is not supported; the empty string
 *   if there is no such property.
 * @TODO
 *   Currently only one-letter property names
 *   are searched for and supported.
 */
function findNewProperty(o)
{
  if (!o)
  {
    o = this;
  }

  for (var i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++)
  {
    var s = String.fromCharCode(i);
    if (!o._hasOwnProperty(s))
    {
      return s;
    }
  }
  return "";
}
findNewProperty.PE = true;

/**
 * @optional Object o
 *   Object which property should be checked for existence.
 * @argument string sProperty
 *   Name of the property to check.
 * @return type boolean
 *   <code>true</code> if there is such a property;
 *   <code>false</code> otherwise.
 */
function _hasOwnProperty(o, sProperty)
{
  if (arguments.length < 2 && o)
  {
    sProperty = o;
    o = this;
  }

  var hasHasOwnProperty = typeof o.hasOwnProperty == "function";
  return ((hasHasOwnProperty && o.hasOwnProperty(sProperty))
          || (!hasHasOwnProperty && typeof o[sProperty] != "undefined"));
}
_hasOwnProperty.PE = true;

addProperties(
  {addProperties  : addProperties,
   clone          : clone,
   findNewProperty: findNewProperty,
   _hasOwnProperty: _hasOwnProperty},
  Object.prototype);

/**
 * Inherits one object from another.
 *
 * Pass the `prototype' property of a Function object
 * (a prototype) and assign the return value to the
 * `prototype' property of the child to establish
 * prototype-based inheritance (much like class-based
 * inheritance in Java).  Be sure to call the parent's
 * constructor then within the constructor of the
 * child, using the call() method (or calling it as
 * a method of the inheriting prototype), else changes
 * in the parent will not affect the child.
 *
 * @optional object o
 *   Object from which to inherit.
 * @return type object
 *   The child object.
 */
function inheritFrom(o)
{
  var Dummy = function() {}
  Dummy.prototype = o;
  return new Dummy();
}
inheritFrom.PE = true;

if (typeof eval == "function")
{
  /**
   * Applies a method of another object in the context
   * of a different object (the calling object).
   *
   * @prototype method
   * @argument object thisArg
   *   Reference to the calling object.
   * @argument Array argArray
   *   Arguments for the object.
   */
  var function_apply = function function_apply(thisArg, argArray)
  {
    var a = new Array();
    for (var i = 0, len = argArray.length; i < len; i++)
    {
      a[i] = "argArray[" + i +"]";
    }

    var p = thisArg.findNewProperty();
    if (p && (thisArg[p] = this));
    {
      eval("thisArg[p](" + a.join(", ") + ")");
      delete thisArg[p];
    }
  }
  function_apply.PE = true;

  /**
   * Calls (executes) a method of another object in the
   * context of a different object (the calling object).
   *
   * @argument object thisArg
   *   Reference to the calling object.
   * @arguments _ _
   *   Arguments for the object.
   */
  var function_call = function function_call(thisArg)
  {
    var a = new Array();
    for (var i = 1, len = arguments.length; i < len; i++)
    {
      a[i] = "arguments[" + i + "]";
    }

    var p = thisArg.findNewProperty();
    if (p && (thisArg[p] = this));
    {
      eval("thisArg[p](" + a.join(", ") + ")");
      delete thisArg[p];
    }
  }
  function_call.PE = true;

  Function.prototype.addProperties({
    apply: function_apply,
    call:  function_call
  });
}

function Exception(s) {
  this.message = s;
}
Exception.PE = true;

Exception.prototype.addProperties({
  getMessage:      function() { return this.message; },
  getStackTrace:   function() { return this.stack; },
  printStackTrace: function() { alert(this.getStackTrace()); }
});

function ObjectException(s)
{
  Exception.call(this);
  this.message = s;
}
ObjectException.PE = true;
ObjectException.prototype = inheritFrom(Exception.prototype);

/**
 * Raises an ObjectException
 *
 * @optional string sMsg
 * @returns false
 */
function objectException(sMsg)
{
  alert(
    "object.js "
      + Object.version
      + "\n"
      + Object.copyright
      + "  "
      + Object.author
      + " <"
      + Object.email
      + ">\n\n"
      + sMsg);

  return false;
}
objectException.PE = true;