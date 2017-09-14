jsx.define("JSX:inspect", ["JSX:object"], function () {
  "use strict";

  jsx.inspect = (function () {
    function _getPrototypeChain (obj)
    {
      var
        chain = [],
        proto = obj;

      while ((proto = (proto.__proto__ || Object.getPrototypeOf(proto))))
      {
        chain.push(proto);
      }

      return chain;
    }

    function _getValueInfo (value)
    {
      return Object.assign(Object.create(null), {
        name: name,
        value: value,
        type: typeof value,
        "class": jsx.object.getClass(value),
        constructor: value && value.constructor
      });
    }

    function _getOwnPropertyInfo (obj, propertyNames)
    {
      if (!propertyNames)
      {
        propertyNames = Object.getOwnPropertyNames(obj);
      }
      else if (!Array.isArray(propertyNames))
      {
        propertyNames = [propertyNames];
      }

      return propertyNames.map(function (name) {
        var value = this[name];

        return Object.assign(_getValueInfo(value), {
          owner: obj,
          descriptor: Object.getOwnPropertyDescriptor(this, name)
        });
      }, obj);
    }

    return {
      getPrototypeChain: _getPrototypeChain,
      getOwnPropertyInfo: _getOwnPropertyInfo,
      getValueInfo: _getValueInfo
    };
  }());
});
