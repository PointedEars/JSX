<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>python.js Test Case</title>
    <script type="text/javascript" src="../object.js"></script>
    <!-- <script type="text/javascript" src="test.js"></script> -->
    <script type="text/javascript" src="../http.js"></script>
    <script type="text/javascript">
      jsx.importFrom("test.js");
    </script>
    <script type="text/javascript" src="../python.js"></script>
    <script type="text/javascript">
      function runTests ()
      {
        jsx._import(jsx.python);
      
        jsx.test.runner.run({
          setUp: function(i, f) {
            jsx.info("Setting up test " + (i + 1) + ":\n" + f);
          },
  
          tearDown: function(i, f) {
            jsx.info("Tearing down test " + (i + 1));
          },
  
          tests: [
            function() {
              var obj = list();
              jsx.test.assert(obj.length == 0);
            },
  
            function() {
              var obj = list([1]);
              jsx.test.assert(obj[0] === 1);
            },
  
            function() {
              var obj = list({foo: "bar"});
              jsx.test.assert(obj[0] === "foo");
            },
  
            function() {
              var obj = dict();
              jsx.test.assert(typeof obj.foo == "undefined");
            },
  
            function() {
              var obj = dict(["foo"], ["bar"]);
              jsx.test.assert(obj.foo === "bar");
            },
  
            function() {
              var obj = dict({foo: "bar"});
              jsx.test.assert(obj.foo === "bar");
            }
          ]
        });
  
        jsx._import(jsx.test);
        console.log(assert, assertFalse);
      }
    </script>
  </head>

  <body onload="runTests()">
    <h1><tt>python.js</tt> Test&nbsp;Case</h1>
  </body>
</html>