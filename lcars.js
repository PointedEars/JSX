if (!this.dhtml)
{
  var dhtml = new Object();
  dhtml.supported = false;
  dhtml.visibility = function() {};
}

function accessing()
{
  if (dhtml.supported)
  {
    document.write(
      '<div class="standby" id="div_status">ACCESSING FILE <span id="dots"'
      + '>&nbsp;<\/span><\/div>');
  }
}


function loadIdx()
{
  if (dhtml.supported)
  {
    document.write(
        '<div class="standby" style="visibility: none;" id="div_status"'
      + '>LOADING INDEX <span id="dots">&nbsp;</span></div>');
  }
}

function animDots()
{
  var dotString = "";
    
  for (var i = 0; i < animDots.dotCounter; i++)
  {
    dotString += ". ";
  }
    
  if (dhtml.setCont)
  {
    dhtml.setCont("id", "dots", null, dotString);
  }
  
  if (dotCounter == 3)
  {
    animDots.dotCounter = 0;
  }
  else
  {
    animDots.dotCounter++;
  }
}
animDots.dotCounter = 0;

// disable both "dot" methods until reusing the "status" element works
/*
function dots()
{
  if (dhtml.supported && dhtml.visibility)
  {
    dots.divContent = getElem("id", "div_content");
    dots.divStatus = getElem("id", "div_status"), f;
    if (dots.divContent && dots.divStatus)
    {
      dhtml.visibility(dots.divContent, false);
  
      if (typeof divStatus.left != "undefined")
      {
        dots.divStatus.left = document.body.offsetWidth;
      }
      
      dhtml.visibility(divStatus, true);
    }
    else if ((dots.f = parent.frames['ufpdb_banner']))
    {
      dots.f.spanStatus.className = "standby";
      dhtml.setTextContent(dots.f.spanStatus, "ACCESSING FILE");
    }
  }
  
  if (dhtml.supported && dots.divContent && dots.divStatus)
  {
    dots.anim = window.setInterval("animDots();", 1000);
  }
}

function undots()
{
  if (dhtml.supported)
  {
    window.clearInterval(dots.anim);
    if (dots.divContent && dots.divStatus)
    {
      dots.divStatus.style.visibility = "hidden";
      dots.divContent.style.visibility = "visible";
    }
    else
    {
      dots.f.spanStatus.className = "";
      dhtml.setTextContent(f.spanStatus, "DATABASE");
    }
  }
}
*/
function dots() {}
function undots() {}

function getOffsets(a)
{
  var offset = 0;
  
  for (var i = 0, len = a.length; i < len; i++)
  {
    offset += a[i];
    a[i] = offset;
  }

  return a;
}

function blendWords(o, bBlendIn, iDelay)
{
  if (!iDelay)
  {
    iDelay = 1000;
  }
  
  if (o)
  {
    var sCont = getCont(o);
    if (sCont)
    {
      // blendWords.targets.push({target: o, timeouts: []});
      // var id = blendWords.targets.length - 1;
      
      var aWords = sCont.split(/\s+/), i, len;

      for (i = aWords.length; i--;)
      {
        aWords[i] = {
          value: aWords[i],
          delay: iDelay * Math.floor(aWords[i].length / sCont.length)
        };
      }

      if (bBlendIn)
      {
        var t = function()
        {
          window.clearTimeout(
            //blendWords.targets[id].timeouts[i]
            t);
          setTextContent(
            // blendWords.targets[id].target,
            o,
            // getTextContent(blendWords.targets[id].target)
            getTextContent(o)
              + ' '
              + aWords[i].value)
        };

        t.toString = function()
        {
          return 't();';
        }
        
        // var _setTimeout = function(f, delay, args)
        // {
        //   f.apply(this, args);
        // };
                  
        for (i = 0, len = aWords.length; i < len; i++)
        {
          // blendWords.targets[id].timeouts[i] =
          var t2 = window.setTimeout(t, aWords[i].delay);
        }
      }
      else
      {
        //
      }
    }
  }
}
/**
 * @property : number = Internal ID of accessed object
 */
blendWords.targets = new Array();

/* LCARS widget prototypes */

function LCARSWidget(x, y)
{
	this.moveTo(x, y);
	this.elem = dhtml.createElement('div');
}

LCARSWidget.prototype = {
  constructor: LCARSWidget,

  moveTo: function(x, y)
  {
    this.x = x;
    this.y = y;
    if (dhtml.getStyle(this.obj, "display") == 'visible') this.repaint();
  }
};

/**
 * Creates a new LCARS Timer widget.
 * 
 * Takes up to three.  The first two may define the relative position
 * of the corresponding block element in CSS units of length, while
 * the third one allows to initialize the timer in milliseconds. 
 * 
 * @param [optional] {String} x
 * @param [optional] {String} y
 * @param [optional] {Number} nStart
 */
function LCARSTimer(x, y, nStart)
{
	LCARSWidget.call(this, x, y)
	this.reset();
}

LCARSTimer.prototype = {
	constructor: LCARSTimer,
	
	reset: function()
	{
		this.value = 0;
	}
};