/**
 * <title>Flash Support Library</title>
 * @file flash.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @requires dhtml.js
 * @author
 *   (C) 2010  Thomas Lahn &lt;js@PointedEars.de&gt;
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

jsx.dom.flash = {
  /** @version */
  version:   "0.1.0.2010070915",
  copyright: "Copyright \xA9 2010",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://PointedEars.de/scripts/",

  /**
   * Fixes Shockwave Flash movies embedded with the <code>object</code>
   * element (having type="application/x-shockwave-flash" specified)
   * so that they work in ActiveX/COM-supporting browsers (most notably
   * IE/MSHTML).
   * 
   * @return boolean
   *   <code>true</code> if successful, <code>false</code> otherwise.
   */
  fix: (function () {
    var
      jsx_object = jsx.object,
      jsx_global = jsx.global,
      jsx_dom = jsx.dom;
    
    return function () {
      if (!jsx_object.isMethod(jsx_global, "ActiveXObject"))
      {
        return false;
      }
      
      var objs = jsx_dom.getElemByTagName("object");
      if (objs && objs.length)
      {
        for (var i = objs.length; i--;)
        {
          var o = objs[i];
          if (o.type == "application/x-shockwave-flash")
          {
            if (jsx_object.isMethod(o, "removeAttribute"))
            {
              o.removeAttribute("data");
            }
            
            o.classid = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540001";
          }
        }
  
        return true;
      }
      
      return false;
    };
  }())
};