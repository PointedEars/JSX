/**
 * <title>PointedEars' JSX: Math Library</title>
 */
var mathVersion = "1.14.2004031210";
/**
 * @filename math.js
 * @partof   PointedEars' JavaScript Extensions (JSX)
 * @requires types.js
 *
 * @section Copyright & Disclaimer
 * 
 * @author
 *   (C) 2000-2003  Thomas Lahn &lt;string.js@PointedEars.de&gt;
 */
var mathCopyright = "Copyright \xA9 1999-2004";
var mathAuthor = "Thomas Lahn";
var mathEmail = "math.js@PointedEars.de";
var mathPath = "http://pointedears.de.vu/scripts/";
// var mathDocURL = mathPath + "math.htm";
/**
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
 * <http://pointedears.de.vu/scripts/JSDoc/>
 * for details.
 * 
 * Refer math.htm file for general documentation.
 */

// User interface language
var mathLanguage = "en";          

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
    + (sError[mathLanguage] || sError["en"])
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

/** @section Integer arithmetics */

function /** @type number */ gcd(
  /** @argument number */ a,
  /** @argument number */ b)
/**
 * Returns the greatest common divisor (GCD) of two integers
 * <code>a</code> and <code>b</code>, implementing (the
 * optimized form of) the Euclidean algorithm (also called
 * Euclid's algorithm).  The GCD of two integer arguments is
 * the largest positive integer that both arguments are integer
 * multiples of, i.e. by which either argument can be divided
 * without remainder.  Since integers are required, the floor
 * of <code>a</code> and <code>b</code> will be used for
 * computation.
 * @returns
 *   The GCD of <code>a</code> and <code>b</code>;
 *   <code>NaN</code> if an argument is not a number.
 * @see js#Math.floor()
 */
{
  if (isNaN(a) || isNaN(b))
    return NaN;

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

function /** @type number */ gcdN(/** @arguments number */)
/**
 * Returns the greatest common divisor (GCD) of two or more
 * integers, implementing (the optimized form of) the Euclidean
 * algorithm (also called Euclid's algorithm).  The GCD of
 * integer arguments is the largest positive integer that all
 * arguments are integer multiples of, i.e. by which either
 * argument can be divided without remainder.  Since integers
 * are required, the floor of the arguments will be used for
 * computation.
 * @returns
 *   The GCD of the arguments;
 *   <code>NaN</code> if one or more arguments are not a number.
 * @see js#Math.floor()
 */
{
  
  return Math.abs(a);
}
Math.gcdN = gcdN;

function /** @type number */ lcm(
  /** @argument number */ a,
  /** @argument number */ b)
/**
 * Returns the least common multiple (LCM) of two integers
 * <code>a</code> and <code>b</code>.  The LCM of two integer
 * arguments is the smallest positive integer that is a
 * multiple of the arguments.  If there is no such positive
 * integer, i.e., if either argument is zero, then lcm(a, b)
 * is defined to be zero.  Since integers are required, the
 * floor of <code>a</code> and <code>b</code> will be used
 * for computation.
 * @returns
 *   The LCM of <code>a</code> and <code>b</code>;
 *   0 if an argument is 0;
 *   <code>NaN</code> if an argument is not a number.
 * @see js#Math.floor(), #gcd()
 */
{
  if (isNaN(a) || isNaN(b))
    return NaN;
    
  if (!a || !b)
    return 0;

  a = Math.floor(a);
  b = Math.floor(b);
  
  return ((a * b) / gcd(a, b));
}
Math.lcm = lcm;

function /** @type number */ fac(/** @argument number */ n)
/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param n  If <code>n</code> is not an integer,
 *           <code>Math.floor(n)</code> is used.
 * @returns
 *   The factorial of <code>n</code> (<code>n<code><b>!</b>)
 *   which is (for practical reasons) implemented here as follows:
 *   @ifdef{MathML2}
 *     <apply>
 *       <eq/>
 *       <apply>
 *         <factorial/>
 *         <ci> n </ci>
 *       </apply>
 *       <piecewise>
 *         <piece>
 *           <cn>1</cn>
 *           <apply><lt/> <ci> n </ci> <cn> 2 </cn></apply>
 *         </piece>
 *         <piece>
 *           <mrow>
 *             <ci> n </ci>
 *             <mo>&InvisibleTimes;</mo>
 *             <mfenced>
 *               <apply>
 *                 <factorial/>
 *                 <apply><minus/> <ci> n </ci> <cn> 1 </cn></apply>
 *               </apply>
 *             </mfenced>
 *           </mrow>
 *           <apply><gt/> <ci> n </ci> <cn> 1 </cn></apply>
 *         </piece>
 *       </piecewise>
 *     </apply>
 *   @else
 *     <table>
 *       <tr valign="top">
 *         <td rowspan="2"><code>n<code><b>!</b></td>
 *         <td>n < 2:</td>1; (strict: 0<b>!</b> = 1<b>!</b> := 1)</td>
 *       </tr>
 *       <tr valign="top">
 *         <td>n > 1:</td>n * (n - 1)<b>!</b></td>
 *       </tr>
 *     <table>
 *   @endif
 *
 *   Unlike common recursive implementations, the algorithm is
 *   implemented iterative here, saving you stack space and thus
 *   allowing larger factorials to be computed.
 * @throws OverflowException
 */
{
  if (n % 1)
    n = Math.floor(n);

  var result = 1;
  var i;

  if (i > 0)
  {
    for (i = 2; i <= n; i++)
    {
      if (result < Number.POSITIVE_INFINITY)
        result *= i;
      else
      {
        result = 0;
        // [Exception] <- [MathErrorException] <- [OverflowException] }
        throw new OverflowException("fac");
        break;
      }
    }
  }
  else
    result = 1;
    
  return result;
}

function /** @type number */ powInt(
  /** @argument number */ nBase,
  /** @argument number */ iExponent)
/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
{
  var i = iExponent;
  var result = 1.0;

  while (i > 0)
  {
    if (i % 2)
      result *= nBase;
    i = Math.floor(i / 2);
    nBase *= nBase;
  }

  return result;
}
Math.powInt = powInt;

function /** @type number */ power(
  /** @argument number */ nBase,
  /** @argument number */ nExponent)
/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @throws InvalidArgumentException
 */
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
          result = -result;
      }
      else
      {
        result = 0;
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

function /** @type number */ logN(
  /** @argument number */ x,
  /** @argument number */ nBase)
/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
{
  return Math.log(x) / Math.log(nBase);
}
Math.logN = logN;

function /** @type number */ log2(/** @argument number */ x)
/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
{
  return logN(x, 2);
}
Math.log2 = log2;

function /** @type number */ log10(/** @argument number */ x)
/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
{
  return logN(x, 10);
}
Math.log10 = log10;

function /** @type number */ rec(/** @argument number */ x)
/**
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
{
  return (1 / x);
}
Math.rec = rec;

/** @section Floating-point arithmetics */

function minN(/** @arguments */)
/**
 * @returns the minimum value passed by its arguments.
 * If an argument is an object (incl. Array objects),
 * the values of its enumerable properties are also
 * evaluated.
 */
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
          result = a[j];
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        if (a[j] < result)
          result = a[j];
      }
    }
    else if (a < result)
        result = a;
  }
  
  return result;
}
Math.minN = minN;

