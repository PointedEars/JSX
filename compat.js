/**
 * @fileOverview <title>General JSX backwards compatibility layer</title>
 *
 * @author (C) 2012-2015 Thomas Lahn <js@PointedEars.de>
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

/*
 * This is a library: Do not care about "defined but not used",
 * except in the definitions themselves.
 */
/*jshint -W098*/
var _global = jsx.global;
var setErrorHandler = jsx.setErrorHandler;
var clearErrorHandler = jsx.clearErrorHandler;

var addProperties = jsx.object.addProperties = (function () {
  /*jshint +W098*/
  var rxObject = /^\s*(object|function)\s*$/i;

  return function (oSource, iFlags, oOwner) {
    if (rxObject.test(typeof iFlags))
    {
      oOwner = iFlags;
      iFlags = 0;
    }

    if (!oOwner)
    {
      oOwner = jsx.global;
    }

    return jsx.object.extend(oOwner, oSource, iFlags);
  };
}());

/*jshint -W098*/
var isMethod = function () {
  /*jshint +W098*/
  for (var i = arguments.length; i--;)
  {
    if (!jsx.object.isMethod(arguments[i]))
    {
      return false;
    }
  }

  return true;
};

/*jshint -W098*/
var isMethodType = jsx.object.isMethodType;
var isInstanceOf = jsx.object.isInstanceOf;

var types = jsx.types;

var Collection = jsx.Collection;
