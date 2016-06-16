/**
 * @fileOverview <title>Basic Object Library</title>
 * @file $Id$
 *
 * @author (C) 2004-2016 Thomas Lahn <js@PointedEars.de>
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

if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

/* allows for de.pointedears.jsx.object */
if (typeof de == "undefined")
{
  /**
   * @namespace
   */
  var de = {};
}

if (typeof de.pointedears == "undefined")
{
  /**
   * @namespace
   */
  de.pointedears = {};
}

/**
 * @namespace
 */
de.pointedears.jsx = jsx;

(function (global) {
  "use strict";

  /**
   * Wrapper for a safer <code>try</code>...<code>catch</code>.
   *
   * Attempts to evaluate a value as a <i>StatementList</i>, and attempts
   * to evaluate another value as a <i>StatementList</i> if an exception
   * is thrown in the process.  The following words may be used within:
   *
   * <table>
   *   <thead>
   *     <tr>
   *       <th align="left">Word</th>
   *       <th align="left">Refers to</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr valign="top">
   *       <td><code>statements</code><br>
   *           <code>errorHandler</code></td>
   *       <td>the passed values</td>
   *     </tr>
   *     <tr valign="top">
   *       <td>code</td>
   *       <td>the entire constructed <code>try</code>...<code>catch</code>
   *           string that is evaluated as a <i>Program</i></td>
   *     </tr>
   *     <tr valign="top">
   *       <td>e</td>
   *       <td>Only within <var>errorHandler</var>:
   *           the value thrown in case of an exception</td>
   *     </tr>
   *     <tr valign="top">
   *       <td>result</td>
   *       <td>Only within <var>finalizer</var>:
   *           the previous evaluation value</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * NOTE: This method has previously been provided by {@link exception.js};
   * optimizations in code reuse moved it here.
   *
   * @function
   * @param {Function|string|any} statements
   *   Value to be evaluated as a <i>StatementList</i>.
   *   Called if a <code>Function</code>, used as-is otherwise.
   * @param {Function|string|any} errorHandler
   *   Value to be evaluated as a <i>StatementList</i> in case of an
   *   exception.  Called if a <code>Function</code>,
   *   used as-is otherwise.
   * @param {Function|string|any} finalizer
   *   Value to be evaluated as a <i>StatementList</i> in any case,
   *   after the statements and error handler.  Called if a
   *   <code>Function</code>, used as-is otherwise.
   * @return {any}
   *   The result of <code>statements</code>, or the result
   *   of <code>errorHandlers</code> if an error occurred,
   *   unless <var>finalizer</var> is provided; if it is,
   *   the evaluation result of <var>finalizer</var>.
   */
  jsx.tryThis =
  //  (function () {
  //  /**
  //   * @param s Value to be stringified
  //   * @param {String} sCall
  //   *   CallStatement that should be used instead of the value
  //   * @return {string} Stringified version of <code>s</code>
  //   */
  //  function stringify(s, sCall)
  //  {
  //    if (typeof s == "function")
  //    {
  //      s = sCall;
  //    }
  //    else if (typeof s == "undefined")
  //    {
  //      s = "";
  //    }
  //
  //    return s;
  //  }

    /*return*/ function (statements, errorHandler, finalizer) {
      /*
       * Replaced because eval() performs magnitudes worse;
       * TODO: Backwards compatibility (branching for NN4 & friends?)
       */
  //    var sStatements = stringify(statements, "statements();");
  //    var sErrorHandlers = stringify(errorHandlers, "errorHandlers(e);");
  //
  //    var code = 'try {\n  ' + sStatements + '\n}\n'
  //             + 'catch (e) {\n  ' + sErrorHandlers + '\n}';
  //
  //    return eval(code);
      var t = typeof statements;
      var result;
      /*jshint -W061*/
      try
      {
        result = (t == "function" ? statements() : eval(statements));
      }
      catch (e)
      {
        t = typeof errorHandler;
        result = (t == "function" ? errorHandler(e) : eval(errorHandler));
      }
      finally
      {
        if (finalizer != null)
        {
          t = typeof finalizer;
          result = (t == "function" ? finalizer() : eval(finalizer));
        }
      }
      /*jshint +W061*/

      return result;
    };
  //}());

  /**
   * @namespace
   */
  jsx.object = (/** @constructor */ function () {
    var _MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;

    var
      rxUnknown = /^unknown$/,
      rxMethod = /^(function|object)$/;

    /**
     * Determines whether an object is, or several objects are,
     * likely to be callable.
     *
     * @author (C) 2003-2010  <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
     * @param {Object} obj
     *   Object which should be tested for a method, or checked
     *   for being a method if no further arguments are provided.
     *   <p>
     *   <em>NOTE: If you pass a primitive value for this argument,
     *   the properties of the object created from that value are considered.
     *   In particular, if you pass a string value containing
     *   a <i>MemberExpression</i>, the properties of the corresponding
     *   <code>String</code> instance are considered, not of the object that
     *   the <i>MemberExpression</i> might refer to.  If you need to use such
     *   a string to refer to an object (e.g., if you do not know whether it
     *   is safe to refer to the object), use the return value of
     *   {@link jsx#tryThis jsx.tryThis("<var>MemberExpression</var>")}
     *   as argument to this method instead.</em>
     *   </p>
     * @param {string|Array} prop (optional)
     *   Path of the property to be determined a method, i.e. a reference to
     *   a callable object assigned as property of another object.
     *   Use a string argument for each component of the path, e.g.
     *   the argument list <code>(o, "foo", "bar")</code> for testing whether
     *   <code>o.foo.bar</code> is a method.
     *   If the last argument is an {@link Array}, all elements of
     *   this array are used for property names; e.g.
     *   <code>(o, "foo", ["bar", "baz"])</code>.  This allows for testing
     *   several properties of the same object with one call.
     * @return {boolean}
     *   <code>true</code> if all arguments refer to methods,
     *   <code>false</code> otherwise.
     */
    function _isMethod (obj, prop)
    {
      var len = arguments.length;
      if (len < 1)
      {
        jsx.throwThis("jsx.InvalidArgumentError",
          ["Not enough arguments", "saw 0", "(obj : Object[, prop : string])"]);
        return false;
      }

      /*
       * Determine if we were apply'd by jsx.object.isNativeMethod;
       */
      var checkNative = (this == _isNativeMethod);

      var t = typeof obj;

      /* When no property names are provided, test if the first argument is a method */
      if (len < 2)
      {
        if (checkNative)
        {
          return t == "function" && obj && true || false;
        }

        return rxUnknown.test(t) || rxMethod.test(t) && obj && true || false;
      }

      /* otherwise the first argument must refer to a suitable object */
      /* FIXME: Does not recognize the zero-length string as convertible */
      if (rxUnknown.test(t) || !obj)
      {
        return false;
      }

      for (var i = 1; i < len; i++)
      {
        prop = arguments[i];

        /* NOTE: Handle null _and_ undefined */
        if (prop == null)
        {
          return false;
        }

        var isLastSeg = (i == len - 1);
        if (isLastSeg)
        {
          if (typeof prop.valueOf() == "string")
          {
            prop = [prop];
          }

          var aProp = prop;
        }

        for (var j = (isLastSeg && aProp.length || 1); j--;)
        {
          if (isLastSeg)
          {
            prop = aProp[j];
          }

          t = typeof obj[prop];

          /*
           * NOTE: Test for "unknown" required in any case;
           * this order speeds up evaluation
           */
          if (rxUnknown.test(t) || (rxMethod.test(t) && obj[prop]))
          {
            if (i < len - 1)
            {
              obj = obj[prop];
              if (!(rxUnknown.test(typeof obj) || obj))
              {
                return false;
              }
            }
            else if (checkNative && t != "function")
            {
              return false;
            }
          }
          else
          {
            return false;
          }
        }
      }

      return true;
    }

    /**
     * Determines whether an object is, or several objects are,
     * likely to be a native method.
     *
     * @author (C) 2011  <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
     * @param {Object} obj
     *   Object which should be tested for a method, or checked
     *   for being a method if no further arguments are provided.
     *   <p>
     *   <em>NOTE: If you pass a primitive value for this argument,
     *   the properties of the object created from that value are considered.
     *   In particular, if you pass a string value containing
     *   a <i>MemberExpression</i>, the properties of the corresponding
     *   <code>String</code> instance are considered, not of the object that
     *   the <i>MemberExpression</i> might refer to.  If you need to use such
     *   a string to refer to an object (e.g., if you do not know whether it
     *   is safe to refer to the object), use the return value of
     *   {@link jsx#tryThis jsx.tryThis("<var>MemberExpression</var>")}
     *   as argument to this method instead.</em>
     *   </p>
     * @param {string|Array} prop (optional)
     *   Path of the property to be determined a method, i.e. a reference to
     *   a callable object assigned as property of another object.
     *   Use a string argument for each component of the path, e.g.
     *   the argument list <code>(o, "foo", "bar")</code> for testing whether
     *   <code>o.foo.bar</code> is a method.
     *   If the last argument is an {@link Array}, all elements of
     *   this array are used for property names; e.g.
     *   <code>(o, "foo", ["bar", "baz"])</code>.  This allows for testing
     *   several properties of the same object with one call.
     * @return {boolean}
     *   <code>true</code> if all arguments refer to methods,
     *   <code>false</code> otherwise.
     */
    /*jshint -W098*/
    function _isNativeMethod (obj, prop)
    {
      /* NOTE: Thread-safe, argument-safe code reuse -- `this' is our ID */
      return _isMethod.apply(_isNativeMethod, arguments);
    }
    /*jshint +W098*/

    /**
     * Determines if an object has a (non-inherited) property.
     *
     * @param {Object} obj (optional)
     *   Object which property should be checked for existence.
     * @param {string} sProperty
     *   Name of the property to check.
     * @return {boolean}
     *   <code>true</code> if there is such a property;
     *   <code>false</code> otherwise.
     */
    function _hasOwnProperty (obj, sProperty)
    {
      if (arguments.length < 2 && obj)
      {
        sProperty = obj;
        obj = jsx_object;
      }

      var proto;

      return (_isMethod(obj, "hasOwnProperty")
        ? obj.hasOwnProperty(sProperty)
        : (typeof obj[sProperty] != "undefined"
            && (null == obj.constructor
                || ((proto = obj.constructor.prototype)
                     && typeof proto[sProperty] == "undefined"))));
    }

    /**
     * Determines if a value refers to an object.
     *
     * <p>Returns <code>true</code> if the value is a reference
     * to an object; <code>false</code> otherwise.</p>
     *
     * <p>A value "is an object" if it is a function,
     * <code>typeof "object"</code> or a host object
     * (not a primitive value), but not <code>null</code>.
     *
     * @return {boolean}
     */
    function _isObject (a)
    {
      var t = typeof a;

      return t == "function"
        || (t == "object"
              || (t != "undefined" && t != "boolean"
                  && t != "number" && t != "string")
            && a !== null);
    }

    /**
     * Returns the own enumerable properties of an object
     *
     * @param {Object} obj
     *   Object from which to get the keys
     * @return {Array}
     *   Own enumerable properties of <var>obj</var>
     * @see Object#keys
     */
    function _getKeys (obj)
    {
      if (typeof Object.keys == "function" && !Object.keys._emulated)
      {
        return Object.keys(obj);
      }

      if (!_isObject(obj))
      {
        return jsx.throwThis("TypeError",
          "jsx.object.getKeys() called on non-object");
      }

      var names = [];

      for (var p in obj)
      {
        if (_hasOwnProperty(obj, p))
        {
          names.push(p);
        }
      }

      return names;
    }

    function Dummy () {}

    /**
     * Lets one object inherit from another
     *
     * @param {Object} obj = Object.prototype
     *   Object from which to inherit.  The default is
     *   <code>Object.prototype</code>.
     * @return {Object}
     *   Inheriting (child) object
     */
    function _inheritFrom (obj)
    {
      var prototype = (typeof obj == "undefined"
        ? Object.prototype
        : (obj || null));

      if (typeof Object.create == "function" && !Object.create._emulated)
      {
        return Object.create(prototype);
      }

      if (typeof obj == "object" && obj == null)
      {
        var result = {};
        /*jshint -W103*/
        result.__proto__ = null;
        /*jshint +W103*/
        return result;
      }

      Dummy.prototype = prototype;
      return new Dummy();
    }

    /**
     * Returns the value of an object's internal <code>[[Class]]</code>
     * property.
     *
     * Calls the <code>Object.prototype.toString()</code> method on
     * the object and returns the result of matching against
     * the specified return value, which includes the value of
     * the object's internal <code>[[Class]]</code> property. Although
     * implementations use prototype-based inheritance, the property
     * value is useful for determining the type of an object regardless
     * of the current value of its <code>constructor</code> property.
     * For example, that makes it possible to recognize <code>Array</code>
     * instances independent of the global context in which they were
     * constructed, even if {@link Array.isArray} is not provided by
     * the ECMAScript implementation.
     *
     * @see ECMAScript Language Specification, Edition 5.1, section 15.4.3.2
     * @see jsx.object.isArray()
     * @function
     */
    var _getClass = (function () {
      var _toString = ({}).toString;

      /**
       * @param obj
       * @return {string|Undefined}
       *   The value of an object's internal [[Class]] property, or
       *   <code>undefined</code> if the property value cannot be determined.
       */
      function getClass (obj)
      {
        return (_toString.call(obj)
          .match(/^\s*\[object\s+(\S+)\s*\]\s*$/) || [, ""])[1];
      }

      return getClass;
    }());

    /**
     * Determines if a value refers to an {@link Array}.
     * <p>
     * Returns <code>true</code> if the value is a reference to an object
     * whose <code>[[Class]]</code> internal property is <code>"Array"</code>;
     * <code>false</code> otherwise.
     * </p>
     *
     * @param a
     *   Potential <code>Array</code>
     * @return {boolean}
     */
    function _isArray (a)
    {
      return (typeof Array.isArray == "function" && !Array.isArray._emulated
        ? Array.isArray(a)
        : (a && a.constructor == Array) || _getClass(a) == "Array");
    }

    var _rxPrimitive = /^(boolean|function|number|object|string)$/;

    /**
     * Determines if a value is a primitive value convertible to
     * an object or a reference to a native object.
     *
     * @param value
     * @return {boolean}
     */
    function _isNativeObject (value)
    {
      var t = (_isObject(value)
        && typeof value.valueOf == "function"
        && typeof value.valueOf());

      return (t
        && (_rxPrimitive.test(t)
            || _isArray(value)
            || /^(Date|Error|RegExp)$/.test(_getClass(value))
            || (typeof Math != "undefined" && value == Math)
            || (typeof JSON != "undefined" && value == JSON))
      );
    }

    /**
     * Used by {@link #extend()} and {@link #setProperties()}
     * to overwrite existing properties.
     */
    var _ADD_OVERWRITE = 1;

    /**
     * Used by {@link #extend()} and {@link #clone()}
     * to make a shallow copy of all enumerable properties (default).
     */
    var _COPY_ENUM = 0;

    /**
     * Used by {@link #extend()} and {@link #clone()}
     * to make a deep copy of all enumerable properties.
     */
    var _COPY_ENUM_DEEP = 2;

    /**
     * Used by {@link #extend()} and {@link #clone()}
     * to copy a property by inheritance.
     */
    var _COPY_INHERIT = 4;

    function _getProto (o)
    {
      if (typeof Object.getPrototypeOf == "function"
          && !Object.getPrototypeOf._emulated)
      {
        return Object.getPrototypeOf(o);
      }

      /*jshint -W103*/
      return o.__proto__ || (o.constructor && o.constructor.prototype);
      /*jshint +W103*/
    }

    function _createTypedObject (oOriginal)
    {
      var prototype = _getProto(oOriginal);
      return (prototype ? _inheritFrom(prototype) : _inheritFrom());
    }

    /**
     * Creates a duplicate (clone) of an object
     *
     * @param {Object} oSource (optional)
     *   Object to be cloned.  If omitted or <code>null</code>,
     *   the calling object is cloned.
     * @param {Number} iLevel (optional)
     *   Use the {@link #COPY_ENUM jsx.object.COPY_*}
     *   properties to specify the level of cloning.
     *   The default is {@link #COPY_ENUM}.
     * @return {Object}
     *   A reference to the clone.
     */
    function _clone (oSource, iLevel)
    {
      if (typeof oSource == "number")
      {
        var tmp = oSource;
        oSource = iLevel;
        iLevel = tmp;
      }

      if (!oSource)
      {
        oSource = jsx_object;
      }

      if (typeof iLevel == "undefined")
      {
        iLevel = _COPY_ENUM;
      }

      if (iLevel & _COPY_INHERIT)
      {
        return _inheritFrom(oSource);
      }

      var me = _clone;

      /*
       * NOTE: For objects, valueOf() only copies the object reference,
       *       so we are creating an instance that inherits from the
       *       original's prototype, if possible.
       */
      var o2 = (typeof oSource == "object" && oSource
             ? _createTypedObject(oSource)
             : oSource.valueOf());

      for (var p in oSource)
      {
        if (_hasOwnProperty(oSource, p))
        {
          if (iLevel && _isObject(oSource[p]))
          {
            jsx.tryThis(function () {
              o2[p] = me(oSource[p], iLevel);
            });
          }
          else
          {
            jsx.tryThis(function () {
              o2[p] = oSource[p];
            });
          }
        }
      }

      /*
       * "var p in ..." might not have copied (all) the array elements
       * (NN < 4.8 or user-defined non-enumerable elements only)
       */
      if (_isArray(o2))
      {
        for (var i = oSource.length; i--;)
        {
          if (_hasOwnProperty(oSource, i) && !_hasOwnProperty(o2, i))
          {
            if (iLevel && _isObject(oSource[i]))
            {
              jsx.tryThis(function () {
                o2[i] = me(oSource[i], iLevel);
              });
            }
            else
            {
              jsx.tryThis(function () {
                o2[i] = oSource[i];
              });
            }
          }
        }
      }

      return o2;
    }

    /**
     * Defines a property of an object.
     *
     * Emulation of the Object.defineProperty() method from ES 5.1,
     * section 15.2.3.6.
     *
     * Uses {@link Object.prototype#__defineGetter__} and
     * {@link Object.prototype#__defineSetter__} (JavaScript only) as fallback.
     *
     * @function
     * @return {Object} Reference to the object
     */
    var _defineProperty = (function () {
      function _toPropertyDescriptor (obj)
      {
        if (!_isObject(obj))
        {
          jsx.throwThis("TypeError", "Object expected");
        }

        var desc = {};

        if (_hasOwnProperty(obj, "enumerable"))
        {
          desc.enumerable = !!obj.enumerable;
        }

        if (_hasOwnProperty(obj, "configurable"))
        {
          desc.configurable = !!obj.configurable;
        }

        var hasValue = obj.hasOwnProperty("value");
        if (hasValue)
        {
          desc.value = obj.value;
        }

        var hasWritable = _hasOwnProperty(obj, "writable");
        if (hasWritable)
        {
          desc.writable = !!obj.writable;
        }

        var hasGetter = _hasOwnProperty(obj, "get");
        if (hasGetter)
        {
          if (typeof obj.get != "function")
          {
            return jsx.throwThis("TypeError", "Function expected for getter");
          }

          desc.get = obj.get;
        }

        var hasSetter = _hasOwnProperty(obj, "set");
        if (hasSetter)
        {
          if (typeof obj.set != "function")
          {
            return jsx.throwThis("TypeError", "Function expected for setter");
          }

          desc.set = obj.set;
        }

        if ((hasGetter || hasSetter) && (hasValue || hasWritable))
        {
          return jsx.throwThis("TypeError", "Cannot define getter/setter and value/writable");
        }

        return desc;
      }

      function _defineOwnProperty (obj, propertyName, descriptor, _throw, context)
      {
        function _isAccessorDescriptor (desc)
        {
          if (typeof desc == "undefined")
          {
            return false;
          }

          return _hasOwnProperty(desc, "get") || _hasOwnProperty(desc, "set");
        }

        function _isDataDescriptor (desc)
        {
          if (typeof desc == "undefined")
          {
            return false;
          }

          return desc.hasOwnProperty("value") || _hasOwnProperty(desc, "writable");
        }

        function _isGenericDescriptor (desc)
        {
          if (typeof desc == "undefined")
          {
            return false;
          }

          return !_isAccessorDescriptor(desc) && !_isDataDescriptor(desc);
        }

  //      var current = obj.hasOwnProperty(propertyName);
  //      var extensible = obj[propertyName].[[Extensible]]

        if (_isGenericDescriptor(descriptor) || _isDataDescriptor(descriptor))
        {
          var value = descriptor.value;
          obj[propertyName] = value;

          if (!descriptor.writable)
          {
            jsx.tryThis(
              function () {
                /* NOTE: Need getter because __defineSetter__() undefines value */
                obj.__defineGetter__(propertyName, function () {
                  return value;
                });

                obj.__defineSetter__(propertyName, function () {});
              },
              function () {
                obj[propertyName] = value;

                jsx.warn((context ? context + ": " : "")
                  + "Could not define property `" + propertyName
                  + "' as read-only");
              });
          }
        }
        else
        {
          /* accessor property descriptor */
          jsx.tryThis(
            function () {
              if (descriptor["get"])
              {
                obj.__defineGetter__(propertyName, descriptor["get"]);
              }

              if (descriptor["set"])
              {
                obj.__defineSetter__(propertyName, descriptor["set"]);
              }
            },
            function () {
              jsx.warn((context ? context + ": " : "")
                + "Could not define special property `" + propertyName + "'."
                + " Please use explicit getters and setters instead.");
            });
        }

        return false;
      }

      /**
       * @function
       */
      var _defineProperty = _extend(
        /**
         * @param {Object} o
         * @param {Object} descriptor (optional)
         *   Property descriptor, a reference to an object that defines
         *   the attributes of the property.   Must be of the form
         * <code><pre>{
         *   propertyName: {
         *     configurable: …,
         *     enumerable: …,
         *     value: …,
         *     writable: …,
         *     get: function () {…},
         *     set: function (newValue) {…}
         *   },
         *   …
         * }
         *   </pre></code> as specified in the ECMAScript Language Specification,
         *   Edition 5 Final, section 15.2.3.7.  Note that the
         *   <code>[[Configurable]]</code> and <code>[[Enumerable]]</code>
         *   attributes cannot be emulated.  The [[Writable]] attribute,
         *   and getter and setter can only be emulated if the
         *   <code>__defineGetter__()</code> and <code>__defineSetter__()</code>
         *   methods are available, respectively.
         * @param {string} sContext (optional)
         *   The context in which the property definition was attempted.
         *   Included in the info message in case getters and setters
         *   could not be defined.
         */
        function (o, propertyName, descriptor, sContext) {
          var done = false;

          if (typeof Object.defineProperty == "function"
              && !Object.defineProperty._emulated)
          {
            jsx.tryThis(function () {
              Object.defineProperty(o, propertyName, descriptor);
              done = true;
            });
          }

          if (!done)
          {
            if (!/^(object|function)$/.test(typeof o) || !o)
            {
              return jsx.throwThis("TypeError", "Object expected");
            }

            var name = String(propertyName);
            var desc = _toPropertyDescriptor(descriptor);
            _defineOwnProperty(o, name, desc, true, sContext);
          }

          return o;
        },
        {
          _emulated: true
        });

      return _defineProperty;
    }());

    /**
     * Adds/replaces properties of an object.
     *
     * <p>
     * <em>Not to be confused with {@link Function.prototype.extend}.</em>
     * </p>
     *
     * @param {Object} oTarget
     *   Target object whose properties should be set.
     * @param {Object} oSource
     *   Object specifying the properties to be set.
     *   The name of each property serves as the name for the
     *   property of the target object, its value as the value
     *   of that property.
     * @param {Number} iFlags = 0
     *   Flags for the modification, see {@link #ADD_OVERWRITE}
     *   and {@link #COPY_ENUM jsx.object.COPY_*}.
     * @return {Object}
     *   The extended object
     */
    function _extend (oTarget, oSource, iFlags)
    {
      if (typeof iFlags == "undefined")
      {
        iFlags = 0;
      }

      var cloneLevel = (iFlags & (_COPY_ENUM_DEEP | _COPY_INHERIT));

      for (var i = 0, keys = _getKeys(oSource), len = keys.length;
           i < len; ++i)
      {
        var p = keys[i];

        if (typeof oTarget[p] == "undefined" || (iFlags & _ADD_OVERWRITE))
        {
          jsx.tryThis(function () {
            /* TODO: Support cloning of property attributes */
            oTarget[p] = (cloneLevel
              ? _clone(oSource[p], cloneLevel)
              : oSource[p]);
            oTarget[p]._userDefined = true;
          });
        }
      }

      return oTarget;
    }

    /**
     * Returns a feature of an object
     *
     * @param {Object} obj
     *   Object which provides the feature
     * @param {string|Array} path
     *   Property names on the feature path, including the property
     *   for the feature itself.  For example, use
     *   <code>jsx.object.getFeature(foo, "bar", "baz")</code> for
     *   safe access to <code>foo.bar.baz</code>.
     *   If this argument is an <code>Array</code>, it is used
     *   instead of the remaining argument list; this is the
     *   recommended way to call this method to ensure upwards
     *   compatibility.
     * @return {any}
     *   <code>undefined</code> if <var>obj</var> does not have such
     *   a feature.  Note that features whose value can be
     *   <code>undefined</code> cannot be detected with this method.
     */
    function _getFeature (obj, path)
    {
      var realPath = path;
      var start = 0;

      if (!_isArray(realPath))
      {
        realPath = arguments;
        start = 1;
      }

      for (var i = start, len = realPath.length; i < len; i++)
      {
        var component = realPath[i];
        if (_isObject(obj)
            && typeof obj[component] != "undefined" && obj[component])
        {
          obj = obj[component];
        }
        else
        {
          return void 0;
        }
      }

      return obj;
    }

    /* For getFunctionName from JSdoc; TODO: Use ES parser library */
    var _srxUnicodeLetter = "\\p{Lu}\\p{Ll}\\p{Lt}\\p{Lm}\\p{Lo}\\p{Nl}";
    var _srxUnicodeEscapeSequence = "\\\\u[\\da-fA-F]{4}";
    var _srxIdentifierStart = _srxUnicodeLetter + "$_" + _srxUnicodeEscapeSequence;
    var _srxUnicodeCombiningMark = "\p{Mn}\p{Mc}";
    var _srxUnicodeDigit = "\\{Nd}";
    var _srxUnicodeConnectorPunctuation = "\\p{Pc}";
    var _srxIdentifierPart =
      + _srxIdentifierStart
      + _srxUnicodeCombiningMark
      + _srxUnicodeDigit
      + _srxUnicodeConnectorPunctuation;
    var _srxIdentifierName = "[" + _srxIdentifierStart + "][" + _srxIdentifierPart + "]*";

    var jsx_object = {
      /**
       * @memberOf jsx.object
       * @version
       */
      version: "$Revision$ ($Date$)",

      copyright: "Copyright \xA9 2004-2013",
      author: "Thomas Lahn",
      email: "js@PointedEars.de",
      path: "http://PointedEars.de/scripts/",
  //    docURL: jsx.object.path + "object.htm",

      ADD_OVERWRITE: _ADD_OVERWRITE,
      COPY_ENUM: _COPY_ENUM,
      COPY_ENUM_DEEP: _COPY_ENUM_DEEP,
      COPY_INHERIT: _COPY_INHERIT,

      isMethod: _isMethod,
      areMethods: _isMethod,
      isHostMethod: _isMethod,
      areHostMethods: _isMethod,

      isNativeMethod: _isNativeMethod,
      areNativeMethods: _isNativeMethod,

      /**
       * Calls a property if it is likely to be callable, and
       * returns its result.
       *
       * @param {Array} aPath
       *   Argument list for <code><var>fTester</var></code>
       * @param {Array} aArguments
       *   Argument list for the method call
       * @param {Function} fTester
       *   Testing method. Recommended values include
       *   {@link #isNativeMethod()} and {@link #isHostMethod()}.
       *   The default is {@link #isMethod()}.
       * @return {Object}
       *   <code>{returnValue: <var>value</var>}</code> if the method
       *   could be called, where <code><var>value</var></code> is
       *   the return value of the method;
       *   <code>null</code> otherwise.
       */
      callIfMethod: function (aPath, aArguments, fTester) {
        if (!fTester)
        {
          fTester = _isMethod;
        }

        if (fTester.apply(this, aPath))
        {
          var method = _getFeature.apply(this, aPath);
          var returnValue = method.apply(aPath[0], aArguments);
          return {returnValue: returnValue};
        }

        return null;
      },

      /**
       * Determines if the passed value could be the result of
       * <code>typeof <var>callable</var></code>.
       * <p>
       * NOTE: This method has previously been provided by {@link types.js};
       * optimizations in code reuse moved it here.
       * </p>
       * @param {string} s
       *   String to be determined a method type, i.e.
       *   <code>"object"</code> or <code>"unknown"</code> in MSHTML,
       *   <code>"function"</code> otherwise.  The type must have been
       *   retrieved with the <code>typeof<code> operator.  Note that
       *   this method may also return <code>true</code> if the value
       *   of the <code>typeof</code> operand is <code>null</code>;
       *   to be sure that the operand is a method reference, you
       *   have to <code>&&</code> (AND)-combine the
       *   <code>isMethodType(...)</code> expression with the method
       *   reference identifier unless <code>typeof</code> yielded
       *   <code>"unknown"</code> for <var>s</var>.
       * @return {boolean}
       *   <code>true</code> if <var>s</var> is a method type,
       *   <code>false</code> otherwise.
       * @author
       *   (C) 2003-2008  Thomas Lahn &lt;types.js@PointedEars.de&gt;.
       *   Distributed under the GNU GPL v3 and later.
       * @partof http://pointedears.de/scripts/types.js
       * @deprecated since version 0.1.5a.2009070204
       *   in favor of {@link #isMethod(Object)}
       */
      isMethodType: function (s) {
        return /^\s*(function|object|unknown)\s*$/i.test(s);
      },

      _hasOwnProperty: _hasOwnProperty,
      isObject: _isObject,

      isString: function (s) {
        return ((typeof s == "string") || jsx.object.isInstanceOf(s, String));
      },

      getKeys: _getKeys,
      inheritFrom: _inheritFrom,
      getClass: _getClass,
      isArray: _isArray,
      isNativeObject: _isNativeObject,

      isHostObject: function (value) {
        return !_isNativeObject(value);
      },

      clone: _clone,

      /**
       * Exchanges an objects keys and their values and returns
       * the new object.
       *
       * @param {Object} obj
       *   The object to be flipped.
       * @param {boolean} bAccumulate (optional)
       *   If <code>true</code> and different keys have the same
       *   value, the key-values are accumulated in an {@link Array}
       *   (a {@link jsx.array.BigArray} if possible) in the resulting
       *   object.  Otherwise key-values will be overwritten, so that
       *   the value-key has the last matching key as its value.
       * @param {Function} flipper (optional)
       *   Function that should be called to determine whether
       *   the property should be flipped.  Is passed the key as
       *   argument and the object as <code>this</code> value.
       *   The property is flipped only if <var>flipper</var>
       *   returns a true-value.
       * @return {Object}
       *   A new object (a {@link jsx.map.Map} if possible) with
       *   the original object's keys and values exchanged.
       */
      flip: function (obj, bAccumulate, flipper) {
        if (flipper && typeof flipper != "function")
        {
          return jsx.throwThis(jsx.InvalidArgumentError,
            ["", typeof flipper, "Function"]);
        }

        var _Map = _getFeature(jsx, "map", "Map");
        var flipped = _Map ? new _Map() : _createTypedObject(obj);
        var keys = _getKeys(obj);
        var _BigArray = _getFeature(jsx, "array", "BigArray");
        var _Array = _BigArray || Array;

        for (var i = 0, len = keys.length; i < len; ++i)
        {
          var key = keys[i];

          if (flipper && !flipper.call(obj, key))
          {
            continue;
          }

          var value = obj[key];

          var value_is_object = _isObject(value);
          if (value_is_object && !_Map)
          {
            jsx.warn("Information loss because value is an object."
              + " Load jsx.map.Map to avoid.");
          }

          var has_value_key = _Map
            ? flipped.hasKey(value)
            : _hasOwnProperty(flipped, value);

          var key_value = _Map
            ? flipped.get(value)
            : flipped[value];

          if (has_value_key && bAccumulate)
          {
            if (!_isArray(key_value))
            {
              var a = new _Array();
              a.push(key_value);

              if (_Map)
              {
                flipped.put(value, a);
              }
              else
              {
                flipped[value] = a;
              }
            }

            if (flipped.length == _MAX_ARRAY_LENGTH && !_BigArray)
            {
              jsx.warn("Possible information loss due to Array limits."
                + " Provide jsx.array.BigArray to avoid.");
            }

            key_value = _Map
              ? flipped.get(value)
              : flipped[value];

            key_value.push(key);
          }
          else
          {
            if (has_value_key)
            {
              jsx.warn("Information loss due to same value."
                + " Pass bAccumulate === true to avoid.");
            }

            if (_Map)
            {
              flipped.put(value, key);
            }
            else
            {
              flipped[value] = key;
            }
          }
        }

        return flipped;
      },

      /**
       * @deprecated in favor of {@link #extend}
       */
      setProperties: _extend,

      extend: _extend,
      defineProperty: _defineProperty,

      /**
       * Defines properties of an object, if possible.
       *
       * Emulation of the Object.defineProperties() method from ES 5.1,
       * section 15.2.3.7.
       *
       * @function
       * @param {Object} o
       *   The object for which properties getters and setters should be defined.
       * @param {Object} descriptor (optional)
       *   Properties descriptor, where each own property name
       *   is a property name of the new object, and each corresponding
       *   property value is a reference to an object that defines the
       *   attributes of that property.
       * @return {Object} Reference to the object
       * @see #defineProperty
       */
      defineProperties: _extend(
        function (o, descriptor, sContext) {
          var done = false;

          if (typeof Object.defineProperties == "function"
              && !Object.defineProperties._emulated)
          {
            jsx.tryThis(function () {
              Object.defineProperties(o, descriptor);
              done = true;
            });
          }

          if (!done)
          {
            for (var i = 0, keys = _getKeys(descriptor), len = keys.length;
                  i < len; ++i)
            {
              var propertyName = keys[i];
              _defineProperty(o, propertyName, descriptor[propertyName],
                sContext);
            }
          }

          return o;
        },
        {
          _emulated: true
        }),

      /**
       * Determines if a (non-inherited) property of an object is enumerable
       *
       * @param {Object} obj (optional)
       *   Object which property should be checked for enumerability.
       * @param {string} sProperty
       *   Name of the property to check.
       * @return {boolean}
       *   <code>true</code> if there is such a property;
       *   <code>false</code> otherwise.
       */
      _propertyIsEnumerable: function (obj, sProperty) {
        if (arguments.length < 2 && obj)
        {
          sProperty = obj;
          obj = jsx_object;
        }

        if (_isMethod(obj, "propertyIsEnumerable"))
        {
          return obj.propertyIsEnumerable(sProperty);
        }

        for (var propertyName in obj)
        {
          if (propertyName == name && _hasOwnProperty(obj, propertyName))
          {
            return true;
          }
        }

        return false;
      },

      /**
       * Determines if an object, or the objects it refers to,
       * has an enumerable property with a certain value
       *
       * @param {Object} obj
       * @param needle
       *   The value to be searched for
       * @param {Object} params
       *   Search parameters.  The following properties are supported:
       *   <table>
       *     <thead>
       *       <tr>
       *         <th>Property</th>
       *         <th>Type</th>
       *         <th>Meaning</th>
       *       </tr>
       *     </thead>
       *     <tbody>
       *       <tr>
       *         <th><code><var>exclude</var></code></th>
       *         <td><code>Array</code></td>
       *         <td>Names of the properties that should not be searched</td>
       *       </tr>
       *       <tr>
       *         <th><code><var>recursive</var></code></th>
       *         <td><code>boolean</code></td>
       *         <td>If a true-value, search recursively.</td>
       *       </tr>
       *       <tr>
       *         <th><code><var>strict</var></code></th>
       *         <td><code>boolean</code></td>
       *         <td>If a true-value, perform a strict comparison
       *             without type conversion.</td>
       *       </tr>
       *     </tbody>
       *   </table>
       */
      hasPropertyValue:
        function jsx_object_hasPropertyValue (obj, needle, params) {
          for (var property in obj)
          {
            if (params && params.exclude && params.exclude.indexOf(property) > -1)
            {
              continue;
            }

            var propertyValue = obj[property];
            if (params && params.recursive)
            {
              if (typeof propertyValue == "object" && propertyValue !== null)
              {
                if (jsx_object_hasPropertyValue(propertyValue, needle, params))
                {
                  return true;
                }
              }
            }

            if (params && params.strict)
            {
              if (propertyValue === needle)
              {
                return true;
              }
            }
            else
            {
              /* Switch operands because of JScript quirk */
              if (needle == propertyValue)
              {
                return true;
              }
            }
          }

          return false;
        },

      /**
       * Returns the name of an unused property for an object.
       *
       * @param {Object} obj
       * @param {Number} iLength
       *   Maximum property name length up to which an unused name
       *   is searched.  The default is 256.
       * @return {string}
       *   The name of a non-existing property of <code>o</code> if
       *   {@link Object#prototype.hasOwnProperty()} is supported, or
       *   the name of a property with value <code>undefined</code>
       *   if it is not supported; the empty string
       *   if there is no such property.
       */
      findNewProperty: function (obj, iLength) {
        if (!obj)
        {
          obj = jsx_object;
        }

        if (arguments.length < 2)
        {
          iLength = 256;
        }
        else
        {
          iLength = parseInt(iLength, 10);
        }

        var prefix = "";

        while (prefix.length < iLength)
        {
          for (var i = "a".charCodeAt(0), max = "z".charCodeAt(0); i <= max; ++i)
          {
            var ch = String.fromCharCode(i);
            var newName = prefix + ch + "_";
            if (!_hasOwnProperty(obj, newName))
            {
              return newName;
            }
          }

          prefix += "a";
        }

        return "";
      },

      /**
       * Returns a new object that can serve as data container.
       *
       * Returns a reference to a new object that, if supported,
       * does not inherit or have any properties other than those
       * provided by the keys of <var>oSource</var>.  This is
       * accomplished by either cutting off its existing prototype
       * chain or not creating one for it in the first place.
       *
       * Different to {@link Object.create()}, properties from
       * <var>oSource</var> are created with the attributes
       * <code>[[Writable]]</code>, <code>[[Enumerable]]</code>
       * and <code>[[Configurable]]</code>.  Attributes of the
       * properties of <var>oSource</var> are <em>not</em> copied.
       * Property values of the resulting object are a shallow copy
       * of the property values of <var>oSource</var> unless
       * specified otherwise with <var>iFlags</var>.
       *
       * @param {Object} oSource (optional)
       * @param {Number} iFlags (optional)
       *   See {@link #clone()}.
       * @return {Object}
       * @see Object.create()
       * @see jsx.object.clone()
       */
      getDataObject: function (oSource, iFlags) {
        var obj = _inheritFrom(null);

        if (_isObject(oSource))
        {
          for (var i = 0, keys = _getKeys(oSource), len = keys.length;
               i < len; ++i)
          {
            var name = keys[i];
            var value = oSource[name];

            /* NOTE: formerly, numeric flags was first argument of _clone() */
            obj[name] = (typeof value != "number"
              ? _clone(value, iFlags)
              : value);
          }
        }

        return obj;
      },

      getFeature: _getFeature,

      /**
       * Emulates the <code>instanceof</code> operator
       * of ECMAScript Edition 3 and later.
       *
       * Uses <code>Object.getPrototypeOf</code> (ECMAScript Ed. 3 and later)
       * or the proprietary <code>__proto__</code> property (JavaScript 1.3
       * and later, and compatible implementations).
       *
       * Example:
       * <pre><code>
       *   var o = new Object();
       *   o instanceof Object; // yields `true'
       *
       *   function Foo() {}
       *   var o = new Foo();
       *   o instanceof Object;     // yields `true'
       *   o instanceof Foo;        // yields `true' also
       *
       *   var _isInstanceOf = jsx.object.isInstanceOf;
       *   _isInstanceOf(o, Object); // returns `true'
       *   _isInstanceOf(o, Foo);    // returns `true' also
       *   _isInstanceOf(o, function () {});    // returns `false'
       * </code></pre>
       *
       * NOTE: This method has previously been provided by {@link types.js};
       * optimizations in code reuse moved it here.
       *
       * @author (C) 2003, 2011, 2013, 2014  Thomas Lahn &lt;js@PointedEars.de&gt;
       * @param {Object} obj
       *   Value to be determined an instance of <code>Constructor</code>
       *   or inheriting from the constructor of <code>Constructor.prototype</code>
       *   or an object in its prototype chain.
       * @param {Function} Constructor
       *   Object to be determined the constructor associated with an
       *   object in the prototype chain of <var>obj</var>.
       * @return {boolean}
       *   <code>true</code> if <code>obj</code> is an object constructed
       *   with <var>Constructor</var>, <code>false</code> otherwise.
       */
      isInstanceOf: function jsx_object_isInstanceOf (obj, Constructor) {
        if (!_isObject(obj))
        {
          return false;
        }

        var proto = Constructor.prototype;

        if (!_isObject(proto))
        {
          return jsx.throwThis("TypeError",
            ["Expecting a function in instanceof check, but got " + Constructor],
            jsx_object_isInstanceOf);
        }

        while ((obj = _getProto(obj)))
        {
          if (proto == obj)
          {
            return true;
          }
        }

        return false;
      },

      /**
       * Returns the name of a function
       *
       * @param {Function|String} aFunction
       * @param {boolean} bNoStackTrace
       *   If <code>true</code>, do not attempt to generate a stack trace when
       *   issuing warnings.  Used internally to prevent infinite recursion.
       * @return {string}
       *   The name of a function if it has one; the empty string otherwise.
       */
      getFunctionName: function (aFunction, bNoStackTrace) {
        /* TODO: Cache expression */
        var rx, _RegExp;

        if ((_RegExp = _getFeature(jsx, "regexp", "RegExp")))
        {
          jsx.tryThis(
            function () {
              rx = new _RegExp("^\\s*function\\s+(" + _srxIdentifierName + ")");
            },
            function (e) {
              jsx.warn("Could not use Unicode character properties: " + e.message, bNoStackTrace);
            }
          );
        }
        else
        {
          jsx.warn("jsx.regexp.RegExp not loaded.", bNoStackTrace);
        }

        if (!rx)
        {
          jsx.warn("Non-ASCII identifiers cannot be parsed.", bNoStackTrace);
          rx = /^\s*function\s+([A-Za-z_]\w*)/;
        }

        /* Return the empty string for null or undefined */
        return (aFunction != null
                 && typeof aFunction.name != "undefined" && aFunction.name)
          || (String(aFunction).match(rx) || [, ""])[1];
      },

      /**
       * Returns minimum documentation for a function
       *
       * @param {Function|String} aFunction
       * @return {string}
       */
      getDoc: function (aFunction) {
        return (String(aFunction).match(
          /^\s*(function(\s+[A-Za-z_]\w*)?\s*\([^\)]*\))/) || [, ""])[1];
      },

      /**
       * Retrieves the value of a property of an object
       *
       * @param {Object} obj
       * @param {string} sProperty
       * @param aDefault
       * @return {any}
       * @throws {@link #PropertyError} if the property
       *   does not exist or has the <code>undefined</code> value, and
       *   <var>aDefault</var> was not provided
       */
      getProperty: function (obj, sProperty, aDefault) {
        if (typeof obj[sProperty] != "undefined")
        {
          return obj[sProperty];
        }

        /* default value not passed */
        if (arguments.length < 3)
        {
          return jsx.throwThis("jsx.object.PropertyError", sProperty);
        }

        return aDefault;
      }
    };

    return jsx_object;
  }());

  /**
   * Prints debug messages to the script console.
   *
   * NOTE: This method has previously been provided by
   * {@link debug.js}; optimizations in code reuse
   * moved it here.
   *
   * @function
   */
  jsx.dmsg = (function () {
    var
      _isMethod = jsx.object.isMethod,
      msgMap = {
        data: {
          info: "INFO",
          warn: "WARNING",
          debug: "DEBUG"
        },

        getString: function (s) {
          var data = this.data;

          if (typeof data[s] != "undefined")
          {
            return data[s] + ": ";
          }

          return "";
        }
      };

    /**
     * @param {string} sMsg
     *   Message to be printed
     * @param {string} sType = "log"
     *   Type of the message.  Supported values include
     *   <code>"log"</code> (default), <code>"info"</code>, <code>"warn"</code>,
     *   and <code>"debug"</code>.  If a script console does not support
     *   a message type, the default value is used.
     * @param {boolean} bNoStackTrace
     *   If <code>true</code>, do not attempt to generate a stack trace.
     *   Used internally to prevent infinite recursion.
     * @return {boolean}
     *   <code>true</code> if it was possible to cause the message to be printed;
     *   <code>false</code> otherwise.
     */
    return function (sMsg, sType, bNoStackTrace) {
      /* Firebug 0.4+ and others */
      if (typeof console != "undefined")
      {
        if (!sType || !_isMethod(console, sType) && sType != "log")
        {
          sMsg = msgMap.getString(sType) + sMsg;
          sType = "log";
        }

        if (sType != "info" && !bNoStackTrace)
        {
          sMsg += "\n" + jsx.getStackTrace();
        }

        if (_isMethod(console, sType))
        {
          /* MSHTML's console methods do not implement call() */
          Function.prototype.call.call(console[sType], console, sMsg);
          return true;
        }
      }
      else if (typeof opera != "undefined"
                && _isMethod(opera, "postError"))
      {
        opera.postError(msgMap.getString(sType) + sMsg);
        return true;
      }

      return false;
    };
  }());

  /**
   * Issues an info message, if possible.
   *
   * @param {String} sMsg
   *   Message
   * @see jsx#dmsg
   */
  jsx.info = function (sMsg) {
    return jsx.dmsg(sMsg, jsx.MSG_INFO);
  };

  /**
   * Issues a warning, if possible.
   *
   * @param {String} sMsg
   *   Message
   * @param {boolean} bNoStackTrace
   *   If <code>true</code>, do not attempt to generate a stack trace.
   *   Used internally to prevent infinite recursion.
   * @see jsx#dmsg
   */
  jsx.warn = function (sMsg, bNoStackTrace) {
    return jsx.dmsg(sMsg, jsx.MSG_WARN, bNoStackTrace);
  };

  /**
   * Issues an error message, if possible.
   *
   * @param {string} sMsg  Message
   * @see jsx#dmsg
   */
  jsx.error = function (sMsg) {
    return jsx.dmsg(sMsg, jsx.MSG_ERROR);
  };

  /**
   * Clears the handler for the proprietary <code>error</code> event.
   *
   * NOTE: This method has previously been provided by {@link debug.js};
   * optimizations in code reuse moved it here.
   *
   * @return {boolean} <code>true</code>
   */
  /*
   * NOTE: Initialization must come before the initialization of
   *       setErrorHandler() as it is used in a closure there,
   *       see Message-ID <2152411.FhMhkbZ0Pk@PointedEars.de>
   */
  jsx.clearErrorHandler = function () {
    if (typeof window != "undefined" && window !== null)
    {
      /*
       * debug.js 0.99.5.2006041101 BUGFIX:
       * onerror is defined as a property of window, not of the Global Object
       */
      window.onerror = null;
    }

    return true;
  };

  /**
   * Sets the handler for the proprietary <code>error</code> event.
   *
   * NOTE: This method has previously been provided by {@link debug.js};
   * and {@link types.js}; optimizations in code reuse moved it here.
   *
   * @function
   */
  jsx.setErrorHandler = (function () {
    var
      jsx_object = jsx.object,
      jsx_clearErrorHandler = jsx.clearErrorHandler;

    /**
     * @param {Callable} fHandler
     * @return {boolean}
     *   <code>true</code> if the error handler could be assigned to
     *   successfully, <code>false</code> otherwise.  Note that one reason
     *   for failure can be that an event handler is no longer supported
     *   by the UA's DOM due to efforts towards adherence to Web standards.
     */
    return function (fHandler) {
      /*
       * NOTE: There is no deadlock here because even if `fHandler' is a string,
       * `isMethod(fHandler)' will call `setErrorHandler()' without arguments;
       * so fHandler in that call will be `undefined' and `setErrorHandler()'
       * is not called again.
       */
      if (!jsx_object.isMethod(fHandler))
      {
        fHandler = jsx_clearErrorHandler;
      }

      var _assertFalse = jsx_object.getFeature(jsx, "test", "assertFalse");
      if (typeof _assertFalse == "function")
      {
        _assertFalse(typeof fHandler == "undefined", false,
          "jsx.setErrorHandler(fHandler)");
      }

      if (typeof window != "undefined" && window !== null
          && typeof fHandler != "undefined")
      {
        /*
         * debug.js 0.99.5.2006041101 BUGFIX:
         * onerror is defined as a property of window, not of the Global Object
         */
        window.onerror = fHandler;
      }

      return (typeof window.onerror != "undefined"
              && window.onerror == fHandler);
    };
  }());

  /**
   * Throws an exception, including an execution context hint if provided,
   * followed by an error message.
   *
   * NOTE: This method has previously been provided by {@link exception.js};
   * optimizations in code reuse moved it here.
   *
   * @function
   * @author
   *   Copyright (c) 2008, 2013 Thomas 'PointedEars' Lahn <cljs@PointedEars.de>.
   *   Distributed under the GNU GPL v3 and later.
   * @partof JSX:object.js
   */
  jsx.throwThis = (function () {
    var
      _jsx_object = jsx.object,
      _addslashes = function (e) {
        return (typeof e == "string"
          ? e.replace(/["'\\]/g, "\\$&").replace(/\r?\n|\r/g, "\\n")
          : e);
      };

    /**
     * @param {string|Function|Error} errorType
     *   Expression for the constructor of the error type, or a reference
     *   to an object inheriting from <code>Error.prototype</code>.
     *   Use a false-value (e.g., <code>""</code> or  <code>null</code>)
     *   to throw an unqualified exception.
     * @param {string|Array} message
     *   Error message to be displayed.  If an <code>Array</code>,
     *   it is passed as argument list to the constructor for the error type
     * @param {Callable|string} context
     *   Optional callable object to specify the context
     *   where the exception occurred.  Ignored if <var>message</var>
     *   is an <code>Array</code>.
     */
    return function (errorType, message, context) {
      var sErrorType = errorType;
      var isError = false;
      var messageIsArray = _jsx_object.isArray(message);

      if (typeof Error == "function"
          && Error.prototype.isPrototypeOf(errorType))
      {
        isError = true;
        sErrorType = "errorType";
      }
      else
      {
        var t = typeof errorType;

        if (t == "function" || t == "string")
        {
          if (t == "function")
          {
            sErrorType = "errorType";
          }
          else if (t == "string")
          {
            sErrorType = errorType;
          }

          if (!messageIsArray)
          {
            sErrorType = "new " + sErrorType;
          }
        }
      }

      if (!messageIsArray)
      {
        var sContext = "";

        var stack = jsx.getStackTrace();
        if (stack)
        {
          sContext = "\n\n" + stack;
        }

        /* DEBUG: set breakpoint here */
        if (!sContext)
        {
          if (_jsx_object.isMethod(context))
          {
            sContext = (String(context).match(/^\s*(function.+\))/)
              || [, null])[1];
            sContext = (sContext ? sContext + ': ' : '');
          }
        }

        message = (message || "") + (sContext || "");
        message = '"' + _addslashes(message) + '"';
      }

      /* DEBUG */
      var throwStmt = 'throw ' + (sErrorType ? sErrorType : '')
                    + (isError
                        ? ''
                        : (messageIsArray
                            ? '.construct(message)'
                            : '(' + (message || '') + ')'))
                    + ';';

      /*jshint -W061*/
      eval(throwStmt);
      /*jshint +W061*/
    };
  }());

  /**
   * Rethrows arbitrary exceptions
   *
   * @param {Error} exception
   */
  /*jshint -W098*/
  jsx.rethrowThis = function (exception) {
    /*jshint -W061*/
    eval("throw exception");
    /*jshint +W061*/
  };
  /*jshint +W098*/

  jsx.object.extend(jsx, {
    /**
     * Holds the runtime options for JSX.
     *
     * Due to the dynamic nature of ECMAScript, it is very flexible.
     * Built-in objects can be augmented and built-in methods can be
     * overwritten to allow for "syntactic sugar" that make programs
     * easier to write and to read, should the implementation not
     * already provide suitable features.  However, augmentation
     * and replacement do have disadvantages if you are not aware
     * of the fact.  Allowing for a maximum of flexibility, JSX
     * uses options that govern to which degree JSX components may
     * modify built-in objects.  Options include, with increasing
     * degree of flexibility and side-effects:
     *
     * <table>
     *   <thead>
     *     <tr>
     *       <td></td>
     *       <th>Modify built-ins</th>
     *       <th>Augment built-ins</th>
     *       <th>Augment built-in prototypes</th>
     *       <th>Augment <code>Object</code> prototype</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <th><code>augmentBuiltins</code></th>
     *       <td>yes</td>
     *       <td>yes</td>
     *       <td>no</td>
     *       <td>no</td>
     *     </tr>
     *     <tr>
     *       <th><code>augmentPrototypes</code></th>
     *       <td>yes</td>
     *       <td>yes</td>
     *       <td>yes</td>
     *       <td>no</td>
     *     </tr>
     *     <tr>
     *       <th><code>augmentObjectPrototype</code></th>
     *       <td>yes</td>
     *       <td>yes</td>
     *       <td>yes</td>
     *       <td>yes</td>
     *     </tr>
     *     <tr>
     *       <th><code>replaceBuiltins</code></th>
     *       <td>yes</td>
     *       <td>depends</td>
     *       <td>depends</td>
     *       <td>depends</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <dl>
     *   <dt><code>augmentBuiltins</code></dt>
     *     <dd>Allow built-ins to be augmented with new
     *         properties.  This allows new properties on
     *         the built-in constructors, but not on
     *         prototype objects of built-in objects.
     *         (See <code>augmentPrototypes</code>.)
     *         Since there usually is no harm in that,
     *         the default is <code>true</code>.
     *         Set to <code>false</code> if you are testing features
     *         of ECMAScript implementations with JSX,
     *         like with the
     *         {@link http://PointedEars.de/es-matrix ECMAScript Support Matrix}.
     *       <dl>
     *         <dt><code>augmentPrototypes</code></dt>
     *           <dd>Allow prototype objects to be augmented,
     *               except <code>Object.prototype</code>.
     *               This allows for new, inherited methods for
     *                <code>String</code>s, for example.
     *                Since there usually is no harm in that, the
     *                default is <code>true</code>.
     *              <dl>
     *                <dt><code>augmentObjectPrototype</code></dt>
     *                  <dd>Allow <code>Object.prototype</code>
     *                      to be augmented.  <em>CAUTION:
     *                      The new properties are inherited
     *                      to all native objects, and
     *                      host objects that have
     *                      <code>Object.prototype</code>
     *                      in their prototype chain.  The new
     *                      properties will show up everywhere,
     *                      including <code>for-in</code>
     *                      iteration.  If you do not know
     *                      what this is all about, leave it
     *                      at the default <code>false</code>.</em></dd>
     *       </dl>
     *     </dd>
     *   <dt><code>replaceBuiltins</code></dt>
     *     <dd>Allow built-ins to be replaced with native user-defined
     *         implementations.</dd>
     * </dl>
     * @namespace
     * @memberOf jsx
     */
    options: {}
  });

  jsx.object.extend(jsx.options, {
    /**
     * If <code>false</code>, built-ins are not modified.
     * The default is <code>true</code>.
     *
     * @memberOf jsx.options
     * @type boolean
     */
    augmentBuiltins: true,

    /**
     * If <code>false</code>, built-in prototypes are not modified.
     * The default is <code>true</code>.
     *
     * @type boolean
     */
    augmentPrototypes: true,

    /**
     * If <code>false</code> (default), the Object prototype object is
     * not modified.  The default is <code>false</code>.
     *
     * @type boolean
     */
    augmentObjectPrototype: false,

    /**
     * If <code>false</code>, built-ins are not replaced.
     * The default is <code>true</code>.
     *
     * @type boolean
     */
    replaceBuiltins: true,

    /**
     * If <code>false</code>, missing language features are not emulated.
     * The default is <code>true</code>.
     * <p>
     * WARNING: JSX features may depend on emulation; intended for
     * testing only.
     * </p>
     * @type boolean
     */
    emulate: true
  });

  if (jsx.options.emulate)
  {
    jsx.object.extend(jsx.options, {
      augmentBuiltins:   true,
      augmentPrototypes: true,
      replaceBuiltins:   true
    }, jsx.object.ADD_OVERWRITE);
  }

  if (jsx.options.augmentBuiltins)
  {
    jsx.object.extend(Object, {
      /**
       * @see jsx.object.defineProperty
       */
      defineProperty: jsx.object.defineProperty,

      /**
       * @see jsx.object.defineProperties
       */
      defineProperties: jsx.object.defineProperties
    });

    if (typeof Object.create != "function")
    {
      /**
       * Creates a new object and initializes its properties.
       *
       * Emulation of the Object.create() method from ES 5.1,
       * section 15.2.3.5.
       *
       * @function
       */
      Object.create = jsx.object.extend(
        /**
         * @param {Object|Null} prototype
         * @param {Object} descriptor (optional)
         *   Properties descriptor, where each own property name
         *   is a property name of the new object, and each corresponding
         *   property value is a reference to an object that defines the
         *   attributes of that property.  Supported properties of
         *   that defining object include <code>value</code> only
         *   at this time.
         * @return {Object} Reference to the new object
         */
        function (prototype, descriptor) {
          var o = jsx.object.inheritFrom(prototype);

          if (typeof descriptor != "undefined")
          {
            Object.defineProperties(o, descriptor);
          }

          return o;
        },
        {
          /**
           * @memberOf Object.create
           */
          _emulated: true
        }
      );
    }

    if (typeof Object.keys != "function")
    {
      /**
       * @param {Object} obj
       */
      Object.keys = function (obj) {
        return jsx.object.getKeys(obj);
      };

      Object.keys._emulated = true;
    }

    if (typeof Object.values != "function")
    {
      /**
       * @param {Object} obj
       */
      Object.values = function (obj) {
        return Object.keys(obj).map(function (key) {
          return this[key];
        }, obj);
      };

      Object.values._emulated = true;
    }

    if (typeof Object.forKeys != "function")
    {
      /**
       * Executes a callback for all keys of an object
       *
       * @param {Object} obj
       * @param {Object} callback
       * @param {Object} thisValue
       */
      Object.forKeys = function (obj, callback, thisValue) {
        return Object.keys(obj).forEach(function (key) {
          return callback.call(thisValue || this, this[key], key, thisValue || this);
        }, obj);
      };

      Object.forKeys._emulated = true;
    }

    if (typeof Object.assign != "function")
    {
      /**
       * Copy the values of all of the enumerable own properties
       * from one or more source objects to a target object.
       *
       * @param {Object} target
       * @params {Object} sources
       * @return {Object}
       * @see http://ecma-international.org/ecma-262/6.0/index.html#sec-object.assign
       */
      Object.assign = function (target) {
        function toObject (o)
        {
          if (o == null)
          {
            throw new TypeError("Cannot convert to object: " + o + " : " + jsx.object.getClass(o) || typeof o);
          }

          return new Object(o);
        }

        target = toObject(target);

        for (var i = 1, len = arguments.length; i < len; ++i)
        {
          var source = arguments[i];
          if (source)
          {
            Object.forKeys(source, function (value, key) {
              var desc = Object.getOwnPropertyDescriptor(this.source, key);

              if (typeof desc != "undefined" && desc.enumerable)
              {
                Object.defineProperty(this.target, key, desc);
              }
            }, {target: target, source: source});
          }
        }

        return target;
      };
    }

    if (typeof Object.extend != "function")
    {
      /**
       * Extends an object with properties from other objects.
       *
       * Different to {@link Object.assign} and {@link Object.merge},
       * existing property values are overwritten, unless the property
       * value is an {@link Array}, in which case the values of the
       * corresponding properties of the sources are appended.
       *
       * @param {Object} obj
       * @params {Object} sources
       */
      Object.extend = function (obj) {
        for (var i = 1, len = arguments.length; i < len; ++i)
        {
          var source = arguments[i];

          Object.forKeys(source, function (value, key, source) {
            if (!(jsx.object._hasOwnProperty(obj, key)))
            {
              var desc = (typeof Object.getOwnPropertyDescriptor == "function")
                && Object.getOwnPropertyDescriptor(source, key);
              if (desc && "value" in desc)
              {
                desc.value = value;
                Object.defineProperty(obj, key, desc);
              }
              else
              {
                obj[key] = value;
              }
            }
            else
            {
              if (Array.isArray(obj))
              {
                if (!Array.isArray(source))
                {
                  source = Object.values(source);
                }

                obj.splice.apply(obj, [obj.length, 0].concat(source));
              }
              else
              {
                Object.extend(obj[key], value);
              }
            }
          }, source);

          return obj;
        }
      };

      Object.extend._emulated = true;
    }

    if (typeof Object.merge != "function")
    {
      /**
       * Merges the properties of one or more objects with
       * the <var>target</var> object.
       *
       * @param target
       * @return Object
       */
      Object.merge = function (target) {
        var clone = Object.clone(target, true);

        for (var i = 1, len = arguments.length; i < len; ++i)
        {
          var arg = arguments[i];

          Object.getOwnPropertyNames(target).forEach(function (name) {
            var sourceValue = this.source[name];

            if (name in this.clone)
            {
              if (!Array.isArray(this.clone[name]))
              {
                this.target[name] = [this.target[name]];
              }

              this.target[name].push(sourceValue);
            }
            else
            {
              this.target[name] = sourceValue;
            }

          }, {target: clone, source: arg});
        }

        return clone;
      };
    }
  }

  /**
   * Gets the stack trace of the calling execution context.
   *
   * Based on getStackTrace() from jsUnit 2.2alpha of 2006-03-24.
   *
   * @return {string}
   *   The stack trace of the calling execution context, if available.
   */
  jsx.getStackTrace = function jsx_getStackTrace () {
    /**
     * @private
     * @param {Error} excp
     */
    function parseErrorStack(excp)
    {
      var stack = [];

      if (excp && excp.stack)
      {
        var stacklist = excp.stack.split('\n');

  //      for (var i = 0; i < stacklist.length - 1; i++)
  //      {
  //          var framedata = stacklist[i];
  //
  //          var name = framedata.match(/^\s*(at\s+)?(\w*)/)[2];
  //          if (!name)
  //          {
  //            name = 'anonymous';
  //          }
  //
  //          stack.push(name);
  //      }
        stack = stacklist;

        /* remove top level anonymous functions to match JScript */
  //      while (stack.length && stack[stack.length - 1] == 'anonymous')
  //      {
  //        stack.length = stack.length - 1;
  //      }
      }

      return stack;
    }

    var result = '';

    if (typeof Error == "function")
    {
      var stack = parseErrorStack(new Error());
      result = stack.slice(2).join("\n");
  //    for (var i = 1; i < stack.length; i++)
  //    {
  //      result += '> ' + stack[i] + '\n';
  //    }
    }

    /*
     * Avoid strict violation; implementations with Error should also have
     * the “stack” property
     */
    /* FIXME: Use local strict mode declaration only */
    if (!stack)
    {
      /* JScript and older JavaScript */
      var caller =
        (jsx.object._hasOwnProperty(jsx_getStackTrace, "caller") && jsx_getStackTrace.caller)
        || (jsx.object._hasOwnProperty(arguments, "caller") && arguments.caller);

      if (caller)
      {
        while (caller != null)
        {
          result += '> ' + (jsx.object.getFunctionName(caller, true) || "anonymous")
          + '\n';
          if (caller.caller == caller)
          {
            result += '*';
            break;
          }

          caller = caller.caller;
        }
      }
    }

    return result;
  };


  jsx.object.extend(jsx, {
    /**
     * Reference to the ECMAScript Global Object
     * @memberOf jsx
     * @type Global
     */
    global: global,

    MSG_INFO: "info",
    MSG_WARN: "warn",
    MSG_ERROR: "error",
    MSG_DEBUG: "debug"
  }, jsx.object.ADD_OVERWRITE);

  /**
   * @namespace
   */
  jsx.array = (function (jsx_object) {
    var _isMethod = jsx_object.isMethod;

    /**
     * Returns <code>true</code> if a value can be used
     * as array index.
     *
     * @return {boolean}
     *   <code>true</code> if a value can be used
     *   as array index, i.e. can be converted to an integer
     *   (may be out of ES 5.1 index range);
     *   <code>false</code> otherwise.
     */
    function jsx_array_isIndex (index)
    {
      /* Exclude NaN (not equal to itself) and non-integers */
      index = +index;

      return ((index == index) && (index % 1 === 0));
    }

    return {
      /**
       * @memberOf jsx.array
       */
      version: jsx.object.version,

      /**
       * Maps elements of an <code>Array</code>-like object
       * to named properties of another object.
       *
       * <p>NOTE: Equivalent to Array destructuring (JavaScript 1.7+):</p>
       * <pre><code>var o = jsx.array.destructure(["bar", "foo"], ["foo", "bar"]);</code></pre>
       * is equivalent to
       * <pre><code>var o = {};
       * [o.foo, o.bar] = ["bar", "foo"];</code></pre>
       *
       * @param {Object} a
       *   <code>Array</code>-like object whose elements should be mapped.
       * @param {Array} properties
       *   Names of the properties that array elements should be mapped to.
       *   If an element of this <code>Array</code> is <code>undefined</code>
       *   or <code>null</code> (the former can be facilitated with
       *   omitting the element value in an <code>Array</code> initialiser
       *   when not the last element of this <code>Array</code>,
       *   for backwards compatibility), the corresponding element of
       *   <var>a</var> is not mapped.
       * @param {Object} oTarget
       *   Target object.  If a false-value, a new <code>Object</code>
       *   instance is being created.
       * @return {Object}
       *   <var>oTarget</var> or a new <code>Object</code> instance
       *   augmented with the specified properties and values.
       */
      destructure: function (a, properties, oTarget) {
        var o = oTarget || jsx_object.getDataObject();

        /* More efficient with sparse arrays */
        var keys = jsx_object.getKeys(properties);

        for (var i = 0, len = keys.length; i < len; ++i)
        {
          var index = keys[i];
          if (jsx_array_isIndex(index))
          {
            var propertyName = properties[index];
            if (propertyName != null)
            {
              o[propertyName] = a[index];
            }
          }
        }

        return o;
      },

      isIndex: jsx_array_isIndex,

      /**
      * Maps one array to another
      *
      * @return {Array}
      *   <var>array</var> with <var>callback</var> applied to each element.
      * @see ECMAScript Language Specification, Edition 5.1, section 15.4.4.19
      * @param {Array} array
      *   Array to be mapped
      * @param {Callable} callback
      * @param {Object} oThis (optional)
      */
      map: function (array, callback, oThis) {
        if (!_isMethod(callback))
        {
          return jsx.throwThis("TypeError",
            (_isMethod(callback, "toSource") ? callback.toSource() : callback)
              + " is not callable",
            this + ".map");
        }

        var
          array_length = +array.length,
          res = [];

        /* More efficient with sparse arrays */
        var keys = jsx_object.getKeys(array);
        keys.sort(function (a, b) { return a - b; });

        /* Start with highest index to reduce .length updates */
        for (var i = keys.length; i--;)
        {
          var index = keys[i];
          if (jsx_array_isIndex(index) && index < array_length)
          {
            res[index] = callback.call(oThis, array[index], index, array);
          }
        }

        return res;
      }
    };
  }(jsx.object));

  /**
   * Returns an <code>Array</code> created from mapping items
   * of an Array-like object.
   *
   * @param {Object} iterable
   *   <code>Array</code>-like object
   * @param {Function} builder (optional)
   *   Mapping function whose return value specifies the
   *   mapped value in the new <code>Array</code>.
   *   Pass <code>null</code> for no mapping.
   * @param {Object} oThis (optional)
   *   <code>this</code> value in the mapping function
   * @return {Array}
   * @see Array.prototype#map
   */
  jsx.array.from = function (iterable, builder, oThis) {
    if (arguments.length < 2)
    {
      builder = null;
    }

    if (arguments.length > 1 && builder && typeof builder != "function")
    {
      return jsx.throwThis("TypeError",
        (jsx.object.isMethod(builder, "toSource") ? builder.toSource() : builder)
          + " is not callable",
        this + ".map");
    }

    if (arguments.length < 3)
    {
      oThis = iterable;
    }

    var
      len = iterable.length >>> 0,
      res = [];

    for (var i = 0; i < len; ++i)
    {
      res[i] = (builder
        ? builder.call(oThis, iterable[i], i, iterable)
        : oThis[i]);
    }

    return res;
  };

  /**
   * @param {Array} a
   * @param {Number} index
   * @param {Boolean} bThrow
   *   if <code>true</code>, throws an exception on invalid index
   */
  jsx.array.getRealIndex = function (a, index, bThrow) {
    if (isNaN(index) && bThrow)
    {
      return jsx.throwThis(jsx.InvalidArgumentError, ["",
        "(" + typeof a + ", " + typeof index + ")",
        "(object[Array], number)"]);
    }

    index = +index;

    if (index >= 0)
    {
      return index;
    }

    return a.length + index;
  };

  /**
   * Retrieves an {@link Array} element as if by the expression
   * <code><var>a</var>.slice(<var>index</var>,
   * <var>index</var> + 1)[0]</code>.
   *
   * If <var>index</var> is negative, its absolute is counted
   * from the end of <var>a</var>.
   *
   * @param {Array} a
   * @param {Number} index
   * @return {any}
   */
  jsx.array.get = function (a, index) {
    index = jsx.array.getRealIndex(a, index, true);
    return a[index];
  };

  /**
   * Sets an {@link Array} element as if by the expression
   * <code><var>a</var>[(<var>index</var> &lt; 0) ? (index + a.length)
   * : <var>index</var>] = <var>value</var></code>.
   *
   * If <var>index</var> is negative, its absolute is counted
   * from the end of <var>a</var>.
   *
   * @param {Array} a
   * @param {Number} index
   * @return {any}
   */
  jsx.array.set = function (a, index, value) {
    index = jsx.array.getRealIndex(a, index, true);
    return (a[index] = value);
  };

  if (jsx.options.augmentBuiltins)
  {
    /* Defines Array.isArray() if not already defined */
    jsx.object.extend(Array, {
      destructure: jsx.array.destructure,
      from: jsx.array.from,
      get: jsx.array.get,
      set: jsx.array.set,
      isArray: jsx.object.isArray
    });

    Object.observe = (typeof Object.observe == "function")
      ? (function () {
          var _observe = Object.observe;

          return function (obj, callback) {
            _observe(obj, callback);
            return obj;
          };
        }())
      : function (obj, callback) {
          var proxy;

          var handler = {
            "set": function (obj, prop, value) {
              var type = "update";

              if (jsx.object._hasOwnProperty(obj, prop))
              {
                var oldValue = obj[prop];
              }
              else
              {
                type = "add";
              }

              obj[prop] = value;

              if (type == "update")
              {
                if (obj[prop] !== oldValue)
                {
                  callback(prop, obj, type, oldValue);
                }
              }
              else
              {
                callback(prop, obj, type);
              }
            },
            "deleteProperty": function (obj, prop) {
              var hadOwnProperty = jsx.object._hasOwnProperty(obj, prop);
              var deleted = delete obj[prop];

              if (hadOwnProperty && deleted)
              {
                callback(prop, obj, "delete");
              }
            }
          };

          jsx.tryThis(
            function () {
              proxy = new Proxy(obj, handler);
            },
            function () {
              jsx.tryThis(
                function () {
                  proxy = Proxy.create(obj, handler);
                },
                function () {
                  jsx.warn("Cannot observe object, Proxy is not implemented");
                });
            });

          return proxy;
        };
  }

  /**
   * Returns the absolute path for a URI-reference
   *
   * @param {string} relativePath
   * @param {string} basePath
   * @return {string}
   */
  jsx.absPath = function (relativePath, basePath) {
    var uri = (basePath || document.URL).replace(/[?#].*$/, "").split("/");
    relativePath = relativePath.split("/");

    if (uri[uri.length - 1] != "")
    {
      uri.pop();
    }

    for (var i = 0, len = relativePath.length; i < len; ++i)
    {
      var component = relativePath[i];
      if (component == "..")
      {
        uri.pop();
      }
      else if (component != ".")
      {
        uri.push(component);
      }
    }

    return uri.join("/");
  };

  /**
   * Imports object properties into the global namespace.
   *
   * Convenience method, also for backwards compatibility to versions before
   * strict namespacing.  Does not load script files dynamically; use
   * jsx.importFrom() for that and include jsx.net.http.
   *
   * @function
   */
  jsx._import = (function () {
    var _jsx_object = jsx.object;
    var _getKeys = _jsx_object.getKeys;
    var _hasOwnProperty = _jsx_object._hasOwnProperty;
    var _isArray = _jsx_object.isArray;

    /**
     * @param {Object} obj
     * @param {string|Array|Null} properties (optional)
     *   Name or list of names of properties to import.  If not
     *   provided or <code>null</code>, all own enumerable properties
     *   of <var>obj</var> are imported.
     * @param {string} objAlias (optional)
     *   The alias property on the Global object that should be used
     *   instead of the Global Object.  Helps to avoid spoiling
     *   the global namespace.
     * @param {string|Array} propertyAliases (optional)
     *   The alias(es) that should be used for each property, in order,
     *   that is specified in <var>properties</var>.  Helps to avoid
     *   overwriting property values.
     *   There must be specified as many aliases as properties were
     *   specified.  Ignored if <var>properties</var> is
     *   <code>null</code>.
     * @return {boolean}
     *   <code>false</code> if <var>properties</var> is provided and not
     *   all properties could be imported; <code>true</code> otherwise.
     * @throws TypeError, if <var>obj</var> is not an iterable object
     */
    return function (obj, properties, objAlias, propertyAliases) {
      if (!obj)
      {
        return jsx.throwThis("TypeError",
          "expected iterable object, saw " + obj + " : " + (obj === null ? "Null" : typeof obj),
          "jsx._import");
      }

      var result = true;

      var root = jsx.global;
      if (objAlias != null)
      {
        root[objAlias] = {};
        root = root[objAlias];
      }

      var propertiesArg = properties;
      if (properties == null)
      {
        properties = _getKeys(obj);
      }
      else if (!_isArray(properties))
      {
        properties = [properties];
      }

      var len = properties.length;
      if (propertiesArg != null && propertyAliases != null)
      {
        if (!_isArray(propertyAliases))
        {
          propertyAliases = [propertyAliases];
        }

        if (len != propertyAliases.length)
        {
          return jsx.throwThis(jsx.InvalidArgumentError,
            ["Different number of property names and aliases",
             len, propertyAliases.length],
             "jsx._import");
        }
      }

      for (var i = 0; i < len; ++i)
      {
        var sourceProperty = properties[i];
        if (propertiesArg == null || _hasOwnProperty(obj, sourceProperty))
        {
          var targetProperty = sourceProperty;
          if (propertiesArg != null && propertyAliases != null)
          {
            targetProperty = propertyAliases[i];
          }

          root[targetProperty] = obj[sourceProperty];
        }
        else
        {
          result = false;
        }
      }

      return result;
    };
  }());

  /* ES 5: Reserved words may be used in MemberExpression */
  jsx["import"] = jsx._import;

  /**
   * Imports a script, and optionally the object it defines, or some of their
   * properties, into the global namespace.
   *
   * NOTE: Issues a synchronously-handled HTTP request which blocks all script
   * execution until a response is received or the request times out.
   * Can therefore not be used to import jsx.net.http.
   *
   * @function
   * @requires jsx.net.http#Request
   * @return {boolean}
   *   <code>true</code> if the script could be successfully <em>loaded</em>
   *   (not: included).
   */
  jsx.importFrom = (function () {
    /* Imports */
    var _import = jsx._import;
    var _Request;

    /**
     * @param {string} uri
     *   URI of the script to be imported
     * @param {Object} obj
     *   Object from the script to be imported (optional)
     * @param {Array} properties (optional)
     *   Properties of the object from the script to be imported (optional).
     *   See {@link jsx#_import}.
     * @param {string} objAlias (optional)
     *   See {@link jsx#_import}.
     * @param {Array} propertyAliases (optional)
     *   See {@link jsx#_import}.
     */
    function jsx_importFrom (uri, obj, properties, objAlias, propertyAliases)
    {
      /* One-time import */
      if (!_Request)
      {
        _Request = jsx.net.http.Request;
      }

      jsx_importFrom.lastImport = uri;
      var req = new _Request(uri, "GET", false, function (response) {
        /*
         * NOTE: Passing response.responseText to eval() is not ES5-compatible;
         *       conforming implementations create a new execution context with
         *       EMPTY scope chain.
         */
        var script = document.createElement("script");
        script.type = "text/javascript";

        if (typeof script.text == "undefined")
        {
          script.appendChild(document.createTextNode(response.responseText));
        }
        else
        {
          script.text = response.responseText;
        }

        /* NOTE: document.head was introduced with HTML5 WD */
        (document.head || document.getElementsByTagName("head")[0]).appendChild(script);

        if (arguments.length > 1)
        {
          return _import(obj, properties, objAlias, propertyAliases);
        }

        return true;
      });

      return req.send();
    }

    return jsx_importFrom;
  }());

  /**
   * Imports once an object or some of its properties
   * from a script resource into the global namespace.
   *
   * @function
   * @see jsx#importFrom
   */
  jsx.importOnce = (function () {
    var _getProperty = jsx.object.getProperty;
    var _absPath = jsx.absPath;
    var _importFrom = jsx.importFrom;

    /**
     * @param {string} uri
     *   URI of the resource to be imported
     * @param {Object} obj
     *   Object to import
     * @param {Array} properties (optional)
     *   Properties of the object from the script to be imported.
     *   See {@link jsx#_import}.
     * @param {string} objAlias (optional)
     *   See {@link jsx#_import}.
     * @param {Array} propertyAliases (optional)
     *   See {@link jsx#_import}.
     * @return {boolean}
     *   <code>true</code> if the script specified by <var>uri</var>
     *   has already been included; <code>false</code> otherwise.
     */
    function importOnce (uri, obj, properties, objAlias, propertyAliases)
    {
      /**
       * @param {string} uri
       */
      function scriptIncluded (uri)
      {
        var scripts = document.getElementsByTagName("script");
        if (scripts)
        {
          var uriAbsPath = _absPath(uri);
          for (var i = 0, len = scripts.length; i < len; ++i)
          {
            var script = scripts[i];
            if (_absPath(script.src) == uriAbsPath)
            {
              return true;
            }
          }
        }

        return false;
      }

      var result = false;

      if (uri
          && !scriptIncluded(uri)
          && !_getProperty(importOnce.imports, uri, null))
      {
        result = _importFrom(uri, obj, properties, objAlias, propertyAliases);
        if (result)
        {
          importOnce.imports[uri] = true;
        }
      }

      return result;
    }

    importOnce.imports = {};

    return importOnce;
  }());

  /**
   * Executes a function if and once its dependencies are met.
   *
   * If the required HTML5 features are not supported, the code
   * is executed immediately.  Any dependencies have to be
   * resolved manually then.
   *
   * @function
   */
  jsx.require = (function () {
    var _jsx = jsx;
    var _map = _jsx.array.map;
    var _importOnce = _jsx.importOnce;
    var _jsx_object = _jsx.object;
    var _getFeature = _jsx_object.getFeature;
    var _isArray = _jsx_object.isArray;
    var _addEventListener;

    /**
     * @param {string|Array} dependencies
     *   URI-reference or <code>Array</code> of URI-references
     *   specifying the dependency/dependencies
     * @param {Function} callback (optional)
     *   Function to be executed
     * @return {any}
     *   The return value of <var>callback</var>,
     *   <code>undefined</code> otherwise.
     */
    return function jsx_require (dependencies, callback) {
      var success;

      if (!_isArray(dependencies))
      {
        dependencies = [dependencies];
      }

      dependencies = _map(dependencies, function (urn) {
        var m;
        if ((m = urn.match(/^([^:]+):([^\/]|\/[^\/])/)))
        {
          var scheme = m[1];
          var uri = (jsx_require.urnPrefixes || jsx.object.getDataObject())[scheme];
          if (typeof uri != "undefined")
          {
            urn = urn.replace(m[0], uri + m[2]);
          }
          else
          {
            jsx.warn('jsx.require.urnPrefixes["' + scheme + '"] is not defined.'
              + ' Leaving it unchanged.\nDid you mean "' + scheme + '://..."?');
          }
        }

        return urn;
      });

      var script = document.createElement("script");

      if (!script)
      {
        return false;
      }

      if (typeof _addEventListener == "undefined")
      {
        _addEventListener = _getFeature(jsx, ["dom", "addEventListener"]);

        if (!_addEventListener)
        {
          /* no wrapper, try W3C DOM directly */
          _addEventListener = function (target, eventType, listener) {
            return jsx.tryThis(
              function () {
                target.addEventListener(eventType, listener, false);
                return listener;
              });
          };
        }
      }

      if (_addEventListener)
      {
        var listenerSupported = _addEventListener(script, "load",
          function () {
            dependencies.shift();

            if (dependencies.length === 0)
            {
              /* All dependencies loaded successfully */
              if (typeof callback == "function")
              {
                return callback();
              }

              return true;
            }

            jsx_require(dependencies, callback);
          });
      }

      if (listenerSupported)
      {
        _addEventListener(script, "error", function (e) {
          jsx.error(e);
        });

        script.src = dependencies[0];
        (document.head || document.getElementsByTagName("head")[0])
          .appendChild(script);
      }
      else
      {
        jsx.warn('The "load" event is not supported on "script" elements.'
          + ' Attempting to resolve dependencies using synchronous XHR (blocking).');

        for (var i = 0, len = dependencies.length; i < len; ++i)
        {
          if (!_importOnce(dependencies[i]))
          {
            success = false;
            break;
          }
        }

        if (success)
        {
          return callback();
        }
      }
    };
  }());

  if (jsx.options.augmentBuiltins)
  {
    if (jsx.options.augmentPrototypes)
    {
  //    if (jsx.options.augmentObjectPrototype)
  //    {
  //      jsx.object.extend(Object.prototype, {
  //        extend:          extend,
  //        clone:           clone,
  //        findNewProperty: findNewProperty,
  //        _hasOwnProperty: _hasOwnProperty
  //      });
  //    }

      /*
       * KJS 3.5.1 does not support named FunctionExpressions within Object
       * literals if the literal is an AssignmentExpression (right-hand side
       * of an assignment or a passed function argument).
       * fixed since <http://bugs.kde.org/show_bug.cgi?id=123529>
       */

      jsx.object.extend(Function.prototype, {
        /**
         * Applies a method of another object in the context
         * of a different object (the calling object).
         *
         * @memberOf Function.prototype
         * @function
         */
        apply: (function () {
          var
            jsx_object = jsx.object,
            jsx_global = jsx.global;

          /**
           * @param {Object} thisArg
           *   Reference to the calling object
           * @param {Array} argArray
           *   Arguments for the object
           * @return {any}
           */
          return function (thisArg, argArray) {
            if (!thisArg)
            {
              thisArg = jsx_global;
            }

            var
              o = {},
              p = jsx_object.findNewProperty(o);

            if (p)
            {
              o[p] = thisArg || this;

              var a = [];
              for (var i = 0, len = argArray.length; i < len; i++)
              {
                a[i] = "argArray[" + i + "]";
              }

              /*jshint -W061*/
              eval("o[p](" + a + ")");
              /*jshint +W061*/

              delete o[p];
            }
          };
        }()),

        /**
         * Calls (executes) a method of another object in the
         * context of a different object (the calling object).
         *
         * @memberOf Function.prototype
         * @param {Object} thisArg
         *   Reference to the calling object.  SHOULD NOT
         *   be a host object, since augmentation is required.
         * @params {_}
         *   Arguments for the object.
         */
        call: function (thisArg) {
          var a = [];

          for (var i = 1, len = arguments.length; i < len; i++)
          {
            a[i] = "arguments[" + i + "]";
          }

          if (!thisArg)
          {
            thisArg = jsx.global;
          }

          var
            o = {},
            p = jsx.object.findNewProperty(o);

          if (p)
          {
            o[p] = this;
            /*jshint -W061*/
            eval("o[p](" + a + ")");
            /*jshint +W061*/
            delete o[p];
            o = null;
          }
        },

        /**
         * Returns a <code>Function</code> that has a defined
         * <code>this</code> value and calls the calling
         * <code>Function</code> with default parameters.
         *
         * @function
         * @return {Function}
         * @see 15.3.4.5 Function.prototype.bind (thisArg [, arg1 [, arg2, ...]])
         */
        bind: (function () {
          var _slice;
          var _getClass = jsx.object.getClass;

          /**
           * @param {Object} thisArg
           *   <code>this</code> value of the returned
           *   <code>Function</code>
           * @params Default parameters
           */
          return function (thisArg) {
            var target = this;
            if (typeof target != "function")
            {
              return jsx.throwThis("TypeError");
            }

            if (!_slice)
            {
              _slice = Array.prototype.slice;
            }

            var boundArgs = _slice.call(arguments, 1);
            var f = function () {
              return target.apply(thisArg, boundArgs.concat(_slice.call(arguments)));
            };

            if (_getClass(target) == "Function")
            {
              f.length = target.length + boundArgs.length;
            }
            else
            {
              if (typeof Object.defineProperty == "function")
              {
                /*
                 * [[Writable]]: false, [[Enumerable]]: false,
                 * [[Configurable]]: false
                 */
                Object.defineProperty(f, "length");
              }
              else
              {
                f.length = 0;
              }
            }

            return f;
          };
        }()),

        /**
         * Constructs a new object using the calling object as constructor
         * and elements of the referred array as items of the arguments list.
         * <p>
         * Example:
         * <pre><code>var o = Foo.construct(["bar", "baz"]);</code></pre>
         * is equivalent to
         * <pre><code>var o = new Foo("bar", "baz");</code></pre>
         * but, by contrast, allows for passing an arbitrary number of
         * arguments per the array's elements.
         * </p>
         */
        construct: (function () {
          var _jsx_object = jsx.object;
          var _inheritFrom = _jsx_object.inheritFrom;
          var _isObject = _jsx_object.isObject;

          /**
           * @param {Array} argArray
           * @return {Object} Reference to the new instance
           */
          return function (argArray) {
            var o = _inheritFrom(this.prototype);
            var result = this.apply(o, argArray);

            if (_isObject(result))
            {
              o = result;
            }

            return o;
          };
        }())
      });
    }

    jsx.object.extend(Date, {
      /**
       * Constructs a new {@link Date} instance using the calling object
       * as constructor and elements of the referred array as items of
       * the arguments list.
       * <p>
       * <em>Requires {@link jsx.options.augmentBuiltins}.
       * Does not work in strict mode.</em>
       * </p><p>
       * Example:
       * <pre><code>var d = Date.construct([2009, 8, 1]);</code></pre>
       * is equivalent to
       * <pre><code>var d = new Date(2009, 8, 1);</code></pre>
       * but, by contrast, allows for passing an arbitrary number of
       * arguments per the array's elements.
       * </p>
       * @memberOf Date
       * @param {Array} argArray
       * @return {Date} Reference to the new instance
       */
      construct: function (argArray) {
        var a = [];
        for (var i = 0, len = argArray.length; i < len; ++i)
        {
          a[i] = "argArray[" + i + "]";
        }

        /*jshint -W061*/
        return eval("new this(" + a + ")");
        /*jshint +W061*/
      }
    }, jsx.object.ADD_OVERWRITE);
  }

  /**
   * Includes the prototype object of another object in the prototype
   * chain of objects created with the calling Function object.
   * <p>
   * Used with constructors to establish multi-level prototype-based
   * inheritance (much like class-based inheritance in Java).  To that end,
   * this method adds a <code>_super</code> property to the function to refer
   * to <var>Constructor</var>, the constructor of the parent prototype.
   * Likewise, instances constructed with the resulting function have a
   * <code>_super</code> property to refer to their constructor.
   * </p><p>
   * NOTE: Because of this, you need to use the constructor's
   * <code>_super</code> property if you want to refer to the parent's
   * constructor in the instance's constructor; using the instance's
   * <code>_super</code> property would result in infinite recursion,
   * and ultimately a stack overflow.  You may call the parent's
   * constructor explicitly within the constructor of the child, using
   * the (equivalent of the) <code>arguments.callee._super.call()</code>
   * method (or calling it explicitly as a method of the inheriting
   * prototype); in prototype methods, use
   * <code><var>Constructor</var>._super.prototype.method.call()</code>
   * or refer to the parent constructor directly.
   * </p>
   * <p><em>Not to be confused with {@link jsx.object#extend}.</em></p>
   *
   * @function
   * @return {Function}
   *   A reference to the constructor of the extended prototype object
   *   if successful; <code>null</code> otherwise.
   */
  Function.prototype.extend = (function () {
    var _jsx = jsx;
    var _jsx_object = _jsx.object;

    /**
     * @private
     * @function
     * @return {Object}
     */
    var _iterator = (function () {
      /* Optimize if ECMAScript 5 features were available */
      if (typeof Object.defineProperties == "function")
      {
        return function () {
          return this;
        };
      }

      return function () {
        _jsx.warn("for (var p in o.iterator()) { f(); } is inefficient,"
          + " consider using o.forEach(f, ...) instead");

        var o = {};

        for (var p2 in this)
        {
          switch (p2)
          {
            case "_super":
            case "constructor":
            case "iterator":
            case "forEach":
              break;

            default:
              o[p2] = true;
          }
        }

        return o;
      };
    }());

    function _forEach(fCallback, thisObj)
    {
      var t = typeof fCallback;
      if (!_jsx_object.isMethod(fCallback))
      {
        return _jsx.throwThis(
          "TypeError",
          (!/^\s*unknown\s*$/i.test(t) ? fCallback : "arguments[0]")
            + " is not a function",
          this + ".forEach");
      }

      for (var p in this)
      {
        switch (p)
        {
          case "_super":
          case "constructor":
          case "iterator":
          case "forEach":
            break;

          default:
            /* also supports host object's methods */
            Function.prototype.call.call(fCallback, thisObj, this[p], p, this);
        }
      }
    }

    /**
     * @param {Function} fSuper
     *   Constructor from whose prototype object should be inherited.
     * @param {Object} oProtoProps
     *   Object from which to shallow-copy properties as prototype
     *   properties.  Of those, the <code>_super</code>,
     *   <code>constructor</code>, and <code>_userDefined</code>
     *   properties are ignored as they are used internally.
     */
    return function (fSuper, oProtoProps) {
      var me = this;

      /*
       * Allows constructor to be null or undefined to inherit from
       * Object.prototype by default (see below)
       */
      if (fSuper == null)
      {
        if (typeof fSuper == "undefined")
        {
          /* Passing undefined is probably unintentional, so warn about it */
          _jsx.warn((_jsx_object.getFunctionName(me) || "[anonymous Function]")
            + ".extend(" + "undefined, " + oProtoProps + "):"
            + " Parent constructor is undefined, using Object");
        }

        fSuper = "Object";
      }

      /*
       * Supports strings being passed that denote properties of the
       * Global Object.
       *
       * TODO: An API that only registers strings as references to features
       * defined later, and implements inheritance using this registry
       * on user call only, might be useful for constructors defined
       * in Object initializers.
       */
      if (typeof fSuper.valueOf() == "string")
      {
        fSuper = _jsx.global[fSuper];
      }

      var t = typeof fSuper;
      if (t != "function")
      {
        _jsx.throwThis("TypeError",
          (/\s*unknown\s*/i.test(t) ? "Unknown" : t) + " is not a function");
        return null;
      }

      var super_proto = fSuper.prototype;
      this.prototype = _jsx_object.inheritFrom(super_proto);

      if (oProtoProps)
      {
        for (var p in oProtoProps)
        {
          var prop = this.prototype[p] = oProtoProps[p];

          if (typeof prop == "function"
              && typeof super_proto[p] == "function")
          {
            prop._super = super_proto[p];
          }
        }
      }

      this._super = fSuper;
      this.prototype._super = super_proto;
      this.prototype.constructor = this;
      this._userDefined = true;

      /* PERF: for (var p in o.iterator()) is rather inefficient */
      /**
       * @deprecated
       * @return {Object}
       */
      if (typeof this.prototype.iterator != "function")
      {
        this.prototype.iterator = _iterator;
      }

      /* Optimize iteration if ECMAScript 5 features are available */
      if (typeof Object.defineProperties == "function")
      {
        var
          userDefProtoProps = ["_super", "constructor", "iterator"],
          oDescriptors = {},
          proto = this.prototype;

        for (var i = userDefProtoProps.length; i--;)
        {
          p = userDefProtoProps[i];
          oDescriptors[p] = {
            value: proto[p],
            enumerable: false
          };
        }

        _jsx.tryThis(
          function () {
            Object.defineProperties(proto, oDescriptors);
          },
          function (e) {
            _jsx.warn(_jsx_object.getFunctionName(me) + ".extend("
              + _jsx_object.getFunctionName(fSuper) + ", "
              + oProtoProps + "): " + e.name + ': ' + e.message);
          });
      }

      if (typeof this.prototype.forEach != "function")
      {
        /**
         * Calls a function for each real property of the object
         * in arbitrary order.  Workaround for for-in iteration
         * on objects with augmented prototype object.
         *
         * @param {Function} fCallback
         * @param {Object} thisObj (optional)
         * @throws TypeError
         */
        this.prototype.forEach = _forEach;

        /* Optimize iteration if ECMAScript 5 features are available */
        if (typeof Object.defineProperty == "function")
        {
          _jsx.tryThis(
            function () {
              Object.defineProperty(me.prototype, "forEach", {
                value: me.prototype.forEach,
                enumerable: false
              });
            },
            function (e) {
              /* IE 8 goes here */
              _jsx.warn(
                'Borken implementation: Object.defineProperty is a method'
                + ' but [[Call]](this.prototype, "forEach") throws exception ("'
                + e.name + ': ' + e.message + '")');
            }
          );
        }
      }

      /* DEBUG */
  //    document.write("<pre>" + ["this = " + this, "this._super = " + this._super].join("\n\n") + "\n===</pre>");

      return this;
    };
  }());

  /**
   * General exception
   *
   * @constructor
   * @extends Error
   * @param {string} sMsg
   */
  jsx.Error = function jsx_Error (sMsg) {
    var msg = (sMsg || "Unspecified error");
    var _super = jsx_Error._super;
    var e = null;

    if (typeof _super == "function")
    {
      _super.call(this, msg);

      jsx.tryThis(function () { e = new _super(); });
    }

    if (!this.message)
    {
      /**
       * @type string
       */
      this.message = msg;
    }

    if (!this.lineNumber && e)
    {
      /**
       * @type number
       */
      this.lineNumber = e.lineNumber || e.line;
    }

    if (!this.stack && e && e.stack)
    {
      var stack = String(e.stack).split(/\r?\n|\r/).slice(2);
      this.stack = stack.join("\n");
    }
  };

  jsx.Error.extend(
    (typeof Error != "undefined" && Error !== null ? Error : function () {}),
    {
      /**
       * @memberOf jsx.Error.prototype
       */
      name: "jsx.Error",
      getMessage: function () { return this.message; },
      getStackTrace: function () { return this.stack; },
      printStackTrace: function () {
        var s = this.getStackTrace();
        jsx.dmsg(s) || window.alert(s);
    }
  });

  if (jsx.options.augmentPrototypes)
  {
    /*
     * Defines Array.prototype.get(), .indexOf(), .map() and .slice()
     * if not already defined
     */
    jsx.object.extend(Array.prototype, {
      /**
       * @see jsx.array.get()
       */
      get: function (index) {
        return jsx.array.get(this, index);
      },

      /**
       * @see jsx.array.set()
       */
      set: function (index, value) {
        return jsx.array.set(this, index, value);
      },

      /**
       * Returns the first index at which a given element can be found in
       * the array, or -1 if it is not present.
       *
       * @param searchElement
       *   Element to locate in the array.
       * @param {Number} fromIndex
       *   The index at which to begin the search. Defaults to 0, i.e.
       *   the whole array will be searched. If the index is greater than
       *   or equal to the length of the array, -1 is returned, i.e.
       *   the array will not be searched. If negative, it is taken as
       *   the offset from the end of the array. Note that even when
       *   the index is negative, the array is still searched from front
       *   to back. If the calculated index is less than 0, the whole array
       *   will be searched.
       * @return {number}
       *   The first index at which a given element can be found in
       *   the array, or -1 if it is not present.
       * @author Courtesy of developer.mozilla.org, unverified
       * @memberOf Array.prototype
       * @see ECMAScript Language Specification, 5.1 Edition, section 15.4.4.14
       */
      indexOf: function (searchElement, fromIndex) {
        if (this === void 0 || this === null)
        {
          throw new TypeError();
        }

        var t = Object(this);

        var len = t.length >>> 0;
        if (len === 0) {
          return -1;
        }

        var n = 0;
        if (arguments.length > 0)
        {
          n = Number(fromIndex);
          if (n !== n) {
            /* shortcut for verifying if it's NaN */
            n = 0;
          }
          else if (n !== 0 && n !== Infinity && n !== -Infinity)
          {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
          }
        }

        if (n >= len)
        {
          return -1;
        }

        var k = (n >= 0 ? n : Math.max(len - Math.abs(n), 0));
        for (; k < len; k++)
        {
          if (k in t && t[k] === searchElement)
          {
            return k;
          }
        }

        return -1;
      },

      /**
       * Maps one array to another
       *
       * @param {Callable} callback
       * @param {Object} oThis (optional)
       * @return {Array}
       *   The original array with <var>callback</var> applied to each element.
       * @see ECMAScript Language Specification, 5.1 Edition, section 15.4.4.19
       */
      map: function (callback, oThis) {
        return jsx.array.map(this, callback, oThis);
      },

      /**
       * @param {Number} start
       * @param {Number} end
       * @return {Array}
       */
      slice: function (start, end) {
        var a = [];
        var len = this.length >>> 0;
        var relativeStart = parseInt(start, 10);
        var k = (relativeStart < 0
              ? Math.max(len + relativeStart, 0)
              : Math.min(relativeStart, len));
        var relativeEnd = (typeof end == "undefined"
                        ? len
                        : parseInt(end, 10));
        var _final = (relativeEnd < 0
                   ? Math.max(len + relativeEnd, 0)
                   : Math.min(relativeEnd, len));
        var n = 0;
        while (k < _final)
        {
          if ((k in this))
          {
            a[n] = this[k];
          }

          ++k;
          ++n;
        }

        return a;
      }
    });
  }

  /**
   * Formats a value for debug output
   *
   * @param value
   * @returns {string}
   */
  jsx.debugValue = function jsx_debugValue (value) {
    var type = typeof value;
    var _class = jsx.object.getClass(value);

    return (
      (_class == "Array"
        ? "[" + value.map(jsx_debugValue).join(", ") + "]"
        : (jsx.object.isString(value)
            ? '"' + value.replace(/["\\]/g, "\\$&") + '"'
            : value))
      + " : "
      + (type == "object" || type == "function" ? _class : type)
    );
  };

  /**
   * Invalid argument
   *
   * @constructor
   * @extends jsx.Error
   * @param {string} sReason
   * @param sGot
   * @param sExpected
   */
  jsx.InvalidArgumentError =
    function jsx_InvalidArgumentError (sReason, sGot, sExpected) {
      var argc = arguments.length;

      jsx_InvalidArgumentError._super.call(this,
        (sReason || "Invalid argument(s)")
          + (argc > 1 ? ": " + jsx.debugValue(sGot) : "")
          + (argc > 2 ? "; expected " + sExpected : ""));
    };
  jsx.InvalidArgumentError.extend(jsx.Error, {
    /**
     * @memberOf jsx.InvalidArgumentError.prototype
     */
    name: "jsx.InvalidArgumentError"
  });

  /**
   * Object-related exception
   *
   * @constructor
   * @param {string} sMsg
   * @extends jsx.Error
   */
  jsx.object.ObjectError = function jsx_object_ObjectError (sMsg) {
    jsx_object_ObjectError._super.call(this, sMsg);
  };
  jsx.object.ObjectError.extend(jsx.Error, {
    /**
     * @memberOf jsx.object.ObjectError.prototype
     */
    name: "jsx.object.ObjectError"
  });

  /**
   * Property-related exception§
   *
   * @constructor
   * @param {string} sMsg
   * @extends #ObjectError
   */
  jsx.object.PropertyError = function jsx_object_PropertyError (sMsg) {
    jsx_object_PropertyError._super.call(
      this, "No such property" + (arguments.length > 0 ? (": " + sMsg) : ""));
  };
  jsx.object.PropertyError.extend(jsx.object.ObjectError, {
    /**
     * @memberOf jsx.object.PropertyError.prototype
     */
    name: "jsx.object.PropertyError"
  });
}(this));
