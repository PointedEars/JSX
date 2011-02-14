/**
 * <title>PointedEars' CSS Library</title>
 * @version 0.1.2009041509
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @requires collection.js
 * 
 * @section Copyright & Disclaimer
 * 
 * @author (C) 2005, 2009  Thomas Lahn &lt;css.js@PointedEars.de&gt;
 * 
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

var CSSversion = "0.1.1.2007031314";
if (typeof css == "undefined")
{
  var css = {version: CSSversion};
}
else
{
  css.version = CSSversion;
}

/**
 * A <code>CSSSelectorList</code> object encapsulates
 * all CSS selectors linked to from a document in a
 * {@link Collection}.
 *
 * @param oDocument : optional Object
 *   Object reference to override the default
 *   <code>document</code> object reference.
 * @return undefined
 */
function CSSSelectorList(oDocument)
{
  this._super();
  this.document = oDocument || document;
  this.get();
}
CSSSelectorList.extend(Collection);

/**
 * Populates the collection with the selectors
 * of the document.
 *
 * @param oDocument : optional Object
 *   Object reference to override the default
 *   <code>document</code> object reference.
 * @return undefined
 */
CSSSelectorList.prototype.get = function(oDocument) {
  if (oDocument)
  {
    this.document = oDocument;
  }
  
  this.clear();
  
  var d, oSheets;
  if ((d = this.document) && (oSheets = d.styleSheets))
  {
    for (var i = 0, oRules; i < oSheets.length; i++)
    {
      if ((oRules = oSheets[i].cssRules || oSheets[i].rules))
      {
        for (var j = 0; j < oRules.length; j++)
        {
          this.add(oRules[j], oRules[j].selectorText);
        }
      }
    }
    return true;
  }
  
  return false;
};

/**
 * Returns a reference to the selector
 * containing a simple selector.
 *
 * @param sSelector : String
 *   Simple selector
 * @return CSSStyleRule | Null
 */
CSSSelectorList.prototype.findSimpleSelector = function(sSelector) {
  var s =
    "{simple_selector}({combinator}{simple_selector}*)*"
    .replace(
      /\{simple_selector\}/g,
      '(element_name(#|class|attrib|pseudo)*'
      + '|(#|class|attrib|pseudo)+)');

//    .replace(/element_name/g,        "(IDENT|\\*)")
//    .replace(/class/g,               "\\.IDENT")
//    .replace(/attrib/g,              "\\[\\s*IDENT\\s*([~\\|]="
//                                     + "\\s*(IDENT|STRING)\\s*)?\\]")
//    .replace(/pseudo/g,              ":(IDENT|FUNCTION\\s*IDENT?\\s*\\))")
//    .replace(/FUNCTION/g,            "IDENT\\(\\s*expr\\)\\s*")
//    .replace(/\{expr\}/g,            'Term(OperatorTerm)*')
//    .replace(/\{Operator\}/g,        "(/\\s*|,\\s*|/\\*([^*]|\\*[\\/])*\\/)")
//    .replace(/\{Term\}/g,            ["([+-]?",
//                                      "(NUMBER%?\\s*|LENGTH\\s*",
//                                      "|ANGLE\\s*|TIME\\s*",
//                                      "|FREQ\\s*|IDENT\\(\\s*expr\\)\\s*)",
//                                      "|STRING\\s*|IDENT\\s*|URI\\s*|hexcolor)"]
//                                      .join(''))
//    .replace(/ANGLE/g,               'NUMBER(deg|g?rad)')
//    .replace(/TIME/g,                'NUMBERm?s')
//    .replace(/FREQ/g,                'NUMBERk?Hz')
//    .replace(/LENGTH/g,              'NUMBER([cm]m|e[mx]|in|p[ctx])')
//    .replace(/NUMBER/g,              '([0-9]+|[0-9]*\\.[0-9]+)')
//    .replace(/URI/g,                 "url\\(\\s*(STRING|URL)\\s*\\)")
//    .replace(/STRING/g,              '({string1}|{string2})')
//    .replace(/URL/g,                 '([!#$%&*-~]|{nonascii}|{escape})*')
//    .replace(/hexcolor/g,            '#([0-9a-fA-F]{3}){1,2}')
//    .replace(/IDENT/g,               "{nmstart}{nmchar}*\\s*")
//    .replace(/\{nmstart\}/g,         '([_a-z{nonascii}]|{escape})')
//    .replace(/\{nmchar\}/g,          '([_a-zA-Z0-9{nonascii}-]|{escape})')
//    .replace(/\{string1\}/g, "\"([\t !#$%&(-~]|\\{nl}|'|[{nonascii}]|{escape})*\"")
//    .replace(/\{string2\}/g, "'([\t !#$%&(-~]|\\{nl}|\"|[{nonascii}]|{escape})*'")
//    .replace(/\{nl\}/g,              "(\\n|\\r\\n|\\r|\\f)")
//    .replace(/\{nonascii\}/g,        "\\x80-\\xFF")
//    .replace(/\{escape\}/g,          "({unicode}|\\\\[ -~\\x80-\\xFF])")
//    .replace(/\{unicode\}/g,       "\\\\[0-9a-f]{1,6}(\\r\\n|[ \\t\\r\\n\\f])?")
//    .replace(/\{combinator\}/g,      "(\\+\\s*|\\>\\s*|\\s+)");

//  try
//  {
//    x = y;
//  }
//  catch (e)
//  {
//    alert("TODO in \n" + e.stack + "\n" + s);
//  }

  // var rxSimpleSelector = new RegExp(s);
    
  var i = this.iterator();
  while ((s = i.next()))
  {
    if ((new RegExp(sSelector)).test(s.selectorText))
    {
      return s;
    }
  }
  
  return null;
};

