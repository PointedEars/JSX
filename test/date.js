function runTests ()
{
  var assertFalse = jsx.test.assertFalse;
  var assertTrue = jsx.test.assertTrue;

  jsx.test.runner.run({
    file: "date.js",
    tests: [
      {
        feature: "jsx.date.dayOfYear(new Date(…))",
        desc: "Return the correct day number",
        code: function () {
          assertTrue(jsx.date.dayOfYear(new Date(2013, 0, 31)) === 31);
          assertTrue(jsx.date.dayOfYear(new Date(2013, 1, 28)) === 59);
          assertTrue(jsx.date.dayOfYear(new Date(2013, 2, 1)) === 60);
          assertTrue(jsx.date.dayOfYear(new Date(2013, 2, 31)) === 90);

          /* Leap year has 366 days */
          assertTrue(jsx.date.dayOfYear(new Date(2016, 11, 31)) === 366);
        }
      },
      {
        feature: "new Date(…).getDayOfYear()",
        desc: "Return the correct day number",
        code: function () {
          assertTrue(new Date(2013, 0, 31).getDayOfYear() === 31);
          assertTrue(new Date(2013, 1, 28).getDayOfYear() === 59);
          assertTrue(new Date(2013, 2, 1).getDayOfYear() === 60);
          assertTrue(new Date(2013, 2, 31).getDayOfYear() === 90);

          /* Leap year has 366 days */
          assertTrue(new Date(2016, 11, 31).getDayOfYear() === 366);
        }
      },
      {
        feature: "jsx.date.isValid()",
        desc: "Missing <code><var>year</var></code>"
          + "/<code><var>month</var></code>"
          + "/<code><var>date</var></code>"
          + " throws <code>jsx.InvalidArgumentError</code>",
          code: function () {
            /* no year */
            var error = jsx.tryThis("jsx.date.isValid()",
              function (e) {
              jsx.dmsg(e);
              return (e instanceof jsx.InvalidArgumentError);
            });
            assertTrue(error);

            /* no month */
            error = jsx.tryThis("jsx.date.isValid(2013)",
              function (e) {
              jsx.dmsg(e);
              return (e instanceof jsx.InvalidArgumentError);
            });
            assertTrue(error);

            /* no date */
            error = jsx.tryThis("jsx.date.isValid(2013, 2)",
              function (e) {
              jsx.dmsg(e);
              return (e instanceof jsx.InvalidArgumentError);
            });
            assertTrue(error);
          }
      },
      {
        feature: "jsx.date.isValid(…)",
        desc: "Detect valid and invalid datetimes",
        code: function () {
          /* date */
          assertTrue(jsx.date.isValid(2013, 1, 28));
          assertFalse(jsx.date.isValid(2013, 1, 0));
          assertFalse(jsx.date.isValid(2013, 1, 29));

          /* hours */
          assertTrue(jsx.date.isValid(2013, 1, 1, 0));
          assertFalse(jsx.date.isValid(2013, 1, 1, -1));
          assertFalse(jsx.date.isValid(2013, 1, 1, 25));

          /* minutes */
          assertTrue(jsx.date.isValid(2013, 1, 1, 0, 0));
          assertFalse(jsx.date.isValid(2013, 1, 1, 0, -1));
          assertFalse(jsx.date.isValid(2013, 1, 1, 0, 60));

          /* seconds */
          assertTrue(jsx.date.isValid(2013, 1, 1, 0, 0, 0));
          assertFalse(jsx.date.isValid(2013, 1, 1, 0, 0, -1));
          assertFalse(jsx.date.isValid(2013, 1, 1, 0, 0, 60));

          /* milliseconds */
          assertTrue(jsx.date.isValid(2013, 1, 1, 0, 0, 0, 0));
          assertFalse(jsx.date.isValid(2013, 1, 1, 0, 0, 0, -1));
          assertFalse(jsx.date.isValid(2013, 1, 1, 0, 0, 0, 1000));
        }
      },
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
        feature: "jsx.date.isLeapYear(…)",
        desc: "Return the correct value",
        code: function () {
          /* not divisible by 4 */
          assertFalse(jsx.date.isLeapYear(1995));

          /* divisible by 4 */
          assertTrue(jsx.date.isLeapYear(1996));

          /* divisible by 4, but also by 100 */
          assertFalse(jsx.date.isLeapYear(2100));

          /* divisible by 4, and by 100, but also by 400 */
          assertTrue(jsx.date.isLeapYear(2000));
        }
      },
      {
        feature: "Date.isLeapYear(…)",
        desc: "Return the correct value",
        code: function () {
          /* not divisible by 4 */
          assertFalse(Date.isLeapYear(1995));

          /* divisible by 4 */
          assertTrue(Date.isLeapYear(1996));

          /* divisible by 4, but also by 100 */
          assertFalse(Date.isLeapYear(2100));

          /* divisible by 4, and by 100, but also by 400 */
          assertTrue(Date.isLeapYear(2000));
        }
      },

      {
        feature: "jsx.date.isoWeekday(new Date(…))",
        desc: "Return the correct value",
        code: function () {
          assertTrue(jsx.date.isoWeekday(new Date(2013, 0, 1)) === 2);
          assertTrue(jsx.date.isoWeekday(new Date(2013, 0, 7)) === 1);
          assertTrue(jsx.date.isoWeekday(new Date(2013, 0, 13)) === 7);
        }
      },
      {
        feature: "new Date(…).getISOWeekday()",
        desc: "Return the correct value",
        code: function () {
          assertTrue(new Date(2013, 0, 1).getISOWeekday() === 2);
          assertTrue(new Date(2013, 0, 7).getISOWeekday() === 1);
          assertTrue(new Date(2013, 0, 13).getISOWeekday() === 7);
        }
      },

      {
        feature: "jsx.date.isoWeekNumber(new Date(…))",
        desc: "Return the correct value",
        code: function () {
          assertTrue(jsx.date.isoWeekNumber(new Date(2012, 0, 1)) === 52);
          assertTrue(jsx.date.isoWeekNumber(new Date(2012, 0, 7)) === 1);
          assertTrue(jsx.date.isoWeekNumber(new Date(2013, 0, 1)) === 1);
          assertTrue(jsx.date.isoWeekNumber(new Date(2013, 0, 7)) === 2);
        }
      },

      {
        feature: 'jsx.date.tzOffsetHours(new Date(…))',
        desc: "Return the correct value (works in CE[S]T only)",
        code: function () {
          var d = new Date(2013, 0, 1);
          var d2 = new Date(2013, 3, 1);

          var o = jsx.date.tzOffsetHours(d);
          assertTrue(o.hours === 1 && o.minutes === 0);

          var o = jsx.date.tzOffsetHours(d2);
          assertTrue(o.hours === 2 && o.minutes === 0);
        }
      },

      {
        feature: 'jsx.date.tzOffsetHours(new Date(…), null)',
        desc: "Return the correct value (works in CE[S]T only)",
        code: function () {
          var d = new Date(2013, 0, 1);
          var d2 = new Date(2013, 3, 1);

          var s = jsx.date.tzOffsetHours(d, null);
          assertTrue(s === "+1");

          var s = jsx.date.tzOffsetHours(d2, null);
          assertTrue(s === "+2");
        }
      },

      {
        feature: 'jsx.date.tzOffsetHours(new Date(…), {…})',
        desc: "Return the correct value (works in CE[S]T only)",
        code: function () {
          var d = new Date(2013, 0, 1);
          var d2 = new Date(2013, 3, 1);

          var options = {leadingZero: true};
          assertTrue(jsx.date.tzOffsetHours(d, options) === "+01");
          assertTrue(jsx.date.tzOffsetHours(d2, options) === "+02");

          options = {zeroMinutes: true};
          assertTrue(jsx.date.tzOffsetHours(d, options) === "+100");
          assertTrue(jsx.date.tzOffsetHours(d2, options) === "+200");

          options = {leadingZero: true, zeroMinutes: true};
          assertTrue(jsx.date.tzOffsetHours(d, options) === "+0100");
          assertTrue(jsx.date.tzOffsetHours(d2, options) === "+0200");

          options = {zeroMinutes: true, delimiter: ":"};
          assertTrue(jsx.date.tzOffsetHours(d, options) === "+1:00");
          assertTrue(jsx.date.tzOffsetHours(d2, options) === "+2:00");

          options = {leadingZero: true, zeroMinutes: true, delimiter: ":"};
          assertTrue(jsx.date.tzOffsetHours(d, options) === "+01:00");
          assertTrue(jsx.date.tzOffsetHours(d2, options) === "+02:00");
        }
      },

      {
        feature: "new Date().format()",
        desc: "Missing <code><var>format</var></code>"
          + " throws <code>jsx.InvalidArgumentError</code>",
          code: function () {
            var error = jsx.tryThis("new Date().format()",
              function (e) {
              jsx.dmsg(e);
              return (e instanceof jsx.InvalidArgumentError);
            });
            assertTrue(error);
          }
      },
      {
        feature: 'new Date().format("")',
        desc: 'Return <code>""</code>',
        code: function () {
          assertTrue(new Date().format("") === "");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).format("\\\\W")',
        desc: 'Return <code>"W"</code> (literal)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).format("\\W") === "W");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).format("W|WW|WWW|WWWW")',
        desc: 'Return <code>"T|Tu|Tue|Tuesday"</code> (weekday)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).format("W|WW|WWW|WWWW") === "T|Tu|Tue|Tuesday");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).format("w")',
        desc: 'Return <code>"2"</code> (ISO 8601 Tuesday)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).format("w") === "2");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).format("ww")',
        desc: 'Return <code>"01"</code> (ISO 8601: 2013W01)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).format("ww") === "01");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).format("YY|YYYY")',
        desc: 'Return <code>"13|2013"</code> (year)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).format("YY|YYYY") === "13|2013");
        }
      },
      {
        feature: 'new Date(2013, 8, 1).format("M|MM|MMM|MMMM")',
        desc: 'Return <code>"9|09|Sep|September"</code>',
        code: function () {
          assertTrue(new Date(2013, 8, 1).format("M|MM|MMM|MMMM") === "9|09|Sep|September");
        }
      },
      {
        feature: 'new Date(2013, 0, 1).format("D|DD")',
        desc: 'Return <code>"1|01"</code> (day of month)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).format("D|DD") === "1|01");
        }
      },
      {
        feature: 'new Date(2013, 2, 1).format("DDD")',
        desc: 'Return <code>"60"</code> (day of year)',
        code: function () {
          assertTrue(new Date(2013, 2, 1).format("DDD") === "60");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 9).format("H|HH")',
        desc: 'Return <code>"9|09"</code> (hours)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 9).format("H|HH") === "9|09");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 0).format("h")',
        desc: 'Return <code>"12"</code> (am)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 0).format("h") === "12");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 9).format("h")',
        desc: 'Return <code>"9"</code> (am)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 9).format("h") === "9");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 13).format("h")',
        desc: 'Return <code>"1"</code> (pm)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 13).format("h") === "1");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 0).format("hh")',
        desc: 'Return <code>"12"</code> (am)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 0).format("hh") === "12");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 9).format("hh")',
        desc: 'Return <code>"09"</code> (am)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 9).format("hh") === "09");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 13).format("hh")',
        desc: 'Return <code>"01"</code> (pm)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 13).format("hh") === "01");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 13, 9).format("m|mm")',
        desc: 'Return <code>"9|09"</code> (minutes)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 13, 9).format("m|mm") === "9|09");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 0, 0, 9).format("s|ss")',
        desc: 'Return <code>"9|09"</code> (seconds)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 0, 0, 9).format("s|ss") === "9|09");
        }
      },
      {
        feature: 'new Date(2013, 0, 1, 0, 0, 0, 9).format("sss|ssss")',
        desc: 'Return <code>"9|009"</code> (milliseconds)',
        code: function () {
          assertTrue(new Date(2013, 0, 1, 0, 0, 0, 9).format("sss|ssss") === "9|009");
        }
      },

      {
        feature: "new Date().strftime()",
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
        feature: 'new Date(2013, 0, 1).strftime("%a|%A")',
        desc: 'Return <code>"Tue|Tuesday"</code> (weekday)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%a|%A") === "Tue|Tuesday");
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
        feature: 'new Date(2013, 2, 1).strftime("%j")',
        desc: 'Return <code>"060"</code> (day of year)',
        code: function () {
          assertTrue(new Date(2013, 2, 1).strftime("%j") === "060");
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
        feature: 'new Date(2013, 0, 1).strftime("%V")',
        desc: 'Return <code>"01"</code> (ISO 8601: 2013W01)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%V") === "01");
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
        feature: 'new Date(2013, 0, 1).strftime("%y|%Y")',
        desc: 'Return <code>"13|2013"</code> (year)',
        code: function () {
          assertTrue(new Date(2013, 0, 1).strftime("%y|%Y") === "13|2013");
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
      },
    ]
  });
}