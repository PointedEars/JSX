/**
 * <title>PointedEars' JSX: Math Library: Rational arithmetics</title>
 * @requires object.js
 * @requires types.js
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
 * @namespace
 */
jsx.math.rational = (function () {
  /* Imports */
  var _gcd;
  function _get_gcd ()
  {
    if (!_gcd)
    {
      _gcd = jsx.math.integer.gcd;
    }

    return _gcd;
  }

  /**
   * Returns the value of this fraction as a {@link Number}.
   *
   * @return {number}
   */
  function _toNumber ()
  {
    return this.numerator / this.denominator;
  }

  var _rx = /((\d+)\s+)?(\d+)[\/∕](\d+)/;

  var _Fraction = jsx.object.extend(
    /**
     * A fraction is a rational number, a numerator divided by
     * a denominator.
     *
     * @constructor
     * @param {jsx.math.rational.Fraction|Number|String} numerator
     * @param {Number} denominator
     * @param {boolean} _dontReduce
     *   <code>true</code> if the fraction should not be reduced
     *   even though {@link jsx.math.rational.Fraction.autoreduce}
     *   is set. Required for proper operation of some calling methods.
     */
    function jsx_math_rational_Fraction (numerator, denominator, _dontReduce) {
      /* Called as a function? */
      if (!(this instanceof _Fraction))
      {
        return new _Fraction(numerator, denominator, _dontReduce);
      }

      if (numerator instanceof _Fraction)
      {
        /* Clone object */
        var num = numerator.numerator;
        var denom = numerator.denominator;
      }
      else if (numerator && typeof numerator.valueOf() == "string")
      {
        /* Parse fraction string */
        var m;
        if ((m = numerator.match(_rx)))
        {
          var integer_part = m[2];
          num = m[3];
          denom = m[4];

          if (integer_part)
          {
            num = (+num) + (integer_part) * denom;
          }
        }
        else
        {
          jsx.throwThis(jsx.InvalidArgumentError);
        }
      }
      else
      {
        num = numerator;
        denom = (typeof denominator != "undefined" ? denominator : 1);
      }

      this.numerator = +num;
      this.denominator = +denom;

      if (_Fraction.autoReduce && !_dontReduce)
      {
        return this.reduce();
      }
    },
    {
      /**
       * If <code>true</code> calls
       * {@link jsx.math.rational.Fraction.prototype.reduce() reduce()}
       * on results automatically.  The default is <code>false</code>
       * for better performance.
       *
       * @memberOf jsx.math.rational.Fraction
       */
      autoReduce: false,

      /**
       * Converts two fractions into like quantities
       * and returns the result.
       *
       * <code>(</code>1∕2<code>,</code> 2∕3<code>)</code>
       * → <code>[</code>3∕6<code>,</code> 4∕6<code>]</code>
       *
       * @param {_Fraction} a
       * @param {_Fraction} b
       * @return {Array[_Fraction, _Fraction]}
       */
      like: function (a, b) {
        if (!(a instanceof _Fraction))
        {
          a = new _Fraction(a);
        }

        if (!(b instanceof _Fraction))
        {
          b = new _Fraction(b);
        }

        var denom = a.denominator * b.denominator;

        return [
          new _Fraction(a.numerator * b.denominator, denom, true),
          new _Fraction(b.numerator * a.denominator, denom, true)
        ];
      }
    }
  ).extend(null, {
    /* Unary operators */
    /**
     * Returns the complement of this fraction with regard to addition.
     *
     * 1∕2 → −1∕2
     *
     * @memberOf jsx.math.rational.Fraction.prototype
     * @return {_Fraction}
     */
    negate: function () {
      return new _Fraction(-this.numerator, this.denominator);
    },

    /* Binary operators */
    /**
     * Adds two fractions and returns the result.
     *
     * (1∕2) + (2∕3) → 7∕6
     *
     * @param {_Fraction} operand
     * @return {_Fraction}
     */
    add: function (operand) {
      if (!(operand instanceof _Fraction))
      {
        operand = new _Fraction(operand);
      }

      var likes = _Fraction.like(this, operand);

      return new _Fraction(
        likes[0].numerator + likes[1].numerator,
        likes[0].denominator
      );
    },

    /**
     * Subtracts a fraction from another and returns the result.
     *
     * (2∕3) − (1∕2) ≡ (2∕3) + (−1∕2) → 1∕6
     *
     * @param {_Fraction} operand
     * @return {_Fraction}
     */
    subtract: function (operand) {
      if (!(operand instanceof _Fraction))
      {
        operand = new _Fraction(operand);
      }

      return this.add(this, operand.negate());
    },

    /**
     * Multiplies two fractions and returns the result.
     *
     * (1∕2) × (2∕3) → 2∕6
     *
     * @param {_Fraction} operand
     * @return {_Fraction}
     */
    multiply: function (operand) {
      if (!(operand instanceof _Fraction))
      {
        operand = new _Fraction(operand);
      }

      return new _Fraction(
        this.numerator * operand.numerator,
        this.denominator * operand.denominator
      );
    },

    /**
     * Divides a fraction by another and returns the result.
     *
     * (1∕2) ∕ (4∕6) ≡ (1∕2) × (6∕4) → 6∕8
     * @param {_Fraction} operand
     * @return {_Fraction}
     */
    divide: function (operand) {
      if (!(operand instanceof _Fraction))
      {
        operand = new _Fraction(operand);
      }

      return new _Fraction(
        this.numerator * operand.denominator,
        this.denominator * operand.numerator
      );
    },

    /* Equivalent transformations */
    /**
     * Extends a fraction by a factor.
     *
     * 1∕2 × 2 → 2∕4
     *
     * @param {Number} factor
     * @return {_Fraction}
     * @see #reduce()
     */
    extend: function (factor) {
      return this.multiply(new _Fraction(factor, factor));
    },

    /**
     * Reduces a fraction to its simplest equivalent.
     *
     * 4∕8 → 1∕2
     *
     * @return {_Fraction}
     * @see #extend()
     */
    reduce: function () {
      var num = this.numerator;
      var denom = this.denominator;
      var gcd = _get_gcd()(num, denom);

      if (gcd > 1)
      {
        return new _Fraction(num / gcd, denom / gcd, true);
      }

      return new _Fraction(this, null, true);
    },

    /**
     * Returns the reciprocal of this fraction.
     *
     * 2∕3 → 3∕2
     *
     * @return {_Fraction}
     */
    reciprocal: function () {
      return new _Fraction(this.denominator, this.numerator);
    },

    toNumber: _toNumber,

    /* Conversion */
    /**
     * Returns the string representation of this fraction.
     *
     * @return {string}
     */
    toString: function () {
      var num = this.numerator;
      var denom = this.denominator;
      return (num ? num + (denom != 1 ? "/" + denom : "") : "0");
    },

    /**
     * Returns this fraction as a vulgar fraction.
     *
     * 5∕3 → <code>[1, </code>2∕3<code>]</code>
     *
     * @return {Array[int, _Fraction]}
     */
    toVulgar: function () {
      var integer_part =
        (this.numerator - (this.numerator % this.denominator))
        / this.denominator;

      return [
        integer_part,
        new _Fraction(
          this.numerator - (integer_part * this.denominator),
          this.denominator
        )
      ];
    },

    /**
     * Returns this fraction as a vulgar fraction string.
     *
     * 5∕3 → <code>"1 2∕3"</code>
     *
     * @return {string}
     */
    toVulgarString: function () {
      var vulgar = this.toVulgar();
      var integer_part = vulgar[0];
      var fraction_part = vulgar[1];

      return (integer_part ? integer_part : "")
        + (fraction_part.numerator
            ? (integer_part ? " " : "") + fraction_part.toString()
            : (integer_part ? "" : "0"));
    },

    /**
     * @see #toNumber()
     */
    valueOf: _toNumber
  });

  return {
    /**
     * @memberOf jsx.math.rational
     */
    Fraction: _Fraction
  };
}());