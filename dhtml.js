/**
 * <title>PointedEars' DHTML Library</title>
 * @partof
 *   PointedEars JavaScript Extensions (JSX)
 * @source Based upon
 *   @link{
 *     selfhtml#dhtml/beispiele/dhtml_bibliothek.htm,
 *     dhtml.js from SELFHTML (8.0)
 *   }
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2002-2004  Thomas Lahn <dhtml.js@PointedEars.de>,
 *   Parts (C) 2004  Ulrich Kritzner <droeppez@web.de>
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
 *
 * Refer dhtml.htm file for a printable
 * documentation. 
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSdoc/
 * for details.
 */

function DHTML()
{
  this.version   = "0.9.2004080806";
// var dhtmlDocURL = dhtmlPath + "dhtml.htm";
  this.copyright = "Copyright \xA9 2002-2004";
  this.author    = "Thomas Lahn";
  this.email     = "dhtml.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
  this.URI       = this.path + "dhtml.js";
//  this.docURI    = this.path + "dhtml.htm";
  this.allowExceptionMsg = true;

  /**
   * @author
   *   (C) 2003, 2004  Thomas Lahn &lt;types.js@PointedEars.de&gt;
   * @partof
   *   http://pointedears.de/scripts/types.js
   * @optional string s
   *   String to be determined a method type, i.e. "object"
   *   in IE, "function" otherwise.  The type must have been
   *   retrieved with the `typeof' operator, thus this method
   *   is applicable to unknown properties while
   *   @link{#isMethod()} is not.
   * @return type boolean
   *   <code>true</code> if <code>s</code> is a method type,
   *   <code>false</code> otherwise.
   * @see isMethod()
   */
  this.isMethodType = function dhtml_isMethodType(s)
  {
    return (s == "function" || s == "object");
  }

  if (typeof document != "undefined")
  {
    var hasDocumentAll = false;

    if (this.isMethodType(typeof document.getElementById))
    {
      this.getElemById = function dhtml_getElemById(s)
      {
        // wrapper method required to avoid "invalid op. on prototype" exception
        return document.getElementById(s);
      }
    }
    else if ((hasDocumentAll = this.isMethodType(typeof document.all)))
    {
      this.getElemById = function dhtml_getElemById(s)
      {
        return document.all(s);
      }
    }
    else
    {
      this.getElemById = function dhtml_getElemById(s)
      {
        return document[s];
      }
    }

    var hasDocumentLayers = false;
  
    if (this.isMethodType(typeof document.getElementsByName))
    {
      this.getElemByName = function(s, i)
      {
        var result = document.getElementsByName(s);
        if (result && !isNaN(i) && i > -1)
        {
          result = result[i];
        }
        return result;
      }
    }
    else if (hasDocumentAll)
    {
      this.getElemByName = function dhtml_getElemByName(s, i)
      {
        var result = document.all(s);
        if (result && !isNaN(i) && i > -1)
        {
          result = result[i];
        }
        return result;
      }
    }
    else if ((hasDocumentLayers = (typeof document.layers == "object")))
    {
      this.getElemByName = function dhtml_getElemByName(s, i)
      {
        var result = document.layers[s];
        if (result && !isNaN(i) && i > -1)
        {
          result = result[i];
        }
        return result;
      }
    }
    else
    {
      this.getElemByName = function dhtml_getElemByName()
      {
        return null;
      }
    }

    var hasGetElementsByTagName;
    
    if ((hasGetElementsByTagName =
          this.isMethodType(typeof document.getElementsByTagName)))
    {
      this.getElemByTagName = function dhtml_getElemByTagName(s, i)
      {
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
      }
    }
    else if (hasDocumentAll && this.isMethodType(typeof document.all.tags))
    {
      this.getElemByTagName = function dhtml_getElemByTagName(s, i)
      {
        var result = document.all.tags(s);
        if (result && !isNaN(i) && i > -1)
        {
          result = result[i];
        }
        return result;
      }
    }
    else
    {
      this.getElemByTagName = function dhtml_getElemByTagName()
      {
        return null;
      }
    }

    if (hasGetElementsByTagName)
    {
      this.getElemByIndex = function dhtml_getElemByIndex(i)
      {
        return result = document.getElementsByTagName('*')[i];
      }
    }
    else if (hasDocumentAll)
    {
      this.getElemByIndex = function dhtml_getElemByIndex(i)
      {
        return document.all(i);
      }
    }
    else if (hasDocumentLayers)
    {
      this.getElemByIndex = function dhtml_getElemByIndex(i)
      {
        return document.layers[i];
      }
    }
    else
    {
      this.getElemByIndex = function dhtml_getElemByIndex()
      {
        return null;
      }
    }
  }  

  this.getElemByClassName = function dhtml_getElemByClassName(s)
  {
    var
      coll = this.getElemByTagName(),
      result = new Array();
  
    if (coll)
    {
      for (var i = 0, len = coll.length; i < len; i++)
      {
        if (coll[i].className == s)
        {
          result[result.length] = coll[i];
        }
      }
    }
    return result;
  }

  this.isW3CDOM = this.isMethodType(typeof document.getElementById);
  this.isOpera  = typeof window.opera != "undefined";
  this.isNS4DOM =
    (typeof window.netscape != "undefined"
      && typeof window.screen != "undefined"
      && !this.isW3CDOM
      && !this.isOpera);
  this.isIE4DOM  = typeof document.all == "object" && !this.isOpera;
  this.supported = this.isW3CDOM
    || this.isNS4DOM
    || this.isOpera
    || this.isIE4DOM;

  // DOM preselection
  this.W3CDOM = 3;
  this.IE4DOM = 2;
  this.NS4DOM = 1;
  this.DOM = this.supported   
    && (this.isW3CDOM && this.W3CDOM)
    || (this.isIE4DOM && this.IE4DOM)
    || (this.isNS4DOM && this.NS4DOM);
}
var dhtml = new DHTML();

