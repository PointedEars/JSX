// The following tag is for display in advanced filelists only:
// <TITLE>Support for Outline-styled Structure Using Dynamic HTML Statements</title>
//
// Refer outline.txt for general documentation.

// Variable definitions

var sOutline = "outline";   // Class name for outline node
var sOutlined = "outlined"; // Class name for outline content
var imgCollapsed = "";      // Image file to load when node is collapsed
var imgExpanded = "";       // Image file to load when node is expanded
var sCollapsed = "+";       // Text to display when node is collapsed
var sExpanded = "-";        // Text to display when node is expanded

/* SCRIPT EXCEPTIONS */

function EOutline(Msg) {
  var msgBody = "outline.js (c) 1999-2006  Thomas Lahn (webmaster@PointedEars.de)\n\n";
  msgBody += Msg;
	msgBody += "\n\nClick \"OK\" to send a feedback e-mail to the author of the script or click \"Cancel\" to abort.\nAnyway, you should inform the author of the HTML document of the error you have encountered.";
	if (confirm(msgBody))
  {
    self.location.href = "mailto:webmaster@PointedEars.de?subject=Feedback/JavaScript/outline.js";
  }
	return false;
}

function ENoBrowser() {
  return EOutline( "This script is designed to be processed from a web browser only." );
}

function ENoJScript() {
  return EOutline( "Your browser does not support Microsoft JScript. This is designed for Microsoft Internet Explorer only." );
}

function ENoTarget(Object) {
  var msg = "The script could not determine the required target object (";
	msg += Object;
	msg += "+).\nThe possible causes are:\n\n";
	msg += "a) A style-sheet is included in the HTML document that redefines the OUTLINE class for DIV tags. The additional style-sheet needs to be removed, the class needs to be renamed, or the CLASS=\"OUTLINE\" attribute is to be used for no other objects than outline nodes for the script to work properly.\n\n";
  msg += "b) The HTML document did not provide the object.\nIt needs to be defined using the ID attribute of the respective HTML tag.\n\n";
  msg += "c) Maybe your browser is unable to return the complete object list due to low system resources.\nThere are currently ";
  msg += String(document.all.length);
  msg += " accessible objects within the HTML document. The number of outline objects possibly needs to be reduced for the script to work properly.\nFor the moment you may be able to expand/collapse all nodes of the outline structure using the respective items/buttons if the author had included them in the HTML document.";
 	return EOutline(msg);
}

function ENoAttr(Object) {
  var msg = "The clicked object (ID=\"";
	msg += Object;
	msg += "\") does neither support the SRC, ALT nor the innerHTML attribute.\nUse the <IMG SRC=\"...\" [ALT=\"...\"] CLASS=\"outline\"> tag or any tag with an appropriate closing tag (<...></...>) for the node symbol instead.";
	return EOutline( msg );
}

function EInvalidArgument(Arg) {
  var msg = "FullTree: The user script did not pass the required number of arguments or passed an invalid argument (";
  msg += Arg;
	msg += "). Refer documentation in script file for correct function call.";
	return EOutline( msg );
}

/* SCRIPT FEATURES */

function CalcPaths() { // Calculates relative image file paths to absolute ones
var PathEnd = document.URL.lastIndexOf('\\'); // Folder path
  if( PathEnd == -1 )
  {
    PathEnd = document.URL.lastIndexOf('/'); // URL
  }
  
  if( PathEnd == -1 ) { // Extends filename to full path
    var prevImgCollapsed = imgCollapsed;
		imgCollapsed = document.URL.slice(0, PathEnd);
		imgCollapsed += "/";
		imgCollapsed += prevImgCollapsed;
    var prevImgExpanded = imgExpanded;
		imgExpanded = document.URL.slice(0, PathEnd);
		imgExpanded += "/";
		imgExpanded += prevImgExpanded;
  }
}

