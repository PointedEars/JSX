/**
 * <title>PointedEars' Collection Library</title>
 * @partof PointedEars' JavaScript Extensions (JSX)
 * 
 * @section Copyright & Disclaimer
 * 
 * @author (C) 2002-2005  Thomas Lahn &lt;collection.js@PointedEars.de&gt;
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
/** 
 * @section Abstract
 * 
 * A collection in ECMAScript and its implementations is an
 * object which has indexed elements like an Array object.
 * Unlike an Array object, it also has named elements, where
 * those named elements refer to the same data as the indexed
 * elements do.  Each element receives a numeric index in order
 * of assignment/addition, and if it is given, a name, too.
 * Both indexes and names become properties of the collection
 * and are thus accessible via the standard property accessor
 * syntax: `object["property"]' and, if property is an identifier,
 * `object.property'.  By internal references it is ensured that
 * an operation on an element is performed on both the indexed
 * element and its named counterpart, and vice-versa.
 * 
 * You could compare this behavior to an associative array
 * in PHP, only that ECMAScript has no built-in concept of
 * associative arrays.
 */
/*
 * Refer collection.htm file for a printable
 * documentation. 
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSdoc/
 * for details.
 */

function Collection(/** @optional Object */ o)
{
  this.version   = "0.1.2005021522";
/**
 * @partof
 *   PointedEars JavaScript Extensions (JSX)
 * 
 */
  this.copyright = "Copyright \xA9 2002-2005";
  this.author    = "Thomas Lahn";
  this.email     = "collection.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
  this.URI       = this.path + "collection.js";
//  this.docURI    = this.path + "collection.htm";
  this.allowExceptionMsg = true;

  Collection.prototype.addItems =
  function collection_addItems(
    /** @optional Object */ o)
  {
    var result = null;
  
    for (var i in o)
    {
      if (typeof o[i] != "undefined") // omit deleted items
      {
        this.items[i] = new CollectionItem(o[i]);
        if (isNaN(i)) // if the property name is not numeric
        {
          this.items[this.items.length] = this.items[i];
        }

        result = this.items[i];
      }
    }
    
    return result;
  };
  
  Collection.prototype.set =
  function collection_set(
    /** @optional Object */ o)
  { 
    this.items = new Array(); // no real array, but Array.length is useful
    return this.addItems(o);
  };

  this.set(o);
}

Collection.prototype.add =
function collection_add(val, name)
{
  var index = this.items.length;
  this.items[index] = new CollectionItem(val);

  if (name && isNaN(name))
  {
    this.items[name] = this.items[index];
  }

  return this.items[index];
}

Collection.prototype.clear =
function collection_clear()
{
  this.items = new Array();
  return !this.items;
}

Collection.prototype.iterator =
function collection_iterator()
{
  return new Iterator(this.items);
}

/**
 * A ValueCollection is a collection
 * which can additionally hold a value.
 *
 * @property value
 */ 
function ValueCollection(o, val)
{
  Collection.call(o);
  this.value = val;
}
ValueCollection.prototype = inheritFrom(Collection.prototype);

function CollectionItem(val)
{
  this.value = val;
}

function Iterator(o)
{
  // properties
  this.target = o;
  this.prevItem = -1;
  this.currItem = -1;
  this.nextItem = -1;
}

// prototype methods
Iterator.prototype.prev =
function iterator_prev()
{
  var result = result; // undefined
  var t = this.target;
  
  if (t)
  {
    if (this.prevItem > -1) // no need to search if already found by hasPrev()
    {
      this.currItem = this.prevItem;
      result = t[this.currItem];
    }
    else if (typeof t.length != "undefined")
    {  
      if (this.currItem < 1
          || this.currItem > t.length - 1)
      {
        this.currItem = t.length;
      }
      
      var i = this.currItem - 1;            // start from next possible item
      while (i != this.currItem             // run through only one time
             && typeof t[i] == "undefined") 
      {
        if (--i < 0)
        {
          i = t.length - 1;
        }
      }

      if (typeof t[i] != "undefined")
      {
        this.prevItem = -1;
        this.currItem = i;
        this.nextItem = -1;
        result = i;
      }
    }          
  }
  
  return result;
}

Iterator.prototype.next =
function iterator_next()
{
  var result = result; // undefined

  var t = this.target;
  if (t)
  {
    if (this.nextItem > -1) // no need to search if already found by hasNext()
    {
      this.currItem = this.nextItem;
      result = t[this.currItem];
    }
    else if (typeof t.length != "undefined")
    {      
      if (this.currItem < 0
          || this.currItem > t.length - 2)
      {
        this.currItem = -1;
      }
    
      var i = this.currItem + 1;            // start from next possible item
      while (i != this.currItem             // run through only one time
             && typeof t[i] == "undefined") 
      {
        if (++i > t.length - 1)
        {
          i = 0;
        }
      }

      if (typeof t[i] != "undefined")
      {
        this.prevItem = -1;
        this.currItem = i;
        this.nextItem = -1;
        result = i;
      }
    }          
  }
  
  return result;
}

Iterator.prototype.hasPrev = 
function /** @type boolean */ iterator_hasPrev()
{
  var result = false;
  this.prevItem = -1;

  var t = this.target;

  if (t)
  {
    if (this.currItem < 1
        || this.currItem > t.length - 1)
    {
      this.currItem = t.length;
    }

    var i = this.currItem - 1;            // start from next possible item
    while (i != this.currItem             // run through only one time
           && typeof t[i] == "undefined") 
    {
      if (--i < 0)
      {
        i = t.length - 1;
      }
    }

    if (typeof t[i] != "undefined")
    {
      this.prevItem = i;
      result = true;
    }
  }
  
  return result;
}

Iterator.prototype.hasNext = 
function /** @type boolean */ iterator_hasNext()
{
  var result = false;
  this.nextItem = -1;

  var t = this.target;

  if (t)
  {
    if (this.currItem < 0
        || this.currItem > t.length - 2)
    {
      this.currItem = -1;
    }

    var i = this.currItem + 1;            // start from next possible item
    while (i != this.currItem             // run through only one time
           && typeof t[i] == "undefined") 
    {
      if (++i > t.length - 1)
      {
        i = 0;
      }
    }

    if (typeof t[i] != "undefined")
    {
      this.nextItem = i;
      result = true;
    }
  }
  
  return result;
}

Iterator.prototype.remove =
function iterator_remove()
/**
 * Removes the current item and moves on to the next item,
 * if there is any.
 * 
 * @returns
 *   The next item, <code>undefined</code> if there is none.
 */
{
  var undef = undef;
  delete this.target[this.currItem];
  if (this.hasNext())
  {
    return this.next();
  }
  else
  {
    return undef;
  }
}
