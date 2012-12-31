"use strict";
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
jsx.dom.widgets.Widget =
  function jsx_dom_widgets_Widget (oTarget, oParent, oProperties) {
    this._target = oTarget || document.createElement(this.elementType);
    
    if (oParent && !(oParent instanceof jsx_dom_widgets_Widget))
    {
      return jsx.throwThis(jsx.InvalidArgumentError, [null, "Widget", oParent]);
    }
    
    this._parent = oParent || null;

    /**
     * @type Array[Widget]
     */
    this.children = [];
    
    for (var propertyName in oProperties)
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
  
    if (this._target)
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
  _target: null,

  /**
   * Defines actions to be performed when the widget is initialized;
   * overridden by inheriting types.
   */
  init: function () {
    /* stub */
  },

  /**
   * Defines actions to be performed when the widget's canvas should be
   * updated to reflect its current status; should be overridden
   * and called by inheriting types.
   */
  update: (function () {
    var _setStyleProperty = jsx.dom.setStyleProperty;
    
    return function () {
      var style = this.style;
      for (var styleProperty in style)
      {
        _setStyleProperty(this._target, styleProperty, style[styleProperty]);
      }
      
      for (var i = 0, len = this.children.length; i < len; ++i)
      {
        this.children[i].update();
      }
      
      return this;
    };
  }()),

  /**
   * Causes the widget to be rendered, and attached to the document tree
   * if not already attached.
   *
   * @param parent : optional Element
   *   Reference to the object representing the parent element to
   *   which the widget should be appended as child. The default is
   *   document.body.
   */
  render: function (parent) {
    this.update();
    this.appendTo(parent);
    this._target.style.display = "";
    return this;
  },

  /**
   * Causes the widget not to be rendered, without removing it from the
   * document tree.
   */
  unrender: function () {
    this._target.style.display = "none";
    return this;
  },

  /**
   * Shows the widget
   */
  show: function () {
    this._target.style.visibility = "visible";
    return this;
  },

  /**
   * Hides the widget, but keeps its box
   */
  hide: function () {
    this._target.style.visibility = "hidden";
    return this;
  },

  /**
   * Appends the widget as a child element
   *
   * @param parent
   * @returns
   */
  appendTo: function (parent) {
    if (typeof parent == "undefined")
    {
      parent = this._parent;
    }

    return parent.appendChild(this);
  },

  /**
   * Removes the widget from the document
   */
  remove: function () {
    for (var i = 0, len = this.children.length; i < len; ++i)
    {
      this.children[i].remove();
    }
    
    /* TODO: Clean-up event listener */
    
    return this._parent.removeChild(this);
  },

  /**
   * @memberOf jsx.dom.widgets.Widget#prototype
   */
  _getSetterFor: function (propertyName) {
    var setterName =
      "set" + propertyName.charAt(0).toUpperCase() + propertyName.substring(1);
    var setter = this[setterName];
    return (typeof setter == "function") ? setter : null;
  }
});

/**
 * <code>Container</code>s are widgets that may have content, such
 * as other widgets and text.
 */
jsx.dom.widgets.Container =
  function jsx_dom_widgets_Container (oTarget, oParent, oProperties) {
    jsx_dom_widgets_Container._super.apply(this, arguments);
  };

jsx.dom.widgets.Container.extend(jsx.dom.widgets.Widget, {
  innerHTML: null,
  text: null,
    
  /*
   * (non JSdoc)
   * @see Widget.prototype#update
   */
  /**
   * @memberOf jsx.dom.widgets.Container#prototype
   */
  update: (function () {
    var _isArray = jsx.object.isArray;
    var _createNodesFromObj = jsx.dom.createNodesFromObj;
    var _setTextContent = jsx.dom.setTextContent;
    var update = jsx.dom.widgets.Widget.prototype.update;

    return function () {
      update.call(this);

      var target = this._target;

      var html = this.innerHTML;
      if (html !== null)
      {
        if (typeof html.valueOf() == "string")
        {
          target.innerHTML = html;
        }
        else
        {
          jsx.dom.removeChildren(target, target.childNodes);
          
          if (_isArray(html))
          {
            html = _createNodesFromObj(html);
          }

          if (_isArray(html))
          {
            jsx.dom.appendChildren(target, html);
          }
          else
          {
            target.appendChild(html);
          }
        }
      }
      else if (this.text != null)
      {
        _setTextContent(target, this.text);
      }
      
      target.onclick = this.onclick || null;
      target.onmouseover = this.onmouseover || null;
      target.onmousedown = this.onmousedown || null;
      
      return this;
    };
  }()),
  
  setText: function (text) {
    this.text = text;
    this.innerHTML = null;
    return this;
  },

  setInnerHTML: function (html) {
    this.text = "";
    this.innerHTML = html;
    return this;
  },

  appendChild: function (child) {
    var result = null;
    var childTarget = child._target;
    var target = this._target;
    var success = true;
    
    if (!target.parentNode || (target != childTarget.parentNode))
    {
      target.appendChild(child._target);
      success = (target.lastChild == childTarget);
    }
    
    if (success)
    {
      var childIndex = this.children.indexOf(child);
      if (childIndex >= 0)
      {
        this.children.splice(childIndex, 1);
      }

      this.children.push(child);
      
      result = child;
    }
    
    return result;
  },
  
  removeChild: function (child) {
    var childIndex = this.children.indexOf(child);
    if (childIndex >= 0)
    {
      this._target.removeChild(child._target);
      this.children.splice(childIndex, 1);
    }
  },
});