/**
 * General error capturing function
 *
 * @return type boolean
 */ 
DHTML.prototype.dummyError =
function dhtml_dummyError()
{
  onerror = null;
  return true;
}

/**
 * Shows an exception alert and allows for
 * displaying a stack trace.
 *
 * @optional string sMsg = ""
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
  
  onerror = dhtml.dummyError;
  eval(
      'try {'
    + '  delete bar;'
    + '  var foo = bar;'
    + '} catch (e) {'
    + '  var stackTrace = e.stack || "";'
    + '}');
  dhtml.dummyError();
  
  alert(
    "dhtml.js "
      + dhtml.version + "\n"
      + dhtml.copyright + "  "
      + dhtml.author + " <" + dhtml.email + ">\n"
      + 'The latest version can be obtained from:\n'
      + + "<" + dhtml.URI + ">\n\n"
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
 * @argument string sType
 *   Defines the type of <code>sValue</code>. Valid values are
 *   "id", "name", "tagname", "index" and "classname". The
 *   argument is case-insensitive.
 * @optional string sValue
 *   Case-sensitive ID, name or tag name of object (collection).
 * @optional number index
 *   Optional. Numeric index of an element of the selected
 *   collection. For IDs must be unique throughout a document,
 *   this argument is ignored if <code>sType</code> is "id".
 * @return type object
 *   A reference to an object if <code>sType</code> is "id", or
 *   if it is "name" or "tagname" and <code>index</code> is
 *   specified; otherwise a collection of objects matching the
 *   specified criteria; <code>null</code> if no matching object
 *   exists.
 */