/**
 * Shows or hides elements with a certain class name.
 * 
 * @param {string} sClassName
 *   Class name of the elements to be hidden/shown.
 * @param {boolean} bShow (optional)
 *   If <code>false</code> (default), elements will be
 *   hidden, otherwise shown.
 * @requires dhtml.js
 * @return {boolean}
 *   <code>true</code> if successful, <code>false</code> otherwise.
 */
function showByClassName(sClassName, bShow)
{
  var selectorList, selector;
  if (typeof CSSSelectorList != "undefined"
      && (selectorList = new CSSSelectorList())
      && (selector =
            selectorList.findSimpleSelector("\\." + sClassName)))
  {
    selector.display = bShow ? "" : "none";
    return (selector.display == bShow ? "" : "none");
  }
  else
  {
    if (typeof dhtml != "undefined"
        && dhtml.isMethodType(typeof dhtml.getElemByClassName))
    {
      var es = dhtml.getElemByClassName(sClassName);

      for (var i = es.length; i--; 0)
      {
        var o = es[i];
        if (typeof o.display != "undefined")
        {
          o.display = bShow ? "" : "none";
        }
      }
      return true;
    }
    else
    {
      window.alert("Sorry, JSX:css.js:showByClassName() requires JSX:dhtml.js");
      return false;
    }
  }
}

/**
 * The <code>Color</code> prototype encapsulates
 * color data given in RGB format.
 *
 * @param iRed {Number|Color|String}
 *   Red value or RGB color.  Supported formats for RGB color are:
 *   <code>rgb(<var>r</var>, <var>g</var>, <var>b</var>)</code>,
 *   <code>#rgb</code> and <code>#rrggbb</code>.  If a <code>Color</code>,
 *   its red component is used.
 * @param iGreen {Number|Color}
 *   Green value (optional).  If both <code>iRed</code> and this argument
 *   are <code>Color</code>s, this arguments's green component is used.
 * @param iBlue {Number|Color}
 *   Blue value (optional).  If both <code>iRed</code> and this argument
 *   are <code>Color</code>s, this arguments's blue component is used.
 * @property {Number} red
 *   Red value
 * @property {Number} green
 *   Green value.
 * @property {Number} blue
 *   Blue value.
 * @return Color
 */
