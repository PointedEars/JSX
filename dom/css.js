/**
 * <title>PointedEars' DOM Library: CSS</title>
 * @version $Id$
 * @requires dom.js
 * @recommends collection.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2005-2013 Thomas Lahn <js@PointedEars.de>
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
  if (typeof jsx.importFrom == "function")
  {
    jsx.importFrom(jsx.absPath("../dom.js", jsx.importFrom.lastImport));
  }
  else
  {
    /**
     * @namespace
     */
    jsx.dom = {};
  }
}

/**
 * @type jsx.dom.css
 * @memberOf __jsx.dom.css
 * @namespace
 */
jsx.dom.css = (/** @constructor */ function () {
  var _jsx_object = jsx.object;

  var _LENGTH = 1;
  var _COLOR = 5;
  var _FLOAT = 7;
  var _TRANSFORM = 8;

  return {
    /**
     * @memberOf jsx.dom.css
     */
    version: "0.1.$Revision$",

    /**
     * Supported CSS data types.  Properties include:
     *        <dl>
     *          <dt><code>NUMBER</code></dt>
     *            <dd></dd>
     *
     *          <dt><code>LENGTH</code></dt>
     *            <dd></dd>
     *
     *          <dt><code>PERCENTAGE</code></dt>
     *            <dd></dd>
     *
     *          <dt><code>URI</code></dt>
     *            <dd>Uniform Resource Identifier or URI-reference (see RFC 3986),
     *                enclosed in <code>url(…)</code></dd>
     *
     *          <dt><code>COUNTER</code></dt>
     *            <dd>CSS counter</dd>
     *
     *          <dt><code>COLOR</code></dt>
     *            <dd>Color in RGB(A) or HSV format</dd>
     *
     *          <dt><code>STRING</code></dt>
     *            <dd>Unicode string</dd>
     *        </dl>
     *
     * @namespace
     */
    types: {
      /**
       * Numeric scalar value
       */
      NUMBER:     0,

      /**
       * Length given relative in <code>em</code> (width of the
       * M&nbsp;square) or <code>ex</code> (height of the x square),
       * or absolute in <code>in</code> (inches), <code>cm</code>
       * (centimeters), <code>mm</code> (millimeters), <code>pt</code>
       * (points), <code>pc</code> (picas), or <code>px</code>
       * (pixels).
       */
      LENGTH:     _LENGTH,

      /**
       * Length given in percentage of the parent
       */
      PERCENTAGE: 2,

      /**
       * Uniform Resource Identifier or URI-reference (see RFC 3986),
       * enclosed in <code>url(…)</code>.
       */
      URI:        3,

      /**
       * CSS counter
       */
      COUNTER:    4,

      /**
       * Color given in RGB(A) or HSV format
       */
      COLOR:      _COLOR,

      /**
       * String of Unicode characters
       */
      STRING:     6,

      /**
       * List of transformations
       */
      FLOAT:      _FLOAT,

      /**
       * List of transformations
       */
      TRANSFORM:  _TRANSFORM
    },

    prefixedProperties: {
      transition: true,
      animation: true
    },

    /**
     * Property name prefixes
     */
    prefixes: {
      camelized: ["Moz", "Ms", "O", "Webkit", ""],
      uncamelized: ["-moz-", "-ms-", "-o-", "-webkit-", ""]
    },

    /**
     * Provides information about the type of a CSS property and its relation
     * to other CSS properties
     *
     * @namespace
     */
    propertyInfo: {
      "float": {
        type: _FLOAT,
        aliases: ["cssFloat", "styleFloat"]
      },
      left: {
        type: _LENGTH,
        correspondsTo: "top"
      },
      top: {
        type: _LENGTH,
        correspondsTo: "left"
      },
      right: {
        type: _LENGTH,
        correspondsTo: "bottom"
      },
      bottom: {
        type: _LENGTH,
        correspondsTo: "right"
      },
      width: {
        type: _LENGTH,
        correspondsTo: "height"
      },
      height: {
        type: _LENGTH,
        correspondsTo: "width"
      },
      color: {
        type: _COLOR
      },

      /* FIXME */
      backgroundColor: {
        type: _COLOR
      },
      "background-color": {
        type: _COLOR
      },

      transform: {
        type: _TRANSFORM
      }
    },

    /**
     * @function
     */
    camelize: (function () {
      if (typeof jsx.map != "undefined" && typeof jsx.map.Map == "function")
      {
        var cache = new jsx.map.Map();
      }
      else
      {
        var prefix = " ", suffix = "";

        cache = _jsx_object.getDataObject();
        cache.get = function (s) {
          return _jsx_object.getProperty(this, prefix + s + suffix, false);
        };

        cache.put = function (s, v) {
          this[prefix + s + suffix] = v;
        };
      }

      function f (match, p1)
      {
        return p1.toUpperCase();
      }

      var rxHyphenated = /-([a-z])/gi;

      /**
       * @param {String} sProperty
       * @return {string}
       *   <var>sProperty</var> with all hyphen-minuses followed by an
       *   ASCII letter replaced by the letter's uppercase counterpart
       */
      return function (sProperty) {
        var p;
        if ((p = cache.get(sProperty, false)))
        {
          return p;
        }

        var s2 = sProperty.replace(rxHyphenated, f);
        cache.put(sProperty, s2);
        return s2;
      };
    })(),

    /**
     * @function
     */
    uncamelize: (function () {
      if (typeof jsx.map != "undefined" && typeof jsx.map.Map == "function")
      {
        var cache = new jsx.map.Map();
      }
      else
      {
        var prefix = " ", suffix = "";

        cache = _jsx_object.getDataObject();
        cache.get = function (s) {
          return _jsx_object.getProperty(this, prefix + s + suffix, false);
        };

        cache.put = function (s, v) {
          this[prefix + s + suffix] = v;
        };
      }

      function f (match)
      {
        return "-" + match.toLowerCase();
      }

      var rxUppercase = /[A-Z]/g;

      /**
       * @param {String} sProperty
       * @return {string}
       *   <var>sProperty</var> with all capital ASCII letters replaced
       *   by the letter's lowercase counterpart, and preceded by a
       *   hyphen-minus.
       */
      return function (sProperty) {
        var p;
        if ((p = cache.get(sProperty, false)))
        {
          return p;
        }

        var s2 = sProperty.replace(rxUppercase, f);
        cache.put(sProperty, s2);
        return s2;
      };
    })(),

    /**
     * Returns the computed style of an {@link Element} or the
     * computed value of an <code>Element</code>'s style property.
     *
     * @function
     */
    getComputedStyle: (function () {
      var _isMethod = _jsx_object.isMethod;
      var _defaultView;

      /**
       * @param {Element} oElement
       *   Element for which the computed style should be retrieved.
       * @param {string} sPseudoEl
       *   The name of the pseudo-element, such as ":first-child".
       *   Use <code>null</code> (default) for the element itself.
       * @param {string} sProperty
       *   The property name in CSS or script syntax (names are mapped
       *   automatically according to the feature used).  If not passed
       *   or empty, the entire computed style is returned.
       * @return {CSSStyleDeclaration|currentStyle|string|null}
       *   The return value depends on both the passed arguments
       *   and the capabilities of the user agent:
       *
       *   If the UA supports either ViewCSS::getComputedStyle()
       *   from W3C DOM Level 2 CSS or MSHTML's currentStyle
       *   property, then
       *     a) if <var>sProperty</var> was passed, the value of the
       *        CSS property with name <var>sProperty</vr> is returned;
       *        it is a string if the property is supported;
       *     b) if <var>cssProperty</var> was not passed, the corresponding
       *        style object is returned
       *
       *   However, MSHTML's currentStyle does not support pseudo-elements.
       *   If you attempt to retrieve pseudo-element's computed style,
       *   <code>null</code> is returned (without error).
       *
       *   If the UA supports neither of the above, <code>null</code>
       *   is returned.
       */
      function _getComputedStyle (oElement, sPseudoEl, sProperty)
      {
        var computedStyle;

        if (_isMethod(document, "defaultView", "getComputedStyle")
          && (typeof _defaultView != "undefined" || (_defaultView = document.defaultView)))
        {
          computedStyle = _defaultView.getComputedStyle(oElement, sPseudoEl || null);
        }
        else
        {
          if (sPseudoEl)
          {
            return null;
          }

          computedStyle = oElement.currentStyle;
        }

        if (typeof computedStyle != "undefined")
        {
          if (!sProperty)
          {
            return computedStyle;
          }

          return jsx.dom.css.getStyleProperty({style: computedStyle}, sProperty);
        }

        return null;
      }

      return _getComputedStyle;
    }())
  };
})();

