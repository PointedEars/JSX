/**
 * <title>PointedEars' JSX: Math Library: Stochastics</title>
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
 * Returns a uniformly distributed random value in the
 * closed interval
 * [<var>iLeftBorder</var>, <var>iRightBorder</var>]
 * (including <var>iLeftBorder</var> and
 * <var>iRightBorder</var>).
 * 
 * @author
 *   (C) 2000-2003 Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param nLeftBorder : optional number
 *   Left border of the interval. If left out, <code>null</code>
 *   or <code>undefined</code>, <code>-Number.MAX_VALUE</code> is
 *   assumed.
 * @param nRightBorder : optional number
 *   Right border of the interval. If left out, <code>null</code>
 *   or <code>undefined</code>, <code>Number.MAX_VALUE</code> is
 *   assumed.
 * @param fRandom : Function = Math.random
 *   Function to be used for calculating the uniform random number
 *   in the open unit interval (0.0, 1.0) (excluding 0.0 and 1.0).
 *   If left out, <code>Math.random()</code> is used where the
 *   the random number generator is seeded from the current time.
 * @return number
 * @see Math#random()
 */
Math.rand = function(nLeftBorder, nRightBorder, fRandom) {
  if (nLeftBorder == null || typeof nLeftBorder == "undefined")
  {
    iLeftBorder = -Number.MAX_VALUE;
  }

  if (nRightBorder == null || typeof nRightBorder == "undefined")
  {
    iRightBorder = Number.MAX_VALUE;
  }

  if (!fRandom)
  {
    fRandom = function() {
      return Math.random();
    };
  }

  return fRandom() * (nRightBorder - nLeftBorder) + nLeftBorder;
};

/**
 * Returns a uniformly distributed random integer value in the
 * closed interval
 * [<var>iLeftBorder</var>, <var>iRightBorder</var>]
 * (including <var>iLeftBorder</var> and
 * <var>iRightBorder</var>).
 * 
 * @author
 *   (C) 2000-2003 Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param iLeftBorder : optional number
 *   Left border of the interval.  If left out, <code>null</code>
 *   or <code>undefined</code>,
 *   <code>Math.floor(-Number.MAX_VALUE)</code> is assumed.
 * @param iRightBorder : optional number
 *   Right border of the interval.  If left out, <code>null</code>
 *   or <code>undefined</code>,
 *   <code>Math.ceil(Number.MAX_VALUE)</code> is assumed.
 * @param fRandom : Function = Math.random
 *   Function to be used for calculating the uniform random number
 *   in the open unit interval (0.0, 1.0) (excluding 0.0 and 1.0).
 *   If left out, <code>Math.random()</code> is used where the
 *   the random number generator is seeded from the current time.
 * @return number
 * @see Math#random()
 */
Math.randInt = function(iLeftBorder, iRightBorder, fRandom) {
  if (iLeftBorder == null || typeof iLeftBorder == "undefined")
  {
    iLeftBorder = -Number.MAX_VALUE;
  }
  iLeftBorder = Math.floor(iLeftBorder);

  if (iRightBorder == null || typeof iRightBorder == "undefined")
  {
    iRightBorder = Number.MAX_VALUE;
  }
  iRightBorder = Math.ceil(iRightBorder);

  if (! fRandom)
  {
    fRandom = function() {
      return Math.random();
    };
  }

  return Math.round(Math.rand(iLeftBorder, iRightBorder, fRandom));
};

/**
 * Returns a value dependent on statistical probability.
 * 
 * @param nChance : number
 *   Statistical probability that <var>ifChance</var> is returned.
 *   <code>1.0</code> means 100% of all possible cases.
 * @param ifChance
 *   Value that is returned if chances are in favor of it.
 * @param otherwise
 *   Value that is returned if chances are against
 *   <var>ifChance</var>, i.e. the one that is returned
 *   in <code>((1 - nChance) * 100)</code>% of all
 *   possible cases.
 * @param fRandom : Function = Math.random
 *   Function to be used for calculating the uniformly
 *   distributed random number in the open unit interval
 *   <code>(0.0, 1.0)</code> (excluding 0.0 and 1.0).
 *   If left out, <code>Math.random()</code> is used where
 *   the random number generator is seeded from the current
 *   time.
 * @return mixed
 *   <var>ifChance</var> if the chances are in favour of it,
 *   <var>otherwise</var> if they are against it.
 * @see Math#random()
 */
Math.byChance = function(nChance, ifChance, otherwise, fRandom) {
  if (!fRandom)
  {
    fRandom = function() {
      return Math.random();
    };
  }

  return (
    fRandom() < nChance
      ? ifChance
      : otherwise);
};

/**
 * Calculates the binomial coefficient.
 * 
 * @param iUpper : number
 * @param iLower : number
 * @return number
 *   The binomial coefficient <var>iUpper</var> above
 *   <var>iLower</var> (|_<var>iUpper</var><b>!</b> /
 *   <var>iLower<var><b>!</b>_| * (<var>iUpper</var>
 *   - <var>iLower</var>)<b>!</b>)
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
Math.binomCoeff = function(iUpper, iLower) {
  var result = 0;
  
  if (iUpper >= iLower)
  {
    result = Math.floor(Math.fac(iUpper)
           / (Math.fac(iLower) * Math.fac(iUpper - iLower)));
  }
  else
  {
    throwException(new Math.InvalidArgumentError(
      "binomCoeff(" + iUpper + ", " + iLower + ")"));
  }

  return result;
};
