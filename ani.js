/**
 * @author PointedEars
 * @depends dhtml.js
 */

/**
 * Retrieves {@link Array} elements as if by the expression
 * <code><var>a</var>.slice(<var>index</var>, <var>index</var> + 1)</code>,
 * considering negative <var>index</var>es to start counting from the end of
 * the <code>Array</code>.
 * 
 * @param a : Array
 * @param index : Number
 * @return any
 */
Array.get = function(a, index) {
  if (isNaN(index))
  {
    jsx.throwThis("jsx.InvalidArgumentError", ["",
      "(" + typeof a + ", " + typeof index + ")",
      "(object[Array], number)"]);
  }

  index = +index;

  if (index >= 0)
  {
    return a[index];
  }
  
  return a[a.length + index];
};

/**
 * @namespace
 */
jsx.animation = {
  version: "0.1.2.2011020523"
};

/**
 * An <code>Animation</code> is a set of one or more
 * {@link jsx.animation#Timeline Timelines} being played in parallel
 * when the animation is played.  Each <code>Timeline</code> is supposed
 * to animate another target object (but that is not required).
 * 
 * @param oParams : Object
 *   The parameters of this animation.  Supported parameters, to be defined
 *   as properties of <var>oParams</var>, include:
 *   <dl>
 *     <dt><code><var>target</var> : Object</code></dt>
 *       <dd>Reference specifying the object to animate.  If specified,
 *           the timelines of this animation automatically inherit its
 *           target; if not specified for the animation, each timeline
 *           of an animation MUST specify its target.</dd>
 *     <dt><code><var>timelines</var> : Array</code></dt>
 *       <dd>{@link jsx.animation#Timeline Timelines} of this animation
 *           (required)</dd>
 *   </dl>
 * @throws jsx.InvalidArgumentError if no parameters were specified
 */
jsx.animation.Animation = function(oParams) {
  if (!oParams)
  {
    jsx.throwThis("jsx.InvalidArgumentError", ["Not enough arguments", typeof oParams, "Object"]);
  }
    
  for (var param in this)
  {
    if (typeof oParams[param] != "undefined")
    {
      this[param] = oParams[param];
    }
  }
  
  var timelines = this.timelines;
  for (var i = timelines.length; i--;)
  {
    var timeline = timelines[i];
    if (!timeline.target)
    {
      timeline.target = this.target;
    }
  }
};

/**
 * @constructor
 */
jsx.animation.NoTimelineError = function() {
  arguments.callee._super.call(this, "Need at least one Timeline for an Animation");
}.extend(jsx.Error, {name: "jsx.animation.NoTimelineError"});

jsx.animation.Animation.prototype = {
  constructor: jsx.animation.Animation,

  /**
   * @type Object
   */
  target: null,
  timelines: [],
  
  /**
   * Plays the animation by playing all of its
   * {@link jsx.animation#Timeline Timelines}.
   * 
   * @throws jsx.animation#NoTimelineError
   *   if no <code>Timelines</code> have been defined
   */
  play: function() {
    var timelines = this.timelines;
    if (!timelines || timelines.length < 1)
    {
      jsx.throwThis("jsx.animation.NoTimelineError");
    }
    
    for (var i = 0, len = timelines.length; i < len; ++i)
    {
      timelines[i].play();
    }
  },
  
  /**
   * Stops the animation by stopping all of its
   * {@link jsx.animation#Timeline Timelines}.
   * 
   * @throws Animation.NoTimelineError
   *   if no <code>Timelines</code> have been defined
   */
  stop: function() {
    var timelines = this.timelines;
    if (!timelines || timelines.length < 1)
    {
      jsx.throwThis("jsx.animation.NoTimelineError");
    }
    
    for (var i = 0, len = timelines.length; i < len; ++i)
    {
      timelines[i].stop();
    }
  }
};

/**
 * @constructor
 */
jsx.animation.NoKeyFramesError = function() {
  arguments.callee._super.call(this, "Need at least two KeyFrames in a Timeline");
}.extend(jsx.Error, {name: "jsx.animation.NoKeyFramesError"});

