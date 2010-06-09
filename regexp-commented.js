/**
 * <title>PointedEars' JSX: RegExp Library</title>
 *
 * @filename regexp.js
 * @partof   PointedEars' JavaScript Extensions (JSX)
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2005, 2008  Thomas Lahn &lt;regexp.js@PointedEars.de&gt;
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
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
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301, USA.
 * 
 * [1] <http://www.gnu.org/licenses/licenses.html#GPL>
 */

if (typeof jsx != "object")
{
  var jsx = {};
}

jsx.regexp = {
  /** @version */
  version:   "0.1.2010060903",
  copyright: "Copyright \xA9 2005, 2010",
  author:    "Thomas Lahn",
  email:     "regexp.js@PointedEars.de",
  path:      "http://pointedears.de/scripts/regexp.js"
};

// jsx.regexp.docURL = jsx.regexp.path + "regexp.htm";

/** @deprecated since 0.1.2010060903, see jsx.regexp */
RegExp.version   = jsx.regexp.version;
RegExp.copyright = jsx.regexp.copyright;
RegExp.author    = jsx.regexp.author;
RegExp.email     = jsx.regexp.email;
RegExp.path      = jsx.regexp.path;
// RegExp.docURL = jsx.regExp.docURL;

/**
 * Returns the string representation of a RegExp object without delimiters.
 * 
 * @param rx
 * @return string
 *   The string representation of <var>rx</var>
 */
var regexp2str = jsx.regexp.toString2 = function (rx) {
  // return rx.toString().replace(/[^\/]*\/((\\\/|[^\/])+)\/[^\/]*/, "$1");
  return rx.source || rx.toString().replace(/[^\/]*\/(.+)\/[^\/]*/, "$1");
};
RegExp.prototype.toString2 = regexp2str;

/**
 * Concatenates strings or Regular Expressions (RegExp)
 * and returns a reference to the resulting RegExp.
 * 
 * If flags are used with either RegExp argument, the
 * resulting RegExp object has all of those flags set.
 * 
 * @author Copyright (c) 2005
 *   Thomas Lahn &lt;regexp.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/regexp.js
 * @params
 *   Expressions to be concatenated.  If a not a RegExp, the
 *   argument is converted to String and all resulting characters
 *   except "(", "|" and ")" are used literally; this allows for
 *   expressions to be grouped and used in alternation.  For
 *   characters to lose their special meaning, escape them in
 *   a RegExp argument.
 * 
 *   If this function is called as method of a RegExp
 *   object, the expressions given are concatenated
 *   beginning with the calling object.
 * @return RegExp
 *   A reference to the resulting RegExp
 */
var regexp_concat = jsx.regexp.concat = function () {
  var
    aParts = [],
    c = this.constructor;
    
  if (c && c == RegExp)
  {
    aParts.push(regexp2str(this));
  }

  var oFlags = {
    g: false,
    i: false,
    m: false,
    y: false,
    
    joinSet:
      /**
       * @return string
       */
      function() {
        var
          a = [],
          oDummy = {g: 1, i: 1, m: 1, y: 1};
        
        for (var flag in oDummy)
        {
          if (this[flag] === true)
          {
            a.push(flag);
          }
        }
        
        return a.join("");
      }
  };
  
  for (var i = 0, iArgnum = arguments.length; i < iArgnum; i++)
  {
    var a = arguments[i];
    c = a.constructor;
    if (c && c == RegExp)
    {
      aParts.push(regexp2str(a));
      if (!oFlags.g && a.global)
      {
        oFlags.g = true;
      }
      
      if (!oFlags.i && a.ignoreCase)
      {
        oFlags.i = true;
      }
      
      if (!oFlags.m && a.multiline)
      {
        oFlags.m = true;
      }
      
      if (!oFlags.y && a.sticky)
      {
        oFlags.y = true;
      }
    }
    else
    {
      aParts.push(String(a).replace(/([^|()])/g, "\\$1"));
    }
  }

  return new RegExp(aParts.join(""), oFlags.joinSet());
};
RegExp.prototype.concat = regexp_concat;

/**
 * Returns a reference to a RegExp object that is an alternation of
 * two regular expressions.
 * 
 * @param pattern2
 * @param pattern1
 * @return RegExp
 *   A regular expression which matches the strings that either
 *   <var>pattern1</var> (or this object) or <var>pattern2</var>
 *   would match
 */