function maxN(/** @arguments */)
/**
 * @returns the maximum value passed by its arguments.
 * If an argument is an object (incl. Array objects),
 * the values of its enumerable properties are also
 * evaluated.
 */
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
          result = a[j];
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        if (a[j] > result)
          result = a[j];
      }
    }
    else if (a > result)
        result = a;
  }
  
  return result;
}
Math.maxN = maxN;

function /** @type number */ avgN(/** @arguments */)
/**
 * @returns the average value of its arguments.
 * If an argument is an object (incl. Array objects),
 * the values of its enumerable properties are also
 * evaluated.
 */
{
  var sum = 0;
  var count = 0;
  var a, j;
    
  for (var i = 0; i < arguments.length; i++)
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

function /** @type number */ root(
  /** @argument number */ n,
  /** @argument optional number default 2 */ iRoot)
/**
 * @argdescr n
 *   Number of which to compare the <code>iRoot</code>-th root.
 * @argdescr iRoot
 *   Root exponent. If not integer, the floor (largest integer
 *   less than the argument) of <code>iRoot</code> is used.
 */
{
  return (iRoot % 2 && n < 0 ? -1 : +1)
        * Math.pow(Math.abs(n), 1/Math.floor(iRoot));
}
Math.root = root;

function /** @type number */ sqr(/** @argument number */ n)
/**
 * @returns the square value of <code>n</code>, i.e.
 * <code>Math.pow(n, 2)</code>.
 * @author (c) 2003  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
{
  return Math.pow(n, 2);
}
Math.sqr = sqr;

function /** @type number */ cub(/** @argument number */ n)
/**
 * @returns the cubic value of <code>n</code>, i.e.
 * <code>Math.pow(n, 3)</code>.
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
{
  return Math.pow(n, 3);
}
Math.cub = cub;

function /** @type number */ cubrt(/** @argument number */ n)
/**
 * @returns the cubic root of <code>n</code>, i.e.
 * <code>Math.pow(n, 1/3)</code>, but also works
 * with negative values of <code>n</code>.
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
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

function /** @type number */ roundDigits(
  /** @argument number          */ n,
  /** @argument optional number */ iSigDecimals,
  /** @argument optional number */ iForceDecimals,
  /** @argument optional number */ bForceLeadingZero,
  /** @argument optional string */ sDecSeparator)
/**
 * @argdescr n
 *   Numeric value to round. Required.
 * @argdescr iSigDecimals
 *   Significant decimals to round to. If negative
 *   round to positive powers of 10. Optional.
 *   If out of the closed interval of [-14;14], the
 *   function exits and returns n (unchanged).
 *   If not provided, assume 0 and round the value to
 *   a whole number.
 * @argdescr iForceDecimals
 *   Number of digits to be returned with the number.
 *   If smaller than iSigDigits, the value will be
 *   ignored and the result is a Numeric value.
 *   Otherwise the required number of zeroes will be
 *   appended and the result is a String value.
 *   Optional.
 * @argdescr bForceLeadingZero
 *   If true, force leading zero if the value is between
 *   0 and 1 or 0 and -1. The argument is optional.
 *   If not provided, apply bForceLeadingZero=false;
 * @argdescr sDecSeparator
 *   The character used for decimal delimiter instead.
 *   In non-English speaking countries the comma (",")
 *   is used instead of point (".") and vice-versa.
 *   Optional. If not provided, use default decimal
 *   separator. If provided, the result is a String value.
 */  
{
  if (! iSigDecimals)
    iSigDecimals = 0;
  
  /*
   * Returns the number itself when called with invalid arguments,
   * so further calculations will not fail because of a wrong
   * function call.
   */
  if (iSigDecimals < -14 || iSigDecimals > 14)
    return n;

  var e = Math.pow(10, iSigDecimals);
  var i = String(n).indexOf(".");

  if (i < 0)
    i = String(n).length - 1;
  if (String(n).substring(0, i).length <= -iSigDecimals)
    return n;
    
  var k = Math.round(n * e) / e;
  
  if (arguments.length < 3)
    iForceDecimals = 0;

  if (iForceDecimals > 0)
  {
    k = String(k);
    i = k.indexOf(".");
    if (i < 0 && iForceDecimals > 0)
      k += ".";
    i = k.indexOf(".");
    for (i = k.substr(i + 1).length; i < iForceDecimals; i++)
      k += "0";
  }
  
  if (bForceLeadingZero && String(k).charAt(0) == ".") k = "0" + k;

  if (arguments.length < 5) sDecSeparator = "";

  if (sDecSeparator.length > 0)
  {
    k = String(k);
    i = k.indexOf(".");
    if (i >= 0)
      k = k.substring(0, i) + sDecSeparator + k.substr(i + 1);
  }
  
  return k;
}
Math.roundDigits = roundDigits;


/** @subsection Rational arithmetics */

function /** @type string */ getPeriod(
  /** @argument number                         */ n,
  /** @argument optional boolean default false */ bLoose,
  /** @argument optional number  default 14    */ iPrecision)
/**
 * Returns the period of a number, i.e. a repeated 
 * substring of its decimals that entirely make up
 * following decimals.
 * @argdescr n
 *   The number of which the period should be found out.
 * @argdescr bLoose
 *   If <code>true</code>, triggers Loose Mode
 *   which notes <code>iPrecision</code>.
 * @argdescr iPrecision
 *   In Loose Mode, defines the maximum number
 *   of decimals to parse for a period. The default
 *   is 14 (one less than maximum known precision).
 * @returns
 *   The period of <code>n</code> as a string;
 *   "0" if there is none.
 */
{
  var s = String(n);
  for (var i = 3; i < s.length; i++)
  {
    var
      currentPeriod = s.substring(2, i),
      rx = new RegExp("^\\d*\\.\\d*(" + currentPeriod + ")+$");
        
    if (rx.test(s))
      return currentPeriod;
  }
  return "0";
}
Math.getPeriod = getPeriod;

function /** @type string */ toFraction(fDec)
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

function /** @type number */ sin(
  /** @argument number */ x,
  /** @argument number */ iArgType)
{
  switch (iArgType)
  {
    case dtDeg:  x = x/180 * Math.PI; break;
    case dtGrad: x = x/300 * Math.PI;
  }

  return Math.sin(x);
}
Math.sinX = sin;

function /** @type number */ cos(
  /** @argument number */ x,
  /** @argument number */ iArgType)
{
  switch (iArgType)
  {
    case dtDeg:  x = x/180 * Math.PI; break;
    case dtGrad: x = x/300 * Math.PI;
  }
  
  return Math.cos(x);
}
Math.cosX = cos;

function /** @type number */ tan(
  /** @argument number */ x,
  /** @argument number */ iArgType)
/**
 * Returns the tangens of x.  If @link{js#Math.tan()} is
 * undefined, it uses @link{#sinX()} and @link{#cosX()}
 * defined above.
 * @requires types#isMethodType()
 */
{
  switch (iArgType)
  {
    case dtDeg:  x = x/180 * Math.PI; break;
    case dtGrad: x = x/300 * Math.PI;
  }
  
  if (isMethodType(typeof Math.tan))
    return Math.tan(x);
  else
    return (sinX(x) / cosX(x));
}
Math.tanX = tan;
if (!isMethodType(typeof Math.tan))
  Math.tan = tan;

/*
 * TODO: Hyperbolic functions
 */

/** @section Number systems */

function /** @type string */ dec2base(
  /** @argument optional number default  0 */ nDec,
  /** @argument optional number default 10 */ iBase,
  /** @argument optional number            */ iLength)
/**
 * @author Copyright (c) 2003 Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @partof http://pointedears.de.vu/scripts/math.js
 * @argdescr nDec
 *   Required. Decimal number to be converted to another number
 *   system. No conversion is performed if <var>nDec</var> ist 0
 *   (zero).
 * @argdescr iBase
 *   Optional. Base of the number system to which <var>nDec</var>
 *   should be converted. Use 2 for binary, 8 for octal, 16 for
 *   hexadecimal aso. No conversion is performed if <var>iBase</var>
 *    ist 10 (decimal, the default) or not provided.
 * @argdescr iLength
 *   Optional. If provided and greater that 0, this argument
 *   specifies the length of the resulting string. If the result
 *   is shorter than <var>iLength</var>, leading zeroes are
 *   added until the result is as long as <var>iLength</var>.
 * @returns
 *   <var>nDec</var> converted to the number system specified
 *   with <var>iBase</var>, optionally with leading zeroes.
 * @see
 *   js#parseFloat(), js#parseInt()
 */
{
  // default values
  if (!nDec)
    nDec  = 0;
  if (!iBase)
    iBase = 2; // binary
  
  var
    sResult = "",
    f = nDec % 1,
    aDigits = new Array();

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
      var iFirstLetter = "A".charCodeAt(0);
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

  if (iLength)
    while (sResult.length < iLength)
      sResult = "0" + sResult;
  
  return sResult;
}
Math.dec2base = dec2base;


/** @section Stochastics */

function /** @type number */ rand(
  /** @optional number   */ nLeftBorder,
  /** @optional number   */ nRightBorder,
  /** @optional Function */ fRandom)
/**
 * Returns a uniformly distributed random value in the
 * closed interval
 * [<code>iLeftBorder</code>, <code>iRightBorder</code>]
 * (including <code>iLeftBorder</code> and
 * <code>iRightBorder</code>).
 * 
 * @author (C) 2000-2003 Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param nLeftBorder
 *   Left border of the interval. If left out, <code>null</code>
 *   or <code>undefined</code>, <code>-Number.MAX_VALUE</code> is
 *   assumed.
 * @param iRightBorder
 *   Right border of the interval. If left out, <code>null</code>
 *   or <code>undefined</code>, <code>Number.MAX_VALUE</code> is
 *   assumed.
 * @param fRandom
 *   Function to be used for calculating the uniform random number
 *   in the open unit interval (0.0, 1.0) (excluding 0.0 and 1.0).
 *   If left out, <code>Math.random()</code> is used where the
 *   the random number generator is seeded from the current time.
 * @see if, Math.random()
 */
{
  if (iLeftBorder == null || typeof iLeftBorder == "undefined")
    iLeftBorder = -Number.MAX_VALUE;

  if (iRightBorder == null || typeof iRightBorder == "undefined")
    iRightBorder = Number.MAX_VALUE;   

  if (! fRandom)
    fRandom = Math.random;

  return fRandom() * (iRightBorder - iLeftBorder) + iLeftBorder;
}
Math.rand = rand;

function /** @type number */ randInt(
  /** @optional number   */ iLeftBorder,
  /** @optional number   */ iRightBorder,
  /** @optional Function */ fRandom)
/**
 * Returns a uniformly distributed random integer value in the
 * closed interval
 * [<code>iLeftBorder</code>, <code>iRightBorder</code>]
 * (including <code>iLeftBorder</code> and
 * <code>iRightBorder</code>).
 * 
 * @author (C) 2000-2003 Thomas Lahn &lt;math.js@PointedEars.de&gt;
 * @param iLeftBorder
 *   Left border of the interval.  If left out, <code>null</code>
 *   or <code>undefined</code>,
 *   <code>Math.floor(-Number.MAX_VALUE)</code> is assumed.
 * @param iRightBorder
 *   Right border of the interval.  If left out, <code>null</code>
 *   or <code>undefined</code>,
 *   <code>Math.ceil(Number.MAX_VALUE)</code> is assumed.
 * @param fRandom
 *   Function to be used for calculating the uniform random number
 *   in the open unit interval (0.0, 1.0) (excluding 0.0 and 1.0).
 *   If left out, <code>Math.random()</code> is used where the
 *   the random number generator is seeded from the current time.
 * @see js#Math.random()
 */
{
  if (iLeftBorder == null || typeof iLeftBorder == "undefined")
    iLeftBorder = -Number.MAX_VALUE;
  iLeftBorder = Math.floor(iLeftBorder);

  if (iRightBorder == null || typeof iRightBorder == "undefined")
    iRightBorder = Number.MAX_VALUE;   
  iRightBorder = Math.ceil(iRightBorder);

  if (! fRandom)
    fRandom = Math.random;

  return Math.round(rand(iLeftBorder, iRightBorder, fRandom));
}
Math.randInt = randInt;

function byChance(
  /** @argument number   */ nChance,
  /** @argument          */ ifChance,
  /** @argument          */ otherwise,
  /** @argument Function */ fRandom)
/**
 * Returns a value dependent on statistical probability.
 * @param nChance
 *   Statistical probability that <code>ifChance</code> is
 *   returned.  <code>1.0</code> means <code>100%</code>
 *   of all possible cases.
 * @param ifChance
 *   Value that is returned if chances are in favor of it.
 * @param otherwise
 *   Value that is returned if chances are against
 *   <code>ifChance</code>, i.e. is returned in
 *   <code>((1 - nChance) * 100)</code>% of all
 *   possible cases.
 * @param fRandom
 *   Function to be used for calculating the uniform random number
 *   in the open unit interval (0.0, 1.0) (excluding 0.0 and 1.0).
 *   If left out, <code>Math.random()</code> is used where the
 *   the random number generator is seeded from the current time.
 * @return
 *  <code>ifChance</code> if the chances are in favour of it,
 *  <code>otherwise</code> if they are against it.
 * @see js#Math.random()
 */
{
  if (! fRandom)
    fRandom = Math.random;

  return (fRandom() < nChance ? ifChance : otherwise);
}
Math.byChance = byChance;

function /** @type number */ binomCoeff(
  /** @argument number */ iUpper,
  /** @argument number */ iLower)
/**
 * @returns
 *   The binomial coefficient <code>iUpper</code> over
 *   <code>iLower</code> (|_<code>iUpper</code><b>!</b> /
 *   <code>iLower<code><b>!</b>_| * (<code>iUpper</code>
 *   - <code>iLower</code>)<b>!</b>)
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
{
  var result = 0;
  
  if (iUpper >= iLower)
    result = Math.floor(fac(iUpper) / (fac(iLower) * fac(iUpper - iLower)));
  else
    throw new InvalidArgumentException(
      "binomCoeff(" + iUpper + ", " + iLower + ")");

  return result;
}
Math.binomCoeff = binomCoeff;


/*
 * TODO:
 
I want the *option* to switch from standard 32-bit doubles to double
precision long doubles since it is not always necessary to run at such
high precision [sometimes I'll trade performance for precision.]

I would like a *native* log (base 10) method.

I would like *native* precision handlers (anything scripted
is considerably slower).

I would like a native fixed point and integer math package.

Matrix operations?
 */ 