"use strict";
/**
 * @fileOverview <title>Thread-unsafe map implementations</title>
 * @file $Id$
 * @requires object.js
 * 
 * @author (C) 2009-2012 <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
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
   * @namepspace
   */
  var jsx = {};
}

/**
 * @namespace
 */
jsx.map = {
  version: "$Id"
};

/**
 * An object that maps keys to values.
 * A map cannot contain duplicate keys; each key can map to at most one value.
 */
jsx.map.Map = (
  /**
   * @return jsx.map#Map
   */
  function() {
    /**
     * A value in the map, to distinguish it from built-in types
     *
     * @param v  Value to be stored
     * @private
     */
    function _Value(v)
    {
      /**
       * Stored value
       */
      this.value = v;
    }
    
     /**
      * @param v : mixed
      * @return <code>true</code> if <var>v</var> was created using
      *   {@link _Value}, otherwise <code>false</code>
      */
    _Value.isInstance = function(v) {
      return !!v && v.constructor === this;
    };
    
    /**
     * @param map : jsx.map#Map
     *   The map whose mappings are to be placed in this map
     * @constructor
     */
    function Map(map)
    {
//      var Map = arguments.callee;
      
      /* Allows to use this as a factory */
      if (!this || this.constructor != Map)
      {
        return new Map(map);
      }
      
      var
        /** @private map */
        _items = {},
        _size = 0,
        
        _hasOwnProperty = function(o, p) {
          return jsx.object.isMethod(o, "hasOwnProperty")
            ? o.hasOwnProperty(p)
            : typeof o[p] != "undefined";
        },
        
        _maxAliasLength = 255,
        
        /**
         * Returns a safe key, that is, a property name that is not yet used
         * by the ECMAScript implementation.
         *
         * @param unsafeKey
         *   Potentially unsafe key, that is, a property name that may be
         *   already used by the ECMAScript implementation.
         * @return string
         * @throws jsx.map#KeyError if the user-defined maximum key length
         *   does not suffice to satisfy a safe key.
         * @private
         */
        _getSafeKey = function(unsafeKey) {
          var
            safeKey = unsafeKey,
            proto = _items.constructor.prototype;
          
          /*
           * Try until an unused (not inherited and not own non-_Value) property
           * was found or the maximum alias key length has been reached
           */
          while (_hasOwnProperty(proto, safeKey)
                 || (_hasOwnProperty(_items, safeKey)
                     && !_Value.isInstance(_items[safeKey])))
          {
            if (safeKey.length > _maxAliasLength)
            {
              jsx.throwThis("jsx.map.KeyError", unsafeKey);
            }
            
            safeKey += "_";
          }
          
          return safeKey;
        };
        
      /**
       * In order not to overwrite or shadow built-in properties, if a key is
       * the name of such a property, an alias property name is used instead.
       * A maximum length of the alias property name is necessary to avoid
       * infinite iteration for finding an alias if the previously computed
       * alias is already used as name of a built-in property.
       */
      
      /**
       * Gets the maximum alias property name length
       * for further storage and retrieval operations.  The default is 255.
       *
       * @return boolean
       *   <code>true</code> if successful, <code>false</code> otherwise.
       * @public
       */
      this.getMaxAliasLength = function() {
        return _maxAliasLength;
      };
        
      /**
       * Sets the maximum alias property name length
       * for further storage and retrieval operations.
       *
       * @param len : number
       *   Integer greater than 0 to define the maximum alias property name
       *   length.  The default maximum is 255.
       * @return boolean
       *   <code>true</code> if successful, <code>false</code> otherwise.
       * @throws jsx.map#InvalidLengthError
       * @public
       */
      this.setMaxAliasLength = function(len) {
        if (typeof len != "number")
        {
          len = parseInt(len, 10);
        }
        
        if (isNaN(len) || len < 1)
        {
          jsx.throwThis("jsx.map.InvalidLengthError");
        }
        
        _maxAliasLength = len;
        
        return _maxAliasLength === len;
      };
        
      /**
       * Returns the number of key-value mappings in this map
       *
       * @return number
       *   The number of key-value mappings in this map
       * @public
       */
      this.size = function() {
        return _size;
      };
      
      /**
       * Returns <code>true</code> if this map contains no key-value mappings
       *
       * @return boolean
       *   <code>true</code> if this map contains no key-value mappings
       * @public
       */
      this.isEmpty = function() {
        return _size === 0;
      };
    
      /**
       * Returns the value to which the specified key is mapped in this map
       *
       * @param key
       * @param defaultValue
       * @return mixed
       * @throws jsx.map#KeyError
       *   If there is no such key and no default value has been passed.
       * @public
       */
      this.get = function(key, defaultValue) {
        var v = _items[_getSafeKey(key)];
        if (!v)
        {
          if (arguments.length > 1)
          {
            return defaultValue;
          }
          
          jsx.throwThis("jsx.map.KeyError", key);
        }
    
        return v.value;
      };
      
      /**
       * Returns <code>true</code> if this map contains a mapping for the specified key
       *
       * @param key
       * @return boolean
       * @public
       */
      this.containsKey = function(key) {
        return _Value.isInstance(_items[_getSafeKey(key)]);
      };
      
      /**
       * Associates the specified value with the specified key in this map
       *
       * @param key
       * @param value
       * @return boolean
       *   Previous value associated with specified key,
       *   or <code>undefined</code> if there was no mapping for <var>key</var>.
       *   An <code>undefined</code> return can also indicate that the Map
       *   previously associated <code>undefined</code> with the specified key.
       * @throws jsx.map#KeyError
       * @public
       */
      this.put = function(key, value) {
        var k = _getSafeKey(key);
        var v = new _Value(value);
        var prevValue = _items[k];
        
        if (!prevValue)
        {
          _size++;
        }
        
        _items[k] = v;
        
        return prevValue && prevValue.value;
      };
      
      if (arguments.length > 0)
      {
        this.putAll(map);
      }
    
      /**
       * Removes the mapping for the specified key from this map if present
       *
       * @param key
       *   Key whose mapping is to be removed from the map
       * @return mixed
       *   The previous value associated with <var>key</var>,
       *   or <code>undefined</code> if there was no mapping for <var>key</var>.
       *   (An <code>undefined</code> return can also indicate that the map
       *   previously associated <code>undefined</code> with <var>key</var>.)
       * @throws jsx.map#KeyError
       * @public
       */
      this.remove = function(key) {
        var k = _getSafeKey(key);
        var prevValue = _items[k];
        
        if (prevValue)
        {
          delete _items[k];
          _size--;
          return prevValue.value;
        }
        
        return prevValue;
      };
      
      /**
       * Removes all of the mappings from this map.
       * The map will be empty after this call returns.
       *
       * @public
       */
      this.clear = function() {
        _items = {};
        _size = 0;
      };
      
      /**
       * Returns <code>true</code> if this map maps one or more keys to the specified value.
       *
       * @param value
       *   Value whose presence in this map is to be tested
       * @return boolean
       *   <code>true</code> if this map maps one or more keys
       *   to the specified value
       * @public
       */
      this.containsValue = function(value) {
        for (var p in _items)
        {
          var o = _items[p];
          
          if (_Value.isInstance(o) && o.value === value)
          {
            return true;
          }
        }
        
        return false;
      };
      
      /**
       * Returns a list of the keys contained in this map
       *
       * @return Array
       * @public
       */
      this.keys = function() {
        var a = [];
        
        for (var p in _items)
        {
          if (_Value.isInstance(_items[p]))
          {
            a.push(p);
          }
        }
        
        return a;
      };
      
      /**
       * Returns a list of the values contained in this map
       *
       * @return Array
       * @public
       */
      this.values = function() {
        var a = [];
        
        for (var p in _items)
        {
          var o = _items[p];
          
          if (_Value.isInstance(o))
          {
            a.push(o.value);
          }
        }
        
        return a;
      };
      
      /**
       * Returns a list of the mappings contained in this map
       * as an {@link Array} of Arrays of key-value pairs.
       * The inner Arrays consist of two elements each, the key
       * and its associated value.
       *
       * @return Array
       * @public
       */
      this.mappings = function() {
        var a = [];
        
        for (var p in _items)
        {
          var o = _items[p];
          
          if (_Value.isInstance(o))
          {
            a.push([p, o.value]);
          }
        }
        
        return a;
      };
      
      /**
       * Destructs the map so that all closures are released.
       *
       * @public
       */
      this.destruct = function() {
        _items = null;
      };
    }
    
    return Map;
  }
)();

