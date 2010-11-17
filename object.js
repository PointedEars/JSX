/**
 * <title>Basic Object Library</title>
 * @file object.js
 * 
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (C) 2004-2010  Thomas Lahn &lt;js@PointedEars.de&gt;
 * 
 * This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* a more compatible approach */
if (typeof jsx == "undefined")
{
  var jsx = {};
}

jsx.object = {
  /** @version */
  version:   "0.2.0.2010111614",
  copyright: "Copyright \xA9 2004-2010",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://PointedEars.de/scripts/"
};

// jsx.object.docURL = jsx.object.path + "object.htm";

/** @deprecated since 0.1.5a.2009011819, see jsx.object */
Object.version   = jsx.object.version;
Object.copyright = jsx.object.copyright;
Object.author    = jsx.object.author;
Object.email     = jsx.object.email;
Object.path      = jsx.object.path;
// Object.docURL = jsx.object.docURL;

/* allows for de.pointedears.jsx.object */
if (typeof de == "undefined")
{
  var de = {};
}

if (typeof de.pointedears == "undefined")
{
  de.pointedears = {};
}

de.pointedears.jsx = jsx;

if (typeof _global == "undefined")
{
  /**
   * @var Global
   * @deprecated
   *   since 0.1.5a.2009063012 in favor of {@link jsx.global}
   *   for library references
   */
  var _global = this;
}

/**
 * @property Global
 *   Reference to the ECMAScript Global Object
 */
jsx.global = _global;

/*
 * NOTE: Cannot use addProperties() for the following
 * because values have not been defined yet!
 * 
 * TODO: Should syntactic sugar be provided to work around
 * this issue?  See Function.prototype.extend().
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
 * Prints debug messages to the script console.
 * 
 * NOTE: This method has previously been provided by
 * {@link debug.js}; optimizations in code reuse
 * moved it here.
 *
 * @param sMsg : string
 *   Message to be printed
 * @param sType : optional string = "log"
 *   Type of the message.  Supported values include
 *   <code>"log"</code> (default), <code>"info"</code>, <code>"warn"</code>,
 *   and <code>"debug"</code>.  If a script console does not support
 *   a message type, the default value is used.
 */
var printfire = jsx.dmsg = (function () {
  var
    jsx_object = jsx.object,
    msgMap = {
      data: {
        info: "INFO",
        warn: "WARNING",
        debug: "DEBUG"
      },
      
      getString: function (s) {
        var data = this.data;
        
        if (typeof data[s] != "undefined")
        {
          return data[s] + ": ";
        }
        else
        {
          return "";
        }
      }
    };
  
  return function (sMsg, sType) {
    /* Firebug 0.4+ and others */
    if (typeof console != "undefined")
    {
      if (!sType || !jsx_object.isMethod(console, sType) && sType != "log")
      {
        sMsg = msgMap.getString(sType) + sMsg;
        sType = "log";
      }
      
      if (jsx_object.isMethod(console, sType))
      {
        /* MSHTML's console methods do not implement call() */
        Function.prototype.call.call(console[sType], console, sMsg);
        return true;
      }
    }
    else if (typeof opera != "undefined"
              && jsx_object.isMethod(opera, "postError"))
    {
      opera.postError(msgMap.getString(sType) + sMsg);
    }
    
    return false;
  };
}());

/**
 * Adds/replaces properties of an object
 *
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
var addProperties = jsx.object.addProperties = (function () {
  var
    rxObject = /^\s*(object|function)\s*$/i,
    jsx_object = jsx.object,
    ADD_OVERWRITE = jsx_object.ADD_OVERWRITE,
    COPY_ENUM_DEEP = jsx_object.COPY_ENUM_DEEP,
    COPY_INHERIT = jsx_object.COPY_INHERIT;
  
  return function (oSource, iFlags, oOwner) {
    if (rxObject.test(typeof iFlags))
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
      if (typeof oOwner[p] == "undefined" || (iFlags & ADD_OVERWRITE))
      {
        jsx.tryThis(function() { 
          oOwner[p] = jsx_object.clone(
            iFlags & (COPY_ENUM_DEEP | COPY_INHERIT),
            oSource[p]);
          oOwner[p].userDefined = true;
        });
      }
    }
  };
}());

/**
 * Lets one object inherit from another
 *
 * @param o : optional Object
 *   Object from which to inherit
 * @return Object
 *   Inheriting (child) object
 */
