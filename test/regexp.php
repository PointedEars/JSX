<?php header('Content-Type: text/html; charset=utf8'); ?>
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
    <script type="text/javascript" src="../regexp.js"></script>
    <script type="text/javascript" src="../UnicodeData.js"></script>
    <script type="text/javascript">
      var RegExp2 = jsx.regexp.RegExp;
      var String2 = jsx.regexp.String;
      function runTests ()
      {
        var assert = jsx.test.assert;
        var assertTrue = jsx.test.assertTrue;
        var assertFalse = jsx.test.assertFalse;
        var out = [];
  
        jsx.test.runner.run({
          file: "regexp.js",
          feature: "jsx.regexp.RegExp",
          tests: [
            {
              feature: "jsx.regexp.toString2(RegExp),"
                     + " regexp.toString2()",
              desc: "Return the literal that was used to create"
                  + " the <code>RegExp</code>, without delimiters"
                  + " and flags",
              code: function () {
                var s = "\\bfo?o+";
                var rx = new RegExp(s);
                assert(jsx.regexp.toString2(rx) === s);
                assert(rx.toString2() === s);
              }
            },
            {
              feature: "jsx.regexp.concat(…),"
                     + " RegExp.prototype.concat(…)",
              desc: "Concat <code>RegExp</code>s",
              code: function () {
                assert(jsx.regexp.concat(/foo/, /bar/).source == "foobar");
                assert(/foo/.concat(/bar/).source == "foobar");
              }
            },
            {
              feature: "jsx.regexp.concat(…),"
                     + " RegExp.prototype.concat(…)",
              desc: "Concat <code>RegExp</code>s, merge flags",
              code: function () {
                var rx = jsx.regexp.concat(/foo/, /bar/g);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/, /bar/);
                assertTrue(!rx.global && !rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/, /bar/g);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/, /bar/i);
                assertTrue(!rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/, /bar/m);
                assertTrue(!rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/, /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/, /bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/, /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/g, /bar/);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/g, /bar/g);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/g, /bar/i);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/g, /bar/m);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/g, /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/g, /bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/g, /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/i, /bar/);
                assertTrue(!rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/i, /bar/g);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/i, /bar/i);
                assertTrue(!rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/i, /bar/m);
                assertTrue(!rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/i, /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/i, /bar/gm);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/i, /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, /bar/);
                assertTrue(!rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, /bar/g);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, /bar/i);
                assertTrue(!rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, /bar/m);
                assertTrue(!rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, /bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, /bar/);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, /bar/g);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, /bar/i);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, /bar/m);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, /bar/gm);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, /bar/);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, /bar/g);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, /bar/i);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, /bar/m);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, /bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, /bar/);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, /bar/g);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, /bar/gm);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/.concat(/bar/g);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = /foo/.concat(/bar/);
                assertTrue(!rx.global && !rx.ignoreCase && !rx.multiline);

                rx = /foo/.concat(/bar/g);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = /foo/.concat(/bar/i);
                assertTrue(!rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/.concat(/bar/m);
                assertTrue(!rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/.concat(/bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/.concat(/bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/.concat(/bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/g.concat(/bar/);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = /foo/g.concat(/bar/g);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = /foo/g.concat(/bar/i);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/g.concat(/bar/m);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/g.concat(/bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/g.concat(/bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/g.concat(/bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/i.concat(/bar/);
                assertTrue(!rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/i.concat(/bar/g);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/i.concat(/bar/i);
                assertTrue(!rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/i.concat(/bar/m);
                assertTrue(!rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/i.concat(/bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/i.concat(/bar/gm);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/i.concat(/bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/m.concat(/bar/);
                assertTrue(!rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/m.concat(/bar/g);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/m.concat(/bar/i);
                assertTrue(!rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/m.concat(/bar/m);
                assertTrue(!rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/m.concat(/bar/gi);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/m.concat(/bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/m.concat(/bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gi.concat(/bar/);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/gi.concat(/bar/g);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/gi.concat(/bar/i);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/gi.concat(/bar/m);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gi.concat(/bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = /foo/gi.concat(/bar/gm);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gi.concat(/bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gm.concat(/bar/);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/gm.concat(/bar/g);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/gm.concat(/bar/i);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gm.concat(/bar/m);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/gm.concat(/bar/gi);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gm.concat(/bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = /foo/gm.concat(/bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gim.concat(/bar/);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gim.concat(/bar/g);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gim.concat(/bar/gi);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gim.concat(/bar/gm);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = /foo/gim.concat(/bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);
              }
            },
            {
              feature: "jsx.regexp.concat(…),"
                     + " RegExp.prototype.concat(…)",
              desc: "Concat <code>RegExp</code>s and <code>String</code>s",
              code: function () {
                assert(jsx.regexp.concat(/foo/, "|", /bar/).source == "foo|bar");
                assert(jsx.regexp.concat(/foo/, "|", "bar").source == "foo|bar");
                assert(jsx.regexp.concat("foo", "|", "bar").source == "foo|bar");

                assert(/foo/.concat("|", /bar/).source == "foo|bar");
                assert(/foo/.concat("|", "bar").source == "foo|bar");
              }
            },
            {
              feature: "jsx.regexp.concat(…),"
                     + " RegExp.prototype.concat(…)",
              desc: "Concat <code>RegExp</code>s and <code>String</code>s, merge flags",
              code: function () {
                var rx = jsx.regexp.concat(/foo/, "|", /bar/);
                assertTrue(!rx.global && !rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/, "|", /bar/g);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/, "|", /bar/i);
                assertTrue(!rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/, "|", /bar/m);
                assertTrue(!rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/, "|", /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/, "|", /bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/, "|", /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/g, "|", /bar/);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/g, "|", /bar/g);
                assertTrue(rx.global && !rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/g, "|", /bar/i);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/g, "|", /bar/m);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/g, "|", /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/g, "|", /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/g, "|", /bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/g, "|", /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/i, "|", /bar/);
                assertTrue(!rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/i, "|", /bar/g);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/i, "|", /bar/i);
                assertTrue(!rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/i, "|", /bar/m);
                assertTrue(!rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/i, "|", /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/i, "|", /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, "|", /bar/);
                assertTrue(!rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, "|", /bar/g);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, "|", /bar/i);
                assertTrue(!rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, "|", /bar/m);
                assertTrue(!rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, "|", /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/m, "|", /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, "|", /bar/);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, "|", /bar/g);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, "|", /bar/i);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, "|", /bar/m);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, "|", /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && !rx.multiline);

                rx = jsx.regexp.concat(/foo/gi, "|", /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, "|", /bar/);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, "|", /bar/g);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, "|", /bar/i);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, "|", /bar/m);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, "|", /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, "|", /bar/gm);
                assertTrue(rx.global && !rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gm, "|", /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, "|", /bar/);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, "|", /bar/g);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, "|", /bar/i);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, "|", /bar/m);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, "|", /bar/gi);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, "|", /bar/gm);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);

                rx = jsx.regexp.concat(/foo/gim, "|", /bar/gim);
                assertTrue(rx.global && rx.ignoreCase && rx.multiline);
              }
            },
            {
              feature: 'jsx.regexp.intersect(), /foo/.intersect(),'
                     + ' jsx.regexp.intersect(…)',
              desc: "Return <code>null</code>",
              code: function () {
                assert(jsx.regexp.intersect() === null);
                assert(/foo/.intersect() === null);
                assert(jsx.regexp.intersect("foo") === null);
                assert(jsx.regexp.intersect(/foo/) === null);
              }
            },
            {
              feature: "jsx.regexp.intersect(String, …)",
              desc: "Return <code>null</code>",
              code: function () {
                assert(jsx.regexp.intersect("foo", "bar") === null);
                assert(jsx.regexp.intersect("foo", /bar/) === null);
              }
            },
            {
              feature: "regexp.intersect(String)",
              desc: "Return <code>null</code>",
              code: function () {
                assert(/foo/.intersect("bar") === null);
              }
            },
            {
              feature: "jsx.regexp.intersect(/foo/, /bar/),"
                     + " /foo/.intersect(/bar/)",
              desc: 'Return <code>/()/</code>',
              code: function () {
                assert(jsx.regexp.intersect(/foo/, /bar/).source === "()");
                assert(/foo/.intersect(/bar/).source === "()");
              }
            },
            {
              feature: "jsx.regexp.intersect(/foo|bar/, /baz|bar/),"
                     + " /foo|bar/.intersect(/baz|bar/)",
              desc: 'Return <code>/(bar)/</code>',
              code: function () {
                assert(jsx.regexp.intersect(/foo|bar/, /baz|bar/).source == "(bar)");
                assert(/foo|bar/.intersect(/baz|bar/).source == "(bar)");
              }
            },
            {
              feature: "jsx.regexp.intersect(/foo|bar|baz/, /baz|bla|bar/)",
              desc: 'Return <code>/(bar|baz)/</code> or <code>/(baz|bar)/</code>',
              code: function () {
                var rx = jsx.regexp.intersect(/foo|bar|baz/, /baz|bla|bar/);
                assert(rx.source == "(bar|baz)" || rx.source == "(baz|bar)");
              }
            },
            {
              name: 'Use statically loaded'
                  + ' <acronym title="Unicode Character Database"'
                  + '>UCD<\/acronym>',
              code: function () {
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
              code: function () {
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
              code: function () {
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
                
                assertTrue(thrown);
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
                assert(rx.source == "x y");
              }
            },
            {
              name: 'PCRE pattern-match modifiers <code>(?x)</code> and <code>(?-x)<\/code>',
              code: function () {
                var rx = new RegExp2("a b#foo\n(?-x)c d#bar\r\n(?x)d e#baz\r(?-x)f g", "x");
                assert(rx.source == "abc d#bar\r\ndef g");
              }
            },
            {
              name: 'PCRE combined pattern-match modifier <code>(?x-x)<\/code>'
                  + ' (no change)',
              code: function () {
                var rx = new RegExp2("(?x-x)a b#foo");
                assert(rx.source == "a b#foo");
              }
            },
            {
              name: "PCRE option flags: <code>extended</code> property",
              code: function () {
                assertFalse(new RegExp2("\\w", "").extended);
                assertTrue(new RegExp2("\\w", "x").extended);
              }
            },
            {
              name: "PCRE option flags: <code>s<\/code> (PCRE_DOTALL)"
                  + " – <code>.</code> matches newline too",
              code: function () {
                var rx = new RegExp2(".", "s");
                assert(rx.source == "[\\S\\s]");
                
                assert("\n".match(rx)[0] == "\n");
              }
            },
            {
              name: 'PCRE pattern-match modifier <code>(?s-s)<\/code>',
              code: function () {
                var rx = new RegExp2("a.b(?-s)c.d(?s)e.f", "s");
                assert(rx.source == "a[\\S\\s]bc.de[\\S\\s]f");

                assert(("a\nbc.de\nf".match(rx) || [])[0] === "a\nbc.de\nf");
                assert("a\nbc\nde\nf".match(rx) === null);
              }
            },
            {
              name: "PCRE option flags: <code>dotAll</code> property",
              code: function () {
                assertFalse(new RegExp2("\\w", "").dotAll);
                assertTrue(new RegExp2("\\w", "s").dotAll);
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
              name: "Unicode mode: <code>unicodeMode<\/code> property",
              code: function () {
                assertFalse(new RegExp2("\\w", "").unicodeMode);
                assertTrue(new RegExp2("\\w", "u").unicodeMode);
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
            },
            {
              name: "Unicode mode: <code>\\b<\/code> matches"
                  + " at the start of input",
              code: function () {
                var rx = new RegExp2("\\ba", "u");
                assert((rx.exec("a") || [])[0] === "a");
              }
            },
            {
              name: "Unicode mode: <code>\\b<\/code> matches"
                  + " after initial opening group parenthesis",
              code: function () {
                assert(((new RegExp2("(\\ba)", "u")).exec("a") || [])[0] === "a");
                assert(((new RegExp2("(?:\\ba)", "u")).exec("a") || [])[0] === "a");
                assert(((new RegExp2("(?<foo>\\ba)", "u")).exec("a") || [])[0] === "a");
                assert(((new RegExp2("(?'foo'\\ba)", "u")).exec("a") || [])[0] === "a");
                assert(((new RegExp2("(?P<foo>\\ba)", "u")).exec("a") || [])[0] === "a");
              }
            },
            {
              name: "Unicode mode: <code>\\b<\/code> matches"
                  + " at the end of input",
              code: function () {
                var rx = new RegExp2("a\\b", "u");
                assert((rx.exec("a") || [])[0] === "a");
              }
            },
            {
              name: "Unicode mode: <code>\\b<\/code> does not"
                  + " match after non-ASCII letter",
              code: function () {
                var rx = new RegExp2("\\ba", "u");
                assert(rx.exec("äa") === null);
              }
            },
            {
              name: "Unicode mode: <code>\\b<\/code> does not"
                  + " match before non-ASCII letter",
              code: function () {
                var rx = new RegExp2("a\\b", "u");
                assert(rx.exec("aä") === null);
              }
            },
            {
              feature: '(new jsx.regex.RegExp(…, "u")).exec(String)',
              name: "Unicode mode: <code>\\b<\/code> matches"
                  + " after non-letter, match is trimmed",
              code: function () {
                var rx = new RegExp2("\\bä", "u");
                assert((rx.exec(" ä") || [])[0] === "ä");
              }
            },
            {
              name: "Unicode mode: <code>\\b<\/code> matches"
                  + " before non-letter",
              code: function () {
                var rx = new RegExp2("ä\\b", "u");
                assert((rx.exec("ä ") || [])[0] === "ä");
              }
            },
            {
              feature: "jsx.regexp.RegExp.exec(jsx.regexp.RegExp, String)",
              desc: "Unicode mode: <code>\\b<\/code> match"
                  + " before non-ASCII letter is trimmed",
              code: function () {
                var rx = new RegExp2("\\bä", "u");
                assert((RegExp2.exec(rx, " ä") || [])[0] === "ä");
              }
            },
            {
              feature: 'jsx.regexp.String.prototype.match(new jsx.regexp.RegExp(…, "u"))',
              desc: "Unicode mode: <code>\\b<\/code> match"
                  + " before non-ASCII letter is trimmed (all captures)",
              code: function () {
                var rx = new RegExp2("(\\bä)", "u");
                var m = (new String2(" ä")).match(rx);
                assertTrue(m[0] === "ä" && m[1] === "ä");
              }
            },
            {
              feature: 'jsx.regexp.String.prototype.match(new jsx.regexp.RegExp(…, "gu"))',
              desc: "Unicode mode: <code>\\b<\/code> match"
                  + " before non-ASCII letter is trimmed (all matches)",
              code: function () {
                var rx = new RegExp2("\\b\\w", "gu");
                var m = new String2(" ä ö").match(rx);
                assert(m[0] === "ä" && m[1] === "ö");
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