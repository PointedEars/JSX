/**
 * <title>PointedEars' JSX: Time Prototypes and Functions</title>
 *
 * WARNING: Refactoring in progress. Do not link to this resource.
 * Refer time.txt for general documentation.
 *
 * @requires string.js (for replaceText)
 * @deprecated requires enhancd2.js
 */
/*
 * This document contains JavaScriptDoc.
 * See http://PointedEars.de/scripts/JSDoc/ for details.
 */

var timeVersion = "1.09.2003.10";

// Global variables

var decimalSeparator = ".";
var timeSeparator = ":";

// Method definitions

function /** @type number */ SystemTime_decHours(
  /** @param optional number */ iUnits)
{
  (SystemTime_decHours.arguments.length > 0
    ? this.hours -= iUnits
    : this.hours--);

   if (this.dayCount)
     while (this.hours < 0)
       this.hours += 24;
      
   return this.hours;
}

function /** @type number */ SystemTime_decMinutes(
  /** @param optional number */ iUnits)
{
  (SystemTime_decMinutes.arguments.length > 0
    ? this.minutes -= iUnits
    : this.minutes--);

  while (this.minutes < 0)
  {
    this.decHours();
    this.minutes += 60;
  }
  
  return this.minutes;
}

function /** @type number */ SystemTime_decSeconds(
  /** @param optional number */ iUnits)
{
  (SystemTime_decSeconds.arguments.length > 0
    ? this.seconds -= iUnits
    : this.seconds--);

  while (this.seconds < 0)
  {
    this.decMinutes();
    this.seconds += 60;
  }
  
  return this.seconds;
}

function /** @type number */ SystemTime_decSec100(
  /** @param optional number */ iUnits)
{
  (SystemTime_decSec100.arguments.length > 0
    ? this.sec100 -= iUnits
    : this.sec100--);

  while (this.sec100 < 0)
  {
    this.decSeconds();
    this.sec100 += 1000;
  }
  
  return this.sec100;
}

function /** @type number */ SystemTime_incHours(
  /** @param optional number */ iUnits)
{
  (SystemTime_incHours.arguments.length > 0
    ? this.hours += iUnits
    : this.hours++);

  if (this.dayCount)
    while (this.hours > 23)
      this.hours -= 24;
      
  return this.hours;
}

function /** @type number */ SystemTime_incMinutes(
  /** @param optional number */ iUnits)
{
  (SystemTime_incMinutes.arguments.length > 0
    ? this.minutes += iUnits
    : this.minutes++);

  while (this.minutes > 59)
  {
    this.incHours();
    this.minutes -= 60;
  }
  
  return this.minutes;
}

function /** @type number */ SystemTime_incSeconds(
  /** @param optional number */ iUnits)
{
  (SystemTime_incSeconds.arguments.length > 0
    ? this.seconds += iUnits
    : this.seconds++);

  while (this.seconds > 59)
  {
    this.incMinutes();
    this.seconds -= 60;
  }
  
  return this.seconds;
}

function /** @type number */ SystemTime_incSec100(
  /** @param optional number */ iUnits)
{
  (SystemTime_incSec100.arguments.length > 0
    ? this.sec100 += iUnits
    : this.sec100++);

  while (this.sec100 > 999)
  {
    this.incSeconds();
    this.sec100 -= 1000;
  }
  
  return this.sec100;
}

function /** @type boolean */ SystemTime_fromData(
  /** @param number           */ iHours,
  /** @param optional number  */ iMinutes,
  /** @param optional number  */ iSeconds,
  /** @param optional number  */ iSec100,
  /** @param optional boolean */ bDayCount)
/**
 * @returns <code>false</code> on missing arguments,
 * <code>true</code> otherwise.
 */
{
  var argnum = SystemTime_fromString.arguments.length;

  if (argnum > 0)
  {
    this.hours = Math.floor(Math.abs(Number(iHours)));
    if (argnum > 1)
    {
      this.minutes = Math.floor(Math.abs(Number(iMinutes)));
      if (argnum > 2)
      {
        this.seconds = Math.floor(Math.abs(Number(iSeconds)));
        if (argnum > 3)
        {
          this.sec100 = Math.floor(Math.abs(Number(iSec100)));
          if (argnum > 4)
            this.dayCount = bDayCount;
        }
      }
    }
    return true;
  }
  else
    return false;
}

