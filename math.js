/**
 * <title>PointedEars' JSX: Math Library</title>
 * @partof
 *   PointedEars' JavaScript Extensions (JSX)
 * @requires types.js
 *
 * @section Copyright & Disclaimer
 * 
 * @author
 *   (C) 2000-2004  Thomas Lahn &lt;string.js@PointedEars.de&gt;
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

Math.version   = "1.16.2004060607";
Math.copyright = "Copyright \xA9 1999-2004";
Math.author    = "Thomas Lahn";
Math.email     = "math.js@PointedEars.de";
Math.path      = "http://pointedears.de/scripts/";
// Math.docURL = Math.path + "math.htm";

// User interface language
Math.language  = "en";

/** @section Exceptions */

function Exception(/** @optional string */ sText)
{
  this.text = (sText || "");
}

var msgInvArg =
  {'en': 'Invalid function argument',
   'de': 'Ungültiges Funktionsargument'};
var msgArgMissing =
  {'en': 'Required argument missing',
   'de': 'Erforderliches Argument fehlt'};
var msgInvOp =
  {'en': 'Invalid operand',
   'de': 'Ungültiger Operand'};
var msgOverflow =
  {'en': 'Overflow',
   'de': 'Überlauf'};
var msgUnderflow =
  {'en': 'Underflow',
   'de': 'Unterlauf'};
var msgDivByZero =
  {'en': 'Division by zero',
   'de': 'Division durch Null'};

function MathErrorException(sError, sMessage)
{
  throw new Exception(
      "math.js Error: "
    + (typeof sError[Math.language] != "undefined"
         ? sError[Math.language]
         : sError["en"])
    + " " + (sMessage || ""));
}

function InvalidArgumentException(sMethodCall, iErrorCode)
{
  var sSubErrType = msgInvArg;
  
  switch (nErrorCode)
  {
    case -1:
      sSubErrType = msgArgMissing;
      break;
  }
  throw new MathErrorException(sSubErrType);
}

function InvalidOperandException()
{
  throw new MathErrorException(msgInvOp);
}

function OverflowException()
{
  throw new MathErrorException(msgOverFlow);
}

function UnderflowException()
{
  throw new MathErrorException(msgUnderflow);
}

function ZeroDivideException()
{
  throw new MathErrorException(msgDivByZero);
}


/** @section Intervals */

/**
 * Specifies a numeric interval, closed by default.
 *
 * @argument number nLeftBorder, @property number leftBorder = 0, 
 *   Specifies the left border of the interval.
 * @argument boolean bLeftOpen, @property boolean leftOpen = false
 *   If true, specifies that the interval is open
 *   on the left, meaning that its left border
 *   is not part of the interval.
 * @argument number nRightBorder, @property number rightBorder = 1
 *   Specifies the right border of the interval.
 * @argument boolean bRightOpen, @property boolean rightOpen = false
 *   If true, specifies that the interval is open
 *   on the right, meaning that its right border
 *   is not part of the interval.
 */
function Interval(nLeftBorder, nRightBorder, bLeftOpen, bRightOpen)
{
  this.leftBorder  = Number(nLeftBorder)  || 0;
  this.leftOpen    = Boolean(bLeftOpen)   || false;
  this.rightBorder = Number(nRightBorder) || 1;
  this.rightOpen   = Boolean(bRightOpen)  || false;
}

/**
 * @argument number   n,
 * @optional Interval o
 */
function isInInterval(n, o)
{
  var result = false;

  if (!(o instanceof Interval) && this instanceof Interval)
  {
    o = this;
  }

  if (o instanceof Interval)
  {
    result =
      (((o.leftOpen && n > o.leftBorder)
       || (!o.leftOpen && n >= o.leftBorder))
      &&
      ((o.rightOpen && n < o.rightBorder)
       || (!o.rightOpen && n <= o.rightBorder)));
  }
  
  return result;
}

/**
 * @arguments number
 */ 
function getRightOpenIntervals(borders)
{
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
}

/**
 * @argument number     n
 * @argument [Interval] a
 * @returns
 *   the index of the first interval in @{(a)} that contains @{(n)},
 *   -1 if there is no (such) interval.
 */
