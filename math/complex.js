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
  var _pow = _math.pow;
  var _sqrt = _math.sqrt;

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
      this.im = _isObject(im) ? im : +im;
    },
    {
      /**
       * @memberOf jsx.math.complex.Complex
       * @param {String} s
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
     * @memberOf jsx.math.complex.Complex.prototype
     * @param {_Complex} a
     * @param {_Complex} b
     * @return {_Complex}
     *   The complex sum of <var>a</var> and <var>b</var>
     */
    add: function (operand) {
      if (!(operand instanceof _Complex))
      {
        operand = new _Complex(operand);
      }

      return new _Complex(_add(this.re, operand.re), _add(this.im, operand.im));
    },

    /**
     * @param {_Complex} a
     * @param {_Complex} b
     * @return {_Complex}
     *   The complex product of <var>a</var> and <var>b</var>
     */
    mul: function (operand) {
      var result = null;

      if (!(operand instanceof _Complex))
      {
        operand = new _Complex(operand);
      }

      //  a.re, a.im     b.re, b.im
      // (a,    b   ) * (c,    d   ) = (a * c - b * d, a * d + b * c)
      return new _Complex(
        _sub(_mul(this.re, operand.re), _mul(this.im, operand.im)),
        _add(_mul(this.re, operand.im), _mul(this.im, operand.re)));
    },

    sqrt: function () {
      function sgn (x)
      {
        if (x == 0)
        {
          return 0;
        }
        return x / Math.abs(x);
      }

      if (this.im == 0)
      {
        return _sqrt(this.re);
      }

      return new _Complex(
        _sqrt(
          _div(
            _add(
              this.re,
              _sqrt(_add(_pow(this.re, 2), _pow(this.im, 2)))
            ),
            2
          )
        ),
        _mul(
          sgn(this.im),
          _sqrt(
            _div(
              _add(
                _mul(this.re, -1),
                _sqrt(_add(_pow(this.re, 2), _pow(this.im, 2)))
              ),
              2
            )
          )
        )
      );
    },

    /**
     * Returns this object as a string.
     *
     * (<code>{re: 1, im: 2}</code> → <code>"1 + 2j"</code>)
     *
     * @param {string} imUnit
     *   The unit to use for the imaginary part.  The default
     *   is <code>"j"</code> (see above), but sometimes people
     *   prefer <code>"i"</code> and can pass that instead.
     * @return {string}
     */
    toString: function (imUnit) {
      if (!imUnit)
      {
        imUnit = "j";
      }

      var re = this.re;
      var im = this.im;

      return ((re || "")
        + (im
            ? (re && im >= 0 ? "+" : "") + im + imUnit
            : ""))
        || "0";
    },

    /**
     * @return {number|_Complex}
     */
    valueOf: function () {
      if (!this.im)
      {
        return new this.re;
      }

      return this;
    }
  });

  return {
    /**
     * @memberOf jsx.math.complex
     */
    Complex: _Complex
  };
}());