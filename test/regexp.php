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
    <script type="text/javascript"
            src="../builder?gzip=0&amp;src=object,dom,dom/timeout,test/test,http&amp;verbose=1"></script>
    <script type="text/javascript" src="../regexp.js"></script>
    <script type="text/javascript" src="../UnicodeData.js"></script>
    <script type="text/javascript" src="regexp-test.js"></script>
  </head>

  <body>
    <h1><tt>regexp.js</tt> Unit&nbsp;Test</h1>
    <div><a href="view-source:http://<?php
      echo $_SERVER['HTTP_HOST'] . htmlspecialchars($_SERVER['REQUEST_URI']);
      ?>">View source</a></div>
    <script type="text/javascript">runTests()</script>
  </body>
</html>