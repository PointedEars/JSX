/* PointedEars' DHTML Library 0.5.2003091913
 * Copyright (c) 2002, 2003  Thomas Lahn <dhtml.js@PointedEars.de>
 */
var dhtmlVersion = "0.5.2003091913";
var dhtmlCopyright = "Copyright \xA9 2002, 2003";
var dhtmlAuthor = "Thomas Lahn";
var dhtmlEmail = "dhtml.js@PointedEars.de";
var dhtmlPath = "http://pointedears.de.vu/scripts/";
// var dhtmlDocURL = dhtmlPath + "dhtml.htm";
/*
 * Based upon dhtml.js from SELFHTML (8.0)
 * <http://selfhtml.teamone.de/dhtml/beispiele/dhtml_bibliothek.htm>
 * 
 * Enhancements:
 * 
 * - New features:
 *   + getElem("tagname", "$TAGNAME") : Array
 *   + setAttr(...)
 *   + radioChkdVal(...)
 *   + removeOptions(...)
 *   + addOption(...)
 * - Pretty printing and detailed documentation
 * - Removed unnecessary variables and DHTML_init() function
 * - Use references and initialization wherever possible
 * - Use boolean variables instead of numeric ones
 * - Argument renaming and checking
 * - if...else if...else --> switch...case...default
 *
 * Bugfixes:
 * 
 * - When the result is an object, return `null' instead of
 *   `void (0)'.  Otherwise return a null-string (`""') or
 *   true/false on success/failure, so that each function
 *   has a defined return value.
 * 
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

var
  DHTML = false,
  DOM   = false,
  MS    = false,
  NS    = false,
  OP    = !!window.opera;

if (document.getElementById)
{
  DHTML = true;
  DOM = true;
}

if (document.all && !OP)
{
  DHTML = true;
  MS = true;
}

if (window.netscape && window.screen && !DOM && !OP)
{
  DHTML = true;
  NS = true;
}

/**
 * Retrieves an HTMLElement object or a collection of such
 * objects that match certain criteria.
 * @param sType Defines the type of <code>sValue</code>. Valid
 * values are "id", "name" and "tagname". The argument is
 * case-insensitive.
 * @param sValue Case-sensitive ID, name or tag name of object
 * (collection).
 * @param index Optional. Numeric index of an element of the
 * selected collection. For IDs must be unique throughout a
 * document, this argument is ignored if <code>sType</code> is
 * "id".
 * @returns A reference to an object if <code>sType</code> is
 * "id", or if it is "name" or "tagname" and <code>index</code>
 * is specified; otherwise a collection of objects matching the
 * specified criteria; <code>null</code> if no matching object
 * exists.
 */
function getElem(
  /* string */ sType,
  /* string */ sValue,
  /* number */ index)
{
  if (!sType
    || typeof sType != "string"
    || !sType.toLowerCase
    || !sValue
    || typeof sValue != "string")
    return null;
    
  sType = sType.toLowerCase();
  
  if (DOM)
  {
    switch (sType)
    {
      case "id":
        
        if (typeof document.getElementById(sValue) == "object")
          return document.getElementById(sValue);
        else
          return null;
        break;

      case "name":
        if (typeof document.getElementsByName(sValue) == "object")
          return document.getElementsByName(sValue)[index];
        else
          return null;
        break;

      case "tagname":
        if (typeof document.getElementsByTagName(sValue) == "object"
          || (OP && typeof document.getElementsByTagName(sValue) == "function"))
        {
          if (index)
            return document.getElementsByTagName(sValue)[index];
          else
            return document.getElementsByTagName(sValue);
        }
        else
          return null;
        break;
        
      default:
        return null;
    }
  }
  else if (MS)
  {
    switch (sType)
    {
      case "id":
        if (typeof document.all[sValue] == "object")
          return document.all[sValue];
        else
          return null;
        break;

      case "tagname":
        if (typeof document.all.tags(sValue) == "object")
        {
          if (index)
            return document.all.tags(sValue)[index];
          else
            return document.all.tags(sValue);
        }
        else
          return null;
        break;
    
      case "name":
        if (typeof document[sValue] == "object")
          return document[sValue];
        else
          return null;
        break;
    
      default:
        return null;
    }
  }
  else if (NS)
  {
    switch (sType)
    {
      case "id":
      case "name":
        if (typeof document[sValue] == "object")
          return document[sValue];
        else
          return null;
        break;
  
      case "index":
        if (typeof document.layers[sValue] == "object")
          return document.layers[sValue];
        else
          return null;
        break;

      default:
        return null;
    }
  }
}

/**
  * Retrieves the content of an HTMLElement object that matches
  * certain criteria.
  * @param sType Defines the type of <code>sValue</code>. Valid
  * values are "id", "name" and "tagname". The argument is
  * case-insensitive.
  * @param sValue Case-sensitive ID, name or tag name of object
  * (collection).
  * @param index Optional. Numeric index of an element of the
  * selected collection. For IDs must be unique throughout a
  * document, this argument is ignored if <code>sType</code>
  * is "id".
  * @returns A string with the content of the object if
  * <code>sType</code> is "id", or if it is "name" or "tagname"
  * and <code>index</code> is specified; a null-string if no
  * matching object exists or if the DOM does not provide
  * retrieval of the object's content.
  */
function getCont(
  /* string */ sType,
  /* string */ sValue,
  /* number */ index)
{
  var o = getElem(sType, sValue, index);

  if (DOM && o && o.firstChild)
  {
    if (o.firstChild.nodeType == 3)
      return o.firstChild.nodeValue;
    else
      return "";
  }
  else if (MS && o)
    return o.innerText;
  else
    return "";
}

