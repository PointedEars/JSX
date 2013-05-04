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
        description: 'Return new empty instance',
        code: function () {
          var s = new WideString();
          assert(s instanceof WideString);
          assertArrayEquals([], s.getChars());
        }
      },
      {
        feature: 'new WideString(wideString)',
        description: 'Clone instance',
        code: function () {
          var chars = new WideString(new WideString(("x"))).getChars();
          assertArrayEquals(["x"], chars);
        }
      },
      {
        feature: 'new WideString("")',
        description: 'Return new empty instance',
        code: function () {
          assertArrayEquals([], new WideString("").getChars());
        }
      },
      {
        feature: 'new WideString("x")',
        description: 'Convert to <code>WideString("x")</code>',
        code: function () {
          assertArrayEquals(["x"], new WideString("x").getChars());
        }
      },
      {
        feature: 'new WideString(42)',
        description: 'Convert to <code>WideString("42")</code>',
        code: function () {
          assertArrayEquals(["4", "2"], new WideString(42).getChars());
        }
      },

      {
        feature: 'wideString.getChars()',
        description: 'Return the correct value',
        code: function () {
          assertArrayEquals([], new WideString().getChars());
          assertArrayEquals([], new WideString("").getChars());
          assertArrayEquals(["x"], new WideString("x").getChars());
          assertArrayEquals(["x", "\uD834\uDD1E"], new WideString("x\uD834\uDD1E").getChars());
          assertArrayEquals(["x", "\uD834\uDD1E", "y"], new WideString("x\uD834\uDD1Ey").getChars());
        }
      },
      {
        feature: 'wideString.chars',
        description: 'Getter works',
        code: function () {
          assertArrayEquals(["x"], new WideString("x").chars);
        }
      },

      {
        feature: 'wideString.getLength()',
        description: 'Return the correct value',
        code: function () {
          assert(new WideString().getLength() === 0);
          assert(new WideString("").getLength() === 0);
          assert(new WideString("x").getLength() === 1);
          assert(new WideString("x\uD834\uDD1E").getLength() === 2);
          assert(new WideString("x\uD834\uDD1Ey").getLength() === 3);
        }
      },
      {
        feature: 'wideString.length',
        description: 'Inherited getter works',
        code: function () {
          assert(new WideString("x").length === 1);
        }
      },

      {
        feature: 'WideString.fromCharCode(0x110000)',
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
        feature: 'WideString.fromCharCode(0x1D11E)',
        description: 'Return <code>WideString("\\uD834\\uDD1E")</code>',
        code: function () {
          var chars = WideString.fromCharCode(0x1D11E).getChars();
          assertArrayEquals(["\uD834\uDD1E"], chars);
        }
      },
      {
        feature: 'WideString.fromCharCode(0x20AC)',
        description: 'Return <code>WideString("\\u20AC")</code>',
        code: function () {
          var chars = WideString.fromCharCode(0x20AC).getChars();
          assertArrayEquals(["\u20AC"], chars);
        }
      },

      {
        feature: 'wideString.charAt(…)',
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
        feature: 'wideString.charCodeAt(…)',
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
        feature: 'wideString.concat(…)',
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
        feature: 'wideString.indexOf(…)',
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
        feature: 'wideString.lastIndexOf(…)',
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
        feature: 'wideString.localeCompare("…")',
        description: 'Return the correct value (inherited generic method)',
        code: function () {
          assert(new WideString("x").localeCompare("y") === "x".localeCompare("y"));
        }
      },

      {
        feature: 'wideString.match("…")',
        description: 'Return the correct value (inherited generic method)',
        code: function () {
          assertArrayEquals("x".match("x"), new WideString("x").match("x"));
          assert(new WideString("x").match("y") === "x".match("y"));
        }
      },

      {
        feature: 'wideString.replace("…")',
        description: 'Return the correct value (inherited generic method)',
        code: function () {
          assert(new WideString("x").replace("x", "y").toString() === "x".replace("x", "y"));
          assert(new WideString("xx").replace(/x/g, "y").toString() === "xx".replace(/x/g, "y"));
        }
      },

      {
        feature: 'wideString.search("…")',
        description: 'Return the correct value (inherited generic method)',
        code: function () {
          assert(new WideString("x").search(/y/) === "x".search(/y/));
          assert(new WideString("x").search(/x/) === "x".search(/x/));
        }
      },

      {
        feature: 'wideString.slice(…)',
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
        feature: 'wideString.substr(…)',
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
        feature: 'wideString.substring(…)',
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
        feature: 'wideString.toString(…)',
        description: 'Return the correct value',
        code: function () {
          var s = new WideString("x\uD834\uDD1Ey").toString();
          assert(s === "x\uD834\uDD1Ey");
        }
      },

      {
        feature: 'wideString.valueOf(…)',
        description: 'Return the correct value',
        code: function () {
          var s = new WideString("x\uD834\uDD1Ey").valueOf();
          assert(s === "x\uD834\uDD1Ey");
        }
      },

      {
        feature: 'String.fromCharCode(0x1D11E)',
        description: 'Return <code>"\\uD834\\uDD1E"</code>',
        code: function () {
          assert(String.fromCharCode(0x1D11E) === "\uD834\uDD1E");
        }
      },

      {
        feature: 'string.charAt(…)',
        description: 'Return the correct value',
        code: function () {
          assert("x\uD834\uDD1E".charAt(1) === "\uD834\uDD1E");
          assert("\uD834\uDD1Ex".charAt(1) === "x");
          assert(typeof "\uD834\uDD1Ex".charAt(2) == "undefined");

          assert("xy\uD834\uDD1E".charAt(-1) === "\uD834\uDD1E");
          assert("x\uD834\uDD1Ey".charAt(-1) === "y");
          assert(typeof "x\uD834\uDD1Ey".charAt(-4) == "undefined");
        }
      },

      {
        feature: 'string.charCodeAt(…)',
        description: 'Return the correct value',
        code: function () {
          assert("x\uD834\uDD1E".charCodeAt(1) === 0x1D11E);
          assert("\uD834\uDD1EA".charCodeAt(1) === 65);

          var result = "\uD834\uDD1EA".charCodeAt(2);
          assert(typeof result == "number" && isNaN(result));

          assert("xy\uD834\uDD1E".charCodeAt(-1) === 0x1D11E);
          assert("A\uD834\uDD1EB".charCodeAt(-1) === 66);

          result = "A\uD834\uDD1EB".charCodeAt(-4);
          assert(typeof result == "number" && isNaN(result));
        }
      },

      {
        feature: 'string.getLength()',
        description: 'Return the correct value (augmented prototype)',
        code: function () {
          assert("x\uD834\uDD1Ey".getLength() === 3);
        }
      },

      {
        feature: 'string.slice(…)',
        description: 'Return the correct value',
        code: function () {
          assert("xyz".slice(1) === "yz");
          assert("xyz".slice(0, 1) === "x");
          assert("xyz".slice(0, 2) === "xy");
          assert("xyz".slice(1, 1) === "");
          assert("xyz".slice(1, 3) === "yz");

          assert("x\uD834\uDD1Ey".slice(1) === "\uD834\uDD1Ey");
          assert("x\uD834\uDD1Ey".slice(0, 1) === "x");
          assert("x\uD834\uDD1Ey".slice(0, 2) === "x\uD834\uDD1E");
          assert("x\uD834\uDD1Ey".slice(1, 1) === "");
          assert("x\uD834\uDD1Ey".slice(1, 3) === "\uD834\uDD1Ey");
        }
      },

      {
        feature: 'string.substr(…)',
        description: 'Return the correct value',
        code: function () {
          assert("xyz".substr(1) === "yz");
          assert("xyz".substr(0, 1) === "x");
          assert("xyz".substr(0, 2) === "xy");
          assert("xyz".substr(1, 1) === "y");
          assert("xyz".substr(1, 3) === "yz");

          assert("x\uD834\uDD1Ey".substr(1) === "\uD834\uDD1Ey");
          assert("x\uD834\uDD1Ey".substr(0, 1) === "x");
          assert("x\uD834\uDD1Ey".substr(0, 2) === "x\uD834\uDD1E");
          assert("x\uD834\uDD1Ey".substr(1, 1) === "\uD834\uDD1E");
          assert("x\uD834\uDD1Ey".substr(1, 3) === "\uD834\uDD1Ey");
        }
      },

      {
        feature: 'string.substring(…)',
        description: 'Return the correct value',
        code: function () {
          assert("xyz".substring(1) === "yz");
          assert("xyz".substring(0, 1) === "x");
          assert("xyz".substring(0, 2) === "xy");
          assert("xyz".substring(1, 1) === "");
          assert("xyz".substring(1, 3) === "yz");
          assert("xyz".substring(3, 1) === "yz");

          assert("x\uD834\uDD1Ey".substring(1) === "\uD834\uDD1Ey");
          assert("x\uD834\uDD1Ey".substring(0, 1) === "x");
          assert("x\uD834\uDD1Ey".substring(0, 2) === "x\uD834\uDD1E");
          assert("x\uD834\uDD1Ey".substring(1, 1) === "");
          assert("x\uD834\uDD1Ey".substring(1, 3) === "\uD834\uDD1Ey");
          assert("x\uD834\uDD1Ey".substring(3, 1) === "\uD834\uDD1Ey");
        }
      }
    ]
  });
}