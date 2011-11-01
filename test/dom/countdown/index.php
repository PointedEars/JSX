<?php header('Content-Type: text/html; charset=UTF-8'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
  "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
  <head>
    <title>DOM Test Case: Simple Countdown Timer</title>
    <link rel="Stylesheet" href="/styles/lcars.css" type="text/css">
    <style type="text/css">
      <!--
      .num {
        text-align: right;
        border: 1px solid transparent;
        width: 1.25em;
      }
      
      .num:focus {
        border: 1px solid white;
      }
      -->
    </style>
    
    <meta http-equiv="Content-Script-Type" content="text/javascript">
    <script type="text/javascript" src="/scripts/object.js"></script>
    <script type="text/javascript" src="/scripts/string.js"></script>
    <script type="text/javascript" src="/scripts/dom.js"></script>
    <script type="text/javascript" src="/scripts/dom/events.js"></script>
    <script type="text/javascript" src="/scripts/dom/audio.js"></script>
    <script type="text/javascript" src="/scripts/dom/widgets.js"></script>
    <script type="text/javascript" src="/scripts/dom/timer.js"></script>
    <script type="text/javascript">
      var timer = new jsx.dom.Timer();
      var oHours, oMins, oSec;
      
      function handleLoad()
      {
        var f = document.forms[0];
        var es = f.elements;

        var SpinnerInput = jsx.dom.widgets.SpinnerInput;
        oHours = new SpinnerInput(es['hours'], null, {
          minValue: 0
        });
        
        oMins = new SpinnerInput(es['minutes'], null, {
          leadingZero: true,
          minValue: 0,
          maxValue: 59
        });
        
        oSec = new SpinnerInput(es['seconds'], null, {
          leadingZero: true,
          minValue: 0,
          maxValue: 59
        });
      }
    </script>
  </head>
  
  <body onload="handleLoad()">
    <h1>DOM Test Case: Simple Countdown Timer</h1>
    
<!--  onkeypress="if (typeof event != 'undefined') handleKeypress(event)"
      onkeyup="if (typeof event != 'undefined') handleKeypress(event)" -->
    <form action="">
      <input name="hours" value="0" maxlength="3" class="num">&nbsp;:
      <input name="minutes" value="0" maxlength="2" class="num">&nbsp;:
      <input name="seconds" value="0" maxlength="2" class="num">
      <input type="button" value="START" class="button"
        onclick="timer.start(this)">
      <input type="button" value="STOP" class="button"
        onclick="timer.stop(this)">
      <input type="button" value="RESET" class="button"
        onclick="timer.reset(this)">
        
    </form>
  </body>
</html>