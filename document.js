// The following tag used for display in advanced file lists only:
// <TITLE>JavaScript Routines and Objects to Create Temporary Documents</title>
//
// Refer document.txt file for general documentation.

var documentVersion = "v1.18.2000.8";
var sAuthorCopyright = "© 2000-2001 by Thomas Lahn (PES)";
var sAuthorEMail = "webmaster@PointedEars.de";

/* Script exceptions */

sCopyright = "document.js " + documentVersion + " " + sAuthorCopyright + "\nmailto:" + sAuthorEMail + "\n\n";

function HTMLException(Msg) {
  alert( sCopyright + Msg );
  return false;
}

function ENoDocument(sFunctionName) {
// var sFunctionName = (sFunctionName != null) ? sFunctionName + ": " : "";
// Passing the name of the function which caused the exception currently not possible
  return HTMLException( "The specified target object does not exist. Please check your assignment(s) to the HTMLdoc variable. " );
}

function EInvalidArgNum(sFunctionName, iArg) {
  return HTMLException( sFunctionName + ": The user script did not pass the required number of arguments (" + iArg + "). Refer documentation in script file for correct function call." );
}

/* Script features */

var HTMLdoc = document;
var HTMLinstance = new CHTMLdoc(HTMLdoc); // Version 1.05.x OOP Extension

function docCheck(bRaiseException) {
  if( HTMLdoc )
	  return( true );
	else {
    if( (docCheck.arguments.length = 1) && (bRaiseException == true) )
		  ENoDocument( docCheck.caller );
	  return false;
	}
}

// Document Type Definitions and HTML 4.0 Tag Policy URLs

// DTD for HTML 2.0 documents
var dtdHTML2        = "\"-//W3C//DTD HTML 2.0//EN\"";

// DTD for HTML 3.2 documents
var dtdHTML32       = "\"-//W3C//DTD HTML 3.2//EN\"";

// DTD for HTML 4.0 documents
var dtdHTML4        = "\"-//W3C//DTD HTML 4.0//EN\"";

// DTD for HTML 4.0 documents including frameset definition
var dtdHTML4frm     = "\"-//W3C//DTD HTML 4.0 Frameset//EN\"";

// DTD for HTML 4.0 documents including style-sheets and/or script languages
var dtdHTML4scr     = "\"-//W3C//DTD HTML 4.0 Transitional//EN\"";

// URL for DTD of documents that use tags deprecated in HTML 4.0
var dtdURL_HTML4dep = "\n \"http://www.w3.org/TR/REC-html40/loose.dtd\"";

// URL for DTD of documents that define framesets
var dtdURL_HTML4frm = "\n \"http://www.w3.org/TR/REC-html40/frameset.dtd\"";

// URL for DTD of documents that use strict HTML 4.0 syntax
var dtdURL_HTML4str = "\n \"http://www.w3.org/TR/REC-html40/strict.dtd\"";

function HTMLdocOpen(sDTD, bReplace) {
  if( ! docCheck(true) ) return;
  // version 1.08.2000.3 bugfix, formerly: ...length = 2(!) and separated sections
	// if( HTMLdoc.location.href != "" ) HTMLdoc.close();
  if( (HTMLdocOpen.arguments.length == 2) && (bReplace == true) )
    HTMLdoc.open( "text/html", "replace" );
  else
	  HTMLdoc.open( "text/html" );
	if( HTMLdocOpen.arguments.length < 1 ) sDTD = "";
	HTMLdoc.writeln( "<!doctype html public ", sDTD, ">\n<html>\n" );
}

function HTMLdocClose() {
  if( ! docCheck(true) ) return;
  with( HTMLdoc ) {
		writeln( "</html>" );
	  close();
	}
}

function docWrite(s) {
  if( ! docCheck(true) ) return;
  HTMLdoc.write( s );
}

function docWriteLn(s) {
  if( ! docCheck(true) ) return;
  HTMLdoc.writeln( s );
}

var HTMLtagCount = 0;

function HTMLwriteTag(sTag, sAttrib, sContent) {
var sWrite = "";
  if( ! docCheck(true) ) return;
  if( (HTMLwriteTag.arguments.length < 1) || (sTag == "") ) {
	  EInvalidArgNum( "HTMLwriteTag", 1 );
		return;
	}
	sTag = sTag.toLowerCase(); // for better document compression rates
  if(HTMLwriteTag.arguments.length < 2)
	  sAttrib = ""; // use default value if argument missing
	if(HTMLwriteTag.arguments.length < 3)
	  sContent = ""; // use default value if argument missing
	sWrite = "<" + sTag;
	if( sAttrib != "" ) sWrite += " " + sAttrib;
	sWrite += ">";
	if( sContent != "" ) {
	  sWrite += sContent + "</" + sTag + ">";
		for( i = 4; i < HTMLwriteTag.arguments.length; i++ ) {
		  sWrite += HTMLwriteTag.arguments[i];
		}
	}
	HTMLdoc.write( sWrite );
        HTMLtagCount++;
	HTMLinstance.tagCount = HTMLtagCount; // OOP extension
	/* return sWrite;
       Bug: Text is written twice into the document when the function
			      result is used as argument. Workaround required to uncomment
						return statement.
	*/
}


