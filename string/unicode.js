/* vim:set fileencoding=utf-8 tabstop=2 shiftwidth=2 softtabstop=2 expandtab: */
/**
 * @fileOverview <title>PointedEars' JSX: String Library -- Unicode Support</title>
 * @file $Id$
 * @requires object.js
 *
 * @section {Abstract}
 *
 * A value of the primitive type {@link String} is defined in
 * ECMAScript, Editions 1 to 5.1 inclusive, as a sequence of 16-bit
 * units.  Each unit is assumed, unless specified otherwise, to be
 * the UTF-16 code sequence for a Unicode character.  The length
 * of a String is defined as the number of 16-bit units in the
 * value, and the position of a character is defined as the position
 * of the corresponding 16-bit unit in the String value.
 *
 * However, Unicode characters with code points beyond the Basic
 * Multilingual Plane (BMP) require two UTF-16 code units, thus two
 * 16-bit units, to be encoded.  This makes it hard to use them
 * in ECMAScript because they are not considered by ECMAScript's
 * string-related algorithms.  For example, for a string value that
 * contains only one character but that has a code point beyond
 * the multilingual plane (non-BMP character), the specified length
 * and the value of the <code>length</code> property is
 * <code>2</code>.  Retrieving the (code point of the) first
 * character from a string with
 * <code>{@link String.prototype#charAt}(0)</code>.
 * where the character has a code point beyond the multilingual
 * plane, returns the (code point of the) (non-)character for its
 * <em>lead surrogate</em>.  Retrieving with
 * <code>{@link String.prototype#charAt}(1)</code>
 * the (code point of) the second character from a string that
 * contains a first non-BMP character returns the first character's
 * <em>trail surrogate</em> instead.
 * {@link String.fromCharCode()} returns the character for the
 * normalized code point value for arguments that are code point
 * values beyond the BMP (e.g., <code>String.fromCharCode(0x1DD1E)
 * === "\uDD1E"</code>).
 *
 * This library replaces the values of certain built-in properties
 * of the <code>String</code> constructor and <code>String</code>
 * prototype object such as the ones mentioned above, and adds
 * others to the prototype object, so as to support non-BMP
 * characters in implementations of those ECMAScript Editions
 * as well almost seamlessly.  However, non-callable built-in
 * own and inherited properties of <code>String</code> values,
 * like <code>length</code>, are <em>not</em> modified.
 * (In case of <code>length</code>, use <code>getLength()</code>
 * instead.)
 *
 * <em>NOTE: Due to {@link Array} limitations, the maximum
 * supported string length is 2³²−1 characters.</em>
 *
 * @section {Copyright & Disclaimer}
 *
 * @author (C) 2013  Thomas Lahn &lt;js@PointedEars.de&gt;
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

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

if (typeof jsx.string == "undefined")
{
  /**
   * @namespace
   */
  jsx.string = {};
}

/**
 * @type jsx.string.unicode
 * @memberOf __jsx.string.unicode
 * @namespace
 */
