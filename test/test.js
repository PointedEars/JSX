/**
 * <title>PointedEars' JSX: Test Library<title>
 * @version $Id$
 *
 * @filename test.js
 * @requires object.js
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2011, 2012 Thomas Lahn &lt;js@PointedEars.de&gt;
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

jsx.test.version = "$Revision$";

/**
 * @param s : string
 */
jsx.test.AssertionError = function (s) {
  var _super = arguments.callee._super;
  if (_super)
  {
    _super.call(this);
  }
  
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
  
  _table: null,
  
  /**
   * @protected
   */
  _appendTable: function () {
    if (typeof document == "object" && document)
    {
      if (document.body)
      {
        var id = "test-results" + new Date().getTime();
        var context = "table#" + id;
        var style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(
          document.createTextNode(
              context + " { border: 2px solid black; border-collapse: collapse; }"
            + context + " thead { border-bottom: 1px solid black; }"
            + context + " thead th { vertical-align: baseline; }"
            + context + " tfoot { border-top: 1px solid black; }"
            + context + " thead th { text-align: left; }"
            + context + " thead th:first-child { text-align: right; }"
            + context + " tbody th { text-align: right; }"
            + context + " tbody td.info { background-color: green; color: white; }"
            + context + " tbody td.error { background-color: red; color: white; }"
            + context + " thead th,"
            + context + " tbody th,"
            + context + " tbody td,"
            + context + " tfoot td { padding: 0 0.5em;"
                                 + " vertical-align: top;"
                                 + " vertical-align: baseline; }"
          ));
        document.getElementsByTagName("head")[0].appendChild(style);
                
        var table = document.createElement("table");
        table.id = id;
        
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        
        var th = document.createElement("th");
        th.appendChild(document.createTextNode("#"));
        tr.appendChild(th);

        th = document.createElement("th");
        th.appendChild(document.createTextNode("Source File"));
        tr.appendChild(th);
        
        th = document.createElement("th");
        th.appendChild(document.createTextNode("Feature"));
        tr.appendChild(th);
        
        th = document.createElement("th");
        th.appendChild(document.createTextNode("Testcase Description"));
        tr.appendChild(th);
        
        th = document.createElement("th");
        th.appendChild(document.createTextNode("Result"));
        tr.appendChild(th);
        
        thead.appendChild(tr);
        table.insertBefore(thead, table.firstChild);

        var tbody = document.createElement("tbody");
        table.appendChild(tbody);
        
        document.body.appendChild(table);
        this._table = table;
      }
      else
      {
        this._printMsg(
          "No document.body found (at this point)."
          + " Use {updateDocument: false} if not in HTML context,"
          + " or wait until document.body exists (`load' event).",
          "warn");
      }
    }
  },
  
  /**
   * @protected
   * @param text : String
   */
  _htmlEscape: function (text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },
  
  /**
   * @protected
   */
  _appendEntry: function (num, file, feature, desc, result, msgType) {
    if (this._table)
    {
      var tbody = this._table.tBodies[0];
      
      var tr = document.createElement("tr");
      tr.className = msgType;
      
      var th = document.createElement("th");
      th.appendChild(document.createTextNode(num));
      tr.appendChild(th);
      
      var td = document.createElement("td");
      if (file)
      {
        var tt = document.createElement("tt");
        tt.appendChild(document.createTextNode(this._htmlEscape(file)));
        td.appendChild(tt);
      }
      tr.appendChild(td);
      
      td = document.createElement("td");
      if (feature)
      {
        var code = document.createElement("code");
        code.appendChild(document.createTextNode(this._htmlEscape(feature)));
        td.appendChild(code);
      }
      tr.appendChild(td);

      td = document.createElement("td");
      if (desc)
      {
        td.innerHTML = desc;
      }
      tr.appendChild(td);
      
      td = document.createElement("td");
      td.appendChild(document.createTextNode(this._htmlEscape(result)));
      td.className = msgType;
      tr.appendChild(td);
      
      tbody.appendChild(tr);
    }
  },
  
  /**
   * @protected
   */
  _appendSummary: function (text) {
    if (this._table)
    {
      var tbody = this._table.tBodies[0];
      
      var tfoot = document.createElement("tfoot");
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.colSpan = 5;
      td.appendChild(document.createTextNode(text));
      tr.appendChild(td);
      tfoot.appendChild(tr);
      
      this._table.insertBefore(tfoot, tbody);
    }
  },
  
  /**
   * @protected
   * @param msg : String
   * @param msgType : String
   */
  _printMsg: function (msg, msgType) {
    return jsx[msgType]("jsx.test.runner: " + msg);
  },
  
  /**
   * Strips tags from markup and unescapes basic character
   * entity references.
   * 
   * @protected
   * @param markup : String
   */
  _stripTags: function (markup) {
    return markup
      .replace(/<\/?[^\s>]+(:[^\s>]+)?(\s+[^\s=>]+(\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)?)?)*\s*>/g, "")
      .replace(/&lt;/, "<").replace(/&gt;/, ">").replace(/&amp;/, "&");
  },
  
  /**
   * Prints the result to the error console, and, if supported,
   * to the document.
   * 
   * @protected
   * @param num
   * @param file
   * @param feature
   * @param desc
   * @param result
   * @param msgType
   */
  _printResult: function (num, file, feature, desc, result, msgType) {
    this._appendEntry(num, file, feature, desc, result, msgType);
    this._printMsg("Test " + num
      + (file || feature ? ", " : "")
      + file
      + (feature ? ":" + feature : "")
      + (file || feature ? "," : "")
      + (desc ? ' "' + this._stripTags(desc) + '"' : "")
      + (file || feature ? "," : "")
      + " " + result,
      msgType);
  },
  
  _printSummary: function (result) {
    var failed = result.failed;
    var passed = result.passed;
    var total = failed + passed;
    var summary = "Failed: " + failed + " (" + (failed * 100 / total).toFixed(1) + "\xA0%)."
      + " Passed: " + passed + " (" + (passed * 100 / total).toFixed(1) + "\xA0%).";
    this._appendSummary(summary);
    this._printMsg(summary, "info");
  },
  
  /**
   * Runs test cases
   * 
   * @function
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
   *        <th><code>file</code></th>
   *        <td><code>String</code></td>
   *        <td>Name of the file that contains the code
   *            to be tested. The default is the empty string.
   *            <em>NOTE: This is a purely descriptive value.
   *            No resources will be accessed based on this
   *            value.</em></td>
   *      </tr>
   *      <tr>
   *        <th><code>feature</code></th>
   *        <td><code>String</code></td>
   *        <td>Code describing the feature that is tested.
   *          The default is the empty string.</td>
   *      </tr>
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
   *                  <th><code>file</code></th>
   *                  <td><code>String</code></td>
   *                  <td>Name of the file that contains the code
   *                      to be tested.  The default is the
   *                      value of the specification's
   *                      <code>file</code> property.
   *                      <em>NOTE: This is a purely descriptive value.
   *                      No resources will be accessed based on this
   *                      value.</em></td></td>
   *                </tr>
   *                <tr>
   *                  <th><code>feature</code></th>
   *                  <td><code>String</code></td>
   *                  <td>Code describing the feature that is tested.
   *                    The default is the value of the specification's
   *                    <code>feature</code> property.</td>
   *                </tr>
   *                <tr>
   *                  <th><code>description</code> | <code>desc</code> | <code>name</code></th>
   *                  <td><code>String</code></td>
   *                  <td>Description/name of the test case.
   *                      Use <code>description</code> or
   *                      <code>desc</code> for newer
   *                      test code.</td>
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
   *      <tr>
   *        <th><code>updateDocument</code></th>
   *        <td><code>boolean</code></td>
   *        <td>If <code>false<code>, the (X)HTML document
   *            containing or including the call is not updated, and
   *            diagnostics are only written to the error console.
   *            The default is <code>true</code>.  Set to
   *            <code>false</code> automatically if there is
   *            no <code>document.body</code> object.</td>
   *      </tr>
   *   </table>
   */
  run: (function () {
    var isNativeMethod = jsx.object.isNativeMethod;
    
    return function (spec) {
      var hasSetUp = false;
      var hasTearDown = false;
      
      if (spec)
      {
        this._file = jsx.object.getProperty(spec, 'file', "");
        this._feature = jsx.object.getProperty(spec, 'feature', "");

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
        return this._printMsg("No tests defined.", "info");
      }
      
      var result = {
        failed: 0,
        passed: 0
      };
      
      this._appendTable();
      
      for (var i = 0, len = this._tests.length; i < len; ++i)
      {
        var test = this._tests[i];
        var number = i + 1;
        var file = this._file;
        var feature = this._feature;
        var description = "";
        
        if (test && typeof test != "function")
        {
          if (test.file)
          {
            file = test.file;
          }
          
          if (test.feature)
          {
            feature = test.feature;
          }
          
          description = test.description || test.desc || test.name;
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
          this._printResult(number, file, feature, description,
              "passed", "info");
        }
        catch (e)
        {
          ++result.failed;
          this._printResult(number, file, feature, description,
              "threw " + e + (e.stack ? "\n\n" + e.stack : ""),
              "error");
        }

        if (hasTearDown)
        {
          this._tearDown(i, test);
        }
      }

      this._printSummary(result);
    };
  }()),
  
  runAsync: function () {
    var args = arguments;
    var _run = this.run;
    var jsx_dom_timeout = jsx.object.getFeature(jsx, "dom", "timeout");
    if (jsx_dom_timeout)
    {
      var me = this;
//      return jsx_dom_timeout.runAsync(
//        function () {
//          _run.apply(me, args);
//        });
      return jsx_dom_timeout.runAsync(
        function () {
          _run.apply(me, args);
        });
    }
    
    return _run.apply(this, args);
  },
  
  setFile: function (file) {
    this._file = file;
    return this;
  },
  
  setFeature: function (feature) {
    this._feature = feature;
    return this;
  },
  
  setSetUp: function (f) {
    if (!jsx.object.isNativeMethod(f))
    {
      jsx.throwThis("jsx.InvalidArgumentError",
        ["", typeof f, "function"], "jsx.test.runner.setSetUp");
    }
    
    this._setUp = f;
    return this;
  },
    
  setTearDown: function (f) {
    if (!jsx.object.isNativeMethod(f))
    {
      jsx.throwThis("jsx.InvalidArgumentError", ["", typeof f, "function"]);
    }
    
    this._tearDown = f;
    return this;
  },
  
  setTests: function (tests) {
    var _class = jsx.object.getClass(tests);
    if (_class != "Array")
    {
      jsx.throwThis("jsx.InvalidArgumentError", ["", _class, "Array"]);
    }
     
    this._tests = tests;
    return this;
  }
};
