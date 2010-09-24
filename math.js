/**
 * <title>PointedEars' JSX: Math Library</title>
 * @partof
 *   PointedEars' JavaScript Extensions (JSX)
 * @requires object.js
 * @requires types.js
 *
 * @section Copyright & Disclaimer
 * 
 * @author
 *   (C) 2000-2010  Thomas Lahn &lt;math.js@PointedEars.de&gt;
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
 * This document contains JavaScriptDoc[tm], see
 * <http://pointedears.de/scripts/JSDoc/>
 * for details.
 * 
 * Refer math.htm file for general documentation.
 */

Math.version   = "1.16.2005052117";
Math.copyright = "Copyright \xA9 1999-2005";
Math.author    = "Thomas Lahn";
Math.email     = "math.js@PointedEars.de";
Math.path      = "http://pointedears.de/scripts/";
// Math.docURL = Math.path + "math.htm";

/* User interface language */
Math.language  = "en";

/** @section Exceptions */

Math.msgInvArg = {
  'en': 'Invalid function argument',
  'de': 'Ungültiges Funktionsargument'
};

Math.msgArgMissing = {
  'en': 'Required argument missing',
  'de': 'Erforderliches Argument fehlt'
};

Math.msgInvOp = {
  'en': 'Invalid operand',
  'de': 'Ungültiger Operand'
};

Math.msgOverflow = {
  'en': 'Overflow',
  'de': 'Überlauf'
};

Math.msgUnderflow = {
  'en': 'Underflow',
  'de': 'Unterlauf'
};

Math.msgDivByZero = {
  'en': 'Division by zero',
  'de': 'Division durch Null'
};

/**
 * @param sError
 * @param sMessage
 */
Math.MathError = function(sError, sMessage) {
  Exception.call(this,
        "math.js Error: "
      + (typeof sError[Math.language] != "undefined"
           ? sError[Math.language]
           : sError["en"])
      + " " + (sMessage || ""));
};
Math.MathError.extend(Exception);

/**
 * @param sMethodCall
 * @param iErrorCode
 * @todo
 */
Math.InvalidArgumentError = function(sMethodCall, iErrorCode) {
  var sSubErrType = msgInvArg;
  
  switch (iErrorCode)
  {
    case -1:
      sSubErrType = Math.msgArgMissing;
      break;
  }
  
  Math.MathError.call(this, sSubErrType);
};

Math.InvalidOperandError = function() {
  Math.MathError.call(this, Math.msgInvOp);
};

Math.OverflowError = function() {
  Math.MathError.call(Math.msgOverflow);
};

Math.UnderflowError = function() {
  Math.MathError.call(Math.msgUnderflow);
};

Math.DivisionByZeroError = function() {
  Math.MathError.call(msgDivByZero);
};

/** @section Intervals */

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

  if (!(o instanceof Interval) && this instanceof Interval)
  {
    o = this;
  }

  if (o instanceof Interval)
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

  if (!(o instanceof Interval) && this instanceof Interval)
  {
    o = this;
  }

  if (o instanceof Interval)
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
    a.push(new Interval(0, 1, true));
  }
  else
  {
    a.push(new Interval(arguments[0], arguments[1], true));
  }

  if (len > 2)
  {
    len = arguments.length;
    for (var i = 1; i < len; i++)
    {
      a.push(new Interval(arguments[i], arguments[i+1], true));
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
      if ((o = a[i]) instanceof Interval && o.contains(n))
      {
        result = i;
        break;
      }
    }
  }
  
  return result;
};

addProperties(
  {
    'contains':              Math.isInInterval,
    'getRightOpenIntervals': Math.getRightOpenIntervals,
    'getIntervalIndex':      Math.getIntervalIndex
  },
  Math.Interval.prototype
);

/** @section Integer arithmetics */

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
 * @param a : number
 * @param b : number
 * @return type number
 *   The GCD of <code>a</code> and <code>b</code>;
 *   <code>NaN</code> if an argument is not a number.
 * @see Math#floor(number)
 */
