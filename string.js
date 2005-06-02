/** 
 * <title>PointedEars' JSX: String Library</title>
 */
if (typeof String == "undefined")
{
  var String = new Object();
}
/** @version */ String.version = "1.29.2005060219";
/**
 * @filename string.js
 * @partof   PointedEars' JavaScript Extensions (JSX)
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2001-2005  Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @author
 *   Parts Copyright (C) 2003<br>
 *   Dietmar Meier &lt;meier@innoline-systemtechnik.de&gt;<br>
 *   Martin Honnen &lt;Martin.Honnen@gmx.de&gt;
 */
String.copyright = "Copyright \xA9 1999-2005";
String.author    = "Thomas Lahn";
String.email     = "string.js@PointedEars.de";
String.path      = "http://pointedears.de/scripts/";
//String.docURL    = stringPath + "string.htm";
/**
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
// Refer string.htm file for general documentation. 

var CH_NBSP = "\xA0";

function StringException(Msg)
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
      + Msg);
  return false;
}

/**
 * Adds backslashes to escape " and ' in strings.
 * 
 * @author Copyright (c) 2003
 *   Martin Honnen &lt;Martin.Honnen@gmx.de&gt;,
 *   Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @optional string s
 *   String where " and ' should be escaped.  Ignored if
 *   the function is called as a method of a String object.
 * @return type string
 *   The replaced string if String.replace(...)
 *   is supported, the original string otherwise.
 */
