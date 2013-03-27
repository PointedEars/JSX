function runTests ()
{
  var assertFalse = jsx.test.assertFalse;
  var assertTrue = jsx.test.assertTrue;

  jsx.test.runner.run({
    file: "date.js",
    tests: [
      {
        feature: "Date.isValid()",
        desc: "Missing year/month/date throws <code>jsx.InvalidArgumentError</code>",
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
        feature: "Date.isValid()",
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
      }
    ]
  });
}