/*
  The following tag is for display in advanced filelists only:
  <TITLE>Level-2 Enhanced Website Features</title>

  enhancd2.js
  Part of PointedEars' JavaScript Extensions (JSX)
  Copyright (c) 2001-2002  Thomas Lahn <PointedEars@gmx.de>

  This code may be distributed freely under the terms of the
  GNU General Public License; either version 2 of the License
  or (at your option) any later version.
  See http://www.gnu.org/copyleft/gpl.html for details.

  Refer enhancd2.htm file for general documentation.
*/

var enhanced2Version   = "1.23.20080120";
var enhanced2Copyright = "Copyright © 2000-2008";
var enhanced2Author    = "Thomas Lahn";
var enhanced2Email     = "PointedEars@gmx.de";
var enhanced2DocURL    = "http://www.tu-ilmenau.de/~thla-in/scripts/enhancd2.htm";

function linkOutWin(sURL, sCaption, bShowURL) {
  return(linkOut( sURL, sCaption, bShowURL, "_new", 0, 0, "fullscreen=no,channelmode=no,toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes,top=0,left=0" ));
}

var sEnlargeImgTitle_en = "Click to close window";
var sEnlargeImgTitle_de = "Klicken, um Fenster zu schlie&szlig;en";
var sEnlargeImgTitle = sEnlargeImgTitle_en;

function enlargeImg(sImageURL, sCaption, iWidth, iHeight, bCenter) {
/* PointedEars' JavaScript Extensions (JSX)
   Copyright (c) 2000-2002  Thomas Lahn <PointedEars@gmx.de>
   Protected under the terms of the GNU General Public License.
   See http://www.fsf.org/copyleft/gpl.html for details.

   JSX:enhancd2.js:enlargeImg

   Opens a dependent browser child window containing an (enlarged) image.
   A primary button mouse click on the image or the window closes the
   window.

   Arguments:

   sImageURL   Required. URL of the (enlarged) image.
   sCaption    Optional. Caption of the browser child window.
               If not provided, sImageURL will be used as caption.
   iWidth      Optional. Width of the browser child window in pixels.
               If not provided or 0, the window will be resized
               to fit image width.
   iHeight     Optional. Height of the browser child window in pixels.
               If not provided or 0, the window will be resized
               to fit image height.
   bCenter     Optional. If true, the window will be centered on
               the screen.
               Note: Use with caution! Not all desktops return
               the correct position for the centered window.

   Return value:

   Always false which allows
   <a href="..." ... onclick="return enlargeImg(...);">
*/

  var argnum = arguments.length;
  var wImage = false;
  if (sImageURL.charAt(0) != "/") {
    // Version 1.17.2002.2 bugfix:
    // Calculates absolute image file paths of relative ones
    // Fixes bug with Mozilla 0.9.7 and above (includes Netscape 6.1+)
    // that generated pages have no path except about:blank which causes
    // relative paths for their resources to fail
    var iPathEnd = location.pathname.lastIndexOf('\\');
      // Windows local path
    if (iPathEnd < 0)
      iPathEnd = location.pathname.lastIndexOf('/');
        // URL
    if (iPathEnd > -1) // Extends filename to full path
      sImageURL = location.pathname.substring(0, iPathEnd) + "/" + sImageURL;
  }
  if (argnum < 1) return(EInvalidArgNum("Level 2: enlargeImg", 1));

// preset also window position and size in the case the temporary script below fails
  var sOptions = "toolbar=no,location=no,menubar=no,scrollbars=yes,resizable=yes"
               + (((argnum > 2) && !isNaN(iWidth)) ? (",width=" + iWidth + 12) : "")
               + (((argnum > 3) && !isNaN(iHeight)) ? (",height=" + iHeight + 32) : "")
               + ",left="
               + parseInt(screen.width/2
                          - (((argnum > 2) && !isNaN(iWidth))?(iWidth/2):0))
               + ",top="
               + parseInt(screen.height/2
                          - (((argnum > 3) && !isNaN(iHeight))?(iHeight/2):0));

  wImage = window.open(null, "wndZoom", sOptions);

  if (wImage)
  {
    var dImage = wImage.document;
    dImage.open("text/html");

    var a = new Array(
      '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">',
      '<html>',
      '  <head>',
      '    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-15">',
      '    <meta name="generator" value="JSX:enhancd2.js{'
      + enhanced2Version + '}:enlargeImg(...) ' + enhanced2Copyright
      + '  ' + enhanced2Author + ' &lt;' + enhanced2Email + '&gt;">',
      '    <title>' + ((argnum > 1 && sCaption != "") ? sCaption : sImageURL),

      // temporary script and updated inline code to fix BUG_Enlarge:ALWAYS_FIT-TO-IMAGE
      '    <\/title>',
      '    <script type="text/javascript">',
      '      // <![CDATA[',
      '      function fitWindowToImage() {',
      '        var imgWidth = ' + (((argnum > 2) && (iWidth != 0)) ? iWidth : ("document.images[0].width + 12")) + ';',
      '        var imgHeight = ' + (((argnum > 3) && (iHeight != 0)) ? iHeight : ("document.images[0].height + 32")) + ';',
      '        if (document.all) window.resizeTo(imgWidth, imgHeight);',
      '          else if (window.sizeToContent) window.sizeToContent();',
      '          else if (document.layers) { window.innerWidth = document.width; window.innerHeight = document.height; }',
      (argnum < 5 || (argnum > 4 && bCenter))
        ? '        window.moveTo(screen.width/2 - imgWidth/2, screen.height/2 - imgHeight/2);'
        : '',
      '      }',
      '      // ]]>',
      '    <\/script>',
      '  <\/head>',
      '  <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"'
      + ' style="margin: 0px">',
      '    <a href="#" title="'
      + sEnlargeImgTitle + '" onclick="window.close(); return false;">'
      + '<img src="' + sImageURL + '" border="0"'
      + ' onload="fitWindowToImage(this);"><\/a>',
      '  <\/body>',
      '<\/html>'
    );

    var s = a.join();
    dImage.write(s);
    dImage.close();
    wImage.focus();
  }
  return(false);
}

