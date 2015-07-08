/**
 * @fileOverview From-scratch tree widget implementation, to be backported to widgets.js
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

if (typeof jsx.dom.widgets == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom.widgets = {};
}

//jsx.dom.widgets.TreeWidget = (
//  function jsx_dom_widgets_TreeWidget (target, parent, options) {
//    this.init(target, parent, options);
//  }
//).extend(jsx.dom.widgets.Widget, {
//  /**
//   * @memberOf jsx.dom.widgets.TreeWidget.prototype
//   * @param {HTMLOLElement|HTMLULElement} target
//   */
//  init: function (target, parent, options) {
//    this.target = target;
//    if (parent)
//    {
//      this.parent = parent;
//    }
//
//    if (options && options.data)
//    {
//      this.data = options.data;
//    }
//
//    this.dirty = true;
//  },
//
//  update: function () {
//    if (this.data)
//    {
//      for (var i = 0, keys = jsx.object.getKeys(this.data), len = keys.length;
//           i < len; ++i)
//      {
//        /* update nodes */
//      }
//    }
//    else
//    {
//      /* clear nodes */
//    }
//
//    this.dirty = false;
//  },
//
//  /**
//   * @return {Boolean}
//   */
//  needsUpdate: function () {
//    return this.dirty;
//  }
//})



function collapseAll ()
{
  for (var i = 0, f = document.forms[0], es = f.elements, len = es.length;
       i < len; ++i)
  {
    es[i].checked = false;
  }
}
