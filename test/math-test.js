function runTests ()
{
  var assert = jsx.test.assert;
  var assertObjectEquals = jsx.test.assertObjectEquals;
  var assertArrayEquals = jsx.test.assertArrayEquals;

  jsx.test.runner.run({
    tests: [
      {
        file: "math/float.js",
        feature: "jsx.math.getValue(falseValue)",
        description: "return <code>NaN</code>",
        code: function () {
          assert(isNaN(jsx.math.getValue()));
          assert(isNaN(jsx.math.getValue(false)));
          assert(isNaN(jsx.math.getValue(0)));
          assert(isNaN(jsx.math.getValue(null)));
          assert(isNaN(jsx.math.getValue('')));
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.getValue(obj)",
        description: "<code>obj.valueOf()</code> does not exist, return <code>NaN</code>",
        code: function () {
          assert(isNaN(jsx.math.getValue(jsx.object.getDataObject())));
          assert(isNaN(jsx.math.getValue({valueOf: 42})));
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.getValue(obj)",
        description: "<code>obj.valueOf()</code> does not return number, return <code>NaN</code>",
        code: function () {
          assert(isNaN(jsx.math.getValue({valueOf: function () { return false; }})));
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.getValue(obj)",
        description: "<code>obj.valueOf()</code> returns number, return the return value",
        code: function () {
          assert(jsx.math.getValue({valueOf: function () { return 42; }}) === 42);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min()",
        description: "No arguments, return <code>Number.POSITIVE_INFINITY</code>",
        code: function () {
          assert(jsx.math.min() === Number.POSITIVE_INFINITY);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min(number)",
        description: "return <code>number</code>",
        code: function () {
          assert(jsx.math.min(42) === 42);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min(-1, 1, 0)",
        description: "return <code>-1</code>",
        code: function () {
          assert(jsx.math.min(-1, 1, 0) === -1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min(0, -1, 1)",
        description: "return <code>-1</code>",
        code: function () {
          assert(jsx.math.min(0, -1, 1) === -1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min(1, 0, -1)",
        description: "return <code>-1</code>",
        code: function () {
          assert(jsx.math.min(1, 0, -1) === -1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min([-1, 1, 0])",
        description: "return <code>-1</code>",
        code: function () {
          assert(jsx.math.min([-1, 1, 0]) === -1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min(-2, [-1, 1, 0])",
        description: "return <code>-2</code>",
        code: function () {
          assert(jsx.math.min(-2, [-1, 1, 0]) === -2);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min([-1, 1, 0], -2)",
        description: "return <code>-2</code>",
        code: function () {
          assert(jsx.math.min([-1, 1, 0], -2) === -2);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min([-1, 1, -2], 0)",
        description: "return <code>-2</code>",
        code: function () {
          assert(jsx.math.min([-1, 1, -2], 0) === -2);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min(1, {valueOf: function () { return -1; }, x: -2})",
        description: "return <code>-1</code>",
        code: function () {
          assert(jsx.math.min(1, {valueOf: function () { return -1; }, x: -2}) === -1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min(0, {x: -1, y: -2, z: 1})",
        description: "return <code>-2</code>",
        code: function () {
          assert(jsx.math.min(0, {x: -1, y: -2, z: 1}) === -2);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.min(0, {x: {y: -2}, z: -1})",
        description: "return <code>-2</code>",
        code: function () {
          assert(jsx.math.min(0, {x: {y: -2}, z: -1}) === -2);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max()",
        description: "No arguments, return <code>Number.NEGATIVE_INFINITY</code>",
        code: function () {
          assert(jsx.math.max() === Number.NEGATIVE_INFINITY);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max(number)",
        description: "return <code>number</code>",
        code: function () {
          assert(jsx.math.max(42) === 42);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max(-1, 1, 0)",
        description: "return <code>1</code>",
        code: function () {
          assert(jsx.math.max(-1, 1, 0) === 1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max(0, -1, 1)",
        description: "return <code>1</code>",
        code: function () {
          assert(jsx.math.max(0, -1, 1) === 1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max(1, 0, -1)",
        description: "return <code>1</code>",
        code: function () {
          assert(jsx.math.max(1, 0, -1) === 1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max([1, -1, 0])",
        description: "return <code>1</code>",
        code: function () {
          assert(jsx.math.max([1, -1, 0]) === 1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max(2, [-1, 1, 0])",
        description: "return <code>2</code>",
        code: function () {
          assert(jsx.math.max(2, [-1, 1, 0]) === 2);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max([1, -1, 0], 2)",
        description: "return <code>2</code>",
        code: function () {
          assert(jsx.math.max([1, -1, 0], 2) === 2);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max([1, -1, 2], 0)",
        description: "return <code>2</code>",
        code: function () {
          assert(jsx.math.max([1, -1, 2], 0) === 2);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max(-1, {valueOf: function () { return 1; }, x: 0})",
        description: "return <code>1</code>",
        code: function () {
          assert(jsx.math.max(-1, {valueOf: function () { return 1; }, x: 0}) === 1);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max(0, {x: 1, y: 2, z: -1})",
        description: "return <code>2</code>",
        code: function () {
          assert(jsx.math.max(0, {x: 1, y: 2, z: -1}) === 2);
        }
      },
      {
        file: "math/float.js",
        feature: "jsx.math.max(-1, {x: {y: 1}, z: 0})",
        description: "return <code>1</code>",
        code: function () {
          assert(jsx.math.max(-1, {x: {y: 1}, z: 0}) === 1);
        }
      },

      {
        file: "math/integer.js",
        feature: "Math.primes(10)",
        description: "return <code>{2: true, 3: true, 5: true, 7: true}</code>",
        code: function () {
          assertObjectEquals(
            {2: true, 3: true, 5: true, 7: true},
            Math.primes(10));
        }
      },

      {
        file: "math/algebra.js",
        feature: "new jsx.math.Matrix()",
        description: "return <code>[undefined] : Matrix</code>",
        code: function () {
          assertArrayEquals([void 0], new jsx.math.Matrix().get());
        }
      },
      {
        file: "math/algebra.js",
        feature: "new jsx.math.Matrix(0)",
        description: "throw <code>jsx.math.DimensionError</code>",
        code: function () {
          var fail = false;

          jsx.tryThis(
            function () {
              new jsx.math.Matrix(0);
            },
            function (e) {
              if (e.constructor == jsx.math.DimensionError)
              {
                fail = true;
                jsx.dmsg(e);
              }
              else
              {
                jsx.rethrowThis(e);
              }
            }
          );

          assert(fail);
        }
      },
      {
        file: "math/algebra.js",
        feature: "new jsx.math.Matrix(1)",
        description: "return <code>[undefined] : Matrix</code>",
        code: function () {
          assertArrayEquals([void 0], new jsx.math.Matrix(1).get());
        }
      },
      {
        file: "math/algebra.js",
        feature: "new jsx.math.Matrix(1, 0)",
        description: "throw <code>jsx.math.DimensionError</code>",
        code: function () {
          var fail = jsx.tryThis(
            function () {
              return !(new jsx.math.Matrix(1, 0));
            },
            function (e) {
              jsx.dmsg(e);
              return (e instanceof jsx.math.DimensionError);
            }
          );

          assert(fail);
        }
      }
    ]
  });
}

// var d = new Date(), n = 0.09;
// alert([
//   n + " + 0.09 = " + (new Float(n)).add(0.09),
//   n + " + 0.09 = " + (n + 0.09),
//   (new Date() - d) + " ms"
// ].join("\n"));