function /** @type SystemTime */ SystemTime_fromString(/** @param string */ s)
{
  var timeSep = s.split(timeSeparator);

  if (timeSep > 0)
  { // if 1 or more time separator, first number is considered to be hours
    var sep1 = s.indexOf(timeSeparator);
    this.hours = Number(s.substring(0, sep1 - 1)); // Extract hours
    //		this.
    if (timeSep > 1)
    {

    }
  }
  
  return this;
}

function /** @type string */ SystemTime_toString(
  /** @param boolean          */ bShowHours,
  /** @param optional boolean */ bShowSeconds,
  /** @param optional boolean */ bShowSec100)
{
  var sSec100 = String(this.sec100);
  while (sSec100.length < 3)
    sSec100 = "0" + sSec100;

  var sSeconds = String(this.seconds);
  if (this.seconds < 10)
    sSeconds = "0" + sSeconds;

  var sMinutes = String(this.minutes);
  if (this.minutes < 10)
    sMinutes = "0" + sMinutes;

  var sHours = String(this.hours);
  if (this.hours < 10)
    sHours = "0" + sHours;

  var argnum = SystemTime_toString.arguments.length;
  var result =
    (argnum > 0 && bShowHours
      ? sHours + timeSeparator
      : "")
    + sMinutes
    + (argnum > 1 && bShowSeconds
        ? timeSeparator + sSeconds
        : "")
    + (argnum > 2 && bShowSec100
        ? decimalSeparator + sSec100
        : "");

  return result;
}

// Prototype definition

function /** @type constructor */ SystemTime(
  /** @param optional number  */ iHours,
  /** @param optional number  */ iMinutes,
  /** @param optional number  */ iSeconds,
  /** @param optional number  */ iSec100,
  /** @param optional boolean */ bDayCount)
{
  var argnum = SystemTime.arguments.length;

  /** @property number */ this.hours =
    (argnum > 0
      ? Number(iHours)
      : 0);
  /** @property number */ this.minutes =
    (argnum > 1
      ? Number(iMinutes)
      : 0);
  /** @property number */ this.seconds =
    (argnum > 2
      ? Number(iSeconds)
      : 0);
  /** @property number */ this.sec100 =
    (argnum > 3
      ? Number(iSec100)
      : 0);
  /** @property boolean */ this.dayCount =
    (argnum > 4
      ? bDayCount
      : false);

  /** @method */ this.decHours = SystemTime_decHours;
  /** @method */ this.decMinutes = SystemTime_decMinutes;
  /** @method */ this.decSeconds = SystemTime_decSeconds;
  /** @method */ this.decSec100 = SystemTime_decSec100;
  /** @method */ this.incHours = SystemTime_incHours;
  /** @method */ this.incMinutes = SystemTime_incMinutes;
  /** @method */ this.incSeconds = SystemTime_incSeconds;
  /** @method */ this.incSec100 = SystemTime_incSec100;
  /** @method */ this.fromData = SystemTime_fromData;
  /** @method */ this.fromString = SystemTime_fromString;
  /** @method */ this.toString = SystemTime_toString;
}

function TZdescr(
  /** @param number */ iGMToffsetMins,
  /** @param string */ sDescr)
{
  /** @property number */ this.iGMToffsetMins = iGMToffsetMins || 0;
  /** @property string */ this.sDescr = sDescr || "";
}

function /** @type string */ DateNames_getTZdescr(
  /** @param number */ iGMToffsetMins)
{
  for (var i = 0; i < this.aTZdescr.length; i++)
    if (this.aTZdescr[i].iGMToffsetMins == iGMToffsetMins)
      return this.aTZdescr[i].sDescr;

  return "";
}