var HTMLmetaCount = 0;

function HTMLwriteMeta(sName, sHTTPequiv, sContent) {
	if( HTMLwriteMeta.arguments.length != 3 ) {
		EInvalidArgNum( "HTMLwriteMeta", 3 );
		return;
	}
	if( ! docCheck(true) ) return;
	with( HTMLdoc ) {
		if( sName.toLowerCase() != "generator" ) {
			write( "<meta " );
			if( sName != "" )
				write( 'name="', sName, '" ' );
			if( sHTTPequiv != "" )
				write( 'http-equiv="', sHTTPequiv, '" ' );
			writeln( 'content="', sContent, '">' );
			HTMLmetaCount++;
			HTMLinstance.metaCount = HTMLmetaCount; // OOP extension
		}
	}
}


function HTMLwriteLinkFavIcon(sURL) {
	with( HTMLdoc)
		if( sURL.length > 0 )
			HTMLwriteTag( "link", "rel=\"shortcut icon\" href=\"" + sURL + "\"" );
}


var HTMLscriptCount = 0;

function HTMLwriteScript(sLang, sSrc, sType, sContent) {
  if( (sSrc == "") && ((HTMLwriteScript.arguments.length < 4) || (sContent == "")) ) {
	  EInvalidArgNum( "HTMLwriteScript", 4 );
		return;
	}
  if( ! docCheck(true) ) return;
	with( HTMLdoc ) {
		if( (HTMLwriteScript.arguments.length == 0) || (sLang == "") )
		  sLang = "JavaScript";
		write( '<script language="', sLang, '"' );
		if( HTMLwriteScript.arguments.length < 2 ) sSrc = "";
		if( sSrc != "" )
			write( ' src="', sSrc, '"' );
    if( (HTMLwriteScript.arguments.length < 3) || (sType == "") )
		  sType = "text/javascript";
		if( sType != "" )
			write( ' type="', sType, '"' );
    write( '>' );
		if( HTMLwriteScript.arguments.length < 4 ) sContent = "";
		if( (sSrc == "") && (sContent != "") )
			write( '<!--\n', sContent, '\n//-->' );
	  write( '</script>\n' );
	  HTMLscriptCount++;
		HTMLinstance.scriptCount = HTMLscriptCount // OOP extension
	}
}


var HTMLstyleCount = 0;

function HTMLwriteStyle(sType, sAttrib, sContent) {
  if( (sContent == "") || (HTMLwriteStyle.arguments.length < 3) ) {
	  EInvalidArgNum( "HTMLwriteStyle", 3 );
		return;
	}
  if( ! docCheck(true) ) return;
	with( HTMLdoc ) {
		if( (sType == "") )
		  sType = "text/css";
		write( '<style type="', sType, '"' );
		if( sAttrib != "" )
			write( ' ', sAttrib );
    write( '><!--\n', sContent, '\n//--></style>\n' );
	  HTMLstyleCount++;
		HTMLinstance.styleCount = HTMLstyleCount // OOP extension
	}
}


function HTMLheadOpen(sTitle) {
  if( ! docCheck(true) ) return;
  with( HTMLdoc ) {
	  writeln( "<head>\n\n<title>", sTitle, "</title>\n\n<meta name=\"generator\" content=\"document.js ", documentVersion, " ", sAuthorCopyright, " (" + sAuthorEMail + ")\">" );
	}
}


function HTMLheadClose() {
  if( ! docCheck(true) ) return;
  with( HTMLdoc ) {
	  writeln( '\n</head>\n' );
	}
}


var clBodyBg     = ""; // Defines the background color
var clBodyText   = ""; // Defines the default text color
var clBodyLink   = ""; // Defines the default color for an unvisited link
var clBodyVLink  = ""; // Defines the default color for a visited link
var clBodyALink  = ""; // Defines the default color for a selected link
var imgBody      = ""; // Defines the URL of the background image
var bBodyBgFixed = false; // Defines whether the background image is a watermark

