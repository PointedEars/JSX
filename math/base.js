/**
 * <title>PointedEars' JSX: Math Library: Number Systems</title>
 * @requires object.js
 * @requires types.js
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
