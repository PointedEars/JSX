<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>map.js Test Case</title>
<!--     <script type="text/javaScript" src="jsunit/app/jsUnitCore.js"></script> -->
    <script type="text/javascript" src="object.js"></script>
    <script type="text/javascript" src="../map.js"></script>
<!--    <script type="text/javascript" src="debug.js"></script>-->
    <script type="text/javascript" src="test.js"></script>
    <script type="text/javascript">
      jsx._import(jsx.object, ["dmsg"]);
      jsx._import(jsx.map, ["Map", "KeyError"]);
      jsx._import(jsx.test, ["assert", "assertTrue", "assertFalse",
                             "assertUndefined", "runner"]);
      function test()
      {
        var m;
        runner.run({
          setUp: function () {
            /* Instantiation */
            m = new Map();
          },
          tests: [
            {
              name: "put() and get()",
              code: function() {
                /*  */
                assertUndefined(m.put("foo", "bar"));
                assertTrue(m.get("foo") == "bar");
  
                assertUndefined(m.put("constructor", "a"));
                assertTrue(m.get("constructor") == "a");
              }
            },

            {
              name: "remove()",
              code: function () {
                assertUndefined(m.put("foo", "bar"));
                assertTrue(m.get("foo") == "bar");
  
                assertUndefined(m.put("constructor", "a"));
                assertTrue(m.get("constructor") == "a");
                    
                assertTrue(m.remove("constructor") == "a");
                assertFalse(m.get("constructor", false));
              }
            },

            {
              name: "_maxAliasLength",
              code: function () {
                assertTrue(m.setMaxAliasLength(1));
                assertTrue(m.getMaxAliasLength() === 1);
              }
            },

            {
              name: "Undefined key, no default --> KeyError",
              code: function () {
                var x = 0;
                
                jsx.tryThis(
                  function () {
                    m.get("constructor");
                  },
                  function (e) {
                    x = e;
                  });
        
                assertTrue(x.constructor === KeyError);
              }
            },

            {
              name: "size()",
              code: function () {
                assertTrue(m.setMaxAliasLength(255));
                assertTrue(m.size() === 0);
                m.put("baz", "bla");
                assertTrue(m.size() === 1);
                m.remove("baz");
                assertTrue(m.size() === 0);
              }
            },

            {
              name: "mappings()",
              code: function () {
                var mappings = m.mappings();

                if (typeof dmsg == "function") dmsg(mappings);
                assertFalse(mappings.length > 0);

                m.put("baz", 42);
                mappings = m.mappings();
                if (typeof dmsg == "function") dmsg(mappings);
                assertTrue(mappings.length > 0);
              }
            },

            {
              name: "isEmpty()",
              code: function () {
                m.put("foo");
                assertFalse(m.isEmpty());
                m.remove("foo");
                assertTrue(m.isEmpty());
              }
            },

            {
              name: "containsKey()",
              code: function () {
                assertFalse(m.containsKey("constructor"));
                assertFalse(m.containsKey("foo"));
                m.put("foo", "bar");
                assertFalse(m.containsKey("constructor"));
                assertTrue(m.containsKey("foo"));
              }
            },

            {
              name: "putAll()",
              code: function () {
                m.put("answer", 42);
                m.put("foo", "bar");
                
                var m2 = new Map();
                m2.put("answer", 23);
                m2.putAll(m);
                assertTrue(m2.containsKey("answer"));
                assertTrue(m2.get("answer", false) === 42);
                assertTrue(m2.containsKey("foo"));
                
                m2 = new Map(m);
                assertTrue(m2.containsKey("foo"));
                assertTrue(m2.get("answer", false) === 42);
              }
            }
          ]
        });
      }
    </script>
  </head>

  <body onload="test()">
    <h1><tt>map.js</tt> Test&nbsp;Case</h1>
    <ul>
      <li><a href="view-source:http://<?php
          echo $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
          ?>">View HTML source</a> (uses view-source scheme)</li>
          
      <li><a href="../map.js">View script source</a>
        (<a href="view-source:http://<?php
          echo $_SERVER['HTTP_HOST']
            . preg_replace('/[^\/]+$/', '', $_SERVER['REQUEST_URI']);
          ?>../map.js">use view-source scheme</a>)</li>
      
      <li><a href="jsunit/testRunner?testPage=<?php
        echo urlencode(htmlentities($_SERVER['REQUEST_URI']));
        ?>&amp;autoRun=true"
        >Run unit test</a></li>
    </ul>
  </body>
</html>