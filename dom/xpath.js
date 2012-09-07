"use strict";
/**
 * <title>PointedEars' XPath Library</title>
 * @file $Id$
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author (C) 2008‒2012  Thomas Lahn <js@PointedEars.de>
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
jsx.dom.xpath = {
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
   *   {@link jsx.dom.xpath#createCustomNSResolver}, to return the namespace
   *   URI for those prefixes.  This workaround is necessary because MSXML
   *   XPath for JScript does not require or support a custom namespace
   *   resolver for elements in the default namespace, and those virtual
   *   prefixes must be trimmed from the expression by this method beforehand.
   * @param contextNode : Node
   *   Context node
   * @param namespaceResolver : Function
   *   Namespace resolver.  If not provided, a default namespace
   *   resolver will be created using {@link jsx.dom.xpath#createDefaultNSResolver}.
   *   Is ignored if MSXML is used, as MSXML for JScript supports only
   *   the default namespace resolver.  See the section
   *   {@ref "Namespace Resolvers"} for details.
   * @param resultType : Number
   *   Expected XPath result type.  Should be one of the XPathResult.* constants.
   *   Is ignored if MSXML is used, as MSXML only supports the equivalent of
   *   {@link XPathResult#ORDERED_NODE_ITERATOR_TYPE}.
   * @param oResult : XPathResult
   *   Optional XPathResult.  For backwards compatibility only.
   * @return Result of the XPath expression,
   *   or <code>null</code> on recoverable error
   * @type Null|number|string|boolean|Array
   * @throws DOMException on unrecoverable XPath error
   */
  evaluate:
    (function () {
      var isMethod = jsx.object.isMethod;
      var _XPathResult = XPathResult;
      var createDefaultNSResolver = null;
      
      return function (expression, contextNode, namespaceResolver,
                         resultType, oResult) {
        var result = null;
                     
        if (!contextNode)
        {
          contextNode = document;
          var documentNode = contextNode;
        }
        else
        {
          documentNode = contextNode.ownerDocument || contextNode;
        }

        if (isMethod(documentNode, "evaluate"))
        {
          var nsResolver = namespaceResolver
            || (
                 createDefaultNSResolver
                 || (createDefaultNSResolver = jsx.dom.xpath.createDefaultNSResolver)
               )(contextNode, documentNode);
          var iResultType = resultType || 0;
          var objResult = oResult || null;
          
          /* Make DOM exception recoverable in WebCore */
          jsx.tryThis(
            function () {
              result = documentNode.evaluate(expression, contextNode, nsResolver,
                iResultType, objResult);
            },
            function (e) {
              jsx.rethrowThis(e);
            }
          );
        }
        else if (isMethod(contextNode, "selectNodes"))
        {
          result = contextNode.selectNodes(expression.replace(/_\w*:/g, ""));
          resultType = _XPathResult.ORDERED_NODE_ITERATOR_TYPE;
        }
            
        if (result)
        {
          var found = [];
          
          switch (typeof result.resultType != "undefined"
                   ? result.resultType
                   : resultType)
          {
            case _XPathResult.NUMBER_TYPE:
              if (typeof result.numberValue != "undefined")
              {
                result = result.numberValue;
              }
              break;
              
            case _XPathResult.STRING_TYPE:
              if (typeof result.stringValue != "undefined")
              {
                result = result.stringValue;
              }
              break;
              
            case _XPathResult.BOOLEAN_TYPE:
              if (typeof result.booleanValue != "undefined")
              {
                result = result.booleanValue;
              }
              break;
              
            case _XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
            case _XPathResult.ORDERED_NODE_ITERATOR_TYPE:
              if (isMethod(result, "iterateNext"))
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
              
            case _XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
            case _XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
              if (typeof result.snapshotLength != "undefined"
                  && isMethod(result, "snapshotItem"))
              {
                for (var i = 0, len = result.snapshotLength; i < len; i++)
                {
                  found.push(result.snapshotItem(i));
                }
      
                result = found;
              }
              break;
              
            case _XPathResult.ANY_UNORDERED_NODE_TYPE:
            case _XPathResult.FIRST_ORDERED_NODE_TYPE:
              if (typeof result.singleNodeValue != "undefined")
              {
                result = result.singleNodeValue;
              }
              break;
            
            default:
              jsx.throwThis("jsx.dom.xpath.InvalidImplementationError");
              result = null;
          }
        }
    
        return result;
      };
    }()),
  
