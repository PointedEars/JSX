/**
 * <title>Type Function Library</title>
 */

/**
 * @return undefined
 */
function Types()
{
  this.version = "1.29.8.2009070702";
/**
 * @file types.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @requires object.js
 * @author
 *   (C) 2001-2009  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 */
  this.copyright = "Copyright \xA9 1999-2009";
  this.author    = "Thomas Lahn";
  this.email     = "types.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
  this.URI       = this.path + "types.js";
// var typesDocURL = typesPath + "types.htm";
}

var types = new Types();

/* a more compatible approach */
if (typeof jsx == "undefined") var jsx = new Object();
jsx.types = types;

/* allows for de.pointedears.jsx.types */
if (typeof de == "undefined") var de = new Object();
if (typeof de.pointedears == "undefined") de.pointedears = new Object();
if (typeof de.pointedears.jsx == "undefined") de.pointedears.jsx = jsx;
de.pointedears.jsx.types = types;

/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public Licnse
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License (GPL) for more details.
 *
 * You should have received a copy of the GNU GPL along with this
 * program (COPYING file); if not, go to [1] or write to the Free
 * Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA.
 * 
 * [1] <http://www.gnu.org/licenses/licenses.html#GPL>
 */

/*
 * This script file contains JSdoc[tm] comments
 * to create an API documentation of it from them, see
 * <http://PointedEars.de/scripts/JSdoc/> for details.
 */

/**
 * @param sMsg : optional string
 * @return false
 */ 
var TypesException = jsx.types.TypesException = function(sMsg) {
  alert(
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
 * @param o : optional Object 
 *   Base object; the default is the calling object.
 * @param p : String 
 *   Property name; required.
 * @return boolean
 */
var isDefined = jsx.types.isDefined = function(o, p) {
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
 * @param o : optional Object 
 *   Base object; the default is the calling object.
 * @param p : String 
 *   Property name; required.
 * @return boolean
 */
var isUndefined = jsx.types.isUndefined = function(o, p) {
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
 *   (C) 2003, 2009  Thomas Lahn &lt;object.js@PointedEars.de&gt;
 * @partof http://pointedears.de/scripts/object.js
 * @requires jsx.object#isInstanceOf
 * @param a : Object
 *   Expression to be determined an array.
 * @return 
 *   <code>true</code> if <code>a</code> is an object
 *   derived from Array, <code>false</code> otherwise.
 *   Returns also <code>false</code> if the language
 *   version does not support Array objects (JavaScript
 *   before 1.1).
 * @todo
 */
var isArray = jsx.types.isArray = function(a) {
  return jsx.object.isInstanceOf(a, typeof Array != "undefined" ? Array : null);
};

/**
 * @author
 *   (C) 2003  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 * @param o : Object
 *   to be determined iterable, i.e. to be determined
 *   whether it provides the <code>length</code> property and
 *   has at least the <code>0</code> (zero) property.  This
 *   applies for non-empty <code>Array</code> objects with
 *   at least a first non-undefined element as well as, e.g.,
 *   for DOM objects implementing one of the
 *   <code>HTMLCollection</code> or
 *   <code>HTMLOptionsCollection</code> interfaces defined in
 *   the W3C DOM Level 2 Specification.
 * @type boolean
 * @return
 *   <code>true</code> if <code>o</code> is an iterable object,
 *   <code>false</code> otherwise.
 */
var isIterable = jsx.types.isIterable = function(o) {
  return !!(
    o
    && typeof o.length != "undefined"
    && typeof o[0] != "undefined");
};

/**
 * Converts a string using bracket property accessor syntax
 * to one that uses dot property accessor syntax.
 * 
 * @param s : string 
 *   String of the form "root['branch']['leaf']['...']..." or
 *   "root[branch][leaf][...]..." to be converted.  Required.
 * @return string
 *   A string of the form `root.branch.leaf...' converted from
 *   <var>s</var>.
 */
var bracketsToDots = jsx.bracketsToDots = function(s) {
  // FIXME: What about non-identifier names?
  return s.replace(/\['?/g, '.').replace(/'?\]/g, '');
}; 

/**
 * Converts a string using dot property accessor syntax
 * to one that uses bracket property accessor syntax.
 * 
 * @param s : string
 *   of the form `root.branch.leaf' to be converted.
 *   Required.
 * @param bStringsOnly : optional boolean = false
 *   Specifies if all parts of the tree should be converted
 *   or not.  Optional.
 *   If not provided or <code>false</code>, all parts are
 *   converted.  If <code>true</code>, only parts are converted
 *   that are required to (because JavaScript identifiers as
 *   required by dot notation must start with a character in
 *   <code>[A-Za-z_$]</code>, while parameters of bracket
 *   notation may be in any format.)
 * @return string
 *   A string of the form "root['branch']['leaf']" converted
 *   from <var>s</var>.
 */
var dotsToBrackets = jsx.dotsToBrackets = function(s, bStringsOnly) {
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
 * @param o : Object
 *   Base object
 * @param : string
 *   Name(s) of the property/properties that are required for
 *   the feature.  For example, passing "foo" and "bar"
 *   determines whether o["foo"]["bar"] is an available feature.
 * @return boolean
 *   The feature's value if the arguments refer to a feature,
 *   <code>false</code> otherwise.  Note that if a feature
 *   has <code>boolean</code> documented as its type, you
 *   should therefore not use this method to determine its
 *   availability.
 *   
 *   Also, if a reference leading to the feature resolves to
 *   a value for that the result of the <code>typeof</code>
 *   operation is <code>"undefined"</code>, testing of further
 *   arguments will stop and <code>true</code> will be returned
 *   because <code>"undefined"</code> indicates a host object's
 *   method in MSHTML and access to the property value causes
 *   a runtime exception; therefore, in this case you can use
 *   the return value of this method only as an indicator that
 *   there is such a method.
 */
var isFeature = jsx.types.isFeature = function(o) {
  if (typeof o != "undefined" && o)
  {
    for (var i = 1, len = arguments.length; i < len; i++)
    { 
      var arg = arguments[i];
      
      var t = typeof o[arg], isUnknown;
      if ((isUnknown = /^\s*unknown\s*$/i.test(t))
          || !/^\s*undefined\s*$/i.test(t) && o[arg])
      {
        o = o[arg];
        if (isUnknown) break;
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