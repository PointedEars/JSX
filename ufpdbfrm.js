function restoreLCARS()
{
  if (top == self) // single document
  {
    var sURI = "";

    if (location.protocol.toLowerCase().indexOf("http") > -1) // http:
    { 
      if (location.hostname.length > 0
          && location.hostname.toLowerCase().indexOf("pointedears.de") < 0
          && location.hostname.toLowerCase() != "localhost")
        sURI += "/~thla-in/";
    }
    else // file:
    {
      sURI = "file:/";

      if (navigator.platform.indexOf("Win") >= 0)
        sURI += "//F:";
      else
        sURI += "windows/F";

      sURI += "/LCARS";
    }

    sURI += "/ufpdb/main?content=" + location.pathname;
    
    if (parent.location)
    {
/*
      if (parent.location.replace)
        parent.location.replace(sURI);
      else
      */
        parent.location = sURI;
    }
  }
  else if (parent.frames && parent.frames['ufpdb_banner'])
  { // within the frameset
    var f = parent.frames['ufpdb_banner'];

    if (f)
      f.makeLeftBanner(document.title);
  }
}

if (top == self) // single document
{
  document.write(
     "<hr><p>This document is part of the United Federation of Planets Database"
   + "&trade; and is best viewed within the LCARS interface.<\/p>"
   + '<a href="javascript:restoreLCARS();"'
   + ' onclick="restoreLCARS(); return false;" class="button">'
   + '&nbsp;RESTORE FRAMESET&nbsp;<\/a><hr>');
}