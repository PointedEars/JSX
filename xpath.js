/**
 * <title>PointedEars' XPath Library</title>
 * @file $Id$
 * @partof PointedEars JavaScript Extensions (JSX)
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author (C) 2008‒2011  Thomas Lahn <js@PointedEars.de>
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License (GPL) for more details.
 *
 * You should have received a copy of the GNU GPL along with this
 * program (COPYING file); if not, go to [1] or write to the Free
 * Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA.
 * 
 * [1] <http://www.gnu.org/licenses/licenses.html#GPL>
 */
/*
 * Refer xpath.js.diff for changes to the last version,
 * and xpath.htm file for a printable documentation.
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSdoc/
 * for details.
 */

if (typeof XPathResult == "undefined")
{
  var XPathResult = {
    ANY_TYPE: 0,
    NUMBER_TYPE: 1,
    STRING_TYPE: 2,
    BOOLEAN_TYPE: 3,
    UNORDERED_NODE_ITERATOR_TYPE: 4,
    ORDERED_NODE_ITERATOR_TYPE: 5,
    UNORDERED_NODE_SNAPSHOT_TYPE: 6,
    ORDERED_NODE_SNAPSHOT_TYPE: 7,
    ANY_UNORDERED_NODE_TYPE: 8,
    FIRST_ORDERED_NODE_TYPE: 9
  };
}

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

/**
 * @namespace
 */
jsx.xpath = {
  version:   "0.1.$Revision$ ($Date$)",
  copyright: "Copyright \xA9 2008-2011",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://PointedEars.de/scripts/",
  
  /**
   * Returns the result of evaluating an XPath expression against a context node
   * 
   * @function
   * @param expression : String
   *   XPath expression
   * @param contextNode : Node
   *   Context node
   * @param namespaceResolver : Function
   *   Namespace resolver.  If not provided, a default namespace
   *   resolver will be created using {@link jsx.xpath#createDefaultNSResolver()}.
   *   Is ignored if MSXML is used, as MSXML for JScript supports only
   *   the default namespace resolver.
   * @param resultType : Number
   *   Expected XPath result type.  Should be one of the XPathResult.* constants.
   *   Is ignored if MSXML is used, as MSXML only supports the equivalent of
   *   {@link XPathResult#ORDERED_NODE_ITERATOR_TYPE}.
   * @param oResult : XPathResult
   *   Optional XPathResult.  For backwards compatibility only.
   * @return Result of the XPath expression
   * @type number|string|boolean|Array
   */
  evaluate:
    (function () {
      var jsx_object = jsx.object;
      
      return function(expression, contextNode, namespaceResolver, resultType,
                        oResult) {
        var result;
                     
        if (!contextNode)
        {
          contextNode = document;
          var documentNode = contextNode;
        }
        else
        {
          documentNode = contextNode.ownerDocument || contextNode;
        }

        if (jsx_object.isMethod(documentNode, "evaluate"))
        {
          var nsResolver = namespaceResolver
            || this.createDefaultNSResolver(contextNode, documentNode);
          var iResultType = resultType || 0;
          var objResult = oResult || null;
          result = documentNode.evaluate(expression, contextNode, nsResolver,
            iResultType, objResult);
        }
        else if (jsx_object.isMethod(contextNode, "selectNodes"))
        {
          result = contextNode.selectNodes(expression);
          resultType = XPathResult.ORDERED_NODE_ITERATOR_TYPE;
        }
            
        if (result)
        {
          var found = [];
          
          switch (typeof result.resultType != "undefined"
                   ? result.resultType
                   : resultType)
          {
            case XPathResult.NUMBER_TYPE:
              result = typeof result.numberValue != "undefined"
                       && result.numberValue;
              break;
              
            case XPathResult.STRING_TYPE:
              result = typeof result.stringValue != "undefined"
                       && result.stringValue;
              break;
              
            case XPathResult.BOOLEAN_TYPE:
              result = typeof result.booleanValue != "undefined"
                       && result.booleanValue;
              break;
              
            case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
            case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
              if (jsx_object.isMethod(result, "iterateNext"))
              {
                /* DOM Level 3 XPath: NodeIterator */
                while ((res = result.iterateNext()))
                {
                  found.push(res);
                }
                
                result = found;
              }
              else if (typeof result.length != "undefined")
              {
                /* MSXML DOM: NodeList */
                for (var i = 0, len = result.length; i < len; ++i)
                {
                  found.push(result[i]);
                }
                
                result = found;
              }
              break;
              
            case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
            case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
              if (typeof result.snapshotLength != "undefined"
                  && jsx_object.isMethod(result, "snapshotItem"))
              {
                for (var i = 0, len = result.snapshotLength; i < len; i++)
                {
                  found.push(result.snapshotItem(i));
                }
      
                result = found;
              }
              break;
              
            case XPathResult.ANY_UNORDERED_NODE_TYPE:
            case XPathResult.FIRST_ORDERED_NODE_TYPE:
              if (typeof result.singleNodeValue != "undefined")
              {
                result = result.singleNodeValue;
              }
              break;
            
            default:
              jsx.throwThis("jsx.xpath.InvalidImplementationError");
              result = null;
          }
        }
    
        return result;
      };
    }()),
  
  /**
   * Creates and returns a default namespace resolver, as created and
   * returned by <code>Document::createNSResolver()</code>, if available,
   * or <code>null</code>.
   * 
   * Note that despite its name a default namespace resolver cannot
   * resolve elements in the default namespace.  Use
   * {@link jsx.xpath#createCustomNSResolver()} to create such a resolver
   * instead.
   * 
   * @param contextNode : Node
   *   Context node for which the default namespace resolver should be
   *   created.
   * @param documentNode : Document
   *   Document node, required for calling the <code>createNSResolver()</code>
   *   method.  If not specified, <code>document</code> is used.
   * @return NSResolver|null
   */
  createDefaultNSResolver: function(contextNode, documentNode) {
    if (!documentNode)
    {
      documentNode = document;
    }
    
    return (jsx.object.isMethod(documentNode, "createNSResolver")
      ? documentNode.createNSResolver(
          (contextNode.ownerDocument == null
            ? contextNode.documentElement
            : contextNode.ownerDocument.documentElement))
      : null);
  },
  
  /**
   * Creates and returns a custom namespace resolver.  This method exists primarily
   * to facilitate the matching of elements that are in the default namespace,
   * XPath defines QNames without prefix to match only elements in the null
   * namespace.
   * 
   * @param namespaces : Object
   *   Namespace declarations.  The property names are the namespace prefixes,
   *   the property values are the namespace URIs.
   * @returns {Function} A namespace resolver that can resolve the
   *   declared namespaces.  A selector in an undeclared namespace is
   *   considered to be in the no namespace.
   */
  createCustomNSResolver: function(namespaces) {
    return function(prefix) {
      return namespaces[prefix] || null;
    };
  },
  
  /**
   * Exception thrown if an unsupported XPath implementation is encountered
   * 
   * @function
   */
  InvalidImplementationError: (function() {}).extend(jsx.Error, {
    name: "jsx.xpath.InvalidImplementationError"
  })
};