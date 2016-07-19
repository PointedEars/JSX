/*
 * The following tag used for display in advanced file listings only:
 * <title>JavaScript Routines and Objects to Create Temporary Documents</title>
 *
 * See document.txt file for general documentation.
 */

var documentVersion = "v1.20.2005080609";
var sAuthorCopyright = "\xA9 2000-2005 by Thomas Lahn (PES)";
var sAuthorEMail = "webmaster@PointedEars.de";

/* Script exceptions */

var sCopyright =
    "document.js "
  + documentVersion
  + " "
  + sAuthorCopyright
  + "\nmailto:"
  + sAuthorEMail
  + "\n\n";

function HTMLException(Msg)
{
  alert( sCopyright + Msg );
  return false;
}

function ENoDocument(sFunctionName)
{
  // var sFunctionName = (sFunctionName != null) ? sFunctionName + ": " : "";

  /*
   * Passing the name of the function which caused the exception currently not
   * possible
   */
  return HTMLException(
    "The specified target object does not exist."
    + " Please check your assignment(s) to the HTMLdoc variable.");
}

function EInvalidArgNum(sFunctionName, iArg)
{
  return HTMLException(
    sFunctionName
    + ": The user script did not pass the required number of arguments ("
    + iArg
    + "). Refer documentation in script file for correct function call.");
}

/* Script features */
if (typeof jsx == "undefined") var jsx = {};

if (typeof jsx.document == "undefined")
{
  jsx.document = {
    write: function(s) {
      return jsx.tryThis(
        function() {
          document.write(s);

          /* fix circular reference */
          s = null;

          return true;
        },
        function() {
          /* try without namespaces first (presumably HTML or loose XHTML) */
          var scripts = document.getElementsByTagName("script");

          if (!scripts || !scripts.length)
          {
            /* try with namespace (presumably strict XHTML) */
            scripts = document.getElementsByTagNameNS(
              document.documentElement.getAttribute("xmlns"),
              "script");
          }

          /* Can we locate ourselves at all? */
          if (scripts && scripts.length)
          {
            var thisScript = scripts[scripts.length - 1];
            var node = thisScript.parentNode.insertBefore(
              document.createTextNode(s),
              thisScript);
          }

          /* fix circular reference */
          s = null;

          return node;
        }) || false;
    }
  };
}

var HTMLdoc = document;

/* Version 1.05.x OOP Extension */
var HTMLinstance = new _HTMLDocument(HTMLdoc);

function docCheck(bRaiseException)
{
  if (HTMLdoc)
  {
    return true;
  }

  if (arguments.length == 1 && bRaiseException == true)
  {
    ENoDocument(docCheck.caller);
  }

  return false;
}

/* Document Type Definitions and HTML 4.0 Tag Policy URLs */

/* DTD for HTML 2.0 documents */
var dtdHTML2        = '"-//W3C//DTD HTML 2.0//EN"';

/* DTD for HTML 3.2 documents */
var dtdHTML32       = '"-//W3C//DTD HTML 3.2//EN"';

/* DTD for HTML 4.01 documents */
var dtdHTML4        = '"-//W3C//DTD HTML 4.01//EN"';

/* DTD for HTML 4.01 documents including frameset definition */
var dtdHTML4frm     = '"-//W3C//DTD HTML 4.01 Frameset//EN"';

/* DTD for HTML 4.01 documents containing deprecated elements and attributes */
var dtdHTML4scr     = '"-//W3C//DTD HTML 4.01 Transitional//EN"';

/* URL of DTD for HTML 4.01 documents containing deprecated elements and attribs */
var dtdURL_HTML4dep = '\n "http://www.w3.org/TR/html4/loose.dtd"';

/* URL of DTD for HTML 4.01 documents that define framesets */
var dtdURL_HTML4frm = '\n "http://www.w3.org/TR/html4/frameset.dtd"';

/* URL of DTD for documents that use strict HTML 4.01 syntax */
var dtdURL_HTML4str = '\n "http://www.w3.org/TR/html4/strict.dtd"';

