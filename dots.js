// The following tag is for display in advanced filelists only:
// <TITLE>JavaScript 3dots LCARS Support Part 1</title>
//
// Supports dhtml.js for usage of W3C-DOM
// Refer dots.txt for general documentation.

// Hiding loading content is potentially harmful
// TODO: lcars.js::dots() and ::undots() to replace this
/*

if (!this.dhtml)
{
  var dhtml = new Object();
  dhtml.supported = false;
  dhtml.visibility = function() {};
}

if (dhtml.supported && dhtml.visibility)
{
  var divContent = getElem("id", "div_content");
  var divStatus = getElem("id", "div_status"), f;
  if (divContent && divStatus)
  {
    dhtml.visible(divContent, false);

    if (typeof divStatus.left != "undefined")
    {
      divStatus.left = document.body.offsetWidth;
    }
    
    dhtml.visible(divStatus, true);
  }
  else if ((f = parent.frames['ufpdb_banner']))
  {
    if (f.spanStatus) f.spanStatus.className = "standby";
    dhtml.setTextContent(f.spanStatus, "ACCESSING FILE");
  }
}

var dotCounter = 0;

function animDots()
{
  var dotString = "";
  
  for (var i = 0; i < dotCounter; i++)
  {
    dotString += ". ";
  }
    
  if (dhtml.setCont)
  {
    dhtml.setCont("id", "dots", null, dotString);
  }
  
  if (dotCounter == 3)
  {
    dotCounter = 0;
  }
  else
  {
    dotCounter++;
  }
}

if (dhtml.supported && divContent && divStatus)
{
  var dotsAnim = window.setInterval("animDots();", 1000);
}

*/