function getIntervalIndex(n, a)
{
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
}

Interval.prototype.addProperties(
  {'contains':              isInInterval,
   'getRightOpenIntervals': getRightOpenIntervals,
   'getIntervalIndex':      getIntervalIndex
  }
);


/** @section Integer arithmetics */

/**
 * Returns the greatest common divisor (GCD) of two integers
 * @{(a)} and @{(b)}, implementing (the optimized form of) the
 * Euclidean algorithm (also called Euclid's algorithm).  The
 * GCD of two integer arguments is the largest positive integer
 * that both arguments are integer multiples of, i.e. by which
 * either argument can be divided without remainder.  Since
 * integers are required, the floor of @{(a)} and @{(b)} will
 * be used for computation.
 *
 * @argument number a
 * @argument number b
 * @return type number
 *   The GCD of @{(a)} and @{(b)};
 *   <code>NaN</code> if an argument is not a number.
 * @see js#Math.floor()
 */
function gcd(a, b)
{
  if (isNaN(a) || isNaN(b))
  {
    return NaN;
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
Math.gcd = gcd;

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
 * @arguments number
 * @return type number
 *   The GCD of the arguments;
 *   <code>NaN</code> if one or more arguments are not a number.
 * @see js#Math.floor()
 */
function gcdN()
{
  
  return Math.abs(a);
}
Math.gcdN = gcd; // Currently supports only 2 integers

/**
 * Returns the least common multiple (LCM) of two integers
 * @{(a)} and @{(b)}.  The LCM of two integer arguments is
 * the smallest positive integer that is a multiple of the
 * arguments.  If there is no such positive integer, i.e.,
 * if either argument is zero, then <code>lcm(a, b)</code>
 * is defined to be zero.  Since integers are required, the
 * floor of @{(a)} and @{(b)} will be used for computation.
 *
 * @argument number a
 * @argument number b
 * @return type number
 *   The LCM of @{(a)} and @{(b)};
 *   <code>0</code> if an argument is <code>0</code>;
 *   <code>NaN</code> if an argument is not a number.
 * @see js#Math.floor(), #gcd()
 */
function lcm(a, b)
{
  if (isNaN(a) || isNaN(b))
  {
    return NaN;
  }
    
  if (!a || !b)
  {
    return 0;
  }

  a = Math.floor(a);
  b = Math.floor(b);
  
  return ((a * b) / gcd(a, b));
}
Math.lcm = lcm;

/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @argument number n
 *   If <code>n</code> is not an integer,
 *   <code>Math.floor(n)</code> is used.
 * @return type number
 *   The factorial of @{(n)} (@{(n)}<code><b>!</b></code>)
 *   which is (for practical reasons) implemented here as follows:
 *   @ifdef{MathML2}
 *     <math xmlns="&mathml;">
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
 * @throws OverflowException
 */
function fac(n)
{
  if (n % 1)
  {
    n = Math.floor(n);
  }

  var result = 1;

  if (n > 0)
  {
    for (var i = 2; i <= n; i++)
    {
      if (result < Number.POSITIVE_INFINITY)
      {
        result *= i;
      }
      else
      {
        result = 0;
        // [Exception] <- [MathErrorException] <- [OverflowException] }
        throw new OverflowException("fac");
        break;
      }
    }
  }
    
  return result;
}

/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @argument number nBase
 * @argument number iExponent
 * @return type number
 */
function powInt(nBase, iExponent)
{
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
}
Math.powInt = powInt;

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
 * @argument number nBase
 * @argument number nExponent
 * @throws
 *   InvalidArgumentException
 * @return type number
 *   NaN if computation result lies beyond real numbers,
 *   the result (as double-precision floating-point number)
 *   otherwise.
 */
function power(nBase, nExponent)
{
  var result;

  if (nBase != 0)
  {
    // e^(Exponent * ln(|Base|))
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
        result = NaN;
        // [Exception]<- [MathErrorException] <- [InvalidArgumentException]
        throw new InvalidArgumentException(
          "power(" + nBase + ", " + nExponent + ")"); 
      }
    }
    else if (Base == 0 && nExponent == 0)
    {
      result = 0;
      throw new InvalidArgumentException(
        "power(" + nBase + ", " + nExponent + ")");
    }
  }
  
  return result;
}
Math.power = power;