function Color(iRed, iGreen, iBlue)
{
  this.set(iRed, iGreen, iBlue);
}

/**
 * Sets the color values from Red, Green and Blue values or a
 * RGB value.
 * 
 * @param iRed {number|Color|string}
 *   Red value or RGB color.  Supported formats
 *   for RGB color are the same as for {@link #Color}.
 * @param iGreen {number|Color}
 *   Green value (optional)
 * @param iBlue {number|Color}
 *   Blue value (optional)
 * @return Color
 */
Color.prototype.set = function(iRed, iGreen, iBlue) {
  if (typeof iRed != 'undefined')
  {
    /* rgb(...) or /#xxx(xxx)?/ */
    if (typeof iRed == 'string')
    {
      this.setRGB(iRed);
    }
    else
    {
      if (jsx.object.isInstanceOf(iRed, Color))
      {
        this.setRed(iRed.red);

        if (jsx.object.isInstanceOf(iGreen, Color)
            && jsx.object.isInstanceOf(iBlue, Color))
        {
          this.setGreen(iGreen.green);
          this.setBlue(iBlue.blue);
        }
        else
        {
          this.setGreen(iRed.green);
          this.setBlue(iRed.blue);
        }
      }
      else
      {
        this.setRed(iRed);
        this.setGreen(iGreen);
        this.setBlue(iBlue);
      }
    }
  }
  
  this.fix();
  
  return this;
};

/**
 * @private
 * @param {String} sComponent
 * @param {Number} value
 */
Color.prototype._setComponent = function(sComponent, value) {
  if (isNaN(value))
  {
    return jsx.throwThis("jsx.InvalidArgumentError",
      ["Invalid component value", String(value), "number"]);
  }
  
  this[sComponent] = parseInt(value);
};

Color.prototype.setRed = function(value) {
  this._setComponent("red", value);
};

Color.prototype.setGreen = function(value) {
  this._setComponent("green", value);
};

Color.prototype.setBlue = function(value) {
  this._setComponent("blue", value);
};

/**
 * Returns the difference between two colors.
 * 
 * @param {Color} color2
 * @param {Color} color1 (optional)
 * @return {Object}
 *   The difference between the current color (A)
 *   and another color (B) as a tuple (object) consisting
 *   of the differences between each RGB color component
 *   of each color.  That is, if A := (r1, g1, b1) and
 *   B := (r2, g2, b2) then <code>A.diff(B)</code> returns
 *   B - A := (r2 - r1, g2 - g1, b2 - b1).
 * 
 *   If this method is passed a second Color object as
 *   argument, color A will be that object instead of
 *   the calling object.
 * 
 *   Note that since each component value of the result
 *   may be negative, the result is normalized through
 *   {@link Color.prototype#fix} if its properties are
 *   used for creating a Color object.
 * @type {red, green, blue}
 */
Color.prototype.diff = function(color2, color1) {
  if (color1.constructor != Color)
  {
    if (this.constructor == Color)
    {
      color1 = this;
    }
    else
    {
      jsx.throwException(
        "TypeError",
        "Color.prototype.diff(color2, color1):"
        + " Caller must be a Color object if color1 does not refer to one");
    }
  }
  
  return {
    red:   color2.red   - color1.red,
    green: color2.green - color1.green,
    blue:  color2.blue  - color1.blue
  };
};

/**
 * Fixes RGB values, i.e. brings them into range
 * if they are out of range, and returns the new value.
 * Note: Brightness/contrast are disregarded.
 * 
 * @return Color
 */
Color.prototype.fix = function() {
  if (this.red   <   0) { this.red   =   0; }
  if (this.red   > 255) { this.red   = 255; }
  if (this.green <   0) { this.green =   0; }
  if (this.green > 255) { this.green = 255; }
  if (this.blue  <   0) { this.blue  =   0; }
  if (this.blue  > 255) { this.blue  = 255; }
  
  return this;
};

