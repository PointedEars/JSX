/**
 * <title>Basic Object Library</title>
 * @file object.js
 */
/* a more compatible approach */
if (typeof jsx == "undefined") var jsx = new Object();
jsx.object = new Object();
/** @version */ jsx.object.version = "0.1.5a.2009011819";
/**
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (C) 2004-2009  Thomas Lahn &lt;object.js@PointedEars.de&gt;
 */
jsx.object.copyright = "Copyright \xA9 2004-2009";
jsx.object.author    = "Thomas Lahn";
jsx.object.email     = "object.js@PointedEars.de";
jsx.object.path      = "http://pointedears.de/scripts/";
// jsx.object.docURL = jsx.object.path + "object.htm";

/** @deprecated since 0.1.5a.2009011819, see jsx.object */
Object.version   = jsx.object.version;
Object.copyright = jsx.object.copyright;
Object.author    = jsx.object.author;
Object.email     = jsx.object.email;
Object.path      = jsx.object.path;
// Object.docURL = jsx.object.docURL;

/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public Licnse
 * as published by the Free Software Foundation; either version 2O
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

/* allows de.pointedears.jsx.object */
if (typeof de == "undefined") var de = new Object();
if (typeof de.pointedears == "undefined") de.pointedears = new Object();
de.pointedears.jsx = jsx;

if (typeof _global == "undefined") var _global = this;

/*
 * NOTE: Cannot use addProperties() for the following
 * because values have not been defined yet!
 */

/**
 * @property number
 *   Used by {@link #addProperties()} to overwrite existing
 *   properties.
 */
jsx.object.ADD_OVERWRITE = 1;

/**
 * @property number
 *   Used by {@link #addProperties()} and {@link #clone()}
 *   to make a shallow copy of all enumerable properties (default).
 */
jsx.object.COPY_ENUM = 0;

/**
 * @property number
 *   Used by {@link #addProperties()} and {@link #clone()}
 *   to make a deep copy of all enumerable properties.
 */
jsx.object.COPY_ENUM_DEEP = 2;

/**
 * @property number
 *   Used by {@link #addProperties()} and {@link #clone()}
 *   to copy a property by inheritance.
 */
jsx.object.COPY_INHERIT = 4;

/** @deprecated since 0.1.5a.2009011819 */
Object.ADD_OVERWRITE  = jsx.object.ADD_OVERWRITE;
Object.COPY_ENUM      = jsx.object.COPY_ENUM;
Object.COPY_ENUM_DEEP = jsx.object.COPY_ENUM_DEEP;
Object.COPY_INHERIT   = jsx.object.COPY_INHERIT;

/**
 * Adds/replaces properties of an object.
 *
 * @prototype method
 * @param oSource : Object 
 *   Object specifying the properties to be added/replaced.
 *   The name of each property serves as the name for the
 *   property of the target object, its value as the value
 *   of that property.
 * @param iFlags : optional number 
 *   Flags for the modification, see {@link Object#ADD_OVERWRITE
 *   ADD_*} and {@link Object#COPY_ENUM COPY_*}.
 * @param oOwner : optional Object 
 *   If provided, used as target object instead of the
 *   calling object.  This makes it possible to call
 *   the method without an explicit calling object.
 */
function addProperties(oSource, iFlags, oOwner)
{
  if (/^\s*(object|function)\s*$/i.test(typeof iFlags))
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
    if (typeof oOwner[p] == "undefined" || (iFlags & jsx.object.ADD_OVERWRITE))
    {
      oOwner[p] = jsx.object.clone(
        iFlags & (jsx.object.COPY_ENUM_DEEP | jsx.object.COPY_INHERIT),
        oSource[p]);
      oOwner[p].userDefined = true;
    }
  }
}
jsx.object.addProperties = addProperties;

/**
 * Creates a duplicate (clone) of an object.
 *
 * @param iLevel : optional number
 *   Use the {@link Object#COPY_ENUM Object.COPY_*}
 *   properties to specify the level of cloning.
 * @param oSource : optional Object 
 *   Reference to the object to be cloned.
 *   If omitted, the calling object is cloned.
 * @return Object
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
  
  var me = arguments.callee;

  if (!iLevel || (iLevel & jsx.object.COPY_ENUM_DEEP))
  {
    /* TODO: For objects, valueOf() only copies the object reference */
    var o2 = oSource.valueOf(), c, i;

    /* just in case "var i in ..." does not copy the array elements */
    if (typeof Array != "undefined" && (c = o2.constructor) && c == Array)
    {
      for (i = oSource.length; i--;)
      {
        if (iLevel && typeof oSource[i] == "object")
        {
          o2[i] = me(iLevel, oSource[i]);
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
        o2[i] = me(iLevel, oSource[i]);
      }
      else
      {
        o2[i] = oSource[i];
      }
    }
    
    return o2;
  }
  else if (iLevel & jsx.object.COPY_INHERIT)
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
jsx.object.clone = clone;