function addSlashes(s)
{
  var c;
  if ((c = this.constructor) && c == String && typeof s != "string")
  {
    s = this;
  }

  if (s.replace)
  {
    s = s.replace(/(["'])/g, "\\$1");
  }

  return s;
}

// Had to abandon addProperties since Konqueror's engine does not support
// Object literals 

if (typeof Number.prototype.toFixed == "undefined")
{
  Number.prototype.toFixed = function number_toFixed(iPrecision)
  {
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
      result = pad(result, iPrecision, '0', true, decLen);
    }
    else
    {
      var m = Math.pow(10, iPrecision);
      result = Math.round(result * m) / m;
    }
    return result;
  }
}

if (typeof Number.prototype.toUnsigned == "undefined")
{
  Number.prototype.toUnsigned =
  function number_toUnsigned(iMax)
  {
    var n = this;

    /*
     * 1. Call ToNumber on the input argument.
     * (skipped since n is already a Number value)
     *
     * 2. If Result(1) is NaN, +0, -0, +Infinity, or -Infinity, return +0.
     */
    var i;
    if (!isNaN(n) || (i = abs(n)) == 0 || i == Infinity)
    {
      return 0;
    }

    // 3. Compute sign(Result(1)) * floor(abs(Result(1))).
    /* The mathematical function sign(x) yields 1 if
     * x is positive and -1 if x is negative. [...]
     */
    n = (n < 0 ? -1 : 1) * floor(i);
 
    /*
     * 4. Compute Result(3) modulo 2^iMax; that is, a finite integer value
     * k of Number type with positive sign and less than 2^iMax in magnitude
     * such the mathematical difference of Result(3) and k is mathematically
     * an integer multiple of 2^iMax.  The default for iMax is 32.
     * 
     * 5. Return Result(4).
     */
    return n % Math.pow(2, iMax || 32);
    /*
      if (n < 0)
      {
        n += (iMax || this.MAX_VALUE)/2;
      }
    */
  }
}


/**
 * Returns a string of values according to a format string.
 * 
 * This is the begin of an approach to implement <code>printf</code>(3)
 * in an ECMAScript compliant implementation out of its man page documentation.
 * The syntax is intended to be compatible to that of the printf() C function
 * finally, but this method will not *print* out anything characters by itself
 * (so you probably want to use its return value along with
 * <code>window.alert()</code>, <code>document.write()</code> and similar DOM
 * features, or in concatenations as if you would use <code>sprintf</code>(3).)
 * 
 * Currently supported <code>printf</code>(3) features are:
 * - replacing tags in a format string with a value given as argument: `%d'
 * - padding that value with zeroes or (non-breaking) spaces on the left,
 *   watching for negative values: `%42d', `% 42d' and `%042d'
 * - padding that value with (non-breaking) spaces on the right: `%-42d'
 * - using arguments to specify the field width: `%*d', `%*7$d'
 * - specifying positive precision (round after point): `%.2d'
 * - replacing `%%' with `%' without using an argument's value
 *
 * Additional features supported by this method are:
 * - specifying negative precision (round before point): `%.-2d'
 * 
 * @author
 *   (C) 2004, 2005  Thomas Lahn <string.js@PointedEars.de>
 *   Distributed under the GNU GPLv2.
 * @partof
 *   http://pointedears.de/scripts/string.js
 * @param sFormat: string 
 * @param values: _
 * @return string
 *   The formatted string.
 */
function format(sFormat)
{
  arguments.skip = [];
  for (var i = 1, len = arguments.length; i < len; i++)
  {
    var a = arguments[i];
    // skip tagged arguments; this allows for using following
    // arguments for precision without using them for expansion
    // again
    if (!arguments.skip[i])
    {
      var result, rxSearch;
      if ((result =
            (rxSearch = new RegExp([
                "%([#0+' _-]*)",                         // flags
                "([1-9]*\\d+|(\\*((\\d+)\\$)?))?",       // field width
                "(\\.([+-]?\\d+|(\\*((\\d+)\\$)?))?)?",  // precision
                "([%diouxXeEfFgGaAcsCSpn])"              // conversion
              ].join("")))
            .exec(sFormat)))
      {
        var
          // flag characters
          flags = result[1],
          fieldWidth = result[2],

          /*
           * undefined if the field width was given as an unsigned
           * integer
           */
          argFieldWidth = result[3],

          /*
           * index of the argument to specify the field width;
           * undefined if the field width was given as an unsigned
           * integer
           */
          uFieldWidthArg = result[5],
           
          precision = result[7],
          argPrecision = result[8],

          /*
           * index of the argument to specify the precision;
           * undefined if the precision was given as an unsigned
           * integer or it will be specified by the next argument
           */
          uPrecisionArg = result[10],
          srcArgIdx;

/*
        // length modifier
        var lenModifier    = result[11];
 */      
        // conversion specifier
        var convSpecifier  = result[11];
  
        if (convSpecifier == "%")
        {
          a = "%";
          i--;
        }
        else
        {
/*
        if (/[diouxXeEfFgGaA]/.test(convSpecifier))
        {
          if (typeof a != "number")
          {
            a = Number(a);
          }

          if (/[diouxX]/.test(convSpecifier))
          {
            if (/[ouxX]/.test(convSpecifier))
            {
              switch (convSpecifier)
              {
                case "o": a = a.toString(8); break;
                case "u": a = a.toUnsigned(); break;
                case "x":
                case "X": a = a.toUnsigned().toString(16); break;
              }
            }

            if (!hasPrecision)
            {
              iPrecision = 1;
            }
          }
        }

        var precisionArg;
        if (/[diouxaef]/i.test(convSpecifier))
        {

          if (hasPrecision)
          {
            if (typeof iPrecision != "undefined")
            {
              // precision was given as an unsigned integer
              a = a.toFixed(iPrecision);
            }
            else
            {
              /*
               * use the value of a non-zero indexed argument
               * for precision or the value of the next argument;
               * skip either argument for further expansion
               *
              precisionArg = iPrecArg || i + 1;
              a = a.toFixed(arguments[precisionArg]);
              arguments.skip[precisionArg] = true;
            }
          }
        }
        else if (/s/i.test(convSpecifier))
        {
          if (typeof a != "string")
          {
            a = a.toString();
          }
          
          if (hasPrecision)
          {
            if (typeof iPrecision != "undefined")
            {
              // precision was given as an unsigned integer
              a = a.substring(0, iPrecision);
            }
            else
            {
              /*
               * use the value of a non-zero indexed argument
               * for precision or the value of the next argument;
               * skip either argument for further expansion
               *
              precisionArg = iPrecArg || i + 1;
              a = a.substring(0, arguments[precisionArg]);
              arguments.skip[precisionArg] = true;
            }
          }
        }

*/

          if (precision)
          {
            if (argPrecision)
            {
              srcArgIdx = uPrecisionArg || (i + 1);
              precision = arguments[srcArgIdx];
              arguments.skip[srcArgIdx] = true;
            }

            if (precision > 0)
            { 
              a = Number(a).toFixed(precision);
            }
            else if (precision < 0)
            {
              var pot = Math.pow(10, -precision);
              a = Math.round((a - (a % 1)) / pot) * pot;
            }
          }

          if (fieldWidth)
          {
            if (argFieldWidth)
            {
              srcArgIdx = uFieldWidthArg || (i + 1);
              fieldWidth = arguments[srcArgIdx];
              arguments.skip[srcArgIdx] = true;
            }

            if (fieldWidth > 0)
            { 
              var sPad = CH_NBSP;
              if (flags && /0/.test(flags))
              {
                sPad = "0";
              }

              if (/-/.test(flags))
              {
                a = pad(a, fieldWidth, CH_NBSP, true);
              }
              else
              {
                a = pad(a, fieldWidth, sPad).replace(/^(0+)([+-])/, "$2$1");
              }
            }
          }
        }
                
        sFormat = sFormat.replace(rxSearch, a);
      }
    }
  }

  return sFormat;
}

/**
 * @version
 *    1.29.2004050110
 * @author
 *   (C) 2004 Thomas Lahn <string.js@PointedEars.de>
 * @partof
 *   http://pointedears.de/scripts/string.js
 * @optional string|number s
 *   Un(completely )formatted number (decimal, hexadecimal
 *   or octal) or a string representing such a number.
 *   If the function is called as a method of
 *   @link{jsref#String} objects and <code>s</code> is
 *   provided, the value of <code>s</code> is formatted
 *   instead of the @link{jsref#String} object.
 * @optional string s1kDelim = ","
 *   Character or character sequence to delimit a sequence
 *   of three digits on the left-hand side of the point.
 *   The default is ",".
 * @returns
 *   the formatted number as string, <code>NaN</code> on error.
 */
function format1k(s, s1kDelim)
{
  var result = NaN;

  // to use this method for String objects
  if (typeof this.constructor != "undefined"
      && this.constructor == String
      && !s)
  {
    s = this;
  }

  // to allow for numbers as argument
  s = s.toString();

  if (!isNaN(s))
  {
    if (!s1kDelim)
    {
      s1kDelim = ",";
    }

    var rx = /([\da-f])(\1{3}(,|(\.\1+)?$))/i;
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
 * The function takes a string as argument.  The ASCII or
 * Unicode value (depending on the implementation) of each
 * character (from right to left) is added to the product
 * of the current sum (starting at 0) multiplied with x,
 * where x = 37 if the string is no longer than 15
 * characters, x = 39 otherwise.  If the string is 16
 * characters long or longer, at the average every eighth
 * character is not included in the sum.
 * 
 * @author
 *   JavaScript implementation
 *   (C) 2003 Thomas Lahn &lt;hashCode.js@PointedEars.de&gt;
 * @optional string s
 *   Optional string of which the hash code is computed. If
 *   not provided or <code>false</code>, it is assumed that
 *   the function is used as method of the String prototype,
 *   applied to a String object or literal.
 * @return type number
 *   The hash code of the string, designed for implementing hash
 *   code access to associative arrays which can be implemented
 *   as objects with named properties in JavaScript 1.x.
 * @see
 *   strCodeToArray(), java2:String#hashCode()
 */
function hashCode(s)
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
    // only sample some characters

    var skip = Math.floor(len / 8);
    for (i = len; i > 0; i -= skip, off += skip)
    {
      h = (h * 39) + val[off];
    }
  }
  
  return h;
}

/**
 * @optional string s
 * @return type string
 */
function leadingCaps(s)
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
 * @optional string s
 *   Input string.  If omitted and the calling object
 *   is a String object, it is used instead.
 * @optional number n
 *   Length of the resulting string.  The default is 1,
 *   i.e. if the input string is empty, "0" is returned.
 * @return type string
 *   Input string with leading zeros so that
 *   its length is @{(n)}.
 * @see
 *   #pad()
 */ 
function leadingZero(s, n)
{
   var c;
   if ((c = this.constructor) && c == String && typeof s != "string")
   {
     s = this;
   }   

   return pad(s, n);
}

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
 * Returns the Levenshtein Distance One between two strings.
 * 
 * Returns the Levenshtein Distance One between two input strings
 * @{(s)} and @{(t)} that is, the number of required edit moves
 * to make @{(s)} the same as @{(t)}, and vice-versa.  That value
 * indicates to what extent the two strings are similar -- small
 * distances mean more, large distances less similarity.  It is
 * computed as follows:
 *
 * <pre>
 * Step  Description
 * 
 * 1     Set n to be the length of s.
 *       Set m to be the length of t.
 *       If n = 0, return m and exit.
 *       If m = 0, return n and exit.
 *       Construct a matrix containing 0..m rows and 0..n columns.
 * 2     Initialize the first row to 0..n.
 *       Initialize the first column to 0..m.
 * 3     Examine each character of s (i from 1 to n).
 * 4     Examine each character of t (j from 1 to m).
 * 5     If s[i] equals t[j], the cost is 0.
 *       If s[i] doesn't equal t[j], the cost is 1.
 * 6     Set cell d[i,j] of the matrix equal to the minimum of:
 *       a. The cell immediately above plus 1: d[i-1,j] + 1.
 *       b. The cell immediately to the left plus 1: d[i,j-1] + 1.
 *       c. The cell diagonally above and to the left plus the cost:
 *          d[i-1,j-1] + cost.
 * 7     After the iteration steps (3, 4, 5, 6) are complete,
 *       the distance is found in cell d[n,m].
 * </pre>
 *
 * @optional string s
 * @optional string t
 * @return type number
 */
function levenshtein(s, t)
{
  // Step 1
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
  
  var d = new Array(); // matrix

  // Step 2
  for (var i = 0; i <= n; i++)
  {
    d[i] = new Array();
    d[i][0] = i;
  }

  for (var j = 0; j <= m; j++)
  {
    d[0][j] = j;
  }

  // Step 3
  for (i = 1; i <= n; i++)
  {
    var s_i = s.charAt(i - 1);

    // Step 4
    for (j = 1; j <= m; j++)
    {
      // Step 5
      var cost = (s_i == t.charAt(j - 1)) ? 0 : 1;

      // Step 6
      d[i][j] = Math.min(
        d[i-1][j] + 1,
        d[i][j-1] + 1,
        d[i-1][j-1] + cost);
    }
  }

  // Step 7
  return d[n][m];
}

/**
 * Returns the input string with all substrings that
 * may be interpreted as markup are escaped, that is,
 * those prefixed by `&' or `<'.
 * 
 * @optional string s
 * @return type string
 */ 
function maskMarkup(s)
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
 * @argument string s
 * @return type string
 */
function nl2br(s)
{
  return s.replace(/\r\n?|\n/g, "<br>");
}

/**
 * @param s : optional string 
 *   Input string.  If omitted and the calling object
 *   is a String object, it is used instead.
 * @param n : optional number = 1
 *   Length of the resulting string.  The default is 1,
 *   i.e. if the input string is empty, "0" is returned
 *   if c is <code>'0'</code>.
 * @param c : optional string = CH_NBSP
 *   Character string to use for padding.  The default
 *   is one non-breaking space.
 * @param bRight : optional boolean = false
 *   If <code>true</code>, s is padded on the right,
 *   otherwise on the left.
 * @param iStart : optional number
 *   Assume that s is iStart characters long.
 * @return string
 *   The padded input string so that its length is n.
 */ 
function pad(s, n, c, bRight, iStart)
{
   var constr;
   if ((constr = this.constructor) && constr == String && typeof s != "string")
   {
     s = this;
   }
   
   if (!n)
   {
     n = '1';
   }
   
   if (!c)
   {
     c = CH_NBSP;
   }

   if (typeof s != "string")
   {   
     s = s.toString();
   }

   if (typeof iStart == "undefined")
   {
     iStart = s.length;
   }
   
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

   return s;
}

/**
 * @argument - sText
 * @argument string sReplaced
 * @argument string sReplacement
 * @optional boolean bForceLoop
 * @return type string
 */
function replaceText(sText, sReplaced, sReplacement, bForceLoop)
{
  var result = "";
  var t;
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
      /* Version 1.23.2002.4 bugfix: allows to replace \ with other
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
    else
    {
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
  }

  return result;
}

/**
 * Calculates the number of occurrences of one string in another.
 * 
 * @argument string s
 * @argument string substr
 * @optional boolean bCaseSensitive
 * @return type number
 */
function strCount(s, substr, bCaseSensitive)
{
  var result = 0;

  if ((!s && !this.toLowerCase) || !substr)
  {
    return -1;
  }
  else if (s && this.toLowerCase)
  {
    s = this;
  }

  if (!bCaseSensitive && s.toLowerCase)
  {
    s = s.toLowerCase();
  }

  if (window.RegExp)
  {
    var rxSub = new RegExp(substr, "g" + (!bCaseSensitive ? "i" : ""));

    if (s.match && rxSub)
    {
      result = s.match(rxSub);
      if (result && result.length)
      {
        return result.length;
      }
      else
      {
        return 0;
      }
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
 * Strips <code>&lt;tags&gt;</code> and optionally the
 * content between start and respective end tags from
 * a string.  Uses RegExp if supported.
 * 
 * @author
 *   (C) 2001-2004  Thomas Lahn &lt;js@PointedEars.de&gt;,
 *   Advanced RegExp parsing (C) 2003  Dietmar Meier
 *    &lt;meier@innoline-systemtechnik.de&gt;
 * @optional string s
 *   String where all tags should be stripped from. If not
 *   provided or <code>false</code>, it is assumed that the
 *   function is used as method of the String prototype,
 *   applied to a String object or literal. Note that in
 *   this case the method will not modify the String object
 *   either, but return a second String object.
 * @optional boolean bStripContent = false
 *   If <code>true</code>, the content between a start tag and
 *   a corresponding end tag is also removed.
 *   If <code>false</code> (default), only start and end tags
 *   are removed.
 * @optional boolean bCaseSensitive = false
 *   <code>true</code> for case-sensitive matches,
 *   <code>false</code> (default) otherwise.
 * @optional string|Array of string tags
 *   String or array of values that can be evaluated as string to
 *   specify the tag(s) to be stripped.  If omitted, all tags are
 *   stripped.
 * @optional boolean bElements = false
 *   If <code>true</code>, strip elements, i.e. start and end tags.
 * @returns
 *   String where all tags are stripped from.
 * @see
 *   String.replace()
 */
function stripTags(s, bStripContent, bCaseSensitive, tags, bElements)
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
    var sRxTags = "", i;
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
 * Returns <code>s</code> repeated <code>sMultiplier</code> times.
 * <code>nMultiplier</code> has to be greater than or equal to 0.
 * If <code>nMultiplier</code> is set to 0, the function will
 * return the empty string.
 * 
 * Note that this may be used also as method of the
 * <code>String</code> prototype (if supported), applicable to
 * <code>String</code> objects and literals.  If <code>s</code
 * is not provided, numeric or evaluates to <code>false</code>,
 * the value of the <code>String</code> object is taken instead
 * of it.  If the first argument is then numeric, it is taken for
 * <code>nMultiplier</code> and the latter argument is ignored.
 * 
 * @argument string|number s
 * @argument optional number nMultiplier
 * @return type string
 */ 
function strRepeat(s, nMultiplier)
{
  var sResult = "";

  var c;
  if ((c = this.constructor) && c == String && typeof s != "string")
  {
    s = this;
    nMultiplier = !isNaN(s) ? s : 0;
  }
  
  if (s)
  {
    if (nMultiplier > 0)
    {
      for (var i = 0; i < nMultiplier; i++)
      {
        sResult += s;
      }
    }
  }

  return sResult;
}

/**
 * @author
 *   (C) 2003 Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @optional string s
 *   Optional string to be split into array elements.  If not
 *   provided or <code>false</code>, it is assumed that the
 *   function is used as method of the String prototype, applied
 *   to a String object or literal.
 * @return type Array
 *   An array with every character of <code>s</code> an element
 *   of it.
 * @see
 *   String#charAt(), String#split()
 */
function strToArray(s)
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
// TODO:
// function arrayFromStr(s)
// {
//   return strToArray(s);
// }

/**
 * @argument [string,] as
 *   Input string array.
 * @return type RegExp
 *   A regular expression to match
 *   all the string array elements.
 */
function strArrayToCharClass(as)
{
  var hashTable = [];
  for (var i = as.length; i--; 0)
  {
    var
      s = as[i],
      c = hashCode(s);
    
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
 * @optional string s
 *   Optional string to be split into an array where each
 *   element represents the ASCII or Unicode value of a
 *   character (depending on the implementation) of the
 *   string.
 *   If not provided or <code>false</code>, it is assumed
 *   that the function is used as method of the String
 *   prototype, applied to a String object or literal.
 * @return type Array
 *   An array where every element is the ASCII character
 *   of <code>s</code> an element of it.
 * @see
 *   strToArray(), String#charCodeAt(), String#split()
 */
function strToCodeArray(s)
{
  if (!s && this.charCodeAt)
  {
    s = this;
  }

  var a, i;
    
  if (s.split && _global.strToArray)
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

    for (i = 0, slen = s.length; i < slen; i++)
    {
      a[i] = s.charCodeAt(i);
    }
  }
  
  return a;
}
// TODO:
// function codeArrayFromStr(s)
// {
//   return strToCodeArray(s);
// }

/**
 * Returns the input string with all leading
 * and trailing whitespace removed.
 * 
 * @optional string s
 * @return type string
 * @see #trimLeft(), #trimRight()
 */ 
function trim(s)
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
 * @optional string s
 * @return type string
 */ 
function trimLeft(s)
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
           i++);
      s = s.substring(i);
    }
  }

  return s;
}

/**
 * Returns the input string with all trailing whitespace removed.
 * 
 * @optional string s
 * @return type string
 */ 
function trimRight(s)
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
           i--);
      s = s.substring(0, i + 1);
    }
  }

  return s;
}

