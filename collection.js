/**
 * <title>PointedEars' Collection Library</title>
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author (C) 2002-2011  Thomas Lahn &lt;js@PointedEars.de&gt;
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

/**
 * @section Abstract
 *
 * A collection in ECMAScript and its implementations is an object
 * which has indexed items like an {@link Array} object.
 * Unlike an <code>Array</code> object, it also has named items
 * which refer to the same data as the indexed items.  Each
 * item receives a numeric index in order of assignment/addition,
 * and if it is given, a name, too.  Both indexes and names become
 * properties of the collection and are thus accessible via the
 * standard property accessor syntax:
 * <code><var>object</var>["<var>property</var>"]</code>
 * and, if <var>property</var> is an identifier,
 * <code><var>object</var>.<var>property</var></code>.
 * By internal references it is ensured that an operation on
 * an item is performed on both the indexed item and its named
 * counterpart.
 *
 * You could compare this behavior to an associative array in PHP,
 * only that ECMAScript has no built-in concept of associative arrays.
 *
 * @TODO Inherit from jsx.map.Map, remove duplicate methods
 */

/**
 * Creates and initializes a <code>Collection</code> object.
 *
 * @param o : optional Object
 *   reference used to fill the collection.
 * @constructor
 */
jsx.Collection = function(o) {
  this.version   = "0.1.2008120823";
  this.copyright = "Copyright \xA9 2002-2008";
  this.author    = "Thomas Lahn";
  this.email     = "collection.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
  this.URI       = this.path + "collection.js";
//  this.docURI    = this.path + "collection.htm";
  this.allowExceptionMsg = true;

  this.set(o);
};

jsx.Collection.extend(Array);

/**
 * Adds an item to a {@link Collection}.
 *
 * @param val
 * @param name : optional string
 *   Reference to an object used to fill the collection.
 * @return CollectionItem
 *   the added item
 */
jsx.Collection.prototype.add = function (val, name) {
  var index = this.items.length;
  this.items[index] = new jsx.CollectionItem(val);

  if (name && isNaN(name))
  {
    this.items[name] = this.items[index];
  }

  return this.items[index];
};

/**
 * @param o : optional Object
 *   reference used to append to the collection.
 */
jsx.Collection.prototype.addItems = function (o) {
  var result = null;

  for (var i in o)
  {
    /* omit deleted items */
    if (typeof o[i] != "undefined")
    {
      result = this.add(o[i], i);
    }
  }

  return result;
};

/**
 * Removes all items from the {@link Collection}.
 *
 * @type Array
 */
jsx.Collection.prototype.clear = function () {
  this.items = [];

  if (typeof this.items.map != "function")
  {
    this.items.map = function (callback, thisObj) {
      var a = this;

      if (typeof callback == "function")
      {
        if (!thisObj)
        {
          thisObj = this;
        }

        a = [];
        for (var i = 0, len = this.length; i < len; i++)
        {
          a[i] = callback.call(thisObj, this[i], i, this);
        }
      }
      else
      {
        jsx.throwThis("TypeError", "Collection.prototype.items.map(callback, thisObj):"
          + " expected function, got " + typeof thisObj);
      }

      return a;
    };
  }

  return this.items;
};

jsx.Collection.prototype.keys = function () {
  var a = [], o = this.items;

  for (var k in o)
  {
    a.push(o[k]);
  }

  return a;
};

jsx.Collection.prototype.values = function () {
  return this.items.map(function(v) { return v; });
};

/**
 * Returns a reference to a new {@link Iterator} for the {@link Collection}.
 *
 * @return Iterator
 */
jsx.Collection.prototype.iterator = function () {
  return new jsx.Iterator(this.items);
};

/**
 * @param o : optional Object
 *   reference used to fill the {@link Collection}.
 */
jsx.Collection.prototype.set = function (o) {
  this.clear();
  return this.addItems(o);
};

/**
 * Creates and initializes a <code>ValueCollection</code> object,
 * which is a special {@link Collection} that can hold a value.
 *
 * @param o : Object
 *   reference used to fill the collection
 * @param val
 *   Value that the object holds
 */
