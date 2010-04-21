/* Original filename: enhanced.js
 *
 * <title>Level-1 Enhanced Website Features</title>
 * Part of PointedEars' JavaScript Extensions (JSX)
 * Copyright (c) 2001-2003  Thomas Lahn <enhanced.js@PointedEars.de>
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
 * Refer enhanced.htm file for general documentation. 
 */

var enhancedVersion = "1.29.2003.3b3+";
var enhancedCopyright = "Copyright \xA9 1999-2002";
var enhancedAuthor = "Thomas Lahn";
var enhancedEmail = "PointedEars@gmx.de";
var enhancedPath = "http://www.tu-ilmenau.de/~thla-in/scripts/";
var enhancedDocURL = enhancedPath + "enhanced.htm";

// Script exceptions

function enhancedException(Msg)
{
  alert(
    "enhanced.js "
      + enhancedVersion
      + "\n"
      + enhancedCopyright
      + "  "
      + enhancedAuthor
      + " <"
      + enhancedEmail
      + ">\n\n"
      + Msg);
  return false;
}

function ENoBrowser()
{
  return enhancedException(
    "This script is designed to be processed from a web browser only.");
}

function EInvalidArgNum(sFunctionName, iArg)
{
  /*  if (arguments.length < 2) iArg = "?";*/
  return enhancedException(
    sFunctionName
      + ": The user script did not pass the required number of arguments ("
      + iArg
      + ").\nRefer documentation in script file for correct function call.");
}

function EInvalidArg(sFunctionName, sArg)
{
  return enhancedException(
    sFunctionName
      + ": The user script passed an invalid argument ("
      + sArg
      + ").\nRefer documentation in script file for correct function call.");
}

function getError(e)
{
  var sError = e;

  if (e.name)
    sError += "\nName: " + e.name;
  if (e.number)
    sError += "\nCode: " + e.number;
  if (e.message)
    sError += "\nMessage: " + e.message;
  if (e.description)
    sError += "\nDescription: " + e.description;
  if (e.fileName)
    sError += "\nFilename: " + e.fileName;

  try
  {
    if (e.lineNumber)
      sError += "\nLine: " + e.lineNumber;
  }
  catch (e2)
  {
    sError += "\nLine: " + e2;
  }
        
  if (e.stack)
    sError += "\nStack:\n" + e.stack;

  return sError;
}

// Script features

function isArray(value)
{
  if (value.length)
    return true;
  else
    return false;
}

var CH_NBSP = unescape("%A0");

function replaceText(sText, sReplaced, sReplacement, bForceLoop)
{
  var result;
  var sNewText = sText;
  // alert(sText);
  if (sText)
  {
    if (sText.replace && !bForceLoop)
    {
      sReplaced = sReplaced.replace(/\\/g, "\\\\");
      /* Version 1.23.2002.4 bugfix: allows to replace \ with other
         strings, required for proper rxReplaced;
         Example (no quotes, no escaping):
            sReplaced (provided)                     "\\"
            sReplaced (evaluated)                     \
            sReplaced (replaced as formulated above) "\\\\"
            sReplaced (esc. in RegExp constructor)   "\\\\"
            sReplaced (ev. in RegExp constructor)     \\
            rxReplaced (with RegExp escaping)        /\\/g
            rxReplaced (evaluated)                   all occurr. of \
      */
      var rxReplaced = new RegExp(sReplaced, "g");
      sText = sText.replace(rxReplaced, sReplacement);

      result = sText;
    }
    else
    {
      var i = sText.indexOf(sReplaced);
      if (i > -1)
      {
        sNewText = sText.substring(0, i);
        sNewText += sReplacement
          + replaceText(
            sText.substring(i + sReplaced.length),
            sReplaced,
            sReplacement);
      }

      result = sNewText;
    }
  }
  return result;
}

function trimLeft(s)
{
  var iStart = 0, sResult = "";

  if (s != "")
  {
    var l = s.length - 1;
    for (i = 0; i < l; i++)
    {
      a = s.charAt(i);
      if ((a != " ") && (a != CH_NBSP))
      {
        iStart = i;
        break;
      }
    }
    var iRealLength = s.length;
    iRealLength += 1;
    sResult = s.substr(iStart, iRealLength);
  }

  return sResult;
}

function trimRight(s)
{
  var iStop = 0, sResult = "";

  if (s != "")
  {
    for (i = (s.length - 1); i > 0; i--)
    {
      a = s.charAt(i);
      if ((a != " ") && (a != CH_NBSP))
      {
        iStop = i;
        iStop += 1;
        break;
      }
    }
    sResult = s.substr(0, iStop);
  }

  return sResult;
}