// If possible, add methods to the String prototype

String.prototype.addProperties(
  {'leadingCaps': leadingCaps,
   'leadingZero': leadingZero,
   'repeat'     : strRepeat,
   'pad'        : pad,
   'replaceText': replaceText,
   'addSlashes' : addSlashes,
   'strCount'   : strCount,
   'stripTags'  : stripTags,
   'maskMarkup' : maskMarkup,
   'trim'       : trim,
   'trimLeft'   : trimLeft,
   'trimRight'  : trimRight,
   'toArray'    : strToArray     /* TODO: corr. with Array.fromStr */,
   'toCodeArray': strToCodeArray /* TODO: corr. with Array.codeArrayFromStr */,
// 'fromArray'  : strFromArray   /* TODO: corr. with Array.toStr */,
// fromCodeArray: strFromCodeArray /* TODO: corr. with Array.codeArrayToStr */,
   'hashCode'   : hashCode,
   'format1k'   : format1k});

/*
p = Array.prototype;
if (p)
{
  p.fromStr = arrayFromStr;              // TODO: corr. with String.toArray
  p.codeArrayFromStr = codeArrayFromStr; // TODO: corr. with String.toCodeArray
  p.toStr = arrayToStr;                  // TODO: corr. with String.fromArray
  p.codeArrayToStr = codeArrayToStr;   // TODO: corr. with String.fromCodeArray
}
*/
