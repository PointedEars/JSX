/**
 * <title>Debug Library<title>
 *
 * @filename debug.js
 * @requires types.js, array.js (for #Properties)
 * @partof   PointedEars' JavaScript Extensions (JSX)
 *
 * @section Copyright & Disclaimer
 * 
 * @author
 *   (C) 2001-2006  Thomas Lahn &lt;debug.js@PointedEars.de&gt;
 */
function Debug()
{
  this.version   = /** @version */ "0.99.6.2006041415";
  this.copyright = "Copyright \xA9 1999-2006";
  this.author    = "Thomas Lahn";
  this.email     = "debug.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/test/";
  this.docURL    = this.path + "../debug.htm";
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

// reference to the global object
var sGlobal = "_global";
this[sGlobal] = this;

// global undefined value (for implementations without it)
var undefined = _global.undefined;

/** @section Exceptions */

/**
 * @param Msg : string 
 */ 
function DebugException(Msg)
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

/**
 * Returns evaluation statistics.
 * 
 * @param expr : string|Array
 *   Expression or array of expressions to be evaluated.
 * @param bPrintResult : optional boolean = false 
 *   If <code>true</code>, the method returns a printable result.
 * @param loops : optional number = 1 
 *   Specifies the number of times the expression should be evaluated.
 * @param repeats : optional number = 1
 *   Specifies the number of times the evaluation loop(s) of the expression
 *   should be repeated.  If greater than 1, the method also returns the
 *   minimum, maximum and average of the evaluation time.
 * @return Array|string
 *   An array containing the number of milliseconds the evaluation of the
 *   expression(s) took if bPrintResult is <code>false</code>;
 *   a human-readable table string to indicate the test results otherwise.
 * @requires types#isArray()
 */
function time(expr, bPrintResult, loops, repeats)
{
  if (!isArray(expr))
  {
    expr = [expr];
  }

  if (!loops || loops < 1)
  {
    loops = 1;
  }

  if (!repeats || repeats < 1)
  {
    repeats = 1;
  }

  var
    result = ["Expressions:\n\n"],
    stats = [];

  for (var i = 0, cnt = expr.length; i < cnt; i++)  // loop through expressions
  {
    var cur_expr = expr[i];
    if (bPrintResult)
    {
      result.push("[", i + 1, "] ", cur_expr, "\n");
    }
    var repeat_stats = stats[i] = []; // reset stats for this expression
    for (var j = 0; j < repeats; j++)  // repeat loops
    {
      repeat_stats[j] = -1; // reset stats for this repeat
      var eval_loop_start = new Date();
      for (var k = 0; k < loops; k++)  // repeat evaluation
      {
        setErrorHandler();
        eval(["try {", expr[i], "} catch (e) {}"].join(""));
        clearErrorHandler();
      }
      var eval_loop_stop = new Date();
      repeat_stats[j] = eval_loop_stop.getTime() - eval_loop_start.getTime();
    }
  }

  if (bPrintResult)
  {
    result.push(
      "\nEvaluation Results (ms):\n\n\\",
      pad("n|", cnt.toString().length - 1));
    
    var col_width = Math.max(repeats, stats).toString().length + 1;
    
    for (j = 0; j < repeats; j++)
    {
      result.push(format("%*2$d", j + 1, col_width));
    }
  
    result.push(
      format("\xA0%*4$s\xA0%*4$s\xA0%*4$s\n", "min", "max", "avg", col_width),
      format("%*2$d\\|", "e", expr_width),
      strRepeat("_", col_width * repeats),
      "\n");

    var expr_width = (cnt + 1).toString().length;
  
    for (i = 0; i < cnt; i++)  // loop through expressions
    {
      result.push(format("%*2$d|", i + 1, expr_width < 2 ? 2 : expr_width));

      for (j = 0; j < repeats; j++)
      {
        result.push(format("%*2$d", stats[i][j], col_width));
      }

      result.push(
        format(
          "\xA0%*4$s\xA0%*4$s\xA0%*4$s\n",
          Math.min(stats[i]),
          Math.max(stats[i]),
          Math.avg(stats[i]).toFixed(1),
          col_width));
    }
    
    result = result.join("");
  }
  else
  {
    result = stats;
  }
  
  return result;
}

/**
 * @param e : Error 
 * @return type string
 */ 
function getError(e)
{
  var sError = e;

  if (typeof e.name != "undefined")
  {
    sError += "\nName: " + e.name;
  }
  
  if (typeof e.number != "undefined")
  {
    sError += "\nCode: " + e.number;
  }
  
  if (typeof e.message != "undefined")
  {
    sError += "\nMessage: " + e.message;
  }
  
  if (typeof e.description != "undefined")
  {
    sError += "\nDescription: " + e.description;
  }
  
  if (typeof e.fileName != "undefined")
  {
    sError += "\nFilename: " + e.fileName;
  }

  setErrorHandler();
  eval(new Array(
      'try {',
      '  if (e.lineNumber) {',
      '    sError += "\\nLine: " + e.lineNumber;',
      '  }',
      '} catch (e2) {',
      '  sError += "\\nLine: " + e2;',
      '}').join("\n"));
  clearErrorHandler();
        
  if (typeof e.stack != "undefined")
  {
    sError += "\nStack:\n" + e.stack;
  }

  return sError;
}

/** 
 * Print to FireBug console.
 * Courtesy of Joe Hewitt, extension creator.
 * <URL:http://www.joehewitt.com/software/firebug/>
 * 
 * @argument _
 */
function printfire()
{
  if (typeof document.createEvent == "function"
      && typeof dispatchEvent == "function")
  {
    printfire.args = arguments;
    var ev = document.createEvent("Events");
    if (ev)
    {
      ev.initEvent("printfire", false, true);
      dispatchEvent(ev);
    }
  }
}

/**
 * Returns the type of a reference and, if possible, of its object properties
 * (nested only one level deep), and optionally displays that in an alert()
 * box.
 * 
 * @param a
 *   Value to be displayed along with its type.  If a string or an array of
 *   strings and bDontEval is not provided or false, each string is evaluated
 *   using eval() and that value is used.
 * @param bAlert : boolean
 *   If <code>true</code>, uses alert() to display the value(s).
 * @param bDontEval : boolean
 *   If <code>true</code>, does not evaluate arguments but uses their value.
 * @requires types#isArray()
 */
function alertValue(a, bDontAlert, bDontEval)
{
  if (!isArray(a))
  {
    a = [a];
  }

  for (var as = [], i = 0, len = a.length; i < len; i++)
  {
    var
      o = !bDontEval ? eval(a[i]) : a[i],
      t = typeof o,
      delim = (t == "string" ? '"' : ''),
      s = [delim, a[i], delim, " : ", t, " = ", delim, o, delim].join("");

    if (t == "object" || t == "function")
    {
      for (var j in o)
      {
        t = typeof o[j];
        delim = (t == "string" ? '"' : '');
        s += [
          "\n", a[i], '["', j, '"] : ', t, " = ",
          delim + o[j], delim
        ].join("");
      }
    }

    as.push(s);
  }

  var result = as.join("\n");

  if (!bDontAlert)
  {
    window.alert(result);
  }
  
  return result;
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
    {
      resizeToHelp();
    }
  
    if (a[1] && !isNaN(a[1]))
    {
      void (window.innerHeight=parseInt(a[0]));
    }
    else
    {
      resizeToHelp();
    }
  }
  else
  {
    resizeToHelp();
  }
 
 */
/**
 * @param : string
 */
function beautify(s)
{
  return s
    .replace(/(\s*\{\s*)/g, "\n$1\n  ")
    .replace(/(\s*\}([^,;])\s*)/g, "\n$1\n")
    .replace(/,([^\s])/g, ", $1")
    .replace(/([^}]?;\s*)/g, "$1\n");
}

