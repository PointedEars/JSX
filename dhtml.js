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
 *       2002-2010 Thomas Lahn <dhtml.js@PointedEars.de>,
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

function DHTML()
{
  this.version   = "0.9.7a.2010111511";
// var dhtmlDocURL = dhtmlPath + "dhtml.htm";
  this.copyright = "Copyright \xA9 2002-2010";
  this.author    = "Thomas Lahn";
  this.email     = "dhtml.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
  this.URI       = this.path + "dhtml.js";
//  this.docURI    = this.path + "dhtml.htm";
  this.allowExceptionMsg = true;

  if (typeof document != "undefined")
  {
    var hasDocumentAll = false;

    this.getElementById = this.getElemById = this.getEBI = this.gEBI = (
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
        else if ((hasDocumentAll = jsx_object.isMethod(document, "all")))
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

    var hasDocumentLayers = false;

    this.getElemByName = this.gEBN = (function() {
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
      else if (hasDocumentAll)
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
      else if ((hasDocumentLayers = (typeof document.layers == "object")))
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

    var hasGetElementsByTagName;

    this.getElemByTagName = this.gEBTN = (function() {
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
          
          if (arguments.length > 2 && typeof i != "number")
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
      else if ((hasGetElementsByTagName =
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
          
          if (arguments.length > 2 && typeof i != "number")
          {
            var tmp = oContextNode;
            oContextNode = index;
            index = tmp;
          }
          else
          {
            oContextNode = document;
          }
          
          if (oContextNode != document
              && !jsx.object.isMethod(oContextNode, "getElementsByTagName"))
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
      else if (hasDocumentAll && isMethod(document.all, "tags"))
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
          if (arguments.length > 2 && typeof i != "number")
          {
            var tmp = oContextNode;
            oContextNode = index;
            index = tmp;
          }
          else
          {
            oContextNode = document;
          }
          
          if (oContextNode != document
              && !jsx.object.isMethod(oContextNode, "all", "tags"))
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

    this.getElemByIndex = this.gEBIdx = (function() {
      function dummy()
      {
        return null;
      }
      
      if (typeof document == "undefined")
      {
        return dummy;
      }
      
      if (hasGetElementsByTagName)
      {
        /**
         * @param index : Number
         * @return Element|null|undefined
         */
        return function(index) {
          return (result = document.getElementsByTagName('*')[index]);
        };
      }
      else if (hasDocumentAll)
      {
        /**
         * @param index : Number
         * @return Element|null|undefined
         */
        return function(index) {
          return document.all(index);
        };
      }
      else if (hasDocumentLayers)
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

  this.getElemByClassName = this.gEBCN = (function() {
    var splice = (
      function() {
        var jsx_object = jsx.object;
         
        if (jsx_object.isMethod(jsx.global, "array_splice"))
        {
          return array_splice;
        }
        else if (typeof Array != "undefined"
                 && jsx_object.isMethod(Array, "prototype", "splice"))
        {
          return function(a, start, del, ins) {
            var proto = Array.prototype;
            ins = proto.slice.call(arguments, 3);
            return proto.splice.apply(a, [start, del].concat(ins));
          };
        }
        else
        {
          return function(a, start, del, ins) {
            var aDeleted = new Array();
            
            for (var i = start + del, len = a.length; i < len; i++)
            {
              aDeleted[aDeleted.length] = a[i - del];
              a[i - del] = a[i];
            }
            
            a.length = len - del;
            
            for (i = 3, len = arguments.length; i < len; i++)
            {
              a[a.length] = arguments[i];
            }
            
            return aDeleted;
          };
        }
      }
    ());

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

  /*
   * Apart from isNS4DOM, none of these object-inference properties is used
   * anymore; they are still here for backwards compatibility only
   */
  this.isW3CDOM = jsx.object.isMethod(document, "getElementById");
  this.isOpera  = typeof window.opera != "undefined";
  this.isNS4DOM = typeof document.layers != "undefined";
  this.isIE4DOM  = typeof document.all == "object" && !this.isOpera;
  this.supported = this.isW3CDOM || this.isNS4DOM || this.isOpera
    || this.isIE4DOM;

  /* DOM preselection (why?) */
  this.W3CDOM = 3;
  this.IE4DOM = 2;
  this.NS4DOM = 1;
  this.DOM = this.supported
    && (this.isW3CDOM && this.W3CDOM)
    || (this.isIE4DOM && this.IE4DOM)
    || (this.isNS4DOM && this.NS4DOM);
}

/* a more compatible approach */
if (typeof dom == "undefined")
{
  var dom = new Object();
}

/* imports from object.js */
dom.objectPath = "/scripts/object.js";

if (typeof jsx != "undefined"
    && typeof jsx.object != "undefined"
    && typeof jsx.object.isMethod != "undefined")
{
  /* for backwards compatibility only */
  DHTML.prototype.isMethod = jsx.object.isMethod;
  DHTML.prototype.isMethodType = jsx.object.isMethodType;
}
else
{
  var msg = "isMethod() was not defined";
  if (loadScript(dom.objectPath))
  {
    if (typeof console.warn != "undefined")
    {
      console.warn(msg + ", successfully loaded " + dom.objectPath);
    }
  }
  else
  {
    console.warn(msg + ", could not load " + dom.objectPath);
  }
}

/* discard previously referred object */
var dhtml = dom = new DHTML();

/* a more compatible approach */
if (typeof jsx == "undefined")
{
  var jsx = new Object();
}
jsx.dom = jsx.dhtml = dom;

/* allows for de.pointedears.jsx.dhtml */
if (typeof de == "undefined")
{
  var de = new Object();
}

if (typeof de.pointedears == "undefined")
{
  de.pointedears = new Object();
}

if (typeof de.pointedears.jsx == "undefined")
{
  de.pointedears.jsx = jsx;
}

de.pointedears.jsx.dom = de.pointedears.jsx.dhtml = dom;

/**
 * Shows an exception alert and allows for
 * displaying a stack trace.
 *
 * @param sMessage : optional string = ""
 *   Error message to be displayed.
 * @return boolean
 *   Always <code>false</code>
 */
function DHTMLException(sMessage)
{
  /* Prevent exceptions from "bubbling" on (keyboard) event */
  if (!jsx.dhtml.allowExceptionMsg)
  {
    return false;
  }
  
  jsx.dhtml.allowExceptionMsg = false;

  jsx.setErrorHandler();
  var stackTrace =
    jsx.object.isMethod(_global, "Error") && (new Error()).stack || "";
  
  jsx.clearErrorHandler();

  alert(
    "dhtml.js "
      + jsx.dhtml.version + "\n"
      + jsx.dhtml.copyright + "  "
      + jsx.dhtml.author + " <" + jsx.dhtml.email + ">\n"
      + 'The latest version can be obtained from:\n'
      + "<" + jsx.dhtml.URI + ">\n\n"
      + sMessage + "\n"
      + "__________________________________________________________\n"
      + "Stack trace"
      + (stackTrace
          ? ":\n\n" + stackTrace
          : " not available in this DOM."));

  jsx.dhtml.allowExceptionMsg = true;
  return false;
}
DHTML.prototype.DHTMLException = DHTMLException;

jsx.dhtml.write = function(s) {
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
          
          if (scripts.length)
          {
            var lastScript = scripts[scripts.length - 1];
            if (lastScript)
            {
              result2 = !!lastScript.parentNode.insertBefore(
                document.createTextNode(s), lastScript.nextSibling);
            }
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
function getElem(sType, sValue, index)
{
  /**
   * Calls DHTMLException() for an invalid type.
   */
  function invalidType()
  {
    jsx.dhtml.DHTMLException(
        'getElem: Invalid type "' + sType + '"\n'
      + 'Must be one of "id", "name", "tagname", "index" or "classname"'
      + ' (case-insensitive).');
  }

  if (!sType || typeof sType != "string" || !sType.toLowerCase)
  {
    jsx.dhtml.DHTMLException(
        "getElem: Invalid type: " + sType + "\n"
      + "Must be String.");
  }

  if (!sValue || typeof sValue != "string")
  {
    jsx.dhtml.DHTMLException(
        "getElem: Invalid value: " + sValue + "\n"
      + "Must be String.");
  }

  var o = null;

  switch ((sType = sType.toLowerCase()))
  {
    case 'id':
    case 'index':
    case 'classname':
      o = dom["getElemBy" + {
        id:        "Id",
        index:     "Index",
        classname: "ClassName"
      }[sType]](sValue);
      break;

    case 'name':
    case 'tagname':
      o = dom["getElemBy" + {
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
function getCont(oElement, bHTML)
{
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
}
DHTML.prototype.getCont = getCont;

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
function setCont(oElement, sNodeValue)
{
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
    else if (jsx.dhtml.isNS4DOM
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
 * @param bGetHTML : optional boolean
 *   If <code>true</code>, returns the HTML content instead of
 *   the text content in case the latter cannot be retrieved.
 * @return string
 *   The text content of @{(oNode)}.
 * @todo Duplicate of getCont(..., false)?
 */
function getContent(oNode, bGetHTML)
{
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
}
DHTML.prototype.getContent = getContent;

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
function setTextContent(oNode, sContent)
{
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
}
DHTML.prototype.setTextContent = setTextContent;

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
function getAttr(oElement, sAttrName)
{
  var result = "";

  if (oElement)
  {
    if (jsx.object.isMethod(oElement, "getAttribute"))
    {
      result = oElement.getAttribute(sAttrName);
    }
    else if (jsx.dhtml.isNS4DOM)
    {
      result = oElement[sAttrName];
    }
  }

  return result;
}
DHTML.prototype.getAttr = getAttr;

DHTML.prototype.camelize = (function() {
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
        else
        {
          i = this.indexOf(searchValue);
          if (i > -1)
          {
            return replaceValue(String(searchValue), i, this);
          }
          
          return this;
        }
      }
      else
      {
        return origReplace.apply(this, arguments);
      }
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
    else
    {
      var s2 = sProperty.replace(/-([a-z])/gi, f);
      cache.put(sProperty, s2);
      return s2;
    }
  };
})();

DHTML.prototype.attrMap = {
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
function setAttr(o, sAttrName, attrValue)
{
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
      hyphenatedToCamelCase = jsx.dhtml.camelize,

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

          jsx.dhtml.setStyleProperty(o, stylePropName,
            strToValue(stylePair[1]));
          result = jsx.dhtml.getStyleProperty(o, stylePropName);
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
 * Returns the computed style of an {@link Element} or the
 * computed value of an <code>Element</code>'s style property.
 * 
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
var _getComputedStyle = (function () {
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
DHTML.prototype.getComputedStyle = _getComputedStyle;

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
function addClassName(o, sClassName, bRemove)
{
  var rx = new RegExp("(^\\s*|\\s+)" + sClassName + "(\\s*$|\\s)");
  
  if (bRemove)
  {
    this.removeClassName(o, sClassName);
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
}
DHTML.prototype.addClassName = addClassName;

/**
 * Removes all occurences of a CSS class name from the
 * <code>class</code> attribute of an {@link Element}.
 * 
 * @param o : Element
 * @param sClass : string
 */
var removeClassName = function (o, sClassName) {
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
DHTML.prototype.removeClassName = removeClassName;

/**
 * Schedules code for later execution.
 * 
 * @param code : String|Function
 *   Code to be executed or function to be called.
 * @param iTimeout : number
 *   Number of milliseconds after which <var>code</var> should be run.
 */
var runLater = function (code, iTimeout) {
  if (typeof window != "undefined"
      && jsx.object.isMethod(window, "setTimeout"))
  {
    return window.setTimeout(code, iTimeout);
  }
  
  return Number.NaN;
};
DHTML.prototype.runLater = runLater;

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
function getStyleProperty(oElement, sPropertyName)
{
  if (oElement)
  {
    sPropertyName = jsx.dhtml.camelize(sPropertyName);

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
}
DHTML.prototype.getStyleProperty = getStyleProperty;

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
function hasStyleProperty(oElement, sPropertyName)
{
  return (jsx.dhtml.getStyleProperty(oElement, sPropertyName) != null);
}
DHTML.prototype.hasStyleProperty = hasStyleProperty;

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
function setStyleProperty(oElement, sPropertyName, propValue, altValue)
{
  if (oElement)
  {
    sPropertyName = jsx.dhtml.camelize(sPropertyName);

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
}
DHTML.prototype.setStyleProperty = setStyleProperty;

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
function display(oElement, bShow)
{
  var result;

  if (oElement)
  {
    if (arguments.length > 1)
    {
      result = jsx.dhtml.setStyleProperty(oElement, "display",
        bShow ? ""     : "none",
        bShow ? "show" : "hide");
    }
    else
    {
      result = /^(\s*|show)$/.test(jsx.dhtml.getStyleProperty(oElement, "display"));
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
function visible(oElement, bVisible)
{
  var result;

  if (oElement)
  {
    if (arguments.length > 1)
    {
      result = jsx.dhtml.setStyleProperty(oElement, "visibility",
        bVisible ? "visible" : "hidden",
        bVisible ? "show" : "hide");
    }
    else
    {
      result = /^(visible|show)$/.test(
        jsx.dhtml.getStyleProperty(oElement, "visibility"));
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
 * @return boolean
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
 * @param imgID : Number|String
 * @param state : optional Number
 * @return boolean
 *   The return value of {@link #setStyleProperty} for setting the
 *   borderColor of the image
 */
function hoverImg(imgID, state)
{
  var img = null;

  if (document.images)
  {
    img = document.images[imgID];
  }

  return jsx.dhtml.setStyleProperty(img, "borderColor",
    (state == 0 ? hoverImg.clMouseout : hoverImg.clMouseover));
}
hoverImg.clMouseout = "#000";
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
 * @return boolean
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
      /* shortcut if "length" property is not read-only */
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
 * @return object
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
 *   (C) 2003, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oElementGroup : HTMLElement|HTML(Options)Collection
 *   Reference to the <code>HTMLElement</code> or to
 *   the <code>HTML(Options)Collection</code> object.
 * @param index : optional Number|String
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
 * @params String|HTMLElement
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

var serializeForm = (function() {
  var
    rxSubmit = /(^|\s)(submit|image)(\s|$)/i,
    rxSelect = /(^|\s)(select(-one)?|undefined)(\s|$)/i,
    rxFileReset = /^\s*(file|reset)\s*$/i,
    rxObject = /^\s*object\s*$/i;
  
  /**
   * @param form : HTMLFormElement
   * @param submitButton : optional HTMLInputElement
   *   Reference to the submit button that should be successful.
   *   By default, only the first submit button is successful.
   * @return string
   *   The serialization of this form
   */
  return function(form, submitButton) {
    /**
     * @param control : HTMLSelectElement|HTMLInputElement|HTMLTextAreaElement|HTMLButtonElement
     */
    function serializeControl(control)
    {
      /* HTML 4.01: Controls that are disabled cannot be successful. */
      if (control.disabled)
      {
        return;
      }
      
      /*
       * If a form contains more than one submit button,
       * only the activated submit button is successful.
       * (here: the first one or the specified one)
       */
      var isSubmit = rxSubmit.test(control.type);
      if ((!gotSubmit && !submitButton || control != submitButton) || !isSubmit)
      {
        if (isSubmit)
        {
          gotSubmit = true;
        }
        
        /*
         * For menus, the control name is provided by a SELECT element
         * and values are provided by OPTION elements. Only selected
         * options may be successful. When no options are selected,
         * the control is not successful and neither the name nor any
         * values are submitted to the server when the form is submitted.
         */
        var m = rxSelect.exec(control.type);
        if (m)
        {
          /* select-one */
          if (m[3])
          {
            if (control.selectedIndex > -1)
            {
              /*
               * MSHTML 6 is buggy with <option>foo</option>;
               * always provide a `value' attribute!
               */
              items.add(control.name, control.options[control.selectedIndex].value);
            }
          }
          
          /* select */
          else if (m[2])
          {
            for (var i = 0, opts = control.options, len = opts && opts.length; i < len; i++)
            {
              var opt = opts[i];
              if (opt.selected)
              {
                /*
                 * MSHTML 6 is buggy with <option>foo</option>;
                 * always provide a `value' attribute!
                 */
                items.add(control.name, opt.value);
              }
            }
          }
        }
        
        /*
         * All "on" checkboxes may be successful.
         * For radio buttons that share the same value of the
         * name attribute, only the "on" radio button may be successful.
         */
        else if (!rxFileReset.test(control.type)
                  && !(rxObject.test(control.tagName) && control.declare)
                  && !/^\s*(checkbox|radio)\s*$/i.test(control.type)
                  || control.checked)
        {
          items.add(control.name, control.value);
        }
      }
    }
        
    var es = getFeature(form, "elements");
    if (!es)
    {
      return "";
    }

    var items = [];
    
    items.add = function(sName, sValue) {
      var s = esc(sName) + "=" + esc(sValue);
      this.push(s);
    };
    
    if (!jsx.object.isMethod(items, "push"))
    {
      items.push = function() {
        for (var i = 0, len = arguments.length; i < len; i++)
        {
          this[this.length] = arguments[i];
        }
      };
    }
    
    var gotSubmit = false;

    for (var i = 0, len = es.length; i < len; i++)
    {
      var e = es[i];
      
      /*
       * Elements with the same name create a NodeList object,
       * however options of select objects are also indexable in Gecko.
       */
      if (typeof e[0] != "undefined" && typeof e.options == "undefined")
      {
        for (var j = 0, len2 = e.length; j < len2; j++)
        {
          serializeControl(e[j]);
        }
      }
      else
      {
        serializeControl(e);
      }
    }
    
    return items.join("&");
  };
})();

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
function createElement(sTag)
{
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
}
DHTML.prototype.createElement = createElement;

function html2nodes(sHTML)
{
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
}

dom.HTMLSerializer = (
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
      else
      {
        return oNode.textContent;
      }
    };
  })()
});

function getFirstChild(oNode)
{
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
}
DHTML.prototype.getFirstChild = getFirstChild;

function getParent(oNode)
{
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
}
DHTML.prototype.getParent = getParent;

function getAbsPos(oNode)
{
  var result = new Object();
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
}

/**
 * Adds an event-handling function (event listener) for a
 * DOM object as event target.  The following methods are
 * used (in order of preference):
 *
 * <ul>
 *   <li>addEventListener(...) method (W3C-DOM Level 2 Events)</li>
 *   <li>Assignment to event-handling property (MSIE 4+ and others)</li>
 * </ul>
 *
 * The attachEvent(...) method (proprietary to MSIE 5+) is not
 * used anymore because of the arbitrary execution order of
 * event listeners attached with it and because of `this' in
 * the event listener not referring to the event target then.
 *
 * @author
 *   (C) 2004-2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   <a href="http://pointedears.de/scripts/dhtml.js">dhtml.js</a>
 * @param oNode : Object
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
 * @return Object
 *   A reference to the added listener on success,
 *   <code>null</code> otherwise.
 *   Since addEventListener(...) returns no value and throws
 *   no exceptions (what a bad design!), it is considered to be
 *   successful always, while the new value of the proprietary
 *   event-handling property must match the assigned value for
 *   the method to be successful.
 * @see <a href="http://www.quirksmode.org/blog/archives/2005/08/addevent_consid.html">QuirksBlog: addEvent() considered harmful (2005-08 CE)</a>
 * @see <a href="dom2-events#Events-EventTarget-addEventListener">W3C DOM Level 2 Events: EventTarget::addEventListener</a>
 * @see <a href="msdn#workshop/author/dhtml/reference/methods/attachevent.asp">MSDN Library: attachEvent()</a>
 */
function _addEventListener(oNode, sEvent, fListener)
{
  var
    jsx_object = jsx.object,
    result = false,
    sHandler = "on" + sEvent;

  if (oNode && sEvent && jsx_object.isMethod(fListener))
  {
    if (jsx_object.isMethod(oNode, "addEventListener"))
    {
      oNode.addEventListener(sEvent, fListener, false);
      result = fListener;
    }
    else
    {
      /*
       * NOTE:
       * No more bogus feature tests here; MSHTML yields `null' for unset
       * listeners, Gecko yields `undefined'.
       * 
       * We also don't attempt to use MSHTML's buggy attachEvent() anymore;
       * thanks to Peter-Paul Koch for insight:
       * http://www.quirksmode.org/blog/archives/2005/08/addevent_consid.html
       */

      var oldListener = oNode[sHandler];

      if (!oldListener || typeof oldListener._listeners == "undefined")
      {
        var newListener = function(e) {
          if (!e)
          {
            e = (typeof window != "undefined" && window
                 && typeof window.event != "undefined"
                 && window.event);
          }

          var
            listeners = arguments.callee._listeners,
            fpCall = Function.prototype.call;

          for (var i = 0, len = listeners.length; i < len; i++)
          {
            /* May be undefined because _replaceEventListener() was applied */
            if (jsx_object.isMethod(listeners[i]))
            {
              /* Host object's methods need not implement call() */
              fpCall.call(listeners[i], this, e);
            }
          }
        };

        newListener._listeners = [];

        if (oldListener)
        {
          /* Avoid dependencies, so no Array.prototype.push() call */
          listeners = newListener._listeners;
          listeners[listeners.length] = oldListener;
        }

        oldListener = newListener;
      }

      listeners = oldListener._listeners;
      listeners[listeners.length] = fListener;

      /* TODO: Why this way? */
      oNode[sHandler] = oldListener;

      result = (oNode[sHandler] == oldListener) && oldListener || null;
    }
  }

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
 *   <li>addEventListener(...) method (W3C DOM Level 2 Events)</li>
 *   <li>TODO: captureEvent(...) method (NS 4)</li>
 * </ul>
 * 
 * @author
 *   (C) 2007-2010 Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oNode : Node
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
 * @return boolean
 *   <code>true</code> on success, <code>false</code> otherwise.
 * @see <a href="dom2-events#Events-EventTarget-addEventListener">W3C DOM Level 2 Events: EventTarget::addEventListener()</a>
 */
function _addEventListenerCapture(oNode, sEvent, fListener)
{
  if (oNode && sEvent && jsx.object.isMethod(fListener))
  {
    oNode.addEventListener(sEvent, fListener, true);
    return true;
  }

  return false;
}
DHTML.prototype.addEventListenerCapture = _addEventListenerCapture;

/**
 * Replaces the event-handling function (event listener) for a
 * DOM object as event target.  The following methods are
 * used (in order of preference):
 * 
 * <ul>
 *   <li>removeEventListener() and addEventListener(...) methods
 *   (W3C-DOM Level 2)</li>
 *   <li>Assignment to event-handling property (MSIE 4+ and others)</li>
 * </ul>
 * 
 * Note that this still relies on the existence of the proprietary
 * event-handling property that yields a reference to the (first added)
 * event listener for the respective event.
 *
 * @author
 *   (C) 2007-2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oNode : Node
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
 * @return boolean
 *   <code>true</code> on success, <code>false</code> otherwise.
 *   Since addEventListener(...) returns no value and throws
 *   no exceptions, it is considered to be
 *   successful always, while the new value of the proprietary
 *   event-handling property must match the assigned value for
 *   the method to be successful.
 * @see <a href="dom2-events#Events-EventTarget-removeEventListener">W3C DOM Level 2 Events: EventTarget::removeEventListener()</a>
 * @see <a href="dom2-events#Events-EventTarget-addEventListener">W3C DOM Level 2 Events: EventTarget::addEventListener()</a>
 */
function _replaceEventListener(oNode, sEvent, fListener, bUseCapture)
{
  var
    jsx_object = jsx.object,
    result = false,
    sHandler = "on" + sEvent;

  if (oNode && sEvent && jsx_object.isMethod(fListener))
  {
    if (jsx_object.areMethods(oNode, ["removeEventListener", "addEventListener"]))
    {
      if (jsx_object.isMethod(oNode[sHandler]))
      {
        var fOldListener = oNode[sHandler];
        oNode.removeEventListener(sEvent, fOldListener, !!bUseCapture);
      }

      oNode.addEventListener(sEvent, fListener, !!bUseCapture);
      result = true;
    }
    else
    {
      oNode[sHandler] = fListener;
      result = (oNode[sHandler] == fListener);
    }
  }

  return result;
}
DHTML.prototype.replaceEventListener = _replaceEventListener;

/**
 * Removes an event-handling function (event listener) for a
 * DOM object as event target.
 * <ul>
 *   <li>removeEventListener() and addEventListener(...) methods
 *   (W3C-DOM Level 2)</li>
 *   <li>Assignment to event-handling property (MSIE 4+ and others)</li>
 * </ul>
 * 
 * Note that this still relies on the existence of the proprietary
 * event-handling property that yields a reference to the (first added)
 * event listener for the respective event.
 *
 * @author
 *   (C) 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @param oNode : Node
 *   Reference to the DOM object.
 * @param sEvent : string
 *   Required string to be used as event identifier.
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @param fListener : Function
 *   Reference to the Function object that provides
 *   event-handling code.  Is ignored to (re)set the
 *   proprietary event-handling property if available.
 * @param bUseCapture : optional boolean
 *   Optional. If <code>true</code>, the argument indicates that
 *   the user wished to initiate capture.  Corresponds to the
 *   third parameter of the removeEventListener(...) method, is
 *   ignored if that method is not supported by the DOM (object).
 * @return boolean
 *   <code>true</code> on success, <code>false</code> otherwise.
 *   Since removeEventListener(...) returns no value and throws
 *   no exceptions (what a bad design!), it is considered to be
 *   successful always, while attachEvent(...) returns success
 *   or failure, and the new value of the proprietary
 *   event-handling property must be <code>null</code> for
 *   the method to be successful.
 * @see <a href="dom2-events#Events-EventTarget-removeEventListener">W3C DOM Level 2 Events: EventTarget::removeEventListener()</a>
 * @see <a href="msdn#workshop/author/dhtml/reference/methods/detachevent.asp">MSDN Library: detachEvent()</a>
 */
function _removeEventListener(oNode, sEvent, fListener, bUseCapture)
{
  var
    result = false,
    jsx_object = jsx.object,
    sHandler = "on" + sEvent;

  if (oNode && sEvent)
  {
    if (jsx_object.isMethod(fListener))
    {
      if (jsx_object.isMethod(oNode, "removeEventListener"))
      {
        oNode.removeEventListener(sEvent, fListener, bUseCapture);
        return true;
      }
    }

    if (jsx_object.isMethod(oNode, sHandler))
    {
      var
        handler = oNode[sHandler],
        listeners = handler._listeners;
      
      if (listeners)
      {
        for (var i = listeners.length; i--;)
        {
          if (listeners[i] == fListener)
          {
            delete listeners[i];
            result = (typeof listeners[i] == "undefined");
          }
        }
      }
      else
      {
        handler = oNode[sHandler] = null;
        result = (handler == null);
      }
    }
  }

  return result;
}
DHTML.prototype.removeEventListener = _removeEventListener;

/**
 * Returns a reference to a <code>Function</code> that can be used as event listener.
 * Differences between DOM implementations are smoothed out as much as
 * possible (e.g., the first argument of that function will be a reference
 * to the <code>Event</code> instance regardless if the DOM implementation passes it,
 * and you can use the <code>target</code> property even if
 * the DOM implementation supports <code>srcElement</code> instead.)
 * 
 * @param f : Callable
 *   Reference to the object that contains the actual listener code
 * @return Function
 *   A reference to a <code>Function</code> that can be used as event listener.
 */
function _createEventListener(f)
{
  var jsx_object = jsx.object;
  
  function listener(e)
  {
    if (typeof e == "undefined"
      && typeof window != "undefined"
      && typeof window.event != "undefined"
      && window.event)
    {
      e = window.event;
    }

    /*
     * NOTE: Should not augment host objects, and cannot inherit from Events,
     * so values need to be copied
     */
    var e2 = {originalEvent: e};
    var properties = ["type", "charCode", "keyCode",
                      "shiftKey", "ctrlKey", "altKey", "metaKey"];
    for (var i = properties.length; i--;)
    {
      var property = properties[i];
      e2[property] = e[property];
    }
    
    /* FIXME: addProperties() does not work well with host objects */
    e2.getProperty = function(p) {
      return e[p];
    };

    e2.target = (typeof e.target != "undefined")
              ? e.target
              : (typeof e.srcElement != "undefined")
                  ? e.srcElement
                  : null,
  
    e2.stopPropagation = (function(e) {
      if (jsx_object.isMethod(e, "stopPropagation"))
      {
        return function() {
          e.stopPropagation();
        };
      }
      else if (typeof e.cancelBubble != "undefined")
      {
        return function() {
          e.cancelBubble = true;
        };
      }
    })(e);

    e2.preventDefault = (function(e) {
      if (jsx_object.isMethod(e, "preventDefault"))
      {
        return function() {
          return e.preventDefault();
        };
      }
      else if (typeof e.returnValue != "undefined")
      {
        return function() {
          e.returnValue = false;
        };
      }
    })(e);
    
    e2.initEvent = (function() {
      if (jsx_object.isMethod(e, "initEvent"))
      {
        return function(eventTypeArg, canBubbleArg, cancelableArg) {
          return e.initEvent(eventTypeArg, canBubbleArg, cancelableArg);
        };
      }
      else
      {
        return function() {};
      }
    })();

    return f(e2);
  }
  
  /* Strict W3C DOM Level 2 Events compatibility */
  listener.handleEvent = function(e) {
    return this(e);
  };
  
  return listener;
}
DHTML.prototype.createEventListener = _createEventListener;

/**
 * Prevents the default action for an event.
 * 
 * @param e : Event
 * @return boolean
 *   <code>true</code> if <var>e</var> is not a valid value,
 *   <code>false</code> otherwise.  The return value of this
 *   method can be used to return a value to the event-handler.
 */
jsx.dhtml.preventDefault = function(e) {
  if (!e)
  {
    return true;
  }
  
  if (jsx.object.isMethod(e, "preventDefault"))
  {
    e.preventDefault();
  }
    
  if (typeof e.returnValue != "undefined")
  {
    e.returnValue = false;
  }
  
  return false;
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
function loadScript(sURI, sType, sLanguage, bReload)
{
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

  var oHead = dom.getElemByTagName("head", 0);
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
      me.registry = new Object();
    }
    
    me.registry[sURI] = true;
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
function getElementsByTabIndex(o)
{
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
}
DHTML.prototype.getElementsByTabIndex = getElementsByTabIndex;

if (typeof jsx.types != "undefined"
    && jsx.types.isFeature("HTMLDocument", "prototype")
    && !jsx.object.isMethod(HTMLDocument.prototype, "getElementsByTabIndex"))
{
  HTMLDocument.prototype.getElementsByTabIndex = dom.getElementsByTabIndex;
}

if (typeof jsx.types != "undefined"
    && jsx.types.isFeature("HTMLElement", "prototype")
    && !jsx.object.isMethod(HTMLElement.prototype, "getElementsByTabIndex"))
{
  HTMLElement.prototype.getElementsByTabIndex = dom.getElementsByTabIndex;
}