function trim(s)
{
  var sResult = s; // version 1.06.2000.3 bugfix, formerly nullstring assigned

  if (s != "")
  {
    sResult = trimLeft(s);
    // direct processing via trimRight(trimLeft(...)) does not seem to work
    sResult = trimRight(sResult);
  }

  return sResult;
}

function LCaps(s)
{
  return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
}

function setStatus(sCaption)
{
  window.status = sCaption;
  return true;
}

function stripTags(taggedStr)
{
  var
    a = "",
    outOfTag = true,
    untaggedStr = "",
    l = taggedStr.length;

  for (var i = 0; i < l; i++)
  {
    a = taggedStr.charAt(i);
    if (outOfTag && (a == "<"))
      outOfTag = false;
    if (outOfTag)
      untaggedStr += a;
    if ((!outOfTag) && (a == ">"))
      outOfTag = true;
  }

  return untaggedStr;
}

function strCount(s, substr, bCaseSensitive)
{
  var result = 0;

  if (!s || !substr)
    return -1;
  if (!bCaseSensitive)
  {
    if (s.toUpperCase)
      s = s.toUpperCase();
    if (substr.toUpperCase)
      substr = substr.toUpperCase();
  }
  if (window.RegExp)
  {
    var rxSub = new RegExp(substr, "g");
    if (s.match && rxSub)
    {
      result = s.match(rxSub);
      if (result && result.length)
        return result.length;
      else
        return 0;
    }
  }
  if (s.substr && substr.length)
  {
    for (var i = 0; i < s.length; i++)
      if (s.substr(i, substr.length) == substr)
      {
        result++;
        i += substr.length - 1;
      }
    return result;
  }
  else
    return -1;
}

var sLinkOutMsg_de =
  "Dieser Link ist offline nicht verfügbar.\n\n"
  + "Wenn Sie mit dem Internet verbunden sind, steht Ihnen die Seite online"
  + " zur Verfügung.\n\n"
  + "Möchten Sie jetzt eine Verbindung zu dieser Seite herstellen?";
  
var sLinkOutMsg_us =
  "This link is not available offline.\n\n"
  + "If you are connected to the Internet, the website is available online.\n\n"
  + "Do you wish to connect to this website now?';";
var sLinkOutMsg = sLinkOutMsg_de;

function linkOut(sURL, sLink, bShowURL, aTarget, sWidth, sHeight, sOptions)
{
  if (arguments.length < 1)
  {
    EInvalidArgNum("linkOut", 1);
    return false;
  }

  var arg = sLinkOutMsg;
  // version 1.05.2000.3 update, formerly bShowURL as 2nd argument; fixed problem with websites created earlier
  if (arguments.length < 3)
    bShowURL = true;

  if (((sURL != "") && (bShowURL == true))
    || ((arguments.length >= 2) && (sLink != "")))
  {
    var oldArg = arg;
    arg = "\n\n";
    arg += oldArg;
  }

  if ((sURL != "") && (bShowURL == true))
  {
    var oldArg = arg;
    arg = sURL;
    arg += oldArg;
  }

  if ((arguments.length >= 2) && (sLink != ""))
  {
    if ((sURL != "") && (bShowURL == true))
    {
      var oldArg = arg;
      arg = sLink;
      arg += "\n";
      arg += oldArg;
    }
    else
    {
      var oldArg = arg;
      arg = sLink;
      arg += oldArg;
    }
  }

  if (confirm(arg))
  {
    var oTarget = document;
    if ((arguments.length >= 4)
      && (aTarget != "")
      && (aTarget.toLowerCase() != "_self"))
    { // version 1.05.2000.3 update, formerly no nullstrings nor "_self" supported
      if (isNaN(aTarget))
      {
        if ((aTarget.toLowerCase() == "_new")
          || (aTarget.toLowerCase() == "_blank"))
        {
          popUp(sURL, sWidth, sHeight, sOptions);
          return;
        }
        else
          oTarget = parent.eval(aTarget).document;
        // and below: v1.09.2000.3 bugfix
      }
      else
        oTarget = parent.frames[aTarget].document;
    }
    oTarget.location = "";
    oTarget.location.href = sURL;
  }

  return false; // version 1.15.2000.11 update
}

function popUp(sURL, iWidth, iHeight, sOptions)
{
  var sFeatures = "height=";
  sFeatures += String(iHeight);
  sFeatures += ",width=";
  sFeatures += String(iWidth);
  if (arguments.length > 3)
  {
    sFeatures += ",";
    sFeatures += sOptions;
  }
  var wndChild = window.open(sURL, null, sFeatures);
  return false;
}