//alert(beautify('javascript:function resizeToHelp() { alert("Usage: resizeTo clientWidth [clientHeight]"); } if ("%s".length > 0) { var a = "%s".split(" "); if (a[0] && !isNaN(a[0])) { void (window.innerWidth=parseInt(a[0])); if (a[1] && !isNaN(a[1])) { void (window.innerHeight=parseInt(a[1])); } else resizeToHelp(); } else resizeToHelp(); } else resizeToHelp();'));

/**
 * @param : string
 */ 
function uglyfy(s)
{
  return s.replace(/\s/g, " ") // .replace
}

/**
 * Applies syntax highlighting on contents of <code>code</code>
 * elements unless their <code>class</code> attribute has the
 * value "donthl".  Requires support for the (currently
 * proprietary) <code>innerHTML</code> property of element
 * objects.
 */
function synhl()
{
  var collCode;
  if (isMethodType(typeof document.getElementsByTagName)
      && document.getElementsByTagName
      && (collCode = document.getElementsByTagName('code'))
      && collCode.length)
  {
    var
      bUnicode = ("\uFFFF".length == 1),
      sElementType = [
          "[:A-Z_a-z\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF[UCS_START]]",
          "[:\\w.\\xB7[UCS_START][UCS_NAME]-]*"
        ].join("")
        .replace(
          /\[UCS_START\]/g,
          bUnicode
            ? ["\\u010-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF",
               "\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF",
               "\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD"
              ].join("")
            : "")
        .replace(
          /\[UCS_NAME\]/,
          bUnicode ? "\\u0300-\\u036F\\u203F\\u2040" : ""),
      sOptAttr = "(.|\r?\n|\r)*?",
      rxCode = new RegExp([
          "(//.*|/\\*(.|\\s)*?\\*/)",
          "|</?", sElementType, sOptAttr, ">",
          "|(&lt;/?script(.|\r?\n|\r)*?&gt;|^script$)",
          "|(&lt;/?", sElementType, sOptAttr, "&gt;)",
          "|('(\\\\'|[^'])*'|\"(\\\\\"|[^\"])*\")",
          "|(&#?[0-9A-Za-z]+;)",
          "|([\\{\\}]|\\b(else|for( +each)?|function|i[fn]|null",
            "|typeof|var)\\b)",
          "|\\b(Object|document|write)\\b",
          "|([.:\\[\\]\\(\\),;])",
          "|\\b(0x[0-9A-Fa-f]+|[0-9]+)\\b"
        ].join(""),
        "g"),
      fReplace =
        function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12,
          p13, p14, p15, p16, p17, offset, input)
        {
          if (p1)
          {
            match = '<span class="comm">' + match + '<\/span>';
          }
          else if (p4)
          {
            match = '<span class="scr">' + match + '<\/span>';
          }
          else if (p6)
          {
            match = '<span class="tag">' + match + '<\/span>';
          }
          else if (p8)
          {
            match = '<span class="str">' + match + '<\/span>';
          }
          else if (p11)
          {
            match = '<span class="entity">' + match + '<\/span>';
          }
          else if (p12)
          {
            match = '<span class="rswd">' + match + '<\/span>';
          }
          else if (p15)
          {
            match = '<span class="ident">' + match + '<\/span>';
          }
          else if (p16)
          {
            match = '<span class="punct">' + match + '<\/span>';
          }
          else if (p17)
          {
            match = '<span class="num">' + match + '<\/span>';
          }
          
          return match;
        };

    for (var i = collCode.length; i--;)
    {
      var o = collCode[i];
      if (o.className != "donthl" && typeof o.innerHTML != "undefined")
      {
        o.innerHTML = o.innerHTML.replace(rxCode, fReplace);
      }
    }
  }
}

