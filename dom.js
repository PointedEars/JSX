/**
 * <title>PointedEars' DOM Library</title>
 * @partof
 *   PointedEars JavaScript Extensions (JSX)
 * @requires types.js
 * @recommends xpath.js
 * @source Based upon
 *   @link{
 *     selfhtml#dhtml/beispiele/dhtml_bibliothek.htm,
 *     dhtml.js from SELFHTML (8.0)
 *   }
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2001      SELFHTML e.V. <stefan.muenz@selfhtml.org> et al.,
 *       2002-2010 Thomas Lahn <js@PointedEars.de>,
 *       2004      Ulrich Kritzner <droeppez@web.de> (loadScript),
 *       2005      MozillaZine Knowledge Base contributors (DOM XPath):
 *                 Eric H. Jung <grimholtz@yahoo.com> et al.
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
 *
 * @section Enhancements
 *
 * - New features:
 *   + getElem("tagname", "$TAGNAME") : HTML(Options)Collection
 *   + setAttr(...)
 *   + radioChkdVal(...)
 *   + removeOptions(...)
 *   + addOption(...)
 *   + selectRadioBtn(...)
 *   + disableElementGroup(...)
 *
 * - Pretty printing and detailed documentation
 * - Removed unnecessary variables and DHTML_init() function
 * - Use references and initialization wherever possible
 * - Introducing @link{#DHTML()} prototype and @link{#dhtml}
 *   instance, using boolean properties instead of numeric
 *   global variables.
 *   Note: This enhancement makes this library incompatible to
 *   the source code it is based upon and to previous versions
 *   of this library (if you used the global variables that
 *   were defined herein, otherwise _not_.)
 *
 * - Argument renaming and checking
 * - if...else if...else --> switch...case...default
 * - Calling exception function on invalid arguments
 * - Do not try to access undefined properties (prevents
 *   warnings), use the "typeof" operator instead
 *
 * @section Bugfixes
 *
 * - When the result is an object, return `null' instead of
 *   `void (0)'.  Otherwise return a null-string (`""') or
 *   true/false on success/failure, so that each function
 *   has a defined return value.
 */
/*
 * Refer the repository changelog at http://PointedEars.de/websvn/
 * for changes to the last version.
 *
 * This document contains JavaScriptDoc.
 * See http://pointedears.de/scripts/JSdoc/ for details.
 */

/**
 * @deprecated
 */
function DHTML()
{
  this.allowExceptionMsg = true;
}

/* a more compatible approach */
if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

jsx.dom = {
  version:   "$Id: ",
  //var dhtmlDocURL = dhtmlPath + "dhtml.htm";
  copyright: "Copyright \xA9 2002-2011",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://pointedears.de/scripts/"
};
jsx.dom.URI = jsx.dom.path + "dom.js";
//this.docURI    = this.path + "dhtml.htm";

