/*
 * <title>Window Function Library</title>
 * @file window.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (C) 2001-2008  Thomas Lahn &lt;window.js@PointedEars.de&gt;
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

var windowVersion   = "1.29.2008012001";
var windowCopyright = "Copyright \xA9 1999-2008";
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
    "Dieser Link ist offline nicht verfügbar.\n\n"
  + "Wenn Sie mit dem Internet verbunden sind, steht Ihnen die Seite online"
  + " zur Verfügung.\n\n"
  + "Möchten Sie jetzt eine Verbindung zu dieser Seite herstellen?";
    
var sLinkOutMsg_us =
  "This link is not available offline.\n\n"
  + "If you are connected to the Internet, the website is available online.\n\n"
  + "Do you wish to connect to this website now?';";

var sLinkOutMsg = sLinkOutMsg_de;

function linkOut(sURL, sLink, bShowURL, aTarget, iWidth, iHeight, sOptions)
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
    arg = "\n\n" + oldArg;
  }

  if (sURL != "" && bShowURL)
  {
    oldArg = arg;
    arg = sUR + oldArg;
  }

  if (arguments.length >= 2 && sLink != "")
  {
    if (sURL != "" && bShowURL)
    {
      oldArg = arg;
      arg = sLink + "\n" + oldArg;
    }
    else
    {
      oldArg = arg;
      arg = sLink + oldArg;
    }
  }

  if (window.confirm(arg))
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
  var sFeatures = "height=" + iHeight + ",width=" + iWidth;

  if (arguments.length > 3)
  {
    sFeatures += "," + sOptions;
  }

  var wndChild = window.open(sURL, null, sFeatures);
  return false;
}

/*
 * OpenChildWin(...) call redirected to popUp(...) for compatibility to
 * previous versions
 */
var OpenChildWin = popUp;

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
var sEnlargeImgTitle_de = "Klicken, um Fenster zu schliessen";
var sEnlargeImgTitle    = sEnlargeImgTitle_en;