/**
 * Returns a shallow copy of this map
 * 
 * @return jsx.map#Map
 * @public
 */
jsx.map.Map.prototype.clone = function() {
  return new this.constructor(this);
};

/**
 * Copies all of the mappings from the specified map to this map.
 * These mappings will replace any mappings that this map had
 * for any of the keys currently in the specified map.
 *
 * @param map : jsx.map#Map
 * @public
 */
jsx.map.Map.prototype.putAll = function(map) {
  if (!this.constructor.isInstance(map))
  {
    jsx.throwThis("jsx.InvalidArgumentError");
  }
  
  this.setMaxAliasLength(map.getMaxAliasLength());
  
  for (var a = map.mappings(), i = a.length; i--;)
  {
    var o = a[i];
    
    this.put(o[0], o[1]);
  }
};
/**
 * Returns <code>true</code> if the argument is a {@link jsx.map#Map Map}
 *
 * @param o : Object
 * @return boolean
 */
jsx.map.Map.isInstance = function(o) {
  return !!o && o.constructor === this;
};

jsx.map.KeyError = function (key) {
  jsx.object.PropertyError.call(this, key);
};
jsx.map.KeyError.extend(jsx.object.PropertyError);

jsx.map.InvalidLengthError = function() {
  jsx.object.PropertyError.call(this, "InvalidLengthError");
};
jsx.map.InvalidLengthError.extend(jsx.object.PropertyError);