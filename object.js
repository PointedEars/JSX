/**
 * @fileOverview <title>Basic Object Library</title>
 * @file $Id$
 *
 * @author (C) 2004-2013 <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
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

/*
 * NOTE: Cannot use addProperties() for the following
 * because values have not been defined yet!
 *
 * TODO: Should syntactic sugar be provided to work around
 * this issue?  See Function.prototype.extend().
 */

jsx.MSG_INFO = "info";
jsx.MSG_WARN = "warn";
jsx.MSG_ERROR = "error";
jsx.MSG_DEBUG = "debug";

if (typeof jsx.options == "undefined")
{
  /**
   * @namespace
   */
  jsx.options = {};
}

/**
 * If <code>false</code> missing language features are not emulated.
 * The default is <code>true</code>.
 * <p>
 * WARNING: JSX features may depend on emulation; intended for
 * testing only.
 * </p>
 * @type boolean
 */
if (typeof jsx.options.emulate == "undefined")
{
  jsx.options.emulate = true;
}

/**
 * @namespace
 */
jsx.object = (function (global) {
  return {
    /**
     * @version
     */
    version:   "$Revision$ ($Date$)",
    copyright: "Copyright \xA9 2004-2013",
    author:    "Thomas Lahn",
    email:     "js@PointedEars.de",
    path:      "http://PointedEars.de/scripts/",

    /**
     * Used by {@link jsx.object#addProperties()} to overwrite existing
     * properties.
     *
     * @type number
     * @field
     */
    ADD_OVERWRITE: 1,

    /**
     * Used by {@link jsx.object#addProperties()} and {@link jsx.object#clone()}
     * to make a shallow copy of all enumerable properties (default).
     *
     * @type number
     */
    COPY_ENUM: 0,

    /**
     * Used by {@link jsx.object#addProperties()} and {@link jsx.object#clone()}
     * to make a deep copy of all enumerable properties.
     *
     * @type number
     */
    COPY_ENUM_DEEP: 2,

    /**
     * Used by {@link jsx.object#addProperties()} and {@link jsx.object#clone()}
     * to copy a property by inheritance.
     *
     * @type number
     */
    COPY_INHERIT: 4,

    /**
     * Determines whether an object is, or several objects are,
     * likely to be callable.
     *
     * @author (C) 2003-2010  <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
     * @memberOf jsx.object
     * @function
     */
    isMethod: (function () {
      var
        rxUnknown = /^\s*unknown\s*$/i,
        rxNativeMethod = /^\s*function\s*$/i,
        rxMethod = /^\s*(function|object)\s*$/i,
        areNativeMethods = null;

      /**
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
       * @see jsx.object#isMethodType()
       */
      return function (obj, prop) {
        var len = arguments.length;
        if (len < 1)
        {
          jsx.throwThis("jsx.InvalidArgumentError",
            ["Not enough arguments", "saw 0", "(obj : Object[, prop : string])"]);
          return false;
        }

        /*
         * Determine if we were apply'd by jsx.object.areNativeMethods;
         * NOTE: cache reference
         */
        var checkNative =
          (this == (areNativeMethods
                     || (areNativeMethods = jsx.object.areNativeMethods)));

        var t = typeof obj;

        /* When no property names are provided, test if the first argument is a method */
        if (len < 2)
        {
          if (checkNative)
          {
            return rxNativeMethod.test(t) && obj && true || false;
          }

          return rxUnknown.test(t) || rxMethod.test(t) && obj && true || false;
        }

        /* otherwise the first argument must refer to a suitable object */
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
              else if (checkNative && !rxNativeMethod.test(t))
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
      };
    }())
  };
}(this));

/**
 * @property Global
 *   Reference to the ECMAScript Global Object
 */
jsx.global = this;

jsx.object.areMethods =
  jsx.object.isHostMethod = jsx.object.areHostMethods = jsx.object.isMethod;

// jsx.object.docURL = jsx.object.path + "object.htm";

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

/**
 * Determines whether an object is, or several objects are,
 * likely to be a native method.
 *
 * @author (C) 2011  <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
 * @function
 */
jsx.object.isNativeMethod = jsx.object.areNativeMethods = (function () {
  var areMethods = jsx.object.areMethods;

  /**
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
   * @see jsx.object#isMethodType()
   */
  return function jsx_object_areNativeMethods (obj, prop) {
    /* NOTE: Thread-safe, argument-safe code reuse -- `this' is our ID */
    return areMethods.apply(jsx_object_areNativeMethods, arguments);
  };
}());

/**
 * Determines if the passed value could be the result of
 * <code>typeof <var>callable</var></code>.
 * <p>
 * NOTE: This method has previously been provided by {@link types.js};
 * optimizations in code reuse moved it here.
 * </p>
 * @param {string} s
 *   String to be determined a method type, i.e. "object" or "unknown" in
 *   MSHTML, "function" otherwise.  The type must have been retrieved with
 *   the `typeof' operator.  Note that this method may also return
 *   <code>true</code> if the value of the <code>typeof</code> operand is
 *   <code>null</code>; to be sure that the operand is a method reference,
 *   you have to && (AND)-combine the <code>isMethodType(...)</code>
 *   expression with the method reference identifier unless `typeof' yielded
 *   `unknown' for <var>s</var>.
 * @return {boolean}
 *   <code>true</code> if <var>s</var> is a method type,
 *   <code>false</code> otherwise.
 * @author
 *   (C) 2003-2008  Thomas Lahn &lt;types.js@PointedEars.de&gt;
 *   Distributed under the GNU GPL v3 and later.
 * @partof http://pointedears.de/scripts/types.js
 * @deprecated since version 0.1.5a.2009070204
 *   in favor of {@link jsx.object#isMethod(Object)}
 */