/**
 * A <code>Timeline</code> consists of {@link jsx.animation#Keyframe KeyFrames}
 * and can have subordered timelines ("child timelines").  Unless specified
 * otherwise, the time offset of an item in one timeline depends on the
 * previous item in that timeline.
 * 
 * <pre>
 * Timeline:    ---Action0------Action1------Action2-----Action3->
 * </pre>
 * <p>
 * A <code>Timeline</code> may be standalone or part an {@link #Animation},
 * specified by the <code>Animation</code>'s <code>timelines</code> property,
 * which allows it to be played parallel to other timelines:
 * </p>
 * <pre>
 * Animation ---.
 * Timeline 1:  :--Action0------Action1------Action2-----Action3->
 * Timeline 2:  `----------Action0------Action1-------Action2---->
 * </pre>
 * <p>
 * An item in a timeline can also be a <code>Timeline</code> itself
 * ("child timeline"), in which case the time offset of the child timeline
 * depends on the previous action in the parent timeline, however the time
 * offset of the next action in the parent is independent of the child.
 * In that case, the child timeline affects the same target object as
 * its parent unless specified otherwise.
 * </p>
 * <pre>
 * Animation ---.
 * Timeline 1:  :---Action0------+----------Action1a------------->
 * Timeline 1a: |                `---Action1a:0---Action1a:1----->
 * Timeline 2:  `-------Action0------Action1-------Action2------->
 * </pre>
 * <p>
 * There is no explicit limit as to how deep timelines may be nested.
 * However, for playing the frames of the animation each timeline's
 * play() method must call the play() method of its child timelines.
 * As a result, nesting depth is limited implicitly by the available
 * stack space or limits imposed by the ECMAScript implementation,
 * whichever comes first.  Further, the more timelines are nested,
 * the more operations need be performed at approximately the same time;
 * this can slow down the entire animation considerably and lead to
 * considerably higher CPU load.
 * </p>
 * @function
 * @constructor
 * @param oParams : Object
 * @throws jsx.InvalidArgumentError if no parameters were specified
 */
jsx.animation.Timeline = (function() {
  var
    jsx_object = jsx.object,
    keyFrameComparator = function(a, b) {
      return a.compareTo(b);
    };
  
  return function(oParams) {
    if (!oParams)
    {
      jsx.throwThis("jsx.InvalidArgumentError", ["Not enough arguments", typeof oParams, "Object"]);
    }

    jsx_object.defineProperties(this, {
      currentRate: {
        get: function() {
          return this.getCurrentRate();
        }
      },
      
      framerate: {
        get: function() {
          return this.getFramerate();
        },
    
        set: function(framerate) {
          return this.setFramerate(framerate);
        }
      }
    }, "jsx.animation.Timelime");
    
    for (var param in this)
    {
      var paramValue = oParams[param];
      
      if (typeof paramValue != "undefined")
      {
        if (param == "frameLength" && paramValue < 11)
        {
          paramValue = 11;
          jsx.warn("Normalizing frameLength to 11");
        }
         
        this[param] = paramValue;
      }
    }
    
    /* Sort keyFrames by time */
    var keyFrames = this.keyFrames;
    keyFrames.sort(keyFrameComparator);
        
//    if (this.autoReverse)
//    {
//      if (keyFrames.length > 0)
//      {
//        /* Add mirrored keyframes */
//        var lastKeyFrame = Array.get(keyFrames, -1);
//        for (var i = keyFrames.length - 2; i > -1; --i)
//        {
//          var keyFrameToClone = keyFrames[i];
//          var keyFrameClone = jsx_object.clone(jsx_object.COPY_ENUM_DEEP, keyFrameToClone);
//          keyFrameClone.time = 2 * lastKeyFrame.time - keyFrameToClone.time;
//          keyFrames.push(keyFrameClone);
//        }
//      }
//    }
  };
}());

jsx.animation.Timeline.INDEFINITE = Number.POSITIVE_INFINITY;
jsx.animation.Timeline.MIN_TIMEOUT = 10;
jsx.animation.Timeline.MIN_FRAME_LENGTH = jsx.animation.Timeline.MIN_TIMEOUT + 1;

