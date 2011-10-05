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
      n: true,
      nw: true,
      w: true,
      s: true
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