/**
 * @return type number
 *   The logarithm of <code>x</code> to the base <code>nBase</code>.
 *
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @argument number x
 * @argument number nBase
 */
function logN(x, nBase)
{
  return Math.log(x) / Math.log(nBase);
}
Math.logN = logN;

/**
 * @author
 *   (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 *
 * @argument number x
 * @return type number
 *   The logarithm digitalis (<code>ld</code>) of <code>x</code>
 *   (the logarithm of <code>x</code> to the base 2).
 */
function log2(x)
{
  return logN(x, 2);
}
Math.log2 = log2;

/**
 * Computes the decimal logarithm (<code>lg</code>) of
 * <code>x</code> (the log. of <code>x</code> to the base 10).
 *
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @argument number x
 * @return type number
 */
function log10(x)
{
  return logN(x, 10);
}
Math.log10 = log10;

/**
 * @author
 *   (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @argument number x
 * @return type number
 *   the reciprocal of <code>x</code> (<code>1/x</code>).
 */
function rec(x)
{
  return (1 / x);
}
Math.rec = rec;

/** @section Floating-point arithmetics */

/**
 * @arguments
 * @returns the minimum value passed by its arguments.
 * If an argument is an object (incl. Array objects),
 * the values of its enumerable properties are also
 * evaluated.  If no arguments are provided, returns
 * <code>Number.POSITIVE_INFINITY</code>.
 */
function minN()
{
  var result = Number.POSITIVE_INFINITY;
  var a, j;
    
  for (var i = 0; i < arguments.length; i++)
  {
    a = arguments[i];
    if (isArray(a))
    {
      for (j = 0; j < a.length; j++)
      {
        if (a[j] < result)
        {
          result = a[j];
        }
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        if (a[j] < result)
        {
          result = a[j];
        }
      }
    }
    else if (a < result)
    {
      result = a;
    }
  }
  
  return result;
}
Math.minN = minN;

/**
 * @arguments 
 * @returns the maximum value passed by its arguments.
 * If an argument is an object (incl. Array objects),
 * the values of its enumerable properties are also
 * evaluated.  If no arguments are provided, returns
 * <code>Number.NEGATIVE_INFINITY</code>.
 */
function maxN()
{
  var result = Number.NEGATIVE_INFINITY;
  var a, j;
    
  for (var i = 0; i < arguments.length; i++)
  {
    a = arguments[i];
    if (isArray(a))
    {
      for (j = 0; j < a.length; j++)
      {
        if (a[j] > result)
        {
          result = a[j];
        }
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        if (a[j] > result)
        {
          result = a[j];
        }
      }
    }
    else if (a > result)
    {
      result = a;
    }
  }
  
  return result;
}
Math.maxN = maxN;

/**
 * @arguments
 * @return type number
 *   The average value of its arguments.
 *   If an argument is an object (incl. Array objects),
 *   the values of its enumerable properties are also
 *   evaluated.  If no arguments are provided, returns
 *   <code>0</code>.
 */
function avgN()
{
  var sum = 0;
  var count = 0;

  for (var i = 0, a, j; i < arguments.length; i++)
  {
    a = arguments[i];
    if (isArray(a))
    {
      for (j = 0; j < a.length; j++)
      {
        count++;
        sum += a[j];
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        count++;
        sum += a[j];
      }
    }
    else
    {
      count++;
      sum += a;
    }
  }
  
  return (sum / count);
}
Math.avgN = avgN;

/**
 * @argument number n
 *   Number of which to compare the <code>iRoot</code>-th root.
 * @optional number iRoot = 2
 *   Root exponent. If not integer, the floor (largest integer
 *   less than the argument) of <code>iRoot</code> is used.
 * @return type number
 */ 
function root(n, iRoot)
{
  return (iRoot % 2 && n < 0 ? -1 : +1)
         * Math.pow(Math.abs(n), 1/Math.floor(iRoot));
}
Math.root = root;

