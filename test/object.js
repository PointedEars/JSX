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
        desc: "Return <code>false</code> (inherited)",
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

          assertTrue(result && result.length === 1 && result[0] === "foo");
        }
      },
      {
        feature: 'jsx.object.getKeys(new Foo("baz"))',
        desc: 'Return <code>["baz"]</code>',
        code: function () {
          function Foo (propertyName)
          {
            this[propertyName] = 42;
          }

          Foo.prototype.bar = 42;

          var foo = new Foo("baz");

          var result = jsx.object.getKeys(foo);
          assertTrue(result && result.length === 1 && result[0] === "baz");

          /* Simulate missing Object.keys() */
          var Object_keys = Object.keys;
          delete Object.keys;

          result = jsx.object.getKeys(foo);

          Object.keys = Object_keys;

          assertTrue(result && result.length === 1 && result[0] === "baz");
        }
      },
      {
        feature: 'jsx.object.clone()',
        desc: "Returns a shallow clone of <code>jsx.object</code>",
        code: function () {
          var clone1 = jsx.object.clone();
          assertTrue(clone1.clone == jsx.object.clone);
        }
      },
      {
        feature: 'jsx.object.clone({foo: {bar: "baz"}})',
        desc: "Returns a shallow clone",
        code: function () {
          var o2 = {bar: "baz"};
          var o = {foo: o2};

          var clone1 = jsx.object.clone(o);
          assertTrue(clone1 != o && clone1.foo == o2);
        }
      },
      {
        feature: 'jsx.object.clone({foo: {bar: "baz"}}, 0)',
        desc: "Returns a shallow clone",
        code: function () {
          var o2 = {bar: "baz"};
          var o = {foo: o2};

          var clone1 = jsx.object.clone(o, 0);
          assertTrue(clone1 != o && clone1.foo == o2);

          var clone2 = jsx.object.clone(0, o);
          assertTrue(clone2 != o && clone2.foo == o2);
        }
      },
      {
        feature: 'jsx.object.clone({foo: {bar: "baz"}}, jsx.object.COPY_ENUM)',
        desc: "Returns a shallow clone",
        code: function () {
          var o2 = {bar: "baz"};
          var o = {foo: o2};

          var clone1 = jsx.object.clone(o, jsx.object.COPY_ENUM);
          assertTrue(clone1 != o && clone1.foo == o2);

          var clone2 = jsx.object.clone(jsx.object.COPY_ENUM, o);
          assertTrue(clone2 != o && clone2.foo == o2);
        }
      },
      {
        feature: 'jsx.object.clone({foo: {bar: "baz"}}, jsx.object.COPY_ENUM_DEEP)',
        desc: "Returns a deep clone",
        code: function () {
          var o2 = {bar: "baz"};
          var o = {foo: o2};

          var clone1 = jsx.object.clone(o, jsx.object.COPY_ENUM_DEEP);
          assertTrue(clone1 != o && clone1.foo != o2 && clone1.foo.bar === "baz");

          var clone2 = jsx.object.clone(jsx.object.COPY_ENUM_DEEP, o);
          assertTrue(clone2 != o && clone2.foo != o2 && clone2.foo.bar === "baz");
        }
      },
      {
        feature: 'jsx.object.clone({foo: {bar: "baz"}}, jsx.object.COPY_INHERIT)',
        desc: "Returns a new inheriting object",
        code: function () {
          var o2 = {bar: "baz"};
          var o = {foo: o2};

          var clone1 = jsx.object.clone(o, jsx.object.COPY_INHERIT);
          assertTrue(clone1 != o && !clone1.hasOwnProperty("foo")
            && clone1.foo == o2 && clone1.foo.bar === "baz");

          var clone2 = jsx.object.clone(jsx.object.COPY_INHERIT, o);
          assertTrue(clone2 != o && !clone2.hasOwnProperty("foo")
            && clone2.foo == o2 && clone2.foo.bar === "baz");
        }
      },

      {
        feature: 'jsx.object.setProperties()',
        desc: "Throws <code>TypeError</code>",
        code: function () {
          var success = jsx.tryThis(
            function () {
              jsx.object.setProperties();
              return true;
            },
            function (e) {
              jsx.error(e);
              return !(e instanceof TypeError);
            });

          assertFalse(success);
        }
      },
      {
        feature: 'jsx.object.setProperties({})',
        desc: "Throws <code>TypeError</code>",
        code: function () {
          var success = jsx.tryThis(
            function () {
              jsx.object.setProperties({});
              return true;
            },
            function (e) {
              jsx.error(e);
              return !(e instanceof TypeError);
            });

          assertFalse(success);
        }
      },
      {
        feature: 'jsx.object.setProperties({}, {foo: "bar"})',
        desc: "Sets property, no cloning",
        code: function () {
          var o = {};
          var o2 = {bar: "baz"};
          jsx.object.setProperties(o, {foo: o2});

          assertTrue(o.foo && o.foo == o2 && o.foo.bar === "baz");
        }
      },
      {
        feature: 'jsx.object.setProperties({foo: "bar"}, {foo: "baz"})',
        desc: "Does not modify existing property",
        code: function () {
          var o = {foo: "bar"};
          jsx.object.setProperties(o, {foo: "baz"});

          assertTrue(o.foo === "bar");
        }
      },
      {
        feature: 'jsx.object.setProperties({foo: "bar"}, {foo: "baz"}, jsx.object.ADD_OVERWRITE)',
        desc: "Modifies existing property",
        code: function () {
          var o = {foo: "bar"};
          jsx.object.setProperties(o, {foo: "baz"}, jsx.object.ADD_OVERWRITE);

          assertTrue(o.foo === "baz");
        }
      },
      {
        feature: 'jsx.object.setProperties({foo: "bar"}, {foo: "baz"}, jsx.object.COPY_ENUM_DEEP)',
        desc: "Sets property, with cloning",
        code: function () {
          var o = {};
          var o2 = {bar: "baz"};
          jsx.object.setProperties(o, {foo: o2}, jsx.object.COPY_ENUM_DEEP);

          assertTrue(o.foo && o.foo != o2 && o.foo.bar === "baz");
        }
      },
      {
        feature: 'jsx.object.setProperties({foo: "bar"}, {foo: "baz"}, jsx.object.ADD_OVERWRITE | jsx.object.COPY_ENUM_DEEP)',
        desc: "Modifies existing property, with cloning",
        code: function () {
          var o = {foo: "bar"};
          var o2 = {bar: "baz"};
          jsx.object.setProperties(o, {foo: o2}, jsx.object.ADD_OVERWRITE | jsx.object.COPY_ENUM_DEEP);

          assertTrue(o.foo && o.foo != o2 && o.foo.bar === "baz");
        }
      },

      {
        feature: 'jsx.object.defineProperty()',
        desc: "Throws <code>TypeError</code>",
        code: function () {
          var success = jsx.tryThis(
            function () {
              jsx.object.defineProperty();
              return true;
            },
            function (e) {
              jsx.error(e);
              return !(e instanceof TypeError);
            });

          assertFalse(success);
        }
      },
      {
        feature: 'jsx.object.defineProperty(42)',
        desc: "Throws <code>TypeError</code>",
        code: function () {
          var success = jsx.tryThis(
            function () {
              jsx.object.defineProperty(42);
              return true;
            },
            function (e) {
              jsx.error(e);
              return !(e instanceof TypeError);
            });

          assertFalse(success);
        }
      },
      {
        feature: 'jsx.object.defineProperty(null)',
        desc: "Throws <code>TypeError</code>",
        code: function () {
          var success = jsx.tryThis(
            function () {
              jsx.object.defineProperty(null);
              return true;
            },
            function (e) {
              jsx.error(e);
              return !(e instanceof TypeError);
            });

          assertFalse(success);
        }
      },
      {
        feature: 'jsx.object.defineProperty({})',
        desc: "Missing descriptor throws <code>TypeError</code>",
        code: function () {
          var success = jsx.tryThis(
            function () {
              jsx.object.defineProperty({});
              return true;
            },
            function (e) {
              jsx.error(e);
              return !(e instanceof TypeError);
            });

          assertFalse(success);
        }
      },
      {
        feature: 'jsx.object.defineProperty({}, "foo")',
        desc: "Missing descriptor throws <code>TypeError</code>",
        code: function () {
          var success = jsx.tryThis(
            function () {
              jsx.object.defineProperty({}, "foo");
              return true;
            },
            function (e) {
              jsx.error(e);
              return !(e instanceof TypeError);
            });

          assertFalse(success);
        }
      },
      {
        feature: 'jsx.object.defineProperty({}, "foo", 42)',
        desc: "Invalid descriptor throws <code>TypeError</code>",
        code: function () {
          var success = jsx.tryThis(
            function () {
              jsx.object.defineProperty({}, "foo", 42);
              return true;
            },
            function (e) {
              jsx.error(e);
              return !(e instanceof TypeError);
            });

          assertFalse(success);
        }
      },
      {
        feature: 'jsx.object.defineProperty({}, "foo", {})',
        desc: 'Defines read-only <code>foo</code> property'
            + ' with value <code>undefined</code>'
            + ' and returns correct value',
        code: function () {
          var o = {};
          var result = jsx.object.defineProperty(o, "foo", {});

          assertTrue("foo" in o);
          o.foo = 42;
          assertTrue(typeof o.foo == "undefined");
          assertTrue(result === o);
        }
      },
      {
        feature: 'jsx.object.defineProperty({}, "foo", {value: 42})',
        desc: 'Defines read-only <code>foo</code> property'
            + ' with value <code>42</code>'
            + ' and returns correct value',
        code: function () {
          var o = {};
          var result = jsx.object.defineProperty(o, "foo", {
            value: 42
          });

          o.foo = "23";
          assertTrue(o.foo === 42);
          assertTrue(result === o);
        }
      },
      {
        feature: 'jsx.object.defineProperty({}, "foo", {value: 42, writable: true})',
        desc: 'Defines writable <code>foo</code> property'
            + ' with initial value <code>42</code>'
            + ' and returns correct value',
        code: function () {
          var o = {};
          var result = jsx.object.defineProperty(o, "foo", {
            value: 42,
            writable: true
          });

          assertTrue(o.foo === 42);
          o.foo = "23";
          assertTrue(o.foo === "23");
          assertTrue(result === o);
        }
      },
      {
        feature: 'jsx.object.defineProperty({}, "foo", {"get": …})',
        desc: 'Defines read-only <code>foo</code> property with getter'
            + ' and returns correct value',
        code: function () {
          var o = {};
          var result = jsx.object.defineProperty(o, "foo", {
            "get": function () { return 42; }
          });

          assertTrue(o.foo === 42);
          o.foo = "23";
          assertTrue(o.foo === 42);
          assertTrue(result === o);
        }
      },
      {
        feature: 'jsx.object.defineProperty({}, "foo", {"set": …})',
        desc: 'Defines <code>foo</code> property with setter'
            + ' and returns correct value',
        code: function () {
          var o = {};
          var _x = "23";
          var result = jsx.object.defineProperty(o, "foo", {
            "set": function (value) { _x = value; }
          });

          o.foo = 42;
          assertTrue(_x === 42);
          assertTrue(result === o);
        }
      }
    ]
  });
}