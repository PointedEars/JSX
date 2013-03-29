var _global = jsx.global;
var setErrorHandler = jsx.setErrorHandler;
var clearErrorHandler = jsx.clearErrorHandler;

var addProperties = jsx.object.addProperties = (function () {
  var rxObject = /^\s*(object|function)\s*$/i;

  return function (oSource, iFlags, oOwner) {
    if (rxObject.test(typeof iFlags))
    {
      oOwner = iFlags;
      iFlags = 0;
    }

    if (!oOwner)
    {
      oOwner = jsx.global;
    }

    return jsx.object.setProperties(oOwner, oSource, iFlags);
  };
}());

var isMethod = function () {
  for (var i = arguments.length; i--;)
  {
    if (!jsx.object.isMethod(arguments[i]))
    {
      return false;
    }
  }

  return true;
};

var isMethodType = jsx.object.isMethodType;
var isInstanceOf = jsx.object.isInstanceOf;

var types = jsx.types;

var Collection = jsx.Collection;