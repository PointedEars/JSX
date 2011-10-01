/**
 * <title>PointedEars' JSX: Test Library<title>
 *
 * @filename test.js
 * @requires object.js
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2011  Thomas Lahn &lt;js@PointedEars.de&gt;
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
  var jsx = {};
}

if (typeof jsx.test == "undefined")
{
  jsx.test = {};
}

/**
 * @param s : string
 */
jsx.test.AssertionError = function (s) {
  Error.call(this);
  this.message = "Assertion failed: " + s;
};

jsx.test.AssertionError.extend((typeof Error != "undefined") ? Error : null);

/**
 * Asserts that a condition is true.  If it isn't, it throws
 * an <code>AssertionError</code> with a default message.
 *
 * @param x : string|any
 *   If a string, it is evaluated as a <i>Program</i>; the assertion
 *   fails if its result, type-converted to <i>boolean</i>, is
 *   <code>false</code>.
 *   If not a string, the value is type-converted to <i>boolean</i>;
 *   the assertion fails if the result of the conversion is
 *   <code>false</code>.
 * @throws
 *   <code>AssertionError</code> if the assertion fails and this exception
 *   can be thrown.
 * @return boolean
 *   <code>false</code>, if the assertion fails and no exception can be thrown;
 *   <code>true</code>, if the assertion is met.
 * @see Global#eval(String)
 */
jsx.test.assertTrue = jsx.test.assert = function (x) {
  var origX = x;
  if (typeof x == "string")
  {
    x = eval(x);
  }
  
  if (!x)
  {
    (
      function () {
        eval('throw new jsx.test.AssertionError('
             + '"assertTrue(" + (typeof origX == "string" ? origX : "...") + ");");');
      }
    )();
  }
  
  return !!x;
};

/**
 * Asserts that a condition is false.  If it isn't, it throws
 * an <code>AssertionError</code> with a default message.
 *
 * @param x : string|any
 *   If a string, it is evaluated as a <i>Program</i>; the assertion
 *   fails if its result, type-converted to <i>boolean</i>, is
 *   <code>true</code>.
 *   If not a string, the value is type-converted to <i>boolean</i>;
 *   the assertion fails if the result of the conversion is
 *   <code>true</code>.
 * @param bThrow : optional boolean = true
 *   If <code>true</code> (default), an exception will be thrown if
 *   the assertion fails, otherwise a warning will be issued to the
 *   error console in that case.
 * @param sContext : optional String
 *   Description of the context in which the assertion was made.
 *   Ignored if <code><var>bThrow</var> == true</code>.
 * @throws
 *   <code>AssertionError</code> if the assertion fails and this exception
 *   can be thrown.
 * @return boolean
 *   <code>false</code>, if the assertion fails and no exception can be thrown;
 *   <code>true</code>, if the assertion is met.
 * @see Global#eval(String)
 */
jsx.test.assertFalse = function (x, bThrow, sContext) {
  var origX = x;
  if (typeof x == "string")
  {
    x = eval(x);
  }
  
  if (x)
  {
    if (typeof bThrow == "undefined" || bThrow)
    {
      (
        function () {
          eval('throw new jsx.test.AssertionError('
               + '"assertFalse(" + (typeof origX == "string" ? origX : "...") + ");");');
        }
      )();
    }
    else
    {
      jsx.dmsg((sContext ? sContext + ": " : "") + "Assertion failed: "
        + (typeof origX == "string" ? origX : "Value") + " must be false.", "warn");
    }
  }
  
  return !!x;
};

/**
 * Asserts that two arrays are equal.  If they are not,
 * an <code>AssertionError</code> is thrown with a default message.
 * Two arrays are considered equal only if their elements are
 * strictly equal (shallow strict comparison).
 *
 * @param expecteds : string|Array
 *   Expected value; if a string, it is evaluated as a <i>Program</i>.
 * @param actuals : string|Array
 *   Actual value; if a string, it is evaluated as a <i>Program</i>.
 * @throws
 *   <code>ArrayComparisonFailure</code> if either of the given
 *   values is not a reference to an Array object;
 *
 *   <code>AssertionError</code>
 *   if the assertion fails and either exception can be thrown.
 * @return boolean
 *   <code>false</code>, if comparison is not possible
 *   or the assertion fails, and no exception can be thrown;
 *   <code>true</code>, if the assertion is met.
 * @see Global#eval()
 */
jsx.test.assertArrayEquals = function (expecteds, actuals) {
  if (typeof expecteds == "string")
  {
    expecteds = eval(expecteds);
  }
  
  if (typeof actuals == "string")
  {
    actuals = eval(actuals);
  }
  
  if (expecteds == null && actuals == null)
  {
    return true;
  }
  
  if (expecteds.constructor != Array || actuals.constructor != Array)
  {
    if (typeof ArrayComparisonFailure == "function")
    {
      eval('throw new ArrayComparisonFailure();');
    }

    return false;
  }
  
  for (var i = actuals.length, len2 = expecteds.length; i--;)
  {
    if (len2 < i || expecteds[i] !== actuals[i])
    {
      (function () {
        var stack = (new Error()).stack || "";
        if (stack)
        {
          stack = stack.split(/\r?\n|\r/);
          stack.shift();
          stack.shift();
          stack = stack.join("\n");
        }
        
        eval('throw new AssertionError('
          + '"assertArrayEquals([" + expecteds + "], [" + actuals + "]);'
          + ' in " + stack);');
      })();
    }
  }
  
  return true;
};

jsx.test.runner = {
  tests: [],
  
  run: (function() {
    var isMethod = jsx.object.isMethod;
    
    return function(spec) {
      if (spec)
      {
        var hasSetUp = isMethod(spec, 'setUp');
        if (hasSetUp)
        {
          this._setUp = spec.setUp;
        }
        
        var hasTearDown = isMethod(spec, 'tearDown');
        if (hasTearDown)
        {
          this._tearDown = spec.tearDown;
        }
        
        var tests = jsx.object.getProperty(spec, 'tests', null);
        if (tests)
        {
          this.setTests(tests);
        }
      }
      
      for (var i = 0, len = this._tests.length; i < len; ++i)
      {
        var f = this._tests[i];
        if (hasSetUp)
        {
          this._setUp(i, f);
        }
        
        try
        {
          f(i);
          jsx.info("Test " + (i + 1) + " passed.");
        }
        catch (e)
        {
          jsx.warn("Test " + (i + 1) + " threw " + e + (e.stack ? "\n\n" + e.stack : ""));
        }
        
        if (hasTearDown)
        {
          this._tearDown(i, f);
        }
      }
    };
  }()),
  
  setSetUp: function(f) {
    if (!jsx.object.isMethod(f))
    {
      jsx.throwThis("jsx.InvalidArgumentError",
        ["", typeof f, "function"], "jsx.test.runner.setSetUp");
    }
    
    this._setUp = f;
  },
  
  setTearDown: function(f) {
    if (!jsx.object.isMethod(f))
    {
      jsx.throwThis("jsx.InvalidArgumentError", ["", typeof f, "function"]);
    }
    
    this._tearDown = f;
  },
  
  setTests: function(tests) {
    var _class = jsx.object.getClass(tests);
    if (_class != "Array")
    {
      jsx.throwThis("jsx.InvalidArgumentError", ["", _class, "Array"]);
    }
     
    this._tests = tests;
  }
};