/**
 * Supported CSS data types.  Properties include:
 *        <dl>
 *          <dt><code>NUMBER</code></dt>
 *            <dd></dd>
 *
 *          <dt><code>LENGTH</code></dt>
 *            <dd></dd>
 *
 *          <dt><code>PERCENTAGE</code></dt>
 *            <dd></dd>
 *
 *          <dt><code>URI</code></dt>
 *            <dd>Uniform Resource Identifier or URI-reference (see RFC 3986),
 *                enclosed in <code>url(…)</code></dd>
 *
 *          <dt><code>COUNTER</code></dt>
 *            <dd>CSS counter</dd>
 *
 *          <dt><code>COLOR</code></dt>
 *            <dd>Color in RGB(A) or HSV format</dd>
 *
 *          <dt><code>STRING</code></dt>
 *            <dd>Unicode string</dd>
 *        </dl>
 *
 * @namespace
 */
jsx.animation.Timeline.types = {
  /**
   * Numeric scalar value
   */
  NUMBER:     0,
  
  /**
   * Length given relative in <code>em</code> (width of the
   * M&nbsp;square) or <code>ex</code> (height of the x square),
   * or absolute in <code>in</code> (inches), <code>cm</code>
   * (centimeters), <code>mm</code> (millimeters), <code>pt</code>
   * (points), <code>pc</code> (picas), or <code>px</code>
   * (pixels).
   */
  LENGTH:     1,
  
  /**
   * Length given in percentage of the parent
   */
  PERCENTAGE: 2,
  
  /**
   * Uniform Resource Identifier or URI-reference (see RFC 3986),
   * enclosed in <code>url(…)</code>.
   */
  URI:        3,
  
  /**
   * CSS counter
   */
  COUNTER:    4,
  
  /**
   * Color given in RGB(A) or HSV format
   */
  COLOR:      5,
  
  /**
   * String of Unicode characters
   */
  STRING:     6
};

/**
 * Provides information about the type of a CSS property and its relation
 * to other CSS properties
 */
jsx.animation.Timeline.propertyInfo = {
  left:   {type: jsx.animation.Timeline.types.LENGTH, correspondsTo: "top"},
  top:    {type: jsx.animation.Timeline.types.LENGTH, correspondsTo: "left"},
  right:  {type: jsx.animation.Timeline.types.LENGTH, correspondsTo: "bottom"},
  bottom: {type: jsx.animation.Timeline.types.LENGTH, correspondsTo: "right"},
  width:  {type: jsx.animation.Timeline.types.LENGTH, correspondsTo: "height"},
  height: {type: jsx.animation.Timeline.types.LENGTH, correspondsTo: "width"},
  color:  {type: jsx.animation.Timeline.types.COLOR},
  backgroundColor:    {type: jsx.animation.Timeline.types.COLOR},
  "background-color": {type: jsx.animation.Timeline.types.COLOR}
};

