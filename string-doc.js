/** 
 * <title>PointedEars' JSX: String Library</title>
 */
if (typeof String == "undefined")
{
  var String = new Object();
}
/** @version */ String.version = "1.29.2004071001";
/**
 * @filename string.js
 * @partof   PointedEars' JavaScript Extensions (JSX)
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2001-2004  Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @author
 *   Parts Copyright (C) 2003<br>
 *   Dietmar Meier &lt;meier@innoline-systemtechnik.de&gt;<br>
 *   Martin Honnen &lt;Martin.Honnen@gmx.de&gt;
 */
String.copyright = "Copyright \xA9 1999-2004";
String.author    = "Thomas Lahn";
String.email     = "string.js@PointedEars.de";
String.path      = "http://pointedears.de.vu/scripts/";
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
 * Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA.
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
 *   has a numeric <code>length</code> property, the
 *   result of its toString() method is used instead.
 * @optional number n
 *   Length of the resulting string.  The default is 1,
 *   i.e. if the input string is empty, "0" is returned.
 * @return type string
 *   Input string with leading zeros so that
 *   its length is @{(n)}.
 */ 
function leadingZero(s, n)
{
   if (this.length != "undefined"
       && !isNaN(this.length)
       && typeof s == "undefined")
   {
     s = this;
   }

   if (typeof s != "string")
   {   
     s = s.toString();
   }

   while (s.length < n)
   {
     s = "0" + s;
   }

   return s;
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

  if (s && s.constructor != String && this.constructor == String)
  {
    s = this;
    nMultiplier = !isNaN(s) ? s : 0;
  }
  
  if (s && s.constructor == String)
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
  if (!sText && ((t = typeof this.indexOf) == "function" || t == "object"))
    sText = this;

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
  if (!s && this.replace)
  {
    s = this;
  }

  if (s.replace)
  {
    s = s.replace(/(["'])/g, "\\$1");
  }

  return s;
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
 * @argument string s
 * @return type string
 */
function nl2br(s)
{
  return s.replace(/\r\n?|\n/g, "<br>");
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
  if (!s && this.charAt)
  {
    s = this;
  }

  var len = s.length;

  var val = null;
  if (s.split)
  {
    val = s.split("");
  }
  else
  {
    val = new Array();

    for (var i = 0; i < len; i++)
    {
      val[i] = s.charAt(i);
    }
  }
  
  return val;
}
// TODO:
// function arrayFromStr(s)
// {
//   return strToArray(s);
// }

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

  var len = s.length;
  var val = null;
  var i;
    
  if (s.split)
  {
    val = strToArray(s);

    for (i = 0; i < val.length; i++)
    {
      val[i] = val[i].charCodeAt(0);
    }
  }
  else
  {
    val = new Array();

    for (i = 0; i < len; i++)
    {
      val[i] = s.charCodeAt(i);
    }
  }
  
  return val;
}
// TODO:
// function codeArrayFromStr(s)
// {
//   return strToCodeArray(s);
// }

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
 * distances mean more, large distances less similarity.
 *
 * @optional string s
 * @optional string t
 * @return type number
 */
function levenshtein(
  /** @optional string */ s,
  /** @optional string */ t)
{
  var len = String(s).length;
  var len2 = String(t).length;

  if (!s)
  {
    return (t ? len2 : 0);
  }

  if (!t)
  {
    return (s ? len : 0);
  }
  
  var d = new Array(); // [0..len-1, 0..len2-1]
  
  for (var i = 0; i < len; i++)
  {
    d[i] = new Array();
    d[i][0] = i;
  }
    
  for (var j = 0; j < len2; j++)
  {
    d[0][j] = j;
  }

  for (i = 1; i <= len; i++)
  {
    for (j = 1; j <= len2; j++)
    {
      d[i][j] = Math.min(
        d[i-1][j]   + 1,                             // insertion
        d[i][j-1]   + 1,                             // deletion
        d[i-1][j-1] + !(s.charAt(i) == s.charAt(j))) // substitution
    }
  }
  return d[len - 1][len2 - 1];
}

/**
 * @version
 *    1.29.2004050110
 * @author
 *   (C) 2004 Thomas Lahn <string.js@PointedEars.de>
 * @partof
 *   http://pointedears.de.vu/scripts/string.js
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

// imported from types.js

Function.prototype.addPrototypeProperties =
function function_addPrototypeProperties(/** @arguments */)
{
  for (var i = 0, len = arguments.length; i < len; i++)
  {
    var o = arguments[i];
    for (var j in o)
    {
      this.prototype[j] = o[j];
    }
  }
}

// If possible, add methods to the String prototype

String.addPrototypeProperties(
  {'leadingCaps': leadingCaps,
   'leadingZero': leadingZero,
   'repeat'     : strRepeat,
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
   'format1k'   : format1k
  }
);

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
