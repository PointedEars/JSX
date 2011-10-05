/**
 * @requires dom.js, events.js
 */

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

if (typeof jsx.dom == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom = {};
}

/**
 * Constructor of the abstract prototype for widgets. It provides shallow
 * copying of the passed properties, stores the reference to the manipulated DOM
 * object, and applies the given properties to the display of that object.
 * Widgets should inherit from this prototype, and this constructor should be
 * called only from the constructors of prototypes of specialized widgets.
 * 
 * @param oTarget : Elementp
 *   Reference to the DOM object that provides the client area for the widget
 * @param oProperties : Object
 */
jsx.dom.Widget = function(oTarget, oProperties) {
  for (var p in oProperties)
  {
    if (typeof this[p] != "function")
    {
      this[p] = oProperties[p];
    }
  }
  
  this.target = oTarget;
  this.applyProperties();
};

jsx.dom.Widget.extend(null, {
  /**
   * @memberOf jsx.dom.Widget#prototype
   */
  applyProperties: function() {
    /* overridden by inheriting types */
  }
});

/**
 * An <code>InputWidget</code> object enhances the default <code>INPUT</code>
 * element text box with a restriction to the characters that may be typed into
 * it.
 * 
 * @param oTarget : Element
 *   Reference to the DOM object that provides the client area for the widget
 * @param oProperties : Object
 * @see Widget
 */
jsx.dom.InputWidget = function(oTarget, oProperties) {
  arguments.callee._super.apply(this, arguments);
  
  var me = this;
  
  jsx.dom.addEventListener(oTarget, 'keypress', function(e) {
    if (!e)
    {
      e = (typeof window != "undefined" && window
           && typeof window.event != "undefined" && window.event);
    }
    
    if (e)
    {
      var charCode = typeof e.charCode != "undefined"
                   ? e.charCode
                   : (typeof e.keyCode != "undefined" ? e.keyCode : charCode);
      
      if (!(charCode < 32 || me.allowedChars.test(String.fromCharCode(charCode))
           && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey))
      {
        /* W3C DOM Level 2+ Events */
        if (jsx.object.isMethod(e, "preventDefault"))
        {
          e.preventDefault();
        }
        
        /* MSHTML DOM */
        if (typeof e.returnValue != "undefined")
        {
          e.returnValue = false;
        }
        
        /* other proprietary */
        return false;
      }
    }
    
    return true;
  });
};

jsx.dom.InputWidget.extend(jsx.dom.Widget, {
  /**
   * Regular Expression specifying the format allowed to be input into this
   * widget. CAUTION: Too restrictive an expression could render the widget
   * unusable.
   * 
   * @memberOf jsx.dom.InputWidget#prototype
   * @type RegExp
   */
  allowedChars: /./
});

/**
 * A <code>NumberWidget</code> restricts the characters to be typed into it to
 * decimal digits by default.
 * 
 * @param oTarget : Element
 *   Reference to the DOM object that provides the client area for the widget
 * @param oProperties : Object
 * @see InputWidget
 */
jsx.dom.NumberWidget = function(oTarget, oProperties) {
  arguments.callee._super.apply(this, arguments);
  
  var me = this;
  
  jsx.dom.addEventListener(oTarget, 'blur', function() {
    me.applyProperties();
  });
  
  jsx.dom.addEventListener(oTarget, 'focus', function() {
    if (me.leadingZero)
    {
      oTarget.value = parseInt(oTarget.value, 10);
    }
  });
};

jsx.dom.NumberWidget.extend(jsx.dom.InputWidget, {
  /**
   * @type RegExp
   */
  allowedChars: /\d/,
  
  leadingZero: false,
  
  /**
   * @type Number
   */
  minValue: -Infinity,
  
  /**
   * @type Number
   */
  maxValue: Infinity,
  
  /**
   * Overwrites the method inherited from Widget
   * 
   * @memberOf jsx.dom.NumberWidget#prototype
   */
  applyProperties: function() {
    var t = this.target;
    if (this.leadingZero && this.maxValue != Infinity)
    {
      t.value = leadingZero(t.value, String(this.maxValue).length);
    }
    else if (!this.leadingZero && t.value.length > 0)
    {
      t.value = String(parseFloat(t.value));
    }
  }
});

/**
 * A <code>SpinnerWidget</code> is a <code>NumberWidget</code> that allows
 * the user to increase or decrease its current value with the arrow keys or the
 * attached arrow buttons ("to spin" it). It is possible to define a minimum or
 * maximum value.
 * 
 * @param oTarget : Element
 *   Reference to the DOM object that provides the client area for the widget
 * @param oProperties : Object
 * @see NumberWidget
 */
