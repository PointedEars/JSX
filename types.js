/**
 * <title>Type Function Library</title>
 */
function Types()
{
  this.version = "1.29.200402100";
/**
 * @file types.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (C) 2001-2004  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 */
  this.copyright = "Copyright \xA9 1999-2004";
  this.author    = "Thomas Lahn";
  this.email     = "types.js@PointedEars.de";
  this.path      = "http://pointedears.de.vu/scripts/";
  this.URI       = this.path + "types.js";
// var typesDocURL = typesPath + "types.htm";
}
var types = new Types();
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
 * Refer types.htm file for documentation. 
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de.vu/scripts/JSDoc/
 * for details.
 */

function TypesException(/** @argument optional string */ sMsg)
{
  alert(
    "types.js "
      + types.version
      + "\n"
      + types.copyright
      + "  "
      + types.author
      + " <"
      + types.email
      + ">\n\n"
      + sMsg);
  return false;
}

function isInstanceOf(
  /** @argument Object */ a,
  /** @argument Object */ Prototype)
/**
 * Implements the instanceof operator of JavaScript 1.5
 * down to JavaScript 1.1 for *one* inheritance level:
 * 
 *   var o = new Object();
 *   o instanceof Object; // yields `true'
 * 
 *   function Foo()
 *   {
 *   }
 *   var o = new Foo();
 *   o instanceof Object;     // yields `true'
 *   o instanceof Foo;        // yields `true' also
 *   isInstanceOf(o, Object); // yields `false'
 *   isInstanceOf(o, Foo);    // yields `true'
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @param a
 *   Expression to be determined a <var>Prototype</var> object.
 * @param Prototype
 *   Function object to be determined the prototype of a.
 * @returns
 *   <code>true</code> if <code>a</code> is an object derived
 *   from <var>Prototype</var>, <code>false</code> otherwise.
 */
{
  return !!(
    a
    && typeof Prototype != "undefined"
    && a.constructor
    && a.constructor == Prototype);
}
Types.prototype.isInstanceOf = isInstanceOf;

function isArray(/** @argument Object */ a)
/**
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/types.js
 * @requires
 *   isInstanceOf
 * @param a
 *   Expression to be determined an array.
 * @returns
 *   <code>true</code> if <code>a</code> is an object
 *   derived from Array, <code>false</code> otherwise.
 *   Returns also <code>false</code> if the language
 *   version does not support Array objects (JavaScript
 *   before 1.1).
 */
{
  return isInstanceOf(a, typeof Array != "undefined" ? Array : null);
}
Types.prototype.isArray = isArray;

function isIterable(/** @argument Object */ o)
/**
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @param o
 *   Object to be determined iterable, i.e. to be determined
 *   whether it provides the <code>length</code> property and
 *   has at least the <code>0<code> (zero) property.  This
 *   applies for <code>Array</code> objects with elements as
 *   well as, e.g., for DOM objects implementing one of the
 *   <code>HTMLCollection</code> or
 *   <code>HTMLOptionsCollection</code> interfaces defined in
 *   W3C-DOM Level 2.
 * @returns
 *   <code>true</code> if <code>o</code> is an iterable object,
 *   <code>false</code> otherwise.
 * @author Copyright (c) 2003 Thomas Lahn
 *   &lt;isIterable.js@PointedEars.de&gt;
 */
{
  return !!(
    o
    && typeof o.length != "undefined"
    && typeof o[0] != "undefined");
}
Types.prototype.isIterable = isIterable;

function isMethod(/** @argument optional Object */ o)
/**
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @param o
 *   Object to be determined an method, i.e. a
 *   <code>Function</code> object assigned as property
 *   of another object.  Not applicable to unknown
 *   properties.  If you require that, use
 *   @link{#isMethodType()} instead.
 * @returns
 *   <code>true</code> if <code>o</code> is a method,
 *   <code>false</code> otherwise.
 * @see #isMethodType()
 */
{
  return (typeof o == "function" || typeof o == "object");
}
Types.prototype.isMethod = isMethod;

function isMethodType(/** @argument optional string */ s)
/**
 * @author
 *   (C) 2003, 2004  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/types.js
 * @param s
 *   String to be determined a method type, i.e. "object"
 *   in IE, "function" otherwise.  The type must have been
 *   retrieved with the `typeof' operator, thus this method
 *   is applicable to unknown properties while
 *   @link{#isMethod()} is not.
 * @returns
 *   <code>true</code> if <code>s</code> is a method type,
 *   <code>false</code> otherwise.
 * @see #isMethod()
 */
{
  return (s == "function" || s == "object");
}
Types.prototype.isMethodType = isMethodType;

if (! isMethodType(typeof Function.prototype.apply)
    && isMethodType(typeof eval))
{
  Function.prototype.apply = function apply()
  {
    var a = new Array();
    for (var i = 0; i < arguments[1].length; i++)
      a[i] = arguments[1][i];
      
    eval(arguments[0]+ "(" + a.join(", ") + ")");
  }
}