Math.gcd = function(a, b) {
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
};

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
  if (n % 1)
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
      throwException(new Math.OverflowError("fac"));
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
      if (!(nExponent % 1))
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
        throwException(new Math.InvalidArgumentError(
          "power(" + nBase + ", " + nExponent + ")"));
      }
    }
    else if (nBase == 0 && nExponent == 0)
    {
      result = 0;
      throwException(new Math.InvalidArgumentError(
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

/** @section Floating-point arithmetics */

/**
 * @return the minimum value passed by its arguments.
 * If an argument is an object (incl. Array objects),
 * the values of its enumerable properties are also
 * evaluated.  If no arguments are provided, returns
 * <code>Number.POSITIVE_INFINITY</code>.
 */
Math.minN = function() {
  var result = Number.POSITIVE_INFINITY;
  var min_el;
    
  for (var i = 0; i < arguments.length; i++)
  {
    var a = arguments[i];
    if (isArray(a))
    {
      for (var j = 0; j < a.length; j++)
      {
        if ((min_el = Math.min(a[j])) < result)
        {
          result = min_el;
        }
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        if ((min_el = Math.min(a[j])) < result)
        {
          result = min_el;
        }
      }
    }
    else if (a < result)
    {
      result = a;
    }
  }
  
  return result;
};

/**
 * @return the maximum value passed by its arguments.
 * If an argument is an object (incl. Array objects),
 * the values of its enumerable properties are also
 * evaluated.  If no arguments are provided, returns
 * <code>Number.NEGATIVE_INFINITY</code>.
 */
Math.maxN = function() {
  var result = Number.NEGATIVE_INFINITY;
  
  for (var i = 0, len = arguments.length; i < len; i++)
  {
    var a = arguments[i], max_el;
    if (isArray(a))
    {
      for (var j = 0; j < a.length; j++)
      {
        if ((max_el = Math.maxN(a[j])) > result)
        {
          result = max_el;
        }
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        if ((max_el = Math.maxN(a[j])) > result)
        {
          result = max_el;
        }
      }
    }
    else if (a > result)
    {
      result = a;
    }
  }
  
  return result;
};

/**
 * @return number
 *   The average value of its arguments.
 *   If an argument is an object (incl. Array objects),
 *   the values of its enumerable properties are also
 *   evaluated.  If no arguments are provided, returns
 *   <code>0</code>.
 */
Math.avgN = function() {
  var sum = 0;
  var count = 0;

  for (var i = 0, len = arguments.length; i < len; i++)
  {
    var a = arguments[i];
    if (isArray(a))
    {
      for (var j = 0; j < a.length; j++)
      {
        count++;
        sum += Math.avgN(a[j]);
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        count++;
        sum += Math.avgN(a[j]);
      }
    }
    else
    {
      count++;
      sum += parseFloat(a);
    }
  }
  
  return (sum / count);
};

/**
 * @param n : number
 *   Number of which to compare the <code>iRoot</code>-th root.
 * @param iRoot : optional number = 2
 *   Root exponent. If not integer, the floor (largest integer
 *   less than the argument) of <code>iRoot</code> is used.
 * @return number
 *   The <var>iRoot</var>-th root of <var>n</var>
 */
Math.root = function(n, iRoot) {
  return (iRoot % 2 && n < 0 ? -1 : +1)
         * Math.pow(Math.abs(n), 1/Math.floor(iRoot));
};

/**
 * @param n : number
 * @return number
 *   <var>n</var> squared, i.e. <code>Math.pow(n, 2)</code>.
 * @author (c) 2003  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
Math.sqr = function(n) {
  return Math.pow(n, 2);
};

/**
 * @param n : number
 * @return type number
 *   The cubic value of <code>n</code>, i.e.
 *   <code>Math.pow(n, 3)</code>.
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
Math.cub = function(n) {
  return Math.pow(n, 3);
};

/**
 * @param n : number
 * @return type number
 *   the cubic root of <code>n</code>, i.e.
 *   <code>Math.pow(n, 1/3)</code>, but also works
 *   with negative values of <code>n</code>.
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
Math.cubrt = function(n) {
  return root(n, 3);
};


/** @subsection Rounding */

/*
 * TODO:
 * Original round function from JavaScript-FAQ (http://dcljs.de/faq)
 * Why not this way?
 */

/**
 * @param x
 * @param n
 * @return string
 * @deprecated
 */
function roundDigits_deprecated(x, n) {
  if (n < 1 || n > 14)
  {
    return false;
      /* Impossible to round left to point;
         Returns non-numeric value if invalid number of digits
         which causes further calculations to fail (NaN) although
         they could succeed
      */
  }
  
  var e = Math.pow(10, n);

  var k = (Math.round(x * e) / e).toString();
    /* Do not use toString() because it is part of JavaScript 1.1
       and not all JavaScript capable browsers support it.
       Use the String(...) function instead.
    */
  
  if (k.indexOf('.') == -1){k += '.';
    /* Sometimes it is not desired to have the decimal point
       when dealing with integers. The function does not allow
       output without point. A further argument is required.
    */}

  k += e.toString().substring(1);
    /* See above: Do not use Numeric.toString(...) method.
    */

  return k.substring(0, k.indexOf('.') + n+1);
    /* Why this complicated though it could be much more simple? */
}

/**
 * @param n : number
 *   Numeric value to round. Required.
 * @param iSigDecimals : optional number
 *   Significant decimals to round to. If negative
 *   round to positive powers of 10. Optional.
 *   If out of the closed interval of [-14;14], the
 *   function exits and returns n (unchanged).
 *   If not provided, assume 0 and round the value to
 *   a whole number.
 * @param iForceDecimals : optional number
 *   Number of digits to be returned with the number.
 *   If smaller than iSigDigits, the value will be
 *   ignored and the result is a Numeric value.
 *   Otherwise the required number of zeroes will be
 *   appended and the result is a String value.
 *   Optional.
 * @param bForceLeadingZero : optional number
 *   If true, force leading zero if the value is between
 *   0 and 1 or 0 and -1. The argument is optional.
 *   If not provided, apply bForceLeadingZero=false;
 * @param sDecSeparator : optional string
 *   The character used for decimal delimiter instead.
 *   In English speaking countries the point (".")
 *   is used instead of comma (",") and vice-versa.
 *   Optional. If not provided, use default decimal
 *   separator. If provided, the result is a String value.
 * @return number|string
 *   <var>n</var> rounded to the number of specified digits, optionally
 *   with leading zeroes.
 */
Math.roundDigits = function(n, iSigDecimals, iForceDecimals,
                            bForceLeadingZero, sDecSeparator)
{
  if (! iSigDecimals)
  {
    iSigDecimals = 0;
  }
  
  /*
   * Returns the number itself when called with invalid arguments,
   * so further calculations will not fail because of a wrong
   * function call.
   */
  if (iSigDecimals < -14 || iSigDecimals > 14)
  {
    return n;
  }

  var e = Math.pow(10, iSigDecimals);
  var i = String(n).indexOf(".");

  if (i < 0)
  {
    i = String(n).length - 1;
  }
  
  if (String(n).substring(0, i).length <= -iSigDecimals)
  {
    return n;
  }
    
  var k = Math.round(n * e) / e;
  
  if (arguments.length < 3)
  {
    iForceDecimals = 0;
  }

  if (iForceDecimals > 0)
  {
    k = String(k);
    if ((i = k.indexOf(".")) < 0 && iForceDecimals > 0)
    {
      k += ".";
    }
    
    for (i = k.slice(k.indexOf(".") + 1).length;
         i < iForceDecimals;
         i++)
    {
      k += "0";
    }
  }
  
  if (bForceLeadingZero && String(k).charAt(0) == ".")
  {
    k = "0" + k;
  }

  if (arguments.length < 5)
  {
    sDecSeparator = "";
  }

  if (sDecSeparator.length > 0)
  {
    k = String(k);
    i = k.indexOf(".");
    if (i >= 0)
    {
      k = k.substring(0, i) + sDecSeparator + k.slice(i + 1);
    }
  }
  
  return k;
};


/** @subsection Rational arithmetics */

/**
 * Returns the period of a number, i.e. a repeated
 * substring of its decimals that entirely make up
 * following decimals.
 *
 * @param n : number
 *   The number of which the period should be found out.
 * @param bLoose : optional boolean = false
 *   If <code>true</code>, triggers Loose Mode
 *   which notes <code>iPrecision</code>.
 * @param iPrecision : optional number = 14
 *   In Loose Mode, defines the maximum number
 *   of decimals to parse for a period. The default
 *   is 14 (one less than maximum known precision).
 * @return string
 *   The period of <code>n</code> as a string;
 *   "0" if there is none.
 */
Math.getPeriod = function(n, bLoose, iPrecision) {
  var s = String(n);
  for (var i = 3; i < s.length; i++)
  {
    var
      currentPeriod = s.substring(2, i),
      rx = new RegExp("^\\d*\\.\\d*(" + currentPeriod + ")+$");
        
    if (rx.test(s))
    {
      return currentPeriod;
    }
  }

  return "0";
};

/**
 * @param fDec : number
 * @return string
 *   The representation of <var>fDec</var> in whole fractions
 */
Math.toFraction = function(fDec) {
  /**
   * I:        x = 0.111111111111111      y = 1
   * II:     10x = 1.111111111111111
   * II - I:  9x = 1
   *           x = 1/9
   * 
   * 1. Y = periodLength(X)
   * 2. Z = X * 10^Y
   * 3. A = Z - X
   * 4. RESULT = 'A "/" (10^Y - 1)'
   */
  
  var y = Math.getPeriod(fDec).length;
  var z = fDec * Math.pow(10, y);
  var dividend = Math.round(z - fDec);
  var divisor = Math.round((Math.pow(10, y) - 1));

  /* "shorten" the fraction */
  var d = Math.gcd(dividend, divisor);
  if (d > 1)
  {
    dividend /= d;
    divisor /= d;
  }
    
  var result = dividend + "/" + divisor;
    
  return result;
};


/** @subsection Trigonometry */

Math.dtRad  = 0;
Math.dtDeg  = 1;
Math.dtGrad = 2;

/**
 * Unlike the {@link js#Math built-in methods}, the following
 * functions accept a second argument to determine if the argument
 * should be handled as radiant (dtRad == 0 [default];
 * x = n*[0..2*Math.PI], degree (dtDeg == 1; x = n*[0..360]?)
 * or gradiant (dtGrad == 2; x = n*[0..300]grd) value.
 */

/**
 * @param x : number
 * @param iArgType : number
 * @return number
 *   The sine of <var>x</var>
 */
Math.sinX = function(x, iArgType) {
  switch (iArgType)
  {
    case dtDeg:
      x = x/180 * Math.PI;
      break;

    case dtGrad:
      x = x/300 * Math.PI;
  }

  return Math.sin(x);
};

/**
 * @param x : number
 * @param iArgType : number
 * @return number
 *   The cosine of <var>x</var>
 */
Math.cosX = function(x, iArgType) {
  switch (iArgType)
  {
    case dtDeg:
      x = x/180 * Math.PI;
      break;
      
    case dtGrad:
      x = x/300 * Math.PI;
  }
  
  return Math.cos(x);
};

/**
 * @param x : number
 * @param iArgType : number
 * @return number
 *   The tangent of x.  If @link{js#Math.tan()} is
 *   undefined, it uses @link{#sinX()} and @link{#cosX()}
 *   defined above.
 * @requires jsx.object#isMethod()
 */
Math.tanX = function(x, iArgType) {
  var jsx_object = jsx.object;
  
  switch (iArgType)
  {
    case dtDeg:
      x = x/180 * Math.PI;
      break;
      
    case dtGrad:
      x = x/300 * Math.PI;
  }
  
  if (jsx_object.isMethod(Math, "tan"))
  {
    return Math.tan(x);
  }
  else
  {
    return (Math.sinX(x) / Math.cosX(x));
  }
};

if (!jsx.object.isMethod(Math, "tan"))
{
  Math.tan = Math.tanX;
}


/** @subsection Complex numbers */

/**
 * @param nRe : number
 * @param nIm : number
 */
Math.Complex = function(nRe, nIm) {
  Number.call(this);
  this.re = Number(nRe) || 0;
  this.im = Number(nIm) || 0;
};
Math.Complex.extend(Number);

/**
 * @param a : Complex
 * @param b : Complex
 * @return Complex
 *   The complex sum of <var>a</var> and <var>b</var>
 */
Math.addComplex =
Math.Complex.prototype.add = function(a, b) {
  var result = null;
  var math = Math;

  if (this instanceof math.Complex)
  {
    b = a;
    a = this;
  }

  if (a && b)
  {
    if (!(a instanceof math.Complex))
    {
      a = new Math.Complex(a);
    }

    if (!(b instanceof math.Complex))
    {
      b = new math.Complex(b);
    }

    return new math.Complex(a.re + b.re, a.im + b.im);
  }
};

/**
 * @param a : Complex
 * @param b : Complex
 * @return Complex
 *   The complex product of <var>a</var> and <var>b</var>
 */
Math.mulComplex =
Math.Complex.prototype.mul = function(a, b) {
  var result = null;

  if (this instanceof Math.Complex)
  {
    b = a;
    a = this;
  }

  if (a && b)
  {
    if (!(a instanceof Math.Complex))
    {
      a = new Math.Complex(a);
    }

    if (!(b instanceof Math.Complex))
    {
      b = new Math.Complex(b);
    }
     
    //  a.re, a.im     b.re, b.im
    // (a,    b   ) * (c,    d   ) = (a * c - b * d, a * d + b * c)
    return new Math.Complex(
      a.re * b.re - a.im * b.im,
      a.re * b.im + a.im * b.re);
  }
};

/*
 * TODO: Hyperbolic functions
 */

/** @section Number systems */

/**
 * @author
 *   Copyright (c) 2003, 2004 Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/math.js
 * @param nDec : optional number = 0
 *   Optional. Decimal number to be converted to another number
 *   system. No conversion is performed if <var>nDec</var> is
 *   the default 0 (zero).
 * @param iBase : optional number = 2
 *   Optional. Base of the number system to which <var>nDec</var>
 *   should be converted. Use 2 for binary, 8 for octal, 16 for
 *   hexadecimal aso. No conversion is performed if <var>iBase</var>
 *    ist 10 (decimal, the default) or not provided.
 * @param iLength : optional number
 *   Optional. If provided and greater that 0, this argument
 *   specifies the length of the resulting string. If the result
 *   is shorter than <var>iLength</var>, leading zeroes are
 *   added until the result is as long as <var>iLength</var>.
 * @return type string
 *   <var>nDec</var> converted to the number system specified
 *   with <var>iBase</var> in lowercase, optionally with leading
 *   zeroes.  Uses Number.toString(<var>iBase</var>) is supported, an
 *   algorithm to convert both the integer and the fractional
 *   part otherwise.
 * @see Global#parseFloat(any)
 * @see Global#parseInt(any)
 */
Math.dec2base = function(nDec, iBase, iLength) {
  // default values
  if (!nDec)
  {
    nDec  = 0;
  }
  
  if (!iBase)
  {
    /* binary */
    iBase = 2;
  }
  
  var sResult = "";
  /* if converting with toString() is poss. */
  if ((15).toString(16).length == 1)
  {
    sResult = Number(nDec).toString(iBase);
  }
  else
  {
    var f = nDec % 1;
    var aDigits = new Array();

    var i;
    if (nDec != 0 && iBase != 10)
    {
      /*
       * No calculation required if number is 0 or target base is decimal
       */
      
      /* Create array of _required_ digits */
      for (i = 0; i < (iBase < 10 ? iBase : 10); i++)
      {
        aDigits[aDigits.length] = i;
      }
      
      if (iBase > 10)
      {
        var iFirstLetter = "a".charCodeAt(0);
        for (i = iFirstLetter; i < iFirstLetter + iBase - 10; i++)
        {
          aDigits[aDigits.length] = String.fromCharCode(i);
        }
      }
  
      nDec = Math.floor(nDec);
      while (nDec > 0)
      {
        sResult = aDigits[nDec % iBase] + sResult;
        nDec = Math.floor(nDec / iBase);
      }

      if (f > 0)
      {
        sResult += ".";
  
        while (f > 0 && sResult.length < 255)
        {
          f *= iBase;
          
          /* get integer part */
          i = Math.floor(f);
          
          /* append fraction digit */
          sResult += aDigits[i];
          f -= i;
        }
      }
    }
  }

  if (iLength)
  {
    while (sResult.length < iLength)
    {
      sResult = "0" + sResult;
    }
  }
  
  return sResult;
};

/** @section Stochastics */

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

/** @section Linear Algebra */

/**
 * @param A
 * @return number
 *   the row dimension of <code>A</code>;
 *   1 if <code>A</code> is a scalar,
 *   greater than 1 if <code>A</code> is a vector or a matrix.
 *
 * <pre>
 * Term            X           x                 dimRow(x)
 * --------------------------------------------------------
 * scalar          1           1                 1
 * 
 * mX1 col vector (1)
 *                (2)          [1, 2, ..., m]    m
 *                (.)
 *                (m)
 *
 * 1Xn row vector (1 2 ... n)  [[1, 2, ..., n]]  1
 * 
 *                (1 2 ... n)  [[1, 2, ..., n],
 * mXn matrix     (2 . ... .)   [2, ...      ],  m
 *                (. . ... .)   [...         ],
 *                (m . ... .)   [m, ...      ]]
 * </pre>
 */
Math.dimRow = function(A) {
  return (A instanceof Array
    ? A.length
    : 1);
};

/**
 * @param A
 * @return number
 *   The column dimension of <code>A</code>, provided all
 *   rows of <code>A</code> have the same length (as the first one);
 *   0 if <code>A</code> is a scalar,
 *   greater than 0 if <code>A</code> is a vector or a matrix.
 *
 * <pre>
 * Term            X           x                 dimCol(x)
 * --------------------------------------------------------
 * scalar          1           1                 0
 * 
 * mX1 col vector (1)
 *                (2)          [1, 2, ..., m]    1
 *                (.)
 *                (m)
 *
 * 1Xn row vector (1 2 ... n)  [[1, 2, ..., n]]  n
 * 
 *                (1 2 ... n)  [[1, 1, ..., n],
 * mXn matrix     (2 . ... .)   [2, ...      ],  n
 *                (. . ... .)   [...         ],
 *                (m . ... .)   [m, ...      ]]
 * </pre>
 */
Math.dimCol = function(A) {
  return (
    typeof (A = A[0]) != "undefined"
      ? (A[0] instanceof Array ? A[0].length : 1)
      : 0);
};

/**
 * @param A
 * @return the square root of the product of A's row dimension
 * and its column dimension.  The return value indicates
 * whether a matrix A is square or not; for square matrices,
 * the return value is an integer.  It also serves as a
 * means to determine if two matrices are compatible;
 * if their dimensions differ, they cannot be added to
 * one another.
 * @see Math#matrixAdd()
 */
Math.dim = function(A) {
  return Math.sqrt(Math.dimRow(A) * Math.dimCol(A));
};


/** @subsection Matrix Operations */

/**
 * Creates a Matrix object, encapsulating an mXn-dimensional
 * matrix represented by an array of arrays.
 * 
 * @param A : optional Array
 */
Math.Matrix = function(A) {
  this.data = [0];

  if (A)
  {
    if (jsx.object.isMethod(A, "slice"))
    {
      this.data = A.slice(0);
    }
    else
    {
      for (var i = A.length; i--;)
      {
        var row = A[i];
        this.data[i] = [];
        for (var j = row.length; j--;)
        {
          this.data[i][j] = row[j];
        }
      }
    }
  }
};

Math.Matrix.prototype = {
  constructor: Math.Matrix,
  
  putValue: function (x, y, value) {
    var tmp = this.data;

    for (var i = 0, len = arguments.length; i < len - 2; ++i)
    {
      var arg = arguments[i];
      if (typeof tmp[arg] == "undefined")
      {
        tmp[arg] = [];
      }

      tmp = tmp[arg];
    }
    
    var lastArgs = Array.prototype.slice.call(arguments, i);
    tmp[lastArgs[0]] = lastArgs[1];

    return lastArgs[1];
  },

  getValue: function (x, y) {
    var tmp = this.data;

    for (var i = 0, len = arguments.length; i < len; ++i)
    {
      var arg = arguments[i];
      tmp = tmp[arg];

      if (typeof tmp == "undefined")
      {
        break;
      }
    }

    return tmp;
  },

  inc: function (x, y) {
    var
      coords = Array.prototype.slice.call(arguments, 0),
      v = +this.getValue.apply(this, coords);

    return this.putValue.apply(
      this, coords.concat((isNaN(v) ? 0 : +v) + 1));
  },
  
  toString:
    /**
     * Returns the matrix converted to string, i.e.
     * elements of arrays arranged in rows and columns.
     * Makes use of string.js#format() if available.
     * 
     * @param m : optional Matrix
     * @return string
     * @todo
     */
    function(m) {
      if (!m)
      {
        m = this;
      }
  
      if ((m = m.data))
      {
        var as = [], bHasFormat = (typeof format != "undefined"), maxLen;
        if (bHasFormat)
        {
          maxLen = Math.max(m);
        }
  
        for (var i = 0, len = m.length; i < len; i++)
        {
          var row = m[i];
          if (bHasFormat)
          {
            as[i] = format("%*$s", row, maxLen + 1);
          }
          else
          {
            as[i] = row.join(" ");
          }
        }
      }
  
      return as.join("\n");
    },

  minor:
    /**
     * Returns the minor of the matrix, i.e. the matrix produced
     * by removing the original's first row and i-th column.
     * 
     * @param i : number
     * @param m : optional Matrix
     * @return string
     * @todo
     */
    function(i, m) {
      if (!m)
      {
        m = this;
      }
  
      if ((m = m.data))
      {
        m = new Math.Matrix(m);
        m.data = m.data.slice(1);
        var j;
        for (m, j = (m = m.data).length; j--;)
        {
          m[j].splice(i, 1);
        }
      }
  
      return m;
    }
};

/**
 * @param a
 * @param b
 * @return Array
 *   The sum of the matrixes <var>a</var> and <var>b</var>
 */
Math.matrixAdd = function(a, b) {
  /*
   * x00 x01 x02   y00 y01 y02   x00+y00 x01+y01 x02+y02
   * x10 x11 x12 + y10 y11 y12 = x10+y10 x11+y11 x12+y12
   * x20 x21 x22   y20 y21 y22   x20+y20 x21+y21 x22+y22
   */
  var result = new Array();

  var dimA, dimB;
  if ((dimA = Math.dim(a)) == (dimB = Math.dim(b)))
  {
    for (var i = 0, a_len = Math.dimRow(a); i < a_len; i++)
    {
      result[i] = new Array();
      for (var j = 0, ai_len = Math.dimCol(a); j < ai_len; j++)
      {
        result[i][j] = a[i][j] + b[i][j];
      }
    }
  }
  else
  {
    throwException(new Math.InvalidOperandError(
        "First matrix's dimension (" + dimA
      + ") != second matrix's dimension (" + dimB + ")"));
    return null;
  }
  
  return result;
};

/**
 * This routine uses the dimensions of <var>a</var> and <var>b</var>
 * to choose the corresponding multiplication routine.  The argument
 * dimensions, the dimension of the corresponding result,  and the
 * multiplication routine that is called are shown in the following
 * table.
 <pre>
               B

   A           qXn                   1Xn                         qX1
               Matrix                row Vector                  col Vector            scalar

   mXq         mXn Matrix            ERROR                       mX1 col Vector        mXq Matrix
   Matrix      MatrixMatrixMultiply                              MatrixVectorMultiply  MatrixScalarMultiply

   1Xq         1Xn row Vector        ERROR                       scalar                1Xq Vector
   row Vector  VectorMatrixMultiply                                                    VectorScalarMultiply

   mX1         ERROR                 mXn Matrix (outer product)  ERROR                 mX1  Vector
   col Vector                        OuterProductMatrix                                VectorScalarMultiply

               qXn Matrix            1Xn row Vector              qX1 col Vector        scalar
   scalar      MatrixScalarMultiply  VectorScalarMultiply        VectorScalarMultiply  standard multipliction
 </pre>

 * @param a
 * @param b
 * @return number|Array
 * @throws Math#InvalidOperandError
 */
Math.multiply = function(a, b) {
  /*
   * x00 x01 ...   y00 y01 ...
   * x10 x11 ... * y10 y11 ...
   * ... ... ...   ... ... ...
   *
   *   x00*y00+x01*y10+...*... x00*y01+x01*y11+...*... x00*...+x01*...+...*...
   * = x10*y10+x11*y10+...*... x10*y01+x11*y11+...*... x00*...+x01*...+...*...
   *   ...*...+...*...+...+... ...*y01+...*y11+...*... x00*...+x01*...+...*...
   */
  
  var dimRowX = Math.dimRow(a);
  var dimColX = Math.dimCol(a);
  var dimRowY = Math.dimCol(b);
  var dimColY = Math.dimCol(b);
  if ((dimRowX && dimColX) || (dimRowY && dimColY))
  {
    if (dimRowX || dimRowY)
    {
//      if (dimRowX && d
      result = matrixMatrixMultiply(a, b);
    }
    else if (isArray(a) && !isArray(b))
    {
      if (isArray(a[0]))
      {
        // ...
      }
      result = matrix;
    }
    
    var result = new Array();
    // matrixMultiply
  }
  else
  {
    result = a * b;
  }
  
  var x_len = a.length;
  var y_len = b.length;
  for (var i = 0, j, xi_len, sum = 0, k;
       i < x_len;
       i++)
  {
    result[i] = new Array();
    xi_len = a[i].length;
    for (j = 0;
         j < xi_len;
         j++, sum = 0)
    {
      if (y_len != xi_len)
      {
        throwException(new Math.InvalidOperandError(
            "First matrix's column dimension (" + xi_len
          + ") != second matrix's row dimension (" + y_len + ")"));
        return null;
      }
      sum += a[i][k] + b[k][i];
    }
    result[i][j] = sum;
  }
  
  if (result.length == 1 && result[i].length == 1)
  {
    result = result[0][0];
  }
  
  return result;
};

/*
 * TODO:
 
"I want the *option* to switch from standard 32-bit doubles to double
precision long doubles since it is not always necessary to run at such
high precision [sometimes I'll trade performance for precision.]

I would like *native* precision handlers (anything scripted
is considerably slower).

I would like a native fixed point and integer math package."

 */
