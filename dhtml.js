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
 *   (C) 2002-2008 Thomas Lahn <dhtml.js@PointedEars.de>,
 *       2001      SELFHTML e.V. <stefan.muenz@selfhtml.org> et al.,
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
 * Refer dhtml.js.diff for changes to the last version,
 * and dhtml.htm file for a printable documentation.
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSdoc/
 * for details.
 */

/**
 * @return
 * @type DHTML
 */
function DHTML()
{
  this.version   = "0.9.4.2008042321";
// var dhtmlDocURL = dhtmlPath + "dhtml.htm";
  this.copyright = "Copyright \xA9 2002-2008";
  this.author    = "Thomas Lahn";
  this.email     = "dhtml.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
  this.URI       = this.path + "dhtml.js";
//  this.docURI    = this.path + "dhtml.htm";
  this.allowExceptionMsg = true;

  if (typeof document != "undefined")
  {
    var hasDocumentAll = false;

    /**
     * @return
     *   Reference to a {@link HTMLElement} object representing
     *   the element with the given ID.
     * @type HTMLElement|null
     */
    this.getElemById = this.gEBI = (
      function dhtml_getElemById() {
        if (isMethod(document, "getElementById"))
        {
          /**
           * @param s
           * @return
           */
          return function dhtml_getElemById(s) {
            // wrapper method required to avoid "invalid op. on prototype" exception
            return document.getElementById(s);
          };
        }
        else if ((hasDocumentAll = isMethod(document, "all")))
        {
          /**
           * @param s
           * @return
           */
          return function dhtml_getElemById(s) {
            return document.all(s);
          };
        }
        else
        {
          /**
           * @param s
           * @return
           */
          return function dhtml_getElemById(s) {
            return document[s];
          };
        }
      }
    )();

    var hasDocumentLayers = false;

    this.getElemByName = this.gEBN = (
      /**
       * @return
       */
      function dhtml_getElemByName() {
        if (isMethod(document, "getElementsByName"))
        {
          // W3C DOM Level 2 HTML
          /**
           * @param s 
           * @param i 
           * @return
           */
          return function dhtml_getElemByName(s, i) {
            var result = document.getElementsByName(s);
            if (result && !isNaN(i) && i > -1)
            {
              result = result[i];
            }
            return result;
          };
        }
        else if (hasDocumentAll)
        {
          // IE4 DOM
          /**
           * @param s 
           * @param i 
           * @return
           */
          return function dhtml_getElemByName(s, i) {
            var result = document.all(s);
            if (result && !isNaN(i) && i > -1)
            {
              result = result[i];
            }
            return result;
          };
        }
        else if ((hasDocumentLayers = (typeof document.layers == "object")))
        {
          // NN4 DOM
          /**
           * @param s 
           * @param i 
           * @return
           */
          return function dhtml_getElemByName(s, i) {
            var result = document.layers[s];
            if (result && !isNaN(i) && i > -1)
            {
              result = result[i];
            }
            return result;
          };
        }
        
        else
        {
          /**
           * @return
           */
          return function dhtml_getElemByName() {
            return null;
          };
        }
      }
    )();

    var hasGetElementsByTagName;

    this.getElemByTagName = this.gEBTN = (
      /**
       * @return
       */
      function dhtml_getElemByTagName() {
        if (typeof xpath != "undefined" && isMethod(xpath, "evaluate"))
        {
          // W3C DOM Level 3 XPath
          /**
           * @param s 
           * @param i 
           * @return
           */
          return function dhtml_getElemByTagName(s, i) {
            if (!s)
            {
              s = '*';
            }

            var result = xpath.evaluate(
              '//' + s, false, false, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
            if (result)
            {
              if (!isNaN(i) && i > -1)
              {
                result = result[i];
              }
            }

            return result;
          };
        }
        else if ((hasGetElementsByTagName =
                    isMethod(document, "getElementsByTagName")))
        {
          // W3C DOM Level 2 Core
          /**
           * @param s 
           * @param i 
           * @return
           */
          return function dhtml_getElemByTagName(s, i) {
            if (!s)
            {
              s = '*';
            }

            var result = document.getElementsByTagName(s);
            if (result && !isNaN(i) && i > -1)
            {
              result = result[i];
            }
            return result;
          };
        }
        else if (hasDocumentAll && isMethod(document.all, "tags"))
        {
          /**
           * @param s 
           * @param i 
           * @return
           */
          return function dhtml_getElemByTagName(s, i) {
            var result = document.all.tags(s);
            if (result && !isNaN(i) && i > -1)
            {
              result = result[i];
            }
            return result;
          };
        }
        else
        {
          /**
           * @return
           */
          return function dhtml_getElemByTagName()
          {
            return null;
          };
        }
      }
    )();

    this.getElemByIndex = this.gEBIdx = (
      /**
       * @return
       */
      function dhtml_getElemByIndex() {
        if (hasGetElementsByTagName)
        {
          return /**
           * @param i
           * @return
           */
          function dhtml_getElemByIndex(i)
          {
            return (result = document.getElementsByTagName('*')[i]);
          };
        }
        else if (hasDocumentAll)
        {
          return /**
           * @param i
           * @return
           */
          function dhtml_getElemByIndex(i)
          {
            return document.all(i);
          };
        }
        else if (hasDocumentLayers)
        {
          return /**
           * @param i
           * @return
           */
          function dhtml_getElemByIndex(i)
          {
            return document.layers[i];
          };
        }
        else
        {
          return /**
           * @return
           */
          function dhtml_getElemByIndex()
          {
            return null;
          };
        }
      }
    )();
  }

  this.getElemByClassName = this.gEBCN =
  /**
   * @param s
   * @return
   */
  function dhtml_getElemByClassName(s) {
    var
      coll = this.getElemByTagName(),
      result = new Array();

    if (coll)
    {
      var rx = new RegExp("\\b" + s + "\\b");
      for (var i = 0, len = coll.length; i < len; i++)
      {
        if (rx.test(coll[i].className))
        {
          result[result.length] = coll[i];
        }
      }
    }

    return result;
  };

  // Apart from isNS4DOM, none of these object-inference properties is used
  // anymore; they are still here for backwards compatibility only
  this.isW3CDOM = isMethod(document, "getElementById");
  this.isOpera  = typeof window.opera != "undefined";
  this.isNS4DOM = typeof document.layers != "undefined";
  this.isIE4DOM  = typeof document.all == "object" && !this.isOpera;
  this.supported = this.isW3CDOM || this.isNS4DOM || this.isOpera
    || this.isIE4DOM;

  // DOM preselection (why?)
  this.W3CDOM = 3;
  this.IE4DOM = 2;
  this.NS4DOM = 1;
  this.DOM = this.supported
    && (this.isW3CDOM && this.W3CDOM)
    || (this.isIE4DOM && this.IE4DOM)
    || (this.isNS4DOM && this.NS4DOM);
}

// imports from object.js
var objectPath = "/scripts/object.js"; 

if (typeof isMethod != "undefined")
{
  // for backwards compatibility only
  DHTML.prototype.isMethod = isMethod;
}
else
{
  var msg = "isMethod() was not defined";
  if (loadScript(objectPath))
  {
    if (typeof console.warn != "undefined")
    {
      console.warn(msg + ", successfully loaded " + objectPath);
    }
  }
  else
  {  
    console.warn(msg + ", could not load " + objectPath);
  }
}

// imports from types.js
var typesPath = "/scripts/types.js";

if (typeof isMethodType != "undefined")
{
  // for backwards compatibility only
  DHTML.prototype.isMethodType = isMethodType;
}
else
{
  msg = "isMethodType() was not defined";
  if (loadScript(typesPath))
  {
    if (typeof console.warn != "undefined")
    {
      if (typeof isMethodType != "undefined"
          && (typeof isMethod == "undefined"
              || (typeof console != "undefined" && isMethod(console, "warn"))))
      {
        console.warn(msg + ", successfully loaded " + typesPath);
      }
    }
  }
  else
  {  
    if (typeof isMethodType != "undefined"
        && (typeof isMethod == "undefined"
            || (typeof console != "undefined" && isMethod(console, "warn"))))
    {
      console.warn(msg + ", could not load " + typesPath);
    }
  }
}

var dhtml = new DHTML();

/**
 * Shows an exception alert and allows for
 * displaying a stack trace.
 *
 * @param sMsg : optional string = ""
 *   Error message to be displayed.
 * @return type boolean
 */
function DHTMLException(sMsg)
{
  // Prevent exceptions from "bubbling" on (keyboard) event
  if (!dhtml.allowExceptionMsg)
  {
    return false;
  }
  dhtml.allowExceptionMsg = false;

  setErrorHandler();
  var stackTrace = isMethod(_global, "Error") && (new Error()).stack || "";
  clearErrorHandler();

  alert(
    "dhtml.js "
      + dhtml.version + "\n"
      + dhtml.copyright + "  "
      + dhtml.author + " <" + dhtml.email + ">\n"
      + 'The latest version can be obtained from:\n'
      + "<" + dhtml.URI + ">\n\n"
      + sMsg + "\n"
      + "__________________________________________________________\n"
      + "Stack trace"
      + (stackTrace
          ? ":\n\n" + stackTrace
          : " not available in this DOM."));

  dhtml.allowExceptionMsg = true;
  return false;
}

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
 * @return
 *   A reference to an object if <code>sType</code> is "id", or
 *   if it is "name" or "tagname" and <code>index</code> is
 *   specified; otherwise a collection of objects matching the
 *   specified criteria; <code>null</code> if no matching object
 *   exists.
 */
function getElem(sType, sValue, index)
{
  /**
   * @return
   */
  function invalidType()
  {
    DHTMLException(
        'getElem: Invalid type "' + sType + '"\n'
      + 'Must be one of "id", "name", "tagname", "index" or "classname"'
      + ' (case-insensitive).');
  }

  if (!sType || typeof sType != "string" || !sType.toLowerCase)
  {
    DHTMLException(
        "getElem: Invalid type: " + sType + "\n"
      + "Must be String.");
  }

  if (!sValue || typeof sValue != "string")
  {
    DHTMLException(
        "getElem: Invalid value: " + sValue + "\n"
      + "Must be String.");
  }

  var o = null;

  switch ((sType = sType.toLowerCase()))
  {
    case 'id':
    case 'index':
    case 'classname':
      o = dhtml["getElemBy" + {
        id:        "Id",
        index:     "Index",
        classname: "ClassName"
      }[sType]](sValue);
      break;

    case 'name':
    case 'tagname':
      o = dhtml["getElemBy" + {
        name:    "Name",
        tagname: "TagName"
      }[sType]](sValue, index);
      break;

    default:
      invalidType();
  }

  return o;
}
DHTML.prototype.getElem = getElem;

/**
 * Retrieves the content of an HTMLElement object.
 *
 * @author
 *   (C) 2003-2005  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o : HTMLElement
 *   Element which content is to be retrieved.
 * @param bHTML : optional boolean
 *   If <code>true</code>, returns the HTML content instead of
 *   the text content in case the latter cannot be retrieved.
 * @return type string
 *  A string with the content of the element; a null-string if
 *  no such element object exists or if the DOM does not provide
 *  retrieval of the element's content.
 */
function getCont(o, bHTML)
{
  var sResult = "";

  if (o)
  {
    // W3C DOM Level 2 Core
    if (typeof o.firstChild != "undefined")
    {
      if (typeof o.firstChild.nodeType != "undefined"
          && o.firstChild.nodeType ==
            /* W3C-DOM 2 o.firstChild.TEXT_NODE constant is N/A in IE and O7 */
            ((typeof o.firstChild.TEXT_NODE != "undefined"
              && o.firstChild.TEXT_NODE)
             || 3))
      {
        sResult = o.firstChild.nodeValue;
      }
    }
    else
    {
      if (typeof o.innerText != "undefined")
      {
        sResult = o.innerText;
      }

      if ((bHTML || typeof o.innerText == "undefined")
          && typeof o.innerHTML != "undefined")
      {
        sResult = o.innerHTML;
      }
    }
  }

  return sResult;
}
DHTML.prototype.getCont = getCont;

/**
 * Specifies the content of an HTMLElement object.
 *
 * @author
 *   (C) 2003-2005  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o : HTMLElement
 *   Element which content is to be changed.
 * @param sNodeValue : string
 *   New content of the element.
 * @returns
 *   <code>true</code> if successful, <code>false</code>
 *   otherwise.
 */
function setCont(o, sNodeValue)
{
  if (o)
  {
    // DOM Level 2 Core
    if (typeof o.firstChild != "undefined")
    {
      o.firstChild.nodeValue = sNodeValue;
      return true;
    }
    else if (typeof o.nodeValue != "undefined")
    {
      o.nodeValue = sNodeValue;
      return true;
    }

    // IE4 DOM
    else if (typeof o.innerText != "undefined")
    {
      o.innerText = sNodeValue;
      return true;
    }

    // NS4 DOM
    else if (dhtml.isNS4DOM
             && o.document
             && o.document.open
             && o.document.write
             && o.document.close)
    {
      o.document.open();
      o.document.write(sNodeValue);
      o.document.close();
      return true;
    }
  }

  return false;
}
DHTML.prototype.setCont = setCont;

/**
 * Returns the text content of a document node.
 *
 * @author
 *   (C) 2005 Thomas Lahn <dhtml.js@PointedEars.de>
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oNode : Node
 *   Reference to the document node.
 * @return type string
 *   The text content of @{(oNode)}.
 */
function getTextContent(oNode)
{
  var text = "";

  if (oNode)
  {
    // W3C DOM Level 3
    if (typeof oNode.textContent != "undefined")
    {
      text = oNode.textContent;
    }

    // W3C DOM Level 2
    else if (oNode.childNodes && oNode.childNodes.length)
    {
      for (var i = oNode.childNodes.length; i--;)
      {
        var o = oNode.childNodes[i];
        if (o.nodeType == ((Node && Node.TEXT_NODE) || 3))
        {
          text = o.nodeValue + text;
        }
        else
        {
          text = getTextContent(o) + text;
        }
      }
    }

    // proprietary: IE4+
    else if (typeof oNode.innerText != "undefined")
    {
      text = oNode.innerText;
    }
  }

  return text;
}
DHTML.prototype.getTextContent = getTextContent;

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
 * @return type boolean
 *   <code>true</code> if successful, <code<false</code> otherwise.
 */
function setTextContent(oNode, sContent)
{
  var result = false;

  if (oNode)
  {
    // W3C DOM Level 3
    if (typeof oNode.textContent != "undefined")
    {
      oNode.textContent = sContent;
      result = (oNode.textContent == sContent);
    }

    // W3C DOM Level 2
    else if (oNode.removeChild && oNode.firstChild)
    {
      while (oNode.firstChild)
      {
        oNode.removeChild(oNode.firstChild);
      }

      result = !!oNode.appendChild(document.createTextNode(sContent));
    }

    // proprietary: IE4+
    else if (typeof oNode.innerText != "undefined")
    {
      oNode.innerText = sContent;
      result = (oNode.innerText == sContent);
    }
  }
  return result;
}
DHTML.prototype.setTextContent = setTextContent;

/**
 * Retrieves the value of an attribute of an HTMLElement object
 * that matches certain criteria.
 *
 * @author
 *   (C) 2003, 2008  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @param o 
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param sAttrName : string
 *   Name of the attribute from which the value
 *   should be retrieved.
 * @return
 *   The value of the object if <code>sType</code> is "id",
 *   or if it is "name" or "tagname" and <code>index</code>
 *   is specified;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
function getAttr(o, sAttrName)
{
  var result = "";

  if (o)
  {
    if (isMethod(o, "getAttribute"))
    {
      result = o.getAttribute(sAttrName);
    }
    else if (dhtml.isNS4DOM)
    {
      result = o[sAttrName];
    }
  }

  return result;
}
DHTML.prototype.getAttr = getAttr;

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
 * @returns
 *   The value of the attribute of the element object;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
function setAttr(o, sAttrName, attrValue)
{
  var result = "";

  if (o && sAttrName)
  {
    var attrMap = {
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

    // camel-case specific attribute names
    if (typeof attrMap[sAttrName] != "undefined")
    {
      sAttrName = attrMap[sAttrName];
    }

    var
      hyphenatedToCamelCase =
        /**
         * @param s
         * @return
         */
        function(s) {
          return s.replace(/-([a-z])/g,
            /**
             * @param match 
             * @param p1 
             * @param offset 
             * @param input 
             * @return
             */
            function(match, p1, offset, input) {
              return p1.toUpperCase();
            })
        },

      strToValue =
        /**
         * @param s
         * @return
         */
        function(s) {
          s = s.replace(/^["']|["']$/g, "");
          return isNaN(s) ? s : +s;
        };

    // camel-case hyphenated attribute names
    sAttrName = hyphenatedToCamelCase(sAttrName);

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

          dhtml.setStyleProperty(o, stylePropName,
            strToValue(stylePair[1]));
          result = dhtml.getStyleProperty(o, stylePropName);
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
}
DHTML.prototype.setAttr = setAttr;

/**
 * Retrieves the value of a style property of an HTMLElement object.
 *
 * @author
 *   (C) 2005  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument o : HTMLElement
 *   Reference to the element object which style is to be modified.
 * @argument sPropertyName : string
 *   Name of the style property of which the value should be retrieved.
 *   If "display", and there is no
 *   <code>style[<var>sPropertyName</var>]</code> property,
 *   "visibility" is used instead (fallback for the NN4 DOM).
 * @return
 *   <code>null</code> if no matching object exists or if the
 *   DOM does not provide for retrieval of the property value.
 */
function getStyleProperty(o, sPropertyName)
{
  if (o)
  {
    sPropertyName = sPropertyName.replace(/-([a-z])/gi,
      /**
       * @param m 
       * @param p1
       * @return
       */
      function(m, p1) { return p1.toUpperCase(); });

    if (typeof o.style != "undefined")
    {
      // handle the `float' property
      var tested = false;

      if (sPropertyName == "float")
      {
        // W3C DOM Level 2 CSS
        if (typeof o.style.cssFloat != "undefined")
        {
          sPropertyName = "cssFloat";
          tested = true;
        }

        // MSHTML DOM
        else if (typeof o.style.styleFloat != "undefined")
        {
          sPropertyName = "styleFloat";
          tested = true;
        }
      }

      if (tested || typeof o.style[sPropertyName] != "undefined")
      {
        return o.style[sPropertyName];
      }
    }
    else
    {
      if (sPropertyName == "display") sPropertyName = "visibility";

      if (typeof o[sPropertyName] != "undefined")
      {
        return o[sPropertyName];
      }
    }
  }

  return null;
}
DHTML.prototype.getStyleProperty = getStyleProperty;

/**
 * Determines whether an HTMLElement object has a style property or not.
 *
 * @author
 *   (C) 2006  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o : HTMLElement
 *   Reference to the element object which style property is to be retrieved.
 * @param sPropertyName : string
 *   Name of the style property which is to be checked.
 *   If "display", and there is no
 *   <code>style[<var>sPropertyName</var>]</code> property,
 *   "visibility" is used instead (fallback for the NN4 DOM).
 * @return
 *   <code>false</code> if no matching object exists or if the
 *   DOM does not provide for retrieval of the property value;
 *   <code>true</code> otherwise.
 */
function hasStyleProperty(o, sPropertyName)
{
  return (getStyleProperty(o, sPropertyName) != null);
}
DHTML.prototype.hasStyleProperty = hasStyleProperty;

/**
 * Sets the value of a style property of an HTMLElement object.
 *
 * @author
 *   (C) 2003-2008  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o : HTMLElement
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
 * @return
 *   <code>false</code> if no such object exists, the
 *   DOM does not provide for setting the property value,
 *   or if the assignment failed (invalid value).
 *   CAVEAT: Some property values are normalized by the API when read;
 *   test before using the return value as a discriminator.
 * @type boolean
 */
function setStyleProperty(o, sPropertyName, propValue, altValue)
{
  if (o)
  {
    sPropertyName = sPropertyName.replace(
      /-([a-z])/gi,
      /**
       * @param m 
       * @param p1 
       * @return
       */
      function(m, p1) { return p1.toUpperCase(); });

    if (typeof o.style != "undefined")
    {
      // handle the `float' property
      var isStyleFloat = false;

      if (sPropertyName == "float")
      {
        // W3C DOM Level 2 CSS
        if (typeof o.style.cssFloat != "undefined")
        {
          sPropertyName = "cssFloat";
          isStyleFloat = true;
        }

        // MSHTML DOM
        else if (typeof o.style.styleFloat != "undefined")
        {
          sPropertyName = "styleFloat";
          isStyleFloat = true;
        }
      }

      if (isStyleFloat || typeof o.style[sPropertyName] != "undefined")
      {
        // NOTE: Shortcut evaluation changed behavior;
        // result of assignment is *right-hand side* operand
        o.style[sPropertyName] = propValue;
        return (String(o.style[sPropertyName]).toLowerCase()
                == String(propValue).toLowerCase());
      }
    }
    else
    {
      if (sPropertyName == "display" && altValue)
      {
        sPropertyName = "visibility";
      }

      if (typeof o[sPropertyName] != "undefined")
      {
        var newValue = (altValue || propValue);
        o[sPropertyName] = newValue;
        return (String(o[sPropertyName]).toLowerCase()
          == String(newValue).toLowerCase());
      }
    }
  }

  return false;
}
DHTML.prototype.setStyleProperty = setStyleProperty;

/**
 * Retrieves the rendering state or (dis)allows rendering of a DOM object.
 *
 * @author
 *   (C) 2004-2006  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o : HTMLElement
 *   Reference to the DOM object to be rendered or not.
 * @param bShow : boolean
 *   Renders the object referenced by <code>o</code> if
 *   <code>true</code>, does not render it if <code>false</code>.
 *   Note that not to render an element is different from
 *   hiding it, as the space it would take up is then no
 *   longer reserved.
 *
 *   If this argument is omitted, the current property value is returned.
 * @return type boolean
 *   When retrieving: <code>true</code> if visible, <code>false</code>
 *   otherwise; when setting: <code>true</code> if successful,
 *   <code>false</code> otherwise.
 * @see
 *   visibility()
 */
function display(o, bShow)
{
  var result;

  if (o)
  {
    if (arguments.length > 1)
    {
      result = setStyleProperty(o, "display",
        bShow ? ""     : "none",
        bShow ? "show" : "hide");
    }
    else
    {
      result = /^(\s*|show)$/.test(getStyleProperty(o, "display"));
    }
  }

  return result;
}
DHTML.prototype.display = display;

/**
 * Retrieves or sets the visibility of a DOM object.
 *
 * @author
 *   (C) 2004-2006  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o : HTMLElement
 *   Reference to the DOM object to be either shown or hidden.
 * @param bVisible: optional boolean
 *   Shows the object referenced by <code>o</code> if <code>true</code>,
 *   hides it if <code>false</code>.  Note that hiding an element is
 *   different from not rendering it, as the space it takes up is still
 *   reserved.
 *
 *   If this argument is omitted, the current property value is returned.
 * @return
 *   When retrieving: <code>true</code> if visible, <code>false</code>
 *   otherwise; when setting: <code>true</code> if successful,
 *   <code>false</code> otherwise.
 * @type boolean
 * @see #display()
 */
function visible(o, bVisible)
{
  var result;

  if (o)
  {
    if (arguments.length > 1)
    {
      result = setStyleProperty(o, "visibility",
        bVisible ? "visible" : "hidden",
        bVisible ? "show" : "hide");
    }
    else
    {
      result = /^(visible|show)$/.test(getStyleProperty(o, "visibility"));
    }
  }

  return result;
}
var visibility = visible;
DHTML.prototype.visibility = visible;
DHTML.prototype.visible = visible;

/**
 * Sets the <code>value</code> property of an <code>HTMLInputElement</code>
 * object, and its <code>title</code> property accordingly if specified.
 *
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oInput : HTMLInputElement
 *   Required.  Reference to an HTMLInputElement object.
 * @param sValue : string
 *   New value of the <code>value</code> property of the
 *   HTMLInputElement object.
 * @param bSetTitle : optional boolean = false
 *   Specifies if the <code>title</code> property should be set to
 *   the same value as the <code>value</code> property.  The default
 *   is <code>false</code>.
 * @return type boolean
 *   If <var>bSetTitle</var> evaluates to <code>false</code>
 *   or omitted:
 *
 *   <code>true</code> if the <code>value</code> property could be set
 *   properly, <code>false</code> otherwise.
 *
 *   If <var>bSetTitle</var> is <code>true</code>:
 *
 *   <code>true</code> if <em>both</em> the <code>value</code> and
 *   <code>title</code> properties could be set properly,
 *   <code>false</code> otherwise.
 */
function setValue(oInput, sValue, bSetTitle)
{
  if (oInput && typeof oInput.value != "undefined")
  {
    oInput.value = sValue;
    if (bSetTitle && typeof oInput.title != "undefined")
    {
      oInput.title = sValue;
      return (oInput.value == sValue && oInput.title == sValue);
    }
    return (oInput.value == sValue);
  }

  return false;
}
DHTML.prototype.setValue = setValue;

/**
 * @param imgID : number|string
 * @param state : optional number
 * @return type boolean
 */
function hoverImg(imgID, state)
{
  var img = null;

  if (document.images)
  {
    img = document.images[imgID];
  }

  return setStyleProperty(img, "borderColor",
    (state == 0 ? hoverImg.clMouseout : hoverImg.clMouseover));
}
hoverImg.clMouseout = "#000",
hoverImg.clMouseover = "#fff";
DHTML.prototype.hoverImg = hoverImg;

/**
 * Retrieves the checked radio button of a radio button group.
 *
 * @author
 *   Copyright (C) 2004, 2007  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oForm : HTMLFormElement
 *   Required. Reference to an HTMLFormElement object to contain
 *   the radio button group.
 * @param sGroup : string
 *   Name of the radio button group from which the
 *   checked radio button should be retrieved.
 * @return object|boolean|HTMLInputElement
 *   <code>null</code> if <var>oForm</var> is invalid or there is no such
 *   <var>sGroup</var>;
 *   <code>false</code> if no radio button of <var>sGroup</var> is checked;
 *   a reference to the checked radio button otherwise
 */
function getCheckedRadio(oForm, sGroup)
{
  var result = null, e, ig;
  if (oForm && (e = oForm.elements) && (ig = e[sGroup]))
  {
    result = false;
    for (var i = ig.length; i--;)
    {
      if (ig[i].checked)
      {
        result = ig[i];
        break;
      }
    }
  }

  return result;
}
DHTML.prototype.getCheckedRadio = getCheckedRadio;

/**
 * Removes all options from a HTMLSelectElement object.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oSelect : HTMLSelectElement
 *   Reference to a HTMLSelectElement object.
 * @param bAllowReload : boolean
 *   If <code>true</code>, reloads the document.
 * @return type boolean
 *   <code>true</code> if successful, <code>false</code>
 *   otherwise.
 */
function removeOptions(oSelect, bAllowReload)
{
  if (oSelect
      && oSelect.tagName
      && oSelect.tagName.toLowerCase() == "select")
  {
    var o = oSelect.options;
    if (o && o.length)
    {
      // shortcut if "length" property is not read-only
      o.length = 0;
      while (o.length > 0)
      {
        if (o.remove)
        {
          o.remove(o.length - 1);
        }
        else
        {
          o[o.length - 1] = null;
          if (bAllowReload)
          {
            history.go(0);
          }
        }
      }
      return true;
    }
  }

  return false;
}
DHTML.prototype.removeOptions = removeOptions;

/**
 * Adds an option to an HTMLSelectElement object.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oSelect : HTMLSelectElement
 *   Required reference to an HTMLSelectElement object.
 * @param sText : string
 *   Required text of the new HTMLOptionElement object.
 * @param iPosition : optional number
 *   Optional. If supported, inserts the new option there;
 *   otherwise the option is appended as last item.
 * @param sValue : optional string
 *   Optional value of the new HTMLOptionElement object.
 * @return type object
 *   A reference to the new option if successful,
 *   <code>null</code> otherwise.
 */
function addOption(oSelect, sText, iPosition, sValue)
{
  if (oSelect
      && oSelect.tagName
      && typeof oSelect.tagName == "string"
      && oSelect.tagName.toLowerCase
      && oSelect.tagName.toLowerCase() == "select")
  {
    var oNew = new Option(sText);

    var o = oSelect.options;
    if (o)
    {
      if (o.add)
      {
        if (arguments.length >= 4
            && typeof oNew.value != "undefined")
        {
          oNew.value = sValue;
        }

        if (arguments.length > 2)
        {
          o.add(oNew, iPosition);
        }
        else
        {
          o.add(oNew);
        }
      }
      else
      {
        o[o.length] = oNew;
        o[o.length - 1].value =
          (arguments.length < 4
            ? ""
            : sValue);
      }

      return oNew;
    }
  }

  return null;
}
DHTML.prototype.addOption = addOption;

/**
 * Select a radio button depending on its value and, optionally,
 * its name.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oForm : HTMLFormElement
 *   Reference to the <code>HTMLFormElement</code> object
 *   which contains the <code>HTMLInputElement</code> object.
 * @param aName : _
 *   Name of the radio button, i.e. the value of the
 *   <code>name</code> attribute of the respective
 *   <code>input</code> (X)HTML element or the value
 *   of the <code>name</code> property of the respective
 *   <code>HTMLInputElement</code> object.  Use an expression
 *   that is evaluated to <code>false</code> for the argument
 *   to be ignored.
 * @param sValue : string
 *   Value of the radio button, i.e. the value of the
 *   <code>value</code> attribute of the respective
 *   <code>input</code> (X)HTML element or the value
 *   of the <code>value</code> property of the respective
 *   <code>HTMLInputElement</code> object.
 */
function selectRadioBtn(oForm, aName, sValue)
{
  for (var i = 0; i < oForm.elements.length; i++)
  {
    var curEl = oForm.elements[i];

    if (!curEl.disabled
        && curEl.type == "radio"
        && (!sName || curEl.name == sName)
        && curEl.value == sValue)
    {
      curEl.checked = true;
    }
  }
}
DHTML.prototype.selectRadioBtn = selectRadioBtn;

/**
 * Disables a form element or a collection of form elements.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument HTMLElement|HTML(Options)Collection oElementGroup
 *   Reference to the <code>HTMLElement</code> or to
 *   the <code>HTML(Options)Collection</code> object.
 * @optional number|string index
 *   Optional number or string to specify
 *   one element within the collection.
 */
function disableElementGroup(oElementGroup, index)
{
  if (oElementGroup)
  {
    if (oElementGroup[index]
        && typeof oElementGroup[index].disabled != "undefined")
    {
      oElementGroup[index].disabled = true;
    }
    else if (typeof oElementGroup.disabled != "undefined")
    {
      oElementGroup.disabled = true;
    }
  }
}
DHTML.prototype.disableElementGroup = disableElementGroup;

/**
 * Disables or enables form controls by name/ID.
 *
 * @param oForm : HTMLFormElement
 *   Reference to the <code>form</code> element object.
 * @param string|HTMLElement
 *   Names/IDs of the elements or references
 *   to the element objects to disable/enable.
 * @param bDisable : optional boolean
 *   If <code>false</code>, elements will be
 *   enabled, otherwise disabled.
 */
function disableElements(oForm)
{
  if (oForm)
  {
    var len = arguments.length - 1, bDisable = arguments[len];
    if (bDisable && typeof bDisable == "boolean")
    {
      len = arguments.length - 2;
    }

    for (var i = 1; i < len; i++)
    {
      var a = arguments[i], o;
      if (typeof a != "object")
      {
        o = oForm.elements[a];
      }
      else
      {
        o = a;
      }

      var len2;
      if (typeof o.disabled != "undefined")
      {
        o.disabled = bDisable;
      }
      else if (typeof (len2 = o.length) != "undefined")
      {
        for (var j = len2; j--; 0)
        {
          var o2;
          if (typeof (o2 = o[j]).disabled != "undefined")
          {
            o2.disabled = bDisable;
          }
        }
      }
    }
  }
}
DHTML.prototype.disableElements = disableElements;

/**
 * Creates an element of the type specified, using the
 * <code>document.createElement()</code> method if supported.
 * This method works with MSIE, too, for if JScript is used,
 * it is tried to use the start tag as is instead of passing
 * only the element type, and adding properties later.
 *
 * @author
 *   (C) 2004, 2006  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param sTag : string
 *   Start tag or element type of the element to be created.
 *   Passing a start tag even works if the UA is not MSIE,
 *   as attributes and values given are parsed from left to
 *   right into the corresponding element object properties.
 * @return type object
 *   A reference to a new <code>Element</code> object with the
 *   <code>nodeName</code> property set to <code>sTagName</code>,
 *   and the <code>localName</code>, <code>prefix</code>,
 *   and <code>namespaceURI</code> properties set to
 *   <code>null</code>.
 * @see
 *   @link{dom2-core#ID-2141741547},
 *   @link{msdn#workshop/author/dhtml/reference/methods/createelement.asp}
 *   http://pointedears.de/scripts/JSdoc/
 */
function createElement(sTag)
{
  var o = null;

  if (sTag
      && typeof document != "undefined"
      && isMethod(document, "createElement"))
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
}
DHTML.prototype.createElement = createElement;

function getFirstChild(o)
{
  var result = null;

  if (o)
  {
    if (o.firstChild)
    {
      result = o.firstChild;
    }
    else if (o.document && o.document.all)
    {
      result = o.document.all(0);
    }
  }

  return result;
}
DHTML.prototype.getFirstChild = getFirstChild;

function getParent(o)
{
  var result = null;

  if (o)
  {
    if (o.parentNode)
    {
      result = o.parentNode;
    }
    else if (o.parentElement)
    {
      result = o.parentElement;
    }
  }

  return result;
}
DHTML.prototype.getParent = getParent;

function getAbsPos(o)
{
  var result = new Object();
  result.x = result.y = 0;
  result.toString = function()
  {
    return "{x: " + this.x + ", y: " + this.y + "}";
  };

  if (o.offsetParent)
  {
    while (o.offsetParent)
    {
      result.x += o.offsetLeft;
      result.y += o.offsetTop;
      o = o.offsetParent;
    }
  }
  else if (typeof o.x != "undefined"
           && typeof o.y != "undefined")
  {
    result.x += o.x;
    result.y += o.y;
  }

  return result;
}

/**
 * Adds an event-handling function (event listener) for a
 * DOM object as event target.  The following methods are
 * used (in order of preference):
 *
 * - addEventListener(...) method (W3C-DOM Level 2)
 * - Assignment to event-handling property (MSIE 4+ and others)
 *
 * The attachEvent(...) method (proprietary to MSIE 5+) is not
 * used anymore because of the arbitrary execution order of
 * event listeners attached with it and because of `this' in
 * the event listener not referring to the event target then.
 * See also http://www.quirksmode.org/blog/archives/2005/08/addevent_consid.html
 *
 * @author
 *   (C) 2004-2008  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o : DOMObject
 *   Reference to the DOM object.
 * @param sEvent : string
 *   Required string to be used as event identifier.
 *   If the addEventListener(...) method is not available,
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @param fListener : Function
 *   Reference to the Function object that provides
 *   event-handling code.  Use <code>null</code> to
 *   detach the event listener if, and only if, the
 *   proprietary event handler property is available.
 * @return type boolean
 *   <code>true</code> on success, <code>false</code> otherwise.
 *   Since addEventListener(...) returns no value and throws
 *   no exceptions (what a bad design!), it is considered to be
 *   successful always, while the new value of the proprietary
 *   event-handling property must match the assigned value for
 *   the method to be successful.
 * @see
 *   dom2-events#Events-EventTarget-addEventListener,
 *   msdn#workshop/author/dhtml/reference/methods/attachevent.asp,
 *   http://pointedears.de/scripts/JSdoc/
 */
function _addEventListener(o, sEvent, fListener)
{
  var t, result = false, sHandler = "on" + sEvent;

  if (o && sEvent && isMethodType((t = typeof fListener))
        && !/^\s*unknown\s*$/i.test(t) && fListener)
  {
    if (isMethod(o, "addEventListener"))
    {
      o.addEventListener(sEvent, fListener, false);
      result = true;
    }
    else if (typeof o[sHandler] != "undefined")
    {
      // NOTE:
      // We don't attempt to use MSHTML's buggy attachEvent() anymore;
      // thanks to Peter-Paul Koch for insight:
      // http://www.quirksmode.org/blog/archives/2005/08/addevent_consid.html

      var oldListener = o[sHandler];

      if (!oldListener || typeof oldListener.listenerList == "undefined")
      {
        var newListener = function(e) {
          if (!e)
          {
            e = (typeof window != "undefined" && window
                 && typeof window.event != "undefined"
                 && window.event);
          }

          var list = arguments.callee.listenerList;

          for (var i = 0, len = list.length; i < len; i++)
          {
            // may be undefined because _replaceEventListener() was applied
            if (list[i])
            {
              list[i].call(this, e);
            }
          }
        };

        newListener.listenerList = [];

        if (oldListener)
        {
          // We don't want dependencies, so no Array.prototype.push() call
          newListener.listenerList[newListener.listenerList.length] =
            oldListener;
        }

        oldListener = newListener;
      }

      oldListener.listenerList[oldListener.listenerList.length] = fListener;

      o[sHandler] = oldListener;

      result = (o[sHandler] == oldListener);
    }
    else
    {
      result = false;
    }
  }

  // break the circular reference created by the closure
  o = null;

  return result;
}
DHTML.prototype.addEventListener = _addEventListener;

/**
 * Adds a capturing event-handling function (event listener) for
 * a DOM object as event target.  Capturing means that the event
 * target receives the event before all other targets, before
 * event bubbling.  The following methods are used (in order of
 * preference):
 * 
 * <ul>
 *   <li>addEventListener(...) method (W3C-DOM Level 2)</li>
 *   <li>TODO: captureEvent(...) method (NS 4)</li>
 * </ul>
 * 
 * @author
 *   (C) 2007  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o : DOMObject
 *   Reference to the DOM object.
 * @param sEvent : string
 *   Required string to be used as event identifier.
 *   If the addEventListener(...) method is not available,
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @param fListener : Function
 *   Reference to the Function object that provides
 *   event-handling code.  Use <code>null</code> to
 *   remove the event handler if, and only if, the
 *   proprietary event-handling property is available.
 * @return type boolean
 *   <code>true</code> on success, <code>false</code> otherwise.
 * @see
 *   dom2-events#Events-EventTarget-addEventListener,
 *   http://pointedears.de/scripts/JSdoc/
 */
function _addEventListenerCapture(o, sEvent, fListener)
{
  var t, result = false;

  if (o && sEvent && isMethodType((t = typeof fListener))
        && !/^\s*unknown\s*$/i.test(t) && fListener)
  {
    if (isMethod(o, "addEventListener"))
    {
      o.addEventListener(sEvent, fListener, true);
      result = true;
    }
    else
    {
      result = false;
    }
  }

  return result;
}
DHTML.prototype.addEventListenerCapture = _addEventListenerCapture;

/**
 * Replaces the event-handling function (event listener) for a
 * DOM object as event target.  The following methods are
 * used (in order of preference):
 *
 * - removeEventListener() and addEventListener(...) methods
 *   (W3C-DOM Level 2)
 * - Assignment to event-handling property (MSIE 4+ and others)
 *
 * Note that this still relies on the existence of the proprietary
 * event-handling property that yields a reference to the (first added)
 * event listener for the respective event.
 *
 * @author
 *   (C) 2007, 2008  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param o : DOMObject
 *   Reference to the DOM object.
 * @param sEvent : string
 *   Required string to be used as event identifier.
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @param fListener : Function
 *   Reference to the Function object that provides
 *   event-handling code.  Use <code>null</code> to
 *   remove the event handler if, and only if, the
 *   proprietary event-handling property is available.
 * @param bUseCapture : optional boolean
 *   Optional. If <code>true</code>, the argument indicates that
 *   the user wishes to initiate capture.  Corresponds to the
 *   third parameter of the addEventListener(...) method, is
 *   ignored if that method is not supported by the DOM (object).
 * @return type boolean
 *   <code>true</code> on success, <code>false</code> otherwise.
 *   Since addEventListener(...) returns no value and throws
 *   no exceptions (what a bad design!), it is considered to be
 *   successful always, while attachEvent(...) returns success
 *   or failure, and the new value of the proprietary
 *   event-handling property must match the assigned value for
 *   the method to be successful.
 * @see
 *   dom2-events#Events-EventTarget-removeEventListener,
 *   dom2-events#Events-EventTarget-addEventListener,
 *   msdn#workshop/author/dhtml/reference/methods/detachevent.asp,
 *   msdn#workshop/author/dhtml/reference/methods/attachevent.asp,
 *   http://pointedears.de/scripts/JSdoc/
 */
function _replaceEventListener(o, sEvent, fListener, bUseCapture)
{
  var result = false, t, sHandler = "on" + sEvent;

  if (o && sEvent && isMethodType((t = typeof fListener))
        && !/^\s*unknown\s*$/i.test(t) && fListener)
  {
    if (isMethod(o, "removeEventListener") && isMethod(o, "addEventListener"))
    {
      if (isMethodType((t = typeof o[sHandler]))
          && !/^\s*unknown\s*$/i.test(t) && o[sHandler])
      {
        var fOldListener = o[sHandler];
        o.removeEventListener(sEvent, fOldListener, !!bUseCapture);
      }

      o.addEventListener(sEvent, fListener, !!bUseCapture);
      result = true;
    }
    else if (typeof o[sHandler] != "undefined")
    {
      o[sHandler] = fListener;
      result = (o[sHandler] == fListener);
    }
  }

  return result;
}
DHTML.prototype.replaceEventListener = _replaceEventListener;

/**
 * Appends a JavaScript include to the <code>head</code> element
 * of an (X)HTML document.
 *
 * Appends the include <code>sURI</code> to the <code>head</code>
 * element of the current (X)HTML document.  (Is not wise to be
 * applied on script files that contain code to append content on
 * the fly (esp. document.write(...)) -- the existing content
 * would be overwritten.)
 *
 * Note: Tested successfully with MSIE and Mozilla/5.0, do not
 * rely on that the script was included, but _test_ for it.
 *
 * @version
 *   0.2.2004053003
 * @author
 *   (C) 2004-2006  Thomas Lahn <dhtml.js@PointedEars.de>,
 *       2004       Ulrich Kritzner <droeppez@web.de>
 *
 * @partof
 *   http://PointedEars.de/scripts/dhtml.js
 * @requires
 *   types.js#isMethod()
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
 */
function loadScript(sURI, sType, sLanguage)
{
  var result = false;

  if (isMethod(document, "createElement"))
  {
    var oScript = document.createElement("script");
    if (oScript)
    {
      // no exception handling for backwards compatibility reasons
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

      if (isMethod(document, "getElementsByTagName"))
      {
        var aHeads = document.getElementsByTagName("head");
      }
      else if (typeof document.all != "undefined" && document.all.tags)
      {
        aHeads = document.all.tags["head"];
      }

      if (aHeads && typeof aHeads[0] != "undefined")
      {
        if (isMethod(aHeads[0], "appendChild"))
        {
          aHeads[0].appendChild(oScript);
          result = (
            typeof aHeads[0].lastChild != "undefined"
            && aHeads[0].lastChild == oScript);
        }
        else if (isMethod(aHeads[0], "insertAdjacentElement"))
        {
          aHeads[0].insertAdjacentElement("beforeEnd", oScript);
          result = true;
        }
      }
    }
  }

  return result;
}
DHTML.prototype.loadScript = loadScript;

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
 * @return type Collection
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
function getElementsByTabIndex(o)
{
  var aIndexedElements = new Array();
  var aUnindexedElements = new Array();

  // makes the method applicable to Document and Element objects
  if (!o
      && typeof this.constructor != "undefined"
      && /Document|Element/.test(this.constructor))
  {
    o = this;
  }

  if (isMethod(o, "getElementsByTagName"))
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
          if (e.tabIndex) // !null && !0
          {
            // tabindex="1" --> index == 0; use e.tabIndex
            // and a "zero dummy" if you do not like this
            aIndexedElements[e.tabindex - 1] = e;
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
}
DHTML.prototype.getElementsByTabIndex = getElementsByTabIndex;

if (typeof HTMLDocument != "undefined"
    && typeof HTMLDocument.prototype != "undefined")
{
  HTMLDocument.prototype.getElementsByTabIndex = getElementsByTabIndex;
}

if (typeof HTMLElement != "undefined"
    && typeof HTMLElement.prototype != "undefined")
{
  HTMLElement.prototype.getElementsByTabIndex = getElementsByTabIndex;
}
