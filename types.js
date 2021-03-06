/**
 * <title>Type Function Library</title>
 *
 * @file types.js
 * @requires object.js
 * @author
 *   (C) 2001-2009, 2013  Thomas Lahn &lt;types.js@PointedEars.de&gt;
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
  var jsx = {
    options: {
      emulate: true
    }
  };
}

jsx.types = {
  version: "1.29.8.2009070702",
  copyright: "Copyright \xA9 1999-2009",
  author:    "Thomas Lahn",
  email:     "types.js@PointedEars.de",
  path:      "http://pointedears.de/scripts/",

  /**
   * Determines if a value is a primitive <string>string</code>
   * value or a reference to a <code>String</code> instance.
   *
   * @param {any} value
   * @returns {boolean}
   */
  isString: function (value) {
    return (typeof value == "string"
             || (value != null
                 && typeof value.valueOf == "function"
                 && typeof value.valueOf() == "string"));
  }
};

jsx.types.URI = jsx.types.path + "types.js";
// var typesDocURL = typesPath + "types.htm"

/* allows for de.pointedears.jsx.types */
if (typeof de == "undefined")
{
  var de = {};
}

if (typeof de.pointedears == "undefined")
{
  de.pointedears = {};
}

if (typeof de.pointedears.jsx == "undefined")
{
  de.pointedears.jsx = jsx;
}

/**
 * @param {string} sMsg (optional)
 * @return {boolean} false
 */
var TypesException = jsx.types.TypesException = function (sMsg) {
  window.alert(
    "types.js "
      + types.version
      + "\n"
      + types.copyright
      + "  "
      + types.author
      + " <"
      + types.email
      + ">\n\n"
      + sMsg);
  return false;
};

/**
 * Returns <code>true</code> if a property is defined and its value
 * is different from <code>undefined</code>, <code>false</code> otherwise.
 *
 * @param {Object} o (optional)
 *   Base object; the default is the calling object.
 * @param {String} p
 *   Property name; required.
 * @return {boolean}
 */
var isDefined = jsx.types.isDefined = function (o, p) {
  if (!p)
  {
    p = o;
    o = this;
  }

  return (typeof o[p] != "undefined");
};

/**
 * Returns <code>true</code> if a property is undefined or
 * its value is `undefined', <code>false</code> otherwise.
 *
 * @param {Object} o (optional)
 *   Base object; the default is the calling object.
 * @param {String} p
 *   Property name; required.
 * @return {boolean}
 */
var isUndefined = jsx.types.isUndefined = function (o, p) {
  if (!p)
  {
    p = o;
    o = this;
  }

  return (typeof o[p] == "undefined");
};

/* Moved to object.js */
jsx.types.isInstanceOf = jsx.object.isInstanceOf;

/**
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @param {Object} o
 *   to be determined iterable, i.e. to be determined
 *   whether it provides the <code>length</code> property and
 *   has at least the <code>0</code> (zero) property.  This
 *   applies for non-empty <code>Array</code> objects with
 *   at least a first non-undefined element as well as, e.g.,
 *   for DOM objects implementing one of the
 *   <code>HTMLCollection</code> or
 *   <code>HTMLOptionsCollection</code> interfaces defined in
 *   the W3C DOM Level 2 Specification.
 * @return {boolean}
 *   <code>true</code> if <code>o</code> is an iterable object,
 *   <code>false</code> otherwise.
 */
var isIterable = jsx.types.isIterable = function (o) {
  return !!(
    o
    && typeof o.length != "undefined"
    && typeof o[0] != "undefined");
};

jsx.types.isNativeValue = function (value) {
  var _class = jsx.object.getClass(value);
  return (
    jsx.object.isArray(value)
    || _class == "Boolean" || value instanceof Boolean
    || _class == "Date" || value instanceof Date
    || _class == "Error" || value instanceof Error
    || _class == "Function" || value instanceof Function
    || _class == "JSON"
    || _class == "Math"
    || _class == "Number" || value instanceof Number
    || _class == "Object" || value instanceof Object
    || _class == "RegExp" || value instanceof RegExp
    || _class == "String" || value instanceof String
  );
};