var regexp_intersect = jsx.regexp.intersect = function (pattern2, pattern1) {
  if (!pattern1 || pattern1.constructor != RegExp)
  {
    if (this.constructor == RegExp)
    {
      pattern1 = this;
    }
    else
    {
      return null;
    }
  }
  
  /* Rule out invalid values */
  if (!pattern2 || pattern2.constructor != RegExp)
  {
    return null;
  }

  var
    s = this.source.replace(/^\(?([^)]*)\)?$/, "$1"),
    s2 = pattern2.source.replace(/^\(?([^)]*)\)?$/, "$1");

  /* Register all parts within alternation of this pattern */
  var
    a = s.split("|"),
    o = {};
  for (var i = 0, len = a.length; i < len; i++)
  {
    o[a[i]] = true;
  }

  /* Register all parts within alternation of pattern2 */
  var
    a2 = s2.split("|"),
    o2 = {};
  for (i = 0, len = a2.length; i < len; i++)
  {
    o2[a2[i]] = true;
  }

  /* Compose the new alternation out of common parts */
  var hOP = (
    function() {
      if (typeof Object.prototype.hasOwnProperty == "function")
      {
        return function(o, p) {
          return o.hasOwnProperty(p);
        };
      }

      /* suffices *here* */
      return function(o, p) {
        return typeof o[p] != "undefined"
               && typeof o.constructor.prototype[p] == "undefined";
      };
    }
  )();

  a = [];
  for (var p in o)
  {
    if (hOP(o2, p))
    {
      a.push(p);
    }
  }

  return new RegExp("(" + a.join("|") + ")");
};
RegExp.prototype.intersect = regexp_intersect;

/**
 * Returns an escaped version of the string that can be
 * passed as an argument to {@link Global#RegExp(string, string)}
 * to match that string.
 * 
 * @param s : string
 * @return string
 */
var strRegExpEscape = jsx.regexp.escape = function (s) {
  if (arguments.length < 0 && this.constructor == String)
  {
    s = this;
  }
    
  return s.replace(/[\]\\^$*+?.(){}[]/g, "\\$&");
};
String.prototype.regExpEscape = strRegExpEscape;

/**
 * Creates an extended RegExp object where you can use PCRE-compliant
 * Unicode character classes using e.g. the \p{…} notation.
 * 
 * There are the following possibilities to make Unicode character classes
 * known to this constructor:
 * <ol>
 *   <li>Provide the Unicode Character Database, or parts thereof, as an Object;</li>
 *   <li>Provide the Unicode Character Database, or parts thereof, as a
 *       plain text resource that is accessed with XMLHttpRequest;</li>
 *   <li>Define character classes manually</li>
 * </ol>
 * 
 * <p>
 * Variant #1 requires you to define a mapping object of the following structure:
 * </p>
 * <pre><code>
 *   jsx.RegExp.characterClasses = {
 *      ...,
 *     Sc: "\u20AC...",
 *     ...
 *   };
 * </code></pre>
 * <p>
 * The property name is the name of the character class.  The property
 * value defines which characters belong to that class.  You may use
 * "-" to specify character ranges, i.e., the range of characters including
 * the characters having the boundaries as code point, and all characters
 * that have a code point in-between.  (For a literal "-", you may use "\\-".)
 * An example file to mirror the Unicode 5.0 Character Database, UnicodeData.js,
 * is provided with the distribution.  Include it after the file that
 * declares the constructor (this file) to use it.  If you do not include it,
 * but use the <code>\p{...}</code> notation, an attempt will be made to
 * load the file specified by the <code>ucdScriptPath</code> (default:
 * <code>"/scripts/UnicodeData.js"</code>) using synchronous XHR (see below).
 * </p>
 * 
 * <p>
 * Variant #2 supports two different methods: Synchronous and asynchronous
 * request-response handling.  Synchronous request-response handling
 * requests the (partial) Unicode Character Database from the resource
 * specified by the <code>ucdTextPath</code> property (default:
 * <code>"/scripts/UnicodeData.txt"</code>) and halts execution until
 * a response has been received or the connection timed out.  Asynchronous
 * request-response handling allows script execution to continue while
 * the request and response are in progress, but you need to provide a
 * callback as third argument where actions related to the regular expression
 * must be performed.  Asynchronous handling is recommended for applications
 * that need to be responsive to user input.
 * </p>
 * 
 * <p>
 * Variant #3 can be combined with the other variants.  The constructor
 * has a defineCharacterClass() method which can be used to define and
 * redefine character classes.  This allows an extended RegExp object
 * to support only a subset of Unicode Character Classes, and to support
 * user-defined character classes.
 * </p>
 */
