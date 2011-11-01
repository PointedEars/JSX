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
 * @param oTarget : Element
 *   Reference to the DOM object that provides the client area
 *   for the widget (optional)
 * @param oParent : Element
 *   Parent element (optional)
 * @param oProperties
 *   Properties to initialize this object with (optional)
 */
jsx.dom.Widget = function(oTarget, oParent, oProperties) {
  this.target = oTarget || document.createElement(this.elementType);
  this._parent = oParent || document.body;
  
  if (!this.target)
  {
    jsx.throwThis("TypeError", "No or invalid target");
  }
  
  for (var property in oProperties)
  {
    var propertyValue = oProperties[property];
    if (property == "style")
    {
      for (var styleProperty in propertyValue)
      {
        this.target.style[styleProperty] = propertyValue[styleProperty];
      }
    }
    else
    {
      this[property] = propertyValue;
    }
  }

  if (oProperties.resizable)
  {
    this.makeResizeable();
  }
  
  var me = this;
  document.body.addEventListener("unload", function() {
    /* break circular reference */
    me.target = null;
  }, false);
};

jsx.dom.Widget.prototype = {
  /**
   * @type Function
   */
  constructor: jsx.dom.Widget,
  
  /**
   * Widgets are `div' elements by default.  Inheriting classes should
   * override this when appropriate (e. g., a menu should be a `ul')
   */
  elementType: "div",

  /**
   * @type Element
   */
  target: null,

  /* Move to Resizeable type? */
  resizeable: false,
  resizeFlags: {
    n:  false,
    ne: false,
    e:  false,
    se: false,
    s:  false,
    sw: false,
    w:  false,
    nw: false
  },
  
  /*
   * The height/width in pixels of the edges of the widget
   * where the resize handles are located
   */
  resizeEdges: {
    top: 4,
    right: 4,
    bottom: 4,
    left: 4
  },
  
  /**
   * Causes the widget to be rendered, and attached to the document tree
   * if not already attached.
   * 
   * @param parent
   *   Reference to the object representing the parent element to which
   *   the widget should be appended as child.  The default is document.body.
   */
  render: function(parent) {
    this.appendTo(parent);
    this.target.style.display = "";
  },
  
  /**
   * Causes the widget not to be rendered, without removing it from
   * the document tree.
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
  
  remove: function() {
    return this.target.parentNode.removeChild(this.target);
  },
  
  /**
   * @protected
   * @param properties : Object
   * @param propertyName : String
   * @param defaultValue : mixed
   */
  _setStylePropertyOrDefault: function(properties, propertyName, defaultValue) {
    if (typeof properties.style == "undefined"
      || typeof properties.style[propertyName] == "undefined")
    {
      properties.style[propertyName] = defaultValue;
    }
  },
  
  /**
   * Makes this widget resizeable
   */
  makeResizeable: function() {
    var
      _jsx_dom = jsx.dom,
      _addEventListener = _jsx_dom.addEventListener,
      _createEventListener = _jsx_dom.createEventListener;
    
    var defaultCursor = this.target.style.cursor;
    
    var me = this;
    _addEventListener(this.target, "mousemove",
      _createEventListener(function(e) {
        var resizeEdges = me.resizeEdges;
        var inLeftMargin = (e.offsetX <= resizeEdges.left);
        var inTopMargin = (e.offsetY <= resizeEdges.top);
        if (inLeftMargin || inTopMargin)
        {
          var resizeFlags = me.resizeFlags;
          if (inLeftMargin && inTopMargin)
          {
            if (resizeFlags.nw)
            {
              this.style.cursor = "nw-resize";
            }
          }
          else if (inLeftMargin)
          {
            if (resizeFlags.w)
            {
              this.style.cursor = "w-resize";
            }
          }
          else
          {
            if (resizeFlags.n)
            {
              this.style.cursor = "n-resize";
            }
          }
        }
        else
        {
          this.style.cursor = defaultCursor;
        }
      }));

    _addEventListener(this.target, "mouseout",
      _createEventListener(function() {
        this.style.cursor = defaultCursor;
      }));
  }
};

/**
 * Creates a window
 * 
 * @param target : Element
 *   Target element (optional)
 * @param parent : Element
 *   Parent element (optional)
 * @param properties
 *   Properties to initialize this object with (optional)
 */
jsx.dom.Window = function(target, parent, properties) {
  this._setStylePropertyOrDefault(properties, "backgroundColor", this.defaultBackground);
  arguments.callee._super.call(this, target, parent, properties);
};

jsx.dom.Window.extend(jsx.dom.Widget);
jsx.dom.Window.prototype.defaultBackgroundColor = "ButtonFace";

/**
 * Creates a toolbox
 * 
 * @param target : Element
 *   Target element (optional)
 * @param parent : Element
 *   Parent element (optional)
 * @param properties
 *   Properties to initialize this object with (optional)
 */
jsx.dom.Toolbox = function(target, parent, properties) {
  this._setStylePropertyOrDefault(properties, "border", this.defaultBorder);
  
  arguments.callee._super.call(this, target, parent, properties);
};

jsx.dom.Toolbox.extend(jsx.dom.Window);
jsx.dom.Toolbox.prototype.defaultBorder = "2px outset";

/**
 * @namespace
 */
jsx.dom.liveedit = {
  version: "0.1"
};

/**
 * Creates and displays the LiveEdit editor
 * 
 * @param target : Element
 *   Target element for the editor (optional)
 * @param parent : Element
 *   Parent element for the editor (optional)
 */
jsx.dom.liveedit.LiveEdit = function(target, parent) {
  this._toolbox = new jsx.dom.Toolbox(target, parent, {
    style: {
      position: "fixed",
      top: "0",
      right: "0",
      width: "20%",
      bottom: "0",
      backgroundColor: "#ccc"
    },
    resizable: true,
    resizeFlags: {
      w: true
    }
  });
  
  this.showToolbox();
};

jsx.dom.liveedit.LiveEdit.extend();

/**
 * Shows the toolbox of this editor
 */
jsx.dom.liveedit.LiveEdit.prototype.showToolbox = function() {
  this._toolbox.render();
};
