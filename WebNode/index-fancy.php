<!DOCTYPE html>
<html>
  <head>
    <title>WebNode</title>
    <style>
      body {
        margin: 0;
        font-family: sans-serif;
      }
      .menu-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 1.2em;
        background-color: lightgray;
      }
      .menu {
        margin: 0;
        padding: 0;
      }
      .menu-item {
        list-style: none;
        padding-top: 0.25em;
        padding-left: 0.5em;
      }
      .menu > .menu-item {
        float: left;
        margin-left: 0;
        background-color: lightgray;
      }
      .menu-item > .submenu {
        position: relative;
        padding-left: 0;
        color: white;
      }
    </style>
  </head>
  <!-- <frameset cols="33%,*">
    <frame name="groups" src="groups.html">
    <frameset rows="50%,*">
      <frame name="threads" src="threads.html">
      <frame name="posting" src="posting.html">
    </frameset>
  </frameset> -->
  <body>
    <div class="menu-container">
      <ul class="menu">
        <li class="menu-item"><u>F</u>ile
          <ul class="submenu">
            <li class="menu-item"><u>N</u>ew…</li>
            <li class="menu-item">Lorem ipsum</li>
          </ul></li>
      </ul>
    </div>
    <?php
      //error_reporting(E_ALL);
      //ini_set('display_errors', true);
      //$loader = require 'vendor/autoload.php';
      //$connection = new Rvdv\Nntp\Connection\Connection('news.solani.org', 119, false, 30);
      //$client = new Rvdv\Nntp\Client($connection);
      //$client->connectAndAuthenticate('PointedEars', 'BDnTV7wa');
      //require 'pointedears/nntp/src/Command/ListCommand.php';
      //var_dump($client->sendCommand(new PointedEars\Nntp\Command\ListCommand()));
    ?>
  </body>
</html>