/**
 * Retrieves the value of a style property of an {@link Element}.
 *
 * @author
 *   (C) 2005, 2013  Thomas Lahn &lt;js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dom/css.js
 */
jsx.dom.css.getStyleProperty = (function () {
  var _isHostMethod = jsx.object.isHostMethod;
  var _camelize = jsx.dom.css.camelize;
  var _uncamelize = jsx.dom.css.uncamelize;

  var _prefixedProperties = jsx.dom.css.prefixedProperties;
  var _prefixes = jsx.dom.css.prefixes;
  var _propertyInfo = jsx.dom.css.propertyInfo;

  /**
   * @param {Element} oElement
   *   Reference to the element object whose style is to be retrieved.
   * @param {String} sPropertyName
   *   Name of the style property whose value is to be retrieved.
   *   Both camelCased and dash-property names are supported.
   *   Mapping to supported prefix properties is done automatically,
   *   i. e. <code>"transition"</code> would cause
   *   <code>"-webkit-transition"</code> to be retrieved if
   *   the former but not <code>"transition"</code> was available.
   *   If the <code>style</code> property is available on the element,
   *   the faster property-accessor approach is attempted first,
   *   then the slower setProperty() call.
   *   Otherwise <code>"visibility"</code> is used instead
   *   (fallback for the NN4 DOM).
   * @return {string|null}
   *   <code>null</code> if no matching object exists or if the
   *   DOM does not provide for retrieval of the property value.
   */
  function _getStyleProperty (oElement, sPropertyName)
  {
    if (oElement)
    {
      /* TODO: Needed for NN4 DOM as well? */
      var camelized_name = _camelize(sPropertyName);

      if (typeof oElement.style != "undefined")
      {
        var style = oElement.style;

        var thisPropertyInfo = _propertyInfo[camelized_name];
        var thisAliases = thisPropertyInfo && thisPropertyInfo.aliases;
        if (thisAliases)
        {
          for (var i = thisAliases.length; i--;)
          {
            var alias = thisAliases[i];
            if (typeof style[alias] != "undefined")
            {
              return style[alias];
            }
          }

          return null;
        }

        if (_prefixedProperties[sPropertyName])
        {
          for (i = _prefixes.camelized.length; i--;)
          {
            var prefix = _prefixes.camelized[i];
            var prefixed_name = (prefix
              ? prefix
                  + camelized_name.charAt(0).toUpperCase()
                  + camelized_name.substring(1)
              : camelized_name);
            if (typeof style[prefixed_name] != "undefined")
            {
              return style[prefixed_name];
            }
          }

          return null;
        }

        if (typeof style[camelized_name] != "undefined")
        {
          return style[camelized_name];
        }

        /* If the quick, backwards-compatible method failed for some reason */
        if (_isHostMethod(style, "getPropertyValue"))
        {
          var uncamelized_name = _uncamelize(sPropertyName);

          /* NOTE: Works because of no dash-properties in _prefixedProperties */
          if (_prefixedProperties[sPropertyName])
          {
            for (i = _prefixes.uncamelized.length; i--;)
            {
              var value = style.getPropertyValue(
                _prefixes.uncamelized[i] + uncamelized_name);
              if (value)
              {
                return value;
              }
            }

            return null;
          }

          return style.getPropertyValue(uncamelized_name);
        }
      }
      else
      {
        if (camelized_name == "display")
        {
          camelized_name = "visibility";
        }

        if (typeof oElement[camelized_name] != "undefined")
        {
          return oElement[camelized_name];
        }
      }
    }

    return null;
  }

  return _getStyleProperty;
}());

