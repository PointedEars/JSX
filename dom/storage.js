/**
 * <title>PointedEars' DOM Library: Web Storage</title>
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2012, 2013 Thomas Lahn <js@PointedEars.de>
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

if (typeof jsx.dom == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom = {};
}

if (typeof jsx.dom.storage == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom.storage = {};
}

/**
 * @param storageName : string (optional) Storage name ("local" and "session" are supported)
 * @returns
 *   <code>true</code> if any or the specified Storage is supported,
 *   <code>false</code> otherwise.
 */
jsx.dom.storage.isSupported = function (storageName) {
  if (storageName)
  {
    return (typeof window[storageName + "Storage"] != "undefined");
  }
  
  var _storage = jsx.dom.storage;
  return _storage.localStorage.isSupported() || _storage.sessionStorage.isSupported();
};

/**
 * Sets an item in a {@link Storage}. Used internally.
 * 
 * @param storage : Storage
 * @param key : string
 * @param value
 */
jsx.dom.storage.setItem = function (storage, key, value) {
  storage.setItem(key, JSON.stringify(value));
};

/**
 * Retrieves an item from a {@link Storage}. Used internally.
 * 
 * @param storage : Storage
 * @param key : string
 * @return any item value
 */
jsx.dom.storage.getItem = function (storage, key) {
  var value = storage.getItem(key);
  
  /*
   * NOTE: Shortcut evaluation for handling "" only
   */
  return value && JSON.parse(value);
};

if (typeof jsx.dom.storage.localStorage == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom.storage.localStorage = {};
}

/**
 * @returns
 *   <code>true</code> if Local Storage is supported,
 *   <code>false</code> otherwise.
 * @function
 */
jsx.dom.storage.localStorage.isSupported = (function () {
  var _storage = jsx.dom.storage;
  
  return function () {
    return _storage.isSupported("local");
  };
}());

/**
 * Sets an item in the Local {@link Storage}
 *
 * @function
 */
jsx.dom.storage.localStorage.setItem = (function () {
  var _storage = jsx.dom.storage;
  
  /**
   * @param key : string
   * @param value
   */
  return function (key, value) {
    _storage.setItem(window.localStorage, key, value);
  };
}());

/**
 * Retrieves an item from the Local {@link Storage}
 *
 * @function
 */
jsx.dom.storage.localStorage.getItem = (function () {
  var _storage= jsx.dom.storage;
  
  /**
   * @param key : string
   * @return any item value
   */
  return function (key) {
    return _storage.getItem(window.localStorage, key);
  };
}());

if (typeof jsx.dom.storage.sessionStorage == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom.storage.sessionStorage = {};
}

/**
 * @returns
 *   <code>true</code> if Session {@link Storage} is supported
 *   <code>false</code> otherwise.
 * @function
 */
jsx.dom.storage.sessionStorage.isSupported = (function () {
  var _storage = jsx.dom.storage;
  
  return function () {
    return _storage.isSupported("session");
  };
}());

/**
 * Sets an item in the Session {@link Storage}
 *
 * @function
 */
jsx.dom.storage.sessionStorage.setItem = (function () {
  var _storage = jsx.dom.storage;
  
  /**
   * @param key : string
   * @param value
   */
  return function (key, value) {
    _storage.setItem(window.sessionStorage, key, value);
  };
}());

/**
 * Retrieves an item from the Session {@link Storage}
 *
 * @function
 */
jsx.dom.storage.sessionStorage.getItem = (function () {
  var _storage= jsx.dom.storage;

  /**
   * @param key : string
   * @return any item value
   */
  return function (key) {
    return _storage.getItem(window.sessionStorage, key);
  };
}());