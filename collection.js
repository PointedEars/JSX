/**
 * <title>PointedEars' Collection Library</title>
 * @partof PointedEars' JavaScript Extensions (JSX)
 * @requires object.js
 * 
 * @section Copyright & Disclaimer
 * 
 * @author (C) 2002-2006  Thomas Lahn &lt;collection.js@PointedEars.de&gt;
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
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSdoc/
 * for details.
 */

/** 
 * @section Abstract
 * 
 * A collection in ECMAScript and its implementations is an
 * object which has indexed elements like an Array object.
 * Unlike an Array object, it also has named elements which
 * refer to the same data as the indexed elements do.  Each
 * element receives a numeric index in order of assignment/
 * addition, and if it is given, a name, too.  Both indexes
 * and names become properties of the collection and are
 * thus accessible via the standard property accessor syntax:
 * `object["property"]' and, if property is an identifier,
 * `object.property'.  By internal references it is ensured
 * that an operation on an element is performed on both the
 * indexed element and its named counterpart, and vice-versa.
 * 
 * You could compare this behavior to an associative array
 * in PHP, only that ECMAScript has no built-in concept of
 * associative arrays.
 */
/**
 * @param o: optional Object
 *   reference used to fill the collection.
 * @constructor
 */
function Collection(o)
{
  this.version   = "0.1.2006073010";
  /**
   * @partof PointedEars JavaScript Extensions (JSX)
   */
  this.copyright = "Copyright \xA9 2002-2006";
  this.author    = "Thomas Lahn";
  this.email     = "collection.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
  this.URI       = this.path + "collection.js";
//  this.docURI    = this.path + "collection.htm";
  this.allowExceptionMsg = true;

  this.set(o);
}

/**
 * @param o: optional Object
 *   reference used to append to the collection.
 */ 
Collection.prototype.addItems = function collection_addItems(o)
{
  var result = null;

  for (var i in o)
  {
    // omit deleted items
    if (typeof o[i] != "undefined")
    {
      this.items[i] = new CollectionItem(o[i]);

      // if the property name is not numeric
      if (isNaN(i))
      {
        this.items[this.items.length] = this.items[i];
      }

      result = this.items[i];
    }
  }
  
  return result;
};

/**
 * @argument o: optional Object
 *   reference used to fill the {@link Collection}.
 */
Collection.prototype.set = function collection_set(o)
{ 
  // no real array, but Array.prototype.length is useful
  this.items = new Array(); 
  
  return this.addItems(o);
};

/**
 * Adds an item to a {@link Collection}.
 * 
 * @argument val 
 * @argument name: optional string 
 *   Reference to an object used to fill the collection.
 */
Collection.prototype.add = function collection_add(val, name)
{
  var index = this.items.length;
  this.items[index] = new CollectionItem(val);

  if (name && isNaN(name))
  {
    this.items[name] = this.items[index];
  }

  return this.items[index];
};

/**
 * Removes all items from the {@link Collection}.
 * 
 * @type Array
 */
Collection.prototype.clear = function collection_clear()
{
  this.items = new Array();
  return !this.items;
};

/**
 * Returns a reference to a new {@link Iterator} for the {@link Collection}.
 * 
 * @type Iterator
 */
Collection.prototype.iterator = function collection_iterator()
{
  return new Iterator(this.items);
};

function ValueCollection(o, val)
{
  Collection.call(o);
  this.value = val;
}
ValueCollection.extend(Collection);

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
Iterator.prototype.prev = function iterator_prev()
{
  var result = result;  // undefined
  var t = this.target;

  if (t)
  {
    // no need to search if already found by hasPrev()
    if (this.prevItem > -1)
    {
      this.currItem = this.prevItem;
      result = t[this.currItem];
    }
    else if (typeof t.length != "undefined")
    {  
      if (this.currItem < 1 || this.currItem > t.length - 1)
      {
        this.currItem = t.length;
      }
      
      // start from next possible item
      var i = this.currItem - 1;            

      // run through only one time
      while (i != this.currItem && typeof t[i] == "undefined") 
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
};

Iterator.prototype.next = function iterator_next()
{

  var
    // undefined
    result = result,
    t = this.target;

  if (t)
  {
    // no need to search if already found by hasNext()
    if (this.nextItem > -1)
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
    
      // start from next possible item
      var i = this.currItem + 1;
      
      // run through only one time
      while (i != this.currItem && typeof t[i] == "undefined") 
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
};

Iterator.prototype.hasPrev = function iterator_hasPrev()
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

    // start from next possible item
    var i = this.currItem - 1;
          
    // run through only one time
    while (i != this.currItem && typeof t[i] == "undefined") 
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
};

Iterator.prototype.hasNext = function iterator_hasNext()
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

    // start from next possible item
    var i = this.currItem + 1;
    
    // run through only one time
    while (i != this.currItem && typeof t[i] == "undefined") 
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
};

Iterator.prototype.remove = function iterator_remove()
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
};