jsx.string.unicode = (/** @constructor */ function () {
  var _isArray = jsx.object.isArray;

  /* Handles characters in UTF-16 encoding from U+0000 to U+10FFFF */
  var _rxString = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\S\s]/g;

  /**
   * @private
   * @param {String} s
   *   String to be split into an array of characters
   * @return {Array}
   */
  function _toCharArray (s)
  {
    return (s ? (String(s).match(_rxString) || []) : []);
  }

  /**
   * Converts a {@link String} value to a wide string.
   * <p>
   * A <code>WideString</code> supports all operations and methods
   * supported on <code>String</code> values also for Unicode
   * characters outside the Basic Multilingual Plane (BMP:
   * U+10000 to U+10FFFF).  Because strings of characters are
   * stored as an {@link Array} of <code>String</code>s,
   * operations where such characters are more common are faster
   * than with the <code>String</code> prototype augmentation.
   * In other cases you should use the augmentation instead.
   * </p><p>
   * You may call a <code>WideString</code>'s
   * {@link WideString#prototype.toString toString()} method
   * (implicitly called in string context, like concatenation)
   * to convert it back to a <code>String</code> value.
   * </p><p>
   * <em>NOTE: Due to <code>Array</code> limitations, a
   * <code>WideString</code> may not contain more than
   * 2³²−1 Unicode characters.  Also note that normalization
   * is <strong>not</strong> performed at the moment.</em>
   * </p>
   * @type jsx.string.unicode.WideString
   * @extends String
   * @constructor
   */
  var _WideString = (
    /**
     * @param {String} s
     * @return {jsx.string.unicode.WideString}
     */
    function jsx_string_unicode_WideString (s) {
      /* Factory support */
      if (!(this instanceof jsx_string_unicode_WideString))
      {
        return new jsx_string_unicode_WideString(s);
      }

      /**
       * @private
       * @type Array
       */
      var _chars =
        _isArray(s)
        ? s
        : (s instanceof jsx_string_unicode_WideString
            ? s.getChars()
            : _toCharArray(s));

      /**
       * Returns the characters in this object as an {@link Array}
       * of {@link String}s.
       *
       * @protected
       * @return {Array}
       */
      this.getChars = function () {
        return _chars;
      },

      /**
       * @name chars
       * @memberOf jsx.string.unicode.WideString
       * @field
       * @type Array
       */
      jsx.object.defineProperty(this, "chars", {"get": this.getChars});
    }
  ).extend(String, {
    /**
     * Returns the character at the specified position.
     *
     * <em>NOTE: A single Unicode character may be composed out of
     * several other characters.  Normalization is not performed.</em>
     *
     * @memberOf jsx.string.unicode.WideString#prototype
     * @param {int} position
     *   If not an integer, replaced with the closest integer.
     * @return {string}
     *   If <code><var>position</var></code> is greater than or
     *   equal to zero, the character at that position, counted
     *   from zero.
     *   If <code><var>position</var></code> is less than zero,
     *   it is treated as the number of characters in this object
     *   + <code><var>position</var></code>; that is,
     *   <code><var>position</var> === -1</code>
     *   returns the last character.
     *   If <code><var>position</var></code> is replaceable with
     *   an integer out of this range, <code>undefined</code>
     *   is returned.
     *   By contrast, if <code><var>position</var></code> is
     *   not a <code>Number</code>, the return value is
     *   <strong>not defined</strong>.
     */
    charAt: function (position) {
      var chars = this.getChars();
      position = (position < 0 ? Math.ceil(position) : Math.floor(position));
      return (position < 0
        ? chars[chars.length + position]
        : chars[position]);
    },

    /**
     * Returns the Unicode code point value of the character
     * in this object at the specified position.
     *
     * <em>NOTE: A single Unicode character may be composed out of
     * several other characters.  Normalization is not performed.</em>
     *
     * @memberOf jsx.string.unicode.WideString#prototype
     * @see #charAt()
     */
    charCodeAt: (function () {
      var String_prototype_charCodeAt = "".charCodeAt;

      /**
       * @param {Number} position
       *   If not an integer, replaced with the closest integer.
       * @return {number}
       *   If <code><var>position</var></code> is greater than or
       *   equal to zero, the code point value of the character
       *   at that position, counted from zero.
       *   If <code><var>position</var></code> is less than zero,
       *   it is treated as the number of characters in this object
       *   + <code><var>position</var></code>; that is,
       *   <code><var>position</var> === -1</code>
       *   returns the code point value of the last character.
       *   If <code><var>position</var></code> is replacable with
       *   an integer value out of this range, <code>NaN</code>
       *   is returned.
       *   By contrast, if <code><var>position</var></code> is
       *   not a <code>Number</code>, the return value is
       *   <strong>not defined</strong>.
       */
      function _charCodeAt (position)
      {
        var ch = this.charAt(position);
        if (typeof ch == "undefined")
        {
          return NaN;
        }

        if (/^[\uD800-\uDBFF]/.test(ch))
        {
          var leadSurrogate = String_prototype_charCodeAt.call(ch, 0);
          var trailSurrogate = String_prototype_charCodeAt.call(ch, 1);

          var leadBits = (leadSurrogate - 0xD800) << 10;
          var trailBits = trailSurrogate - 0xDC00;
          var bmpOffset = 0x10000;

          return leadBits + trailBits + bmpOffset;
        }

        return String_prototype_charCodeAt.call(ch, 0);
      }

      return _charCodeAt;
    }()),

    /**
     * Concatenates this string with other strings
     * and returns the result.
     *
     * Returns the <code>WideString</code> resulting from
     * concatenating the list of characters in this object with
     * the list of the arguments' characters.
     *
     * @function
     */
    concat: (function () {
      var _slice = [].slice;

      /**
       * @params {WideString|String}
       * @return {WideString}
       */
      function _concat ()
      {
        return new this.constructor(this.toString()
          + _slice.call(arguments).join(""));
      }

      return _concat;
    }()),

    /**
     * Returns the number of characters in this string
     *
     * @return {int}
     * @see #length
     */
    getLength: function () {
      return this.getChars().length;
    },

    /**
     * Returns the index of the first position of a substring
     * in this string.
     *
     * @param {jsx.string.unicode.WideString|String} searchString
     *   Substring to look for.
     * @param {int} position
     *   Position from where to start searching. The default is
     *   <code>0</code>.
     * @return {number}
     */
    indexOf: function (searchString, position) {
      var needleChars = searchString instanceof this.constructor
        ? searchString.getChars()
        : _toCharArray(searchString);
      var needleLen = needleChars.length;
      var needleString = needleChars.join("");
      var chars = this.getChars();
      for (var i = (typeof position == "undefined"
                      ? 0
                      : (position < 0 ? 0 : Math.floor(position))),
                len = chars.length - needleLen + 1;
           i < len; ++i)
      {
        if (chars.slice(i, i + needleLen).join("") == needleString)
        {
          return i;
        }
      }

      return -1;
    },

    /**
     * Returns the index of the last position of a substring
     * in this string.
     *
     * @param {jsx.string.unicode.WideString|String} searchString
     *   Substring to look for.
     * @param {int} position
     *   Position from where to start searching backwards.
     *   The default is the position of the last character.
     * @return {number}
     */
    lastIndexOf: function (searchString, position) {
      var needleChars = searchString instanceof this.constructor
        ? searchString.getChars()
        : _toCharArray(searchString);
      var needleLen = needleChars.length;
      var needleString = needleChars.join("");
      var chars = this.getChars();
      for (var i = (typeof position == "undefined"
                      ? chars.length - needleLen
                      : (position < 0 ? 0 : Math.floor(position)))
                    + 1;
           i--;)
      {
        if (chars.slice(i, i + needleLen).join("") == needleString)
        {
          return i;
        }
      }

      return -1;
    },

    /**
     * Returns a slice (substring) of this string.
     *
     * @param {int} start
     *   Position of the Unicode character from where to start slicing.
     * @param {int} end
     *   Position of the first Unicode character that should not be
     *   included in the slice.
     * @return {jsx.string.unicode.WideString}
     * @see String.prototype#slice()
     */
    slice: function (start, end) {
      return new this.constructor(
        this.getChars().slice(start, end).join(""));
    },

    /**
     * Returns a substring of this string.
     *
     * @param {int} start
     *   Position of the Unicode character from where to start slicing.
     * @param {int} length
     *   Number of Unicode characters in the substring.
     *   If omitted or <code>undefined</code>, the substring
     *   contains all characters from <code>start</code>
     *   to the end of this string.
     * @return {jsx.string.unicode.WideString}
     * @see #slice()
     * @see String.prototype#substr()
     */
    substr: function (start, length) {
      return this.slice(start,
        typeof length == "undefined"
          ? length
          : start + length);
    },

    /**
     * Returns a slice (substring) of this string.
     *
     * @param {int} start
     *   Position of the Unicode character from where to start slicing.
     * @param {int} end (optional)
     *   Position of the first Unicode character that should not be
     *   included in the slice.  If <code><var>start</var></code>
     *   is larger than <code><var>end</var></code>, they are swapped.
     * @return {jsx.string.unicode.WideString}
     * @see String.prototype#substring()
     */
    substring: function (start, end) {
      if (start > end)
      {
        var tmp = start;
        start = end;
        end = tmp;
      }

      return new this.constructor(
        this.getChars().slice(start, end).join(""));
    },

    /**
     * Returns the characters in this object as a primitive
     * string value.
     *
     * @return {string}
     */
    toString: function () {
      return this.getChars().join("");
    },

    /**
     * @see #toString()
     */
    valueOf: function () {
      return this.toString();
    }
  });

  /**
   * @name length
   * @type int
   * @memberOf jsx.string.unicode.WideString#prototype
   * @see #getLength()
   */
  jsx.object.defineProperty(_WideString.prototype, "length", {
    "get": function () {
      return this.getLength();
    }
  });

  /**
   * Returns the <code>string</code> value consisting of the
   * characters specified by their code point values.
   *
   * @function
   * @name jsx.string.unicode.WideString.fromCharCode
   */
  _WideString.fromCharCode = (function () {
    var String_fromCharCode = String.fromCharCode;

    /**
     * @params {int}
     * @return {jsx.string.unicode.WideString}
     */
    function _fromCharCode ()
    {
      var chars = [];

      for (var i = 0, len = arguments.length; i < len; ++i)
      {
        var arg = Math.floor(arguments[i]);
        var ch;

        if (arg > 0x10FFFF)
        {
          return jsx.throwThis(jsx.InvalidArgumentError,
            ["Unsupported Unicode code point value",
             "0x" + arg.toString(16).toUpperCase(),
             "0x0000..0x10FFFF"]);
        }

        if (arg > 0xFFFF)
        {
          var bmpOffset = arg - 0x10000;
          var leadSurrogate = 0xD800 + ((bmpOffset >> 10) & 0x3FF);
          var trailSurrogate = 0xDC00 + (bmpOffset & 0x3FF);

          ch = String_fromCharCode(leadSurrogate, trailSurrogate);
        }
        else
        {
          ch = String_fromCharCode(arg);
        }

        chars.push(ch);
      }

      return new _WideString(chars);
    }

    return _fromCharCode;
  }());

  return {
    /**
     * @memberOf jsx.string.unicode
     */
    WideString: _WideString
  };
}());