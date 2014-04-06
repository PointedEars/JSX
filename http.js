/**
 * @fileOverview <title>HTTP Library</title>
 * @file $Id$
 * @requires
 *   object.js for jsx.object#isMethod()
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

if (typeof jsx.net == "undefined")
{
  /**
   * @namespace
   */
  jsx.net = {};
}

/**
 * @idl{WebIDL}
 *
 * interface HTTPResponseListener : Function {
 *   boolean HTTPResponseListener(IXMLHttpRequest x);
 *     // Handles the response for the HTTP request initiated with x.send()
 *     // SHOULD return a true-value if successful, a false-value otherwise
 * };
 *
 * interface HTTPMethod {
 *   const string GET="GET"
 *   const string POST="POST"
 * };
 *
 * interface HTTPRequestReadyState {
 *   const int COMPLETED=4
 * };
 *
 * interface HTTPStatus {
 *   const RegExp OK_EXPR=/\b(0|2\d\d|1223)\b/
 *   const RegExp FAILED_EXPR=/\b[45]\d\d\b/
 * };
 *
 * interface HTTPRequest {
 *            attribute string                 URL
 *                                               setter=setURL(string)
 *                                               default=setURL();
 *            attribute HTTPMethod             method
 *                                               setter=setMethod(string)
 *                                               default=setMethod();
 *            attribute boolean                async
 *                                               setter=setAsync(boolean)
 *                                               default=setAsync();
 *            attribute string                 data
 *                                               setter=setData(string)
 *                                               default=setData();
 *            attribute string                 requestType
 *                                               setter=setRequestType(string)
 *                                               default=setRequestType();
 *   readonly attribute HTTPRequestReadyState  readyState
 *   readonly attribute HTTPStatus             status
 *            attribute HTTPResponseListener   _responseListener
 *            attribute HTTPResponseListener   successListener
 *            attribute HTTPResponseListener   errorListener
 *
 *   HTTPRequest HTTPRequest(
 *     optional string sURL = document.URL,
 *     optional string sMethod = HTTPMethod.GET,
 *     optional boolean bAsync = true,
 *     optional HTTPResponseListener fSuccessListener = null,
 *     optional HTTPResponseListener fErrorListener = null);
 *     // URL=sURL, method=sMethod, async=bAsync,
 *     // successListener=fSuccessListener, errorListener=fErrorListener
 *
 *   boolean setURL(optional string sURL = "");
 *     // URL=sURL
 *
 *   boolean setMethod(optional string sMethod = HTTPMethod.GET);
 *     // method=sMethod
 *
 *   boolean setAsync(optional boolean bAsync = true);
 *     // async=bAsync
 *
 *   boolean setData(optional (ArrayBufferView or Blob or Document or DOMString or FormData)? sData = null);
 *     // data=sData
 *
 *   boolean setRequestType(
 *     optional string sRequestType = "application/x-www-form-urlencoded");
 *     // requestType=sRequestType
 *
 *   boolean send(optional (ArrayBufferView or Blob or Document or DOMString or FormData)? sData = null,
 *                optional string sURL = document.URL,
 *                optional string sMethod = HTTPMethod.GET,
 *                optional boolean bAsync = true);
 *     // URL=sURL, method=sMethod
 * };
 *
 * @end
 */