/**
 * @argument number n
 * @return type number
 *   The square value of <code>n</code>, i.e.
 *   <code>Math.pow(n, 2)</code>.
 * @author (c) 2003  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */ 
function sqr(n)
{
  return Math.pow(n, 2);
}
Math.sqr = sqr;

/** 
 * @argument number n
 * @return type number
 *   The cubic value of <code>n</code>, i.e.
 *   <code>Math.pow(n, 3)</code>.
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
function cub(n)
{
  return Math.pow(n, 3);
}
Math.cub = cub;

/**
 * @argument number n
 * @return type number
 *   the cubic root of <code>n</code>, i.e.
 *   <code>Math.pow(n, 1/3)</code>, but also works
 *   with negative values of <code>n</code>.
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */ 
function cubrt(n)
{
  return root(n, 3);
}
Math.cubrt = cubrt;


/** @subsection Rounding */

// Original round function from JavaScript-FAQ (http://dcljs.de/faq)
// Why not this way?

function roundDigits_deprecated(x, n) {
  if (n < 1 || n > 14) return false;
    /* Impossible to round left to point;
       Returns non-numeric value if invalid number of digits
       which causes further calculations to fail (NaN) although
       they could succeed 
    */
  
  var e = Math.pow(10, n);

  var k = (Math.round(x * e) / e).toString();
    /* Do not use toString() because it is part of JavaScript 1.1
       and not all JavaScript capable browsers support it.
       Use the String(...) function instead.
    */
  
  if (k.indexOf('.') == -1) k += '.';
    /* Sometimes it is not desired to have the decimal point
       when dealing with integers. The function does not allow 
       output without point. A further argument is required.
    */

  k += e.toString().substring(1);
    /* See above: Do not use Numeric.toString(...) method.
    */

  return k.substring(0, k.indexOf('.') + n+1);
    /* Why this complicated though it could be much more simple? */
}

/**
 * @argument number n
 *   Numeric value to round. Required.
 * @optional number iSigDecimals
 *   Significant decimals to round to. If negative
 *   round to positive powers of 10. Optional.
 *   If out of the closed interval of [-14;14], the
 *   function exits and returns n (unchanged).
 *   If not provided, assume 0 and round the value to
 *   a whole number.
 * @optional number iForceDecimals
 *   Number of digits to be returned with the number.
 *   If smaller than iSigDigits, the value will be
 *   ignored and the result is a Numeric value.
 *   Otherwise the required number of zeroes will be
 *   appended and the result is a String value.
 *   Optional.
 * @optional number bForceLeadingZero
 *   If true, force leading zero if the value is between
 *   0 and 1 or 0 and -1. The argument is optional.
 *   If not provided, apply bForceLeadingZero=false;
 * @optional string sDecSeparator
 *   The character used for decimal delimiter instead.
 *   In English speaking countries the point (".")
 *   is used instead of comma (",") and vice-versa.
 *   Optional. If not provided, use default decimal
 *   separator. If provided, the result is a String value.
 * @return type number
 */ 
function roundDigits(
  n, iSigDecimals, iForceDecimals, bForceLeadingZero, sDecSeparator)
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
    
    for (i = k.substr(k.indexOf(".") + 1).length;
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
      k = k.substring(0, i) + sDecSeparator + k.substr(i + 1);
    }
  }
  
  return k;
}
Math.roundDigits = roundDigits;


/** @subsection Rational arithmetics */

/**
 * Returns the period of a number, i.e. a repeated 
 * substring of its decimals that entirely make up
 * following decimals.
 *
 * @argument number  n
 *   The number of which the period should be found out.
 * @optional boolean bLoose = false
 *   If <code>true</code>, triggers Loose Mode
 *   which notes <code>iPrecision</code>.
 * @optional number  iPrecision = 14
 *   In Loose Mode, defines the maximum number
 *   of decimals to parse for a period. The default
 *   is 14 (one less than maximum known precision).
 * @return type string
 *   The period of <code>n</code> as a string;
 *   "0" if there is none.
 */ 
