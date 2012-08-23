/**
 * <title>PointedEars' JSX: Math Library: Floating-point arithmetics</title>
 * @requires object.js
 * @requires types.js
 *
 * @section Copyright & Disclaimer
 * 
 * @author
 *   (C) 2000-2012  Thomas Lahn &lt;math.js@PointedEars.de&gt;
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
  /**
   * @namespace
   */
  var jsx = {};
}

if (typeof jsx.math == "undefined")
{
  /**
   * @namespace
   */
  jsx.math = {};
}

/**
 * @return the minimum value passed by its arguments.
 * If an argument is an object (incl. Array objects),
 * the values of its enumerable properties are also
 * evaluated.  If no arguments are provided, returns
 * <code>Number.POSITIVE_INFINITY</code>.
 */
jsx.math.min = function() {
  var result = Number.POSITIVE_INFINITY;
  var min_el;
    
  for (var i = 0, len = arguments.length; i < len; ++i)
  {
    var a = arguments[i];
    if (jsx.object.isArray(a))
    {
      var a2 = a.slice();
      a2.sort(function (a, b) { return a - b; });
      if (a2[0] < result)
      {
        result = a2[0];
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
jsx.math.max = function() {
  var result = Number.NEGATIVE_INFINITY;
  
  for (var i = 0, len = arguments.length; i < len; ++i)
  {
    var a = arguments[i], max_el;
    if (jsx.object.isArray(a))
    {
      var a2 = a.slice();
      a2.sort(function (a, b) { return b - a; });
      if (a2[0] > result)
      {
        result = a2[0];
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        if ((max_el = jsx.math.max(a[j])) > result)
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
jsx.math.avg = function() {
  var sum = 0;
  var count = 0;

  for (var i = 0, len = arguments.length; i < len; i++)
  {
    var a = arguments[i];
    if (jsx.object.isArray(a))
    {
      for (var j = 0; j < a.length; j++)
      {
        count++;
        sum += jsx.math.avg(a[j]);
      }
    }
    else if (typeof a == "object")
    {
      for (j in a)
      {
        count++;
        sum += jsx.math.avg(a[j]);
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
jsx.math.root = function(n, iRoot) {
  return (iRoot % 2 && n < 0 ? -1 : +1)
         * Math.pow(Math.abs(n), 1/Math.floor(iRoot));
};

/**
 * @param n : number
 * @return number
 *   <var>n</var> squared, i.e. <code>Math.pow(n, 2)</code>.
 * @author (c) 2003  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
jsx.math.sqr = function(n) {
  return Math.pow(n, 2);
};

/**
 * @param n : number
 * @return type number
 *   The cubic value of <code>n</code>, i.e.
 *   <code>Math.pow(n, 3)</code>.
 * @author (c) 2000  Thomas Lahn &lt;math.js@PointedEars.de&gt;
 */
jsx.math.cub = function(n) {
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
jsx.math.cubrt = function(n) {
  return jsx.math.root(n, 3);
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
jsx.math.roundDigits = function(n, iSigDecimals, iForceDecimals,
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
jsx.math.getPeriod = function(n, bLoose, iPrecision) {
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
jsx.math.toFraction = function(fDec) {
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
  
  var y = jsx.math.getPeriod(fDec).length;
  var z = fDec * Math.pow(10, y);
  var dividend = Math.round(z - fDec);
  var divisor = Math.round((Math.pow(10, y) - 1));

  /* "shorten" the fraction */
  var d = jsx.math.gcd(dividend, divisor);
  if (d > 1)
  {
    dividend /= d;
    divisor /= d;
  }
    
  var result = dividend + "/" + divisor;
    
  return result;
};


/** @subsection Trigonometry */

jsx.math.dtRad  = 0;
jsx.math.dtDeg  = 1;
jsx.math.dtGrad = 2;

/**
 * Unlike the {@link js#Math built-in methods}, the following
 * functions accept a second argument to determine if the argument
 * should be handled as radian (dtRad == 0 [default];
 * x = n*[0..2*Math.PI], degree (dtDeg == 1; x = n*[0..360])
 * or gradian (dtGrad == 2; x = n*[0..400] gon) value.
 */

/**
 * @param x : number
 * @param iArgType : number
 * @return number
 *   The sine of <var>x</var>
 */
jsx.math.sinX = function(x, iArgType) {
  switch (iArgType)
  {
    case jsx.math.dtDeg:
      x = x/180 * Math.PI;
      break;

    case jsx.math.dtGrad:
      x = x/200 * Math.PI;
  }

  return Math.sin(x);
};

/**
 * @param x : number
 * @param iArgType : number
 * @return number
 *   The cosine of <var>x</var>
 */
jsx.math.cosX = function(x, iArgType) {
  switch (iArgType)
  {
    case jsx.math.dtDeg:
      x = x/180 * Math.PI;
      break;
      
    case jsx.math.dtGrad:
      x = x/200 * Math.PI;
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
jsx.math.tanX = function(x, iArgType) {
  var jsx_object = jsx.object;
  
  switch (iArgType)
  {
    case jsx.math.dtDeg:
      x = x/180 * Math.PI;
      break;
      
    case jsx.math.dtGrad:
      x = x/200 * Math.PI;
  }
  
  if (jsx_object.isMethod(Math, "tan"))
  {
    return Math.tan(x);
  }
  
  return (jsx.math.sinX(x) / jsx.math.cosX(x));
};

/** @subsection Complex numbers */

/**
 * @param nRe : number
 * @param nIm : number
 */
jsx.math.Complex = function(nRe, nIm) {
  Number.call(this);
  this.re = Number(nRe) || 0;
  this.im = Number(nIm) || 0;
};
jsx.math.Complex.extend(Number);

/**
 * @param a : Complex
 * @param b : Complex
 * @return Complex
 *   The complex sum of <var>a</var> and <var>b</var>
 */
jsx.math.addComplex =
jsx.math.Complex.prototype.add = function (a, b) {
  var result = null;
  var math = jsx.math;

  if (this instanceof math.Complex)
  {
    b = a;
    a = this;
  }

  if (a && b)
  {
    if (!(a instanceof math.Complex))
    {
      a = new math.Complex(a);
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
jsx.math.mulComplex =
jsx.math.Complex.prototype.mul = function(a, b) {
  var result = null;

  if (this instanceof jsx.math.Complex)
  {
    b = a;
    a = this;
  }

  if (a && b)
  {
    if (!(a instanceof jsx.math.Complex))
    {
      a = new jsx.math.Complex(a);
    }

    if (!(b instanceof jsx.math.Complex))
    {
      b = new jsx.math.Complex(b);
    }
     
    //  a.re, a.im     b.re, b.im
    // (a,    b   ) * (c,    d   ) = (a * c - b * d, a * d + b * c)
    return new jsx.math.Complex(
      a.re * b.re - a.im * b.im,
      a.re * b.im + a.im * b.re);
  }
};

/*
 * TODO: Hyperbolic functions
 */