/**
  * Specifies the content of an HTMLElement object that matches
  * certain criteria.
  * @param sType Defines the type of <code>sValue</code>. Valid
  * values are "id", "name" and "tagname". The argument is
  * case-insensitive.
  * @param sValue Case-sensitive ID, name or tag name of object
  * (collection).
  * @param index Optional. Numeric index of an element of the
  * selected collection. For IDs must be unique throughout a
  * document, this argument is ignored if <code>sType</code>
  * is "id".
  * @returns <code>true</code> if successful,
  * <code>false</code> otherwise.
  */
function setCont(
  /* string */ sType,
  /* string */ sValue,
  /* number */ index,
  /* string */ sNodeValue)
{
  var o = getElem(sType, sValue, index);

  if (DOM && o)
  {
    if (o.firstChild)
      o.firstChild.nodeValue = sNodeValue;
    else if (typeof o.nodeValue != "undefined")
      o.nodeValue = sNodeValue;

    return true;   
  }
  else if (MS && o)
  {
    o.innerText = sNodeValue;
    return true;
  }
  else if (NS
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
    return false;
}

/**
  * Retrieves the value of an attribute of an HTMLElement object
  * that matches certain criteria.
  * @param sType Defines the type of <code>sValue</code>. Valid
  * values are "id", "name" and "tagname". The argument is
  * case-insensitive.
  * @param sValue Case-sensitive ID, name or tag name of object
  * (collection).
  * @param index Optional. Numeric index of an element of the
  * selected collection. For IDs must be unique throughout a
  * document, this argument is ignored if <code>sType</code>
  * is "id".
  * @param sAttrName Name of the attribute from which the value
  * should be retrieved.
  * @returns The value of of the object if <code>sType</code> is "id",
  * or if it is "name" or "tagname" and <code>index</code> is specified;
  * a null-string if no matching object exists or if the DOM does not
  * provide retrieval of the attribute's values.
  */
function getAttr(
  /* string */ sType,
  /* string */ sValue,
  /* number */ index,
  /* string */ sAttrName)
{
  var o = getElem(sType, sValue, index);

  if ((DOM || MS) && o)
    return o.getAttribute(sAttrName);
  else if (NS) 
  {
    var o = getElem(sType, sValue); 
    if (o)
    {
      if (typeof o[index] == "object")
        return o[index][sAttrName]
      else
        return o[sAttrName];
    }
  }
  else
    return "";
}

/**
 * Sets the value of an attribute of an HTMLElement object that
 * matches certain criteria.
 * @param sType Defines the type of <code>sValue</code>. Valid
 * values are "id", "name" and "tagname". The argument is
 * case-insensitive.
 * @param sValue Case-sensitive ID, name or tag name of object
 * (collection).
 * @param index Optional. Numeric index of an element of the
 * selected collection. For IDs must be unique throughout a
 * document, this argument is ignored if <code>sType</code>
 * is "id".
 * @param sAttrName Name of the attribute from which the value
 * should be set.
 * @param attrValue Value of the attribute to be set.
 * @returns The value of of the object if <code>sType</code> is "id",
 * or if it is "name" or "tagname" and <code>index</code> is specified;
 * a null-string if no matching object exists or if the DOM does not
 * provide retrieval of the attribute's values.
 */
function setAttr(
  /* string */ sType,
  /* string */ sValue,
  /* number */ index,
  /* string */ sAttrName,
  /* (any)  */ attrValue)
{
  var o = getElem(sType, sValue, index);
  
  if ((DOM || MS) && o)
  {
    o.setAttribute(sAttrName, attrValue, 0);
    return true;
  }
  else if (NS)
  {
    o = getElem(sType, sValue)
    if (o)
    {
      var o2 = getElem(sType, sValue)[index];
      if (typeof o2 == "oect")
        o2[sAttrName] = attrValue;
      else
        o[sAttrName] = attrValue;
    }
    return true;
  }
  else
    return false;
}

/**
 * Retrieves the value of the checked radiobutton of a group.
 * @param oForm Required. Reference to an HTMLFormElement object
 * to contain the radiobutton group.
 * @param sRadioBtnGrpName Name of the radiobutton groups from
 * which the value of the checked radiobutton should be retrieved.
 * @returns (String) value of the checked radiobutton; a
 * null-string if no such radiobutton is found.
 */
function radioChkdVal(
  /* HTMLFormElement */ oForm,
  /* string */ sRadioBtnGrpName)
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

/**
 * Removes all options from a HTMLSelectElement object.
 * @param oSelect Reference to a HTMLSelectElement object.
 * @param bAllowReload If <code>true</code>, reloads the document.
 * @returns <code>true</code> if successful, <code>false</code>
 * otherwise.
 */
function removeOptions(
  /* HTMLSelectElement */ oSelect,
  /* boolean */ bAllowReload)
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
          o.remove(o.length - 1);
        else
        {
          o[o.length - 1] = null;
          if (bAllowReload)
            history.go(0);
        }
      }
      return true;
    }
  }

  return false;
}

/**
 * Adds an option to an HTMLSelectElement object.
 * @param oSelect Required reference to an HTMLSelectElement
 * object.
 * @param sText Required text of the new HTMLOptionElement
 * object.
 * @param iPosition Optional. If supported, inserts the new
 * option there; else the option is appended as last item.
 * @param sValue Optional value of the new HTMLOptionElement
 * object.
 * @returns A reference to the new option if successful,
 * <code>null</code> otherwise.
 */
function addOption(
  /* HTMLSelectElement */ oSelect,
  /* string */ sText,
  /* number */ iPosition,
  /* string */ sValue)
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
          oNew.value = sValue;
          
        if (arguments.length > 2)
          o.add(oNew, iPosition);
        else
          o.add(oNew);
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