function getPeriod(n, bLoose, iPrecision)
{
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
}
Math.getPeriod = getPeriod;

/**
 * @return type string
 */ 
function toFraction(fDec)
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
{
  var y = this.getPeriod(fDec).length;
  var z = fDec * Math.pow(10, y);
  var dividend = Math.round(z - fDec);
  var divisor = Math.round((Math.pow(10, y) - 1));

  // "shorten" the fraction
  var d = this.gcd(dividend, divisor);
  if (d > 1)
  {
    dividend /= d;
    divisor /= d;
  }
    
  var result = dividend + "/" + divisor;
    
  return result;
}


/** @subsection Trigonometry */

var dtRad  = 0;
var dtDeg  = 1;
var dtGrad = 2;

/**
 * Unlike the @link{built-in methods:js#Math}, the following
 * functions accept a second argument to determine if the argument
 * should be handled as radiant (dtRad == 0 [default];
 * x = n*[0..2*Math.PI], degree (dtDeg == 1; x = n*[0..360]°)
 * or gradiant (dtGrad == 2; x = n*[0..300]grd) value.
 */

/**
 * @argument number x
 * @argument number iArgType
 * @return type number
 */ 
function sin(x, iArgType)
{
  switch (iArgType)
  {
    case dtDeg:
      x = x/180 * Math.PI;
      break;

    case dtGrad:
      x = x/300 * Math.PI;
  }

  return Math.sin(x);
}
Math.sinX = sin;

/**
 * @argument number x
 * @argument number iArgType
 * @return type number
 */ 
function cos(x, iArgType)
{
  switch (iArgType)
  {
    case dtDeg:
      x = x/180 * Math.PI;
      break;
      
    case dtGrad:
      x = x/300 * Math.PI;
  }
  
  return Math.cos(x);
}
Math.cosX = cos;

/**
 * @argument number x
 * @argument number iArgType
 * @return type number
 */ 
function tan(x, iArgType)
/**
 * Returns the tangens of x.  If @link{js#Math.tan()} is
 * undefined, it uses @link{#sinX()} and @link{#cosX()}
 * defined above.
 * @requires types#isMethodType()
 */
{
  switch (iArgType)
  {
    case dtDeg:
      x = x/180 * Math.PI;
      break;
      
    case dtGrad:
      x = x/300 * Math.PI;
  }
  
  if (isMethodType(typeof Math.tan))
  {
    return Math.tan(x);
  }
  else
  {
    return (sinX(x) / cosX(x));
  }
}
Math.tanX = tan;
if (!isMethodType(typeof Math.tan))
{
  Math.tan = tan;
}


/** @subsection Complex numbers */

function Complex(nRe, nIm)
{
  Number.call(this);
  this.re = Number(nRe) || 0;
  this.im = Number(nIm) || 0;
}
Complex.prototype = new Number;

function addComplex(a, b)
{
  var result = null;

  if (this instanceof Complex)
  {
    b = a;
    a = this;
  }

  if (a && b)
  {
    if (!(a instanceof Complex))
    {
      a = new Complex(a);
    }

    if (!(b instanceof Complex))
    {
      b = new Complex(b);
    }

    return new Complex(a.re + b.re, a.im + b.im);
  }
}
Complex.prototype.add = addComplex;

function mulComplex(a, b)
{
  var result = null;

  if (this instanceof Complex)
  {
    b = a;
    a = this;
  }

  if (a && b)
  {
    if (!(a instanceof Complex))
    {
      a = new Complex(a);
    }

    if (!(b instanceof Complex))
    {
      b = new Complex(b);
    }
     
    //  a.re, a.im     b.re, b.im
    // (a,    b   ) * (c,    d   ) = (a * c - b * d, a * d + b * c)
    return new Complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  }
}
Complex.prototype.mul = mulComplex;

/*
 * TODO: Hyperbolic functions
 */

/** @section Number systems */

