/**
 * <title>PointedEars' XPath Library</title>
 * @partof
 *   PointedEars JavaScript Extensions (JSX)
 * @requires types.js
 * @recommends exception.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2008,2009  Thomas Lahn <dhtml.js@PointedEars.de>
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

if (typeof _global == "undefined")
{
  var _global = this; 
}

if (typeof XPathResult == "undefined")
{
  this.XPathResult = {
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

/**
 * @return undefined|XPath
 */
function XPath() {
  // if called as a factory
  if (this == _global)
  {
    return new XPath();
  } 
}

XPath.prototype = {
  constructor: XPath,
  evaluate:
  /**
   * @return Result of the XPath expression
   * @type number|string|boolean|Array|
   */
  function(expression, contextNode, namespaceResolver, resultType, oResult) {
    var result;
                 
    if (isMethod(document, "evaluate"))
    {
      result = document.evaluate(expression,
        contextNode || document,
        namespaceResolver || this.getDefaultNSResolver(contextNode),
        /^[0-9]$/.test(resultType) ? resultType : 0,
        oResult || null);

      if (result)
      {
        var found = []; 
        
        switch (result.resultType)
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
            if (isMethod(result, "iterateNext"))
            {
              while ((res = result.iterateNext()))
              {
                found.push(res);
              }
              
              result = found;
            }
            break;
            
          case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
          case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
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
            
          case XPathResult.ANY_UNORDERED_NODE_TYPE:
          case XPathResult.FIRST_ORDERED_NODE_TYPE:
            if (typeof result.singleNodeValue != "undefined")
            {
              result = result.singleNodeValue;
            }
            break;
          
          default:
            if (typeof throwException == "function")
            { 
              jsx.throwException("xpath.InvalidImplementationException");
            }

            result = null;              
        }
      }
    }

    return result;
  },
  
  getDefaultNSResolver:
    /**
     * @return NSResolver|null
     */
    function(contextNode) {
      return (isMethod(document, "createNSResolver")
        ? document.createNSResolver(
            (contextNode.ownerDocument == null
              ? contextNode.documentElement
              : contextNode.ownerDocument.documentElement))
        : null);
  },
  
  InvalidImplementationException: function() {}
};

var xpath = new XPath();
jsx.xpath = xpath;