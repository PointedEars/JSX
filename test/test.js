/**
 * <title>PointedEars' JSX: Test Library<title>
 * @file $Id$
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author (C) 2011-2013 Thomas Lahn &lt;js@PointedEars.de&gt;
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
  /* (for JSDT only) */
  jsx.test = {};
}

/**
 * @type jsx.test
 * @memberOf __jsx.test
 * @namespace
 */
jsx.test = (/** @constructor */ function () {
  var _isArray = jsx.object.isArray;
  var _isObject = jsx.object.isObject;
  var _throwThis = jsx.throwThis;

  /**
   * Number of assertions made
   * @private
   */
  var _assertCount = 0;

  function _increaseAssertCount ()
  {
    return ++_assertCount;
  }

  /**
   * @constructor
   * @namespace __jsx.test.AssertionError
   * @type jsx.test.AssertionError
   * @extends jsx.Error
   */
  var _AssertionError = (
    /**
     * @param {string} s
     */
    function jsx_test_AssertionError (s) {
      var _super = jsx_test_AssertionError._super;
      if (_super)
      {
        _super.call(this);
      }

      this.message = "Assertion failed: " + s;
    }
  ).extend(jsx.Error, {
    /**
     * @memberOf jsx.test.AssertionError#prototype
     */
    name: "jsx.test.AssertionError"
  });

  /**
   * @constructor
   * @namespace __jsx.test.ArrayComparisonFailure
   * @type jsx.test.ArrayComparisonFailure
   * @extends jsx.InvalidArgumentError
   * @private
   * @memberOf __jsx.test
   */
  var _ArrayComparisonFailure = (
    function jsx_test_ArrayComparisonFailure () {
      jsx_test_ArrayComparisonFailure._super.call(this, "Arrays expected");
    }
  ).extend(jsx.InvalidArgumentError, {
    /**
     * @memberOf __jsx.test.ArrayComparisonFailure.prototype
     */
    name: "jsx.test.ArrayComparisonFailure"
  });

  /**
   * @constructor
   * @namespace __jsx.test.ObjectComparisonFailure
   * @type jsx.test.ObjectComparisonFailure
   * @extends jsx.InvalidArgumentError
   * @private
   * @memberOf __jsx.test
   */
  var _ObjectComparisonFailure = (
    function jsx_test_ObjectComparisonFailure () {
      jsx_test_ObjectComparisonFailure._super.call(this, "Objects expected");
    }
  ).extend(jsx.InvalidArgumentError, {
    /**
     * @memberOf __jsx.test.ObjectComparisonFailure.prototype
     */
    name: "jsx.test.ObjectComparisonFailure"
  });

  return {
    /**
     * @version
     * @memberOf jsx.test
     */
    version: "$Revision$",

    /**
     * Increases the assertion count
     *
     * @return {Number} The new assertion count
     */
    increaseAssertCount: _increaseAssertCount,

    /**
     * Resets the assertion count
     *
     * @return {Number} <code>0</code>
     */
    resetAssertCount: function () {
      return (_assertCount = 0);
    },

    /**
     * @function
     */
    AssertionError: _AssertionError,

    /**
     * Asserts that a condition converts to true.  If it does not, it throws
     * an {@link #AssertionError} with a default message.
     *
     * @param {string|any} x
     *   If a string, it is evaluated as a <i>Program</i>; the assertion
     *   fails if its result, type-converted to <i>boolean</i>, is
     *   <code>false</code>.
     *   If not a string, the value is type-converted to <i>boolean</i>;
     *   the assertion fails if the result of the conversion is
     *   <code>false</code>.
     * @throws
     *   {@link #AssertionError} if the assertion fails and this exception
     *   can be thrown.
     * @return {boolean}
     *   <code>false</code>, if the assertion fails and no exception can be thrown;
     *   <code>true</code>, if the assertion is met.
     * @see Global#eval(String)
     */
    assert: function (x) {
      _increaseAssertCount();

      var origX = x;
      if (typeof x == "string")
      {
        x = eval(x);
      }

      if (!x)
      {
        return _throwThis(jsx.test.AssertionError,
          '"assert("' + (typeof origX == "string" ? origX : "...") + '");"');
      }

      return !!x;
    },

    /**
     * Asserts that a condition is boolean <code>true</code>.  If it isn't,
     * it throws an {@link #AssertionError} with a default message.
     *
     * @param {string|any} x
     *   If a string, it is evaluated as a <i>Program</i>; the assertion
     *   fails if its result, type-converted to <i>boolean</i>, is
     *   <code>false</code>.
     *   If not a string, the value is type-converted to <i>boolean</i>;
     *   the assertion fails if the result of the conversion is
     *   <code>false</code>.
     * @throws
     *   {@link #AssertionError} if the assertion fails and this exception
     *   can be thrown.
     * @return {boolean}
     *   <code>false</code>, if the assertion fails and no exception can be thrown;
     *   <code>true</code>, if the assertion is met.
     * @see Global#eval(String)
     */
    assertTrue: function (x) {
      _increaseAssertCount();

      var origX = x;
      if (typeof x == "string")
      {
        x = eval(x);
      }

      if (typeof x != "boolean" || !x)
      {
        return _throwThis(_AssertionError,
          "assertTrue(" + (typeof origX == "string" ? origX : "...") + ");");
      }

      return !!x;
    },

    /**
     * Asserts that a condition is false.  If it isn't, it throws
     * an {@link #AssertionError} with a default message.
     *
     * @param {string|any} x
     *   If a string, it is evaluated as a <i>Program</i>; the assertion
     *   fails if its result, type-converted to <i>boolean</i>, is
     *   <code>true</code>.
     *   If not a string, the value is type-converted to <i>boolean</i>;
     *   the assertion fails if the result of the conversion is
     *   <code>true</code>.
     * @param {boolean} bThrow = true
     *   If <code>true</code> (default), an exception will be thrown if
     *   the assertion fails, otherwise a warning will be issued to the
     *   error console in that case.
     * @param {String} sContext (optional)
     *   Description of the context in which the assertion was made.
     *   Ignored if <code><var>bThrow</var> == true</code>.
     * @throws
     *   {@link #AssertionError} if the assertion fails and this exception
     *   can be thrown.
     * @return {boolean}
     *   <code>false</code>, if the assertion fails and no exception can be thrown;
     *   <code>true</code>, if the assertion is met.
     * @see Global#eval(String)
     */
    assertFalse: function (x, bThrow, sContext) {
      _increaseAssertCount();

      var origX = x;
      if (typeof x == "string")
      {
        x = eval(x);
      }

      if (typeof x != "boolean" || x)
      {
        if (typeof bThrow == "undefined" || bThrow)
        {
          return _throwThis(_AssertionError,
              "assertFalse(" + (typeof origX == "string" ? origX : "...") + ");");
        }

        jsx.dmsg((sContext ? sContext + ": " : "") + "Assertion failed: "
          + (typeof origX == "string" ? origX : "Value") + " must be false.", "warn");
      }

      return !!x;
    },

    /**
     * Asserts that a condition is <code>undefined</code>.  If it isn't, it throws
     * an {@link #AssertionError} with a default message.
     *
     * @param {string|any} x
     *   If a string, it is evaluated as a <i>Program</i>; the assertion
     *   fails if its result, type-converted to <i>boolean</i>, is
     *   <code>true</code>.
     *   If not a string, the value is type-converted to <i>boolean</i>;
     *   the assertion fails if the result of the conversion is
     *   <code>true</code>.
     * @param {boolean} bThrow = true
     *   If <code>true</code> (default), an exception will be thrown if
     *   the assertion fails, otherwise a warning will be issued to the
     *   error console in that case.
     * @param {String} sContext (optional)
     *   Description of the context in which the assertion was made.
     *   Ignored if <code><var>bThrow</var> == true</code>.
     * @throws
     *   {@link #AssertionError} if the assertion fails and this exception
     *   can be thrown.
     * @return {boolean}
     *   <code>false</code>, if the assertion fails and no exception can be thrown;
     *   <code>true</code>, if the assertion is met.
     * @see Global#eval(String)
     */
    assertUndefined: function (x, bThrow, sContext) {
      _increaseAssertCount();

      var origX = x;
      if (typeof x == "string")
      {
        x = eval(x);
      }

      if (typeof x != "undefined")
      {
        if (typeof bThrow == "undefined" || bThrow)
        {
          return _throwThis(_AssertionError,
            "assertUndefined(" + (typeof origX == "string" ? origX : "...") + ");");
        }

        jsx.warn((sContext ? sContext + ": " : "") + "Assertion failed: "
          + (typeof origX == "string" ? origX : "Value") + " must be undefined.");
      }

      return !!x;
    },

    /**
     * Asserts that two arrays are equal.  If they are not,
     * an {@link #AssertionError} is thrown with a default message.
     * Two arrays are considered equal only if their elements are
     * strictly equal (shallow or deep strict comparison).
     *
     * @function
     * @throws
     *   {@link #ArrayComparisonFailure}
     *   if either of the given values is not a reference to an
     *   {@link Array}.
     * @throws
     *   {@link #AssertionError}
     *   if the assertion fails and either exception can be thrown.
     * @see Global#eval()
     */
    assertArrayEquals: (function () {
      function _thrower (expecteds, actuals)
      {
        return _throwThis(_AssertionError,
          "assertArrayEquals([" + expecteds + "], [" + actuals + "])");
      }

      /**
       * @param {string|Array} expecteds
       *   Expected value; if a string, it is evaluated as a <i>Program</i>.
       * @param {string|Array} actuals
       *   Actual value; if a string, it is evaluated as a <i>Program</i>.
       * @param {number} depth
       *   If <code>undefined</code> (default), shallow comparison
       *   is performed.  If not <code>0</code>, deep comparison
       *   is performed: if less than <code>0</code>, there is
       *   no limit as to the depth of the comparison; if greater
       *   than <code>0</code>, items are compared down to the
       *   specified depth.
       * @param {boolean} recursive
       *   Used internally to detect recursive assertions
       * @return {boolean}
       *   <code>false</code>, if comparison is not possible
       *   or the assertion fails, and no exception can be thrown;
       *   <code>true</code>, if the assertion is met.
       */
      return (
        function jsx_test_assertArrayEquals (expecteds, actuals, depth, recursive) {
          if (!recursive)
          {
            _increaseAssertCount();
          }

          if (typeof expecteds == "string")
          {
            expecteds = eval(expecteds);
          }

          if (typeof actuals == "string")
          {
            actuals = eval(actuals);
          }

          if (typeof expecteds == typeof actuals
              && expecteds == null && actuals == null)
          {
            return true;
          }

          if (!_isArray(expecteds) || !_isArray(actuals))
          {
            return _throwThis(_ArrayComparisonFailure);
          }

          var len = expecteds.length;
          var len2 = actuals.length;

          if (len != len2)
          {
            return _thrower(expecteds, actuals);
          }

          for (var i = len; i--;)
          {
            recursive = (typeof depth == "number" && depth != 0);
            var expected = expecteds[i];
            var actual = actuals[i];

            if (recursive && _isArray(expected) && _isArray(actual))
            {
              var new_level = ((depth < 0) ? depth : (depth - 1));
              jsx_test_assertArrayEquals(expected, actual, new_level, true);
            }
            else if (expected !== actual)
            {
              return _thrower(expecteds, actuals);
            }
          }

          return true;
        }
      );
    }()),

    /**
     * Asserts that two objects are equal.  If they are not,
     * an {@link #AssertionError} is thrown with a default message.
     * Two objects are considered equal only if their keys are
     * strictly equal (shallow strict comparison).
     *
     * @function
     * @throws
     *   {@link #ObjectComparisonFailure}
     *   if either of the given values is not a reference to an
     *   object.
     * @throws
     *   {@link #AssertionError}
     *   if the assertion fails and either exception can be thrown.
     * @see Global#eval()
     */
    assertObjectEquals: (function () {
      function _thrower (expecteds, actuals)
      {
        return _throwThis(_AssertionError,
          "assertObjectEquals(" + expecteds + ", " + actuals + ")");
      }

      /**
       * @param {string|Object} expecteds
       *   Expected value; if a string, it is evaluated as a <i>Program</i>.
       * @param {string|Object} actuals
       *   Actual value; if a string, it is evaluated as a <i>Program</i>.
       * @return {boolean}
       *   <code>false</code>, if comparison is not possible
       *   or the assertion fails, and no exception can be thrown;
       *   <code>true</code>, if the assertion is met.
       */
      return function (expecteds, actuals) {
        _increaseAssertCount();

        if (typeof expecteds == "string")
        {
          expecteds = eval(expecteds);
        }

        if (typeof actuals == "string")
        {
          actuals = eval(actuals);
        }

        if (typeof expecteds == typeof actuals
          && expecteds == null && actuals == null)
        {
          return true;
        }

        if (!_isObject(expecteds) || !_isObject(actuals))
        {
          return _throwThis(_ObjectComparisonFailure);
        }

        var keys = jsx.object.getKeys(expecteds);
        for (var i = keys.length; i--;)
        {
          var key = keys[i];
          if (expecteds[key] !== actuals[key])
          {
            return _thrower(expecteds, actuals);
          }
        }

        keys = jsx.object.getKeys(actuals);
        for (i = keys.length; i--;)
        {
          key = keys[i];
          if (expecteds[key] !== actuals[key])
          {
            return _thrower(expecteds, actuals);
          }
        }

        return true;
      };
    }()),

    runner: {
      tests: [],

      _table: null,

      /**
       * @protected
       */
      _appendTable: function () {
        if (typeof document != "object" || !document)
        {
          return;
        }

        if (!document.body)
        {
          this._printMsg(
            "No document.body found (at this point)."
            + " Use {updateDocument: false} if not in HTML context,"
            + " or wait until document.body exists (`load' event).",
            "warn");
          return;
        }

        var id = "test-results" + new Date().getTime();
        var context = "table#" + id;
        var style = document.createElement("style");
        style.type = "text/css";
        var styleText =
            context + " { border: 2px solid black;"
                    + " border-collapse: collapse; }"
          + context + " thead { border-bottom: 1px solid black; }"
          + context + " thead th { vertical-align: baseline; }"
          + context + " tfoot { border-top: 1px solid black; }"
          + context + " thead th { text-align: left; }"
          + context + " thead th:first-child { text-align: right; }"
          + context + " tbody th { text-align: right; }"
          + context + " tbody td.info {"
                      + " background-color: green; color: white; }"
          + context + " tbody td.error {"
                      + " background-color: red;"
                      + " color: white; font-family: monospace; }"
          + context + " thead th,"
          + context + " tbody th,"
          + context + " tbody td,"
          + context + " tfoot td {"
                      + " padding: 0 0.5em;"
                      + " vertical-align: top;"
                      + " vertical-align: baseline; }";
        if (typeof style.styleSheet != "undefined")
        {
          /* Older MSHTML */
          style.styleSheet.cssText = styleText;
        }
        else
        {
          style.appendChild(document.createTextNode(styleText));
        }

        (document.head || document.getElementsByTagName("head")[0]).appendChild(style);

        var table = document.createElement("table");
        table.id = id;
        this._table = table;

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

        var tests = this._tests;
        for (var i = 0, len = tests.length; i < len; ++i)
        {
          var test = tests[i];
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

          this._appendRow(number, file, feature, description);
        }

        document.body.appendChild(table);
      },

      /**
       * @protected
       * @param {String} text
       */
      _htmlEscape: function (text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;")
          .replace(/>/g, "&gt;").replace(/  /g, "&nbsp; ");
      },

      /**
       * @protected
       * @param {int} num
       * @param {string} file
       * @param {string} feature
       * @param {string} desc
       */
      _appendRow: function (num, file, feature, desc) {
        var table = this._table;
        if (!table)
        {
          return;
        }

        var tbody = table.tBodies[0];

        var tr = document.createElement("tr");

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
        td.id = table.id + "-" + num;
        td.innerHTML = "testing…";

        tr.appendChild(td);

        tbody.appendChild(tr);
      },

      /**
       * Updates a result cell
       *
       * @protected
       * @param {int} rowNum
       *   Row number
       * @param {string} result
       * @param {string} msgType
       */
      _updateResult: function (rowNum, result, msgType) {
        var td = document.getElementById(this._table.id + "-" + rowNum);
        if (td)
        {
          /* FIXME: Use standards-compliant methods instead */
          td.innerHTML = this._htmlEscape(result).replace(/\r?\n|\r/g, "<br>");

          td.className = msgType;
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
       * @param {String} msg
       * @param {String} msgType
       */
      _printMsg: function (msg, msgType) {
        return jsx[msgType]("jsx.test.runner: " + msg);
      },

      /**
       * Strips tags from markup and unescapes basic character
       * entity references.
       *
       * @protected
       * @param {String} markup
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
        this._updateResult(num, result, msgType);
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

      /**
       * @protected
       * @param result
       */
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
       * Runs test cases.
       *
       * @param {Object} spec
       *   Test specification.  Supported properties incude:
       *   <table>
       *     <thead>
       *       <th>Property</th>
       *       <th>Type</th>
       *       <th>Meaning</th>
       *     </thead>
       *     <tbody>
       *       <tr>
       *         <th><code>file</code></th>
       *         <td><code>String</code></td>
       *         <td>Name of the file that contains the code
       *             to be tested. The default is the empty string.
       *             <em>NOTE: This is a purely descriptive value.
       *             No resources will be accessed based on this
       *             value.</em></td>
       *       </tr>
       *       <tr>
       *         <th><code>feature</code></th>
       *         <td><code>String</code></td>
       *         <td>Code describing the feature that is tested.
       *           The default is the empty string.</td>
       *       </tr>
       *       <tr>
       *         <th><code>setUp</code></th>
       *         <td><code>Function</code></td>
       *         <td>Function that is called before each test case</td>
       *       </tr>
       *       <tr>
       *         <th><code>tearDown</code></th>
       *         <td><code>Function</code></td>
       *         <td>Function that is called after each test case</td>
       *       </tr>
       *       <tr>
       *         <th><code>tests</code></th>
       *         <td><code>Array</code> of <code>Function</code>s or of
       *             <code>Object</code>s with the following properties:
       *             <table>
       *               <thead>
       *                 <th>Property</th>
       *                 <th>Type</th>
       *                 <th>Meaning</th>
       *               </thead>
       *               <tbody>
       *                 <tr>
       *                   <th><code>file</code></th>
       *                   <td><code>String</code></td>
       *                   <td>Name of the file that contains the code
       *                       to be tested.  The default is the
       *                       value of the specification's
       *                       <code>file</code> property.
       *                       <em>NOTE: This is a purely descriptive value.
       *                       No resources will be accessed based on this
       *                      value.</em></td></td>
       *                 </tr>
       *                 <tr>
       *                   <th><code>feature</code></th>
       *                   <td><code>String</code></td>
       *                   <td>Code describing the feature that is tested.
       *                     The default is the value of the specification's
       *                     <code>feature</code> property.</td>
       *                 </tr>
       *                 <tr>
       *                   <th><code>description</code> | <code>desc</code>
       *                       | <code>name</code></th>
       *                   <td><code>String</code></td>
       *                   <td>Description/name of the test case.
       *                       Use <code>description</code> or
       *                       <code>desc</code> for newer
       *                       test code.</td>
       *                 </tr>
       *                 <tr>
       *                   <th><code>code</code></th>
       *                   <td><code>Function</code></td>
       *                   <td>Test case</td>
       *                 </tr>
       *               </tbody>
       *             </table></td>
       *         <td>Test cases</td>
       *       </tr>
       *       <tr>
       *         <th><code>updateDocument</code></th>
       *         <td><code>boolean</code></td>
       *         <td>If <code>false</code>, the (X)HTML document
       *             containing or including the call is not updated, and
       *             diagnostics are only written to the error console.
       *             The default is <code>true</code>.  Set to
       *             <code>false</code> automatically if there is
       *             no <code>document.body</code> object.</td>
       *       </tr>
       *     </tbody>
       *   </table>
       */
      run: function (spec) {
        var hasSetUp = false;
        var hasTearDown = false;
        var tests;

        if (spec)
        {
          this._file = jsx.object.getProperty(spec, "file", "");
          this._feature = jsx.object.getProperty(spec, "feature", "");

          hasSetUp = (typeof spec.setUp == "function");
          if (hasSetUp)
          {
            this._setUp = spec.setUp;
          }

          hasTearDown = (typeof spec.tearDown == "function");
          if (hasTearDown)
          {
            this._tearDown = spec.tearDown;
          }

          if (spec.tests)
          {
            this.setTests(spec.tests);
          }
        }

        tests = this._tests;
        if (tests.length == 0)
        {
          return this._printMsg("No tests defined.", "info");
        }

        this._appendTable();

        tests.result = {
          failed: 0,
          passed: 0
        };

        var hasSetTimeout = jsx.object.isMethod(jsx.global, "window", "setTimeout");
        var hasClearTimeout = jsx.object.isMethod(jsx.global, "window", "clearTimeout");
        var me = this;
        for (var i = 0, len = tests.length; i < len; ++i)
        {
          if (hasSetTimeout)
          {
            /* Asynchronous testing allows GUI thread to paint table */
            (function (i) {
              var timeout = window.setTimeout(function () {
                me._runTest(i, hasSetUp, hasTearDown);

                if (hasClearTimeout)
                {
                  window.clearTimeout(timeout);
                }
              }, 50);
            }(i));
          }
          else
          {
            this._runTest(i, hasSetUp, hasTearDown);
          }
        }
      },

      /**
       * @protected
       */
      _runTest: function (i, hasSetUp, hasTearDown) {
        var tests = this._tests;
        var test = tests[i];
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
          ++tests.result.passed;
          this._printResult(number, file, feature, description,
              "passed", "info");
        }
        catch (e)
        {
          ++tests.result.failed;
          this._printResult(number, file, feature, description,
              "threw " + e + (e.stack ? "\n\n" + e.stack : ""),
              "error");
        }

        if (hasTearDown)
        {
          this._tearDown(i, test);
        }

        if (i == tests.length - 1)
        {
          this._printSummary(tests.result);
        }
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
        if (typeof f != "function")
        {
          _throwThis("jsx.InvalidArgumentError",
            ["", typeof f, "function"], "jsx.test.runner.setSetUp");
        }

        this._setUp = f;
        return this;
      },

      setTearDown: function (f) {
        if (typeof f != "function")
        {
          _throwThis("jsx.InvalidArgumentError", ["", typeof f, "function"]);
        }

        this._tearDown = f;
        return this;
      },

      setTests: function (tests) {
        var _class = jsx.object.getClass(tests);
        if (_class != "Array")
        {
          _throwThis("jsx.InvalidArgumentError", ["", _class, "Array"]);
        }

        this._tests = tests;
        return this;
      }
    }
  };
}());