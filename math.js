/**
 * <title>PointedEars' JSX: Basic Math Library</title>
 * @requires object.js
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
/*
 * This document contains JavaScriptDoc[tm], see
 * <http://pointedears.de/scripts/JSDoc/>
 * for details.
 * 
 * Refer math.htm file for general documentation.
 */

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

/**
 * @namespace
 */
jsx.math = {
  version:   "1.16.2005052117",
  copyright: "Copyright \xA9 1999-2005",
  author:    "Thomas Lahn",
  email:     "math.js@PointedEars.de",
  path:      "http://pointedears.de/scripts/"
};
// jsx.math.docURL = jsx.math.path + "math.htm";

/* User interface language */
jsx.math.language  = "en";

/** @section Exceptions */

jsx.math.msgInvArg = {
  'en': 'Invalid function argument',
  'de': 'Ungültiges Funktionsargument'
};

jsx.math.msgArgMissing = {
  'en': 'Required argument missing',
  'de': 'Erforderliches Argument fehlt'
};

jsx.math.msgInvOp = {
  'en': 'Invalid operand',
  'de': 'Ungültiger Operand'
};

jsx.math.msgOverflow = {
  'en': 'Overflow',
  'de': 'Überlauf'
};

jsx.math.msgUnderflow = {
  'en': 'Underflow',
  'de': 'Unterlauf'
};

jsx.math.msgDivByZero = {
  'en': 'Division by zero',
  'de': 'Division durch Null'
};

/**
 * @param sError
 * @param sMessage
 */
jsx.math.MathError = function(sError, sMessage) {
  this.constructor._super.call(this,
        "math.js Error: "
      + (typeof sError[jsx.math.language] != "undefined"
           ? sError[jsx.math.language]
           : sError["en"])
      + " " + (sMessage || ""));
};
jsx.math.MathError.extend(jsx.Error);

/**
 * @param sMethodCall
 * @param iErrorCode
 * @todo
 */
jsx.math.InvalidArgumentError = function(sMethodCall, iErrorCode) {
  var sSubErrType = jsx.math.msgInvArg;
  
  switch (iErrorCode)
  {
    case -1:
      sSubErrType = jsx.math.msgArgMissing;
      break;
  }
  
  jsx.math.MathError.call(this, sSubErrType);
};

jsx.math.InvalidOperandError = function() {
  jsx.math.MathError.call(this, jsx.math.msgInvOp);
};

jsx.math.OverflowError = function() {
  jsx.math.MathError.call(jsx.math.msgOverflow);
};

jsx.math.UnderflowError = function() {
  jsx.math.MathError.call(jsx.math.msgUnderflow);
};

jsx.math.DivisionByZeroError = function() {
  jsx.math.MathError.call(jsx.math.msgDivByZero);
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
