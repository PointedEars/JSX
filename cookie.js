/**
 * <title>JavaScript Cookie Data Access Prototype</title>
 */
// Refer cookie.txt file for general documentation.

// TCookie prototype definition

function Cookie(sData)
{
  this.version = "1.4.2004012016";
  this.msgHeader =
      "Cookie JavaScript Cookie Data Access Prototype v"
    + this.version + " \xA9 2000-2004  Thomas Lahn. All rights reserved.\n"
    + "Web:   http://pointedears.de/\n"
    + "Email: cookie.js@PointedEars.de\n\n";
// reset properties
  this.name = "";
  this.value = "";
  this.expires = "";
  this.domain = "";
  this.path = "";
  this.secure = false;
  if (sData)
  {
    // properties
    // Separate the sections of cookie data to retrieve properties */
    var aCookieData = new Array();
    var sTempData = "";
    var i;
    
    for (i = 0; i < sData.length; i++)
    {
      var currentChar = sData.substr(i, 1);
      sTempData += currentChar;
      if (currentChar == ";" || i == sData.length - 1)
      {
        aCookieData[aCookieData.length] = sTempData;
        sTempData = "";
      }
    }
    
    for (i = 0; i < aCookieData.length; i++)
    {
      var sDataName = aCookieData[i].substring(0, aCookieData[i].indexOf("="));
      var sDataValue =
        aCookieData[i].substring(
          aCookieData[i].indexOf("=") + 1,
          aCookieData[i].length - 1);
    
      if (i == 0)
      {
        this.name = sDataName;
        this.value = sDataValue;
      }
      else
      {
        var sDataNameLower = sDataName.toLowerCase();
        if (sDataNameLower == "expires") this.expires = sDataValue;
        if (sDataNameLower == "domain" ) this.domain  = sDataValue;
        if (sDataNameLower == "path"   ) this.path    = sDataValue;
        if (sDataNameLower == "secure" ) this.secure  = true;
      }
    }
  }
  // methods
  this.loadData = cookie_loadData;
  this.toString = cookie_toString;
  this.aboutMe = cookie_aboutMe;
}

function cookie_loadData(sData)
{
  // Separate the sections of cookie data */
  var aCookieData = new Array();
  var sTempData = "";
  var i;

  for (i = 0; i < sData.length; i++)
  {
    var currentChar = sData.substr(i, 1);
    sTempData += currentChar;

    if(currentChar == ";")
    {
      aCookieData[aCookieData.length] = sTempData;
      sTempData = "";
    }
  }
  for (i = 0; i < aCookieData.length; i++)
  {
    var sDataName = aCookieData[i].substring(0, aCookieData[i].indexOf("="));
    var sDataValue =
      aCookieData[i].substring(
        aCookieData[i].indexOf("=") + 1,
        aCookieData[i].length - 1);

    if (i == 0)
    {
      this.name = sDataName;
      this.value = sDataValue;
    }
    else
    {
      var sDataNameLower = sDataName.toLowerCase();
      (sDataNameLower == "expires"
        ? this.expires = sDataValue
        : this.expires = 0);
      (sDataNameLower == "domain"
        ? this.domain = sDataValue
        : this.domain = "");
      (sDataNameLower == "path"
        ? this.path = sDataValue
        : this.path = "");
      (sDataNameLower == "secure"
        ? this.secure = true
        : this.secure = false);
    }
  }
}

function cookie_toString()
{
  return (
      this.name + "=" + this.value
    + "; Expires=" + this.expires
    + "; domain=" + this.domain
    + "; path=" + this.path
    + (this.secure ? "secure;" : ";"));
}

function cookie_aboutMe(showMsg)
{
  var result = false;
  
  if (showMsg)
  {
    alert(getObjInfo(this, "p", "s"));
  }
  else
  {
    result = getObjInfo(this, "p", "Ts");
  }
  
  return result;
}

// Create a cookie with the specified name and value.
function cookie_setCookie(sName, sValue, dDate, iExpirationType)
{
  var dExpiration = new Date();
  if (arguments.length > 3 && iExpirationType < 0)
  { // Countdown
    dExpiration.setTime(dExpiration.getTime() + dDate);
  }
  else // Expiration Date
  {
    dExpiration.setTime(dDate);
  }
  document.cookie =
      sName + "=" + escape(sValue)
    + "; expires=" + dExpiration + ";";
}

// Remove the cookie with the specified name.
function cookie_delCookie(sName)
{
  var d = new Date();
  return cookie_setCookie(sName, "null", d.getTime() - 1);
}

// Retrieve the value of the cookie with the specified name.
function cookie_getCookie(sName)
{
  // cookies are separated by semicolons
  var aCookie = document.cookie.split("; ");
  for (var i=0; i < aCookie.length; i++) {
    // a name/value pair (a crumb) is separated by an equal sign
    var aCrumb = aCookie[i].split("=");
    if (sName == aCrumb[0])
      return unescape(aCrumb[1]);
  }

  // a cookie with the requested name does not exist
  return null;
}