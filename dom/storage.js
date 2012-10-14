/**
 * <title>PointedEars' DOM Library: Web Storage</title>
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2012 Thomas Lahn <js@PointedEars.de>
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

if (typeof jsx.dom.storage.localStorage == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom.storage.localStorage = {};
}

jsx.dom.storage.localStorage.setItem = function (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
};

jsx.dom.storage.localStorage.getItem = function (key) {
  var value = window.localStorage.getItem(key);
  
  /*
   * NOTE: Shortcut evaluation for handling "" only
   */
  return value && JSON.parse(value);
};