/**
 * @param o : Object
 * @param iLength : number 
 *   Maximum property name length up to which an unused name
 *   is searched.  The default is 256. 
 * @return string
 *   The name of a non-existing property of <code>o</code> if
 *   {@link Object#prototype.hasOwnProperty()} is supported, or
 *   the name of a property with value <code>undefined</code>
 *   if it is not supported; the empty string
 *   if there is no such property.
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
      if (!jsx.object._hasOwnProperty(o, s + c))
      {
        return s + c;
      }
    }

    s += "a";
  }
  
  return "";
}
jsx.object.findNewProperty = findNewProperty;

/**
 * Sets the handler for the proprietary <code>error</code> event.
 * 
 * NOTE: This method has previously been provided by {@link debug.js};
 * and {@link types.js}; optimizations in code reuse moved it here.
 * 
 * @param fHandler : Callable
 * @return boolean
 *   <code>true</code> if the error handler could be assigned to
 *   successfully, <code>false</code> otherwise.  Note that one reason
 *   for failure can be that an event handler is no longer supported
 *   by the UA's DOM due to efforts towards adherence to Web standards.
 */ 
function setErrorHandler(fHandler)
{
  /*
   * NOTE: There is no deadlock here because even if `fHandler' is a string, 
   * `isMethod(fHandler)' will call `setErrorHandler()' without arguments;
   * so fHandler in that call will be `undefined' and `setErrorHandler()'
   * is not called again.
   */
  if (!isMethod(fHandler)) fHandler = jsx.clearErrorHandler;
  
  if (typeof window != "undefined" && typeof window.onerror != "undefined")
  {
    /*
     * debug.js 0.99.5.2006041101 BUGFIX:
     * onerror is defined as a property of window, not of the Global Object
     */
    window.onerror = fHandler;
  }
  
  return (typeof window.onerror != "undefined"
          && window.onerror == fHandler);
}
jsx.setErrorHandler = setErrorHandler;

/**
 * Clears the handler for the proprietary <code>error</code> event.
 * 
 * NOTE: This method has previously been provided by {@link debug.js};
 * optimizations in code reuse moved it here.
 * 
 * @return boolean <code>true</code>
 */ 
function clearErrorHandler()
{
  if (typeof window != "undefined" && window.onerror)
  {
    /*
     * debug.js 0.99.5.2006041101 BUGFIX:
     * onerror is defined as a property of window, not of the Global Object
     */
    window.onerror = null;
  }

  return true;
}
jsx.clearErrorHandler = clearErrorHandler; 

/**
 * Wrapper for a safer <code>try</code>...<code>catch</code>. 
 * 
 * Attempts to evaluate a value as a <i>StatementList</i>, and attempts
 * to evaluate another value as a <i>StatementList</i> if an exception
 * is thrown in the process.  The following words may be used within:
 * 
 * <table>
 *   <thead>
 *     <tr>
 *       <th align="left">Word</th>
 *       <th align="left">Refers to</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr valign="top">
 *       <td><code>statements</code><br>
 *           <code>errorHandlers</code></td>
 *       <td>the passed values</td>
 *     </tr>
 *     <tr valign="top">
 *       <td>code</td>
 *       <td>the entire constructed <code>try</code>...<code>catch</code>
 *           string that is evaluated as a <i>Program</i></td>
 *     </tr>
 *     <tr valign="top">
 *       <td>e</td>
 *       <td>Only within <var>errorHandlers</var>:
 *           the value thrown in case of an exception</td>
 *     </tr>
 *   </tbody>
 * </table>
 *   
 * NOTE: This method has previously been provided by {@link exception.js};
 * optimizations in code reuse moved it here.
 * 
 * @param statements 
 *   Value to be evaluated as a <i>StatementList</i>.
 *   Called if a <code>Function</code> object reference, converted
 *   to string if not a string, and used as-is otherwise.
 *   For compatibility, the <code>undefined</code> value
 *   is evaluated like the empty string. 
 * @param errorHandlers
 *   Value to be evaluated as a <i>StatementList</i> in case of an
 *   exception.  Called if a <code>Function</code> object reference,
 *   converted to string if not a string, and used as-is otherwise.
 *   For compatibility, the <code>undefined</code> value
 *   is evaluated like the empty string.
 * @return
 *   The result of <code>statements</code>, or the result
 *   of <code>errorHandlers</code> if an error occurred. 
 * @author
 *   Copyright (c) 2008
 *   Thomas 'PointedEars' Lahn &lt;js@PointedEars.de&gt;
 *   Distributed under the GNU GPL v3 and later.
 * @partof JSX:object.js
 */