/**
 * Stores references to objects in an array
 * to be used for the Property constructor.
 *
 * @param aOwners : optional [Object...]
 *   Array of the owner references to store.  The
 *   default is an array with <code>null</code> as
 *   sole element.
 * @property Array items
 */
function Owners(aOwners)
{
  this.items = aOwners || new Array(null);
}

/**
 * Retrieves type of the object or property specified by the
 * string <code>sName</code> and its value <code>sValue</code>
 * and stores that information in an object.  You may optionally
 * provide an identifier for the property with <code>iID</code>
 * and an array of references to the owner objects with
 * <code>aoOwners</code>.
 * 
 * If you provide the latter, the constructor function will
 * utilize <code>inArray()</code>, trying to determine if the
 * object/property references one of owners
 * (<code>referencesOwners</code>; <code>false</code> if
 * <code>aoOwners</code> is not provided) and how many properties
 * the object/property has itself (<code>hasProperties</code>;
 * <code>false</code> if <code>aoOwners</code> is not
 * provided or if detection fails.)  TODO: This is now
 * achieved through creating a new <code>ObjectInfo</code> object
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
 * <code>isInstanceOf()</code> method is required.
 *
 * @param sName: string 
 *   Name of the property.
 * @param sValue
 *   Value of the property.
 * @param iID: optional number
 *   (Unique) ID of the property.
 * @param aoOwners: optional Owners|Object 
 *   Reference to an Owners object storing references to the
 *   owner (object) of the property and its owners, where the
 *   last element references the direct owner.  Allows also
 *   for a reference to a non-Owners object to specify only
 *   the direct owner.
 * @param bNonEnum: optional boolean 
 *   <code>true</code> specifies that the property is
 *   non-enumerable.  Optional.  The default <code>false</code>
 *   determines the property to be enumerable.
 * @param bCalledFromObjectInfo: optional boolean 
 * @see
 *   types#isArray(), array#inArray()
 */
function Property(sName, sValue, iID, aoOwners, bNonEnum,
  bCalledFromObjectInfo)
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
  {
    this.owner = aoOwners.items[aoOwners.items.length - 1];
  }
  else
  {
    this.owner = aoOwners;
  }

  setErrorHandler();

  eval(new Array(
      'try { // for IE',
      '  if (typeof this.owner != "undefined"',
      '      && typeof this.owner[sName] != "undefined")',
      '  {',
      '    setErrorHandler();',
      '    if (isInstanceOf(this.owner, Owners)) {',
      '      this.referencesOwners =',
      '        inArray(this.owner[sName], aoOwners.items);',
      '    } else {',
      '      this.referencesOwner = (this.owner[sName] == this.owner);',
      '    }',
/*
      '  if (!bCalledFromObjectInfo)',
      '  {',
      '    var propertyInfo = new ObjectInfo(this.owner[sName], sName, false, true);',
      '    this.hasProperties = propertyInfo.hasProperties;',
      '  }',
*/
      '    try { // for IE',
      '      if (!(sName == "toString" // for IE6 SP-1',
      '            || (this.owner == location &&',
      '                inArray(sName, ["assign", "reload", "replace"]))))',
      '      {',
      '        for (var p in this.owner[sName]) {',
      '          this.propertyCount++;',
      '        }',
      '      }',
      '    } catch (e) {',

/*
      '    alert(sName + "\n"',
      '      + "for (var p in this.owner[sName])\n\n"',
      '      + getError(e));',
*/

      '      try { // for IE',
      '        this.propertyCount = this.owner[sName].length;',
      '      } catch (e) {',

/*
      '      alert(sName + "\n"',
      '        + "for (var j = 0; i < this.owner[sName].length; j++)"',
      '        + getError(e));',
*/

      '      }',
      '    }',
      '  }',
      '} catch (e) {',
      '}').join("\n"));

  clearErrorHandler();

  this.hasProperties = (this.propertyCount > 0);
}