var inheritFrom = jsx.object.inheritFrom = (function () {
  function Dummy() {}
  
  return function (o) {
    Dummy.prototype = o;
    return new Dummy();
  };
}());

/**
 * Creates a duplicate (clone) of an object
 *
 * @param iLevel : optional number
 *   Use the {@link Object#COPY_ENUM Object.COPY_*}
 *   properties to specify the level of cloning.
 * @param oSource : optional Object
 *   Object to be cloned.  If omitted, the calling object is cloned.
 * @return Object
 *   A reference to the clone.
 */
var clone = jsx.object.clone = (function () {
  var
    jsx_object = jsx.object,
    COPY_ENUM_DEEP = jsx_object.COPY_ENUM_DEEP,
    COPY_INHERIT = jsx_object.COPY_INHERIT;
  
  return function (iLevel, oSource) {
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
  
    if (!iLevel || (iLevel & COPY_ENUM_DEEP))
    {
      /* TODO: For objects, valueOf() only copies the object reference */
      var i,
        o2 = oSource.valueOf();
  
      /* just in case "var i in ..." does not copy the array elements */
      if (typeof Array != "undefined" && o2.constructor == Array)
      {
        for (i = oSource.length; i--;)
        {
          if (iLevel && typeof oSource[i] == "object")
          {
            jsx.tryThis(function() { o2[i] = me(iLevel, oSource[i]); });
          }
          else
          {
            jsx.tryThis(function() { o2[i] = oSource[i]; });
          }
        }
      }
  
      for (i in oSource)
      {
        if (iLevel && typeof oSource[i] == "object")
        {
          jsx.tryThis(function() { o2[i] = me(iLevel, oSource[i]); });
        }
        else
        {
          jsx.tryThis(function() { o2[i] = oSource[i]; });
        }
      }
      
      return o2;
    }
    else if (iLevel & COPY_INHERIT)
    {
      return jsx_object.inheritFrom(oSource);
    }
  
    return null;
  };
}());

/**
 * Returns the name of an unused property for an object.
 * 
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
var findNewProperty = jsx.object.findNewProperty = (function () {
  var jsx_object = jsx.object;
  
  return function (o, iLength) {
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
      for (var i = "a".charCodeAt(0), max = "z".charCodeAt(0); i <= max; ++i)
      {
        var c = String.fromCharCode(i);
        if (!jsx_object._hasOwnProperty(o, s + c + "_"))
        {
          return s + c + "_";
        }
      }
  
      s += "a";
    }
    
    return "";
  };
}());

/**
 * Clears the handler for the proprietary <code>error</code> event.
 * 
 * NOTE: This method has previously been provided by {@link debug.js};
 * optimizations in code reuse moved it here.
 * 
 * @return boolean <code>true</code>
 */
/*
 * NOTE: Initialization must come before the initialization of
 *       setErrorHandler() as it is used in a closure there,
 *       see Message-ID <2152411.FhMhkbZ0Pk@PointedEars.de>
 */
