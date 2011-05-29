/**
 * <title>PointedEars' DOM Library: Timeout</title>
 * @requires types.js
 * @recommends xpath.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2002-2010 Thomas Lahn <dhtml.js@PointedEars.de>
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

/**
 * Schedules code for later execution.
 * 
 * @param code : String|Function
 *   Code to be executed or function to be called.
 * @param iTimeout : number
 *   Number of milliseconds after which <var>code</var> should be run.
 */
jsx.dom.runLater = function (code, iTimeout) {
  if (typeof window != "undefined"
      && jsx.object.isMethod(window, "setTimeout"))
  {
    return window.setTimeout(code, iTimeout);
  }
  
  return Number.NaN;
};