jsx.net.http = {
  /** @version */
  version:   "0.1.$Revision$ ($Date$)",
  copyright: "Copyright \xA9 2004-2012",
  author:    "Thomas Lahn",
  email:     "js@PointedEars.de",
  path:      "http://PointedEars.de/scripts/",

  /**
   * Creates a new <code>Request</code> object.
   *
   * You can set up response listeners per argument (see below), or
   * {@link jsx.net.http.Request.prototype#setResponseListener setResponseListener()},
   * {@link jsx.net.http.Request.prototype#setSuccessListener setSuccessListener()},
   * and {@link jsx.net.http.Request.prototype#setErrorListener setErrorListener()};
   * then call {@link jsx.net.http.Request.prototype#send send()} to submit
   * the request.
   *
   * NOTE: The objects so created are not thread-safe.  You should
   * not modify their properties while another request with the same
   * object is in progress.  When in doubt, create a new object for
   * each request.  (This issue may be fixed in a later version.)
   *
   * @param {string} sURL = document.URL
   *   Request URL.  The default is the URL of the sending resource.
   * @param {string} sMethod = jsx.net.http.Request.method.GET
   *   Request method.  Use the <code>jsx.net.http.Request.method.GET</code>
   *   (default) and <code>.POST</code> properties to avoid problems
   *   caused by case mismatch, and other typos.
   * @param {boolean} bAsync = true
   *   Pass <code>true</code> to make an asynchronous request (default),
   *   that is, a request that is processed in the background and does
   *   not interrupt user operation.
   * @param {jsx.net.http.ResponseListener} fSuccessListener = null
   *   The function to handle the response of a successful request
   *   (default: <code>null</code>).
   * @param {jsx.net.http.ResponseListener} fErrorListener = null
   *   The function to handle the response of a request that failed
   *   (default: <code>null</code>).
   * @constructor
   */
  Request: function (sURL, sMethod, bAsync, fSuccessListener, fErrorListener) {
    this.setURL(sURL, true);
    this.setMethod(sMethod);
    this.setAsync(bAsync);
    this.setSuccessListener(fSuccessListener);
    this.setErrorListener(fErrorListener);
    this.setResponseListener();
    this.setData();
    this.setRequestType();
  }
};

/**
 * @namespace
 * @name jsx.net.http.Request
 */
jsx.object.extend(jsx.net.http.Request, {
  /**
   * @namespace
   */
  method: {
    /**
     * Use the predefined properties to avoid problems
     * caused by case mismatch and other typos.
     */
    GET: "GET",
    POST: "POST"
  },

  /**
   * @namespace
   */
  readyState: {
    UNINITIALIZED: 0,
    LOADING: 1,
    LOADED: 2,
    INTERACTIVE: 3,
    COMPLETED: 4
  },

  /**
   * @namespace
   */
  status: {
    /*
     * NOTE: MSXML translates 204 to 1223, see
     * https://prototype.lighthouseapp.com/projects/8886/tickets/129-ie-mangles-http-response-status-code-204-to-1223
     */
    OK_EXPR: /\b(0|2\d\d|1223)\b/,
    LOCAL_NONE: 0,

    CONTINUE: 100,
    SWITCH_PROTOCOL: 101,

    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NONAUTHOR_INFO: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,

    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    USE_PROXY: 305,
    TEMP_REDIR: 307,

    FAILED_EXPR: /\b[45]\d\d\b/,

    CLIENT_ERROR_EXPR: /\b4\d\d\b/,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTH_REQUIRED: 407,
    REQ_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECOND_FAILED: 412,
    REQ_ENTITY_TOO_LARGE: 413,
    REQ_URI_TOO_LONG: 414,
    UNSUPP_MEDIA_TYPE: 415,
    REQ_RANGE_NOT_SUITABLE: 416,
    EXPECT_FAILED: 417,

    SERVER_ERROR_EXPR: /\b5\d\d\b/,
    INT_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SVC_UNAVAIL: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VER_NOT_SUPP: 505
  }
});