/**
 * Determines whether an {@link Element} has a style property.
 *
 * @author
 *   (C) 2006  Thomas Lahn &lt;js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dom/css.js
 * @param {HTMLElement} oElement
 *   Reference to the element object which style property is to be retrieved.
 * @param {string} sPropertyName
 *   Name of the style property which is to be checked.
 *   If "display", and there is no
 *   <code>style[<var>sPropertyName</var>]</code> property,
 *   "visibility" is used instead (fallback for the NN4 DOM).
 * @return {boolean}
 *   <code>false</code> if no matching object exists or if the
 *   DOM does not provide for retrieval of the property value;
 *   <code>true</code> otherwise.
 */
jsx.dom.hasStyleProperty = function (oElement, sPropertyName) {
  return (jsx.dom.css.getStyleProperty(oElement, sPropertyName) != null);
};

/**
 * Sets the value of a style property of an {@link Element}.
 *
 * @function
 * @author
 *   (C) 2003-2013  Thomas Lahn &lt;js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dom/css.js
 */
jsx.dom.css.setStyleProperty = (function () {
  var _isHostMethod = jsx.object.isHostMethod;
  var _camelize = jsx.dom.css.camelize;
  var _uncamelize = jsx.dom.css.uncamelize;

  var _prefixedProperties = jsx.dom.css.prefixedProperties;
  var _prefixes = jsx.dom.css.prefixes;
  var _propertyInfo = jsx.dom.css.propertyInfo;

  /**
   * @param {Element} oElement
   *   Reference to the element object whose style is to be modified.
   * @param {string} sPropertyName
   *   Name of the style property whose value should be set.
   *   Both camelCased and dash-property names are supported.
   *   Mapping to supported prefix properties is done automatically,
   *   i. e. <code>"transition"</code> would cause only
   *   <code>"-webkit-transition"</code> to be set if the former
   *   but not <code>"transition"</code> was available.
   *   If the <code>style</code> property is available on the element,
   *   the faster property-accessor approach is attempted first,
   *   then the slower setProperty() call.
   *   If <code>"display"</code>, and there is no <code>style</code>
   *   property, and <code>altValue</code> was provided, "visibility"
   *   is used instead (fallback for the NN4 DOM).
   * @param propValue
   *   Value of the style property to be set.
   * @param {_} altValue (optional)
   *   Alternative value to be set if the the style property is a
   *   property of the object itself instead of its `style' property.
   *   Fallback for the NN4 DOM.
   * @return {boolean}
   *   <code>false</code> if no such object exists, the
   *   DOM does not provide for setting the property value,
   *   or if the assignment failed (invalid value).
   *   CAVEAT: Some property values are normalized by the DOM API
   *   when read; test before using the return value as a discriminator.
   */
  function _setStyleProperty (oElement, sPropertyName, propValue, altValue)
  {
    if (oElement)
    {
      /* TODO: Needed for NN4 DOM as well? */
      var camelized_name = _camelize(sPropertyName);

      if (typeof oElement.style != "undefined")
      {
        var style = oElement.style;

        var thisPropertyInfo = _propertyInfo[camelized_name];
        var thisAliases = thisPropertyInfo && thisPropertyInfo.aliases;
        if (thisAliases)
        {
          for (var i = thisAliases.length; i--;)
          {
            var alias = thisAliases[i];
            if (typeof style[alias] != "undefined")
            {
              style[alias] = propValue;
              return (String(style[alias]).toLowerCase()
                == String(propValue).toLowerCase());
            }
          }

          return false;
        }

        if (_prefixedProperties[sPropertyName])
        {
          var len;
          for (i = 0, len = _prefixes.camelized.length; i < len; ++i)
          {
            var prefix = _prefixes.camelized[i];
            var prefixed_name = (prefix
              ? prefix
                  + camelized_name.charAt(0).toUpperCase()
                  + camelized_name.substring(1)
              : camelized_name);
            if (typeof style[prefixed_name] != "undefined")
            {
              style[prefixed_name] = propValue;
            }
          }

          return (String(style[prefixed_name]).toLowerCase()
            == String(propValue).toLowerCase());
        }

        if (typeof style[camelized_name] != "undefined")
        {
          style[camelized_name] = propValue;
          return (String(style[camelized_name]).toLowerCase()
            == String(propValue).toLowerCase());
        }

        /* If the quick, backwards-compatible method failed for some reason */
        if (_isHostMethod(style, "setProperty"))
        {
          var uncamelized_name = _uncamelize(sPropertyName);

          /* NOTE: Works because of no dash-properties in _prefixedProperties */
          if (_prefixedProperties[sPropertyName])
          {
            for (i = 0, len = _prefixes.uncamelized.length; i < len; ++i)
            {
              style.setProperty(
                _prefixes.uncamelized[i] + uncamelized_name,
                propValue);
            }

            if (!_isHostMethod(style, "getPropertyValue"))
            {
              return true;
            }

            return (String(style.getPropertyValue(sPropertyName)).toLowerCase()
              == String(propValue).toLowerCase());
          }

          style.setProperty(uncamelized_name, propValue);
          return (String(style.getPropertyValue(uncamelized_name)).toLowerCase()
                  == String(propValue).toLowerCase());
        }
      }
      else
      {
        /* NN4 DOM */
        if (camelized_name == "display" && altValue)
        {
          camelized_name = "visibility";
        }

        if (typeof oElement[camelized_name] != "undefined")
        {
          var newValue = (altValue || propValue);
          oElement[camelized_name] = newValue;
          return (String(oElement[camelized_name]).toLowerCase()
            == String(newValue).toLowerCase());
        }
      }
    }

    return false;
  }

  return _setStyleProperty;
}());

