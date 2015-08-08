"use strict";
/**
 * <title>Simple XML and HTML Processing with ECMAScript Edition 5</title>
 */

/**
 * @namespace
 */
jsx.dom.e5x = (/** @constructor */ function () {
  var _Attribute = (
    /**
     * @constructor
     */
    function jsx_dom_e5x_Attribute (attribute) {
      this.name = attribute.name;
      this.target = attribute;
    }
  ).extend(null, {
    /**
     * Returns the value of this attribute
     *
     * @memberOf jsx.dom.e5x.Attribute.prototype
     * @return {string}
     */
    toString: function () {
      return this.target.nodeValue;
    },

    toXML: function () {
      return this.target.name + '="'
        + this.toString()
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/"/g, "&#34;")
        + '"';
    }
  });

  var _Text = (
    /**
     * @constructor
     */
    function jsx_dom_e5x_Text (text) {
      this.target = text;
    }
  ).extend(null, {
    /**
     * @memberOf jsx.dom.e5x.Text.prototype
     * @return {string}
     */
    toString: function () {
      return this.target.data || this.target.nodeValue;
    },

    toXML: function () {
      return this.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;");
    }
  });

  return {
    Attribute: _Attribute,

    /**
     * @memberOf jsx.dom.e5x
     * @param {Element} element
     */
    Element: (
      function jsx_dom_e5x_Element (element) {
        this.nodeName = element.nodeName;
        this.attributes = [];
        this.childNodes = [];
        this.childElements = [];

        var attributes = element.attributes;
        for (var i = 0, len = attributes.length; i < len; ++i)
        {
          var attribute = attributes[i];

          attribute = new _Attribute(attribute);

          var attributes_by_name = this.attributes[attribute.name];
          if (typeof attributes_by_name == "undefined")
          {
            this.attributes[attribute.name] = attribute;
            attribute[0] = attribute;
            attribute.length = 1;
          }
          else if (attributes_by_name instanceof _Attribute)
          {
            attributes_by_name[attributes_by_name.length] = attribute;
            ++attributes_by_name.length;
          }

          this.attributes.push(attribute);
        }

        var childNodes = element.childNodes;
        for (i = 0, len = childNodes.length; i < len; ++i)
        {
          var child = childNodes[i];

          var child_nodes = this.childNodes;
          if (child.nodeType == 1)
          {
            child = new jsx_dom_e5x_Element(child);

            var node_name = child.nodeName;
            var child_nodes_by_node_name = this[node_name];
            if (typeof child_nodes_by_node_name == "undefined")
            {
              this[node_name] = child;
              child[0] = child;
              child.length = 1;
            }
            else if (child_nodes_by_node_name instanceof jsx_dom_e5x_Element)
            {
              child_nodes_by_node_name[child_nodes_by_node_name.length] =
                child;
              ++child_nodes_by_node_name.length;
            }

            var lower_name = node_name.toLowerCase();
            var child_nodes_by_lower_name = this[lower_name];
            if (typeof child_nodes_by_lower_name == "undefined")
            {
              this[lower_name] = child;
              child.length = 1;
            }
            else if (child_nodes_by_lower_name instanceof jsx_dom_e5x_Element)
            {
              child_nodes_by_lower_name[child_nodes_by_lower_name.length] =
                child;
              ++child_nodes_by_lower_name.length;
            }

            this.childElements.push(child);
          }
          else if (child.nodeType == 3)
          {
            child = new _Text(child);
          }

          child_nodes.push(child);
        }

        jsx.object.defineProperty(this, "textContent", {
          get: function () {
            return this.getTextContent();
          }
        });

        this.target = element;
      }
    ).extend(null, {
      /**
       * Returns the text content of this element
       *
       * @memberOf jsx.dom.e5x.Element.prototype
       * @return {string}
       */
      getTextContent: function () {
        var text_content = this.target.textContent;

        return (typeof text_content != "undefined"
          ? text_content
          : [].join.call(this.childNodes));
      },

      /**
       * Returns the text content of this element
       *
       * @return {string}
       */
      toString: function () {
        return this.textContent;
      },

      toXML: function () {
        function _toXML (o)
        {
          return o.toXML();
        }

        var node_name = this.target.nodeName;
        var attributes = this.attributes.map(_toXML).join(" ");
        var content = this.childNodes.map(_toXML).join("");

        return "<" + node_name
          + (attributes ? " " + attributes : "")
          + (content ? "" : " /")
          + ">"
          + (content ? content + "</" + node_name + ">" : "");
      }
    }),

    Text: _Text
  };
}());