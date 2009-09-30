/**
 * Thread-unsafe map implementations
 *
 * @version 2009-09-30
 * @author (c) 2009  Thomas 'PointedEars' Lahn &lt;cljs@PointedEars.de&gt;
 * @requires de.pointedears.jsx.object.js
 */

/**
 * An object that maps keys to values.
 * A map cannot contain duplicate keys; each key can map to at most one value.
 */
var Map = (function() {
  /**
   * A value in the map, to distinguish it from built-in types
   *
   * @param v  Value to be stored
   * @private
   */
  function _Value(v) {
    
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
   * @param m : Map
   *   The map whose mappings are to be placed in this map
   * @return Map
   */
  function Map(m)
  {
    var me = arguments.callee;
    
    /* Allows to use this as a factory */
    if (this.constructor != me)
    {
      return new me(m);
    }
    
    var
      /** @private map */
      _items = {},
      _size = 0;
      
      _hasOwnProperty = function(o, p) {
        return jsx.object.isMethod(_items, "hasOwnProperty")
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
       * @throws Map.KeyError if the user-defined maximum key length
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
            jsx.throwThis(Map.KeyError, unsafeKey);
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
     * @throws Map.InvalidLengthError
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
     * @throws Map.InvalidLengthError
     * @public
     */
    this.setMaxAliasLength = function(len) {
      if (typeof len != "number") len = parseInt(len, 10);
      
      if (isNaN(len) || len < 1) jsx.throwThis(Map.InvalidLengthError);
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
     * @throws Map.KeyError
     *   If there is no such key and no default value has been passed.
     * @public
     */
    this.get = function(key, defaultValue) {
      var v = _items[_getSafeKey(key)];
      if (!v)
      {
        if (arguments.length > 1) return defaultValue;
        
        jsx.throwThis(Map.KeyError, key);
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
     * @throws Map.KeyError
     * @public
     */
    this.put = function(key, value) {
      var k = _getSafeKey(key);
      var v = new _Value(value);
      var prevValue = _items[k];
      
      if (!prevValue) _size++;
      _items[k] = v;
      
      return prevValue && prevValue.value;
    };
    
    /**
     * Copies all of the mappings from the specified map to this map.
     * These mappings will replace any mappings that this map had
     * for any of the keys currently in the specified map.
     *
     * @param m : Map
     * @public
     */
    this.putAll = function(m) {
      if (!me.isInstance(m))
      {
        jsx.throwThis(Map.InvalidArgumentError);
      }
      
      this.setMaxAliasLength(m.getMaxAliasLength());
      
      for (var a = m.mappings(), i = a.length; i--;)
      {
        var o = a[i];
        
        this.put(o[0], o[1]);
      }
    };
    
    if (arguments.length > 0) this.putAll(m);
  
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
     * @throws Map.KeyError
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
        
        if (_Value.isInstance(o) && o.value === value) return true;
      }
      
      return false;
    };
    
    /**
     * Returns a shallow copy of this map
     * 
     * @return Map
     * @public
     */
    this.clone = function() {
      return new this.constructor(this);
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
        if (_Value.isInstance(_items[p])) a.push(p);
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
        
        if (_Value.isInstance(o)) a.push(o.value);
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
        
        if (_Value.isInstance(o)) a.push([p, o.value]);
      }
      
      return a;
    };
    
    /**
     * Destructs the map so that all closures are released.
     *
     * @public
     */
    this.destruct = function() {
      me = _items = null;
    };
  }
  
  return Map;
})();

/**
 * Returns <code>true</code> if the argument is a {@link Map}
 *
 * @param o : Object
 * @return boolean
 */
Map.isInstance = function(o) {
  return !!o && o.constructor === this;
};

Map.KeyError = function() {
  jsx.Error.call(this, "KeyError");
};
Map.KeyError.extend(jsx.Error);

Map.InvalidLengthError = function() {
  jsx.Error.call(this, "InvalidLengthError");
};
Map.InvalidLengthError.extend(jsx.Error);

Map.InvalidArgumentError = function() {
  jsx.Error.call(this, "InvalidArgumentError");
};
Map.InvalidArgumentError.extend(jsx.Error);