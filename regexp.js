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
      function () {
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
      aParts.push(String(a));
    }
  }

  return new RegExp(aParts.join(""), oFlags.joinSet());
};
RegExp.prototype.concat = regexp_concat;

/**
 * Returns a {@link RegExp} that is an alternation of two
 * regular expressions.
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
 * Creates an extended {@link RegExp} where you can use some
 * features of Perl-compatible regular expressions (PCRE).
 *
 * The following PCRE features are currently supported:
 * <ul>
 *   <li>Flags:
 *     <ul>
 *       <li><tt>s</tt> (PCRE_DOTALL)</tt> – the <tt>.</tt> metacharacter
 *         matches newline as well.</li>
 *       <li><tt>x</zz> (PCRE_EXTENDED)</tt> – whitespace within
 *         the pattern is ignored, so that it is easier human-readable.</li>
 *     </ul>
 *   </li>
 *   <li>Unicode property classes using e.g. the \p{…} notation</li>
 *   <li>Named capturing groups by passing strings with the
 *       <tt>(?P&lt;name>…)</tt> or <tt>(?P'name'…)</tt> notation,
 *       where the <tt>P</tt> is optional, respectively.</li>
 * </ul><p>
 * This is facilitated with replacing certain substrings in the
 * passed pattern:
 * </p><ul>
 *   <li>Flags:
 *     <ul>
 *       <li>With <tt>s</tt> (<tt>PCRE_DOTALL</tt>), unescaped <tt>.</tt>
 *         characters are replaced by the character class <tt>[\S\s]</tt>.</li>
 *       <li>With <tt>x</tt> (<tt>PCRE_EXTENDED</tt>), whitespace is removed
 *         from the pattern.</li>
 *     </ul>
 *   </li>
 *   <li><tt>\p{…}</tt> and <tt>\P{…}</tt> escape sequences are
 *       replaced by the corresponding character classes</li>
 *   <li><tt>(?P&lt;name>…)</tt> and <tt>(?P'name'…)</tt> generate
 *       properties of a user-defined <tt>group</tt> property of the
 *       extended RegExp that are used when matching it against a
 *       <code>jsx.regexp.String</code> using its
 *       <tt>match(…)</tt> method.</li>
 * </ul><p>
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
 * the file specified by the <code>ucdScriptPath</code> (default:
 * <code>"/scripts/UnicodeData.js"</code>) using synchronous XHR
 * (see below).
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
 * @function
 * @constructor
 * @param expression : String|RegExp
 * @param sFlags : String
 * @return RegExp
 *   A regular expression with the property class escape sequences
 *   expanded according to the specified data, with the specified
 *   flags set.
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

  return function (expression, sFlags) {
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

    if (sFlags)
    {
      /* Support for the PCRE `x' option flag (PCRE_EXTENDED) */
      if (sFlags.indexOf("x") > -1)
      {
        expression = expression.replace(/(\\\s|\[([^\\\]]|\\.)*\])|\s+/g, "$1");
        sFlags = sFlags.replace(/x/g, "");
      }

      /* Support for the PCRE 's' option flag (PCRE_DOTALL) */
      if (sFlags.indexOf("s") > -1)
      {
        expression = expression.replace(
          /\[([^\\\]]|\\.)*\]|\\\.|(\.)/g,
          function (m, classDot, plainDot) {
            if (plainDot)
            {
              return "[\\S\\s]";
            }

            return m;
          });

        sFlags = sFlags.replace(/s/g, "");
      }
      
      if (sFlags.indexOf("u") > -1)
      {
        expression = expression.replace(
          /\[(([^\\\]]|\\.)*)\]|(\\(w))/gi,
          function (m, charClassContent, p2, wordCharacter, escapeLetter) {
            var wordClass = "\\p{L}\\p{M}\\p{Pc}_";
            
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
        
        sFlags = sFlags.replace(/u/g, "");
      }
    }

    var groupCount = 0;
    this.groups = {};
    var me = this;

    /* Support for named capturing groups (PCRE-compliant) */
    expression = expression.replace(
      /(\\\()|(\((\?P?(<([^>]+)>|'([^']+)'))?)/g,
      function (match, escapedLParen, group, namedGroup, bracketsOrQuotes,
                 bracketedName, quotedName) {
        if (group)
        {
          ++groupCount;

          var name = bracketedName || quotedName;
          if (name)
          {
            me.groups[groupCount] = name;
          }

          return "(";
        }

        return escapedLParen;
      });

    /* Support for Unicode character property classes (PCRE-compliant) */
    expression = expression.replace(rxEscapes, fEscapeMapper);

    var rx = new RegExp(expression, sFlags);
    rx.originalSource = originalSource;
    rx.groups = this.groups;

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
  return !!rx.originalSource;
};

jsx.regexp.RegExp.exec = function (rx, s) {
  var matches = rx.exec(s);

  if (matches && !rx.global && this.isInstance(rx))
  {
    matches.groups = {};

    for (var i = 1, len = matches.length; i < len; ++i)
    {
      matches.groups[rx.groups[i]] = matches[i];
    }
  }

  return matches;
};

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
  var isInstance = jsx.regexp.RegExp.isInstance;

  return function (rx) {
    var matches = this.value.match(rx);

    if (matches && !rx.global && isInstance(rx))
    {
      matches.groups = {};

      for (var i = 1, len = matches.length; i < len; ++i)
      {
        matches.groups[rx.groups[i]] = matches[i];
      }
    }

    return matches;
  };
}());

/**
 * Returns this object's encapsulated string value
 */
jsx.regexp.String.prototype.toString = jsx.regexp.String.prototype.valueOf =
  function () {
    return this.value;
  };

  /**
   * Exception thrown if a character property class is referenced, but the
   * Unicode Character Database (UCD) cannot be loaded
   *
   * @constructor
   * @param sUCDScript : String
   *   The script that contains the UCD in the specified form
   * @param sHTTPScript : String
   *   The script that contains the HTTP request type to load the UCD
   *   dynamically
   * @extends jsx#Error
   */
jsx.regexp.UCDLoadError = function UCDLoadError (sUCDScript, sHTTPScript) {
  UCDLoadError._super.call(this,
    "Unable to load the Unicode Character Database."
    + " Please include " + sUCDScript + " or " + sHTTPScript + ".");
}.extend(jsx.Error, {name: "jsx.regexp.UCDLoadError"});

/**
 * Exception thrown if a referred character property class cannot be resolved
 *
 * @constructor
 * @param sMsg
 * @extends jsx.object#PropertyError
 */
jsx.regexp.UndefinedPropertyClassError = function UndefinedPropertyClassError (sMsg) {
  UndefinedPropertyClassError._super.call(this);
  this.message = "Undefined property class" + (arguments.length > 0 ? (": " + sMsg) : "");
}.extend(jsx.object.PropertyError, {name: "jsx.regexp.UndefinedPropertyClassError"});

/**
 * Exception thrown if a property class value can not be expanded
 *
 * @constructor
 * @param sMsg
 * @extends jsx.object#ObjectError
 */
jsx.regexp.InvalidPropertyClassError = function InvalidPropertyClassError (sMsg) {
  InvalidPropertyClassError._super.call(this);
  this.message = "Invalid property class value" + (arguments.length > 0 ? (": " + sMsg) : "");
}.extend(jsx.object.ObjectError, {name: "jsx.regexp.InvalidPropertyClassError"});