/**
 * @param a: optional Array
 */
function PropertyArray(a)
{
/**
 * Note that the <code>properties</code> extended
 * <code>Array</code> object defines properties for
 * both sort order and sort direction which can be
 * recognized by their identifier's prefix.  These
 * are:
 */
  this.soNone       = -1; // default
  this.soByID       = this.soNone;
  this.soByName     = 0;
  this.soByType     = 1;
  this.soByValue    = 2;
  this.sdNone       = 0;
  this.sdAscending  = 1;
  this.sdDescending = -1;
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
  this.sortOrder    = this.soNone;
  this.sortDir      = this.sdNone;
  this.items        = a || new Array();
  this.length       =
    (typeof this.items.length == "number"
      ? this.items.length
      : 0);
}

/**
 * Adds the property to the property array.
 *
 * @type number|Property oProperty
 * @param : Property
 */ 
PropertyArray.prototype.push =
function propertyArray_push(oProperty)
{
  return this.items.push(oProperty);
}

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
PropertyArray.prototype.cmpSortByIdAsc =
  /** @type Comparator */ new Function("a", "b", "return a.id - b.id;");
PropertyArray.prototype.cmpSortByIdDesc =
  /** @type Comparator */ new Function("a", "b", "return b.id - a.id;");
PropertyArray.prototype.sortById =
function propertyArray_sortById(iDir)
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
/** @type Comparator */
function propertyArray_cmpSortByNameAsc(a, b)
{
  if (a && b)
  {
    if (a.name < b.name)
    {
      return -1;
    }
    else if (a.name > b.name)
    {
      return 1;
    }
  }
  
  return 0;
}

PropertyArray.prototype.cmpSortByNameDesc =
/** @type Comparator */ 
function propertyArray_cmpSortByNameDesc(a, b)
{
  if (a && b)
  {
    if (a.name > b.name)
    {
      return -1;
    }
    else if (a.name < b.name)
    {
      return 1;
    }
  }

  return 0;
}

PropertyArray.prototype.sortByName =
function propertyArray_sortByName(iDir)
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
/** @type Comparator */ 
function propertyArray_cmpSortByTypeAsc(a, b)
{
  if (a && b)
  {
    if (a.type < b.type)
    {
      return -1;
    }
    else if (a.type > b.type)
    {
      return 1;
    }
  }

  return 0;
}

PropertyArray.prototype.cmpSortByTypeDesc =
/** @type Comparator */
function propertyArray_cmpSortByTypeDesc(a, b)
{
  if (a && b)
  {
    if (a.type > b.type)
    {
      return -1;
    }
    else if (a.type < b.type)
    {
      return 1;
    }
  }

  return 0;
}

PropertyArray.prototype.sortByType =
function propertyArray_sortByType(iDir)
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
/** @type Comparator */ 
function propertyArray_cmpSortByValueAsc(a, b)
{
  if (a && b)
  {
    if (a.value < b.value)
    {
      return -1;
    }
    else if (a.value > b.value)
    {
      return 1;
    }
  }

  return 0;
}

PropertyArray.prototype.cmpSortByValueDesc =
/** @type Comparator */ 
function propertyArray_cmpSortByValueDesc(a, b)
{
  if (a && b)
  {
    if (a.value > b.value)
    {
      return -1;
    }
    else if (a.value < b.value)
    {
      return 1;
    }
  }

  return 0;
}
PropertyArray.prototype.sortByValue =
function propertyArray_sortByValue(iDir)
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

/**
 * `properties' also defines a general method for sorting
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
 * @param iSortOrder : optional number 
 *   Sort order.
 * @param iSortDir : optional number
 *   Sort direction.
 */
PropertyArray.prototype.sortBy =
function propertyArray_sortBy(iSortOrder, iSortDir)
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

/**
 * @param sName : string 
 * @param sValue : _ 
 * @param iID : optional number 
 * @param oOwner : optional Object 
 * @param bNonEnum : optional boolean
 * @param bCalledFromProperty : optional boolean
 */
PropertyArray.prototype.addProperty =
function propertyArray_addProperty(sName, sValue, iID, oOwner, bNonEnum,
  bCalledFromProperty)
{
  // avoid dupes
  if ((isMethodType(typeof this.items.hasOwnProperty)
      // IE does not allow reference shortcut here!
      && this.items.hasOwnProperty != null
      && !this.items.hasOwnProperty(sName)) 
         || (!isMethodType(typeof this.items.hasOwnProperty)
             && typeof this.items[sName] == "undefined"))
  {
    this.items[this.items.length] =
      new Property(
        sName,
        sValue,
        iID,
        oOwner,
        bNonEnum,
        bCalledFromProperty); // avoid infinite recursion

    // BUGFIX: Don't overwrite numeric properties
    var bMethod = isMethodType(typeof this.items.hasOwnProperty);
    if ((bMethod && !this.items.hasOwnProperty(sName))
        || (!bMethod && typeof this.items[sName] == "undefined"))
    {
      this.items[sName] = sValue; 
    }

    this.length = this.items.length;
  }
}

