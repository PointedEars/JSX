/**
 * <title>PointedEars' DOM Library: CSS</title>
 * @version $Id$
 * @requires dom.js, collection.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2005-2011 Thomas Lahn <js@PointedEars.de>
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

/**
 * @namespace
 */
jsx.dom.css = {
  version: "0.1.$Revision$"
};

/**
 * Returns the computed style of an {@link Element} or the
 * computed value of an <code>Element</code>'s style property.
 * 
 * @function
 * @param o : Element
 *   Element for which the computed style should be retrieved.
 * @param sPseudoEl : string
 *   The name of the pseudo-element, such as ":first-child".
 *   Use <code>null</code> (default) for the element itself.
 * @param sProperty : string
 *   The property name in CSS or script syntax (names are mapped
 *   automatically according to the feature used).  If not passed
 *   or empty, the entire computed style is returned.
 * @return CSSStyleDeclaration | currentStyle | string
 */
jsx.dom.getComputedStyle = (function () {
  var
    hasGCS = jsx.object.isMethod(document, "defaultView", "getComputedStyle"),
    propertyMap = {
      "float": hasGCS ? "cssFloat" : "styleFloat"
    },
    jsx_object = jsx.object,
    jsx_dom = jsx.dom;
  
  return function(oElement, sPseudoEl, sProperty) {
    if (hasGCS || typeof oElement.currentStyle != "undefined")
    {
      var compStyle = (hasGCS
        ? document.defaultView.getComputedStyle(oElement, sPseudoEl || null)
        : oElement.currentStyle);
      
      return (sProperty
        ? compStyle[
            jsx_dom.camelize(
              jsx_object.getProperty(propertyMap, sProperty, sProperty))
          ]
        : compStyle);
    }
    
    var emptyResult = {};
    emptyResult[sProperty] = "";
    
    return (sProperty ? emptyResult : null);
  };
}());

/**
 * Retrieves the value of a style property of an HTMLElement object.
 *
 * @author
 *   (C) 2005  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oElement : HTMLElement
 *   Reference to the element object which style is to be modified.
 * @param sPropertyName : String
 *   Name of the style property of which the value should be retrieved.
 *   If "display", and there is no
 *   <code>style[<var>sPropertyName</var>]</code> property,
 *   "visibility" is used instead (fallback for the NN4 DOM).
 * @return string|null
 *   <code>null</code> if no matching object exists or if the
 *   DOM does not provide for retrieval of the property value.
 */
jsx.dom.getStyleProperty = function(oElement, sPropertyName) {
  if (oElement)
  {
    sPropertyName = jsx.dom.camelize(sPropertyName);

    if (typeof oElement.style != "undefined")
    {
      /* handle the `float' property */
      var tested = false;

      if (sPropertyName == "float")
      {
        /* W3C DOM Level 2 CSS */
        if (typeof oElement.style.cssFloat != "undefined")
        {
          sPropertyName = "cssFloat";
          tested = true;
        }

        /* MSHTML DOM */
        else if (typeof oElement.style.styleFloat != "undefined")
        {
          sPropertyName = "styleFloat";
          tested = true;
        }
      }

      if (tested || typeof oElement.style[sPropertyName] != "undefined")
      {
        return oElement.style[sPropertyName];
      }
    }
    else
    {
      if (sPropertyName == "display")
      {
        sPropertyName = "visibility";
      }

      if (typeof oElement[sPropertyName] != "undefined")
      {
        return oElement[sPropertyName];
      }
    }
  }

  return null;
};

/**
 * Determines whether an HTMLElement object has a style property or not.
 *
 * @author
 *   (C) 2006  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oElement : HTMLElement
 *   Reference to the element object which style property is to be retrieved.
 * @param sPropertyName : string
 *   Name of the style property which is to be checked.
 *   If "display", and there is no
 *   <code>style[<var>sPropertyName</var>]</code> property,
 *   "visibility" is used instead (fallback for the NN4 DOM).
 * @return boolean
 *   <code>false</code> if no matching object exists or if the
 *   DOM does not provide for retrieval of the property value;
 *   <code>true</code> otherwise.
 */
