/**
 * <title>Type Function Library</title>
 */
function Types()
{
  this.version = "1.29.2004102311";
/**
 * @file types.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (C) 2001-2004  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 */
  this.copyright = "Copyright \xA9 1999-2004";
  this.author    = "Thomas Lahn";
  this.email     = "types.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
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
 * http://pointedears.de/scripts/JSDoc/
 * for details.
 */

/**
 * @optional string sMsg
 * @return type boolean
 *   false
 */ 
function TypesException(sMsg)
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

/**
 * Implements the instanceof operator of JavaScript 1.5
 * down to JavaScript 1.1 for *one* inheritance level:
 * <code>
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
 * </code>
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @argument Object a
 *   Expression to be determined a <var>Prototype</var> object.
 * @argument Object Prototype
 *   Function object to be determined the prototype of a.
 * @return type boolean
 *   <code>true</code> if <code>a</code> is an object derived
 *   from <var>Prototype</var>, <code>false</code> otherwise.
 */ 
function isInstanceOf(a, Prototype)
{
  return !!(
    a
    && typeof Prototype != "undefined"
    && typeof a.constructor != "undefined"
    && a.constructor == Prototype);
}

/**
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/types.js
 * @requires
 *   isInstanceOf
 * @argument Object a
 *   Expression to be determined an array.
 * @return type boolean
 *   <code>true</code> if <code>a</code> is an object
 *   derived from Array, <code>false</code> otherwise.
 *   Returns also <code>false</code> if the language
 *   version does not support Array objects (JavaScript
 *   before 1.1).
 */
function isArray(a)
{
  return isInstanceOf(a, typeof Array != "undefined" ? Array : null);
}

/**
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @@argument Object o
 *   Object to be determined iterable, i.e. to be determined
 *   whether it provides the <code>length</code> property and
 *   has at least the <code>0<code> (zero) property.  This
 *   applies for <code>Array</code> objects with elements as
 *   well as, e.g., for DOM objects implementing one of the
 *   <code>HTMLCollection</code> or
 *   <code>HTMLOptionsCollection</code> interfaces defined in
 *   W3C-DOM Level 2.
 * @return type boolean
 *   <code>true</code> if <code>o</code> is an iterable object,
 *   <code>false</code> otherwise.
 */
function isIterable(o)
{
  return !!(
    o
    && typeof o.length != "undefined"
    && typeof o[0] != "undefined");
}

/**
 * @author
 *   (C) 2003, 2004  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @optional Object o
 *   Object to be determined an method, i.e. a
 *   <code>Function</code> object assigned as property
 *   of another object.  Not applicable to unknown
 *   properties.  If you require that, use
 *   @link{#isMethodType()} instead.
 * @return type boolean
 *   <code>true</code> if <code>o</code> is a method,
 *   <code>false</code> otherwise.
 * @see #isMethodType()
 */
function isMethod(o)
{
  var t;
  return ((t = typeof o) == "function"
          || (t == "object" && o));
}

/**
 * @author
 *   (C) 2003, 2004  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 *   Distributed under the GNU GPL v2.
 * @partof
 *   http://pointedears.de/scripts/types.js
 * @optional string s
 *   String to be determined a method type, i.e. "object"
 *   in IE, "function" otherwise.  The type must have been
 *   retrieved with the `typeof' operator, thus this method
 *   is applicable to unknown properties while
 *   @link{#isMethod()} is not.  Note that this method
 *   may also return <code>true</code> if the value of
 *   the <code>typeof</code> operand is <code>null</code>; to
 *   be sure that the operand is a method reference, you have
 *   to && (AND)-combine the <code>isMethodType(...)</code>
 *   expression with the method reference identifier.
 * @return type boolean
 *   <code>true</code> if <code>s</code> is a method type,
 *   <code>false</code> otherwise.
 * @see #isMethod()
 */
function isMethodType(s)
{
  return (s == "function" || s == "object");
}

Object.prototype.addProperties(
  {isArray:      isArray,
   isInstanceOf: isInstanceOf,
   isIterable:   isIterable,
   isMethod:     isMethod,
   isMethodType: isMethodType
  });