var clearErrorHandler = jsx.clearErrorHandler = function () {
  if (typeof window != "undefined" && window.onerror)
  {
    /*
     * debug.js 0.99.5.2006041101 BUGFIX:
     * onerror is defined as a property of window, not of the Global Object
     */
    window.onerror = null;
  }

  return true;
};

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
var setErrorHandler = jsx.setErrorHandler = (function () {
  var
    jsx_object = jsx.object,
    jsx_clearErrorHandler = jsx.clearErrorHandler;
  
  return function (fHandler) {
    /*
     * NOTE: There is no deadlock here because even if `fHandler' is a string,
     * `isMethod(fHandler)' will call `setErrorHandler()' without arguments;
     * so fHandler in that call will be `undefined' and `setErrorHandler()'
     * is not called again.
     */
    if (!jsx_object.isMethod(fHandler))
    {
      fHandler = jsx_clearErrorHandler;
    }
    
    if (typeof assertFalse == "function")
    {
      assertFalse(typeof fHandler == "undefined", false,
        "jsx.setErrorHandler(fHandler)");
    }
    
    if (typeof window != "undefined"
        && typeof window.onerror != "undefined"
        && typeof fHandler != "undefined")
    {
      /*
       * debug.js 0.99.5.2006041101 BUGFIX:
       * onerror is defined as a property of window, not of the Global Object
       */
      window.onerror = fHandler;
    }
    
    return (typeof window.onerror != "undefined"
            && window.onerror == fHandler);
  };
}());

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
 *   Called if a <code>Function</code>, converted
 *   to string if not a string, and used as-is otherwise.
 *   For compatibility, the <code>undefined</code> value
 *   is evaluated like the empty string.
 * @param errorHandlers
 *   Value to be evaluated as a <i>StatementList</i> in case of an
 *   exception.  Called if a <code>Function</code>,
 *   converted to string if not a string, and used as-is otherwise.
 *   For compatibility, the <code>undefined</code> value
 *   is evaluated like the empty string.
 * @return mixed
 *   The result of <code>statements</code>, or the result
 *   of <code>errorHandlers</code> if an error occurred.
 * @author
 *   Copyright (c) 2008
 *   Thomas 'PointedEars' Lahn &lt;js@PointedEars.de&gt;
 *   Distributed under the GNU GPL v3 and later.
 * @partof JSX:object.js
 */
var tryThis = jsx.tryThis = (function () {
  /**
   * @param s Value to be stringified
   * @param sCall : String
   *   CallStatement that should be used instead of the value
   * @return string Stringified version of <code>s</code>
   */
  function stringify(s, sCall)
  {
    if (typeof s == "function")
    {
      s = sCall;
    }
    else if (typeof s == "undefined")
    {
      s = "";
    }
    
    return s;
  }
  
  return function (statements, errorHandlers) {
    var sStatements = stringify(statements, "statements();");
    var sErrorHandlers = stringify(errorHandlers, "errorHandlers(e);");
    
    var code = 'try {\n  ' + sStatements + '\n}\n'
             + 'catch (e) {\n  ' + sErrorHandlers + '\n}';
    
    return eval(code);
  };
}());

/**
 * Throws an exception, including an execution context hint if provided,
 * followed by an error message.
 * 
 * NOTE: This method has previously been provided by {@link exception.js};
 * optimizations in code reuse moved it here.
 *
 * @param errorType : string
 *   Identifier of the constructor for the error type.
 *   Use a false-value (e.g., <code>""</code> or <code>null</code>)
 *   to throw an unqualified exception.
 * @param sMessage : string|Array
 *   Error message to be displayed.  If an <code>Array</code>,
 *   it is passed as argument list to the constructor for the error type
 * @param context : Callable|string
 *   Optional callable object to specify the context
 *   where the exception occurred.
 * @author
 *   Copyright (c) 2008 Thomas 'PointedEars' Lahn <cljs@PointedEars.de>.
 *   Distributed under the GNU GPL v3 and later.
 * @partof JSX:object.js
 */