function HTMLdocOpen(sDTD, bReplace)
{
  if (!docCheck(true)) return;

  /*
   * version 1.08.2000.3 bugfix, formerly: ...length = 2(!)
   * and separated sections
   */

  // if( HTMLdoc.location.href != "" ) HTMLdoc.close();
  if (arguments.length == 2 && bReplace == true)
  {
    HTMLdoc.open("text/html", "replace");
  }
  else
  {
    HTMLdoc.open("text/html");
  }

  if (arguments.length < 1)
  {
    sDTD = "";
  }
  HTMLdoc.writeln("<!DOCTYPE html PUBLIC ", sDTD, ">\n<html>\n");
}

function HTMLdocClose()
{
  if (!docCheck(true))
  {
    return;
  }

  HTMLdoc.writeln("</html>");
  HTMLdoc.close();
}

function docWrite(s)
{
  if (!docCheck(true))
  {
    return;
  }

  HTMLdoc.write(s);
}

function docWriteLn(s)
{
  if (!docCheck(true))
  {
    return;
  }

  HTMLdoc.writeln(s);
}

var HTMLtagCount = 0;

function HTMLwriteTag(sTag, sAttrib, sContent)
{
  var sWrite = "";

  if (!docCheck(true))
  {
    return;
  }

  if (arguments.length < 1 || sTag == "")
  {
    EInvalidArgNum("HTMLwriteTag", 1);
    return;
  }

  /* for better document compression rates */

  sTag = sTag.toLowerCase();

  if (arguments.length < 2)
  {
    /* use default value if argument missing */
    sAttrib = "";
  }

  if (arguments.length < 3)
  {
    /* use default value if argument missing */
    sContent = "";
  }

  sWrite = "<" + sTag;

  if (sAttrib != "" )
  {
    sWrite += " " + sAttrib;
  }

  sWrite += ">";

  if (sContent != "")
  {
    sWrite +=
      sContent + "</" + sTag + ">";
    for (var i = 4; i < arguments.length; i++)
    {
      sWrite += arguments[i];
    }
  }

  HTMLdoc.write(sWrite);
  HTMLtagCount++;

  /* OOP extension */
  HTMLinstance.tagCount = HTMLtagCount;

  /*
   * TODO Bug: Text is written twice into the document when the function
   * result is used as argument. Workaround required to uncomment
   * return statement.
   */
  // return sWrite;
}

var HTMLmetaCount = 0;

function HTMLwriteMeta(sName, sHTTPequiv, sContent)
{
  if (arguments.length != 3)
  {
    EInvalidArgNum("HTMLwriteMeta", 3);
    return;
  }

  if (! docCheck(true))
  {
    return;
  }

  if (sName.toLowerCase() != "generator")
  {
    HTMLdoc.write("<meta ");

    if (sName != "")
    {
      HTMLdoc.write('name="', sName, '" ');
    }

    if (sHTTPequiv != "")
    {
      HTMLdoc.write('http-equiv="', sHTTPequiv, '" ');
      HTMLdoc.writeln('content="', sContent, '">');
      HTMLmetaCount++;

      /* OOP extension */
      HTMLinstance.metaCount = HTMLmetaCount;
    }
  }
}

function HTMLwriteLinkFavIcon(sURL)
{
  if (sURL.length > 0)
  {
    HTMLdoc.HTMLwriteTag("link", 'rel="shortcut icon" href="' + sURL + '"');
  }
}

var HTMLscriptCount = 0;

function HTMLwriteScript(sLang, sSrc, sType, sContent)
{
  if (sSrc == "" && (arguments.length < 4 || sContent == ""))
  {
    EInvalidArgNum("HTMLwriteScript", 4);
    return;
  }

  if (!docCheck(true))
  {
    return;
  }

  if (arguments.length == 0 || sLang == "")
  {
    sLang = "JavaScript";
  }

  HTMLdoc.write('<script language="', sLang, '"');

  if (arguments.length < 2)
  {
    sSrc = "";
  }

  if (sSrc != "")
  {
    HTMLdoc.write(' src="', sSrc, '"');
  }

  if (arguments.length < 3 || sType == "")
  {
    sType = "text/javascript";
  }

  if (sType != "")
  {
    HTMLdoc.write( ' type="', sType, '"' );
  }

  HTMLdoc.write('>');

  if (arguments.length < 4)
  {
    sContent = "";
  }

  if (sSrc == "" && sContent != "")
  {
    HTMLdoc.write('<!--\n', sContent, '\n//-->');
  }

  HTMLdoc.write('</script>\n');
  HTMLscriptCount++;

  /* OOP extension */
  HTMLinstance.scriptCount = HTMLscriptCount;
}

