<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>regexp.js Test Case</title>
    <style type="text/css">
      <!--
      [title] {
        border-bottom: 1px dotted #666;
        cursor: help;
      }
      -->
    </style>
    <script type="text/javascript" src="object.js"></script>
    <script type="text/javascript" src="test.js"></script>
    <script type="text/javascript" src="http.js"></script>
    <script type="text/javascript" src="regexp.js"></script>
    <script type="text/javascript" src="../UnicodeData.js"></script>
    <script type="text/javascript">
      function runTests ()
      {
        var assert = jsx.test.assert;
        var assertFalse = jsx.test.assertFalse;
        var RegExp2 = jsx.regexp.RegExp;
        var out = [];
  
        jsx.test.runner.run({
          file: "regexp.js",
          feature: "jsx.regexp.RegExp",
          tests: [
            {
              name: 'Use statically loaded'
                  + ' <acronym title="Unicode Character Database"'
                  + '>UCD<\/acronym>',
              code: function() {
                assert(typeof RegExp2.propertyClasses != "undefined");
                var rx = new RegExp2("\\p{Zp}");
                assert(rx.source == "[\u2029]");
                if (!jsx.info(rx))
                {
                  out.push(rx);
                }
              }
            },
            {
              name: 'Load UCD dynamically with'
                  + ' <acronym title="XMLHttpRequest">XHR<\/acronym>',
              code: function() {
                delete RegExp2.propertyClasses;
                var rx = new RegExp2("\\p{Zp}");
                assert(rx.source == "[\u2029]");
                if (!jsx.info(rx))
                {
                  out.push(rx);
                }
              },
            },
            {
              name: "Throw exception on undefined property class",
              code: function() {
                RegExp2.deletePropertyClass("Zp");
                var thrown = false;
                jsx.tryThis(
                  function () {
                    var rx = new RegExp2("\\p{Zp}");
                    if (!jsx.info(rx))
                    {
                      out.push(rx);
                    }
                  },
                  function (e) {
                    if (e.name == "jsx.regexp.UndefinedPropertyClassError")
                    {
                      thrown = true;
                      if (!jsx.info(e))
                      {
                        out.push(e);
                      }
                    }
                    else
                    {
                      jsx.rethrowThis(e);
                    }
                  });
                assert(thrown);
              }
            },
            {
              name: '<acronym title="Perl-Compatible Regular Expressions"'
                  + '>PCRE<\/acronym> option flags:'
                  + ' <code>x<\/code> (PCRE_EXTENDED)'
                  + ' – remove single-line comments'
                  + ' and unescaped whitespace',
              code: function () {
                var rx = new RegExp2(" x#foo\n\\ y#bar", "x");
                assert(rx.source === "x y");
              }
            },
            {
              name: "PCRE option flags: <code>s<\/code> (PCRE_DOTALL)"
                  + " – <code>.</code> matches newline too",
              code: function () {
                var rx = new RegExp2(".", "s");
                assert(rx.source === "[\\S\\s]");
                
                assert("\n".match(rx)[0] === "\n");
              }
            },
            {
              name: "PCRE named subpatterns: <code>?&lt;name&gt;<\/code>"
                  + "(Perl style)",
              code: function () {
                var rx = new RegExp2("(?<foo>bar)");
                assert(rx.groups[1] === "foo");
                
                var s = new jsx.regexp.String("bar");
                assert(s == "bar");
                assert("bar" == s);
                assertFalse(s === "bar");
                assertFalse("bar" === s);
                
                var m = s.match(rx);
                assert(m.groups.foo === "bar");
              }
            },
            {
              name: "PCRE named subpatterns: <code>?'name'<\/code>"
                  + "(Perl style)",
              code: function () {
                var rx = new RegExp2("(?P'foo'bar)");
                assert(rx.groups[1] === "foo");
                
                var s = new jsx.regexp.String("bar");
                assert(s == "bar");
                assert("bar" == s);
                assertFalse(s === "bar");
                assertFalse("bar" === s);
                
                var m = s.match(rx);
                assert(m.groups.foo === "bar");
              }
            },
            {
              name: "PCRE named subpatterns: <code>?P&lt;name&gt;<\/code>"
                   + " (Python style)",
              code: function () {
                var rx = new RegExp2("(?P<foo>bar)");
                assert(rx.groups[1] === "foo");
                
                var s = new jsx.regexp.String("bar");
                assert(s == "bar");
                assert("bar" == s);
                assertFalse(s === "bar");
                assertFalse("bar" === s);
                
                var m = s.match(rx);
                assert(m.groups.foo === "bar");
              }
            },
            {
              name: "Unicode mode: <code>\\w<\/code> matches non-ASCII letter",
              code: function () {
                var rx = new RegExp2("\\w", "u");
                assert(rx.exec("ä") != null);
              }
            },
            {
              name: "Unicode mode: <code>[\\w]<\/code> matches"
                  + " non-ASCII letter",
              code: function () {
                var rx = new RegExp2("[\\w]", "u");
                assert((rx.exec("ä") || [])[0] == "ä");
              }
            },
            {
              name: "Unicode mode: <code>\\W<\/code> does not match"
                  + " non-ASCII letter",
              code: function () {
                var rx = new RegExp2("\\W", "u");
                assert(rx.exec("ä") === null);
              }
            },
            {
              name: "Unicode mode: <code>[\\W]<\/code> does not match"
                  + " non-ASCII letter",
              code: function () {
                var rx = new RegExp2("[\\W]", "u");
                assert(rx.exec("ä") === null);
              }
            },
            {
              name: "Unicode mode: <code>[^\\W]<\/code> matches"
                  + " non-ASCII letter",
              code: function () {
                var rx = new RegExp2("[^\\W]", "u");
                assert((rx.exec("ä") || [])[0] == "ä");
              }
            }
          ]
        });
        
        if (out.length > 0)
        {
          window.alert(out.join("\n"));
        }
      }
    </script>
  </head>

  <body onload="runTests()">
    <h1><tt>regexp.js</tt> Unit&nbsp;Test</h1>
    <div><a href="view-source:http://<?php
      echo $_SERVER['HTTP_HOST'] . htmlspecialchars($_SERVER['REQUEST_URI']);
      ?>">View source</a></div>
    <p><strong>See error console for details.</strong></p>
  </body>
</html>