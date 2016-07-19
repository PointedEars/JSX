/**
 * <title>PointedEars' JSX: Math Library: Integer arithmetics</title>
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

if (typeof jsx == "undefined")
{
  var jsx = {};
}

if (typeof jsx.math == "undefined")
{
  jsx.math = {};
}

jsx.math.integer = {
  /**
   * Returns the greatest common divisor (GCD) of two integers
   * <code>a</code> and <code>b</code>, implementing (the optimized form of) the
   * Euclidean algorithm (also called Euclid's algorithm).  The
   * GCD of two integer arguments is the largest positive integer
   * that both arguments are integer multiples of, i.e. by which
   * either argument can be divided without remainder.  Since
   * integers are required, the floor of <code>a</code> and <code>b</code> will
   * be used for computation.
   *
   * @memberOf jsx.math.integer
   * @param a : number
   * @param b : number
   * @return type number
   *   The GCD of <code>a</code> and <code>b</code>;
   *   <code>NaN</code> if an argument is not a number.
   * @see Math#floor(number)
   */
  gcd: function (a, b) {
    if (isNaN(a) || isNaN(b))
    {
      return Number.NaN;
    }

    a = Math.floor(a);
    b = Math.floor(b);
    var c;

    while (b != 0)
    {
      c = a % b;
      a = b;
      b = c;
    }

    return Math.abs(a);
  }
};

if (jsx.options.augmentBuiltins)
{
  jsx.object.extend(Math, {
    /**
     * @memberOf Math
     */
    gcd: jsx.math.integer.gcd
  });
}

/**
 * Returns the greatest common divisor (GCD) of two or more
 * integers, implementing (the optimized form of) the Euclidean
 * algorithm (also called Euclid's algorithm).  The GCD of
 * integer arguments is the largest positive integer that all
 * arguments are integer multiples of, i.e. by which either
 * argument can be divided without remainder.  Since integers
 * are required, the floor of the arguments will be used for
 * computation.
 *
 * @return number
 *   The GCD of the arguments;
 *   <code>NaN</code> if one or more arguments are not a number.
 * @see Math#floor(number)
 */
Math.gcdN = function(a, b) {
  /* Currently supports only 2 integers */
  return Math.gcd(a, b);
};

/**
 * Returns the least common multiple (LCM) of two integers
 * <code>a</code> and <code>b</code>.  The LCM of two integer arguments is
 * the smallest positive integer that is a multiple of the
 * arguments.  If there is no such positive integer, i.e.,
 * if either argument is zero, then <code>lcm(a, b)</code>
 * is defined to be zero.  Since integers are required, the
 * floor of <code>a</code> and <code>b</code> will be used for computation.
 *
 * @param a : number
 * @param b : number
 * @return number
 *   The LCM of <code>a</code> and <code>b</code>;
 *   <code>0</code> if an argument is <code>0</code>;
 *   <code>NaN</code> if an argument is not a number.
 * @see Math#floor(number)
 * @see Math#gcd(number, number)
 */
Math.lcm = function(a, b) {
  if (isNaN(a) || isNaN(b))
  {
    return Number.NaN;
  }

  if (!a || !b)
  {
    return 0;
  }

  a = Math.floor(a);
  b = Math.floor(b);

  return ((a * b) / Math.gcd(a, b));
};

/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param n : number
 *   If <code>n</code> is not an integer, <code>Math.floor(n)</code> is used.
 * @return number
 *   The factorial of <code>n</code> (<code>n</code><code><b>!</b></code>)
 *   which is (for practical reasons) implemented here as follows:
 *   @ifdef{MathML2}
 *     <math>
 *       <apply>
 *         <eq/>
 *         <apply>
 *           <factorial/>
 *           <ci> n </ci>
 *         </apply>
 *         <piecewise>
 *           <piece>
 *             <cn>1</cn>
 *             <apply><lt/> <ci> n </ci> <cn> 2 </cn></apply>
 *           </piece>
 *           <piece>
 *             <mrow>
 *               <ci> n </ci>
 *               <mo>&InvisibleTimes;</mo>
 *               <mfenced>
 *                 <apply>
 *                   <factorial/>
 *                   <apply><minus/> <ci> n </ci> <cn> 1 </cn></apply>
 *                 </apply>
 *               </mfenced>
 *             </mrow>
 *             <apply><gt/> <ci> n </ci> <cn> 1 </cn></apply>
 *           </piece>
 *         </piecewise>
 *       </apply>
 *     </math>
 *   @else
 *     <table>
 *       <tr valign="top">
 *         <td rowspan="2"><code>n<code><b>!</b></td>
 *         <td>n &lt; 2:</td>1; (strict: 0<b>!</b> = 1<b>!</b> := 1)</td>
 *       </tr>
 *       <tr valign="top">
 *         <td>n &gt; 1:</td>n * (n - 1)<b>!</b></td>
 *       </tr>
 *     <table>
 *   @endif
 *
 *   Unlike common recursive implementations, the algorithm is
 *   implemented iterative here, saving stack space and thus
 *   allowing larger factorials to be computed.
 *
 * @throws Math#OverflowError
 */
