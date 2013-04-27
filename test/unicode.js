function runTests()
{
  var _test = jsx.test;
  var assert = _test.assert;
  var assertArrayEquals = _test.assertArrayEquals;
  var WideString = jsx.string.unicode.WideString;

  _test.runner.run({
    file: "unicode.js",
    tests: [
      {
        feature: 'jsx.string.unicode.WideString()',
        description: 'Return new instance (factory)',
        code: function () {
          assert(WideString() instanceof WideString);
        }
      },
      {
        feature: 'new jsx.string.unicode.WideString()',
        description: 'Return new instance',
        code: function () {
          assert(new WideString() instanceof WideString);
        }
      },
      {
        feature: 'new jsx.string.unicode.WideString(WideString)',
        description: 'Clone instance',
        code: function () {
          var chars = new WideString(new WideString(("x"))).getChars();
          assertArrayEquals(["x"], chars);
        }
      },
      {
        feature: 'new jsx.string.unicode.WideString("x")',
        description: 'Convert to <code>WideString("x")</code>',
        code: function () {
          assertArrayEquals(["x"], new WideString("x").getChars());
        }
      },
      {
        feature: 'new jsx.string.unicode.WideString(42)',
        description: 'Convert to <code>WideString("42")</code>',
        code: function () {
          assertArrayEquals(["4", "2"], new WideString(42).getChars());
        }
      },
      {
        feature: 'new jsx.string.unicode.WideString(string).chars',
        description: 'Getter works',
        code: function () {
          assertArrayEquals(["x"], new WideString("x").chars);
        }
      },

      {
        feature: 'jsx.string.unicode.WideString.fromCharCode(0x110000)',
        description: 'throw <code>jsx.InvalidArgumentError</code>',
        code: function () {
          var error = false;
          jsx.tryThis(
            function () {
              WideString.fromCharCode(0x110000);
            },
            function (e) {
              jsx.error(e);
              if (e instanceof jsx.InvalidArgumentError)
              {
                error = true;
              }
            }
          );

          assert(error);
        }
      },
      {
        feature: 'jsx.string.unicode.WideString.fromCharCode(0x1D11E)',
        description: 'return <code>"\\uD834\\uDD1E"</code>',
        code: function () {
          var chars = WideString.fromCharCode(0x1D11E).getChars();
          assertArrayEquals(["\uD834\uDD1E"], chars);
        }
      },
      {
        feature: 'jsx.string.unicode.WideString.fromCharCode(0x20AC)',
        description: 'Return <code>"\\u20AC"</code>',
        code: function () {
          var chars = WideString.fromCharCode(0x20AC).getChars();
          assertArrayEquals(["\u20AC"], chars);
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").charAt(…)',
        description: 'Return the correct value',
        code: function () {
          assert(new WideString("x\uD834\uDD1E").charAt(1) === "\uD834\uDD1E");
          assert(new WideString("\uD834\uDD1Ex").charAt(1) === "x");
          assert(typeof new WideString("\uD834\uDD1Ex").charAt(2) == "undefined");

          assert(new WideString("xy\uD834\uDD1E").charAt(-1) === "\uD834\uDD1E");
          assert(new WideString("x\uD834\uDD1Ey").charAt(-1) === "y");
          assert(typeof new WideString("x\uD834\uDD1Ey").charAt(-4) == "undefined");
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").charCodeAt(…)',
        description: 'Return the correct value',
        code: function () {
          assert(new WideString("x\uD834\uDD1E").charCodeAt(1) === 0x1D11E);
          assert(new WideString("\uD834\uDD1EA").charCodeAt(1) === 65);

          var result = new WideString("\uD834\uDD1EA").charCodeAt(2);
          assert(typeof result == "number" && isNaN(result));

          assert(new WideString("xy\uD834\uDD1E").charCodeAt(-1) === 0x1D11E);
          assert(new WideString("A\uD834\uDD1EB").charCodeAt(-1) === 66);

          result = new WideString("A\uD834\uDD1EB").charCodeAt(-4);
          assert(typeof result == "number" && isNaN(result));
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").concat(…)',
        description: 'Return the correct value',
        code: function () {
          var s = new WideString("x").concat(new WideString("\uD834\uDD1E"));
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834").concat(new WideString("\uDD1E"));
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834\uDD1E").concat(new WideString(""));
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834\uDD1E").concat(new WideString());
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x").concat("\uD834\uDD1E");
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834").concat("\uDD1E");
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834\uDD1E").concat("");
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834\uDD1E").concat(42);
          assertArrayEquals(["x", "\uD834\uDD1E", "4", "2"], s.getChars());
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").indexOf(…)',
        description: 'Return the correct value',
        code: function () {
          assert(new WideString("x\uD834\uDD1Ez").indexOf(
            new WideString("\uDD1E")) === -1);
          assert(new WideString("x\uD834\uDD1Ez").indexOf(
            new WideString("\uD834\uDD1Ey")) === -1);
          assert(new WideString("x\uD834\uDD1Ey\uD834\uDD1E").indexOf(
            new WideString("\uD834\uDD1Ey")) === 1);
          assert(new WideString("\uD834\uDD1EA\uD834\uDD1EA").indexOf(
            new WideString("A")) === 1);
          assert(new WideString("\uD834\uDD1EA\uD834\uDD1EA").indexOf(
            new WideString("A"), 2) === 3);

          assert(new WideString("x\uD834\uDD1Ez").indexOf("\uDD1E") === -1);
          assert(new WideString("x\uD834\uDD1Ez").indexOf("\uD834\uDD1Ey") === -1);
          assert(new WideString("x\uD834\uDD1Ey\uD834\uDD1Ey").indexOf("\uD834\uDD1Ey") === 1);
          assert(new WideString("\uD834\uDD1EA\uD834\uDD1EA").indexOf("A") === 1);
          assert(new WideString("\uD834\uDD1EA\uD834\uDD1EA").indexOf("A", 2) === 3);
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").lastIndexOf(…)',
        description: 'Return the correct value',
        code: function () {
          assert(new WideString("x\uD834\uDD1E").lastIndexOf(
            new WideString("\uDD1E")) === -1);
          assert(new WideString("x\uD834\uDD1E\uD834\uDD1E").lastIndexOf(
            new WideString("\uD834\uDD1E")) === 2);
          assert(new WideString("A\uD834\uDD1EA").lastIndexOf(
            new WideString("A")) === 2);
          assert(new WideString("A\uD834\uDD1EA").lastIndexOf(
            new WideString("A"), 1) === 0);

          assert(new WideString("x\uD834\uDD1E").lastIndexOf("\uDD1E") === -1);
          assert(new WideString("\uD834\uDD1Ex\uD834\uDD1E").lastIndexOf("\uD834\uDD1E") === 2);
          assert(new WideString("A\uD834\uDD1EA").lastIndexOf("A") === 2);
          assert(new WideString("A\uD834\uDD1EA").lastIndexOf("A", 1) === 0);
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").slice(…)',
        description: 'Return the correct value',
        code: function () {
          var s = new WideString("x\uD834\uDD1Ey").slice(1);
          assertArrayEquals(["\uD834\uDD1E", "y"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").slice(0, 1);
          assertArrayEquals(["x"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").slice(0, 2);
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").slice(1, 1);
          assertArrayEquals([], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").slice(1, 3);
          assertArrayEquals(["\uD834\uDD1E", "y"], s.getChars());
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").substr(…)',
        description: 'Return the correct value',
        code: function () {
          var s = new WideString("x\uD834\uDD1Ey").substr(1);
          assertArrayEquals(["\uD834\uDD1E", "y"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").substr(0, 1);
          assertArrayEquals(["x"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").substr(0, 2);
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").substr(1, 1);
          assertArrayEquals(["\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").substr(1, 3);
          assertArrayEquals(["\uD834\uDD1E", "y"], s.getChars());
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").substring(…)',
        description: 'Return the correct value',
        code: function () {
          var s = new WideString("x\uD834\uDD1Ey").substring(1);
          assertArrayEquals(["\uD834\uDD1E", "y"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").substring(0, 1);
          assertArrayEquals(["x"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").substring(0, 2);
          assertArrayEquals(["x", "\uD834\uDD1E"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").substring(1, 1);
          assertArrayEquals([], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").substring(1, 3);
          assertArrayEquals(["\uD834\uDD1E", "y"], s.getChars());

          s = new WideString("x\uD834\uDD1Ey").substring(3, 1);
          assertArrayEquals(["\uD834\uDD1E", "y"], s.getChars());
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").toString(…)',
        description: 'Return the correct value',
        code: function () {
          var s = new WideString("x\uD834\uDD1Ey").toString();
          assert(s === "x\uD834\uDD1Ey");
        }
      },

      {
        feature: 'new jsx.string.unicode.WideString("…").valueOf(…)',
        description: 'Return the correct value',
        code: function () {
          var s = new WideString("x\uD834\uDD1Ey").valueOf();
          assert(s === "x\uD834\uDD1Ey");
        }
      }
    ]
  });
}