jsx.object.isMethodType = function (s) {
  return /^\s*(function|object|unknown)\s*$/i.test(s);
};

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
   * @return {boolean}
   *   <code>true</code> if it was possible to cause the message to be printed;
   *   <code>false</code> otherwise.
   */
  return function (sMsg, sType) {
    /* Firebug 0.4+ and others */
    if (typeof console != "undefined")
    {
      if (!sType || !_isMethod(console, sType) && sType != "log")
      {
        sMsg = msgMap.getString(sType) + sMsg;
        sType = "log";
      }

      if (sType != "info")
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
 * @param {string} sMsg  Message
 * @see jsx#dmsg
 */
jsx.info = function (sMsg) {
  return jsx.dmsg(sMsg, jsx.MSG_INFO);
};

/**
 * Issues a warning, if possible.
 *
 * @param {string} sMsg  Message
 * @see jsx#dmsg
 */
jsx.warn = function (sMsg) {
  return jsx.dmsg(sMsg, jsx.MSG_WARN);
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
 * Creates a duplicate (clone) of an object
 *
 * @function
 */
jsx.object.clone = (function () {
  var
    jsx_object = jsx.object,
    COPY_ENUM = jsx_object.COPY_ENUM,
    COPY_ENUM_DEEP = jsx_object.COPY_ENUM_DEEP,
    COPY_INHERIT = jsx_object.COPY_INHERIT,
    createTypedObject = function (oOriginal) {
      if (oOriginal.constructor)
      {
        return jsx_object.inheritFrom(oOriginal.constructor.prototype);
      }

      return new Object();
    };

  /**
   * @param {Number} iLevel (optional)
   *   Use the {@link Object#COPY_ENUM Object.COPY_*}
   *   properties to specify the level of cloning.
   * @param {Object} oSource (optional)
   *   Object to be cloned.  If omitted, the calling object is cloned.
   * @return {Object}
   *   A reference to the clone.
   */
  return function jsx_object_clone (iLevel, oSource) {
    if (typeof iLevel == "object")
    {
      oSource = iLevel;
      iLevel = COPY_ENUM;
    }

    if (!oSource)
    {
      oSource = this;
    }

    var me = jsx_object_clone;

    if (!iLevel || (iLevel & COPY_ENUM_DEEP))
    {
      /*
       * NOTE: For objects, valueOf() only copies the object reference,
       *       so we are creating an instance that inherits from the
       *       original's prototype, if possible.
       */
      var i,
        o2 = (typeof oSource == "object" && oSource)
           ? createTypedObject(oSource)
           : oSource.valueOf();

      /* just in case "var i in ..." does not copy the array elements */
      if (typeof Array != "undefined" && o2.constructor == Array)
      {
        for (i = oSource.length; i--;)
        {
          if (iLevel && typeof oSource[i] == "object")
          {
            jsx.tryThis(function () { o2[i] = me(iLevel, oSource[i]); });
          }
          else
          {
            jsx.tryThis(function () { o2[i] = oSource[i]; });
          }
        }
      }

      for (i in oSource)
      {
        if (iLevel && typeof oSource[i] == "object")
        {
          jsx.tryThis(function () { o2[i] = me(iLevel, oSource[i]); });
        }
        else
        {
          jsx.tryThis(function () { o2[i] = oSource[i]; });
        }
      }

      return o2;
    }
    else if (iLevel & COPY_INHERIT)
    {
      return jsx_object.inheritFrom(oSource);
    }

    return null;
  };
}());

/**
 * Adds/replaces properties of an object
 *
 * @function
 */
jsx.object.addProperties = (function () {
  var
    rxObject = /^\s*(object|function)\s*$/i,
    jsx_object = jsx.object,
    clone = jsx_object.clone,
    ADD_OVERWRITE = jsx_object.ADD_OVERWRITE,
    COPY_ENUM_DEEP = jsx_object.COPY_ENUM_DEEP,
    COPY_INHERIT = jsx_object.COPY_INHERIT;

  /**
   * @param {Object} oSource
   *   Object specifying the properties to be added/replaced.
   *   The name of each property serves as the name for the
   *   property of the target object, its value as the value
   *   of that property.
   * @param {Number} iFlags = 0
   *   Flags for the modification, see {@link Object#ADD_OVERWRITE
   *   ADD_*} and {@link Object#COPY_ENUM COPY_*}.
   * @param {Object} oOwner (optional)
   *   If provided, used as target object instead of the
   *   calling object.  This makes it possible to call
   *   the method without an explicit calling object.
   */
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

    for (var p in oSource)
    {
      if (typeof oOwner[p] == "undefined" || (iFlags & ADD_OVERWRITE))
      {
        jsx.tryThis(function () {
          oOwner[p] = clone(
            iFlags & (COPY_ENUM_DEEP | COPY_INHERIT),
            oSource[p]);
          oOwner[p]._userDefined = true;
        });
      }
    }
  };
}());

/**
 * Defines getters and setters for the properties of an object, if possible.
 *
 * Uses {@link Object.prototype#__defineGetter__} and
 * {@link Object.prototype#__defineSetter__} (JavaScript only) as fallback.
 *
 * @param {Object} oTarget
 *   The object for which properties getters and setters should be defined.
 * @param {Object} oProperties
 *   Definition of the getters and setters for each property.  Must be of
 *   the form
 * <code><pre>{
 *   propertyName: {
 *     get: function () {…},
 *     set: function (newValue) {…}
 *   },
 *   …
 * }
 *   </pre></code> as specified in the ECMAScript Language Specification,
 *   Edition 5 Final, section 15.2.3.7.
 * @param {string} sContext (optional)
 *   The context in which the property definition was attempted.
 *   Included in the info message in case getters and setters could not be
 *   defined.
 * @todo Depending on ES Matrix results, replace with user-defined
 *   Object.defineProperties() if the implementation does not provide it.
 */
jsx.object.defineProperties = function (oTarget, oProperties, sContext) {
  jsx.tryThis(
    function () {
      Object.defineProperties(oTarget, oProperties);
    },
    function () {
      jsx.tryThis(
        function () {
          for (var propertyName in oProperties)
          {
            var propertyDescriptor = oProperties[propertyName];

            if (typeof propertyDescriptor.value != "undefined")
            {
              oTarget[propertyName] = propertyDescriptor.value;
            }

            /* NOTE: Allow specified values to fail */
            if (typeof propertyDescriptor.get != "undefined")
            {
              oTarget.__defineGetter__(propertyName, propertyDescriptor.get);
            }

            if (typeof propertyDescriptor.set != "undefined")
            {
              oTarget.__defineSetter__(propertyName, propertyDescriptor.set);
            }
          }
        },
        function () {
          jsx.info((sContext ? sContext + ": " : "")
            + "Could not define special properties."
            + " Please use explicit getters and setters instead.");
        }
      );
    }
  );
};

/**
 * Determines if an object has a (non-inherited) property
 */
jsx.object._hasOwnProperty = (function () {
  var _isMethod = jsx.object.isMethod;

  /**
   * @param {Object} obj (optional)
   *   Object which property should be checked for existence.
   * @param {string} sProperty
   *   Name of the property to check.
   * @return {boolean}
   *   <code>true</code> if there is such a property;
   *   <code>false</code> otherwise.
   */
  return function (obj, sProperty) {
    if (arguments.length < 2 && obj)
    {
      sProperty = obj;
      obj = this;
    }

    var proto;

    return (_isMethod(obj, "hasOwnProperty")
      ? obj.hasOwnProperty(sProperty)
      : (typeof obj[sProperty] != "undefined"
          && ((typeof obj.constructor != "undefined"
                && (proto = obj.constructor.prototype)
                && typeof proto[sProperty] == "undefined")
              || (typeof obj.constructor == "undefined"))));
  };
}());

/**
 * Determines if a (non-inherited) property of an object is enumerable
 */
jsx.object._propertyIsEnumerable = (function () {
  var _isMethod = jsx.object.isMethod;
  var _hasOwnProperty = jsx.object._hasOwnProperty;

  /**
   * @param {Object} obj (optional)
   *   Object which property should be checked for enumerability.
   * @param {string} sProperty
   *   Name of the property to check.
   * @return {boolean}
   *   <code>true</code> if there is such a property;
   *   <code>false</code> otherwise.
   */
  return function (obj, sProperty) {
    if (arguments.length < 2 && obj)
    {
      sProperty = obj;
      obj = this;
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
  };
}());

/**
 * Returns the name of an unused property for an object.
 *
 * @function
 */
jsx.object.findNewProperty = (function () {
  var _hasOwnProperty = jsx.object._hasOwnProperty;

  /**
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
  return function (obj, iLength) {
    if (!obj)
    {
      obj = this;
    }

    if (arguments.length < 2)
    {
      iLength = 256;
    }
    else
    {
      iLength = parseInt(iLength, 10);
    }

    var newName = "";

    while (newName.length < iLength)
    {
      for (var i = "a".charCodeAt(0), max = "z".charCodeAt(0); i <= max; ++i)
      {
        var ch = String.fromCharCode(i);
        if (!_hasOwnProperty(obj, newName + ch + "_"))
        {
          return newName + ch + "_";
        }
      }

      newName += "a";
    }

    return "";
  };
}());

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
 *         <th>Meaning</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       <tr>
 *         <th><code><var>exclude</var> :&nbsp;Array</code></th>
 *         <td><code>Array</code> containing the names of the
 *             properties that should not be searched</td>
 *       </tr>
 *       <tr>
 *         <th><code><var>recursive</var> :&nbsp;boolean</code></th>
 *         <td>If a true-value, search recursively.</td>
 *       </tr>
 *       <tr>
 *         <th><code><var>strict</var> :&nbsp;boolean</code></th>
 *         <td>If a true-value, perform a strict comparison
 *             without type conversion.</td>
 *       </tr>
 *     </tbody>
 *   </table>
 */
jsx.object.hasPropertyValue =
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
  };

/**
 * Clears the handler for the proprietary <code>error</code> event.
 *
 * NOTE: This method has previously been provided by {@link debug.js};
 * optimizations in code reuse moved it here.
 *
 * @return boolean <code>true</code>
 */
/*
 * NOTE: Initialization must come before the initialization of
 *       setErrorHandler() as it is used in a closure there,
 *       see Message-ID <2152411.FhMhkbZ0Pk@PointedEars.de>
 */
jsx.clearErrorHandler = function () {
  if (typeof window != "undefined")
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

    if (typeof assertFalse == "function")
    {
      assertFalse(typeof fHandler == "undefined", false,
        "jsx.setErrorHandler(fHandler)");
    }

    if (typeof window != "undefined"
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
 *           <code>errorHandlers</code></td>
 *       <td>the passed values</td>
 *     </tr>
 *     <tr valign="top">
 *       <td>code</td>
 *       <td>the entire constructed <code>try</code>...<code>catch</code>
 *           string that is evaluated as a <i>Program</i></td>
 *     </tr>
 *     <tr valign="top">
 *       <td>e</td>
 *       <td>Only within <var>errorHandlers</var>:
 *           the value thrown in case of an exception</td>
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
 *   Called if a <code>Function</code>, converted
 *   to string if not a string, and used as-is otherwise.
 *   For compatibility, the <code>undefined</code> value
 *   is evaluated like the empty string.
 * @param {Function|string|any} errorHandlers
 *   Value to be evaluated as a <i>StatementList</i> in case of an
 *   exception.  Called if a <code>Function</code>,
 *   converted to string if not a string, and used as-is otherwise.
 *   For compatibility, the <code>undefined</code> value
 *   is evaluated like the empty string.
 * @return
 *   The result of <code>statements</code>, or the result
 *   of <code>errorHandlers</code> if an error occurred.
 * @author
 *   Copyright (c) 2008
 *   Thomas 'PointedEars' Lahn &lt;js@PointedEars.de&gt;
 *   Distributed under the GNU GPL v3 and later.
 * @partof JSX:object.js
 */
jsx.tryThis =
//  (function () {
//  /**
//   * @param s Value to be stringified
//   * @param sCall : string
//   *   CallStatement that should be used instead of the value
//   * @return string Stringified version of <code>s</code>
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

  /*return*/ function (statements, errorHandlers) {
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
    try
    {
      if (t == "function")
      {
        return statements();
      }

      return eval(statements);
    }
    catch (e)
    {
      t = typeof errorHandlers;
      if (t == "function")
      {
        return errorHandlers(e);
      }

      return eval(errorHandlers);
    }
  };
//}());

/**
 * Throws an exception, including an execution context hint if provided,
 * followed by an error message.
 *
 * NOTE: This method has previously been provided by {@link exception.js};
 * optimizations in code reuse moved it here.
 *
 * @function
 * @author
 *   Copyright (c) 2008 Thomas 'PointedEars' Lahn <cljs@PointedEars.de>.
 *   Distributed under the GNU GPL v3 and later.
 * @partof JSX:object.js
 */
jsx.throwThis = (function () {
  var
    jsx_global = jsx.global,
    jsx_object = jsx.object,
    _addslashes = function (e) {
      return (typeof e == "string")
        ? '"' + e.replace(/["'\\]/g, "\\$&").replace(/\r?\n|\r/g, "\\n") + '"'
        : e;
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
   *   where the exception occurred.
   */
  return function (errorType, message, context) {
    var sErrorType = errorType;
    var isError = false;

    if (Error.prototype.isPrototypeOf(errorType))
    {
      isError = true;
      sErrorType = "errorType";
    }
    else if (jsx_object.isMethod(errorType))
    {
      sErrorType = "new errorType";
    }
    else if (typeof errorType == "string")
    {
      sErrorType = "new " + errorType;
    }

    var sContext = "";
    if (jsx_object.isMethod(jsx_global, "Error"))
    {
      var stack = (new Error()).stack;
      if (stack)
      {
        sContext = "\n\n" + stack;
      }
    }

    /* DEBUG: set breakpoint here */
    if (!sContext)
    {
      if (jsx_object.isMethod(context))
      {
        sContext = (String(context).match(/^\s*(function.+\))/)
                     || [, null])[1];
        sContext = sContext ? sContext + ': ' : '';
      }
    }

    /* Array for exception constructor's argument list */
    if (jsx_object.isMethod(message, "map"))
    {
      message = message.map(_addslashes);
    }
    else
    {
      message = (message || "") + (sContext || "");
      message = _addslashes(message);
    }

    /* DEBUG */
    var throwStmt = 'throw ' + (sErrorType ? sErrorType : '')
                  + (isError ? '' : '(' + (message || "") + ')') + ';';

    eval(throwStmt);
  };
}());

/**
 * Rethrows arbitrary exceptions
 *
 * @param {Error} exception
 */
jsx.rethrowThis = function (exception) {
  eval("throw exception");
};

/**
 * Lets one object inherit from another
 *
 * @function
 */
jsx.object.inheritFrom = (function () {
  var
    _jsx = jsx,
    _global = _jsx.global,
    _isNativeMethod = _jsx.object.isNativeMethod,
    Dummy = function () {};

  /**
   * @param {Object} obj = Object.prototype
   *   Object from which to inherit.  The default is
   *   <code>Object.prototype</code>.
   * @return {Object}
   *   Inheriting (child) object
   */
  return function (obj) {
    if (typeof obj == "object" && obj == null)
    {
      if (_isNativeMethod(_global.Object, "create")
          && !Object.create._emulated)
      {
        return Object.create(null);
      }

      var result = new Object();
      result.__proto__ = null;
      return result;
    }

    Dummy.prototype = (typeof obj == "undefined")
                    ? Object.prototype
                    : (obj || null);
    return new Dummy();
  };
}());

/**
 * Returns a new object that can serve as data container.
 *
 * Returns a new object that, if supported, does not inherit or
 * have any properties.  This is accomplished by either cutting
 * off its existing prototype chain or not creating one for it
 * in the first place.
 *
 * @function
 * @return Object
 * @see Object.create
 */
jsx.object.getDataObject = (function () {
  var _inheritFrom = jsx.object.inheritFrom;

  return function () {
    return _inheritFrom(null);
  };
}());

jsx.object.getKeys = (function () {
  var
    _jsx = jsx,
    _global = _jsx.global,
    _isNativeMethod = _jsx.object.isNativeMethod,
    _hasOwnProperty = jsx.object._hasOwnProperty;

  return function (obj) {
    if (_isNativeMethod(_global.Object, "keys")
        && !Object.keys._emulated)
    {
      return Object.keys(obj);
    }

    var a = new Array();

    for (var p in obj)
    {
      if (_hasOwnProperty(obj, p))
      {
        a[a.length] = p;
      }
    }

    return a;
  };
}());

if (jsx.options.emulate)
{
  if (!jsx.object.isNativeMethod(jsx.tryThis("Object"), "create"))
  {
    if (!jsx.object.isNativeMethod(jsx.tryThis("Object"), "defineProperties"))
    {
      if (!jsx.object.isNativeMethod(jsx.tryThis("Object"), "getOwnPropertyNames"))
      {
        Object.getOwnPropertyNames = (function () {
          var _hasOwnProperty = jsx.object._hasOwnProperty;

          return function (o) {
            var names = [];

            for (var p in o)
            {
              if (_hasOwnProperty(o, p))
              {
                names.push(p);
              }
            }

            return names;
          };
        }());
      }

      /**
       * Defines a property of an object.
       *
       * Emulation of the Object.defineProperty() method from ES 5.1,
       * section 15.2.3.6.
       *
       * @function
       */
      Object.defineProperty = (function () {
        var _hasOwnProperty = jsx.object._hasOwnProperty;

        function _toPropertyDescriptor(obj)
        {
          if (!/^(object|function)$/i.test(typeof obj) || !obj)
          {
            jsx.throwThis("TypeError", "Object expected");
          }

          var desc = new Object();

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
              jsx.throwThis("TypeError", "Function expected for getter");
            }

            desc.get = obj.get;
          }

          var hasSetter = _hasOwnProperty(obj, "set");
          if (hasSetter)
          {
            if (typeof obj.set != "function")
            {
              jsx.throwThis("TypeError", "Function expected for setter");
            }

            desc.set = obj.set;
          }

          if ((hasGetter || hasSetter) && (hasValue || hasWritable))
          {
            jsx.throwThis("TypeError", "Cannot define getter/setter and value/writable");
          }

          return desc;
        }

        function _defineOwnProperty (obj, propertyName, descriptor, _throw)
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

  //        var current = obj.hasOwnProperty(propertyName);
  //        var extensible = obj[propertyName].[[Extensible]]

          if (_isGenericDescriptor(descriptor) || _isDataDescriptor(descriptor))
          {
            var value = descriptor.value;
            obj[propertyName] = value;

            if (!descriptor.writable)
            {
              /* NOTE: Need getter because __defineSetter__() undefines value */
              obj.__defineGetter__(propertyName, function () {
                return value;
              });

              obj.__defineSetter__(propertyName, function () {});
            }
          }
          else
          {
            /* accessor property descriptor */
            if (descriptor.get)
            {
              obj.__defineGetter__(propertyName, descriptor.get);
            }

            if (descriptor.set)
            {
              obj.__defineSetter__(propertyName, descriptor.set);
            }
          }

          return false;
        }

        /**
         * @param {Object} o
         * @param {Object} descriptor (optional)
         *   Property descriptor, a reference to an object that defines
         *   the attributes of the property.  Supported properties of
         *   that defining object include <code>value</code> only
         *   at this time.
         * @return Reference to the object
         * @type Object
         */
        return function (o, propertyName, descriptor) {
          if (!/^(object|function)$/.test(typeof o) || !o)
          {
            jsx.throwThis("TypeError", "Object expected");
          }

          var name = String(propertyName);
          var desc = _toPropertyDescriptor(descriptor);
          _defineOwnProperty(o, name, desc, true);

          return o;
        };
      }());

      /**
       * Defines the properties of an object.
       *
       * Emulation of the Object.defineProperties() method from ES 5.1,
       * section 15.2.3.7.
       *
       * @param {Object} o
       * @param {Object} descriptor (optional)
       *   Properties descriptor, where each own property name
       *   is a property name of the new object, and each corresponding
       *   property value is a reference to an object that defines the
       *   attributes of that property.  Supported properties of
       *   that defining object include <code>value</code> only
       *   at this time.
       * @return {Object} Reference to the object
       */
      Object.defineProperties = function (o, descriptor) {
        var properties = Object.getOwnPropertyNames(descriptor);
        for (var i = 0, len = properties.length; i < len; ++i)
        {
          var propertyName = properties[i];
          Object.defineProperty(o, propertyName, descriptor[propertyName]);
        }

        return o;
      };
    }

    /**
     * Creates a new object and initializes its properties.
     *
     * Emulation of the Object.create() method from ES 5.1,
     * section 15.2.3.5.
     *
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
    Object.create = function (prototype, descriptor) {
      var o = jsx.object.inheritFrom(prototype);

      if (typeof descriptor != "undefined")
      {
        Object.defineProperties(o, descriptor);
      }

      return o;
    };
    Object.create._emulated = true;
  }

  if (!jsx.object.isNativeMethod(jsx.tryThis("Object"), "keys"))
  {
    /**
     * @param {Object} obj
     */
    Object.keys = function (obj) {
      return jsx.object.getKeys(obj);
    };
    Object.keys._emulated = true;
  }
}

/**
 * Returns a feature of an object
 *
 * @param {Object} obj
 * @return
 *   <code>false</code> if <var>obj</var> does not have such a feature
 */
jsx.object.getFeature = function (obj) {
  for (var i = 1, len = arguments.length; i < len; i++)
  {
    var arg = arguments[i];
    if (typeof obj != "undefined" && typeof obj[arg] != "undefined" && obj[arg])
    {
      obj = obj[arg];
    }
    else
    {
      return false;
    }
  }

  return obj;
};

/**
 * Emulates the <code>instanceof</code> operator (JavaScript 1.5) compatible to JavaScript 1.1
 * for <strong>one</strong> inheritance level.
 *
 * Example:
 * <pre><code>
 *   var o = new Object();
 *   o instanceof Object; // yields `true'
 *
 *   function Foo()
 *   {
 *   }
 *   var o = new Foo();
 *   o instanceof Object;     // yields `true'
 *   o instanceof Foo;        // yields `true' also
 *   isInstanceOf(o, Object); // yields `false'
 *   isInstanceOf(o, Foo);    // yields `true'
 * </code></pre>
 *
 * NOTE: This method has previously been provided by {@link types.js};
 * optimizations in code reuse moved it here.
 *
 * @author (C) 2003, 2011, 2013  Thomas Lahn &lt;js@PointedEars.de&gt;
 * @param {Object} obj
 *   Expression to be determined a <var>Prototype</var> object.
 * @param {Function} Constructor
 *   Object to be determined the constructor of a.
 * @return {boolean}
 *   <code>true</code> if <code>obj</code> is an object derived
 *   from <var>Prototype</var>, <code>false</code> otherwise.
 */
jsx.object.isInstanceOf = //(function () {
//  var jsx_object = jsx.object;
//
//  return
  function (obj, Constructor) {
    return !!(obj && Constructor
      && typeof obj.constructor != "undefined"
      && obj.constructor == Constructor

      /*
       * For a built-in type T, T.prototype often has the same
       * [[Class]] like instances (exception: RegExp);
       * BUT error-prone for native user-defined objects (Color "==" KeyValue)!
       */
//      || jsx_object.getClass(obj) == jsx_object.getClass(Prototype.prototype)
      );
  };
//}());

/**
 * Returns the name of a function
 *
 * @param {Function|string} aFunction
 * @return {string}
 *   The name of a function if it has one; the empty string otherwise.
 */
jsx.object.getFunctionName = function (aFunction) {
  /* Return the empty string for null or undefined */
  return (aFunction != null
           && typeof aFunction.name != "undefined" && aFunction.name)
    || (String(aFunction).match(/\s*function\s+([A-Za-z_]\w*)/) || [, ""])[1];
};

/**
 * Returns minimum documentation for a function
 *
 * @param {Function|string} aFunction
 * @return string
 */
jsx.object.getDoc = function (aFunction) {
  return (String(aFunction).match(
    /^\s*(function(\s+[A-Za-z_]\w*)?\s*\([^\)]*\))/) || [, ""])[1];
};

/**
 * Gets the stack trace of the calling execution context.
 *
 * Based on getStackTrace() from jsUnit 2.2alpha of 2006-03-24.
 *
 * @return {string}
 *   The stack trace of the calling execution context, if available.
 */
jsx.getStackTrace = function () {
  /**
   * @private
   * @param excp
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
//          stack[stack.length] = name;
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

  if (typeof arguments.caller != 'undefined')
  {
    /* JScript and older JavaScript */
    for (var a = arguments.caller; a != null; a = a.caller)
    {
      result += '> ' + (jsx.object.getFunctionName(a.callee) || "anonymous")
        + '\n';
      if (a.caller == a)
      {
        result += '*';
        break;
      }
    }
  }
  else
  {
    /* other */
    if (typeof Error != "function")
    {
      return result;
    }

    var stack = parseErrorStack(new Error());
    result = stack.slice(2).join("\n");
//    for (var i = 1; i < stack.length; i++)
//    {
//      result += '> ' + stack[i] + '\n';
//    }
  }

  return result;
};

/**
 * Returns the value of an object's internal <code>[[Class]]</code>
 * property.
 * <p>
 * Calls the <code>Object.prototype.toString()</code> method on
 * the object and returns the result of matching against
 * the specified return value, which includes the value of
 * the object's internal <code>[[Class]]</code> property. Although
 * implementations use prototype-based inheritance, the property
 * value is useful for determining the type of an object regardless
 * of the current value of its <code>constructor</code> property.
 * For example, that makes it possible to recognize <code>Array</code>
 * instances independent of the global context in which they were
 * constructed.
 * </p>
 */
jsx.object.getClass = (function () {
  var _toString = ({}).toString;

  /**
   * @param obj
   * @return {string|undefined}
   *   The value of an object's internal [[Class]] property, or
   *   <code>undefined</code> if the property value cannot be determined.
   */
  return function (obj) {
    return (_toString.call(obj)
      .match(/^\s*\[object\s+(\S+)\s*\]\s*$/) || [, ])[1];
  };
}());

/**
 * Retrieves the value of a property of an object
 *
 * @param {Object} obj
 * @param {string} sProperty
 * @param aDefault
 * @return any
 * @throw
 *   {@link jsx.object#PropertyError} if the property
 *   does not exist or has the <code>undefined</code> value, and
 *   <var>aDefault</var> was not provided
 */
jsx.object.getProperty = function (obj, sProperty, aDefault) {
  if (typeof obj[sProperty] != "undefined")
  {
    return obj[sProperty];
  }

  /* default value not passed */
  if (arguments.length < 3)
  {
    jsx.throwThis("jsx.object.PropertyError", sProperty);
  }

  return aDefault;
};

/**
 * Returns the absolute path for a URI-reference
 *
 * @param {string} relativePath
 * @param {string} basePath
 * @return string
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

  /**
   * @param {Object} obj
   * @param {Array} properties (optional)
   *   List of names of properties to import.  If not provided or
   *   <code>null</code>, all enumerable own properties of
   *   <var>obj</var> are imported.
   * @param {string} objAlias (optional)
   *   The alias property on the Global object that should be used
   *   instead of the Global Object.  Helps to avoid spoiling
   *   the global namespace.
   * @param {Array} propertyAliases (optional)
   *   The aliases that should be used for each property, in order,
   *   that is specified in <var>properties</var>.  Helps to avoid
   *   overwriting property values.
   * @throws TypeError, if <var>obj</var> is not an iterable object
   * @return {boolean}
   *   <code>false</code> if <var>properties</var> is provided and not
   *   all properties could be imported; <code>true</code> otherwise.
   */
  return function (obj, properties, objAlias, propertyAliases) {
    if (!obj)
    {
      jsx.throwThis("TypeError",
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

    for (var i = 0, len = properties.length; i < len; ++i)
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
 */
jsx.importFrom = (function () {
  /* Imports */
  var _import = jsx._import;
  var Request;

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
   * @return {boolean}
   *   <code>true</code> if the script could be successfully <em>loaded</em>
   *   (not: included), <code>false</code> otherwise.
   */
  return function jsx_importFrom (uri, obj, properties, objAlias, propertyAliases) {
    /* One-time import */
    if (!Request)
    {
      Request = jsx.net.http.Request;
    }

    jsx_importFrom.lastImport = uri;
    var req = new Request(uri, "GET", false, function (response) {
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
  };
}());

/**
 * Imports once an object or some of its properties
 * from a script resource into the global namespace.
 *
 * @function
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
   * @see jsx#importFrom
   */
  function importOnce (uri, obj, properties, objAlias, propertyAliases)
  {
    /**
     * @param {string} uri
     * @return {boolean}
     *   <code>true</code> if the script specified by <var>uri</var>
     *   has already been included; <code>false</code> otherwise.
     */
    function scriptIncluded (uri)
    {
      var scripts = document.getElementByTagName("script");
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
 * Determines if a value refers to an object.
 *
 * <p>Returns <code>true</code> if the value is a reference
 * to an object; <code>false</code> otherwise.</p>
 *
 * <p>An value "is an object" if it is a function or
 * <code>typeof "object"</code> but not <code>null</code>.
 *
 * @return boolean
 */
jsx.object.isObject = function (a) {
  var t = typeof a;
  return t == "function" || t == "object" && a !== null;
};

/**
 * Determines if a value refers to an {@link Array}.
 * <p>
 * Returns <code>true</code> if the value is a reference to an object
 * whose <code>[[Class]]</code> internal property is <code>"Array"</code>;
 * <code>false</code> otherwise.
 * </p>
 *
 * @function
 * @see ECMAScript Language Specification, Edition 5.1, section 15.4.3.2
 */
jsx.object.isArray = (function () {
  var _jsx = jsx;
  var _global = _jsx.global;
  var _jsx_object = jsx.object;
  var _getClass = _jsx_object.getClass;
  var _isNativeMethod = _jsx_object.isNativeMethod;

  /**
   * @param a
   *   Potential <code>Array</code>
   * @return boolean
   */
  return function (a) {
    if (_isNativeMethod(_global.Array, "isArray")
        && !Array.isArray._emulated)
    {
      return Array.isArray(a);
    }

    return (_getClass(a) === "Array");
  };
}());

/**
 * Executes a function if and once its requirements are fulfilled.
 */
jsx.require = (function () {
  var _importOnce = jsx.importOnce;
  var _isArray = jsx.object.isArray;

  /**
   * @param {string|Array} uri
   *   URI-reference or <code>Array</code> of URI-references
   *   specifying the requirement(s)
   * @param {Function} callback
   *   Function to be executed
   * @return
   *   The return value of <var>callback</var>,
   *   <code>false</code> otherwise.
   */
  return function (uri, callback) {
    if (!_isArray(uri))
    {
      uri = [uri];
    }

    var success = true;
    for (var i = 0, len = uri.length; i < len; ++i)
    {
      if (!_importOnce(uri[i]))
      {
        success = false;
        break;
      }
    }

    if (success)
    {
      return callback();
    }

    return false;
  };
}());

if (jsx.options.emulate)
{
/* Disabled until ECMAScript allows to hide properties from iteration */
//addProperties({
//    addProperties  : addProperties,
//    clone          : clone,
//    findNewProperty: findNewProperty,
//    _hasOwnProperty: _hasOwnProperty
//  },
//  Object.prototype);

  if (jsx.object.isNativeMethod(this, "eval"))
  {
    /*
     * KJS 3.5.1 does not support named FunctionExpressions within Object
     * literals if the literal is an AssignmentExpression (right-hand side
     * of an assignment or a passed function argument).
     * fixed since <http://bugs.kde.org/show_bug.cgi?id=123529>
     */

    jsx.object.addProperties(
      {
        /**
         * Applies a method of another object in the context
         * of a different object (the calling object).
         *
         * @memberOf Function#prototype
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

              var a = new Array();
              for (var i = 0, len = argArray.length; i < len; i++)
              {
                a[i] = "argArray[" + i + "]";
              }

              eval("o[p](" + a + ")");

              delete o[p];
            }
          };
        }()),

        /**
         * Calls (executes) a method of another object in the
         * context of a different object (the calling object).
         *
         * @memberOf Function#prototype
         * @param {Object} thisArg
         *   Reference to the calling object.  SHOULD NOT
         *   be a host object, since augmentation is required.
         * @params {_}
         *   Arguments for the object.
         */
        call: function (thisArg) {
          var a = new Array();

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
            eval("o[p](" + a + ")");
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
         */
        bind: (function () {
          var _slice;
          var _getClass = jsx.object.getClass;

          /**
           * @param {Object} thisArg
           *   <code>this</code> value of the returned
           *   <code>Function</code>
           * @params Default parameters
           * @return Function
           * @see 15.3.4.5 Function.prototype.bind (thisArg [, arg1 [, arg2, ...]])
           */
          return function (thisArg) {
            var target = this;
            if (typeof target != "function")
            {
              jsx.throwThis("TypeError");
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
         * <pre><code>var d = Date.construct([2009, 8, 1]);</code></pre>
         * is equivalent to
         * <pre><code>var d = new Date(2009, 8, 1);</code></pre>
         * but, by contrast, allows for passing an arbitrary number of
         * arguments per the array's elements.
         * </p>
         * @memberOf Function#prototype
         * @param {Array} argArray
         * @return {Object} Reference to the new instance
         */
        construct: function (argArray) {
          var a = new Array();
          for (var i = 0, len = argArray.length; i < len; ++i)
          {
            a[i] = "argArray[" + i + "]";
          }

          return eval("new this(" + a + ")");
        },

        /**
         * @author Courtesy of Asen Bozhilov, slightly adapted
         * @function
         * @memberOf Function#prototype
         */
        construct2: (function () {
          function Dummy(constructor, argArray) {
            constructor.apply(this, argArray);
          }

          /**
           * @param {Array} argArray
           * @return {Object} Reference to the new instance
           */
          return function (argArray) {
            Dummy.prototype = this.prototype;
            return new Dummy(this, argArray);
          };
        }())
      },
      Function.prototype);
  }
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
 *
 * @function
 */
Function.prototype.extend = (function () {
  var _jsx = jsx;
  var _global = _jsx.global;
  var _jsx_object = _jsx.object;

  var _iterator = (function () {
    /* Optimize if ECMAScript 5 features were available */
    if (_jsx_object.isNativeMethod(_global.Object, "defineProperties"))
    {
      return function () {
        return this;
      };
    }

    return function () {
      _jsx.warn("for (var p in o.iterator()) { f(); } is inefficient,"
        + " consider using o.forEach(f, ...) instead");

      var o = new Object();

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
      _jsx.throwThis(
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
   * @param {Function} fConstructor
   *   Constructor from which prototype object should be
   *   inherited.
   * @param {Object} oProtoProps
   *   Object from which to shallow-copy properties as prototype
   *   properties.  Of those, the <code>_super</code>,
   *   <code>constructor</code>, and <code>_userDefined</code>
   *   properties are ignored as they are used internally.
   * @return {Function}
   *   A reference to the constructor of the extended prototype object
   *   if successful; <code>null</code> otherwise.
   */
  return function (fConstructor, oProtoProps) {
    var me = this;

    /*
     * Allows constructor to be null or undefined to inherit from
     * Object.prototype by default (see below)
     */
    if (fConstructor == null)
    {
      if (typeof fConstructor == "undefined")
      {
        /* Passing undefined is probably unintentional, so warn about it */
        _jsx.warn((_jsx_object.getFunctionName(me) || "[anonymous Function]")
          + ".extend(" + "undefined, " + oProtoProps + "):"
          + " Parent constructor is undefined, using Object");
      }

      fConstructor = "Object";
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
    if (typeof fConstructor.valueOf() == "string")
    {
      fConstructor = _jsx.global[fConstructor];
    }

    var t = typeof fConstructor;
    if (t != "function")
    {
      _jsx.throwThis("TypeError",
        (/\s*unknown\s*/i.test(t) ? "Unknown" : t) + " is not a function");
      return null;
    }

    this.prototype = _jsx_object.inheritFrom(fConstructor.prototype);

    if (oProtoProps)
    {
      for (var p in oProtoProps)
      {
        this.prototype[p] = oProtoProps[p];
      }
    }

    this._super = fConstructor;
    this.prototype._super = fConstructor.prototype;
    this.prototype.constructor = this;
    this._userDefined = true;

    /* PERF: for (var p in o.iterator()) is rather inefficient */
    /**
     * @return Object
     * @deprecated
     */
    if (typeof this.prototype.iterator == "undefined")
    {
      this.prototype.iterator = _iterator;
    }

    /* Optimize iteration if ECMAScript 5 features are available */
    if (_jsx_object.isNativeMethod(_global.Object, "defineProperties"))
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
            + _jsx_object.getFunctionName(fConstructor) + ", "
            + oProtoProps + "): " + e.name + ': ' + e.message);
        });
    }

    if (!jsx.object.isNativeMethod(this.prototype, "forEach"))
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
      if (_jsx_object.isNativeMethod(_jsx.global.Object, "defineProperty"))
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

    return this;
  };
}());

jsx.array = {
  /**
   * Maps one array to another
   *
   * @see ECMAScript Language Specification, Edition 5.1, section 15.4.4.19
   */
  map: (function () {
    var _isMethod = jsx.object.isMethod;

    /**
     * @param {Array} array
     *   Array to be mapped
     * @param {Callable} callback
     * @param {Object} oThis (optional)
     * @return {Array}
     *   <var>array</var> with <var>callback</var> applied to each element.
     */
    return function (array, callback, oThis) {
      if (!_isMethod(callback))
      {
        jsx.throwThis("TypeError",
          (_isMethod(callback, "toSource") ? callback.toSource() : callback)
            + " is not callable",
          this + ".map");
      }

      var
        len = array.length >>> 0,
        res = [];

      for (var i = 0; i < len; ++i)
      {
        if (i in array)
        {
          res[i] = callback.call(oThis, array[i], i, array);
        }
      }

      return res;
    };
  }())
};

if (jsx.options.emulate)
{
  /* Defines Array.isArray() if not already defined */
  jsx.object.addProperties({isArray: jsx.object.isArray}, Array);

  /* Defines Array.prototype.indexOf and .map() if not already defined */
  jsx.object.addProperties(
    {
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
       * @return
       *   The first index at which a given element can be found in
       *   the array, or -1 if it is not present.
       * @author Courtesy of developer.mozilla.org, unverified
       * @memberOf Array.prototype
       * @see ECMAScript Language Specification, Edition 5.1, section 15.4.4.14
       */
      indexOf: function (searchElement, fromIndex) {
        "use strict";
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

        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
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
       * @see ECMAScript Language Specification, Edition 5.1, section 15.4.4.19
       */
      map: function (callback, oThis) {
        return jsx.array.map(this, callback, oThis);
      },

      slice: function (start, end) {
        var a = [];
        var len = this.length >>> 0;
        var relativeStart = parseInt(start, 10);
        var k = ((relativeStart < 0)
              ? Math.max(len + relativeStart, 0)
              : Math.min(relativeStart, len));
        var relativeEnd = ((typeof end == "undefined")
                        ? len
                        : parseInt(end, 10));
        var final = ((relativeEnd < 0)
                   ? Math.max(len + relativeEnd, 0)
                   : Math.min(relativeEnd, len));
        var n = 0;
        while (k < final)
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
    },
    Array.prototype);

  if (typeof Array.from == "undefined")
  {
    Array.from = (function () {
      var _map = Array.prototype.map;

      return function (builder, iterable, oThis) {
        return _map.call(iterable, builder, oThis);
      };
    }());
  }
}

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
     * @type Number
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
  typeof Error != "undefined" ? Error : function () {},
  {
    /**
     * @memberOf jsx.Error#prototype
     */
    name: "jsx.Error",
    getMessage: function () { return this.message; },
    getStackTrace: function () { return this.stack; },
    printStackTrace: function () {
      var s = this.getStackTrace();
      jsx.dmsg(s) || window.alert(s);
  }
});

/**
 * Invalid argument
 *
 * @constructor
 * @extends jsx#Error
 * @param {string} sReason
 * @param sGot
 * @param sExpected
 * @returns {jsx_InvalidArgumentError}
 */
jsx.InvalidArgumentError =
  function jsx_InvalidArgumentError (sReason, sGot, sExpected) {
    jsx_InvalidArgumentError._super.call(this,
      (sReason || "Invalid argument(s)")
        + (sGot ? ": " + sGot : "")
        + (sExpected ? "; expected " + sExpected : ""));
  };

jsx.InvalidArgumentError.extend(jsx.Error, {
  /**
   * @memberOf jsx.InvalidArgumentError#prototype
   */
  name: "jsx.InvalidArgumentError"
});

/**
 * Object-related exception
 *
 * @constructor
 * @param {string} sMsg
 * @extends jsx#Error
 */
jsx.object.ObjectError = function jsx_object_ObjectError (sMsg) {
  jsx_object_ObjectError._super.call(this, sMsg);
};

jsx.object.ObjectError.extend(jsx.Error, {
  /**
   * @memberOf jsx.object.ObjectError#prototype
   */
  name: "jsx.object.ObjectError"
});

/**
 * Property-related exception
 *
 * @constructor
 * @param {string} sMsg
 * @extends jsx.object#ObjectError
 */
jsx.object.PropertyError = function jsx_object_PropertyError (sMsg) {
  jsx_object_PropertyError._super.call(
    this, "No such property" + (arguments.length > 0 ? (": " + sMsg) : ""));
};

jsx.object.PropertyError.extend(jsx.object.ObjectError, {
  /**
   * @memberOf jsx.object.PropertyError#prototype
   */
  name: "jsx.object.PropertyError"
});