// Enlarge(...) call redirects to enlargeImg(...) for compatibility with previous versions

function Enlarge(sImageURL, sCaption, iWidth, iHeight) {
  switch(arguments.length) {
    case 0: { enlargeImg(); break; }
    case 1: { enlargeImg(sImageURL); break; }
    case 2: { enlargeImg(sImageURL, sCaption); break; }
    case 3: { enlargeImg(sImageURL, sCaption, iWidth); break; }
    case 4: { enlargeImg(sImageURL, sCaption, iWidth, iHeight); }
  }
}

var colMouseout  = "#000000";
var colMouseover = "#ffffff";

function hoverImg(imgID, state) {
  var img = "null";
  if (document.all)
    img = document.all(imgID);
  else if (document.getElementById)
    img = document.getElementById(imgID);
  if (typeof img == "object") {
    var col = "";
    switch (state) {
      case 0: col = colMouseout; break;
      default: col = colMouseover; break;
    }
    if (col != "") img.style.borderColor = col;
  }
  return true;
}

function TTZdescr(iGMToffsetMins, sDescr) {
  this.iGMToffsetMins = iGMToffsetMins;
  this.sDescr = sDescr;
}

function TDateNames_getTZdescr(iGMToffsetMins) {
  for (var i = 0; i < this.aTZdescr.length; i++) {
    if (this.aTZdescr.iGMToffsetMins == iGMToffsetMins)
      return (this.aTZdescr.sDescr);
  }
}

function TDateNames(
  aaShortWeekdayNames, aaMedWeekdayNames, aaLongWeekdayNames,
  aaShortMonthNames, aaMedMonthNames, aaLongMonthNames,
  aaTZdescr) {
/*
  JSX:enhancd2.js:TDateNames(...)

  Prototype for weekday and month names

  Properties:
    aShortWeekdayNames
    aMedWeekdayNames
    aLongWeekdayNames
    aShortMonthNames
    aMedMonthNames
    aLongMonthNames
    aTZdescr

  Methods:
    getTZdescr(...)

  Pass arrays containing the respective strings as arguments
  to set properties on creation of object.
*/
//  var iArgNum = TDateNames.arguments.length;
  this.aShortWeekdayNames = aaShortWeekdayNames || new Array(7);
  this.aMedWeekdayNames   = aaMedWeekdayNames   || new Array(7);
  this.aLongWeekdayNames  = aaLongWeekdayNames  || new Array(7);
  this.aShortMonthNames   = aaShortMonthNames   || new Array(12);
  this.aMedMonthNames     = aaMedMonthNames     || new Array(12);
  this.aLongMonthNames    = aaLongMonthNames    || new Array(12);
  this.aTZdescr           = aaTZdescr           || new Array();

  this.getTZdescr = TDateNames_getTZdescr;
}

var cDateLblOpen  = "_"; // A unique date label begins with this
var cDateLblClose = "_"; // A unique date label ends with this

