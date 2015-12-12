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

/**
 * @namespace
 */
jsx.dom = (/** @constructor */ function () {
  /* Imports */
  var _jsx_object = jsx.object;
  var _isMethod = _jsx_object.isMethod;
  var _isHostMethod = _jsx_object.isHostMethod;
  var _getKeys = _jsx_object.getKeys;
  var _isArray = _jsx_object.isArray;

  /* Private variables */
  var _hasDocumentAll = false;
  var _hasDocumentLayers = false;
  var _hasGetElementsByTagName = false;

  function _dummy()
  {
    return null;
  }

  var _getElementById = (function () {
    if (typeof document == "undefined")
    {
      return _dummy;
    }

    if (_isMethod(document, "getElementById"))
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

    if ((_hasDocumentAll = _isMethod(document, "all")))
    {
      return function (sId) {
        return document.all(sId);
      };
    }

    return function (sId) {
        return document[sId];
    };
  }());

  var _getElementsByName = (function () {
    if (typeof document == "undefined")
    {
      return _dummy;
    }

    if (_isMethod(document, "getElementsByName"))
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
    else if (_hasDocumentAll)
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
    else if ((_hasDocumentLayers = (typeof document.layers == "object")))
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

    return _dummy;
  }());

  var _getElementsByTagName = (function () {
    if (_jsx_object.isNativeMethod(jsx, "xpath", "evaluate"))
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

    if ((_hasGetElementsByTagName =
          (typeof document != "undefined"
            && _isMethod(document, "getElementsByTagName"))))
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

        if (!_isMethod(oContextNode, "getElementsByTagName"))
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

    if (_hasDocumentAll && _isMethod(document.all, "tags"))
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

        if (!_isMethod(oContextNode, "all", "tags"))
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
  }());

  var _getElementByIndex = (function () {
    if (typeof document == "undefined")
    {
      return _dummy;
    }

    if (_hasGetElementsByTagName)
    {
      /**
       * @param {number} index
       * @return Element|Null|Undefined
       */
      return function (index) {
        return document.getElementsByTagName('*')[index];
      };
    }

    if (_hasDocumentAll)
    {
      /**
       * @param {number} index
       * @return Element|Null|Undefined
       */
      return function (index) {
        return document.all(index);
      };
    }

    if (_hasDocumentLayers)
    {
      /**
       * @param {number} index
       * @return Layer|Null|Undefined
       */
      return function (index) {
        return document.layers[index];
      };
    }

    return _dummy;
  }());

  var _attrMap = {
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
  function _setAttr (o, sAttrName, attrValue)
  {
    var result = "";

    if (o && sAttrName)
    {
      /* camel-case specific attribute names */
      if (typeof _attrMap[sAttrName] != "undefined")
      {
        sAttrName = _attrMap[sAttrName];
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
  }

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
   * @param {Array|Object} data
   * @return TextNode|Array[Node]|Element
   */
  function _createNodesFromObj (data)
  {
    if (typeof data.valueOf() == "string")
    {
      return document.createTextNode(data);
    }

    /* Support ES5 strict mode */
    var me = _createNodesFromObj;

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

    var attributes = data.attributes;
    if (attributes && _isHostMethod(el, "setAttribute"))
    {
      var keys = _getKeys(attributes);

      for (i = 0, len = keys.length; i < len; ++i)
      {
        var attrName = keys[i];
        el.setAttribute(attrName, attributes[attrName]);
      }
    }

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
            for (var j = 0, len2 = styleKeys.length; j < len2; ++j)
            {
              var stylePropName = styleKeys[j];
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
    for (i = 0, len = nodes && nodes.length; i < len; ++i)
    {
      el.appendChild(me(nodes[i]));
    }

    return el;
  }

  /**
   * Adds a class name to the <code>class</code> attribute of
   * an {@link Element}.
   *
   * @param {Element} o
   * @param {string} sClassName
   * @return {boolean}
   *   <code>true</code> if the class name could be added successfully or
   *   was already there, <code>false</code> otherwise.
   */
  function _hasClassName (o, sClassName)
  {
    if (sClassName)
    {
      if (_isHostMethod(o, "classList", "contains"))
      {
        /* W3C DOM Level 4 */
        return o.classList.contains(sClassName);
      }

      var rx = new RegExp("(^\\s*|\\s+)" + sClassName + "(\\s*$|\\s)");
      return rx.test(sClassName);
    }
  }

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
  function _removeClassName (o, sClassName)
  {
    if (_isHostMethod(o, "classList", "remove"))
    {
      /* W3C DOM Level 4 */
      o.classList.remove(sClassName);
    }
    else
    {
      var curClassNames = o.className;
      var newClassNames = curClassNames.replace(
        new RegExp(("(^\\s*|\\s+)" + sClassName + "(\\s*$|(\\s))"), "g"),
        "$3");
      o.className = newClassNames;

      if (!newClassNames && _isMethod(o, "removeAttribute"))
      {
        o.removeAttribute("class");
      }
    }

    return !_hasClassName(o, sClassName);
  }

  /**
   * Appends a child node to a parent node.
   *
   * @param {Node} parentNode
   * @param {Node} childNode
   * @return {boolean}
   *   <code>true</code> on success, <code>false</code> otherwise.
   */
  function _appendChild (parentNode, childNode)
  {
    if (parentNode)
    {
      if (_isMethod(parentNode, "appendChild"))
      {
        parentNode.appendChild(childNode);
        return true;
      }
      else if (_isMethod(parentNode, "insertAdjacentElement"))
      {
        parentNode.insertAdjacentElement("beforeEnd", childNode);
        return true;
      }
    }

    return false;
  }

  function _insertBefore (parentNode, newChild, refChild)
  {
    if (parentNode)
    {
      if (_isMethod(parentNode, "insertBefore"))
      {
        /* W3C DOM */
        parentNode.insertBefore(newChild, refChild);
        return true;
      }

      /* MSHTML 4 DOM */
      if (refChild)
      {
        if (_isMethod(refChild, "insertAdjacentElement"))
        {
          refChild.insertAdjacentElement("beforeBegin", newChild);
          return true;
        }
      }
      else
      {
        if (_isMethod(parentNode, "insertAdjacentElement"))
        {
          parentNode.insertAdjacentElement("afterBegin", newChild);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Removes a child node from a parent node.
   *
   * @param {Node} parentNode
   * @param {Node} childNode
   * @return {boolean}
   *   <code>true</code> on success, <code>false</code> otherwise.
   */
  function _removeChild (parentNode, childNode)
  {
    if (parentNode)
    {
      if (_isMethod(parentNode, "removeChild"))
      {
        /* W3C DOM */
        parentNode.removeChild(childNode);
        return true;
      }
      else if (_isMethod(childNode, "removeNode"))
      {
        /* MSHTML 4 DOM */
        childNode.removeNode(true);
        return true;
      }
    }

    return false;
  }

  /**
   * Exception thrown if an invalid Node reference is passed
   *
   * @function
   */
  var _InvalidNodeError = (function (contextNode) {
    jsx.Error.call(this, contextNode);
  }).extend(jsx.Error, {
    name: "jsx.dom.InvalidNodeError"
  });

  function jsx_dom_collectNamespaces (namespaces, contextNode) {
    var me = jsx_dom_collectNamespaces;

    if (!namespaces)
    {
      jsx.warn("`namespaces' is not convertible to an Object; argument is not modified.");
      namespaces = {};
    }

    /* Scan entire document by default */
    if (!contextNode)
    {
      contextNode = document.documentElement;
    }

    /* if DOCUMENT_NODE, use root element */
    if (contextNode.nodeType == 9)
    {
      contextNode = contextNode.documentElement;
    }

    if (!contextNode || contextNode.nodeType != 1)
    {
      jsx.throwThis(_InvalidNodeError, contextNode);
      return null;
    }

    for (var i = 0, attribs = contextNode.attributes, len = attribs && attribs.length;
         i < len;
         ++i)
    {
      var attr = attribs[i];
      var attr_name = attr.name;
      var matches;

      if ((matches = String(attr_name).match(/^xmlns($|:(.+))/)))
      {
        var original_prefix = matches[2];
        var prefix = original_prefix || "_";

        if (typeof namespaces[prefix] == "undefined")
        {
          var attr_value = attr.value;

          /*
           * Default NS declaration with empty value means _no_ namespace,
           * see <http://www.w3.org/TR/REC-xml-names/#defaulting>
           */
          if (!original_prefix && attr_value == "")
          {
            attr_value = null;
          }

          namespaces[prefix] = attr_value;
        }
      }
    }

    var childNodes;
    for (i = 0, childNodes = contextNode.childNodes, len = childNodes && childNodes.length;
         i < len;
         ++i)
    {
      var childNode = childNodes[i];

      /* If ELEMENT_NODE, recurse */
      if (childNode.nodeType == 1)
      {
        jsx.tryThis(
          function() {
            me(namespaces, childNode);
          },
          function (e) {
            if (e.constructor == _InvalidNodeError)
            {
              jsx.throwThis(e);
            }
          });
      }
    }

    return namespaces;
  }

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
  function _getElementsByTabIndex (o)
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

    if (_isMethod(o, "getElementsByTagName"))
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

  var _jsx_dom = {
    /**
     * @memberOf jsx.dom
     */
    version:   "$Id$",
    copyright: "Copyright \xA9 2002-2013",
    author:    "Thomas Lahn",
    email:     "js@PointedEars.de",
    path:      "http://pointedears.de/scripts/",

    hasDocumentAll: _hasDocumentAll,
    hasDocumentLayers: _hasDocumentLayers,
    hasGetElementsByTagName: _hasGetElementsByTagName,

    /*
     * Apart from isNS4DOM, none of these object-inference properties is used
     * anymore; they are still here for backwards compatibility only
     */
    //isW3CDOM: _isMethod(document, "getElementById"),
    //isOpera: typeof window.opera != "undefined";
    isNS4DOM: typeof document.layers != "undefined",
    //isIE4DOM: typeof document.all == "object" && !this.isOpera,

    /* DOM preselection (why?) */
    //W3CDOM: 3,
    //IE4DOM: 2,
    //NS4DOM: 1;

    getElementById: _getElementById,
    getElemById: _getElementById,
    getEBI: _getElementById,
    gEBI: _getElementById,

    getElementsByName: _getElementsByName,
    getElemByName: _getElementsByName,
    gEBN: _getElementsByName,

    getElementsByTagName: _getElementsByTagName,
    getElemByTagName: _getElementsByTagName,
    gEBTN: _getElementsByTagName,

    getElementByIndex: _getElementByIndex,
    getElemByIndex: _getElementByIndex,
    gEBIdx: _getElementByIndex,

    /**
     * Shows an exception alert and allows for
     * displaying a stack trace.
     *
     * @param {string} sMessage = ""
     *   Error message to be displayed.
     * @return {boolean}
     *   Always <code>false</code>
     * @deprecated
     */
    DHTMLException: function (sMessage) {
      /* Prevent exceptions from "bubbling" on (keyboard) event */
      if (!jsx.dom.allowExceptionMsg)
      {
        return false;
      }

      jsx.dom.allowExceptionMsg = false;

      jsx.setErrorHandler();
      var stackTrace =
        _isMethod(jsx.global, "Error") && (new Error()).stack || "";

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
    },

    write: function (s) {
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
                result2 = !!_insertBefore(lastScript.parentNode,
                  document.createTextNode(s), lastScript.nextSibling);
              }

              return result2;
            });
        });

      return result;
    },

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
    getElem: function (sType, sValue, index) {
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
    },

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
    getCont: function (oElement, bHTML) {
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
    },

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
    setCont: function (oElement, sNodeValue) {
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
    },

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
    getContent: function (oNode, bGetHTML) {
      var text;

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

        if (typeof text == "undefined" && bGetHTML)
        {
          text = oNode.innerHTML;
        }
      }

      return text;
    },

    /**
     * Sets the text content of a document node.
     *
     * @author
     *   (C) 2005 Thomas Lahn <dhtml.js@PointedEars.de>
     * @param {Node} oNode
     *   Reference to the document node.
     * @param {string} sContent
     * @return {boolean}
     *   <code>true</code> if successful, <code>false</code> otherwise.
     */
    setTextContent: function (oNode, sContent) {
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
    },

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
    getAttr: function (oElement, sAttrName) {
      var result = "";

      if (oElement)
      {
        if (_isMethod(oElement, "getAttribute"))
        {
          result = oElement.getAttribute(sAttrName);
        }
        else if (jsx.dom.isNS4DOM)
        {
          result = oElement[sAttrName];
        }
      }

      return result;
    },

    attrMap: _attrMap,

    setAttr: _setAttr,

    /**
     * Creates an element of the type specified, using the
     * <code>document.createElement()</code> method if supported.
     * This method works with MSIE, too, for if JScript is used,
     * it is tried to use the start tag as is instead of passing
     * only the element type, and adding properties later.
     *
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
     * @author
     *   &copy; 2004, 2006, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
     * @see <a href="dom2-core#ID-2141741547">DOM Level 2 Core: Document::createElement()</a>
     * @see <a href="msdn#workshop/author/dhtml/reference/methods/createelement.asp">MSDN Library: createElement()</a>
     */
    createElement: function (sTag, sNamespaceURI) {
      var o = null;

      if (sTag && typeof document != "undefined")
      {
        /* NOTE: Uses RegExp() to work around misconfigured PHP (short_open_tag=1) */
        var aTagComponents = sTag.replace(new RegExp("^<\?\\s*|\\s*>?$", "g"), "")
          .replace(/\s*=\s*/g, "=").split(/\s+/);

        var local_name = aTagComponents[0];
        if (sNamespaceURI && _isMethod(document, "createElementNS"))
        {
          o = document.createElementNS(sNamespaceURI, local_name);
        }

        if (!o && _isMethod(document, "createElement"))
        {
          /*@cc_on @*/
          /*@if (@_jscript)
            o = document.createElement(sTag);
          @end @*/

          if (!o)
          {
            o = document.createElement(local_name);
          }
        }

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

      return o;
    },

    /**
     * Creates a SGML/HTML markup from an object.
     *
     * Returns a {@link string} from the argument, depending on
     * its type:
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
     *       <td><code>string</code> with characters
     *           escaped according to the following table:
     *           <table>
     *             <tr>
     *               <th>Character</th>
     *               <th>Escape</th>
     *             </tr>
     *             <tr><td><code>"</code></td><td><code>&amp;quot;</code></td></tr>
     *             <tr><td><code>&amp;</code></td><td><code>&amp;amp;</code></td></tr>
     *             <tr><td><code>&lt;</code></td><td><code>&amp;lt;</code></td></tr>
     *             <tr><td><code>></code></td><td><code>&amp;gt;</code></td></tr>
     *           </table>
     *           <p>This is also used internally to ensure that
     *           attribute values and element content is
     *           properly escaped.</p></td>
     *     </tr>
     *     <tr>
     *       <th><code>Array</code> of {@link Object} or <code>String</code></th>
     *       <td>Markup s<code>string</code> of elements and text.
     *           The input <code>Array</code>'s elements are processed
     *           recursively.</td>
     *     </tr>
     *     <tr>
     *       <th><code>Object</code></th>
     *       <td>Markup <code>string</code> for one element and,
     *           optionally, its content.  The following of
     *           the input <code>Object</code>'s properties
     *           are considered:
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
     * @param {Array|Object} data
     * @param {boolean} bXML
     *   If a true-value, empty elements use XML <code>SHORTTAG</code>
     *   syntax: <code>&lt;foo/></code> instead of
     *   <code>&lt;foo>&lt;/foo></code>.
     * @return {string}
     */
    createMarkupFromObj: function _createMarkupFromObj (data, bXML) {
      if (typeof data.valueOf() == "string")
      {
        return data.replace(/["&<>]/g, function (m) {
          return ({
            '"': "&quot;",
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;"
          })[m];
        });
      }

      /* Support ES5 strict mode */
      var me = _createMarkupFromObj;

      /* If input is an Array, output is string of markup */
      if (_isArray(data))
      {
        var a = [];

        for (var i = 0, len = data.length; i < len; ++i)
        {
          a[i] = me(data[i]);
        }

        return a.join("");
      }

      var type = (data.elementType || data.type);
      var el = ["<" + type];

      var attributes = data.attributes;
      if (attributes)
      {
        var keys = _getKeys(attributes);

        for (i = 0, len = keys.length; i < len; ++i)
        {
          var attrName = keys[i];
          el.push(" " + attrName + '="' + me(attributes[attrName]) + '"');
        }
      }

      var properties = data.properties;
      if (properties)
      {
        keys = _getKeys(properties);

        for (i = 0, len = keys.length; i < len; ++i)
        {
          var propName = keys[i];

          if (propName == "style")
          {
            el.push(' style="');

            var style = properties[propName];
            var _uncamelize = jsx.object.getFeature(jsx.dom, "css", "uncamelize")
              || function (s) { return s; };

            var styleKeys = _getKeys(style);
            for (var j = 0, len2 = styleKeys.length; j < len2; ++j)
            {
              var stylePropName = styleKeys[j];
              el.push(" " + me(_uncamelize(stylePropName)) + ": " + me(style[stylePropName]));
            }
          }
          else
          {
            el.push(" " + propName + '="' + me(properties[propName]) + '"');
          }
        }
      }

      var nodes = data.childNodes;
      var bEmpty = (!nodes || !nodes.length);
      if (bXML && bEmpty)
      {
        el.push("/");
      }

      el.push(">");

      for (i = 0, len = nodes && nodes.length; i < len; ++i)
      {
        el.push(me(nodes[i], bXML));
      }

      if (!bEmpty)
      {
        el.push("</" + type + ">");
      }

      return el.join("");
    },

    createElementFromObj: _createNodesFromObj,
    createNodeFromObj: _createNodesFromObj,
    createNodesFromObj: _createNodesFromObj,

    hasClassName: _hasClassName,
    removeClassName: _removeClassName,

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
    addClassName: function (o, sClassName, bRemove) {
      if (bRemove)
      {
        _removeClassName(o, sClassName);
      }
      else if (_hasClassName(o, sClassName))
      {
        return true;
      }

      if (sClassName)
      {
        if (_isHostMethod(o, "classList", "add"))
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

        return _hasClassName(o, sClassName);
      }
    },

    appendChild: _appendChild,

    /**
     * Appends several child nodes to a parent node in the specified order.
     *
     * @param {Node} parentNode
     * @param {NodeList|Array} childNodes
     * @return {boolean}
     *   <code>true</code> on success, <code>false</code> otherwise.
     */
    appendChildren: function (parentNode, childNodes) {
      if (parentNode)
      {
        var result = true;

        for (var i = 0, len = childNodes.length; i < len; ++i)
        {
          var success = _appendChild(parentNode, childNodes[i]);
          if (!success && result)
          {
            result = false;
          }
        }

        return result;
      }

      return false;
    },

    /**
     * Inserts a child node before a reference child node.
     *
     * @param {Node} parentNode
     * @param {Node} newChild
     * @param {Node} refChild
     * @return {boolean}
     *   <code>true</code> on success, <code>false</code> otherwise.
     */
    insertBefore: _insertBefore,

    removeChild: _removeChild,

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
    removeChildren: function (parentNode, childNodes) {
      if (parentNode)
      {
        var result = true;
        if (arguments.length < 2)
        {
          childNodes = parentNode.childNodes;
        }

        for (var i = childNodes.length; i--;)
        {
          var success = _removeChild(parentNode, childNodes[i]);
          if (!success && result)
          {
            result = false;
          }
        }

        return result;
      }

      return false;
    },

    html2nodes: function (sHTML) {
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
    },

    InvalidNodeError: _InvalidNodeError,

    /**
     * Collects and returns the namespaces of a node and its ancestors.
     *
     * Collects the namespace prefixes and URIs of <var>contextNode</var> and
     * its ancestor element nodes.  Duplicate prefixes with different namespace
     * URI are ignored and must be resolved manually using the <var>namespaces</var>
     * argument of {@link jsx.dom.xpath.createFullNSResolver()}.
     *
     * @param {Object} namespaces
     *   Contains the collected namespace declarations.  Existing properties
     *   are preserved.
     * @param {Document|Element} contextNode
     *   The parent node from where to start searching for namespace
     *   declarations.  If it is a Document node, the document element node
     *   is used instead.  The default is the document element node.
     * @return {Object}
     *   The resulting value of <var>namespaces</var> if successful,
     *   <code>null</code> otherwise.
     * @throws jsx.dom.InvalidNodeError if a value has been specified
     *   for <var>contextNode</var> that is not a reference to a Document
     *   node or an Element node.
     * @see jsx.dom.xpath.createFullNSResolver()
     */
    collectNamespaces: jsx_dom_collectNamespaces,

    DOMParser: function (text) {
      if (typeof text != "undefined")
      {
        this.text = text;
      }
    }.extend(null, {
      parseFromString: function (text, contentType, namespaceURI, qualifiedName, documentType) {
        function _unescape (text)
        {
          return text.replace(
            /&(#((\d+)|x[\dA-Fa-f])|lt|gt|amp);/g,
            function (m, entity, cr, dec_cr) {
              if (cr)
              {
                if (dec_cr)
                {
                  return String.fromCharCode(cr);
                }

                return String.fromCharCode(parseInt("0" + cr, 16));
              }

              return {
                "lt": "<",
                "gt": ">",
                "amp": "&"
              }[entity];
            }
          );
        }

        if (typeof text == "undefined") text = this.text;

        var rxAttributes = /\s+((\w+):)?(\w+)(\s*=\s*("[^"]*"|'[^']*'|([^\s\/>]|\/[^>])+))?/g;
        var sMarkup = /[^<]+|<(\/?)(((\w+):)?(\w+))?/.source
          + "(" + rxAttributes.source + ")*"
          + /\s*(\/?)>/.source;
        var rxTag = new RegExp(sMarkup, "g");

        var root_node = null;

        if (contentType || namespaceURI || qualifiedName || documentType)
        {
          if (_isMethod(document, "implementation", "createDocument"))
          {
            root_node = document.implementation.createDocument(
              namespaceURI || {
                "application/xhtml+xml": "http://www.w3.org/1999/xhtml"
              }[contentType] || null,
              qualifiedName || "html",
              documentType || null);
          }
        }

        if (!root_node && _isMethod(document, "createDocumentFragment"))
        {
          root_node = document.createDocumentFragment();
        }

        if (!root_node)
        {
          if (/\/xml$/i.test(contentType))
          {
            root_node = document.createElement(qualifiedName || "xml");
          }
          else
          {
            root_node = document.createElement(qualifiedName || "html");
          }
        }

        var node = root_node;

        var m;
        while ((m = rxTag.exec(text)))
        {
          var end_tag = m[1];
          var node_name = m[2];
          var prefix = m[4];
          var local_name = m[5];
          var attributes_spec = m[6];
          var self_closing = m[13];

          if (node_name)
          {
            if (end_tag)
            {
              node = node.parentNode;
            }
            else
            {
              var namespace_URI = null;

              if (prefix)
              {
                var namespaces = jsx_dom_collectNamespaces(node);
                namespace_URI = namespaces && namespaces[prefix] || null;
              }

              if (namespace_URI)
              {
                var new_node = document.createElementNS(namespace_URI, local_name);
              }
              else
              {
                new_node = document.createElement(local_name);
              }

              node.appendChild(new_node);
              node = new_node;

              if (attributes_spec)
              {
                rxAttributes.lastIndex = m.index + node_name.length;

                var mAttrib;
                while ((mAttrib = rxAttributes.exec(text)))
                {
                  var attr_prefix = mAttrib[2];
                  var attr_local_name = mAttrib[3];
                  var attr_value = mAttrib[5];
                  attr_value = attr_value ? _unescape(attr_value) : attr_local_name;

                  var attr_namespace_URI = null;

                  if (attr_prefix)
                  {
                    if (!namespaces)
                    {

                    }

                    attr_namespace_URI = namespaces && namespaces[attr_prefix] || null;
                  }

                  if (attr_namespace_URI)
                  {
                    node.setAttributeNS(attr_namespace_URI, attr_local_name, attr_value);
                  }
                  else
                  {
                    node.setAttribute(attr_local_name, attr_value);
                  }
                }
              }

              if (self_closing)
              {
                node = node.parentNode;
              }
            }
          }
          else
          {
            var text_content = _unescape(m[0]);
            node.appendChild(document.createTextNode(text_content));
          }
        }

        return root_node;
      }
    }),

    HTMLSerializer: (
      function () {}
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
    }),

    /**
     * Returns the first child node of another node.
     *
     * @param {Node} oNode
     * @return {Node} The first child node of another node.
     */
    getFirstChild: function (oNode) {
      var result = null;

      if (oNode)
      {
        if (oNode.firstChild)
        {
          result = oNode.firstChild;
        }
        else if (oNode.children)
        {
          result = oNode.children[0];
        }
      }

      return result;
    },

    /**
     * Returns the first element child of another node.
     * @param {Node} oNode
     * @return {Node} The first child element of another node.
     */
    getFirstElementChild: function (oNode) {
      var result = null;

      if (oNode)
      {
        if (oNode.firstElementChild)
        {
          result = oNode.firstElementChild;
        }
        if (oNode.firstChild)
        {
          result = oNode.firstChild;
          while (result && result.nodeType != 1)
          {
            result = result.nextSibling;
          }
        }
        else if (oNode.document && oNode.document.all)
        {
          result = oNode.document.all(0);
        }
      }

      return result;
    },

    /**
     * Returns the parent node of a node
     *
     * @param {Node} oNode
     * @return {Node} The parent node of <var>oNode</var>
     */
    getParent: function (oNode) {
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
    },

    /**
     * Loads a script resource asynchonrously by appending
     * a <code>script</code> element to the current (X)HTML document.
     * <p>
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
     * </p><p>
     * Note that previous versions of this method appended to the
     * <code>head</code> element only.  However, this limited its use
     * to scripts that did not modify the body content.  You may still
     * not load such scripts with this method if the document has
     * been loaded and the script resource uses
     * <code>document.write()</code>.  This method intentionally does
     * not use <code>document.write()</code> to avoid the possibility
     * that a loaded document could be overwritten.
     * </p><p>
     * NOTE: Tested successfully with MSIE and Mozilla/5.0; however,
     * do not rely on that the script was included, but <em>test</em>
     * for it.
     * </p>
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
     * @return {boolean}
     *   <code>false</code> if the script could not be loaded,
     *   <code>true</code> otherwise.
     */
    loadScript: function jsx_dom_loadScript (sURI, sType, sLanguage, bReload) {
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
        parent = _getElementsByTagName("script", 0);
        if (!parent)
        {
          parent = document.head || _getElementsByTagName("head", 0);
        }

        if (!parent)
        {
          return false;
        }
      }

      if (!_isHostMethod(document, "createElement"))
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

      if (_isHostMethod(parent, "appendChild"))
      {
        parent.appendChild(oScript);
        result = (
          typeof parent.lastChild != "undefined"
          && parent.lastChild == oScript);
      }
      else if (_isHostMethod(parent, "insertAdjacentElement"))
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
    },

    getElementsByTabIndex: _getElementsByTabIndex,

    isDescendantOfOrSelf: function (node, ancestor) {
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
    },

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
    hyphenate: (function () {
      var _hyphenation, _hyphenate;

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
      return function jsx_dom_hyphenate (contextNodes, hyphenateAll) {
        /* imports */
        if (!_hyphenate)
        {
          _hyphenation = jsx.string.hyphenation;
          _hyphenate = _hyphenation.hyphenate;
        }

        _hyphenation.setHyphenateAll(hyphenateAll);

        var me = jsx_dom_hyphenate;

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
              me(node, hyphenateAll);
            }
            else
            {
              node.nodeValue = _hyphenate(node.nodeValue, hyphenateAll);
            }
          }
        }
      };
    }())
  };

  _jsx_dom.URI = _jsx_dom.path + "dom.js";
//_jsx_dom.docURI    = _jsx_dom.path + "dhtml.htm";

  // _jsx_dom.supported = _jsx_dom.isW3CDOM || _jsx_dom.isNS4DOM || _jsx_dom.isOpera
  // || _jsx_dom.isIE4DOM;

  // _jsx_dom.DOM = _jsx_dom.supported
  // && (_jsx_dom.isW3CDOM && _jsx_dom.W3CDOM)
  // || (_jsx_dom.isIE4DOM && _jsx_dom.IE4DOM)
  // || (_jsx_dom.isNS4DOM && _jsx_dom.NS4DOM);

  if (typeof jsx.types != "undefined"
    && jsx.types.isFeature("HTMLDocument", "prototype")
    && !_isMethod(HTMLDocument.prototype, "getElementsByTabIndex"))
  {
    HTMLDocument.prototype.getElementsByTabIndex = _getElementsByTabIndex;
  }

  if (typeof jsx.types != "undefined"
      && jsx.types.isFeature("HTMLElement", "prototype")
      && !_isMethod(HTMLElement.prototype, "getElementsByTabIndex"))
  {
    HTMLElement.prototype.getElementsByTabIndex = _getElementsByTabIndex;
  }

  return _jsx_dom;
}());