/**
 * Resets a style property to its inherited value
 *
 * @param {Element} oElement
 * @param {String} sPropertyName
 * @return {boolean}
 * @see jsx.dom.css.setStyleProperty()
 */
jsx.dom.css.resetStyleProperty = function (oElement, sPropertyName) {
  return jsx.dom.css.setStyleProperty(oElement, sPropertyName, "");
};

/**
 * Retrieves the rendering state or (dis)allows rendering of a DOM object.
 *
 * @author
 *   (C) 2004-2006  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param {HTMLElement} oElement
 *   Reference to the DOM object to be rendered or not.
 * @param {boolean} bShow
 *   Renders the object referenced by <code>o</code> if
 *   <code>true</code>, does not render it if <code>false</code>.
 *   Note that not to render an element is different from
 *   hiding it, as the space it would take up is then no
 *   longer reserved.
 *
 *   If this argument is omitted, the current property value is returned.
 * @return {boolean}
 *   When retrieving: <code>true</code> if visible, <code>false</code>
 *   otherwise; when setting: <code>true</code> if successful,
 *   <code>false</code> otherwise.
 * @see #visible
 */
jsx.dom.display = function (oElement, bShow) {
  var result;

  if (oElement)
  {
    if (arguments.length > 1)
    {
      result = jsx.dom.css.setStyleProperty(oElement, "display",
        bShow ? ""     : "none",
        bShow ? "show" : "hide");
    }
    else
    {
      result = /^(\s*|show)$/.test(jsx.dom.css.getStyleProperty(oElement, "display"));
    }
  }

  return result;
};

