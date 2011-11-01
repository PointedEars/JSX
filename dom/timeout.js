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

/**
 * Creates a container for code that can be run later
 * 
 * @param f : Function
 *   Code to be run later.  The default is <code>null</code>.
 * @param delay : int
 *   Milliseconds after which the code will be run by default.
 * @constructor
 */
jsx.dom.timeout.Timeout = function(f, delay) {
  this.running = false;
  this.code = f || null;
  this.delay = parseInt(delay, 10) || 50;
};

/**
 * Runs the associated code after <var>delay</var> milliseconds;
 * cancels any planned but not yet performed executions.
 * 
 * @param f : Function
 *   Code to be run later.  The default is the value of the
 *   <code>code</code> property as initialized upon construction.
 *   This argument's value will modify that property if the type
 *   is correct.
 * @param delay : int
 *   Milliseconds after which the code will be run by default.
 *   The default is the value of the <code>delay</code> property
 *   as initialized upon construction.
 *   This argument's value will modify that property if the type
 *   is correct.
 * @see #Timeout()
 */
jsx.dom.timeout.Timeout.prototype.run = function(f, delay) {
  this.unset();
  
  if (typeof f == "function")
  {
    this.code = f;
  }
  
  if (delay)
  {
    this.delay = parseInt(delay, 10);
  }
  
  if (typeof window != "undefined"
      && jsx.object.isMethod(window, "setTimeout"))
  {
    this.running = true;
    var me = this;
    this.data = window.setTimeout(function() {
      me.code();
      me.unset();
    }, this.delay);
  }
};

/**
 * Cancels the execution of the associated code
 */
jsx.dom.timeout.Timeout.prototype.unset = function() {
  if (this.running)
  {
    if (typeof window != "undefined"
        && jsx.object.isMethod(window, "clearTimeout"))
    {
      window.clearTimeout(this.data);
    }
    
    this.running = false;
  }
};

/**
 * Provides a container for {@link #Timeout}s.
 * 
 * @param timeouts : Array[Timeout]
 *   The list of {@link jsx.dom.timeout#Timeout Timeouts} to be considered
 * @constructor
 */
jsx.dom.timeout.TimeoutList = function(timeouts) {
  this.timeouts = timeouts || [];
};

/**
 * Unsets all {@link #Timeout}s in this container
 */
jsx.dom.timeout.TimeoutList.prototype.unsetAll = function() {
  for (var i = 0, timeouts = this.timeouts, len = timeouts.length; i < len; ++i)
  {
    timeouts[i].unset();
  }
};

/**
 * Schedules code for later execution.
 * 
 * @param code : String|Function
 *   Code to be executed or function to be called.
 * @param iTimeout : number
 *   Number of milliseconds after which <var>code</var> should be run.
 */
jsx.dom.runLater = function (code, iTimeout) {
  (new jsx.dom.timeout.Timeout(code, iTimeout)).run();
  
  return Number.NaN;
};