function getElem(sType, sValue, index)
{
  function invalidType()
  {
    DHTMLException(
        'getElem: Invalid type "' + sType + '"\n'
      + 'Must be one of "id", "name", "tagname", "index" or "classname"'
      + ' (case-insensitive).');
  }

  if (!sType
      || typeof sType != "string"
      || !sType.toLowerCase)
  {
    DHTMLException(
        "getElem: Invalid type: " + sType + "\n"
      + "Must be String.");
  }

  if (!sValue
      || typeof sValue != "string")
  {
    DHTMLException(
        "getElem: Invalid value: " + sValue + "\n"
      + "Must be String.");
  }
    
  var o = null;
  
  switch ((sType = sType.toLowerCase()))
  {
    case 'id':
      o = dhtml.getElemById(sValue);
      break;

    case 'name':
      o = dhtml.getElemByName(sValue, index);
      break;

    case 'tagname':
      o = dhtml.getElemByTagName(sValue, index);
      break;
        
    case 'index':
      o = dhtml.getElemByIndex(sValue);
      break;

    case 'classname':
      o = dhtml.getElemByClassName(sValue);
      break;

    default:
      invalidType();
  }
  
  return o;
}
DHTML.prototype.getElem = getElem;

/**
 * Retrieves the content of an HTMLElement object that matches
 * certain criteria.
 * 
 * @author
 *   (C) 2003, 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument string sType
 *   Defines the type of <code>sValue</code>. Valid values are
 *   "id", "name" and "tagname". The argument is case-insensitive.
 * @argument string sValue
 *   Case-sensitive ID, name or tag name of object (collection).
 * @optional number index
 *   Optional. Numeric index of an element of the selected
 *   collection. For IDs must be unique throughout a document,
 *   this argument is ignored if <code>sType</code> is "id".
 * @optional boolean bHTML
 * @return type string
 *  A string with the content of the object if <code>sType</code>
 *  is "id", or if it is "name" or "tagname" and
 *  <code>index</code> is specified; a null-string if no matching
 *  object exists or if the DOM does not provide retrieval of the
 *  object's content.
 */