var throwException = jsx.throwThis = (function () {
  var
    jsx_global = jsx.global,
    jsx_object = jsx.object,
    f = function (e, i, a) {
      return typeof e == "string" ? '"' + e + '"' : e;
    };
  
  return function (errorType, message, context) {
    var sErrorType = errorType;
    
    if (jsx_object.isMethod(errorType))
    {
      sErrorType = "errorType";
    }
    
    var sContext;
    if (jsx_object.isMethod(jsx_global, "Error"))
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
      if (jsx_object.isMethod(context))
      {
        sContext = (String(context).match(/^\s*(function.+\))/)
                     || [, null])[1];
        sContext = sContext ? sContext + ': ' : '';
      }
    }
  
    /* Array for exception constructor's argument list */
    if (jsx_object.isMethod(message, "map"))
    {
      /* NOTE: Opera 5 and 6 require this to be split in two statements */
      message = String(message.map(f)).replace(/\\/g, "\\$&");
      message = s.replace(/\r?\n|\r/g, "\\n");
    }
    else
    {
      message = (sContext || "") + (message || "");
      message = '"'
        + message.replace(/["\\]/g, "\\$&").replace(/\r?\n|\r/g, "\\n")
        + '"';
    }
  
    /* DEBUG */
    var throwStmt = 'throw ' + (sErrorType ? 'new ' + sErrorType : '')
                  + '(' + (message || "") + ');';
    
    eval(throwStmt);
  };
}());

/**
 * Returns a feature of an object
 * 
 * @param o : Object
 * @return mixed
 *   <code>false</code> if <var>o</var> does not have such a feature
 */
var getFeature = jsx.object.getFeature = function (o) {
  for (var i = 1, len = arguments.length; i < len; i++)
  {
    var arg = arguments[i];
    if (typeof o != "undefined" && typeof o[arg] != "undefined" && o[arg])
    {
      o = o[arg];
    }
    else
    {
      return false;
    }
  }
  
  return o;
};

/**
 * Emulates the <code>instanceof</code> operator (JavaScript 1.5) compatible to JavaScript 1.1
 * for <strong>one</strong> inheritance level.
 * Example:
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
 * NOTE: This method has previously been provided by {@link types.js};
 * optimizations in code reuse moved it here.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @param a : Object
 *   Expression to be determined a <var>Prototype</var> object.
 * @param Prototype : Object
 *   Function object to be determined the prototype of a.
 * @return boolean
 *   <code>true</code> if <code>a</code> is an object derived
 *   from <var>Prototype</var>, <code>false</code> otherwise.
 */
var isInstanceOf = jsx.object.isInstanceOf = function (a, Prototype) {
  return !!(
    a && Prototype
    && typeof a.constructor != "undefined"
    && a.constructor == Prototype);
};

/**
 * Returns the name of a function if it has one, or the empty string.
 * 
 * @param aFunction : Function|String
 * @return string
 *   The name of a function if it has one; the empty string otherwise.
 */
var getFunctionName = jsx.object.getFunctionName = function (aFunction) {
  return (typeof aFunction.name != "undefined" && aFunction.name)
    || (String(aFunction).match(/function\s+(\w+)/) || [, ""])[1];
};

/**
 * Gets the stack trace of the calling execution context
 * 
 * Based on getStackTrace() from jsUnit 2.2alpha of 2006-03-24
 * 
 * @return string
 *   The stack trace of the calling execution context, if available.
 */
var getStackTrace = jsx.getStackTrace = function () {
  function parseErrorStack(excp)
  {
    var stack = [];
    var name;

    if (!excp || !excp.stack)
    {
      return stack;
    }

    var stacklist = excp.stack.split('\n');

    for (var i = 0; i < stacklist.length - 1; i++)
    {
        var framedata = stacklist[i];

        name = framedata.match(/^(\w*)/)[1];
        if (!name)
        {
          name = 'anonymous';
        }

        stack[stack.length] = name;
    }
    
    /* remove top level anonymous functions to match JScript */
    while (stack.length && stack[stack.length - 1] == 'anonymous')
    {
      stack.length = stack.length - 1;
    }

    return stack;
  }
  
  var result = '';

  if (typeof arguments.caller != 'undefined')
  {
    /* JScript and older JavaScript */
    for (var a = arguments.caller; a != null; a = a.caller)
    {
      result += '> ' + (jsx.object.getFunctionName(a.callee) || "anonymous")
        + '\n';
      if (a.caller == a)
      {
        result += '*';
        break;
      }
    }
  }
  else
  {
    /* other */
    if (typeof Error !== "function")
    {
      return result;
    }

    var stack = parseErrorStack(new Error());
    for (var i = 1; i < stack.length; i++)
    {
      result += '> ' + stack[i] + '\n';
    }
  }

  return result;
};