// OpenChildWin(...) call redirected to popUp(...) for compatibility to previous versions

function OpenChildWin(sURL, iWidth, iHeight, sOptions)
{
  return popUp(sURL, iWidth, iHeight, sOptions);
}

function LoadFrame(sURL, targetFrame)
{
  if (arguments.length < 2)
  {
    // Raise exception if required arguments are missing
    return EInvalidArgNum("LoadFrame", 2);
  }
  if (isNaN(targetFrame))
  {
    if (parent.eval(targetFrame))
    {
      parent.eval(targetFrame).location.href = sURL;
      return sURL;
    }
    else
      return targetFrame;
  }
  else
  {
    if (parent.frames[targetFrame])
    {
      parent.frames[targetFrame].location.href = sURL;
      return sURL;
    }
    else
      return targetFrame;
  }
}

var sDefaultInspectorPath = enhancedPath + "obj-insp.html";

function noError()
{
  this.onerror = null;
  return true;
}

function getObjInfo(aObject, aWhat, sStyle, sHeader, sFooter, sInspectorPath) {
  var sErrPrefix = "JSX:getObjInfo " + enhancedVersion + ": ";
  var sNoObj = "not an object";
  // alert("1: " + aObject + "[" + typeof aObject + "]");
  if (aObject) {
    /* check if `try {'...`} catch {'...`} finally {'...`}' is supported,
      do not guess object otherwise; Netscape 4.x workaround
    */
    tcf = false;
    window.onerror = noError; // JavaScript 1.0 compatible
    eval("try { tcf = false; } finally { tcf = true; };");
//    alert(aObject);
    window.onerror = null;
    var sObject = aObject;
    if (typeof aObject == "string") {
      if (tcf) {
        var bFailed = false;
        eval('\
          try { \
            // alert("2: " + aObject + "[" + typeof sObject + "]"); \n\
            aObject = eval(aObject); \
          } catch (e) { \
            // alert("3: " + sObject + "[" + typeof sObject + "]"); \n\
            var sObject = "window." + sObject; \
            try { \
              // alert("4: " + aObject + "[" + typeof aObject + "]"); \n\
              aObject = eval(sObject); \
            } catch (e) { \
              // alert("5: " + "[Not an object]"); \n\
              bFailed = true; \
            } \
          } \
        ');
        if (bFailed)
          return sErrPrefix + sObject + " is " + sNoObj + ".";
      }
      else {
        aObject = eval(aObject);
        if (!aObject)
          return (sErrPrefix + sObject + " is " + sNoObj + ".");
        // alert("6: " + "[Not an object]");
      }
    }
    // alert("7: " + aObject);
  } else{
    // alert("8: " + "[Not an object]");
    return (sErrPrefix + "[" + sNoObj + "]");
  }
  if (!aWhat) aWhat = ""; // v1.29.2002.10b3 bugfix
  var bShowProps     = (aWhat  && (!aWhat.test && aWhat.toUpperCase().indexOf("P") > -1));
  var bShowMethods   = (aWhat  && (!aWhat.test && aWhat.toUpperCase().indexOf("M") > -1));
  var bShowObjects   = (aWhat  && (!aWhat.test && aWhat.toUpperCase().indexOf("O") > -1));
  var bFormatAsArray = (sStyle && (sStyle.toUpperCase().indexOf("A") > -1));
  var bTextLineStyle = (sStyle && (sStyle.toUpperCase().indexOf("L") > -1));
  var bFormatAsLines = (sStyle && (sStyle.toUpperCase().indexOf("H") > -1));
  var bFormatAsTable = (sStyle && (sStyle.toUpperCase().indexOf("T") > -1));
  var bShowType      = (sStyle && (sStyle.toUpperCase().indexOf("S") > -1));
  var bFormatAsHTML  = (bFormatAsLines || bFormatAsTable);

  if (sHeader && (sHeader == "-"))
    sHeader = "";
  else if (!sHeader || (sHeader == "")) {
    sHeader = "";
    if (bShowObjects || bShowProps || bShowMethods) {
      if (bShowProps)
        sHeader = "Properties";
      else if (bShowObjects)
        sHeader = "Composed Objects";
      if (bShowMethods) {
        if (bShowObjects || bShowProps)
          sHeader += " and ";
        sHeader += "Methods";
      }
    } else
      sHeader = "Attributes";
    sHeader += " of " + (bFormatAsHTML ? '<code>' : '') + sObject
            +  (aWhat.test ? ' matching ' + String(aWhat) : '') + (bFormatAsHTML ? '<\/code>' : '');
  }
  var sAttr =
    (bFormatAsTable ? '<table border="1" cellpadding="5" cellspacing="0">\n' : '')
    + ((sHeader != "") ?
        (bFormatAsTable ? '<tr><th align="left" colspan="' + (bShowType ? 3 : 2) + '">' : '')
        + sHeader
        + (bFormatAsHTML && bFormatAsLines ? "<br />\n" : (!bFormatAsHTML ? "\n__________________________________________________\n" : ""))
        + (bFormatAsTable ?
            ('<\/th><\/tr>\n<tr><th align="left">Name<\/th>'
            + (bShowType ? '<th align="left">Type<\/th>' : '')
            + '<th align="left">Value<\/th><\/tr>\n') : ''
          ) :
        "");
  var bCondition = false;
  var aAttributes = new Array();
  for (var Attribute in aObject) {
    if (!aWhat.test || aWhat.test(Attribute))
      aAttributes[aAttributes.length] = Attribute;
  }
  if (aAttributes.sort) // sort attributes lexically
    aAttributes.sort();
  if (bFormatAsArray) // return an array instead of text
    return aAttributes;
  for (var i = 0; i < aAttributes.length; i++) {
    var bCondition = false;
    var isError = false;
    if (tcf) // see above
      eval('\
        try { \
          if (aObject[aAttributes[i]]) \
            var attrValue = aObject[aAttributes[i]]; \
          else \
            var attrValue = eval("aObject." + aAttributes[i]); \
          var bMethod = (String(attrValue).toLowerCase().indexOf("function ") > -1); \
        } catch (e) { \
          var attrValue = "[" + e + "]"; \
          var bMethod = false; \
          isError = true; \
        } \
      ');
    else {
      if (aObject[aAttributes[i]])
         var attrValue = aObject[aAttributes[i]];
      else
        var attrValue = eval("aObject." + aAttributes[i]);
      var bMethod = (String(attrValue).toLowerCase().indexOf("function ") > -1);
    }
    var bProperty = !bMethod;
    var attrType = typeof attrValue;
    var bObject = (attrType == "object");
    if (aWhat && (aWhat != "") && (!aWhat.test))
      bCondition =
        (bProperty && bShowProps) || (bMethod && bShowMethods) || (bObject && bShowObjects);
    else
      bCondition = true;
    if (bCondition) {
      var s = ((isNaN(attrValue) || String(attrValue) == "")
        && !bObject && !isError) ? "\"" : "";

      var attrName = String(aAttributes[i]);
      var sAttrName = attrName;
      if (bFormatAsHTML) {
        sAttrName = "<code><b>" + attrName + "<\/b><\/code>";
        attrValue = replaceText(replaceText(String(attrValue), "<", "&lt;"), ">", "&gt;");
      }
      sAttr +=
        (bFormatAsTable ? '<tr valign="top"><td>' : '')
        + ((bObject && bFormatAsHTML) ?
          ("<a href='javascript:ObjectInspector(\"" + sObject + ")'>") : '')
        + sAttrName
        + (bObject && bFormatAsHTML ? '<\/a>' : '')
        + (bFormatAsTable ? '<\/td>' : "")
        + (bShowType ? (bFormatAsTable ? ('<td><code>' + attrType + '<\/code><\/td>') : (CH_NBSP + ":" + CH_NBSP + attrType)) : "")
        + (bFormatAsTable ? '<\/td><td><code>' : (CH_NBSP + "=" + CH_NBSP))
        + s + attrValue + s;
//          ("<a href='javascript:ObjectInspector(\'' + sObject + '[\"' + attrName + '\"]\'', \'' + aWhat + '\', \'' + sStyle +'\');"'
//          + ' !onclick="window.open(\''
//          + (sInspectorPath ? escape(sInspectorPath) : sDefaultInspectorPath)
//          + '?obj='  + escape(sObject) + "." + escape(attrName)
//          + '&what=' + escape(aWhat)
//          + '&style=' + escape(sStyle)
//          + '\', \'wndObjectInspector\', \'scrollbars=yes,resizable=yes\'); return false;"'
      if (bFormatAsHTML) {
        if (bFormatAsTable)
          sAttr += "<\/code><\/td><\/tr>\n";
        else
          sAttr += "<br />\n";
      } else if (bTextLineStyle)
        sAttr += "; ";
      else
        sAttr += "\n";
    }
  }

  switch (String(sFooter)) {
    case "-":
      sFooter = "";
      break;
      
    case "undefined":
    case "":
    case "null":
      if (bFormatAsHTML)
        sFooter = '<code><a href="' + enhancedDocURL + '" target="_blank" title="Show documentation for JSX:enhanced.js.">JSX:enhanced.js<\/a>:<a href="' + enhancedDocURL + '#getObjInfo" target="_blank" title="Show documentation for JSX:enhanced.js:getObjInfo(...).">getObjInfo<\/a>(...)<\/code><br>';
      else
        sFooter = "JSX:enhanced.js:getObjInfo(...)\n";
      sFooter += "Library version " + enhancedVersion;
      sFooter += (bFormatAsHTML ? "<br />" : "\n");
      sFooter += enhancedCopyright + (bFormatAsHTML ? "&nbsp;&nbsp;" : "  ") + enhancedAuthor + " ";
      if (bFormatAsHTML) {
        sFooter = replaceText(sFooter, "©", "&copy;");
        sFooter += '&lt;<a href="mailto:Thomas%20\'PointedEars\'%20Lahn%20<' + enhancedEmail + '>" title="E-mail the author of this fabulous script ;-) E-mail client required.">' + enhancedEmail + '<\/a>&gt;'
      } else
        sFooter += "<" + enhancedEmail + ">"
  }
  if (sFooter != "") {
    sAttr += (bFormatAsHTML ? (bFormatAsTable ? '<tr>\n<td colspan="' + (bShowType ? 3 : 2) + '">' : '') : "\n__________________________________________________\n")
          + sFooter
          + (bFormatAsHTML ? (bFormatAsTable ? '<\/td>\n<\/tr>\n' : '<br>') : "");
  }
  if (bFormatAsTable) sAttr += '<\/table>';
  return sAttr;
}