function getDateFmt(dDate, sFormat, oDateNames) {
/*
  JSX:enhancd2.js:getDateFmt(...)

  Returns the dDate value as a formatted string as specified with
  sFormat. Use the following format labels enclosed in the
  characters defined above with the cDateLbl... global variables:

  CC     Century (19 if not supported by script engine).
  yyyy   Year with century. Please note that if the script engine's
         Date.getYear(...) returns only two characters for year,
         century is set to 19 (02 becomes 1902). yyyy is equal to
         CCyy.
  yy     Year without century
  MMMM   Long name of month
  MMM    Medium name of month
  MM     Short name of month
  0M     Two-digit month number (preceded by "0" if smaller than 10)
  M      Month number
  dddd   Long name of weekday
  ddd    Medium name of weekday
  dd     Short name of weekday
  0d     Two-digit day number (preceded by "0" if smaller than 10)
  d      Day number.
  hh     Two-digit hours (preceded by "0" if smaller than 10)
  h      Hours
  mm     Two-digit minutes (preceded by "0" if smaller than 10)
  m      Minutes
  ss     Two-digit seconds
  s      Seconds
  SS     Three-digit milliseconds (with leading zeroes)
  S      Milliseconds (if supported by script engine, otherwise "0").
  TTTTT  Timezone description. oDateNames.aTimeZones required.
  TTTT   Timezone offset to GMT in hh:mm (with leading zero).
  TTT    Timezone offset to GMT in h:mm.
  TT     Timezone offset to GMT as two-digit minutes (with leading zero)
  T      Timezone offset to GMT in minutes.
*/
  var iArgNum = arguments.length;
  if (iArgNum < 1)
    return false;
  if ((iArgNum < 2) || (sFormat.length == 0))
    return String(dDate);
  if (iArgNum > 2)
    var ooDateNames = oDateNames;
  else
    // Default (english) weekdays, month labels and timezone descriptions
    ooDateNames = new TDateNames(
      new Array("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"),
      new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"),
      new Array(
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday"
      ),
      new Array(
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
      ),
      new Array(
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
      ),
      new Array(
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ),
      new Array(
        new TTZdescr(-60, "WET"),
        new TTZdescr(  0, "GMT"),
        new TTZdescr( 60, "CET"),
        new TTZdescr(120, "CEST/EET")
      )
    );
  var sShortWeekday = ooDateNames.aShortWeekdayNames[dDate.getDay()];
  var sMedWeekday = ooDateNames.aMedWeekdayNames[dDate.getDay()];
  var sLongWeekday = ooDateNames.aLongWeekdayNames[dDate.getDay()];
  var sShortMonth = ooDateNames.aShortMonthNames[dDate.getMonth()];
  var sMedMonth = ooDateNames.aMedMonthNames[dDate.getMonth()];
  var sLongMonth = ooDateNames.aLongMonthNames[dDate.getMonth()];
  var iYear = dDate.getYear();
  if (iYear < 100)
    iYear += 1900;
  var sLongYear = String(iYear);
  var sShortYear = sLongYear.substr(sLongYear.length - 2, 2);
  var sMonth = String(dDate.getMonth() + 1);
  var sDay = String(dDate.getDate());
  var sHours = String(dDate.getHours());
  var sMins = String(dDate.getMinutes());
  var sSecs = String(dDate.getSeconds());
  var sSecs1000 = (dDate.getMilliseconds)
    ? String(dDate.getMilliseconds())
    : "0";
  var sTZmins = String(-dDate.getTimezoneOffset());
  var iTZhours = Math.floor(-dDate.getTimezoneOffset() / 60);
  var iTZmins = ((-dDate.getTimezoneOffset() / 60) + iTZhours) * 60;
  var sTZhoursMins = String(iTZhours) + ":" + ((iTZmins < 10) ? "0" : "") + String(iTZmins);
  var sTZhours2Mins = ((iTZhours < 10) ? "0" : "") + String(iTZhours) + ":" + ((iTZmins < 10) ? "0" : "") + String(iTZmins);
  var sTZdescr = ooDateNames.getTZdescr(-dDate.getTimezoneOffset());
  alert(ooDateNames);

  sFormat = replaceText(sFormat, cDateLblOpen + "yyyy" + cDateLblClose,
    sLongYear);
  sFormat = replaceText(sFormat, cDateLblOpen + "yy" + cDateLblClose,
    sShortYear);
  sFormat = replaceText(sFormat, cDateLblOpen + "MMMM" + cDateLblClose,
    sLongMonth);
  sFormat = replaceText(sFormat, cDateLblOpen + "MMM" + cDateLblClose,
    sMedMonth);
  sFormat = replaceText(sFormat, cDateLblOpen + "MM" + cDateLblClose,
    sShortMonth);
  sFormat = replaceText(sFormat, cDateLblOpen + "0M" + cDateLblClose,
    ((sMonth.length < 2) ? "0" + sMonth : sMonth));
  sFormat = replaceText(sFormat, cDateLblOpen + "M" + cDateLblClose,
    sMonth);
  sFormat = replaceText(sFormat, cDateLblOpen + "dddd" + cDateLblClose,
    sLongWeekday);
  sFormat = replaceText(sFormat, cDateLblOpen + "ddd" + cDateLblClose,
    sMedWeekday);
  sFormat = replaceText(sFormat, cDateLblOpen + "dd" + cDateLblClose,
    sShortWeekday);
  sFormat = replaceText(sFormat, cDateLblOpen + "0d" + cDateLblClose,
    ((sDay.length < 2) ? "0" + sDay : sDay));
  sFormat = replaceText(sFormat, cDateLblOpen + "d" + cDateLblClose,
    sDay);
  sFormat = replaceText(sFormat, cDateLblOpen + "hh" + cDateLblClose,
    ((sHours.length < 2) ? "0" + sHours : sHours));
  sFormat = replaceText(sFormat, cDateLblOpen + "h" + cDateLblClose,
    sHours);
  sFormat = replaceText(sFormat, cDateLblOpen + "mm" + cDateLblClose,
    ((sMins.length < 2) ? "0" + sMins : sMins));
  sFormat = replaceText(sFormat, cDateLblOpen + "m" + cDateLblClose,
    sMins);
  sFormat = replaceText(sFormat, cDateLblOpen + "ss" + cDateLblClose,
    ((sSecs.length < 2) ? "0" + sSecs : sSecs));
  sFormat = replaceText(sFormat, cDateLblOpen + "SSS" + cDateLblClose,
    ((sSecs1000.length < 3) ? "0" : "") +
    ((sSecs1000.length < 2) ? "0" : "") + sSecs1000);
  sFormat = replaceText(sFormat, cDateLblOpen + "SS" + cDateLblClose,
    ((sSecs1000.length < 3) ? "0" : "") +
    ((sSecs1000.length < 2) ? "0" : "") + sSecs1000);
  sFormat = replaceText(sFormat, cDateLblOpen + "S" + cDateLblClose,
    sSecs1000);
  sFormat = replaceText(sFormat, cDateLblOpen + "TTTTT" + cDateLblClose,
    sTZdescr);
  sFormat = replaceText(sFormat, cDateLblOpen + "TTTT" + cDateLblClose,
    sTZhours2Mins);
  sFormat = replaceText(sFormat, cDateLblOpen + "TTT" + cDateLblClose,
    sTZhoursMins);
  sFormat = replaceText(sFormat, cDateLblOpen + "TT" + cDateLblClose,
    (iTZmins < 10) ? "0" + iTZmins : String(iTZmins));
  sFormat = replaceText(sFormat, cDateLblOpen + "T" + cDateLblClose,
    String(iTZmins));

  return sFormat;
}

