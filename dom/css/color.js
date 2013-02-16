"use strict";
/**
 * <title>PointedEars' DOM Library: CSS Colors</title>
 * @version $Id$
 * @requires dom/css.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2011, 2012 Thomas Lahn <js@PointedEars.de>
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

if (typeof jsx.dom == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom = {};
}

if (typeof jsx.dom.css == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom.css = {};
}

/**
 * The <code>Color</code> prototype encapsulates
 * color data given in RGB format.
 *
 * @param iRed : Number|Color|String
 *   Red value or RGB color.  Supported formats for RGB color are:
 *   <code>rgb(<var>r</var>, <var>g</var>, <var>b</var>)</code>,
 *   <code>#rgb</code> and <code>#rrggbb</code>.  If a <code>Color</code>,
 *   its red component is used.
 * @param iGreen : Number|Color
 *   Green value (optional).  If both <code>iRed</code> and this argument
 *   are <code>Color</code>s, this arguments's green component is used.
 * @param iBlue : Number|Color
 *   Blue value (optional).  If both <code>iRed</code> and this argument
 *   are <code>Color</code>s, this arguments's blue component is used.
 * @param fOpacity : Number|Color
 *   Opacity value (optional).  If both <code>iRed</code> and this argument
 *   are <code>Color</code>s, this arguments's opacity value is used.
 * @property red : Number
 *   Red value
 * @property green : Number
 *   Green value.
 * @property blue : Number
 *   Blue value.
 * @property opacity : Number
 *   Opacity value
 * @return jsx.dom.css.Color
 */
jsx.dom.css.Color = function (iRed, iGreen, iBlue, fOpacity) {
  return this.set(iRed, iGreen, iBlue, fOpacity);
};

jsx.dom.css.Color.MIN_VALUE = 0;
jsx.dom.css.Color.MAX_VALUE = 255;

/**
 * Returns the difference between two colors.
 * 
 * @param color1 : jsx.dom.css.Color|String
 * @param color2 : jsx.dom.css.Color|String
 * @returns {red, green, blue, opacity}
 * @see jsx.dom.css.Color.prototype.diff()
 */
jsx.dom.css.Color.diff = function (color1, color2) {
  return (new jsx.dom.css.Color(color1)).diff(color2);
};

/**
 * Returns a <code>Color</code> object, identifying a color in the
 * sRGB color space, defined by given coordinates for that color
 * in the HSV (Hue, Saturation, Value) color space.
 * If any of the coordinates is not provided, it is assumed to be
 * 0 (zero).
 * 
 * @param iHue : number
 *   Hue, from 0 to 360 (degrees).
 * @param fSaturation : number
 *   Saturation, from 0.0 to 1.0 (0 to 100%).
 * @param fValue : number
 *   Brightness value, from 0.0 to 1.0 (0 to 100%).
 * @return jsx.dom.css.Color
 */
jsx.dom.css.Color.hsv2rgb = function (iHue, fSaturation, fValue) {
  return (new jsx.dom.css.HSVColor(iHue, fSaturation, fValue)).toRGB();
};

