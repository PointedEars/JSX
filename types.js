/**
 * <title>Type Function Library</title>
 */
function Types()
{
  this.version = "1.29.6.2008050517";
/**
 * @file types.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @requires object.js
 * @author
 *   (C) 2001-2008  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 */
  this.copyright = "Copyright \xA9 1999-2008";
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
 * This script file contains JSdoc[tm] comments
 * to create an API documentation of it from them, see
 * <http://PointedEars.de/scripts/JSdoc/> for details.
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
 * Returns <code>true</code> if a property is defined and its value
 * is different from `undefined', <code>false</code> otherwise.
 *
 * @optional Object o
 *   Optional base object.  The default is the calling object.
 * @argument String p
 *   Property name; required.
 */
function isDefined(o, p)
{
  if (!p)
  {
    p = o;
    o = this;
  }
  
  return (typeof o[p] != "undefined");
}

/**
 * Returns <code>true</code> if a property is undefined or
 * its value is `undefined', <code>false</code> otherwise.
 *
 * @optional Object o
 *   Optional base object.  The default is the calling object.
 * @argument String p
 *   Property name; required.
 */
function isUndefined(o, p)
{
  if (!p)
  {
    p = o;
    o = this;
  }

  return (typeof o[p] == "undefined");  
}

/**
 * Implements the instanceof operator of JavaScript 1.5
 * down to JavaScript 1.1 for *one* inheritance level:
 * <pre><code>
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
 * </code></pre>
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
    a && Prototype
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
 * @argument Object o
 *   Object to be determined iterable, i.e. to be determined
 *   whether it provides the <code>length</code> property and
 *   has at least the <code>0<code> (zero) property.  This
 *   applies for non-empty <code>Array</code> objects with
 *   at least a first non-undefined element as well as, e.g.,
 *   for DOM objects implementing one of the
 *   <code>HTMLCollection</code> or
 *   <code>HTMLOptionsCollection</code> interfaces defined in
 *   the W3C DOM Level 2 Specification.
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
 * @param s : string 
 *   String of the form "root['branch']['leaf']['...']..." or
 *   "root[branch][leaf][...]..." to be converted.  Required.
 * @return type string
 *   A string of the form `root.branch.leaf...' converted from
 *   <code>s</code>.
 */
function bracketsToDots(s)
{
  return s.replace(/\['?/g, '.').replace(/'?\]/g, '');
}

/**
 * @param s: string
 *   of the form `root.branch.leaf' to be converted.
 *   Required.
 * @param bStringsOnly: optional boolean
 *   Specifies if all parts of the tree should be converted
 *   or not.  Optional.
 *   If not provided or <code>false</code>, all parts are
 *   converted.  If <code>true</code>, only parts are converted
 *   that are required to (because JavaScript identifiers as
 *   required by dot notation must start with a character in
 *   <code>[A-Za-z_$]</code>, though arguments of bracket
 *   notation may be of any format.)
 * @return type string
 *   A string of the form "root['branch']['leaf']" converted
 *   from <code>s</code>.
 */
function dotsToBrackets(s, bStringsOnly)
{
  var a = s.split(".");
  s = [a[0]];
  
  for (var i = 1, len = a.length; i < len; i++)
  {
    if (!bStringsOnly)
    {
      s.push("['", a[i], "']");
    }
    else
    {
      if (/^[a-z_$]/i.test(a[i]))
      {
        s.push(".", a[i]);
      }
      else
      {
        s.push("[", a[i], "]");
      }
    }
  }
  
  return s.join("");
}

/**
 * Sets the handler for the proprietary <code>error</code> event.
 * 
 * NOTE: This method has previously been provided by {@link debug.js};
 * optimizations in code reuse moved it here.
 * 
 * @type boolean
 * @return <code>true</code> if the error handler could be assigned
 *   successfully, <code>false</code> otherwise.  Note that one reason
 *   for failure is that this event handler is no longer supported
 *   by the UA's DOM due to efforts towards adherence to Web standards.
 */ 
function setErrorHandler(fHandler)
{
  if (!fHandler) fHandler = clearErrorHandler;
  
  if (typeof window != "undefined" && typeof window.onerror != "undefined")
  {
    // debug.js 0.99.5.2006041101 BUGFIX:
    // onerror is defined as a property of window, not of the Global Object
    window.onerror = fHandler;
  }
  
  return (typeof window.onerror != "undefined"
    && window.onerror == fHandler);
}

/**
 * Clears the handler for the proprietary <code>error</code> event.
 * 
 * NOTE: This method has previously been provided by {@link debug.js};
 * optimizations in code reuse moved it here.
 * 
 * @type boolean
 * @return Always <code>true</code>
 */ 
function clearErrorHandler()
{
  if (typeof window != "undefined" && window.onerror)
  {
    // debug.js 0.99.5.2006041101 BUGFIX:
    // onerror is defined as a property of window, not of the Global Object
    window.onerror = null;
  }

  return true;
}

/**
 * Determines whether a property is likely to be callable.
 * 
 * @author
 *   (C) 2003-2008  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @params :optional Object|string|(Object,string)
 *   Objects to be determined a method, i.e. a
 *   <code>Function</code> object assigned as property of
 *   another object.  Each argument may also be a string
 *   to be evaluated and so is applicable to unknown properties.
 *   If an argument is followed by a string argument, it is
 *   assumed that the argument is the object and the string
 *   argument is the name of the property to be tested.
 * @return
 *   <code>true</code> if all arguments refer to methods,
 *   <code>false</code> otherwise.
 * @type boolean
 * @see isMethodType()
 */
function isMethod()
{
  for (var i = 0, len = arguments.length,
           rxMethod = /^\s*(function|object|unknown)\s*$/i;
       i < len; i++)
  {
    var arg = arguments[i];

    if (rxMethod.test(typeof arg) && arg
        && typeof arguments[i + 1] == "string")
    {
      // if the property is not a method
      if (!(rxMethod.test(typeof arg[arguments[i + 1]])
            && arg[arguments[i + 1]]))
      {
        return false;       
      }
      
      i++;
      continue;
    }
    
    if (typeof arg == "string") arg = eval(arg);

    // if the property is not a method
    if (!(rxMethod.test(typeof arg) && arg))
    {
      return false;
    }
  }
  
  return true;
}

function isMethod2()
{
  for (var i = 0, len = arguments.length; i < len; i++)
  {
    var arg = arguments[i];

    if (typeof arg == "string")
    {
      setErrorHandler();
      arg = eval(arg);
      clearErrorHandler();
    }
    else if (arg.constructor == Array)
    {
      setErrorHandler();
      var o = (typeof arg[0] == "string")
        ? eval(arg[0])
        : arg[0];
      clearErrorHandler();
      
      if (o && arg.length > 1)
      {     
        setErrorHandler();
        if (typeof o[arg[1]] == "string")
          arg = eval(o[arg[1]]);
        clearErrorHandler();
      }
      else
      {
        arg = 0;
      }
    }

    // if the property is not a method
    if (!(/\b(function|object)\b/i.test(typeof arg) && arg))
    {
      return false;
    }
  }
  
  return true;
}

/**
 * Determines whether a feature is available.
 * 
 * @author
 *   (C) 2008  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @param o: Object
 *   Base object
 * @params string
 *   Name(s) of the property/properties that are required for
 *   the feature.  For example, passing "foo" and "bar"
 *   determines whether o["foo"]["bar"] is an available feature.
 * @return
 *   The feature's value if the arguments refer to a feature,
 *   <code>false</code> otherwise.  Note that if a feature
 *   has type boolean, you should therefore not use this method
 *   to determine its availability.
 * @type boolean 
 */
function isFeature(o)
{
  if (typeof o != "undefined" && o)
  {
    for (var i = 1, len = arguments.length; i < len; i++)
    { 
      var arg = arguments[i];
      
      if (typeof o[arg] != "undefined" && o[arg])
      {
        o = o[arg];
      }
      else
      {
        o = null;
        break;
      }
    }
  }
  
  return o; 
}

/**
 * @param s: optional string
 *   String to be determined a method type, i.e. "object"
 *   or "unknown" in IE, "function" otherwise.  The type must
 *   have been retrieved with the `typeof' operator, thus this
 *   method is applicable to unknown properties while
 *   <code>isMethod()</code> is not.  Note that this method
 *   may also return <code>true</code> if the value of
 *   the <code>typeof</code> operand is <code>null</code>; to
 *   be sure that the operand is a method reference, you have
 *   to && (AND)-combine the <code>isMethodType(...)</code>
 *   expression with the method reference identifier.
 * @type boolean
 * @return
 *   <code>true</code> if <code>s</code> is a method type,
 *   <code>false</code> otherwise.
 * @author
 *   (C) 2003-2008  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 *   Distributed under the GNU GPL v3 and later.
 * @partof
 *   http://pointedears.de/scripts/types.js
 * @see isMethod()
 */
function isMethodType(s)
{
  return /^\s*(function|object|unknown)\s*$/i.test(s);
}