jsx.ValueCollection = function(o, val) {
  jsx.Collection.call(o);
  this.value = val;
};
jsx.ValueCollection.extend(jsx.Collection);

/**
 * Creates and initializes a <code>CollectionItem</code> object.
 *
 * @param val
 *   Value of the item
 */
jsx.CollectionItem = function(val) {
  this.value = val;
};

/**
 * Creates an initializes an <code>Iterator</code> object.
 * An iterator iterates over a {@link Collection} such that
 * each item of that collection is visited only once.
 *
 * @param o : Collection
 *   Iteration target
 */
jsx.Iterator = function(o) {
  /* properties */
  this.target = o;
  this.prevItem = -1;
  this.currItem = -1;
  this.nextItem = -1;
};

/* prototype methods */
/**
 * Returns the item previously visited in the iteration.
 *
 * @return CollectionItem
 *   The item previously visited in the iteration.
 */
jsx.Iterator.prototype.prev = function () {
  var result;
  var t = this.target;

  if (t)
  {
    /* no need to search if already found by hasPrev() */
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

      this.nextItem = this.currItem;

      var i = this.currItem;

      /* start from next possible item */
      /* run through only one time */
      while (--i > -1 && typeof t[i] == "undefined");

      if (typeof t[i] != "undefined")
      {
        this.currItem = i;
        result = t[i];
      }
    }
  }

  this.prevItem = -1;

  return result;
};

/**
 * Returns the item that will next be visited in the iteration.
 *
 * @return CollectionItem
 *   The item that will next be visited in the iteration.
 */
jsx.Iterator.prototype.next = function () {
  var
    result,
    t = this.target;

  if (t)
  {
    /* no need to search if already found by hasNext() */
    if (this.nextItem > -1)
    {
      this.currItem = this.nextItem;
      result = t[this.currItem];
    }
    else if (typeof t.length != "undefined")
    {
      if (this.currItem < 0
          || this.currItem > t.length - 1)
      {
        this.currItem = -1;
      }

      this.prevItem = this.currItem;

      var i = this.currItem;

      /* start from next possible item */
      /* run through only one time */
      while (++i < t.length && typeof t[i] == "undefined");

      if (typeof t[i] != "undefined")
      {
        this.currItem = i;
        result = t[i];
      }
      else
      {
        this.currItem = -1;
        result = null;
      }
    }
  }

  this.nextItem = -1;

  return result;
};

/**
 * Returns <code>true</code> if there is a previous item
 * in the iteration, i.e. if the current item is not the
 * first item and the collection consists of more than
 * one item.  Returns <code>false</code> otherwise.
 *
 * @return boolean
 *   <code>true</code> if there is a previous item
 *   in the iteration, <code>false</code> otherwise.
 */
jsx.Iterator.prototype.hasPrev = function () {
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

    /* start from next possible item */
    var i = this.currItem;

    /* run through only one time */
    while (--i > -1 && typeof t[i] == "undefined");

    if (typeof t[i] != "undefined")
    {
      this.prevItem = i;
      result = true;
    }
  }

  return result;
};

/**
 * Returns <code>true</code> if there is a next item
 * in the iteration, i.e. if the current item is not the
 * last item and the collection consists of more than
 * one item.  Returns <code>false</code> otherwise.
 *
 * @return boolean
 *   <code>true</code> if there is a next item
 *   in the iteration, <code>false</code> otherwise.
 */
jsx.Iterator.prototype.hasNext = function () {
  var result = false;
  this.nextItem = -1;
  var t = this.target;

  if (t)
  {
    if (this.currItem < 0
        || this.currItem > t.length - 1)
    {
      this.currItem = -1;
    }

    /* start from next possible item */
    var i = this.currItem;

    /* run through only one time */
    while (++i < t.length && typeof t[i] == "undefined");

    if (typeof t[i] != "undefined")
    {
      this.nextItem = i;
      result = true;
    }
  }

  return result;
};

/**
 * Removes the current item from the collection.
 *
 * @type mixed
 * @return the next item, <code>undefined</code> if there is none.
 */
jsx.Iterator.prototype.remove = function () {
  var undef;
  delete this.target[this.currItem];
  if (this.hasNext())
  {
    return this.next();
  }

  return undef;
};