jsx.animation.Timeline.prototype = {
  constructor: jsx.animation.Timeline,
  
  /**
   * @type Object
   */
  target: null,
  
  /**
   * @type Array[KeyFrame]
   */
  keyFrames: [],
  
  /**
   * Defines whether this animation reverses direction on alternating cycles.
   * If <code>true</code>, the animation will proceed forward on the first
   * cycle, then* reverses on the second cycle, and so on. Otherwise,
   * animation will loop such that each cycle proceeds forward from the
   * initial {@link jsx.animation#KeyFrame KeyFrame}.
   */
  autoReverse: false,
  
  /**
   * Length of a frame in milliseconds (ms).  The default value is
   * MIN_FRAME_LENGTH so that frames at 0 ms normalized to MIN_TIMEOUT
   * are played before the second frame.
   */
  frameLength: jsx.animation.Timeline.MIN_FRAME_LENGTH,

  /**
   * Defines the number of cycles in this animation. The repeatCount may be
   * <code>INDEFINITE</code> for animations that repeat indefinitely, but
   * must otherwise be &le; 0.
   */
  repeatCount: 1,
    
  /**
   * Indicates the current direction/speed at which the <code>Timeline</code>
   * is being played, in frames per second.
   * 
   * @return Number
   */
  getCurrentRate: function() {
    return (this._playing) ? this.getFramerate() : 0.0;
  },

  /**
   * Indicates the total duration of this <code>Timeline</code>, including
   * repeats. A <code>Timeline</code> with a <code>repeatCount</code> of
   * <code>Timeline.INDEFINITE</code> will have a <code>totalDuration</code>
   * of <code>Duration.INDEFINITE</code>.
   * 
   * @return {Number}
   */
  getTotalDuration: function() {
    return Array.get(this.keyFrames, -1).time * (this.autoReverse ? 2 : 1)
      * this.repeatCount;
  },
  
  /**
   * Retrieves the maximum framerate at which this <code>Timeline</code>
   * will play, in frames per second.
   * 
   * @return {Number}
   */
  getFramerate: function() {
    return 1000 / this.frameLength;
  },

  /**
   * Sets the maximum framerate at which this <code>Timeline</code> will play,
   * in frames per second.  This can be used, for example, to keep particularly
   * complex <code>Timelines</code> from over-consuming system resources.
   * By default, a <code>Timeline</code>'s framerate is not explicitly
   * limited, meaning the <code>Timeline</code> will play at an optimal
   * framerate for the underlying platform.
   * 
   * @function
   * @param framerate : Number
   *   The maximum framerate at which this <code>Timeline</code> will play,
   *   in frames per second.  Framerates above 90 fps that result in
   *   a frame length shorter than 11 ms are normalized.
   * @return Number
   *   The effective maximum framerate, in frames per second
   */
  setFramerate: (function() {
    var jsx_animation_Timeline = jsx.animation;
    
    return function(framerate) {
      if (this._playing)
      {
        jsx.info("Cannot change framerate while playing");
        return false;
      }
      
      var frameLength = 1000 / framerate;
      if (frameLength < jsx_animation_Timeline.MIN_FRAME_LENGTH)
      {
        jsx.info("Requested framerate of " + framerate + " fps (frame length of "
          + frameLength + " ms) was normalized to ca. "
          + (1000 / jsx_animation_Timeline.MIN_FRAME_LENGTH) + " fps ("
          + jsx_animation_Timeline.MIN_FRAME_LENGTH + " ms)");
        frameLength = jsx_animation_Timeline.MIN_FRAME_LENGTH;
      }
      
      this.frameLength = frameLength;
      
      return frameLength;
    };
  }()),
  
  /**
   * Instructs the <code>Timeline</code> to evaluate all
   * <code>KeyValue.value()</code>s in the <code>Timeline</code>.
   * 
   * @function
   */
  evaluateKeyValues: (function() {
    var
      jsx_dom = jsx.dom,
      jsx_object = jsx.object,
      jsx_animation_Timeline = jsx.animation.Timeline,
      Color = jsx.dom.css.Color;

    return function() {
      for (var i = 1, len = this.keyFrames.length; i < len; ++i)
      {
        var nextKeyFrame = this.keyFrames[i];
        var previousKeyFrame = this.keyFrames[i - 1];
                
        var previousValues = previousKeyFrame.values;
        var nextValues = nextKeyFrame.values;
        for (var propertyName in nextValues)
        {
          var newPropertyValue = nextValues[propertyName];
          var oldPropertyValue = previousValues[propertyName];
          if (propertyName == "style")
          {
            /* Compute the original values if not given */
            for (var stylePropertyName in newPropertyValue)
            {
              var oldStylePropertyValue = oldPropertyValue[stylePropertyName];
              if (typeof oldStylePropertyValue == "undefined")
              {
                oldStylePropertyValue = jsx_dom.getComputedStyle(
                  this.target, null, stylePropertyName);
              }
              
              var propertyType = jsx_object.getProperty(
                jsx_animation_Timeline.propertyInfo, stylePropertyName, {type: null}).type;
              switch (propertyType)
              {
                case jsx_animation_Timeline.types.LENGTH:
                  if (isNaN(oldStylePropertyValue))
                  {
                    oldStylePropertyValue = parseFloat(oldStylePropertyValue);
                  
                    if (isNaN(oldStylePropertyValue))
                    {
                      switch (stylePropertyName)
                      {
                        case "width":
                          oldStylePropertyValue = this.target.offsetWidth;
                          break;
                          
                        case "height":
                          oldStylePropertyValue = this.target.offsetHeight;
                          break;
                      }
                    }
                  }
                  break;
              
                case jsx_animation_Timeline.types.COLOR:
                  if (!jsx_object.isInstanceOf(oldStylePropertyValue, Color))
                  {
                    oldStylePropertyValue = new Color(oldStylePropertyValue);
                  }
                  break;
              }
              
              if (typeof oldPropertyValue[stylePropertyName] == "undefined")
              {
                oldPropertyValue[stylePropertyName] = oldStylePropertyValue;
              }
              
            }
            
            /*
             * Set the old style value if the new one was not given.
             * NOTE: Objects are _not_ cloned here, but this should not matter.
             */
            for (stylePropertyName in oldPropertyValue)
            {
              if (typeof newPropertyValue[stylePropertyName] == "undefined")
              {
                newPropertyValue[stylePropertyName] = oldPropertyValue[stylePropertyName];
              }
            }
          }
          else
          {
            if (typeof oldPropertyValue == "undefined")
            {
              previousValues[propertyName] = this.target[propertyName];
            }
          }
        }
    
        /* Set old value if the new one was not given */
        for (var propertyName in previousValues)
        {
          if (typeof newPropertyValue[propertyName] == "undefined")
          {
            newPropertyValue[propertyName] = oldPropertyValue[propertyName];
          }
        }
      }
    };
  }()),

  /**
   * Plays this <code>Timeline</code>
   * 
   * @function
   */
  play: (function() {
    var
      jsx_object = jsx.object,
      jsx_dom = jsx.dom,
      jsx_animation_Timeline = jsx.animation.Timeline,
      getPropertySetter = function(target, values, bDontPlay, oTimeline) {
        return function() {
          var setToRelative = false;
          
          for (var property in values)
          {
            if (property == "style")
            {
              var style = values.style;
              for (var styleProperty in style)
              {
                var thisPropertyInfo = jsx_animation_Timeline.propertyInfo[styleProperty];
                if (thisPropertyInfo && thisPropertyInfo.type == jsx_animation_Timeline.types.LENGTH)
                {
                  if (!setToRelative
                      && typeof style.position == "undefined"
                      && jsx_dom.getComputedStyle(target, null, "position") == "static")
                  {
                    target.style.position = "relative";
                    setToRelative = true;
                  }
                  
                  jsx_dom.setStyleProperty(target, styleProperty, style[styleProperty] + "px");
                }
                else
                {
                  target.style[styleProperty] = style[styleProperty];
                }
              }
            }
            else
            {
              target[property] = values[property];
            }
          }
          
          if (bDontPlay)
          {
            oTimeline._playing = false;
          }
        };
      };
    
    return function() {
      this._playing = true;

      /* First clear all remaining timeouts */
      this.stop();
      
      if (!this._keyValuesEvaluated)
      {
        this.evaluateKeyValues();
        this._keyValuesEvaluated = true;
      }
    
      for (var i = 1, len = this.keyFrames.length; i < len; ++i)
      {
        var nextKeyFrame = this.keyFrames[i];
        var previousKeyFrame = this.keyFrames[i - 1];
        var previousValues = previousKeyFrame.values;
        var nextValues = nextKeyFrame.values;
        
        /* Display the previous keyframe, then play the tween */

        /* TODO: What if the number of frames is not integer? */
        var dt = this.frameLength;
        var numFrames = (nextKeyFrame.time - previousKeyFrame.time) / dt;
        
        var frameValues = jsx_object.clone(jsx_object.COPY_ENUM_DEEP, previousValues);
        var t = previousKeyFrame.time;
        
        for (var currentFrame = 0; currentFrame < numFrames - 1; ++currentFrame)
        {
          for (var property in frameValues)
          {
            var interpolate = nextKeyFrame.interpolate;
            if (property == "style")
            {
              var previousStyle = previousValues.style;
              var frameStyle = frameValues.style;
              var nextStyle = nextValues.style;
              
              for (var styleProperty in frameStyle)
              {
                interpolate = nextKeyFrame.interpolate;
                var nextStyleValue = nextStyle[styleProperty];
                if (jsx_object.isInstanceOf(nextStyleValue, jsx.animation.KeyValue))
                {
                  nextStyleValue = nextStyleValue.value;
                  interpolate = nextStyleValue.interpolate;
                }
                
                frameStyle[styleProperty] = interpolate(
                  previousStyle[styleProperty],
                  nextStyleValue,
                  currentFrame / numFrames);
              }
            }
            else
            {
              var nextValue = nextValues[property];
              
              if (jsx_object.isInstanceOf(nextValue, jsx.animation.KeyValue))
              {
                nextValue = nextValue.value;
                interpolate = nextValue.interpolate;
              }
              
              frameValues[property] = interpolate(
                previousValues[property],
                nextValue,
                currentFrame / numFrames);
            }
          }
          
          this._timeouts.push(
            window.setTimeout(
              getPropertySetter(this.target,
                jsx_object.clone(jsx_object.COPY_ENUM_DEEP, frameValues)),
                t));
    
          t += dt;
        }
    
        /* Display the last keyframe */
        if (i == this.keyFrames.length - 1)
        {
          this._timeouts.push(
            window.setTimeout(
              getPropertySetter(this.target, nextValues, true, this),
              t));
        }
      }
    };
  }()),
  
  /**
   * Prevents the <code>Timeline</code> from continuing to play.
   */
  stop: function() {
    var timeouts = this._timeouts;
    for (var i = 0, len = timeouts && timeouts.length; i < len; ++i)
    {
      window.clearTimeout(timeouts[i]);
    }

    /**
     * @private
     */
    this._timeouts = [];
  }
};