jsx.dom.widgets.Section =
  function jsx_dom_widgets_Section (oTarget, oParent, oProperties) {
    jsx_dom_widgets_Section._super.apply(this, arguments);
  };

jsx.dom.widgets.Section.extend(jsx.dom.widgets.Container, {
  /**
   * @memberOf jsx.dom.widgets.Section#prototype
   */
  elementType: "section"
});

jsx.dom.widgets.Label =
  function jsx_dom_widgets_Label (oTarget, oParent, oProperties) {
    jsx_dom_widgets_Label._super.apply(this, arguments);
  };

jsx.dom.widgets.Label.extend(jsx.dom.widgets.Container, {
  /**
   * @memberOf jsx.dom.widgets.Label#prototype
   */
  elementType: "label"
});

jsx.dom.widgets.TextArea =
  function jsx_dom_widgets_TextArea (oTarget, oParent, oProperties) {
    jsx_dom_widgets_TextArea._super.apply(this, arguments);
  };

jsx.dom.widgets.TextArea.extend(jsx.dom.widgets.Container, {
  /**
   * @memberOf jsx.dom.widgets.TextArea#prototype
   */
  elementType: "textarea"
});

jsx.dom.widgets.CheckBox =
  function jsx_dom_widgets_CheckBox (oTarget, oParent, oProperties) {
    jsx_dom_widgets_CheckBox._super.apply(this, arguments);
  };

jsx.dom.widgets.position = {
  BEFORE: -1,
  AFTER: 1
};