/**
 * Retrieves or sets the visibility of a DOM object.
 *
 * @author
 *   (C) 2004-2006  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param {HTMLElement} oElement
 *   Reference to the DOM object to be either shown or hidden.
 * @param {Boolean} bVisible (optional)
 *   Shows the object referenced by <code>o</code> if <code>true</code>,
 *   hides it if <code>false</code>.  Note that hiding an element is
 *   different from not rendering it, as the space it takes up is still
 *   reserved.
 *
 *   If this argument is omitted, the current property value is returned.
 * @return {boolean}
 *   When retrieving: <code>true</code> if visible, <code>false</code>
 *   otherwise; when setting: <code>true</code> if successful,
 *   <code>false</code> otherwise.
 * @see #display
 */
jsx.dom.visibility = jsx.dom.visible = function (oElement, bVisible) {
  var result;

  if (oElement)
  {
    if (arguments.length > 1)
    {
      result = jsx.dom.css.setStyleProperty(oElement, "visibility",
        bVisible ? "visible" : "hidden",
        bVisible ? "show" : "hide");
    }
    else
    {
      result = /^(visible|show)$/.test(
        jsx.dom.css.getStyleProperty(oElement, "visibility"));
    }
  }

  return result;
};

/**
 * @param {Number|String} imgID
 * @param {Number} state (optional)
 * @return {boolean}
 *   The return value of {@link #setStyleProperty} for setting the
 *   borderColor of the image
 */