/**
 * Determines whether an object is, or several objects are,
 * likely to be callable.
 * 
 * @author (C) 2003-2010  Thomas Lahn &lt;object.js@PointedEars.de&gt;
 * @param o : Object which should be tested for a method, or checked
 *   for being a method if no further arguments are provided.
 *   <p>
 *   <em>NOTE: If you pass a primitive value for this argument,
 *   the properties of the object created from that value are considered.
 *   In particular, if you pass a string value containing
 *   a <i>MemberExpression</i>, the properties of the corresponding
 *   <code>String</code> instance are considered, not of the object that
 *   the <i>MemberExpression</i> might refer to.  If you need to use such
 *   a string to refer to an object (e.g., if you do not know whether it
 *   is safe to refer to the object), use the return value of
 *   {@link jsx#tryThis jsx.tryThis("<var>MemberExpression</var>")}
 *   as argument to this method instead.</em>
 *   </p>
 * @params : optional string
 *   Path of the property to be determined a method, i.e. a reference to
 *   a callable object assigned as property of another object.
 *   Use a string argument for each component of the path, e.g.
 *   the argument list <code>(o, "foo", "bar")</code> for testing whether
 *   <code>o.foo.bar</code> is a method.
 *   If the last argument is an {@link Array}, all elements of
 *   this array are used for property names; e.g.
 *   <code>(o, "foo", ["bar", "baz"])</code>.  This allows for testing
 *   several properties of the same object with one call.
 * @return boolean
 *   <code>true</code> if all arguments refer to methods,
 *   <code>false</code> otherwise.
 * @see jsx.object#isMethodType()
 */
var isMethod = jsx.object.isMethod = jsx.object.areMethods = (function () {
  var
    rxUnknown = /^\s*unknown\s*$/i,
    rxMethod = /^\s*(function|object)\s*$/i;
  
  return function (o, p) {
    var len = arguments.length;
    if (len < 1)
    {
      jsx.throwThis("jsx.InvalidArgumentError",
        ["Not enough arguments", "saw 0", "(o : Object[, p : string])"]);
      return false;
    }
  
    var t = typeof o;
  
    /* When no property names are provided, test if the first argument is a method */
    if (len < 2)
    {
      return rxUnknown.test(t) || rxMethod.test(t) && o && true || false;
    }
    
    /* otherwise the first argument must refer to a suitable object */
    if (rxUnknown.test(t) || !o)
    {
      return false;
    }
      
    for (var i = 1; i < len; i++)
    {
      var
        p = arguments[i],
        p_is_Array = (i === len - 1 && p && typeof p.valueOf() != "string"),
        aProp = p;
      
      for (var j = (p_is_Array && aProp.length || 1); j--;)
      {
        if (p_is_Array)
        {
          p = aProp[j];
        }
        
        t = typeof o[p];
        
        /*
         * NOTE: Test for "unknown" required in any case;
         * this order speeds up evaluation
         */
        if (rxUnknown.test(t) || (rxMethod.test(t) && o[p]))
        {
          if (i < len - 1)
          {
            o = o[p];
            if (!(rxUnknown.test(typeof o) || o))
            {
              return false;
            }
          }
        }
        else
        {
          return false;
        }
      }
    }
    
    return true;
  };
}());

/**
 * Determines if the passed value could be the result of
 * <code>typeof <var>callable</var></code>.
 * <p>
 * NOTE: This method has previously been provided by {@link types.js};
 * optimizations in code reuse moved it here.
 * </p>
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
 * @partof http://pointedears.de/scripts/types.js
 * @deprecated since version 0.1.5a.2009070204
 *   in favor of {@link jsx.object#isMethod(Object)}
 */
var isMethodType = jsx.object.isMethodType = function (s) {
  return /^\s*(function|object|unknown)\s*$/i.test(s);
};