// German weekdays, month labels and timezone descriptions
var oDateNames_de = new TDateNames(
  new Array("So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"),
  new Array("Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"),
  new Array(
    "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag",
    "Freitag", "Samstag"
  ),
  new Array(
    "Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug",
    "Sep", "Okt", "Nov", "Dez"
  ),
  new Array(
    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug",
    "Sep", "Okt", "Nov", "Dez"
  ),
  new Array(
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ),
  new Array(
    new TTZdescr(-60, "WEZ"),
    new TTZdescr(  0, "GMT"),
    new TTZdescr( 60, "MEZ"),
    new TTZdescr(120, "MESZ/OET")
  )
);


function playSound( sSoundFile, Loop, sAttrib ) {
  if(arguments.length < 2 )
    return(EInvalidArgNum( "Level 2: playSound", 2 ));
  if( document.all ) {
    var sAdjacent = "<bgsound ";
    if( (arguments.length == 3) && (sAttrib.length != 0) ) {
      sAdjacent += sAttrib;
      sAdjacent += " ";
    }
    sAdjacent += "src=\"";
    sAdjacent += sSoundFile;
    sAdjacent += "\" loop=\"";
    if( isNaN(Loop) )
      sAdjacent += Loop;
    else
      sAdjacent += String(Loop);
    sAdjacent += "\">";
   document.all.tags("head")[0].insertAdjacentHTML( "BeforeEnd", sAdjacent );
  }
}