function DateNames(
  /** @param optional Array of string  */ aaShortWeekdayNames,
  /** @param optional Array of string  */ aaMedWeekdayNames,
  /** @param optional Array of string  */ aaLongWeekdayNames,
  /** @param optional Array of string  */ aaShortMonthNames,
  /** @param optional Array of string  */ aaMedMonthNames,
  /** @param optional Array of string  */ aaLongMonthNames,
  /** @param optional Array of TZdescr */ aaTZdescr)
/**
 * JSX:enhancd2.js:DateNames(...)
 *
 * Prototype for weekday and month names
 * Pass arrays containing the respective strings as
 * arguments to set properties on creation of object.
 */
{
  var iArgNum = DateNames.arguments.length;
  /** @property Array of string */ this.aShortWeekdayNames =
    aaShortWeekdayNames || new Array(7);
  /** @property Array of string */ this.aMedWeekdayNames =
    aaMedWeekdayNames || new Array(7);
  /** @property Array of string */ this.aLongWeekdayNames =
    aaLongWeekdayNames || new Array(7);
  /** @property Array of string */ this.aShortMonthNames =
    aaShortMonthNames || new Array(12);
  /** @property Array of string */ this.aMedMonthNames =
    aaMedMonthNames || new Array(12);
  /** @property Array of string */ this.aLongMonthNames =
    aaLongMonthNames || new Array(12);
  /** @property Array of TZdescr */ this.aTZdescr =
    aaTZdescr || new Array();
  /** @method */ this.getTZdescr = DateNames_getTZdescr;
}

var cDateLblOpen = "_"; // A unique date label begins with this
var cDateLblClose = "_"; // A unique date label ends with this

function getDateFmt(
  /** @param Date */ dDate,
  /** @param optional string */ sFormat,
  /** @param optional DateNames */ oDateNames)
