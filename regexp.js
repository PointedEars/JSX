/**
 * <title>PointedEars' JSX: RegExp Library</title>
 */
if (typeof RegExp == "undefined")
{
  var RegExp = new Object();
}
/** @version */ RegExp.version = "0.1.2009010602";
/**
 * @filename regexp.js
 * @partof   PointedEars' JavaScript Extensions (JSX)
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2005, 2008  Thomas Lahn &lt;regexp.js@PointedEars.de&gt;
 */
RegExp.copyright = "Copyright \xA9 2005";
RegExp.author    = "Thomas Lahn";
RegExp.email     = "regexp.js@PointedEars.de";
RegExp.path      = "http://pointedears.de/scripts/";
//RegExp.docURL    = RegExp.path + "regexp.htm";
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

/**
 * Returns the string representation of a RegExp object without delimiters.
 * 
 * @param rx
 * @return string
 */
function regexp2str(rx)
{
  // return rx.toString().replace(/[^\/]*\/((\\\/|[^\/])+)\/[^\/]*/, "$1");
  return rx.source || rx.toString().replace(/[^\/]*\/(.+)\/[^\/]*/, "$1");
}
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
 *   A reference to the resulting RegExp.
 */
function regexp_concat()
{
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
      if (!oFlags.g && a.global)     oFlags.g = true;
      if (!oFlags.i && a.ignoreCase) oFlags.i = true;
      if (!oFlags.m && a.multiline)  oFlags.m = true;
      if (!oFlags.y && a.sticky)     oFlags.y = true;
    }
    else
    {
      aParts.push(String(a).replace(/([^|()])/g, "\\$1"));
    }
  }

  return new RegExp(aParts.join(""), oFlags.joinSet());
}
RegExp.prototype.concat = regexp_concat;

/**
 * @param pattern2
 * @param pattern1
 * @return RegExp
 */
function regexp_intersect(pattern2, pattern1)
{
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
  if (!pattern2 || pattern2.constructor != RegExp) return null;

  var
    s = this.source.replace(/^\(?([^)]*)\)?$/, "$1"),
    s2 = pattern2.source.replace(/^\(?([^)]*)\)?$/, "$1");

  /* Register all parts within alternation of this pattern */
  var
    a = s.split("|"),
    o = {};
  for (var i = 0, len = a.length; i < len; i++) o[a[i]] = true;

  /* Register all parts within alternation of pattern2 */
  var
    a2 = s2.split("|"),
    o2 = {};
  for (i = 0, len = a2.length; i < len; i++) o2[a2[i]] = true;

  /* Compose the new alternation out of common parts */
  var hOP = (
    /**
     * @return Function
     */
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
    if (hOP(o2, p)) a.push(p);
  }

  return new RegExp("(" + a.join("|") + ")");
}
RegExp.prototype.intersect = regexp_intersect;

/**
 * Returns an escaped version of the string that can be
 * passed as an argument to {@link Global#RegExp(string, string)}
 * to match that string.
 * 
 * @param s : string
 * @return string
 */
function strRegExpEscape(s)
{
  if (arguments.length < 0 && this.constructor == String)
  {
    s = this;
  }
    
  return s.replace(/[\]\\^$*+?.(){}[]/g, "\\$&");
}
String.prototype.regExpEscape = strRegExpEscape;

if (typeof jsx != "object") var jsx = {};
jsx.RegExp = (function() {
  var
    rxUnicodeProperty = /\\[pPX]/,
    jsx_object = jsx.object;
  
  function jsxRegExp(sExpression)
  {
    var me = arguments.callee;
    
    if (sExpression.test(rxUnicodeProperty))
    {
      var req = new jsx.HTTPRequest(me.unicodeFilePath, "GET", false,
        function(x) {
          jsxRegExp.characterData = {
            cache: {},
            
            getCharacters: function(property) {
              if (jsx_object.getProperty(this.cache, property, false))
              {
                /* .. */
              }
              else
              {
                // this.cache[property] = [for (line in this.lines)]
              }
            }
          };
          
          var lines = x.responseText.split(/\r?\n|\r/);
          
          jsxRegExp.characterData.lines = lines;
        });
      req.send();

      this.expr = new RegExp(sExpression);
    
    }
  }
   
  return jsxRegExp;
})();
jsx.RegExp.unicodeFilePath = "UnicodeData.txt";

jsx.RegExp = (function() {
  var
    rxEscapes = /\\([ae]|c([A-Z])|[pP]([A-Za-z]|\{([^\}]+)\}))/g,
    escapeMap = {
      /* BEL */
      a: "\\u0007",
      
      /* ESC */
      e: "\\u001B"
    },
    unicodeMap = {
      Letter: "A-Za-z"
    },
    shortcutMap = [
      ["L", "Letter"]
    ];
  
  for (var i = shortcutMap.length; i--;)
  {
    var pair = shortcutMap[i];
    unicodeMap[pair[0]] = unicodeMap[pair[1]];
  }
  
  return function(expression, sFlags) {
    if (expression && expression.constructor == RegExp) return expression;
    if (typeof expression != "string") jsx.throwThis("TypeError");
    
    expression = expression.replace(rxEscapes,
      function(m, p1, p2, p3) {
        var result = m;
        
        switch (p1)
        {
          case "a":
          case "e":
            result = escapeMap[p1];
            break;
                      
          case "p":
          case "P":
            result = unicodeMap[p1] || unicodeMap[p4];
            
            if (p1 === "P")
            {
              result = "^" + result;
            }
            
            result = "[" + result + "]";
            break;
            
          default:
            result = "\\u00" + (p2.charCodeAt(0) - 64).toString(16);
        }
        
        return result;
      });
    
    return new RegExp(expression, sFlags);
  };
})();

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