function enlargeImg(sImageURL, sCaption, iWidth, iHeight, bCenter)
{
  var ident = enlargeImg;
  var argnum = ident.arguments.length;

  if (sImageURL.charAt(0) != "/")
  {
    /*
     * Version 1.17.2002.2 bugfix:
     * Calculates absolute image file paths of relative ones
     * Fixes bug with Mozilla 0.9.7 and above (includes Netscape 6.1+)
     * that generated pages have no path except about:blank which causes
     * relative paths for their resources to fail
     */
    var iPathEnd = window.location.pathname.lastIndexOf('\\');
    // Windows local path
    if (iPathEnd < 0)
    {
      iPathEnd = window.location.pathname.lastIndexOf('/');
    }

    // URL
    if (iPathEnd > -1) // Extends filename to full path
    {
      sImageURL = window.location.pathname.substring(0, iPathEnd)
                + "/" + sImageURL;
    }
  }

  if (argnum < 1)
  {
    return (EInvalidArgNum("Level 2: enlargeImg", 1));
  }

  // preset also window position and size in the case the temporary script below fails
  var sOptions = [
    "toolbar=no,location=no,menubar=no,scrollbars=yes,resizable=yes",
    ((argnum > 2) && !isNaN(iWidth)) ? (",width=" + iWidth + 12) : "",
    ((argnum > 3) && !isNaN(iHeight)) ? (",height=" + iHeight + 32) : "",
    ",left=",
    parseInt(screen.width / 2 - (argnum > 2
                                 && !isNaN(iWidth) ? iWidth / 2 : 0)),
    ",top=",
    parseInt(screen.height / 2 - (argnum > 3
                                  && !isNaN(iHeight) ? iHeight / 2 : 0))
  ].join("");

  var w = window.open("", "wndZoom", sOptions);
  if (w)
  {
    var d = w.document;
    if (d)
    {
      d.open("text/html");
  
      var s = [
        '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"',
        '  "http://www.w3.org/TR/html4/loose.dtd"',
        '<html>',
        '  <head>',
        '    <meta http-equiv="Content-Type" content="text/html;'
        + ' charset=UTF-8">',
        [
          '    <meta name="generator" value="JSX:window.js{',
           windowVersion, '}:enlargeImg(...) ', windowCopyright,
           '  ', windowAuthor, ' &lt;', windowEmail, '&gt;">'
        ].join(""),
        [
          '    <title>' + ((argnum > 1 && sCaption != "") ? sCaption : sImageURL),
          '<\/title>'
        ].join(""), 
  
        /*
         * temporary script and updated inline code to fix
         * BUG_Enlarge:ALWAYS_FIT-TO-IMAGE
         */
  
        '    <script type="text/javascript">',
        '      function fitWindowToImage()',
        '      {',
        '        var imgWidth = '
        + (argnum > 2 && iWidth != 0 ? iWidth : "document.images[0].width + 12")
        + ';',
        '        var imgHeight = '
        + (argnum > 3 && iHeight != 0 ? iHeight : "document.images[0].height + 32")
        + ';\n',
        '        if (typeof window.resizeTo == "object")', // IE only
        '        {',
        '          origLeft = window.screenLeft;',
        '          origTop = window.screenTop;',
        '          origWidth = window.width;',
        '          origHeight = window.height;',
        '          window.resizeTo(imgWidth, imgHeight);',
        '        }',
        '        else if (typeof window.sizeToContent == "function")', // Moz
        '        {',
        '          origLeft = window.screenX;',
        '          origTop = window.screenY;',
        '          origWidth = window.innerWidth;',
        '          origHeight = window.innerHeight;',
        '          window.sizeToContent();',
        '        }',
        '        else if (typeof document.layers == "object")', // NN4
        '        {',
        '          origLeft = window.screenX;',
        '          origTop = window.screenY;',
        '          origWidth = window.innerWidth;',
        '          origHeight = window.innerHeight;',
        '          window.innerWidth = document.width;',
        '          window.innerHeight = document.height;',
        '        }',
  
        (argnum < 5 || argnum > 4 && bCenter && window.moveTo)
          ? ('        window.moveTo(\n'
            + '          screen.width/2 - imgWidth/2,\n'
            + '          screen.height/2 - imgHeight/2);\n')
          : '',
          
        '      }\n',        
        '      function restoreWindowSize()',
        '      {',
        '        if (typeof window.origLeft != "undefined"',
        '            && typeof window.origTop != "undefined"',
        '            && typeof window.resizeTo != "undefined")',
        '          window.resizeTo(origLeft, origTop);\n',
        '        if (document.all && window.resizeTo)',
        '        {',
        '          try',
        '          {',
        '            window.screenLeft = origLeft;',
        '            window.screenTop = origTop;',
        '          }',
        '          catch (e)',
        '          {}',
        '        }',
        '        else if (typeof window.sizeToContent == "function"',
        '                 || typeof document.layers == "object")',
        '        {',
        '          window.screenX = origLeft;',
        '          window.screenY = origTop;',
        '          window.innerWidth = origWidth;',
        '          window.innerHeight = origHeight;',
        '        }',
        '      }',
        '    <\/script>',
        '  <\/head>\n',
        '  <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"'
        + ' style="margin: 0 !important">',
        '    <a href="javascript:restoreWindowSize();window.close();"',
        '       title="' + sEnlargeImgTitle + '"',
        '       onClick="restoreWindowSize(); window.close(); return false;">'
        + '<img',
        '         src="' + sImageURL + '" border="0"',
        '         onload="fitWindowToImage(this);"><\/a>',
        '  <\/body>',
        '<\/html>'
      ].join("\n");
  
      d.write(s);
      d.close();
      d = null;
      w.focus();
    }
    else
    {
      w.close();
    }
    
    w = null;
  }

  return false;
}

/*
 * Enlarge(...) call redirects to enlargeImg(...) for
 * compatibility with previous versions
 */
var Enlarge = enlargeImg;