var sInspectorVersion = "0.71";

function ObjectInspector(sObject, aWhat, sStyle, sHeader, sFooter, iRecursionLevel) {
  var wInspector = window.open("enhanced.htm", "wndObjectInspector", "scrollbars=yes,resizable=yes");
  if (wInspector) {
    wInspector.document.open("text/html");
    var s = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"\n'
      + ' "http://www.w3.org/TR/html4/strict.dtd">\n'
      + '<html>\n'
      + '  <head>\n'
      + '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">\n'
      + '    <meta name="author" value="' + enhancedCopyright + '  ' + enhancedAuthor + ' (' + enhancedEmail + ')">\n'
      + '    <title>JavaScript ObjectInspector ' + sInspectorVersion + '<\/title>\n'
      + '    <script type="text/javascript">\n'
      + '      <!--\n'
      + '      ' + getObjInfo + '\n'
      + '      ' + arguments.callee + '\n'
      + '      //-->\n'
      + '    <\/script>\n'
      + '  <\/head>\n'
      + '  <body>\n'
      + '    <script type="text/javascript">\n'
      + '      <!--\n'
      + '      document.write(getObjInfo(' + sObject + ', "' + aWhat + '", "' + sStyle + '"));\n'
      + '      //-->\n'
      + '    <\/script>\n'
      + '  <\/body>\n'
      + '<\/html>';
    wInspector.document.write(s);
    wInspector.document.close();
  } else
    enhancedException("Error: Unable to create ObjectInspector window.\n\n"
      + "Disable popup blocking, or try alert(getObjInfo(...)) or"
      + " document.write(getObjInfo(...)) instead.");
//  return false;
}