/**
 * Determines if an object has a (non-inherited) property
 * 
 * @param o : optional Object
 *   Object which property should be checked for existence.
 * @param p : string
 *   Name of the property to check.
 * @return boolean
 *   <code>true</code> if there is such a property;
 *   <code>false</code> otherwise.
 */
var _hasOwnProperty = jsx.object._hasOwnProperty = function (o, p) {
  if (arguments.length < 2 && o)
  {
    sProperty = o;
    o = this;
  }
  
  var proto;

  return (jsx.object.isMethod(o, "hasOwnProperty")
    ? o.hasOwnProperty(p)
    : (typeof o[p] != "undefined"
        && ((typeof o.constructor != "undefind"
              && (proto = o.constructor.prototype)
              && typeof proto[p] == "undefined")
            || (typeof o.constructor == "undefined"))));
};

/**
 * Retrieves the value of a property of an object
 * 
 * @param o : Object
 * @param sProperty : string
 * @param aDefault : mixed
 * @return mixed
 * @throw
 *   {@link jsx.object#PropertyError} if the property
 *   does not exist or has the <code>undefined</code> value, and
 *   <var>aDefault</var> was not provided
 */
jsx.object.getProperty = function (o, sProperty, aDefault) {
  if (typeof o[sProperty] != "undefined")
  {
    return o[sProperty];
  }

  /* default value not passed */
  if (arguments.length < 3)
  {
    jsx.throwThis("jsx.object.PropertyError", sProperty);
  }

  return aDefault;
};

/* Disabled until ECMAScript allows to hide properties from iteration */
//addProperties({
//    addProperties  : addProperties,
//    clone          : clone,
//    findNewProperty: findNewProperty,
//    _hasOwnProperty: _hasOwnProperty
//  },
//  Object.prototype);

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
      apply: (function () {
        var
          jsx_object = jsx.object,
          jsx_global = jsx.global;
        
        return function (thisArg, argArray) {
          if (!thisArg)
          {
            thisArg = jsx_global;
          }
          
          var
            o = {},
            p = jsx_object.findNewProperty(o);
          
          if (p)
          {
            o[p] = thisArg || this;

            var a = new Array();
            for (var i = 0, len = argArray.length; i < len; i++)
            {
              a[i] = "argArray[" + i + "]";
            }
      
            eval("o[p](" + a + ")");
            
            delete o[p];
          }
        };
      }()),
  
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
      call: function (thisArg) {
        var a = new Array();
        
        for (var i = 1, len = arguments.length; i < len; i++)
        {
          a[i] = "arguments[" + i + "]";
        }
    
        if (!thisArg)
        {
          thisArg = jsx.global;
        }
        
        var
          o = {},
          p = jsx.object.findNewProperty(o);
        
        if (p)
        {
          o[p] = this;
          eval("o[p](" + a + ")");
          delete o[p];
          o = null;
        }
      },
      
      /**
       * Constructs a new object using the calling object as constructor
       * and elements of the referred array as items of the arguments list.
       * 
       * Example:
       * <code>var d = Date.construct([2009, 8, 1]);</code>
       * is equivalent to
       * <code>var d = new Date(2009, 8, 1);</code>
       * but, by contrast, allows for passing an arbitrary number of
       * arguments per the array's elements.
       * 
       * @param argArray : Array
       * @type Object
       * @return the newly constructed object
       */
      construct: (function () {
        var
          jsx_object = jsx.object;

        return function (argArray) {
          var a = new Array();
          for (var i = 0, len = argArray.length; i < len; ++i)
          {
            a[i] = "argArray[" + i + "]";
          }
                 
          return eval("new this(" + a + ")");
        };
      }())
    },
    Function.prototype);
}

