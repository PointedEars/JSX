/*
 * <title>Window Function Library</title>
 * @file window.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (C) 2001-2004  Thomas Lahn &lt;window.js@PointedEars.de&gt;
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public Licnse
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
 * Refer window.htm file for general documentation. 
 *
 * This document contains JavaScriptDoc. Refer
 * http://pointedears.de/scripts/JSDoc/
 * for details.
 */

var windowVersion   = "1.29.2005030511"; // 1.29.2004.11b6+
var windowCopyright = "Copyright \xA9 1999-2004";
var windowAuthor    = "Thomas Lahn";
var windowEmail     = "window.js@PointedEars.de";
var windowPath      = "http://pointedears.de/scripts/";
// var windowDocURL = windowPath + "window.htm";

// Script exceptions

function windowException(Msg)
{
  alert(
    "window.js "
      + windowVersion
      + "\n"
      + windowCopyright
      + "  "
      + windowAuthor
      + " <"
      + windowEmail
      + ">\n\n"
      + Msg);

  return false;
}

function EInvalidArgNum(sFunctionName, iArg)
{
  /*  if (arguments.length < 2) iArg = "?";*/
  return windowException(
    sFunctionName
      + ": The user script did not pass the required number of arguments ("
      + iArg
      + ").\nRefer documentation in script file for correct function call.");
}

// Script features

function setStatus(sCaption)
{
  window.status = sCaption;
  return true;
}

function resetStatus()
{
  window.status = window.defaultStatus;
  return true;
}

var sLinkOutMsg_de =
    "Dieser Link ist offline nicht verf?gbar.\n\n"
  + "Wenn Sie mit dem Internet verbunden sind, steht Ihnen die Seite online"
  + " zur Verf?gung.\n\n"
  + "M?chten Sie jetzt eine Verbindung zu dieser Seite herstellen?";
    
var sLinkOutMsg_us =
  "This link is not available offline.\n\n"
  + "If you are connected to the Internet, the website is available online.\n\n"
  + "Do you wish to connect to this website now?';";

var sLinkOutMsg = sLinkOutMsg_de;