/**
 * Converts a string using bracket property accessor syntax
 * to one that uses dot property accessor syntax.
 *
 * @param {string} s
 *   String of the form "root['branch']['leaf']['...']..." or
 *   "root[branch][leaf][...]..." to be converted.  Required.
 * @return {string}
 *   A string of the form `root.branch.leaf...' converted from
 *   <var>s</var>.
 */
var bracketsToDots = jsx.bracketsToDots = function (s) {
  /* FIXME: What about non-identifier names? */
  return s.replace(/\[['"]?/g, '.').replace(/['"]?\]/g, '');
};

/**
 * Converts a string using dot property accessor syntax
 * to one that uses bracket property accessor syntax.
 *
 * @param {string} s
 *   of the form `root.branch.leaf' to be converted.
 *   Required.
 * @param {boolean} bStringsOnly = false
 *   Specifies if all parts of the tree should be converted
 *   or not.  Optional.
 *   If not provided or <code>false</code>, all parts are
 *   converted.  If <code>true</code>, only parts are converted
 *   that are required to (because JavaScript identifiers as
 *   required by dot notation must start with a character in
 *   <code>[A-Za-z_$]</code>, while parameters of bracket
 *   notation may be in any format.)
 * @return {string}
 *   A string of the form "root['branch']['leaf']" converted
 *   from <var>s</var>.
 */
var dotsToBrackets = jsx.dotsToBrackets = function (s, bStringsOnly) {
  var a = s.split(".");

  s = [a[0]];

  for (var i = 1, len = a.length; i < len; i++)
  {
    var propName = a[i];

    if (bStringsOnly && /^[a-z_$]/i.test(propName))
    {
      s.push(".", propName);
    }
    else
    {
      s.push("['", propName.replace(/'/g, "\\$&"), "']");
    }
  }

  return s.join("");
};

/*
 * 1.29.7.2008052911: isMethod() moved to object.js for _hasOwnProperty();
 * dependencies should ensure backwards-compatibility
 */

/**
 * Determines whether a feature is available.
 *
 * @author
 *   (C) 2008  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @param {Object} o
 *   Base object
 * @params {string}
 *   Name(s) of the property/properties that are required for
 *   the feature.  For example, passing "foo" and "bar"
 *   determines whether o["foo"]["bar"] is an available feature.
 * @return {boolean}
 *   The feature's value if the arguments refer to a feature,
 *   <code>false</code> otherwise.  Note that if a feature
 *   has <code>boolean</code> documented as its type, you
 *   should therefore not use this method to determine its
 *   availability.
 *
 *   Also, if a reference leading to the feature resolves to
 *   a value for that the result of the <code>typeof</code>
 *   operation is <code>"unknown"</code>, testing of further
 *   arguments will stop and <code>true</code> will be returned
 *   because <code>"unknown"</code> indicates a host object's
 *   method in MSHTML and access to the property value causes
 *   a runtime exception; therefore, in this case you can use
 *   the return value of this method only as an indicator that
 *   there is such a method.
 */
var isFeature = jsx.types.isFeature = function (o) {
  if (typeof o != "undefined" && o)
  {
    var
      rxUnknown = /^\s*unknown\s*$/i,
      rxUndefined = /^\s*undefined\s*$/i;

    for (var i = 1, len = arguments.length; i < len; i++)
    {
      var arg = arguments[i];

      var t = typeof o[arg], isUnknown;
      if ((isUnknown = rxUnknown.test(t))
          || !rxUndefined.test(t) && o[arg])
      {
        o = o[arg];
        if (isUnknown)
        {
          break;
        }
      }
      else
      {
        o = null;
        break;
      }
    }
  }

  return o;
};