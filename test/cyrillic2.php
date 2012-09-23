<?php
  if (isset($_GET['correct']))
  {
    header('Content-Type: text/html; charset=UTF-8');
  }

  // Demonstrates what the wrong default encoding can do to a resource
  else
  {
    header('Content-Type: text/html; charset=Windows-1251');
  }
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">

<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Scripting Test Case: Encoding vs. Document Character Set</title>

    <meta name="DCTERMS.created" content="2006-04-04">
    
    <script type="text/javascript">
      function foo()
      {
        alert("Понимаешь?");
      }
    </script>
    
    <style type="text/css">
      body {
        background-color: white;
        color: black;
      }
    
      div, p {
        margin: 1em auto;
      }
    
      acronym {
        border-bottom:1px dotted #999;        
        cursor: help;
      }
    </style>
  </head>
  
  <body>
    <?php
      if (!isset($_GET['correct']))
      {
    ?>
        <p>This <a href="http://en.wikipedia.org/wiki/UTF-8"><acronym
          title="8-bit Unicode Transformation Format">UTF-8</acronym></a>
          encoded resource is served with the wrong encoding declaration in
          the <tt>Content-Type</tt> <a
          href="http://en.wikipedia.org/wiki/HyperText_Transfer_Protocol"
          ><acronym title="HyperText Transfer Protocol"
          >HTTP</acronym></a>&nbsp;header (<tt>charset=<a
          href="http://en.wikipedia.org/wiki/Windows-1251"
          >Windows-1251</a></tt>).  That the included <a
          href="http://www.w3.org/TR/html4/struct/global.html#edef-META"
          ><tt>meta</tt></a> element "declares" the correct encoding does
          not matter; the HTTP&nbsp;header takes precedence.</p>
          
        <p>Nevertheless, the <a
          href="http://www.w3.org/TR/html4/charset.html#h-5.1"
          >Document Character Set for <acronym
          title="HyperText Markup Language">HTML</acronym>&nbsp;4.01
          documents</a> is still <a
          href="http://en.wikipedia.org/wiki/Universal_Character_Set"
          ><acronym title="the Universal Character Set">UCS</acronym></a>,
          so character references can be used in <a
          href="http://en.wikipedia.org/wiki/CDATA"><tt>CDATA</tt></a>
          attribute values to represent non-<a
          href="http://en.wikipedia.org/wiki/ASCII"><acronym
          title="American Standard Code for Information Interchange"
          >ASCII</acronym></a> characters:</p>  
    <?php
      }
    ?>
    
    <div><input type="button"
      value="&#1042;&#1099;&#1073;&#1077;&#1088;&#1080; &#1084;&#1077;&#1085;&#1103;!"
      lang="ru"
      onclick="foo();"></div>
    
    <?php
      if (!isset($_GET['correct']))
      {
    ?>
      <div><a href="?correct=1"
        >Serve (almost) the same content with the correct encoding declaration
        (<tt>charset=UTF-8</tt>)</a></div>
    <?php
      }
    ?>
  </body>
</html>