/**
 * Increase/decrease one or more RGB components of a color.
 * 
 * @param iRed
 * @param iGreen
 * @param iBlue
 * @return Color
 */
Color.prototype.inc = function(iRed, iGreen, iBlue) {
  switch (iRed.constructor)
  {
    case String:
      iRed = new Color(iRed);
    
    case Object:
    case Color:
      if (typeof iRed.green != "undefined")
      {
        iGreen = iRed.green;
      }
      
      if (typeof iRed.blue != "undefined")
      {
        iBlue  = iRed.blue;
      }
      
      iRed = iRed.red;
      break;
      
    case Array:
      if (typeof iRed[1] != "undefined")
      {
        iGreen = iRed[1];
      }
      
      if (typeof iRed[2] != "undefined")
      {
        iBlue  = iRed[2];
      }
      
      iRed = iRed[0];
      break;
  }

  this.red   += (parseInt(iRed, 10) || 0);
  this.green += (parseInt(iGreen, 10) || 0);
  this.blue  += (parseInt(iBlue, 10) || 0);
  
  return this.fix();
};

/**
 * Sets the color values from a RGB value.
 * 
 * @param v : string
 *   RGB value as supported by @{#Color()}.
 * @return Color
 */
Color.prototype.setRGB = function(v) {
  var m;

  if ((m =
        new RegExp(
          '((rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\))'
            + '|(#([0-9a-f]{3})([0-9a-f]{3})?))',
          'i').exec(v)))
  {
    /* rgb(...) */
    if (m[2])
    {
      this.setRed(m[3]);
      this.setGreen(m[4]);
      this.setBlue(m[5]);
    }
    /* #xxxxxx */
    else if (m[6])
    {
      if (m[8])
      {
        if ((m =
               /([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(m[7] + m[8])))
        {
          this.red   = parseInt(m[1], 16);
          this.green = parseInt(m[2], 16);
          this.blue  = parseInt(m[3], 16);
        }
      }
      /* #xxx */
      else
      {
        var c;
        this.red   = parseInt((c = m[7].charAt(0)) + c, 16);
        this.green = parseInt((c = m[7].charAt(1)) + c, 16);
        this.blue  = parseInt((c = m[7].charAt(2)) + c, 16);
      }
    }
  }

  this.fix();

  return this;
};

/**
 * Returns the monochrome version of a color as an object.
 * 
 * @return Color
 */
Color.prototype.getMono = function() {
  var v = this.getHSV().value;
  return new Color(v, v, v);
};

/**
 * Sets the color values from Red, Green and Blue values or
 * an RGB value and returns a monochrome version of the color
 * as an object.
 * 
 * @param iRed : number|string
 *   Red value or RGB color.  Supported formats
 *   for RGB color are the same as for @{#Color()}.
 * @param iGreen : optional number
 *   Green value.
 * @param iBlue : optional number
 *   Blue value.
 * @return Color
 */
Color.prototype.setMono = function(iRed, iGreen, iBlue) {
  this.set(iRed, iGreen, iBlue);
  
  var c = this.getMono();
  this.red   = c.red;
  this.green = c.green;
  this.blue  = c.blue;

  return this;
};

/**
 * Returns the next similar color to the represented color on the
 * 214-color Web-safe palette, i.e. a color where each sRGB component
 * is one of the hexadecimal values 0x00 (0), 0x33 (51), 0x66 (102),
 * 0x99 (153), 0xCC (204), and 0xFF (255).
 * 
 * @return Color
 */
Color.prototype.getWebSafe = function() {
  function getNearestSafeValue(v)
  {
    if (v >= 0xFF)
    {
      return 0xFF;
    }
          
    if (v <= 0)
    {
      return 0;
    }

    for (var a = [0, 0x33, 0x66, 0x99, 0xCC, 0xFF], i = a.length-1;
         i--;)
    {
      if (v >= a[i])
      {
        if (v == a[i])
        {
          return v;
        }
        
        if (v - a[i] < a[i+1] - v)
        {
          return a[i];
        }

        return a[i+1];
      }
    }
    return -1;
  }

  return new Color(
    getNearestSafeValue(this.red),
    getNearestSafeValue(this.green),
    getNearestSafeValue(this.blue));
};

Color.prototype.setWebSafe = function(iRed, iGreen, iBlue) {
  this.set(iRed, iGreen, iBlue);
  
  var c = this.getWebSafe();
  this.red   = c.red;
  this.green = c.green;
  this.blue  = c.blue;

  return this;
};

/**
 * Returns the color in the sRGB color space as an object
 * identifying the coordinates of that color in the
 * HSV/HSB (Hue, Saturation, Value/Brightness) color space.
 * 
 * @return Object
 */
Color.prototype.getHSV = function() {
  /* We need the maximum value out of three */
  if (Math.max(1, 2, 3) != 3)
  {
    Math.max = function() {
      var result = arguments[0];
      
      for (var i = arguments.length; i--;)
      {
        if (result < arguments[i]){result = arguments[i];}
      }

      return result;
    };
  }
  
  /* We need the minimum value out of three */
  if (Math.min(3, 2, 1) != 1)
  {
    Math.min = function() {
      var result = arguments[0];
      
      for (var i = arguments.length; i--;)
      {
        if (result > arguments[i]){result = arguments[i];}
      }

      return result;
    };
  }
  
  /* Cf. http://en.wikipedia.org/wiki/HSV_color_space#Transformation_between_HSV_and_RGB */
  var
    r = this.red   / 255,
    g = this.green / 255,
    b = this.blue  / 255,
    max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    h = 0,  /* hue */
    s = 0,  /* saturation */
    v,      /* value */
    d = max - min;

  if (max != min)
  {
    
    if (r == max)
    {
      h = (g - b)/d * 60;
    }
    else if (g == max)
    {
      h = (2 + (b - r)/d) * 60;
    }
    else if (b == max)
    {
      h = (4 + (r - g)/d) * 60;
    }
  }
  
  if (h < 0){h = h + 360;}

  if (max == 0)
  {
    s = 0;
  }
  else
  {
    s = 100 * (d / max);
  }

  v = 100 * max;
  
  return {hue: h, saturation: s, value: v};
};

/**
 * Returns a <code>Color</code> object, identifying a color in the
 * sRGB color space, defined by given coordinates for that color
 * in the HSV/HSB (Hue, Saturation, Value/Brightness) color space.
 * If any of the coordinates is not provided, it is assumed to be
 * 0 (zero).
 * 
 * @param h : number
 *   Hue, from 0 to 360 (degrees).
 * @param s : number
 *   Saturation, from 0.0 to 1.0 (0 to 100%).
 * @param v : number
 *   Brightness value, from 0.0 to 1.0 (0 to 100%).
 * @return Color
 */
Color.prototype.HSVtoRGB = function(h, s, v) {
  /* Cf. http://en.wikipedia.org/wiki/HSV_color_space#Transformation_between_HSV_and_RGB */
  if (s == 0.0)
  {
    return new Color(v * 255, v * 255, v * 255);
  }

  var
    h_i = Math.floor(h / 60) % 6,
    f = (h / 60) - h_i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    r, g, b;
    
  switch (h_i)
  {
    case 0:
      r = v; g = t; b = p;
      break;
      
    case 1:
      r = q; g = v; b = p;
      break;
      
    case 2:
      r = p; g = v; b = t;
      break;
      
    case 3:
      r = p; g = q; b = v;
      break;
      
    case 4:
      r = t; g = p; b = v;
      break;
      
    case 5:
      r = v; g = p; b = q;
      break;
  }
  
  return new Color(r * 255, g * 255, b * 255);
};

Color.prototype.toHex = function() {
  var
    r = leadingZero(this.red.toString(16), 2),
    g = leadingZero(this.green.toString(16), 2),
    b = leadingZero(this.blue.toString(16), 2),
    rx = /([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/i,
    m;
     
  if ((m = rx.exec([r, g, b].join(''))))
  {
    r = m[1];
    g = m[2];
    b = m[3];
  }
    
  return ['#', r, g, b].join('');
};

/**
 * Returns the color as a string
 * <code>rgb(<var>r</var>,<var>g</var>,<var>b</var>)</code>
 * representation supported by CSS.
 * 
 * @return string
 */
Color.prototype.toRGBString =
Color.prototype.toString = function() {
  return ['rgb(', this.red, ',', this.green, ',', this.blue, ')'].join('');
};

/**
 * Returns the color as a string
 * <code>{red: <var>r</var>, green: <var>g</var>, blue: <var>b</var>}</code>
 * representation as supported by e.g. JSON.
 * 
 * @return string
 */
Color.prototype.toObjectString = function color_toObjectString() {
  return [
    '{red: ', this.red, ', green: ', this.green, ', blue: ', this.blue, '}'
  ].join('');
};

/**
 * Changes the current document into a monochrome version of itself.
 * 
 * @requires dhtml.js
 */
function makeMono()
{
  var
    sl = new CSSSelectorList(),
    oIt = sl.iterator(),
    s,
    c = new Color(),
    a = ['backgroundColor', 'borderColor', 'borderTopColor',
         'borderRightColor', 'borderBottomColor', 'borderLeftColor',
         'outlineColor', 'color'],
    j,
    p;
    
  while ((s = oIt.next()))
  {
    for (j = a.length; j--;)
    {
      if ((p = s[a[j]]))
      {
        s[a[j]] = c.setMono(p).toString();
      }
    }
  }
  
  for (var es = dhtml.getElemByTagName('*'), i = es && es.length; i--;)
  {
    var e = es[i];
    for (j = a.length; j--;)
    {
      if ((p = e.style[a[j]]))
      {
        e.style[a[j]] = c.setMono(p).toString();
      }
    }
  }
}

/**
 * Returns the computed style of an element or
 * the computed value of a style property of an element.
 * 
 * @param o : HTMLElement
 * @param p : string
 * @return
 *   The return value depends on both the passed arguments
 *   and the capabilities of the user agent:
 * 
 *   If the UA supports either ViewCSS::getComputedStyle()
 *   from W3C DOM Level 2 CSS or MSHTML's currentStyle
 *   property, then
 *     a) if p was passed, the value of the style property
 *        with name p is returned; it is a string if the
 *        property is supported;
 *     b) if p was not passed, the corresponding style object
 *        is returned
 * 
 *   If the UA supports neither of the above, `undefined' is
 *   returned.
 * @type string|CSSStyleDeclaration|currentStyle
 */
function _getComputedStyle(o, p)
{
  var s;

  if (jsx.object.isMethod(document, "defaultView", "getComputedStyle")
      && (s = document.defaultView.getComputedStyle(o, null)))
  {
    if (p && isMethod(s, "getPropertyValue"))
    {
      return s.getPropertyValue(p);
    }

    return s;
  }
  else if (typeof (s = o.currentStyle) != "undefined")
  {
    if (p)
    {
      return s[p];
    }

    return s;
  }

  return s;
}
var currentStyle = _getComputedStyle;
css.getComputedStyle = currentStyle;

function isHidden(o)
{
  while (o)
  {
    if (typeof o.style == "undefined"
        || typeof o.style.visibility != "undefined"
        && /hidden/i.test(o.style.visibility)
        || /hidden/i.test(_getComputedStyle(o, "visibility")))
    {
      return true;
    }

    o = o.parentNode;
  }

  return false;
}

function focusElement(s)
{
  var o = document.getElementById(s);
  if (o && isMethod(o, "focus") && !isHidden(o))
  {
    o.focus();
  }
}