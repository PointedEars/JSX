

jsx.dom.Timer = function(f, oProperties) {
  if (f){this.form = f;}
  this.message = "";
  
  if (typeof Object.keys == "function")
  {
    var keys = Object.keys(oProperties);
    for (var i = 0, len = keys.length; i < len; ++i)
    {
      var p = keys[i];
      this[p] = oProperties[p];
    }
  }
  else
  {
    for (p in oProperties)
    {
      this[p] = oProperties[p];
    }
  }
};

jsx.dom.Timer.prototype = {
  constructor: jsx.dom.Timer,
  
  start: function(o)
  {
    if (o){this.form = o.form;}
    
    // clear the previous timeout
    this.stop();

    if (jsx.object.isMethod(window, "setTimeout"))
    {
      var me = this;
      this.timeout = window.setTimeout(
        function() { me.tick(1000); me = null; },
        1000);
    }
  },

  tick: function(interval)
  {
    var
      es = this.form.elements,
      hours = +es["hours"].value,
      mins = +es["minutes"].value,
      secs = +es["seconds"].value;
    
    if (--secs < 0)
    {
      secs = 59;
      mins--;
    }
    
    if (mins < 0)
    {
      mins = 59;
      hours--;
    }
    
    if (hours < 0)
    {
      this.ring();
    }
    else
    {
      es["hours"].value = hours;
      es["minutes"].value = leadingZero(mins, 2);
      es["seconds"].value = leadingZero(secs, 2);
      
      var me = this;
      this.timeout = window.setTimeout(
        function() { me.tick(interval); me = null; },
        interval);
    }
  },
          
  ring: function()
  {
    this.stop();
    playSound('/media/audio/sound/display.wav');
    window.alert(this.message || "RING!");
  },

  stop: function(o)
  {
    if (!this.form && o){this.form = o.form;}
    
    if (typeof this.timeout != "undefined"
        && jsx.object.isMethod(window, "clearTimeout"))
    {
      window.clearTimeout(this.timeout);
      delete this.timeout;
    }
  },
  
  reset: function(o)
  {
    this.stop();
    if (this.form){this.form.reset();}
  }
};
