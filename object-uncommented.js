/**
 * <title>Basic Object Library</title>
 * @file object.js
 * 
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author (C) 2004-2009  Thomas Lahn &lt;object.js@PointedEars.de&gt;
 * 
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

if (typeof jsx == "undefined") var jsx = {};

jsx.object = {
  version:   "0.1.5a.2009062116",
  copyright: "Copyright \xA9 2004-2009",
  author:    "Thomas Lahn",
  email:     "object.js@PointedEars.de",
  path:      "http://PointedEars.de/scripts/"
};


Object.version   = jsx.object.version;
Object.copyright = jsx.object.copyright;
Object.author    = jsx.object.author;
Object.email     = jsx.object.email;
Object.path      = jsx.object.path;

if (typeof de == "undefined") var de = new Object();
if (typeof de.pointedears == "undefined") de.pointedears = new Object();
de.pointedears.jsx = jsx;

if (typeof _global == "undefined") var _global = this;

jsx.global = _global;

jsx.object.ADD_OVERWRITE = 1;

jsx.object.COPY_ENUM = 0;

jsx.object.COPY_ENUM_DEEP = 2;

jsx.object.COPY_INHERIT = 4;

Object.ADD_OVERWRITE  = jsx.object.ADD_OVERWRITE;
Object.COPY_ENUM      = jsx.object.COPY_ENUM;
Object.COPY_ENUM_DEEP = jsx.object.COPY_ENUM_DEEP;
Object.COPY_INHERIT   = jsx.object.COPY_INHERIT;

jsx.dmsg = function(sMsg, sType) {
  var jsx_object = jsx.object;
  
  if (sMsg.constructor == Array)
  {
    sMsg = sMsg.join("");
  }
  
  if (typeof console != "undefined")
  {
    if (!sType || !jsx_object.isMethod(console, sType) && sType != "log")
    {
      sType = "log";
    }
    
    if (jsx_object.isMethod(console, sType))
    {
      console[sType].call(console, sMsg);
      return true;
    }
  }
  
  else if (typeof document != "undefined"
            && jsx_object.isMethod(document, "createEvent")
            && jsx_object.isMethod(document, "dispatchEvent"))
  {
    printfire.args = [sMsg];
    var ev = document.createEvent("Events");
    if (ev)
    {
      if (jsx.tryThis(
            function() {
              ev.initEvent("printfire", false, true);
              dispatchEvent(ev);
            }))
      {
        return true;
      }
    }
  }
  
  return false;
};
var printfire = jsx.dmsg;

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
    var o2 = oSource.valueOf(), c, i;

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

 
function setErrorHandler(fHandler)
{
  if (!isMethod(fHandler)) fHandler = jsx.clearErrorHandler;
  
  if (typeof window != "undefined" && typeof window.onerror != "undefined")
  {
    window.onerror = fHandler;
  }
  
  return (typeof window.onerror != "undefined"
          && window.onerror == fHandler);
}
jsx.setErrorHandler = setErrorHandler;

 
function clearErrorHandler()
{
  if (typeof window != "undefined" && window.onerror)
  {
    window.onerror = null;
  }

  return true;
}
jsx.clearErrorHandler = clearErrorHandler;

function tryThis(statements, errorHandlers)
{
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

jsx.throwThis = function(errorType, sMessage, context) {
  var t, sErrorType = errorType;
  if (jsx.object.isMethodType((t = typeof errorType))
      && !/^\s*unknown\s*$/i.test(t)
      && errorType)
  {
    sErrorType = "errorType";
  }
  
  var sContext;
  if (jsx.object.isMethod(jsx.global, "Error"))
  {
    var stack = (new Error()).stack;
    if (stack)
    {
      sContext = stack + "\n";
    }
  }
  
  if (!sContext)
  {
    if (jsx.object.isMethodType((t = typeof context))
        && !/^\s*unknown\s*$/i.test(t)
        && context)
    {
      sContext = (String(context).match(/^\s*(function.+\))/)
                   || [, null])[1];
      sContext = sContext ? sContext + ': ' : '';
    }
  }

  var message = (sContext || "") + (sMessage || "");

  var throwStmt = 'throw new ' + sErrorType + '("'
                + message.replace(/["\\]/g, "\\$&").replace(/\r?\n|\r/g, "\\n")
                + '");';
  
  eval(throwStmt);
};
var throwException = jsx.throwThis;

function isMethod(o)
{
  var len = arguments.length;
  if (len < 1) return false;

  var
    rxUnknown = /^\s*unknown\s*$/i,
    rxMethod = /^\s*(function|object)\s*$/i,
    t = typeof o;

  if (rxUnknown.test(t) || !o) return false;
  
  if (t === "string")
  {
    if (typeof console != "undefined"
        && rxUnknown.test((t = typeof console.warn))
        || rxMethod.test(t) && console.warn)
    {
      console.warn("jsx.object.isMethod: Seen \"" + o + "\" for argument #1;"
        + " did you mean isMethod(" + o + ", ...)?");
    }
  }
  
  for (var i = 1; i < len; i++)
  {
    var p = arguments[i];
    t = typeof o[p];
    
    if (rxUnknown.test(t) || rxMethod.test(t) && o[p])
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

function isMethodType(s)
{
  return /^\s*(function|object|unknown)\s*$/i.test(s);
}
jsx.object.isMethodType = isMethodType;

function _hasOwnProperty(o, p)
{
  if (arguments.length < 2 && o)
  {
    sProperty = o;
    o = this;
  }

    
  if (jsx.object.isMethod(o, "hasOwnProperty"))
  {
    return o.hasOwnProperty(p);
  }

  if (typeof o[p] == "undefined")
  {
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

    return (typeof o.constructor.prototype[p] == "undefined");
  }

  return true;
}
jsx.object._hasOwnProperty = _hasOwnProperty;

jsx.object.getProperty = function(o, sProperty, aDefault) {
  if (typeof o[sProperty] != "undefined")
  {
    return o[sProperty];
  }

  if (arguments.length < 3)
  {
    jsx.throwThis(this.PropertyError, sProperty);
  }

  return aDefault;
};


function inheritFrom(o)
{
  function Dummy() {}
  Dummy.prototype = o;
  return new Dummy();
}
jsx.object.inheritFrom = inheritFrom;

if (jsx.object.isMethod(this, "eval"))
{
  jsx.object.addProperties(
    {
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

Function.prototype.extend = function(Constructor, oProtoProps) {
  function Dummy() {};
  
  if (typeof Constructor.valueOf() == "string")
  {
    Constructor = _global[Constructor];
  }
  
  var t = typeof Constructor;
  if (t != "function")
  {
    jsx.throwThis("TypeError",
      (/\s*unknown\s*/i.test(t) ? "Unknown" : t) + " is not a function");
    return false;
  }

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
    jsx.dmsg("for (var p in o.iterator()) { f(); } is inefficient,"
      + " consider using o.forEach(f, ...) instead", "warn");
    
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
    this.prototype.forEach = function(fCallback, thisObj) {
      var t;
      if (!jsx.object.isMethodType((t = typeof fCallback)) || !fCallback)
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
  
function Exception(sMsg)
{
  var msg = (sMsg || "jsx.Error");
  
  if (typeof Error == "function")
  {
    Error.call(this, msg);
    
    var e;
    jsx.tryThis(function() { e = new Error(); });
  }
  
  this.name = "jsx.Error";
  
  if (!this.message) this.message = msg;
  
  if (!this.lineNumber && e)
  {
    this.lineNumber = e.lineNumber;
  }
  
  if (!this.stack && e && e.stack)
  {
    var stack = String(e.stack).split(/\r?\n|\r/);
    stack.shift();
    this.stack = stack.join("\n");
  }
}

if (typeof Error != "undefined")
{
  Exception.extend(Error, {
    getMessage: function() { return this.message; },
    getStackTrace: function() { return this.stack; },
    printStackTrace: function() {
      var s = this.getStackTrace();
      jsx.dmsg(s) || window.alert(s);
    }
  });
}
jsx.Error = Exception;

jsx.InvalidArgumentError = function(sReason, sGot, sExpected) {
  jsx.Error.call(this, sReason + (sGot ? ": " + sGot : "")
    + (sExpected ? "; expected " + sExpected : ""));
  this.name = "jsx.InvalidArgumentError";
};
jsx.InvalidArgumentError.extend(jsx.Error);

jsx.object.ObjectError = function(s) {
  jsx.Error.call(this, s);
  this.name = "jsx.object.ObjectError";
};
jsx.object.ObjectError.extend(jsx.Error);

jsx.object.PropertyError = function(s) {
  jsx.object.ObjectError.call(this, "No such property: " + s);
  this.name = "jsx.object.PropertyError";
};
jsx.object.PropertyError(jsx.object.ObjectError);