/**
 * A <code>Frame</code> defines target values at a specified point in time
 * for a set of properties of the target object of a
 * {@link jsx.animation#Timeline Timeline}.
 * 
 * <p>
 * This type is usually used only internally to compute the frames between
 * a set of given {@link jsx.animation#KeyFrame KeyFrames}.
 * </p><p>
 * By contrast to <code>KeyFrame</code>s, inserting a <code>Frame</code>
 * into a <code>Timeline</code> does not cause computation of additional
 * <code>Frame</code>s with regard to adjacent <code>Keyframe</code>s.
 * You can do so if you need full control over the <code>Timeline</code>,
 * for example if you want an object to "jump" from one screen area to a
 * more distant one instead of producing a gradual change of its coordinates,
 * or if you want to use a set of <code>Frame</code>s or <code>Frame</code>-
 * compatible objects that are the result of computation by another framework.
 * </p>
 * @constructor
 * @param oParams
 * @throws jsx.InvalidArgumentError if no parameters were specified
 */
jsx.animation.Frame = function(oParams) {
  if (!oParams)
  {
    jsx.throwThis("jsx.InvalidArgumentError", ["Not enough arguments", typeof oParams, "Object"]);
  }
  
  for (var paramName in this)
  {
    var param = oParams[paramName];
    if (typeof param != "undefined")
    {
      if (paramName == "time" && typeof param != "number")
      {
        /*
         * Convert duration to milliseconds
         * NOTE: Explicitly convert to number in case someone gets pythonic
         */
        var rxTime = /^\s*\+?(\d+|\d*\.\d+)\s*(ms|s|m(in)?|h)\s*$/;
        var match = param.match(rxTime);
        if (match)
        {
          switch (match[2])
          {
            case "ms":
              param = +match[1];
              break;
              
            case "s":
              param = +match[1] * 1000;
              break;
            
            case "m":
            case "min":
              param = +match[1] * 60000;
              break;
              
            case "h":
              param = +match[1] * 3600000;
              break;
          }
        }
        else
        {
          return jsx.throwThis("jsx.InvalidArgumentError",
            ["Invalid time", "'" + param + "'", "one matching " + rxTime.source]);
        }
      }
      
      this[paramName] = param;
    }
  }
};

