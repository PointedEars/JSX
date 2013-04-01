function runTests ()
{
  var assertFalse = jsx.test.assertFalse;
  var assertTrue = jsx.test.assertTrue;

  jsx.test.runner.run({
    file: "object.js",
    tests: [
      {
        feature: "jsx.object.isMethod()",
        desc: "Missing argument throws exception",
        code: function () {
          var ok = true;
          jsx.tryThis("jsx.object.isMethod()", function() { ok = false; });
          assertFalse(ok);
        }
      },
      {
        feature: "jsx.object.isMethod(false)",
        desc: "Returns <code>false</code>",
        code: function () {
          assertFalse("jsx.object.isMethod(false)");
        }
      },
      {
        feature: "jsx.object.isMethod(…)",
        desc: "Returns correct values",
        code: function () {
          assertTrue("jsx.object.isMethod(eval)");
          assertFalse("jsx.object.isMethod(this, null)");
          assertTrue("jsx.object.isMethod(this, 'eval')");
          assertFalse("jsx.object.isMethod(this, '')");
          assertTrue("jsx.object.isMethod(window, 'location', 'reload')");
          assertFalse("jsx.object.isMethod(window, 'location', 'hash')");
          assertFalse("jsx.object.isMethod('window', 'location', 'hash')");
          assertFalse("jsx.object.isMethod('window', 'location')");
          assertTrue("jsx.object.isMethod(window, 'location')");
          assertFalse("jsx.object.isMethod('foo', 'location')");
        }
      },
      {
        feature: "jsx.object.areMethods()",
        desc: "Missing argument throws exception",
        code: function () {
          var ok = true;
          jsx.tryThis("jsx.object.areMethods()", function() { ok = false; });
          assertFalse(ok);
        }
      },
      {
        feature: "jsx.object.areMethods(this, [false])",
        desc: "Returns false",
        code: function () {
          assertFalse("jsx.object.areMethods(this, [false])");
        }
      },
      {
        feature: "jsx.object.areMethods(…)",
        desc: "Returns correct values",
        code: function () {
          assertTrue("jsx.object.areMethods(this, ['eval', 'toString'])");
          /*assertTrue("jsx.object.isMethod(this, 'eval')");
                assertFalse("jsx.object.isMethod(this, '')");
                assertTrue("jsx.object.isMethod(window, 'location', 'reload')");
                assertFalse("jsx.object.isMethod(window, 'location', 'hash')");
                assertFalse("jsx.object.isMethod('window', 'location', 'hash')");
                assertFalse("jsx.object.isMethod('window', 'location')");
                assertTrue("jsx.object.isMethod(window, 'location')");
                assertFalse("jsx.object.isMethod('foo', 'location')");
 */              }
      },
      {
        feature: "jsx.object.isNativeMethod()",
        desc: "Missing argument throws exception",
        code: function () {
          var ok = true;
          jsx.tryThis("jsx.object.isNativeMethod()", function() { ok = false; });
          assertFalse(ok);
        }
      },
      {
        feature: "jsx.object.isNativeMethod(function)",
        desc: "Returns <code>true</code>",
        code: function () {
          assertTrue(jsx.object.isNativeMethod(function () {}));
        }
      },
      {
        feature: "jsx.object.isNativeMethod(object.toString)",
        desc: "Returns <code>true</code>",
        code: function () {
          assertTrue(jsx.object.isNativeMethod(({}).toString));
        }
      },
      {
        feature: "jsx.object.isNativeMethod(object)",
        desc: "Returns <code>false</code>",
        code: function () {
          assertFalse(jsx.object.isNativeMethod({}));
        }
      },
      {
        feature: 'jsx.object.isMethodType(typeof "")',
        desc: "Returns <code>false</code>",
        code: function () {
          assertFalse(jsx.object.isMethodType(typeof ""));
        }
      },
      {
        feature: 'jsx.object.isMethodType(typeof function () {})',
        desc: "Returns <code>true</code>",
        code: function () {
          assertTrue(jsx.object.isMethodType(typeof function () {}));
        }
      },
      {
        feature: 'jsx.dmsg(…)',
        desc: "Callable, generates messages",
        code: function () {
          jsx.dmsg("log message");
          jsx.dmsg("info message", "info");
          jsx.dmsg("warning", "warn");
          jsx.dmsg("error message", "error");
        }
      },
      {
        feature: 'jsx.info(…)',
        desc: "Callable, generates info message",
        code: function () {
          jsx.info("info message");
        }
      },
      {
        feature: 'jsx.warn(…)',
        desc: "Callable, generates warning",
        code: function () {
          jsx.warn("warning");
        }
      },
      {
        feature: 'jsx.error(…)',
        desc: "Callable, generates error message",
        code: function () {
          jsx.error("error message");
        }
      },
      {
        feature: 'jsx.object._hasOwnProperty("_hasOwnProperty")',
        desc: "Return <code>true</code>",
        code: function () {
          assertTrue(jsx.object._hasOwnProperty("_hasOwnProperty"));
        }
      },
      {
        feature: 'jsx.object._hasOwnProperty({}, "foo")',
        desc: "Return <code>false</code>",
        code: function () {
          assertFalse(jsx.object._hasOwnProperty({}, "foo"));
        }
      },
      {
        feature: 'jsx.object._hasOwnProperty({foo: "bar"}, "foo")',
        desc: "Return <code>true</code>",
        code: function () {
          assertTrue(jsx.object._hasOwnProperty({foo: "bar"}, "foo"));
        }
      },
      {
        feature: 'jsx.object._hasOwnProperty(new Foo(), "bar")',
        desc: "Return <code>false</code>",
        code: function () {
          function Foo () {}
          Foo.prototype.bar = 42;

          /* Inherited, not own property */
          assertFalse(jsx.object._hasOwnProperty(new Foo(), "bar"));

          /* Simulate unavailable hasOwnProperty() method on Foo instance */
          Foo.prototype.hasOwnProperty = null;
          assertFalse(jsx.object._hasOwnProperty(new Foo(), "bar"));
        }
      },
      {
        feature: 'jsx.object.getKeys()',
        desc: 'Throw exception',
        code: function () {
          var success = jsx.tryThis(
            function () {
              jsx.object.getKeys();
              return true;
            },
            function (e) {
              jsx.error(e);
              return false;
            });

          assertFalse(success);

          /* Simulate missing Object.keys() */
          var Object_keys = Object.keys;
          delete Object.keys;

          success = jsx.tryThis(
            function () {
              jsx.object.getKeys();
              return true;
            },
            function (e) {
              jsx.error(e);
              return false;
            });

          Object.keys = Object_keys;

          assertFalse(success);
        }
      },
      {
        feature: 'jsx.object.getKeys({})',
        desc: 'Return <code>[]</code>',
        code: function () {
          var result = jsx.object.getKeys({});
          assertTrue(result && result.length === 0);

          /* Simulate missing Object.keys() */
          var Object_keys = Object.keys;
          delete Object.keys;

          result = jsx.object.getKeys({});

          Object.keys = Object_keys;

          assertTrue(result && result.length === 0);
        }
      },
      {
        feature: 'jsx.object.getKeys({foo: "bar"})',
        desc: 'Return <code>["foo"]</code>',
        code: function () {
          var result = jsx.object.getKeys({foo: "bar"});
          assertTrue(result && result.length === 1 && result[0] === "foo");

          /* Simulate missing Object.keys() */
          var Object_keys = Object.keys;
          delete Object.keys;

          result = jsx.object.getKeys({foo: "bar"});

          Object.keys = Object_keys;

          assertTrue(result && result.length === 1 && result[0] == "foo");
        }
      },
      {
        feature: 'jsx.object.clone({foo: "bar"})',
        desc: "Returns the correct value",
        code: function () {
          assertTrue(jsx.object.clone({foo: "bar"}).foo === "bar");
        }
      }
    ]
  });
}