jsx.dom.SpinnerWidget = function(oTarget, oProperties) {
  arguments.callee._super.apply(this, arguments);
  
  var me = this;
  
  /* TODO: add arrow controls */
  
  /* add event listeners */
  jsx.dom.addEventListener(oTarget, 'keydown', function(e) {
    /**
     * Increases the value of the <code>value</code> property.
     */
//  function inc()
//  {
//    var v;
//    if ((me.maxValue == Infinity || this.value < me.maxValue)
//        && !isNaN(v = parseInt(this.value, 10) + 1)
//        && (this.maxLength < 1 || v.toString().length <= this.maxLength))
//    {
//      this.value = v;
//    }
//  }
//
//  function dec()
//  {
//    var v;
//    if ((me.minValue == -Infinity || this.value > me.minValue)
//        && !isNaN(v = parseInt(this.value, 10) - 1)
//        && (this.maxLength < 1 || v.toString().length <= this.maxLength))
//    {
//      this.value = v;
//    }
//  }    if (me.minValue != -Infinity || me.maxValue != Infinity)
    {
      if (!e)
      {
        e = (typeof window != "undefined" && window
             && typeof window.event != "undefined" && window.event);
      }
      
      if (e)
      {
        /* DOM Level 3 Events draft */
        switch (e.keyIdentifier)
        {
          case "Up":
            me.inc();
            break;
          
          case "Down":
            me.dec();
            break;
          
          default:
            /* currently proprietary */
            switch (e.keyCode)
            {
              case 38:
                me.inc();
                break;
              
              case 40:
                me.dec();
                break;
              
              default:
            }
        }
      }
    }
  });
};

jsx.dom.SpinnerWidget.extend(jsx.dom.NumberWidget, {
  /**
   * @memberOf jsx.dom.SpinnerWidget#prototype
   */
  inc: function() {
    var v, t = this.target;
    
    if ((this.maxValue == Infinity || t.value < this.maxValue)
        && !isNaN(v = parseInt(t.value, 10) + 1)
        && (t.maxLength < 1 || v.toString().length <= t.maxLength))
    {
      t.value = v;
    }
  },
  
  /**
   * @memberOf jsx.dom.SpinnerWidget#prototype
   */
  dec: function() {
    var v, t = this.target;
    
    if ((this.minValue == -Infinity || t.value > this.minValue)
        && !isNaN(v = parseInt(t.value, 10) - 1)
        && (t.maxLength < 1 || v.toString().length <= t.maxLength))
    {
      t.value = v;
    }
  }
});

/**
 * A <code>TimerWidget</code> uses several <code>NumberWidgets</code> to
 * implement a digital timer.
 * 
 * @param oTarget : Element
 *   Reference to the DOM object that provides the client area for the widget
 * @param oProperties : Object
 * @base jsx.dom.Widget
 * @see NumberWidget
 */
jsx.dom.TimerWidget = function(oTarget, oProperties) {
  arguments.callee._super.apply(this, arguments);
};

jsx.dom.TimerWidget.extend(jsx.dom.Widget);

function handleKeypress(e)
{
  console.log("e = ", e);
  if (e)
  {
    var t = e.target || e.srcElement;
    console.log("t = ", t);
    if (t && /^\s*\binput\b\s*$/i.test(t.tagName)
      && /^\s*\btext\b\s*$/i.test(t.type))
    {
      var keyCode =
        (typeof e.which != "undefined" ? e.which
          : (typeof e.keyCode != "undefined" ? e.keyCode : 0));
      
      /* Allow control characters and numbers only */
      console.log("keyCode = ", keyCode);
      if (!(keyCode < 32 || (keyCode >= "0".charCodeAt(0) && keyCode <= "9"
        .charCodeAt(0))))
      {
        /* W3C DOM */
        if (isMethodType(typeof e.stopPropagation) && e.stopPropagation)
        {
          e.stopPropagation();
        }
        
        /* MSHTML DOM */
        if (typeof e.cancelBubble != "undefined")
        {
          e.cancelBubble = true;
        }
        
        /* W3C DOM */
        /*
         * Order is important for Firefox 2: cancelBubble exists after
         * preventDefault() and changes DOM behavior (event is NOT canceled then
         * if cancelBubble is assigned `true')
         */
        if (isMethodType(typeof e.preventDefault) && e.preventDefault)
        {
          e.preventDefault();
        }
        
        /*
         * FIXME: key* cannot be canceled in the MSHTML DOM,
         * check MSDN Library
         */
        if (typeof e.returnValue != "undefined")
        {
          e.returnValue = false;
        }
        
        /* DEBUG */
        // console.log(e);
      }
    }
  }
}