/**
 * <title>PointedEars' DHTML Library</title>
 */
function DHTML()
{
  this.version   = "0.6.2004020802";
// var dhtmlDocURL = dhtmlPath + "dhtml.htm";
/**
 * @partof
 *   PointedEars JavaScript Extensions (JSX)
 * @source Based upon
 *   @link{
 *     selfhtml#dhtml/beispiele/dhtml_bibliothek.htm
 *     dhtml.js from SELFHTML (8.0)
 *   }
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
 * 
 * @section Copyright & Disclaimer
 *
 * @author (C) 2002-2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 */
  this.copyright = "Copyright \xA9 2002-2004";
  this.author    = "Thomas Lahn";
  this.email     = "dhtml.js@PointedEars.de";
  this.path      = "http://pointedears.de.vu/scripts/";
  this.URI       = this.path + "dhtml.js";
//  this.docURI    = this.path + "dhtml.htm";
  this.allowExceptionMsg = true;
/**
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
 * Refer dhtml.htm file for documentation. 
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de.vu/scripts/JSDoc/
 * for details.
 */

  this.isW3CDOM    = this.isMethodType(typeof document.getElementById);
  this.isOpera     = typeof window.opera != "undefined";
  this.isNS4DOM    =
    (typeof window.netscape != "undefined"
      && typeof window.screen != "undefined"
      && !this.isW3CDOM
      && !this.isOpera);
  this.isIE4DOM    =
    typeof document.all == "object" && !this.isOpera;
  this.supported =
    this.isW3CDOM || this.isNS4DOM || this.isOpera || this.isIE4DOM;
}

DHTML.prototype.isMethodType =
function isMethodType(/** @argument optional string */ s)
/**
 * @author
 *   (C) 2003, 2004  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/types.js
 * @param s
 *   String to be determined a method type, i.e. "object"
 *   in IE, "function" otherwise.  The type must have been
 *   retrieved with the `typeof' operator, thus this method
 *   is applicable to unknown properties while
 *   @link{#isMethod()} is not.
 * @returns
 *   <code>true</code> if <code>s</code> is a method type,
 *   <code>false</code> otherwise.
 * @see isMethod()
 */
{
  return (s == "function" || s == "object");
}

DHTML.prototype.dummyError = function dummyError()
/**
 * General error capturing function.
 */
{
  onerror = null;
  return true;
}

var dhtml = new DHTML();

function DHTMLException(/** @argument optional string */ sMsg)
/**
 * Shows an exception alert and allows for
 * displaying a stack trace.
 *
 * @param sMsg
 *   Optional error message to be displayed.
 */
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

function getElem(
  /** @argument string          */ sType,
  /** @argument optional string */ sValue,
  /** @argument optional number */ index)
