/**
 * <title>Window Function Library</title>
 * @file window.js
 * @author
 *   (C) 1999‒2013  Thomas Lahn &lt;window.js@PointedEars.de&gt;
 *
 * @partof PointedEars' JavaScript Extensions (JSX)
 *
 * JSX is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JSX is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSX.  If not, see <http://www.gnu.org/licenses/>.
 */
/*
 * Refer window.htm file for general documentation.
 *
 * This document contains JavaScriptDoc. Refer
 * http://pointedears.de/scripts/JSDoc/
 * for details.
 */

if (typeof jsx == "undefined")
{
  var jsx = {};
}

if (typeof jsx.dom == "undefined")
{
  jsx.dom = {};
}

jsx.dom.window = {
  version:   "1.29.$Revision$",
  copyright: "Copyright \xA9 1999-2013",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://pointedears.de/scripts/",
  
  screenInfo: {
    getDim: function () {
      return {
        width: screen.width,
        height: screen.height
      };
    },

    getAvailDim: function () {
      return {
        width:  screen.availWidth,
        height: screen.availHeight
      };
    },

    getInnerDim: function () {
      return {
        width:  window.innerWidth,
        height: window.innerHeight
      };
    },
    
    getColorDepth: function () {
      return (screen.colorDepth || screen.pixelDepth);
    }
  }
};

var windowVersion   = jsx.dom.window.version;
var windowCopyright = jsx.dom.window.copyright;
var windowAuthor    = jsx.dom.window.author;
var windowEmail     = jsx.dom.window.email;
var windowPath      = jsx.dom.window.path;
// var windowDocURL = windowPath + "window.htm";

/* Script exceptions */

/**
 * @param Msg : string
 * @type boolean
 * @return false
 */
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

/**
 * @param sFunctionName : string
 * @param iArg : number
 * @return boolean
 */
function EInvalidArgNum(sFunctionName, iArg)
{
  // if (arguments.length < 2) iArg = "?";
  return windowException(
    sFunctionName
      + ": The user script did not pass the required number of arguments ("
      + iArg
      + ").\nRefer documentation in script file for correct function call.");
}

/* Script features */

/**
 * @param sCaption : string
 * @type boolean
 * @return true
 */
function setStatus (sCaption)
{
  window.status = String(sCaption);
  return true;
}

/**
 * @type boolean
 * @return true
 */
function resetStatus ()
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

/**
 * @param sURL : string
 * @param sLink : string
 * @param bShowURL : optional boolean
 * @param aTarget : optional string|number
 * @param iWidth : optional number
 * @param iHeight : optional number
 * @param sOptions : optional string
 */
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
    arg = sURL + oldArg;
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
    {
      /*
       * version 1.05.2000.3 update, formerly neither empty strings
       * nor "_self" supported
       */
      if (isNaN(aTarget))
      {
        if (aTarget.toLowerCase() == "_new"
            || aTarget.toLowerCase() == "_blank")
        {
          popUp(sURL, iWidth, iHeight, sOptions);
          return false;
        }
        oTarget = parent.frames[aTarget].document;
        /* and below: v1.09.2000.3 bugfix */
      }
      else
      {
        oTarget = parent.frames[aTarget].document;
      }
    }
    oTarget.location = "";
    oTarget.location.href = sURL;
  }

  /* version 1.15.2000.11 update */
  return false;
}

/**
 * @param sURL : string
 * @param iWidth : number
 * @param iHeight : number
 * @param sOptions : string
 * @type boolean
 * @return false
 */
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

/**
 * @param sURL : string
 * @param targetFrame : number|string
 * @return Window
 */
function LoadFrame(sURL, targetFrame)
{
  if (arguments.length < 2)
  {
    /* Raise exception if required arguments are missing */
    return EInvalidArgNum("LoadFrame", 2);
  }

  if (parent.frames[targetFrame])
  {
    parent.frames[targetFrame].location.href = sURL;
    return sURL;
  }

  return targetFrame;
}
var sEnlargeImgTitle_en = "Click to close window";
var sEnlargeImgTitle_de = "Klicken, um Fenster zu schliessen";
var sEnlargeImgTitle    = sEnlargeImgTitle_en;