function ObjectInspector2(sObject) {
  var sMsgClose_en = "Close Window"
  var sMsgClose_de = "Fenster schlie&szlig;en"
  var sInspector = "ObjectInspector " + sInspectorVersion;
  var sMsgClose = sMsgClose_en;
  var wImage = false;
  var iWidth = 640, iHeight = 480;

// preset also window position and size in the case the temporary script below fails
  var sOptions = "toolbar=no,location=no,menubar=no,scrollbars=no,resizable=yes"
    + ",left=0,top=0,width=" + (iWidth) + ",height=" + (iHeight);
  var wInspector = window.open( "", null, sOptions );
  if (wInspector != null) {
    var dImage = wInspector.document.open("text/html");
    with(wInspector.document) {
      write(
'<html>',

'<head>',

'<meta name="generator" value="JSX:enhanced.js:ObjectInspector(...) © 2001-2002  Thomas Lahn (webmaster@PointedEars.de)">',

'<title>JavaScript ObjectInspector 0.7<\/title>',

'<script language="JavaScript" type="text/javascript"><!--\n',

'window.moveTo(screen.width/2 - 640/2, screen.height/2 - 480/2);\n',

'function radioChkdVal(aForm, sRadioBtnGrpName) {',
  'for (var i = 0; i < aForm.elements.length; i++) {',
    'if ((aForm.elements[i].name == sRadioBtnGrpName) && aForm.elements[i].checked) return (aForm.elements[i].value);',
  '}',
  'return "";',
'}\n',

'var CH_NBSP = unescape("%A0");\n',

'function removeOptionsns(aSelect) {',
  'if(aSelect && (aSelect.tagName) && (aSelect.tagName.toLowerCase() == "select"))',
    'while(aSelect.options.length > 0) {',
      'if (document.all)',
        'aSelect.options.remove(aSelect.options.length - 1);',
      'else {',
        'aSelect.options[aSelect.options.length - 1] = null;',
        'if (! document.all) history.go(0);',
      '}',

    '}',
'}\n',

'function addOption(aSelect, sText, iPosition) {',
  'if(aSelect && (aSelect.tagName) && (aSelect.tagName.toLowerCase() == "select")) {',
    'var newElement = new Option(sText);',
    'if (document.all) {',
      'if(arguments.length > 2)',
        'aSelect.options.add(newElement, iPosition);',
      'else\n',
        'aSelect.options.add(newElement);',
    '} else {',
      'aSelect.options[aSelect.options.length] = newElement;',
      'aSelect.options[aSelect.options.length - 1].value = "";',
    '}',
  '}',
'}\n',

'function inspect(sObject, aWhat) {',
  'if (sObject.toLowerCase().indexOf("document.all") > -1) {',
    'alert ("Retrieval of the attributes of document.all canceled. This would have resulted in recursive listing and would have caused your browser to hang.");',
    'up();',
    'return false;',
  '}\n',
  'var aObject = eval(sObject);',
  'if(! aObject) {',
    'alert (sObject + " is not an object.");',
    'up();',
    'return false;',
  '}\n',
  'var bCondition = false;',
  'removeOptions(document.forms[0].attr);',
  'for(var Attribute in aObject) {',
    'switch (Attribute) {',
      'case "dataFormatAs":\n',
      'case "clientInformation":\n',
      'case "external":\n',
      'case "navigator": break;\n',
      'default:\n',
      'var bCondition = false;',
      'var bMethod = ( String(aObject[Attribute]).toLowerCase().indexOf("function") > -1 );',
      'var bProperty = ! bMethod;',
      'var bObject = ( String(aObject[Attribute]).toLowerCase().indexOf("object") > -1 );',
      'if(arguments.length > 1) {',
        'if(aWhat.toLowerCase() == "p")',
          'bCondition = bProperty;',
        'else if(aWhat.toLowerCase() == "m")',
          'bCondition = bMethod;',
        'else if(aWhat.toLowerCase() == "o")',
          'bCondition = bObject;',
        'else\n',
          'bCondition = true;',
      '} else\n',
        'bCondition = true;',
      'if (bCondition) {',

        'var sAttr = "[";',
        'if (bObject)',
          'sAttr += "O";',
        'else if (bProperty)',
          'sAttr += "P";',
        'else if (bMethod)',
          'sAttr += "M";',
        'else\n',
          'sAttr += "?";',
        'sAttr += "]" + CH_NBSP + Attribute;',
        'addOption(document.forms[0].attr, sItem);',

      '}',
    '}',
  '}',
'}\n',

'function up() {',
  's = document.forms[0].identifier.value;',
  'if (s.indexOf(".") > -1) {',
    'document.forms[0].identifier.value = s.substr(0, s.lastIndexOf("."));',
    'EditEnter();',
  '} else\n',
    'alert("You are on the uppermost level of aggregation.");',
'}\n',

'function down(sAttrib) {',
  'if (sAttrib.charAt(1) != "M") {',
    'document.forms[0].identifier.value += "." + sAttrib.substr(sAttrib.lastIndexOf(CH_NBSP)+1);',
    'EditEnter();',
  '}',
'}\n',

'function EditEnter() {',
  'document.forms[0].val.value = "";',
  'inspect(document.forms[0].identifier.value, radioChkdVal(document.forms[0], "attrib"));',
  'return( false );',
'}\n',

'function showVal(sAttrib) {',
  'if (sAttrib.charAt(1) != "M") {',
    'var attrValue = eval(document.forms[0].identifier.value + "." + sAttrib.substr(sAttrib.lastIndexOf(CH_NBSP)+1));',
    'var s = ( ( isNaN(attrValue) || (String(attrValue) == "") )',
        '&& ( String(attrValue).indexOf("object") < 0 ) ) ? "\\"" : "";',

    'document.forms[0].val.value = s + attrValue + s;',
  '} else\n',
    'document.forms[0].val.value = "";',
'}',

'//-->\n<\/script>',

'<style type="text/css"><!--\n',

'.bold { font-weight: bold; }',
'.fixed { font-family: Lucida Console, Courier New, Courier; }',
'hr { position: relative; left:-10px; width:100%; }',

'//-->\n<\/style>',

'<\/head>',
'<body bgcolor="#d8dcd8" text="#000000">',
'<div style="position:absolute; top:0px; left:0px;">',
'<div style="background-color:#ffffff; width:101%; text-indent:10px; border-width: 1px; border-style: inset;"><h1>JavaScript ObjectInspector 0.7<\/h1>',
'<p style="position:relative; top:-10px;">Copyright &copy; 2001  Thomas Lahn (<a href="mailto:webmaster@PointedEars.de">webmaster@PointedEars.de<\/a>)<\/p><\/div>',
'<div style="position:relative; left:10px;">',
'<form onSubmit="return EditEnter();">',
'<p><span class="bold">Object: <\/span><input type="text" size=40 value="', ((arguments.length > 0) ? sObject : 'window'),
'" name="identifier"> <input type="submit" value="Apply" id="btApply"> <input type="button" value="Up" onClick=\'up();\'><br>',
'<span class="bold">Attributes to retrieve: <\/span><nobr><input name="attrib" value="" type="radio" checked lang="en-us" dir="ltr" onClick=\'EditEnter();\'>All<\/nobr> <nobr><input name="attrib" value="p" type="radio" lang="en-us" dir="ltr" onClick=\'EditEnter();\'>All&nbsp;[P]roperties<\/nobr> <nobr><input name="attrib" value="o" type="radio" lang="en-us" dir="ltr" onClick=\'EditEnter();\'>Composed&nbsp;[O]bjects<\/nobr> <nobr><input name="attrib" value="m" type="radio" lang="en-us" dir="ltr" onClick=\'EditEnter();\'>[M]ethods<\/nobr><\/p>',
'<hr size=1 noshade>',
'<table border=0 cellspacing=5 cellpadding=0 width="100%">',
'<tr valign="top">',
  '<td width="50%" class="bold">Attribute:<\/td>',
  '<td class="bold">Value:<\/td><\/tr>',
'<tr valign="top">',
  '<td><select size=13 name="attr" class="fixed" style="width:100%;" onChange=\'showVal(this.options[this.options.selectedIndex].text);\' onDblClick=\'if (this.options.selectedIndex > -1) down(this.options[this.options.selectedIndex].text);\'><\/select><\/td>',
  '<td><textarea rows=13 cols=40 name="val" class="fixed"><\/textarea><\/td><\/tr>',
'<\/table>',
'<hr size=2>',
'<input type="button" value="Exit" onClick="window.close();">',
'<\/form>',
'<script language="JavaScript" type="text/javascript"><!--\n',
  'EditEnter();',
'//--><\/script><\/div>',
'<\/div>',
'<\/body>',
'<\/html>');
      close();
    }
    if(wInspector.opener) wInspector.opener.blur();
    wInspector.focus();
  }
  return(false);
}