/**
 * @section Namespace Resolvers
 * 
 * To facilitate matching of elements and attributes in namespaces
 * with XPath, a namespace resolver is required.  A namespace resolver
 * is a function that returns the namespace URI for a given namespace
 * prefix found in an XPath expression.
 * 
 * JSX:xpath.js provides three ways to create a namespace resolver:
 * <ul>
 *   <li>{@link jsx.dom.xpath#createDefaultNSResolver} creates a built-in
 *       namespace resolver (if available) that can resolve elements
 *       and attributes in the document in the null namespace (in no
 *       namespace) or in namespaces with prefixes (declared with
 *       <code>xmlns:<var>prefix</var>="<var>URI</var>"</code>.
 *       It cannot resolve elements and attributes in a default
 *       namespace (declared with <code>xmlns="<var>URI</var>"</code>).
 *   </li>
 *   <li>{@link jsx.dom.xpath#createCustomNSResolver} creates a custom
 *       namespace resolver that can resolve only namespace prefixes
 *       that you specify.  You can use this kind of resolver
 *       to select elements and attributes in known default namespaces,
 *       by giving those prefixes starting with <code>_</code>, and
 *       namespaces with other prefixes.</li>
 *   <li>{@link jsx.dom.xpath#createFullNSResolver} gives you the
 *       best of both worlds. It creates a customizable namespace
 *       resolver that scans the document starting from a given context
 *       node (the document element node by default) for the first
 *       default namespace declaracation and for declarations of
 *       namespaces with a prefix.
 * </ul>
 */
    
  /**
   * Creates and returns a default namespace resolver, as created and
   * returned by <code>Document::createNSResolver()</code>, if available,
   * or <code>null</code>.
   * 
   * Note that despite its name a default namespace resolver cannot
   * resolve elements in a default namespace.  Use
   * {@link jsx.dom.xpath#createCustomNSResolver()} to create such a resolver
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
   * argument of {@link jsx.dom.xpath#createFullNSResolver()}.
   * 
   * @param namespaces : Object
   *   Contains the collected namespace declarations.  Existing properties
   *   are preserved.
   * @param contextNode : Document|Element
   *   The parent node from where to start searching for namespace
   *   declarations.  If it is a Document node, the document element node
   *   is used instead.  The default is the document element node.
   * @return {Object}
   *   The resulting value of <var>namespaces</var> if successful,
   *   <code>null</code> otherwise.
   * @throws jsx.dom.xpath.InvalidNodeError if a value has been specified
   *   for <var>contextNode</var> that is not a reference to a Document
   *   node or an Element node.
   * @see jsx.dom.xpath#createFullNSResolver()
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
      jsx.throwThis("jsx.dom.xpath.InvalidNodeError", contextNode);
      return null;
    }
    
    for (var i = 0, attribs = contextNode.attributes, len = attribs && attribs.length;
         i < len;
         ++i)
    {
      var attr = attribs[i];
      var attrName = attr.name;
      var matches;
      
      if ((matches = String(attrName).match(/^xmlns($|:(.+))/)))
      {
        var originalPrefix = matches[2];
        var prefix = originalPrefix || "_";
       
        if (typeof namespaces[prefix] == "undefined")
        {
          var attrValue = attr.value;
          
          /*
           * Default NS declaration with empty value means _no_ namespace,
           * see <http://www.w3.org/TR/REC-xml-names/#defaulting>
           */
          if (!originalPrefix && attrValue == "")
          {
            attrValue = null;
          }
          
          namespaces[prefix] = attrValue;
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
            if (e.name === "jsx.dom.xpath.InvalidArgumentError")
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
   * This method exists primarily to facilitate the matching of elements
   * that are in the default namespace as XPath defines <tt>QNames</tt>
   * without prefix to match only elements in the null namespace.  Use it
   * instead of {@link jsx.dom.xpath#createFullNSResolver} if you only want
   * to match elements in custom default namespaces.
   * 
   * See also the description of the <var>expression</var> argument of
   * {@link jsx.dom.xpath#evaluate} for details.
   * 
   * @param namespaces : Object
   *   Namespace declarations.  The property names are the namespace
   *   prefixes, the property values are the namespace URIs.
   * @return {Function} A namespace resolver that can resolve the
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
   * considers the namespaces already declared in the document first.
   * 
   * Like {@link jsx.dom.xpath#createCustomNSResolver}, this method exists
   * primarily to facilitate the matching of elements that are in a
   * default namespace.  Use it instead of
   * {@link jsx.dom.xpath#createCustomNSResolver} if you need to match elements
   * in the context node's default namespace, or in one of the namespaces
   * with prefix declared in the context node or its descendant elements.
   * 
   * See also the description of the <var>expression</var> argument of
   * {@link jsx.dom.xpath#evaluate} for details.
   * 
   * @param namespaces : Object
   *   Namespace declarations.  The property names are the namespace
   *   prefixes, the property values are the namespace URIs.
   * @param contextNode : Document|Element
   *   The parent node from where to start searching for namespace
   *   declarations.  If it is a Document node, the document element node
   *   is used instead.  The default is the document element node.
   * @return {Function} A namespace resolver that can resolve the
   *   declared namespaces.  A selector in an undeclared namespace is
   *   considered to be in the null namespace.
   * @throws jsx.dom.xpath#InvalidNodeError if a value has been specified
   *   for <var>contextNode</var> that is not a reference to a Document
   *   node or an Element node.
   * @see jsx.dom.xpath#collectNamespaces(string, Element|Document)
   * @function
   */
  createFullNSResolver: (function () {
    var collectNamespaces = null;
    
    return function (namespaces, contextNode) {
      if (contextNode)
      {
        if (!namespaces)
        {
          namespaces = {};
        }
               
        (
          collectNamespaces || (collectNamespaces = jsx.dom.xpath.collectNamespaces)
        )(namespaces, contextNode);
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
  InvalidImplementationError: (function () {
    jsx.Error.call(this);
  }).extend(jsx.Error, {
    name: "jsx.dom.xpath.InvalidImplementationError"
  }),
  
  /**
   * Exception thrown if an invalid Node reference is passed
   * 
   * @function
   */
  InvalidNodeError: (function (contextNode) {
    jsx.Error.call(this, contextNode);
  }).extend(jsx.Error, {
    name: "jsx.dom.xpath.InvalidNodeError"
  })
};