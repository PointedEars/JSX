/**
 * <title>PointedEars' JSX: Search-String Library</title>
 *
 * @file search.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @requires types.js
 *
 * @author Copyright (c) 2000-2004
 *         Thomas Lahn &lt;search.js@PointedEars.de&gt;
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
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
 
// Refer search.htm file for general documentation.

/**
 * Definition of the SearchString prototype which uses the functions
 * above with names beginning with the prototype name, as methods.
 * 
 * @param s : string
 */
function SearchString(s)
{
  this.version = "1.10.2006082411";
  this.copyright = "Copyright \xA9 2000-2006";
  this.author    = "Thomas Lahn";
  this.email     = "search.js@PointedEars.de";
  this.path      = "http://pointedears.de.vu/scripts/";
  this.URI       = this.path + "search.js";

  if (typeof s != "string")
  {
    if (typeof location != "undefined"
        && typeof location.search != "undefined")
    {
      s = location.search;
    }
    else
    {
      return;
    }
  }
    
  s = s.substring(s.lastIndexOf("?") + 1);
  this.text = s;

  // Determine method to be used for decoding URI components
  var decode =
    (jsx.object.isMethodType(typeof decodeURIComponent)
      ? decodeURIComponent
      : (jsx.object.isMethodType(typeof unescape)
          ? unescape
          : dummy));
 
  /*
   * For Mozilla/NS: Replace occurrences of "&nbsp;" with
   * character "%A0"; requires linked string.js
   */
  this.text = replaceText(this.text, "&nbsp;", "%A0");
  
  this.length = s.length;

  var i;

  for (i = 0; i < this.length; i++)
  {
    this[i] = s.charAt(i);
  }
  
  this.values = new Object();
  
  if (this.length > 0)
  {
    var value_pair, sName, sValue;

    if (isMethodType(typeof this.text.split))
    {
      var value_pairs = this.text.split(new RegExp("[&;]")), len;
      for (i = 0, len = value_pairs.length; i < len; i++)
      {
        var p = value_pairs[i];
        value_pair = p.split("=");
        sName = decode(value_pair[0]);
        sValue = (value_pair.length > 1
            ? value_pair[1]
            : (sName = "", value_pair[0]));

        addValue(this.values, sName, decode(sValue))
      }
    }
    else
    {
      for (i = 0; i < this.length;)
      {
        var idxAmp = this.text.substring(i).indexOf("&");
        // Required by law
        (idxAmp < 0) ? (idxAmp = this.length) : (idxAmp += i);
        
        value_pair = this.text.substring(i, idxAmp);
        var idxEquals = value_pair.indexOf("=");
        sName = "";

        if (idxEquals < 0)
        {
          sValue = value_pair;
        }
        else
        {
          sName = value_pair.substring(0, idxEquals);
          sValue = value_pair.substring(idxEquals + 1);
        }
        
        addValue(this.values, decode(sName), decode(sValue));
        
        i += value_pair.length + 1;
      }
    }
  }
}

SearchString.prototype.isName =
/**
 * @param sName: string
 * @param bCaseSensitive: optional boolean = false
 *   Provide <code>true</code> for case-sensitivity.
 * @return <code>true</code> if the name <var>sName</var> exists,
 *   <code>false</code> otherwise.
 */
function searchString_isName(sName, bCaseSensitive)
{
  // FIXME: "A" is not found if bCaseSensitive == false
  /*
    if (!bCaseSensitive)
    {
      sName = sName.toLowerCase();
    }
   */
   
  return (typeof this.values[sName] != "undefined");
}

SearchString.prototype.hasValue =
/**
 * @param sName: string
 * @param bCaseSensitive: optional boolean = false
 *   Provide <code>true</code> for case-sensitivity.
 * @return <code>true</code> if the name <var>sName</var> exists and its
 *   value is not the empty string, <code>false</code> otherwise.
 */
function searchString_hasValue(sName, bCaseSensitive)
{
  // FIXME (see above)
  /*
    if (!bCaseSensitive)
    {
      sName = sName.toLowerCase();
    }
   */

  return (this.isName(sName, bCaseSensitive) && this.values[sName] != "");
}

SearchString.prototype.getValue =
/**
 * @param sName: string
 * @param bCaseSensitive: optional boolean = false
 *   Provide <code>true</code> for case-sensitivity.
 * @param bConvertCode: optional boolean = false
 * @return The value of the name <var>sName</var> if it exists, "" otherwise.
 */
function searchString_getValue(sName, bCaseSensitive, bConvertCode)
{
  // FIXME (see above)
  /*
    if (!bCaseSensitive)
    {
      sName = sName.toLowerCase();
    }
   */

  return (this.isName(sName) ? this.values[sName] : "");
}

/**
 * Helper function for adding name-value pairs
 * as properties of SearchString.values
 * 
 * @param o: object
 * @param sName: string
 * @param sValue: optional string
 */
function addValue(o, sName, sValue)
{
  // if there is no property of that name create it
  if (typeof o[sName] == "undefined")
  {
    o[sName] = sValue;
  }
  // if there is no array property of that name transform the property
  else if (typeof o[sName] != "object")
  {
    o[sName] = [o[sName]];
  }

  // add to the array
  if (typeof o[sName] == "object")
  {
    o[sName][o[sName].length] = sValue;
  }
}

// Helper function that does nothing, for encoding/decoding URIs
function dummy(x)
{
  return x;
}
