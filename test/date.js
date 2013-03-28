function runTests ()
{
  var assertFalse = jsx.test.assertFalse;
  var assertTrue = jsx.test.assertTrue;

  jsx.test.runner.run({
    file: "date.js",
    tests: [
      {
        feature: "Date.isValid()",
        desc: "Missing <code><var>year</var></code>"
            + "/<code><var>month</var></code>"
            + "/<code><var>date</var></code>"
            + " throws <code>jsx.InvalidArgumentError</code>",
        code: function () {
          /* no year */
          var error = jsx.tryThis("Date.isValid()",
            function (e) {
              jsx.dmsg(e);
              return (e instanceof jsx.InvalidArgumentError);
            });
          assertTrue(error);

          /* no month */
          error = jsx.tryThis("Date.isValid(2013)",
            function (e) {
              jsx.dmsg(e);
              return (e instanceof jsx.InvalidArgumentError);
            });
          assertTrue(error);

          /* no date */
          error = jsx.tryThis("Date.isValid(2013, 2)",
            function (e) {
              jsx.dmsg(e);
              return (e instanceof jsx.InvalidArgumentError);
            });
          assertTrue(error);
        }
      },
      {
        feature: "Date.isValid(…)",
        desc: "Detect valid and invalid datetimes",
        code: function () {
          /* date */
          assertTrue(Date.isValid(2013, 1, 28));
          assertFalse(Date.isValid(2013, 1, 0));
          assertFalse(Date.isValid(2013, 1, 29));

          /* hours */
          assertTrue(Date.isValid(2013, 1, 1, 0));
          assertFalse(Date.isValid(2013, 1, 1, -1));
          assertFalse(Date.isValid(2013, 1, 1, 25));

          /* minutes */
          assertTrue(Date.isValid(2013, 1, 1, 0, 0));
          assertFalse(Date.isValid(2013, 1, 1, 0, -1));
          assertFalse(Date.isValid(2013, 1, 1, 0, 60));

          /* seconds */
          assertTrue(Date.isValid(2013, 1, 1, 0, 0, 0));
          assertFalse(Date.isValid(2013, 1, 1, 0, 0, -1));
          assertFalse(Date.isValid(2013, 1, 1, 0, 0, 60));

          /* milliseconds */
          assertTrue(Date.isValid(2013, 1, 1, 0, 0, 0, 0));
          assertFalse(Date.isValid(2013, 1, 1, 0, 0, 0, -1));
          assertFalse(Date.isValid(2013, 1, 1, 0, 0, 0, 1000));
        }
      },
      {
        feature: "Date.prototype.strftime()",
        desc: "Missing <code><var>format</var></code>"
            + " throws <code>jsx.InvalidArgumentError</code>",
        code: function () {
          var error = jsx.tryThis("new Date().strftime()",
            function (e) {
              jsx.dmsg(e);
              return (e instanceof jsx.InvalidArgumentError);
            });
          assertTrue(error);
        }
      },
      {
        feature: 'new Date().strftime("")',
        desc: 'Return <code>""</code>',
        code: function () {
          assertTrue(new Date().strftime("") === "");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%a")',
        desc: 'Return <code>"Tue"</code> (Tuesday)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%a") === "Tue");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%A")',
        desc: 'Return <code>"Tuesday"</code>',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%A") === "Tuesday");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%d")',
        desc: 'Return <code>"01"</code>',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%d") === "01");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%e")',
        desc: 'Return <code>"\\u00A01"</code> (<code>=== "\u00A01"</code>)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%e") === "\u00A01");
        }
      },
      {
        feature: 'new Date(2013, 0, 6).strftime("%u")',
        desc: 'Return <code>"7"</code> (ISO&nbsp;8601 Sunday)',
        code: function () {
          assertTrue(new Date(2013, 0, 6).strftime("%u") === "7");
        }
      },
      {
        feature: 'new Date(2013, 0, 6).strftime("%w")',
        desc: 'Return <code>"0"</code> (Sunday)',
        code: function () {
          assertTrue(new Date(2013, 0, 6).strftime("%w") === "0");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%b")',
        desc: 'Return <code>"Jan"</code> (January)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%b") === "Jan");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%h")',
        desc: 'Return <code>"Jan"</code> (January)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%h") === "Jan");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%B")',
        desc: 'Return <code>"January"</code>',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%B") === "January");
        }
      },
      {
        feature: 'new Date(2013, 8, 1).strftime("%m")',
        desc: 'Return <code>"09"</code> (September)',
        code: function () {
          assertTrue(new Date(2013, 8, 1).strftime("%m") === "09");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%C")',
        desc: 'Return <code>"20"</code> (21st century)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%C") === "20");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%y")',
        desc: 'Return <code>"13"</code> (2013)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%y") === "13");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).strftime("%Y")',
        desc: 'Return <code>"2013"</code> (CE)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%Y") === "2013");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 9).strftime("%H")',
        desc: 'Return <code>"09"</code> (hours)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 9).strftime("%H") === "09");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 9).strftime("%k")',
        desc: 'Return <code>"\\u00A09"</code> (<code>=== "\u00A09"</code> hours)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 9).strftime("%k") === "\u00A09");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 0).strftime("%I")',
        desc: 'Return <code>"12"</code> (am)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 0).strftime("%I") === "12");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 9).strftime("%I")',
        desc: 'Return <code>"09"</code> (am)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 9).strftime("%I") === "09");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 13).strftime("%I")',
        desc: 'Return <code>"01"</code> (pm)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 13).strftime("%I") === "01");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 0).strftime("%l")',
        desc: 'Return <code>"12"</code> (am)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 0).strftime("%l") === "12");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 9).strftime("%l")',
        desc: 'Return <code>"\\u00A09"</code> (<code>=== "\u00A09"</code> am)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 9).strftime("%l") === "\u00A09");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 13).strftime("%l")',
        desc: 'Return <code>"\\u00A01"</code> (<code>=== "\u00A01"</code> pm)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 13).strftime("%l") === "\u00A01");
        }
      }
    ]
  });
}