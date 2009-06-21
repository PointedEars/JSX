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
 * @author (C) 2001      SELFHTML e.V. <stefan.muenz@selfhtml.org> et al.
 * @author (C) 2002-2009 Thomas Lahn <dhtml.js@PointedEars.de>
 * @author (C) 2004      Ulrich Kritzner <droeppez@web.de> (loadScript)
 * @author (C) 2005      MozillaZine Knowledge Base contributors (DOM XPath):
 *                         Eric H. Jung <grimholtz@yahoo.com> et al.
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
 * Refer dhtml.js.diff for changes to the last version,
 * and dhtml.htm file for a printable documentation.
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSdoc/
 * for details.
 */

function DHTML()
{
  this.version   = "0.9.7a.2009062114";
  this.copyright = "Copyright \xA9 2002-2009";
  this.author    = "Thomas Lahn";
  this.email     = "dhtml.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
  this.URI       = this.path + "dhtml.js";
  this.allowExceptionMsg = true;

  if (typeof document != "undefined")
  {
    var hasDocumentAll = false;

    this.getElemById = this.gEBI = (
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
          return function(s) {
            return document.getElementById(s);
          };
        }
        else if ((hasDocumentAll = jsx_object.isMethod(document, "all")))
        {
          return function(s) {
            return document.all(s);
          };
        }
        else
        {
          return function(s) {
            return document[s];
          };
        }
      }
    )();

    var hasDocumentLayers = false;

    this.getElemByName = this.gEBN = (
      function() {
        function dummy()
        {
          return null;
        }
        
        if (typeof document == "undefined") return dummy;
        
        if (jsx.object.isMethod(document, "getElementsByName"))
        {
          return function(s, i) {
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
          return function(s, i) {
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
          return function(s, i) {
            var result = document.layers[s];
            if (result && !isNaN(i) && i > -1)
            {
              result = result[i];
            }
            return result;
          };
        }
        
        return dummy;
      }
    )();

    var hasGetElementsByTagName;

    this.getElemByTagName = this.gEBTN = (
      function() {
        var jsx_object = jsx.object;
        
        if (jsx_object.isMethod(jsx, "xpath", "evaluate"))
        {
          return function(s, i, contextNode) {
            if (!s)
            {
              s = '*';
            }
            
            if (typeof i != "number")
            {
              var tmp = contextNode;
              contextNode = i;
              i = tmp;
            }

            var result = jsx.xpath.evaluate('.//' + s, contextNode || null,
              null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
            
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
                    typeof document != "undefined"
                    && jsx_object.isMethod(document, "getElementsByTagName")))
        {
          return function(s, i, contextNode) {
            if (!s)
            {
              s = '*';
            }

            if (typeof i != "number")
            {
              var tmp = contextNode;
              contextNode = i;
              i = tmp;
            }
            else if (arguments.length < 3)
            {
              contextNode = document;
            }
            
            if (contextNode != document
                && !jsx.object.isMethod(contextNode, "getElementsByTagName"))
            {
              return null;
            }
            
            var result = contextNode.getElementsByTagName(s);
            if (result && !isNaN(i) && i > -1)
            {
              result = result[i];
            }
            
            return result;
          };
        }
        else if (hasDocumentAll && isMethod(document.all, "tags"))
        {
          return function(s, i, contextNode) {
            if (typeof i != "number")
            {
              var tmp = contextNode;
              contextNode = i;
              i = tmp;
            }
            else if (arguments.length < 3)
            {
              contextNode = document;
            }
            
            if (contextNode != document
                && !jsx.object.isMethod(contextNode, "all", "tags"))
            {
              return null;
            }
            
            var result = contextNode.all.tags(s);
            if (result && !isNaN(i) && i > -1)
            {
              result = result[i];
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
      }
    )();

    this.getElemByIndex = this.gEBIdx = (
      function() {
        function dummy()
        {
          return null;
        }
        
        if (typeof document == "undefined") return dummy;
        
        if (hasGetElementsByTagName)
        {
          return function(i) {
            return (result = document.getElementsByTagName('*')[i]);
          };
        }
        else if (hasDocumentAll)
        {
          return function(i) {
            return document.all(i);
          };
        }
        else if (hasDocumentLayers)
        {
          return function(i) {
            return document.layers[i];
          };
        }

        return dummy;
      }
    )();
  }

  this.getElemByClassName = this.gEBCN = function(s) {
    var
      coll = this.getElemByTagName(),
      result = new Array(),
      splice = (
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
              ins = Array.prototype.slice.call(arguments, 3);
              return Array.prototype.splice.apply(a, [start, del].concat(ins));
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
      )();

    if (coll)
    {
      var classes = s.split(/[ \t\f\u200B\r\n]+/);
      for (var i = 0, len = classes.length; i < len; i++)
      {
        var c = classes[i];
        if (!/\S/.test(c))
        {
          var rx = new RegExp(
            "(^|[ \\t\\f\\u200B\\r\\n]+)" + c + "($|[ \\t\\f\\u200B\\r\\n]+)");
          
          if (i == 0)
          {
            for (var j = 0, len = coll.length; i < len; i++)
            {
              if (rx.test(coll[j].className))
              {
                result[result.length] = coll[j];
              }
            }
          }
          else
          {
            for (j = result.length; j--;)
            {
              if (!rx.test(result[j].className))
              {
                splice(result, j, 1);
              }
            }
          }
        }
      }
    }

    return result;
  };

  this.isW3CDOM = jsx.object.isMethod(document, "getElementById");
  this.isOpera  = typeof window.opera != "undefined";
  this.isNS4DOM = typeof document.layers != "undefined";
  this.isIE4DOM  = typeof document.all == "object" && !this.isOpera;
  this.supported = this.isW3CDOM || this.isNS4DOM || this.isOpera
    || this.isIE4DOM;

  this.W3CDOM = 3;
  this.IE4DOM = 2;
  this.NS4DOM = 1;
  this.DOM = this.supported
    && (this.isW3CDOM && this.W3CDOM)
    || (this.isIE4DOM && this.IE4DOM)
    || (this.isNS4DOM && this.NS4DOM);
}

if (typeof dhtml == "undefined") var dhtml = new Object();

dhtml.objectPath = "/scripts/object.js"; 

if (typeof jsx != "undefined"
    && typeof jsx.object != "undefined"
    && typeof jsx.object.isMethod != "undefined")
{
  DHTML.prototype.isMethod = jsx.object.isMethod;
  DHTML.prototype.isMethodType = jsx.object.isMethodType;
}
else
{
  var msg = "isMethod() was not defined";
  if (loadScript(dhtml.objectPath))
  {
    if (typeof console.warn != "undefined")
    {
      console.warn(msg + ", successfully loaded " + dhtml.objectPath);
    }
  }
  else
  {  
    console.warn(msg + ", could not load " + dhtml.objectPath);
  }
}

dhtml = new DHTML();

if (typeof jsx == "undefined") var jsx = new Object();
jsx.dhtml = dhtml;

if (typeof de == "undefined") var de = new Object();
if (typeof de.pointedears == "undefined") de.pointedears = new Object();
if (typeof de.pointedears.jsx == "undefined") de.pointedears.jsx = jsx;
de.pointedears.jsx.dhtml = dhtml;

function DHTMLException(sMsg)
{
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
      + sMsg + "\n"
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

  s = null;

  return result;
};

function getElem(sType, sValue, index)
{
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

function getCont(o, bHTML)
{
  var sResult = "";

  if (o)
  {
    if (typeof o.firstChild != "undefined")
    {
      if (typeof o.firstChild.nodeType != "undefined"
          && o.firstChild.nodeType ==
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

function setCont(o, sNodeValue)
{
  if (o)
  {
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

    else if (typeof o.innerText != "undefined")
    {
      o.innerText = sNodeValue;
      return true;
    }

    else if (jsx.dhtml.isNS4DOM
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

function getTextContent(oNode)
{
  var text = "";

  if (oNode)
  {
    if (typeof oNode.textContent != "undefined")
    {
      text = oNode.textContent;
    }

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

    else if (typeof oNode.innerText != "undefined")
    {
      text = oNode.innerText;
    }
  }

  return text;
}
DHTML.prototype.getTextContent = getTextContent;

function setTextContent(oNode, sContent)
{
  var result = false;

  if (oNode)
  {
    if (typeof oNode.textContent != "undefined")
    {
      oNode.textContent = sContent;
      result = (oNode.textContent == sContent);
    }

    else if (oNode.removeChild && oNode.firstChild)
    {
      while (oNode.firstChild)
      {
        oNode.removeChild(oNode.firstChild);
      }

      result = !!oNode.appendChild(document.createTextNode(sContent));
    }

    else if (typeof oNode.innerText != "undefined")
    {
      oNode.innerText = sContent;
      result = (oNode.innerText == sContent);
    }
  }
  return result;
}
DHTML.prototype.setTextContent = setTextContent;

function getAttr(o, sAttrName)
{
  var result = "";

  if (o)
  {
    if (jsx.object.isMethod(o, "getAttribute"))
    {
      result = o.getAttribute(sAttrName);
    }
    else if (jsx.dhtml.isNS4DOM)
    {
      result = o[sAttrName];
    }
  }

  return result;
}
DHTML.prototype.getAttr = getAttr;

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

    if (typeof attrMap[sAttrName] != "undefined")
    {
      sAttrName = attrMap[sAttrName];
    }

    var
      hyphenatedToCamelCase =
        function(s) {
          return s.replace(/-([a-z])/g,
            function(match, p1, offset, input) {
              return p1.toUpperCase();
            })
        },

      strToValue =
        function(s) {
          s = s.replace(/^["']|["']$/g, "");
          return isNaN(s) ? s : +s;
        };

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

function getStyleProperty(o, sPropertyName)
{
  if (o)
  {
    sPropertyName = sPropertyName.replace(/-([a-z])/gi,
      function(m, p1) { return p1.toUpperCase(); });

    if (typeof o.style != "undefined")
    {
      var tested = false;

      if (sPropertyName == "float")
      {
        if (typeof o.style.cssFloat != "undefined")
        {
          sPropertyName = "cssFloat";
          tested = true;
        }

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

function hasStyleProperty(o, sPropertyName)
{
  return (jsx.dhtml.getStyleProperty(o, sPropertyName) != null);
}
DHTML.prototype.hasStyleProperty = hasStyleProperty;

function setStyleProperty(o, sPropertyName, propValue, altValue)
{
  if (o)
  {
    sPropertyName = sPropertyName.replace(
      /-([a-z])/gi,
      function(m, p1) { return p1.toUpperCase(); });

    if (typeof o.style != "undefined")
    {
      var isStyleFloat = false;

      if (sPropertyName == "float")
      {
        if (typeof o.style.cssFloat != "undefined")
        {
          sPropertyName = "cssFloat";
          isStyleFloat = true;
        }

        else if (typeof o.style.styleFloat != "undefined")
        {
          sPropertyName = "styleFloat";
          isStyleFloat = true;
        }
      }

      if (isStyleFloat || typeof o.style[sPropertyName] != "undefined")
      {
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

function display(o, bShow)
{
  var result;

  if (o)
  {
    if (arguments.length > 1)
    {
      result = jsx.dhtml.setStyleProperty(o, "display",
        bShow ? ""     : "none",
        bShow ? "show" : "hide");
    }
    else
    {
      result = /^(\s*|show)$/.test(jsx.dhtml.getStyleProperty(o, "display"));
    }
  }

  return result;
}
DHTML.prototype.display = display;

function visible(o, bVisible)
{
  var result;

  if (o)
  {
    if (arguments.length > 1)
    {
      result = jsx.dhtml.setStyleProperty(o, "visibility",
        bVisible ? "visible" : "hidden",
        bVisible ? "show" : "hide");
    }
    else
    {
      result = /^(visible|show)$/.test(
        jsx.dhtml.getStyleProperty(o, "visibility"));
    }
  }

  return result;
}
var visibility = visible;
DHTML.prototype.visibility = visible;
DHTML.prototype.visible = visible;

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

function removeOptions(oSelect, bAllowReload)
{
  if (oSelect
      && oSelect.tagName
      && oSelect.tagName.toLowerCase() == "select")
  {
    var o = oSelect.options;
    if (o && o.length)
    {
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

function createElement(sTag)
{
  var o = null;

  if (sTag
      && typeof document != "undefined"
      && isMethod(document, "createElement"))
  {
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
  result.toString = function() {
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

function _addEventListener(o, sEvent, fListener)
{
  var
    jsx_object = jsx.object,
    t,
    result = false,
    sHandler = "on" + sEvent,
    rxUnknown = /^\s*unknown\s*$/i;

  if (o && sEvent && !rxUnknown.test((t = typeof fListener))
        || jsx_object.isMethodType(t) && fListener)
  {
    if (jsx_object.isMethod(o, "addEventListener"))
    {
      o.addEventListener(sEvent, fListener, false);
      result = true;
    }
    else if (typeof o[sHandler] != "undefined")
    {
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
            if (rxUnknown.test((t = typeof list[i]))
                || jsx_object.isMethodType(t) && list[i])
            {
              Function.prototype.call.call(list[i], this, e);
            }
          }
        };

        newListener.listenerList = [];

        if (oldListener)
        {
          var list = newListener.listenerList;  
          list[list.length] = oldListener;
        }

        oldListener = newListener;
      }

      list = oldListener.listenerList;
      list[list.length] = fListener;

      o[sHandler] = oldListener;

      result = (o[sHandler] == oldListener);
    }
    else
    {
      result = false;
    }
  }

  o = null;

  return result;
}
DHTML.prototype.addEventListener = _addEventListener;

function _addEventListenerCapture(o, sEvent, fListener)
{
  var jsx_object = jsx.object, t;

  if (o && sEvent
        && (/^\s*unknown\s*$/i.test((t = typeof fListener))
            || (jsx_object.isMethodType(t) && fListener))
        && jsx_object.isMethod(o, "addEventListener"))
  {
    o.addEventListener(sEvent, fListener, true);
    return true;
  }

  return false;
}
DHTML.prototype.addEventListenerCapture = _addEventListenerCapture;

function _replaceEventListener(o, sEvent, fListener, bUseCapture)
{
  var
    jsx_object = jsx.object,
    result = false,
    t,
    rxUnknown = /^\s*unknown\s*$/i,
    sHandler = "on" + sEvent;

  if (o && sEvent
        && (rxUnknown.test((t = typeof fListener))
            || (jsx_object.isMethodType(t) && fListener)))
  {
    if (jsx_object.isMethod(o, "removeEventListener")
        && jsx_object.isMethod(o, "addEventListener"))
    {
      if (rxUnknown.test((t = typeof o[sHandler]))
          || (jsx_object.isMethodType(t) && o[sHandler]))
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

function loadScript(sURI, sType, sLanguage)
{
  var jsx_object = jsx.object;

  var oHead = dhtml.getElemByTagName("head", 0);
  if (!oHead) return false;
  
  if (!jsx_object.isMethod(document, "createElement")) return false;
  
  var oScript = document.createElement("script");
  if (!oScript) return false;
  
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
    return (
      typeof oHead.lastChild != "undefined"
      && oHead.lastChild == oScript);
  }
  else if (jsx_object.isMethod(oHead, "insertAdjacentElement"))
  {
    oHead.insertAdjacentElement("beforeEnd", oScript);
    return true;
  }

  return false;
}
DHTML.prototype.loadScript = loadScript;

function getElementsByTabIndex(o)
{
  var aIndexedElements = new Array();
  var aUnindexedElements = new Array();

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
          if (e.tabIndex)
          {
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

if (jsx.types.isFeature("HTMLDocument", "prototype")
    && !jsx.object.isMethod(HTMLDocument.prototype, "getElementsByTabIndex"))
{
  HTMLDocument.prototype.getElementsByTabIndex = dhtml.getElementsByTabIndex;
}

if (jsx.types.isFeature("HTMLElement", "prototype")
    && !jsx.object.isMethod(HTMLElement.prototype, "getElementsByTabIndex"))
{
  HTMLElement.prototype.getElementsByTabIndex = dhtml.getElementsByTabIndex;
}