jsx.net.http.Request.prototype = {
  constructor: jsx.net.http.Request,

  /**
   * Cached XHR object
   *
   * @protected
   */
  _xhr: null,

  requestHeaders: jsx.object.getDataObject(),

  useCache: true,

  _handledSuccess: false,
  _handledError: false,

  /**
   * Method to be called onreadystatechange
   *
   * @private
   * @function
   */
  _responseListener: void 0,

  /**
   * Sets the <code>URL</code> property.
   *
   * @param {string} sURL
   *   If not provided or a false-value, the
   *   URL of the sending recource is set.
   * @param {boolean} bDontEncode (optional)
   *   If <code>true</code>, do not encode the request URI.
   */
  setURL: function (sURL, bDontEncode) {
    if (!bDontEncode && sURL)
    {
      sURL = encodeURI(sURL);
    }

    /**
     * @type string
     */
    this.URL = (sURL || document.URL);
  },

  /**
   * Sets the <code>method</code> property.  Use the
   * <code>HTTPRequest.method.(GET|POST)</code> properties
   * to avoid problems with character case and typos.
   *
   * @param {string} sMethod (optional)
   *   If not provided or a false-value, the value
   *   of <code>HTTPRequest.method.GET</code> is used.
   */
  setMethod: function (sMethod) {
    this.method =
      sMethod
        ? String(sMethod).toUpperCase()
        : this.constructor.method.GET;
  },

  /**
   * Defines whether the request should be synchronous (blocking the UA until
   * the response was fully received) or asynchronous (waiting for the
   * response to be fully received in the background, this is the default
   * and recommended).
   *
   * @param {boolean} bAsync (optional)
   *   If not provided or a true-value, the request will be asynchronous.
   */
  setAsync: function (bAsync) {
    this.async = (typeof bAsync == "undefined" ? true : !!bAsync);
  },

  /**
   * Defines the response Listener method to be used for handling
   * requests.
   *
   * A <code>HTTPRequest</code> object is always initialized with
   * an inherited default response Listener that calls
   * {@link HTTPRequest.prototype#successListener() successListener()}
   * on success, and
   * {@link HTTPRequest.prototype#errorListener() errorListener()}
   * on failure.  Once initialized, passing a reference to a
   * non-callable object as argument, throws an
   * {@link jsx#InvalidArgumentError InvalidArgumentError}
   * exception.
   *
   * @param {HTTPResponseListener} fResponseListener
   * @throws jsx.InvalidArgumentError if the argument is not a method
   */
  setResponseListener: function (fResponseListener) {
    /* initialization */
    if (typeof fResponseListener == "undefined"
        && typeof this._responseListener == "undefined")
    {
      this._responseListener = new jsx.net.http.ResponseListener();
      return true;
    }

    if (jsx.object.isMethod(fResponseListener))
    {
      this._responseListener = fResponseListener;
      return (this._responseListener == fResponseListener);
    }

    jsx.throwThis("jsx.InvalidArgumentError",
      "jsx:HTTPRequest::setResponseListener: Argument is not a method");
    return false;
  },

  /**
   * Defines a response listener method to be used for handling
   * successful requests.
   *
   * An <code>HTTPRequest</code> object is always initialized with
   * an inherited dummy success listener (a {@link jsx.net.http.ResponseListener}
   * instance) that does nothing, if you do not specify one.  Once initialized,
   * passing a reference to a non-callable object as argument throws an
   * {@link jsx#InvalidArgumentError InvalidArgumentError}
   * exception.
   *
   * @param {HTTPResponseListener} fSuccessListener
   *   <code>true</code> if the listener could be successfully
   *   set or changed; <code>false</code> on error, unless an exception is thrown.
   * @throws jsx.InvalidArgumentError if the argument is not a method
   * @return {Request} This object on success, <code>null</code> otherwise
   */
  setSuccessListener: function (fSuccessListener) {
    /* initialization */
    if (typeof fSuccessListener == "undefined"
        && typeof this.successListener == "undefined")
    {
      this.successListener = new jsx.net.http.ResponseListener();
      return this;
    }

    if (typeof fSuccessListener == "function")
    {
      this.successListener = fSuccessListener;
      return (this.successListener == fSuccessListener) ? this : null;
    }

    jsx.throwThis("jsx.InvalidArgumentError",
      "jsx:HTTPRequest::setResponseListener: Argument is not a method");
    return null;
  },

  /**
   * Defines the response listener method to be used for handling
   * unsuccessful requests.
   *
   * An <code>HTTPRequest</code> object is always initialized with
   * an inherited dummy error listener that does nothing (a
   * {@link jsx.net.http.ResponseListener} instance), if you
   * do not specify one.  Once initialized, passing a reference
   * to a non-callable object as argument throws an
   * {@link jsx#InvalidArgumentError InvalidArgumentError}
   * exception.
   *
   * @param {HTTPResponseListener} fErrorListener
   * @throws jsx.InvalidArgumentError if the argument is not a method
   */
  setErrorListener: function (fErrorListener) {
    if (typeof fErrorListener == "undefined"
        && typeof this.errorListener == "undefined")
    {
      this.errorListener = new jsx.net.http.ResponseListener();
      return true;
    }

    if (jsx.object.isMethod(fErrorListener))
    {
      this.errorListener = fErrorListener;
      return (this.errorListener == this.errorListener);
    }

    jsx.throwThis('jsx.InvalidArgumentError',
      "jsx:HTTPRequest::setErrorListener: Argument is not a method");
    return false;
  },

  /**
   * Sets the <code>data</code> property.
   *
   * @param {ArrayBufferView|Blob|Document|string|FormData} sData (optional)
   *   If not provided or a false-value, sets
   *   the property to <code>null</code>.
   * @see HTTPRequest.prototype#resetData()
   */
  setData: function (sData) {
    this.data = (sData || null);
    return this;
  },

  /**
   * Resets the <code>data</code> property to the empty string.
   *
   * @see HTTPRequest.prototype#setData()
   */
  resetData: function () {
    this.setData();
  },

  /**
   * Retrieves the data to send in the request, and optionally the request
   * method, from an (X)HTML form.  TODO: select[multiple] elements
   *
   * @param {HTMLFormElement} f
   * @param {boolean} bUseFormMethod (optional)
   *   If <code>true</code>, the form's request method becomes the
   *   <code>HTTPRequest</code> object's request method. The default
   *   is <code>false</code>.
   * @return boolean
   */
  getDataFromForm: function (f, bUseFormMethod) {
    var result = false, es, len;

    if (f && (es = f.elements) && (len = es.length))
    {
      if (bUseFormMethod)
      {
        this.setMethod(f.method);
      }

      var aData = [];

      for (var i = 0; i < len; i++)
      {
        var o = es[i];
        if (o.name)
        {
          aData.push(encodeURIComponent(o.name) + "=" + encodeURIComponent(o.value != "" ? o.value : ""));
        }
      }

      this.data = aData.join("&");
      result = true;
    }

    return result;
  },

  /**
   * Sets the Content-Type for the HTTP request.  The default is
   * "application/x-www-form-urlencoded" to indicate form submission,
   * which is what Web browsers send as default then, although this
   * media type is currently not registered with IANA.
   *
   * @param {string} sRequestType
   *   <code>"application/x-www-form-urlencoded"</code>, if omitted or
   *   a false-value (like "", the empty string).
   * @param {string} sEncoding
   *   Character encoding of the message body
   * @return {jsx.net.http.Request}
   *   This object
   */
  setRequestType: function (sRequestType, sEncoding) {
    this.requestType =
      (sRequestType || "application/x-www-form-urlencoded")
      + (sEncoding ? "; charset=" + sEncoding : "");

    return this;
  },

  /**
   * Sets a request header field value
   *
   * @param name
   * @param value
   * @return {jsx.net.http.Request}
   *   This object
   */
  setRequestHeader: function (name, value) {
    this.requestHeaders[name] = value;
    return this;
  },

  /**
   * Sets additional request header field values
   */
  setRequestHeaders: (function () {
    var _hasOwnProperty = jsx.object._hasOwnProperty;

    /**
     * @param {Object} obj
     *   Object specifying the additional header fields for the
     *   next request.  Names of own properties of this object
     *   define the header field names, their values the corresponding
     *   field values.
     * @return {jsx.net.http.Request}
     *   This object
     */
    function _setRequestHeaders (obj)
    {
      for (var name in obj)
      {
        if (_hasOwnProperty(obj, name))
        {
          this.requestHeaders[name] = obj[name];
        }
      }

      return this;
    }

    return _setRequestHeaders;
  }()),

  dontCache: function () {
    this.useCache = false;
    return this;
  },

  /**
   * Returns a reference to an XML HTTP Request object.  Reuses an existing
   * object if possible (if it has processed the previous request); creates
   * a new object if necessary;
   *
   * @protected
   * @function
   */
  _getXHR: (function () {
    var jsx_global = jsx.global,
        _isMethod = jsx.object.isMethod;

    /**
     * @return {IXMLHttpRequest}
     *   A reference to an XML HTTP Request object or <code>null</code>,
     *   if no such object can be created.
     */
    function _getXHR ()
    {
      var x = this._xhr;

      /* Reuse existing XHR instance if possible */
      if (x !== null
          && x.readyState == this.constructor.readyState.COMPLETED)
      {
        return x;
      }

      /*
       * Create new XHR instance:
       * Feature detection based on Jim Ley's XML HTTP Request tutorial
       * at <http://jibbering.com/2002/4/httprequest.html>
       */

      /* Initialize to detect failure later */
      x = null;

      /*
       * IE 6+ (JScript allows for conditional compilation; an ordinary comment
       * to other script engines).  Note that IE 7 supports XMLHttpRequest() but
       * currently not for `file:' URIs, so we don't prefer that wrapper (see
       * <http://xhab.blogspot.com/2006/11/ie7-support-for-xmlhttprequest.html>).
       */
      if (_isMethod(jsx_global, "ActiveXObject"))
      {
        /*@cc_on @*/
        /*@if (@_jscript_version >= 5)
            try
            {
              // TODO: Try this first?
              // new ActiveXObject("Msxml2.XMLHTTP");

              // MSXML 3.0-
              x = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e)
            {
              x = null;
            }
          @end @*/
      }

      /* Gecko and Opera 8.1+ */
      if (!x && _isMethod(jsx_global, "XMLHttpRequest"))
      {
        jsx.tryThis(
          function () { x = new XMLHttpRequest(); },
          function () { x = null; });
      }

      /* IceBrowser */
      if (!x && typeof window != "undefined"
             && _isMethod(window, "createRequest"))
      {
        jsx.tryThis(
          function () { x = window.createRequest(); },
          function () { x = null; });
      }

      /* Update cache if unused */
      if (x && this._xhr === null)
      {
        this._xhr = x;
      }

      return x;
    }

    return _getXHR;
  }()),

  /**
   * Submits the HTTP request.
   *
   * @function
   */
  send: (function () {
    var _isMethod = jsx.object.isMethod;

    /**
     * @param {ArrayBufferView|Blob|Document|string|FormData} sData (optional)
     *   The data to form the request body.  If the request method is "GET",
     *   this argument is ignored and <code>null</code> is used instead (no body).
     *   If the request method is "POST", and this value is not provided, the
     *   value defaults to that of the <code>data</code> property, which is
     *   <code>null</code> if not set differently before.
     * @param {string} sURL (optional)
     *   The request URL.  If not provided, this value defaults to that of the
     *   <code>URL</code> property, which is the empty string if not set
     *   different previously.
     * @param {string} sMethod (optional)
     *   The request method.  If not provided, this value defaults to that of
     *   the <code>HTTPRequest.method.GET</code> property, which is "GET".
     * @param {boolean} bAsync (optional)
     *   The request is asynchronous if <code>true</code> is passed, synchronous
     *   if <code>false</code> is passed.  If not provided, this value defaults
     *   to that of the <code>async</code> property, which is <code>true</code>
     *   if not set different previously.
     * @return {boolean}
     *   <code>true</code> (async) or what was returned by the success
     *   listener (sync) if the XHR object could be created and
     *   <code>IXMLHTTPRequest::send()</code> was successful;
     *   <code>false</code> otherwise.  Note that for asynchronous handling
     *   "successful" does not imply that the server has actually received
     *   the message, and responded with an OK status code; only that the
     *   method could be called successfully.
     */
    function _send (sData, sURL, sMethod, bAsync)
    {
      var
        C = this.constructor,
        x = this._getXHR();

      if (!x || !_isMethod(x, "open"))
      {
        return false;
      }

      /* Assume everything goes smoothly from here */
      var result = true;

      if (arguments.length < 1)
      {
        sData = this.data;
      }

      if (arguments.length < 2)
      {
        sURL = this.URL;
      }

      if (arguments.length < 3)
      {
        sMethod = this.method;
      }

      sMethod = sMethod.toUpperCase();

      var bGET = (sMethod == C.method.GET);

      bAsync = (arguments.length > 3) ? !!bAsync : this.async;

      x.open(
        sMethod,
        sURL
          + ((bGET && (sData || !this.useCache))
              ? (!/[?&]$/.test(sURL)
                  ? (sURL.indexOf("?") < 0 ? "?" : "&")
                  : "")
                + sData
                + (!this.useCache
                  ? (sData ? "&" : "")
                    + "timestamp=" + (new Date()).getTime()
                    : "")
              : ""),
        bAsync);

      var me = this;

      if (_isMethod(x, "setRequestHeader"))
      {
        /* NOTE: Failure to call this method is _not_ considered a fatal error. */
        jsx.tryThis(
          function () {
            x.setRequestHeader("Content-Type", me.requestType);

            if (!me.useCache)
            {
              me.setRequestHeaders({
                "If-Modified-Since": (new Date(0)).toUTCString()
              });
            }

            var requestHeaders = me.requestHeaders;
            var names = jsx.object.getKeys(requestHeaders);
            for (var i = 0, len = names.length; i < len; ++i)
            {
              var name = names[i];
              x.setRequestHeader(name, requestHeaders[name]);
            }
          }
        );
      }

      this._handledSuccess = this._handledError = false;

      if (bAsync)
      {
        if (typeof x.onload != "undefined")
        {
          x.onload = function (response) {
            if (!me._handledSuccess)
            {
              return me.successListener(response);
            }
          };
        }

        if (typeof x.onerror != "undefined")
        {
          x.onerror = function (response) {
            if (!me._handledError)
            {
              return me.errorListener(response);
            }
          };
        }

        x.onreadystatechange = (function (x2) {
          function _onReadyStateChange ()
          {
            if (_isMethod(me._responseListener))
            {
              me._responseListener(x2);
            }
          }

          return _onReadyStateChange;
        }(x));
      }

      jsx.tryThis(
        function () { x.send(bGET ? null : (sData || me.data)); },
        function () { result = false; me.errorListener(x); });

      if (!bAsync)
      {
        if (_isMethod(this._responseListener))
        {
          result = this._responseListener(x);
        }

        /* Handle stopped servers */
  //      jsx.tryThis(
  //        function () {
  //          if (C.status.OK_EXPR.test(x.status)) {
  //            result = true;
  //          }
  //        }
  //      );

        /* TODO: Is this error-prone? */
  //      x = null;
      }

      return result;
    }

    return _send;
  }())
};

