/**
 * @fileOverview <title>PointedEars' JSX: String Library</title>
 * @file $Id$
 * @requires object.js
 *
 * @author (C) 2001-2013  Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @author
 *   Parts Copyright (C) 2003<br>
 *   Dietmar Meier &lt;meier@innoline-systemtechnik.de&gt;<br>
 *   Martin Honnen &lt;Martin.Honnen@gmx.de&gt;
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

if (typeof jsx === "undefined")
{
  var jsx = {};
}

jsx.string = {
  /** @version */
  version:   "1.29.$Rev$",
  copyright: "Copyright \xA9 1999-2013",
  author:    "Thomas Lahn",
  email:     "string.js@PointedEars.de",
  path:      "http://pointedears.de/scripts/"
};

// jsx.string.docURL = jsx.string.path + "string.htm";

if (typeof String === "undefined")
{
  var String = new Object();
}

/** @deprecated since 1.29.8.2010013105, see jsx.string */
String.version   = jsx.string.version;
String.copyright = jsx.string.copyright;
String.author    = jsx.string.author;
String.email     = jsx.string.email;
String.path      = jsx.string.path;
// String.docURL = jsx.string.docURL;

/* allows for de.pointedears.jsx.string */
if (typeof de === "undefined")
{
  var de = {};
}

if (typeof de.pointedears === "undefined")
{
  de.pointedears = {};
}

de.pointedears.jsx = jsx;

/**
 * Non-breaking space
 */
var CH_NBSP = "\xA0";

/**
 * @param {string} sMsg
 * @return {boolean} false
 */
function StringException (sMsg)
{
  alert(
    "string.js "
      + String.version
      + "\n"
      + String.copyright
      + "  "
      + String.author
      + " <"
      + String.email
      + ">\n\n"
      + sMsg);
  return false;
}

/**
 * Adds backslashes to escape " and ' in strings.
 *
 * @author Copyright (c) 2003
 *   Martin Honnen &lt;Martin.Honnen@gmx.de&gt;,
 *   Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @param {string} s (optional)
 *   String where " and ' should be escaped.  Ignored if
 *   the function is called as a method of a String object.
 * @return {string}
 *   The replaced string if String.replace(...)
 *   is supported, the original string otherwise.
 */