/**
 * Retrieves an HTMLElement object or a collection of such
 * objects that match certain criteria.
 * 
 * @author
 *   (C) 2003, 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param sType
 *   Defines the type of <code>sValue</code>. Valid values are
 *   "id", "name" and "tagname". The argument is case-insensitive.
 * @param sValue
 *   Case-sensitive ID, name or tag name of object (collection).
 * @param index
 *   Optional. Numeric index of an element of the selected
 *   collection. For IDs must be unique throughout a document,
 *   this argument is ignored if <code>sType</code> is "id".
 * @returns
 *   A reference to an object if <code>sType</code> is "id", or
 *   if it is "name" or "tagname" and <code>index</code> is
 *   specified; otherwise a collection of objects matching the
 *   specified criteria; <code>null</code> if no matching object
 *   exists.
 */
{
  function invalidType()
  {
    DHTMLException(
        'getElem: Invalid type "' + sType + '"\n'
      + 'Must be one of "id", "name", "tagname" or "index" (case-insensitive).'
    );
    return null;
  }

  if (!sType
      || typeof sType != "string"
      || !sType.toLowerCase)
  {
    DHTMLException(
        "getElem: Invalid type: " + sType + "\n"
      + "Must be String.");
    return null;
  }

  if (!sValue
      || typeof sValue != "string")
  {
    DHTMLException(
        "getElem: Invalid value: " + sValue + "\n"
      + "Must be String.");
    return null;
  }
    
  sType = sType.toLowerCase();
  
  var o = null;
  
  if (dhtml.isW3CDOM)
  {
    switch (sType)
    {
      case "id":
        return document.getElementById(sValue);
        break;

      case "name":
        if (dhtml.isMethodType(typeof document.getElementsByName))
        {
          o = document.getElementsByName(sValue);

          if (typeof index != "undefined"
              && index != null
              && index >= 0
              && o[index])
          {
            return o[index];
          }

          return o;
        }
        else
        {
          return null;
        }
        break;

      case "tagname":
        if (dhtml.isMethodType(typeof document.getElementsByTagName))
        {
          o = document.getElementsByTagName(sValue);
          
          if (typeof index != "undefined"
              && index != null
              && index >= 0)
          {
            return o[index];
          }

          return o;
        }
        else
        {
          return null;
        }
        break;
        
      default:
        return invalidType();
    }
  }
  else if (dhtml.isIE4DOM)
  {
    switch (sType)
    {
      case "id":
        return document.all(sValue);
        break;

      case "tagname":
        if (typeof document.all.tags == "object")
        {
          if (typeof index != "undefined"
              && index != null
              && index >= 0)
          {
            return document.all.tags(sValue)[index];
          }
          else
          {
            return document.all.tags(sValue);
          }
        }
        else
          return null;
        break;
    
      case "name":
        return document.all[sValue];
        break;
    
      default:
        return invalidType();
    }
  }
  else if (dhtml.isNS4DOM)
  {
    switch (sType)
    {
      case "id":
      case "name":
        if (typeof document[sValue] == "object")
        {
          return document[sValue];
        }
        else
        {
          return null;
        }
        break;
  
      case "index":
        if (typeof document.layers[sValue] == "object")
        {
          return document.layers[sValue];
        }
        else
        {
          return null;
        }
        break;

      default:
        return invalidType();
    }
  }
  else
  {
    return null;
  }
}
DHTML.prototype.getElem = getElem;

function getCont(
  /** @argument string  */ sType,
  /** @argument string  */ sValue,
  /** @optional number  */ index,
  /** @optional boolean */ bHTML)
/**
 * Retrieves the content of an HTMLElement object that matches
 * certain criteria.
 * 
 * @author
 *   (C) 2003, 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param sType
 *   Defines the type of <code>sValue</code>. Valid values are
 *   "id", "name" and "tagname". The argument is case-insensitive.
 * @param sValue
 *   Case-sensitive ID, name or tag name of object (collection).
 * @param index
 *   Optional. Numeric index of an element of the selected
 *   collection. For IDs must be unique throughout a document,
 *   this argument is ignored if <code>sType</code> is "id".
 * @returns
 *  A string with the content of the object if <code>sType</code>
 *  is "id", or if it is "name" or "tagname" and
 *  <code>index</code> is specified; a null-string if no matching
 *  object exists or if the DOM does not provide retrieval of the
 *  object's content.
 */
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

function setCont(
  /** @argument string */ sType,
  /** @argument string */ sValue,
  /** @argument optional number */ index,
  /** @argument string */ sNodeValue)
/**
 * Specifies the content of an HTMLElement object that matches
 * certain criteria.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param sType
 *   Defines the type of <code>sValue</code>. Valid values are
 *   "id", "name" and "tagname". The argument is case-insensitive.
 * @param sValue
 *   Case-sensitive ID, name or tag name of object (collection).
 * @param index
 *   Optional. Numeric index of an element of the selected
 *   collection. For IDs must be unique throughout a document,
 *   this argument is ignored if <code>sType</code> is "id".
 * @param sNodeValue
 *   New content of the element.
 * @returns
 *   <code>true</code> if successful, <code>false</code>
 *   otherwise.
 */
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

function getAttr(
  /* string */ sType,
  /* string */ sValue,
  /* number */ index,
  /* string */ sAttrName)