jsx.dom.hoverImg = function (imgID, state) {
  var img = null;

  if (document.images)
  {
    img = document.images[imgID];
  }

  var me = arguments.callee;
  return jsx.dom.css.setStyleProperty(img, "borderColor",
    (state == 0 ? me.clMouseout : me.clMouseover));
};
jsx.dom.hoverImg.clMouseout = "#000";
jsx.dom.hoverImg.clMouseover = "#fff";

jsx.dom.getAbsPos = function (oNode) {
  /* TODO: One initialization for all properties? */
  var result = {};
  result.x = result.y = 0;
  result.toString = function () {
    return "{x: " + this.x + ", y: " + this.y + "}";
  };

  if (oNode.offsetParent)
  {
    while (oNode.offsetParent)
    {
      result.x += oNode.offsetLeft;
      result.y += oNode.offsetTop;
      oNode = oNode.offsetParent;
    }
  }
  else if (typeof oNode.x != "undefined"
           && typeof oNode.y != "undefined")
  {
    result.x += oNode.x;
    result.y += oNode.y;
  }

  return result;
};

/**
 * @namespace
 */
jsx.dom.css.selectors = {
  ID: "#{nmchar}+"
    .replace(/\{nmchar\}/, "[_a-z0-9-]|{nonascii}|{escape}")
    .replace(/\{nonascii\}/g, "[\\xA0-\\xFF]")
    .replace(/\{escape\}/g, "{unicode}|\\\\[^\\r\\n\\f0-9a-f]")
    .replace(/\{unicode\}/g, "\\\\{h}{1,6}(\\r\\n|[ \\t\\r\\n\\f])?")
    .replace(/\{h\}/g, "[0-9a-f]"),
  CLASS: "\\.IDENT"
    .replace(/IDENT/, "-?{nmstart}{nmchar}*")
    .replace(/\{nmstart\}/, "[_a-z]|{nonascii}|{escape}")
    .replace(/\{nmchar\}/, "[_a-z0-9-]|{nonascii}|{escape}")
    .replace(/\{nonascii\}/g, "[\\xA0-\\xFF]")
    .replace(/\{escape\}/g, "{unicode}|\\\\[^\\r\\n\\f0-9a-f]")
    .replace(/\{unicode\}/g, "\\\\{h}{1,6}(\\r\\n|[ \\t\\r\\n\\f])?")
    .replace(/\{h\}/g, "[0-9a-f]"),
  ATTRIBUTE: "\\[\\s*(IDENT\\|)?IDENT\\s*((=|INCLUDES|DASHMATCH)\\s*(IDENT|STRING)\\s*)?\\]"
    .replace(/IDENT/g, "-?{nmstart}{nmchar}*")
    .replace(/INCLUDES/, "~=")
    .replace(/DASHMATCH/, "\\|=")
    .replace(/STRING/, "{string1}|{string2}")
    .replace(/\{string1\}/, '"([^\\n\\r\\f\\\\"]|\\\\{nl}|{escape})*"')
    .replace(/\{string2\}/, "'([^\\n\\r\\f\\\\']|\\\\{nl}|{escape})*'")
    .replace(/\{nl\}/g, "(\\n|\\r\n|\\r|\\f)")
    .replace(/\{nmstart\}/g, "[_a-z]|{nonascii}|{escape}")
    .replace(/\{nmchar\}/g, "[_a-z0-9-]|{nonascii}|{escape}")
    .replace(/\{nonascii\}/g, "[\\xA0-\\xFF]")
    .replace(/\{escape\}/g, "{unicode}|\\\\[^\\r\\n\\f0-9a-f]")
    .replace(/\{unicode\}/g, "\\\\{h}{1,6}(\\r\\n|[ \\t\\r\\n\\f])?")
    .replace(/\{h\}/g, "[0-9a-f]"),
  PSEUDOCLASS: ":(link|visited|hover|active|focus|target|lang"
    + "|enabled|disabled|checked|indeterminate"
    + "|root|nth-child|nth-last-child|nth-of-type|nth-last-of-type"
    + "|first-child|last-child|first-of-type|last-of-type"
    + "|only-child|only-of-type|empty|not)\\b",
  ELEMENT: "(^|\\s)((IDENT|\\*)\\|)?IDENT"
    .replace(/IDENT/g, "-?{nmstart}{nmchar}*")
    .replace(/\{nmstart\}/g, "[_a-z]|{nonascii}|{escape}")
    .replace(/\{nmchar\}/g, "[_a-z0-9-]|{nonascii}|{escape}")
    .replace(/\{nonascii\}/g, "[\\xA0-\\xFF]")
    .replace(/\{escape\}/g, "{unicode}|\\\\[^\\r\\n\\f0-9a-f]")
    .replace(/\{escape\}/g, "{unicode}|\\\\[^\\r\\n\\f0-9a-f]")
    .replace(/\{unicode\}/g, "\\\\{h}{1,6}(\\r\\n|[ \\t\\r\\n\\f])?")
    .replace(/\{h\}/g, "[0-9a-f]"),
  PSEUDOELEMENT: "::?(first-line|first-letter|before|after)\\b"
};