/**
 * @param rxPattern : RegExp 
 * @param asPropertyNames : [string] 
 * @param sType : optional string
 * @param fConstructor : optional Object
 */
function NonEnumProperties(rxPattern, asPropertyNames, sType, fConstructor)
{
  this.pattern      = rxPattern       || new RegExp("."); 
  this.names        = asPropertyNames || new Array();
  this.type         = sType           || "";
  this.fConstructor = fConstructor    || null;
}

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
 * @param sObject: string|Object 
 *   Reference to an object or property, or string to be evaluated
 *   to an object or a property.
 *   (TODO: Throws NotAnObjectException if not provided or cannot
 *   be evaluated.)
 * @param sName: optional string 
 *   Name of the object/property.
 *   If this argument is not provided, the value of the
 *   <code>name</code> property depends on <code>sObject</code>.
 *   If the latter is a reference, the default is `_odo', otherwise
 *   the default is the value of <code>sObject</code>.
 * @param bCalledFromProperty: optional boolean
 */
function ObjectInfo(sObject, sName, bCalledFromProperty)
{
  this.forObject(sObject, sName, bCalledFromProperty);
}

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
 * @param sObject: string|Object 
 *   See contract of this()
 * @param sName: optional string 
 *   See contract of this()
 * @param bCalledFromProperty: optional boolean 
 * @property name: string 
 * @property properties: PropertyArray 
 * @property target: object 
 * @property type: string 
 */
ObjectInfo.prototype.forObject =
function objectInfo_forObject(sObject, sName, bCalledFromProperty)
{
  this.name =
    (typeof sObject == "string"
      ? sObject
      : (sName ? sName : "_odo"));
                
  this.properties = new PropertyArray();

  if (typeof sObject == "string")
  {
    var tc = false;
    setErrorHandler();
    eval(new Array(
        'try {',
        '  tc = true;',
        '  this.target = eval(dotsToBrackets(sObject, true));',
        '} catch (e) {',
        '  try {',
        '    this.target = eval(dotsToBrackets(sObject));',
        '  } catch (e) {',
        '    try {',
        '      this.target = _global["' + sObject + '"];',
        '    } catch (e) {',
        '      this.target = null;',
        '    }',
        '  }',
        '}').join("\n"));
    _global.onerror = null;
    if (! tc)
    {
      this.target = null;
    }
  }
  else
  {
    this.target = sObject;
  }

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
      setErrorHandler();
      eval(new Array(
          'try {',
          '  ti = this.target[i];',
          '  t = this.target;',
          '} catch (e) {',
          '  ti = null;',
          '  t = null;',
          '}').join("\n"));
      clearErrorHandler();
        
      // avoid dupes
      this.properties.addProperty(
        i,                      // name
        ti,                     // value
        this.properties.length, // ID
        t,                      // owner reference
        bCalledFromProperty);   // avoid infinity recursion
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
         new RegExp("^\\w"), // any object
         ["NaN", "Infinity", "__proto__", "eval", "prototype", "toSource",
          "unwatch", "watch", "undefined", "constructor", "toString",
          "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf",
          "propertyIsEnumerable",
          "__defineGetter__", "__defineSetter__",
          "all"],
         'object',
         Object),
       new NonEnumProperties(
         new RegExp(sGlobal), // global object
         ["NaN", "Infinity", "length", "undefined",
          "parseInt", "parseFloat", "isNaN", "isFinite",
          "decodeURI", "decodeURIComponent", "encodeURI",
          "encodeURIComponent",
          "Object", "Function", "Array", "String", "Boolean",
          "Number", "Date", "RegExp", "Error", "EvalError",
          "RangeError", "ReferenceError", "SyntaxError",
          "TypeError", "URIError",
          "Math",
          "Components", "sidebar"]),
       new NonEnumProperties(
         new RegExp("(^|\\.)Array(\\.prototype)?$"),
         ["every", "filter", "forEach", "index", "indexOf", "input",
          "lastIndexOf", "length", "map", "concat", "join", "pop",
          "push", "reverse", "shift", "slice", "splice", "some",
          "sort", "unshift"],
         '',
         typeof Array != "undefined" ? Array : null),
       new NonEnumProperties(
         new RegExp("(^|\\.)Date(\\.prototype)?$"),
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
         new RegExp("(^|\\.)Function(\\.prototype)?$"),
         ["arguments", "arguments.callee", "arguments.caller",
          "arguments.length", "arity", "length", "apply", "call"],
         'function',
         typeof Function != "undefined" ? Function : null),
       new NonEnumProperties(
         new RegExp("(^|\\.)Math$"),
         ["E", "LN2", "LN10", "LOG2E", "LOG10E", "PI", "SQRT1_2", "SQRT2",
          "abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "exp",
          "floor", "log", "max", "min", "pow", "random", "round", "sin",
          "sqrt", "tan"]),
       new NonEnumProperties(
         new RegExp("(^|\\.)Number(\\.prototype)?$"),
         ["MAX_VALUE", "MIN_VALUE", "NaN", "NEGATIVE_INFINITY",
          "POSITIVE_INFINITY", "toExponential", "toFixed", "toPrecision"],
         'number',
         typeof Number != "undefined" ? Number : null),
       new NonEnumProperties(
         new RegExp("(^|\\.)RegExp(\\.prototype)?$"),
         ["global", "ignoreCase", "lastIndex", "multiline",
          "source", "exec", "test"],
         '',
         typeof RegExp != "undefined" ? RegExp : null),
       new NonEnumProperties(
           new RegExp("(^|\\.)String(\\.prototype)?$"),
       aStringProperties,
         'string',
         typeof String != "undefined" ? String : null),
       new NonEnumProperties(
         new RegExp("Error(\\.prototype)?$"),
         ["message", "name"]),
       new NonEnumProperties(
         new RegExp("(^|\\.)Packages(\\.prototype)?$"),
         ["className", "java", "netscape", "sun"]),
       new NonEnumProperties(
         new RegExp("(^|\\.)location$", "i"),
         ["assign", "hash", "host", "hostname", "href", "pathname",
          "port", "protocol", "reload", "replace", "search"]
          .concat(aStringProperties)),
       new NonEnumProperties(
         new RegExp("(^|\\.)history$"),
         ['current', 'length', 'next', 'previous',
          'back', 'forward', 'go']),
         new NonEnumProperties(
         new RegExp("(^|\\.)screen$"),
         ["availHeight", "availLeft", "availTop", "availWidth", "colorDepth",
         "height", "left", "pixelDepth", "top", "width"]),
       // LiveConnect -- Java System Library classes as of version 1.4.2_03
       new NonEnumProperties(
         new RegExp("(^|\\.)java$"),
           ["awt", "beans", "io", "lang", "math", "net", "nio", "rmi",
            "security", "sql", "text", "util"]),
       new NonEnumProperties(
         new RegExp("(^|\\.)java\\.awt$"),
         ["color", "datatransfer", "dnd", "event", "font", "geom", "im",
          "image", "peer", "print",
          "ActiveEvent", "Adjustable", "AlphaComposite", "AttributeValue",
          "AWTError", "AWTEvent", "AWTEventMulticaster", "AWTException",
          "AWTKeyStroke", "AWTPermission", "BasicStroke", "BorderLayout",
          "Frame"]),
       new NonEnumProperties(
         new RegExp("(^|\\.)java\\.lang$"),
         ["System"]),
       new NonEnumProperties(
         new RegExp("^StyleSheet(\\.prototype)?$"),
         ["type", "disabled", "ownerNode", "parentStyleSheet", "href",
          "title", "media"],
         '',
         typeof StyleSheet != "undefined" ? StyleSheet : null),
       new NonEnumProperties(
         new RegExp("(^|\\.)StyleSheetList(\\.prototype)?$"),
         ["length", "item"],
         '',
         typeof StyleSheetList != "undefined" ? StyleSheetList : null),
       new NonEnumProperties(
         new RegExp("(^|\\.)LinkStyle(\\.prototype)?$"),
         ["sheet"],
         '',
         typeof LinkStyle != "undefined" ? LinkStyle : null),
       new NonEnumProperties(
         new RegExp("(^|\\.)DocumentStyle(\\.prototype)?$"),
         ["styleSheets"],
         '',
         typeof DocumentStyle != "undefined" ? DocumentStyle : null)
     ];
          
    for (i = aNonEnumProperties.length; i--; 0)
    {
      var j = aNonEnumProperties[i];
      if (j.pattern.test(this.name)
          || typeof this.target == j.type
          || (typeof this.target.constructor != "undefined"
              && this.target.constructor == j.fConstructor))
      {
        for (var k = j.names.length; k--; 0)
        {
          var p = undefined;
          eval(new Array(
            'try {',
            '  if (typeof this.target[j.names[k]] != "undefined") {',
            '    p = this.target[j.names[k]];',
            '  }',
            '} catch (e) {',
            '}').join("\n"));
                       
          // see object.js
          if (this.target._hasOwnProperty(j.names[k]))
          {
            this.hasNonEnumProperties = true;
            
            ti = "";
            t = null;
            setErrorHandler();
            eval(new Array(
              'try {',
              '  ti = p;',
              '  t = this.target;',
              '} catch (e) {',
              '  ti = null;',
              '  t = null;',
              '}').join("\n"));
            clearErrorHandler();

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

/**
 * @param rxName : optional RegExp = .*
 * @param rxType : optional string = //
 * @param bInvert : optional boolean = false
 * @param aValue : optional _ = undefined
 * @return type PropertyArray
 *   An array with the data of all properties that
 *   match the passed conditions as elements.
 */    
ObjectInfo.prototype.getProperties =
function objectInfo_getProperties(rxName, rxType, bInvert, aValue)
{
  if (typeof rxType == "string")
  {
    rxType = new RegExp(rxType, "i");
  }
  
  if (typeof rxName != "object" || !rxName.test)
  {
    rxName = new RegExp(rxName);
  }
  
  if (!rxName.test)
  {
    rxName = null;
  }

  var a = new PropertyArray();
    
  for (var i = 0, len = this.properties.length; i < len; i++)
  {
    var p = this.properties.items[i];
    
    var b = ((rxName && rxName.test(p.name)) || !rxName)
             && ((rxType && rxType.test(p.type.toLowerCase()))
                 || !rxType)
             && ((arguments.length >= 4 && aValue == p.value)
                 || arguments.length < 4);

    if (bInvert)
    {
      b = !b;
    }
    
    if (b)
    {
      a.addProperty(p.name, p.value, p.id, p.owner, !p.enumerable);
    }
  }
  
  return a;
}

ObjectInfo.prototype.toString = function objectInfo_toString()
{
  var s = "";
  setErrorHandler();
  eval(new Array(
      'try {',
      '  for (var i = 0; i < this.properties.length; i++) {',
      '    var p = this.properties[i];',
      '    s += new Array(',
      '        "[" + p.id + "] ",',
      '        p.name,',
      '        " : " + p.type,',
      '        " = ",',
      '        (p.type == "string" ? "\\"" : ""),',
      '        p.value,',
      '        (p.type == "string" ? "\\"" : ""),',
      '        "\\n").join("");',
      '  }',
      '} catch (e) {',
      '  s = e;',
      '}').join("\n"));
  clearErrorHandler();

  return s;
}

var sDefaultInspectorPath = debug.path + "ObjectInspector/obj-insp.html";
var sNoObj = "[Not an object]";
var CH_NBSP = unescape("%A0");

/**
 * @param sObject : string|Object 
 * @param aWhat : optional string|RegExp 
 * @param sStyle : optional string 
 * @param sHeader : optional string 
 * @param sFooter : optional string 
 * @param sInspectorPath : optional string 
 */
function getObjInfo(sObject, aWhat, sStyle, sHeader, sFooter, sInspectorPath)
{
  var o, tc;
  
  // alert("1: " + sObject + "[" + typeof sObject + "]");
  if (sObject)
  {
    // alert("2: " + sObject + "[" + typeof sObject + "]");
    if (typeof sObject == "string")
    {
      tc = false;
      setErrorHandler();
      eval(new Array(
          'try {',
          '  tc = true;',
          '  try {',
          '    var o = eval(sObject);',
          // alert("3: " + sObject + "[" + typeof sObject + "]");
          '  } catch (e) {',
          '    sObject = "_global." + sObject;',
          // alert("4: " + sObject + "[" + typeof sObject + "]");
          '    try {',
          '      var o = eval(sObject);', // TODO
            // alert("5: " + sObject + "[" + typeof sObject + "]");
          '    } catch (e) {',
            // alert("6: " + "[Not an object]");
          '      return (sNoObj);',
          '    }',
          '  }',
        + '}').join("\n"));
      clearErrorHandler();
      if (! tc)  
      {
        o = eval(sObject);
        // alert("7: " + "[Not an object]");
      }
    }
    else
    {
      o = sObject;
      // alert("8: " + o);
    }
  }
  else
  {
    // alert("9: " + "[Not an object]");
    return (sNoObj);
  }

  if (!aWhat)
  {
    aWhat = ""; // v1.29.2002.10b3 bugfix
  }
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
  var bShowConstructor = (sStyle && (sStyle.toUpperCase().indexOf("C") > -1));
  var bFormatAsHTML = (bFormatAsLines || bFormatAsTable);

  if (sHeader && (sHeader == "-"))
  {
    sHeader = "";
  }
  else if (!sHeader || (sHeader == ""))
  {
    sHeader = "";
    if (bShowObjects || bShowProps || bShowMethods)
    {
      if (bShowProps)
      {
        sHeader = "Properties";
      }
      else if (bShowObjects)
      {
        sHeader = "Composed Objects";
      }
      
      if (bShowMethods)
      {
        if (bShowObjects || bShowProps)
        {
          sHeader += " and ";
        }
        sHeader += "Methods";
      }
    }
    else
    {
      sHeader = "Attributes";
    }
      
    sHeader += " of "
      + (bFormatAsHTML ? '<code>': '')
      + sObject
      + (typeof aWhat.test != "undefined"
          ? ' matching ' + String(aWhat)
          : '')
      + (bFormatAsHTML ? '<\/code>': '');
  }
  var sProp =
    (bFormatAsTable
      ? '<table border="1" cellpadding="5" cellspacing="0">\n'
      : '')
    + (sHeader != ""
      ? (bFormatAsTable
        ? '<tr><th align="left" colspan="'
        + (2 + +(bShowType) + +(bShowConstructor)) + '">'
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
              + (bShowConstructor
                  ? '<th align="left">Constructor<\/th>'
                  : '')
               + '<th align="left">Value<\/th><\/tr>\n')
          : '')
      : "");
  var bCondition = false;
  var aProperties = new Array();
  var t;
  
  for (var property in o)
  {
    if ((aWhat.constructor == RegExp
        && ((t = typeof aWhat.test) == "function" || t == "object")
        && aWhat.test(property)) || true)
    {
      aProperties[aProperties.length] = property;
    }
  }

  // sort properties lexically
  if (isMethodType(typeof aProperties.sort))
  {
    aProperties.sort();
  }
  
  var isError;
  var propValue;
  var bMethod;
  var bProperty;
  var propType;
  var bObject;
  var s;
  var propName;
  var sPropName;
  for (var i = 0; i < aProperties.length; i++)
  {
    bCondition = false;
    isError = false;

    tc = false;
    setErrorHandler();
    eval(new Array(
        'try {',
        '  tc = true;',
        '  if (o[aProperties[i]])',
        '    propValue = o[aProperties[i]];',
        '  else',
        '    propValue = eval("o." + aProperties[i]);',
        '  bMethod =',
        '    ((t = typeof propValue) == "function" || t == "object");',
        '} catch (e) {',
        '  propValue = "[" + e + "]";',
        '  bMethod = false;',
        '  isError = true;',
        '}').join("\n"));
    clearErrorHandler();
    if (! tc)
    {
      if (o[aProperties[i]])
      {
        propValue = o[aProperties[i]];
      }
      else
      {
        propValue = eval("o." + aProperties[i]);
      }
      bMethod = (String(propValue).toLowerCase().indexOf("function ") > -1);
    }
    
    bProperty = !bMethod;
    propType = typeof propValue;
    var propConstructor =
      (typeof propValue != "undefined"
       && propValue != null
       && propValue.constructor != "undefined")
      ? propValue.constructor.toString().replace(/function\s+/, "")
        .replace(/\s*\((.|[\r\n])*/, "")
      : "";
    bObject = (propType == "object");
    if (aWhat && (aWhat != "") && (!aWhat.test))
    {
      bCondition =
        (bProperty && bShowProps)
          || (bMethod && bShowMethods)
          || (bObject && bShowObjects);
    }
    else
    {
      bCondition = true;
    }
    
    if (bCondition)
    {
      s =
        ((isNaN(propValue) || String(propValue) == "") && !bObject && !isError)
        ? '"'
        : '';

      propName = String(aProperties[i]);
      sPropName = propName;
      if (bFormatAsHTML)
      {
        sPropName = "<code><b>" + propName + "<\/b><\/code>";
        propValue =
          replaceText(replaceText(String(propValue), "<", "&lt;"), ">", "&gt;");
      }
      sProp
        += (bFormatAsTable ? '<tr valign="top"><td> ' : '')
             + ((bObject && bFormatAsHTML)
               ?   '<a href="javascript:void(ObjectInspector(\''
                 + sObject
                 + '\'))">'
               : '')
             + sPropName
             + (bObject && bFormatAsHTML ? '<\/a>': '')
             + (bFormatAsTable ? '<\/td>': "")
             + (bShowType
               ? bFormatAsTable
                 ? '<td><code>'+propType + '<\/code><\/td>'
                 : CH_NBSP + ":" + CH_NBSP + propType
               : "")
             + (bShowConstructor
               ? (bFormatAsTable
                 ? '<td><code>'+propConstructor + '<\/code><\/td>'
                 : "[" + propConstructor + "]")
               : "")
             + (bFormatAsTable
               ? '<td><code>'
               : CH_NBSP + "=" + CH_NBSP)
             + s
             + propValue
             + s;
// ("<a href='javascript:ObjectInspector(\'' + sObject + '[\"' + propName + '\"]\'', \'' + aWhat + '\', \'' + sStyle +'\');"'
//   + ' !onclick="window.open(\''
//   + (sInspectorPath ? escape(sInspectorPath) : sDefaultInspectorPath)
//   + '?obj='  + escape(sObject) + "." + escape(propName)
//   + '&what=' + escape(aWhat)
//   + '&style=' + escape(sStyle)
//   + '\', \'wndObjectInspector\', \'scrollbars=yes,resizable=yes\'); return false;"'
      if (bFormatAsHTML)
      {
        if (bFormatAsTable)
        {
          sProp += "<\/code><\/td><\/tr>\n";
        }
        else
        {
          sProp += "<br>\n";
        }
      }
      else if (bTextLineStyle)
      {
        sProp += "; ";
      }
      else
      {
        sProp += "\n";
      }
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
      {
        sFooter =
          '<code><a href="' + debug.docURL + '" target="_blank"'
          + ' title="Show documentation for JSX:objinfo.js."'
          + '>JSX:objinfo.js<\/a>:<a href="' + debug.docURL + '#getObjInfo"'
          + ' target="_blank"'
          + ' title="Show documentation for JSX:debug.js:getObjInfo(...)"'
          + '>getObjInfo<\/a>(...)<\/code><br>';
      }
      else
      {
        sFooter = "JSX:debug.js:getObjInfo(...)\n";
      }
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
    sProp
      += (bFormatAsHTML
         ? bFormatAsTable
           ? '<tr>\n<td colspan="'+ (2 + +(bShowType) + +(bShowConstructor))
             + '">'
           : ''
         : "\n__________________________________________________\n")
       + sFooter
       + (bFormatAsHTML
         ? bFormatAsTable
           ? '<\/td>\n<\/tr>\n'
           : '<br>'
         : "");
  }

  if (bFormatAsTable)
  {
    sProp += '<\/table>';
  }
  
  return sProp;
}