function getCont(sType, sValue, index, bHTML)
{
  var o = getElem(sType, sValue, index);
  var sResult = "";

  if (o)
  {
    if (dhtml.isW3CDOM
        && typeof o.firstChild != "undefined")
    {
      if (typeof o.firstChild.nodeType != "undefined"
          && o.firstChild.nodeType ==
            /* W3C-DOM 2 o.firstChild.TEXT_NODE constant n/a in IE and O7 */
            ((typeof o.firstChild.TEXT_NODE != "undefined"
              && o.firstChild.TEXT_NODE)
             || 3))
      {
        sResult = o.firstChild.nodeValue;
      }
    }
    else if (dhtml.isIE4DOM)
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
 * Specifies the content of an HTMLElement object that matches
 * certain criteria.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument string sType
 *   Defines the type of <code>sValue</code>. Valid values are
 *   "id", "name" and "tagname". The argument is case-insensitive.
 * @argument string sValue
 *   Case-sensitive ID, name or tag name of object (collection).
 * @optional number index
 *   Optional. Numeric index of an element of the selected
 *   collection. For IDs must be unique throughout a document,
 *   this argument is ignored if <code>sType</code> is "id".
 * @argument string sNodeValue
 *   New content of the element.
 * @returns
 *   <code>true</code> if successful, <code>false</code>
 *   otherwise.
 */
function setCont(sType, sValue, index, sNodeValue)
{
  var o = getElem(sType, sValue, index);

  if (dhtml.isW3CDOM && o)
  {
    if (typeof o.firstChild != "undefined")
    {
      o.firstChild.nodeValue = sNodeValue;
    }
    else if (typeof o.nodeValue != "undefined")
    {
      o.nodeValue = sNodeValue;
    }

    return true;   
  }
  else if (dhtml.isIE4DOM && o)
  {
    o.innerText = sNodeValue;
    return true;
  }
  else if (dhtml.isNS4DOM
           && o
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
  else
  {
    return false;
  }
}
DHTML.prototype.setCont = setCont;

/**
 * Retrieves the value of an attribute of an HTMLElement object
 * that matches certain criteria.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument string sType
 *   Defines the type of <code>sValue</code>. Valid
 *   values are "id", "name" and "tagname". The argument is
 *   case-insensitive.
 * @argument string sValue
 *   Case-sensitive ID, name or tag name of object
 *   (collection).
 * @optional number index
 *   Optional. Numeric index of an element of the
 *   selected collection. For IDs must be unique throughout a
 *   document, this argument is ignored if <code>sType</code>
 *   is "id".
 * @argument string sAttrName
 *   Name of the attribute from which the value
 *   should be retrieved.
 * @return
 *   The value of the object if <code>sType</code> is "id",
 *   or if it is "name" or "tagname" and <code>index</code>
 *   is specified;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
function getAttr(sType, sValue, index, sAttrName)
{
  var result = "";
  var o = getElem(sType, sValue, index);

  if ((dhtml.isW3CDOM || dhtml.isIE4DOM) && o)
  {
    result = o.getAttribute(sAttrName);
  }
  else if (dhtml.isNS4DOM) 
  {
    o = getElem(sType, sValue); 
    if (typeof o == "object")
    {
      if (typeof o[index] == "object")
      {
        result = o[index][sAttrName];
      }
      else
      {
        result = o[sAttrName];
      }
    }
  }
  
  return result;
}
DHTML.prototype.getAttr = getAttr;

/**
 * Sets the value of an attribute of an HTMLElement object
 * that matches certain criteria.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument string sType
 *   Defines the type of <code>sValue</code>.  Valid
 *   values are "id", "name" and "tagname".  The argument
 *   is case-insensitive.
 * @argument string sValue
 *   Case-sensitive ID, name or tag name of object
 *   (collection).
 * @optional number index
 *   Optional. Numeric index of an element of the
 *   selected collection. For IDs must be unique throughout a
 *   document, this argument is ignored if <code>sType</code>
 *   is "id".
 * @argument string sAttrName
 *   Name of the attribute of which the value should be set.
 * @argument _ attrValue
 *   Value of the attribute to be set.
 * @returns
 *   The value of of the object if <code>sType</code> is "id",
 *   or if it is "name" or "tagname" and <code>index</code> is
 *   specified;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
function setAttr(sType, sValue, index, sAttrName, attrValue)
{
  var o = getElem(sType, sValue, index);
  
  if ((dhtml.isW3CDOM || dhtml.isIE4DOM) && o)
  {
    o.setAttribute(sAttrName, attrValue, 0);
    return true;
  }
  else if (dhtml.isNS4DOM)
  {
    o = getElem(sType, sValue)
    if (o)
    {
      var o2 = getElem(sType, sValue)[index];
      if (typeof o2 == "oect")
      {
        o2[sAttrName] = attrValue;
      }
      else
      {
        o[sAttrName] = attrValue;
      }
    }
    return true;
  }
  else
  {
    return false;
  }
}
DHTML.prototype.setAttr = setAttr;

/**
 * Sets the value of a style property of an HTMLElement object
 * that matches certain criteria.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument string sType
 *   Defines the type of <code>sValue</code>.  Valid
 *   values are "id", "name" and "tagname".  The argument
 *   is case-insensitive.
 * @argument string sValue
 *   Case-sensitive ID, name or tag name of object
 *   (collection).
 * @optional number index
 *   Optional. Numeric index of an element of the
 *   selected collection. For IDs must be unique throughout a
 *   document, this argument is ignored if <code>sType</code>
 *   is "id".
 * @argument string sPropertyName
 *   Name of the style property of which the value should be set.
 * @argument _ propValue
 *   Value of the style property to be set.
 * @returns
 *   The value of of the object if <code>sType</code> is "id",
 *   or if it is "name" or "tagname" and <code>index</code> is
 *   specified;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
function setStyleProperty(sType, sValue, index, sPropertyName, propValue)
{
  var o = getElem(sType, sValue, index);
  
  if ((dhtml.isW3CDOM || dhtml.isIE4DOM) && o)
  {
    o.setAttribute(sAttrName, attrValue, 0);
    return true;
  }
  else if (dhtml.isNS4DOM)
  {
    o = getElem(sType, sValue)
    if (o)
    {
      var o2 = getElem(sType, sValue)[index];
      if (typeof o2 == "oect")
      {
        if (typeof o2.style != "undefined")
        {
          o2.style[sPropertyName] = propValue;
          return (o2.style[sPropertyName] == propValue);
        }
      }
      else
      {
        if (typeof o.style != "undefined")
        {
          o.style[sPropertyName] = propValue;
          return (o.style[sPropertyName] == propValue);
        }
      }
    }
    return true;
  }
  else
  {
    return false;
  }
}
DHTML.prototype.setStyleProperty = setStyleProperty;

/**
 * Allows or prevents rendering of the a DOM object.
 *
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument HTMLElement o
 *   Reference to the DOM object to be rendered or not.
 * @argument boolean bShow
 *   Renders the object referenced by <code>o</code> if
 *   <code>true</code>, does not render it if <code>false</code>.
 *   Note that not to render an element is different from
 *   hiding it as the space it would take up is then not
 *   longer reserved.
 * @return type boolean
 *   <code>true</code> if successful,
 *   <code>false</code> otherwise.
 * @see
 *   visibility()
 */
function display(o, bShow)
{
  var result;

  if (o)
  {
    if (typeof o.style != "undefined"
        && typeof o.style.display != "undefined")
    {
      o.style.display = bShow ? "" : "none";
      result = (o.style.display == bShow ? "" : "none");
    }
    else if (typeof o.visibility != "undefined")
    {
      o.visibility = bShow ? "show" : "hide";
      result = (o.visibility == bShow ? "show" : "hide");
    }
  }
  
  return result;
}
DHTML.prototype.display = display;

/**
 * Shows or hides a DOM object.
 *
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument HTMLElement o
 *   Reference to the DOM object to be either shown or hidden.
 * @argument boolean bShow
 *   Shows the object referenced by <code>o</code> if
 *   <code>true</code>, hides it if <code>false</code>.
 *   Note that hiding an element is is different from
 *   not rendering it as the space it takes up is
 *   still reserved.
 * @returns
 *   <code>true</code> if successful,
 *   <code>false</code> otherwise.
 * @see
 *   display()
 */
function visibility(o, bVisible)
{
  var result;

  if (o)
  {
    if (typeof o.style != "undefined"
        && typeof o.style.visibility != "undefined")
    {
      o.style.visibility = bVisible ? "visible" : "hidden";
      result = (o.style.visibility == bVisible ? "visible" : "hidden");
    }
    else if (typeof o.visibility != "undefined")
    {
      o.visibility = bVisible ? "show" : "hide";
      result = (o.visibility == bShow ? "show" : "hide");
    }
  }
  
  return result;
}
DHTML.prototype.visibility = visibility;

/**
 * Sets the value property of an HTMLInput element,
 * and its "title" property accordingly if specified.
 * 
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument HTMLInputElement oInput
 *   Required.  Reference to an HTMLInputElement object.
 * @argument string sValue
 *   New value of the "value" property of the
 *   HTMLInputElement object.
 * @optional boolean bSetTitle = false
 *   Specifies if the "title" property should be set to
 *   the same value as the "value" property.  The default
 *   is <code>false</code>.
 * @return type boolean
 *   If <code>bSetTitle</code> evaluates to <code>false</code>
 *   or is left out:
 * 
 *   <code>true</code> if the "value" property could be set
 *   properly, <code>false</code> otherwise.
 * 
 *   If <code>bSetTitle</code> is <code>true</code>:
 * 
 *   <code>true</code> if _both_ "value" and "title" property
 *   could be set properly, <code>false</code> otherwise.
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
  else
  {
    return false;
  }
}
DHTML.prototype.setValue = setValue;

var
  colMouseout = "#000000",
  colMouseover = "#ffffff";

/**
 * @argument number|string imgID
 * @optional number state
 * @return type boolean
 */
function hoverImg(imgID, state)
{
  var img = "null";

  if (document.images)
  {
    img = document.images[imgID];
  }

  if (img)
  {
    col = "";
    switch (state)
    {
      case 0:
        col = colMouseout;
        break;

      default:
        col = colMouseover;
    }
    if (col != "")
    {
      img.style.borderColor = col;
    }
  }

  return true;
}
DHTML.prototype.hoverImg = hoverImg;

/**
 * Retrieves the checked radio button of a radio button group.
 * 
 * @author
 *   Copyright (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument HTMLFormElement oForm
 *   Required. Reference to an HTMLFormElement object to contain
 *   the radio button group.
 * @argument string sGroup
 *   Name of the radio button group from which the
 *   checked radio button should be retrieved.
 * @return type object
 *   null,  if @{(oForm)} is invalid or there is no such @{(sGroup)}
 * @return type boolean
 *   false, if no radio button of @{(sGroup)} is checked
 * @return type HTMLInputElement
 *   A reference to the checked radio button otherwise
 */
function getCheckedRadio(oForm, sGroup)
{
  var result = null, e, ig;
  if (oForm
      && (e = oForm.elements)
      && (ig = e[sGroup]))
  {
    result = false;
    for (var i = 0, len = ig.length, io = null;
         i < len;
         i++)
    {
      if ((io = ig[i]).checked)
      {
        result = io;
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
 * @argument HTMLSelectElement oSelect
 *   Reference to a HTMLSelectElement object.
 * @argument boolean bAllowReload
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
 * @argument HTMLSelectElement oSelect
 *   Required reference to an HTMLSelectElement object.
 * @argument string sText
 *   Required text of the new HTMLOptionElement object.
 * @optional number iPosition
 *   Optional. If supported, inserts the new option there;
 *   otherwise the option is appended as last item.
 * @optional string sValue
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
 * @argument HTMLFormElement oForm
 *   Reference to the <code>HTMLFormElement</code> object
 *   which contains the <code>HTMLInputElement</code> object.
 * @argument _ aName
 *   Name of the radio button, i.e. the value of the
 *   <code>name</code> attribute of the respective
 *   <code>input</code> (X)HTML element or the value
 *   of the <code>name</code> property of the respective 
 *   <code>HTMLInputElement</code> object.  Use an expression
 *   that is evaluated to <code>false</code> for the argument
 *   to be ignored.
 * @argument string sValue
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
 * Creates an element of the type specified, using the
 * document.createElement method if supported.  This
 * method works with MSIE, too, for it is tried to use a
 * start tag with the tag name specified as the argument
 * of document.createElement() if the tag name alone does
 * not work.
 * 
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument string sTagName
 *   Tag name of the element to be created.  You may use a
 *   start tag here as well, but note that even if you do
 *   not lose compatibility to other UAs than MSIE 4+,
 *   attributes are not set.  (Subsequent versions will
 *   possibly include an attribute parser to assign
 *   attribute values to the respective DOM object properties
 *   if creation is successful.)
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
function createElement(sTagName)
{
  var o = null;

  if (sTagName
      && typeof document != "undefined"
      && dhtml.isMethodType(typeof document.createElement))
  {
    // remove 
    
  
    sTagName = sTagName.replace(/<?([^ >]+).*>?/, "$1");

    o = document.createElement(sTagName);
    
    if (!o)
    {
      o = document.createElement("<" + sTagName + ">");
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

/**
 * Registers an event-handling function (event listener) for a
 * DOM object as event target.  The following methods are used
 * (in order of preference):
 *
 * - addEventListener(...) method (W3C-DOM Level 2)
 * - attachEvent(...) method (proprietary to MSIE 5+)
 * - Assignment to event-handling property (MSIE 4+ and others)
 * 
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @argument DOMObject o
 *   Reference to the DOM object.
 * @argument string sEvent
 *   Required string to be used as event identifier.
 *   If the addEventListener(...) method is not available,
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @argument Function fListener
 *   Reference to the Function object that provides
 *   event-handling code.  Use <code>null</code> to
 *   remove the event handler if, and only if, the
 *   proprietary event-handling property is available.
 * @optional boolean bUseCapture
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
 *   dom2-events#Events-EventTarget-addEventListener,
 *   msdn#workshop/author/dhtml/reference/methods/attachevent.asp,
 *   http://pointedears.de/scripts/JSdoc/
 */
function registerEvent(o, sEvent, fListener, bUseCapture)
{
  var result;

  if (o)
  {
    if (dhtml.isMethodType(typeof o.addEventListener)
        && dhtml.isMethodType(typeof fListener))
    {
      o.addEventListener(sEvent, fListener, !!bUseCapture);
      result = true;
    }
    else if (dhtml.isMethodType(typeof o.attachEvent)
             && dhtml.isMethodType(typeof fListener))
    {
      result = o.attachEvent("on" + sEvent, fListener);
    }
    else
    {
      o["on" + sEvent] = fListener;
      result = (o["on" + sEvent] == fListener);
    }
  }
  
  return result;
}
DHTML.prototype.registerEvent = registerEvent;

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
 *   (C) 2004  Ulrich Kritzner &lt;droeppez@web.de&gt;
 *   Parts (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://PointedEars.de/scripts/dhtml.js
 * @requires
 *   types.js#isMethodType()
 * @argument string sURI
 *   URI of the script resource to be loaded.
 * @optional string sType = "text/javascript"
 *   MIME type of the script to be loaded.  Used as value of the
 *   <code>type</code> attribute, the default is (still proprietary,
 *   but commonly used) "text/javascript".
 * @optional string sLanguage
 *   Value of the <code>language</code> attribute (deprecated in
 *   HTML 4.01 and XHTML 1.0, absent from XHTML 1.1 and later
 *   versions) to specify the version of the script language.
 *   Unused by default.
 */
function loadScript(sURI, sType, sLanguage)
{
  var result = false;
  
  if (dhtml.isMethodType(typeof document.createElement))
  {
    var oScript;
    if ((oScript = document.createElement("script")))
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
        oScript.defer= true;
      }
      
      var aHeads;
      if (dhtml.isMethodType(typeof document.getElementsByTagName))
      {
        aHeads = document.getElementsByTagName("head");
      }
      else if (dhtml.isIE4DOM && document.all.tags)
      {
        aHeads = document.all.tags["head"];
      }
      
      if (aHeads && typeof aHeads[0] != "undefined")
      {
        if (dhtml.isMethodType(typeof aHeads[0].appendChild))
        {
          aHeads[0].appendChild(oScript);
          result = (
            typeof aHeads[0].lastChild != "undefined"
            && aHeads[0].lastChild == oScript);
        }
        else if (dhtml.isMethodType(typeof aHeads[0].insertAdjacentElement))
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
 * @optional Document|Element o
 *   Reference to a @link{dom2-core#Document} or
 *   @link{dom2-core#Element} object from which to retrieve
 *   descendant elements.  If omitted or evaluated to
 *   <code>false</code>, it is tried to use the calling object.
 * @return type Collection
 *   A reference to an @link{#Collection} object containing
 *   the descendant elements of @link{(o)} or the calling
 *   @link{dom2-core#Document}/@link{dom2-core#Element} object in
 *   "tabindex" order: Elements with "tabindex" > 0 come first,
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
      && /Document|Element/.test(String(this.constructor)))
  {
    o = this;
  }

  if (o && dhtml.isMethodType(typeof o.getElementsByTagName))
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
