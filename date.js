/**
 * @fileOverview <title>Date Library</title>
 * @file $Id$
 * @requires object.js
 * @requires string.js for Date.protoype.strftime()
 *
 * @author (C) 2013 <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
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

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

/**
 * @namespace
 */
jsx.date = {
  /**
   * @version
   */
  version: "$Id$",
  copyright: "Copyright \xA9 2013",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://PointedEars.de/scripts/",
};

/**
 * Returns <code>true</code> if the arguments define a valid date-time.
 *
 * @param {Number} year
 *   Year argument for the {@link Date} constructor.  Possible
 *   implementation-dependent correction of two-digit years is
 *   not supported.
 * @param {Number} month
 * @param {Number} date (optional)
 * @param {Number} minutes (optional)
 * @param {Number} seconds (optional)
 * @param {Number} ms (optional)
 * @return {boolean}
 *   <code>true</code> if the arguments would produce a
 *   corresponding time value when passed to the {@link Date}
 *   constructor, <code>false</code> otherwise.
 * @see Date
 */
jsx.date.isValid = function (year, month, date, hours, minutes, seconds, ms) {
  if (arguments.length < 3)
  {
    return jsx.throwThis(jsx.InvalidArgumentError,
      ["Not enough arguments", [].slice.call(arguments), "at least (year : int, month : int)"]);
  }

  var d = Date.construct(arguments);

  return (d.getFullYear() == year
    && (typeof month == "undefined"   || d.getMonth()   == month)
    && (typeof hours == "undefined"   || d.getHours()   == hours)
    && (typeof minutes == "undefined" || d.getMinutes() == minutes)
    && (typeof seconds == "undefined" || d.getSeconds() == seconds));
};

/**
 * Returns a {@link Date} as a formatted string
 *
 * @function
 * @namespace
 */
jsx.date.strftime = (function () {
  var _jsx_string, _leadingZero, _pad;
  var _strftime, _weekdays, _months, _daytimes, _timezones;

  var _rxDateFormats = /%([aAdejuwUVWbBhmCgGyYHkIlMpPrTSTXzZcDFsxnt%])/g;
  var _formatter = function (placeholder, conversion) {
    if (typeof _strftime == "undefined")
    {
      _strftime = jsx.date.strftime;
    }

    switch (conversion)
    {
      /* Day */
      case "a": return _weekdays[this.getDay()][0];
      case "A": return _weekdays[this.getDay()][1];
      case "d": return _leadingZero(this.getDate(), 2);
      case "e": return _pad(this.getDate(), 2);

      /* ISO 8601 weekday: Sunday (0) is 7 */
      case "u": return (this.getDay() % 7) || "7";

      case "w": return this.getDay();

      /* Month */
      case "b":
      case "h":
        return _months[this.getMonth()][0];
      case "B": return _months[this.getMonth()][1];
      case "m": return _leadingZero(this.getMonth() + 1, 2);

      /* Year */
      case "C": return _leadingZero(Math.floor(this.getFullYear() / 100), 2);
      case "y": return _leadingZero(this.getFullYear() % 100, 2);
      case "Y": return _leadingZero(this.getFullYear(), 4);

      /* Time */
      case "H": return _leadingZero(this.getHours(), 2);
      case "k": return _pad(this.getHours(), 2);

      /* 12-hour format, 0 hours is 12am */
      case "I": return _leadingZero((this.getHours() % 12) || "12", 2);
      case "l": return _pad((this.getHours() % 12) || "12" , 2);

      case "M": return _leadingZero(this.getMinutes(), 2);
      case "P": return _daytimes[this.getHours() < 12 ? "am" : "pm"].toUpperCase();
      case "p": return _daytimes[this.getHours() < 12 ? "am" : "pm"];
      case "R": return _strftime(this, "%H:%M");
      case "S": return _leadingZero(this.getSeconds(), 2);
      case "T": return _strftime(this, "%H:%M:%S");
      case "X": return this.toLocaleTimeString();
      case "z":
        var tzOffset = this.getTimezoneOffset();
        var hours = Math.floor(Math.abs(tzOffset) / 60);
        var minutes = Math.floor(Math.abs(tzOffset) - (hours * 60));

        /* NOTE: Negative offset means _ahead_ of UTC */
        return (tzOffset < 0 ? "+" : "-")
          + _leadingZero(hours, 2)
          + _leadingZero(minutes, 2);

      case "Z":
        var tzNames = _timezones[this.getTimezoneOffset()];

        /*
         * If no time zone name is defined for the offset,
         * return UTC(+|-)HH:MM
         */
        tzOffset = _strftime(this, "%z");

        return (tzNames && tzNames.join("/")
          || ("UTC" + tzOffset.substring(0, tzOffset.length - 1)
              + ":" + tzOffset.substring(tzOffset.length - 1)));

      /* Time and Date Stamps */
      case "c": return this.toLocaleString();
      case "D": return _strftime(this, "%m/%d/%y");
      case "F": return _strftime(this, "%Y-%m-%d");

      /* Unix timestamp */
      case "s": return Math.floor(this.valueOf() / 1000);

      case "x": return this.toLocaleDateString();

      /* Miscellaneous */
      case "n": return "\n";
      case "t": return "\t";
      case "%": return "%";

      default:
        jsx.warn("Unsupported conversion specifier: " + placeholder);
        return placeholder;
    }
  };

  /**
   * @param {Date} date
   * @param {String} format
   * @return {string}
   *   <var>date</var> formatted according to <var>format</var>
   */
  return function jsx_date_strftime (date, format) {
    if (arguments.length < 2 || typeof format == "undefined")
    {
      return jsx.throwThis(jsx.InvalidArgumentError,
        ["Not enough arguments", "", "(date : Date, format : String)"]);
    }

    if (typeof _jsx_string == "undefined")
    {
      /* one-time imports for _formatter() */
      _jsx_string = jsx.string;
      _leadingZero = _jsx_string.leadingZero;
      _pad = _jsx_string.pad;
    }

    var me = jsx_date_strftime;
    _weekdays = me.WEEKDAYS;
    _months = me.MONTHS;
    _daytimes = me.DAYTIMES;
    _timezones = me.TIMEZONES;

    return String(format).replace(_rxDateFormats, _formatter.bind(date));
  };
}());

