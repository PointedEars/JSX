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
 * @param iOpacity : Number|Color
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
 */
jsx.dom.css.Color = function(iRed, iGreen, iBlue, iOpacity) {
  this.set(iRed, iGreen, iBlue, iOpacity);
};

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
 * @param iOpacity : {number|Color}
 *   Opacity value (optional)
 * @return Color
 */
jsx.dom.css.Color.prototype.set = function(iRed, iGreen, iBlue, iOpacity) {
  if (typeof iRed != 'undefined')
  {
    /* rgb(...) or /#xxx(xxx)?/ */
    if (typeof iRed == 'string')
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
            && (jsx.object.isInstanceOf(iOpacity, this.constructor)
                || argc < 4))
        {
          this.setGreen(iGreen.green);
          this.setBlue(iBlue.blue);
          if (argc < 4)
          {
            this.setOpacity(iOpacity.opacity);
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
        this.setOpacity(iOpacity);
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
jsx.dom.css.Color.prototype._setComponent = function(sComponent, value) {
  if (isNaN(value))
  {
    return jsx.throwThis("jsx.InvalidArgumentError",
      ["Invalid component value", String(value), "number"]);
  }
  
  this[sComponent] = parseInt(value);
};
  
jsx.dom.css.Color.prototype.setRed = function(value) {
  this._setComponent("red", value);
};
  
jsx.dom.css.Color.prototype.setGreen = function(value) {
  this._setComponent("green", value);
};
  
jsx.dom.css.Color.prototype.setBlue = function(value) {
  this._setComponent("blue", value);
};

jsx.dom.css.Color.prototype.setOpacity = function(value) {
  this._setComponent("opacity", value);
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
jsx.dom.css.Color.prototype.diff = function(color2, color1) {
  if (color1.constructor != jsx.dom.css.Color)
  {
    if (this.constructor == jsx.dom.css.Color)
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
    red:     color2.red     - color1.red,
    green:   color2.green   - color1.green,
    blue:    color2.blue    - color1.blue,
    opacity: color2.opacity - color1.opacity
  };
};

/**
 * Fixes RGB values, i.e. brings them into range
 * if they are out of range, and returns the new value.
 * Note: Brightness/contrast are disregarded.
 * 
 * @return Color
 */
jsx.dom.css.Color.prototype.fix = function() {
  for (var component in {red: 1, green: 1, blue: 1, opacity: 1})
  {
    if (this[component] < 0)
    {
      this[component] = 0;
    }
    else if (this[component] > 255)
    {
      this[component] = 255;
    }
  }
  
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
jsx.dom.css.Color.prototype.inc = function(iRed, iGreen, iBlue) {
  switch (iRed.constructor)
  {
    case String:
      iRed = new jsx.dom.css.Color(iRed);
    
    case Object:
    case jsx.dom.css.Color:
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
jsx.dom.css.Color.prototype.setRGB = function(v) {
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
jsx.dom.css.Color.prototype.getMono = function() {
  var v = this.getHSV().value;
  return new jsx.dom.css.Color(v, v, v);
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
jsx.dom.css.Color.prototype.setMono = function(iRed, iGreen, iBlue) {
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
jsx.dom.css.Color.prototype.getWebSafe = function() {
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

  return new jsx.dom.css.Color(
    getNearestSafeValue(this.red),
    getNearestSafeValue(this.green),
    getNearestSafeValue(this.blue));
};
  
jsx.dom.css.Color.prototype.setWebSafe = function(iRed, iGreen, iBlue) {
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
 * @requires Math.maxN(), Max.minN() from <tt>math/float.js</tt>
 * @return Object {hue, saturation, value}
 */
jsx.dom.css.Color.prototype.getHSV = function() {
  /* Cf. http://en.wikipedia.org/wiki/HSV_color_space#Transformation_between_HSV_and_RGB */
  var
    r = this.red   / 255,
    g = this.green / 255,
    b = this.blue  / 255,
    max = Math.maxN(r, g, b),
    min = Math.minN(r, g, b),
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
jsx.dom.css.Color.prototype.HSVtoRGB = function(h, s, v) {
  var Color = jsx.dom.css.Color;
  
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
  
/**
 * @requires jsx.string.leadingZero() from string.js
 * @returns {String}
 */
jsx.dom.css.Color.prototype.toHex = function() {
  var
    leadingZero = jsx.string.leadingZero,
    r = leadingZero(this.red.toString(16), 2),
    g = leadingZero(this.green.toString(16), 2),
    b = leadingZero(this.blue.toString(16), 2),
    rx = /([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/i,
    m;
     
  if ((m = rx.exec(r + g + b)))
  {
    r = m[1];
    g = m[2];
    b = m[3];
  }
    
  return '#' + r + g + b;
};

/**
 * Returns the color as a string
 * <code>rgb(<var>r</var>,<var>g</var>,<var>b</var>)</code>
 * representation supported by CSS.
 * 
 * @function
 * @return string
 */
jsx.dom.css.Color.prototype.toString = jsx.dom.css.Color.prototype.toRGBString = function() {
  return 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
};
  
  /**
   * Returns the color as a string
   * <code>{red: <var>r</var>, green: <var>g</var>, blue: <var>b</var>}</code>
   * representation as supported by e.g. JSON.
   * 
   * @return string
   */
jsx.dom.css.Color.prototype.toObjectString = function() {
  return '{red: ' + this.red + ', green: ' + this.green + ', blue: '+ this.blue + '}';
};