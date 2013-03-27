/**
 * @fileOverview <title>Date Library</title>
 * @file $Id$
 * @requires object.js
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
  version: "$Revision$ ($Date$)",
  copyright: "Copyright \xA9 2013",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://PointedEars.de/scripts/",
};

/**
 * Returns <code>true</code> if the arguments define a valid datetime.
 *
 * @param {Number} year
 *   Year argument for the {@link Date} constructor.  Possible
 *   implementation-dependent correction of two-digit years is
 *   not supported.
 * @param {Number} month (optional)
 * @param {Number} date
 * @param {Number} minutes
 * @param {Number} seconds
 * @param {Number} ms
 * @return {boolean}
 *   <code>true</code> if the arguments would produce a
 *   corresponding time value when passed to the {@link Date}
 *   constructor, <code>false</code> otherwise.
 * @see Date
 */
Date.isValid = function (year, month, date, hours, minutes, seconds, ms) {
  if (arguments.length < 3)
  {
    return jsx.throwThis(jsx.InvalidArgumentError,
      ["Not enough arguments", [].slice.call(arguments), "at least (year, month)"]);
  }

  var d = Date.construct(arguments);

  return (d.getFullYear() == year
    && (typeof month == "undefined"   || d.getMonth()   == month)
    && (typeof hours == "undefined"   || d.getHours()   == hours)
    && (typeof minutes == "undefined" || d.getMinutes() == minutes)
    && (typeof seconds == "undefined" || d.getSeconds() == seconds));
};