jsx.animation.Frame.prototype = {
  constructor: jsx.animation.Frame,
  time: 0,
  values: {}
};

/**
 * Namespace for a set of functions that take a <var>startValue</var> and
 * endValue along with fraction between 0.0 and 1.0 and returns another value,
 * between startValue and endValue.  The purpose of those functions is
 * to define how time (represented as a (0.0 − 1.0) fraction of the duration
 * of an animation) is altered to derive different value calculations during
 * an animation.
 * 
 * @namespace
 */
jsx.animation.Interpolator = {
  /**
   * Built-in interpolator that provides linear time interpolation.
   * 
   * @function
   * @param startValue : any
   * @param endValue : any
   * @param fraction : Number
   * @returns {any}
   *   <var>startValue</var> + (<var>endValue</var> − <var>startValue</var>) × <var>fraction</var>
   */
  LINEAR: (function() {
    var
      jsx_object = jsx.object,
      Color = jsx.dom.css.Color;

    return function(startValue, endValue, fraction) {
      if (jsx_object.isInstanceOf(startValue, Color)
          && jsx_object.isInstanceOf(endValue, Color))
      {
        return new Color(
          startValue.red   + (endValue.red - startValue.red) * fraction,
          startValue.green + (endValue.green - startValue.green) * fraction,
          startValue.blue  + (endValue.blue - startValue.blue) * fraction
        );
      }
      
      return startValue + (endValue - startValue) * fraction;
    };
  }())
};

