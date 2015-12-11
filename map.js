"use strict";
/**
 * @fileOverview <title>Thread-unsafe map implementations</title>
 * @file $Id$
 * @requires object.js
 *
 * @author (C) 2009-2013 <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
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
  version: "$Id$",

  /**
   * An object that maps keys to values.
   *
   * A map cannot contain duplicate keys; each key can map to at most
   * one value.  Keys may be object references.
   *
   * @function
   */
  Map: jsx.object.extend((
    /**
     * @return {jsx.map.Map}
     */
    function () {
      /**
       * A value in the map, to distinguish it from built-in types
       *
       * @param value  Value to be stored
       * @param key    Optional key for the value. Used by {@link _Bucket}.
       * @private
       */
      function _ValueContainer(value, key)
      {
        this.putValue(value, key);
      }

      /**
       * @param value
       * @return {boolean}
       *   <code>true</code> if <var>v</var> was created using
       *   {@link _ValueContainer}, otherwise <code>false</code>
       */
      _ValueContainer.isInstance = function (value) {
        return !!value && value.constructor === this;
      };

      _ValueContainer.prototype.putValue = function (value, key) {
        this._value = value;
        this._key = key;
      };

      _ValueContainer.prototype.getValue = function () {
        return this._value;
      };

      _ValueContainer.prototype.getKey = function () {
        return this._key;
      };

      var _getDataObject = jsx.object.getDataObject;

      /**
       * In order not to overwrite or shadow built-in properties, if a key is
       * the name of such a property, an alias property name is used instead.
       * A maximum length of the alias property name is necessary to avoid
       * infinite iteration for finding an alias if the previously computed
       * alias is already used as name of a built-in property.
       */
      var _maxAliasLength = 255;

      var _isObjectRef = jsx.object.isObject;

      /**
       * Returns a safe key, that is, a property name that is not yet used
       * by the ECMAScript implementation.
       *
       * @param unsafeKey
       *   Potentially unsafe key, that is, a property name that may be
       *   already used by the ECMAScript implementation.
       * @return {string}
       * @throws jsx.map#KeyError if the user-defined maximum key length
       *   does not suffice to satisfy a safe key.
       * @private
       */
      function _getSafeKey (obj, unsafeKey)
      {
        var
          safeKey = unsafeKey,
          constructor = obj.constructor,
          proto = (constructor ? constructor.prototype : null);

        if (_isObjectRef(unsafeKey))
        {
          var _class = jsx.object.getClass(unsafeKey);
          var constructorName = jsx.object.getFunctionName(unsafeKey.constructor);
          safeKey = (_class ? "[" + _class + "]" : "")
            + (constructorName ? constructorName + "()" : "")
            + (typeof unsafeKey.nodeName != "undefined"
                ? unsafeKey.nodeName
                : "")
            + (typeof unsafeKey.id != "undefined"
                ? "#" + unsafeKey.id
                : "")
            + (typeof unsafeKey.className != "undefined"
                && /\S/.test(unsafeKey.className)
                ? "." + unsafeKey.className.replace(/\s+/, ".")
                : "");
        }

        /*
         * Try until an unused (not inherited and not own non-_ValueContainer) property
         * was found or the maximum alias key length has been reached
         */
        while (proto && (_hasOwnProperty(proto, safeKey)
          || (_hasOwnProperty(obj, safeKey)
            && !_ValueContainer.isInstance(obj[safeKey]))))
        {
          if (safeKey.length > _maxAliasLength)
          {
            jsx.throwThis("jsx.map.KeyError", unsafeKey);
          }

          safeKey += "_";
        }

        return safeKey;
      }

      function _Bucket()
      {
        this._items = _getDataObject();
      }

      /**
       * @param value
       * @return {boolean}
       *   <code>true</code> if <var>v</var> was created using
       *   {@link _Bucket}, otherwise <code>false</code>
       */
      _Bucket.isInstance = function (value) {
        return !!value && value.constructor === this;
      };

      _Bucket._nextId = 1;

      _Bucket.extend(null, {
        /**
         * Returns the next string key for this bucket
         *
         * @memberOf _Bucket.prototype
         * @private
         * @return {string}
         */
        _getNextId: function () {
          return "key" + (_Bucket._nextId++) + "_";
        },

        /**
         * Puts a value in the bucket
         *
         * @param oKey
         * @return {_ValueContainer}
         *   The previous container for this key,
         *   <code>null</code> if none.
         */
        put: function (oKey, value) {
          var prevValue = null;
          var items = this._items;
          var sKey = this.find(oKey);
          if (!sKey)
          {
            sKey = _getSafeKey(items, this._getNextId());
          }
          else
          {
            prevValue = items[sKey];
          }

          items[sKey] = new _ValueContainer(value, oKey);

          return prevValue;
        },

        /**
         * Gets a value from the bucket
         *
         * @param oKey
         * @return {string}
         *   The value for the object key
         */
        get: function (oKey) {
          var sKey = this.find(oKey);
          if (!sKey)
          {
            return void 0;
          }

          return this._items[sKey];
        },

        /**
         * Returns the string key of an object
         *
         * @param oKey
         * @return {string|boolean}
         *   The string key of <var>oKey</var> if it is in the bucket,
         *   <code>false</code> otherwise.
         */
        find: function (oKey) {
          var items = this._items;
          for (var sKey in items)
          {
            var value = items[sKey];
            if (_ValueContainer.isInstance(value) && value.getKey() == oKey)
            {
              return sKey;
            }
          }

          return false;
        },

        /**
         * Removes an object key from the bucket
         *
         * @param oKey
         * @return {string|boolean}
         *   The removed value for the object key,
         *   or <code>false</code> if it was not in the bucket.
         */
        remove: function (oKey) {
          var sKey = this.find(oKey);
          if (sKey)
          {
            var value = this._items[sKey];
            delete this._items[sKey];
          }

          return value;
        },

        keys: function () {
          var a = [];

          var items = this._items;
          for (var key in items)
          {
            var o = items[key];
            if (_ValueContainer.isInstance(o))
            {
              a.push(o.getKey());
            }
          }

          return a;
        },

        mappings: function () {
          var a = [];

          var items = this._items;
          for (var p in items)
          {
            var o = items[p];

            if (_ValueContainer.isInstance(o))
            {
              a.push([o.getKey(), o.getValue()]);
            }
          }

          return a;
        }
      });

      /* Imports */
      var _hasOwnProperty = jsx.object._hasOwnProperty;

      /**
       * @param {jsx.map.Map} map
       *   The map whose mappings are to be placed in this map
       * @param {Boolean} strictKeys (optional)
       *   If <code>true</code>, keys are stored as they are.
       *   Otherwise only object keys are stored as they are,
       *   and other keys are converted to string.  The default
       *   is <code>false</code>.
       * @constructor
       */
      function _Map (map, strictKeys)
      {
//      var Map = arguments.callee;

        /* Allows to use this as a factory */
        if (!this || this.constructor != _Map)
        {
          return new _Map(map);
        }

        var _items = _getDataObject();
        var _size = 0;

        /**
         * Gets the maximum alias property name length
         * for further storage and retrieval operations.
         * The default is 255.
         *
         * @return {boolean}
         *   <code>true</code> if successful,
         *   <code>false</code> otherwise.
         * @public
         */
        this.getMaxAliasLength = function () {
          return _maxAliasLength;
        };

        /**
         * Sets the maximum alias property name length
         * for further storage and retrieval operations.
         *
         * @param {number} len
         *   Integer greater than 0 to define the maximum
         *   alias property name length.  The default maximum is 255.
         * @return {boolean}
         *   <code>true</code> if successful,
         *   <code>false</code> otherwise.
         * @throws jsx.map#InvalidLengthError
         * @public
         */
        this.setMaxAliasLength = function (len) {
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
         * @return {number}
         *   The number of key-value mappings in this map
         * @public
         */
        this.size = function () {
          return _size;
        };

        /**
         * Returns <code>true</code> if this map contains no key-value mappings
         *
         * @return {boolean}
         *   <code>true</code> if this map contains no key-value mappings
         * @public
         */
        this.isEmpty = function () {
          return _size === 0;
        };

        /**
         * Returns the value to which the specified key is mapped in this map
         *
         * @param key
         * @param defaultValue
         * @throws jsx.map#KeyError
         *   If there is no such key and no default value has been passed.
         * @public
         */
        this.get = function (key, defaultValue) {
          var v = _items[_getSafeKey(_items, key)];

          if (_isObjectRef(key))
          {
            if (_Bucket.isInstance(v))
            {
              v = v.get(key);
            }
          }

          if (!v)
          {
            if (arguments.length > 1)
            {
              return defaultValue;
            }

            jsx.throwThis("jsx.map.KeyError", key);
          }

          return v.getValue();
        };

        /**
         * Returns <code>true</code> if this map contains a mapping for the specified key
         *
         * @param key
         * @return {boolean}
         * @public
         */
        this.containsKey = function (key) {
          var value = _items[_getSafeKey(_items, key)];
          return _ValueContainer.isInstance(value)
          || (_Bucket.isInstance(value) && !!value.find(key));
        };

        /**
         * Associates the specified value with the specified key in this map
         *
         * @param key
         * @param value
         * @return {boolean}
         *   Previous value associated with specified key,
         *   or <code>undefined</code> if there was no mapping for <var>key</var>.
         *   An <code>undefined</code> return can also indicate that the Map
         *   previously associated <code>undefined</code> with the specified key.
         * @throws jsx.map#KeyError
         * @public
         */
        this.put = function (key, value) {
          var k = _getSafeKey(_items, key);
          var v;
          var prevValue = _items[k];

          if (_isObjectRef(key) || (typeof key != "string" && this.strictKeys))
          {
            var bucket = prevValue;
            if (_Bucket.isInstance(bucket))
            {
              if (!bucket.find(key))
              {
                ++_size;
              }
            }
            else
            {
              bucket = new _Bucket();
              ++_size;
            }

            prevValue = bucket.put(key, value);
            v = bucket;
          }
          else
          {
            v = new _ValueContainer(value);
            if (!prevValue)
            {
              ++_size;
            }
          }

          _items[k] = v;

          return prevValue && prevValue.getValue();
        };

        /**
         * Removes the mapping for the specified key from this map if present
         *
         * @param key
         *   Key whose mapping is to be removed from the map
         * @return {any}
         *   The previous value associated with <var>key</var>,_value
         *   or <code>undefined</code> if there was no mapping for <var>key</var>.
         *   (An <code>undefined</code> return can also indicate that the map
         *   previously associated <code>undefined</code> with <var>key</var>.)
         * @throws jsx.map#KeyError
         * @public
         */
        this.remove = function (key) {
          var k = _getSafeKey(_items, key);
          var prevValue = _items[k];

          if (prevValue)
          {
            if (_isObjectRef(key))
            {
              if (_Bucket.isInstance(prevValue))
              {
                var prevValue = prevValue.remove(key);
                if (_ValueContainer.isInstance(prevValue))
                {
                  --_size;
                  return prevValue.getValue();
                }

                return prevValue;
              }

              return void 0;
            }

            delete _items[k];
            --_size;
            return prevValue && prevValue.getValue();
          }

          return prevValue;
        };

        /**
         * Removes all of the mappings from this map.
         * The map will be empty after this call returns.
         *
         * @public
         */
        this.clear = function () {
          _items = _getDataObject();
          _size = 0;
        };

        /**
         * Returns <code>true</code> if this map maps one or more keys to the specified value.
         *
         * @param value
         *   Value whose presence in this map is to be tested
         * @return {boolean}
         *   <code>true</code> if this map maps one or more keys
         *   to the specified value
         * @public
         */
        this.containsValue = function (value) {
          for (var p in _items)
          {
            var o = _items[p];

            if (_ValueContainer.isInstance(o) && o.getValue() === value)
            {
              return true;
            }

            if (_Bucket.isInstance(o) && o.containsValue(value))
            {
              return true;
            }
          }

          return false;
        };

        /**
         * Returns a list of the keys contained in this map
         *
         * @return {Array}
         * @public
         */
        this.keys = function () {
          var a = [];

          for (var p in _items)
          {
            var o = _items[p];
            if (_ValueContainer.isInstance(o))
            {
              a.push(p);
            }
            else if (_Bucket.isInstance(o))
            {
              a.push.apply(a, o.keys());
            }
          }

          return a;
        };

        /**
         * Returns a list of the values contained in this map
         *
         * @return {Array}
         * @public
         */
        this.values = function () {
          var a = [];

          for (var p in _items)
          {
            var o = _items[p];

            if (_ValueContainer.isInstance(o))
            {
              a.push(o.getValue());
            }
            else if (_Bucket.isInstance(o))
            {
              a.push.apply(a, o.values());
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
         * @return {Array}
         * @public
         */
        this.mappings = function () {
          var a = [];

          for (var p in _items)
          {
            var o = _items[p];

            if (_ValueContainer.isInstance(o))
            {
              a.push([p, o.getValue()]);
            }
            else if (_Bucket.isInstance(o))
            {
              var bucketMappings = o.mappings();
              for (var i = 0, len = bucketMappings.length; i < len; ++i)
              {
                a.push(bucketMappings[i]);
              }
            }
          }

          return a;
        };

        /**
         * Destructs the map so that all closures are released.
         *
         * @public
         */
        this.destruct = function () {
          _items = null;
        };

        this.strictKeys = !!strictKeys;

        if (arguments.length > 0 && map != null)
        {
          this.putAll(map);
        }
      }

      return _Map;
    }()
  ).extend(null, {
    /**
     * Returns a shallow copy of this map
     *
     * @memberOf jsx.map.Map.prototype
     * @return {jsx.map.Map}
     * @public
     */
    clone: function () {
      return new this.constructor(this);
    },

    /**
     * Copies all of the mappings from the specified map to this map.
     * These mappings will replace any mappings that this map had
     * for any of the keys currently in the specified map.
     *
     * @param {jsx.map.Map} map
     * @public
     */
    putAll: function (map) {
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
    }
  }), {
    /**
     * Returns <code>true</code> if the argument is a {@link jsx.map#Map Map}
     *
     * @memberOf jsx.map.Map
     * @param {Object} o
     * @return {boolean}
     */
    isInstance: function (o) {
      return !!o && o.constructor === this;
    }
  }),

  KeyError: (
    function (key) {
      jsx.object.PropertyError.call(this);
      this.message = "No such key: " + key;
    }
  ).extend(jsx.object.PropertyError, {
    name: "jsx.map.KeyError"
  }),

  InvalidLengthError: (
    function () {
      jsx.object.PropertyError.call(this, "InvalidLengthError");
    }
  ).extend(jsx.object.PropertyError)
};
