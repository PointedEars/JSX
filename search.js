/**
 * <title>PointedEars' JSX: Search-String Library</title>
 */
/*
 * Definition of the SearchString prototype which uses the functions
 * above with names beginning with the prototype name, as methods.
 */
function SearchString(/** @argument string */ s)
{
  this.version = "1.09.2004030606";
/**
 * @file search.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @requires types.js
 * @author Copyright (c) 2000-2004
 *         Thomas Lahn &lt;search.js@PointedEars.de&gt;
 *
 */
  this.copyright = "Copyright \xA9 2000-2004";
  this.author    = "Thomas Lahn";
  this.email     = "search.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
  this.URI       = this.path + "search.js";
/**
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

  if (typeof s != "string")
  {
    if (location && typeof location.search != "undefined")
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

  // Determine method to be used for decoding URI components -- b0rken
  /*
  var fUnescape =
    (typeof decodeURIComponent != "undefined"
      ? decodeURIComponent
      : (typeof unescape != "undefined"
          ? unescape
          : dummy));
  */
 
  /*
   * For Mozilla/NS: Replace occurrences of "&nbsp;" with
   * character "%A0"; requires linked string.js
   */
  this.text = replaceText(this.text, "&nbsp;", unescape("%A0"));
  
  // Replace occurrences of "%xy" with the character
  this.text = unescape(this.text);
  
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
      var value_pairs = this.text.split("&");
      var p;
      for (i = 0; i < value_pairs.length; i++)
      {
        p = value_pairs[i];
        value_pair = p.split("=");
        sName = value_pair[0];
        sValue =
          (value_pair.length > 1
            ? value_pair[1]
            : (sName = "", value_pair[0]));

        addValue(this.values, sName, sValue)
      }
    }
    else
    {
      i = 0;
      
      var idxEquals;
      while (i < this.length)
      {
        var idxAmp = this.text.substring(i).indexOf("&");
        // Required by law
        (idxAmp < 0) ? (idxAmp = this.length) : (idxAmp += i);
        
        value_pair = this.text.substring(i, idxAmp);
        idxEquals = value_pair.indexOf("=");
        sName = "";
        sValue = "";

        if (idxEquals < 0)
          sValue = value_pair;
        else                                                      
        {
          sName = value_pair.substring(0, idxEquals);
          sValue = value_pair.substring(idxEquals + 1);
        }
        
        addValue(this.values, sName, sValue);
        
        i += value_pair.length + 1;
      }
    }
  }
}

SearchString.prototype.isName = function searchString_isName(
  /** @argument string                */ sName,
  /** @optional boolean default false */ bCaseSensitive)
/**
 * @argdescr bCaseSensitive Provide <code>true</code> to ignore name case.
 * @returns <code>true</code> if the name <var>sName</var> exists,
 * <code>false</code> otherwise.
 */
{
  if (!bCaseSensitive)
  {
    sName = sName.toLowerCase();
  }

  return (typeof this.values[sName] != "undefined");
}

SearchString.prototype.hasValue = function searchString_hasValue(
  /** @argument string                */ sName,
  /** @optional boolean default false */ bCaseSensitive)
/**
 * @argdescr bCaseSensitive Provide <code>true</code> to ignore name case.
 * @returns <code>true</code> if the name <var>sName</var> exists and its
 * value is not the empty string, <code>false</code> otherwise.
 */
{
  if (!bCaseSensitive)
  {
    sName = sName.toLowerCase();
  }

  return this.isName(sName, bCaseSensitive) && this.values[sName] != "";
}

SearchString.prototype.getValue = function searchString_getValue(
  /** @argument string                */ sName,
  /** @optional boolean default false */ bCaseSensitive,
  /** @optional boolean default false */ bConvertCode)
/**
 * @argdescr bCaseSensitive Provide <code>true</code> for case-sensitivity.
 * @returns the value of the name <var>sName</var> if it exists, "" otherwise.
 */
{
  if (!bCaseSensitive)
  {
    sName = sName.toLowerCase();
  }

  return (this.isName(sName) ? this.values[sName] : null);
}

function addValue(
  /** @argument object */ o,
  /** @argument string */ sName,
  /** @optional string */ sValue)
/**
 * Helper function for adding value-name pairs
 * as properties of SearchString.values
 */
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