function tryThis(statements, errorHandlers)
{
  /**
   * @param s Value to be stringified
   * @param sIdent Identifier of the value to be stringified
   * @return string Stringified version of <code>s</code>
   */
  function stringify(s, sIdent)
  {
    if (typeof s == "function")
    {
      s = sIdent || "(" + s + ")()";
    }
    else if (typeof s == "undefined")
    {
      s = "";
    }
    
    return s;
  }
  
  var sStatements = stringify(statements, "statements();");
  var sErrorHandlers = stringify(errorHandlers, "errorHandlers(e);");
  
  var code = 'try {\n  ' + sStatements + '\n}\n'
           + 'catch (e) {\n  ' + sErrorHandlers + '\n}';
  
  return eval(code);
}
jsx.tryThis = tryThis;

/**
 * Throws a qualified exception, including an execution context hint
 * if provided, followed by an error message.
 *   
 * NOTE: This method has previously been provided by {@link exception.js};
 * optimizations in code reuse moved it here.
 *
 * @param errorType : string
 *   Identifier of the constructor for the error type
 * @param sMessage : string
 *   Error message to be displayed
 * @param context : Callable|string
 *   Optional callable object to specify the context
 *   where the exception occurred.
 * @author 
 *   Copyright (c) 2008 Thomas 'PointedEars' Lahn <cljs@PointedEars.de>.
 *   Distributed under the GNU GPL v3 and later.
 * @partof JSX:object.js 
 * @see #isMethodType()
 */
function throwException(errorType, sMessage, context)
{
  var t, sErrorType = errorType;
  if (jsx.object.isMethodType((t = typeof errorType))
      && !/^\s*unknown\s*$/i.test(t)
      && errorType)
  {
    sErrorType = "(" + errorType + ")";
  }
  
  var sContext;
  if (jsx.object.isMethod("Error"))
  {
    var stack = (new Error()).stack;
    if (stack)
    {
      sContext = stack + "\n";      
    }
  }
  
  /* DEBUG: set breakpoint here */
  if (!sContext)
  {
    if (jsx.object.isMethodType((t = typeof context))
        && !/^\s*unknown\s*$/i.test(t)
        && context)
    {
      sContext = (String(context).match(/^\s*(function[^)]+\))/)
                   || [, null])[1];
      sContext = sContext ? sContext + ': ' : '';
    }
  }

  var message = (sContext || "") + (sMessage || "");

  /* DEBUG */
  var throwStmt = '  throw new ' + sErrorType + '("'
                + message.replace(/["\\]/g, "\\$&").replace(/\r?\n|\r/g, "\\n")
                + '");';
  
  eval(throwStmt);
  
//  eval(
//      'try'
//    + '{'
//    // throw so that we can try obtaining a stack trace
//    + throwPrefix + '");'
//    + '}'
//    + 'catch (e)'
//    + '{'
//    + '  var stack = e.stack;'
//    + '  if (typeof stack == "string")'
//    + '  {'
//    // re-throw with stack trace if available
//    + throwPrefix + '\\nStack trace:" + stack.split("\\n").reverse().slice(0, stack.length - 3).join("\\n"));'
//    + '  }'
//    + '  else'
//    + '  {'window.alert
//    + throwPrefix + '");'
//    + '  }'
//    + '}');
}
jsx.throwException = throwException;

/* Alias; may replace the original later */
var throwThis = jsx.throwThis = throwException;

/**
 * Determines whether a property is likely to be callable.
 * 
 * @author
 *   (C) 2003-2009  Thomas Lahn &lt;object.js@PointedEars.de&gt;
 * @param o : Object|string
 *   Reference to an object or a primitive string value that evaluates
 *   to an object. 
 * @params : optional string
 *   Path of the property to be determined a method, i.e. a reference to
 *   a callable object object assigned as property of another object.
 *   Use a string argument for each component of the path, e.g.
 *   the argument list <code>(o, "foo", "bar")</code> for testing whether
 *   <code>o.foo.bar</code> is a method.
 * @return boolean
 *   <code>true</code> if all arguments refer to methods,
 *   <code>false</code> otherwise.
 * @see #isMethodType()
 */
function isMethod(o)
{
  var len = arguments.length;
  if (len < 1) return false;
  
  /*
   * Only consider strings that could be property accessors (incl. E4X)
   * TODO: Unicode identifiers
   */
  if (typeof o == "string"
      && /^\s*\w+(\s*\.\.?\s*\w+|\[[^]]+\])*\s*$/.test(o))
  {
    o = jsx.tryThis(o);
  } 
  
  var rxUnknown = /^\s*unknown\s*$/i;
  if (!(rxUnknown.test(typeof o) || o)) return false;
    
  for (var i = 1; i < len; i++)
  {
    var p = arguments[i];
    var t = typeof o[p];
    var rxMethod = /^\s*(function|object|unknown)\s*$/i;
    
    if (rxMethod.test(t) && (rxUnknown.test(t) || o[p]))
    {
      if (i < len - 1)
      {
        o = o[p];
        if (!(rxUnknown.test(typeof o) || o)) return false;
      }
    }
    else
    {
      return false;
    }
  }
  
  return true;
}
jsx.object.isMethod = isMethod;

