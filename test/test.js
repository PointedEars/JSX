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
 * Asserts that a condition converts to true.  If it does not, it throws
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
jsx.test.assert = function (x) {
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
             + '"assert(" + (typeof origX == "string" ? origX : "...") + ");");');
      }
    )();
  }
  
  return !!x;
};

/**
 * Asserts that a condition is boolean <code>true</code>.  If it isn't,
 * it throws an <code>AssertionError</code> with a default message.
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
jsx.test.assertTrue = function (x) {
  var origX = x;
  if (typeof x == "string")
  {
    x = eval(x);
  }
  
  if (typeof x != "boolean" || !x)
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
  
  if (typeof x != "boolean" || x)
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
 * Asserts that a condition is <code>undefined</code>.  If it isn't, it throws
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
jsx.test.assertUndefined = function (x, bThrow, sContext) {
  var origX = x;
  if (typeof x == "string")
  {
    x = eval(x);
  }
  
  if (typeof x != "undefined")
  {
    if (typeof bThrow == "undefined" || bThrow)
    {
      (
        function () {
          eval('throw new jsx.test.AssertionError('
               + '"assertUndefined(" + (typeof origX == "string" ? origX : "...") + ");");');
        }
      )();
    }
    else
    {
      jsx.warn((sContext ? sContext + ": " : "") + "Assertion failed: "
        + (typeof origX == "string" ? origX : "Value") + " must be undefined.");
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
  
  printMsg: function (msg, msgType) {
    return jsx[msgType]("jsx.test.runner: " + msg);
  },
  
  /**
   * Runs test cases
   * 
   * @param spec : Object
   *   Test specifaction.  Supported properties incude:
   *   <table>
   *    <thead>
   *      <th>Property</th>
   *      <th>Type</th>
   *      <th>Meaning</th>
   *    </thead>
   *    <tbody>
   *      <tr>
   *        <th><code>setUp</code></th>
   *        <td><code>Function</code></td>
   *        <td>Function that is called before each test case</td>
   *      </tr>
   *      <tr>
   *        <th><code>tearDown</code></th>
   *        <td><code>Function</code></td>
   *        <td>Function that is called after each test case</td>
   *      </tr>
   *      <tr>
   *        <th><code>tests</code></th>
   *        <td><code>Array</code> of <code>Function</code>s or of
   *            <code>Object</code>s with the following properties:
   *            <table>
   *              <thead>
   *                <th>Property</th>
   *                <th>Type</th>
   *                <th>Meaning</th>
   *              </thead>
   *              <tbody>
   *                <tr>
   *                  <th><code>name</code></th>
   *                  <td><code>String</code></td>
   *                  <td>Name of the test case</td>
   *                </tr>
   *                <tr>
   *                  <th><code>code</code></th>
   *                  <td><code>Function</code></td>
   *                  <td>Test case</td>
   *                </tr>
   *              </tbody>
   *            </table></td>
   *        <td>Test cases</td>
   *      </tr>
   *   </table>
   */
  run: (function() {
    var isNativeMethod = jsx.object.isNativeMethod;
    
    return function (spec) {
      var hasSetUp = false;
      var hasTearDown = false;
      
      if (spec)
      {
        hasSetUp = isNativeMethod(spec, 'setUp');
        if (hasSetUp)
        {
          this._setUp = spec.setUp;
        }
        
        hasTearDown = isNativeMethod(spec, 'tearDown');
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
      
      if (this._tests.length == 0)
      {
        return this.printMsg("No tests defined.", "info");
      }
      
      var result = {
        failed: 0,
        passed: 0
      };
      
      for (var i = 0, len = this._tests.length; i < len; ++i)
      {
        var test = this._tests[i];
        var number = i + 1;
        var name = "";
        
        if (test && typeof test != "function")
        {
          name = ' "' + test.name + '"';
          test = test.code;
        }
          
        if (hasSetUp)
        {
          this._setUp(i, test);
        }
        
        try
        {
          test(i);
          ++result.passed;
          this.printMsg("Test " + number + name + " passed.", "info");
        }
        catch (e)
        {
          ++result.failed;
          this.printMsg("Test " + number + name
            + " threw " + e + (e.stack ? "\n\n" + e.stack : ""),
            "warn");
        }

        if (hasTearDown)
        {
          this._tearDown(i, test);
        }
      }

      var msg = "info";
      if (result.failed > 0)
      {
        msg = "warn";
      }
      
      this.printMsg("Failed: " + result.failed + ". Passed: " + result.passed + ".", msg);
    };
  }()),
  
  setSetUp: function(f) {
    if (!jsx.object.isNativeMethod(f))
    {
      jsx.throwThis("jsx.InvalidArgumentError",
        ["", typeof f, "function"], "jsx.test.runner.setSetUp");
    }
    
    this._setUp = f;
  },
  
  setTearDown: function(f) {
    if (!jsx.object.isNativeMethod(f))
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
