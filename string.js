if (typeof String == "undefined")
{
  var String = new Object();
}
String.version = "1.29.2004071001";
String.copyright = "Copyright \xA9 1999-2004";
String.author    = "Thomas Lahn";
String.email     = "string.js@PointedEars.de";
String.path      = "http://pointedears.de.vu/scripts/";
//String.docURL    = stringPath + "string.htm";
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

function nl2br(s)
{
  return s.replace(/\r\n?|\n/g, "<br>");
}
  
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
