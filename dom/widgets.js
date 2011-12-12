/**
 * <title>PointedEars' DOM Library: Widgets</title>
 *
 * @version $Id$
 * @requires dom.js, events.js
 * @section Copyright & Disclaimer
 *
 * @author (C) 2010, 2011 Thomas Lahn <js@PointedEars.de>
 *
 * @partof PointedEars' JavaScript Extensions (JSX)
 *
 * JSX is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * JSX is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSX.  If not, see <http://www.gnu.org/licenses/>.
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
 * @namespace
 */
jsx.dom.widgets = {
  version: "$Id$"
};

/**
 * Constructor of the abstract prototype for widgets. It provides
 * shallow copying of the passed properties, stores the reference to the
 * manipulated DOM object, and applies the given properties to the
 * display of that object. Widgets should inherit from this prototype,
 * and this constructor should be called only from the constructors of
 * prototypes of specialized widgets.
 *
 * @param oTarget : Element
 *   Reference to the DOM object that represents the
 *   element that provides the client area for the widget. Pass a
 *   false-value to create a new element.
 * @param oParent : Element
 *   Reference to the DOM object that represents the parent
 *   element for this widget. Pass <code>null</code> so that the
 *   widget will not be automatically attached to the document
 *   tree. You can call its {@link #appendTo()} method later to
 *   attach it.
 * @param oProperties : Object
 */
jsx.dom.widgets.Widget = function(oTarget, oParent, oProperties) {
  this.target = oTarget || document.createElement(this.elementType);
  this._parent = oParent || null;

  for ( var propertyName in oProperties)
  {
    /* Do not overwrite methods */
    if (typeof this[propertyName] != "function")
    {
      var setter = this._getSetterFor(propertyName);
      if (setter)
      {
        setter.call(this, oProperties[propertyName]);
      }
      else
      {
        this[propertyName] = oProperties[propertyName];
      }
    }
  }

  if (this.target)
  {
    this.init();
    this.update();
  }
};

jsx.dom.widgets.Widget.extend(null, {
  /**
   * Widgets are `div' elements by default. Inheriting classes should
   * override this when appropriate (e. g., a menu should be a `ul').
   * @memberOf jsx.dom.widgets.Widget#prototype
   */
  elementType: "div",

  /**
   * @type Element
   */
  target: null,

  /**
   * Defines actions to be performed when the widget is initialized;
   * overridden by inheriting types.
   */
  init: function() {
    /* stub */
  },

  /**
   * Defines actions to be performed when the widget's canvas should be
   * updated to reflect its current status; should be overridden by
   * inheriting types.
   */
  update: function() {
    var style = this.style;
    for (var styleProperty in style)
    {
      this.target.style[styleProperty] = style[styleProperty];
    }
  },

  /**
   * Causes the widget to be rendered, and attached to the document tree
   * if not already attached.
   *
   * @param parent : optional Element
   *   Reference to the object representing the parent element to
   *   which the widget should be appended as child. The default is
   *   document.body.
   */
  render: function(parent) {
    this.appendTo(parent);
    this.target.style.display = "";
  },

  /**
   * Causes the widget not to be rendered, without removing it from the
   * document tree.
   */
  unrender: function() {
    this.target.style.display = "none";
  },

  /**
   * Shows the widget
   */
  show: function() {
    target.style.display.visibility = "visible";
  },

  /**
   * Hides the widget, but keeps its box
   */
  hide: function() {
    this.target.style.display.visibility = "hidden";
  },

  /**
   * Appends the widget as a child element
   *
   * @param parent
   * @returns
   */
  appendTo: function(parent) {
    var result = null;

    if (typeof parent == "undefined")
    {
      parent = this._parent;
    }

    var target = this.target;
    if (!target.parentNode || (parent != target.parentNode))
    {
      result = parent.appendChild(target);
    }

    return result;
  },

  /**
   * Removes the widget from the document
   */
  remove: function() {
    return this.target.parentNode.removeChild(this.target);
  },

  /**
   * @memberOf jsx.dom.widgets.Widget#prototype
   */
  _getSetterFor: function(propertyName) {
    var setterName =
      "set" + propertyName.charAt(0).toUpperCase() + propertyName.substring(1);
    var setter = this[setterName];
    return (typeof setter == "function") ? setter : null;
  },
});

/**
 * An <code>Input</code> widget enhances the default
 * <code>INPUT</code> element text box with a restriction to the
 * characters that may be typed into it.
 *
 * @param oTarget :
 *        Element Reference to the DOM object that represents the
 *        element that provides the client area for the widget. Pass a
 *        false-value to create a new element.
 * @param oParent :
 *        Element Reference to the DOM object that represents the parent
 *        element for this widget. Pass <code>null</code> so that the
 *        widget will not be automatically attached to the document
 *        tree. You can call its {@link #appendTo()} method later to
 *        attach it.
 * @param oProperties :
 *        Object
 * @see Widget
 */
