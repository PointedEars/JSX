/**
 * <title>Debug Library<title>
 */
function Debug()
{
  this.version = "0.99.2004031616";
/**
 * @filename debug.js
 * @requires types.js
 * @requires array.js
 * @partof   PointedEars' JavaScript Extensions (JSX)
 *
 * @section Copyright & Disclaimer
 * 
 * @author
 *   (C) 2001-2004  Thomas Lahn &lt;debug.js@PointedEars.de&gt;
 */
  this.copyright = "Copyright \xA9 1999-2004";
  this.author    = "Thomas Lahn";
  this.email     = "debug.js@PointedEars.de";
  this.path      = "http://pointedears.de.vu/scripts/test/";
  this.docURL = this.path + "../enhanced.htm";
}
var debug = new Debug();
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
 * Refer debug.htm file for general documentation. 
 * 
 * This script contains JavaScriptDoc[tm], see
 * http://pointedears.de.vu/scripts/JSDoc/
 * for details.
 */
 
// reference to the global object
var _global = this;

/** @section Exceptions */

function DebugException(/** @argument string */ Msg)
{
  alert(
    "debug.js "
      + debug.version + "\n"
      + debug.copyright
      + "  " + debug.author
      + " <" + debug.email + ">\n\n"
      + Msg);
  return false;
}

/** @section Features */

function /** @type boolean */ dummyError()
{
  _global.onerror = null;

  return true;
}

function /** @type string */ getError(/** @argument Error */ e)
{
  var sError = e;

  if (e.name)
    sError += "\nName: " + e.name;
  if (e.number)
    sError += "\nCode: " + e.number;
  if (e.message)
    sError += "\nMessage: " + e.message;
  if (e.description)
    sError += "\nDescription: " + e.description;
  if (e.fileName)
    sError += "\nFilename: " + e.fileName;

  onerror = dummyError;
  eval(
      'try {'
    + '  if (e.lineNumber)'
    + '    sError += "\\nLine: " + e.lineNumber;'
    + '} catch (e2) {'
    + '  sError += "\\nLine: " + e2;'
    + '}');
  onerror = null;
        
  if (e.stack)
    sError += "\nStack:\n" + e.stack;

  return sError;
}

function alertValue(/** @arguments */)
/**
 * @requires types.js#isIterable()
 */
{
  var sResult = "";
  var a;
  var j;
  for (var i = 0; i < alertValue.arguments.length; i++)
  {
    sResult += "[" + i + "] => ";
    a = alertValue.arguments[i];

    if (isIterable(a))
    {
      sResult += "[";
      for (j = 0; j < a.length; j++)
        sResult +=
          "["
            + j + "] => "
            + (typeof a[j] == "string" ? '"' : '')
            + a[j]
            + (typeof a[j] == "string" ? '"' : '')
            + (j < a.length - 1 ? ", " : "");
      sResult += "]";
    }
    else
      sResult +=
          (typeof arguments[i] == "string" ? '"' : '')
          + arguments[i] 
          + (typeof arguments[i] == "string" ? '"' : '')
          + "\n";
  }
  alert(sResult);
}