/**
 * JSX:enhancd2.js:getDateFmt(...)
 *
 * Returns the dDate value as a formatted string as specified with
 * sFormat.
 *
 * @param dDate Date value to be formatted as string.
 * @param sFormat Use the following format labels enclosed in the
 * characters defined above with the cDateLbl... global variables:
 *
 * <table>
 *   <tr valign="top">
 *     <td>CC</td>
 *     <td>Century (19 if not supported by script engine).</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>yyyy</td>
 *     <td>Year with century. Please note that if Date.getFullYear(...)
 *        is not available, century is set to 19 (02 becomes 1902).
 *        yyyy is equal to CCyy.</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>yy</td>
 *     <td>Year without century</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>MMMM</td>
 *     <td>Long name of month</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>MMM</td>
 *     <td>Medium name of month</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>MM</td>
 *     <td>Short name of month</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>0M</td>
 *     <td>Two-digit month number (preceded by "0" if smaller than 10)</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>M</td>
 *     <td>Month number</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>dddd</td>
 *     <td>Long name of weekday</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>ddd</td>
 *     <td>Medium name of weekday</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>dd</td>
 *     <td>Short name of weekday</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>0d</td>
 *     <td>Two-digit day number (preceded by "0" if smaller than 10)</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>d</td>
 *     <td>Day number</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>hh</td>
 *     <td>Two-digit hours (preceded by "0" if smaller than 10)</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>h</td>
 *     <td>Hours</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>mm</td>
 *     <td>Two-digit minutes (preceded by "0" if smaller than 10)</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>m</td>
 *     <td>Minutes</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>ss</td>
 *     <td>Two-digit seconds</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>s</td>
 *     <td>Seconds</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>SS</td>
 *     <td>Three-digit milliseconds (with leading zeroes)</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>S</td>
 *     <td>Milliseconds (if supported by script engine, otherwise "0").</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>TTTTT</td>
 *     <td>Timezone description. oDateNames.aTimeZones required.</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>TTTT</td>
 *     <td>Timezone offset to GMT in hh:mm (with leading zero).</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>TTT</td>
 *     <td>Timezone offset to GMT in h:mm.</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>TT</td>
 *     <td>Timezone offset to GMT as two-digit minutes (with leading zero)</td>
 *   </tr>
 *   <tr valign="top">
 *     <td>T</td>
 *     <td>Timezone offset to GMT in minutes.</td>
 *   </tr>
 * </table>
 * @param oDateNames Labels of weekdays, months and timezones.
 */
{
  var iArgNum = getDateFmt.arguments.length;
  if (iArgNum < 1)
    return false;
  if (iArgNum < 2 || sFormat.length == 0)
    return String(dDate);

  var ooDateNames;
  if (iArgNum < 3)
    // Default (english) weekdays, month labels and timezone descriptions
    oDateNames =
      new DateNames(
        new Array("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"),
        new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"),
        new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
          "Friday", "Saturday"),
        new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
          "Sep", "Oct", "Nov", "Dec"),
        new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
          "Sep", "Oct", "Nov", "Dec"),
        new Array("January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"),
        new Array(
          new TZdescr(-60, "WET"),
          new TZdescr(0, "GMT"),
          new TZdescr(60, "CET"),
          new TZdescr(120, "CEST/EET")));
          
  var sShortWeekday = oDateNames.aShortWeekdayNames[dDate.getDay()];
  var sMedWeekday = oDateNames.aMedWeekdayNames[dDate.getDay()];
  var sLongWeekday = oDateNames.aLongWeekdayNames[dDate.getDay()];
  var sShortMonth = oDateNames.aShortMonthNames[dDate.getMonth()];
  var sMedMonth = oDateNames.aMedMonthNames[dDate.getMonth()];
  var sLongMonth = oDateNames.aLongMonthNames[dDate.getMonth()];

  var iYear = dDate.getYear();
  if (iYear < 1000)
    iYear += 1900;

  var sLongYear =
    (dDate.getFullYear
     ? String(dDate.getFullYear())
     : String(iYear));
  var sShortYear = sLongYear.substr(sLongYear.length - 2, 2);
  var sMonth = String(dDate.getMonth() + 1);
  var sDay = String(dDate.getDate());
  var sHours = String(dDate.getHours());
  var sMins = String(dDate.getMinutes());
  var sSecs = String(dDate.getSeconds());
  var sSecs1000;
  if (dDate.getMilliseconds)
    sSecs1000 = String(dDate.getMilliseconds());
  else
    sSecs1000 = "0";
  var sTZmins = String(-dDate.getTimezoneOffset());
  var iTZhours = Math.floor(-dDate.getTimezoneOffset() / 60);
  var iTZmins = ((-dDate.getTimezoneOffset() / 60) + iTZhours) * 60;
  var sTZhoursMins =
    String(iTZhours) + ":" + ((iTZmins < 10) ? "0" : "") + String(iTZmins);
  var sTZhours2Mins =
    ((iTZhours < 10) ? "0" : "")
      + String(iTZhours)
      + ":"
      + ((iTZmins < 10) ? "0" : "")
      + String(iTZmins);
  var sTZdescr = oDateNames.getTZdescr(-dDate.getTimezoneOffset());

  sFormat =
    replaceText(sFormat, cDateLblOpen + "yyyy" + cDateLblClose, sLongYear);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "yy" + cDateLblClose, sShortYear);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "MMMM" + cDateLblClose, sLongMonth);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "MMM" + cDateLblClose, sMedMonth);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "MM" + cDateLblClose, sShortMonth);
  sFormat =
    replaceText(
      sFormat,
      cDateLblOpen + "0M" + cDateLblClose,
      ((sMonth.length < 2) ? "0" + sMonth : sMonth));
  sFormat = replaceText(sFormat, cDateLblOpen + "M" + cDateLblClose, sMonth);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "dddd" + cDateLblClose, sLongWeekday);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "ddd" + cDateLblClose, sMedWeekday);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "dd" + cDateLblClose, sShortWeekday);
  sFormat =
    replaceText(
      sFormat,
      cDateLblOpen + "0d" + cDateLblClose,
      ((sDay.length < 2) ? "0" + sDay : sDay));
  sFormat = replaceText(sFormat, cDateLblOpen + "d" + cDateLblClose, sDay);
  sFormat =
    replaceText(
      sFormat,
      cDateLblOpen + "hh" + cDateLblClose,
      ((sHours.length < 2) ? "0" + sHours : sHours));
  sFormat = replaceText(sFormat, cDateLblOpen + "h" + cDateLblClose, sHours);
  sFormat =
    replaceText(
      sFormat,
      cDateLblOpen + "mm" + cDateLblClose,
      ((sMins.length < 2) ? "0" + sMins : sMins));
  sFormat = replaceText(sFormat, cDateLblOpen + "m" + cDateLblClose, sMins);
  sFormat =
    replaceText(
      sFormat,
      cDateLblOpen + "ss" + cDateLblClose,
      ((sSecs.length < 2) ? "0" + sSecs : sSecs));
  sFormat =
    replaceText(
      sFormat,
      cDateLblOpen + "SSS" + cDateLblClose,
      ((sSecs1000.length < 3) ? "0" : "")
        + ((sSecs1000.length < 2) ? "0" : "")
        + sSecs1000);
  sFormat =
    replaceText(
      sFormat,
      cDateLblOpen + "SS" + cDateLblClose,
      (sSecs1000.length < 3 ? "0" : "")
        + (sSecs1000.length < 2 ? "0" : "")
        + sSecs1000);
  sFormat = replaceText(sFormat, cDateLblOpen + "S" + cDateLblClose, sSecs1000);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "TTTTT" + cDateLblClose, sTZdescr);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "TTTT" + cDateLblClose, sTZhours2Mins);
  sFormat =
    replaceText(sFormat, cDateLblOpen + "TTT" + cDateLblClose, sTZhoursMins);
  sFormat =
    replaceText(
      sFormat,
      cDateLblOpen + "TT" + cDateLblClose,
      (iTZmins < 10
        ? "0" + iTZmins
        : String(iTZmins)));
  sFormat =
    replaceText(sFormat, cDateLblOpen + "T" + cDateLblClose, String(iTZmins));

  return sFormat;
}