jsx.dom.widgets.Input = function(oTarget, oParent, oProperties) {
  arguments.callee._super.apply(this, arguments);
};

jsx.dom.widgets.Input.extend(jsx.dom.widgets.Widget, {
  /**
   * Regular Expression specifying the format allowed to be input into
   * this widget. CAUTION: Too restrictive an expression could render
   * the widget unusable.
   *
   * @memberOf jsx.dom.widgets.Input#prototype
   * @type RegExp
   */
  allowedChars: /./,

  elementType: "input",

  init: function() {
    var me = this;
    jsx.dom.addEventListener(this.target, 'keypress', function(e) {
      if (!e)
      {
        e =
          (typeof window != "undefined" && window
            && typeof window.event != "undefined" && window.event);
      }

      if (e)
      {
        var charCode =
          (typeof e.charCode != "undefined") ? e.charCode
            : (typeof e.keyCode != "undefined" ? e.keyCode : charCode);

        if (! (charCode < 32 || me.allowedChars.test(String
          .fromCharCode(charCode))
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
  }
});

jsx.dom.widgets.Button = function(oTarget, oParent, oProperties) {
  arguments.callee._super.apply(this, arguments);
};

jsx.dom.widgets.Button.extend(jsx.dom.widgets.Input, {
  /**
   * @memberOf jsx.dom.widgets.Button#prototype
   */
  init: function() {
    this.target.type = "button";
  },

  update: function() {
    this._super.update.call(this);
    
    var t = this.target;
    t.type = "button";
    t.value = this.text || "";
    t.onclick = this.onclick;
  }
});

/**
 * A <code>NumberInput</code> widget restricts the characters to be
 * typed into it to decimal digits by default.
 *
 * @param oTarget :
 *        Element Reference to the DOM object that represents the
 *        element that provides the client area for the widget. Pass a
 *        false-value to create a new element.
 * @param oParent :
 *        Element Reference to the DOM object that represents the parent
 *        element for this widget. Pass <code>null</code> so that the
 *        widget will not be automatically attached to the document
 *        tree. You can call its {@link #appendTo()} method later to
 *        attach it.
 * @param oProperties :
 *        Object
 * @see jsx.dom.widgets#Input
 */
jsx.dom.widgets.NumberInput = function(oTarget, oParent, oProperties) {
  arguments.callee._super.apply(this, arguments);

  var me = this;

  jsx.dom.addEventListener(oTarget, 'blur', function() {
    me.update();
  });

  jsx.dom.addEventListener(oTarget, 'focus', function() {
    if (me.leadingZero)
    {
      oTarget.value = parseInt(oTarget.value, 10);
    }
  });
};

jsx.dom.widgets.NumberInput.extend(jsx.dom.widgets.Input, {
  /**
   * @memberOf jsx.dom.widgets.NumberInput#prototype
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

  init: function() {
    var target = this.target;

    target.type = "number";
    if (target.type == "number")
    {
      /* HTML5 support */
    }
  },

  /*
   * (non JSdoc)
   *
   * @see Widget.prototype#update
   */
  update: function() {
    this._super.update.call(this);
    
    var target = this.target;

    if (this.leadingZero && this.maxValue != Infinity)
    {
      target.value = leadingZero(target.value, String(this.maxValue).length);
    }
    else if (!this.leadingZero && target.value.length > 0)
    {
      target.value = String(parseFloat(target.value));
    }
  },

  _setBoundary: function(valueType, value) {
    value = parseFloat(value);

    if (!isNaN(value))
    {
      if (this.target.type == "number")
      {
        /* HTML5 support */
        this.target[valueType] = String(value);
      }

      this[valueType + "Value"] = value;
    }
    else
    {
      jsx.throwThis(null, "Invalid boundary: " + valueType + "Value");
    }

    return this[valueType + "Value"];
  },

  setMinValue: function(value) {
    return this._setBoundary("min", value);
  },

  setMaxValue: function(value) {
    return this._setBoundary("max", value);
  }

});

/**
 * A <code>SpinnerInput</code> is a <code>NumberInput</code> that
 * allows the user to increase or decrease its current value with the
 * arrow keys or the attached arrow buttons ("to spin" it). It is
 * possible to define a minimum or maximum value.
 *
 * @param oTarget :
 *        Element Reference to the DOM object that represents the
 *        element that provides the client area for the widget. Pass a
 *        false-value to create a new element.
 * @param oParent :
 *        Element Reference to the DOM object that represents the parent
 *        element for this widget. Pass <code>null</code> so that the
 *        widget will not be automatically attached to the document
 *        tree. You can call its {@link #appendTo()} method later to
 *        attach it.
 * @param oProperties :
 *        Object
 * @see jsx.dom.widgets#NumberInput
 */
jsx.dom.widgets.SpinnerInput = function(oTarget, oParent, oProperties) {
  var me = this;

  arguments.callee._super.apply(this, arguments);

  var target = this.target;
  if (target.type != "number")
  {
    /* If no HTML5 support, add arrow controls */
    this.buttonUp = new jsx.dom.widgets.Button(null, null, {
      text: "\u25B4",
      style: {
        width: "1em"
      },
      onclick: function() {
        me.inc();
      }
    });

    this.buttonDown = new jsx.dom.widgets.Button(null, null, {
      text: "\u25BE",
      style: {
        width: "1em"
      },
      onclick: function() {
        me.dec();
      }
    });

    target.parentNode.insertBefore(this.buttonUp.target, target.nextSibling);
    target.parentNode.insertBefore(this.buttonDown.target,
      this.buttonUp.target.nextSibling);

    /* Add event listeners */
    jsx.dom.addEventListener(target, 'keydown', function(e) {
      /**
       * Increases the value of the <code>value</code> property.
       */
      // function inc()
      // {
      // var v;
      // if ((me.maxValue == Infinity || this.value < me.maxValue)
      // && !isNaN(v = parseInt(this.value, 10) + 1)
      // && (this.maxLength < 1 || v.toString().length <=
      // this.maxLength))
      // {
      // this.value = v;
      // }
      // }
      //
      // function dec()
      // {
      // var v;
      // if ((me.minValue == -Infinity || this.value > me.minValue)
      // && !isNaN(v = parseInt(this.value, 10) - 1)
      // && (this.maxLength < 1 || v.toString().length <=
      // this.maxLength))
      // {
      // this.value = v;
      // }
      // } if (me.minValue != -Infinity || me.maxValue != Infinity)
      {
        if (typeof e == "undefined")
        {
          e =
            (typeof window != "undefined" && window
              && typeof window.event != "undefined" && window.event);
        }

        if (typeof e != "undefined")
        {
          if (typeof e.keyIdentifier)
          {
            /* DOM Level 3 Events draft */
            switch (e.keyIdentifier)
            {
              case "Up":
                me.inc();
                break;
  
              case "Down":
                me.dec();
            }
          }
          else
          {
            /* currently proprietary */
            switch (e.keyCode)
            {
              case 38:
                me.inc();
                break;

              case 40:
                me.dec();
            }
          }
        }
      }
    });
  }
};

jsx.dom.widgets.SpinnerInput.extend(jsx.dom.widgets.NumberInput, {
  /**
   * @memberOf jsx.dom.widgets.SpinnerInput#prototype
   */
  inc: function() {
    var v, t = this.target;

    if ( (this.maxValue == Infinity || t.value < this.maxValue)
      && !isNaN(v = parseInt(t.value, 10) + 1)
      && (t.maxLength < 1 || v.toString().length <= t.maxLength))
    {
      t.value = v;
    }
  },

  dec: function() {
    var v, t = this.target;

    if ( (this.minValue == -Infinity || t.value > this.minValue)
      && !isNaN(v = parseInt(t.value, 10) - 1)
      && (t.maxLength < 1 || v.toString().length <= t.maxLength))
    {
      t.value = v;
    }
  }
});

/**
 * A <code>Timer</code> widget uses several <code>NumberInput</code>
 * widgets to implement a digital timer.
 *
 * @param oTarget :
 *        Element Reference to the DOM object that represents the
 *        element that provides the client area for the widget. Pass a
 *        false-value to create a new element.
 * @param oParent :
 *        Element Reference to the DOM object that represents the parent
 *        element for this widget. Pass <code>null</code> so that the
 *        widget will not be automatically attached to the document
 *        tree. You can call its {@link #appendTo()} method later to
 *        attach it.
 * @param oProperties :
 *        Object
 * @base jsx.dom.Widget
 * @see NumberWidget
 */
jsx.dom.widgets.Timer = function(oTarget, oParent, oProperties) {
  arguments.callee._super.apply(this, arguments);
};

jsx.dom.widgets.Timer.extend(jsx.dom.widgets.Widget);

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
      if (! (keyCode < 32 || (keyCode >= "0".charCodeAt(0) && keyCode <= "9"
        .charCodeAt(0))))
      {
        /* W3C DOM */
        if (jsx.object.isMethod(e, "stopPropagation"))
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
         * preventDefault() and changes DOM behavior (event is NOT
         * canceled then if cancelBubble is assigned `true')
         */
        if (jsx.object.isMethod(e, "preventDefault"))
        {
          e.preventDefault();
        }
        else
        {
          e.returnValue = false;
        }

        /* DEBUG */
        // console.log(e);
      }
    }
  }
}