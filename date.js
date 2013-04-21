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

  /**
   * Weekday names, where the elements are {@link Array}s of
   * {@link Array}s of {@link String}.  The first element of the
   * inner <code>Array</code> holds the abbreviated name,
   * the second one the long name.
   * @type {Array}
   */
  WEEKDAYS: [
    ["Sun", "Sunday"], ["Mon", "Monday"], ["Tue", "Tuesday"],
    ["Wed", "Wednesday"], ["Thu", "Thursday"], ["Fri", "Friday"],
    ["Sat", "Saturday"]
  ],

  /**
   * Month names, where the elements are {@link Array}s of
   * {@link Array}s of {@link String}.  The first element of the
   * inner <code>Array</code> holds the abbreviated name,
   * the second one the long name.
   */
  MONTHS: [
    ["Jan", "January"], ["Feb", "February"], ["Mar", "March"],
    ["Apr", "April"], ["May", "May"], ["Jun", "June"],
    ["Jul", "July"], ["Aug", "August"], ["Sep", "September"],
    ["Oct", "October"], ["Nov", "November"], ["Dec", "December"]
  ],

  /**
   * Daytimes for the 12-hour format
   */
  DAYTIMES: {am: "am", pm: "pm"},

  /**
   * Time zone names, where the keys are the offsets to UTC in
   * minutes, and the values are {@link Array}s of {@link String}.
   */
  TIMEZONES: {
     "540": ["Alaska Standard Time (AKST)"],
     "480": ["Alaska Daylight Time (AKDT)"],
     "240": ["Atlantic Standard Time (AST)"],
     "180": ["Atlantic Daylight Time (ADT)",
             "Argentina Time (ART)"],
       "0": ["Greenwich Mean Time (GMT)"],
     "-60": ["Central European Time (CET)"],
    "-120": ["Central European Summer Time (CEST)"],
    "-180": ["Arabia Standard Time (AST)"],
    "-240": ["Armenia Time (AMT)"],
    "-270": ["Afghanistan Time (AFT)"],
    "-480": ["Australian Western Standard Time (AWST)",
             "ASEAN Common Time (ACT)"],
    "-570": ["Australian Central Standard Time (ACST)"],
    "-600": ["Australian Eastern Standard Time (AEST)"],
    "-630": ["Australian Central Daylight Time (ACDT)"],
    "-660": ["Australian Eastern Daylight Time (AEDT)"]
  },

  /**
   * Returns the number of day within a year
   *
   * @param {Date} date
   * @return {number}
   * @see http://en.wikipedia.org/wiki/Ordinal_date
   */
  dayOfYear: function (date) {
    var month = date.getMonth();
    var dayOfMonth = date.getDate();
    switch (month)
    {
      /* January */
      case 0:
        return dayOfMonth;

      /* February */
      case 1:
        return dayOfMonth + 31;

      default:
        return Math.floor(30.6 * (month + 1) - 91.4) + dayOfMonth
          + (jsx.date.isLeapYear(date.getFullYear()) ? 60 : 59);
    }
  },

  /**
   * Determines if the arguments define a valid date-time.
   *
   * @param {Number} year
   *   Year argument for the {@link Date} constructor.  Possible
   *   implementation-dependent correction of two-digit years is
   *   not supported.
   * @param {Number} month
   * @param {Number} date (optional)
   *   Day of month
   * @param {Number} minutes (optional)
   * @param {Number} seconds (optional)
   * @param {Number} ms (optional)
   *   Milliseconds
   * @return {boolean}
   *   <code>true</code> if the arguments would produce a
   *   corresponding time value when passed to the {@link Date}
   *   constructor, <code>false</code> otherwise.
   * @see Date
   */
  isValid: function (year, month, date, hours, minutes, seconds, ms) {
    if (arguments.length < 3)
    {
      return jsx.throwThis(jsx.InvalidArgumentError,
        ["Not enough arguments", [].slice.call(arguments),
         "at least (year : int, month : int)"]);
    }

    var d = Date.construct(arguments);

    return (d.getFullYear() == year
      && (typeof month == "undefined"   || d.getMonth()   == month)
      && (typeof hours == "undefined"   || d.getHours()   == hours)
      && (typeof minutes == "undefined" || d.getMinutes() == minutes)
      && (typeof seconds == "undefined" || d.getSeconds() == seconds));
  },

  /**
   * Determines if a year is a leap year.
   *
   * @param {Number} year
   * @return {boolean}
   *   Returns <code>true</code> if <var>year</var> is a leap year.
   */
  isLeapYear: function (year) {
    return jsx.date.isValid(year, 1, 29);
  },

  /**
   * Calculate the ISO 8601 weekday number of a <code>Date</code>.
   *
   * The ISO 8601 weekday number differs from the ECMAScript
   * weekday number in that Sunday is <code>7</code> instead of
   * <code>0</code>.
   *
   * @param {Date} date
   * @return {number}
   */
  isoWeekday: function (date) {
    return (date.getDay() % 7) || 7;
  },

  /**
   * Calculates the ISO 8601 week number of a <code>Date</code>.
   *
   * @param {Date} date
   * @return {number}
   * @see http://en.wikipedia.org/wiki/ISO_week_date#Calculating_the_week_number_of_a_given_date
   */
  isoWeekNumber: function jsx_date_isoWeekNumber (date) {
    var result = Math.floor(
      (jsx.date.dayOfYear(date) - jsx.date.isoWeekday(date)
      + 10) / 7);

    switch (result)
    {
      case 0:
        result = jsx_date_isoWeekNumber(new Date(date.getFullYear() - 1, 11, 31));
        break;

      case 53:
        /* TODO */
    }

    return result;
  },

  /**
   * Returns the time zone offset of a {@link Date}
   * in hours and minutes
   *
   * @param {Date} date
   * @param {TimeOptions} options
   *   <table>
   *     <tr>
   *       <th>delimiter</th>
   *       <td>Delimiter between hours and minutes</td>
   *     </tr>
   *     <tr>
   *       <th>leadingZero</th>
   *       <td>If <code>true</code> hours always have two digits</td>
   *     </tr>
   *     <tr>
   *       <th>zeroMinutes</th>
   *       <td>If <code>true</code> minutes are not returned if they
   *           are zero</td>
   *     </tr>
   *   </table>
   * @return {Object|string}
   */
  tzOffsetHours: function (date, options) {
    var tzOffset = date.getTimezoneOffset();
    var hours = Math.floor(Math.abs(tzOffset) / 60);
    var minutes = Math.floor(Math.abs(tzOffset) - (hours * 60));

    if (arguments.length < 2)
    {
      return {hours: hours, minutes: minutes};
    }

    return (tzOffset < 0 ? "+" : "-")
      + (options && options.leadingZero ? _leadingZero(hours, 2) : hours)
      + (+minutes || options && options.zeroMinutes
          ? (options && options.delimiter || "") + _leadingZero(minutes, 2)
          : "");
  },

  /**
   * Formats a date with letters as placeholders
   */
  format: (function () {
    var _jsx_string, _leadingZero;
    var _weekdays, _months, _daytimes, _timezones;
    var _dayOfYear, _isoWeekday, _isoWeekNumber, _tzOffsetHours;

    var _rxDateFormats = /\\([\S\s])|YY(YY)?|M{1,4}|D{1,4}|W{1,4}|ww?|HH?|hh?|mm?|s{1,4}|Z{1,3}/g;

    function _formatter (m, literal)
    {
      switch (m)
      {
        case "W":    return _weekdays[this.getDay()][0].charAt(0);
        case "WW":   return _weekdays[this.getDay()][0].substring(0, 2);
        case "WWW":  return _weekdays[this.getDay()][0];
        case "WWWW": return _weekdays[this.getDay()][1];
        case "w":    return _isoWeekday(this);
        case "ww":   return _leadingZero(_isoWeekNumber(this), 2);
        case "YY":   return this.getFullYear() % 100;
        case "YYYY": return this.getFullYear();
        case "M":    return this.getMonth() + 1;
        case "MM":   return _leadingZero(this.getMonth() + 1, 2);
        case "MMM":  return _months[this.getMonth()][0];
        case "MMMM": return _months[this.getMonth()][1];
        case "D":    return this.getDate();
        case "DD":   return _leadingZero(this.getDate(), 2);
        case "DDD":  return _dayOfYear(this);
        case "H":    return this.getHours();
        case "HH":   return _leadingZero(this.getHours(), 2);
        case "h":    return (this.getHours() % 12) || "12";
        case "hh":   return _leadingZero((this.getHours() % 12) || "12", 2);
        case "P":    return _daytimes[this.getHours() < 12 ? "am" : "pm"].toUpperCase();
        case "p":    return _daytimes[this.getHours() < 12 ? "am" : "pm"];
        case "m":    return this.getMinutes();
        case "mm":   return _leadingZero(this.getMinutes(), 2);
        case "s":    return this.getSeconds();
        case "ss":   return _leadingZero(this.getSeconds(), 2);
        case "sss":  return this.getMilliseconds();
        case "ssss": return _leadingZero(this.getMilliseconds(), 3);
        case "Z":    return _tzOffsetHours(this, null);
        case "ZZ":
          return _tzOffsetHours(this, {
            delimiter: ":",
            leadingZero: true,
            zeroMinutes: true
          });

        case "ZZZ":
          var tzNames = _timezones[this.getTimezoneOffset()];

          /*
           * If no time zone name is defined for the offset,
           * return UTC(+|-)H(:MM)?
           */
          return (tzNames && tzNames.join("/")
            || ("UTC" + _format(this, "Z")));

        default:
          if (m.charAt(0) != "\\")
          {
            jsx.warn("Unsupported format: " + m);
            return m;
          }

          return literal;
      }
    }

    /**
     * @param {Date} date
     * @param {String} format
     */
    function _format (date, format)
    {
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
      }

      var _date = jsx.date;
      _weekdays = _date.WEEKDAYS;
      _months = _date.MONTHS;
      _daytimes = _date.DAYTIMES;
      _timezones = _date.TIMEZONES;
      _dayOfYear = _date.dayOfYear;
      _isoWeekday = _date.isoWeekday;
      _isoWeekNumber = _date.isoWeekNumber;
      _tzOffsetHours = _date.tzOffsetHours;

      return format.replace(_rxDateFormats, _formatter.bind(date));
    }

    return _format;
  }()),

  /**
   * Returns a {@link Date} as a formatted string
   *
   * @namespace
   * @name jsx.date.strftime
   * @function
   * @return {string}
   *   <var>date</var> formatted according to <var>format</var>
   */
  strftime: (function () {
    var _jsx_string, _leadingZero, _pad;
    var _dayOfYear, _isoWeekday, _isoWeekNumber, _tzOffsetHours;
    var _weekdays, _months, _daytimes, _timezones;

    var _rxDateFormats = /%([aAdejuwUVWbBhmCgGyYHkIlMpPrTSTXzZcDFsxnt%])/g;

    /**
     * Replaces a date format placeholder with the corresponding value
     *
     * @private
     * @param {String} placeholder
     * @param {String} conversion
     * @return {String}
     */
    function _formatter (placeholder, conversion)
    {
      switch (conversion)
      {
        /* Day */
        case "a": return _weekdays[this.getDay()][0];
        case "A": return _weekdays[this.getDay()][1];
        case "d": return _leadingZero(this.getDate(), 2);
        case "e": return _pad(this.getDate(), 2);
        case "j": return _leadingZero(_dayOfYear(this), 3);

        /* ISO 8601 weekday: Sunday (0) is 7 */
        case "u": return _isoWeekday(this);

        case "w": return this.getDay();

        /* Week */
        /* TODO: %U, %W */
        case "V": return _leadingZero(_isoWeekNumber(this), 2);

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
        /* TODO: %G, %g */

        /* Time */
        case "H": return _leadingZero(this.getHours(), 2);
        case "k": return _pad(this.getHours(), 2);

        /* 12-hour format, 0 hours is 12am */
        case "I": return _leadingZero((this.getHours() % 12) || "12", 2);
        case "l": return _pad((this.getHours() % 12) || "12" , 2);

        case "M": return _leadingZero(this.getMinutes(), 2);

        /* Counter-intuitive, but according to strftime(3) */
        case "p": return _daytimes[this.getHours() < 12 ? "am" : "pm"].toUpperCase();
        case "P": return _daytimes[this.getHours() < 12 ? "am" : "pm"];

        case "R": return _strftime(this, "%H:%M");
        /* TODO: %r */
        case "S": return _leadingZero(this.getSeconds(), 2);
        case "T": return _strftime(this, "%H:%M:%S");
        case "X": return this.toLocaleTimeString();
        case "z":
          return _tzOffsetHours(this, {
            leadingZero: true,
            zeroMinutes: true
          });

        case "Z":
          var tzNames = _timezones[this.getTimezoneOffset()];

          /*
           * If no time zone name is defined for the offset,
           * return UTC(+|-)H(:MM)?
           */
          return (tzNames && tzNames.join("/")
            || ("UTC" + _tzOffsetHours(this, {delimiter: ":"})));

        /* Time and Date Stamps */
        case "c": return this.toLocaleString();
        case "D": return _strftime(this, "%m/%d/%y");
        case "F": return _strftime(this, "%Y-%m-%d");

        /*
         * Unix timestamp (the number of seconds since the Epoch,
         * 1970-01-01 00:00:00 +0000 (UTC))
         */
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
    }

    /**
     * @param {Date} date
     * @param {String} format
     */
    function _strftime (date, format)
    {
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

      var _date = jsx.date;
      _weekdays = _date.WEEKDAYS;
      _months = _date.MONTHS;
      _daytimes = _date.DAYTIMES;
      _timezones = _date.TIMEZONES;
      _dayOfYear = _date.dayOfYear;
      _isoWeekday = _date.isoWeekday;
      _isoWeekNumber = _date.isoWeekNumber;
      _tzOffsetHours = _date.tzOffsetHours;

      return String(format).replace(_rxDateFormats, _formatter.bind(date));
    }

    return _strftime;
  }())
};

