/**
 * <title>PointedEars' CSS Library</title>
 * @partof PointedEars' JavaScript Extensions (JSX)
 * 
 * @section Copyright & Disclaimer
 * 
 * @author (C) 2005  Thomas Lahn &lt;css.js@PointedEars.de&gt;
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
/*
 * Refer css.htm file for a printable
 * documentation. 
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSdoc/
 * for details.
 */

/**
 * A <code>CSSSelectorList</code> object encapsulates
 * all CSS selectors linked to from a document in a
 * @{Collection}.
 *
 * @optional Object
 *   Object reference to override the default
 *   <code>document</code> object reference.
 */
function CSSSelectorList(oDocument)
{
  this.document = oDocument || document;
  
  /**
   * Populates the collection with the selectors
   * of the document.
   *
   * @optional Object
   *   Object reference to override the default
   *   <code>document</code> object reference.
   */
  CSSSelectorList.prototype.get = function cssSelectorList_get(oDocument)
  {
    this.clear();

    if (oDocument)
    {
      this.document = oDocument;
    }
    
    var d, oSheets;
    if ((d = this.document) && (oSheets = d.styleSheets))
    {
      for (var i = 0, oRules; i < oSheets.length; i++)
      {
        if ((oRules = oSheets[i].cssRules || oSheets[i].rules))
        {
          for (var j = 0; j < oRules.length; j++)
          {
            this.add(oRules[j].style, oRules[j].selectorText);
          }
        }
      }
      return true;
    }

    return false;
  };
  
  this.get();
}
CSSSelectorList.prototype = new Collection();
  
/**
 * Returns a reference to the selector
 * containing a simple selector.
 *
 * @argument string
 *   Simple selector.
 */