/**
 * Opens a dependent browser child window containing an (enlarged)
 * image. A primary mouse button click on the image or the window
 * closes the window.
 * 
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @author
 *   (c) 2000-2005  Thomas Lahn &lt;PointedEars@gmx.de&gt;
 *   Protected under the terms of the GNU General Public License.
 *   See http://www.fsf.org/copyleft/gpl.html for details.
 * @param sImageURL : string
 *   Required. URL of the (enlarged) image.
 * @param sCaption : optional string
 *   Optional. Caption of the browser child window.
 *   If not provided, sImageURL will be used as caption.
 * @param iWidth : optional number
 *   Optional. Width of the browser child window in pixels.
 *   If not provided or 0, the window will be resized to fit
 *   image width.
 * @param iHeight : optional number
 *   Height of the browser child window in pixels.
 *   If not provided or 0, the window will be resized to fit
 *   image height.
 * @param bCenter : optional boolean
 *   Optional. If <code>true</code>, the window will be centered
 *   on the desktop. Note: Use with caution! Not all desktops
 *   return the correct/viable position for the centered window.
 * @return type boolean
 *   Always <code>false</code> which allows for
 *   <a href="..." ... onclick="return enlargeImg(...);">
 */
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
    /* Windows local path */
    var iPathEnd = window.location.pathname.lastIndexOf('\\');
    if (iPathEnd < 0)
    {
      iPathEnd = window.location.pathname.lastIndexOf('/');
    }

    /* URL */
    if (iPathEnd > -1)
    {
      /* Extend filename to full path */
      sImageURL = window.location.pathname.substring(0, iPathEnd)
                + "/" + sImageURL;
    }
  }

  if (argnum < 1)
  {
    return (EInvalidArgNum("Level 2: enlargeImg", 1));
  }

  /* preset also window position and size in the case the temporary script below fails */
  var sOptions =
      "toolbar=no,location=no,menubar=no,scrollbars=yes,resizable=yes"
    + ((argnum > 2) && !isNaN(iWidth)) ? (",width=" + iWidth + 12) : ""
    + ((argnum > 3) && !isNaN(iHeight)) ? (",height=" + iHeight + 32) : ""
    + ",left="
    + parseInt(screen.width / 2 - (argnum > 2
                                   && !isNaN(iWidth) ? iWidth / 2 : 0))
    + ",top="
    + parseInt(screen.height / 2 - (argnum > 3
                                    && !isNaN(iHeight) ? iHeight / 2 : 0));

  var w = window.open("", "wndZoom", sOptions);
  if (w)
  {
    var d = w.document;
    if (d)
    {
      d.open("text/html");
      var s = [
        '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"',
        '  "http://www.w3.org/TR/html4/loose.dtd">',
        '<html>',
        '  <head>',
        '    <meta http-equiv="Content-Type" content="text/html;'
        + ' charset=UTF-8">',

          '    <meta name="generator" value="JSX:window.js{',
        + windowVersion + '}:enlargeImg(...) ' + windowCopyright
        + '  ' + windowAuthor + ' &lt;' + windowEmail + '&gt;">',

          '    <title>' + ((argnum > 1 && sCaption != "") ? sCaption : sImageURL)
        + '<\/title>',

        /*
         * temporary script and updated inline code to fix
         * BUG_Enlarge:ALWAYS_FIT-TO-IMAGE
         */
        '    <script type="text/javascript">',
        '      var orig = {};\n',

        '      function fitWindowToImage()',
        '      {',
        '        var imgWidth = '
        + (argnum > 2 && iWidth != 0 ? iWidth : "document.images[0].width + 12")
        + ';',
        '        var imgHeight = '
        + (argnum > 3 && iHeight != 0 ? iHeight : "document.images[0].height + 32")
        + ';\n',

        /* MSHTML */
        '        if (typeof window.resizeTo == "object")',
        '        {',
        '          orig.left = window.screenLeft;',
        '          orig.top = window.screenTop;',
        '          orig.width = window.width;',
        '          orig.height = window.height;',
        '          window.resizeTo(imgWidth, imgHeight);',
        '        }',
        /* Gecko */
        '        else if (typeof window.sizeToContent == "function")',
        '        {',
        '          orig.left = window.screenX;',
        '          orig.top = window.screenY;',
        '          orig.width = window.innerWidth;',
        '          orig.height = window.innerHeight;',
        '          window.sizeToContent();',
        '        }',
        /* NN4 */
        '        else if (typeof document.layers == "object")',
        '        {',
        '          orig.left = window.screenX;',
        '          orig.top = window.screenY;',
        '          orig.width = window.innerWidth;',
        '          orig.height = window.innerHeight;',
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
        '        if (typeof orig.left != "undefined"',
        '            && typeof orig.top != "undefined"',
        '            && typeof window.resizeTo != "undefined")',
        '          window.resizeTo(orig.left, orig.top);\n',
        '        if (document.all && window.resizeTo)',
        '        {',
        '          try',
        '          {',
        '            window.screenLeft = orig.left;',
        '            window.screenTop = orig.top;',
        '          }',
        '          catch (e)',
        '          {}',
        '        }',
        '        else if (typeof window.sizeToContent == "function"',
        '                 || typeof document.layers == "object")',
        '        {',
        '          window.screenX = orig.left;',
        '          window.screenY = orig.top;',
        '          window.innerWidth = orig.width;',
        '          window.innerHeight = orig.height;',
        '        }',
        '      }',
        '    <\/script>',
        '  <\/head>\n',
        '  <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"'
        + ' style="margin: 0 !important">',
        '    <a href="javascript:restoreWindowSize();window.close();"',
        '       title="' + sEnlargeImgTitle + '"',
        '       onclick="restoreWindowSize(); window.close(); return false;">'
        + '<img',
        '         src="' + sImageURL + '" border="0"',
        '         onload="fitWindowToImage(this);"><\/a>',
        '  <\/body>',
        '<\/html>'
      ].join("\n");
      d.write(s);
      d.close();
      w.focus();
    }
    else
    {
      w.close();
      return true;
    }
  }

  return false;
}
/*
 * Enlarge(...) call redirects to enlargeImg(...) for
 * compatibility with previous versions
 */
