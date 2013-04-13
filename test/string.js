function runTests()
{
  var assert = jsx.test.assert;
  var sprintf = jsx.string.sprintf;
  var format = jsx.string.format;

  var tests = [
    {
      feature: 'addSlashes("\'\\"")',
      description: 'return <code>"\\\'\\""</code>',
      code: function () {
        assert(addSlashes("'\"") === "\\\'\\\"");
      }
    },
    {
      feature: 'jsx.string.parseFloat()',
      description: 'return <code>NaN</code>',
      code: function () {
        assert(isNaN(jsx.string.parseFloat()));
      }
    },
    {
      feature: 'jsx.string.parseFloat("0.25abc")',
      description: 'return <code>0.25</code>',
      code: function () {
        assert(jsx.string.parseFloat("0.25abc") === 0.25);
      }
    },
    {
      feature: 'jsx.string.parseFloat("0.1abc", 2)',
      description: 'return <code>0.5</code>',
      code: function () {
        assert(jsx.string.parseFloat("0.1abc", 2) === 0.5);
      }
    },
    {
      feature: 'jsx.string.parseFloat("10.1abc", 8)',
      description: 'return <code>8.125</code>',
      code: function () {
        assert(jsx.string.parseFloat("10.1abc", 8) === 8.125);
      }
    },
    {
      feature: 'jsx.string.parseFloat("20AC.11", 16)',
      description: 'return <code>8364.06640625</code>',
      code: function () {
        assert(jsx.string.parseFloat("20AC.11", 16) === 8364.06640625);
      }
    }
  ];

  var formats = [
    ["|%d|%d|", "|12345.2|-12345.2|", ],
    ["|%9d|%9d|", "|\xA0\xA012345.2|\xA0-12345.2|",
     "left-padded with NBSPs"],
    ['|%-9d|%-9d|', "|\xA0\xA012345.2|\xA0-12345.2|"],
    ['|%+9d|%+9d|', "|\xA0\xA012345.2|\xA0-12345.2|"],
    ["|%-+9d|%-+9d|", "|\xA0\xA012345.2|\xA0-12345.2|",
     "second align flag overrides first one"],
    ['|%09d|%09d|', "|0012345.2|-012345.2|",
     "left-padded with zeroes"],
    ['|% 9d|% 9d|', "|\xA0\xA012345.2|\xA0-12345.2|",
     "left-padded with spaces"],
    ['|% 09d|% 09d|', "|0012345.2|-012345.2|",
     "second padding flag overrides first\xA0one"],
    ['|%+09d|%+09d|', "|0012345.2|-012345.2|"],
    ['|%10.8f|%10.8f|', "|12345.20000000|-12345.20000000|"],
    ['|%10.-2f|%10.-2f|', "|\xA0\xA0\xA0\xA0\xA012300|\xA0\xA0\xA0\xA0-12300|",
     "left-padded with NBSPs, rounded to hundreds"]
  ];

  for (var j = 0, len = formats.length; j < len; j++)
  {
    var f = formats[j];
    tests.push({
      feature: 'jsx.string.sprintf("' + f[0] + '", 12345.2, -12345.2)',
      desc: 'return <code>"' + f[1] + '"</code>' + (f[2] ? " (" + f[2] + ")" : ""),
      code: (function (f) {
        return function () {
          assert(sprintf(f[0], 12345.2, -12345.2) === f[1]);
        }
      }(f))
    });
  }

  var s = 1235;
  var i = 12345;
  var l = 12345678;
  var u = 65535;

  tests = tests.concat([
    {
      feature: 'jsx.string.sprintf("|%*d|", i, 14)',
      desc: 'return <code>"|\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA012345|"</code>'
        + ' (left-padded according to next argument)',
      code: function () {
        assert(sprintf("|%*d|", i, 14) === "|\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA0\xA012345|");
      }
    },
    {
      feature: 'jsx.string.sprintf("|x%%dy|", i, 1, 9)',
      desc: 'return <code>"|x%dy|"</code>',
      code: function () {
        assert(sprintf("|x%%dy|", i, 1, 9) === "|x%dy|");
      }
    },
    {
      feature: 'jsx.string.format("|{0}|{1}|", 12345, -12345)',
      desc: 'return <code>"|12345|-12345|"</code>',
      code: function () {
        assert(format("|{0}|{1}|", 12345, -12345) === "|12345|-12345|");
      }
    },
    {
      feature: 'jsx.string.format("|{x}|{y}|", {x: 12345, y: -12345})',
      desc: 'return <code>"|12345|-12345|"</code>',
      code: function () {
        assert(format("|{x}|{y}|", {x: 12345, y: -12345}) === "|12345|-12345|");
      }
    },
    {
      feature: '"|{x}|{y}|".format({x: 12345, y: -12345})',
      desc: 'return <code>"|12345|-12345|"</code>',
      code: function () {
        assert("|{x}|{y}|".format({x: 12345, y: -12345}) === "|12345|-12345|");
      }
    }
  ]);

  jsx.test.runner.run({file: "string.js", tests: tests});
}