/**
 * Retrieves the value of an attribute of an HTMLElement object
 * that matches certain criteria.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param sType
 *   Defines the type of <code>sValue</code>. Valid
 *   values are "id", "name" and "tagname". The argument is
 *   case-insensitive.
 * @param sValue
 *   Case-sensitive ID, name or tag name of object
 *   (collection).
 * @param index
 *   Optional. Numeric index of an element of the
 *   selected collection. For IDs must be unique throughout a
 *   document, this argument is ignored if <code>sType</code>
 *   is "id".
 * @param sAttrName
 *   Name of the attribute from which the value
 *   should be retrieved.
 * @returns
 *   The value of of the object if <code>sType</code> is "id",
 *   or if it is "name" or "tagname" and <code>index</code> is
 *   specified;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
{
  var o = getElem(sType, sValue, index);

  if ((dhtml.isW3CDOM || dhtml.isIE4DOM) && o)
  {
    return o.getAttribute(sAttrName);
  }
  else if (dhtml.isNS4DOM) 
  {
    o = getElem(sType, sValue); 
    if (typeof o == "object")
    {
      if (typeof o[index] == "object")
      {
        return o[index][sAttrName];
      }
      else
      {
        return o[sAttrName];
      }
    }
  }
  else
  {
    return "";
  }
}
DHTML.prototype.getAttr = getAttr;

function setAttr(
  /* string */ sType,
  /* string */ sValue,
  /* number */ index,
  /* string */ sAttrName,
  /* (any)  */ attrValue)
/**
 * Sets the value of an attribute of an HTMLElement object
 * that matches certain criteria.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param sType
 *   Defines the type of <code>sValue</code>.  Valid
 *   values are "id", "name" and "tagname".  The argument
 *   is case-insensitive.
 * @param sValue
 *   Case-sensitive ID, name or tag name of object
 *   (collection).
 * @param index
 *   Optional. Numeric index of an element of the
 *   selected collection. For IDs must be unique throughout a
 *   document, this argument is ignored if <code>sType</code>
 *   is "id".
 * @param sAttrName
 *   Name of the attribute of which the value should be set.
 * @param attrValue
 *   Value of the attribute to be set.
 * @returns
 *   The value of of the object if <code>sType</code> is "id",
 *   or if it is "name" or "tagname" and <code>index</code> is
 *   specified;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
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

function setStyleProperty(
  /* string */ sType,
  /* string */ sValue,
  /* number */ index,
  /* string */ sPropertyName,
  /* (any)  */ propValue)
/**
 * Sets the value of a style property of an HTMLElement object
 * that matches certain criteria.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param sType
 *   Defines the type of <code>sValue</code>.  Valid
 *   values are "id", "name" and "tagname".  The argument
 *   is case-insensitive.
 * @param sValue
 *   Case-sensitive ID, name or tag name of object
 *   (collection).
 * @param index
 *   Optional. Numeric index of an element of the
 *   selected collection. For IDs must be unique throughout a
 *   document, this argument is ignored if <code>sType</code>
 *   is "id".
 * @param sPropertyName
 *   Name of the style property of which the value should be set.
 * @param propValue
 *   Value of the style property to be set.
 * @returns
 *   The value of of the object if <code>sType</code> is "id",
 *   or if it is "name" or "tagname" and <code>index</code> is
 *   specified;
 *   a null-string if no matching object exists or if the DOM
 *   does not provide retrieval of the attribute's values.
 */
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

function display(
  /** @argument HTMLElement */ o,
  /** @argument boolean     */ bShow)
/**
 * Allows or prevents rendering of the a DOM object.
 *
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param o
 *   Reference to the DOM object to be rendered or not.
 * @param bShow
 *   Renders the object referenced by <code>o</code> if
 *   <code>true</code>, does not render it if <code>false</code>.
 *   Note that not to render an element is different from
 *   hiding it as the space it would take up is then not
 *   longer reserved.
 * @returns
 *   <code>true</code> if successful,
 *   <code>false</code> otherwise.
 * @see
 *   visibility()
 */
{
  if (o)
  {
    if (typeof o.style != "undefined"
        && typeof o.style.display != "undefined")
    {
      o.style.display = bShow ? "" : "none";
      return (o.style.display == bShow ? "" : "none");
    }
    else if (typeof o.visibility != "undefined")
    {
      o.visibility = bShow ? "show" : "hide";
      return (o.visibility == bShow ? "show" : "hide");
    }
  }
}
DHTML.prototype.display = display;

function visibility(
  /** @argument HTMLElement */ o,
  /** @argument boolean     */ bVisible)
