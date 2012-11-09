function runTests ()
{
  jsx._import(jsx.test);
  jsx._import(jsx.python);

  jsx.test.runner.run({
//    setUp: function(i, f) {
//      jsx.info("Setting up test " + (i + 1) + ":\n" + f);
//    },

//    tearDown: function(i, f) {
//      jsx.info("Tearing down test " + (i + 1));
//    },

    file: "python.js",
    tests: [
      {
        feature: "jsx.python.list()",
        desc: "<code>list()<\/code> returns <code>[]<\/code>",
        code: function () {
          var obj = list();
          assert(obj.length == 0);
        }
      },

      {
        feature: "jsx.python.list()",
        desc: "<code>list([1])<\/code> returns <code>[1]<\/code>",
        code: function() {
          var obj = list([1]);
          assert(obj[0] === 1);
        }
      },

      {
        feature: "jsx.python.list()",
        desc: '<code>list({foo: "bar"})<\/code> returns'
              + ' <code>["foo"]</code>',
        code: function() {
          var obj = list({foo: "bar"});
          assert(obj[0] === "foo");
        }
      },

      {
        feature: "jsx.python.dict()",
        desc: "<code>dict()<\/code> returns <code>{}<\/code>",
        code: function() {
          var obj = dict();
          assert(typeof obj.foo == "undefined");
        }
      },

      {
        feature: "jsx.python.dict()",
        desc: '<code>dict({"foo": "bar"})<\/code> returns'
              + ' <code>{foo: "bar"}<\/code>',
        code: function() {
          var obj = dict({foo: "bar"});
          assert(obj.foo === "bar");
        }
      },

      {
        feature: "jsx.python.dict()",
        desc: '<code>dict(["foo"], ["bar"])<\/code> returns'
              + ' <code>{foo: "bar"}<\/code>',
        code: function() {
          var obj = dict(["foo"], ["bar"]);
          assert(obj.foo === "bar");
        }
      },
      
      {
        feature: "jsx.python.set()",
        desc: '<code>set(["a", "b", "a", "b"])<\/code> returns'
          + ' <code>new set(["a", "b"])<\/code> or <code>new set(["b", "a"])<\/code>',
          code: function() {
            var _map = jsx.map;
            
            delete jsx.map;
            var a = set(["a", "b", "a", "b"]).toArray();
            assert(a.length === 2
                    && ((a[0] === "a" && a[1] === "b")
                        || (a[0] === "b" && a[1] === "a")));
            
            jsx.map = _map;
            a = set(["a", "b", "a", "b"]).toArray();
            assert(a.length === 2
                    && ((a[0] === "a" && a[1] === "b")
                        || (a[0] === "b" && a[1] === "a")));
          }
      }
    ]
  });
}