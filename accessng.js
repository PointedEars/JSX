if (!this.dhtml)
{
  var dhtml = new Object();
  dhtml.supported = false;
}

if (dhtml.supported)
{
  document.write(
      '<div class="standby" id="div_status">ACCESSING FILE <span id="dots"'
    + '>&nbsp;<\/span><\/div>');
}