function bracketsToDots(/** @argument string */ s)
/**
 * @argument s
 *   String of the form "root['branch']['leaf']['...']..." or
 *   "root[branch][leaf][...]..." to be converted.  Required.
 * @returns
 *   A string of the form `root.branch.leaf...' converted from
 *   <code>s</code>.
 */
{
  return s.replace(/\[/g, '.').replace(/[\]\']/g, '');
}

function dotsToBrackets(
  /** @argument string           */ s,
  /** @argument optional boolean */ bStringsOnly)
/**
 * @param s
 *   String of the form `root.branch.leaf' to be converted.
 *   Required.
 * @param bStringsOnly
 *   Specifies if all parts of the tree should be converted
 *   or not.  Optional.
 *   If not provided or <code>false</code>, all parts are
 *   converted.  If <code>true</code>, only parts are converted
 *   that are required to (because JavaScript identifiers must
 *   start with a character in <code>[A-Za-z_$]</code>, though
 *   array indizes may be numeric.)
 * @returns
 *   A string of the form "root['branch']['leaf']" converted
 *   from <code>s</code>.
 */
{
  var a = s.split(".");
  s = a[0];
  
  for (var i = 1; i < a.length; i++)
  {
    if (!bStringsOnly)
      s += "['" + a[i] + "']";
    else
    {
      if (isNaN(a[i]))
        s += "." + a[i];
      else
        s += "[" + a[i] + "]";
    }
  }
  
  return s;
}

/**
 * JavaScript Beautifier and Uglyfier ;-)
 * 
 * Test input:

javascript:
  function resizeToHelp()
  {
    alert("Usage: resizeTo clientWidth [clientHeight]");
  };

  if ("%s".length > 0)
  {
    var a = "%s".split(" ");
    if (a[0] && !isNaN(a[0]))
    {
      void (window.innerWidth=parseInt('%s'.split(' ')[0]);
    }
    else
      resizeToHelp();
  
    if (a[1] && !isNaN(a[1]))
    {
      void (window.innerHeight=parseInt(a[0]));
    }
    else
      resizeToHelp();
  }
  else
    resizeToHelp();
 
 */
function beautify(/** @argument string */ s)
{
  return s
    .replace(/(\s*\{\s*)/g, "\n$1\n  ")
    .replace(/(\s*\}([^,;])\s*)/g, "\n$1\n")
    .replace(/,([^\s])/g, ", $1")
    .replace(/([^}]?;\s*)/g, "$1\n");
}

//alert(beautify('javascript:function resizeToHelp() { alert("Usage: resizeTo clientWidth [clientHeight]"); } if ("%s".length > 0) { var a = "%s".split(" "); if (a[0] && !isNaN(a[0])) { void (window.innerWidth=parseInt(a[0])); if (a[1] && !isNaN(a[1])) { void (window.innerHeight=parseInt(a[1])); } else resizeToHelp(); } else resizeToHelp(); } else resizeToHelp();'));

function uglyfy(/** @argument string */ s)
{
  return s.replace(/\s/g, " ") // .replace
}

function Owners(/** @argument optional Array of Object */ aOwners)
/**
 * Stores references to objects in an array
 * to be used for the Property constructor.
 * 
 * @param aOwners
 *   Array of the owner references to store.  The
 *   default is an array with <code>null</code> as
 *   sole element.
 */
{
  /** @property Array */ this.items = aOwners || new Array(null);
}

function Property(
  /** @argument string        */ sName,
  sValue,
  /** @optional number        */ iID,
  /** @optional Owners|Object */ aoOwners,
  /** @optional boolean       */ bNonEnum,
  /** @optional boolean       */ bCalledFromObjectInfo)
/**
 * Retrieves type of the object or property specified by the
 * string <code>sName</code> and its value <code>sValue</code>
 * and stores that information in an object.  You may optionally
 * provide an identifier for the property with <code>iID</code>
 * and an array of references to the owner objects with
 * <code>aoOwners</code>.
 * 
 * If you provide the latter, the constructor function will
 * utilize <code>@link{array#inArray()}</code>, trying to
 * determine if the object/property references one of owners
 * (<code>referencesOwners</code>; <code>false</code> if
 * <code>aoOwners</code> is not provided) and how many properties
 * the object/property has itself (<code>hasProperties</code>;
 * <code>false</code> if <code>aoOwners</code> is not
 * provided or if detection fails.)  TODO: This is now
 * achieved through creating a new @link{#ObjectInfo} object
 * from either <code>aoOwners[aoOwners.length-1][sName]</code>
 * or <code>aoOwners[sName]</code>.  In order to avoid
 * infinite recursion when the Property(...) constructor is
 * called within ObjectInfo(...), it passes its fourth argument
 * <code>bCalledFromObjectInfo</code> as fifth one to
 * ObjectInfo(...) if present (<code>true</code> otherwise),
 * while ObjectInfo(...) passes its fifth argument
 * (<code>bCalledFromProperty</code>) as fourth to it.  (Previous
 * versions did not call ObjectInfo(...)  and thus did not allow
 * to count non-enumerable properties of a property; it seemed
 * ineffective to copypaste the ObjectInfo(...) code into this
 * constructor, thus the cross-calling.)
 * 
 * For reasons of backwards compatibility the object also provides
 * the `referencesOwner' property to specify if it references
 * its direct owner and allows for passing an object reference
 * for <code>aoOwners</code> beside of an Owners object to
 * specify that owner object.  To determine if
 * <code>aoOwners</code> is an Owners object or not, the
 * <code>@link{isInstanceOf(...)}</code> method is required.
 *
 * @param sName
 *   Name of the property.  Required.
 * @param sValue
 *   Value of the property.  Required.
 * @param iID
 *   (Unique) ID of the property.  Required.
 * @param aoOwners
 *   Reference to an Owners object storing references to the
 *   owner (object) of the property and its owners, where the
 *   last element references the direct owner.  Allows also
 *   for a reference to a non-Owners object to specify only
 *   the direct owner.  Optional.
 * @param bNonEnum
 *   <code>true</code> specifies that the property is
 *   non-enumerable.  Optional.  The default <code>false</code>
 *   determines the property to be enumerable.
 * @see types#isArray(), array#inArray()
 */
{
  this.id = iID;
  this.name = sName;
  this.type = typeof sValue;
  this.value = sValue;
  this.referencesOwner = false;
  this.referencesOwners = false;
  this.propertyCount = 0;
  this.hasProperties = false;
  this.enumerable = !bNonEnum;

  var oOwner = null;
  if (isInstanceOf(aoOwners, Owners))
    this.owner = aoOwners.items[aoOwners.items.length - 1];
  else
    this.owner = aoOwners;

  onerror = dummyError;

  eval(
      'try { // for IE \n'
    + '  if (this.owner && this.owner[sName]) \n'
    + '  { \n'
    + '    onerror = dummyError; \n'
    + '    if (isInstanceOf(this.owner, Owners)) { \n'
    + '      this.referencesOwners = \n'
    + '        inArray(this.owner[sName], aoOwners.items); \n'
    + '    } else {'
    + '      this.referencesOwner = (this.owner[sName] == this.owner); \n'
    + '    } \n'
/*
    + '  if (!bCalledFromObjectInfo) \n'
    + '  { \n'
    + '    var propertyInfo = new ObjectInfo(this.owner[sName], sName, false, true); \n'
    + '    this.hasProperties = propertyInfo.hasProperties; \n'
    + '  } \n'   
*/
    + '    try { // for IE \n'
    + '      if (!(sName == "toString" // for IE6 SP-1 \n'
    + '            || (this.owner == location && \n'
    + '                inArray(sName, ["assign", "reload", "replace"])))) \n'
    + '      { \n'
    + '        for (var p in this.owner[sName]) { \n'
    + '          this.propertyCount++; \n'
    + '        } \n'
    + '      } \n'
    + '    } catch (e) { \n'

/*
    + '    alert(sName + "\n" \n'
    + '      + "for (var p in this.owner[sName])\n\n" \n'
    + '      + getError(e)); \n'
*/

    + '      try { // for IE \n'
    + '        this.propertyCount = this.owner[sName].length; \n'
    + '      } catch (e) { \n'

/*
    + '      alert(sName + "\n" \n'
    + '        + "for (var j = 0; i < this.owner[sName].length; j++)" \n'
    + '        + getError(e)); \n'
*/

    + '      } \n'
    + '    } \n'
    + '  } \n'
    + '} catch (e) { \n'
    + '}');

  onerror = null;

  this.hasProperties = (this.propertyCount > 0);
}

function PropertyArray()
{
  this.soNone       = -1; // default
  this.soByID       = this.soNone;
  this.soByName     = 0;
  this.soByType     = 1;
  this.soByValue    = 2;
  this.sdNone       = 0;
  this.sdAscending  = 1;
  this.sdDescending = -1;
  this.sortOrder    = this.soNone;
  this.sortDir      = this.sdNone;
  this.items        = new Array();
}

PropertyArray.prototype.push =
function /** @type number|Property */ push(
  /** @argument Property */ oProperty)
{
  return this.items.push(oProperty);
}

// Specific sort methods
PropertyArray.prototype.cmpSortByIdAsc =
  /** @type Comparator */ new Function("a", "b", "return a.id - b.id;");
PropertyArray.prototype.cmpSortByIdDesc =
  /** @type Comparator */ new Function("a", "b", "return b.id - a.id;");
PropertyArray.prototype.sortById =
function sortById(iDir)
{
  if (iDir && iDir < 0)
  {
    this.items.sort(this.cmpSortByIdDesc);
  }
  else
  {
    this.items.sort(this.cmpSortByIdAsc);
  }
  
  this.sortOrder = this.soById;
  this.sortDir = iDir ? iDir : this.sdAscending;
}

PropertyArray.prototype.unsort =
  PropertyArray.prototype.sortById;
  
PropertyArray.prototype.cmpSortByNameAsc =
function /** @type Comparator */ cmpSortByNameAsc(a, b)
{
  if (a.name < b.name)
  {
    return -1;
  }
  else if (a.name > b.name)
  {
    return 1;
  }
  
  return 0;
}

PropertyArray.prototype.cmpSortByNameDesc =
function /** @type Comparator */ cmpSortByNameDesc(a, b)
{
  if (a.name > b.name)
  {
    return -1;
  }
  else if (a.name < b.name)
  {
    return 1;
  }

  return 0;
}

PropertyArray.prototype.sortByName =
function sortByName(iDir)
{
  if (iDir && iDir < 0)
  {
    this.items.sort(this.cmpSortByNameDesc);
  }
  else
  {
    this.items.sort(this.cmpSortByNameAsc);
  }
  
  this.sortOrder = this.soByName;
  this.sortDir = iDir ? iDir : this.sdAscending;
}

PropertyArray.prototype.cmpSortByTypeAsc =
function /** @type Comparator */ cmpSortByTypeAsc(a, b)
{
  if (a.type < b.type)
  {
    return -1;
  }
  else if (a.type > b.type)
  {
    return 1;
  }

  return 0;
}

PropertyArray.prototype.cmpSortByTypeDesc =
function /** @type Comparator */ cmpSortByTypeDesc(a, b)
{
  if (a.type > b.type)
  {
    return -1;
  }
  else if (a.type < b.type)
  {
    return 1;
  }

  return 0;
}

PropertyArray.prototype.sortByType =
function sortByType(iDir)
{
  if (iDir && iDir < 0)
  {
    this.items.sort(this.cmpSortByTypeDesc);
  }
  else
  {
    this.items.sort(this.cmpSortByTypeAsc);
  }

  this.sortOrder = this.soByType;
  this.sortDir = iDir ? iDir : this.sdAscending;
}

PropertyArray.prototype.cmpSortByValueAsc =
function /** @type Comparator */ cmpSortByValueAsc(a, b)
{
  if (a.value < b.value)
  {
    return -1;
  }
  else if (a.value > b.value)
  {
    return 1;
  }

  return 0;
}

PropertyArray.prototype.cmpSortByValueDesc =
function /** @type Comparator */ cmpSortByValueDesc(a, b)
{
  if (a.value > b.value)
  {
    return -1;
  }
  else if (a.value < b.value)
  {
    return 1;
  }

  return 0;
}
PropertyArray.prototype.sortByValue =
function sortByValue(iDir)
{
  if (iDir && iDir < 0)
  {
    this.items.sort(this.cmpSortByValueDesc);
  }
  else
  {
    this.items.sort(this.cmpSortByValueAsc);
  }

  this.sortOrder = this.soByValue;
  this.sortDir = iDir ? iDir : this.sdAscending;
}

PropertyArray.prototype.sortBy =
function sortBy(iSortOrder, iSortDir)
{
  switch (iSortOrder)
  {
    case this.soNone:
    case this.soByID:
      this.sortById(iSortDir);
      break;
    
    case this.soByName:
      this.sortByName(iSortDir);
      break;

    case this.soByType:
      this.sortByType(iSortDir);
      break;

    case this.soByValue:
      this.sortByValue(iSortDir);
  }
}

PropertyArray.prototype.addProperty =
function addProperty(
  /** @argument string           */ sName,
  sValue,
  /** @argument optional number  */ iID,
  /** @argument optional Object  */ oOwner,
  /** @argument optional boolean */ bEnumerable)
{
  // avoid dupes
  var aObjectProperties =
    ["constructor", "prototype", "eval", "toSource", "toString",
     "unwatch", "valueOf", "watch"];
  if (inArray(sName, aObjectProperties)
      || typeof this.items[sName] == "undefined")
  {
    this.push(new Property(sName, sValue, iID, oOwner, bEnumerable));
    this.items[sName] = sValue; 
  }
}

function NonEnumProperties(
  /** @argument RegExp          */ rxPattern,
  /** @argument Array of string */ asPropertyNames,
  /** @optional string          */ sType,
  /** @optional Object          */ fConstructor)
{
  this.pattern      = rxPattern       || /./;
  this.names        = asPropertyNames || new Array();
  this.type         = sType           || "";
  this.fConstructor = fConstructor    || null;
}

function ObjectInfo(
  /** @argument string|Object    */ sObject,
  /** @argument optional string  */ sName,
  /** @argument optional boolean */ bCalledFromProperty)
/**
 * Retrieves all properties of an object and stores them
 * in the `properties' array property.  That array can be
 * sorted by the properties <code>id</code> (by declaration),
 * <code>name</code>, <code>type</code> and <code>value</code>
 * of the <code>Property</code> prototype.  [See the sort
 * methods defined in the <code>forObject(...)</code> method.]
 * 
 * Requires JavaScript 1.5+ for inline <code>function</code>
 * statement (1.2+) and <code>try...catch</code> statement (1.5+).
 *
 * Usage:
 * 
 * <code>var foo = new ObjectInfo(myObject, sMyObjectName);</code>
 * 
 * whereas <code>foo</code> is then a reference to the
 * <code>ObjectInfo</code> object containing property
 * information about the object referenced by
 * <code>myObject</code> or the object evaluated from
 * it (so that the argument can be a string, therefore
 * <code><strong>s</strong>Object</code>.)
 *   
 * The <code>foo.name</code> property contains the name of the
 * string to be evaluated to an object.  However, if you pass a
 * reference for first argument or want to fake the object's
 * name for some reason, you may pass a string for the second
 * argument in order to overwrite the default (see below.)
 * 
 * Note that it is also tried to retrieve known but non-enumerable
 * properties if either <code>sObject</code> is a string or
 * <code>sName</code> is a string, matching either value against a
 * set of known object/property identifiers.  If you fake the
 * object's name in <code>sName</code>, only enumerable properties
 * can be retrieved.
 *
 * If <code>myObject</code> cannot be evaluated to an object,
 * the resulting <code>ObjectInfo</code> object's
 * <code>target</code> property ist <code>null</code>:
 *
 * <code>
 *  if (! foo.target)
 *     alert("Not an object!");
 * </code>
 *
 * Otherwise, <code>foo.target</code> is a reference to the
 * object which properties are accessed by <code>foo</code>:
 * 
 * <code>
 *   if (foo && foo.target && foo.target == anyOtherObject)
 *     alert("anyOtherObject references myObject.");
 * </code>
 *
 * @param sObject
 *   Reference to an object or property, or string to be evaluated
 *   to an object or a property. Required.
 *   (TODO: Throws NotAnObjectException if not provided or cannot
 *   be evaluated.)
 * @param sName
 *   Name of the object/property. Optional.
 *   If this argument is not provided, the value of the
 *   <code>name</code> property depends on <code>sObject</code>.
 *   If the latter is a reference, the default is `_odo', otherwise
 *   the default is the value of <code>sObject</code>.
 */
{
  /** @method ObjectInfo */ this.forObject =
  function forObject(
    /** @argument string|Object    */ sObject,
    /** @argument optional string  */ sName,
    /** @argument optional boolean */ bCalledFromProperty)
  /**
   * Once you have a reference to an <code>ObjectInfo</code>
   * object, you may use this method to access another object's
   * properties while the property information of the former
   * <code>ObjectInfo</code> object will be overwritten:
   *
   * <code>
   *   if (foo)
   *     foo.forObject(myOtherObject);
   * </code>
   *   
   * The <code>forObject(...)</code> method returns
   * <code>null</code> as well if <code>myOtherObject</code>
   * cannot be evaluated to an object, otherwise a reference
   * to the <code>ObjectInfo</code> object. In the first case
   * the properties of the former <code>ObjectInfo</code> object
   * are preserved:
   * 
   * <code>
   *   var myObject = new Something(...);
   *   ...
   *   var foo = new ObjectInfo(myObject);
   *   if (foo)
   *   {
   *     var myOtherObject = new SomethingElse(...);
   *     ...
   *     var bar = foo.forObject(myOtherObject);
   *     if (! bar)
   *       alert("myOtherObject is not an object!");
   *     else
   *       alert(foo.toString());
   *   }
   * </code>
   * 
   * @param sObject See contract of @link{this()}
   * @param sName   See contract of @link{this()}
   */
  {
    /** @property string */ this.name =
      (typeof sObject == "string"
        ? sObject
        : (sName ? sName : "_odo"));
                  
    /*
     * TODO: Inherit Array prototype functionality
     * (`Foobar.prototype = new Array' does not work)
     */
    this.properties = new Array();

    /**
     * Note that the <code>properties</code> extended
     * <code>Array</code> object defines properties for
     * both sort order and sort direction which can be
     * recognized by their identifier's prefix.  These
     * are:
     */
    this.properties.soNone    = -1; // default
    this.properties.soByID    = this.properties.soNone;
    this.properties.soByName  = 0;
    this.properties.soByType  = 1;
    this.properties.soByValue = 2;

    this.properties.sdNone       = 0;
    this.properties.sdAscending  = 1;
    this.properties.sdDescending = -1;

    /**
     * The current sort order and direction is stored in the
     * `sortOrder' and `sortDir' properties of the `properties'
     * extended Array object.
     * 
     * For the sort direction constants are the negative opposite
     * of each other, you may toggle the sort direction easily:
     *
     *   var p = bar.properties;
     *   p.sortBy(p.sortOrder, -p.sortDir);
     *  
     * If `sortDir' was `0' (zero) before and therefore the
     * properties were unsorted (i.e. sorted by ID), the array
     * will then be sorted ascending by the current criteria.
     */
    this.properties.sortOrder = this.properties.soNone;
    this.properties.sortDir = this.properties.sdNone;

    /**
     * With a reference to an ObjectInfo object having a valid
     * `target' reference, you may sort the property array by
     * properties of the Property prototype:
     *     
     *   if (bar && bar.properties)
     *   {
     *     bar.properties.unsort();
     *     bar.properties.sortById(...);
     *     bar.properties.sortByName(...);
     *     bar.properties.sortByType(...);
     *     bar.properties.sortByValue(...);
     *   }
     *
     * Except for the unsort() method, each specific sort method
     * takes an optional argument, specifying the sort direction
     * (ascending or descending.)  If the argument is left out,
     * the properties are sorted in ascending direction by the
     * selected criteria.  unsort() sorts the properties as if
     * they were retrieved with a `for (property in object)' loop
     * and is therefore identical to sortById() or
     * sortById(sdAscending).
     */
    // Specific sort methods
    this.properties.cmpSortByIdAsc =
      new Function("a", "b", "return a.id - b.id;");
    this.properties.cmpSortByIdDesc =
      new Function("a", "b", "return b.id - a.id;");
    this.properties.sortById = function sortById(iDir)
    {
      if (iDir && iDir < 0)
        this.sort(this.cmpSortByIdDesc);
      else
        this.sort(this.cmpSortByIdAsc);
      this.sortOrder = this.soById;
      this.sortDir = iDir ? iDir : this.sdAscending;
    }
    this.properties.unsort = new Function("this.sortById();");
 
    this.properties.cmpSortByNameAsc = function cmpSortByNameAsc(a, b)
    {
      if (a.name < b.name)
        return -1;
      else if (a.name > b.name)
        return 1;
      else return 0;
    }
    this.properties.cmpSortByNameDesc = function cmpSortByNameDesc(a, b)
    {
      if (a.name > b.name)
        return -1;
      else if (a.name < b.name)
        return 1;
      else
        return 0;
    }
    this.properties.sortByName = function sortByName(iDir)
    {
      if (iDir && iDir < 0)
        this.sort(this.cmpSortByNameDesc);
      else
        this.sort(this.cmpSortByNameAsc);
      this.sortOrder = this.soByName;
      this.sortDir = iDir ? iDir : this.sdAscending;
    }

    this.properties.cmpSortByTypeAsc = function cmpSortByTypeAsc(a, b)
    {
      if (a.type < b.type)
        return -1;
      else if (a.type > b.type)
        return 1;
      else
        return 0;
    }
    this.properties.cmpSortByTypeDesc = function cmpSortByTypeDesc(a, b)
    {
      if (a.type > b.type)
        return -1;
      else if (a.type < b.type)
        return 1;
      else
        return 0;
    }
    this.properties.sortByType = function sortByType(iDir)
    {
      if (iDir && iDir < 0)
        this.sort(this.cmpSortByTypeDesc);
      else
        this.sort(this.cmpSortByTypeAsc);
      this.sortOrder = this.soByType;
      this.sortDir = iDir ? iDir : this.sdAscending;
    }

    this.properties.cmpSortByValueAsc = function cmpSortByValueAsc(a, b)
    {
      if (a.value < b.value)
        return -1;
      else if (a.value > b.value)
        return 1;
      else
        return 0;
    }
    this.properties.cmpSortByValueDesc = function cmpSortByValueDesc(a, b)
    {
      if (a.value > b.value)
        return -1;
      else if (a.value < b.value)
        return 1;
      else
        return 0;
    }
    this.properties.sortByValue = function sortByValue(iDir)
    {
      if (iDir && iDir < 0)
        this.sort(this.cmpSortByValueDesc);
      else
        this.sort(this.cmpSortByValueAsc);
      this.sortOrder = this.soByValue;
      this.sortDir = iDir ? iDir : this.sdAscending;
    }

    /**
     * `properties' also defines a generic method for sorting
     * the array, sortBy(...), which calls the other specific
     * sort methods.  This method takes up to two optional
     * arguments, the first defining the sort criteria, the
     * second the sort direction.  You are recommended to use
     * the sort order and direction constants for arguments:
     * 
     *   var p = bar.properties;
     *   p.sortBy(p.soByName, p.sdDescending);
     *
     * If the second argument is not provided, `sdAscending' is
     * assumed.  Leaving the first argument out or providing an
     * invalid value causes no error, but the array not to be
     * re-sorted.
     *
     * @param iSortOrder Sort order. Optional.
     * @param iSortDir   Sort direction. Optional.
     */
    this.properties.sortBy = function sortBy(iSortOrder, iSortDir)
    {
      switch (iSortOrder)
      {
        case this.soNone:
        case this.soByID:
          this.sortById(iSortDir);
          break;

        case this.soByName:
          this.sortByName(iSortDir);
          break;

        case this.soByType:
          this.sortByType(iSortDir);
          break;

        case this.soByValue:
          this.sortByValue(iSortDir);
      }
    }

    this.properties.items = new Object();
    this.properties.addProperty = function addProperty(
      /** @argument string  */ sName,
      sValue,
      /** @optional number  */ iID,
      /** @optional Object  */ oOwner,
      /** @optional boolean */ bNonEnum)
    {
      // avoid dupes
      if ((isMethodType(typeof this.items.hasOwnProperty)
              && !this.items.hasOwnProperty(sName))
          || (!isMethodType(typeof this.items.hasOwnProperty)
              && typeof this.items[sName] == "undefined"))
      {
        this[this.length] =
          new Property(
            sName,
            sValue,
            iID,
            oOwner,
            bNonEnum,
            bCalledFromProperty); // avoid infinite recursion
        this.items[sName] = sValue; 
      }
    }

    if (typeof sObject == "string")
    {
      var tc = false;
      _global.onerror = dummyError;
      eval(
          'try {'
        + '  tc = true;'
        + '  this.target = eval(dotsToBrackets(sObject, true));'
        + '} catch (e) {'
        + '  try {'
        + '    this.target = eval(dotsToBrackets(sObject));'
        + '  } catch (e) {'
        + '    try {'
        + '      this.target = _global["' + sObject + '"];'
        + '    } catch (e) {'
        + '      this.target = null;'
        + '    }'
        + '  }'
        + '}');
      _global.onerror = null;
      if (! tc)
        this.target = null;
    }
    else
      this.target = sObject;

    if (this.target)
    {
      this.type = typeof this.target;
      var ti, t, i;

      // Retrieve enumerable properties
      for (i in this.target)
      {
        // Fixes problem with document.config (Mozilla 1.5b)
        ti = "";
        t = null;
        onerror = dummyError;
        eval(
            'try {'
          + '  ti = this.target[i];'
          + '  t = this.target;'
          + '} catch (e) {'
          + '  ti = null;'
          + '  t = null;'
          + '}');
        onerror = null;
          
        // avoid dupes
        this.properties.addProperty(
          i,                      // name
          ti,                     // value
          this.properties.length, // ID
          t);                     // owner reference
      }
      
      // Retrieve non-enumerable properties by guessing them
      /** @property boolean */ this.hasNonEnumProperties = false;

      var aStringProperties =
           ["length", "anchor", "big", "blink", "bold", "charAt", "charCodeAt",
            "concat", "fixed", "fontcolor", "fontsize", "fromCharCode",
            "indexOf", "italics", "localeCompare", "lastIndexOf", "link",
            "match", "replace", "search", "slice", "small", "split", "strike",
            "sub", "substr", "substring", "sup", "toLowerCase",
            "toLocaleLowerCase", "toUpperCase", "toLocaleUpperCase"];
      var aNonEnumProperties = 
        [
         new NonEnumProperties(
           /^\w/, // any object
           ["NaN", "Infinity", "__proto__", "eval", "prototype", "toSource",
            "unwatch", "watch", "undefined", "constructor", "toString",
            "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf",
            "propertyIsEnumerable",
            "all"],
           'object',
           Object),
         new NonEnumProperties(
           /_global/, // global object
           ["NaN", "Infinity", "undefined",
            "parseInt", "parseFloat", "isNaN", "isFinite",
            "decodeURI", "decodeURIComponent", "encodeURI",
            "encodeURIComponent",
            "Object", "Function", "Array", "String", "Boolean",
            "Number", "Date", "RegExp", "Error", "EvalError",
            "RangeError", "ReferenceError", "SyntaxError",
            "TypeError", "URIError",
            "Math"]),
         new NonEnumProperties(
           /^Array(\.prototype)?$/,
           ["index", "input", "length", "concat", "join", "pop", "push",
            "reverse", "shift", "slice", "splice", "sort", "unshift"],
           '',
           typeof Array != "undefined" ? Array : null),
         new NonEnumProperties(
           /^Date(\.prototype)?$/,
           ["getDate", "getDay", "getFullYear", "getHours", "getMilliseconds",
            "getMinutes", "getMonth", "getSeconds", "getTime",
            "getTimezoneOffset", "getUTCDate", "getUTCDay", "getUTCFullYear",
            "getUTCHours", "getUTCMilliseconds", "getUTCMinutes",
            "getUTCMonth", "getUTCSeconds", "getYear", 
            "parse", "setDate",
            "setFullYear", "setHours", "setMilliseconds", "setMinutes",
            "setMonth", "setSeconds", "setTime", "setUTCDate", "setUTCFullYear",
            "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth",
            "setUTCSeconds", "setYear",
            "toDateString", "toGMTString", "toLocaleString", "toTimeString",
            "toLocaleString", "toLocaleDateString", "toLocaleTimeString",
            "toUTCString", "UTC"],
           '',
           typeof Date != "undefined" ? Date : null),
         new NonEnumProperties(
           /^Function(\.prototype)?$/,
           ["arguments", "arguments.callee", "arguments.caller",
            "arguments.length", "arity", "length", "apply", "call"],
           'function',
           typeof Function != "undefined" ? Function : null),
         new NonEnumProperties(
           /^Math$/,
           ["E", "LN2", "LN10", "LOG2E", "LOG10E", "PI", "SQRT1_2", "SQRT2",
            "abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "exp",
            "floor", "log", "max", "min", "pow", "random", "round", "sin",
            "sqrt", "tan"]),
         new NonEnumProperties(
           /^Number(\.prototype)?$/,
           ["MAX_VALUE", "MIN_VALUE", "NaN", "NEGATIVE_INFINITY",
            "POSITIVE_INFINITY", "toExponential", "toFixed", "toPrecision"],
           'number',
           typeof Number != "undefined" ? Number : null),
         new NonEnumProperties(
           /^RegExp(\.prototype)?$/,
           ["global", "ignoreCase", "lastIndex", "multiline",
            "source", "exec", "test"],
           '',
           typeof RegExp != "undefined" ? RegExp : null),
         new NonEnumProperties(
           /^String(\.prototype)?$/,
           aStringProperties,
           'string',
           typeof String != "undefined" ? String : null),
         new NonEnumProperties(
           /Error(\.prototype)?$/,
           ["message", "name"]),
         new NonEnumProperties(
           /^Packages(\.prototype)?$/,
           ["className", "java", "netscape", "sun"]),
         new NonEnumProperties(
           /(^|\.)location$/i,
           ["assign", "hash", "host", "hostname", "href", "pathname",
            "port", "protocol", "reload", "replace", "search"]
            .concat(aStringProperties)),
         new NonEnumProperties(
           /\.screen$/,
           ["availHeight", "availLeft", "availTop", "availWidth", "colorDepth",
           "height", "left", "pixelDepth", "top", "width"]),
         // LiveConnect -- Java System Library classes as of version 1.4.2_03
         new NonEnumProperties(
           /^java$/,
           ["awt", "beans", "io", "lang", "math", "net", "nio", "rmi",
            "security", "sql", "text", "util"]),
         new NonEnumProperties(
           /^java\.awt$/,
           ["color", "datatransfer", "dnd", "event", "font", "geom", "im",
            "image", "peer", "print",
            "ActiveEvent", "Adjustable", "AlphaComposite", "AttributeValue",
            "AWTError", "AWTEvent", "AWTEventMulticaster", "AWTException",
            "AWTKeyStroke", "AWTPermission", "BasicStroke", "BorderLayout",
            "Frame"]),
         new NonEnumProperties(
           /^java\.lang$/,
           ["System"]),
         new NonEnumProperties(
           /^StyleSheet(\.prototype)?$/,
           ["type", "disabled", "ownerNode", "parentStyleSheet", "href",
            "title", "media"],
           '',
           typeof StyleSheet != "undefined" ? StyleSheet : null),
         new NonEnumProperties(
           /^StyleSheetList(\.prototype)?$/,
           ["length", "item"],
           '',
           typeof StyleSheetList != "undefined" ? StyleSheetList : null),
         new NonEnumProperties(
           /^LinkStyle(\.prototype)?$/,
           ["sheet"],
           '',
           typeof LinkStyle != "undefined" ? LinkStyle : null),
         new NonEnumProperties(
           /^DocumentStyle(\.prototype)?$/,
           ["styleSheets"],
           '',
           typeof DocumentStyle != "undefined" ? DocumentStyle : null)
       ];
          
      var j;
      var k;
      var p;
      for (i = 0; i < aNonEnumProperties.length; i++)
      {
        j = aNonEnumProperties[i];
        if (j.pattern.test(this.name)
            || typeof this.target == j.type
            || (typeof this.target.constructor != "undefined"
                && this.target.constructor == j.fConstructor))
        {
          for (k = 0; k < j.names.length; k++)
          {
            eval(
                'try {'
              + '  if (typeof this.target[j.names[k]] != "undefined") {'
              + '    p = this.target[j.names[k]];'
              + '  }'
              + '} catch (e) {'
              + '  p = null;'
              + '}');
              
            if ((isMethodType(typeof this.target.hasOwnProperty)
                 && this.target.hasOwnProperty(j.names[k]))
                ||
                (!isMethodType(typeof this.target.hasOwnProperty) 
                 && typeof p != "undefined"))
            {
              this.hasNonEnumProperties = true;
              
              ti = "";
              t = null;
              onerror = dummyError;
              eval(
                  'try {'
                + '  ti = p;'
                + '  t = this.target;'
                + '} catch (e) {'
                + '  ti = null;'
                + '  t = null;'
                + '}');
              onerror = null;

              // avoid dupes
              this.properties.addProperty(
                j.names[k],             // name
                ti,                     // value
                this.properties.length, // ID
                t,                      // owner reference
                true);                  // is non-enumerable
            }
          }
        } 
      }
        
      this.hasProperties = (this.properties.length > 0);

      return this;
    }
    else
    {
      this.type = "undefined";
      this.hasProperties = false;

      return null;
    }
  }
    
  this.getProperties = function getProperties(rxName, sType, bInvert, aValue)
  {
    if (!sType)
      sType = "";
    if (typeof rxName != "object" || !rxName.test)
      rxName = new RegExp(rxName);
    if (!rxName.test)
      rxName = null;

    var a = new Array();
      
    var p, b;
    for (var i = 0; i < this.properties.length; i++)
    {
      p = this.properties[i];
      
      b =
        ((rxName && rxName.test(p.name) || true)
          && (sType != "" && sType.toLowerCase() == p.type.toLowerCase()
            || true)
          && (arguments.length >= 4 && aValue == p.value || true));
      if (bInvert)
        b = !b;
      if (b)
        a[a.length] = p;
    }
    
    return a;
  }

  this.toString = function toString()
  {
    var s = "";
    onerror = dummyError;
    eval(
        'try {'
      + '  for (var i = 0; i < this.properties.length; i++) {'
      + '    var p = this.properties[i];'
      + '    s +='
      + '        "[" + p.id + "] "'
      + '      + p.name'
      + '      + " : " + p.type'
      + '      + " = "'
      + '      + (p.type == "string" ? "\\"" : "")'
      + '      + p.value'
      + '      + (p.type == "string" ? "\\"" : "")'
      + '      + "\\n";'
      + '  }'
      + '} catch (e) {'
      + '  s = e;'
      + '}');
    onerror = null;
    return s;
  }

  this.forObject(sObject, sName, bCalledFromProperty);
}

var sDefaultInspectorPath = debug.path + "ObjectInspector/obj-insp.html";
var sNoObj = "[Not an object]";
var CH_NBSP = unescape("%A0");

function getObjInfo(
  /** @argument string|Object          */ sObject,
  /** @argument optional string|RegExp */ aWhat,
  /** @argument optional string        */ sStyle,
  /** @argument optional string        */ sHeader,
  /** @argument optional string        */ sFooter,
  /** @argument optional string        */ sInspectorPath)
{
  var aObject, tc;
  
  // alert("1: " + sObject + "[" + typeof sObject + "]");
  if (sObject)
  {
    // alert("2: " + sObject + "[" + typeof sObject + "]");
    if (typeof sObject == "string")
    {
      tc = false;
      onerror = dummyError;
      eval(
          'try {'
        + '  tc = true;'
        + '  try {'
        + '    var aObject = eval(sObject);'
          // alert("3: " + sObject + "[" + typeof sObject + "]");
        + '  } catch (e) {'
        + '    sObject = "_global." + sObject;'
          // alert("4: " + sObject + "[" + typeof sObject + "]");
        + '    try {'
        + '      var aObject = eval(sObject);' // TODO
            // alert("5: " + sObject + "[" + typeof sObject + "]");
        + '    } catch (e) {'
            // alert("6: " + "[Not an object]");
        + '      return (sNoObj);'
        + '    }'
        + '  }'
        + '}');
      onerror = null;
      if (! tc)  
      {
        aObject = eval(sObject);
        // alert("7: " + "[Not an object]");
      }
    }
    else
    {
      aObject = sObject;
      // alert("8: " + aObject);
    }
  }
  else
  {
    // alert("9: " + "[Not an object]");
    return (sNoObj);
  }
  if (!aWhat)
    aWhat = ""; // v1.29.2002.10b3 bugfix
  var bShowProps =
    (aWhat && (!aWhat.test && aWhat.toUpperCase().indexOf("P") > -1));
  var bShowMethods =
    (aWhat && (!aWhat.test && aWhat.toUpperCase().indexOf("M") > -1));
  var bShowObjects =
    (aWhat && (!aWhat.test && aWhat.toUpperCase().indexOf("O") > -1));
  var bTextLineStyle = (sStyle && (sStyle.toUpperCase().indexOf("L") > -1));
  var bFormatAsLines = (sStyle && (sStyle.toUpperCase().indexOf("H") > -1));
  var bFormatAsTable = (sStyle && (sStyle.toUpperCase().indexOf("T") > -1));
  var bShowType = (sStyle && (sStyle.toUpperCase().indexOf("S") > -1));
  var bFormatAsHTML = (bFormatAsLines || bFormatAsTable);

  if (sHeader && (sHeader == "-"))
    sHeader = "";
  else if (!sHeader || (sHeader == ""))
  {
    sHeader = "";
    if (bShowObjects || bShowProps || bShowMethods)
    {
      if (bShowProps)
        sHeader = "Properties";
      else if (bShowObjects)
        sHeader = "Composed Objects";
      if (bShowMethods)
      {
        if (bShowObjects || bShowProps)
          sHeader += " and ";
        sHeader += "Methods";
      }
    }
    else
      sHeader = "Attributes";
    sHeader += " of "
      + (bFormatAsHTML ? '<code>': '')
      + sObject
      + (aWhat.test ? ' matching '+String(aWhat) : '')
      + (bFormatAsHTML ? '<\/code>': '');
  }
  var sAttr =
    (bFormatAsTable
      ? '<table border="1" cellpadding="5" cellspacing="0">\n'
      : '')
    + (sHeader != ""
        ? (bFormatAsTable
            ? '<tr><th align="left" colspan="' + (bShowType ? 3 : 2) + '">'
            : '')
            + sHeader
            + (bFormatAsHTML && bFormatAsLines
                ? "<br>\n"
                : (!bFormatAsHTML
                    ? "\n__________________________________________________\n"
                    : ""))
            + (bFormatAsTable
                ? ('<\/th><\/tr>\n<tr><th align="left">Name<\/th> '
                    + (bShowType
                        ? '<th align="left">Type<\/th>'
                        : '')
                     + '<th align="left">Value<\/th><\/tr>\n')
                : '')
        : "");
  var bCondition = false;
  var aAttributes = new Array();
  for (var Attribute in aObject)
  {
    if (typeof aWhat.test == "undefined" || aWhat.test(Attribute))
      aAttributes[aAttributes.length] = Attribute;
  }
  if (aAttributes.sort) // sort attributes lexically
    aAttributes.sort();
  
  var isError;
  var attrValue;
  var bMethod;
  var bProperty;
  var attrType;
  var bObject;
  var s;
  var attrName;
  var sAttrName;
  for (var i = 0; i < aAttributes.length; i++)
  {
    bCondition = false;
    isError = false;

    tc = false;
    onerror = dummyError;
    eval(
        'try {'
      + '  tc = true;'
      + '  if (aObject[aAttributes[i]])'
      + '    attrValue = aObject[aAttributes[i]];'
      + '  else'
      + '    attrValue = eval("aObject." + aAttributes[i]);'
      + '  bMethod ='
      + '    (typeof attrValue == "function" || typeof attrValue == "object");'
      + '} catch (e) {'
      + '  attrValue = "[" + e + "]";'
      + '  bMethod = false;'
      + '  isError = true;'
      + '}');
    onerror = null;
    if (! tc)
    {
      if (aObject[aAttributes[i]])
        attrValue = aObject[aAttributes[i]];
      else
        attrValue = eval("aObject." + aAttributes[i]);
      bMethod = (String(attrValue).toLowerCase().indexOf("function ") > -1);
    }
    
    bProperty = !bMethod;
    attrType = typeof attrValue;
    bObject = (attrType == "object");
    if (aWhat && (aWhat != "") && (!aWhat.test))
      bCondition =
        (bProperty && bShowProps)
          || (bMethod && bShowMethods)
          || (bObject && bShowObjects);
    else
      bCondition = true;
    if (bCondition)
    {
      s =
        ((isNaN(attrValue) || String(attrValue) == "") && !bObject && !isError)
          ? '"'
          : '';

      attrName = String(aAttributes[i]);
      sAttrName = attrName;
      if (bFormatAsHTML)
      {
        sAttrName = "<code><b>" + attrName + "<\/b><\/code>";
        attrValue =
          replaceText(replaceText(String(attrValue), "<", "&lt;"), ">", "&gt;");
      }
      sAttr
        += (bFormatAsTable ? '<tr valign="top"><td> ' : '')
             + ((bObject && bFormatAsHTML)
                 ?   '<a href="javascript:void(ObjectInspector(\''
                   + sObject
                   + '\'))">'
                 : '')
             + sAttrName
             + (bObject && bFormatAsHTML ? '<\/a>': '')
             + (bFormatAsTable ? '<\/td>': "")
             + (bShowType
                 ? (bFormatAsTable
                     ? ('<td><code>'+attrType + '<\/code><\/td>')
                     : (CH_NBSP + ":" + CH_NBSP + attrType))
                 : "")
             + (bFormatAsTable
                 ? '<\/td><td><code>'
                 : (CH_NBSP + "=" + CH_NBSP))
             + s
             + attrValue
             + s;
// ("<a href='javascript:ObjectInspector(\'' + sObject + '[\"' + attrName + '\"]\'', \'' + aWhat + '\', \'' + sStyle +'\');"'
//   + ' !onclick="window.open(\''
//   + (sInspectorPath ? escape(sInspectorPath) : sDefaultInspectorPath)
//   + '?obj='  + escape(sObject) + "." + escape(attrName)
//   + '&what=' + escape(aWhat)
//   + '&style=' + escape(sStyle)
//   + '\', \'wndObjectInspector\', \'scrollbars=yes,resizable=yes\'); return false;"'
      if (bFormatAsHTML)
      {
        if (bFormatAsTable)
          sAttr += "<\/code><\/td><\/tr>\n";
        else
          sAttr += "<br>\n";
      }
      else if (bTextLineStyle)
        sAttr += "; ";
      else
        sAttr += "\n";
    }
  }

  switch (String(sFooter))
  {
    case "-":
      sFooter = "";
      break;
    case "undefined":
    case "":
    case "null":
      if (bFormatAsHTML)
        sFooter =
          '<code><a href="' + debug.docURL + '" target="_blank"'
          + ' title="Show documentation for JSX:objinfo.js."'
          + '>JSX:objinfo.js<\/a>:<a href="' + debug.docURL + '#getObjInfo"'
          + ' target="_blank"'
          + ' title="Show documentation for JSX:debug.js:getObjInfo(...)"'
          + '>getObjInfo<\/a>(...)<\/code><br>';
      else
        sFooter = "JSX:debug.js:getObjInfo(...)\n";
      sFooter += "Library version " + debug.version;
      sFooter += (bFormatAsHTML ? "<br>" : "\n");
      sFooter += debug.copyright
        + (bFormatAsHTML ? "&nbsp;&nbsp;" : "  ")
        + debug.author
        + " ";
      if (bFormatAsHTML)
      {
        sFooter = replaceText(sFooter, "\xA9", "&copy;");
        sFooter +=
          '&lt;<a href="mailto:' + debug.email
            + '%20%28Thomas%20\'PointedEars\'%20Lahn%20%29"'
            + ' title="E-mail the author of this fabulous script ;-)'
            + ' E-mail client required.">' + debug.email + '<\/a>&gt;';
      }
      else
        sFooter += "<" + debug.email + ">"
  }

  if (sFooter != "")
  {
    sAttr
      += (bFormatAsHTML
           ? (bFormatAsTable
               ? '<tr>\n<td colspan="'+ (bShowType ? 3 : 2) + '">'
               : '')
           : "\n__________________________________________________\n")
        + sFooter
        + (bFormatAsHTML
            ? (bFormatAsTable
                ? '<\/td>\n<\/tr>\n'
                : '<br>')
            : "");
  }

  if (bFormatAsTable)
    sAttr += '<\/table>';
  
  return sAttr;
}