// German weekdays, month labels and timezone descriptions
var oDateNames_de =
  new DateNames(
    new Array("So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"),
    new Array("Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"),
    new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag",
      "Freitag", "Samstag"),
    new Array("Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug",
      "Sep", "Okt", "Nov", "Dez"),
    new Array("Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug",
      "Sep", "Okt", "Nov", "Dez"),
    new Array("Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
      "August", "September", "Oktober", "November", "Dezember"),
    new Array(
      new TZdescr(-60, "WEZ"),
      new TZdescr(0, "GMT"),
      new TZdescr(60, "MEZ"),
      new TZdescr(120, "MESZ/OEZ")));

function isValidDate(
  /** @argument number */ iYear,
  /** @argument number */ iMonth,
  /** @argument number */ iDate)
/**
 * @author Copyright (c) 2003 Thomas Lahn &lt;time.js@PointedEars.de&gt;
 * @partof http://pointedears.de/scripts/time.js
 * @argdescr iYear  Years since 1900. With only JavaScript 1.2
 *                  supported, years before 1970 are not allowed.
 * @argdescr iMonth Month: 0 (January) to 11 (December)
 * @argdescr iDate  Day of month: 1 to 31
 * @returns         <code>true</code> if the date is valid,
 *                  <code>false</code> otherwise.
 * @see             Date()
 */
{
  var
    d = new Date(iYear, iMonth, iDate), // create new Date object
    y = 0;

  if (d)
  {
    y =
      (d.getFullYear // prefer 4-digit year
        ? d.getFullYear()
        : d.getYear());
    if (!d.getFullYear && y < 1900) // Y2K workaround
      y += 1900;
  }

  /*
   * If no Date object exists or if the properties of the object differ
   * from the passed arguments, the date was not valid (out of range,
   * e.g. not paying attention to leap years.)
   */
  return (
    d && y == iYear && d.getMonth() == iMonth && d.getDate() == iDate);
}