Math.fac = function(n) {
  if (n % 1 != 0)
  {
    n = Math.floor(n);
  }

  var result = 1;

  for (var i = 2; i <= n; result *= i++)
  {
    if (result == Number.POSITIVE_INFINITY)
    {
      result = 0;
      // [Exception] <- [MathErrorException] <- [OverflowException] }
      jsx.throwThis(new Math.OverflowError("fac"));
      break;
    }
  }

  return result;
};

/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param nBase : number
 * @param iExponent : number
 * @return number
 *   <var>nBase</var> to the power of <var>iExponent</var>
 */
Math.powInt = function(nBase, iExponent) {
  var i = iExponent;
  var result = 1.0;

  while (i > 0)
  {
    if (i % 2)
    {
      result *= nBase;
    }
    i = Math.floor(i / 2);
    nBase *= nBase;
  }

  return result;
};

/**
 * Computes the base <code>nBase</code> powered
 * by the exponent <code>nExponent</code>
 * (<code>nBase</code>^<code>nExponent</code>).
 * Uses the Math.exp() and Math.log() methods to
 * workaround the bug in Math.pow() that positive
 * roots of certain negative values, like root(-9,
 * 1/3) cannot be computed (results in NaN there)
 * but should be.
 *
 * @author
 *   (c) 2000-2004  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param nBase : number
 * @param nExponent : number
 * @throws Math#InvalidArgumentError
 * @return type number
 *   NaN if computation result lies beyond real numbers,
 *   the result (as double-precision floating-point number)
 *   otherwise.
 */
Math.power = function(nBase, nExponent) {
  var result;

  if (nBase != 0)
  {
    /* e^(Exponent * ln(|Base|)) */
    result = Math.exp(nExponent * Math.log(Math.abs(nBase)));
    if (nBase < 0)
    {
      if (nExponent % 1 == 0)
      {
        if (Math.floor(nExponent) % 2)
        {
          result = -result;
        }
      }
      else
      {
        result = Number.NaN;
        /* [Exception]<- [Math.MathError] <- [Math.InvalidArgumentError] */
        jsx.throwThis(new Math.InvalidArgumentError(
          "power(" + nBase + ", " + nExponent + ")"));
      }
    }
    else if (nBase == 0 && nExponent == 0)
    {
      result = 0;
      jsx.throwThis(new Math.InvalidArgumentError(
        "power(" + nBase + ", " + nExponent + ")"));
    }
  }

  return result;
};

/**
 * @return type number
 *   The logarithm of <code>x</code> to the base <code>nBase</code>.
 *
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param x : number
 * @param nBase : number
 */
Math.logN = function(x, nBase) {
  return Math.log(x) / Math.log(nBase);
};

/**
 * @author
 *   (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 *
 * @param x : number
 * @return type number
 *   The logarithm digitalis (<code>ld</code>) of <code>x</code>
 *   (the logarithm of <code>x</code> to the base 2).
 */
Math.log2 = function(x) {
  return Math.logN(x, 2);
};

/**
 * Computes the decimal logarithm (<code>lg</code>) of
 * <code>x</code> (the log. of <code>x</code> to the base 10).
 *
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param x : number
 * @return number
 *   The logarithm of <var>x</var> to the base 10
 */
Math.log10 = function(x) {
  return Math.logN(x, 10);
};

/**
 * @author
 *   (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param x : number
 * @return type number
 *   the reciprocal of <code>x</code> (<code>1/x</code>).
 */
Math.rec = function(x) {
  return (1 / x);
};

/**
 * Finds prime numbers within a range
 *
 * @param {int} upperBounds
 *   The upper bounds of the half-open interval [2, ceil(upperBounds)),
 *   that is, the smallest integer that should not be considered
 *   in the search.
 * @return {Object}
 *   An object whose property names are the primes within range.
 *   Use {@link Object#keys()} to get an {@link Array} of
 *   <code><em>string</em></code> values; use
 *   {@link Array.prototype#map} to get an <code>Array</code>
 *   of {@link Number} values.
 *   NOTE: As of ECMAScript Edition 5.1, an <code>Array</code>
 *   is limited to 2^32-1 elements.  Use {@link jsx.array.BigArray}
 *   to process this <code>Object</code> efficiently.
 */
Math.primes = function (upperBounds) {
  var not_prime = Object.create(null);
  var prime = Object.create(null);
  var i = 2;
  var upperLimit = Math.sqrt(upperBounds);

  while (i < upperLimit)
  {
    prime[i] = true;

    for (var mult = i * i; mult < upperBounds; mult += i)
    {
      not_prime[mult] = true;
    }

    while (not_prime[++i]);
  }

  for (; i < upperBounds; ++i)
  {
    if (!not_prime[i])
    {
      prime[i] = true;
    }

    delete not_prime[i];
  }

  return prime;
};
