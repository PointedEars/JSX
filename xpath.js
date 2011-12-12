"use strict";
/**
 * <title>PointedEars' XPath Library</title>
 * @file $Id$
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author (C) 2008‒2011  Thomas Lahn <js@PointedEars.de>
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
   *   XPath expression.  You may use a namespace prefix starting with "_"
   *   to indicate a default namespace of the context node (that XPath
   *   usually cannot resolve directly).  You then need to provide a custom
   *   namespace resolver, like one created with
   *   {@link jsx.xpath#createCustomNSResolver}, to return the namespace
   *   URI for those prefixes.  This workaround is necessary because MSXML
   *   XPath for JScript does not require or support a custom namespace
   *   resolver for elements in the default namespace, and those virtual
   *   prefixes must be trimmed from the expression by this method beforehand.
   * @param contextNode : Node
   *   Context node
   * @param namespaceResolver : Function
   *   Namespace resolver.  If not provided, a default namespace
   *   resolver will be created using {@link jsx.xpath#createDefaultNSResolver}.
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
      
      return function (expression, contextNode, namespaceResolver,
                         resultType, oResult) {
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
          result = contextNode.selectNodes(expression.replace(/_\w*:/g, ""));
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
                var res;
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
   * resolve elements in a default namespace.  Use
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
  createDefaultNSResolver: function (contextNode, documentNode) {
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
   * Collects and returns the namespaces of a node and its descendants.
   * 
   * Collects the namespace prefixes and URIs of <var>contextNode</var> and
   * its descendant element nodes.  Duplicate prefixes with different namespace
   * URI are ignored and must be resolved manually using the <var>namespaces</var>
   * argument of {@link jsx.xpath#createCustomNSResolver}.
   * 
   * @param namespaces : Object
   *   Contains the collected namespace specifications.  Existing properties
   *   are preserved.
   * @param contextNode : Document|Element
   *   The parent node from where to start searching for namespace specifications.
   *   If it is a Document node, the document element node is used instead.
   *   The default is the document element node.
   * @return Object
   *   The resulting value of <var>namespaces</var> if successful,
   *   <code>null</code> otherwise.
   * @throws jsx.xpath#InvalidNodeError if a value has been specified
   *   for <var>contextNode</var> that is not a reference to a Document
   *   node or an Element node.
   */
  collectNamespaces: function jsx_xpath_collectNamespaces (namespaces, contextNode) {
    if (!namespaces)
    {
      jsx.warn("`namespaces' is not convertible to an Object; argument is not modified.");
      namespaces = {};
    }

    /* Scan entire document by default */
    if (!contextNode)
    {
      contextNode = document.documentElement;
    }
      
    /* if DOCUMENT_NODE, use root element */
    if (contextNode.nodeType == 9)
    {
      contextNode = contextNode.documentElement;
    }
    
    if (!contextNode || contextNode.nodeType != 1)
    {
      jsx.throwThis("jsx.xpath.InvalidNodeError", contextNode);
      return null;
    }
    
    for (var i = 0, attribs = contextNode.attributes, len = attribs && attribs.length;
         i < len;
         ++i)
    {
      var attr = attribs[i];
      var nodeName = attr.nodeName;
      var matches;
      if ((matches = String(nodeName).match(/^(xmlns($|:(.+)))/)))
      {
        var prefix = matches[3];
        if (!prefix)
        {
          prefix = "_";
        }
       
        if (typeof namespaces[prefix] == "undefined")
        {
          namespaces[prefix] = attr.nodeValue;
        }
      }
    }

    for (var i = 0, childNodes = contextNode.childNodes, len = childNodes && childNodes.length;
         i < len;
         ++i)
    {
      var childNode = childNodes[i];
      
      /* If ELEMENT_NODE, recurse */
      if (childNode.nodeType == 1)
      {
        jsx.tryThis(
          function() {
            jsx_xpath_collectNamespaces(namespaces, childNode);
          },
          function (e) {
            if (e.name === "jsx.xpath.InvalidArgumentError")
            {
              jsx.throwThis(e);
            }
          });
      }
    }
    
    return namespaces;
  },
  
  /**
   * Creates and returns a custom namespace resolver.
   * 
   * This method* exists primarily to facilitate the matching of elements
   * that are in the default namespace as XPath defines <tt>QNames</tt>
   * without prefix to match only elements in the null namespace.  Use it
   * instead of {@link jsx.xpath#createFullNSResolver} if you only want
   * to match elements in custom default namespaces.
   * 
   * See also the description of the <var>expression</var> argument of
   * {@link jsx.xpath#evaluate} for details.
   * 
   * @param namespaces : Object
   *   Namespace declarations.  The property names are the namespace
   *   prefixes, the property values are the namespace URIs.
   * @returns {Function} A namespace resolver that can resolve the
   *   declared namespaces.  A selector in an undeclared namespace is
   *   considered to be in the null namespace.
   */
  createCustomNSResolver: function (namespaces) {
    return function (prefix) {
      return namespaces[prefix] || null;
    };
  },
  
  /**
   * Creates and returns a customizable full namespace resolver.
   * 
   * Creates and returns a customizable namespace resolver that
   * considers the already namespaces specified in the document first.
   * 
   * Like {@link jsx.xpath#createCustomNSResolver}, this method exists
   * to facilitate the matching of elements that are in the default namespace
   * as XPath defines <tt>QNames</tt> without prefix to match only elements
   * in the null namespace.  Use it instead of
   * {@link jsx.xpath#createCustomNSResolver} if you need to match elements
   * in the context node's default namespace or in one of the named namespaces
   * specified by the context node or its descendants.
   * 
   * See also the description of the <var>expression</var> argument of
   * {@link jsx.xpath#evaluate} for details.
   * 
   * @param namespaces : Object
   *   Namespace declarations.  The property names are the namespace
   *   prefixes, the property values are the namespace URIs.
   * @param contextNode : Document|Element
   *   The parent node from where to start searching for namespace specifications.
   *   If it is a Document node, the document element node is used instead.
   *   The default is the document element node.
   * @returns {Function} A namespace resolver that can resolve the
   *   declared namespaces.  A selector in an undeclared namespace is
   *   considered to be in the null namespace.
   * @throws jsx.xpath#InvalidNodeError if a value has been specified
   *   for <var>contextNode</var> that is not a reference to a Document
   *   node or an Element node.
   * @see jsx.xpath#collectNamespaces(string, Element|Document)
   */
  createFullNSResolver: (function () {
    return function (namespaces, contextNode) {
      if (contextNode)
      {
        if (!namespaces)
        {
          namespaces = {};
        }
               
        jsx.xpath.collectNamespaces(namespaces, contextNode);
      }
      
      return function (prefix) {
        return namespaces[prefix] || null;
      };
    };
  }()),
  
  /**
   * Exception thrown if an unsupported XPath implementation is encountered
   * 
   * @function
   */
  InvalidImplementationError: (function () {}).extend(jsx.Error, {
    name: "jsx.xpath.InvalidImplementationError"
  }),
  
  /**
   * Exception thrown if an invalid Node reference is passed
   * 
   * @function
   */
  InvalidNodeError: (function (contextNode) {
    arguments.callee._super.call(this, contextNode);
  }).extend(jsx.Error, {
    name: "jsx.xpath.InvalidNodeError"
  })
};