function HTMLbodyOpen() {
  if( ! docCheck(true) ) return;
  with( HTMLdoc ) {
	  write( "<body" );
		if( clBodyBg != "" )
		  write( ' bgcolor="', clBodyBg, '"' );
		if( clBodyText != "" )
		  write( ' text="', clBodyText, '"' );
		if( clBodyLink != "" )
		  write( ' link="', clBodyLink, '"' );
		if( clBodyVLink != "" )
		  write( ' vlink="', clBodyVLink, '"' );
		if( clBodyALink != "" )
		  write( ' alink="', clBodyALink, '"' );
		if( imgBody != "" )
		  write( ' background="', imgBody, '"' );
		if( bBodyBgFixed == true )
		  write( ' bgproperties="fixed"' );
		writeln ( ">\n" );
	}
}


function HTMLbodyClose() {
  if( ! docCheck(true) ) return;
  with( HTMLdoc ) {
	  writeln( "\n</body>\n" );
	}
}

// OOP Support for Multiple Document Access (MDA): Methods and class

function CDocumentListAdd(aItem) {
  this.items.push(aItem);
}

function CDocumentListRemove() {
  this.items.pop();
}

function CDocumentList() {
  // Properties
  this.items = new Array();
	// Methods
	this.add = CDocumentListAdd;
	this.remove = CDocumentListRemove;
}

var docList = new CDocumentList();

// General OOP support: Methods, global counter variable and class

function CHTMLdocActivate() {
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

function CHTMLdocShowProperties() {
var sCaller = (CHTMLdocShowProperties.caller != null) ? ("Caller: \n\n" + CHTMLdocShowProperties.caller + "\n" ) : "";
var sResult = sCopyright + "Current properties of the CHTMLdoc instance named \"" + this.name + "\";\nUsed CHTMLdoc.showProperties() method:\n\n";
	for (var Property in this) {
		var isNotMethod = (String(this[Property]).toLowerCase().substr(0, 9) != "function ");
		var isNotNameProp = ( String(Property).toLowerCase().substr(0, 4) != "name" );
		if(isNotMethod && isNotNameProp) {
			var isString = ( isNaN(this[Property]) || ( String(this[Property]) == "" ) );
			var bDblQuote = (isString ? "\"" : "");
			var sProp = String(this[Property]);
			if(sProp == "[object]") bDblQuote = "";
			sResult += Property + " = " + bDblQuote + sProp + bDblQuote + "\n";
		}
	}
	sResult += "\nCreator URL: \"" + document.URL + "\"\n\n" + sCaller;
	alert(sResult);
}

var CHTMLdocCount = 0; // Number of CHTMLdoc instances created by the script caller document

function CHTMLdoc(aTarget, sDTD, bReplace, sName) {
	// Properties
  if( CHTMLdoc.arguments.length < 1 )
	  this.target = HTMLdoc;
	else {
		if( aTarget ) {
			HTMLinstance = this;
		  this.target = aTarget;
	    HTMLdoc = this.target;
      HTMLtagCount = 0;
      HTMLmetaCount = 0;
      HTMLscriptCount = 0;
			if( CHTMLdoc.arguments.length > 1 ) // Open doc. automatically on more arg.
			  HTMLdocOpen( sDTD, bReplace );
		} else // Return error (false) if passed object is not available
		  return ENoDocument("CHTMLdoc");
  }
  // "" is v1.08.2000.3 bugfix, formerly used colors of last activated object
  this.clBodyBg = "";        // Undefined background color;
  this.clBodyText = "";      // Undefined text color
  this.clBodyLink = "";      // Undefined color for an unvisited link
  this.clBodyVLink = "";     // Undefined color for a visited link
  this.clBodyALink = "";     // Undefined color for a selected link
  this.imgBody = "";         // Undefined URL of the background image
  this.bBodyBgFixed = false; // Default: background image is no watermark
  this.tagCount = 0;         // HTML tags written by writeTag(...) method
  this.metaCount = 0;        // <meta> tags written except "generator"
  this.scriptCount = 0;      // <script></script> sections written
  this.styleCount = 0;       // <style></style> sections written
        CHTMLdocCount++;     // Increase the number of created CHTMLdoc instances for auto-naming
	if( CHTMLdoc.arguments.length >= 4 )
	  this.name = sName;    // Recommended to name the object for debug purposes
	else
	  this.name = "CHTMLdoc" + String(CHTMLdocCount);
	// Methods
	this.activate = CHTMLdocActivate;
    // For debug purposes only: display current properties
	  this.showProperties = CHTMLdocShowProperties;
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

// Raise exception if not processed from a web browser

if(! document)
  ENoBrowser();