function clickHandler() {
var srcElement, targetId, targetElement;
	if (document) { // If processed from web browser
    var srcElement = window.event.srcElement;
	  if (srcElement && (srcElement.className.toLowerCase() == sOutline)) {
      // If classified as outline node
		  targetId = srcElement.id;
		  targetId += "+";
		  targetElement = getElem("id", targetId);
  		if (targetElement) { // If the node content exists
  			if (targetElement.style.display == "none") { // If currently collapsed
  				targetElement.style.display = "";
  				if (srcElement.src) {
  					if (imgExpanded != "") srcElement.src = imgExpanded;
  					if (srcElement.alt) {
  						if (sExpanded != "") srcElement.alt = sExpanded;
  					}
  				} else if (srcElement.alt) {
  					if (sExpanded != "") srcElement.alt = sExpanded;
  				} else if (srcElement.innerHTML) {
              if (sExpanded != "") srcElement.innerHTML = sExpanded;
  				} else
  					return ENoAttr( srcElement.id );
  			} else { // If currently expanded
  				targetElement.style.display = "none";
  				if (srcElement.src) {
  					if (imgCollapsed != "") srcElement.src = imgCollapsed;
  					if (srcElement.alt) {
                if (sCollapsed != "") srcElement.alt = sCollapsed;
  					} 
  				} else if (srcElement.alt) {
  					if (sCollapsed != "") srcElement.alt = sCollapsed;
  				} else if (srcElement.innerHTML) {
  					if (sCollapsed != "") srcElement.innerHTML = sCollapsed;
  				} else
  					return ENoAttr();
  			}
  		} else
  			return ENoTarget (srcElement.id);
    }
	} else
		return ENoBrowser();
}

function FullTree(action) {
var obj;
	if (document) { // If processed from web browser
		if (document.all) { // If Microsoft JScript is supported
			for (var i = document.all.length; i--;) {
				obj = document.all[i];
				if (obj.className.toLowerCase() == sOutline || obj.className.toLowerCase() == sOutlined) {
					if ((obj.tagName.toLowerCase() == "div") && (obj.className.toLowerCase() != sOutline)) {
						if (action == "+")
							obj.style.display = "";
						else if (action == "-")
							obj.style.display = "none";
						else
							return EInvalidArgument();
						if (obj.src) {
							if (action == "+") {
								if (imgExpanded != "") obj.src = imgExpanded;
							} else if (action == "-") {
								if (imgCollapsed != "") obj.src = imgCollapsed;
							} else
								return EInvalidArgument();
						}
						if (obj.alt) {
							if (action == "+") {
								if (sExpanded != "") obj.alt = sExpanded;
							} else if (action == "-") {
								if (sCollapsed != "") obj.alt = sCollapsed;
							} else
						    		return EInvalidArgument();
						}
					} else if ((obj.innerHTML && obj.tagName.toLowerCase() == "span") && (obj.className.toLowerCase() == sOutline)) { 
						// Only on SPAN
						if (action == "+") {
							if (sExpanded != "") obj.innerHTML = sExpanded;
						} else if (action == "-") {
							if (sCollapsed != "") obj.innerHTML = sCollapsed;
						} else
							return EInvalidArgument();
					}
				}
			}
		} else
		return ENoJScript();
	} else
	return ENoBrowser();
}

function FullExpand() {
	return FullTree("+");
}

function FullCollapse() {
	return FullTree("-");
}

function FullTreeItems() {
  document.write( '<p><a href="JavaScript:FullExpand()" target="_self">Alle Ebenen einblenden</a><br>',
  	'<a href="FullCollapse()" target="_self">Alle Ebenen ausblenden</a></p>' );
}

function FullTreeButtons() {
  document.write( '<p><input type="button" width=100% value="Alle Ebenen einblenden" class="help" style="width:100%;" onClick="FullExpand();"><br>',
  	'<input type="button" width=100% value="Alle Ebenen ausblenden" class="help" style="width:100%" onClick="FullCollapse()"></p>' );
}

if (document) // If processed from a web browser: Defines the function above to be processed on every click on the document
{
  document.onclick = clickHandler;
}
else
{
  ENoBrowser();
}