/**
 * @fileOverview <title>PointedEars' JSX: Basic Math Library</title>
 * @file $Id$
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2000-2011, 2013, 2014  Thomas Lahn &lt;math.js@PointedEars.de&gt;
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
/*
 * This document contains JavaScriptDoc[tm], see
 * <http://pointedears.de/scripts/JSDoc/>
 * for details.
 *
 * Refer math.htm file for general documentation.
 */

/**
 * @namespace
 */
jsx.math = (/** @constructor */ function () {
  /* Imports */
  var _isNativeMethod = jsx.object.isNativeMethod;

  /* Private variables */

  /**
   * @function
   */
  var _MathError = (
    /**
     * @constructor
     * @param {string} sError
     * @param {string} sMessage
     */
    function (sError, sMessage) {
      this.constructor._super.call(this,
        "math.js Error: "
        + (typeof sError[jsx.math.language] != "undefined"
          ? sError[jsx.math.language]
        : sError["en"])
        + " " + (sMessage || ""));
    }
  ).extend(jsx.Error);

  var _msgInvArg = {
    'en': 'Invalid function argument',
    'de': 'Ungültiges Funktionsargument'
  };

  var _msgArgMissing = {
    'en': 'Required argument missing',
    'de': 'Erforderliches Argument fehlt'
  };

  var _msgInvOp = {
    'en': 'Invalid operand',
    'de': 'Ungültiger Operand'
  };

  var _msgOverflow = {
    'en': 'Overflow',
    'de': 'Überlauf'
  };

  var _msgUnderflow = {
    'en': 'Underflow',
    'de': 'Unterlauf'
  };

  var _msgDivByZero = {
    'en': 'Division by zero',
    'de': 'Division durch Null'
  };

  var _slice = [].slice;

  function _op (operation, operands)
  {
    var operand1 = operands[0];
    if (_isNativeMethod(operand1, operation))
    {
      return operand1[operation].apply(operand1, _slice.call(operands, 1));
    }

    return Math[operation].apply(Math, operands);
  }

  /**
   * Returns <code>true</code> if <var>n</var> is an integer.
   *
   * @param {Number} n
   * @return {boolean}
   */
  function _isInteger (n)
  {
    return n % 1 == 0;
  }

  return {
    /**
     * @memberOf jsx.math
     */
    version:   "1.16.$Rev$",
    copyright: "Copyright \xA9 1999-2011, 2013",
    author:    "Thomas Lahn",
    email:     "math.js@PointedEars.de",
    path:      "http://pointedears.de/scripts/",

    /** User interface language */
    language: "en",

    /** @section Exceptions */

    msgInvArg: _msgInvArg,
    msgArgMissing: _msgArgMissing,
    msgInvOp: _msgInvOp,
    msgOverflow: _msgOverflow,
    msgUnderflow: _msgUnderflow,
    msgDivByZero: _msgDivByZero,

    MathError: _MathError,

    /**
     * @param {string} sMethodCall
     * @param {int} iErrorCode
     * @todo
     */
    InvalidArgumentError: (
      function (sMethodCall, iErrorCode) {
        var sSubErrType = _msgInvArg;

        switch (iErrorCode)
        {
          case -1:
            sSubErrType = _msgArgMissing;
            break;
        }

        _MathError.call(this, sSubErrType);
      }
    ).extend(_MathError),

    InvalidOperandError: function() {
      _MathError.call(this, _msgInvOp);
    },

    OverflowError: (function() {
      _MathError.call(_msgOverflow);
    }).extend(_MathError),

    UnderflowError: (function() {
      _MathError.call(_msgUnderflow);
    }).extend(_MathError),

    DivisionByZeroError: (function() {
      _MathError.call(_msgDivByZero);
    }).extend(_MathError),

    /**
     * General addition
     *
     * @param summand1
     * @param summand2
     * @return {any}
     */
    add: function (summand1, summand2) {
      if (_isNativeMethod(summand1, "add"))
      {
        return summand1.add(summand2);
      }

      return summand1 + summand2;
    },

    /**
     * General subtraction
     *
     * @param minuend
     * @param subtrahend
     * @return {any}
     */
    sub: function (minuend, subtrahend) {
      if (_isNativeMethod(minuend, "sub"))
      {
        return minuend.sub(subtrahend);
      }

      return minuend - subtrahend;
    },

    /**
     * General multiplication
     *
     * @param factor1
     * @param factor2
     * @return {any}
     */
    mul: function (factor1, factor2) {
      if (_isNativeMethod(factor1, "mul"))
      {
        return factor1.mul(factor2);
      }

      return factor1 * factor2;
    },

    /**
     * General division
     *
     * @param dividend
     * @param divisor
     * @return {any}
     */
    div: function (dividend, divisor) {
      if (_isNativeMethod(dividend, "div"))
      {
        return dividend.div(divisor);
      }

      return dividend / divisor;
    },

    /**
     * General operation
     *
     * @param {String} operation
     * @param {Array} operands
     * @return {any}
     */
    op: _op,

    /**
     * General natural logarithm
     *
     * @param base
     * @return {any}
     */
    log: function (base) {
      return _op("log", [base]);
    },

    /**
     * General exponentiation
     *
     * @param base
     * @param exponent
     * @return {any}
     */
    pow: function (base, exponent) {
      return _op("pow", [base, exponent]);
    },

    /**
     * General square root
     *
     * @param radicand
     * @return {any}
     */
    sqrt: function (radicand) {
      return _op("sqrt", [radicand]);
    },

    isInteger: _isInteger,

    /**
     * Returns <code>true</code> if <var>n</var> is a natural number
     * equal to or greater than 0.
     *
     * @param {Number} n
     * @return {boolean}
     */
    isNatural: function (n) {
      return n >= 0 && _isInteger(n);
    }
  };
}());

// jsx.math.docURL = jsx.math.path + "math.htm";

/*
 * TODO:

"I want the *option* to switch from standard 32-bit doubles to double
precision long doubles since it is not always necessary to run at such
high precision [sometimes I'll trade performance for precision.]

I would like *native* precision handlers (anything scripted
is considerably slower).

I would like a native fixed point and integer math package."

 */