function linkOut(
  /** @argument string                 */ sURL,
  /** @argument string                 */ sLink,
  /** @argument optional boolean       */ bShowURL,
  /** @argument optional string|number */ aTarget,
  /** @argument optional number        */ iWidth,
  /** @argument optional number        */ iHeight,
  /** @argument optional string        */ sOptions)
{
  if (arguments.length < 1)
  {
    EInvalidArgNum("linkOut", 1);
    return false;
  }

  var arg = sLinkOutMsg;
  /*
   * version 1.05.2000.3 update, formerly bShowURL as 2nd argument;
   * fixed problem with websites created earlier
   */
  if (arguments.length < 3)
  {
    bShowURL = true;
  }

  var oldArg;

  if ((sURL != "" && bShowURL == true)
      || (arguments.length >= 2 && sLink != ""))
  {
    oldArg = arg;
    arg = "\n\n";
    arg += oldArg;
  }

  if (sURL != "" && bShowURL)
  {
    oldArg = arg;
    arg = sURL;
    arg += oldArg;
  }

  if (arguments.length >= 2 && sLink != "")
  {
    if (sURL != "" && bShowURL)
    {
      oldArg = arg;
      arg = sLink;
      arg += "\n";
      arg += oldArg;
    }
    else
    {
      oldArg = arg;
      arg = sLink;
      arg += oldArg;
    }
  }

  if (confirm(arg))
  {
    var oTarget = document;
    if (arguments.length >= 4
        && aTarget != ""
        && aTarget.toLowerCase() != "_self")
    { // version 1.05.2000.3 update, formerly no nullstrings nor "_self" supported
      if (isNaN(aTarget))
      {
        if (aTarget.toLowerCase() == "_new"
            || aTarget.toLowerCase() == "_blank")
        {
          popUp(sURL, iWidth, iHeight, sOptions);
          return false;
        }
        else
        {
          oTarget = parent.frames[aTarget].document;
        }
        // and below: v1.09.2000.3 bugfix
      }
      else
      {
        oTarget = parent.frames[aTarget].document;
      }
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
    sFeatures += "," + sOptions;
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
    {
      return targetFrame;
    }
  }
  else
  {
    if (parent.frames[targetFrame])
    {
      parent.frames[targetFrame].location.href = sURL;
      return sURL;
    }
    else
    {
      return targetFrame;
    }
  }
}

var sEnlargeImgTitle_en = "Click to close window";
var sEnlargeImgTitle_de = "Klicken, um Fenster zu schlie&szlig;en";
var sEnlargeImgTitle    = sEnlargeImgTitle_en;

/**
 * Opens a dependent browser child window containing an (enlarged)
 * image. A primary button mouse click on the image or the window
 * closes the window.
 * 
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (c) 2000-2003  Thomas Lahn &lt;PointedEars@gmx.de&gt;
 *   Protected under the terms of the GNU General Public License.
 *   See http://www.fsf.org/copyleft/gpl.html for details.
 * @argument string sImageURL
 *   Required. URL of the (enlarged) image.
 * @optional string sCaption
 *   Optional. Caption of the browser child window.
 *   If not provided, sImageURL will be used as caption.
 * @optional number iWidth
 *   Optional. Width of the browser child window in pixels.
 *   If not provided or 0, the window will be resized to fit
 *   image width.
 * @param iHeight
 *   Optional. Height of the browser child window in pixels.
 *   If not provided or 0, the window will be resized to fit
 *   image height.
 * @optional boolean bCenter
 *   Optional. If <code>true</code>, the window will be centered
 *   on the screen. Note: Use with caution! Not all desktops
 *   return the correct position for the centered window.
 * @return type boolean
 *   Always <code>false</code> which allows for
 *   <a href="..." ... onclick="return enlargeImg(...);">
 */
function enlargeImg(sImageURL, sCaption, iWidth, iHeight, bCenter)
{
  var ident = enlargeImg;
  var argnum = ident.arguments.length;
  var wImage = false;

  if (sImageURL.charAt(0) != "/")
  {
    /*
     * Version 1.17.2002.2 bugfix:
     * Calculates absolute image file paths of relative ones
     * Fixes bug with Mozilla 0.9.7 and above (includes Netscape 6.1+)
     * that generated pages have no path except about:blank which causes
     * relative paths for their resources to fail
     */
    var iPathEnd = location.pathname.lastIndexOf('\\');
    // Windows local path
    if (iPathEnd < 0)
    {
      iPathEnd = location.pathname.lastIndexOf('/');
    }

    // URL
    if (iPathEnd > -1) // Extends filename to full path
    {
      sImageURL = location.pathname.substring(0, iPathEnd) + "/" + sImageURL;
    }
  }

  if (argnum < 1)
  {
    return (EInvalidArgNum("Level 2: enlargeImg", 1));
  }

  // preset also window position and size in the case the temporary script below fails
  var sOptions =
    "toolbar=no,location=no,menubar=no,scrollbars=yes,resizable=yes"
      + (((argnum > 2) && !isNaN(iWidth)) ? (",width=" + iWidth + 12) : "")
      + (((argnum > 3) && !isNaN(iHeight)) ? (",height=" + iHeight + 32) : "")
      + ",left="
      + String(
        parseInt(
          screen.width / 2
            - (argnum > 2 && !isNaN(iWidth)
                 ? iWidth / 2
                 : 0)))
      + ",top="
      + String(
        parseInt(
          screen.height / 2
            - (argnum > 3 && !isNaN(iHeight)
               ? iHeight / 2
               : 0)));

  wImage = window.open(null, "wndZoom", sOptions);
  if (wImage)
  {
    /*var dImage = */
    wImage.document.open("text/html");

    var s =
        '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"\n'
      + '  "http://www.w3.org/TR/html4/loose.dtd"\n'
      + '<html>\n'
      + '  <head>\n'
      + '    <meta http-equiv="Content-Type" content="text/html;'
      + ' charset=ISO-8859-15">\n'
      + '    <meta name="generator" value="JSX:enhancd2.js{'
      + windowVersion
      + '}:enlargeImg(...) '
      + windowCopyright
      + '  '
      + windowAuthor
      + ' &lt;'
      + windowEmail
      + '&gt;">\n'
      + '    <title>';

    if (argnum > 1 && sCaption != "")
    {
      s += sCaption;
    }
    else
    {
      s += sImageURL;
    }
    /*
     * temporary script and updated inline code to fix
     * BUG_Enlarge:ALWAYS_FIT-TO-IMAGE
     */

    s +=
        '<\/title>\n'
      + '    <script type="text/javascript">\n'
      + '      <!--\n'
      + '      function fitWindowToImage()\n'
      + '      {\n'
      + '        var imgWidth = '
      + (argnum > 2 && iWidth != 0
        ? iWidth
        : "document.images[0].width + 12")
      + ';\n'
      + '        var imgHeight = '
      + (argnum > 3 && iHeight != 0
        ? iHeight
        : "document.images[0].height + 32")
      + ';\n'
      + '        if (typeof window.resizeTo == "object")\n' // IE only
      + '        {\n'
      + '          origLeft = window.screenLeft;\n'
      + '          origTop = window.screenTop;\n'
      + '          origWidth = window.width;\n'
      + '          origHeight = window.height;\n'
      + '          window.resizeTo(imgWidth, imgHeight);\n'
      + '        }\n'
      + '        else if (typeof window.sizeToContent == "function")\n' // Moz
      + '        {\n'
      + '          origLeft = window.screenX;\n'
      + '          origTop = window.screenY;\n'
      + '          origWidth = window.innerWidth;\n'
      + '          origHeight = window.innerHeight;\n'
      + '          window.sizeToContent();\n'
      + '        }\n'
      + '        else if (typeof document.layers == "object")\n' // NN4
      + '        {\n'
      + '          origLeft = window.screenX;\n'
      + '          origTop = window.screenY;\n'
      + '          origWidth = window.innerWidth;\n'
      + '          origHeight = window.innerHeight;\n'
      + '          window.innerWidth = document.width;\n'
      + '          window.innerHeight = document.height;\n'
      + '        }\n';

    if (argnum < 5 || argnum > 4 && bCenter && window.moveTo)
    {
      s +=
          '        window.moveTo(\n'
        + '          screen.width/2 - imgWidth/2,\n'
        + '          screen.height/2 - imgHeight/2);\n';
    }
        
    s +=
        '      }\n\n'
      + '      function restoreWindowSize()\n'
      + '      {\n'
      + '        if (typeof window.origLeft != "undefined"\n'
      + '            && typeof window.origTop != "undefined"\n'
      + '            && typeof window.resizeTo != "undefined")\n'
      + '          window.resizeTo(origLeft, origTop);\n'
      + '        if (document.all && window.resizeTo)\n'
      + '        {\n'
      + '          try\n'
      + '          {\n'
      + '            window.screenLeft = origLeft;\n'
      + '            window.screenTop = origTop;\n'
      + '          }\n'
      + '          catch (e)\n'
      + '          {}\n'
      + '        }\n'
      + '        else if (typeof window.sizeToContent == "function"\n'
      + '                 || typeof document.layers == "object")\n'
      + '        {\n'
      + '          window.screenX = origLeft;\n'
      + '          window.screenY = origTop;\n'
      + '          window.innerWidth = origWidth;\n'
      + '          window.innerHeight = origHeight;\n'
      + '        }\n'
      + '      }\n'
      + '      \/\/-->\n'
      + '    <\/script>\n'
      + '  <\/head>\n\n'
      + '  <body leftmargin="0" topmargin="0" marginwidth="	0" marginheight="0"'
      + ' style="margin: 0px">\n'
      + '    <a href="javascript:restoreWindowSize();window.close();"\n'
      + '       title="' + sEnlargeImgTitle + '"\n'
      + '       onClick="restoreWindowSize(); window.close(); return false;">'
      + '<img\n'
      + '         src="' + sImageURL + '" border="0"\n'
      + '         onload="fitWindowToImage(this);"><\/a>\n'
      + '  <\/body>\n'
      + '<\/html>';

    /*
     * Workaround of version 1.16.2002.2 for Opera:
     * With *this* browser, document.open(...) does not return
     * created object :(
     */
    /*dImage*/
    wImage.document.write(s);
    wImage.document.close();
    wImage.focus();
  }

  return false;
}

/*
 * Enlarge(...) call redirects to enlargeImg(...) for
 * compatibility with previous versions
 */
var Enlarge = enlargeImg;

function showFrameNames(w)
{
  for (var i = w.frames.length; i--;)
  {
    var f = w.frames[i];
    if (f.frames.length > 0)
    {
      showFrameNames(f);
    }
    else
    {
      if (isMethodType("document.createElement")
          && isMethodType("document.appendChild")
          && isMethodType("document.createTextNode"))
      {
        var div = document.createElement("div");
        if (div
            && typeof div.style != "undefined"
            && typeof div.style.backgroundColor != "undefined"
            && typeof div.style.color != "undefined"
            && typeof div.style.position != "undefined"
            && typeof div.style.left != "undefined"
            && typeof div.style.top != "undefined")
        {
          div.style.backgroundColor = "yellow";
          div.style.color = "black";
          div.style.position = "fixed";
          if (div.style.position != "fixed")
          {
            div.style.position = "absolute";
          }
          div.style.left = 0;
          div.style.top = 0;

          var txt = document.createTextNode(w.name);
          if (txt)
          {
            div.appendChild(txt);
          }
          
          // w.document.body.appendChild(div);
          alert(w.name);
        }
      }
    }
  }
}

// showFrameNames(_window.top);