if (typeof document != "undefined")
{
  jsx.dom.hasDocumentAll = false;

  jsx.dom.getElementById = jsx.dom.getElemById = jsx.dom.getEBI = jsx.dom.gEBI = (
    function() {
      if (typeof document == "undefined")
      {
        return function() {
          return null;
        };
      }
      
      var jsx_object = jsx.object;
      
      if (jsx_object.isMethod(document, "getElementById"))
      {
        /**
         * @param sId : String
         * @return any
         *   Reference to an {@link Element} object representing
         *   the element with the given ID, <code>null</code> or
         *   <code>undefined</code> if there is no such element.
         *   The return value varies among DOM implementations
         *   if there is more than one matching element (invalid markup).
         */
        return function(sId) {
          /* wrapper method required to avoid "invalid op. on prototype" exception */
          return document.getElementById(sId);
        };
      }
      else if ((jsx.dom.hasDocumentAll = jsx_object.isMethod(document, "all")))
      {
        return function(sId) {
          return document.all(sId);
        };
      }
      else
      {
        return function(sId) {
          return document[sId];
        };
      }
    }
  )();

  jsx.dom.hasDocumentLayers = false;

  jsx.dom.getElemByName = jsx.dom.gEBN = (function() {
    function dummy()
    {
      return null;
    }
    
    if (typeof document == "undefined")
    {
      return dummy;
    }
    
    if (jsx.object.isMethod(document, "getElementsByName"))
    {
      /* W3C DOM Level 2 HTML */
      /**
       * @param sName : String
       * @param index : optional Number
       * @return Element|Layer|null|undefined
       */
      return function(sName, index) {
        var result = document.getElementsByName(sName);
        if (result && !isNaN(index) && index > -1)
        {
          result = result[index];
        }
        return result;
      };
    }
    else if (jsx.dom.hasDocumentAll)
    {
      /* IE4 DOM */
      return function(sName, index) {
        var result = document.all(sName);
        if (result && !isNaN(index) && index > -1)
        {
          result = result[index];
        }
        return result;
      };
    }
    else if ((jsx.dom.hasDocumentLayers = (typeof document.layers == "object")))
    {
      /* NN4 DOM */
      return function(sName, index) {
        var result = document.layers[sName];
        if (result && !isNaN(index) && index > -1)
        {
          result = result[index];
        }
        return result;
      };
    }
    
    return dummy;
  }());

  jsx.dom.hasGetElementsByTagName = false;

  jsx.dom.getElemByTagName = jsx.dom.gEBTN = (function() {
    var jsx_object = jsx.object;
    
    if (jsx_object.isMethod(jsx, "xpath", "evaluate"))
    {
      /* W3C DOM Level 3 XPath */
      /**
       * @param sTagName : String
       * @param index : optional Number
       * @param oContextNode : optional Element
       * @return Array|Element
       *   An <code>Array</code> of references to objects representing
       *   matching elements, or one reference to such an object if
       *   <var>index</var> was provided.
       */
      return function(sTagName, index, oContextNode) {
        if (!sTagName)
        {
          sTagName = '*';
        }
        
        if (arguments.length > 2 && typeof index != "number")
        {
          var tmp = oContextNode;
          oContextNode = index;
          index = tmp;
        }

        var result = jsx.xpath.evaluate('.//' + sTagName, oContextNode || null,
          null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
        
        if (result)
        {
          if (!isNaN(index) && index > -1)
          {
            result = result[index];
          }
        }

        return result;
      };
    }
    else if ((jsx.dom.hasGetElementsByTagName =
                typeof document != "undefined"
                && jsx_object.isMethod(document, "getElementsByTagName")))
    {
      /* W3C DOM Level 2 Core */
      /**
       * @param sTagName : String
       * @param index : optional Number
       * @param oContextNode : optional Element
       * @return NodeList|Element|null
       *   An <code>NodeList</code> of references to objects representing
       *   matching elements, or one reference to such an object if
       *   <var>index</var> was provided; <code>null</code> if there
       *   is no matching element.
       */
      return function(sTagName, index, oContextNode) {
        if (!sTagName)
        {
          sTagName = '*';
        }
        
        if (arguments.length > 2 && typeof index != "number")
        {
          var tmp = oContextNode;
          oContextNode = index;
          index = tmp;
        }

        if (!oContextNode)
        {
          oContextNode = document;
        }
        
        if (!jsx.object.isMethod(oContextNode, "getElementsByTagName"))
        {
          return null;
        }
        
        var result = oContextNode.getElementsByTagName(sTagName);
        if (result && !isNaN(index) && index > -1)
        {
          result = result[index];
        }
        
        return result;
      };
    }
    else if (jsx.dom.hasDocumentAll && isMethod(document.all, "tags"))
    {
      /**
       * @param sTagName : String
       * @param index : optional Number
       * @param oContextNode : optional Element
       * @return NodeList|Element|undefined
       *   An <code>NodeList</code> of references to objects representing
       *   matching elements, or one reference to such an object if
       *   <var>index</var> was provided; <code>null</code>
       *   if there is no matching element.
       */
      return function(sTagName, index, oContextNode) {
        if (arguments.length > 2 && typeof index != "number")
        {
          var tmp = oContextNode;
          oContextNode = index;
          index = tmp;
        }
        
        if (!oContextNode)
        {
          oContextNode = document;
        }
        
        if (!jsx.object.isMethod(oContextNode, "all", "tags"))
        {
          return null;
        }
        
        var result = oContextNode.all.tags(sTagName);
        if (result && !isNaN(index) && index > -1)
        {
          result = result[index];
        }
        
        return result;
      };
    }
    else
    {
      return function() {
        return null;
      };
    }
  }());

  jsx.dom.getElemByIndex = jsx.dom.gEBIdx = (function() {
    function dummy()
    {
      return null;
    }
    
    if (typeof document == "undefined")
    {
      return dummy;
    }
    
    if (jsx.dom.hasGetElementsByTagName)
    {
      /**
       * @param index : Number
       * @return Element|null|undefined
       */
      return function(index) {
        return (result = document.getElementsByTagName('*')[index]);
      };
    }
    else if (jsx.dom.hasDocumentAll)
    {
      /**
       * @param index : Number
       * @return Element|null|undefined
       */
      return function(index) {
        return document.all(index);
      };
    }
    else if (jsx.dom.hasDocumentLayers)
    {
      /**
       * @param index : Number
       * @return Layer|null|undefined
       */
      return function(index) {
        return document.layers[index];
      };
    }

    return dummy;
  }());
}

/*
 * Apart from isNS4DOM, none of these object-inference properties is used
 * anymore; they are still here for backwards compatibility only
 */
//this.isW3CDOM = jsx.object.isMethod(document, "getElementById");
//this.isOpera  = typeof window.opera != "undefined";
jsx.dom.isNS4DOM = typeof document.layers != "undefined";
//this.isIE4DOM  = typeof document.all == "object" && !this.isOpera;
//this.supported = this.isW3CDOM || this.isNS4DOM || this.isOpera
//  || this.isIE4DOM;

/* DOM preselection (why?) */
//this.W3CDOM = 3;
//this.IE4DOM = 2;
//this.NS4DOM = 1;
//this.DOM = this.supported
//  && (this.isW3CDOM && this.W3CDOM)
//  || (this.isIE4DOM && this.IE4DOM)
//  || (this.isNS4DOM && this.NS4DOM);

/* allows for de.pointedears.jsx.dom */
if (typeof de == "undefined")
{
  /**
   * @namespace
   */
  var de = {};
}

if (typeof de.pointedears == "undefined")
{
  /**
   *  @namespace
   */
  de.pointedears = {};
}

if (typeof de.pointedears.jsx == "undefined")
{
  /**
   * @namespace
   */
  de.pointedears.jsx = jsx;
}

/**
 * Shows an exception alert and allows for
 * displaying a stack trace.
 *
 * @param sMessage : optional string = ""
 *   Error message to be displayed.
 * @return boolean
 *   Always <code>false</code>
 */
jsx.dom.DHTMLException = function(sMessage) {
  /* Prevent exceptions from "bubbling" on (keyboard) event */
  if (!jsx.dom.allowExceptionMsg)
  {
    return false;
  }
  
  jsx.dom.allowExceptionMsg = false;

  jsx.setErrorHandler();
  var stackTrace =
    jsx.object.isMethod(_global, "Error") && (new Error()).stack || "";
  
  jsx.clearErrorHandler();

  alert(
    "dhtml.js "
      + jsx.dom.version + "\n"
      + jsx.dom.copyright + "  "
      + jsx.dom.author + " <" + jsx.dom.email + ">\n"
      + 'The latest version can be obtained from:\n'
      + "<" + jsx.dom.URI + ">\n\n"
      + sMessage + "\n"
      + "__________________________________________________________\n"
      + "Stack trace"
      + (stackTrace
          ? ":\n\n" + stackTrace
          : " not available in this DOM."));

  jsx.dom.allowExceptionMsg = true;
  return false;
};

jsx.dom.write = function(s) {
  var result = false;
  
  result = jsx.tryThis(
    function() {
      document.write(s);
            
      return true;
    },
    function() {
      return jsx.tryThis(
        function() {
          var result2 = false;
          var ns = document.documentElement.getAttribute("xmlns");
          var scripts;
          if (ns)
          {
            scripts = document.getElementsByTagNameNS(ns, "script");
          }
          else
          {
            scripts = document.getElementsByTagName("script");
          }
          
          if (scripts && scripts.length > 0)
          {
            var lastScript = scripts[scripts.length - 1];
            result2 = !!lastScript.parentNode.insertBefore(
              document.createTextNode(s), lastScript.nextSibling);
          }
          
          return result2;
        });
    });

  /* fix circular reference */
  s = null;

  return result;
};

/**
 * Retrieves an HTMLElement object or a collection of such
 * objects that match certain criteria.
 *
 * @author
 *   (C) 2003, 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param sType : string
 *   Defines the type of <code>sValue</code>. Valid values are
 *   "id", "name", "tagname", "index" and "classname". The
 *   argument is case-insensitive.
 * @param sValue : optional string
 *   Case-sensitive ID, name or tag name of object (collection).
 * @param index : optional number
 *   Optional. Numeric index of an element of the selected
 *   collection. For IDs must be unique throughout a document,
 *   this argument is ignored if <code>sType</code> is "id".
 * @type object
 * @return HTMLElement|HTMLNodeList
 *   A reference to an object if <code>sType</code> is "id", or
 *   if it is "name" or "tagname" and <code>index</code> is
 *   specified; otherwise a collection of objects matching the
 *   specified criteria; <code>null</code> if no matching object
 *   exists.
 */
jsx.dom.getElem = function(sType, sValue, index) {
  /**
   * Calls DHTMLException() for an invalid type.
   */
  function invalidType()
  {
    jsx.dom.DHTMLException(
        'getElem: Invalid type "' + sType + '"\n'
      + 'Must be one of "id", "name", "tagname", "index" or "classname"'
      + ' (case-insensitive).');
  }

  if (!sType || typeof sType != "string" || !sType.toLowerCase)
  {
    jsx.dom.DHTMLException(
        "getElem: Invalid type: " + sType + "\n"
      + "Must be String.");
  }

  if (!sValue || typeof sValue != "string")
  {
    jsx.dom.DHTMLException(
        "getElem: Invalid value: " + sValue + "\n"
      + "Must be String.");
  }

  var o = null;

  switch ((sType = sType.toLowerCase()))
  {
    case 'id':
    case 'index':
    case 'classname':
      o = jsx.dom["getElemBy" + {
        id:        "Id",
        index:     "Index",
        classname: "ClassName"
      }[sType]](sValue);
      break;

    case 'name':
    case 'tagname':
      o = jsx.dom["getElemBy" + {
        name:    "Name",
        tagname: "TagName"
      }[sType]](sValue, index);
      break;

    default:
      invalidType();
  }

  return o;
};

/**
 * Retrieves the content of an HTMLElement object.
 *
 * @author
 *   (C) 2003-2005, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oElement : HTMLElement
 *   Element which content is to be retrieved.
 * @param bHTML : optional boolean
 *   If <code>true</code>, returns the HTML content instead of
 *   the text content in case the latter cannot be retrieved.
 * @return string
 *  A string with the content of the element; a null-string if
 *  no such element object exists or if the DOM does not provide
 *  retrieval of the element's content.
 */
jsx.dom.getCont = function(oElement, bHTML) {
  var sResult = "";

  if (oElement)
  {
    /* W3C DOM Level 2 Core */
    if (typeof oElement.firstChild != "undefined")
    {
      if (typeof oElement.firstChild.nodeType != "undefined"
          && oElement.firstChild.nodeType ==
            /* W3C-DOM 2 o.firstChild.TEXT_NODE constant is N/A in IE and O7 */
            ((typeof oElement.firstChild.TEXT_NODE != "undefined"
              && oElement.firstChild.TEXT_NODE)
             || 3))
      {
        sResult = oElement.firstChild.nodeValue;
      }
    }
    else
    {
      if (typeof oElement.innerText != "undefined")
      {
        sResult = oElement.innerText;
      }

      if ((bHTML || typeof oElement.innerText == "undefined")
          && typeof oElement.innerHTML != "undefined")
      {
        sResult = oElement.innerHTML;
      }
    }
  }

  return sResult;
};

/**
 * Specifies the content of an HTMLElement object.
 *
 * @author
 *   (C) 2003-2005, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oElement : HTMLElement
 *   Element which content is to be changed.
 * @param sNodeValue : string
 *   New content of the element.
 * @return boolean
 *   <code>true</code> if successful, <code>false</code>
 *   otherwise.
 */
jsx.dom.setCont = function(oElement, sNodeValue) {
  if (oElement)
  {
    /* DOM Level 2 Core */
    if (typeof oElement.firstChild != "undefined")
    {
      oElement.firstChild.nodeValue = sNodeValue;
      return true;
    }
    else if (typeof oElement.nodeValue != "undefined")
    {
      oElement.nodeValue = sNodeValue;
      return true;
    }

    /* IE4 DOM */
    else if (typeof oElement.innerText != "undefined")
    {
      oElement.innerText = sNodeValue;
      return true;
    }

    /* NS4 DOM */
    else if (jsx.dom.isNS4DOM
             && oElement.document
             && oElement.document.open
             && oElement.document.write
             && oElement.document.close)
    {
      oElement.document.open();
      oElement.document.write(sNodeValue);
      oElement.document.close();
      return true;
    }
  }

  return false;
};

/**
 * Returns the text content of a document node.
 *
 * @author
 *   (C) 2005 Thomas Lahn <dhtml.js@PointedEars.de>
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oNode : Node
 *   Reference to the document node.
 * @param bGetHTML : optional boolean
 *   If <code>true</code>, returns the HTML content instead of
 *   the text content in case the latter cannot be retrieved.
 * @return string
 *   The text content of @{(oNode)}.
 * @todo Duplicate of getCont(..., false)?
 */
jsx.dom.getContent = function(oNode, bGetHTML) {
  var text = "";

  if (oNode)
  {
    /* W3C DOM Level 3 */
    if (typeof oNode.textContent != "undefined")
    {
      text = oNode.textContent;
    }

    /* W3C DOM Level 2 */
    else if (oNode.childNodes && oNode.childNodes.length)
    {
      for (var i = oNode.childNodes.length; i--;)
      {
        var o = oNode.childNodes[i];
        if (o.nodeType == ((typeof Node != "undefined" && Node.TEXT_NODE)
                           || 3))
        {
          text = o.nodeValue + text;
        }
        else
        {
          text = arguments.callee(o) + text;
        }
      }
    }

    /* proprietary: IE4+ */
    else if (typeof oNode.innerText != "undefined")
    {
      text = oNode.innerText;
    }
  }

  return text;
};

/**
 * Sets the text content of a document node.
 *
 * @author
 *   (C) 2005 Thomas Lahn <dhtml.js@PointedEars.de>
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oNode : Node
 *   Reference to the document node.
 * @param sContent : string
 * @return boolean
 *   <code>true</code> if successful, <code<false</code> otherwise.
 */
jsx.dom.setTextContent = function(oNode, sContent) {
  var result = false;

  if (oNode)
  {
    /* W3C DOM Level 3 */
    if (typeof oNode.textContent != "undefined")
    {
      oNode.textContent = sContent;
      result = (oNode.textContent == sContent);
    }

    /* W3C DOM Level 2 */
    else if (oNode.removeChild && oNode.firstChild)
    {
      while (oNode.firstChild)
      {
        oNode.removeChild(oNode.firstChild);
      }

      result = !!oNode.appendChild(document.createTextNode(sContent));
    }

    /* proprietary: IE4+ */
    else if (typeof oNode.innerText != "undefined")
    {
      oNode.innerText = sContent;
      result = (oNode.innerText == sContent);
    }
  }
  return result;
};

/**
 * Retrieves the value of an attribute of an HTMLElement object
 * that matches certain criteria.
 *
 * @author
 *   (C) 2003, 2008, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @param oElement : HTMLElement
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param sAttrName : string
 *   Name of the attribute from which the value
 *   should be retrieved.
 * @return any
 *   The value of the object if <code>sType</code> is "id",
 *   or if it is "name" or "tagname" and <code>index</code>
 *   is specified;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
jsx.dom.getAttr = function(oElement, sAttrName) {
  var result = "";

  if (oElement)
  {
    if (jsx.object.isMethod(oElement, "getAttribute"))
    {
      result = oElement.getAttribute(sAttrName);
    }
    else if (jsx.dom.isNS4DOM)
    {
      result = oElement[sAttrName];
    }
  }

  return result;
};

/**
 * @function
 */
jsx.dom.camelize = (function() {
  var jsx_object = jsx.object;
  
  if ("x".replace(/x/, function() { return "u"; }) != "u")
  {
    /*
     * Fix String.prototype.replace(..., Function) for Safari <= 2.0.2;
     * thanks to kangax <kangax@gmail.com>
     */
    var origReplace = String.prototype.replace;
    String.prototype.replace = function(searchValue, replaceValue) {
      if (jsx_object.isMethod(replaceValue))
      {
        if (searchValue.constructor == RegExp)
        {
          var
            result = this,
            m,
            i = searchValue.global ? -1 : 1;
              
          while (i-- && (m = searchValue.exec(result)))
          {
            result = result.replace(m[0],
              String(replaceValue.apply(null, m.concat(m.index, this))));
          }
          
          return result;
        }

        i = this.indexOf(searchValue);
        if (i > -1)
        {
          return replaceValue(String(searchValue), i, this);
        }
        
        return this;
      }

      return origReplace.apply(this, arguments);
    };
  }
  
  if (typeof Map == "function")
  {
    var cache = new Map();
  }
  else
  {
    var prefix = " ", suffix = "";
    
    cache = {};
    cache.get = function(s) {
      return jsx_object.getProperty(this, prefix + s + suffix, false);
    };
    
    cache.put = function(s, v) {
      this[prefix + s + suffix] = v;
    };
  }
  
  function f(match, p1)
  {
    return p1.toUpperCase();
  }
  
  /**
   * @param sProperty : String
   * @return string
   *   <var>sProperty</var> with all hyphen-minuses followed by a
   *   Latin-1 letter replaced by the letter's uppercase counterpart
   */
  return function(sProperty) {
    var p;
    if ((p = cache.get(sProperty, false)))
    {
      return p;
    }

    var s2 = sProperty.replace(/-([a-z])/gi, f);
    cache.put(sProperty, s2);
    return s2;
  };
})();

jsx.dom.attrMap = {
  alink: "aLink",
  accesskey: "accessKey",
  bgcolor: "bgColor",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  "char": "ch",
  charoff: "chOff",
  "class": "className",
  codebase: "codeBase",
  codetype: "codeType",
  colspan: "colSpan",
  datetime: "dateTime",
  frameborder: "frameBorder",
  "for": "htmlFor",
  ismap: "isMap",
  longdesc: "longDesc",
  maxlength: "maxLength",
  marginheight: "marginHeight",
  marginwidth: "marginWidth",
  nohref: "noHref",
  noresize: "noResize",
  noshade: "noShade",
  nowrap: "noWrap",
  readonly: "readOnly",
  rowspan: "rowSpan",
  tabindex: "tabIndex",
  usemap: "useMap",
  valuetype: "valueType",
  vlink: "vLink"
};


/**
 * Sets the value of an attribute of an HTMLElement object.
 *
 * @author
 *   (C) 2003, 2006  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o
 * @param sAttrName : string
 *   Name of the attribute for which the value should be set.
 *   Attribute names for which an ECMAScript language binding
 *   is defined in W3C DOM Level 2 HTML, are automatically
 *   mapped to the corresponding element object property.
 *   All attribute names are automatically mapped to their
 *   camelCased equivalent.
 *
 *   Semicolon-separated style property declarations (in
 *   form of colon-separated name-value pairs each) of a
 *   <code>style</code> attribute value are mapped to the
 *   corresponding properties of the object referenced by
 *   the <code>style</code> property of the element object.
 *   Declarations are evaluated from left to right, where
 *   property values complement or replace the previously
 *   defined ones.
 * @param attrValue
 *   Value of the attribute to be set.  The value is
 *   converted to number if it can be interpreted as such.
 * @return any
 *   The value of the attribute of the element object;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
jsx.dom.setAttr = function(o, sAttrName, attrValue) {
  var result = "";

  if (o && sAttrName)
  {
    var attrMap = jsx.dom.attrMap;

    /* camel-case specific attribute names */
    if (typeof attrMap[sAttrName] != "undefined")
    {
      sAttrName = attrMap[sAttrName];
    }

    var
      hyphenatedToCamelCase = jsx.dom.camelize,

      strToValue =
        /**
         * Converts a string, if possible, to a number
         * 
         * @param s
         * @return string|number
         *   The converted value
         */
        function(s) {
          s = s.replace(/^["']|["']$/g, "");
          return isNaN(s) ? s : +s;
        };

    if (typeof attrValue != "undefined")
    {
      attrValue = strToValue(attrValue);
      if (sAttrName == "style" && typeof attrValue == "string")
      {
        var styleProps = attrValue.split(/\s*;\s*/);
        for (var j = 0, len = styleProps.length; j < len; j++)
        {
          var
            stylePair = styleProps[j].split(/\s*:\s*/),
            stylePropName = hyphenatedToCamelCase(stylePair[0].toLowerCase());

          jsx.dom.setStyleProperty(o, stylePropName,
            strToValue(stylePair[1]));
          result = jsx.dom.getStyleProperty(o, stylePropName);
        }
      }
      else
      {
        result = o[sAttrName] = attrValue;
      }
    }
    else if (!(o[sAttrName] = true))
    {
      result = o[sAttrName] = sAttrName;
    }
  }

  return result;
};

/**
 * Creates an element of the type specified, using the
 * <code>document.createElement()</code> method if supported.
 * This method works with MSIE, too, for if JScript is used,
 * it is tried to use the start tag as is instead of passing
 * only the element type, and adding properties later.
 *
 * @author
 *   &copy; 2004, 2006, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param sTag : string
 *   Start tag or element type of the element to be created.
 *   Passing a start tag even works if the UA is not MSIE,
 *   as attributes and values given are parsed from left to
 *   right into the corresponding element object properties.
 * @return object
 *   A reference to a new <code>Element</code> object with the
 *   <code>nodeName</code> property set to <code>sTagName</code>,
 *   and the <code>localName</code>, <code>prefix</code>,
 *   and <code>namespaceURI</code> properties set to
 *   <code>null</code>.
 * @see <a href="dom2-core#ID-2141741547">DOM Level 2 Core: Document::createElement()</a>
 * @see <a href="msdn#workshop/author/dhtml/reference/methods/createelement.asp">MSDN Library: createElement()</a>
 */
jsx.dom.createElement = function(sTag) {
  var o = null;

  if (sTag
      && typeof document != "undefined"
      && jsx.object.isMethod(document, "createElement"))
  {
    /*@cc_on @*/
    /*@if (@_jscript)
      o = document.createElement(sTag);
    @end @*/

    if (!o)
    {
      var aTagComponents = sTag.replace(/^<?\s*|\s*>?$/g, "")
        .replace(/\s+/, " ").replace(/ = /g, "=").split(" ");
      o = document.createElement(aTagComponents[0]);
      if (o)
      {
        aTagComponents.shift();
        var attrs = aTagComponents.join(" ");
        var m;
        while ((m = /([^\s=]+)\s*(=\s*(\S+)\s*)?/g.exec(attrs)))
        {
          setAttr(o, m[1].toLowerCase(), m[3]);
        }
      }
    }
  }

  return o;
};

jsx.dom.html2nodes = function(sHTML) {
  var m,
    rx = /(<([^\s>]+)(\s+[^>]*)?>)|([^<]+)/g,
    node = document.createElement("html");

  while ((m = rx.exec(sHTML)))
  {
    if (m[1])
    {
      if (m[2].charAt(0) !== "/")
      {
        var newNode = document.createElement(m[2]);
        node.appendChild(newNode);
        node = newNode;
      }
      else
      {
        node = node.parentNode;
      }
    }
    else
    {
      node.appendChild(document.createTextNode(m[4]));
    }
  }
  
  return node;
};

jsx.dom.HTMLSerializer = (
  function() {
  
  }
).extend("Object", {
  serializeToString: (function() {
    var elemInfo = {
      'a': {
        attribs: ["name", "href", "hreflang", "type", "rel", "rev", "charset",
                  "id", "class", "lang", "title", "style", "shape", "coords",
                  "onfocus", "onblur", "onclick", "ondblclick", "onmousedown",
                  "onmouseup", "onmouseover", "onmousemove", "onmouseout",
                  "onkeypress", "onkeydown", "onkeyup",
                  "target", "tabindex", "accesskey"]
      },
      'area': {
        empty: false
      },
      'base': {
        empty: false
      },
      'basefont': {
        empty: false
      },
      'br': {
        empty: false
      },
      'col': {
        empty: false
      },
      'frame': {
        empty: false
      },
      'hr': {
        empty: false
      },
      'img': {
        empty: true
      },
      'input': {
        empty: false
      },
      'isindex': {
        empty: false
      },
      'link': {
        empty: false
      },
      'meta': {
        empty: false
      },
      'param': {
        empty: true
      }
    };
    
    return function(oNode, bIncludeProprietary) {
      var me = arguments.callee;
    
      if (oNode.tagName)
      {
        var
          t = oNode.tagName.toLowerCase(),
          startTag = "<" + t,
          content = [],
          endTag = "";
        
        for (var i = 0, c = oNode.childNodes, len = c && c.length; i < len; i++)
        {
          content.push(me(oNode, bIncludeProprietary));
        }
        
        if (typeof elemInfo[t] != "undefined" && !elemInfo[t].empty)
        {
          endTag = "</" + t + ">";
        }
        
        return startTag + content.join("") + endTag;
      }

      return oNode.textContent;
    };
  })()
});

/**
 * Returns the first child node of another node.
 * <p>
 * NOTE: This method was written to support the MSHTML 4 DOM as well as
 * newer DOMs.  It is <em>NOT</em> intended to work around the issue that
 * MSHTML removes white-space text nodes from the document tree, while
 * standards-compliant DOMs do not.  In particular, it does <em>NOT</em>
 * return the first child <em>element</em> node, and return values do vary
 * across DOMs..
 * </p>
 * @param oNode : Node
 * @returns {Node} The first child node of another node.
 */
jsx.dom.getFirstChild = function(oNode) {
  var result = null;

  if (oNode)
  {
    if (oNode.firstChild)
    {
      result = oNode.firstChild;
    }
    else if (oNode.document && oNode.document.all)
    {
      result = oNode.document.all(0);
    }
  }

  return result;
};

/**
 * Returns the parent node of a node
 * 
 * @param oNode : Node
 * @returns {Node} The parent node of <var>oNode</var>
 */
jsx.dom.getParent = function(oNode) {
  var result = null;

  if (oNode)
  {
    if (oNode.parentNode)
    {
      result = oNode.parentNode;
    }
    else if (oNode.parentElement)
    {
      result = oNode.parentElement;
    }
  }

  return result;
};

/**
 * Appends the include located at <var>sURI</var> to the <code>head</code>
 * element of the current (X)HTML document.  (Is not wise to be
 * applied on script files that contain code to append content on
 * the fly (esp. document.write(...)) -- the existing content
 * would be overwritten.)
 *
 * Note: Tested successfully with MSIE and Mozilla/5.0; however, do not
 * rely on that the script was included, but <em>test</em> for it.
 *
 * @version 0.3.2009062115
 * @author
 *   (C) 2004-2009  Thomas Lahn <dhtml.js@PointedEars.de>,
 *       2004       Ulrich Kritzner <droeppez@web.de>
 *
 * @partof http://PointedEars.de/scripts/dhtml.js
 * @requires jsx.object#isMethod()
 * @param sURI : string
 *   URI of the script resource to be loaded.
 * @param sType : optional string = "text/javascript"
 *   MIME type of the script to be loaded.  Used as value of the
 *   <code>type</code> attribute, the default is (still proprietary,
 *   but commonly used) "text/javascript".
 * @param sLanguage : optional string
 *   Value of the <code>language</code> attribute (deprecated in
 *   HTML 4.01 and XHTML 1.0, absent from XHTML 1.1 and later
 *   versions) to specify the version of the script language.
 *   Unused by default.
 * @param bReload
 *   If <code>true</code>Force an already loaded script to be reloaded,
 *   i.e. another <code>script</code> element with the same URI in the
 *   <code>src</code> attribute to be added; if <code>false</code>
 *   (default), the attempt to load a script that has already been loaded
 *   fails silently.
 *  @return boolean
 *    <code>false</code> if the script could not be loaded,
 *    <code>true</code> otherwise.
 */
jsx.dom.loadScript = function(sURI, sType, sLanguage, bReload) {
  var
    me = arguments.callee,
    jsx_object = jsx.object,
    result = false;
    
  if (typeof me.registry != "undefined"
      && jsx_object.getProperty(me.registry, sURI, false)
      && !bReload)
  {
    return true;
  }

  var oHead = jsx.dom.getElemByTagName("head", 0);
  if (!oHead)
  {
    return false;
  }
  
  if (!jsx_object.isMethod(document, "createElement"))
  {
    return false;
  }
  
  var oScript = document.createElement("script");
  if (!oScript)
  {
    return false;
  }
  
  /* no exception handling for backwards compatibility reasons */
  if (typeof oScript.src != "undefined")
  {
    oScript.src  = sURI;
  }

  if (typeof oScript.type != "undefined")
  {
    oScript.type = sType || "text/javascript";
  }

  if (sLanguage)
  {
    oScript.language = sLanguage;
  }

  if (typeof oScript.defer != "undefined")
  {
    oScript.defer = true;
  }

  if (jsx_object.isMethod(oHead, "appendChild"))
  {
    oHead.appendChild(oScript);
    result = (
      typeof oHead.lastChild != "undefined"
      && oHead.lastChild == oScript);
  }
  else if (jsx_object.isMethod(oHead, "insertAdjacentElement"))
  {
    oHead.insertAdjacentElement("beforeEnd", oScript);
    result = true;
  }
  
  if (result)
  {
    if (typeof me.registry == "undefined")
    {
      me.registry = {};
    }
    
    me.registry[sURI] = true;
  }

  return result;
};

/**
 * Retrieves descendant focusable elements in order of their
 * "tabindex" attribute.
 *
 * @author
 *   (C) 2004  Thomas Lahn <dhtml.js@PointedEars.de>
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @requires
 *   http://pointedears.de/scripts/collection.js
 * @param o : optional Document|Element
 *   Reference to a {@link dom2-core#Document Document} or
 *   {@link dom2-core#Element Element} object from which to retrieve
 *   descendant elements.  If omitted or evaluated to
 *   <code>false</code>, it is tried to use the calling object.
 * @return Collection
 *   A reference to a {@link #Collection} object containing
 *   the descendant elements of <var>o</var> or the calling
 *   {@link dom2-core#Document Document}/{@link dom2-core#Element Element}
 *   object in "tabindex" order: Elements with "tabindex" > 0 come first,
 *   followed by elements with "tabindex" == 0 or where either
 *   "tabindex" is not set or not applicable.  Note: An element
 *   with a "tabindex" of 1 will will be the first element
 *   in the resulting collection but for design reasons will
 *   have an index of 0 (but since the Collection prototype
 *   provides an iterator, this does not need to disturb you).
 *   Additional note: Unlike specified, disabled elements will
 *   participate in the tabbing order (so they can be enabled
 *   later without this method to be re-called.)
 */
jsx.dom.getElementsByTabIndex = function(o) {
  var aIndexedElements = new Array();
  var aUnindexedElements = new Array();

  /* makes the method applicable to Document and Element objects */
  if (!o
      && typeof this.constructor != "undefined"
      && /Document|Element/.test(this.constructor))
  {
    o = this;
  }

  if (jsx.object.isMethod(o, "getElementsByTagName"))
  {
    var es = o.getElementsByTagName("*");

    if (es && typeof es.length != "undefined")
    {
      var l = es.length;

      for (var i = 0, e; i < l; i++)
      {
        e = es[i];

        if (typeof e.tabIndex != "undefined")
        {
          /* !null && !0 */
          if (e.tabIndex)
          {
            /*
             * tabindex="1" --> index == 0; use e.tabIndex
             * and a "zero dummy" if you do not like this
             */
            aIndexedElements[e.tabIndex - 1] = e;
          }
          else
          {
            aUnindexedElements[aUnindexedElements.length] = e;
          }
        }
      }
    }
  }

  return new Collection(aIndexedElements.concat(aUnindexedElements));
};

if (typeof jsx.types != "undefined"
    && jsx.types.isFeature("HTMLDocument", "prototype")
    && !jsx.object.isMethod(HTMLDocument.prototype, "getElementsByTabIndex"))
{
  HTMLDocument.prototype.getElementsByTabIndex = jsx.dom.getElementsByTabIndex;
}

if (typeof jsx.types != "undefined"
    && jsx.types.isFeature("HTMLElement", "prototype")
    && !jsx.object.isMethod(HTMLElement.prototype, "getElementsByTabIndex"))
{
  HTMLElement.prototype.getElementsByTabIndex = jsx.dom.getElementsByTabIndex;
}

jsx.dom.isDescendantOfOrSelf = function(node, ancestor) {
  if (arguments.length < 2)
  {
    jsx.throwThis(null, "No ancestor provided");
  }

  do
  {
    if (node == ancestor)
    {
      return true;
    }
  }
  while ((node = node.parentNode));

  return false;
};