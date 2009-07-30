/**
 * @author PointedEars
 * @depends dhtml.js
 */

function Animation(aTarget, oTween)
{
  this.setTarget(aTarget);
  this.tween = oTween;
}

Animation.prototype = {
  constructor: Animation,
  
  setTarget: function(aTarget) {
    this.target =
      typeof aTarget == "string"
        ? dhtml.getElemById(aTarget)
        : aTarget;
  },
  
  run: function() {
    function getCurrentStyle(oTarget, oStyle)
    {
      for (var p in oStyle)
      {
        if (typeof oStyle[p] != "undefined")
        {
          var oProperty = oStyle[p];

          oProperty.current =
            typeof oProperty.from != "undefined"
              ? oProperty.from
              : currentStyle(oTarget, p);
            
          if (typeof oProperty.unit == "undefined")
          {
            switch (propertyInfo[p].type)
            {
              case types.LENGTH:
                oProperty.unit = "px";
            }
          }
        }
      }
    }

    var
      types = {
        NUMBER:     0,
        LENGTH:     1,
        PERCENTAGE: 2,
        URI:        3,
        COUNTER:    4,
        COLOR:      5,
        STRING:     6
      },
      
      // TODO:
      // The `correspondsTo' property helps to identify the corresponding
      // property in order to determine the optimum animation frame length
      // (see below).
      propertyInfo = {
        left:   { type: types.LENGTH, correspondsTo: "top" },
        top:    { type: types.LENGTH, correspondsTo: "left" },
        right:  { type: types.LENGTH, correspondsTo: "bottom" },
        bottom: { type: types.LENGTH, correspondsTo: "right" },
        width:  { type: types.LENGTH, correspondsTo: "height" },
        height: { type: types.LENGTH, correspondsTo: "width" },
        color:  { type: types.COLOR },
        "background-color": { type: types.COLOR }
      };
    
    // 1. Determine the current style (position, color etc.) of the
    //    target object
    getCurrentStyle(this.target, this.tween.style);
    
    var
      s = this.tween.style,
      duration = this.tween.duration,
      dt = 10,
      steps = Math.floor(duration / dt),
      timeout = [];
    
    // 2. For each set property, calculate the value difference for
    //    each step
    // var lengthProperties = new Object();
    for (var p in s)
    {
      // TODO: Handle unsupported/untyped properties
      switch (propertyInfo[p].type)
      {
        case types.LENGTH:
          // lengthProperties[p] = true;
          
          s[p].current = parseFloat(s[p].current) || 0;

          if (typeof s[p].by != "undefined")
          {
            s[p].to = (parseFloat(s[p].from) || 0)
              + (parseFloat(s[p].by) || 0);
          }

          s[p].difference =
            ((parseFloat(s[p].to) || 0) - s[p].current)
            / steps;
                              
          // DEBUG
          // window.alert([dx, dy, dt]);
          
          break;
          
        case types.COLOR:
          s[p].current = new Color(s[p].current);
          var diffCol = s[p].difference = s[p].current.diff(new Color(s[p].to));
          
          for (var i in diffCol)
          {
            diffCol[i] /= steps;
          }
          
          break;
          
        default:
      }
        
      if (typeof s[p].from != "undefined")
      {
        dhtml.setStyleProperty(
          this.target,
          p,
          s[p].from
            + (typeof s[p].unit != "undefined"
              ? s[p].unit
              : ""));
      }
    }

    // TODO
    // 2b. For all properties of type `length' that are given in the
    //     unit `px', calculate the optimum number of pixel-wise steps.
    /*
    if (dx < 1 || dy < 1)
    {
      if (dx < dy)
      {
        dx = 1;
        steps = x_new - x;
        dy = (y_new - y) / steps;
      }
      else
      {
        dy = 1;
        steps = y_new - y;
        dx = (x_new - x) / steps;
      }
      
      dt = duration / steps;
    }
    */

    // DEBUG
    // window.alert([dx, dy, dt]);

    // 3. If there is a property to be set that requires positioning,
    //    and no positioning mode was defined, set "relative"
    // FIXME: *Iff*, not always!
    if (currentStyle(this.target).position == "static")
    {
      dhtml.setStyleProperty(this.target, "position", "relative");
    }
            
    // 4. Set the timeouts required for each property change in the
    //    animation, thereby starting the animation after the last
    //    loop.
    for (var t = 0, i = steps; i--;)
    {
      for (var p in s)
      {
        // TODO: Handle unsupported/untyped properties
        switch (propertyInfo[p].type)
        {
          case types.LENGTH:
            s[p].current += s[p].difference;
            break;
            
          case types.COLOR:
            var curCol = s[p].current;
            // TODO: Have a Color.prototype.inc() do the computation
            s[p].current = curCol.inc(s[p].difference).toString();
        }
      }
                     
      var f = (
          function(oTarget, oStyle, t)
          {
            var s2 = new Object();
            for (var p in oStyle)
            {
              s2[p] = oStyle[p].current;
              s2[p + "_unit"] = oStyle[p].unit;
            }

            return (
              function()
              {
                // DEBUG
                if (typeof console != "undefined") console.log("t = " + t);
                
                for (var p in oStyle)
                {
                  // DEBUG
                  if (typeof console != "undefined")
                  {
                    console.log("s2['" + p + "'] = " + s2[p]);
                  }
                  
                  // TODO: units
                  var unit = s2[p + "_unit"];
                  dhtml.setStyleProperty(
                    oTarget,
                    p,
                    s2[p] + (unit ? unit : ""));
                }

                /*
                oTarget.style.left = x + "px";
                oTarget.styl
                e.top = y + "px";
                */
              }
            );
          }
        )(this.target, s, t += dt);
                  
      timeout[i] = window.setTimeout(f, t);
      
      f = null;
    }

    // DEBUG
    /*
    window.setTimeout(
      function() { window.alert(new Date() - dStart); },
      t + dt);
    */

  }
};

function Tween(oTween)
{
  for (var p in oTween)
  {
    this[p] = oTween[p];
  }
}

Tween.prototype = {
  constructor: Tween,
  
  toString: function() {
    return serialize(this, {depth: -1});
  }
};
