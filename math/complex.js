/**
 * <title>PointedEars' JSX: Math Library: Complex arithmetics</title>
 * @requires math.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2013  Thomas Lahn &lt;math.js@PointedEars.de&gt;
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
 * @namespace
 */
jsx.math.complex = (/** @constructor */ function () {
  /* Imports */
  var _isObject = jsx.object.isObject;
  var _math = jsx.math;
  var _add = _math.add;
  var _sub = _math.sub;
  var _mul = _math.mul;
  var _div = _math.div;
  var _log = _math.log;
  var _pow = _math.pow;
  var _sqrt = _math.sqrt;
  var _isNatural = _math.isNatural;

  /* Private variables */
  var _rx_decimal_integer_literal = /(?:0|[1-9]\d*)/;
  var _rx_exponent_part = /[eE][+-]?\d+/;
  var _rx_decimal_literal = new RegExp(
    _rx_decimal_integer_literal.source + "(?:\\.\\d*)?(?:" + _rx_exponent_part.source + ")?");
  var _rx_hex_integer_literal = /0[xX][0-9a-fA-F]+(?:\.[0-9a-fA-F]*)?/;
  var _rx_numeric_literal = new RegExp(
    "((" + _rx_hex_integer_literal.source + ")|" + _rx_decimal_literal.source + ")");
  var _rx_complex_literal = new RegExp(
    "^\\s*" + _rx_numeric_literal.source
    + "\\s*(?:([+-])\\s*" + _rx_numeric_literal.source + "[ij])?");

  /**
   * A complex number consists of a real and an imaginary part.
   *
   * It can be visualized as being an point in a plane with a
   * two-dimensional Cartesian coordinate system in which
   * the real part is measured on one axis and the imaginary
   * part on the other.
   *
   * @function
   */
  var _Complex = jsx.object.extend(
    /**
     * @constructor
     * @param {Number} re
     * @param {Number} im
     */
    function (re, im) {
      if (!(this instanceof _Complex))
      {
        return new _Complex(re, im);
      }

      this.re = _isObject(re) ? re : +re;
      this.im = _isObject(im)
        ? im
        : (typeof im == "undefined" ? 0 : +im);
    },
    {
      /**
       * Parses a string representation of a complex number into
       * a {@link _Complex Complex} instance.
       *
       * @memberOf jsx.math.complex.Complex
       * @param {String} s
       * @return {_Complex}
       */
      parse: function (s) {
        var m = s.match(_rx_complex_literal);
        if (!m || !m[1])
        {
          return Number.NaN;
        }

        return new _Complex(
          parseFloat(m[1], m[2] ? 16 : 10),
          (m[3] == "-" ? -1 : 1) * parseFloat(m[4], m[5] ? 16 : 10) || 0);
      }
    }
  ).extend(Number, {
    /**
     * Returns the absolute value (or modulus or magnitude) of
     * this complex number.
     * <p>
     * The magnitude also is the radius of the circle on which
     * the number lies in the complex plane.
     * </p>
     * @return {number}
     */
    abs: function () {
      return _sqrt(_add(_pow(this.re, 2), _pow(this.im, 2)));
    },

    /**
     * Returns the sum of this complex number and another number.
     *
     * @memberOf jsx.math.complex.Complex.prototype
     * @param {_Complex|Number} summand2
     * @return {_Complex}
     *   The complex sum of this number and <var>summand2</var>
     */
    add: function (summand2) {
      if (!(summand2 instanceof _Complex))
      {
        summand2 = new _Complex(summand2);
      }

      return new _Complex(_add(this.re, summand2.re), _add(this.im, summand2.im));
    },

    /**
     * Returns the product of this complex number and another
     * number.
     *
     * @param {_Complex|Number} factor2
     * @return {_Complex}
     *   The complex product of this number and <var>operand</var>
     */
    mul: function (factor2) {
      if (!(factor2 instanceof _Complex))
      {
        factor2 = new _Complex(factor2);
      }

      //  a.re, a.im     b.re, b.im
      // (a,    b   ) * (c,    d   ) = (ac - bd, ad + bc)
      return new _Complex(
        _sub(_mul(this.re, factor2.re), _mul(this.im, factor2.im)),
        _add(_mul(this.re, factor2.im), _mul(this.im, factor2.re)));
    },

    /**
     * Returns the quotient of this complex number and another
     * number.
     *
     * @param {_Complex|Number} divisor
     * @return {_Complex}
     *   The complex quotient of this number and <var>operand</var>
     */
    div: function (divisor) {
      if (!(divisor instanceof _Complex))
      {
        divisor = new _Complex(divisor);
      }

      //  a.re, a.im     b.re, b.im
      // (a,    b   ) / (c,    d   ) = ((ac + bd) / (c² + d²), (bc - ad / c² + d²))
      var denom = _add(_pow(divisor.re, 2), _pow(divisor.im, 2));

      return new _Complex(
        _div(_add(_mul(this.re, divisor.re), _mul(this.im, divisor.im)), denom),
        _div(_sub(_mul(this.im, divisor.re), _mul(this.re, divisor.im)), denom));
    },

    /**
     * Returns the complex conjugate of this complex number.
     *
     * @return {_Complex} <code>{re: this.re, im: -this.im}</code>
     */
    conjugate: function () {
      return new _Complex(this.re, _mul(this.im, -1));
    },

    /**
     * Returns the principal natural logarithm of this complex number.
     *
     * @return {_Complex}
     */
    log: function () {
      var polar = this.toPolar();
      return new _Complex(_log(polar.mag), polar.arg);
    },

    /**
     * Returns the result of exponentiation of this complex number.
     *
     * It is currently only defined for natural numbers, i.e.
     * integers 0 or greater.
     *
     * @param {_Complex|Number} exponent
     * @return {_Complex|number}
     */
    pow: function (exponent) {
      var polar = this.toPolar();

      if (_isNatural(exponent))
      {
        return new _Polar(_pow(polar.mag, exponent), _mul(polar.arg, exponent))
          .toComplex();
      }

      return NaN;
    },

    /**
     * Returns the principal square root of this complex number.
     *
     * @return {_Complex}
     */
    sqrt: function () {
      var sgn = (typeof Math.sign == "function"
        ? Math.sign
        : function (x) {
            if (x == 0)
            {
              return 0;
            }

            return x / Math.abs(x);
          });

      if (this.im == 0)
      {
        if (this.re >= 0)
        {
          return new _Complex(_sqrt(this.re), 0);
        }

        return new _Complex(0, _sqrt(_mul(this.re, -1)));
      }

      var abs = this.abs();

      return new _Complex(
        _sqrt(_div(_add(abs, this.re), 2)),
        _mul(
          sgn(this.im),
          _sqrt(_div(_sub(abs, this.re), 2))
        )
      );
    },

    /**
     * Returns this complex number in polar form.
     *
     * @return {_Polar}
     */
    toPolar: function () {
      return new _Polar(this.abs(), Math.atan2(this.im, this.re));
    },

    /**
     * Returns this object as a string.
     *
     * (<code>{re: 1, im: 2}</code> → <code>"1+2j"</code>)
     *
     * @param {string} imUnit
     *   The unit to use for the imaginary part.  The default
     *   is <code>"j"</code> (see above), but sometimes people
     *   prefer <code>"i"</code> and can pass that instead.
     * @return {string}
     */
    toString: function (imUnit) {
      var re = this.re;
      var im = this.im;

      return ((re || "")
        + (im
            ? (re && im >= 0 ? "+" : "") + im + (imUnit || "j")
            : ""))
        || "0";
    },

    /**
     * Returns the magnitude value of this complex number for
     * the purpose of further operations.
     *
     * @return {number}
     * @see #abs()
     */
    valueOf: function () {
      return this.abs();
    }
  });

  /**
   * The polar coordinate of a point in a plane consists of
   * a magnitude (or radius) and an argument (or angle).
   *
   * It is sometimes useful to visualize a complex number
   * as being an point in the complex plane where its magnitude
   * specifies the radius of the circle, centered at the
   * origin, on which that point is located, and the
   * argument as the angle, measured between the radius
   * between origin and point, and the positive section
   * of the real axis.
   *
   * @function
   */
  var _Polar = (
    /**
     * @constructor
     * @param {Number} mag
     * @param {Number} arg
     */
    function (mag, arg) {
      this.mag = mag;
      this.arg = arg;
    }
  ).extend(Number, {
    /* Type conversion */
    /**
     * Returns the Cartesian (or rectangular) coordinates
     * for this polar coordinate as a complex number.
     *
     * @memberOf jsx.math.complex.Polar.prototype
     * @return {_Complex}
     */
    toComplex: function () {
      return new _Complex(
        _mul(this.mag, Math.cos(this.arg)),
        _mul(this.mag, Math.sin(this.arg)));
    }
  });

  return {
    /**
     * @memberOf jsx.math.complex
     */
    Complex: _Complex,
    Polar: _Polar
  };
}());