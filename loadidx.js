if (typeof dhtml == "undefined")
{
  var dhtml = new Object();
  dhtml.supported = false;
}

if (dhtml.supported)
{
  document.write(
      '<div class="standby" style="visibility: none;" id="div_status"'
    + '>LOADING INDEX <span id="dots">&nbsp;</span></div>');
}