var HTMLstyleCount = 0;

function HTMLwriteStyle(sType, sAttrib, sContent)
{
  if (sContent == "" || arguments.length < 3)
  {
    EInvalidArgNum("HTMLwriteStyle", 3);
    return;
  }

  if (!docCheck(true))
  {
    return;
  }

  if (sType == "")
  {
    sType = "text/css";
  }

  HTMLdoc.write('<style type="', sType, '"');

  if (sAttrib != "")
  {
    HTMLdoc.write( ' ', sAttrib );
  }

  HTMLdoc.write('><!--\n', sContent, '\n//--></style>\n');
  HTMLstyleCount++;
  /* OOP extension */
  HTMLinstance.styleCount = HTMLstyleCount;
}

function HTMLheadOpen(sTitle)
{
  if (!docCheck(true)) return;

  HTMLdoc.writeln(
    "<head>\n\n<title>",
    sTitle,
    '</title>\n\n<meta name="generator" content="document.js ',
    documentVersion,
    " ",
    sAuthorCopyright,
    ' (' + sAuthorEMail + ')">');
}

function HTMLheadClose()
{
  if (!docCheck(true))
  {
    return;
  }
  HTMLdoc.writeln('\n</head>\n');
}

/** background color */
var clBodyBg     = "";

/** default text color */
var clBodyText   = "";

/** default color for an unvisited link */
var clBodyLink   = "";

/** default color for a visited link */
var clBodyVLink  = "";

/** default color for a selected link */
var clBodyALink  = "";

/** URL of the background image */
var imgBody      = "";

/** Defines whether the background image is a watermark */
var bBodyBgFixed = false;

function HTMLbodyOpen()
{
  if (!docCheck(true))
  {
    return;
  }
  HTMLdoc.write( "<body" );

  if (clBodyBg != "")
  {
    HTMLdoc.write(' bgcolor="', clBodyBg, '"');
  }

  if (clBodyText != "")
  {
    HTMLdoc.write(' text="', clBodyText, '"');
  }

  if (clBodyLink != "")
  {
    HTMLdoc.write(' link="', clBodyLink, '"');
  }

  if (clBodyVLink != "")
  {
    HTMLdoc.write(' vlink="', clBodyVLink, '"');
  }

  if (clBodyALink != "")
  {
    HTMLdoc.write(' alink="', clBodyALink, '"');
  }

  if (imgBody != "")
  {
    HTMLdoc.write(' background="', imgBody, '"');
  }

  if (bBodyBgFixed)
  {
    HTMLdoc.write(' bgproperties="fixed"');
  }
  HTMLdoc.writeln ( ">\n" );
}

function HTMLbodyClose()
{
  if (!docCheck(true))
  {
    return;
  }

  HTMLdoc.writeln('\n</body>\n');
}

/* OOP Support for Multiple Document Access (MDA): Methods and prototype */

function DocumentListAdd(aItem)
{
  this.items.push(aItem);
}

function DocumentListRemove()
{
  this.items.pop();
}

function DocumentList()
{
  /* Properties */
  this.items = new Array();

  /* Methods */
  this.add = DocumentListAdd;
  this.remove = DocumentListRemove;
}

var docList = new DocumentList();

/* General OOP support: Methods, global counter variable and class */

function HTMLDocumentActivate()
{
  HTMLinstance = this;
  HTMLdoc = this.target;
  clBodyBg = this.clBodyBg;
  clBodyText = this.clBodyText;
  clBodyLink = this.clBodyLink;
  clBodyVLink = this.clBodyVLink;
  clBodyALink = this.clBodyALink;
  imgBody = this.imgBody;
  bBodyBgFixed = this.bBodyBgFixed;
  HTMLtagCount = this.tagCount;
  HTMLmetaCount = this.metaCount;
  HTMLscriptCount = this.scriptCount;
  HTMLstyleCount = this.styleCount;
}