/**
 * A <code>RuleList</code> object encapsulates
 * all CSS selectors linked to from a document in a
 * {@link Collection}.
 *
 * @constructor
 * @param {Object} oDocument (optional)
 *   Object reference to override the default
 *   <code>document</code> object reference.
 * @return {jsx.dom.css.RuleList}
 */
jsx.dom.css.RuleList = function (oDocument) {
  arguments.callee._super.call(this);
  this.document = oDocument || document;
  this.get();
};

jsx.dom.css.RuleList.extend(jsx.Collection, {
  /**
   * @type Document
   */
  document: null,

  /**
   * Populates the collection with the selectors
   * of the document.
   *
   * @memberOf jsx.dom.css.RuleList#prototype
   * @param {Object} oDocument (optional)
   *   Object reference to override the default
   *   <code>document</code> object reference.
   * @return {boolean}
   */
  get: function (oDocument) {
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
        var oSheet = oSheets[i];
        if ((oRules = oSheet.cssRules || oSheet.rules))
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
  },

  /**
   * Returns a reference to the first rule
   * with a simple selector.
   *
   * @param {String} sSelector
   *   Simple selector
   * @return {CSSStyleRule|Null}
   */
  findBySimpleSelector: function (sSelector) {
    var i = this.iterator();
    while ((s = i.next()) != null)
    {
      if ((new RegExp("(^|\\s)" + sSelector + "([+>\\s]|$)")).test(s.value.selectorText))
      {
        return s.value;
      }
    }

    return null;
  }
});

jsx.dom.css.findRules = (function () {
  var a = [];
  var _slice = a.slice;
  var _concat = a.concat;

  function toArray (obj)
  {
    return _slice.call(obj || a);
  }

  return function (selector, exactMatch) {
    var prefix = "(^|\\s)";
    if (exactMatch)
    {
      prefix = "^\\s*";
    }

    var rxSelector = new RegExp(
      prefix + selector.replace(/[$.(){}\[\]^]/g, "\\$&") + "\\s*$");

    var hits = toArray(document.styleSheets).map(function (styleSheet) {
      return toArray(styleSheet.cssRules || styleSheet.rules).filter(
        function (rule) {
          return rxSelector.test(rule.selectorText);
        });
      }).filter(function (hit) {
        return hit.length > 0;
      });

    return _concat.apply([], hits);
  };
}());

/**
 * Calculate the specificity of a CSS3 selector
 *
 * @see http://www.w3.org/TR/css3-selectors/#specificity
 */
jsx.dom.css.getSpecificity = (function () {
  var selectors = jsx.dom.css.selectors;
  var rxID = new RegExp(selectors.ID, "g");
  var rxAttr = new RegExp(
    selectors.CLASS + "|" + selectors.ATTRIBUTE + "|" + selectors.PSEUDOCLASS,
    "g");
  var rxElem = new RegExp(
    selectors.ELEMENT + "|" + selectors.PSEUDOELEMENT, "g");

  /**
   * @param {String} selector
   * @return {Number}
   *   The specificity of <var>selector</var> where the value modulo 100
   *   is the number of ID selectors, the value modulo 10 is the number of
   *   class selectors, attributes selectors, and pseudo-classes, and the
   *   value modulo 1 is the number of element names and pseudo-elements
   *   in the selector.
   */
  return function (selector) {
    selector = String(selector || "");
    var idNum = (selector.match(rxID) || []).length;
    var attrNum = (selector.match(rxAttr) || []).length;
    var elemNum = (selector.match(rxElem) || []).length;

    return (idNum * 100) + (attrNum * 10) + elemNum;
  };
}());