/**
 * NOTE: This method has previously been provided by {@link types.js};
 * optimizations in code reuse moved it here.
 *
 * @param s : optional string
 *   String to be determined a method type, i.e. "object" or "unknown" in
 *   MSHTML, "function" otherwise.  The type must have been retrieved with
 *   the `typeof' operator.  Note that this method may also return
 *   <code>true</code> if the value of the <code>typeof</code> operand is
 *   <code>null</code>; to be sure that the operand is a method reference,
 *   you have to && (AND)-combine the <code>isMethodType(...)</code>
 *   expression with the method reference identifier unless `typeof' yielded
 *   `unknown' for <var>s</var>.
 * @return boolean
 *   <code>true</code> if <var>s</var> is a method type,
 *   <code>false</code> otherwise.
 * @author
 *   (C) 2003-2008  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 *   Distributed under the GNU GPL v3 and later.
 * @partof
 *   http://pointedears.de/scripts/types.js
 * @see object.js.Global#isMethod()
 */
function isMethodType(s)
{
  return /^\s*(function|object|unknown)\s*$/i.test(s);
}
jsx.object.isMethodType = isMethodType;

/**
 * @param o : optional Object
 *   Object which property should be checked for existence.
 * @param p : string
 *   Name of the property to check.
 * @return boolean
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

  /* see debug.js */
  // printfire(o);
  // printfire(sProperty);

  /*
   * BUG: "Unhandled exception on WrappedNative prototype object" in
   * Firefox 1.5.0.1 and 2.0.0.7, cannot be handled with try..catch
   * 
   * Stack trace
   * ------------
   * o.hasOwnProperty(sProperty)
   * object.js:_hasOwnProperty
   * debug.js:1347
   * objinsp.js:showProperties
   */

  /* ECMAScript Edition 3 */
  if (jsx.object.isMethod(o, "hasOwnProperty"))
  {
    return o.hasOwnProperty(p);
  }

  /* Object itself *supposedly* doesn't have the property */
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

    /* other, incl. JScript 1.1 to 4.0 */
    return (typeof o.constructor.prototype[p] == "undefined");
  }

  /* Object itself has the property */
  return true;
}
jsx.object._hasOwnProperty = _hasOwnProperty;

/**
 * @param o : Object 
 * @param p : string
 * @param aDefault
 * @return mixed
 * @throws Error
 */
function getattr(o, p, aDefault)
{
  if (typeof o[p] != "undefined")
  {
    return o[p];
  }
  else if (typeof aDefault != "undefined")
  {
    return aDefault;
  }
  else
  {
    throw new Error("unknown property: " + p);
  }
}
jsx.object.getattr = getattr;

/* Disabled until ECMAScript allows to hide properties from iteration */
//addProperties({
//    addProperties  : addProperties,
//    clone          : clone,
//    findNewProperty: findNewProperty,
//    _hasOwnProperty: _hasOwnProperty
//  },
//  Object.prototype);

