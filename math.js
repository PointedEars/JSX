/**
 * @fileOverview <title>PointedEars' JSX: Basic Math Library</title>
 * @file $Id$
 * @requires object.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2000-2011, 2013, 2014 Thomas Lahn &lt;math.js@PointedEars.de&gt;
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
     * @param op1
     * @param op2
     * @return {any}
     */
    add: function (op1, op2) {
      if (_isNativeMethod(op1, "add"))
      {
        return op1.add(op2);
      }

      return op1 + op2;
    },

    /**
     * General subtraction
     *
     * @param op1
     * @param op2
     * @return {any}
     */
    sub: function (op1, op2) {
      if (_isNativeMethod(op1, "sub"))
      {
        return op1.sub(op2);
      }

      return op1 - op2;
    },

    /**
     * General multiplication
     *
     * @param op1
     * @param op2
     * @return {any}
     */
    mul: function (op1, op2) {
      if (_isNativeMethod(op1, "mul"))
      {
        return op1.mul(op2);
      }

      return op1 * op2;
    },

    /**
     * General division
     *
     * @param op1
     * @param op2
     * @return {any}
     */
    div: function (op1, op2) {
      if (_isNativeMethod(op1, "div"))
      {
        return op1.div(op2);
      }

      return op1 / op2;
    },

    /**
     * General exponentiation
     *
     * @param op1
     * @param op2
     * @return {any}
     */
    pow: function (op1, op2) {
      if (_isNativeMethod(op1, "pow"))
      {
        return op1.pow(op2);
      }

      return Math.pow(op1, op2);
    },

    /**
     * General square root
     *
     * @param op
     * @return {any}
     */
    sqrt: function (op) {
      if (_isNativeMethod(op, "sqrt"))
      {
        return op.sqrt();
      }

      return Math.sqrt(op);
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
