/*
  The following tag is for display in advanced filelists only:
  <TITLE>Extended Math Support</title>
  
  Refer math.htm file for general documentation.
*/

var mathVersion = "1.10.2003.7"; // Library version string 

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

function roundDigits(
  n,
  iSigDecimals,
  iForceDecimals,
  bForceLeadingZero,
  sDecSeparator)
/*
  Arguments:
  
  n                  Numeric value to round. Required.
  iSigDecimals       Significant decimals to round to. If negative round 
                     to positive powers of 10. Optional.
                     If out of the closed interval of [-14;14], the
                     function exits and returns n (unchanged).
                     If not provided, assume 0 and round the value to
                     a whole number.
  iForceDecimals     Number of digits to be returned with the number.
                     If smaller than iSigDigits, the value will be
                     ignored and the result is a Numeric value.
                     Otherwise the required number of zeroes will be
                     appended and the result is a String value.
                     Optional.
  bForceLeadingZero  If true, force leading zero if the value is between
                     0 and 1 or 0 and -1. The argument is optional.
                     If not provided, apply bForceLeadingZero=false;
  sDecSeparator      The character used for decimal delimiter instead.
                     In non-English speaking countries the comma (",")
                     is used instead of point (".") and vice-versa.
                     Optional. If not provided, use default decimal
                     separator. If provided, the result is a String value.
*/  
{
  if (! iSigDecimals) iSigDecimals = 0;
  
  /* Returns the number itself when called with invalid arguments, so
     further calculations will not fail because of a wrong function call.
  */
  if (iSigDecimals < -14 || iSigDecimals > 14) return n;

  var e = Math.pow(10, iSigDecimals);
  var i = String(n).indexOf(".");

  if (i < 0) i = String(n).length - 1;
  if (String(n).substring(0, i).length <= -iSigDecimals) return n;
    
  var k = Math.round(n * e) / e;
  
  if (arguments.length < 3) iForceDecimals = 0;

  if (iForceDecimals > 0)
  {
    k = String(k);
    i = k.indexOf(".");
    if ((i < 0) && (iForceDecimals > 0))
      k += ".";
    i = k.indexOf(".");
    for (var i = k.substr(i + 1).length; i < iForceDecimals; i++)
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

function root(n, iRoot)
{
  return (
    iRoot % 2 && n < 0 ? -1 : +1)
    * Math.pow(Math.abs(n), 1/Math.floor(iRoot));
}
Math.root = root;

function dec2base(iDec, iBase, iLength)
{
  // default values
  if (!iDec)  iDec  = 0;
  if (!iBase) iBase = 2; // binary
  
  var sResult = "";
  
  if (iDec != 0 && iBase != 10) 
  { // No calculation required if number is 0 or target base is decimal
    // Create array of _required_ digits
    var aDigits = new Array();
    for (var i = 0; i < (iBase < 10 ? iBase : 10); i++)
    {
      aDigits[aDigits.length] = i;
    }
    if (iBase > 10)
    {
      var iFirstLetter = "A".charCodeAt(0);
      for (var i = iFirstLetter; i < iFirstLetter + iBase - 10; i++)
      {
        aDigits[aDigits.length] = String.fromCharCode(i);
      }
    }
  
    while (iDec > 0)
    {
      sResult = aDigits[iDec % iBase] + sResult;
      iDec = Math.floor(iDec / iBase);
    }
  }

  if (iLength) while (sResult.length < iLength) sResult = "0" + sResult;
  
  return sResult;
}
Math.dec2base = dec2base;