/**
 * <title>PointedEars' DOM Library: CSS</title>
 * @version $Id$
 * @requires collection.js
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
  jsx.dom = {};
}

/**
 * @namespace
 */
jsx.dom.css = {
  version: "0.1.$Revision$"
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

jsx.dom.css.SelectorList.extend(Collection, {
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
 * Changes the current document into a monochrome version of itself.
 * 
 * @requires dhtml.js
 */
jsx.dom.css.makeMono = function() {
  var
    sl = new jsx.dom.css.SelectorList(),
    oIt = sl.iterator(),
    s,
    c = new jsx.dom.css.Color(),
    a = ['backgroundColor', 'borderColor', 'borderTopColor',
         'borderRightColor', 'borderBottomColor', 'borderLeftColor',
         'outlineColor', 'color'],
    j, p;
    
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
};

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
  if (o && jsx.object.isMethod(o, "focus") && !isHidden(o))
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