/**
 * Includes the prototype object of another object in the prototype
 * chain of objects created with the calling Function object.
 * <p>
 * Used with constructors to establish multi-level prototype-based
 * inheritance (much like class-based inheritance in Java).  To that end,
 * this method adds a <code>_super</code> property to the function to refer
 * to <var>Constructor</var>, the constructor of the parent prototype.
 * Likewise, instances constructed with the resulting function have a
 * <code>_super</code> property to refer to their constructor.
 * </p><p>
 * NOTE: Because of this, you need to use the constructor's
 * <code>_super</code> property if you want to refer to the parent's
 * constructor in the instance's constructor; using the instance's
 * <code>_super</code> property would result in infinite recursion,
 * and ultimately a stack overflow.  You may call the parent's constructor
 * explicitly within the constructor of the child, using the
 * <code>arguments.callee._super.call()</code> method (or calling it
 * explicitly as a method of the inheriting prototype); in prototype
 * methods, use <code><var>Constructor</var>._super.prototype.method.call()</code>
 * or refer to the parent constructor directly.
 * </p>
 * @param Constructor : Function
 *   Constructor from which prototype object should be
 *   inherited.
 * @param oProtoProps : Object
 *   Object from which to shallow-copy properties as prototype
 *   properties.  Of those, the <code>_super</code>,
 *   <code>constructor</code>, and <code>userDefined</code>
 *   properties are ignored as they are used internally.
 * @return Object
 *   A reference to the constructor of the extended prototype object
 *   if successful; <code>null</code> otherwise.
 */
Function.prototype.extend = (function () {
  var jsx_object = jsx.object;
  
  var iterator = (function () {
    /* Optimize if ECMAScript 5 features were available */
    if (jsx_object.isMethod(jsx.tryThis("Object"), "defineProperties"))
    {
      return function (o) {
        return o;
      };
    }
    
    return function () {
      jsx.dmsg("for (var p in o.iterator()) { f(); } is inefficient,"
        + " consider using o.forEach(f, ...) instead", "warn");
      
      var o = new Object();
      
      for (var p2 in this)
      {
        switch (p2)
        {
          case "_super":
          case "constructor":
          case "iterator":
          case "forEach":
            break;
          
          default:
            o[p2] = true;
        }
      }
  
      return o;
    };
  }());
  
  function forEach(fCallback, thisObj)
  {
    var t = typeof fCallback;
    if (!jsx.object.isMethod(fCallback))
    {
      jsx.throwThis(
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
        case "iterator":
        case "forEach":
          break;
          
        default:
          /* also supports host object's methods */
          Function.prototype.call.call(fCallback, thisObj, this[p], p, this);
      }
    }
  }
  
  return function (Constructor, oProtoProps) {
    /*
     * Supports strings being passed that denote properties of the
     * Global Object.
     * 
     * TODO: An API that only registers strings as references to features
     * defined later, and implements inheritance using this registry
     * on user call only, might be useful for constructors defined
     * in Object initializers.
     */
    if (typeof Constructor.valueOf() == "string")
    {
      Constructor = jsx.global[Constructor];
    }
    
    var t = typeof Constructor;
    if (t != "function")
    {
      jsx.throwThis("TypeError",
        (/\s*unknown\s*/i.test(t) ? "Unknown" : t) + " is not a function");
      return null;
    }
  
    this.prototype = jsx_object.inheritFrom(Constructor.prototype);
    
    if (oProtoProps)
    {
      for (var p in oProtoProps)
      {
        this.prototype[p] = oProtoProps[p];
      }
    }
    
    this._super = Constructor;
    this.prototype._super = Constructor.prototype;
    this.prototype.constructor = this;
    this.userDefined = true;
    
    /* PERF: for (var p in o.iterator()) is rather inefficient */
    /**
     * @return Object
     * @deprecated
     */
    this.prototype.iterator = iterator;
    
    /* Optimize iteration if ECMAScript 5 features are available */
    if (jsx_object.isMethod(jsx.tryThis("Object"), "defineProperties"))
    {
      var
        userDefProtoProps = ["_super", "constructor", "iterator"],
        oDescriptors = {},
        proto = this.prototype;

      for (var i = userDefProtoProps.length; i--;)
      {
        var p = userDefProtoProps[i];
        oDescriptors[p] = {
          value: proto[p],
          enumerable: false
        };
      }

      Object.defineProperties(proto, oDescriptors);
    }

    if (!jsx.object.isMethod(this.prototype, "forEach"))
    {
      /**
       * Calls a function for each real property of the object
       * in arbitrary order.  Workaround for for-in iteration
       * on objects with augmented prototype object.
       * 
       * @param fCallback : Function
       * @param thisObj : optional Object
       * @throws TypeError
       */
      this.prototype.forEach = forEach;

      /* Optimize iteration if ECMAScript 5 features are available */
      if (jsx_object.isMethod(jsx.tryThis("Object"), "defineProperty"))
      {
        var me = this;
        jsx.tryThis(
          function() {
            Object.defineProperty(me.prototype, "forEach", {
              value: me.prototype.forEach,
              enumerable: false
            });
          },
          function(e) {
            /* IE 8 goes here */
            jsx.dmsg(
              'Borken implementation: Object.defineProperty is a method'
              + ' but [[Call]](this.prototype, "forEach") throws exception ("'
              + e.name + ': ' + e.message + '")',
              'warn');
          }
        );
      }
    }
    
    return this;
  };
}());

