/**
 * <title>Object Library</title>
 */
/** @version */ Object.version   = "0.1.5a.2008052912";
/**
 * @file object.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (C) 2004-2008  Thomas Lahn &lt;object.js@PointedEars.de&gt;
 */
Object.copyright = "Copyright \xA9 2004-2008";
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
 * @argument oSource : Object 
 *   Object specifying the properties to be added/replaced.
 *   The name of each property serves as the name for the
 *   property of the target object, its value as the value
 *   of that property.
 * @param iFlags : optional number 
 *   Flags for the modification, see @{#Object.ADD_OVERWRITE,
 *   ADD_*} and @{#Object.COPY_ENUM, COPY_*}.
 * @param oOwner : optional Object 
 *   If provided, used as target object instead of the
 *   calling object.  This makes it possible to call
 *   the method without an explicit calling object.
 */
function addProperties(oSource, iFlags, oOwner)
{
  
  if (/\b(object|function)\b/i.test(typeof iFlags))
  {
    oOwner = iFlags;
    iFlags = 0;
  }


  if (!oOwner)
  {
    oOwner = this;
  }

  for (var p in oSource)
  {
    if (typeof oOwner[p] == "undefined"
        || (iFlags & Object.ADD_OVERWRITE))
    {
      oOwner[p] = clone(
        iFlags & (Object.COPY_ENUM_DEEP | Object.COPY_INHERIT),
        oSource[p]);
      oOwner[p].userDefined = true;
    }
  }
}

/**
 * Creates a duplicate (clone) of an object.
 *
 * @param iLevel : optional number
 *   Use the <code>Object.COPY_*</code>
 *   properties to specify the level of cloning.
 * @param oSource : optional Object 
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
    // TODO: For objects, valueOf() only copies the object reference
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
    var Dummy = function() {};
    Dummy.prototype = oSource;
    return new Dummy();
  }
  else
  {
    return null;
  }
}


/**
 * @argument Object o
 * @argument number iLength
 *   Maximum property name length up to which an unused name
 *   is searched.  The default is 256. 
 * @type string
 * @returns 
 *   The name of a non-existing property of o if
 *   @{Object.hasOwnProperty()} is supported, or
 *   the name of a property with value `undefined'
 *   if it is not supported; the empty string
 *   if there is no such property.
 * @TODO
 *   Currently only one-letter property names
 *   are searched for and supported.
 */
function findNewProperty(o, iLength)
{
  if (!o)
  {
    o = this;
  }

  if (arguments.length < 2)
  {
    iLength = 256;
  }
  else
  {
    iLength = parseInt(iLength, 10);
  }

  var s = "";
  
  while (s.length < iLength)
  {
    for (var i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++)
    {
      var c = String.fromCharCode(i);
      if (!_hasOwnProperty(o, s + c))
      {
        return s + c;
      }
    }

    s += c;
  }
  
  return "";
}

/**
 * Determines whether a property is likely to be callable.
 * 
 * @author
 *   (C) 2003-2008  Thomas Lahn &lt;object.js@PointedEars.de&gt;
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
 * @type Boolean
 * @see isMethodType()
 */
function isMethod()
{
  for (var i = 0, len = arguments.length,
           rxMethod = /\b(function|object|unknown)\b/i;
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

/**
 * @optional Object o
 *   Object which property should be checked for existence.
 * @argument string sProperty
 *   Name of the property to check.
 * @return type boolean
 *   <code>true</code> if there is such a property;
 *   <code>false</code> otherwise.
 */
function _hasOwnProperty(o, p)
{
  if (arguments.length < 2 && o)
  {
    sProperty = o;
    o = this;
  }

  // see debug.js
  // printfire(o);
  // printfire(sProperty);

  // BUG: "Unhandled exception on WrappedNative prototype object" in
  // Firefox 1.5.0.1 and 2.0.0.7, cannot be handled with try..catch
  // 
  // Stack trace
  // ------------
  // o.hasOwnProperty(sProperty)
  // object.js:_hasOwnProperty
  // debug.js:1347
  // objinsp.js:showProperties

  // ECMAScript Edition 3
  if (isMethod(o, "hasOwnProperty"))
  {
    return o.hasOwnProperty(p);
  }
  else
  {
    // Object itself *supposedly* doesn't have the property
    if (typeof o[p] == "undefined")
    {
      // JavaScript 1.0 to 1.3
      if (typeof o.__proto__ != "undefined")
      {
        var hasP = false;
        while ((o = o.__proto__))
        {
          if (typeof o[p] != "undefined")
          {
            hasP = true;
            break;
          }
        }

        return hasP;
      }

      // other, incl. JScript 1.1 to 4.0
      else
      {
        return (typeof o.constructor.prototype[p] == "undefined");
      }
    }

    // Object itself has the property
    else
    {
      return true;
    }
  }
}

// Disabled until ECMAScript allows to hide properties from iteration
/*
addProperties({
    addProperties  : addProperties,
    clone          : clone,
    findNewProperty: findNewProperty,
    _hasOwnProperty: _hasOwnProperty
  },
  Object.prototype);
*/

/**
 * Inherits one object from another.
 *
 * @optional object o
 *   Object from which to inherit.
 * @return type object
 *   Reference to the child object.
 */
function inheritFrom(o)
{
  function Dummy() {};
  Dummy.prototype = o;
  return new Dummy();
}

if (isMethod(this, "eval"))
{
  // KJS 3.5.1 does not support named FunctionExpressions within Object
  // literals if the literal is an AssignmentExpression (right-hand side
  // of an assignment or a passed function argument).

  addProperties(
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
      apply: function(thisArg, argArray)
      {
        var a = new Array();
        for (var i = 0, len = argArray.length; i < len; i++)
        {
          a[i] = "argArray[" + i +"]";
        }
    
        var p = findNewProperty(thisArg);
        if (p && (thisArg[p] = this))
        {
          eval("thisArg[p](" + a.join(", ") + ")");
          delete thisArg[p];
        }
      },
  
      /**
       * Calls (executes) a method of another object in the
       * context of a different object (the calling object).
       *
       * @argument object thisArg
       *   Reference to the calling object.  SHOULD
       *   be a host object, since augmentation is required.
       * @arguments _ _
       *   Arguments for the object.
       */
      call: function(thisArg)
      {
        var a = new Array();
        for (var i = 1, len = arguments.length; i < len; i++)
        {
          a[i] = "arguments[" + i + "]";
        }
    
        var p = findNewProperty(thisArg);
        if (p && (thisArg[p] = this))
        {
          eval("thisArg[p](" + a.join(", ") + ")");
          delete thisArg[p];
        }
      }
    },
    Function.prototype);
}

/**
 * Includes the prototype object of another object
 * in the prototype chain of objects created through
 * the current Function object.
 * 
 * Used with constructors to establish prototype-based
 * inheritance (much like class-based inheritance in Java).
 * Be sure to call the parent's constructor then within
 * the constructor of the child, using the call() method
 * (or calling it as a method of the inheriting prototype),
 * else changes in the parent will not affect the child.
 * 
 * @param Constructor : Function  
 *   Constructor from which prototype object should be
 *   inherited.
 * @param oProtoProps : Object
 *   Object from which to shallow-copy properties as prototype
 *   properties.  Of those, the <code>_super</code>,
 *   <code>constructor</code>, and <code>userDefined</code>
 *   properties are ignored as they are used internally.
 * @type boolean
 * @returns
 *   <code>true</code> if successful, <code>false</code> otherwise.
 */
Function.prototype.extend =
function function_extend(Constructor, oProtoProps) {
  /**
   * @return
   */
  function Dummy() {};
  
  if (typeof Constructor == "function")
  {
    Dummy.prototype = Constructor.prototype;
    this.prototype = new Dummy();
    
    if (oProtoProps)
    {
      for (var p in oProtoProps)
      {
        this.prototype[p] = oProtoProps[p];
      }
    }
    
    this.prototype._super = Constructor;
    this.prototype.constructor = this;
    this.userDefined = true;
    
    this.prototype.iterator = function() {
      var o = new Object();
      
      for (var p2 in this)
      {
        switch (p2)
        {
          case "_super":
          case "constructor":
          case "userDefined":
          case "iterator":
            break;          
          
          default:
            o[p2] = true;
        }
      }    

      return o;
    };
    
    return true;
  }
  
  return false;
};
  
function Exception(s, sType)
{
  var e = new Error((sType || "Exception") + ": " + s);
  e.getMessage = function() { return this.message; };
  e.getStackTrace = function() { return this.stack; };
  e.printStackTrace = function() { alert(this.getStackTrace()); };
  return e;
}

/**
 * @extends Exception
 */
function ObjectException(s)
{
  return Exception(s, "ObjectException");
}

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
objectException.userDefined = true;