//jsx.RegExp = (function () {
//  var
//    rxUnicodeProperty = /\\[pPX]/,
//    jsx_object = jsx.object;
//
//  function jsxRegExp(sExpression)
//  {
//    var me = arguments.callee;
//
//    if (sExpression.test(rxUnicodeProperty))
//    {
//      var req = new jsx.HTTPRequest(me.unicodeFilePath, "GET", false,
//        function (x) {
//          var lines = x.responseText.split(/\r?\n|\r/);
//
//          jsxRegExp.characterData.lines = lines;
//
//          jsxRegExp.characterData = {
//            cache: {},
//
//            getCharacters: function (property) {
//              if (jsx_object.getProperty(this.cache, property, false))
//              {
//                return this.cache[property];
//              }
//
//              this.cache[property] = this.lines.filter(
//                function (e, i, a) {
//                  return e.split(";")[2] == property;
//                });
//            }
//          };
//        });
//      req.send();
//
//      this.expr = new RegExp(sExpression);
//    }
//  }
//
//  return jsxRegExp;
//})();

jsx.RegExp = (function () {
  var
    rxEscapes = /\\\[|\[([^\]\\]|\\p\{([^\}]+)\}|\\\])+\]|\\([pP])\{([^\}]+)\}/g,
    jsx_object = jsx.object;

  return function(expression, sFlags) {
    var
      me = arguments.callee,
      characterClasses = me.characterClasses;
    
    if (expression && expression.constructor == RegExp)
    {
      expression = expression.source;
    }
    
    var t = typeof expression;
    if (t != "string")
    {
      if (arguments.length < 1)
      {
        expression = "";
      }
      else
      {
        expression = String(expression);
      }
    }
    
    var originalSource = expression;
    
    expression = expression.replace(rxEscapes,
      function (m, p1, classInBrackets, propertySpecifier,
                 classOutOfBrackets) {
        if (!(classInBrackets || classOutOfBrackets))
        {
          return m;
        }
      
        if (!characterClasses)
        {
          var req = new jsx.HTTPRequest(me.ucdScriptPath, "GET", false,
            function (x) {
              eval(x.responseText);
            });
          req.send();
          
          characterClasses = me.characterClasses;
          
          if (!characterClasses)
          {
            req.setURL(me.ucdTextPath);
            req.setSuccessListener(function (x) {
              me.ucdText = x.responseText.split(/\r?\n|\r/);
              
              /* TODO */
            });
            req.send();
          }
        }

        var result = jsx_object.getProperty(
          characterClasses, classInBrackets || classOutOfBrackets);
        
        if (classOutOfBrackets)
        {
          result = "[" + (propertySpecifier == "P" ? "^" : "") + result + "]";
        }
        else
        {
          /* TODO */
//          if (m.test(/^\[\\[pP]\{([^\}]+)\}\]$/))
//            {
//            return "[" + (propertySpecifier == "P" ? "^" : "") + result + "]";
//          }
            
          jsx.throwThis("TypeError",
            "FIXME: Cannot expand property-based escape sequence in"
            + " character class");
        }
        
        return result;
      });
    
    var rx = new RegExp(expression, sFlags);
    rx.originalSource = originalSource;
    
    return rx;
  };
})();

jsx.RegExp.ucdScriptPath = "/scripts/UnicodeData.js";
jsx.RegExp.ucdTextPath = "/scripts/UnicodeData.txt";

jsx.RegExp.defineCharacterClasses = function (o) {
  var me = arguments.callee;
  
  for (var p in o)
  {
    me.characterClasses[p] = o[p];
  }
};

/* test case */
//
//  alert([
//    /("([^"\\]|\\")*"|'([^'\\]|\\')*')|\/\*([^*]|\*[^\/])*\*\/|\/\/[^\n\r]*([\n\r]|$)|(\/(\\\/|[^\/])+\/)/mg,
//    regexp_concat(
//      '(', /"([^"\\]|\\")*"/, '|', /'([^'\\]|\\')*'/,
//      ')|', /\/\*([^*]|\*[^\/])*\*\//,
//      '|', /\/\/[^\n\r]*([\n\r]|$)/,
//      '|', /(\/(\\\/|[^\/])+\/)/mg)
//  ].join("\n"));