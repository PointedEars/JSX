/**
 * <title>PointedEars' CSS Library</title>
 * @partof PointedEars' JavaScript Extensions (JSX)
 * 
 * @section Copyright & Disclaimer
 * 
 * @author (C) 2005  Thomas Lahn &lt;css.js@PointedEars.de&gt;
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
 * Refer css.htm file for a printable
 * documentation. 
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSdoc/
 * for details.
 */

/**
 * A <code>CSSSelectorList</code> object encapsulates
 * all CSS selectors of linked to from document in a
 * @{Collection}.
 *
 * @optional Object
 *   Object reference to override the default
 *   <code>document</code> object reference.
 */
function CSSSelectorList(oDocument)
{
  this.document = oDocument || document;
  
  /**
   * Populates the collection with the selectors
   * of the document.
   *
   * @optional Object
   *   Object reference to override the default
   *   <code>document</code> object reference.
   */
  CSSSelectorList.prototype.get = function cssSelectorList_get(oDocument)
  {
    this.clear();

    if (oDocument)
    {
      this.document = oDocument;
    }
    
    var d, oSheets;
    if ((d = this.document) && (oSheets = d.styleSheets))
    {
      for (var i = 0, oRules; i < oSheets.length; i++)
      {
        if ((oRules = oSheets[i].cssRules || oSheets[i].rules))
        {
          for (var j = 0; j < oRules.length; j++)
          {
            this.add(oRules[j].style, oRules[j].selectorText);
          }
        }
      }
      return true;
    }

    return false;
  };
  
  this.get();
}
CSSSelectorList.prototype = new Collection();
  
/**
 * Returns a reference to the selector
 * containing a simple selector.
 *
 * @argument string
 *   Simple selector.
 */
CSSSelectorList.prototype.findSimpleSelector =
function cssSelectorList_findSimpleSelector(sSelector)
{
  var rxSimpleSelector = new RegExp(
    "{simple_selector}({combinator}{simple_selector}*)*"
    .replace(
      /\{simple_selector\}/g,
      '(element_name(#|class|attrib|pseudo)*'
      + '|(#|class|attrib|pseudo)+)')
    .replace(/element_name/g,        "(IDENT|\\*)")
    .replace(/class/g,               "\\.IDENT")
    .replace(/attrib/g,              "\\[\\s*IDENT\\s*([~\\|]="
                                     + "\\s*(IDENT|STRING)\\s*)?\\]")
    .replace(/pseudo/g,              ":(IDENT|FUNCTION\\s*IDENT?\\s*\\))")
    .replace(/FUNCTION/g,            "IDENT\\(\\s*expr\\)\\s*")
    .replace(/\{expr\}/g,            'Term(OperatorTerm)*')
    .replace(/\{Operator\}/g,        "(/\\s*|,\\s*|/\\*([^*]|\\*[\\/])*\\*/)")
    .replace(/\{Term\}/g,            ["(unary_operator?",
                                      "(NUMBER%?\\s*|LENGTH\\s*",
                                      "|ANGLE\\s*|TIME\\s*",
                                      "|FREQ\\s*|IDENT\\(\\s*expr\\)\\s*)",
                                      "|STRING\\s*|IDENT\\s*|URI\\s*|hexcolor)"]
                                      .join(''))
    .replace(/unary_operator/g,      "(-|\\+)")
    .replace(/ANGLE/g,               'NUMBER(deg|g?rad)')
    .replace(/TIME/g,                'NUMBERm?s')
    .replace(/FREQ/g,                'NUMBERk?Hz')
    .replace(/LENGTH/g,              'NUMBER([cm]m|e[mx]|in|p[ctx])')
    .replace(/NUMBER/g,              '([0-9]+|[0-9]*\\.[0-9]+)')
    .replace(/URI/g,                 "url\\(\\s*(STRING|URL)\\s*\\)")
    .replace(/STRING/g,              '({string1}|{string2})')
    .replace(/URL/g,                 '([!#$%&*-~]|{nonascii}|{escape})*')
    .replace(/hexcolor/g,            '#([0-9a-fA-F]{3}){1,2}')
    .replace(/IDENT/g,               "{nmstart}{nmchar}*\\s*")
    .replace(/\{nmstart\}/g,         '([_a-z{nonascii}]|{escape})')
    .replace(/\{nmchar\}/g,          '[_a-zA-Z0-9{nonascii}-]|{escape}')
    .replace(/\{string1\}/g, "\"([\t !#$%&(-~]|\\{nl}|'|[{nonascii}]|{escape})*\"")
    .replace(/\{string2\}/g, "'([\t !#$%&(-~]|\\{nl}|\"|[{nonascii}]|{escape})*'")
    .replace(/\{nl\}/g,              "(\\n|\\r\\n|\\r|\\f)")
    .replace(/\{nonascii\}/g,        "\\x80-\\xFF")
    .replace(/\{escape\}/g,          "({unicode}|\\\\[ -~\\x80-\\xFF])")
    .replace(/\{unicode\}/g,       "\\\\[0-9a-f]{1,6}(\\r\\n|[ \\t\\r\\n\\f])?")
    .replace(/\{combinator\}/g,      "(\\+\\s*|\\>\\s*|\\s+)"));
    
  var r;
  while (this.hasNext())
  {
    if ((r = this.next()))
    {
      if (rxSimpleSelector.test(r.selectorText))
      {
        return r;
      }
    }
  }

  return null;
}

/**
 * Shows or hides elements with a certain class name.
 * 
 * @arguments string
 *   Class name of the elements to be hidden/shown.
 * @optional  boolean bShow
 *   If <code>false</code>, elements will be
 *   hidden, otherwise shown.
 * @requires dhtml.js
 */
function showByClassName(sClassName, bShow)
{
  if (oForm)
  {
    var selectorList, selector;
    if (typeof CSSSelectorList != "undefined"
        && (selectorList = new CSSSelectorList())
        && (selector = selectorList.findSimpleSelector("\\." + sClassName)))
    {
      selector.display = bShow ? "" : "none";
    }
    else
    {
      if (typeof dhtml != "undefined"
          || dhtml.getElemByClassName != "undefined")
      {
        alert("Sorry, you must include dhtml.js.");
        return false;
      }

      var es = dhtml.getElemByClassName(sClassName);
      for (var i = es.length; i--; 0)
      {
        var o = es[i];
        if (typeof o.display != "undefined")
        {
          o.display = bShow ? "" : "none";
        }
      }
    }
  }
}