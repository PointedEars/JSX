/**
 * <title>PointedEars' JSX: String Compatibility Layer</title>
 * @version $Id$
 * @requires object.js
 * 
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2002-2012 Thomas Lahn <js@PointedEars.de>
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
 * Fix String.prototype.replace(..., Function) for Safari <= 2.0.2;
 * thanks to kangax <kangax@gmail.com>
 */
if ("x".replace(/x/, function () { return "u"; }) != "u")
{
  var jsx_string_compat_origReplace = String.prototype.replace;
  String.prototype.replace = function (searchValue, replaceValue) {
    if (jsx_object.isMethod(replaceValue))
    {
      if (searchValue.constructor == RegExp)
      {
        var
          result = this,
          m,
          i = searchValue.global ? -1 : 1;

        while (i-- && (m = searchValue.exec(result)))
        {
          result = result.replace(
            m[0],
            String(replaceValue.apply(null, m.concat(m.index, this))));
        }

        return result;
      }

      i = this.indexOf(searchValue);
      if (i > -1)
      {
        return replaceValue(String(searchValue), i, this);
      }

      return this;
    }

    return jsx_string_compat_origReplace.apply(this, arguments);
  };
}