var Enlarge = enlargeImg;

jsx.dom.window.fullscreen = (function () {
  var _isHostMethod = jsx.object.isHostMethod;
  
  return {
    getSupportedPropertyName: function (base, names, test) {
      for (var i = 0, len = names.length; i < len; ++i)
      {
        var name = names[i];
        if (test.call(null, base, name))
        {
          return name;
        }
      }

      return null;
    },

    getCancelMethodName: (function () {
      var _supportedCancel;

      return function () {
        if (typeof _supportedCancel == "undefined")
        {
          var properties = ["cancelFullScreen", "mozCancelFullScreen",
                            "webkitCancelFullScreen"];
        
          _supportedCancel = this.getSupportedPropertyName(document, properties, _isHostMethod);
        }

        return _supportedCancel;
      };
    }()),
    
    getElementPropertyName: (function () {
      var _supportedElement;

      return function () {
        if (typeof _supportedElement == "undefined")
        {
          var properties = ["fullscreenElement", "mozFullScreenElement",
                            "webkitFullscreenElement"];

          _supportedElement = this.getSupportedPropertyName(document, properties,
            function (base, name) {
              return typeof base[name] != "undefined";
            });
        }

        return _supportedElement;
      };
    }()),
    
    isSupportedBy: function (elem) {
      var methods = ["requestFullscreen", "mozRequestFullScreen",
                     "webkitRequestFullscreen"];
      return this.getSupportedPropertyName(elem, methods, _isHostMethod);
    },

    isFullscreen: function () {
      var supportedProperty = this.getElementPropertyName();
      return supportedProperty && document[supportedProperty] != null;
    },

    cancel: function (target, oldHandler, textTarget, text) {
      var supportedCancel = this.getCancelMethodName();
      if (supportedCancel)
      {
        document[supportedCancel]();
        
        var me = this;
        var listener = function () {
          var supportedElement = me.getElementPropertyName();
          if (supportedElement)
          {
            if (document[supportedElement] == null)
            {
              if (textTarget && text)
              {
                textTarget.textContent = text;
              }
              
              if (target)
              {
                target.onclick = oldHandler;
              }
            }
          }
        };
        
        var _addEventListener;
        if ((_addEventListener = jsx.object.getFeature(jsx, "dom", "addEventListener")))
        {
          var listenerWrapper = function () {
            if (listener) listener();
            listener = null;
            jsx.dom.removeEventListener(listenerWrapper);
            listenerWrapper = null;
          };
          
          _addEventListener(window, "resize", listenerWrapper);
        }
        else
        {
          listener();
          listener = null;
        }
      }
    },
    
    requestOn: function (elem, eventTarget, textTarget, windowText) {
      var requestMethodName;

      if (elem && (requestMethodName = this.isSupportedBy(elem)))
      {
        elem[requestMethodName]();
        
        var me = this;
        var listener = function () {
          if (textTarget && me.isFullscreen())
          {
            var oldText = textTarget.textContent;
            var oldHandler = eventTarget.onclick;
            eventTarget.onclick = function () {
              me.cancel(this, oldHandler, textTarget);
            };
            textTarget.textContent = windowText;
          }
        };
        
        var _addEventListener;
        if ((_addEventListener = jsx.object.getFeature(jsx, "dom", "addEventListener")))
        {
          var listenerWrapper = function () {
            if (listener) listener();
            listener = null;
            jsx.dom.removeEventListener(listenerWrapper);
            listenerWrapper = null;
          };
          
          _addEventListener(window, "resize", listenerWrapper);
        }
        else
        {
          listener();
          listener = null;
        }
      }
    }
  };
}());