jsx.dom.hasStyleProperty = function(oElement, sPropertyName) {
  return (jsx.dom.getStyleProperty(oElement, sPropertyName) != null);
};

/**
 * Sets the value of a style property of an HTMLElement object.
 *
 * @author
 *   (C) 2003-2008  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oElement : HTMLElement
 *   Reference to the element object which style is to be modified.
 * @param sPropertyName : string
 *   Name of the style property of which the value should be set.
 *   If "display" and there is no <code>style[<var>sPropertyName</var>]</code>
 *   property and <code>altValue</code> was provided, "visibility" is used
 *   instead (fallback for the NN4 DOM).
 * @param propValue
 *   Value of the style property to be set.
 * @param altValue : optional _
 *   Alternative value to be set if the the style property is a property of
 *   the object itself instead of its `style' property.  Fallback for the
 *   NN4 DOM.
 * @return boolean
 *   <code>false</code> if no such object exists, the
 *   DOM does not provide for setting the property value,
 *   or if the assignment failed (invalid value).
 *   CAVEAT: Some property values are normalized by the API when read;
 *   test before using the return value as a discriminator.
 */
jsx.dom.setStyleProperty = function(oElement, sPropertyName, propValue, altValue) {
  if (oElement)
  {
    sPropertyName = jsx.dom.camelize(sPropertyName);

    if (typeof oElement.style != "undefined")
    {
      /* handle the `float' property */
      var isStyleFloat = false;

      if (sPropertyName == "float")
      {
        /* W3C DOM Level 2 CSS */
        if (typeof oElement.style.cssFloat != "undefined")
        {
          sPropertyName = "cssFloat";
          isStyleFloat = true;
        }

        /* MSHTML DOM */
        else if (typeof oElement.style.styleFloat != "undefined")
        {
          sPropertyName = "styleFloat";
          isStyleFloat = true;
        }
      }

      if (isStyleFloat || typeof oElement.style[sPropertyName] != "undefined")
      {
        /*
         * NOTE: Shortcut evaluation changed behavior;
         * result of assignment is *right-hand side* operand
         */
        oElement.style[sPropertyName] = propValue;
        return (String(oElement.style[sPropertyName]).toLowerCase()
                == String(propValue).toLowerCase());
      }
    }
    else
    {
      if (sPropertyName == "display" && altValue)
      {
        sPropertyName = "visibility";
      }

      if (typeof oElement[sPropertyName] != "undefined")
      {
        var newValue = (altValue || propValue);
        oElement[sPropertyName] = newValue;
        return (String(oElement[sPropertyName]).toLowerCase()
          == String(newValue).toLowerCase());
      }
    }
  }

  return false;
};

/**
 * Retrieves the rendering state or (dis)allows rendering of a DOM object.
 *
 * @author
 *   (C) 2004-2006  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oElement : HTMLElement
 *   Reference to the DOM object to be rendered or not.
 * @param bShow : boolean
 *   Renders the object referenced by <code>o</code> if
 *   <code>true</code>, does not render it if <code>false</code>.
 *   Note that not to render an element is different from
 *   hiding it, as the space it would take up is then no
 *   longer reserved.
 *
 *   If this argument is omitted, the current property value is returned.
 * @return boolean
 *   When retrieving: <code>true</code> if visible, <code>false</code>
 *   otherwise; when setting: <code>true</code> if successful,
 *   <code>false</code> otherwise.
 * @see #visible
 */
