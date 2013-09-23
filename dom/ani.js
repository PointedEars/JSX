"use strict";
/**
 * @author PointedEars
 * @requires dom.js
 * @requires dom/css.js
 */

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

/**
 * Retrieves an {@link Array} element as if by the expression
 * <code><var>a</var>.slice(<var>index</var>,
 * <var>index</var> + 1)[0]</code>.
 *
 * If <var>index</var> is negative, its absolute is counted
 * from the end of <var>a</var>.
 *
 * @param {Array} a
 * @param {Number} index
 * @return {any}
 */
Array.get = function (a, index) {
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

if (typeof jsx.dom == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom = {};
}

/**
 * @namespace
 */
jsx.dom.animation = (/** @constructor */ function () {
  /* Imports */
  var _jsx = jsx;
  var _jsx_object = _jsx.object;
  var _getKeys = _jsx_object.getKeys;
  var _getProperty = _jsx_object.getProperty;
  var _jsx_dom = _jsx.dom;
  var _jsx_dom_css = _jsx_dom.css;
  var _Color = _jsx_dom_css.Color;
  var _types = _jsx_dom_css.types;

  /**
   * @type jsx.dom.animation.NoTimelineError
   * @function
   */
  var _NoTimelineError = (
    /**
     * @constructor
     */
    function jsx_dom_animation_NoTimelineError () {
      jsx_dom_animation_NoTimelineError._super.call(
        this, "Need at least one Timeline for an Animation");
    }
  ).extend(jsx.Error, {
    /**
     * @memberOf jsx.dom.animation.NoTimelineError.prototype
     */
    name: "jsx.dom.animation.NoTimelineError"
  });

  /**
   * Built-in interpolator that provides linear time interpolation.
   *
   * @function
   */
  var _interpolator_LINEAR = (function () {
    var _isInstanceOf = _jsx_object.isInstanceOf;

    /**
     * @param startValue
     * @param endValue
     * @param {Number} fraction
     * @return
     *   <var>startValue</var>
     *   + (<var>endValue</var> − <var>startValue</var>)
     *     × <var>fraction</var>
     */
    function jsx_dom_animation_interpolator_LINEAR
    (startValue, endValue, fraction) {
      if (_isInstanceOf(startValue, _Color)
        && _isInstanceOf(endValue, _Color))
      {
        return new _Color(
          startValue.red   + (endValue.red - startValue.red) * fraction,
          startValue.green + (endValue.green - startValue.green) * fraction,
          startValue.blue  + (endValue.blue - startValue.blue) * fraction
        );
      }

      return startValue + (endValue - startValue) * fraction;
    }

    return jsx_dom_animation_interpolator_LINEAR;
  }());

  var keyFrameComparator = function (a, b) {
    return a.compareTo(b);
  };

  var _MIN_TIMEOUT = 10;
  var _MIN_FRAME_LENGTH = _MIN_TIMEOUT + 1;

  /**
   * A <code>Timeline</code> consists of {@link #KeyFrame KeyFrames}
   * and can have subordered timelines ("child timelines").  Unless
   * specified otherwise, the time offset of an item in one timeline
   * depends on the previous item in that timeline.
   *
   * <pre>
   * Timeline:    ---Action0------Action1------Action2-----Action3->
   * </pre>
   * <p>
   * A <code>Timeline</code> may be standalone or part an
   * {@link #Animation}, specified by the <code>Animation</code>'s
   * <code>timelines</code> property, which allows it to be played
   * parallel to other timelines:
   * </p>
   * <pre>
   * Animation ---.
   * Timeline 1:  :--Action0------Action1------Action2-----Action3->
   * Timeline 2:  `----------Action0------Action1-------Action2---->
   * </pre>
   * <p>
   * An item in a timeline can also be a <code>Timeline</code> itself
   * ("child timeline"), in which case the time offset of the child
   * timeline depends on the previous action in the parent timeline,
   * however the time offset of the next action in the parent is
   * independent of the child.
   * In that case, the child timeline affects the same target object
   * as its parent unless specified otherwise.
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
   * the more operations need be performed at approximately the same
   * time; this can slow down the entire animation considerably and
   * lead to considerably higher CPU load.
   * </p>
   * @type jsx.dom.animation.Timeline
   */
  var _Timeline = jsx.object.extend(
    /**
     * @constructor
     * @param {Object} oParams
     * @throws jsx.InvalidArgumentError if no parameters were specified
     */
    function jsx_dom_animation_Timeline (oParams) {
      if (!oParams)
      {
        jsx.throwThis("jsx.InvalidArgumentError",
          ["Not enough arguments", typeof oParams, "Object"]);
      }

      var uid = (new Date()).getTime();
      this.id = uid;

      _jsx_object.defineProperties(this, {
        currentRate: {
          get: function () {
            return this.getCurrentRate();
          }
        },

        frameRate: {
          get: function () {
            return this.getFrameRate();
          },

          set: function (frameRate) {
            return this.setFrameRate(frameRate);
          }
        },

        id: {
          value: uid
        }
      }, "jsx.dom.animation.Timelime");

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
      var duration = Array.get(keyFrames, -1).time;

      /* Compute keyframe times that are percentages of the duration */
      var rxTimePercentage = /^\s*\+?(\d+|\d*\.\d+)\s*%\s*$/;
      for (var i = 0, len = keyFrames.length; i < len; ++i)
      {
        var keyFrame = keyFrames[i];

        if (!(keyFrame instanceof _Frame))
        {
          keyFrame = new _KeyFrame(keyFrame);
          keyFrames[i] = keyFrame;
        }

        keyFrame._timeline = this;

//      if (len < keyFrames.length - 1)
//      {
        var time = keyFrame.time;
        if (typeof time == "string")
        {
          var match = time.match(rxTimePercentage);
          if (match)
          {
            keyFrame.time = Math.floor(duration * (match[1] / 100));
          }
        }
//      }
      }

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
//          var keyFrameClone = jsx_object.clone(
//            jsx_object.COPY_ENUM_DEEP, keyFrameToClone);
//          keyFrameClone.time =
//            2 * lastKeyFrame.time - keyFrameToClone.time;
//          keyFrames.push(keyFrameClone);
//        }
//      }
//    }
    },
    {
      INDEFINITE: Number.POSITIVE_INFINITY,
      MIN_TIMEOUT: _MIN_TIMEOUT,
      MIN_FRAME_LENGTH: _MIN_FRAME_LENGTH,

      /**
       * Sets the <code>position</code> property of the target
       * so that it can be animated.
       *
       * Sets the <code>position</code> property of the target
       * to <code>relative</code> if it has been declated to be
       * <code>static</code> or not declared at all.
       *
       * @function
       */
      _setPosition: (function () {
        var _getComputedStyle = jsx.dom.css.getComputedStyle;

        /**
         * @param {Element} target
         */
        function jsx_dom_animation_Timeline_setPosition (target)
        {
          if (_getComputedStyle(target, null, "position") == "static")
          {
            target.style.position = "relative";
          }
        }

        return jsx_dom_animation_Timeline_setPosition;
      }())
    }).extend(null, {
      /**
       * @memberOf jsx.dom.animation.Timeline.prototype
       * @type Object
       */
      target: null,

      /**
       * @type Array[#KeyFrame]
       */
      keyFrames: [],

      /**
       * Defines whether this animation reverses direction on
       * alternating cycles.
       *
       * If <code>true</code>, the animation will proceed forward
       * on the first cycle, then* reverses on the second cycle,
       * and so on. Otherwise, animation will loop such that each
       * cycle proceeds forward from the initial {@link #KeyFrame}.
       */
      autoReverse: false,

      /**
       * Length of a frame in milliseconds (ms).  The default value
       * is MIN_FRAME_LENGTH so that frames at 0 ms normalized
       * to MIN_TIMEOUT are played before the second frame.
       */
      frameLength: _MIN_FRAME_LENGTH,

      /**
       * If <code>true</code> (default), native (CSS3) animations
       * are preferred.  Overridden by the <code>preferNative</code>
       * property of an enclosing {@link #Animation}.
       */
      preferNative: true,

      /**
       * Defines the number of cycles in this animation. The
       * repeatCount may be <code>INDEFINITE</code> for animations
       * that repeat indefinitely, but must otherwise be &gte; 0.
       */
      repeatCount: 1,

      /**
       * Indicates the current direction/speed at which the
       * <code>Timeline</code> is being played, in frames per second.
       *
       * @return {Number}
       */
      getCurrentRate: function () {
        return (this._playing) ? this.getFrameRate() : 0.0;
      },

      /**
       * Indicates the total duration of this <code>Timeline</code>,
       * including repeats. A <code>Timeline</code> with a
       * <code>repeatCount</code> of <code>Timeline.INDEFINITE</code>
       * will have a <code>totalDuration</code> of
       * <code>Duration.INDEFINITE</code>.
       *
       * @return {Number}
       */
      getTotalDuration: function () {
        return Array.get(this.keyFrames, -1).time
          * (this.autoReverse ? 2 : 1) * this.repeatCount;
      },

      /**
       * Retrieves the maximum frame rate at which this
       * <code>Timeline</code> will play, in frames per second.
       *
       * @return {Number}
       */
      getFrameRate: function () {
        return 1000 / this.frameLength;
      },

      /**
       * Sets the maximum frame rate at which this
       * <code>Timeline</code> will play, in frames per second.
       *
       * This can be used, for example, to keep particularly complex
       * <code>Timelines</code> from over-consuming system resources.
       * By default a <code>Timeline</code>'s frame rate is not
       * explicitly limited, meaning the <code>Timeline</code> will
       * play at an optimal frame rate for the underlying platform.
       *
       * @param {Number} frameRate
       *   The maximum frame rate at which this <code>Timeline</code>
       *   will play, in frames per second.  Frame rates above 90 fps
       *   that result in a frame length shorter than 11 ms are
       *   normalized.
       * @return {Number}
       *   The effective maximum frame rate, in frames per second
       */
      setFrameRate: function (frameRate) {
        if (this._playing)
        {
          jsx.info("Cannot change frame rate while playing");
          return false;
        }

        /*
         * NOTE: Rounding down the frame length up and number of frames
         * should help with odd frame lengths/times; frame length not
         * rounded down (faster) to avoid animtion stall.
         */
        var frameLength = Math.ceil(1000 / frameRate);
        if (frameLength < _Timeline.MIN_FRAME_LENGTH)
        {
          jsx.info("Requested frame rate of " + frameRate
            + " fps (frame length of " + frameLength + " ms)"
            + " was normalized to ca. "
            + (1000 / _Timeline.MIN_FRAME_LENGTH) + " fps"
            + " (" + _Timeline.MIN_FRAME_LENGTH + " ms)");
          frameLength = _Timeline.MIN_FRAME_LENGTH;
        }

        this.frameLength = frameLength;

        return frameLength;
      },

      /**
       * Instructs the <code>Timeline</code> to evaluate all
       * <code>KeyValue.value</code>s in the <code>Timeline</code>.
       *
       * @function
       */
      evaluateKeyValues: function () {
        var keyFrames = this.keyFrames;

        for (var i = 1, len = keyFrames.length; i < len; ++i)
        {
          var nextValues = keyFrames[i].values;
          var previousValues = keyFrames[i - 1].values;

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
                  oldStylePropertyValue = _jsx_dom_css.getComputedStyle(
                    this.target, null, stylePropertyName);
                }

                var propertyType = _getProperty(
                  _jsx_dom_css.propertyInfo, stylePropertyName,
                  {type: null}).type;
                switch (propertyType)
                {
                  case _types.LENGTH:
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

                  case _types.COLOR:
                    if (!_jsx_object.isInstanceOf(oldStylePropertyValue, _Color))
                    {
                      oldStylePropertyValue = new _Color(oldStylePropertyValue);
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
               * NOTE: Objects are _not_ cloned here, but this
               * should not matter.
               */
              for (stylePropertyName in oldPropertyValue)
              {
                if (typeof newPropertyValue[stylePropertyName] == "undefined")
                {
                  newPropertyValue[stylePropertyName] =
                    oldPropertyValue[stylePropertyName];
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
            if (typeof nextValues[propertyName] == "undefined")
            {
              nextValues[propertyName] = oldPropertyValue[propertyName];
            }
          }
        }
      },

      /**
       * Returns the name of the CSS property for native animation.
       *
       * @function
       */
      _getNativeProperty: (function () {
        var _camelize = jsx.dom.css.camelize;

        /**
         * @return {string}
         *   Returns the first CSS property available for native
         *   animation, preferring the unprefixed name, or
         *   the empty string if no such property is available.
         */
        function _getNativeProperty ()
        {
          var result = "";
          var cssPropertyNames = [
            "animation-name",
            "-moz-animation-name",
            "-webkit-animation-name"
          ];
          var style = this.target.style;

          for (var i = 0, len = cssPropertyNames.length; i < len; ++i)
          {
            var cssPropertyName = cssPropertyNames[i];
            var propertyName = _camelize(cssPropertyName);
            if (typeof style[propertyName] != "undefined")
            {
              return cssPropertyName;
            }
          }

          return result;
        }

        return _getNativeProperty;
      }()),

      /**
       * Defines a native (CSS3) animation
       *
       * @param {String} animationPropertyName
       *   Name of the animation property, with optional
       *   vendor-specific prefix.
       * @returns {Boolean}
       *   <code>true</code> if the definition is successful,
       *   <code>false</code> otherwise.
       */
      _playNative: function (animationNameProperty) {
        var target = this.target;
        var timelineId = this.id;
        if (typeof target.id == "undefined")
        {
          target.id = "timeline-" + timelineId + "-target";
        }

        var targetId = target.id;

        _Timeline._setPosition(target);

        /* FIXME: Reset _here_ has no effect */
        var styleId = "jsx-style-" + timelineId;
        var style = document.getElementById(styleId);
        if (style)
        {
          style.parentNode.removeChild(style);
        }

        style = document.createElement("style");
        style.type = "text/css";
        style.id = styleId;
        var prefix = (animationNameProperty.match(/^-[^-]+/) || [""])[0];
        if (prefix)
        {
          prefix += "-";
        }

        style.appendChild(document.createTextNode([
          "@" + prefix + "keyframes jsx-timeline-" + timelineId + " {",
          this.keyFrames.join("\n"),
          "}",
          "#" + targetId + " {",
          "  " + animationNameProperty + ": jsx-timeline-" + timelineId + ";",
          "  " + prefix + "animation-duration: "
          + Array.get(this.keyFrames, -1).time + "ms;",
          "  " + prefix + "animation-fill-mode: forwards;",
          "  " + prefix + "animation-timing-function: linear;",
          "}"
        ].join("\n")));

        var head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(style);

        return true;
      },

      /**
       * Plays this <code>Timeline</code>
       *
       * @function
       */
      play: (function () {
        var
          getPropertySetter = function (target, values, bDontPlay, oTimeline) {
            function _propertySetter ()
            {
              var setToRelative = false;

              for (var property in values)
              {
                if (property == "style")
                {
                  var style = values.style;
                  for (var styleProperty in style)
                  {
                    var thisPropertyInfo = _jsx_dom_css.propertyInfo[styleProperty];
                    if (thisPropertyInfo && thisPropertyInfo.type == _types.LENGTH)
                    {
                      if (!setToRelative && typeof style.position == "undefined")
                      {
                        _Timeline._setPosition(target);
                        setToRelative = true;
                      }

                      _jsx_dom_css.setStyleProperty(
                        target, styleProperty, style[styleProperty] + "px");
                    }
                    else
                    {
                      _jsx_dom_css.setStyleProperty(
                        target, styleProperty, style[styleProperty]);
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
            }

            return _propertySetter;
          };

        function jsx_animation_Timeline_play ()
        {
          /* First clear all remaining timeouts */
          this.stop();

          if (this.preferNative)
          {
            var nativeProperty = this._getNativeProperty();
            if (nativeProperty)
            {
              return this._playNative(nativeProperty);
            }
          }

          if (!this._keyValuesEvaluated)
          {
            this.evaluateKeyValues();
            this._keyValuesEvaluated = true;
          }

          /* Fix frame length to be integer and long enough */
          this.setFrameRate(this.getFrameRate());
          var dt = this.frameLength;

          this._playing = true;

          for (var i = 1, len = this.keyFrames.length; i < len; ++i)
          {
            var nextKeyFrame = this.keyFrames[i];
            var previousKeyFrame = this.keyFrames[i - 1];
            var previousValues = previousKeyFrame.values;
            var nextValues = nextKeyFrame.values;

            /* Display the previous keyframe, then play the tween */

            /*
             * NOTE: Rounding the frame length up (see above) and the number
             * of frames down should help with odd frame lengths/times;
             * frame length not rounded down (faster) to avoid animation stall.
             */
            var numFrames = Math.floor(
              (nextKeyFrame.time - previousKeyFrame.time) / dt);

            var frameValues = _jsx_object.clone(
              _jsx_object.COPY_ENUM_DEEP, previousValues);
            var t = previousKeyFrame.time;

            var lastFrameIndex = numFrames - 1;
            for (var currentFrameIndex = 0;
            currentFrameIndex < lastFrameIndex;
            ++currentFrameIndex)
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
                    if (_jsx_object.isInstanceOf(nextStyleValue, _KeyValue))
                    {
                      nextStyleValue = nextStyleValue.value;
                      interpolate = nextStyleValue.interpolate;
                    }

                    frameStyle[styleProperty] = interpolate(
                      previousStyle[styleProperty],
                      nextStyleValue,
                      currentFrameIndex / numFrames);
                  }
                }
                else
                {
                  var nextValue = nextValues[property];

                  if (_jsx_object.isInstanceOf(nextValue, _KeyValue))
                  {
                    nextValue = nextValue.value;
                    interpolate = nextValue.interpolate;
                  }

                  frameValues[property] = interpolate(
                    previousValues[property],
                    nextValue,
                    currentFrameIndex / numFrames);
                }
              }

              this._timeouts.push(
                window.setTimeout(
                  getPropertySetter(this.target,
                    _jsx_object.clone(_jsx_object.COPY_ENUM_DEEP, frameValues),
                    false, this),
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
        }

        return jsx_animation_Timeline_play;
      }()),

      /**
       * Prevents the <code>Timeline</code> from continuing to play.
       */
      stop: function () {
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
    });

  /**
   * A <code>Frame</code> defines target values at a specified point
   * in time for a set of properties of the target object of
   * a {@link #Timeline Timeline}.
   *
   * <p>
   * This type is usually used only internally to compute the frames
   * between a set of given {@link #KeyFrame KeyFrame}s.
   * </p><p>
   * By contrast to <code>KeyFrame</code>s, inserting a
   * <code>Frame</code> into a <code>Timeline</code> does not cause
   * computation of additional <code>Frame</code>s with regard to
   * adjacent <code>Keyframe</code>s.  You can do so if you need
   * full control over the <code>Timeline</code>, for example
   * if you want an object to "jump" from one screen area to a
   * more distant one instead of producing a gradual change of
   * its coordinates, or if you want to use a set of
   * <code>Frame</code>s or <code>Frame</code>-compatible objects
   * that are the result of computation by another framework.
   * </p>
   *
   * @type jsx.dom.animation.Frame
   */
  var _Frame = (
    /**
     * @constructor
     * @param {Object} oParams
     * @throws jsx.InvalidArgumentError if no parameters were specified
     */
    function (oParams) {
      if (!oParams)
      {
        jsx.throwThis(jsx.InvalidArgumentError,
          ["Not enough arguments", typeof oParams, "Object"]);
      }

      var keys = _getKeys(oParams);
      for (var i = 0, len = keys.length; i < len; ++i)
      {
        var paramName = keys[i];
        var param = oParams[paramName];

        if (typeof param != "undefined")
        {
          if (paramName == "time" && typeof param != "number")
          {
            /*
             * Convert duration to milliseconds
             */
            var rxTime = /^\s*\+?(\d+|\d*\.\d+)\s*(ms|s|m(in)?|h|%)\s*$/;
            var match = param.match(rxTime);
            if (match)
            {
              /*
               * NOTE: Percentages are supported but can only
               * be resolved later in jsx.dom.animation.Timeline().
               */
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
                ["Invalid time", "'" + param + "'",
                 "one matching " + rxTime.source]);
            }
          }

          this[paramName] = param;
        }
      }
    }
  ).extend(null, {
    /**
     * @memberOf jsx.dom.animation.Frame.prototype
     */
    time: 0,
    values: {}
  });

  /**
   * A <code>KeyFrame</code> is a special {@link #Frame Frame} that
   * defines target values at a specified point in time for a set
   * of properties that are interpolated along a {@link #Timeline}.
   *
   * The developer controls the interpolation of a set of properties
   * for the interval between successive key frames by providing
   * a target value and an {@link #interpolator} associated with
   * each property, or that of the KeyFrame itself which is used
   * for all properties defined for the <code>KeyFrame</code> unless
   * specified otherwise.  The properties are interpolated such that
   * they will reach their target value at the specified time.
   * An <var>action</var> function is invoked on each
   * <code>KeyFrame</code> if one is specified.
   *
   * @type jsx.dom.animation.KeyFrame
   */
  var _KeyFrame = (
    /**
     * @constructor
     * @param oParams
     * @throws jsx.InvalidArgumentError if no parameters were specified
     */
    function jsx_dom_animation_KeyFrame (oParams) {
      jsx_dom_animation_KeyFrame._super.call(this, oParams);
    }
  ).extend(_Frame, {
    /**
     * A comparison function used to sort <code>KeyFrames</code>
     * by their specified reference time.
     *
     * @memberOf jsx.dom.animation.KeyFrame.prototype
     * @param {KeyFrame} targetFrame
     * @return {number}
     *   An integer value <var>i</var> where
     *   <ul>
     *     <li><var>i</var> > 0 if <var>targetFrame</var>'s
     *         timing is ahead of this one's</li>
     *     <li><var>i</var> = 0 if they have the same timing</li>
     *     <li><var>i</var> &lt; 0 if <var>targetFrame</var>'s
     *         timing is behind this one's</li>
     *   </ul>
     */
    compareTo: function (targetFrame) {
      return this.time - targetFrame.time;
    },

    /**
     * {@link #interpolator} to be used for calculating the
     * key values along the particular interval.  By default,
     * {@link #interpolator.LINEAR} is used.
     */
    interpolate: _interpolator_LINEAR,

    toString: function () {
      var style = this.values.style;
      var keys = _getKeys(style);
      var aValues = [];
      for (var i = 0, len = keys.length; i < len; ++i)
      {
        var stylePropertyName = keys[i];
        var propertyValue = style[stylePropertyName];

        var propertyType = _getProperty(
          _jsx_dom_css.propertyInfo, stylePropertyName, {type: null}).type;
        switch (propertyType)
        {
          case _types.LENGTH:
            propertyValue += "px";
            break;
        }

        var cssPropertyName = _jsx_dom_css.uncamelize(stylePropertyName);

        aValues.push("    " + cssPropertyName + ": " + propertyValue + ";");
      }

      var time = this.time + "ms";
      if (this._timeline)
      {
        time = (this.time / Array.get(this._timeline.keyFrames, -1).time * 100)
          + "%";
      }

      return "  " + time + " {\n"
      + aValues.join("\n")
      + "\n  }";
    }
  });

  /**
   * @type jsx.dom.animation.KeyValue
   */
  var _KeyValue = (
    /**
     * @constructor
     * @param {Object} oParams
     */
    function (oParams) {
      if (!oParams)
      {
        jsx.throwThis(jsx.InvalidArgumentError,
          ["Not enough arguments", typeof oParams, "Object"]);
      }

      for (var paramName in this)
      {
        var param = oParams[paramName];
        if (typeof param != "undefined")
        {
          this[paramName] = param;
        }
      }
    }
  ).extend(null, {
    /**
     * {@link #interpolator} to be used for calculating the
     * key value along the particular interval.  By default,
     * {@link #interpolator.LINEAR} is used.
     *
     * @memberOf jsx.dom.animation.KeyValue.prototype
     */
    interpolate: _interpolator_LINEAR,

    value: null
  });

  return {
    /**
     * @memberOf jsx.dom.animation
     */
    version: "0.1.$Revision$",

    NoTimelineError: _NoTimelineError,

    /**
     * An <code>Animation</code> is a set of one or more
     * {@link #Timeline Timelines} being played in parallel
     * when the animation is played.  Each <code>Timeline</code>
     * is supposed to animate another target object (but that
     * is not required).
     *
     * @type jsx.dom.animation.Animation
     */
    Animation: (
      /**
       * @constructor
       * @param {Object} oParams
       *   The parameters of this animation.  Supported parameters,
       *   to be specified as properties of <var>oParams</var>,
       *   include:
       *   <dl>
       *     <dt><code><var>target</var> : Object</code></dt>
       *       <dd>Reference specifying the object to animate.
       *           If specified, the timelines of this animation
       *           automatically inherit its target; if not specified
       *           for the animation, each timeline of an animation
       *           MUST specify its target.</dd>
       *     <dt><code><var>timelines</var> : Array</code></dt>
       *       <dd>{@link #Timeline Timelines} of this animation
       *           (required)</dd>
       *   </dl>
       * @throws jsx.InvalidArgumentError if no parameters were specified
       */
      function jsx_dom_animation_Animation (oParams) {
        if (!oParams)
        {
          jsx.throwThis("jsx.InvalidArgumentError",
            ["Not enough arguments", typeof oParams, "Object"]);
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

          if (timeline.constructor != _Timeline)
          {
            timeline = new _Timeline(timeline);
            timelines[i] = timeline;
          }

          timeline.preferNative = this.preferNative;

          if (!timeline.target)
          {
            timeline.target = this.target;
          }
        }
      }
    ).extend(null, {
      /**
       * If <code>true</code> (default), native (CSS3) animations
       * are preferred.  Overridden by the <code>preferNative</code>
       * property of an enclosing {@link #Animation}.
       *
       * @memberOf jsx.dom.animation.Animation.prototype
       */
      preferNative: true,

      /**
       * @type Object
       */
      target: null,
      timelines: [],

      /**
       * Plays the animation by playing all of its
       * {@link #Timeline Timelines}.
       *
       * @throws #NoTimelineError
       *   if no <code>Timelines</code> have been defined
       */
      play: function () {
        var timelines = this.timelines;
        if (!timelines || timelines.length < 1)
        {
          jsx.throwThis(_NoTimelineError);
        }

        for (var i = 0, len = timelines.length; i < len; ++i)
        {
          timelines[i].play();
        }
      },

      /**
       * Stops the animation by stopping all of its
       * {@link #Timeline Timelines}.
       *
       * @throws #NoTimelineError
       *   if no <code>Timelines</code> have been defined
       */
      stop: function () {
        var timelines = this.timelines;
        if (!timelines || timelines.length < 1)
        {
          jsx.throwThis(_NoTimelineError);
        }

        for (var i = 0, len = timelines.length; i < len; ++i)
        {
          timelines[i].stop();
        }
      }
    }),

    /**
     * @type jsx.dom.animation.NoKeyFramesError
     * @todo currently unused
     */
    NoKeyFramesError: (
      /**
       * @constructor
       */
      function jsx_dom_animation_NoKeyFramesError () {
        jsx_dom_animation_NoKeyFramesError._super.call(
          this, "Need at least two KeyFrames in a Timeline");
      }
    ).extend(jsx.Error, {
      /**
       * @memberOf jsx.dom.animation.NoKeyFramesError.prototype
       */
      name: "jsx.dom.animation.NoKeyFramesError"
    }),

    Timeline: _Timeline,
    Frame: _Frame,

    /**
     * Namespace for a set of functions that take a
     * <var>startValue</var> and an <var>endValue</var> together
     * with a <var>fraction</var> between 0.0 and 1.0, and return
     * a value that corresponds to the <var>fraction</var> with
     * regard to <var>startValue</var> and <var>endValue</var>.
     *
     * The purpose of those functions is to define how time
     * (represented as a 0.0 to 1.0 fraction of the duration
     * of an animation) is altered to derive different value
     * calculations during an animation.
     *
     * @namespace
     */
    interpolator: {
      LINEAR: _interpolator_LINEAR
    },

    KeyFrame: _KeyFrame,
    KeyValue: _KeyValue
  };
}());