/* vim:set fileencoding=utf-8 tabstop=2 shiftwidth=2 softtabstop=2 expandtab: */
/**
 * <title>PointedEars' JSX: RegExp Library</title>
 * @filename regexp.js
 * @version $Id$
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2005-2016  Thomas Lahn &lt;js@PointedEars.de&gt;
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

(function () {
  "use strict";

  /**
   * @namespace
   */
  jsx.regexp = (/** @constructor */ function () {
    var _jsx_object = jsx.object;
    var _getClass = _jsx_object.getClass;
    var _getDataObject = _jsx_object.getDataObject;
    var _isString = _jsx_object.isString;

    /**
     * @namespace
     * @property pattern : String
     *   The original pattern string, including pattern-match
     *   modifiers.
     * @property _patternGroups : Array
     *   The part of the pattern string from the opening parenthesis
     *   of each pattern group to the end of the pattern, before
     *   character class expansion, and without pattern-match
     *   modifiers.  The first item (index 0) holds the complete
     *   pattern without modifiers.  Used internally; do not modify.
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
     *   A variant of the built-in {@link RegExp.prototype#exec()}
     *   to support named groups and Unicode mode transparently.
     * @method _oldExec
     *   The original inherited exec() method.  Used internally.
     * @method _realExec
     *   The used exec() method.  Used internally.
     * @function
     */
    var _RegExp2 = jsx.object.extend(
      (
        function () {
          var
            _destructure = jsx.array.destructure,
            _WideString = _jsx_object.getFeature(
              jsx, "string", "unicode", "WideString"),
            _fromCharCode = function (codePoint) {
              if (codePoint > 0xFFFF)
              {
                return _WideString.fromCharCode(codePoint);
              }

              return String.fromCharCode(codePoint);
            },

            propertyClasses,
            ucdFields = ["codePoint",, "propertyClass"],

            _parseUCDText = function () {
              (new jsx.net.http.Request(
                _RegExp2.ucdTextPath, "GET", false,
                function (xhr) {
                  var lines = xhr.responseText.split(/\r?\n|\r/).map(
                    function (e) {
                      var entry = _destructure(e.split(";"), ucdFields);
                      entry.codePoint = parseInt(entry.codePoint, 16);
                      return entry;
                    });

                  /* FIXME: Sometimes \p{Space} etc. are in not in RegExp class range order */
                  lines.sort(function (a, b) {
                    if (a.propertyClass < b.propertyClass)
                    {
                      return -1;
                    }

                    if (a.propertyClass > b.propertyClass)
                    {
                      return 1;
                    }

                    if (a.codePoint < b.codePoint)
                    {
                      return -1;
                    }

                    if (a.codePoint > b.codePoint)
                    {
                      return 1;
                    }

                    return 0;
                  });

                  propertyClasses = _RegExp2.propertyClasses = {};

                  for (var i = 0, len = lines.length; i < len; ++i)
                  {
                    var
                      line = lines[i],
                      propertyClass = line.propertyClass,
                      prevClass,
                      codePoint = line.codePoint,
                      prevCodePoint;

                    if (isNaN(codePoint) || (codePoint > 0xFFFF && !_WideString))
                    {
                      continue;
                    }

                    if (propertyClass != prevClass)
                    {
                      if (codePoint != prevCodePoint + 1)
                      {
                        if (startRange)
                        {
                          propertyClasses[prevClass] +=
                            "-" + _fromCharCode(prevCodePoint);
                        }
                      }

                      propertyClasses[propertyClass] =
                        _fromCharCode(codePoint);

                      var startRange = false;
                    }
                    else
                    {
                      if (codePoint != prevCodePoint + 1)
                      {
                        if (startRange)
                        {
                          propertyClasses[prevClass] +=
                            "-" + _fromCharCode(prevCodePoint);

                          startRange = false;
                        }

                        propertyClasses[propertyClass] +=
                          _fromCharCode(codePoint);
                      }
                      else
                      {
                        startRange = true;
                      }
                    }

                    prevClass = propertyClass,
                    prevCodePoint = codePoint;
                  }

                  if (startRange)
                  {
                    propertyClasses[prevClass] +=
                      "-" + _fromCharCode(prevCodePoint);
                  }
                }
              )).send();
            },

            sPropertyEscapes = "\\\\(p)\\{([^\\}]+)\\}",
            rxNegEscape = new RegExp(sPropertyEscapes.toUpperCase()
              + "|\\\\([DSW])", "g"),

            /**
             * @param {String} charClassContent
             * @param {boolean} bUnicodeMode
             * @return {string}
             */
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
                rxNegEscape,
                function (m, cP, charProperty, cDSW) {
                  var escapeChar = cP || cDSW;
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

                if (reduced !== "")
                {
                  jsx.warn(
                    "jsx.regexp.RegExp: Combined negative escapes in character classes"
                      + " require support for non-capturing parentheses");
                }

                return (reduced ? "(?:[" + reduced + "]|" : "")
                  + "[" + (charClassContent.charAt(0) == "^" ? "" : "^")
                  + negEscapes.join("") + "]"
                  + (reduced ? ")" : "");
              }

              return "[" + reduced + "]";
            },

            rxPropertyEscapes = new RegExp(sPropertyEscapes, "gi"),
            sNonPropEscInRange = "([^\\]\\\\]|\\\\[^p])*",
            sEscapes =
              "\\[(\\^?(" + sNonPropEscInRange + "(" + sPropertyEscapes
              + ")+" + sNonPropEscInRange + ")+)\\]"
              + "|" + sPropertyEscapes + "",
            rxEscapes = new RegExp(sEscapes, "gi"),

            /*jshint -W072*/
            fEscapeMapper = function (match, classRanges, p2, p3, p4, p5, p6, p7,
                                       standalonePropSpec, standaloneClass) {
              propertyClasses = _RegExp2.propertyClasses;

              /* If the Unicode Character Database (UCD) is not statically loaded */
              if (!propertyClasses)
              {
                /* load it dynamically, ignore exceptions */
                var ucdScriptPath = _RegExp2.ucdScriptPath;
                if (ucdScriptPath)
                {
                  jsx.tryThis(function () { jsx.importFrom(ucdScriptPath); });

                  propertyClasses = _RegExp2.propertyClasses;
                }

                /* if this failed */
                if (!propertyClasses)
                {
                  if (!jsx.net || !jsx.net.http
                      || typeof jsx.net.http.Request != "function")
                  {
                    jsx.throwThis("jsx.regexp.UCDLoadError",
                      ['"' + _RegExp2.ucdScriptPath + '" (jsx.regexp.RegExp.ucdScriptPath)',
                      "http.js"]);
                  }

                  /* parse the text version of the UCD */
                  _parseUCDText();
                }
              }

              /*
               * Define property classes required for Unicode mode
               * if not already defined
               */
              _jsx_object.extend(propertyClasses, {
                L:  "\\p{Ll}\\p{Lm}\\p{Lo}\\p{Lt}\\p{Lu}",
                M:  "\\p{Mc}\\p{Me}\\p{Mn}",
                N:  "\\p{Nd}\\p{Nl}\\p{No}",
                Digit: "\\p{Nd}",
                Space: "\u0009\u000a\u000c\u000d\u0020\u0085\u00a0"
                + "\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005"
                + "\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f"
                + "\u205f\u3000",
                Word: "\\p{L}\\p{M}\\p{N}\\p{Pc}"
              });

              var _rangesStack = _getDataObject({
                seen: _getDataObject(),
                items: [],

                indexOf: function (item) {
                  item = this.seen[item];
                  return (item ? item.index : -1);
                },

                pop: function () {
                  var items = this.items;
                  var last = items.pop();
                  delete this.seen[last];
                  this.length = items.length;
                  return last;
                },

                push: function (item) {
                  var items = this.items;
                  this.seen[item] = _getDataObject({index: items.length});
                  items.push(item);
                  this.length = items.length;
                },

                /**
                 * @return {string}
                 */
                toString: function () {
                  return this.items.join(" --> ");
                }
              });

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

              var _getRanges =
                /**
                 * Retrieves class ranges by property class, and throws a specialized
                 * exception if this fails.

                 * @param {String} propertyClass
                 * @throws jsx.regexp#UndefinedPropertyClassError
                 */
                function (propertyClass) {
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

                      var escapedRange = _jsx_object.getProperty(propertyClasses, propertyClass);

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
            /*jshint +W072*/

          /**
           * Creates and returns an extended {@link RegExp} object.
           *
           * This constructor accepts pattern and flags arguments where you
           * can use some features of Perl and Perl-compatible regular
           * expressions (PCRE); like {@link RegExp()}, it can also be called
           * as a function to do the same.  The {@link RegExp} instance it
           * returns is augmented with properties to support those features
           * when matching it against a string.
           *
           * The following additional features are currently supported:
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
           *         the pattern is ignored, so that it is easier
           *         human-readable.</li>
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
           *       in the optional <var>sFlags</var> argument set the initial
           *       state of the pattern-match modifiers; the extended
           *       {@link RegExp}'s <code>extended</code>, <code>dotAll</code>,
           *       and <code>unicodeMode</code> properties are set accordingly.
           *       These flags are removed from the <var>sFlags</var>
           *       argument subsequently, as it is reused to create the
           *       {@link RegExp} instance.  [Conforming implementations of
           *       ECMA-262-5.1 MUST throw a <code>SyntaxError</code>
           *       exception on flags other than <code>g</code>, <code>i</code>,
           *       and <code>m</code> (section 15.10.4.1); Mozilla JavaScript
           *       may also support the <code>y</code> (sticky) flag,
           *       but nothing else.]</li>
           *   <li>The pattern is run through several passes, where in each
           *       one it is scanned from left to right using another
           *       {@link RegExp}:
           *       <ol style="margin-bottom: 1em; list-style-type: lower-roman">
           *         <li><p>Capturing groups and pattern-match modifiers in the
           *             pattern are matched and replaced.
           *             <p>Capturing groups are replaced with the opening
           *             parenthesis if they were assigned a name.  The
           *             extended {@link RegExp}'s <code>groups</code>,
           *             <code>names</code>, and <code>_patternGroups</code>
           *             properties are set accordingly.  They are used in an
           *             overwritten <code>exec()</code> method and when matching
           *             against a <code>jsx.regexp.String</code> using its
           *             <tt>match(…)</tt> method.</p>
           *             <p style="margin-bottom: 0">
           *               Pattern-match modifiers are set and unset as they
           *               are scanned.  The corresponding substrings are
           *               removed from the pattern.  If the group is otherwise
           *               empty, and therefore is not a group at all,
           *               the entire pseudo-group is removed.</p>
           *             <ol style="margin-top: 0; list-style-type: lower-latin">
           *               <li>With PCRE_EXTENDED set, single-line
           *                   comments starting with <tt>#</tt> and unescaped
           *                   whitespace are removed from the pattern.  The backslash
           *                   is removed from the pattern when in front of
           *                   whitespace.</li>
           *               <li>With PCRE_DOTALL set, unescaped <tt>.</tt>
           *                   (period) characters are replaced with the character class
           *                   <tt>[\S\s]</tt> which matches all Unicode characters.</li>
           *             </ol>
           *             <p><em>NOTE: Unlike in Perl and PCRE, a pattern-match
           *                modifier affects all of the pattern that follows,
           *                even outside the group in which the modifier was
           *                set/unset.  This will be fixed in a later version.</em>
           *             </p></li>
           *         <li>When in Unicode mode,
           *             <ol style="list-style-type: lower-latin">
           *               <li>in the second pass, character class escape sequences
           *                   <tt>\w</tt> and <tt>\W</tt> are replaced with
           *                   corresponding uses of <tt>\p{Word}</tt>.</li>
           *               <li>in the third pass, <tt>\b</tt> is replaced with
           *                   corresponding uses of character classes and negative
           *                   lookahead.
           *             </ol></li>
           *         <li style="margin-top: 1em">The <tt>\p{…}</tt> and <tt>\P{…}</tt>
           *           escape sequences are replaced with the corresponding
           *           character classes.</li>
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
           * @constructor
           * @param {String|RegExp} expression
           *   A regular expression pattern string that may use the features
           *   described above.  If it is a {@link RegExp}, its
           *   <code>source</code> property is used and combined with
           *   <var>sFlags</var>.  That is, <code>jsx.regexp.RegExp(/foo/, "i")</code>
           *   returns the same as <code>jsx.regexp.RegExp(/foo/i)</code>.
           * @param {String} sFlags
           *   Optional string containing none, one or more of the standard
           *   {@link RegExp} modifiers and the flags described above.
           *   Unsupported flags are ignored, but passed on to {@link RegExp}.
           *   Note that modifiers in <var>expression</var> can temporarily
           *   unset and set the "s" and "x" flags.  Following Perl, the "u"
           *   flag (Unicode mode) can only be enabled, but not disabled.
           * @return {RegExp}
           *   A regular expression with the property class escape sequences
           *   expanded according to the specified data, with the specified
           *   flags set if they are natively supported.
           */
          function jsx_regexp_RegExp (expression, sFlags)
          {
            if (expression && _getClass(expression) == "RegExp")
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
                unicodeMode = true;
              }

              sFlags = sFlags.replace(/[xsu]/g, "");
            }

            /* Support for capturing and special groups */
            var groupCount = 0;
            var groups = _getDataObject();
            var names = _getDataObject();
            var patternGroups = [expression];

            /*jshint -W072*/
            expression = expression.replace(
              /(\\\()/.concat(
                "|",
                /(\((\?P?(([adlupimsx]+)?(-([imsx]+))?)(<([^>]+)>|'([^']+)'|([:!]))?(\))?)?)/g,
                "|",
                /(#.*(\r?\n|\r|$))|\\(\s)/,
                "|",
                /\[([^\\\]]|\\.)*\]|(\s+)|\\\.|(\.)/g
              ),
              function (match, escapedLParen,
                         group, specialGroup, modifierGroup,
                         positiveModifiers, negativeModifiers_opt, negativeModifiers,
                         namedGroup, bracketedName, quotedName,
                         nonCapturingGroup, emptyGroup,
                         comment, newline,
                         escapedWS, charClassContent, whitespace,
                         plainDot,
                         index, all) {
                if (group)
                {
                  var capturingGroup = (!nonCapturingGroup && !(modifierGroup && emptyGroup));
                  if (capturingGroup)
                  {
                    ++groupCount;
                  }

                  if (positiveModifiers)
                  {
                    var
                      rxPosModifiers = /[sx]/g,
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

                  if (capturingGroup)
                  {
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

                  return emptyGroup ? "" : "(?" + nonCapturingGroup;
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
            /*jshint +W072*/

            groups.length = groupCount;

            /* Unicode mode */
            if (unicodeMode)
            {
              var characterEscapes = {
                "d": "\\p{Digit}",
                "s": "\\p{Space}",
                "w": "\\p{Word}"
              };

              expression = expression.replace(
                /\[(([^\]\\]|\\.)*)\]|(\\([dsw]))/gi,
                function (match, charClassContent, p2, classCharacter, escapeLetter) {
                  if (charClassContent)
                  {
                    /* Do not expand PCRE_DOTALL expansion */
                    /* TODO: Never expand all-inclusive character classes */
                    if (charClassContent == "\\S\\s")
                    {
                      return "[" + charClassContent + "]";
                    }

                    var normalized = _normalizeCharClass(charClassContent, true);

                    return normalized.replace(
                      /\\\\|\\([dsw])/gi,
                      function (match, escapeLetter) {
                        if (escapeLetter)
                        {
                          return characterEscapes[escapeLetter.toLowerCase()];
                        }

                        return match;
                      });
                  }

                  if (classCharacter)
                  {
                    return "["
                      + (escapeLetter >= "A" && escapeLetter <= "Z" ? "^" : "")
                      + characterEscapes[escapeLetter.toLowerCase()] + "]";
                  }

                  return match;
                });

              /* Replace \b */
              var firstGroup = expression.match(/\((\?(P?(<([^>]+)>|'([^']+)')|[:!]))?/);
              var afterFirstGroup = (firstGroup && (firstGroup.index + firstGroup[0].length) || 0);
              var wordEscape = characterEscapes.w;
              expression = expression.replace(
                /\\\\|(\\b)/g,
                function (match, wordBorder, index, all) {
                  if (wordBorder)
                  {
                    /* Handle \b in leading groups properly */
                    if (index > afterFirstGroup)
                    {
                      return "(?!" + wordEscape + ")";
                    }

                    return "(?:^|[^" + wordEscape + "])";
                  }

                  return match;
                });
            }

            /* Support for Unicode character property classes (PCRE-compliant) */
            expression = expression.replace(rxEscapes, fEscapeMapper);

            var rx = new RegExp(expression, sFlags);

            /* Augmented properties */
            rx.pattern = pattern;
            rx._patternGroups = patternGroups;
            rx.groups = groups;
            rx.names = names;
            rx._flags = flags;
            rx.dotAll = !!originalDotAll;
            rx.extended = !!originalExtended;
            rx.unicodeMode = unicodeMode;

            rx._oldExec = rx.exec;
            rx.exec = jsx_regexp_RegExp.exec;

            return rx;
          }

          return jsx_regexp_RegExp;
        }()
      ),
      {
        /**
         * @memberOf jsx.regexp.RegExp
         */
        ucdScriptPath: "/scripts/UnicodeData.js",
        ucdTextPath: "/scripts/UnicodeData.txt",

        /**
         * Determines if an object has been constructed using this constructor.
         *
         * @param rx
         * @return {boolean}
         */
        isInstance: function (rx) {
          return !!rx.pattern;
        },

        /**
         * @function
         */
        exec: (function () {
          var rx2;

          /**
           * @param {string} s
           * @param {jsx.regexp.RegExp} rx
           * @return {Object|null}
           * @see RegExp.prototype.exec()
           */
          function _exec (s, rx)
          {
            /* NOTE: Use passed expression only when called statically */
            if (_getClass(this) == "RegExp")
            {
              rx = this;
            }

            rx._realExec = (rx._oldExec || rx.exec);

            var matches = rx._realExec(s);

            if (matches && _RegExp2.isInstance(rx))
            {
              matches.groups = _getDataObject();

              if (rx.unicodeMode && !rx2)
              {
                rx2 = new _RegExp2("^\\W+", "u");
              }

              for (var i = 0, len = matches.length; i < len; ++i)
              {
                /* Trim leading \b matches */
                var patternGroup = rx._patternGroups[i];
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
          }

          return _exec;
        }()),

        /**
         * (Re-)defines one or more property classes.
         *
         * @param {Object} o
         *   Object whose own enumerable properties are used
         *   for property class definitions
         * @return {jsx.regexp.RegExp}
         *   This object
         */
        definePropertyClasses: function (o) {
          for (var keys = _jsx_object.getKeys(o), i = 0, len = keys.length;
               i < len; ++i)
          {
            var p = keys[i];
            this.propertyClasses[p] = o[p];
          }

          return this;
        },

        /**
         * Deletes a property class.
         *
         * @param {String} p
         * @return {boolean}
         *   <code>true</code> if successful, <code>false</code> otherwise.
         */
        deletePropertyClass: function (p) {
          return (delete this.propertyClasses[p]);
        }
      }
    );

    return {
      /**
       * @version
       * @memberOf jsx.regexp
       */
      version:   "0.1.$Revision$",
      copyright: "Copyright \xA9 2005-2013",
      author:    "Thomas Lahn",
      email:     "js@PointedEars.de",
      path:      "http://pointedears.de/scripts/",

      /**
       * Exception thrown if a character property class is referenced,
       * but the Unicode Character Database (UCD) cannot be loaded
       *
       * @constructor
       * @param {String} sUCDScript
       *   The script that contains the UCD in the specified form
       * @param {String} sHTTPScript
       *   The script that contains the HTTP request type to load the UCD
       *   dynamically
       * @type jsx.regexp.UCDLoadError
       * @extends jsx#Error
       */
      UCDLoadError:
        function jsx_regexp_UCDLoadError (sUCDScript, sHTTPScript) {
          jsx_regexp_UCDLoadError._super.call(this,
            "Unable to load the Unicode Character Database."
            + " Please include " + sUCDScript + " or " + sHTTPScript + ".");
        }.extend(jsx.Error, {
          /**
           * @memberOf jsx.regexp.UCDLoadError#prototype
           */
          name: "jsx.regexp.UCDLoadError"
        }),

      /**
       * Exception thrown if a referred character property class
       * cannot be resolved
       *
       * @extends jsx.object.PropertyError
       */
      UndefinedPropertyClassError:
        /**
         * @constructor
         * @param sMsg
         */
        function jsx_regexp_UndefinedPropertyClassError (sMsg) {
          jsx_regexp_UndefinedPropertyClassError._super.call(this);
          this.message = "Undefined property class"
            + (arguments.length > 0 ? (": " + sMsg) : "");
        }.extend(jsx.object.PropertyError, {
          /**
           * @memberOf jsx.regexp.UndefinedPropertyClassError#prototype
           */
          name: "jsx.regexp.UndefinedPropertyClassError"
        }),

      /**
       * Exception thrown if a property class value can not be expanded
       *
       * @constructor
       * @param sMsg
       * @extends jsx.object.ObjectError
       */
      InvalidPropertyClassError:
        function jsx_regexp_InvalidPropertyClassError (sMsg) {
          jsx_regexp_InvalidPropertyClassError._super.call(this);
          this.message = "Invalid property class value"
            + (arguments.length > 0 ? (": " + sMsg) : "");
        }.extend(jsx.object.ObjectError, {
          name: "jsx.regexp.InvalidPropertyClassError"
        }),

      RegExp: _RegExp2,

      /**
       * @constructor
       * @extends String
       */
      String: function jsx_regexp_String (s) {
        if (this.constructor != jsx_regexp_String)
        {
          jsx.throwThis("jsx.Error", "Must be called as constructor",
            "jsx.regexp.String");
        }

        this.value = String(s);
      }.extend(String, (function () {
        var _replace = String.prototype.replace;

        function _toString ()
        {
          return this.value;
        }

        return {
          /**
           * Matches a string against a regular expression, using special features
           * of jsx.regexp.RegExp if possible
           *
           * @function
           */
          match: (function () {
            var rxLeadingGroups, rxNonWordChars;

            /**
             * @param {RegExp|jsx.regexp.RegExp} rx
             * @return {Array}
             *   The Array as if returned by String.prototype.match.call(this, rx)
             */
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
                    var patternGroup = rx._patternGroups[0];
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

                  for (i = 0, len = matches.length; i < len; ++i)
                  {
                    if (rx.unicodeMode)
                    {
                      patternGroup = rx._patternGroups[i];
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
          }()),

          /**
           * Replaces matches in a string, and returns the new string.
           *
           * Different to {@link String.prototype.replace()},
           * this methods also allows you to refer to backreferences
           * by name.  In a String-like object, you may use
           * <code>"${name}"</code>, and in a replacement function
           * you may use <code>this.groups["name"]</code>.
           *
           * NOTE: Because of the latter the replacement function
           * is called as a method of this object, not of
           * the Global Object anymore.  The <code>groups</code>
           * property of this object is retained; that is, the last
           * arguments to this method can be found in there.
           * (Arguments and return value of the replacement function
           * still work as specified in ECMAScript.)
           *
           * @memberOf jsx.regexp.String.prototype
           * @param {jsx.regexp.RegExp|RegExp|String} expression
           * @param {String|Function} replacement
           * @return {string}
           * @see String.prototype.replace
           */
          replace: function (expression, replacement) {
            if (jsx.regexp.RegExp.isInstance(expression))
            {
              var groups = expression.groups;
              var len = groups.length;

              if ((typeof replacement) == "function")
              {
                var me = this;
                return _replace.call(this, expression, function () {
                  me.groups = _getDataObject();
                  for (var i = 1; i <= len; ++i)
                  {
                    me.groups[groups[i]] = arguments[i];
                  }

                  return replacement.apply(me, arguments);
                });
              }

              for (var i = 1; i <= len; ++i)
              {
                /* replace "${name}" with "${index}" */
                replacement = _replace.call(
                  replacement,
                  new RegExp("\\$\\{" + groups[i] + "\\}", "g"),
                  "$" + i);
              }
            }

            return _replace.call(this, expression, replacement);
          },

          /**
           * Returns this object's encapsulated string value
           */
          toString: _toString,
          valueOf: _toString
        };
      }())),

      /**
       * Concatenates strings or regular expressions ({@link RegExp})
       * and returns the resulting <code>RegExp</code>.
       *
       * If flags are set with either <code>RegExp</code> argument, the
       * resulting <code>RegExp</code> has all of those flags set.
       *
       * @author Copyright (c) 2005
       *   Thomas Lahn &lt;regexp.js@PointedEars.de&gt;
       * @param {RegExp|String}
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
       * @return {RegExp}
       *   The resulting <code>RegExp</code>
       */
      concat: function () {
        var aParts = [];

        var oFlags = {
          flags: {
            g: "global",
            i: "ignoreCase",
            m: "multiline",
            y: "sticky",
            s: "dotAll",
            x: "extended",
            u: "unicodeMode"
          },
          g: false,
          i: false,
          m: false,
          y: false,
          s: false,
          x: false,
          u: false,

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
             * @return {string}
             */
            function () {
              var a = [];

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
        var partIsExtended = false;

        if (_getClass(this) == "RegExp")
        {
          aParts.push(regexp2str(this));
          oFlags.setFromTemplate(this);

          if (!partIsExtended)
          {
            partIsExtended = _RegExp2.isInstance(this);
          }
        }

        for (var i = 0, iArgnum = arguments.length; i < iArgnum; i++)
        {
          var a = arguments[i];
          if (_getClass(a) == "RegExp")
          {
            if (!partIsExtended)
            {
              partIsExtended = _RegExp2.isInstance(a);
            }

            aParts.push(regexp2str(a));
            oFlags.setFromTemplate(a);
          }
          else
          {
            aParts.push(String(a));
          }
        }

        var C = partIsExtended ? _RegExp2 : RegExp;

        return new C(aParts.join(""), oFlags.toString());
      },

      /**
       * Returns a {@link RegExp} that is an intersection of two
       * regular expressions.
       *
       * @param {RegExp} pattern2
       * @param {RegExp} pattern1
       * @return {RegExp}
       *   A regular expression which matches the strings that both
       *   <var>pattern1</var> (or this object) and <var>pattern2</var>
       *   would match.
       */
      intersect: function (pattern2, pattern1) {
        if (!pattern1 || _getClass(pattern1) != "RegExp")
        {
          if (_getClass(this) == "RegExp")
          {
            pattern1 = this;
          }
          else
          {
            return null;
          }
        }

        /* Rule out invalid values */
        if (!pattern2 || _getClass(pattern2) != "RegExp")
        {
          return null;
        }

        /* Remove outer parentheses */
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
        var hasOwnProperty = (function () {
          return (
            (typeof Object.prototype.hasOwnProperty == "function")
              ? function (o, p) {
                  return o.hasOwnProperty(p);
                }
              : function (o, p) {
                  /* suffices _here_ */
                  return typeof o[p] != "undefined"
                    && typeof o.constructor.prototype[p] == "undefined";
                }
          );
        }());

        a = [];
        for (var p in o)
        {
          if (hasOwnProperty(o2, p))
          {
            a.push(p);
          }
        }

        return new RegExp("(" + a.join("|") + ")");
      },

      /**
       * Returns an escaped version of the string that can be passed
       * as an argument to {@link Global#RegExp(string, string) RegExp()}
       * to match that string.
       *
       * @param {string} s
       * @return {string}
       */
      escape: function (s) {
        if (arguments.length === 0 && _isString(this.constructor))
        {
          s = this;
        }

        return s.replace(/[\]\\^$*+?.(){}|[]/g, "\\$&");
      },

      /**
       * Returns the string representation of a {@link RegExp}
       * without delimiters.
       *
       * @param {RegExp} rx
       * @return {string}
       *   The string representation of <var>rx</var>
       */
      toString2: function (rx) {
        // return rx.toString().replace(/[^\/]*\/((\\\/|[^\/])+)\/[^\/]*/, "$1");
        if (!rx)
        {
          rx = this;
        }

        return rx.source || rx.toString().replace(/[^\/]*\/(.+)\/[^\/]*/, "$1");
      }
    };
  }());

  // jsx.regexp.docURL = jsx.regexp.path + "regexp.htm";

  if (jsx.options.augmentPrototypes)
  {
    jsx.object.extend(RegExp.prototype, {
      /**
       * @memberOf RegExp.prototype
       */
      intersect: jsx.regexp.intersect,
      concat: jsx.regexp.concat,
      toString2: jsx.regexp.toString2
    });

    jsx.object.extend(String.prototype, {
      /**
       * @memberOf String.prototype
       */
      regExpEscape: jsx.regexp.escape
    });
  }
}());

/*jshint -W098*/

/** @deprecated */
var regexp2str = jsx.regexp.toString2;

/** @deprecated */
var regexp_concat = jsx.regexp.concat;

/** @deprecated */
var regexp_intersect = jsx.regexp.intersect;

/** @deprecated */
var strRegExpEscape = jsx.regexp.escape;