jsx.object.addProperties(
  {
    /**
     * @memberOf jsx.string.strftime
     */
    WEEKDAYS: [
      ["Sun", "Sunday"], ["Mon", "Monday"], ["Tue", "Tuesday"],
      ["Wed", "Wednesday"], ["Thu", "Thursday"], ["Fri", "Friday"],
      ["Sat", "Saturday"]
    ],

    MONTHS: [
      ["Jan", "January"], ["Feb", "February"], ["Mar", "March"],
      ["Apr", "April"], ["May", "May"], ["Jun", "June"],
      ["Jul", "July"], ["Aug", "August"], ["Sep", "September"],
      ["Oct", "October"], ["Nov", "November"], ["Dec", "December"]
    ],

    DAYTIMES: {am: "am", pm: "pm"},

    TIMEZONES: {
       "540": ["Alaska Standard Time (AKST)"],
       "480": ["Alaska Daylight Time (AKDT)"],
       "240": ["Atlantic Standard Time (AST)"],
       "180": ["Atlantic Daylight Time (ADT)",
               "Argentina Time (ART)"],
         "0": ["Greenwich Mean Time (GMT)"],
       "-60": ["Central European Time (CET)"],
      "-180": ["Arabia Standard Time (AST)"],
      "-240": ["Armenia Time (AMT)"],
      "-270": ["Afghanistan Time (AFT)"],
      "-480": ["Australian Western Standard Time (AWST)",
               "ASEAN Common Time (ACT)"],
      "-570": ["Australian Central Standard Time (ACST)"],
      "-600": ["Australian Eastern Standard Time (AEST)"],
      "-630": ["Australian Central Daylight Time (ACDT)"],
      "-660": ["Australian Eastern Daylight Time (AEDT)"]
    }
  },
  jsx.object.ADD_OVERWRITE, jsx.date.strftime);

if (jsx.options.emulate)
{
  jsx.object.addProperties(
    {
      isValid: jsx.date.isValid
    },
    0, Date);

  jsx.object.addProperties(
    {
      /**
       * @memberOf Date#prototype
       * @function
       */
      strftime: (function () {
        var _strftime = jsx.date.strftime;

        /**
         * @param {String} format
         * @see jsx.date#strftime(Date, String)
         */
        return function (format) {
          return _strftime(this, format);
        };
      }())
    },
    0, Date.prototype);
}