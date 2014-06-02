function runTests()
{
  var _test = jsx.test;
  var assert = _test.assert;
  var assertArrayEquals = _test.assertArrayEquals;
  var _createComparator = jsx.array.createComparator;
  var BigArray = jsx.array.BigArray;

  _test.runner.run({
    file: "array.js",
    tests: [
      {
        feature: 'jsx.array.BigArray()',
        description: 'Return new instance (factory)',
        code: function () {
          assert(BigArray() instanceof BigArray);
        }
      },
      {
        feature: 'new jsx.array.BigArray()',
        description: 'Return new empty instance (constructor)',
        code: function () {
          assert(new BigArray() instanceof BigArray);
        }
      },
      {
        feature: 'new BigArray(BigArray)',
        description: 'Clone instance',
        code: function () {
          var s = (new BigArray(new BigArray("x"))).toString();
          assert(s === "x");
        }
      },
      {
        feature: 'new BigArray("")',
        description: 'Return one-element array',
        code: function () {
          assertArrayEquals([""], new BigArray("").toArray());
        }
      },
      {
        feature: 'new BigArray("x")',
        description: 'Convert to <code>BigArray("x")</code>',
        code: function () {
          assertArrayEquals(["x"], new BigArray("x").toArray());
        }
      },
      {
        feature: 'new BigArray(int)',
        description: 'Create <code>BigArray</code> of specified length',
        code: function () {
          var a = [];
          a.length = 42;
          assertArrayEquals(a, new BigArray(42).toArray());
        }
      },

      {
        feature: 'bigArray.length',
        description: 'Getter works',
        code: function () {
          var i = Math.pow(2, 53) - 1;
          assert(new BigArray(i).length == i);
        }
      },
      {
        feature: 'bigArray.setLength()',
        description: 'Throw <code>jsx.InvalidArgumentError</code>',
        code: function () {
          var a = new BigArray();
          var failure = jsx.tryThis(
            function () {
              a.setLength();
            },
            function (e) {
              return (e instanceof jsx.InvalidArgumentError);
            }
          );
          assert(failure);
        }
      },
      {
        feature: 'bigArray.setLength()',
        description: 'Throw <code>jsx.array.RangeError</code>',
        code: function () {
          var a = new BigArray();
          var failure = jsx.tryThis(
            function () {
              a.setLength(Math.pow(2, 53));
            },
            function (e) {
              return (e instanceof jsx.array.RangeError);
            }
          );
          assert(failure);
        }
      },
      {
        feature: 'bigArray.getLength()',
        description: 'Return the correct value',
        code: function () {
          assert(new BigArray().getLength() === 0);
          assert(new BigArray(42).getLength() === 42);
          assert(new BigArray("").getLength() === 1);
          assert(new BigArray("x").getLength() === 1);
          assert(new BigArray("x", "y").getLength() === 2);
        }
      },

      {
        feature: 'BigArray.prototype.get()',
        description: 'Throw <code>jsx.InvalidArgumentError</code>',
        code: function () {
          var failure = jsx.tryThis(
            function () {
              new BigArray().get();
              return false;
            },
            function (e) {
              return (e instanceof jsx.InvalidArgumentError);
            });
          assert(failure);
        }
      },
      {
        feature: 'BigArray.prototype.get(…)',
        description: 'Return the correct value',
        code: function () {
          assert(new BigArray("x").get(0) === "x");
          assert(typeof new BigArray("x").get(1) == "undefined");

          assert(new BigArray("x", "y").get(-2) === "x");
          assert(new BigArray("x", "y").get(-1) === "y");
          assert(typeof new BigArray("x", "y").get(-4) == "undefined");
        }
      },
      {
        feature: 'BigArray.prototype.set(Math.pow(2, 53) - 1, 23)',
        description: 'Throw <code>jsx.array.RangeError</code> (index too large)',
        code: function () {
          var a = new BigArray();
          var failure = jsx.tryThis(
            function () {
              a.set(Math.pow(2, 53) - 1, 23);
              return false;
            },
            function (e) {
              return (e instanceof jsx.array.RangeError);
            });
          assert(failure);
        }
      },
      {
        feature: 'BigArray.prototype.set(Math.pow(2, 53) - 2, 42)',
        description: 'Set element at maximum index',
        code: function () {
          var a = new BigArray();
          var i = Math.pow(2, 53) - 2;
          a.set(i, 42);
          assert(a.get(i) === 42);
        }
      },

      /* TODO: Override and test Array methods that are not MAX_LENGTH-safe */

      {
        feature: 'BigArray.prototype.toArray()',
        description: 'Return the correct value',
        code: function () {
          assertArrayEquals([], new BigArray().toArray());
          assertArrayEquals([""], new BigArray("").toArray());
          assertArrayEquals(["x"], new BigArray("x").toArray());
          assertArrayEquals([23, 42], new BigArray(23, 42).toArray());
        }
      },
      {
        feature: 'BigArray.prototype.toString(…)',
        description: 'Return the correct value',
        code: function () {
          assert(new BigArray().toString() === "");
          assert(new BigArray(0).toString() === "");
          assert(new BigArray(1).toString() === "");
          assert(new BigArray(2).toString() === ",");
        }
      },

      {
        feature: 'BigArray.prototype.valueOf(…)',
        description: 'Return the correct value',
        code: function () {
          var a = new BigArray("x\uD834\uDD1Ey");
          var v = a.valueOf();
          assert(v === a);
        }
      },

      {
        feature: 'jsx.array.createComparator(aKeys)',
        description: 'Sort <code>Array</code> as specified',
        code: function () {
          var o1 = {x: 2};
          var o2 = {x: 1};
          var a = [o1, o2];
          a.sort(_createComparator(["x"]));
          assertArrayEquals([o2, o1], a);
        }
      },
      {
        feature: 'jsx.array.createComparator(aKeys, oOptions)',
        description: 'Sort <code>Array</code> as specified',
        code: function () {
          var o1 = {x: 1};
          var o2 = {x: 2};
          var a = [o1, o2];
          a.sort(_createComparator(["x"], {descending: true}));
          assertArrayEquals([o2, o1], a);

          o1 = {x: "1 "};
          o2 = {x: 1};
          a = [o1, o2];
          a.sort(_createComparator(["x"], {strict: true}));
          assertArrayEquals([o2, o1], a);

          o1 = {x: 1};
          o2 = {x: "1 "};
          a = [o1, o2];
          a.sort(_createComparator(["x"], {descending: true, strict: true}));
          assertArrayEquals([o2, o1], a);

          o1 = {x: "20"};
          o2 = {x: "1"};
          a = [o1, o2];
          a.sort(_createComparator(["x"], {numeric: true}));
          assertArrayEquals([o2, o1], a);

          o1 = {x: "1"};
          o2 = {x: "1"};
          a = [o1, o2];
          a.sort(_createComparator(["x"], {numeric: true, strict: true}));
          assertArrayEquals([o1, o2], a);

          o1 = {x: 1};
          o2 = {x: "1"};
          a = [o1, o2];
          a.sort(_createComparator(["x"], {numeric: true}));
          assertArrayEquals([o1, o2], a);

          o1 = {x: "1 "};
          o2 = {x: 1};
          a = [o1, o2];
          a.sort(_createComparator(["x"], {numeric: true, strict: true}));
          assertArrayEquals([o1, o2], a);

          o1 = {x: 2};
          o2 = {x: "12"};
          a = [o1, o2];
          a.sort(_createComparator(["x"], {
            descending: true,
            numeric: true,
            strict: true
          }));
          assertArrayEquals([o2, o1], a);
        }
      },
      {
        feature: 'jsx.array.createComparator([{key: …, callback: …}])',
        description: 'Sort <code>Array</code> as specified',
        code: function () {
          var o1 = {
            x: "10"
          };
          var o2 = {
            x: "2"
          };
          var a = [o1, o2];
          a.sort(_createComparator([
            {
              key: "x",
              callback: Number
            }
          ]));
          assertArrayEquals([o2, o1], a);
        }
      },
      {
        feature: 'jsx.array.createComparator([{key: …, constructor: …}])',
        description: 'Sort <code>Array</code> as specified',
        code: function () {
          var o1 = {
            x: "10"
          };
          var o2 = {
            x: "2"
          };
          var a = [o1, o2];
          a.sort(_createComparator([
            {
              key: "x",
              constructor: Number
            }
          ]));
          assertArrayEquals([o2, o1], a);
        }
      },
      {
        feature: 'jsx.array.createComparator([{key: …, comparator: …}])',
        description: 'Sort <code>Array</code> as specified',
        code: function () {
          var o1 = {
            engine: {
              liters: 4.0,
              cylinders: 4
            },
          };
          var o2 = {
            engine: {
              liters: 3.0,
              cylinders: 4
            },
          };
          var a = [o1, o2];
          a.sort(_createComparator([
            {
              key: "engine",
              comparator: _createComparator(["cylinders", "liters"])
            }
          ]));
          assertArrayEquals([o2, o1], a);
        }
      },

      {
        feature: 'jsx.array.createComparator("…", {callback: …, constructor: …, comparator: …})',
        description: 'Sort <code>Array</code> as specified',
        code: function () {
          function Bar (baz)
          {
            this.baz = String(baz);
          }

          Bar.prototype.toString = function () {
            return this.baz;
          };

          function Baz (bla)
          {
            this.length = bla.length;
          }

          var o1 = {"bar": new Bar("burpbarbazbla")};
          var o2 = {"bar": new Bar("foo")};

          var foo = [o1, o2];

          foo.sort(_createComparator(["bar"], {
            callback: String,
            constructor: Baz,
            comparator: _createComparator(["length"], {numeric: true})
          }));

          assertArrayEquals([o2, o1], foo);
        }
      }
    ]
  });
}