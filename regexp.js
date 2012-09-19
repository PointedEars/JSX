"use strict";
/* vim:set fileencoding=utf-8 tabstop=2 shiftwidth=2 softtabstop=2 expandtab: */
/**
 * <title>PointedEars' JSX: RegExp Library</title>
 * @filename regexp.js
 * @version $Id$
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2005‒2012  Thomas Lahn &lt;js@PointedEars.de&gt;
 *
 * @partof PointedEars' JavaScript Extensions (JSX)
 *
 * JSX is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JSX is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSX.  If not, see <http://www.gnu.org/licenses/>.
 */

if (typeof jsx != "object")
{
  /**
   * @namespace
   */
  var jsx = {};
}

/**
 * @namespace
 */
jsx.regexp = {
  /** @version */
  version:   "0.1.$Revision$",
  copyright: "Copyright \xA9 2005-2012",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://pointedears.de/scripts/"
};

// jsx.regexp.docURL = jsx.regexp.path + "regexp.htm";

/**
 * Returns the string representation of a {@link RegExp}
 * without delimiters.
 *
 * @param rx : RegExp
 * @return string
 *   The string representation of <var>rx</var>
 */
var regexp2str = jsx.regexp.toString2 = function (rx) {
  // return rx.toString().replace(/[^\/]*\/((\\\/|[^\/])+)\/[^\/]*/, "$1");
  if (!rx)
  {
    rx = this;
  }

  return rx.source || rx.toString().replace(/[^\/]*\/(.+)\/[^\/]*/, "$1");
};
RegExp.prototype.toString2 = regexp2str;

/**
 * Concatenates strings or regular expressions ({@link RegExp})
 * and returns the resulting <code>RegExp</code>.
 *
 * If flags are used with either <code>RegExp</code> argument, the
 * resulting <code>RegExp</code> has all of those flags set.
 *
 * @author Copyright (c) 2005
 *   Thomas Lahn &lt;regexp.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/regexp.js
 * @params
 *   Expressions to be concatenated.  If a not a {@link RegExp},
 *   the argument is converted to {@link String}; this allows
 *   for expressions to be grouped and used in alternation.
 *   For characters to lose their special meaning, escape them in
 *   a <code>RegExp</code> argument or escape them twice in
 *   a converted (e.g. string) argument.
 *
 *   If this function is called as method of a <code>RegExp</code>,
 *   the expressions given are concatenated beginning with the
 *   <code>this</code> value.
 * @return RegExp
 *   The resulting <code>RegExp</code>
 */
var regexp_concat = jsx.regexp.concat = function () {
  var
    aParts = [],
    c = this.constructor;

  var oFlags = {
    flags: {
      g: "global",
      i: "ignoreCase",
      m: "multiline",
      y: "sticky"
    },
    g: false,
    i: false,
    m: false,
    y: false,

    setFromTemplate: function (template) {
      var flags = this.flags;
      for (var flag in flags)
      {
        if (!this[flag] && template[flags[flag]])
        {
          this[flag] = true;
        }
      }
    },

    toString:
      /**
       * @return string
       */
      function () {
        var
          a = [];

        for (var flag in this.flags)
        {
          if (this[flag] === true)
          {
            a.push(flag);
          }
        }

        return a.join("");
      }
  };
  
  var regexp2str = jsx.regexp.toString2;

  if (c && c == RegExp)
  {
    aParts.push(regexp2str(this));
    oFlags.setFromTemplate(this);
  }

  for (var i = 0, iArgnum = arguments.length; i < iArgnum; i++)
  {
    var a = arguments[i];
    c = a.constructor;
    if (c && c == RegExp)
    {
      aParts.push(regexp2str(a));
      oFlags.setFromTemplate(a);
    }
    else
    {
      aParts.push(String(a));
    }
  }

  return new RegExp(aParts.join(""), oFlags.toString());
};
RegExp.prototype.concat = regexp_concat;