/**
 * Creates a new HTTPResponseListener object.
 *
 * A HTTPResponseListener object is a specialized Function object
 * that takes an IXMLHttpRequest object <var>x</var> as its only
 * argument.  This method is a factory to create such an object.
 *
 * Recommended usage:
 * <pre><code>
 * var f = jsx.net.http.ResponseListener(
 *     'statement;',
 *   + 'statement;'
 * );
 * </code></pre>
 *
 * @param sCode
 * @return Function
 * @constructor
 */
jsx.net.http.ResponseListener = function (sCode) {
  var
    Request = jsx.net.http.Request,
    oStatus = Request.status;

  return (sCode
    ? Function("x", String(sCode))
    : /**
       * @param {XMLHttpRequest} x
       */
      function (x) {
        if (x.readyState === Request.readyState.COMPLETED)
        {
          var reqStatus = x.status;
          if (oStatus.OK_EXPR.test(reqStatus))
          {
            if (typeof this.successListener == "function"
                && !this._handledSuccess)
            {
              this._handledSuccess = true;
              return this.successListener(x);
            }
          }
          else if (oStatus.FAILED_EXPR.test(reqStatus))
          {
            if (typeof this.errorListener == "function"
                && !this._handledError)
            {
              this._handledError = true;
              this.errorListener(x);
            }
          }
        }
      });
};

/* Usage: */
// var x = new HTTPRequest("", HTTPRequest.method.GET, true, processResponse);
/* ... */
// x.send();