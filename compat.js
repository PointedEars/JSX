var _global = jsx.global;
var setErrorHandler = jsx.setErrorHandler;
var clearErrorHandler = jsx.clearErrorHandler;

var addProperties = jsx.object.addProperties;
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

var dhtml = jsx.dom;
var getElem = jsx.dom.getElem;
var setCont = jsx.dom.setCont;
var setStyleProperty = jsx.dom.setStyleProperty;
var CSS = jsx.dom.css;