/**
 * A <code>KeyFrame</code> is a special {@link jsx.animation#Frame Frame} that
 * defines target values at a specified point in time for a set of properties
 * that are interpolated along a {@link jsx.animation#Timeline Timeline}.
 * 
 * The developer controls the interpolation of a set of properties for the
 * interval between successive key frames by providing a target value and
 * an {@link jsx.animation#Interpolator Interpolator} associated with each
 * property, or that of the KeyFrame itself which is used for all properties
 * defined for the <code>KeyFrame</code> unless specified otherwise.  The
 * properties are interpolated such that they will reach their target value
 * at the specified time.  An <var>action</var> function is invoked on each
 * <code>KeyFrame</code> if one is specified.
 * 
 * @constructor
 * @param oParams
 * @throws jsx.InvalidArgumentError if no parameters were specified
 */
jsx.animation.KeyFrame = function(oParams) {
  arguments.callee._super.call(this, oParams);
};

jsx.animation.KeyFrame.extend(jsx.animation.Frame, {
  /**
   * A comparison function used to sort KeyFrames by their specified
   * reference time.
   *
   * @memberOf jsx.animation.KeyFrame#prototype
   * @param o : KeyFrame
   * @return number
   *   An Integer value<br>
   *     > 0 if specified <code>KeyFrame</code> timing is ahead of this<br>
   *     = 0 if they have the same timing<br>
   *     &lt; 0 if specified <code>KeyFrame</code> timing is behind this
   */
  compareTo: function(o) {
    return this.time - o.time;
  },
  
  /**
   * @memberOf jsx.animation.KeyFrame#prototype
   * @function
   */
  interpolate: jsx.animation.Interpolator.LINEAR
});

jsx.animation.KeyValue = function(oParams) {
  if (!oParams)
  {
    jsx.throwThis("jsx.InvalidArgumentError", ["Not enough arguments", typeof oParams, "Object"]);
  }
  
  for (var paramName in this)
  {
    var param = oParams[paramName];
    if (typeof param != "undefined")
    {
      this[paramName] = param;
    }
  }
};

jsx.animation.KeyValue.prototype = {
  constructor: jsx.animation.KeyValue,
  
  /**
   * {@link jsx.animation#Interpolator} to be used for calculating the
   * key value along the particular interval.  By default,
   * {@link jsx.animation#Interpolator.LINEAR} is used.
   */
  interpolate: jsx.animation.Interpolator.LINEAR,

  value: null
};