jsx.object.addProperties(
  {
    /**
     * Maps one array to another
     * 
     * @param f : Callable
     * @param oThis : optional Object
     * @return The original array with <var>f</var> applied to each element.
     */
    map: function (f, oThis) {
      var jsx_object = jsx.object;
    
      if (!jsx_object.isMethod(f))
      {
        jsx.throwThis("TypeError",
          (jsx_object.isMethod(f, "toSource") ? f.toSource() : f)
            + " is not callable",
          this + ".map");
      }
      
      var
        len = this.length >>> 0,
        res = [];
        
      for (var i = 0; i < len; i++)
      {
        res[i] = f.call(oThis, this[i], i, this);
      }
    
      return res;
    }
  },
  Array.prototype);
  
/**
 * General exception
 * 
 * @param sMsg : string
 */
var Exception = jsx.Error = function (sMsg) {
  var msg = (sMsg || "Unspecified error");
  var _super = arguments.callee._super;
  
  if (typeof _super == "function")
  {
    _super.call(this, msg);
    
    var e;
    jsx.tryThis(function () { e = new _super(); });
  }
  
  if (!this.message)
  {
    this.message = msg;
  }
  
  if (!this.lineNumber && e)
  {
    this.lineNumber = e.lineNumber;
  }
  
  if (!this.stack && e && e.stack)
  {
    var stack = String(e.stack).split(/\r?\n|\r/).slice(2);
    this.stack = stack.join("\n");
  }
}.extend(
  typeof Error != "undefined" ? Error : function () {},
  {
    name: "jsx.Error",
    getMessage: function () { return this.message; },
    getStackTrace: function () { return this.stack; },
    printStackTrace: function () {
      var s = this.getStackTrace();
      jsx.dmsg(s) || window.alert(s);
    }
  });

jsx.InvalidArgumentError = function (sReason, sGot, sExpected) {
  arguments.callee._super.call(this,
    (sReason || "Invalid argument(s)")
      + (sGot ? ": " + sGot : "")
      + (sExpected ? "; expected " + sExpected : ""));
}.extend(jsx.Error, {name: "jsx.InvalidArgumentError"});

/**
 * Object-related exception
 * 
 * @param s
 * @extends jsx.Error
 */
jsx.object.ObjectError = function (s) {
  arguments.callee._super.call(this, s);
}.extend(jsx.Error, {name: "jsx.object.ObjectError"});

/**
 * Property-related exception
 * 
 * @param s
 * @extends jsx.object.ObjectError
 */
jsx.object.PropertyError = function (s) {
  arguments.callee._super.call(
    this, "No such property" + (arguments.length > 0 ? ": '" + s + "'" : ""));
}.extend(jsx.object.ObjectError, {name: "jsx.object.PropertyError"});