/**
 * Inherits one object from another.
 *
 * @param o : optional Object
 *   Object from which to inherit.
 * @return Object
 *   Reference to the child object.
 */
function inheritFrom(o)
{
  function Dummy() {}
  Dummy.prototype = o;
  return new Dummy();
}
jsx.object.inheritFrom = inheritFrom;

if (jsx.object.isMethod(this, "eval"))
{
  /*
   * KJS 3.5.1 does not support named FunctionExpressions within Object
   * literals if the literal is an AssignmentExpression (right-hand side
   * of an assignment or a passed function argument).
   * fixed since <http://bugs.kde.org/show_bug.cgi?id=123529>
   */

  jsx.object.addProperties(
    {
      /**
       * Applies a method of another object in the context
       * of a different object (the calling object).
       *
       * @prototype method
       * @param thisArg : object 
       *   Reference to the calling object.
       * @param argArray : Array
       *   Arguments for the object.
       */
      apply: function(thisArg, argArray) {
        var a = new Array();
        for (var i = 0, len = argArray.length; i < len; i++)
        {
          a[i] = "argArray[" + i + "]";
        }
    
        if (!thisArg) thisArg = _global;
        var o = new Object(), p = jsx.object.findNewProperty(o);
        if (p)
        {
          o[p] = this;
          eval("o[p](" + a.join(", ") + ")");
          delete o[p];
          o = null;
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
      call: function(thisArg) {
        var a = new Array();
        for (var i = 1, len = arguments.length; i < len; i++)
        {
          a[i] = "arguments[" + i + "]";
        }
    
        if (!thisArg) thisArg = _global;
        var o = new Object(), p = jsx.object.findNewProperty(o);
        if (p)
        {
          o[p] = this;
          eval("o[p](" + a.slice(1).join(", ") + ")");
          delete o[p];
          o = null;
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
 * @return boolean
 *   <code>true</code> if successful, <code>false</code> otherwise.
 */
Function.prototype.extend =
function function_extend(Constructor, oProtoProps) {
  function Dummy() {};
  
  if (typeof Constructor.valueOf() == "string")
  {
    Constructor = _global[Constructor];
  }
  
  if (typeof Constructor != "function") return false;

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
  
  /* PERF: for (var p in o.iterator()) is rather inefficient */
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
        case "forEach":
          break;          
        
        default:
          o[p2] = true;
      }
    }    

    return o;
  };
  
  if (!jsx.object.isMethod(this.prototype, "forEach"))
  {
    /**
     * Calls a function for each real property of the object
     * in arbitrary order.  Workaround for for..in iteration
     * on objects with augmented prototype object. 
     * 
     * @param f : Function
     * @param thisObj : optional Object
     * @throws TypeError
     */
    this.prototype.forEach = function(fCallback, thisObj) {
      var t;
      if (!jsx.object.isMethodType((t = typeof fCallback)) || !fCallback)
      {
        jsx.throwException(
          "TypeError",
          (!/^\s*unknown\s*$/i.test(t) ? fCallback : "arguments[0]")
            + " is not a function",
          this + ".forEach");
      }
      
      for (var p in this)
      {
        switch (p)
        {
          case "_super":
          case "constructor":
          case "userDefined":
          case "iterator":
          case "forEach":           
            break;          
            
          default:
            fCallback.call(thisObj, this[p], p, this);
        }
      }
    };
  }
    
  return true;
};
  
/**
 * @param s : string
 * @param sType : string
 */
function Exception(s, sType)
{
  var e = new Error((sType || "Exception") + ": " + s);
  e.getMessage = function() { return this.message; };
  e.getStackTrace = function() { return this.stack; };
  e.printStackTrace = function() { window.alert(this.getStackTrace()); };
  return e;
}
jsx.Exception = Exception;

/**
 * @param s
 * @extends Exception
 */
function ObjectException(s)
{
  return jsx.Exception(s, "ObjectException");
}
jsx.object.ObjectException = ObjectException;

/**
 * Raises an ObjectException
 *
 * @param sMsg : optional string
 * @return boolean <code>false</code>
 */
function objectException(sMsg)
{
  window.alert(
    "object.js "
      + jsx.object.version
      + "\n"
      + jsx.object.copyright
      + "  "
      + jsx.object.author
      + " <"
      + jsx.object.email
      + ">\n\n"
      + sMsg);

  return false;
}
objectException.userDefined = true;
jsx.object.objectException = objectException;