/**
 * Shows or hides a DOM object.
 *
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param o
 *   Reference to the DOM object to be either shown or hidden.
 * @param bShow
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
{
  if (o)
  {
    if (typeof o.style != "undefined"
        && typeof o.style.visibility != "undefined")
    {
      o.style.visibility = bVisible ? "visible" : "hidden";
      return (o.style.visibility == bVisible ? "visible" : "hidden");
    }
    else if (typeof o.visibility != "undefined")
    {
      o.visibility = bVisible ? "show" : "hide";
      return (o.visibility == bShow ? "show" : "hide");
    }
  }
}
DHTML.prototype.visibility = visibility;

function /** @type boolean */ setValue(
  /** @argument HTMLInputElement      */ oInput,
  /** @argument string                */ sValue,
  /** @optional boolean default false */ bSetTitle)
/**
 * Sets the value property of an HTMLInput element,
 * and its "title" property accordingly if specified.
 * 
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param oInput
 *   Required.  Reference to an HTMLInputElement object.
 * @param sValue
 *   New value of the "value" property of the
 *   HTMLInputElement object.
 * @param bSetTitle
 *   Specifies if the "title" property should be set to
 *   the same value as the "value" property.  The default
 *   is <code>false</code>.
 * @returns
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

function radioChkdVal(
  /* @argument HTMLFormElement */ oForm,
  /* @argument string          */ sRadioBtnGrpName)
/**
 * Retrieves the value of the checked radiobutton of a group.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param oForm
 *   Required. Reference to an HTMLFormElement object to contain
 *   the radiobutton group.
 * @param sRadioBtnGrpName
 *   Name of the radiobutton groups from which the value of the
 *   checked radiobutton should be retrieved.
 * @returns
 *   (String) value of the checked radiobutton; a null-string if
 *   no such radiobutton is found.
 */
{
  var o = oForm.elements;

  if (o && o.length)
  {
    for (var i = 0; i < o.length; i++)
    {
      if ((o[i].name == sRadioBtnGrpName)
        && o[i].checked)
      {
        return (o[i].value);
      }
    }
  }

  return "";
}
DHTML.prototype.radioChkdVal = radioChkdVal;

function removeOptions(
  /* @argument HTMLSelectElement */ oSelect,
  /* @argument boolean           */ bAllowReload)