/**
 * @author
 *   Copyright (c) 2003, 2004 Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/math.js
 * @optional number nDec = 0
 *   Optional. Decimal number to be converted to another number
 *   system. No conversion is performed if <var>nDec</var> is
 *   the default 0 (zero).
 * @optional number iBase = 2
 *   Optional. Base of the number system to which <var>nDec</var>
 *   should be converted. Use 2 for binary, 8 for octal, 16 for
 *   hexadecimal aso. No conversion is performed if <var>iBase</var>
 *    ist 10 (decimal, the default) or not provided.
 * @optional number iLength
 *   Optional. If provided and greater that 0, this argument
 *   specifies the length of the resulting string. If the result
 *   is shorter than <var>iLength</var>, leading zeroes are
 *   added until the result is as long as <var>iLength</var>.
 * @return type string
 *   <var>nDec</var> converted to the number system specified
 *   with @{(iBase)} in lowercase, optionally with leading
 *   zeroes.  Uses Number.toString(@{(iBase)}) is supported, an 
 *   algorithm to convert both the integer and the fractional
 *   part otherwise.
 * @see
 *   js#parseFloat(), js#parseInt()
 */ 
function dec2base(nDec, iBase, iLength)
{
  // default values
  if (!nDec)
  {
    nDec  = 0;
  }
  
  if (!iBase)
  {
    iBase = 2; // binary
  }
  
  var sResult = "";
  if ((15).toString(16).length == 1) // if converting with toString() is poss.
  {
    sResult = Number(nDec).toString(iBase);
  }
  else
  {
    var f = nDec % 1;
    var aDigits = new Array();

    var i;
    if (nDec != 0 && iBase != 10) 
    { // No calculation required if number is 0 or target base is decimal
      // Create array of _required_ digits
    
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
          i = Math.floor(f);     // get integer part
          sResult += aDigits[i]; // append fraction digit
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
}
Math.dec2base = dec2base;


/** @section Stochastics */

/**
 * Returns a uniformly distributed random value in the
 * closed interval
 * [<code>iLeftBorder</code>, <code>iRightBorder</code>]
 * (including <code>iLeftBorder</code> and
 * <code>iRightBorder</code>).
 * 
 * @author
 *   (C) 2000-2003 Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @optional number nLeftBorder
 *   Left border of the interval. If left out, <code>null</code>
 *   or <code>undefined</code>, <code>-Number.MAX_VALUE</code> is
 *   assumed.
 * @optional number iRightBorder
 *   Right border of the interval. If left out, <code>null</code>
 *   or <code>undefined</code>, <code>Number.MAX_VALUE</code> is
 *   assumed.
 * @argument Function fRandom = Math.random
 *   Function to be used for calculating the uniform random number
 *   in the open unit interval (0.0, 1.0) (excluding 0.0 and 1.0).
 *   If left out, <code>Math.random()</code> is used where the
 *   the random number generator is seeded from the current time.
 * @return type number
 * @see
 *   if, Math.random()
 */
function rand(nLeftBorder, nRightBorder, fRandom)
{
  if (iLeftBorder == null || typeof iLeftBorder == "undefined")
  {
    iLeftBorder = -Number.MAX_VALUE;
  }

  if (iRightBorder == null || typeof iRightBorder == "undefined")
  {
    iRightBorder = Number.MAX_VALUE;
  }

  if (!fRandom)
  {
    fRandom = Math.random;
  }

  return fRandom() * (iRightBorder - iLeftBorder) + iLeftBorder;
}
Math.rand = rand;

/**
 * Returns a uniformly distributed random integer value in the
 * closed interval
 * [<code>iLeftBorder</code>, <code>iRightBorder</code>]
 * (including <code>iLeftBorder</code> and
 * <code>iRightBorder</code>).
 * 
 * @author
 *   (C) 2000-2003 Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @optional number iLeftBorder
 *   Left border of the interval.  If left out, <code>null</code>
 *   or <code>undefined</code>,
 *   <code>Math.floor(-Number.MAX_VALUE)</code> is assumed.
 * @optional number iRightBorder
 *   Right border of the interval.  If left out, <code>null</code>
 *   or <code>undefined</code>,
 *   <code>Math.ceil(Number.MAX_VALUE)</code> is assumed.
 * @argument Function fRandom = Math.random
 *   Function to be used for calculating the uniform random number
 *   in the open unit interval (0.0, 1.0) (excluding 0.0 and 1.0).
 *   If left out, <code>Math.random()</code> is used where the
 *   the random number generator is seeded from the current time.
 * @return type number
 * @see
 *   js#Math.random()
 */
function randInt(iLeftBorder, iRightBorder, fRandom)
{
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
    fRandom = Math.random;
  }

  return Math.round(rand(iLeftBorder, iRightBorder, fRandom));
}
Math.randInt = randInt;

/**
 * Returns a value dependent on statistical probability.
 * 
 * @argument number nChance
 *   Statistical probability that @{(ifChance)} is returned.
 *   <code>1.0</code> means 100% of all possible cases.
 * @argument _ ifChance
 *   Value that is returned if chances are in favor of it.
 * @argument _ otherwise
 *   Value that is returned if chances are against
 *   @{(ifChance)}, i.e. the one that is returned
 *   in <code>((1 - nChance) * 100)</code>% of all
 *   possible cases.
 * @argument Function fRandom = Math.random
 *   Function to be used for calculating the uniformly
 *   distributed random number in the open unit interval
 *   <code>(0.0, 1.0)</code> (excluding 0.0 and 1.0).
 *   If left out, <code>Math.random()</code> is used where
 *   the random number generator is seeded from the current
 *   time.
 * @returns
 *   @{(ifChance)} if the chances are in favour of it,
 *   @{(otherwise)} if they are against it.
 * @see
 *   js#Math.random()
 */
function byChance(nChance, ifChance, otherwise, fRandom)
{
  if (!fRandom)
  {
    fRandom = Math.random;
  }

  return (
    fRandom() < nChance
      ? ifChance
      : otherwise);
}
Math.byChance = byChance;

/**
 * @argument number iUpper
 * @argument number iLower
 * @return type number
 *   The binomial coefficient <code>iUpper</code> over
 *   <code>iLower</code> (|_<code>iUpper</code><b>!</b> /
 *   <code>iLower<code><b>!</b>_| * (<code>iUpper</code>
 *   - <code>iLower</code>)<b>!</b>)
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
function binomCoeff(iUpper, iLower)
{
  var result = 0;
  
  if (iUpper >= iLower)
  {
    result = Math.floor(fac(iUpper) / (fac(iLower) * fac(iUpper - iLower)));
  }
  else
  {
    throw new InvalidArgumentException(
      "binomCoeff(" + iUpper + ", " + iLower + ")");
  }

  return result;
}
Math.binomCoeff = binomCoeff;


/** @section Linear Algebra */

/**
 * @return type number
 *   the row dimension of @{(a)};
 *   1 if @{(a)} is a scalar,
 *   greater than 1 if @{(a)} is a vector or a matrix.
 *
 * <pre>
 * Term            X           x                 dimRow(x)
 * --------------------------------------------------------
 * scalar          0           0                 1
 * 
 * mX1 col vector (0)
 *                (1)          [0, 1, m]         m
 *                (.)
 *                (m)
 *
 * 1Xn row vector (0 1 ... n)  [[0, 1, ..., n]]  1
 * 
 *                (0 1 ... n)  [[0, 1, ..., n],
 * mXn matrix     (1 . ... .)   [1, ...      ],  m
 *                (. . ... .)   [...         ],
 *                (m . ... .)   [m, ...      ]]
 * </pre>
 */
function dimRow(a)
{
  return (a instanceof Array
    ? a.length
    : 1);
}

/**
 * @return type number
 *   The column dimension of @{(a)}, provided all
 *   rows of @{(a)} have the same length (as the first one);
 *   0 if @{(a)} is a scalar,
 *   greater than 0 if @{(a)} is a vector or a matrix.
 *
 * <pre>
 * Term            X           x                 dimCol(x)
 * --------------------------------------------------------
 * scalar          0           0                 0
 * 
 * mX1 col vector (0)
 *                (1)          [0, 1, m]         1
 *                (.)
 *                (m)
 *
 * 1Xn row vector (0 1 ... n)  [[0, 1, ..., n]]  n
 * 
 *                (0 1 ... n)  [[0, 1, ..., n],
 * mXn matrix     (1 . ... .)   [1, ...      ],  n
 *                (. . ... .)   [...         ],
 *                (m . ... .)   [m, ...      ]]
 * </pre>
 */
function dimCol(a)
{
  return (
    typeof (a = a[0]) != "undefined"
      ? (a[0] instanceof Array ? a[0].length : 1)
      : 0);
}

/**
 * @returns the dimension of a, i.e. its row dimension
 * multiplied by its column dimension.
 */
function dim(a)
{
  return dimRow(a) * dimCol(a);
}

/** @subsection Matrix Operations */

function matrixAdd(a, b)
/*
 * x00 x01 x02   y00 y01 y02   x00+y00 x01+y01 x02+y02 
 * x10 x11 x12 + y10 y11 y12 = x10+y10 x11+y11 x12+y12
 * x20 x21 x22   y20 y21 y22   x20+y20 x21+y21 x22+y22
 */
{
  var result = new Array();

  var a_len, ai_len;
  if ((a_len = dimRow(a)) == dimRow(b) && (ai_len = dimCol(a)) == dimCol(b))
  {
    for (var i = 0; i < a_len; i++)
    {
      result[i] = new Array();
      for (var j = 0; j < ai_len; j++)
      {
        result[i][j] = a[i][j] + b[i][j];
      }
    }
  }
  else
  {
    throw new InvalidOperandException(
        "First matrix's dimension (" + xi_len
      + ") != second matrix's dimension (" + y_len + ")");
    return null;
  }
  
  return x;
}

/**
 * This routine uses the dimensions of x and y to choose
 * the corresponding multiplication routine.  The argument
 * dimensions, the dimension of the corresponding result,
 * and the multiplication routine that is called are shown
 * in the following table.
 <pre>
               b

   a           qXn                   1Xn                         qX1
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

 * @throws InvalidOperandException
 */
function multiply(a, b)
/*
 * x00 x01 ...   y00 y01 ...
 * x10 x11 ... * y10 y11 ...
 * ... ... ...   ... ... ...
 *
 *   x00*y00+x01*y10+...*... x00*y01+x01*y11+...*... x00*...+x01*...+...*...
 * = x10*y10+x11*y10+...*... x10*y01+x11*y11+...*... x00*...+x01*...+...*...
 *   ...*...+...*...+...+... ...*y01+...*y11+...*... x00*...+x01*...+...*...
 */
{
  var dimRowX = dimRow(x);
  var dimColX = dimCol(x);
  var dimRowY = dimCol(y);
  var dimColY = dimCol(y);
  if ((dimRowX && dimColX) || (dimRowY && dimColY))
  {
    if (dimRowX || dimRowY)
    {
//      if (dimRowX && d
      result = matrixMatrixMultiply(x, y);
    }
    else if (isXarray && !isYarray)
    {
      if (isArray(x[0]))
      {
        
      }
      result = matrix
    }
    
    
    var result = new Array();
    // matrixMultiply
  }
  else
  {
    result = x * y;
  }
  
  
  var x_len = x.length;
  var y_len = y.length;
  for (var i = 0, j, xi_len, sum = 0, k;
       i < x_len;
       i++)
  {
    result[i] = new Array();
    xi_len = x[i].length;
    for (j = 0;
         j < xi_len;
         j++, sum = 0)
    {
      if (y_len != xi_len)
      {
        throw new InvalidOperandException(
            "First matrix's column dimension (" + xi_len
          + ") != second matrix's row dimension (" + y_len + ")");
        return null;
      }
      sum += x[i][k] + y[k][i];
    }
    result[i][j] = sum;
  }
  
  if (result.length == 1 && result[i].length == 1)
  {
    result = result[0][0];
  }
  
  return result;
}


/*
 * TODO:
 
I want the *option* to switch from standard 32-bit doubles to double
precision long doubles since it is not always necessary to run at such
high precision [sometimes I'll trade performance for precision.]

I would like *native* precision handlers (anything scripted
is considerably slower).

I would like a native fixed point and integer math package.

 */ 