jsx.dom.display = function(oElement, bShow) {
  var result;

  if (oElement)
  {
    if (arguments.length > 1)
    {
      result = jsx.dom.setStyleProperty(oElement, "display",
        bShow ? ""     : "none",
        bShow ? "show" : "hide");
    }
    else
    {
      result = /^(\s*|show)$/.test(jsx.dom.getStyleProperty(oElement, "display"));
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
 * @param oElement : HTMLElement
 *   Reference to the DOM object to be either shown or hidden.
 * @param bVisible : optional Boolean
 *   Shows the object referenced by <code>o</code> if <code>true</code>,
 *   hides it if <code>false</code>.  Note that hiding an element is
 *   different from not rendering it, as the space it takes up is still
 *   reserved.
 *
 *   If this argument is omitted, the current property value is returned.
 * @return boolean
 *   When retrieving: <code>true</code> if visible, <code>false</code>
 *   otherwise; when setting: <code>true</code> if successful,
 *   <code>false</code> otherwise.
 * @see #display
 */
jsx.dom.visibility = jsx.dom.visible = function(oElement, bVisible) {
  var result;

  if (oElement)
  {
    if (arguments.length > 1)
    {
      result = jsx.dom.setStyleProperty(oElement, "visibility",
        bVisible ? "visible" : "hidden",
        bVisible ? "show" : "hide");
    }
    else
    {
      result = /^(visible|show)$/.test(
        jsx.dom.getStyleProperty(oElement, "visibility"));
    }
  }

  return result;
};

/**
 * @param imgID : Number|String
 * @param state : optional Number
 * @return boolean
 *   The return value of {@link #setStyleProperty} for setting the
 *   borderColor of the image
 */
jsx.dom.hoverImg = function(imgID, state) {
  var img = null;

  if (document.images)
  {
    img = document.images[imgID];
  }

  return jsx.dom.setStyleProperty(img, "borderColor",
    (state == 0 ? hoverImg.clMouseout : hoverImg.clMouseover));
};
jsx.dom.hoverImg.clMouseout = "#000";
jsx.dom.hoverImg.clMouseover = "#fff";

jsx.dom.getAbsPos = function(oNode) {
  var result = {};
  result.x = result.y = 0;
  result.toString = function() {
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
 * A <code>SelectorList</code> object encapsulates
 * all CSS selectors linked to from a document in a
 * {@link Collection}.
 *
 * @constructor
 * @param oDocument : optional Object
 *   Object reference to override the default
 *   <code>document</code> object reference.
 * @return jsx.dom.css.SelectorList
 */
jsx.dom.css.SelectorList = function(oDocument) {
  this._super();
  this.document = oDocument || document;
  this.get();
};

jsx.dom.css.SelectorList.extend(jsx.Collection, {
  /**
   * @type Document
   */
  document: null,
  
  /**
   * Populates the collection with the selectors
   * of the document.
   *
   * @param oDocument : optional Object
   *   Object reference to override the default
   *   <code>document</code> object reference.
   * @return undefined
   */
  get: function(oDocument) {
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
  },
  
  /**
   * Returns a reference to the selector
   * containing a simple selector.
   *
   * @param sSelector : String
   *   Simple selector
   * @return CSSStyleRule | Null
   */
  findSimpleSelector: function(sSelector) {
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
  //    .replace(/\{Term\}/g,              "([+-]?"
  //                                     + "(NUMBER%?\\s*|LENGTH\\s*"
  //                                     + "|ANGLE\\s*|TIME\\s*"
  //                                     + "|FREQ\\s*|IDENT\\(\\s*expr\\)\\s*)"
  //                                     + "|STRING\\s*|IDENT\\s*|URI\\s*|hexcolor)")
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
  }
});

this.getElemByClassName = this.gEBCN = (function() {
  /**
   * Retrieves all elements matching certain CSS class names
   * 
   * @param sClassName
   * @return Array
   *   An <code>Array</code> of references to objects representing
   *   matching elements
   */
  return function(sClassName) {
    var
      aElements = this.getElemByTagName(),
      result = new Array();

    if (aElements)
    {
      var sWhiteSpace = "[ \\t\\f\\u200B\\r\\n]+";
      
      /*
       * NOTE: There are many more elements than potential class names, so loop
       * through those only once
       */
      for (var i = 0, len = aElements.length; i < len; ++i)
      {
        var element = aElements[i];
        
        if (new RegExp("(^|" + sWhiteSpace + ")" + sClassName + "($|" + sWhiteSpace + ")")
            .test(element.className))
        {
          result[result.length] = element;
        }
      }
    }

    return result;
  };
}());

jsx.dom.css.showByClassName = (function() {
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
  return function(sClassName, bShow) {
    var newDisplay = bShow ? "" : "none";
    var selectorList, selector;
    if (typeof jsx.dom.css != "undefined"
        && typeof jsx.dom.css.SelectorList == "function"
        && (selectorList = new jsx.dom.css.SelectorList())
        && (selector =
              selectorList.findSimpleSelector("\\." + sClassName)))
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
 * Returns the computed style of an element or
 * the computed value of a style property of an element.
 * 
 * @param o : HTMLElement
 * @param p : string
 * @return CSSStyleDeclaration|string
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
jsx.dom.css.getComputedStyle = function(o, p) {
  var isMethod = jsx.object.isMethod;
  
  var s;
  if (isMethod(document, "defaultView", "getComputedStyle")
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
};

jsx.dom.css.isHidden = (function() {
  var getComputedStyle = jsx.dom.css.getComputedStyle;
  
  return function(o) {
    while (o)
    {
      if (typeof o.style == "undefined"
          || typeof o.style.visibility != "undefined"
          && /hidden/i.test(o.style.visibility)
          || /hidden/i.test(getComputedStyle(o, "visibility")))
      {
        return true;
      }
  
      o = o.parentNode;
    }
  
    return false;
  };
}());

jsx.dom.css.focusElement = function(s) {
  var o = document.getElementById(s);
  if (o && jsx.object.isMethod(o, "focus") && !jsx.dom.css.isHidden(o))
  {
    o.focus();
  }
};


/**
 * Removes all occurences of a CSS class name from the
 * <code>class</code> attribute of an {@link Element}.
 * 
 * @param o : Element
 * @param sClassName : string
 */
jsx.dom.css.removeClassName = function (o, sClassName) {
  var curClassNames = o.className;
  var newClassNames = curClassNames.replace(
    new RegExp("(^\\s*|\\s+)" + sClassName + "(\\s*$|(\\s))", "g"),
    "$3");
  o.className = newClassNames;

  if (!newClassNames && jsx.object.isMethod(o, "removeAttribute"))
  {
    o.removeAttribute("class");
  }
};


jsx.dom.css.addClassName = (function() {
  var removeClassName = jsx.dom.css.removeClassName;
  
  /**
   * Adds a CSS class name to the <code>class</code> attribute of
   * an {@link Element}.
   * 
   * @param o : Element
   * @param sClassName : string
   * @param bRemove : boolean
   *   If the class name is already there, and this argument is
   *   <code>true</code>, all instances of it are removed first.
   *   If the class is there and this argument is <code>false</code>,
   *   exit without changing anything.  The default is <code>false</code>,
   *   which is more efficient.
   * @return boolean
   *   <code>true</code> if the class name could be added successfully or
   *   was already there, <code>false</code> otherwise.
   */
  return function(o, sClassName, bRemove) {
    var rx = new RegExp("(^\\s*|\\s+)" + sClassName + "(\\s*$|\\s)");
    
    if (bRemove)
    {
      removeClassName(o, sClassName);
    }
    else if (rx.test(o.className))
    {
      return true;
    }
    
    if (sClassName)
    {
      if (/\S/.test(o.className))
      {
        o.className += " " + sClassName;
      }
      else
      {
        o.className = sClassName;
      }
      
      return rx.test(o.className);
    }
  };
}());