function ObjectInspector3(sRoot) {
  var s =
    '<script src="../enhanced.js" type="text/javascript"><\/script>\n' +
    '<script src="../dhtml.js" type="text/javascript"><\/script>\n' +
    '<script src="../search.js" type="text/javascript"><\/script>\n' +
    '<script type="text/javascript" language="JavaScript">\n  <!--\n' +
    '  var s = new TSearchStr(location.search);\n' +
    '  var sRoot = "' + (sRoot ? sRoot : 'window') + '";\n' +
    '  if (s.hasValue("object"))\n' +
    '    sRoot = s.getValue("object");\n\n' +

    '  function ExpandCollapse(s, o2) {\n' +
    '    var o = getElem("id", s);\n' +
    '    if (o && o.style && (typeof o.style.display != "undefined")) {\n' +
    '      if (o.style.display == "none") {\n' +
    '        o.style.display = "";\n' +
    '        o2.innerHTML = "[-]";\n' +
    '      } else {\n' +
    '        o.style.display = "none";\n' +
    '        o2.innerHTML = "[+]";\n' +
    '      }\n' +
    '    }\n' +
    '    return false;\n' +
    '  }\n\n' +

    '  function writeProps(s) {\n' +
    '    var o = eval(s);\n' +
    '    var s2 = s;\n' +
    '    var iLastDot = s2.lastIndexOf("[");\n' +
    '    if (iLastDot < 0) iLastDot = s2.lastIndexOf(".");\n' +
    '    var sParent = s.substring(0, iLastDot);\n' +
    '    var sLoc = "";\n' +
    '    if (window.opera) {\n' +
    '      sLoc = String(location);\n' +
    '      var iQuery = sLoc.indexOf("?");\n' +
    '      if (iQuery < 0) iQuery = sLoc.length;\n' +
    '      sLoc = sLoc.substring(0, iQuery);\n' +
    '    }\n' +
    '    if (iLastDot >= 0)\n' +
    "      s2 = '<a href=\"' + sLoc + '?object=' + sParent + '\">' + sParent + '<\\/a>' + s.substr(iLastDot);\n" +
    '    document.write("<b>" + s2 + "<\\/b> = " + o + "\\n");\n' +
    '    var a = new Array();\n' +
    '    var bShowLoc = true;\n' +
    '    var bShowDoc = true;\n' +
    '    var bShowNavi = true;\n' +
    '    var bShowItems = true;\n' +
    '    for (var Attr in o) {\n' +
    '      a[a.length] = Attr;\n' +
    '      if (Attr == "location") bShowLoc = false;\n' +
    '      if (Attr == "document") bShowDoc = false;\n' +
    '      if (Attr == "navigator") bShowNavi = false;\n' +
    '      if (Attr == "0") bShowItems = false;\n' +
    '    }\n' +
    '    if ((s == "window") && bShowLoc) a[a.length] = "location";\n' +
    '    if ((s == "window") && bShowDoc) a[a.length] = "document";\n' +
    '    if ((s == "window") && bShowNavi) a[a.length] = "navigator";\n' +
    '    if (o.length && bShowItems) {\n' +
    '      for (var i = 0; i < o.length; i++)\n' +
    '        a[a.length] = i;\n' +
    '    }\n' +
    '    if (a.sort) // sort attributes lexically\n' +
    '      a.sort();\n' +
    '    for (var i = 0; i < a.length; i++) {\n' +
    '      var val = replaceText(replaceText(String(o[a[i]]), "<", "&lt;"), ">", "&gt;");\n' +
    '      var t = typeof o[a[i]];\n' +
    '      if (t == "boolean")\n' +
    "        val = '<a href=\"#\" title=\"Click to toggle value\" onclick=\"try {' + s + '.' + a[i] + '=' + !o[a[i]] + '; location.reload() } catch(e) { alert(\'Unable to toggle property value. Maybe there is no setter for this property.\') }; return false\">' + val + '<\\/a>';\n" +
    '      if (t == "string")\n' +
    "        val = '\"' + val + '\"';\n" +
    '      if ((String(o[a[i]]).indexOf("\\n") >= 0) || (String(o[a[i]]).length > 72))\n' +
    "        val = \"<a href='#'\"" +
    '          + " onclick=\"return ExpandCollapse(\'span" + i + "\', this)\"' +
    "          + ' style=\"text-decoration:none\">' + (!window.opera ? '[+]' : '')" +
    "          + '<\\/a> <span ' + (!window.opera ? 'style=\"display:none\" ' : '')" +
    "          + 'id=\"span' + i + '\">' + val + '<\\/span>';\n" +
    '      document.write("  <b>."' +
    "        + (((t == 'object') || ((t == 'function') && window.opera)) && o[a[i]] ? ('<a href=\"' + sLoc + '?object=' + s + '[\'' + a[i] + '\']\">') : '') + a[i] + (((t == 'object') || ((t == 'function') && window.opera)) ? '<\\/a>' : '') + '<\\/b> : '" +
    '        + t + " = " + val + "\\n");\n' +
    '    }\n' +
    '  }\n' +
    '  \/\/-->\n' +
    '<\/script>\n' +
    "<h1>PointedEars' ObjectInspector 0.8<\/h1>" +
    '<p style="font-size:small">Copyright &copy; 2003 Thomas Lahn &lt;<a href="mailto:obj-insp@PointedEars.de">obj-insp@PointedEars.de<\/a>&gt;<\/p>\n' +
    '<hr>\n' +
    '<script type="text/javascript" language="JavaScript">\n  <!--\n' +
    '  s = \'<form action="">\\n\'\n' +
    '    + \'  Object: <input name="object" value="\' + sRoot + \'" size="\' + ((sRoot.length > 20) ? sRoot.length : 20) + \'">\\n\'\n' +
    '    + \'  <input type="submit" value="Inspect">\\n\'\n' +
    '    + \'<\/form>\\n\'\n' +
    '  document.write(s);\n' +
    '  document.write(\'<pre>\');\n' +
    '  writeProps(sRoot);\n' +
    '  document.write(\'<\/pre>\');\n' +
    '  \/\/-->\n' +
    '<\/script>';
  return s;
}

if(! document)
  ENoBrowser(); // Raise exception if not processed from a web browser