if (jsx.options.augmentBuiltins)
{
  jsx.object.setProperties(Date, {
    /**
     * @memberOf Date
     * @function
     * @see jsx.date.isLeapYear
     */
    isLeapYear: jsx.date.isLeapYear,

    /**
     * @function
     * @see jsx.date.isValid
     */
    isValid: jsx.date.isValid
  });

  if (jsx.options.augmentPrototypes)
  {
    jsx.object.setProperties(Date.prototype, {
      /**
       * Returns the ISO weekday number of this <code>Date</code>.
       *
       * @function
       * @memberOf Date.prototype
       * @see jsx.date.isoWeekNumber(Date)
       * @return {number}
       */
      getISOWeekday: (function () {
        var _isoWeekday = jsx.date.isoWeekday;

        return function () {
          return _isoWeekday(this);
        };
      }()),

      /**
       * Returns the ISO week number of this <code>Date</code>.
       *
       * @function
       * @see jsx.date.isoWeekNumber(Date)
       * @return {number}
       */
      getISOWeekNumber: (function () {
        var _isoWeekNumber = jsx.date.isoWeekNumber;

        return function () {
          return _isoWeekNumber(this);
        };
      }()),

      /**
       * Returns the number of day within a year
       *
       * @function
       * @see jsx.date.dayOfYear(Date)
       * @return {number}
       */
      getDayOfYear: (function () {
        var _dayOfYear = jsx.date.dayOfYear;

        return function () {
          return _dayOfYear(this);
        };
      }()),

      /**
       * @function
       * @see jsx.date#format(Date, String)
       * @return {string}
       */
      format: (function () {
        var _format = jsx.date.format;

        /**
         * @param {String} format
         */
        return function (format) {
          return _format(this, format);
        };
      }()),

      /**
       * @function
       * @see jsx.date#strftime(Date, String)
       * @return {string}
       */
      strftime: (function () {
        var _strftime = jsx.date.strftime;

        /**
         * @param {String} format
         */
        return function (format) {
          return _strftime(this, format);
        };
      }())
    });
  }
}