CSSSelectorList.prototype.findSimpleSelector =
function cssSelectorList_findSimpleSelector(sSelector)
{
  var rxSimpleSelector = new RegExp(
    "{simple_selector}({combinator}{simple_selector}*)*"
    .replace(
      /\{simple_selector\}/g,
      '(element_name(#|class|attrib|pseudo)*'
      + '|(#|class|attrib|pseudo)+)')
    .replace(/element_name/g,        "(IDENT|\\*)")
    .replace(/class/g,               "\\.IDENT")
    .replace(/attrib/g,              "\\[\\s*IDENT\\s*([~\\|]="
                                     + "\\s*(IDENT|STRING)\\s*)?\\]")
    .replace(/pseudo/g,              ":(IDENT|FUNCTION\\s*IDENT?\\s*\\))")
    .replace(/FUNCTION/g,            "IDENT\\(\\s*expr\\)\\s*")
    .replace(/\{expr\}/g,            'Term(OperatorTerm)*'
    .replace(/\{Operator\}/g,        "(/\\s*|,\\s*|/\\*([^*]|\\*[\\/])*\\*/)")
    .replace(/\{Term\}/g,            ["(unary_operator?",
                                      "(NUMBER%?\\s*|LENGTH\\s*",
                                      "|ANGLE\\s*|TIME\\s*",
                                      "|FREQ\\s*|IDENT\\(\\s*expr\\)\\s*)",
                                      "|STRING\\s*|IDENT\\s*|URI\\s*|hexcolor)"]
                                      .join(''))
    .replace(/unary_operator/g,      "(-|\\+)")
    .replace(/ANGLE/g,               'NUMBER(deg|g?rad)')
    .replace(/TIME/g,                'NUMBERm?s')
    .replace(/FREQ/g,                'NUMBERk?Hz')
    .replace(/LENGTH/g,              'NUMBER([cm]m|e[mx]|in|p[ctx])')
    .replace(/NUMBER/g,              '([0-9]+|[0-9]*\\.[0-9]+)')
    .replace(/URI/g,                 "url\\(\\s*(STRING|URL)\\s*\\)")
    .replace(/STRING/g,              '({string1}|{string2})')
    .replace(/URL/g,                 '([!#$%&*-~]|{nonascii}|{escape})*')
    .replace(/hexcolor/g,            '#([0-9a-fA-F]{3}){1,2}')
    .replace(/IDENT/g,               "{nmstart}{nmchar}*\\s*")
    .replace(/\{nmstart\}/g,         '([_a-z{nonascii}]|{escape})')
    .replace(/\{nmchar\}/g,          '[_a-zA-Z0-9{nonascii}-]|{escape}')
    .replace(/\{string1\}/g, "\"([\t !#$%&(-~]|\\{nl}|'|[{nonascii}]|{escape})*\"")
    .replace(/\{string2\}/g, "'([\t !#$%&(-~]|\\{nl}|\"|[{nonascii}]|{escape})*'")
    .replace(/\{nl\}/g,              "(\\n|\\r\\n|\\r|\\f)")
    .replace(/\{nonascii\}/g,        "\\x80-\\xFF")
    .replace(/\{escape\}/g,          "({unicode}|\\\\[ -~\\x80-\\xFF])")
    .replace(/\{unicode\}/g,       "\\\\[0-9a-f]{1,6}(\\r\\n|[ \\t\\r\\n\\f])?")
    .replace(/\{combinator\}/g,      "(\\+\\s*|\\>\\s*|\\s+)");
    
  var r;
  while (this.hasNext())
  {
    if ((r = this.next()))
    {
      if (rxSimpleSelector.test(r.selectorText))
      {
        return r;
      }
    }
  }

  return null;
}

/**
 * Shows or hides elements with a certain class name.
 * 
 * @arguments string
 *   Class name of the elements to be hidden/shown.
 * @optional  boolean bShow
 *   If <code>false</code>, elements will be
 *   hidden, otherwise shown.
 * @requires dhtml.js
 */
function showByClassName(sClassName, bShow)
{
  if (oForm)
  {
    var selectorList, selector;
    if (typeof CSSSelectorList != "undefined"
        && (selectorList = new CSSSelectorList())
        && (selector = selectorList.findSimpleSelector("\\." + sClassName)))
    {
      selector.display = bShow ? "" : "none";
    }
    else
    {
      if (typeof dhtml != "undefined"
          || dhtml.getElemByClassName != "undefined")
      {
        alert("Sorry, you must include dhtml.js.");
        return false;
      }

      var es = dhtml.getElemByClassName(sClassName);
      for (var i = es.length; i--; 0)
      {
        var o = es[i];
        if (typeof o.display != "undefined")
        {
          o.display = bShow ? "" : "none";
        }
      }
    }
  }
}

/**
 * The <code>Color</code> prototype encapsulates
 * color data given in RGB format.
 *
 * @argument number|string iRed
 *   Red value or RGB color.  Supported formats for RGB color are:
 *   <code>rgb(<var>r</var>, <var>g</var>, <var>b</var>)</code>,
 *   <code>#rgb</code> and <code>#rrggbb</code>.
 * @optional number iGreen
 *   Green value.
 * @optional number iBlue
 *   Blue value.
 * @property number red
 *   Red value.
 * @property number green
 *   Green value.
 * @property number blue
 *   Blue value.
 */
function Color(iRed, iGreen, iBlue)
{
  /*
   * Fixes RGB values, i.e. brings them into
   * range if they are out of range.
   * Note: Brightness/contrast are disregarded.
   */
  Color.prototype.fix = function color_fix()
  {
    if (this.red   <   0) this.red   =   0;
    if (this.red   > 255) this.red   = 255;
    if (this.green <   0) this.green =   0;
    if (this.green > 255) this.green = 255;
    if (this.blue  <   0) this.blue  =   0;
    if (this.blue  > 255) this.blue  = 255;
  }

  /**
   * Sets the color values from a RGB value.
   * 
   * @argument string
   *   RGB value as supported by @{#Color()}.
   */
  Color.prototype.setRGB = function color_setRGB(v)
  {
    var m;

    if ((m = new RegExp(
      '((rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\))'
        + '|(#([0-9a-f]{3})([0-9a-f]{3})?))',
      'i').exec(v)))
    { 
      // rgb(...)
      if (m[2])
      {
        this.red   = m[3];
        this.green = m[4];
        this.blue  = m[5];
      }
      // #xxxxxx
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
        // #xxx
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
  }

  /**
   * Sets the color values from Red, Green and Blue values or a
   * RGB value.
   * 
   * @argument number|string iRed
   *   Red value or RGB color.  Supported formats
   *   for RGB color are the same as for @{#Color()}.
   * @optional number iGreen
   *   Green value.
   * @optional number iBlue
   *   Blue value.
   */
  Color.prototype.set = function color_set(iRed, iGreen, iBlue)
  {
    if (typeof iRed != 'undefined')
    {
      // rgb(...) or /#xxx(xxx)?/
      if (typeof iRed == 'string')
      {
        this.setRGB(iRed);
      }
      else
      {
        this.red = iRed;
        if (typeof iGreen != 'undefined') this.green = iGreen;
        if (typeof iBlue  != 'undefined') this.blue  = iBlue;
      }
    }
    
    this.fix();

    return this;
  }
  
  this.set(iRed, iGreen, iBlue);
}

/**
 * Returns the monochrome version of a color as an object.
 */
Color.prototype.getMono = function color_getMono()
{
  var avg = Math.floor(((+this.red) + (+this.green) + (+this.blue)) / 3);
  return new Color(avg, avg, avg);
}

/**
 * Sets the color values from Red, Green and Blue values or
 * an RGB value and returns a monochrome version of the color
 * as an object.
 * 
 * @argument number|string iRed
 *   Red value or RGB color.  Supported formats
 *   for RGB color are the same as for @{#Color()}.
 * @optional number iGreen
 *   Green value.
 * @optional number iBlue
 *   Blue value.
 */
Color.prototype.setMono = function color_setMono(iRed, iGreen, iBlue)
{
  if (typeof iRed == 'string')
  {
    this.setRGB(iRed);
  }
  else
  {
    this.red = iRed;
    if (typeof iGreen != 'undefined') this.green = iGreen;
    if (typeof iBlue  != 'undefined') this.blue  = iBlue;
  }
  
  var c = this.getMono();
  this.red   = c.red;
  this.green = c.green;
  this.blue  = c.blue;

  return this;
}

/**
 * Returns the color as a string
 * <code>rgb(<var>r</var>,<var>g</var>,<var>b</var>)</code>
 * representation supported by CSS.
 */
Color.prototype.getRGB = function color_getMono()
{
  return ['rgb(', this.red, ',', this.green, ',', this.blue, ')'].join('');
}

/**
 * Returns the color as a string
 * <code>{red: <var>r</var>, green: <var>g</var>, blue: <var>b</var>}</code>
 * representation.
 */
Color.prototype.toString = function color_toString()
{
  return [
    '{red: ', this.red, ', green: ', this.green, ', blue: ', this.blue, '}'
  ].join('');
}

/**
 * Changes the current document into a monochrome version of itself.
 * 
 * @requires dhtml.js
 */
function makeMono()
{
  var
    sl = new CSSSelectorList(),
    i = sl.iterator(),
    s,
    c = new Color(),
    a = ['backgroundColor', 'borderColor', 'borderTopColor',
         'borderRightColor', 'borderBottomColor', 'borderLeftColor',
         'outlineColor', 'color'],
    j,
    p;
    
  while ((s = i.next()))
  {
    for (j = a.length; j--;)
    {
      if ((p = s[a[j]]))
      {
        s[a[j]] = c.setMono(p).getRGB();
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
        e.style[a[j]] = c.setMono(p).getRGB();
      }
    }
  }
}

function hex2safe(s)
{
  if (s.length > 1)
  {
    var matches;
    if ((matches = /^([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3$/i.exec(s)))
    {
      return [matches[1], matches[2], matches[3]].join("");
    }
  }
  return s;
}

function rgb2hex(s)
{
  if (s)
  {
    var matches;
    if ((matches = /(rgb\s*\()?\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)?/i
                   .exec(s)))
    {
      return ("#" + hex2safe([
                        leadingZero((+matches[2]).toString(16), 2),
                        leadingZero((+matches[3]).toString(16), 2),
                        leadingZero((+matches[4]).toString(16), 2)
                      ].join("")));
    }
  }
  
  return s;
}

// alert(rgb2hex('rgb(204,204,204)'));