jsx.dom.widgets.CheckBox.extend(jsx.dom.widgets.Widget, {
  /**
   * @memberOf jsx.dom.widgets.CheckBox#prototype
   */
  elementType: "input",
  
  labelPosition: jsx.dom.widgets.position.AFTER,
  
  /**
   * Unique ID of this control
   */
  _uid: -1,
  
  init: function () {
    this._target.type = "checkbox";
    this._target.id = "checkbox" + (++this._uid);
    
    var label = this.label;
    if (label)
    {
      if (typeof label.valueOf() == "string")
      {
        this.label = new jsx.dom.widgets.Label(null, this._parent, {
          innerHTML: [label]
        });
      }
    }
  },
  
  /**
   * @override
   */
  render: function () {
    jsx.dom.widgets.CheckBox._super.prototype.render.call(this);
    
    var label = this.label;
    if (label)
    {
      label._target.htmlFor = this._target.id;
      label.render();
    }
  },
  
  /**
   * @override
   */
  unrender: function () {
    jsx.dom.widgets.CheckBox._super.prototype.unrender.call(this);
    
    if (this.label)
    {
      this.label.unrender();
    }
  },
  
  /**
   * @override
   */
  show: function () {
    jsx.dom.widgets.CheckBox._super.protoype.show.call(this);
    
    if (this.label)
    {
      this.label.show();
    }
  },
  
  /**
   * @override
   */
  hide: function () {
    jsx.dom.widgets.CheckBox._super.prototype.hide.call(this);
    
    if (this.label)
    {
      this.label.hide();
    }
  },
  
  /**
   * Appends the widget as a child element
   *
   * @override
   * @param parent
   * @return Array
   */
  appendTo: function (parent) {
    if (typeof parent == "undefined")
    {
      parent = this._parent;
    }
    
    var checkboxTarget = jsx.dom.widgets.CheckBox._super.prototype.appendTo.call(this, parent);
    
    var label = this.label;
    if (label)
    {
      if (this.labelPosition === jsx.dom.widgets.position.BEFORE)
      {
        var labelTarget = parent._target.insertBefore(label._target, this._target);
      }
      else
      {
        if (this.labelPosition === jsx.dom.widgets.position.AFTER)
        {
          labelTarget = parent._target.insertBefore(label._target, this._target.nextSibling);
        }
      }
      
      label.appendTo(parent);
    }

    return [checkboxTarget, labelTarget];
  },

  /**
   * Removes the widget from the document
   * 
   * @override
   */
  remove: function () {
    var checkboxTarget = jsx.dom.widgets.CheckBox._super.prototype.remove.call(this);
    var labelTarget = this.label.remove();
    return [checkboxTarget, labelTarget];
  }
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
jsx.dom.widgets.Input =
  function jsx_dom_widgets_Input (oTarget, oParent, oProperties) {
    jsx_dom_widgets_Input._super.apply(this, arguments);

    var me = this;
    jsx.dom.addEventListener(this._target, "keypress", jsx.dom.createEventListener(
      function (e) {
        var charCode =
          (typeof e.charCode != "undefined")
            ? e.charCode
            : (typeof e.keyCode != "undefined" ? e.keyCode : charCode);
  
        if (! (charCode < 32
               || me.allowedChars.test(String.fromCharCode(charCode))
            && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey))
        {
          return e.preventDefault();
        }
      }
    ));
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

  update: (function () {
    var update = jsx.dom.widgets.Widget.prototype.update;

    return function () {
      update.call(this);

      if (typeof this.value != "undefined")
      {
        this._target.value = this.value;
      }
      
      if (typeof this.tabIndex != "undefined")
      {
        this._target.tabIndex = this.tabIndex;
      }
      
      return this;
    };
  }())
});

jsx.dom.widgets.Button =
  function jsx_dom_widgets_Button (oTarget, oParent, oProperties) {
    jsx_dom_widgets_Button._super.apply(this, arguments);
  };

jsx.dom.widgets.Button.extend(jsx.dom.widgets.Container, {
  /**
   * @memberOf jsx.dom.widgets.Button#prototype
   */
  elementType: "button",

  init: function () {
    var me = this;

    jsx.tryThis(
      function ()  {
        me._target.type = "button";
      },

      function () {
        /* IE 7 and other borken UAs that don't support inline-block properly */
        jsx.throwThis("jsx.dom.widgets.InitError", "jsx.dom.widgets.Button",
          jsx.dom.widgets.Button.prototype.init);
      }
    );
  },
});

/**
 * A <code>NumberInput</code> widget restricts the characters to be
 * typed into it to decimal digits and the decimal point (`.') by default.
 *
 * @param oTarget : Element
 *   Reference to the DOM object that represents the element that
 *   provides the client area for the widget. Pass a false-value
 *   to create a new element.
 * @param oParent : Element
 *   Reference to the DOM object that represents the parent element
 *   for this widget. Pass <code>null</code> so that the widget will
 *   not be automatically attached to the document tree. You can call
 *   its {@link #appendTo()} method later to attach it.
 * @param oProperties : Object
 * @see jsx.dom.widgets#Input
 */
jsx.dom.widgets.NumberInput =
  function jsx_dom_widgets_NumberInput (oTarget, oParent, oProperties) {
    jsx_dom_widgets_NumberInput._super.apply(this, arguments);
  
    var me = this;
  
    var target = this._target;
    jsx.dom.addEventListener(target, "blur", function () {
      me.update();
    });
  
    jsx.dom.addEventListener(target, "focus", function () {
      if (me.leadingZero)
      {
        this.value = parseInt(this.value, 10);
      }
    });
  
    if (typeof this.oninput == "function")
    {
      jsx.dom.addEventListener(target, "input", this.oninput);
    }
  };

jsx.dom.widgets.NumberInput.extend(jsx.dom.widgets.Input, {
  /**
   * @memberOf jsx.dom.widgets.NumberInput#prototype
   * @type RegExp
   */
  allowedChars: /[\d.]/,

  leadingZero: false,

  /**
   * @type Number
   */
  minValue: -Infinity,

  /**
   * @type Number
   */
  maxValue: Infinity,

  init: function () {
    var target = this._target;

    if (target.type != "number")
    {
      jsx.tryThis(function () { target.type = "number"; });
    }

    if (target.type == "number")
    {
      /* HTML5 support */
      if (this.minValue != -Infinity)
      {
        target.min = this.minValue;
    }

      if (this.maxValue != Infinity)
      {
        target.max = this.maxValue;
      }
    }
  },

  /*
   * (non JSdoc)
   *
   * @see Widget.prototype#update
   */
  update: (function () {
    var update = jsx.dom.widgets.Input.prototype.update;

    return function () {
      update.call(this);

      var target = this._target;

      var v = parseFloat(target.value);

      if (isNaN(v))
      {
        v = 0;
      }

      if (this.minValue != -Infinity && v < this.minValue)
      {
        v = this.minValue;
      }
      else if (this.maxValue != Infinity && v > this.maxValue)
      {
        v = this.maxValue;
      }

      if (this.leadingZero && this.maxValue != Infinity)
      {
        v = leadingZero(v, String(this.maxValue).length);
      }

      v = String(v);

      if (v != target.value)
      {
        target.value = v;
      }
      
      return this;
    };
  }()),

  /**
   * @protected
   * @param valueType
   * @param value
   * @returns
   */
  _setBoundary: function (valueType, value) {
    value = parseFloat(value);

    if (!isNaN(value))
    {
      if (this._target.type == "number")
      {
        /* HTML5 support */
        this._target[valueType] = String(value);
      }

      this[valueType + "Value"] = value;
    }
    else
    {
      jsx.throwThis(null, "Invalid boundary: " + valueType + "Value");
    }

    return this[valueType + "Value"];
  },

  setMinValue: function (value) {
    return this._setBoundary("min", value);
  },

  setMaxValue: function (value) {
    return this._setBoundary("max", value);
  }

});

/**
 * Input widget that allows the user to increase or decrease its
 * current value
 *
 * <p>A <code>SpinnerInput</code> is a
 * {@link jsx.dom.widgets#NumberInput NumberInput}
 * that allows the user to increase or decrease its current value
 * with the arrow keys or the attached arrow buttons ("to spin" it).
 * It is possible to define a minimum or maximum value.</p>
 *
 * <p>If buttons are generated by JSX, they are accessible as
 * {@link jsx.dom.widgets#Button Button} instances via the
 * <code>buttonUp</code> and <code>buttonDown</code> properties
 * of the widget, respectively.</p>
 *
 * @param oTarget : Element
 *   Reference to the DOM object that represents the element that
 *   provides the client area for the widget. Pass a false-value
 *   to create a new element.
 * @param oParent : Element
 *   Reference to the DOM object that represents the parent element
 *   for this widget. Pass <code>null</code> so that the widget
 *   will not be automatically attached to the document tree.
 *   You can call its {@link #appendTo()} method later to attach it.
 * @param oProperties : Object
 * @see jsx.dom.widgets#NumberInput
 */
jsx.dom.widgets.SpinnerInput =
  function jsx_dom_widgets_SpinnerInput (oTarget, oParent, oProperties) {
    var me = this;
  
    jsx_dom_widgets_SpinnerInput._super.apply(this, arguments);
  
    var target = this._target;
    if (target.type != "number")
    {
      /* If no HTML5 support, try adding arrow controls */
      jsx.tryThis(
        function () {
          me.buttonUp = new jsx.dom.widgets.Button(null, null, {
            text: "\u25B4",
            tabIndex: target.tabIndex,
            style: {
              display: "block",
              margin: "0",
              width: "1em",
              minWidth: "0",
              padding: "0",
              lineHeight: "1em"
            },
            onclick: function () {
              me.inc();
  
              if (typeof me._target.onchange == "function")
              {
                me._target.onchange();
              }
            }
          });
  
          me.buttonDown = new jsx.dom.widgets.Button(null, null, {
            text: "\u25BE",
            tabIndex: target.tabIndex,
            style: {
              display: "block",
              margin: "0",
              width: "1em",
              minWidth: "0",
              padding: "0",
              lineHeight: "1em"
            },
            onclick: function () {
              me.dec();
  
              if (typeof me._target.onchange == "function")
              {
                me._target.onchange();
              }
            }
          });
  
          var buttonContainer = document.createElement("div");
          buttonContainer.style.display = "inline-block";
          buttonContainer.style.lineHeight = "1em";
          buttonContainer.style.verticalAlign = "middle";
  
          buttonContainer.appendChild(me.buttonUp._target);
          buttonContainer.appendChild(me.buttonDown._target);
          target.parentNode.insertBefore(buttonContainer, target.nextSibling);
        },
  
        function (e) {
          if (!e || e.name !== "jsx.dom.widgets.InitError")
          {
            /* Rethrow unhandled exception */
            jsx.rethrowThis(e);
          }
        }
      );
  
      /* Add event listeners */
      jsx.dom.addEventListener(target, "keydown", jsx.dom.createEventListener(
        function (e) {
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
  
          if (typeof e.keyIdentifier != "undefined")
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
  
          me.update();
        }
      ));
  
      jsx.dom.addEventListener(target, "keyup", function () { me.update(); });
    }
  };

jsx.dom.widgets.SpinnerInput.extend(jsx.dom.widgets.NumberInput, {
  /**
   * Increases the value of the input by 1
   *
   * @memberOf jsx.dom.widgets.SpinnerInput#prototype
   */
  inc: function () {
    var v, t = this._target;

    if ( (this.maxValue == Infinity || t.value < this.maxValue)
      && !isNaN(v = parseInt(t.value, 10) + 1)
      && (t.maxLength < 1 || v.toString().length <= t.maxLength))
    {
      t.value = v;
    }
  },

  /**
   * Decreases the value of the input by 1
   */
  dec: function () {
    var v, t = this._target;

    if ( (this.minValue == -Infinity || t.value > this.minValue)
      && !isNaN(v = parseInt(t.value, 10) - 1)
      && (t.maxLength < 1 || v.toString().length <= t.maxLength))
    {
      t.value = v;
    }
  },

  /*
   * (non JSdoc)
   *
   * @see Widget.prototype#update
   */
  update: (function () {
    var update = jsx.dom.widgets.NumberInput.prototype.update;
    
    return function () {
      update.call(this);

      var target = this._target;
      if (typeof target.onchange == "function")
      {
        target.onchange();
      }
      
      return this;
    };
  }())
});

jsx.dom.widgets.ListItem =
  function jsx_dom_widgets_ListItem () {
    jsx_dom_widgets_ListItem._super.apply(this, arguments);
  };

jsx.dom.widgets.ListItem.extend(jsx.dom.widgets.Container, {
  elementType: "li"
});

jsx.dom.widgets.List =
  function jsx_dom_widgets_List () {
    jsx_dom_widgets_List._super.apply(this, arguments);
  };

jsx.dom.widgets.List.extend(jsx.dom.widgets.Widget, {
  /**
   * @memberOf jsx.dom.widgets.List#prototype
   * @param listItem : jsx.dom.widgets.ListItem
   */
  addItem: function (listItem) {
    if (!this.items)
    {
      this.items = [];
    }
    
    this.items.push(listItem);
  },

  /**
   * @param listItem : jsx.dom.widgets.ListItem
   */
  removeItem: function (listItem) {
    var items = this.items;
    if (items)
    {
      var i = items.indexOf(listItem);
      if (i > -1)
      {
        items.splice(i, 1);
      }
    }
  },
  
  init: function () {
    var items = this.items;
    if (items && items.length === 0)
    {
      var listItems = jsx.dom.getElemByTagName("li", -1, this._target);
      var ListItem = jsx.dom.widgets.ListItem;
      for (var i = 0, len = listItems.length; i < len; ++i)
      {
        this.addItem(new ListItem(listItems[i], this));
      }
    }
  },
  
  update: (function () {
    var jsx_dom = jsx.dom;
    var _gEBTN = jsx_dom.getElemByTagName;
    var update = jsx_dom.widgets.Widget.prototype.update;
    
    return function () {
      update.call(this);
      
      var items = this.items;
      var i;
      var len = items && items.length || 0;
      
      for (i = len; i--;)
      {
        items[i].update();
      }
      
      var target = this._target;
      var listItems = _gEBTN("li", -1, target);
      var len2 = listItems.length;
      for (i = 0; i < len && i < len2; ++i)
      {
        var listItem = listItems[i];
        var item = items[i];
        if (listItem != item._target)
        {
          target.replaceChild(item._target, listItem);
        }
      }
      
      for (var j = listItems.length; j-- > i;)
      {
        target.removeChild(listItems[j]);
      }
      
      for (++j; j < len; ++j)
      {
        items[j].appendTo(target);
      }
      
      return this;
    };
  }())
});

jsx.dom.widgets.OrderedList =
  function jsx_dom_widgets_OrderedList () {
    jsx_dom_widgets_OrderedList._super.apply(this, arguments);
  };

jsx.dom.widgets.OrderedList.extend(jsx.dom.widgets.List, {
  /**
   * @memberOf jsx.dom.widgets.OrderedList#prototype
   */
  elementType: "ol",
});

jsx.dom.widgets.UnorderedList =
  function jsx_dom_widgets_UnorderedList () {
    jsx_dom_widgets_UnorderedList._super.apply(this, arguments);
  };

jsx.dom.widgets.UnorderedList.extend(jsx.dom.widgets.List, {
  /**
   * @memberOf jsx.dom.widgets.UnorderedList#prototype
   */
  elementType: "ul",
});

jsx.dom.widgets.Tree =
  function jsx_dom_widgets_Tree (oTarget, oParent, oProperties) {
    jsx_dom_widgets_Tree._super.apply(this, arguments);
  };

jsx.dom.widgets.Tree.extend(jsx.dom.widgets.Widget, {
  /**
   * @memberOf jsx.dom.widgets.Tree#prototype
   */
  _list: null,
  
  init: function () {
    if (!this._list)
    {
      this._list = new jsx.dom.widget.UnorderedList();
      this._list.addItem(new jsx.dom.widget.ListItem());
    }
  },
  
  update: (function () {
    var update = jsx.dom.widgets.Tree._super.prototype.update;
    
    return function () {
      update.call(this);
      
      return this;
    };
  })
});

/**
 * A <code>Table</code> widget provides a default <code>TABLE</code>
 * element object with additional features, such as filtering rows.
 *
 */
jsx.dom.widgets.Table =
  function jsx_dom_widgets_Table (oTarget, oParent, oProperties) {
    jsx_dom_widgets_Table._super.apply(this, arguments);
  };

jsx.dom.widgets.Table.extend(jsx.dom.widgets.Widget, {
  filterColumns: [],

  /**
   * Filters the rows of the table's first tbody, searching a filter
   * string in the filter columns.
   *
   * @function
   * @memberOf jsx.dom.widgets.Table#prototype
   */
  applyFilter: (function () {
    var _getContent = jsx.dom.getContent;

    /**
     * @param filterString : String
     *   The string by which rows should be filtered
     * @return boolean
     *   <code>true</code> if the filter could be applied,
     *   <code>false</code> otherwise.  Note that <code>true</code> means only
     *   that the filter could be applied, not that any rows are filtered out.
     */
    return function (filterString) {
      /* Imports */
      var _escape = jsx.regexp.escape;

      var filterColumns = this.filterColumns;

      if (!filterColumns || filterColumns.length < 1)
      {
        return false;
      }

      var expressions = [];

      for (var rows = this._target.tBodies[0].rows, i = rows.length; i--;)
      {
        var row = rows[i];
        row.style.display = "none";

        for (var j = 0, len = filterColumns.length; j < len; ++j)
        {
          var column = filterColumns[j];

          if (!expressions[j])
          {
            var srx = (column.prefix ? "^" : "") + filterString;
            jsx.tryThis(
              function () {
                expressions[j] = column.ignoreCase ? new RegExp(srx, "i") : new RegExp(srx);
              },
              function (e) {
                if (e.name == "SyntaxError")
                {
                  srx = (column.prefix ? "^" : "") + _escape(filterString);
                  expressions[j] = column.ignoreCase ? new RegExp(srx, "i") : new RegExp(srx);
                }
                else
                {
                  jsx.rethrowThis(e);
                }
              });
          }

          if (expressions[j].test(_getContent(row.cells[column.index])))
          {
            row.style.display = "";
            break;
          }
        }
      }

      return true;
    };
  }())
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
jsx.dom.widgets.Timer =
  function jsx_dom_widgets_Timer (oTarget, oParent, oProperties) {
    jsx_dom_widgets_Timer._super.apply(this, arguments);
  };

jsx.dom.widgets.Timer.extend(jsx.dom.widgets.Widget);

jsx.dom.widgets.InitError =
  function jsx_dom_widgets_InitError (widgetType) {
    jsx_dom_widgets_InitError._super.call(this, widgetType);
  };

jsx.dom.widgets.InitError.extend(jsx.Error, {
  name: "jsx.dom.widgets.InitError"
});

function handleKeypress(e)
{
  console.log("e = ", e);
  if (e)
  {
    var t = e._target || e.srcElement;
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