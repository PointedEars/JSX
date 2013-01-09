/**
 * <title>PointedEars' JSX: String Library – Hyphenation</title>
 * @file string/hyphenation.js
 *
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2012  Thomas Lahn &lt;js@PointedEars.de&gt;
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

if (typeof jsx.string == "undefined")
{
  /**
   * @namespace
   */
  jsx.string = {};
};
  
jsx.string.hyphenation = (function () {
  "use strict";
  var _jsx = jsx;
  var _jsx_object = _jsx.object;
  var _getDataObject = _jsx_object.getDataObject;
  var _getKeys = _jsx_object.getKeys;
  var _map = _jsx.array.map;
  
  var _dictionary = _getDataObject();
  var _hyphenateAll = false;
  var _rxWord = /(^|\s)(\S+)([\s,;:.?!\)\]]|$)/g;
  var _rxWords;
  
  /* U+00B7 MIDDLE DOT (often found in online dictionaries) */
  var _rxHyphen = /[-\00b7]/g;
  
  var _chShy = "\u00ad";
  var _rxShy = new RegExp(_chShy, "g");
  
  var _compiled = false;
  var _compile = function () {
    _rxWords = new RegExp("(^|\\s)("
      + _getKeys(_dictionary).join("|")
      + ")([\\s,;:.?!\\)\\]]|$)", "g");
    _compiled = true;
  };
    
  var hyphenation = {
    /**
     * Loads a dictionary.  The dictionary should contain at least
     * one {@link jsx.string.hyphenation#addRule} or
     * {@link jsx.string.hyphenation#addRules} call.
     * 
     * @param dictionary : String
     *   URI of the dictionary
     * @return boolean
     *   <code>true</code> if the dictionary could be successfully
     *   <em>loaded</em> (not: included), <code>false</code> otherwise.
     * @requires jsx.net.http#Request
     * @see jsx#importFrom
     */
    loadDictionary: function (dictionary) {
      return jsx.importFrom(dictionary);
    },
    
    /**
     * Loads several dictionaries.  A dictionary should contain
     * at least one {@link jsx.string.hyphenation#addRule} or
     * {@link jsx.string.hyphenation#addRules} call.
     * 
     * @param dictionaries : Array[String]
     *   URIs of the dictionaries
     * @param returnEarly : optional Boolean
     *   If <code>true</code>, return as soon as loading one
     *   dictionary fails.  The default is <code>false</code>.
     * @return boolean
     *   <code>true</code> if all dictionaries could be successfully
     *   <em>loaded</em> (not: included), <code>false</code> otherwise.
     * @requires jsx.net.http#Request
     * @see jsx#importFrom
     */
    loadDictionaries: function (dictionaries, returnEarly) {
      var success = true;
      
      for (var i = 0, len = dictionaries.length; i < len; ++i)
      {
        if (!this.addDictionary(dictionaries[i]))
        {
          success = false;
        }

        if (returnEarly && !success)
        {
          return success;
        }
      }
      
      return success;
    },
    
    /**
     * @memberOf jsx.string.hyphenation
     * @param rule
     * @returns
     */
    addRule: function (rule) {
      _dictionary[rule.replace(_rxHyphen, "")] = rule.replace(_rxHyphen, _chShy);
      _compiled = false;
    },
    
    addRules: function (rules) {
      for (var i = 0, len = rules.length; i < len; ++i)
      {
        this.addRule(rules[i]);
      }
    },
    
    getRules: function () {
      return _map(
        _getKeys(_dictionary),
        function (key) {
          return _dictionary[key].replace(_rxShy, "-");
        });
    },
    
    removeRule: function (rule) {
      delete _dictionary[rule];
     _compiled = false;
    },
    
    reset: function () {
      _dictionary = _getDataObject();
      _compiled = false;
    },

    getHyphenateAll: function () {
      return _hyphenateAll;
    },
    
    setHyphenateAll: function (hyphenateAll) {
      _hyphenateAll = !!hyphenateAll;
    },
    
    hyphenate: function (s) {
      if (!_compiled)
      {
        _compile();
      }
      
      return s.replace(_hyphenateAll ? _rxWord : _rxWords,
        function (match, wsp1, word, wsp2) {
          if (_hyphenateAll && !_dictionary[word])
          {
            return match;
          }
            
          return wsp1 + _dictionary[word] + wsp2;
        });
    }
  };
  
  _jsx_object.defineProperties(hyphenation, {
    rules: {
      "get": function () {
        return this.getRules();
      }
    }
  });
  
  return hyphenation;
}());