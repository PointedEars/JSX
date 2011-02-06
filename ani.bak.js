/**
 * @author PointedEars
 * @depends dhtml.js
 */

function InitializedObject() {}
InitializedObject.prototype = {
  setParameters: function(oParams) {
    for (var p in oParams)
    {
      this[p] = oParams[p];
    }
  }
};

/**
 * This framework implements animation of objects as a set of one or more
 * {@link #Timeline}s, starting in parallel when the animation is played.
 * Each timeline is supposed to animate another target object (although
 * that is not required).
 * 
 * @param aTarget
 * @param aTimelines
 * @returns {Animation}
 */
var Animation = function(aTarget, aTimelines) {
  this.setTarget(aTarget);
  this.timelines = aTimelines;
}.extend(InitializedObject, {
  setTarget: function(aTarget) {
    this.target =
      typeof aTarget == "string"
        ? dhtml.getElemById(aTarget)
        : aTarget;
  },
  
  play: function() {
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
      
      /*
       * TODO:
       * The `correspondsTo' property helps to identify the corresponding
       * property in order to determine the optimum animation frame length
       * (see below).
       */
      propertyInfo = {
        left:   { type: types.LENGTH, correspondsTo: "top" },
        top:    { type: types.LENGTH, correspondsTo: "left" },
        right:  { type: types.LENGTH, correspondsTo: "bottom" },
        bottom: { type: types.LENGTH, correspondsTo: "right" },
        width:  { type: types.LENGTH, correspondsTo: "height" },
        height: { type: types.LENGTH, correspondsTo: "width" },
        color:  { type: types.COLOR },
        backgroundColor: { type: types.COLOR },
        "background-color": { type: types.COLOR }
      };
    
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
    
    /* FIXME: Array change workaround */
    this.timeline = this.timelines[0];
    
    /*
     * 1. Determine the current style (position, color etc.) of the
     *    target object
     */
    getCurrentStyle(this.target, this.timeline.style);
    
    var
      s = this.timeline.style,
      duration = this.timeline.duration,
      dt = 10,
      steps = Math.floor(duration / dt),
      timeout = [];
    
    /*
     * 2. For each set property, calculate the value difference for
     *    each step
     */
    // var lengthProperties = new Object();
    for (var p in s)
    {
      /* TODO: Handle unsupported/untyped properties */
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
                              
          /* DEBUG */
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

    /*
     * TODO
     * 2b. For all properties of type `length' that are given in the
     *     unit `px', calculate the optimum number of pixel-wise steps.
     */
//    if (dx < 1 || dy < 1)
//    {
//      if (dx < dy)
//      {
//        dx = 1;
//        steps = x_new - x;
//        dy = (y_new - y) / steps;
//      }
//      else
//      {
//        dy = 1;
//        steps = y_new - y;
//        dx = (x_new - x) / steps;
//      }
//
//      dt = duration / steps;
//    }

    /* DEBUG */
    // window.alert([dx, dy, dt]);

    /*
     * 3. If there is a property to be set that requires positioning,
     *    and no positioning mode was defined, set "relative"
     * FIXME: *Iff*, not always!
     */
    if (currentStyle(this.target).position == "static")
    {
      dhtml.setStyleProperty(this.target, "position", "relative");
    }
       
    /*
     * 4. Set the timeouts required for each property change in the
     *    animation, thereby starting the animation after the last
     *    loop.
     */
    for (var t = 0, i = steps; i--;)
    {
      for (var p in s)
      {
        /* TODO: Handle unsupported/untyped properties */
        switch (propertyInfo[p].type)
        {
          case types.LENGTH:
            s[p].current += s[p].difference;
            break;
            
          case types.COLOR:
            var curCol = s[p].current;
            /* TODO: Have a Color.prototype.inc() do the computation */
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
                if (typeof console != "undefined")
                {
                  console.log("t = " + t);
                }
                
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

//                oTarget.style.left = x + "px";
//                oTarget.styl
//                e.top = y + "px";
              }
            );
          }
        )(this.target, s, t += dt);
                  
      timeout[i] = window.setTimeout(f, t);
      
      f = null;
    }

    /* DEBUG */
//    window.setTimeout(
//      function() { window.alert(new Date() - dStart); },
//      t + dt);
  }
});

/**
 * A <code>Timeline</code> of an {@link Animation} consists of
 * {@link Keyframe}s or delays, property changes, and subordered timelines
 * ("child timelines").  Unless specified otherwise, the time offset of an
 * item in one timeline depends on the previous item in that timeline:
 * 
 * <pre>
 * Animation ---.
 * Timeline 1:  :--Action0------Action1------Action2-----Action3->
 * Timeline 2:  `----------Action0------Action1-------Action2---->
 * </pre>
 * 
 * An item can also be a <code>Timeline</code> ("child timeline"), in which
 * case the time offset of the child timeline depends on the previous action
 * in the parent timeline, however the time offset of the next action in the
 * parent is independent of the child.  In that case, the child timeline
 * affects the same target object as its parent unless specified otherwise.
 * 
 * <pre>
 * Animation ---.
 * Timeline 1:  :---Action0------+----------Action1a------------->
 * Timeline 1a: |                `---Action1a:0---Action1a:1----->
 * Timeline 2:  `-------Action0------Action1-------Action2------->
 * </pre>
 * 
 * There is no explicit limit as to how deep timelines may be nested.
 * However, for computing the frames of the animation each timeline's
 * render() method must call the render() method of its child timelines,
 * if it has any, so that its animation frames can be prepared, and the
 * timeline played.  As a result, nesting depth is limited implicitly
 * by the available stack space or limits imposed by the ECMAScript
 * implementation, whichever comes first.  Further, the more timelines
 * are nested, the more operations need be performed at approximately
 * the same time; this can slow down the entire animation considerably
 * and lead to considerably higher CPU load.
 * 
 * @param {Object} oParams
 *   Parameters of this timeline.  Supported properties include:
 *   <table>
 *     <th>
 *   </table>
 */
function Timeline(oParams)
{
  for (var p in oParams)
  {
    this[p] = oParams[p];
  }
}

Timeline.prototype = {
  constructor: Timeline,
  
  toString: function() {
    return serialize(this, {depth: -1});
  }
};

/**
 * A <code>KeyFrame</code> defines which properties an animated object
 * should have relative to the {@link Timeline} it is defined for.  It is
 * used as a reference point to compute the frames of the animation between
 * it and other <code>Keyframe</code>s or {@link Pause}s.
 * 
 * @param {Object} oParams
 * 
 */
function KeyFrame(oParams)
{
  for (var p in oParams)
  {
    this[p] = oParams[p];
  }
}

/**
 * A <code>Pause</code> is a deliberate temporary stop of animation in a
 * {@link Timeline}.  Whenever a <code>Pause</code> is inserted as an
 * item of a timeline, no tween will be computed between adjacent
 * {@link KeyFrame}s.
 * 
 * @param {Object} oParams
 */
function Pause(oParams)
{
  
}