/**
 * Returns a {@link RegExp} that is an intersection of two
 * regular expressions.
 *
 * @param pattern2
 * @param pattern1
 * @return {RegExp}
 *   A regular expression which matches the strings that both
 *   <var>pattern1</var> (or this object) and <var>pattern2</var>
 *   would match.
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
    s = pattern1.source.replace(/^\(?([^)]*)\)?$/, "$1"),
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
    function () {
      if (typeof Object.prototype.hasOwnProperty == "function")
      {
        return function (o, p) {
          return o.hasOwnProperty(p);
        };
      }

      /* suffices *here* */
      return function (o, p) {
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
 * Returns an escaped version of the string that can be passed
 * as an argument to {@link Global#RegExp(string, string) RegExp()}
 * to match that string.
 *
 * @param s : string
 * @return string
 */
var strRegExpEscape = jsx.regexp.escape = function (s) {
  if (arguments.length == 0 && this.constructor == String)
  {
    s = this;
  }

  return s.replace(/[\]\\^$*+?.(){}[]/g, "\\$&");
};
String.prototype.regExpEscape = strRegExpEscape;

/**
 * Creates and returns an extended {@link RegExp} object.
 * 
 * The returned {@link RegExp} is extended in two ways: Firstly,
 * it accepts a pattern string where you can use some features
 * of Perl and Perl-compatible regular expressions (PCRE).
 * Secondly, it has additional properties to accomodate those
 * extensions.
 *
 * The following extra features are currently supported:
 * <ul>
 *   <li>Flags:
 *     <ul>
 *       <li><tt>s</tt> (PCRE_DOTALL) – the <tt>.</tt> metacharacter
 *         matches newline as well.</li>
 *       <li><tt>u</tt> (Unicode mode) – the meaning of
 *         character class escape sequences <tt>\b</tt>, <tt>\w</tt>,
 *         and <tt>\W</tt> is extended to include Unicode character
 *         properties.</li>
 *       <li><tt>x</tt> (PCRE_EXTENDED) – whitespace within
 *         the pattern is ignored, so that it is easier human-readable.</li>
 *     </ul><p>
 *     Flags except for Unicode mode can be set and unset for
 *     parts of the expression outside of character classes using
 *     the <tt>(?…)</tt> and <tt>(?-…)</tt> notations.
 *   </li>
 *   <li>Unicode property classes using e.g. the \p{…} notation</li>
 *   <li>Named capturing groups by passing strings with the
 *       <tt>(?P&lt;name>…)</tt> or <tt>(?P'name'…)</tt> notation,
 *       where the <tt>P</tt> is optional, respectively.</li>
 * </ul><p>
 * This is facilitated through the following steps:
 * </p><ol>
 *   <li>The flags <code>x</code>, <code>s</code> and <code>u</code>
 *       in the <var>sFlags</var> argument set the initial state
 *       of the pattern-match modifiers; the extended {@link RegExp}'s
 *       <code>extended</code>, <code>dotAll</code> and
 *       <code>unicodeMode</code> properties are set accordingly.
 *       These flags are removed from the <var>sFlags</var>
 *       argument subsequently.</li>
 *   <li>The pattern is run through several passes, where in each
 *       one it is scanned from left to right using another
 *       {@link RegExp}:
 *       <ol>
 *         <li>Pattern-match modifiers are set and unset as they
 *             are scanned.  Key subpatterns are replaced in context.
 *           <ol>
 *             <li>With PCRE_EXTENDED set, single-line
 *                 comments starting with <tt>#</tt> and unescaped
 *                 whitespace are removed from the pattern.  The backslash
 *                 is removed from the pattern when in front of
 *                 whitespace.</li>
 *             <li>With PCRE_DOTALL set, unescaped <tt>.</tt>
 *                 (period) characters are replaced with the character class
 *                 <tt>[\S\s]</tt> which matches all Unicode characters.</li>
 *           </ol></li>
 *         <li>Capturing groups in the pattern are matched,
 *             and replaced with the opening parenthesis if they were assigned
 *             a name.  The extended {@link RegExp}'s <code>groups</code>,
 *             <code>names</code>, and <code>patternGroups</code>
 *             properties are set accordingly.  They are used in an
 *             overwritten <code>exec()</code> method and when matching
 *             against a <code>jsx.regexp.String</code> using its
 *             <tt>match(…)</tt> method.</li>
 *         <li>When in Unicode mode,
 *             <ol>
 *               <li>in the third pass, character class escape sequences
 *                   <tt>\w</tt> and <tt>\W</tt> are replaced with
 *                   corresponding uses of <tt>\p{Word}</tt>.</li>
 *               <li>in the fourth pass, <tt>\b</tt> is replaced with
 *                   corresponding uses of character classes and negative
 *                   lookahead.
 *             </ol></li>
 *         <li>The <tt>\p{…}</tt> and <tt>\P{…}</tt> escape sequences
 *             are replaced by the corresponding character classes.</li>
 *       </ol></li>
 *   <li>The resulting expression and remaining flags are passed
 *       to the {@link RegExp} constructor.</li>
 *   <li>The created {@link RegExp} instance is augmented with
 *       properties and returned.</li>
 * </ol><p>
 * There are the following possibilities to make Unicode property
 * classes known to this constructor:
 * </p><ol>
 *   <li>Provide the Unicode Character Database, or parts thereof,
 *       as an Object;</li>
 *   <li>Provide the Unicode Character Database, or parts thereof,
 *       as a plain text resource that is accessed with
 *       XMLHttpRequest;</li>
 *   <li>Define property classes manually</li>
 * </ol>
 * <p>
 * Variant #1 requires you to define a mapping object with
 * the following namespace and structure:
 * </p>
 * <pre><code>
 *   jsx.regexp.RegExp.propertyClasses = {
 *      ...,
 *     Sc: "\u20AC...",
 *     ...
 *   };
 * </code></pre>
 * <p>
 * The property name is the name of the Unicode property class
 * (here: <tt>Sc</tt>).  The property value (a string) defines
 * which characters belong to that class.  You may use "-"
 * to specify character ranges, i.e., the range of characters
 * including the characters having the boundaries as code point
 * value, and all characters that have a code point value
 * in-between.  (For a literal "-", you may use "\\-".)
 * An example file to mirror the Unicode 5.0 Character Database,
 * UnicodeData.js, is distributed with this file.  Include it
 * <em>after</em> the file that declares the constructor (this
 * file) to use it.  If you do not include it, but use the
 * <code>\p{...}</code> notation, an attempt will be made to load
 * the file specified by the <code>ucdScriptPath</code> property
 * (default: <code>"/scripts/UnicodeData.js"</code>) using
 * synchronous XHR (see below).
 * </p>
 * <p>
 * Variant #2 is going to support two different methods:
 * Synchronous and asynchronous request-response handling.
 * Synchronous request-response handling requests the (partial)
 * Unicode Character Database from the resource specified by
 * the <code>ucdTextPath</code> property (default:
 * <code>"/scripts/UnicodeData.txt"</code>) and halts execution
 * until a response has been received or the connection timed out.
 * Asynchronous request-response handling allows script execution
 * to continue while the request and response are in progress, but
 * you need to provide a callback as third argument where actions
 * related to the regular expression must be performed.
 * Asynchronous handling is recommended for applications that need
 * to be responsive to user input. <strong>Currently, only
 * synchronous handling is implemented.</strong>
 * </p>
 * <p>
 * Variant #3 can be combined with the other variants.
 * The constructor has a definePropertyClasses() method which can
 * be used to define and redefine property classes.  This allows
 * an extended RegExp object to support only a subset of Unicode
 * property classes, and to support user-defined character
 * property classes.
 * </p>
 *
 * The returned {@link RegExp} has additional properties to
 * accomodate syntax extensions in the pattern string:
 * 
 * @property pattern : String
 *   The original pattern string, including pattern-matching
 *   modifiers.
 * @property patternGroups : Array
 *   The part of the pattern string from the opening parenthesis
 *   of each pattern group to the end of the pattern, before
 *   character class expansion, and without pattern-matching
 *   modifiers.  The first item (index 0) holds the complete
 *   pattern without modifiers.
 *   <em>NOTE: For efficiency, the pattern groups are not isolated;
 *   further parsing on your part may very well be necessary.</em>
 * @property groups : Object
 *   An Array-like object mapping group indexes to group names.
 *   Its <code>length</code> property yields the number of grouped
 *   subpatterns in the original pattern, including named groups.
 * @property names : Object
 *   An object mapping group names to group indexes.
 * @property flags : String
 *   The original flags string
 * @property dotAll : boolean
 *   Flag specifying whether the used expression was built from
 *   a pattern where the dot matches newline as well (PCRE_DOTALL).
 * @property extended : boolean
 *   Flag specifying whether the used expression was built from
 *   an extended pattern (PCRE_EXTENDED).
 * @property unicodeMode : boolean
 *   Flag specifying whether the used expression was built using
 *   Unicode mode.
 * @method exec
 *   A variant of the RegExp.prototype.exec() method to support
 *   named groups and Unicode mode transparently.
 * @method _oldExec
 *   The original inherited exec() method.  Used internally and
 *   is only available in Unicode mode.
 *
 * @function
 * @constructor
 * @param expression : String|RegExp
 *   A regular expression pattern string that may use the features
 *   described above.  If it is a {@link RegExp}, its
 *   <code>source</code> property is used and combined with
 *   <var>sFlags</var>.  That is, <code>jsx.regexp.RegExp(/foo/, "i")</code>
 *   returns the same as <code>jsx.regexp.RegExp(/foo/i)</code>.
 * @param sFlags : String
 *   Optional string containing none, one or more of the standard
 *   {@link RegExp} modifiers and the flags described above.
 *   Unsupported flags are ignored, but passed on to {@link RegExp}.
 *   Note that modifiers in <var>expression</var> can temporarily
 *   unset and set the "s" and "x" flags.  Following Perl, the "u"
 *   flag (Unicode mode) can only be enabled, but not disabled.
 * @return RegExp
 *   A regular expression with the property class escape sequences
 *   expanded according to the specified data, with the specified
 *   flags set if they are natively supported.
 */
jsx.regexp.RegExp = (function () {
  var
    sPropertyEscapes = "\\\\(p)\\{([^\\}]+)\\}",
    rxPropertyEscapes = new RegExp(sPropertyEscapes, "gi"),
    sNonPropEscInRange = "([^\\]\\\\]|\\\\[^p])*",
    sEscapes =
      "\\[(\\^?(" + sNonPropEscInRange + "(" + sPropertyEscapes
      + ")+" + sNonPropEscInRange + ")+)\\]"
      + "|" + sPropertyEscapes + "",
    rxEscapes = new RegExp(sEscapes, "gi"),
    jsx_object = jsx.object,
    _getDataObject = jsx_object.getDataObject,

    _normalizeCharClass = function (charClassContent, bUnicodeMode) {
      var negEscapes = [];

      if (charClassContent == "")
      {
        return "[]";
      }

      if (charClassContent == "^")
      {
        return "[^]";
      }

      var reduced = charClassContent.replace(
        /\\((P)\{([^\}]+)\}|(W))/g,
        function (m, p1, cP, charProperty, cW) {
          var escapeChar = cP || cW;
          if (escapeChar == "P" || bUnicodeMode)
          {
            negEscapes.push("\\" + escapeChar.toLowerCase()
              + (charProperty ? "{" + charProperty + "}" : ""));
            return "";
          }

          return m;
        });

      if (negEscapes.length > 0)
      {
        /* Do not let negated empty class from reduction match everything */
        if (reduced == "^")
        {
          reduced = "";
        }

        if (reduced != "")
        {
          jsx.warn(
            "jsx.RegExp: Combined negative escapes in character classes"
              + " require support for non-capturing parentheses");
        }

        return (reduced ? "(?:[" + reduced + "]|" : "")
          + "[" + (charClassContent.charAt(0) == "^" ? "" : "^")
          + negEscapes.join("") + "]"
          + (reduced ? ")" : "");
      }

      return "[" + reduced + "]";
    },

    fEscapeMapper = function (match, classRanges, p2, p3, p4, p5, p6, p7,
                               standalonePropSpec, standaloneClass) {
      var
        me = jsx.regexp.RegExp,
        propertyClasses = me.propertyClasses;

      /* If the Unicode Character Database (UCD) is not statically loaded */
      if (!propertyClasses)
      {
        /* load it dynamically, ignore exceptions */
        jsx.tryThis(function () { jsx.importFrom(me.ucdScriptPath); });

        propertyClasses = me.propertyClasses;

        /* if this failed */
        if (!propertyClasses)
        {
          if (!jsx.net || !jsx.net.http
              || typeof jsx.net.http.Request != "function")
          {
            jsx.throwThis("jsx.regexp.UCDLoadError",
              ['"' + me.ucdScriptPath + '" (jsx.regexp.RegExp.ucdScriptPath)',
              "http.js"]);
          }

          /* parse the text version of the UCD */
          var req = new jsx.net.http.Request(me.ucdTextPath, "GET", false,
            function (xhr) {
              var lines = xhr.responseText.split(/\r?\n|\r/).map(
                function (e) {
                  return e.split(";");
                });

              lines.sort(function (a, b) {
                var
                  a2 = a[2],
                  b2 = b[2],
                  a0 = a[0],
                  b0 = b[0];

                return (a2 < b2 || (a2 === b2 && a0 < b0))
                  ? -1
                  : (a2 === b2 && a0 === b0 ? 0 : 1);
              });

              propertyClasses = me.propertyClasses = {};

              for (var i = 0, len = lines.length; i < len; ++i)
              {
                var
                  fields = lines[i],
                  propertyClass = fields[2],
                  prevClass,
                  codePoint = fields[0],
                  prevCodePoint,
                  num = parseInt(codePoint, 16),
                  prevNum;

                if (codePoint == "" || num > 0xFFFF)
                {
                  continue;
                }

                if (propertyClass != prevClass)
                {
                  if (num != prevNum + 1)
                  {
                    if (startRange)
                    {
                      propertyClasses[prevClass] += "-\\u" + prevCodePoint;
                    }
                  }

                  propertyClasses[propertyClass] = "\\u" + codePoint;

                  var startRange = false;
                }
                else
                {
                  if (num != prevNum + 1)
                  {
                    if (startRange)
                    {
                      propertyClasses[prevClass] += "-\\u" + prevCodePoint;

                      startRange = false;
                    }

                    propertyClasses[propertyClass] += "\\u" + codePoint;
                  }
                  else
                  {
                    startRange = true;
                  }
                }

                prevClass = propertyClass,
                prevCodePoint = codePoint,
                prevNum = num;
              }

              if (startRange)
              {
                propertyClasses[prevClass] += "-\\u" + prevCodePoint;
              }
            });
          req.send();
        }
      }

      var _rangesStack = [];
      _rangesStack.toString = function () {
        return this.join(" --> ");
      };

      var _propertyClassReplacer = function (match, propertySpecifier, propertyClass) {
        if (propertySpecifier === "P")
        {
          jsx.throwThis("jsx.regexp.InvalidPropertyClassError",
            _rangesStack.pop()
            + " contains the negative property specifier \\P{" + propertyClass + "}");
          return;
        }

        return _getRanges(propertyClass);
      };

      /**
       * Retrieves class ranges by property class, and throws a specialized
       * exception if this fails.
       *
       * @param propertyClass : String
       * @throws jsx.regexp#UndefinedPropertyClassError
       */
      var _getRanges = function (propertyClass) {
        return jsx.tryThis(
          function () {
            if (_rangesStack.indexOf(propertyClass) > -1)
            {
              jsx.throwThis("jsx.regexp.InvalidPropertyClassError",
                propertyClass + " is cyclically defined ("
                + _rangesStack + " --> " + propertyClass
                + ")");
              return;
            }

            _rangesStack.push(propertyClass);

            var escapedRange = jsx_object.getProperty(propertyClasses, propertyClass);

            /*
             * Resolve property class references in property class values,
             * watch for cyclic structures.
             */
            var rxPropertyEscapes = new RegExp(sPropertyEscapes, "gi");
            var unescapedRange = escapedRange.replace(rxPropertyEscapes, _propertyClassReplacer);

            _rangesStack.pop();

            return unescapedRange;
          },
          function (e) {
            if (e.name == "jsx.object.PropertyError")
            {
              jsx.throwThis("jsx.regexp.UndefinedPropertyClassError",
                propertyClass + (_rangesStack.length > 1 ? " in " + _rangesStack : ""));
            }
            else
            {
              jsx.rethrowThis(e);
            }
          });
      };

      /* We can handle standalone class references … */
      if (standaloneClass)
      {
        var result = _getRanges(standaloneClass);
        result = "[" + (standalonePropSpec == "P" ? "^" : "") + result + "]";
      }
      else
      {
        /* … and class references in character classes */
        result = _normalizeCharClass(classRanges);

        result = result.replace(
            rxPropertyEscapes,
            function (match, propertySpecifier, propertyClass) {
              var ranges = _getRanges(propertyClass);
              return ranges;
            });
      }

      return result;
    };

  return function jsx_regexp_RegExp (expression, sFlags) {
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

    var pattern = expression;
    var flags = sFlags || "";
    
    var extended = false;
    var dotAll = false;
    var unicodeMode = false;

    if (sFlags)
    {
      if (sFlags.indexOf("x") > -1)
      {
        var originalExtended = extended = true;
      }
      
      if (sFlags.indexOf("s") > -1)
      {
        var originalDotAll = dotAll = true;
      }
      
      if (sFlags.indexOf("u") > -1)
      {
        var originalUnicodeMode = unicodeMode = true;
      }

      sFlags = sFlags.replace(/[xsu]/g, "");
    }
    
    expression = expression.replace(
      /(\(\?)([adlupimsx]*)(-([imsx]+))?\)/.concat(
        "|",
        /(#.*(\r?\n|\r|$))|\\(\s)/,
        "|",
        /\[([^\\\]]|\\.)*\]|(\s+)|\\\.|(\.)/g),
      function (match, modifierGroup, positiveModifiers, negativeModifiers_opt,
                 negativeModifiers, comment, newline,
                 escapedWS, charClassContent, whitespace,
                 plainDot, index, all) {
        /* Embedded pattern-match modifiers */
        if (modifierGroup)
        {
          if (positiveModifiers)
          {
            var
              rxPosModifiers = /[usx]/g,
              m;

            while ((m = rxPosModifiers.exec(positiveModifiers)))
            {
              switch (m[0])
              {
                case "s":
                  dotAll = true;
                  break;

                case "x":
                  extended = true;
              }
            }
          }

          if (negativeModifiers)
          {
            var rxNegModifiers = /[sx]/g;

            while ((m = rxNegModifiers.exec(negativeModifiers)))
            {
              switch (m[0])
              {
                case "s":
                  dotAll = false;
                  break;

                case "x":
                  extended = false;
              }
            }
          }

          return "";
        }

        /* PCRE_EXTENDED */
        if (extended)
        {
          /* Remove comments */
          if (comment)
          {
            return "";
          }
    
          /* Keep escaped whitespace, remove escape */
          if (escapedWS)
          {
            return escapedWS;
          }
          
          /* Remove unescaped whitespace */
          if (whitespace)
          {
            return "";
          }
        }
        
        /* PCRE_DOTALL */
        if (dotAll && plainDot)
        {
          return "[\\S\\s]";
        }
        
        return match;
      });
    
    /* Support for capturing groups */
    var groupCount = 0;
    var groups = _getDataObject();
    var names = _getDataObject();
    var patternGroups = [expression];

    expression = expression.replace(
      /(\\\()|(\((\?P?(<([^>]+)>|'([^']+)'))?)/g,
      function (match, escapedLParen, group, namedGroup, bracketsOrQuotes,
                 bracketedName, quotedName, index, all) {
        if (group)
        {
          ++groupCount;

          /* Support for named capturing groups (PCRE-compliant) */
          var name = bracketedName || quotedName;
          if (name)
          {
            if (names[name])
            {
              jsx.throwThis("SyntaxError", "Duplicate symbolic name");
            }

            groups[groupCount] = name;
            names[name] = groupCount;
          }

          /*
           * NOTE: Helps with determining in exec() and match()
           * whether \b matched at beginning and \Ws need to be
           * ltrimmed from match
           */
          patternGroups.push(all.substring(index));

          return "(";
        }

        return escapedLParen;
      });

    groups.length = groupCount;

    /* Unicode mode */
    if (unicodeMode)
    {
      var wordClass = "\\p{Word}";
      expression = expression.replace(
        /\[(([^\\\]]|\\.)*)\]|(\\(w))/gi,
        function (m, charClassContent, p2, wordCharacter, escapeLetter) {
          if (charClassContent)
          {
            var normalized = _normalizeCharClass(charClassContent, true);

            return normalized.replace(
              /\\\\|(\\(w))/gi,
              function (m, wordCharacter, escapeLetter) {
                if (wordCharacter)
                {
                  if (escapeLetter == "W")
                  {
                    if (charClassContent.charAt(0) != "^")
                    {
                      jsx.warn("jsx.RegExp: [...\\W{...}...] in Unicode mode"
                        + " not yet supported. Use [^...\\w...]"
                        + " in the meantime.");

                      return wordCharacter;
                    }
                  }

                  return wordClass;
                }

                return m;
              });
          }

          if (wordCharacter)
          {
            return "["
              + (escapeLetter === "W" ? "^" : "")
              + wordClass + "]";
          }

          return m;
        });

      /* replace \b */
      var firstGroup = expression.match(/\((\?(P?(<([^>]+)>|'([^']+)')|[:!]))?/);
      var afterFirstGroup = (firstGroup && (firstGroup.index + firstGroup[0].length) || 0);
      expression = expression.replace(
        /\\\\|(\\b)/g,
        function (m, wordBorder, index, all) {
          if (wordBorder)
          {
            /* FIXME: Does not work for \b in parentheses */
            if (index > afterFirstGroup)
            {
              return "(?!" + wordClass + ")";
            }

            return "(?:^|[^" + wordClass + "])";
          }

          return m;
        });
    }

    /* Support for Unicode character property classes (PCRE-compliant) */
    expression = expression.replace(rxEscapes, fEscapeMapper);

    var rx = new RegExp(expression, sFlags);

    /* Augmented properties */
    rx.pattern = pattern;
    rx.patternGroups = patternGroups;
    rx.groups = groups;
    rx.names = names;
    rx.flags = flags;
    rx.dotAll = !!originalDotAll;
    rx.extended = !!originalExtended;
    rx.unicodeMode = unicodeMode;

    if (unicodeMode)
    {
      rx._oldExec = rx.exec;
      rx.exec = jsx_regexp_RegExp.exec;
    }

    return rx;
  };
})();

/**
 * Determines if an object has been constructed using this constructor
 *
 * @param rx
 *   Instance to be tested
 * @return boolean
 *   <code>true</code> if <var>rx</var> has been constructed
 *   using this constructpr, <code>false</code> otherwise.
 */
jsx.regexp.RegExp.isInstance = function (rx) {
  return !!rx.pattern;
};

jsx.regexp.RegExp.exec = (function () {
  var _getDataObject = jsx.object.getDataObject;
  var _RegExp = jsx.regexp.RegExp;
  var rx2;

  return function (rx, s) {
    if (this.constructor == RegExp)
    {
      s = rx;
      rx = this;
    }

    rx.realExec = (rx._oldExec || rx.exec);

    var matches = rx.realExec(s);

    if (matches && _RegExp.isInstance(rx))
    {
      matches.groups = _getDataObject();

      if (rx.unicodeMode && !rx2)
      {
        rx2 = new _RegExp("^\\W+", "u");
      }

      for (var i = 0, len = matches.length; i < len; ++i)
      {
        /* Trim leading \b matches */
        var patternGroup = rx.patternGroups[i];
        if (rx.unicodeMode
            && patternGroup
            && patternGroup.match(
                 /^(\((\?P?(<([^>]+)>|'([^']+)'))?)*\\b/))
        {
          matches[i] = matches[i].replace(rx2, "");
        }

        matches.groups[rx.groups[i] || i] = matches[i];
      }
    }

    return matches;
  };
}());

jsx.regexp.RegExp.ucdScriptPath = "/scripts/UnicodeData.js";
jsx.regexp.RegExp.ucdTextPath = "/scripts/UnicodeData.txt";

jsx.regexp.RegExp.definePropertyClasses = function (o) {
  for (var p in o)
  {
    this.propertyClasses[p] = o[p];
  }
};

jsx.regexp.RegExp.deletePropertyClass = function (p) {
  return (delete this.propertyClasses[p]);
};

jsx.regexp.String = function jsx_regexp_String (s) {
  if (this.constructor != jsx_regexp_String)
  {
    jsx.throwThis("jsx.Error", "Must be called as constructor",
      "jsx.regexp.String");
  }

  this.value = String(s);
};

jsx.regexp.String.extend(String);

/**
 * Matches a string against a regular expression, using special features
 * of jsx.regexp.RegExp if possible
 *
 * @param rx : RegExp|jsx.regexp.RegExp
 * @return Array
 *   The Array as if returned by String.prototype.match.call(this, rx)
 */
jsx.regexp.String.prototype.match = (function () {
  var _getDataObject = jsx.object.getDataObject;
  var _RegExp2 = jsx.regexp.RegExp;
  var rxLeadingGroups, rxNonWordChars;

  return function (rx) {
    var matches = this.value.match(rx);

    if (matches && _RegExp2.isInstance(rx))
    {
      if (rx.unicodeMode)
      {
        if (!rxNonWordChars)
        {
          rxLeadingGroups = /^(\((\?P?(<([^>]+)>|'([^']+)'))?)*\\b/;
          rxNonWordChars = new _RegExp2("^\\W+", "u");
        }
      }
      
      if (rx.global)
      {
        /* Trim \b matches */
        if (rx.unicodeMode)
        {
          var patternGroup = rx.patternGroups[0];
          if (patternGroup.match(rxLeadingGroups))
          {
            for (var i = 0, len = matches.length; i < len; ++i)
            {
              matches[i] = matches[i].replace(rxNonWordChars, "");
            }
          }
        }
      }
      else
      {
        matches.groups = _getDataObject();

        for (var i = 0, len = matches.length; i < len; ++i)
        {
          if (rx.unicodeMode)
          {
            patternGroup = rx.patternGroups[i];
            if (patternGroup.match(rxLeadingGroups))
            {
              matches[i] = matches[i].replace(rxNonWordChars, "");
            }
          }
          
          matches.groups[rx.groups[i] || i] = matches[i];
        }
      }
    }

    return matches;
  };
}());

/**
 * Returns this object's encapsulated string value
 */
jsx.regexp.String.prototype.toString =
  jsx.regexp.String.prototype.valueOf = function () {
    return this.value;
  };

/**
 * Exception thrown if a character property class is referenced,
 * but the Unicode Character Database (UCD) cannot be loaded
 *
 * @constructor
 * @param sUCDScript : String
 *   The script that contains the UCD in the specified form
 * @param sHTTPScript : String
 *   The script that contains the HTTP request type to load the UCD
 *   dynamically
 * @extends jsx#Error
 */
jsx.regexp.UCDLoadError =
  function jsx_regexp_UCDLoadError (sUCDScript, sHTTPScript) {
    jsx_regexp_UCDLoadError._super.call(this,
      "Unable to load the Unicode Character Database."
      + " Please include " + sUCDScript + " or " + sHTTPScript + ".");
  }.extend(jsx.Error, {name: "jsx.regexp.UCDLoadError"});

/**
 * Exception thrown if a referred character property class
 * cannot be resolved
 *
 * @constructor
 * @param sMsg
 * @extends jsx.object#PropertyError
 */
jsx.regexp.UndefinedPropertyClassError =
  function jsx_regexp_UndefinedPropertyClassError (sMsg) {
    jsx_regexp_UndefinedPropertyClassError._super.call(this);
    this.message = "Undefined property class"
      + (arguments.length > 0 ? (": " + sMsg) : "");
  }.extend(jsx.object.PropertyError, {
    name: "jsx.regexp.UndefinedPropertyClassError"
  });

/**
 * Exception thrown if a property class value can not be expanded
 *
 * @constructor
 * @param sMsg
 * @extends jsx.object#ObjectError
 */
jsx.regexp.InvalidPropertyClassError =
  function jsx_regexp_InvalidPropertyClassError (sMsg) {
    jsx_regexp_InvalidPropertyClassError._super.call(this);
    this.message = "Invalid property class value"
      + (arguments.length > 0 ? (": " + sMsg) : "");
  }.extend(jsx.object.ObjectError, {
    name: "jsx.regexp.InvalidPropertyClassError"
  });