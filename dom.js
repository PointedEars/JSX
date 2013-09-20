/**
 * @fileOverview <title>PointedEars' DOM Library</title>
 * @file $Id$
 *
 * @partof PointedEars JavaScript Extensions (JSX)
 * @requires object.js
 * @recommends types.js, dom/xpath.js
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
 *       2002-2013 Thomas Lahn <js@PointedEars.de>,
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
  version:   "$Id$",
  //var dhtmlDocURL = dhtmlPath + "dhtml.htm";
  copyright: "Copyright \xA9 2002-2013",
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
    function () {
      if (typeof document == "undefined")
      {
        return function () {
          return null;
        };
      }

      var jsx_object = jsx.object;

      if (jsx_object.isMethod(document, "getElementById"))
      {
        /**
         * @param {string} sId
         * @return {Element|Null}
         *   Reference to an {@link Element} object representing
         *   the element with the given ID, <code>null</code> or
         *   <code>undefined</code> if there is no such element.
         *   The return value varies among DOM implementations
         *   if there is more than one matching element (invalid markup).
         */
        return function (sId) {
          /* wrapper method required to avoid "invalid op. on prototype" exception */
          return document.getElementById(sId);
        };
      }

      if ((jsx.dom.hasDocumentAll = jsx_object.isMethod(document, "all")))
      {
        return function (sId) {
          return document.all(sId);
        };
      }

      return function (sId) {
          return document[sId];
      };
    }
  )();

  jsx.dom.hasDocumentLayers = false;

  jsx.dom.getElementsByName = jsx.dom.getElemByName = jsx.dom.gEBN = (
    function () {
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
         * @param {string} sName
         * @param {number} index (optional)
         * @return Element|Layer|Null|Undefined
         */
        return function (sName, index) {
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
        return function (sName, index) {
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
        return function (sName, index) {
          var result = document.layers[sName];
          if (result && !isNaN(index) && index > -1)
          {
            result = result[index];
          }

          return result;
        };
      }

      return dummy;
    }()
  );

  jsx.dom.hasGetElementsByTagName = false;

  jsx.dom.getElementsByTagName = jsx.dom.getElemByTagName = jsx.dom.gEBTN = (
    function () {
      var jsx_object = jsx.object;

      if (jsx_object.isNativeMethod(jsx, "xpath", "evaluate"))
      {
        /* W3C DOM Level 3 XPath */
        /**
         * @param {string} sTagName
         * @param {number} index (optional)
         * @param {Element} oContextNode (optional)
         * @return {Array|Element}
         *   An <code>Array</code> of references to objects representing
         *   matching elements, or one reference to such an object if
         *   <var>index</var> was provided.
         */
        return function (sTagName, index, oContextNode) {
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

          var result = jsx.dom.xpath.evaluate('.//' + sTagName, oContextNode || null,
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

      if ((jsx.dom.hasGetElementsByTagName =
            (typeof document != "undefined"
              && jsx_object.isMethod(document, "getElementsByTagName"))))
      {
        /* W3C DOM Level 2 Core */
        /**
         * @param {string} sTagName
         * @param {number} index (optional)
         * @param {Element} oContextNode (optional)
         * @return {NodeList|Element|Null}
         *   An <code>NodeList</code> of references to objects representing
         *   matching elements, or one reference to such an object if
         *   <var>index</var> was provided; <code>null</code> if there
         *   is no matching element.
         */
        return function (sTagName, index, oContextNode) {
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

          if (!jsx_object.isMethod(oContextNode, "getElementsByTagName"))
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

      if (jsx.dom.hasDocumentAll && isMethod(document.all, "tags"))
      {
        /**
         * @param {string} sTagName
         * @param {number} index (optional)
         * @param {Element} oContextNode (optional)
         * @return {NodeList|Element|Undefined}
         *   An <code>NodeList</code> of references to objects representing
         *   matching elements, or one reference to such an object if
         *   <var>index</var> was provided; <code>null</code>
         *   if there is no matching element.
         */
        return function (sTagName, index, oContextNode) {
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

      return function () {
        return null;
      };
    }()
  );

  jsx.dom.getElementByIndex = jsx.dom.getElemByIndex = jsx.dom.gEBIdx = (function () {
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
       * @param {number} index
       * @return Element|Null|Undefined
       */
      return function (index) {
        return (result = document.getElementsByTagName('*')[index]);
      };
    }

    if (jsx.dom.hasDocumentAll)
    {
      /**
       * @param {number} index
       * @return Element|Null|Undefined
       */
      return function (index) {
        return document.all(index);
      };
    }

    if (jsx.dom.hasDocumentLayers)
    {
      /**
       * @param {number} index
       * @return Layer|Null|Undefined
       */
      return function (index) {
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
 * @param {string} sMessage = ""
 *   Error message to be displayed.
 * @return {boolean}
 *   Always <code>false</code>
 */
jsx.dom.DHTMLException = function (sMessage) {
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

jsx.dom.write = function (s) {
  var result = jsx.tryThis(
    function () {
      document.write(s);

      return true;
    },
    function () {
      return jsx.tryThis(
        function () {
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
 * @param {string} sType
 *   Defines the type of <code>sValue</code>. Valid values are
 *   "id", "name", "tagname", "index" and "classname". The
 *   argument is case-insensitive.
 * @param {string} sValue (optional)
 *   Case-sensitive ID, name or tag name of object (collection).
 * @param {number} index (optional)
 *   Numeric index of an element of the selected
 *   collection. For IDs must be unique throughout a document,
 *   this argument is ignored if <code>sType</code> is "id".
 * @return {HTMLElement|NodeList|Null}
 *   A reference to an object if <code>sType</code> is "id", or
 *   if it is "name" or "tagname" and <code>index</code> is
 *   specified; otherwise a collection of objects matching the
 *   specified criteria; <code>null</code> if no matching object
 *   exists.
 */
jsx.dom.getElem = function (sType, sValue, index) {
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
      + "Must be string.");
  }

  if (!sValue || typeof sValue != "string")
  {
    jsx.dom.DHTMLException(
        "getElem: Invalid value: " + sValue + "\n"
      + "Must be string.");
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
 * @author (C) 2003-2005, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @param {HTMLElement} oElement
 *   Element which content is to be retrieved.
 * @param {boolean} bHTML (optional)
 *   If <code>true</code>, returns the HTML content instead of
 *   the text content in case the latter cannot be retrieved.
 * @return {string}
 *  A string with the content of the element; a null-string if
 *  no such element object exists or if the DOM does not provide
 *  retrieval of the element's content.
 */
jsx.dom.getCont = function (oElement, bHTML) {
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
 * @author (C) 2003-2005, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @param {HTMLElement} oElement
 *   Element which content is to be changed.
 * @param {string} sNodeValue
 *   New content of the element.
 * @return {boolean}
 *   <code>true</code> if successful, <code>false</code>
 *   otherwise.
 */
jsx.dom.setCont = function (oElement, sNodeValue) {
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
 * @param {Node} oNode
 *   Reference to the document node.
 * @param {boolean} bGetHTML (optional)
 *   If <code>true</code>, returns the HTML content instead of
 *   the text content in case the latter cannot be retrieved.
 * @return {string}
 *   The text content of @{(oNode)}.
 * @todo Duplicate of getCont(..., false)?
 */
jsx.dom.getContent = function (oNode, bGetHTML) {
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
 * @param {Node} oNode
 *   Reference to the document node.
 * @param {string} sContent
 * @return {boolean}
 *   <code>true</code> if successful, <code<false</code> otherwise.
 */
jsx.dom.setTextContent = function (oNode, sContent) {
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
 * @param {HTMLElement} oElement
 * @param {string} sAttrName
 *   Name of the attribute from which the value
 *   should be retrieved.
 * @return {any}
 *   The value of the object if <code>sType</code> is "id",
 *   or if it is "name" or "tagname" and <code>index</code>
 *   is specified;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
jsx.dom.getAttr = function (oElement, sAttrName) {
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
 * @param o
 * @param {string} sAttrName
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
 * @return {any}
 *   The value of the attribute of the element object;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
jsx.dom.setAttr = function (o, sAttrName, attrValue) {
  var result = "";

  if (o && sAttrName)
  {
    var attrMap = jsx.dom.attrMap;

    /* camel-case specific attribute names */
    if (typeof attrMap[sAttrName] != "undefined")
    {
      sAttrName = attrMap[sAttrName];
    }

    var strToValue =
      /**
       * Converts a string, if possible, to a number
       *
       * @param {string} s
       * @return {string|number}
       *   The converted value
       */
      function (s) {
        s = s.replace(/^["']|["']$/g, "");
        return isNaN(s) ? s : +s;
      };

    if (typeof attrValue != "undefined")
    {
      attrValue = strToValue(attrValue);
      if (sAttrName == "style" && typeof attrValue == "string")
      {
        var styleProps = attrValue.split(/\s*;\s*/);
        for (var i = 0, len = styleProps.length; i < len; i++)
        {
          var
            stylePair = styleProps[i].split(/\s*:\s*/),
            stylePropName = stylePair[0].toLowerCase();

          jsx.dom.css.setStyleProperty(o, stylePropName,
            strToValue(stylePair[1]));
          result = jsx.dom.css.getStyleProperty(o, stylePropName);
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
 * @function
 * @author
 *   &copy; 2004, 2006, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @see <a href="dom2-core#ID-2141741547">DOM Level 2 Core: Document::createElement()</a>
 * @see <a href="msdn#workshop/author/dhtml/reference/methods/createelement.asp">MSDN Library: createElement()</a>
 */
jsx.dom.createElement = (function () {
  var _setAttr = jsx.dom.setAttr;

  /**
   * @param {string} sTag
   *   Start tag or element type of the element to be created.
   *   Passing a start tag even works if the UA is not MSIE,
   *   as attributes and values given are parsed from left to
   *   right into the corresponding element object properties.
   * @return {Element}
   *   A reference to a new <code>Element</code> object with the
   *   <code>nodeName</code> property set to <code>sTagName</code>,
   *   and the <code>localName</code>, <code>prefix</code>,
   *   and <code>namespaceURI</code> properties set to
   *   <code>null</code>.
   */
  return function (sTag) {
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
        /* NOTE: Uses RegExp() to work around misconfigured PHP (short_open_tag=1) */
        var aTagComponents = sTag.replace(new RegExp("^<\?\\s*|\\s*>?$", "g"), "")
          .replace(/\s*=\s*/g, "=").split(/\s+/);
        o = document.createElement(aTagComponents[0]);
        if (o)
        {
          aTagComponents.shift();
          var attrs = aTagComponents.join(" ");
          var m;
          while ((m = /([^\s=]+)\s*(=\s*(\S+)\s*)?/g.exec(attrs)))
          {
            _setAttr(o, m[1].toLowerCase(), m[3]);
          }
        }
      }
    }

    return o;
  };
}());

/**
 * Creates a node or several nodes from an object.
 *
 * Creates a DOM {@link Node} or an {@link Array} of several
 * <code>Node</code>s from the argument, depending on its type:
 * <table>
 *   <thead>
 *     <tr>
 *       <th>Type</th>
 *       <th>Return value</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <th>{@link String}</th>
 *       <td>{@link Text}</td>
 *     </tr>
 *     <tr>
 *       <th><code>Array</code> of {@link Object} or <code>String</code></th>
 *       <td><code>Array</code> of <code>Node</code>.  The input
 *           <code>Array</code>'s elements are processed recursively.</td>
 *     </tr>
 *     <tr>
 *       <th><code>Object</code></th>
 *       <td>{@link Element}.  The following of the input
 *           <code>Object</code>'s properties are considered:
 *           <table>
 *             <thead>
 *               <th>Property</th>
 *               <th>Expected type</th>
 *               <th>Meaning</th>
 *             </thead>
 *             <tbody>
 *               <tr>
 *                 <th><code><var>elementType</var></code> or
 *                     <code><var>type</var></code></th>
 *                 <td><code>String</code></td>
 *                 <td>Element type (case-sensitivity depends on
 *                     the document type)</td>
 *               </tr>
 *               <!--<tr>
 *                 <th><code><var>attributes</var></code></th>
 *                 <td><code>Object</code></td>
 *                 <td>Attributes of the element.  All attributes
 *                     are created in the <code>null</code> namespace.</td>
 *               </tr>-->
 *               <tr>
 *                 <th><code><var>properties</var></code></th>
 *                 <td><code>Object</code></td>
 *                 <td>Properties of the element object.  The property
 *                     <code>style</code> is handled specially: Its
 *                     value should be an <code>Object</code> whose
 *                     property names are <code>style</code> property
 *                     names and whose property values are the
 *                     corresponding values, as supported by
 *                     {@link jsx.dom.css#setStyleProperty()}.
 *                     <!--Note that some properties may overwrite
 *                     attributes.-->
 *               </tr>
 *               <tr>
 *                 <th><code><var>childNodes</var></code></th>
 *                 <td><code>Array</code> of <code>Object</code>
 *                     or <code>String</code></td>
 *                 <td>Child nodes of the element node.
 *                     The elements of the <code>Array</code>
 *                     are processed recursively.
 *               </tr>
 *             </tbody>
 *           </table></td>
 *     </tr>
 *   </tbody>
 * </table>
 * @function
 */
jsx.dom.createElementFromObj = jsx.dom.createNodeFromObj =
jsx.dom.createNodesFromObj = (function () {
  var _getKeys = jsx.object.getKeys;
  var _isArray = jsx.object.isArray;
  var _isHostMethod = jsx.object.isHostMethod;

  /**
   * @param {Array|Object} data
   * @return TextNode|Array[Node]|Element
   */
  return function (data) {
    if (typeof data.valueOf() == "string")
    {
      return document.createTextNode(data);
    }

    /* Support ES5 strict mode */
    var me = jsx.dom.createNodeFromObj;

    /* If input is an Array, output is an Array of Nodes */
    if (_isArray(data))
    {
      var a = [];

      for (var i = 0, len = data.length; i < len; ++i)
      {
        a[i] = me(data[i]);
      }

      return a;
    }

    var el = document.createElement(data.elementType || data.type);
    if (!el)
    {
      return null;
    }

//    var attributes = data.attributes;
//    if (attributes && _isHostMethod(el, "setAttribute"))
//    {
//      var keys = _getKeys(attributes);
//
//      for (var i = 0, len = keys.length; i < len; ++i)
//      {
//        var attrName = keys[i];
//        el.setAttribute(attrName, attributes[attrName]);
//      }
//    }

    var properties = data.properties;
    if (properties)
    {
      keys = _getKeys(properties);

      for (i = 0, len = keys.length; i < len; ++i)
      {
        var propName = keys[i];

        if (propName == "style")
        {
          var style = properties[propName];
          var _setStyleProperty = jsx.object.getFeature(jsx.dom, "css", "setStyleProperty");
          if (typeof style != "string" && typeof _setStyleProperty != "function")
          {
            jsx.warn("JSX:dom/css.js:jsx.dom.css.setStyleProperty()"
              + " is recommended for setting style object properties");
            el[propName] = style;
          }
          else
          {
            var styleKeys = _getKeys(style);
            for (var i = 0, len = styleKeys.length; i < len; ++i)
            {
              var stylePropName = styleKeys[i];
              _setStyleProperty(el, stylePropName, style[stylePropName]);
            }
          }
        }
        else
        {
          el[propName] = properties[propName];
        }
      }
    }

    var nodes = data.childNodes;
    for (var i = 0, len = nodes && nodes.length; i < len; ++i)
    {
      el.appendChild(me(nodes[i]));
    }

    return el;
  };
}());

/**
 * Removes all occurences of a class name from the
 * <code>class</code> attribute of an {@link Element}.
 *
 * For compatibility, if possible removes the <code>class</code>
 * attribute if it is empty afterwards.
 *
 * @param {Element} o
 * @param {string} sClassName
 * @return {boolean}
 *   <code>true</code> if successful, <code>false</code> otherwise.
 */
jsx.dom.removeClassName = function (o, sClassName) {
  var sRxClassName = "(^\\s*|\\s+)" + sClassName + "(\\s*$|(\\s))";

  if (jsx.object.isHostMethod(o, "classList", "remove"))
  {
    /* W3C DOM Level 4 */
    o.classList.remove(sClassName);
  }
  else
  {
    var curClassNames = o.className;
    var newClassNames = curClassNames.replace(
      new RegExp(sRxClassName, "g"),
      "$3");
    o.className = newClassNames;

    if (!newClassNames && jsx.object.isMethod(o, "removeAttribute"))
    {
      o.removeAttribute("class");
    }
  }

  return !((new RegExp(sRxClassName)).test(o.className));
};

jsx.dom.addClassName = (function () {
  var _removeClassName = jsx.dom.removeClassName;

  /**
   * Adds a class name to the <code>class</code> attribute of
   * an {@link Element}.
   *
   * @param {Element} o
   * @param {string} sClassName
   * @param {boolean} bRemove
   *   If the class name is already there, and this argument is
   *   <code>true</code>, all instances of it are removed first.
   *   If the class is there and this argument is <code>false</code>,
   *   exit without changing anything.  The default is <code>false</code>,
   *   which is more efficient.
   * @return {boolean}
   *   <code>true</code> if the class name could be added successfully or
   *   was already there, <code>false</code> otherwise.
   */
  function _addClassName (o, sClassName, bRemove)
  {
    var rx = new RegExp("(^\\s*|\\s+)" + sClassName + "(\\s*$|\\s)");

    if (bRemove)
    {
      _removeClassName(o, sClassName);
    }
    else if (rx.test(o.className))
    {
      return true;
    }

    if (sClassName)
    {
      if (jsx.object.isHostMethod(o, "classList", "add"))
      {
        /* W3C DOM Level 4 */
        o.classList.add(sClassName);
      }
      else
      {
        if (/\S/.test(o.className))
        {
          o.className += " " + sClassName;
        }
        else
        {
          o.className = sClassName;
        }
      }

      return rx.test(o.className);
    }
  }

  return _addClassName;
}());

/**
 * Appends several child nodes to a parent node in the specified order.
 *
 * @param {Node} parentNode
 * @param {NodeList|Array} childNodes
 * @return {boolean}
 *   <code>true</code> on success, <code>false</code> otherwise.
 */
jsx.dom.appendChildren = function (parentNode, childNodes) {
  if (parentNode)
  {
    for (var i = 0, len = childNodes.length; i < len; ++i)
    {
      parentNode.appendChild(childNodes[i]);
    }

    return true;
  }

  return false;
};

/**
 * Removes several child nodes of a parent node in reverse order.
 *
 * @param {Node} parentNode
 * @param {NodeList|Array} childNodes (optional)
 *   The child nodes to be deleted.  If not provided,
 *   all child nodes of <var>parentNode</var> are deleted,
 *   the table-safe equivalent to
 *   <code><var>parentNode</var>.innerHTML = "";</code>
 * @return {boolean}
 *   <code>true</code> on success, <code>false</code> otherwise.
 */
jsx.dom.removeChildren = function (parentNode, childNodes) {
  if (parentNode)
  {
    if (arguments.length < 2)
    {
      childNodes = parentNode.childNodes;
    }

    for (var i = childNodes.length; i--;)
    {
      parentNode.removeChild(childNodes[i]);
    }

    return true;
  }

  return false;
};

jsx.dom.html2nodes = function (sHTML) {
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
  function () {

  }
).extend("Object", {
  serializeToString: (function () {
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

    return function (oNode, bIncludeProprietary) {
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
 * across DOMs.
 * </p>
 * @param {Node} oNode
 * @return {Node} The first child node of another node.
 */
jsx.dom.getFirstChild = function (oNode) {
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
 * @param {Node} oNode
 * @return {Node} The parent node of <var>oNode</var>
 */
jsx.dom.getParent = function (oNode) {
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
 * Loads a script resource asynchonrously by appending
 * a <code>script</code> element to the current (X)HTML document.
 *
 * A <code>script</code> element is being created and appended as
 * child to the <code>body</code> element or the <code>head</code>
 * element of the document, whichever is available first.  In a
 * frameset document, <code>document.body</code> refers to the
 * topmost <code>frameset</code> element object; in that case,
 * it is attempted to find a <code>body</code> element by other
 * means.  If that fails, it means that there either is no such
 * element, or that the element object is inaccessible because
 * it is disabled by the frameset.  In that case the
 * <code>script</code> element is appended to the <code>head</code>
 * element instead.
 *
 * Note that previous versions of this method appended to the
 * <code>head</code> element only.  However, this limited its use
 * to scripts that did not modify the body content.  You may still
 * not load such scripts with this method if the document has
 * been loaded and the script resource uses
 * <code>document.write()</code>.  This method intentionally does
 * not use <code>document.write()</code> to avoid the possibility
 * that a loaded document could be overwritten.
 *
 * NOTE: Tested successfully with MSIE and Mozilla/5.0; however,
 * do not rely on that the script was included, but <em>test</em>
 * for it.
 *
 * @author
 *   (C) 2004-2009, 2013  Thomas Lahn <dhtml.js@PointedEars.de>,
 *       2004             Ulrich Kritzner <droeppez@web.de>
 *
 * @requires jsx.object#isMethod()
 * @param {string} sURI
 *   URI of the script resource to be loaded.
 * @param {string} sType = "text/javascript"
 *   MIME type of the script to be loaded.  Used as value of the
 *   <code>type</code> attribute.
 * @param {string} sLanguage (optional)
 *   Value of the <code>language</code> attribute (deprecated in
 *   HTML 4.01 and XHTML 1.0, absent from XHTML 1.1 and later
 *   versions) to specify the version of the script language.
 *   Unused by default.
 * @param {boolean} bReload = false
 *   If <code>true</code>Force an already loaded script to be reloaded,
 *   i.e. another <code>script</code> element with the same URI
 *   in the <code>src</code> attribute to be added;
 *   if <code>false</code> (default), the attempt to load a script
 *   that has already been loaded fails silently.
 *  @return {boolean}
 *    <code>false</code> if the script could not be loaded,
 *    <code>true</code> otherwise.
 */
jsx.dom.loadScript =
  function jsx_dom_loadScript (sURI, sType, sLanguage, bReload) {
    var
      jsx_object = jsx.object,
      result = false;

    if (typeof jsx_dom_loadScript.registry != "undefined"
        && jsx_object.getProperty(jsx_dom_loadScript.registry, sURI, false)
        && !bReload)
    {
      return true;
    }

    var parent = document.body;
    if (!parent || parent.tagName.toLowerCase() === "frameset")
    {
      parent = jsx.dom.getElemByTagName("script", 0);
      if (!parent)
      {
        parent = document.head || jsx.dom.getElemByTagName("head", 0);
      }

      if (!parent)
      {
        return false;
      }
    }

    if (!jsx_object.isHostMethod(document, "createElement"))
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

    if (jsx_object.isHostMethod(parent, "appendChild"))
    {
      parent.appendChild(oScript);
      result = (
        typeof parent.lastChild != "undefined"
        && parent.lastChild == oScript);
    }
    else if (jsx_object.isHostMethod(parent, "insertAdjacentElement"))
    {
      parent.insertAdjacentElement("beforeEnd", oScript);
      result = true;
    }

    if (result)
    {
      if (typeof jsx_dom_loadScript.registry == "undefined")
      {
        jsx_dom_loadScript.registry = {};
      }

      jsx_dom_loadScript.registry[sURI] = true;
    }

    return result;
  };

/**
 * Retrieves descendant focusable elements in order of their
 * "tabindex" attribute.
 *
 * @author
 *   (C) 2004  Thomas Lahn <dhtml.js@PointedEars.de>
 * @requires
 *   http://pointedears.de/scripts/collection.js
 * @param {Document|Element} o (optional)
 *   Reference to a {@link dom2-core#Document Document} or
 *   {@link dom2-core#Element Element} object from which to retrieve
 *   descendant elements.  If omitted or evaluated to
 *   <code>false</code>, it is tried to use the calling object.
 * @return {Collection}
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
jsx.dom.getElementsByTabIndex = function (o) {
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

jsx.dom.isDescendantOfOrSelf = function (node, ancestor) {
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

/**
 * Applies hyphenation to the context node.
 *
 * Improves the readability of text by inserting soft hyphens
 * in text nodes as specified by the {@link jsx.string#hyphenation}
 * dictionary.
 *
 * @function
 * @requires jsx.string.hyphenation#hyphenate()
 */
jsx.dom.hyphenate = (function () {
  var _isArray = jsx.object.isArray;
  var _hyphenation, _hyphenate, _me;

  /**
   * @param {Array} contextNodes = document
   *   Hyphenation is applied to these {@link Node}s and their
   *   descendant text nodes.  The default is the <code>Document</code>
   *   node referred by the <code>document</code> property of the
   *   next fitting object in the scope chain (usually the Global
   *   Object).
   * @param {boolean} hyphenateAll
   *   If a true-value,
   */
  return function (contextNodes, hyphenateAll) {
    /* imports */
    if (!_hyphenate)
    {
      _hyphenation = jsx.string.hyphenation;
      _hyphenate = _hyphenation.hyphenate;
    }

    _hyphenation.setHyphenateAll(hyphenateAll);

    if (!_me)
    {
      _me = jsx.dom.hyphenate;
    }

    /* optional arguments */
    if (typeof contextNodes == "undefined")
    {
      contextNodes = document;
    }

    if (!contextNodes)
    {
      return jsx.warn("jsx.dom.hyphenate: Invalid context node: " + contextNodes);
    }

    if (!_isArray(contextNodes))
    {
      contextNodes = [contextNodes];
    }

    for (var i = 0, len = contextNodes.length; i < len; ++i)
    {
      var contextNode = contextNodes[i];

      if (!contextNode)
      {
        jsx.warn("jsx.dom.hyphenate: Invalid context node " + (i + 1) + ": " + contextNode);
        continue;
      }

      for (var j = 0,
                nodes = contextNode.childNodes,
                len2 = nodes && nodes.length;
           j < len2;
           ++j)
      {
        var node = nodes[j];

        if (node.nodeType == 1)
        {
          _me(node, hyphenateAll);
        }
        else
        {
          node.nodeValue = _hyphenate(node.nodeValue, hyphenateAll);
        }
      }
    }
  };
}());