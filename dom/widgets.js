"use strict";
/**
 * <title>PointedEars' DOM Library: Widgets</title>
 *
 * @version $Id$
 * @requires dom.js, events.js
 * @section Copyright & Disclaimer
 *
 * @author (C) 2010-2013 Thomas Lahn <js@PointedEars.de>
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
   * (must be provided by object.js, here for JSDT only)
   */
  var jsx = {};
}

if (typeof jsx.dom == "undefined")
{
  /**
   * @namespace
   * (must be provided by dom.js, here for JSDT only)
   */
  jsx.dom = {};
}

/**
 * @type jsx.dom.widgets
 * @memberOf __jsx.dom.widgets
 * @namespace
 */
jsx.dom.widgets = (/** @constructor */ function () {
  /* Imports */
  var _jsx_dom = jsx.dom;
  var _gEBTN = _jsx_dom.getElemByTagName;

  /* Constant-like private variables */
  var _AFTER = 1;

  /* Other private variables */
  /**
   * Constructor of the abstract prototype for widgets. It provides
   * shallow copying of the passed properties, stores the reference to the
   * manipulated DOM object, and applies the given properties to the
   * display of that object. Widgets should inherit from this prototype,
   * and this constructor should be called only from the constructors of
   * prototypes of specialized widgets.
   *
   * @function
   */
  var _Widget = (
    /**
     * @constructor
     * @param {Element} oTarget
     *   Reference to the DOM object that represents the
     *   element that provides the client area for the widget. Pass a
     *   false-value to create a new element.
     * @param {jsx.dom.widgets.Container} oParent
     *   Reference to the <code>Container</code> that should contain
     *   this widget. Pass <code>null</code> so that the widget will
     *   not be automatically appended.  You can call its
     *   {@link #appendTo()} method later to append it.
     * @param {Object} oProperties
     */
    function (oTarget, oParent, oProperties) {
      this._target = oTarget || document.createElement(this.elementType);

      if (oParent && !(oParent instanceof _Container))
      {
        return jsx.throwThis(jsx.InvalidArgumentError,
          [null, jsx.object.getFunctionName(oParent.constructor), "jsx.dom.widgets.Container"]);
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
    }
  ).extend(null, (function () {
    var _getKeys = jsx.object.getKeys;
    var _css = _jsx_dom.css;

    return {
      /**
       * Widgets are `div' elements by default. Inheriting classes should
       * override this when appropriate (e. g., a menu should be a `ul').
       *
       * @memberOf jsx.dom.widgets.Widget.prototype
       */
      elementType: "div",

      /**
       * @type Element
       */
      _target: null,

      /**
       * Defines actions to be performed when the widget is initialized.
       * Can be overridden by inheriting types.  If it is overridden,
       * it must also be called.
       */
      init: function () {
        if (this._parent)
        {
          /*
           * Automagically append widget to parent
           * (without necessarily rendering it)
           */
          this.appendTo();
        }
      },

      /**
       * Gets a property of this widget's target object.
       *
       * @param {String} name
       * @return {any}
       */
      getTargetProperty: function (name) {
        return this._target[name];
      },

      /**
       * Sets a property of this widget's target object.
       *
       * Use {@link #setStyleProperty()}, {@link #resetStyleProperty()}
       * or {@link #setStyle()} for setting style properties instead.
       *
       * @param {String} name
       * @param value
       * @return {jsx.dom.widgets.Widget}
       */
      setTargetProperty: function (name, value) {
        this._target[name] = value;
        return this;
      },

      /**
       * Sets several property of this widget's target object.
       *
       * Use {@link #setStyleProperty()}, {@link #resetStyleProperty()}
       * or {@link #setStyle()} for setting style properties instead.
       *
       * @param {String} name
       * @param value
       * @return {jsx.dom.widgets.Widget}
       */
      setTargetProperties: function (properties) {
        var keys = _getKeys(properties);
        for (var i = 0, len = keys.length; i < len; ++i)
        {
          var propertyName = keys[i];
          this.setTargetProperty(propertyName, properties[propertyName]);
        }

        return this;
      },

      /**
       * Sets a style property of this widget
       *
       * @param {String} name
       * @param value
       * @return {boolean}
       * @see jsx.dom.css.setStyleProperty()
       */
      setStyleProperty: function (name, value) {
        return _css.setStyleProperty(this._target, name, value);
      },

      /**
       * Resets a style property of this widget to its inherited value
       *
       * @param {String} name
       */
      resetStyleProperty: function (name) {
        _css.resetStyleProperty(this._target, name);
      },

      /**
       * Sets several style properties of this widget at once
       *
       * @param {Object} style
       */
      setStyle: function (style) {
        var result = true;

        for (var propertyName in style)
        {
          var resultPart = this.setStyleProperty(propertyName, style[propertyName]);
          if (result && !resultPart)
          {
            result = false;
          }
        }

        return result;
      },

      /**
       * Defines actions to be performed when the widget's canvas should be
       * updated to reflect its current status; should be overridden
       * and called by inheriting types.
       */
      update: function () {
        this.setStyle(this.style);

        for (var i = 0, len = this.children.length; i < len; ++i)
        {
          this.children[i].update();
        }

        return this;
      },

      /**
       * Causes the widget to be rendered.
       */
      render: function (parent) {
        this.update();
        this._target.style.display = "";
        return this;
      },

      /**
       * Causes the widget not to be rendered, without removing it
       * from the document tree.
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
       * @param {jsx.dom.widgets.Container} parent (optional)
       *   The widget that this widget should be appended to.
       *   The default is the current parent widget.
       * @see jsx.dom.widgets.Container.prototype.appendChild()
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
       *
       * @see jsx.dom.widgets.Container.prototype.removeChild()
       */
      remove: function () {
        for (var i = 0, len = this.children.length; i < len; ++i)
        {
          this.children[i].remove();
        }

        /* TODO: Clean-up event listener */

        return this._parent.removeChild(this);
      },

      _getSetterFor: function (propertyName) {
        var setterName =
          "set" + propertyName.charAt(0).toUpperCase() + propertyName.substring(1);
        var setter = this[setterName];
        return (typeof setter == "function") ? setter : null;
      }
    };
  }()));

  /**
   * @function
   */
  var _Container = (
    /**
     * <code>Container</code>s are collapsible widgets
     * that may have content, such as other widgets and text.
     *
     * @constructor
     */
    function jsx_dom_widgets_Container (oTarget, oParent, oProperties) {
      jsx_dom_widgets_Container._super.apply(this, arguments);
    }
  ).extend(_Widget, {
    /**
     * Defines whether the widget should be collapsed
     *
     * @private
     */
    _collapsed: false,

    innerHTML: null,
    _defaultInnerHTML: null,
    text: null,

    init: function () {
      _Container._super.prototype.init.call(this);

      this._defaultContent = this.innerHTML || this._target.innerHTML || "";
    },

    /**
     * (non-JSdoc)
     * @see jsx.dom.widget.Widget.prototype.update
     */
    update: (function () {
      var _isArray = jsx.object.isArray;
      var _createNodesFromObj = _jsx_dom.createNodesFromObj;
      var _setTextContent = _jsx_dom.setTextContent;

      return function () {
        _Container._super.prototype.update.call(this);

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
            _jsx_dom.removeChildren(target, target.childNodes);

            if (_isArray(html))
            {
              html = _createNodesFromObj(html);
            }

            if (_isArray(html))
            {
              _jsx_dom.appendChildren(target, html);
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

    /**
     * Returns the collapsed state of the <code>Container</code>
     *
     * @return {boolean}
     *   <code>true</code> if the widget is collapsed,
     *   <code>false</code> otherwise.
     */
    isCollapsed: function () {
      return !!this._collapsed;
    },

    /**
     * Sets the collapsed state of the <code>Container</code>
     *
     * @param {boolean} value
     * @return {jsx.dom.widgets.Container}
     */
    setCollapsed: function (value) {
      var oldValue = this.isCollapsed();
      var newValue = this._collapsed = !!value;

      if (newValue != oldValue)
      {
        if (newValue && typeof this.oncollapse == "function")
        {
          this.oncollapse();
        }
        else if (!newValue && typeof this.onexpand == "function")
        {
          this.onexpand();
        }

        if (typeof this.oncollapsedchange == "function")
        {
          this.oncollapsedchange(newValue);
        }
      }

      return this;
    },

    /**
     * Collapses the <code>Container</code>
     */
    collapse: function () {
      this.setCollapsed(true);
    },

    /**
     * Expands the <code>Container</code>
     */
    expand: function () {
      this.setCollapsed(false);
    },

    /**
     * @memberOf jsx.dom.widgets.Container.prototype
     * @return {string}
     */
    getText: function () {
      this.text = this._target.textContent;
      return this.text;
    },

    /**
     * @param {string} text
     * @return {jsx.dom.widgets.Container}
     */
    setText: function (text) {
      this.text = text;
      this.innerHTML = null;
      return this;
    },

    /**
     * @param {string} html
     * @return {jsx.dom.widgets.Container}
     */
    setInnerHTML: function (html) {
      this.text = "";
      this.innerHTML = html;
      return this;
    },

    resetContent: function () {
      this.setInnerHTML(this._defaultContent);
    },

    setChildren: function (children) {
      for (var i = 0, len = children.length; i < len; ++i)
      {
        children[i].appendTo(this);
      }
    },

    /**
     * @param {jsx.dom.widgets.Widget} child
     * @return {jsx.dom.widgets.Widget}
     *   The appended widget.
     */
    appendChild: function (child) {
      var result = null;
      var childTarget = child._target;
      var target = this._target;
      var success = true;

      /*
       * If the child widget's element is not in the document tree,
       * or if it is not already a child of this widget's element …
       */
      if (childTarget.parentNode != target)
      {
        /*
         * … append it as child element
         */
        target.appendChild(child._target);
        success = (target.lastChild == childTarget);
      }

      if (success)
      {
        /*
         * If we already have the widget as a child,
         * move it to the end of the list
         */
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
    }
  });

  var _Section = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_Section (oTarget, oParent, oProperties) {
      _Section._super.apply(this, arguments);
    }
  ).extend(_Container, {
    /**
     * @memberOf jsx.dom.widgets.Section.prototype
     */
    elementType: "section"
  });

  var _Anchor = (
    function jsx_dom_widgets_Anchor () {
      jsx_dom_widgets_Anchor._super.apply(this, arguments);
    }
  ).extend(_Container, {
    elementType: "a",
  });

  var _Label = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_Label (oTarget, oParent, oProperties) {
      jsx_dom_widgets_Label._super.apply(this, arguments);
    }
  ).extend(_Container, {
    /**
     * @memberOf jsx.dom.widgets.Label.prototype
     */
    elementType: "label"
  });

  var _TextArea = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_TextArea (oTarget, oParent, oProperties) {
      jsx_dom_widgets_TextArea._super.apply(this, arguments);
    }
  ).extend(_Container, {
    /**
     * @memberOf jsx.dom.widgets.TextArea.prototype
     */
    elementType: "textarea"
  });

  /**
   * @function
   */
  var _Input = (
    /**
     * An <code>Input</code> widget enhances the default
     * <code>INPUT</code> element text box with a restriction to the
     * characters that may be typed into it.
     *
     * @constructor
     * @param {Element} oTarget
     *   Reference to the DOM object that represents the
     *   element that provides the client area for the widget. Pass a
     *   false-value to create a new element.
     * @param {Element} oParent
     *   Reference to the DOM object that represents the parent
     *   element for this widget. Pass <code>null</code> so that the
     *   widget will not be automatically attached to the document
     *   tree. You can call its {@link #appendTo()} method later to
     *   attach it.
     * @param {Object} oProperties
     * @see Widget
     */
    function jsx_dom_widgets_Input (oTarget, oParent, oProperties) {
      jsx_dom_widgets_Input._super.apply(this, arguments);

      var me = this;
      _jsx_dom.addEventListener(this._target, "keypress", _jsx_dom.createEventListener(
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
    }
  ).extend(_Widget, {
    /**
     * Regular Expression specifying the format allowed to be input into
     * this widget. CAUTION: Too restrictive an expression could render
     * the widget unusable.
     *
     * @memberOf jsx.dom.widgets.Input.prototype
     * @type RegExp
     */
    allowedChars: /./,

    elementType: "input",

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.update()
     */
    update: function () {
      _Input._super.prototype.update.call(this);

      if (typeof this.value != "undefined")
      {
        this._target.value = this.value;
      }

      if (typeof this.tabIndex != "undefined")
      {
        this._target.tabIndex = this.tabIndex;
      }

      return this;
    }
  });

  /**
   * @function
   */
  var _NumberInput = (
    /**
     * A <code>NumberInput</code> widget restricts the characters to be
     * typed into it to decimal digits and the decimal point (".") by default.
     *
     * @constructor
     * @param {Element} oTarget
     *   Reference to the DOM object that represents the element that
     *   provides the client area for the widget. Pass a false-value
     *   to create a new element.
     * @param {Element} oParent
     *   Reference to the DOM object that represents the parent element
     *   for this widget. Pass <code>null</code> so that the widget will
     *   not be automatically attached to the document tree. You can call
     *   its {@link #appendTo()} method later to attach it.
     * @param {Object} oProperties
     * @see jsx.dom.widgets#Input
     */
    function jsx_dom_widgets_NumberInput (oTarget, oParent, oProperties) {
      jsx_dom_widgets_NumberInput._super.apply(this, arguments);

      var me = this;

      var target = this._target;
      _jsx_dom.addEventListener(target, "blur", function () {
        me.update();
      });

      _jsx_dom.addEventListener(target, "focus", function () {
        if (me.leadingZero)
        {
          this.value = parseInt(this.value, 10);
        }
      });

      if (typeof this.oninput == "function")
      {
        _jsx_dom.addEventListener(target, "input", this.oninput);
      }
    }
  ).extend(_Input, {
    /**
     * @memberOf jsx.dom.widgets.NumberInput.prototype
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

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.init()
     */
    init: function () {
      _NumberInput._super.prototype.init.call(this);

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

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Input.prototype.update()
     */
    update: function () {
      _NumberInput._super.prototype.update.call(this);

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
    },

    /**
     * @protected
     * @param valueType
     * @param value
     * @return {Number}
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

  var _ListItem = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_ListItem () {
      jsx_dom_widgets_ListItem._super.apply(this, arguments);
    }
  ).extend(_Container, {
    /**
     * @memberOf jsx.dom.widgets.ListItem.prototype
     */
    elementType: "li"
  });

  /**
   * @function
   */
  var _List = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_List () {
      jsx_dom_widgets_List._super.apply(this, arguments);
    }
  ).extend(_Container, {
    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.init()
     */
    init: function () {
      _List._super.prototype.init.call(this);

      if (!this.items)
      {
        var target = this._target;
        if (target)
        {
          var childNodes = target.children || target.childNodes;
          for (var i = 0, len = childNodes.length; i < len; ++i)
          {
            var node = childNodes[i];
            if (node.nodeType == 1)
            {
              var item = new _ListItem(node);
              item.appendTo(this);
              this.addItem(item);
            }
          }
        }
      }
    },

    /**
     * @memberOf jsx.dom.widgets.List.prototype
     * @param {any} listItem
     */
    addItem: function (listItem) {
      if (!this.items)
      {
        this.items = [];
      }

      this.items.push(listItem);
    },

    /**
     * @param {any} listItem
     */
    removeItem: function (item) {
      var items = this.items;
      if (items)
      {
        var i = items.indexOf(item);
        if (i > -1)
        {
          items.splice(i, 1);
        }
      }
    },

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.List.prototype.update()
     */
    update: function () {
      _List._super.prototype.update.call(this);

      var items = this._items;
      var i;
      var len = items && items.length || 0;

      for (i = len; i--;)
      {
        var item = items[i];
        if (item._target.tagName.toUpperCase() != "LI")
        {
          items[i] = new _ListItem(null, null, {
            children: [item]
          });
        }

        items[i].update();
      }

      var target = this._target;
      var listItems = _gEBTN("li", -1, target);
      var len2 = listItems.length;
      for (i = 0; i < len && i < len2; ++i)
      {
        var listItem = listItems[i];
        item = items[i];

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
        items[j].appendTo(this);
      }

      return this;
    }
  });

  var _OrderedList = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_OrderedList () {
      jsx_dom_widgets_OrderedList._super.apply(this, arguments);
    }
  ).extend(_List, {
    /**
     * @memberOf jsx.dom.widgets.OrderedList.prototype
     */
    elementType: "ol"
  });

  /**
   * @function
   */
  var _UnorderedList = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_UnorderedList () {
      jsx_dom_widgets_UnorderedList._super.apply(this, arguments);
    }
  ).extend(_List, {
    /**
     * @memberOf jsx.dom.widgets.UnorderedList.prototype
     */
    elementType: "ul"
  });

  var _Checkbox = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_Checkbox (oTarget, oParent, oProperties) {
      jsx_dom_widgets_Checkbox._super.apply(this, arguments);
    }
  ).extend(_Widget, {
    /**
     * @memberOf jsx.dom.widgets.Checkbox.prototype
     */
    elementType: "input",

    labelPosition: _AFTER,

    /**
     * Unique ID of this control
     */
    _uid: -1,

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.init()
     */
    init: function () {
      _Checkbox._super.prototype.init.call(this);

      this._target.type = "checkbox";
      this._target.id = "checkbox" + (++this._uid);

      var label = this.label;
      if (label)
      {
        if (typeof label.valueOf() == "string")
        {
          this.label = new _jsx_dom.widgets.Label(null, this._parent, {
            innerHTML: [label]
          });
        }
      }
    },

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.render()
     */
    render: function () {
      _Checkbox._super.prototype.render.call(this);

      var label = this.label;
      if (label)
      {
        label._target.htmlFor = this._target.id;
        label.render();
      }
    },

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.unrender()
     */
    unrender: function () {
      _Checkbox._super.prototype.unrender.call(this);

      if (this.label)
      {
        this.label.unrender();
      }
    },

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.show()
     */
    show: function () {
      _Checkbox._super.protoype.show.call(this);

      if (this.label)
      {
        this.label.show();
      }
    },

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.hide()
     */
    hide: function () {
      _Checkbox._super.prototype.hide.call(this);

      if (this.label)
      {
        this.label.hide();
      }
    },

    /**
     * Appends the widget as a child element
     *
     * @param parent
     * @return {Array[Widget]}
     *   An {@link Array} containing the Checkbox widget and its
     *   label widget, if specified.
     * @see jsx.dom.widgets.Widget.prototype.appendTo()
     */
    appendTo: function (parent) {
      _Checkbox._super.prototype.appendTo.call(this, parent);

      var label = this.label;
      if (label)
      {
        if (this.labelPosition === _jsx_dom.widgets.position.BEFORE)
        {
          parent._target.insertBefore(label._target, this._target);
        }
        else
        {
          if (this.labelPosition === _jsx_dom.widgets.position.AFTER)
          {
            parent._target.insertBefore(label._target, this._target.nextSibling);
          }
        }

        label.appendTo(parent);
      }

      return [this, label];
    },

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.remove()
     */
    remove: function () {
      var CheckboxTarget = _Checkbox._super.prototype.remove.call(this);
      var labelTarget = this.label.remove();
      return [CheckboxTarget, labelTarget];
    }
  });

  var _Button = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_Button (oTarget, oParent, oProperties) {
      jsx_dom_widgets_Button._super.apply(this, arguments);
    }
  ).extend(_Container, {
    /**
     * @memberOf jsx.dom.widgets.Button.prototype
     */
    elementType: "button",

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.init()
     */
    init: function jsx_dom_widgets_Button_prototype_init () {
      _Button._super.prototype.init.call(this);

      var me = this;

      jsx.tryThis(
        function ()  {
          me._target.type = "button";
        },

        function () {
          /* IE 7 and other borken UAs that don't support inline-block properly */
          jsx.throwThis("jsx.dom.widgets.InitError", "jsx.dom.widgets.Button",
            jsx_dom_widgets_Button_prototype_init);
        }
      );
    }
  });

  var _SpinnerInput = (
    /**
     * @constructor
     * @param {Element} oTarget
     *   Reference to the DOM object that represents the element that
     *   provides the client area for the widget. Pass a false-value
     *   to create a new element.
     * @param {Element} oParent
     *   Reference to the DOM object that represents the parent element
     *   for this widget. Pass <code>null</code> so that the widget
     *   will not be automatically attached to the document tree.
     *   You can call its {@link #appendTo()} method later to attach it.
     * @param {Object} oProperties
     */
    function jsx_dom_widgets_SpinnerInput (oTarget, oParent, oProperties) {
      var me = this;

      jsx_dom_widgets_SpinnerInput._super.apply(this, arguments);

      var target = this._target;
      if (target.type != "number")
      {
        /* If no HTML5 support, try adding arrow controls */
        jsx.tryThis(
          function () {
            me.buttonUp = new _jsx_dom.widgets.Button(null, null, {
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

            me.buttonDown = new _jsx_dom.widgets.Button(null, null, {
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
        _jsx_dom.addEventListener(target, "keydown", _jsx_dom.createEventListener(
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

        _jsx_dom.addEventListener(target, "keyup", function () { me.update(); });
      }
    }
  ).extend(_NumberInput, {
    /**
     * Increases the value of the input by 1
     *
     * @memberOf jsx.dom.widgets.SpinnerInput.prototype
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

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.NumberInput.prototype.update()
     */
    update: function () {
      _NumberInput.prototype.update.call(this);

      var target = this._target;
      if (typeof target.onchange == "function")
      {
        target.onchange();
      }

      return this;
    }
  });

  var _CheckboxList = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_CheckboxList () {
      jsx_dom_widgets_CheckboxList._super.apply(this, arguments);
    }
  ).extend(_UnorderedList, {
    update: function () {
      /* FIXME: Disabled update for now */
    },

    /**
     * Adds a checkbox to this list as child of a {@link ListItem}
     *
     * @memberOf jsx.dom.widgets.CheckboxList.prototype
     * @param {jsx.dom.widget.Checkbox} checkbox
     * @return {jsx.dom.widget.ListItem}
     *   The added list item
     */
    addItem: function (item) {
      if (!(item instanceof _Checkbox))
      {
        if (!(item instanceof _ListItem))
        {
          return jsx.throwThis(jsx.InvalidArgumentError,
            [null, jsx.object.getFunctionName(item.constructor),
             "jsx.dom.widgets.Checkbox or jsx.dom.widgets.ListItem"]);
        }

        /* Add the contained checkbox as item */
        var checkbox = _gEBTN("input", 0, item._target);
        if (!checkbox|| checkbox.type.toLowerCase() != "checkbox")
        {
          return jsx.throwThis(jsx.InvalidArgumentError,
            [null, jsx.object.getFunctionName(checkbox.constructor),
             "jsx.dom.widgets.ListItem containing a checkbox"]);
        }

        checkbox = new _Checkbox(checkbox);
      }
      else
      {
        checkbox = item;
      }

      _CheckboxList._super.prototype.addItem.call(this, checkbox);

      return item;
    }
  });

  var _Tree = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_Tree (oTarget, oParent, oProperties) {
      jsx_dom_widgets_Tree._super.apply(this, arguments);
    }
  ).extend(_Widget, {
    /**
     * @memberOf jsx.dom.widgets.Tree.prototype
     */
    _list: null,

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.init()
     */
    init: function () {
      _Tree._super.prototype.init.call(this);

      if (!this._list)
      {
        this._list = new _UnorderedList();
        this._list.addItem(new _ListItem());
      }
    },

    /**
     * (non-JSdoc)
     * @see jsx.dom.widgets.Widget.prototype.update()
     */
    update: (function () {
      var update = _Tree._super.prototype.update;

      return function () {
        update.call(this);

        return this;
      };
    })
  });

  var _Table = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_Table (oTarget, oParent, oProperties) {
      jsx_dom_widgets_Table._super.apply(this, arguments);
    }
  ).extend(_Widget, {
    filterColumns: [],

    /**
     * (non-JSdoc)
     * @memberOf jsx.dom.widgets.Table.prototype
     * @see jsx.dom.widgets.Widget.prototype.init()
     */
    init: function () {
      _jsx_dom.widgets.Table._super.prototype.init.call(this);

      if (this.addTitles)
      {
        var id2title = {};
        var rxSpace = /[ \t\n\x0C\r]+/;

        for (var rows = this._target.tBodies[0].rows, i = rows.length; i--;)
        {
          var row = rows[i];
          for (var cells = row.cells, j = cells.length; j--;)
          {
            var cell = cells[j];
            var headerIds = cell.headers;
            if (headerIds)
            {
              headerIds = headerIds.split(rxSpace);
              var titlePrefixes = [];

              for (var k = 0, len3 = headerIds.length; k < len3; ++k)
              {
                var headerId = headerIds[k];
                var titlePrefix = id2title[headerId];
                if (!titlePrefix)
                {
                  var header = document.getElementById(headerId);
                  if (header)
                  {
                    titlePrefix = id2title[headerId] =
                      header.abbr
                      || header.title
                      || header.textContent;
                  }
                }

                if (titlePrefix)
                {
                  titlePrefixes.push(titlePrefix);
                }
              }

              titlePrefixes = titlePrefixes.join("/");
              cell.title = (cell.title
                ? titlePrefixes + ": " + cell.title
                  : titlePrefixes);
            }
          }
        }
      }
    },

    /**
     * Filters the rows of the table's first tbody, searching a filter
     * string in the filter columns.
     *
     * @function
     */
    applyFilter: (function () {
      var _getContent = _jsx_dom.getContent;

      /**
       * @param {String} filterString
       *   The string by which rows should be filtered
       * @return {boolean}
       *   <code>true</code> if the filter could be applied,
       *   <code>false</code> otherwise.  Note that <code>true</code> means only
       *   that the filter could be applied, not that any rows are filtered out.
       */
      function _applyFilter (filterString)
      {
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
      }

      return _applyFilter;
    }())
  });

  /**
   * A <code>Timer</code> widget uses several <code>NumberInput</code>
   * widgets to implement a digital timer.
   */
  var _Timer=(
    /**
     * @constructor
     * @param {Element} oTarget
     *   Reference to the DOM object that represents the
     *   element that provides the client area for the widget. Pass a
     *   false-value to create a new element.
     * @param {Element} oParent
     *   Reference to the DOM object that represents the parent
     *   element for this widget. Pass <code>null</code> so that the
     *   widget will not be automatically attached to the document
     *   tree. You can call its {@link #appendTo()} method later to
     *   attach it.
     * @param {Object} oProperties
     * @base jsx.dom.Widget
     * @see NumberWidget
     */
    function jsx_dom_widgets_Timer (oTarget, oParent, oProperties) {
      jsx_dom_widgets_Timer._super.apply(this, arguments);
    }
  ).extend(_Container);

  var _InitError = (
    /**
     * @constructor
     */
    function jsx_dom_widgets_InitError (widgetType) {
      jsx_dom_widgets_InitError._super.call(this, widgetType);
    }
  ).extend(jsx.Error, {
    /**
     * @memberOf jsx.dom.widgets.InitError.prototype
     */
    name: "jsx.dom.widgets.InitError"
  });

  return {
    /**
     * @memberOf jsx.dom.widgets
     * @version
     */
    version: "$Id$",

    /**
     * @namespace
     */
    position: {
      BEFORE: -1,
      AFTER: _AFTER
    },

    Widget: _Widget,
    Container: _Container,

    /**
     * @function
     */
    Section: _Section,

    /**
     * @function
     */
    Anchor: _Anchor,

    /**
     * @function
     */
    Label: _Label,

    /**
     * @function
     */
    TextArea: _TextArea,

    /**
     * @function
     */
    Checkbox: _Checkbox,

    /**
     * @function
     */
    Input: _Input,

    /**
     * @function
     */
    Button: _Button,

    /**
     * @function
     */
    NumberInput: _NumberInput,

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
     * @see jsx.dom.widgets#NumberInput
     */
    SpinnerInput: _SpinnerInput,

    /**
     * @function
     */
    ListItem: _ListItem,

    /**
     * @function
     */
    List: _List,

    /**
     * @function
     */
    OrderedList: _OrderedList,

    /**
     * @function
     */
    UnorderedList: _UnorderedList,

    CheckboxList: _CheckboxList,

    /**
     * @type function
     */
    Tree: _Tree,

    /**
     * A <code>Table</code> widget provides a default <code>TABLE</code>
     * element object with additional features, such as filtering rows.
     */
    Table: _Table,

    /**
     * @function
     */
    Timer: _Timer,

    /**
     * @function
     */
    InitError: _InitError
  };
}());

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