/**
 * Removes all options from a HTMLSelectElement object.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param oSelect
 *   Reference to a HTMLSelectElement object.
 * @param bAllowReload
 *   If <code>true</code>, reloads the document.
 * @returns
 *   <code>true</code> if successful, <code>false</code>
 *   otherwise.
 */
{
  if (oSelect
    && oSelect.tagName
    && oSelect.tagName.toLowerCase() == "select")
  {
    var o = oSelect.options;
    if (o && o.length)
    {
      while(o.length > 0)
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

function addOption(
  /** @argument HTMLSelectElement */ oSelect,
  /** @argument string            */ sText,
  /** @argument optional number   */ iPosition,
  /** @argument optional string   */ sValue)
/**
 * Adds an option to an HTMLSelectElement object.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @argdescr oSelect
 *   Required reference to an HTMLSelectElement object.
 * @argdescr sText
 *   Required text of the new HTMLOptionElement object.
 * @argdescr iPosition
 *   Optional. If supported, inserts the new option there;
 *   otherwise the option is appended as last item.
 * @argdescr sValue
 *   Optional value of the new HTMLOptionElement object.
 * @returns
 *   A reference to the new option if successful,
 *   <code>null</code> otherwise.
 */
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

function selectRadioBtn(
  /** @argument HTMLFormElement */ oForm,
  /** @argument                 */ aName,
  /** @argument string          */ sValue)
/**
 * Select a radio button depending on its value and, optionally,
 * its name.
 * 
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param oForm
 *   Reference to the <code>HTMLFormElement</code> object
 *   which contains the <code>HTMLInputElement</code> object.
 * @param aName
 *   Name of the radio button, i.e. the value of the
 *   <code>name</code> attribute of the respective
 *   <code>input</code> (X)HTML element or the value
 *   of the <code>name</code> property of the respective 
 *   <code>HTMLInputElement</code> object.  Use an expression
 *   that is evaluated to <code>false</code> for the argument
 *   to be ignored.
 * @param sValue
 *   Value of the radio button, i.e. the value of the
 *   <code>value</code> attribute of the respective
 *   <code>input</code> (X)HTML element or the value
 *   of the <code>value</code> property of the respective 
 *   <code>HTMLInputElement</code> object.
 */
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

function disableElementGroup(
  /** @argument HTMLElement|HTML(Options)Collection */ oElementGroup,
  /** @optional number|string                       */ index)
/**
 * Disables a form element or a collection of form elements.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param oElementGroup
 *   Reference to the <code>HTMLElement</code> or to
 *   the <code>HTML(Options)Collection</code> object.
 * @param index
 *   Optional number or string to specify
 *   one element within the collection.
 */
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

function registerEvent(
  /** @argument DOMObject */ o,
  /** @argument string    */ sEvent,
  /** @argument Function  */ fListener,
  /** @optional boolean   */ bUseCapture)
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
 *   http://pointedears.de.vu/scripts/dhtml.js
 * @param o
 *   Reference to the DOM object.
 * @param sEvent
 *   Required string to be used as event identifier.
 *   If the addEventListener(...) method is not available,
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @param fListener
 *   Reference to the Function object that provides
 *   event-handling code.  Use <code>null</code> to
 *   remove the event handler if, and only if, the
 *   proprietary event-handling property is available.
 * @param bUseCapture
 *   Optional. If <code>true</code>, the argument indicates that
 *   the user wishes to initiate capture.  Corresponds to the
 *   third parameter of the addEventListener(...) method, is
 *   ignored if that method is not supported by the DOM (object).
 * @returns
 *   <code>true</code> on success, <code>false</code> otherwise.
 *   Since addEventListener(...) returns no value and throws
 *   no exceptions (what a bad design!), it is considered to be
 *   successful always, while attachEvent(...) returns success
 *   or failure, and the new value of the proprietary
 *   event-handling property must match the assigned value for
 *   the method to be successful.
 * @see
 *   @link{dom2-events#Events-EventTarget-addEventListener},
 *   @link{msdn#workshop/author/dhtml/reference/methods/attachevent.asp}
 *   http://pointedears.de.vu/scripts/JSdoc/
 */
{
  if (o)
  {
    if (dhtml.isMethodType(typeof o.addEventListener)
        && dhtml.isMethodType(typeof fListener))
    {
      o.addEventListener(sEvent, fListener, !!bUseCapture);
      return true;
    }
    else if (dhtml.isMethodType(typeof o.attachEvent)
             && dhtml.isMethodType(typeof fListener))
    {
      return o.attachEvent("on" + sEvent, fListener);
    }
    else
    {
      o["on" + sEvent] = fListener;
      return (o["on" + sEvent] == fListener);
    }
  }
}
DHTML.prototype.registerEvent = registerEvent;

/**
 * Appends a JavaScript include to the <code>head</code> element
 * of an (X)HTML document.
 */
function loadScript(
  /** @argument string */ sURI,
  /** @optional string */ sType,
  /** @optional string */ sLanguage)
/**
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
 *   0.2.2004020615
 * @author
 *   (C) 2004  Ulrich Kritzner &lt;droeppez@web.de&gt;
 *   Parts (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://PointedEars.de.vu/scripts/dhtml.js
 * @requires
 *   types.js#isMethodType()
 * @param sURI
 *   URI of the script resource to be loaded.
 * @param sType
 *   MIME type of the script to be loaded.  Used as value of the
 *   <code>type</code> attribute, the default is (still proprietary,
 *   but commonly used) "text/javascript".
 * @param sLanguage
 *   Value of the <code>language</code> attribute (deprecated in
 *   HTML 4.01) to specify the version of the script language.
 *   Unused by default
 */
{
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
      
      if (sLanguage)
      {
        oScript.language = sLanguage;
      }
      
      var aHeads;
      if (dhtml.isMethodType(typeof document.getElementsByTagName))
      {
        aHeads = document.getElementsByTagName("head")
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
          return (
            typeof aHeads[0].lastChild != "undefined"
            && aHeads[0].lastChild == oScript);
        }
        else if (dhtml.isMethodType(typeof aHeads[0].insertAdjacentElement))
        {
          aHeads[0].insertAdjacentElement("beforeEnd", oScript);
          return true;
        }
      }
    }
  }
  return false;
}
DHTML.prototype.loadScript = loadScript;