jsx.dom.css.Color.extend(null, {
  /**
   * Sets the color values from Red, Green, Blue and Opacity values or a
   * RGB(A) value.
   * 
   * @memberOf jsx.dom.css.Color.prototype
   * @param iRed {number|Color|string}
   *   Red value or RGB color.  Supported formats
   *   for RGB color are the same as for {@link #Color}.
   * @param iGreen {number|Color}
   *   Green value (optional)
   * @param iBlue {number|Color}
   *   Blue value (optional)
   * @param fOpacity : {number|Color}
   *   Opacity value (optional)
   * @return jsx.dom.css#Color
   */
  set: function (iRed, iGreen, iBlue, fOpacity) {
    if (typeof iRed != "undefined")
    {
      /* rgb(...) or /#xxx(xxx)?/ */
      if (typeof iRed == "string")
      {
        this.setRGB(iRed);
      }
      else
      {
        if (jsx.object.isInstanceOf(iRed, this.constructor))
        {
          this.setRed(iRed.red);
  
          var argc = arguments.length;
          if (jsx.object.isInstanceOf(iGreen, this.constructor)
              && jsx.object.isInstanceOf(iBlue, this.constructor)
              && (jsx.object.isInstanceOf(fOpacity, this.constructor)
                  || argc < 4))
          {
            this.setGreen(iGreen.green);
            this.setBlue(iBlue.blue);
            if (argc < 4)
            {
              this.setOpacity(fOpacity.opacity);
            }
          }
          else
          {
            this.setGreen(iRed.green);
            this.setBlue(iRed.blue);
            this.setOpacity(iRed.opacity);
          }
        }
        else
        {
          this.setRed(iRed);
          this.setGreen(iGreen);
          this.setBlue(iBlue);
          this.setOpacity(typeof fOpacity == "undefined" ? 1.0 : fOpacity);
        }
      }
    }
    
    this.fix();
    
    return this;
  },
    
  /**
   * @private
   * @param {String} sComponent
   * @param {Number} value
   */
  _setComponent: function (sComponent, value) {
    if (String(value).indexOf("%") > -1)
    {
      value = this.constructor.MAX_VALUE * (parseFloat(value, 10) / 100);
    }
    
    if (isNaN(value))
    {
      return jsx.throwThis("jsx.InvalidArgumentError",
        ["Invalid component value", String(value), "number"]);
    }
    
    this[sComponent] = parseFloat(value, 10);
  },
    
  setRed: function (value) {
    this._setComponent("red", value);
  },
    
  setGreen: function (value) {
    this._setComponent("green", value);
  },
    
  setBlue: function (value) {
    this._setComponent("blue", value);
  },
  
  setOpacity: function (value) {
    if (isNaN(value))
    {
      return jsx.throwThis("jsx.InvalidArgumentError",
        ["Invalid opacity value", String(value), "number"]);
    }
    
    this.opacity = parseFloat(value);
  },
  
  /**
   * Returns the difference between two colors.
   * 
   * @param color2 : jsx.dom.css.Color
   * @return {Object}
   *   The difference between the current color (A)
   *   and another color (B) as a tuple (Object) consisting
   *   of the differences between each RGB color component and
   *   the opacity of each color.  That is, if A := (r1, g1, b1, o1)
   *   and B := (r2, g2, b2, o2) then <code>A.diff(B)</code>
   *   returns B - A := (r2 - r1, g2 - g1, b2 - b1, o2 - o1).
   * 
   *   Note that since each component value of the result
   *   may be negative, the result is normalized through
   *   {@link jsx.dom.css.Color.prototype#fix} if its properties
   *   are used for creating a <code>Color</code> object.
   * @type {red, green, blue, opacity}
   */
  diff: function (color2) {
    var _Color = jsx.dom.css.Color;
    if (color2.constructor != _Color)
    {
      color2 = new _Color(color2);
    }
    
    return {
      red:     color2.red     - this.red,
      green:   color2.green   - this.green,
      blue:    color2.blue    - this.blue,
      opacity: color2.opacity - this.opacity
    };
  },
  
  /**
   * Fixes RGB values, i.e. brings them into range
   * if they are out of range, and returns the new value.
   * NOTE: Disregards brightness and contrast.
   * 
   * @return jsx.dom.css#Color
   */
  fix: function () {
    var rgbMin = this.constructor.MIN_VALUE;
    var rgbMax = this.constructor.MAX_VALUE;
    
    for (var component in {red: 1, green: 1, blue: 1})
    {
      this[component] = Math.round(this[component]);

      if (isNaN(this[component]) || this[component] < rgbMin)
      {
        this[component] = rgbMin;
      }
      else
      {
        if (this[component] > rgbMax)
        {
          this[component] = rgbMax;
        }
      }
    }
  
    if (typeof this.opacity == "undefined" || this.opacity > 1)
    {
      this.opacity = 1;
    }
    else if (this.opacity < 0)
    {
      this.opacity = 0;
    }
  
    return this;
  },
    
  /**
   * Increase/decrease one or more RGB components of a color.
   * 
   * @param iRed
   * @param iGreen
   * @param iBlue
   * @return jsx.dom.css#Color
   */
  inc: function (iRed, iGreen, iBlue) {
    switch (iRed.constructor)
    {
      case String:
        iRed = new jsx.dom.css.Color(iRed);
        break;
      
      case Object:
      case this.constructor:
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
  
    this.red   += (parseFloat(iRed, 10) || 0);
    this.green += (parseFloat(iGreen, 10) || 0);
    this.blue  += (parseFloat(iBlue, 10) || 0);
    
    return this.fix();
  },
    
  /**
   * Sets the color values from an RGB(A) value.
   * 
   * @param v : string
   *   RGB(A) value as supported by @{#Color()}.
   * @return jsx.dom.css#Color
   */
  setRGB: function (v) {
    /*
     * <http://www.w3.org/TR/css3-values/#percentages>:
     * "A percentage value is denoted by <percentage>, consists of
     *  a <number> immediately followed by a percent sign ‘%’."
     * "A number is either an integer, or zero or more decimal
     *  digits followed by a dot (.) followed by one or more
     *  decimal digits."
     */
    var
      integer = "\\d+",
      number = "(" + integer + "|\\d*\\.\\d+)",
      percentage_opt = number + "%?";
    
    var rx = new RegExp(
      "rgb(a)?\\(\\s*(" + percentage_opt + ")"
      + "\\s*,\\s*(" + percentage_opt + ")"
      + "\\s*,\\s*(" + percentage_opt + ")"
      + "(\\s*,\\s*("+ number + "))?\\s*\\)"
      + "|#([0-9a-f]{3})([0-9a-f]{3})?",
      "i");
    
    var m;
    if ((m = rx.exec(v)))
    {
      /* rgb(...) */
      var
        rgba    = m[1],
        red     = m[2],
        green   = m[4],
        blue    = m[6],
        opacity = m[9],
        hex3    = m[11],
        hex6    = m[12];
  
      if (red)
      {
        this.setRed(red);
        this.setGreen(green);
        this.setBlue(blue);
  
        if (rgba)
        {
          this.setOpacity(opacity);
        }
      }
      else
      {
        /* #xxx(xxx)? */
        if (hex6)
        {
          /* #xxxxxx */
          if ((m =
                 /([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex3 + hex6)))
          {
            this.setRed(parseInt(m[1], 16));
            this.setGreen(parseInt(m[2], 16));
            this.setBlue(parseInt(m[3], 16));
          }
        }
        else
        {
          /* #xxx */
          var ch;
          this.setRed(parseInt((ch = hex3.charAt(0)) + ch, 16));
          this.setGreen(parseInt((ch = hex3.charAt(1)) + ch, 16));
          this.setBlue(parseInt((ch = hex3.charAt(2)) + ch, 16));
        }
      }
    }
  
    this.fix();
  
    return this;
  },
    
  /**
   * Returns the monochrome version of a color as an object.
   * 
   * @return jsx.dom.css#Color
   */
  getMono: function () {
    var v = this.toHSV().getValue();
    return new this.constructor(v, v, v);
  },
    
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
   * @return jsx.dom.css#Color
   */
  setMono: function (iRed, iGreen, iBlue) {
    this.set(iRed, iGreen, iBlue);
    
    var c = this.getMono();
    this.red   = c.red;
    this.green = c.green;
    this.blue  = c.blue;
  
    return this;
  },
    
  /**
   * Returns the next similar color to the represented color on the
   * 214-color Web-safe palette, i.e. a color where each sRGB component
   * is one of the hexadecimal values 0x00 (0), 0x33 (51), 0x66 (102),
   * 0x99 (153), 0xCC (204), and 0xFF (255).
   * 
   * @return jsx.dom.css#Color
   */
  getWebSafe: function () {
    function getNearestSafeValue (value)
    {
      if (value >= 0xFF)
      {
        return 0xFF;
      }
            
      if (value <= 0)
      {
        return 0;
      }
  
      for (var safeValues = [0, 0x33, 0x66, 0x99, 0xCC, 0xFF],
                i = safeValues.length - 1;
           i--;)
      {
        var item = safeValues[i];
        
        if (value >= item)
        {
          if (value == item)
          {
            return value;
          }
          
          var nextItem = safeValues[i + 1];
          if (value - item < nextItem - value)
          {
            return item;
          }
  
          return nextItem;
        }
      }
      return -1;
    }
  
    return new this.constructor(
      getNearestSafeValue(this.red),
      getNearestSafeValue(this.green),
      getNearestSafeValue(this.blue));
  },
    
  setWebSafe: function (iRed, iGreen, iBlue) {
    this.set(iRed, iGreen, iBlue);
    
    var c = this.getWebSafe();
    this.red   = c.red;
    this.green = c.green;
    this.blue  = c.blue;
  
    return this;
  },
  
  /**
   * Returns the color in the sRGB color space as an object
   * identifying the coordinates of that color in the
   * HSL (Hue, Saturation, Lightness) color space.
   * 
   * @requires jsx.math.max(), jsx.math.min() from <tt>math/float.js</tt>
   * @return jsx.dom.css.HSLColor
   */
  toHSL: function () {
    /* Cf. <http://www5.informatik.tu-muenchen.de/lehre/vorlesungen/graphik/info/csc/COL_26.htm#topic25> */
    
    jsx.importOnce(jsx.absPath("../../math/float.js", jsx.importFrom.lastImport));
    
    var
      red = this.red,
      green = this.green,
      blue = this.blue,
      min = jsx.math.min(red, green, blue),
      max = jsx.math.max(red, green, blue),
      hue, saturation,
      lightness = ((max + min) / 2) / this.constructor.MAX_VALUE;
    
    if (max == min)
    {
      saturation = 0;
    }
    else
    {
      if (lightness <= 0.5)
      {
        saturation = (max - min) / (max + min);
      }
      else
      {
        saturation = (max - min) / (2 - max - min);
      }
    }

    var delta = max - min;
    
    if (red == max)
    {
      hue = (green - blue) / delta;
    }
    else if (green == max)
    {
      hue = 2 + (blue - red) / delta;
    }
    else if (blue == max)
    {
      hue = 4 + (red - green) / delta;
    }

    hue *= 60;
    
    if (hue < 0)
    {
      hue += 360;
    }

    return new jsx.dom.css.HSLColor(hue, saturation * 100, lightness * 100, this.opacity);
  },

  /**
   * Returns the color in the sRGB color space as an object
   * identifying the coordinates of that color in the
   * HSV (Hue, Saturation, Value) color space.
   * 
   * @requires jsx.math.max(), jsx.math.min() from <tt>math/float.js</tt>
   * @return jsx.dom.css.HSVColor
   */
  toHSV: function () {
    /* Cf. http://en.wikipedia.org/wiki/HSV_color_space#Transformation_between_HSV_and_RGB */
    var
      rgbMax = this.constructor.MAX_VALUE,
      red   = this.red   / rgbMax,
      green = this.green / rgbMax,
      blue  = this.blue  / rgbMax,
      max = jsx.math.max(red, green, blue),
      min = jsx.math.min(red, green, blue),
      hue = 0,
      saturation = 0,
      value,
      delta = max - min;

    if (max != min)
    {
      if (red == max)
      {
        hue = (green - blue) / delta * 60;
      }
      else if (green == max)
      {
        hue = (2 + (blue - red) / delta) * 60;
      }
      else if (blue == max)
      {
        hue = (4 + (red - green) / delta) * 60;
      }
    }
    
    if (hue < 0)
    {
      hue += 360;
    }

    if (max == 0)
    {
      saturation = 0;
    }
    else
    {
      saturation = 100 * (delta / max);
    }

    value = 100 * max;
    
    return new jsx.dom.css.HSVColor(hue, saturation, value, this.opacity);
  },

  /**
   * @requires jsx.string.leadingZero() from string.js
   * @returns {String}
   */
  toHex: function () {
    var _leadingZero = jsx.string.leadingZero;
    var
      red = _leadingZero(this.red.toString(16), 2),
      green = _leadingZero(this.green.toString(16), 2),
      blue = _leadingZero(this.blue.toString(16), 2),
      rx = /([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/i,
      m;
       
    if ((m = rx.exec(red + green + blue)))
    {
      red = m[1];
      green = m[2];
      blue = m[3];
    }
      
    return '#' + red + green + blue;
  },

  /**
   * Returns the color as a string
   * <code>rgb(<var>red</var>,<var>green</var>,<var>blue</var>)</code>
   * representation supported by CSS.
   * 
   * @function
   * @return string
   */
  toRGBString: function () {
    return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
  },

  /**
   * Returns the JavaScript Object Notation for the instance.
   * 
   * Returns
   * <code>{"red": <var>r</var>, "green": <var>g</var>, "blue": <var>b</var>,
   * "opacity": <var>op</var>}</code>
   * as supported by e.g. JSON.
   * 
   * @return string
   */
  toJSON: function () {
    return '{'
      + '"red": ' + this.red
      + ', "green": ' + this.green
      + ', "blue": '+ this.blue
      + ', "opacity": ' + this.opacity
      + '}';
  }
});

/**
 * Revives a <code>Color</code> instance from its JavaScript Object Notation.
 * 
 * Pass as second argument to {@link JSON#parse()} or call in another reviver:
 * <pre><code>  var Color = jsx.dom.css.Color;
 *  var myColor = JSON.parse(new Color("#f00"), Color.reviver);</code></pre>
 * 
 * @see jsx.dom.css.Color#fromJSON
 * @return number|jsx.dom.css.Color
 */
jsx.dom.css.Color.reviver = function (property, value) {
  return (typeof value == "object")
    ? new this(value.red, value.green, value.blue, value.opacity)
    : value;
};

/**
 * Creates a <code>Color</code> instance from JavaScript Object Notation.
 * 
 * @param sJSON : String
 * @return jsx.dom.css.Color|null
 *   The <code>Color</code> if successful, <code>null</code> otherwise.
 */
jsx.dom.css.Color.fromJSON = function (sJSON) {
  if (jsx.isNativeMethod(jsx.tryThis("JSON"), "parse"))
  {
    return JSON.parse(sJSON, this.reviver);
  }

  var
    color = null,
    error = null;
  
  jsx.tryThis(
    function () { color = eval("(" + sJSON + ")"); },
    function (e) { error = e; }
  );
  
  if (!color || error && error.name == "SyntaxError")
  {
    return null;
  }
  
  return new this(color.red, color.green, color.blue, color.opacity);
};

/**
 * Returns the color as a string
 * <code>rgba(<var>red</var>,<var>green</var>,<var>blue</var>, <var>opacity</var>)</code>
 * representation supported by CSS.
 * 
 * @function
 * @return string
 */
jsx.dom.css.Color.prototype.toString =
jsx.dom.css.Color.prototype.toRGBAString = function () {
  return ('rgba(' + this.red + ',' + this.green + ',' + this.blue
    + ',' + this.opacity + ')');
};

/**
 * Creates a HSV color value (not to be confused with
 * {@link jsx.dom.css#HSLColor}).
 * 
 * If any of the coordinates is not provided, it is assumed to be
 * 0 (zero).
 * 
 * @param iHue : int
 * @param fSaturation : float
 * @param fValue : float
 * @constructor
 * @property hue : int
 *   Hue value
 * @property saturation : float
 *   Saturation value
 * @property value : float
 *   Value component
 * @property opacity : float
 *   Opacity value
 */
jsx.dom.css.HSVColor = function (iHue, fSaturation, fValue, fOpacity) {
  this.setHue(iHue);
  this.setSaturation(fSaturation);
  this.setValue(fValue);
  this.setOpacity(fOpacity);
};

jsx.dom.css.HSVColor.extend(null, {
  /**
   * @memberOf jsx.dom.css.HSVColor.prototype
   * @param value : int
   */
  setHue: function (value) {
    this.hue = value || 0;
  },

  /**
   * @param value : float
   */
  setSaturation: function (value) {
    this.saturation = value || 0;
  },

  /**
   * @param value : float
   */
  setValue: function (value) {
    this.value = value || 0;
  },
  
  setOpacity: (function () {
    var _setOpacity = jsx.dom.css.Color.prototype.setOpacity;
    
    return function (value) {
      return _setOpacity.call(this, value);
    };
  }()),

  /**
   * @returns number
   */
  getValue: function () {
    return this.value;
  },
  
  /**
   * Returns the RGB color for the HSV color
   * 
   * @return jsx.dom.css.Color
   */
  toRGB: (function () {
    var _Color = jsx.dom.css.Color;
    
    return function () {
      /* Cf. http://en.wikipedia.org/wiki/HSV_color_space#Transformation_between_HSV_and_RGB */
      var
        v = this.value,
        rgbMax = _Color.MAX_VALUE;
      
      if (this.saturation == 0.0)
      {
        return new _Color(v * rgbMax, v * rgbMax, v * rgbMax);
      }
    
      var
        h_i = Math.floor(this.hue / 60) % 6,
        f = (this.hue / 60) - h_i,
        p = v * (1 - this.saturation),
        q = v * (1 - f * this.saturation),
        t = v * (1 - (1 - f) * this.saturation),
        red, green, blue;
        
      switch (h_i)
      {
        case 0:
          red = v; green = t; blue = p;
          break;
          
        case 1:
          red = q; green = v; blue = p;
          break;
          
        case 2:
          red = p; green = v; blue = t;
          break;
          
        case 3:
          red = p; green = q; blue = v;
          break;
          
        case 4:
          red = t; green = p; blue = v;
          break;
          
        case 5:
          red = v; green = p; blue = q;
          break;
          
        default:
          return null;
      }
      
      return new _Color(red * rgbMax, green * rgbMax, blue * rgbMax, this.opacity);
    };
  }())
});

/**
 * Creates a HSL color value (not to be confused with
 * {@link jsx.dom.css#HSVColor}).
 * 
 * If any of the coordinates is not provided, it is assumed to be
 * 0 (zero).
 * 
 * @param iHue : int
 *   Hue in degrees
 * @param fSaturation : float
 *   Saturation per cent
 * @param fLightness : float
 *   Lightness per cent
 * @param fOpacity : float
 *   Opacity between 0 (0%) and 1 (100%) inclusive
 * @constructor
 * @property hue : int
 *   Hue value
 * @property saturation : float
 *   Saturation value
 * @property lightness : float
 *   Lightness value
 * @property opacity : float
 *   Opacity value
 */
jsx.dom.css.HSLColor = function (iHue, fSaturation, fLightness, fOpacity) {
  this.setHue(iHue);
  this.setSaturation(fSaturation);
  this.setLightness(fLightness);
  this.setOpacity(fOpacity);
};

/**
 * Revives a <code>Color</code> instance from its JavaScript Object Notation.
 * 
 * Pass as second argument to {@link JSON#parse()} or call in another reviver:
 * <pre><code>  var Color = jsx.dom.css.Color;
 *  var myColor = JSON.parse(new Color("#f00"), Color.reviver);</code></pre>
 * 
 * @see jsx.dom.css.Color#fromJSON
 * @return number|jsx.dom.css.Color
 */
jsx.dom.css.HSLColor.reviver = function (property, value) {
  return (typeof value == "object")
    ? new this(value.hue, value.saturation, value.lightness, value.opacity)
    : value;
};

/**
 * Creates a <code>HSLColor</code> instance from JavaScript Object Notation.
 * 
 * @param sJSON : String
 * @return jsx.dom.css.HSLColor|null
 *   The <code>HSLColor</code> if successful,
 *   <code>null</code> otherwise.
 * @see JSON#parse(String, Function)
 */
jsx.dom.css.HSLColor.fromJSON = function (sJSON) {
  if (jsx.isNativeMethod(jsx.tryThis("JSON"), "parse"))
  {
    return JSON.parse(sJSON, this.reviver);
  }

  var
    color = null,
    error = null;
  
  jsx.tryThis(
    function () { color = eval("(" + sJSON + ")"); },
    function (e) { error = e; }
  );
  
  if (!color || error && error.name == "SyntaxError")
  {
    return null;
  }
  
  return new this(color.hue, color.saturation, color.lightness, color.opacity);
};


jsx.dom.css.HSLColor.extend(null, {
  /**
   * @memberOf jsx.dom.css.HSLColor.prototype
   * @param value : int
   */
  setHue: function (value) {
    this.hue = value || 0;
  },
  
  /**
   * @param value : float
   */
  setSaturation: function (value) {
    this.saturation = value || 0;
  },
  
  /**
   * @param value : float
   */
  setLightness: function (value) {
    this.lightness = value || 0;
  },
  
  setOpacity: (function () {
    var _setOpacity = jsx.dom.css.Color.prototype.setOpacity;
      
    /**
     * @param value : float
     */
    return function (value) {
      return _setOpacity.call(this, value);
    };
  }()),
  
  /**
   * Returns the RGB color for the HSL color
   * 
   * @return jsx.dom.css.Color
   */
  toRGB: (function () {
    var _Color = jsx.dom.css.Color;
    
    return function () {
      /* Cf. <http://www5.informatik.tu-muenchen.de/lehre/vorlesungen/graphik/info/csc/COL_26.htm#topic25> */
      function getRGBValue(n1, n2, hue)
      {
        if (hue > 360)
        {
          hue = hue - 360;
        }
        else if (hue < 0)
        {
          hue = hue + 360;
        }
    
        var value;
        
        if (hue < 60)
        {
          value = n1 + (n2 - n1) * hue / 60;
        }
        else if (hue < 180)
        {
          value = n2;
        }
        else if (hue < 240)
        {
          value = n1 + (n2 - n1) * (240 - hue) / 60;
        }
        else
        {
          value = n1;
        }
    
        return value;
      }
      
      var
        hue = this.hue,
        saturation = this.saturation / 100,
        lightness = this.lightness / 100,
        m2, red, green, blue;
      
      if (lightness <= 0.5)
      {
        m2 = lightness * (1 + saturation);
      }
      else
      {
        m2 = lightness + saturation - lightness * saturation;
      }
    
      var m1 = 2 * lightness - m2;
    
      if (saturation == 0)
      {
        red = green = blue = lightness;
      }
      else
      {
        red = getRGBValue(m1, m2, hue + 120);
        green = getRGBValue(m1, m2, hue);
        blue = getRGBValue(m1, m2, hue - 120);
      }
      
      var rgbMax = _Color.MAX_VALUE;
      
      return new _Color(red * rgbMax, green * rgbMax, blue * rgbMax, this.opacity);
    };
  }()),
  
  toHSLString: function () {
    return ('hsl(' + this.hue
      + ', ' + this.saturation + '%'
      + ', ' + this.lightness + '%)');
  },
  
  /**
   * Returns the JavaScript Object Notation for the instance.
   * 
   * Returns
   * <code>{"red": <var>r</var>, "green": <var>g</var>, "blue": <var>b</var>,
   * "opacity": <var>op</var>}</code>
   * as supported by e.g. JSON.
   * 
   * @return string
   */
  toJSON: function () {
    return '{'
      + '"hue": ' + this.hue
      + ', "saturation": ' + this.saturation
      + ', "lightness": '+ this.lightness
      + ', "opacity": ' + this.opacity
      + '}';
  }
});

jsx.dom.css.HSLColor.prototype.toString =
jsx.dom.css.HSLColor.prototype.toHSLAString = function () {
  return ('hsla(' + this.hue
    + ', ' + this.saturation + '%'
    + ', ' + this.lightness + '%'
    + ', ' + this.opacity + ')');
};

/**
 * Changes the current document into a monochrome version of itself.
 * 
 * @function
 */
jsx.dom.css.makeMono = (function () {
  var _Color = new jsx.dom.css.Color();
  
  return function () {
    var
      ruleList = new jsx.dom.css.RuleList(),
      iter = ruleList.iterator(),
      rule,
      colorProperties = [
        'backgroundColor', 'borderColor', 'borderTopColor',
        'borderRightColor', 'borderBottomColor', 'borderLeftColor',
        'outlineColor', 'color'
      ],
      j, propertyValue;
      
    while ((rule = iter.next()))
    {
      for (j = colorProperties.length; j--;)
      {
        propertyValue = rule[colorProperties[j]];
        if (propertyValue)
        {
          rule[colorProperties[j]] = _Color.setMono(propertyValue).toString();
        }
      }
    }
    
    for (var elems = dhtml.getElemByTagName('*'), i = elems && elems.length; i--;)
    {
      var elem = elems[i];
      for (j = colorProperties.length; j--;)
      {
        if ((propertyValue = elem.style[colorProperties[j]]))
        {
          elem.style[colorProperties[j]] = _Color.setMono(propertyValue).toString();
        }
      }
    }
  };
}());