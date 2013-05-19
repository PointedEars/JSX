/**
 * <title>PointedEars' JSX: Math Library: Intervals</title>
 * @requires object.js
 * @requires types.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2000-2011  Thomas Lahn &lt;math.js@PointedEars.de&gt;
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
 * Specifies a numeric interval, closed by default.
 *
 * @param aSections : Array, @property sections : Array = [0, 1]
 *   Specifies the sections of the interval, starting
 *   with the left border, continuing with a non-zero
 *   number of optional intermitting borders and
 *   ending with the right border.  Note that the
 *   elements are automatically arranged in numerically
 *   ascending order.
 * @param bLeftOpen : boolean, @property leftOpen : boolean = false
 *   If true, specifies that the interval is open
 *   on the left, meaning that its left border
 *   is not part of the interval.
 * @param bRightOpen : boolean, @property rightOpen : boolean = false
 *   If true, specifies that the interval is open
 *   on the right, meaning that its right border
 *   is not part of the interval.
 */
Math.Interval = function(aSections, bLeftOpen, bRightOpen) {
  if (isArray(aSections))
  {
    aSections.sort(function(a, b) { return a - b; });
    this.sections    = aSections    || [0, 1];
    this.leftOpen    = !!bLeftOpen  || false;
    this.rightOpen   = !!bRightOpen || false;
  }
};

/**
 * Returns the left border of the interval.
 *
 * @return mixed
 *   The left border of the interval
 */
Math.Interval.prototype.getLeftBorder = function() {
  return this.sections[0];
};

/**
 * Returns the right border of the interval.
 *
 * @return mixed
 *   The right border of the interval
 */
Math.Interval.prototype.getRightBorder = function() {
  return this.sections[this.sections.length - 1];
};

/**
 * @param n : number
 * @param o : optional Interval
 * @return number
 * @todo
 */
Math.getSubIntervalIndex = function(n, o) {
  var result = null;

  if (!(o instanceof Math.Interval) && this instanceof Math.Interval)
  {
    o = this;
  }

  if (o instanceof Math.Interval)
  {
    var
      start = 0,
      s = o.sections,
      end = s.length,
      max = end,
      pivot = 0;

    do
    {
      /* Use interpolation search [O(log(log n))] for many sections */
      if (max > 10000)
      {
        var nS = s[start];

        pivot = start + Math.floor((end - start) * (n - nS) / (s[end] - nS));
      }
      else
      {
        /* Use binary search [O(log n)] */
        pivot = (start + end) >> 1;
      }

      if (start + 1 == end)
      {
        if (n - s[start] <= s[end] - n)
        {
          result = start;
        }
        else
        {
          result = end;
        }
        break;
      }
      else if (n < s[pivot])
      {
        /* continue search left-hand side */
        end = pivot;
      }
      else
      {
        /* continue search right-hand side */
        start = pivot;
      }
    }
    while (n >= s[start] && n <= s[end]);
  }

  return result;
};

/**
 * @param n : number
 * @param o : optional Interval
 * @return boolean
 * @todo
 */
Math.isInInterval = function(n, o) {
  var result = false;

  if (!(o instanceof Math.Interval) && this instanceof Math.Interval)
  {
    o = this;
  }

  if (o instanceof Math.Interval)
  {
    var lo, l, ro, r;

    result =
      (((lo = o.leftOpen) && n > (l = o.getLeftBorder()))
       || (!lo && n >= l))
      &&
      (((ro = o.rightOpen) && n < (r = o.getRightBorder()))
       || (!ro && n <= r));
  }

  return result;
};

/**
 * @return Array
 */
Math.getRightOpenIntervals = function() {
  var a = new Array();

  var len = arguments.length;
  if (len == 0)
  {
    a.push(new Math.Interval(0, 1, true));
  }
  else
  {
    a.push(new Math.Interval(arguments[0], arguments[1], true));
  }

  if (len > 2)
  {
    len = arguments.length;
    for (var i = 1; i < len; i++)
    {
      a.push(new Math.Interval(arguments[i], arguments[i+1], true));
    }
  }

  return a;
};

/**
 * @param n : number
 * @param a : [Interval]
 * @return number
 *   the index of the first interval in <code>a</code> that contains
 *   <code>n</code>, -1 if there is no (such) interval.
 */
Math.getIntervalIndex = function(n, a) {
  var result = -1;

  if (a instanceof Array)
  {
    for (var i = 0, len = a.length; i < len; i++)
    {
      var o;
      if ((o = a[i]) instanceof Math.Interval && o.contains(n))
      {
        result = i;
        break;
      }
    }
  }

  return result;
};

jsx.object.extend(Math.Interval.prototype, {
  'contains':              Math.isInInterval,
  'getRightOpenIntervals': Math.getRightOpenIntervals,
  'getIntervalIndex':      Math.getIntervalIndex
});
