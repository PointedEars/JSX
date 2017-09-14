jsx.define("JSX:reflection", "JSX:inspect", function () {
  jsx.reflection = (function () {
    Function.prototype.toFactory = function () {
      var me = this;
      return function Factory () {
        if (!(this instanceof Factory)) return Factory.construct(arguments);
        me.apply(this, arguments);
      };
    };

    var _ReflectionProperty = function (o, name) {
      Object.assign(this, jsx.inspect.getOwnPropertyInfo(o));
    }.toFactory();

    var _ReflectionMethod = function (obj, propertyName) {
      _ReflectionMethod._super.call(this, obj, propertyName);

      var serialized = obj.toString();

      this.parsedName = (serialized.match(/function\s*(\S+)\s*\(/) || [])[1];
      var parameterList = serialized.match(/\([^)]+\)/);
      this.parameters =
        (parameterList && parameterList[0].match(/[^(),\s]+/g)) || [];

      this.body = (serialized.match(/\{\s*([\S\s]*)\s*\}/) || [])[1];

      this.propertyName = propertyName;
    }.toFactory().extend(_ReflectionProperty, {
      toFunction: function () {
        var f = new Function(this.body, this.parameters.join(", "));
        f.name = this.name;
        return f;
      }
    });

    var _ReflectionPrimitiveValue = function (value) {
      Object.assign(this, jsx.inspect.getValueInfo(value));
    }.toFactory();

    var _Reflection = function (obj) {
      if (!jsx.object.isObject(obj))
      {
        return _ReflectionPrimitiveValue(obj);
      }
      else
      {
        _ReflectionPrimitiveValue.call(this, obj);
      }

      this.prototypeChain = jsx.inspect.getPrototypeChain(obj);

      var ownPropertyNames = Object.getOwnPropertyNames(obj);

      this.methods = ownPropertyNames.filter(function (name) {
        return (typeof obj[name] == "function");
      }).map(function (name) { return _ReflectionMethod(obj[name], name); });

      this.properties = ownPropertyNames.filter(function (name) {
        return (typeof obj[name] != "function");
      }).map(function (name) { return _ReflectionProperty(obj[name], name); });
    }.toFactory().extend(Object, {
      toObject: function () {
        var result = Object.create(this._prototype);

        this.methods.forEach(function (method) {
          result[method.propertyName] = method.toFunction();
        });

        this.methods.forEach(function (property) {
          Object.defineOwnProperty(result, property.name, property.getDescriptor());
        });
      }
    });

    return {
      Reflection: _Reflection,
      ReflectionMethod: _ReflectionMethod,
      ReflectionPrimitiveValue: _ReflectionPrimitiveValue,
      ReflectionProperty: _ReflectionProperty
    }
  }());
});