function HTMLDocumentShowProperties()
{
  var sCaller =
    (HTMLDocumentShowProperties.caller != null
     ? "Caller: \n\n" + HTMLDocumentShowProperties.caller + "\n"
     : "");

  var sResult =
      sCopyright
    + "Current properties of the HTMLDocument instance named \""
    + this.name
    + "\";\nUsed HTMLDocument.showProperties() method:\n\n";

  for (var Property in this)
  {
    var isNotMethod =
      (String(this[Property]).toLowerCase().substr(0, 9) != "function ");

    var isNotNameProp =
      (String(Property).toLowerCase().substr(0, 4) != "name");

    if (isNotMethod && isNotNameProp)
    {
      var isString =
        (isNaN(this[Property]) || String(this[Property]) == "");

      var bDblQuote =
        (isString
          ? '"'
          : "");

      var sProp = String(this[Property]);

      if (sProp == "[object]") bDblQuote = "";

      sResult +=
          Property
        + " = "
        + bDblQuote
        + sProp
        + bDblQuote
        + "\n";
    }
  }

  sResult += "\nCreator URL: \"" + document.URL + "\"\n\n" + sCaller;
  alert(sResult);
}

/** Number of _HTMLDocument instances created by the script caller document */
var HTMLDocumentCount = 0;

/* `HTMLDocument' is a W3C DOM 2 HTML interface literally implemented in Geckos */
function _HTMLDocument(aTarget, sDTD, bReplace, sName)
{
  // Properties
  if (arguments.length < 1)
  {
    this.target = HTMLdoc;
  }
  else
  {
    if (aTarget)
    {
      HTMLinstance = this;
      this.target = aTarget;
      HTMLdoc = this.target;
      HTMLtagCount = 0;
      HTMLmetaCount = 0;
      HTMLscriptCount = 0;

      /* Open doc. automatically on more arg. */
      if (arguments.length > 1)
      {
        HTMLdocOpen(sDTD, bReplace);
      }
    }
    else
    {
      /* Error if passed object is not available */
      ENoDocument("_HTMLDocument");
      return;
    }
  }

  /* "" is v1.08.2000.3 bugfix, formerly used colors of last activated object */

  /** background color */
  this.clBodyBg = "";

  /** text color */
  this.clBodyText = "";

  /** color for an unvisited link */
  this.clBodyLink = "";

  /** color for a visited link */
  this.clBodyVLink = "";

  /** color for a selected link */
  this.clBodyALink = "";

  /** URL of the background image */
  this.imgBody = "";

  /** Default: background image is no watermark */
  this.bBodyBgFixed = false;

  /** HTML tags written by writeTag(...) method */
  this.tagCount = 0;

  /** &lt;meta&gt; tags written except "generator" */
  this.metaCount = 0;

  /** &lt;script&gt;&lt;/script&gt; sections written */
  this.scriptCount = 0;

  /** &lt;style&gt;&lt;/style&gt; sections written */
  this.styleCount = 0;

  /* Increase the number of created _HTMLDocument instances for auto-naming */
  HTMLDocumentCount++;

  if (arguments.length >= 4)
  {
    /* Recommended to name the object for debug purposes */
    this.name = sName;
  }
  else
  {
    this.name = "_HTMLDocument_" + String(HTMLDocumentCount);
  }

  /* Methods */
  this.activate = HTMLDocumentActivate;

  /* DEBUG */
  this.showProperties = HTMLDocumentShowProperties;
  this.checkTarget = docCheck;
  this.open = HTMLdocOpen;
  this.close = HTMLdocClose;
  this.write = docWrite;
  this.writeLn = docWriteLn;
  this.writeTag = HTMLwriteTag;
  this.writeMeta = HTMLwriteMeta;
  this.writeScript = HTMLwriteScript;
  this.writeStyle = HTMLwriteStyle;
  this.headOpen = HTMLheadOpen;
  this.headClose = HTMLheadClose;
  this.bodyOpen = HTMLbodyOpen;
  this.bodyClose = HTMLbodyClose;
}

/* Raise exception if not processed from a web browser */
if (! document)
{
  ENoBrowser();
}
