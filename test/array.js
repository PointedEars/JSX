function runTests()
{
  var _test = jsx.test;
  var assert = _test.assert;
  var assertArrayEquals = _test.assertArrayEquals;
  var _createComparator = jsx.array.createComparator;

  _test.runner.run({
    file: "array.js",
    tests: [
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