function addSlashes (s)
{
  var c;
  if ((c = this.constructor) && c == String && typeof s != "string")
  {
    s = this;
  }

  if (s.replace)
  {
    s = s.replace(/["']/g, "\\$&");
  }

  return s;
}

/**
 * Tries hard to escape a string according to the query component
 * specification in RFC3986.
 *
 * @param {string} s
 * @return {string}
 *   <code>s</code> escaped, or unescaped if escaping through
 *   <code>encodeURIComponent()</code> or <code>escape()</code>
 *   is not possible.
 * @partof http://PointedEars.de/scripts/string.js
 * @see jsx.object#isMethod()
 * @author Copyright (c) 2006-2008 Thomas Lahn <cljs@PointedEars.de>
 */
var esc = (function () {
  var
    _global = jsx.global,
    _isNativeMethod = jsx.object.isNativeMethod;

  return (_isNativeMethod(_global, "encodeURIComponent")
          ? encodeURIComponent
          : (_isNativeMethod(_global, "escape")
             ? escape
             : function (s) { return s; }));
}());

/**
 * Tries hard to make a string a URI or URI-reference according to RFC 3986.
 *
 * @param s
 * @return {string}
 *   <code>s</code> escaped, or unescaped if escaping through
 *   <code>encodeURI()</code> or is not possible.
 */
var escURI = (function (s) {
  var
    _global = jsx.global,
    _isNativeMethod = jsx.object.isNativeMethod;

  return (_isNativeMethod(_global, "encodeURI")
          ? encodeURI
          : function (s) { return s; });
}());

/**
 * Tries hard to unescape a string according to the query component
 * specification in RFC&nbsp;3986.
 *
 * @param {string} s
 * @return {string}
 *   <code>s</code> unescaped, or escaped if unescaping through
 *   <code>decodeURIComponent()</code> or <code>unescape()</code>
 *   is not possible.
 * @partof http://PointedEars.de/scripts/string.js
 * @see jsx.object#isMethod()
 * @author Copyright (c) 2006-2008 Thomas Lahn <cljs@PointedEars.de>
 */
var unesc = (function () {
  var
    _global = jsx.global,
    _isNativeMethod = jsx.object.isNativeMethod;

  return (_isNativeMethod(_global, "decodeURIComponent")
          ? decodeURIComponent
          : (_isNativeMethodd(_global, "unescape")
             ? unescape
             : function (s) { return s; }));
}());

/*
 * Had to abandon extend since Konqueror's engine does not support
 * Object literals
 */

if (typeof Number.prototype.toFixed == "undefined")
{
  /**
   * @param {number} iPrecision
   * @return {string}
   */
  Number.prototype.toFixed = function (iPrecision) {
    var
      result = this.toString(),
      dotPos = -1,
      decLen = 0;

    if ((dotPos = result.lastIndexOf(".")) > -1)
    {
      decLen = result.length - dotPos - 1;
    }

    if (decLen <= iPrecision)
    {
      result = jsx.string.pad(result, iPrecision, '0', true, decLen);
    }
    else
    {
      var m = Math.pow(10, iPrecision);
      result = Math.round(result * m) / m;
    }
    return result;
  };
}

if (typeof Number.prototype.toUnsigned == "undefined")
{
  /**
   * @param {number} iMax
   * @return {number}
   */
  Number.prototype.toUnsigned = function (iMax) {
    var n = this;

    /*
     * 1. Call ToNumber on the input argument.
     * (skipped since n is already a Number value)
     *
     * 2. If Result(1) is NaN, +0, -0, +Infinity, or -Infinity, return +0.
     */
    var i;
    if (!isNaN(n) || (i = Math.abs(n)) == 0 || i == Infinity)
    {
      return 0;
    }

    /*
     * 3. Compute sign(Result(1)) * floor(abs(Result(1))).
     * (The mathematical function sign (x) yields 1 if
     * x is positive and -1 if x is negative.) [...]
     */
    n = (n < 0 ? -1 : 1) * Math.floor(i);

    /*
     * 4. Compute Result(3) modulo 2^iMax; that is, a finite integer
     * value k of Number type with positive sign and less than 2^iMax
     * in magnitude such the mathematical difference of Result(3) and
     * k is mathematically an integer multiple of 2^iMax.  The default
     * for iMax is 32.
     *
     * 5. Return Result(4).
     */
    return n % Math.pow(2, iMax || 32);

//    if (n < 0)
//    {
//      n += (iMax || this.MAX_VALUE)/2;
//    }
  };
}

/**
 * Parses a string of characters into a <code>Number</code> value.
 * It replaces the built-in function in that it supports fractional
 * parts on non-decimal representations, and uses the built-in
 * for decimal representations.
 *
 * @param {String} s
 *   String representation to be parsed
 * @param {number} iBase
 *   Numeric base of the representation, from 2 to 35.  If not provided,
 *   after trimming leading white-space the prefix "0x" or "0X" designates
 *   base 16 (hexadecimal).
 * @return {number}
 */
var parseFloat = jsx.string.parseFloat = (function () {
  var origPF = parseFloat;

  return function (s, iBase) {
    if ((!iBase || iBase === 10) && origPF)
    {
      return origPF(s);
    }

    var
      i = (/^\s*\./.test(s) ? 0 : parseInt(s, iBase)),
      chars = (iBase < 10
        ? "0-" + String.fromCharCode(47 + iBase)
        : "\\d"
          + (iBase > 10
              ? "a"
                + (iBase > 11
                    ? "-" + String.fromCharCode(86 + iBase)
                    : "")
            : "")),
      f = (s.match(new RegExp("\\.([" + chars + "]{1,198})", "i")) || [, "0"])[1];


    return i + (/^\s*-/.test(s) ? -1 : 1)
      * parseInt(f, iBase) / Math.pow(iBase, f.length);
  };
}());

// * Returns a string of values according to a format string.
// *
// * This is the begin of an approach to implement <code>printf</code>(3)
// * in an ECMAScript compliant implementation out of its man page
// * documentation.  The syntax is intended to be compatible to that of
// * the printf() C function finally, but this method will not *print*
// * out anything characters by itself (so you probably want to use its
// * return value along with <code>window.alert()</code>,
// * <code>document.write()</code> and similar DOM features, or in
// * concatenations as if you would use <code>sprintf</code>(3).)
// *
// * Currently supported <code>printf</code>(3) features are:
// * - replacing tags in a format string with a value given as argument: `%d'
// * - padding that value with zeroes or (non-breaking) spaces on the left,
// *   watching for negative values: `%42d', `% 42d' and `%042d'
// * - padding that value with (non-breaking) spaces on the right: `%-42d'
// * - using arguments to specify the field width: `%*d', `%*7$d'
// * - specifying positive precision (round after point): `%.2d'
// * - replacing `%%' with `%' without using an argument's value
// *
// * Additional features supported by this method are:
// * - specifying negative precision (round before point): `%.-2d'
// * - If `%,42s' is used and the argument refers to an Array instead of
// *   a String, it is expanded to a character string consisting of the
// *   string representations of the elements of the array delimited with
// *   `,', each of them having the format specification (here: field
// *   width=42) applied to it.  If `,' is missing, the delimiter is the
// *   empty string, meaning that Arrays of strings (or characters) can
// *   be easily put out.
// *
// * @version 0.0.4.2005112603 (milestone 4)
// * @author
// *   (C) 2004, 2005  Thomas Lahn <string.js@PointedEars.de>
// *   Distributed under the GNU GPLv2.
// * @partof
// *   http://pointedears.de/scripts/string.js
// * @param {string} sFormat
// * @param {_} values
// * @return {string}
// *   The formatted string.
// */
//function format (sFormat)
//{
//  arguments.skip = [];
//  for (var i = 1, len = arguments.length; i < len; i++)
//  {
//    var a = arguments[i];
//
//    // skip tagged arguments; this allows for using following arguments
//    // for precision without using them for expansion again
//    if (!arguments.skip[i])
//    {
//      // compile only once
//      if (!format.rxSearch)
//      {
//        format.rxSearch = new RegExp(
//            "%([#0+' _-]*)"                          // flags
//          + "([1-9]*\\d+|(\\*((\\d+)\\$)?))?"        // field width
//          + "(\\.([+-]?\\d+|(\\*((\\d+)\\$)?))?)?"   // precision
//          + "([ ,]+)?"                               // member delimiter
//          + "([%diouxXeEfFgGaAcsCSpn])"              // conversion
//        );
//      }
//
//      var result;
//      if ((result = (format.rxSearch.exec(sFormat))))
//      {
//        var
//          // flag characters
//          flags = result[1],
//          fieldWidth = result[2],
//
//          // undefined if the field width was given as an unsigned integer
//          argFieldWidth = result[3],
//
//          // index of the argument to specify the field width;
//          // undefined if the field width was given as an unsigned
//          // integer
//          uFieldWidthArg = result[5],
//
//          precision = result[7],
//          argPrecision = result[8],
//
//          // index of the argument to specify the precision;
//          // undefined if the precision was given as an unsigned
//          // integer or it will be specified by the next argument
//          uPrecisionArg = result[10],
//          srcArgIdx;
//
//        // length modifier
//        // var lenModifier    = result[11];
//
//        // member delimiter
//        var memberDelim = result[11];
//
//        // conversion specifier
//        var
//          convSpecifier  = result[12],
//          aArgMembers = new Array();
//
//        if (convSpecifier == "%")
//        {
//          aArgMembers = [convSpecifier];
//          i--;
//        }
//        else
//        {
//          var memberLen = 1;
//          var arg = a;
//
//          if (arg.constructor == Array)
//          {
//            memberLen = arg.length;
//          }
//
//
//          for (var j = 0; j < memberLen; j++)
//          {
//            if (arg.constructor == Array)
//            {
//              a = arg[j];
//            }
//
//            if (/[diouxXeEfFgGaA]/.test(convSpecifier))
//            {
//              if (typeof a != "number")
//              {
//                a = Number(a);
//              }
//
//              if (/[ouxX]/.test(convSpecifier))
//              {
//                switch (convSpecifier)
//                {
//                  case "o": a = a.toString(8); break;
//                  case "u": a = a.toUnsigned(); break;
//                  case "x":
//                  case "X": a = a.toUnsigned().toString(16); break;
//                  default:
//                    var sError = 'Invalid conversion specifier';
//                    _global.onerror = function ()
//                    {
//                      alert('format: ' + sError);
//                      _global.onerror = null;
//                      return true;
//                    }
//                    eval("throw new {message: sError};");
//                    _global.onerror = null;
//                }
//              }
//            }
//
//            if (precision
//                || (typeof precision == "number" && precision == 0))
//            {
//              if (argPrecision)
//              { // precision is specified by another argument
//                srcArgIdx = uPrecisionArg || (i + 1);
//                precision = arguments[srcArgIdx];
//
//                // mark argument as not to be expanded
//                arguments.skip[srcArgIdx] = true;
//              }
//
//              if (precision >= 0)
//              {
//                a = Number(a).toFixed(precision);
//              }
//              else // if (precision < 0)
//              {
//                var pot = Math.pow(10, -precision);
//                a = Math.round((a - (a % 1)) / pot) * pot;
//              }
//            }
//
//            if (fieldWidth)
//            {
//              if (argFieldWidth)
//              { // field width is specified by another argument
//                srcArgIdx = uFieldWidthArg || (i + 1);
//                fieldWidth = arguments[srcArgIdx];
//                arguments.skip[srcArgIdx] = true;
//              }
//
//              if (fieldWidth > 0)
//              {
//                var sPad = CH_NBSP;
//                if (flags && /0/.test(flags))
//                {
//                  sPad = "0";
//                }
//
//                if (/-/.test(flags))
//                {
//                  a = pad(a, fieldWidth, CH_NBSP, true);
//                }
//                else
//                { // pad value, put sign in front
//                  a = pad(a, fieldWidth, sPad)
//                      .replace(/^(0+)([+-])/, "$2$1");
//                }
//              }
//            }
//
//            aArgMembers.push(a);
//          }
//        }
//
//        sFormat = sFormat.replace(
//          format.rxSearch,
//          aArgMembers.join(memberDelim));
//      }
//    }
//  }
//
//  return sFormat;
//}

/**
 * @protected
 */
jsx.string._rxFormatSpec = new RegExp(
  /* flags */
  /%(\(([^)]*)\))?([#0+' _-]*)/.source

  /* field width */
  + /([1-9]*\d+|(\*((\d+)\$)?))?/.source

  /* precision */
  + /(\.([+-]?\d+|(\*((\d+)\$)?))?)?/.source

  /* member delimiter */
  + "(,)?"

  /* conversion */
  + "([%aAbdiouxXeEfFgGcsCSpn])",

  /* global match */
  "g");

/**
 * A more efficient rewrite of the previous format() function.
 *
 * @param sFormat
 * @return {string}
 */
jsx.string.sprintf = function (sFormat) {
  var
    rxFormatSpec = jsx.string._rxFormatSpec,
    args = arguments,
    i = 1,
    jsx_string = jsx.string,
    ignoredArgs = [];

  return String(sFormat).replace(rxFormatSpec,
    function (m, p1, propertyName, flags,
              fieldWidth, argFieldWidth, p4, uFieldWidthArg, p6,
              precision, argPrecision, p9, uPrecisionArg,
              memberDelim, convSpecifier) {
      /* Prevent argument change by parameter assignment */
      "use strict";

      while (ignoredArgs[i])
      {
        ++i;
      }

      if (argFieldWidth)
      {
        if (!uFieldWidthArg)
        {
          uFieldWidthArg = i + 1;
        }
        else
        {
          uFieldWidthArg = +uFieldWidthArg;
        }

        ignoredArgs[uFieldWidthArg] = true;
        fieldWidth = args[uFieldWidthArg];
      }

      var v = args[i];
      if (propertyName)
      {
        v = v[propertyName];
      }

      switch (convSpecifier)
      {
        case "%":
          v = "%";
          i--;
          break;

        case "a":
        case "A":
          v = Array.prototype.join.call(v, memberDelim);
          break;

        case "b":
        case "d":
        case "o":
        case "x":
        case "X":
          v = +v;

          switch (convSpecifier)
          {
            case "b":
              v = v.toString(2);
              break;

            case "o":
              v = v.toString(8);
              if (flags.indexOf("#") > -1 && v.charAt(0) !== "0")
              {
                v = "0" + v;
              }
              break;

            case "x":
            case "X":
              v = v.toString(16);
              if (flags.indexOf("#") > -1 && v !== "0")
              {
                v = "0x" + v;
              }

              if (convSpecifier === "X")
              {
                v = v.toUpperCase();
              }
          }

          break;

        case "c":
        case "C":
        case "s":
        case "S":
          if (/c/i.test(convSpecifier))
          {
            if (typeof v === "string")
            {
              v = v.charAt(0);
            }
            else
            {
              v = String.fromCharCode(v);
            }
          }

          if (/[CS]/.test(convSpecifier))
          {
            v = String(v).toUpperCase();
          }

          break;

        case "i":
        case "u":
          v = (+v < 0) ? Math.ceil(v) : Math.floor(v);
          if (convSpecifier === "u")
          {
            v >>>= 0;
          }
          break;

        case "e":
        case "E":
        case "f":
        case "F":
        case "g":
        case "G":
          v = (+v).toString();

          /* TODO: Use Number.prototype.toExponential() if backwards-compatible */
          if (/e/i.test(convSpecifier))
          {
            var
              numParts  = v.match(/^([+-])?(\d*)(\.(\d*))?(e([+-]\d+))?/i),
              sign      = numParts[1] || "",
              sUintPart = numParts[2],
              uintPart  = sUintPart && parseInt(sUintPart, 10) || 0,
              fracPart  = numParts[4] || "",
              exponent  = numParts[6] && parseInt(numParts[6], 10) || 0;

            if (uintPart > 0)
            {
              if (uintPart > 9)
              {
                /* integer part with two or more digits */
                exponent += sUintPart.length - 1;
                fracPart = sUintPart.slice(1) + fracPart;
                sUintPart = sUintPart.charAt(0);
              }
            }
            else if (fracPart)
            {
              /* Integer part must be 0 */
              var numLeadingZeroes = (fracPart.match(/^0+/) || [""])[0].length;

              sUintPart = fracPart.charAt(numLeadingZeroes);
              fracPart = fracPart.slice(numLeadingZeroes + 1);
              exponent -= numLeadingZeroes + 1;
            }

            if (!parseInt(fracPart, 10))
            {
              fracPart = "0";
            }

            v = sign + sUintPart + "." + fracPart
              + "e" + (exponent >= 0 ? "+" : "") + exponent;

            if (convSpecifier == "E")
            {
              v = v.toUpperCase();
            }
          }
          else if (/g/i.test(convSpecifier))
          {
            if (convSpecifier == "G")
            {
              v = String(v).toUpperCase();
            }
          }

          if (precision)
          {
            var prec = +precision;
            if (prec > 0)
            {
              v = (+v).toFixed(prec);
            }
            else if (prec < 0)
            {
              var power = Math.pow(10, -prec);
              v = Math.round(v / power) * power;
            }
          }

          break;
      }

      if (fieldWidth)
      {
        fieldWidth = +fieldWidth;
        if (flags.indexOf("0") > -1 && /[bdoxXiueEfFgG]/.test(convSpecifier))
        {
          v = String(v);

          var
            padCharacter = "0",
            wasNegative = (v.charAt(0) === "-");

          if (wasNegative)
          {
            v = v.slice(1);
            fieldWidth--;
          }
        }

        v = jsx_string.pad(v, fieldWidth, padCharacter);

        if (wasNegative)
        {
          v = "-" + v;
        }
      }

      if (!propertyName)
      {
        ++i;
      }

      return v;
    });
};

/**
 * Formats a string
 */
String.prototype.format = jsx.string.format = (function () {
  var _getClass = jsx.object.getClass;
  var _hasOwnProperty = jsx.object._hasOwnProperty;

   /**
    * @param sFormat
    * @return {String}
    */
  return function (sFormat) {
    /* Prevent argument change by parameter assignment */
    "use strict";

    var start = 1;

    if (_getClass(this) === "String")
    {
      sFormat = this.constructor(this);
      start = 0;
    }

    for (var i = start, len = arguments.length; i < len; ++i)
    {
      var data = arguments[i];

      if (_getClass(data) === "Object")
      {
        for (var propertyName in data)
        {
          if (_hasOwnProperty(data, propertyName))
          {
            sFormat = sFormat.replace(new RegExp("\\{" + propertyName + "\\}", "g"),
                  data[propertyName]);
          }
        }
      }
      else
      {
        sFormat = sFormat.replace(new RegExp("\\{" + (i - start) + "\\}", "g"), data);
      }
    }

    return sFormat;
  };
}());

/**
 * Parses values out of a string using the specified format
 */
jsx.string.sscanf = (function () {
  var formatSpec = {
    dec: "([+-]?(?:0|[1-9]\\d+)(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)",
    "int": "([+-]?(?:0|[1-9]\\d+)(?:[eE][+-]?\\d+)?)"
  };

  var formatMap = {
    "%d": {
      spec: formatSpec.dec,
      parser: parseFloat
    },
    "%i": {
      spec: formatSpec["int"],
      parser: function (value) {
        return parseInt(value, 10);
      }
    }
  };

  function replacer (match)
  {
    if (typeof formatMap[match] != "undefined")
    {
      replaced.push(match);
      match = formatMap[match].spec;
    }

    return match;
  }

  var rxFormatSpec = jsx.string._rxFormatSpec;

  /**
   * @param {String} s
   * @param {String} format
   * @return {Array}
   */
  return function (s, format) {
    var replaced = [];
    format = format.replace(rxFormatSpec, replacer);
    var matches = s.match(new RegExp(format));
    matches.shift();

    /* TODO: Convert values to specified type */

    for (var i = 0, len = replaced.length; i < len; ++i)
    {
      var replace = replaced[i];


      switch (replace)
      {
        case formatSpec.dec:
          matches[i] = parseFloat(matches[i]);
          break;


      }
    }

    return matches;
  };
}());

/**
 * @version
 *    1.29.2004050110
 * @author
 *   (C) 2004 Thomas Lahn <string.js@PointedEars.de>
 * @partof
 *   http://pointedears.de/scripts/string.js
 * @param {string|number} s (optional)
 *   Un(completely )formatted number (decimal, hexadecimal
 *   or octal) or a string representing such a number.
 *   If the function is called as a method of
 *   {@link jsref#String} objects and <code>s</code> is
 *   provided, the value of <code>s</code> is formatted
 *   instead of the @link{jsref#String} object.
 * @param {string} s1kDelim = ","
 *   Character or character sequence to delimit a sequence
 *   of three digits on the left-hand side of the point.
 *   The default is ",".
 * @return {string|number}
 *   the formatted number as string, <code>NaN</code> on error.
 */
function format1k (s, s1kDelim)
{
  var result = NaN;

  /* to use this method for String objects */
  if (typeof this.constructor != "undefined"
      && this.constructor == String
      && !s)
  {
    s = this;
  }

  /* to allow for numbers as argument */
  s = s.toString();

  if (!isNaN(s))
  {
    if (!s1kDelim)
    {
      s1kDelim = ",";
    }

    /*
     * 1.29.4.2008030123:
     * added parens around backrefs for JScript 3.x compliance
     */
    var rx = /([\da-f])((\1){3}(,|(\.(\1)+)?$))/i;
    while (rx.test(s))
    {
      s = s.replace(rx, "$1" + s1kDelim + "$2");
    }

    result = s;
  }

  return result;
}

/**
 * String.hashCode() as defined in the Sun Java2 1.4 API.
 *
 * The function takes a string as argument, or
 * the <code>this</code> value if the argument is missing or
 * a false-value, and the <code>this</code> value refers
 * to an object that has a true-valued <code>charCodeAt</code>
 * property.  The ASCII or Unicode value (depending on the
 * implementation) of each character (from right to left) is
 * added to the product of the current sum (starting at 0)
 * multiplied with x, where x = 37 if the string is no longer
 * than 15 characters, x = 39 otherwise.  If the string is 16
 * characters long or longer, at the average every eighth
 * character is not included in the sum.
 *
 * @author
 *   Implementation in ECMAScript
 *   (C) 2003 Thomas Lahn &lt;hashCode.js@PointedEars.de&gt;
 * @param {string} s (optional)
 *   Optional string of which the hash code is computed. If
 *   not provided or a false-value, it is assumed that
 *   the function is used as method of the String prototype,
 *   applied to a String object or literal.
 * @return {number}
 *   The hash code of the string, designed for implementing hash
 *   code access to associative arrays which can be implemented
 *   as objects with named properties in JavaScript 1.x.
 * @see
 *   #strToCodeArray() java2:String#hashCode()
 */
function hashCode (s)
{
  if (!s && this.charCodeAt)
  {
    s = this;
  }

  var h = 0;
  var off = 0;
  var len = s.length;
  var val = strToCodeArray(s);
  var i;

  if (len < 16)
  {
    for (i = len; i > 0; i--)
    {
      h = (h * 37) + val[off++];
    }
  }
  else
  {
    /* only sample some characters */
    var skip = Math.floor(len / 8);
    for (i = len; i > 0; i -= skip, off += skip)
    {
      h = (h * 39) + val[off];
    }
  }

  return h;
}

/**
 * @param {string} s (optional)
 * @return {string}
 */
function leadingCaps (s)
{
  if (!s && this.charAt)
  {
    s = this;
  }

  if (!s)
  {
    return "";
  }

  return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
}

/**
 * @param {string} s (optional)
 *   Input string.  If omitted and the calling object
 *   is a String object, it is used instead.
 * @param {number} n (optional)
 *   Length of the resulting string.  The default is 1,
 *   i.e. if the input string is empty, "0" is returned.
 * @return {string}
 *   Input string with leading zeros so that
 *   its length is @{(n)}.
 * @see
 *   #pad(string, number, string)
 */
var leadingZero = jsx.string.leadingZero = function (s, n) {
  var c;
  if ((c = this.constructor) && c == String && typeof s != "string")
  {
    s = this;
  }

  var isNegative = (s && typeof s.valueOf() == "number" && s < 0);
  if (isNegative)
  {
    s = -s;

    if (typeof n == "number" && !isNaN(n))
    {
      --n;
    }
  }

  var result = jsx.string.pad(s, n, "0");

  if (isNegative)
  {
    result = "-" + result;
  }

  return result;
};

/*
int LevenshteinDistance(char s[1..n], char t[1..m])
    declare int d[0..n,0..m]
    declare int i, j, cost

    for i := 0 to n
        d[i,0] := i
    for j := 0 to m
        d[0,j] := j

    for i := 1 to n
        for j := 1 to m
            if s[i] = t[j] then cost := 0
                           else cost := 1
            d[i,j] := minimum(d[i-1,j  ] + 1,    // insertion
                              d[i,  j-1] + 1,    // deletion
                              d[i-1,j-1] + cost) // substitution

    return d[n,m]
*/
/**
 * Returns the Levenshtein Distance One between two strings
 * <var>s</var> and <var>t</var> that is, the number of
 * required edit moves to make <var>s</var> the same as
 * <var>t</var>, and vice-versa.  That value indicates
 * to what extent the two strings are similar -- small
 * distances mean greater, large distances less similarity.
 * It is computed as follows:
 *
 * <table>
 *   <thead>
 *     <tr>
 *       <th align="left">Step</th>
 *       <th align="left">Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr valign="top">
 *       <th>1</th>
 *       <td>Set <tt>n</tt> to be the length of <var>s</var>.
 *       Set <tt>m</tt> to be the length of <var>t</var>.
 *       If <tt>n</tt> = 0, return <tt>m</tt> and exit.
 *       If <tt>m</tt> = 0, return <tt>n</tt> and exit.
 *       Construct a matrix containing 0..<tt>m rows and 0..<tt>n</tt>
 *       columns.</td>
 *     </tr>
 *     <tr>
 *       <th>2</th>
 *       <td>Initialize the first row to 0..<tt>n</tt>.
 *       Initialize the first column to 0..<tt>m</tt>.</td>
 *     </tr>
 *     <tr>
 *       <th>3</th>
 *       <td>Examine each character of <var>s</var> (<tt>i</tt> from 1 to <tt>n</tt>).</td>
 *     </tr>
 *     <tr>
 *       <th>4</th>
 *       <td>Examine each character of <var>t</var> (<tt>j</tt> from 1 to <tt>m</tt>).</td>
 *     </tr>
 *     <tr>
 *       <th>5</th>
 *       <td>If <var>s</var>[<tt>i</tt>] equals <var>t</var>[<tt>j</tt>], the cost is 0.
 *       If <var>s</var>[<tt>i</tt>] doesn't equal <var>t</var>[<tt>j</tt>],
 *       the cost is 1.</td>
 *     </tr>
 *     <tr valign="top">
 *       <th>6</th>
 *       <td>Set cell <tt>d</tt>[<tt>i</tt>, <tt>j</tt>] of the matrix
 *       equal to the minimum of:
 *         <ol type="a">
 *           <li>The cell immediately above plus 1:
 *             <tt>d</tt>[<tt>i</tt>-1, <tt>j</tt>] + 1.</li>
 *           <li>The cell immediately to the left plus 1:
 *             <tt>d</tt>[<tt>i</tt>, <tt>j</tt>-1] + 1.</li>
 *           <li>The cell diagonally above and to the left plus the cost:
 *             <tt>d</tt>[<tt>i</tt>-1, <tt>j</tt>-1] + cost.</li>
 *         </ol></td>
 *     </tr>
 *     <tr>
 *       <th>7</th>
 *       <td>After the iteration steps (3, 4, 5, 6) are complete, the distance
 *         is found in cell <tt>d</tt>[<tt>n</tt>, <tt>m</tt>].</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @param {string} s (optional)
 * @param {string} t (optional)
 * @return {number}
 */
function levenshtein (s, t)
{
  /* Step 1 */
  if (typeof s != "string")
  {
    s = s.toString();
  }

  if (typeof t != "string")
  {
    t = t.toString();
  }

  var n = s.length;
  var m = t.length;

  if (n == 0)
  {
    return m;
  }

  if (m == 0)
  {
    return n;
  }

  /* matrix */
  var d = new Array();

  /* Step 2 */
  for (var i = 0; i <= n; i++)
  {
    d[i] = new Array();
    d[i][0] = i;
  }

  for (var j = 0; j <= m; j++)
  {
    d[0][j] = j;
  }

  /* Step 3 */
  for (i = 1; i <= n; i++)
  {
    var s_i = s.charAt(i - 1);

    /* Step 4 */
    for (j = 1; j <= m; j++)
    {
      /* Step 5 */
      var cost = (s_i == t.charAt(j - 1)) ? 0 : 1;

      /* Step 6 */
      d[i][j] = Math.min(
        d[i-1][j] + 1,
        d[i][j-1] + 1,
        d[i-1][j-1] + cost);
    }
  }

  /* Step 7 */
  return d[n][m];
}

/**
 * Returns the input string with all substrings that
 * may be interpreted as markup are escaped, that is,
 * those prefixed by `&' or `<'.
 *
 * @param {string} s (optional)
 * @return {string}
 */
function maskMarkup (s)
{
  if (!s)
  {
    s = this;
  }
  else
  {
    s = String(s);
  }

  return replaceText(replaceText(s, "&", "&amp;"), "<", "&lt;");
}

/**
 * @param {string} s
 * @return {string}
 */
function nl2br (s)
{
  return s.replace(/\r\n?|\n/g, "<br>");
}

/**
 * @param {string} s (optional)
 *   Input string.  If omitted and the calling object
 *   is a String object, it is used instead.
 * @param {number} n = 1
 *   Length of the resulting string.  The default is 1,
 *   i.e. if the input string is empty, "0" is returned
 *   if c is <code>'0'</code>.
 * @param {string} c = CH_NBSP
 *   Character string to use for padding.  The default
 *   is one non-breaking space.
 * @param {boolean} bRight = false
 *   If <code>true</code>, s is padded on the right,
 *   otherwise on the left.
 * @param {number} iStart (optional)
 *   Assume that s is iStart characters long.
 * @return {string}
 *   The padded input string so that its length is n.
 */
var pad = jsx.string.pad = function (s, n, c, bRight, iStart) {
  var constr;
  if ((constr = this.constructor) && constr == String
      && typeof s != "string")
  {
    s = this;
  }

  if (!n)
  {
    n = 1;
  }

  if (!c)
  {
    c = CH_NBSP;
  }

  if (typeof s != "string")
  {
    s = String(s);
  }

  if (typeof iStart == "undefined")
  {
    iStart = s.length;
  }

  if (n <= iStart)
  {
    return s;
  }

  var a = [];
  var missingLength = n - iStart + 1;

  if (typeof a.join === "function"
      && (missingLength > -1) && (missingLength < Math.pow(2, 32)))
  {
    a.length = missingLength;
    var rep = a.join(c);
    if (bRight)
    {
      s += rep;
    }
    else
    {
      s = rep + s;
    }
  }
  else
  {
    while (iStart < n)
    {
      if (bRight)
      {
        s += c;
      }
      else
      {
        s = c + s;
      }

      iStart++;
    }
  }

  return s;
};

/**
 * @param sText
 * @param {string} sReplaced
 * @param {string} sReplacement
 * @param {boolean} bForceLoop
 * @return {string}
 */
function replaceText (sText, sReplaced, sReplacement, bForceLoop)
{
  var result = "";

  if (!sText && this.constructor == String)
  {
    sText = this;
  }

  var sNewText = sText;
  // alert(sText);
  if (sText && sReplaced && sReplacement)
  {
    if (sText.replace && !bForceLoop)
    {
      sReplaced = sReplaced.replace(/\\/g, "\\\\");
      /*
       * Version 1.23.2002.4 bugfix: allows to replace \ with other
       * strings, required for proper rxReplaced;
       * Example (no quotes, no escaping):
       *    sReplaced (provided)                     "\\"
       *    sReplaced (evaluated)                     \
       *    sReplaced (replaced as formulated above) "\\\\"
       *    sReplaced (esc. in RegExp constructor)   "\\\\"
       *    sReplaced (ev. in RegExp constructor)     \\
       *    rxReplaced (with RegExp escaping)        /\\/g
       *    rxReplaced (evaluated)                   all occurr. of \
       */
      var rxReplaced = new RegExp(sReplaced, "g");
      sText = sText.replace(rxReplaced, sReplacement);

      result = sText;
    }
    else if (sText.split
             && (a = sText.split(sReplaced))
             && a.join)
    {
      return a.join(sReplacement);
    }

    var i = sText.indexOf(sReplaced);

    if (i > -1)
    {
      sNewText = sText.substring(0, i);
      sNewText += sReplacement
        + replaceText(
          sText.substring(i + sReplaced.length),
          sReplaced,
          sReplacement);
    }

    result = sNewText;
  }

  return result;
}

/**
 * @param {Object} o
 *   Object to be serialized
 * @param {Object} options (optional)
 *   The property values of the passed object determine
 *   one or more of the following display options:
 *
 *   @option depth: number = 0
 *     Depth down to which recursive serialization should
 *     be performed.  The default is 0 (no recursion).
 *     Negative values specify infinite recursion.
 *     CAUTION: Recursive references are not detected;
 *     in that case, a stack overflow will happen because
 *     of too much recursion.
 *
 *   @option showType: boolean = false
 *     If <code>true</code>, <code>typeof</code> is used
 *     to display the type of each property following a
 *     colon after the identifier.  The value delimiter
 *     then changes into a equals (`<code>=</code>').
 *
 *   @option showConstructor: boolean = false
 *     If <code>true</code>, <code>constructor</code> is used
 *     to display the constructor of each property in brackets
 *     after the identifier.
 *
 *   @option iIndent: number = 0
 *     Indentation level
 *
 *   @option sIndent: string = "  "
 *     Character string to use for indenting code
 * @return {string}
 */
function serialize (o, options)
{
  if (typeof options != "object" || !options)
  {
    options = {};
  }

  if (typeof options.depth == "undefined")
  {
    options.depth = 0;
  }

  if (typeof options.iIndent == "undefined")
  {
    options.iIndent = 0;
  }

  if (typeof options.sIndent == "undefined")
  {
    options.sIndent = "  ";
  }

  var
    a = [],
    indent = strRepeat(options.sIndent, options.iIndent);

  for (var p in o)
  {
    var v = o[p];
    var origV = v;
    var t = typeof v;
    var isString = /string/i.test(t);
    var s = isString ? '"' : '';

    /*
     * FIXME: number values
     */
    /*
     * unlimited or limited depth > 0 (0 == false)
     */
    if (options.depth && (!isString || isNaN(p)))
    {
      v = serialize(v, {
        depth: options.depth - 1,
        showType: options.showType,
        showConstructor: options.showConstructor,
        iIndent: options.iIndent + 1,
        sIndent: options.sIndent
      });
    }

    a.push(
        indent
      + options.sIndent
      + p
      + (options.showConstructor
         ? "["
            + (origV && typeof origV.constructor != "undefined"
               ? (String(origV.constructor).match(/function\s*([^\s\(\{]+)/)
                  || [, "unknown"])[1]
               : "unknown")
            + "]"
         : "")
      + (options.showType ? ": " + t : "")
      + (options.showType ? " = " : ": ")
      + (!(options.depth && (!isString || isNaN(p)))
          ? s + String(v).replace(/"/g, "\\$&") + s
          : v)
    );
  }

  if (a.length > 0)
  {
    return "{\n" + a.join(",\n") + "\n" + indent + "}";
  }

  return String(o);
}

/**
 * Calculates the number of occurrences of one string in another.
 *
 * @param {string} s
 * @param {string} substr
 * @param {boolean} bCaseSensitive (optional)
 * @return {number}
 */
function strCount (s, substr, bCaseSensitive)
{
  var result = 0;

  if ((!s && !this.toLowerCase) || !substr)
  {
    return -1;
  }

  if (s && this.toLowerCase)
  {
    s = this;
  }

  if (!bCaseSensitive && s.toLowerCase)
  {
    s = s.toLowerCase();
  }

  if (isMethodType(typeof RegExp))
  {
    var rxSub = new RegExp(substr, "g" + (!bCaseSensitive ? "i" : ""));

    if (isMethod(s, "match") && rxSub)
    {
      result = s.match(rxSub);
      if (result && result.length)
      {
        return result.length;
      }

      return 0;
    }
  }
  else if (s.substr && substr.length)
  {
    if (!bCaseSensitive && substr.toLowerCase)
    {
      substr = substr.toLowerCase();
    }

    for (var i = 0; i < s.length; i++)
    {
      if (s.substr(i, substr.length) == substr)
      {
        result++;
        i += substr.length - 1;
      }
    }

    return result;
  }

  return -1;
}

/**
 * Compares strings against each other, with the default possibility of
 * taking Unicode compositing sequences into account.
 *
 * @param s1
 * @param s2
 * @param compositeAware
 *   If <code>true</code> (default), composited characters are taken
 *   into account.  Otherwise strings are compared character-by-character.
 * @return {boolean}
 *   <code>true</code> if the strings are equal, <code>false</code> otherwise
 */
function strCompare (s1, s2, compositeAware)
{
  if (this.constructor == String)
  {
    compositeAware = s2;
    s2 = s1;
    s1 = this;
    var compositeLength = 2;
  }
  else
  {
    compositeLength = 3;
  }

  if (arguments.length < compositeLength)
  {
    compositeAware = true;
  }

  var equivalenceMap = {
    "\u00e0": "\u0061\u0300"
  };

  for (var i = 0, j = 0, len = s1.length; i < len; ++i, ++j)
  {
    var ch1 = s1.charAt(i), ch2 = s2.charAt(j);
    if (ch1 != ch2)
    {
      if (!compositeAware)
      {
        return false;
      }

      /*
       * When the characters at the same position are not equal, see if
       * there is a composite character sequence for each character …
       */
      var ch1Equivalent = equivalenceMap[ch1] || null;
      if (ch1Equivalent)
      {
        /*
         * If yes, check if there is a composite sequence in the second
         * string starting at that index.
         */
        if (ch2.substring(j, ch1Equivalent.length) === ch1Equivalent)
        {
          /*
           * If yes, advance the index for the second string so that
           * the next check starts after that sequence.
           */
          j += ch1Equivalent.length - 1;
        }
        else
        {
          return false;
        }
      }
      else
      {
        /* Same for a potential composite sequence in the first string */
        var ch2Equivalent = equivalenceMap[ch2] || null;
        if (ch2Equivalent && ch1.substring(i, i + ch2Equivalent.length) === ch2Equivalent)
        {
          i += ch2Equivalent.length - 1;
        }
        else
        {
          return false;
        }
      }
    }
  }

  return true;
}
String.prototype.equals = strCompare;

/**
 * Strips <code>&lt;tags&gt;</code> and optionally the
 * content between start and respective end tags from
 * a string.  Uses RegExp if supported.
 *
 * @author
 *   (C) 2001-2004  Thomas Lahn &lt;js@PointedEars.de&gt;,
 *   Advanced RegExp parsing (C) 2003  Dietmar Meier
 *    &lt;meier@innoline-systemtechnik.de&gt;
 * @param {string} s (optional)
 *   String where all tags should be stripped from. If not
 *   provided or <code>false</code>, it is assumed that the
 *   function is used as method of the String prototype,
 *   applied to a String object or literal. Note that in
 *   this case the method will not modify the String object
 *   either, but return a second String object.
 * @param {boolean} bStripContent = false
 *   If <code>true</code>, the content between a start tag and
 *   a corresponding end tag is also removed.
 *   If <code>false</code> (default), only start and end tags
 *   are removed.
 * @param {boolean} bCaseSensitive = false
 *   <code>true</code> for case-sensitive matches,
 *   <code>false</code> (default) otherwise.
 * @param {optional} tags string|Array of string
 *   String or array of values that can be evaluated as string to
 *   specify the tag(s) to be stripped.  If omitted, all tags are
 *   stripped.
 * @param {boolean} bElements = false
 *   If <code>true</code>, strip elements, i.e. start and end tags.
 * @return {string}
 *   String where all tags are stripped from.
 * @see String.prototype#replace()
 */
function stripTags (s, bStripContent, bCaseSensitive, tags, bElements)
{
  if (!s)
  {
    s = this;
  }
  else
  {
    s = s.toString();
  }

  var sUntagged = s;

  if (s.match && s.replace)
  {
    // sUntagged = s.replace(/<[^>]*>/g, "");
    var sRxTags = "", i, len;
    if (tags)
    {
      if (!tags.constructor || tags.constructor == Array)
      {
        if (tags.join)
        {
          if (bElements)
          {
            for (i = 0, len = tags.length; i < len; i++)
            {
              tags[tags.length] = "/" + tags[i];
            }
          }

          sRxTags = tags.join("|");
        }
        else if (tags.length)
        {
          for (i = 0, len = tags.length; i < len; i++)
          {
            sRxTags += tags[i];
            if (bElements)
            {
              sRxTags += "/" + tags[i];
            }

            if (i < tags.length - 1)
            {
              sRxTags += "|";
            }
          }
        }

        if (sRxTags)
        {
          sRxTags = "(" + sRxTags + ")";
        }
      }
      else
      {
        sRxTags = tags;
      }
    }

    var sRx = "";
    if (bStripContent)
    {
      sRx = "<(" + (sRxTags ? sRxTags : "[^<>]*") + ")(<[^<>]*>)*>.*</\\1>";
    }
    else
    {
      sRx = "<" + (sRxTags ? sRxTags : "[^<>]*") + "(<[^<>]*>)*[^<>]*>";
    }

    var rx = new RegExp(sRx, (bCaseSensitive ? "i" : "") + "g");
    if (rx)
    {
      while (s.match(rx))
      {
        s = s.replace(rx, "");
      }
      sUntagged = s;
    }
  }
  else
  {
    var a = "";
    var bOutOfTag = true;
    var l = s.length;
    sUntagged = "";

    for (i = 0; i < l; i++)
    {
      a = s.charAt(i);

      if (bOutOfTag && (a == "<"))
      {
        bOutOfTag = false;
      }

      if (bOutOfTag)
      {
        sUntagged += a;
      }

      if ((!bOutOfTag) && (a == ">"))
      {
        bOutOfTag = true;
      }
    }
  }

  return sUntagged;
}

/**
 * Returns <var>s</var> repeated <var>n</var> times.  <var>n</var>
 * has to be greater than or equal to 0.  If <var>n</var> converted
 * to number is <code>NaN</code> or a value less then 1, the function
 * will return the empty string.
 *
 * Note that this may be used also as method of the {@link String}
 * prototype (if supported), applicable to <code>String</code> objects
 * and literals.  If <var>s</var> is not provided, if it is numeric
 * or evaluates to <code>false</code>, the value of the
 * <code>String</code> object is taken instead of it.  If the first
 * argument is then numeric, it is taken for <var>n</var> and the latter
 * argument is ignored.
 *
 * @param {string|number} s
 * @param {number} n (optional)
 * @return {string}
 */
function strRepeat (s, n)
{
  var c;
  if ((c = this.constructor) && c == String && typeof s != "string")
  {
    s = this;
    n = !isNaN(s) ? s : 0;
  }

  if (isNaN(n))
  {
    return s;
  }

  if (s)
  {
    var aResult = [];
    aResult.length = n + 1;
    return aResult.join(s);
  }

  return "";
}

/**
 * @author
 *   (C) 2003 Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @param {string} s (optional)
 *   Optional string to be split into array elements.  If not
 *   provided or <code>false</code>, it is assumed that the
 *   function is used as method of the String prototype, applied
 *   to a String object or literal.
 * @return {Array}
 *   An array with every character of <code>s</code> an element
 *   of it.
 * @see String.prototype#charAt
 * @see String.prototype#split
 */
function strToArray (s)
{
  var c;
  if (!s && (c = this.constructor) && c == String)
  {
    s = this;
  }

  var a = null;

  if (s.split)
  {
    a = s.split("");
  }
  else
  {
    a = new Array();

    for (var i = 0, len = s.length; i < len; i++)
    {
      a[i] = s.charAt(i);
    }
  }

  return a;
}
/* TODO: */
// function arrayFromStr (s)
// {
//   return strToArray(s);
// }

/**
 * @param {[string,]} as
 *   Input string array.
 * @todo return RegExp
 *   A regular expression to match all the string array elements.
 */
function strArrayToCharClass (as)
{
  var hashTable = [];

  for (var i = as.length; i--; 0)
  {
    var s = as[i];
    var c = hashCode(s);

    if (typeof hashTable[c] == "undefined")
    {
      hashTable[c] = new Collection(s);
    }
    else
    {
      var h = hashTable[c];
      h.add(s);
    }
  }
}

/**
 * @author
 *   (C) 2003 Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @param {string} s (optional)
 *   Optional string to be split into an array where each
 *   element represents the ASCII or Unicode value of a
 *   character (depending on the implementation) of the
 *   string.
 *   If not provided or <code>false</code>, it is assumed
 *   that the function is used as method of the String
 *   prototype, applied to a String object or literal.
 * @return {Array}
 *   An array where every element is the ASCII character
 *   of <code>s</code> an element of it.
 * @see #strToArray()
 * @see String.prototype#charCodeAt()
 * @see String.prototype#split()
 */
function strToCodeArray (s)
{
  if (!s && this.charCodeAt)
  {
    s = this;
  }

  var a, i, alen;

  if (isMethod(s, "split") && isMethod(_global, "strToArray"))
  {
    a = strToArray(s);

    for (i = 0, alen = a.length; i < alen; i++)
    {
      a[i] = a[i].charCodeAt(0);
    }
  }
  else
  {
    a = new Array();

    var slen = s.length;
    for (i = 0; i < slen; i++)
    {
      a[i] = s.charCodeAt(i);
    }
  }

  return a;
}
/* TODO: */
// function codeArrayFromStr (s)
// {
//   return strToCodeArray(s);
// }

/**
 * Returns the input string with all leading and trailing whitespace removed.
 *
 * @param {string} s (optional)
 * @return {string}
 * @see #trimLeft(), #trimRight()
 */
function trim (s)
{
  if (!s && this.charAt)
  {
    s = this;
  }

  if (s != "")
  {
    if (s.replace)
    {
      s = s.replace(/^\s+|\s+$/g, "");
    }
    else
    {
      s = trimRight(trimLeft(s));
    }
  }

  return s;
}

/**
 * Returns the input string with all leading whitespace removed.
 *
 * @param {string} s (optional)
 * @return {string}
 */
function trimLeft (s)
{
  if (!s && this.charAt)
  {
    s = this;
  }

  if (s != "")
  {
    if (s.replace)
    {
      s = s.replace(/^\s+/, "");
    }
    else
    {
      var i, a;
      for (i = 0;
           i < s.length && (a = s.charAt(i)) <= " " || a == CH_NBSP;
           i++)
      {
        ;
      }
      s = s.substring(i);
    }
  }

  return s;
}

/**
 * Returns the input string with all trailing whitespace removed.
 *
 * @param {string} s (optional)
 * @return {string}
 */
function trimRight (s)
{
  if (!s && this.charAt)
  {
    s = this;
  }

  if (s != "")
  {
    if (s.replace)
    {
      s = s.replace(/\s+$/, "");
    }
    else
    {
      var i, a;
      for (i = s.length - 1;
           i >= 0 && (a = s.charAt(i)) <= " " || a == CH_NBSP;
           i--)
      {
        ;
      }
      s = s.substring(0, i + 1);
    }
  }

  return s;
}

/**
 * Converts a Python str (e.g. 'K\xc3\xb6ln') into
 * an ECMAScript-compliant string (e.g. 'Köln').
 *
 * @param {string} s
 *   The string to be converted
 * @return {string}
 *   The converted string
 */
function pyUTF8toString (s)
{
  return unesc(
    s.replace(/[\x80-\xff]/g,
      function (m) {
        return "%" + m.charCodeAt(0).toString(16);
      }));
}

/*
 * If possible, add methods to the String prototype;
 * disabled until ECMAScript allows to hide properties from iteration.
 */
//jsx.object.extend(String.prototype, {
//   'leadingCaps': leadingCaps,
//   'leadingZero': leadingZero,
//   'repeat'     : strRepeat,
//   'pad'        : pad,
//   'replaceText': replaceText,
//   'addSlashes' : addSlashes,
//   'strCount'   : strCount,
//   'stripTags'  : stripTags,
//   'maskMarkup' : maskMarkup,
//   'trim'       : trim,
//   'trimLeft'   : trimLeft,
//   'trimRight'  : trimRight,
//
//   // TODO: corr. with Array.fromStr
//   'toArray'    : strToArray,
//
//   // TODO: corr. with Array.codeArrayFromStr
//   'toCodeArray': strToCodeArray,
//
//   // TODO: corr. with Array.toStr
//// 'fromArray'  : strFromArray,
//
//   // TODO: corr. with Array.codeArrayToStr
//// fromCodeArray: strFromCodeArray,
//
//   'hashCode'   : hashCode,
//   'format1k'   : format1k});
//
//p = Array.prototype;
//if (p)
//{
//  // TODO: corr. with String.toArray
//  p.fromStr = arrayFromStr;
//
//  // TODO: corr. with String.toCodeArray
//  p.codeArrayFromStr = codeArrayFromStr;
//
//  // TODO: corr. with String.fromArray
//  p.toStr = arrayToStr;
//
//  // TODO: corr. with String.fromCodeArray
//  p.codeArrayToStr = codeArrayToStr;
//}
