/** 
 * <title>PointedEars' JSX: String Library</title>
 */
if (typeof String == "undefined")
{
  var String = new Object();
}
/** @version */ String.version = "1.29.2004031616";
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

function leadingCaps(/* @argument optional string */ s)
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

function strRepeat(
  /** @argument string|number   */ s,
  /** @argument optional number */ nMultiplier)
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
 */
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

function replaceText(
  /** @argument                  */ sText,
  /** @argument string           */ sReplaced,
  /** @argument string           */ sReplacement,
  /** @argument optional boolean */ bForceLoop)
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

function addSlashes(/** @argument optional string */ s)
/**
 * Adds backslashes to escape " and ' in strings.
 * 
 * @author Copyright (c) 2003
 *   Martin Honnen &lt;Martin.Honnen@gmx.de&gt;,
 *   Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @argdescr s
 *   String where " and ' should be escaped.  Ignored if
 *   the function is called as a method of a String object.
 * @returns
 *   The replaced string if String.replace(...)
 *   is supported, the original string otherwise.
 */
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

function strCount(
  /** @argument string           */ s,
  /** @argument string           */ substr,
  /** @argument optional boolean */ bCaseSensitive)
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

function stripTags(/** @argument optional string */ s)
/**
 * Strips <code>&lt;tags&gt;</code> from a string.
 * Uses RegExp if supported.
 * 
 * @author
 *   (C) 2001-2003  Thomas Lahn &lt;js@PointedEars.de&gt;,
 *   Advanced RegExp parsing (C) 2003  Dietmar Meier
 *    &lt;meier@innoline-systemtechnik.de&gt;
 * @argdescr s
 *   String where all tags should be stripped from. If not
 *   provided or <code>false</code>, it is assumed that the
 *   function is used as method of the String prototype,
 *   applied to a String object or literal. Note that in
 *   this case the method will not modify the String object
 *   either, but return a second String object.
 * @returns
 *   String where all tags are stripped from.
 * @see
 *   String.replace()
 */
{
  if (!s)
  {
    s = this;
  }
  else
  {
    s = String(s);
  }

  var sUntagged = s;

  if (s.match && s.replace)
  {
    // sUntagged = s.replace(/<[^>]*>/g, "");
    var r1 = /<[^<>]*(<[^<>]*>)*[^<>]*>/g;
    while (s.match(r1))
      s = s.replace(r1, "");
    sUntagged = s;
  }
  else
  {
    var a = "";
    var bOutOfTag = true;
    var l = s.length;
    sUntagged = "";

    for (var i = 0; i < l; i++)
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

function maskMarkup(/** @argument optional string */ s)
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

function trimLeft(/** @argument optional string */ s)
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

function trimRight(/** @argument optional string */ s)
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

function trim(/** @argument optional string */ s)
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

function strToArray(/** @argument optional string */ s)
/**
 * @author
 *   (C) 2003 Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @argdescr s
 *   Optional string to be split into array elements.  If not
 *   provided or <code>false</code>, it is assumed that the
 *   function is used as method of the String prototype, applied
 *   to a String object or literal.
 * @returns
 *   An array with every character of <code>s</code> an element
 *   of it.
 * @see
 *   String#charAt(), String#split()
 */
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

function strToCodeArray(/** @argument optional string */ s)
/**
 * @author
 *   (C) 2003 Thomas Lahn &lt;string.js@PointedEars.de&gt;
 * @argdescr s
 *   Optional string to be split into an array where each
 *   element represents the ASCII or Unicode value of a
 *   character (depending on the implementation) of the
 *   string.
 *   If not provided or <code>false</code>, it is assumed
 *   that the function is used as method of the String
 *   prototype, applied to a String object or literal.
 * @returns
 *   An array where every element is the ASCII character
 *   of <code>s</code> an element of it.
 * @see
 *   strToArray(), String#charCodeAt(), String#split()
 */
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

function hashCode(/** @argument optional string */ s)
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
 * @argdescr s
 *   Optional string of which the hash code is computed. If
 *   not provided or <code>false</code>, it is assumed that
 *   the function is used as method of the String prototype,
 *   applied to a String object or literal.
 * @returns
 *   The hash code of the string, designed for implementing hash
 *   code access to associative arrays which can be implemented
 *   as objects with named properties in JavaScript 1.x.
 * @see
 *   strCodeToArray(), java2:String#hashCode()
 */
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

// If possible, add methods to the String prototype

function strAddToPrototype()
{
  var p = String.prototype;
  if (p)
  {
    p.leadingCaps = leadingCaps;
    p.repeat = strRepeat;
    p.replaceText = replaceText;
    p.addSlashes = addSlashes;
    p.strCount = strCount;
    p.stripTags = stripTags;
    p.maskMarkup = maskMarkup;
    p.trim = trim;
    p.trimLeft = trimLeft;
    p.trimRight = trimRight;
    p.toArray = strToArray;           // TODO: corr. with Array.fromStr
    p.toCodeArray = strToCodeArray;   // TODO: corr. with Array.codeArrayFromStr
//  p.fromArray = strFromArray;         // TODO: corr. with Array.toStr
//  p.fromCodeArray = strFromCodeArray; // TODO: corr. with Array.codeArrayToStr
    p.hashCode = hashCode;
  }

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
}
strAddToPrototype();