/**
 * Retrieves all elements matching all specified CSS class names
 */
jsx.dom.css.getElemByClassName = jsx.dom.css.gEBCN = (function () {
  var _hasOwnProperty = jsx.object._hasOwnProperty;
  var _getElemByTagName = jsx.dom.getElemByTagName;
  var sWhiteSpace = "[ \\t\\f\\u200B\\r\\n]+";
  var rxWhiteSpace = new RegExp(sWhiteSpace);

  /**
   * @param {Array|String} sClassNames
   * @param {Element} contextNode (optional)
   * @return {Array}
   *   An <code>Array</code> of references to objects representing
   *   matching elements
   */
  return function (sClassNames, contextNode) {
    var
      result = [],
      classNames = !Array.isArray(sClassNames)
        ? String(sClassNames || "").split(rxWhiteSpace)
        : sClassNames,
      classNameSet = {};

    if (classNames.length > 0)
    {
      /* Remove duplicates */
      for (var i = classNames.length; i--;)
      {
        classNameSet[classNames[i]] = true;
      }

      classNames = [];
      if (typeof Object.keys == "function")
      {
        classNames = Object.keys(classNameSet);
      }
      else
      {
        for (var className in classNameSet)
        {
          if (_hasOwnProperty(classNameSet, className))
          {
            classNames.push(className);
          }
        }
      }

      var aElements = _getElemByTagName("*", -1, contextNode || document);
    }

    if (aElements)
    {
      /*
       * NOTE: There are many more elements than potential class names, so loop
       * through those only once
       */
      outer: for (var i = 0, len = aElements.length; i < len; ++i)
      {
        var element = aElements[i];
        var elementClassName = element.className;

        for (var j = classNames.length; j--;)
        {
          if (!new RegExp("(^|" + sWhiteSpace + ")" + classNames[j]
                           + "($|" + sWhiteSpace + ")")
               .test(elementClassName))
          {
            continue outer;
          }
        }

        result[result.length] = element;
      }
    }

    return result;
  };
}());

jsx.dom.css.showByClassName = (function () {
  var _getEBCN = jsx.dom.css.getElemByClassName;

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
  return function (sClassName, bShow) {
    var newDisplay = bShow ? "" : "none";
    var ruleList, selector;
    if (typeof jsx.dom.css != "undefined"
        && typeof jsx.dom.css.RuleList == "function"
        && (ruleList = new jsx.dom.css.RuleList())
        && (selector =
              ruleList.findBySimpleSelector("\\." + sClassName)))
    {
      selector.display = newDisplay;
      return (selector.display == newDisplay);
    }

    var es = _getEBCN(sClassName);

    for (var i = es.length; i--; 0)
    {
      var o = es[i];
      if (typeof o.display != "undefined")
      {
        o.display = newDisplay;
      }
    }

    return true;
  };
}());

/**
 * Makes all non-default stylesheet declarations for an element inline
 */
jsx.dom.css.makeInline = (function () {
  var defaultValues = {
    "background-image": "none"
  };

  /**
   * @param {Element} obj
   */
  return function (obj) {
    var computedStyle = jsx.dom.css.getComputedStyle(obj);
    if (!computedStyle)
    {
      return;
    }

    for (var i = 0, len = computedStyle.length; i < len; ++i)
    {
      var propertyName = computedStyle[i];
      var propertyValue = computedStyle.getPropertyValue(propertyName);

      if (propertyValue != defaultValues[propertyName])
      {
        obj.style.setProperty(propertyName, propertyValue);
      }
    }
  };
}());

jsx.dom.css.isHidden = (function () {
  var _getComputedStyle = jsx.dom.css.getComputedStyle;

  return function (o) {
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
  };
}());

jsx.dom.css.focusElement = function (s) {
  var o = document.getElementById(s);
  if (o && jsx.object.isMethod(o, "focus") && !jsx.dom.css.isHidden(o))
  {
    o.focus();
  }
};