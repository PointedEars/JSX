/**
 * <title>PointedEars' DOM Library: CSS Compatibility Layer</title>
 * @version $Id: css.js 230 2011-10-01 17:00:32Z PointedEars $
 * @requires dom.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2011 Thomas Lahn <js@PointedEars.de>
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

var setStyleProperty = jsx.dom.setStyleProperty;
var CSS = jsx.dom.css;
jsx.dom.getElemByClassName = jsx.dom.css.getElemByClassName;