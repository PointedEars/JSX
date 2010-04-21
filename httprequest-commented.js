/**
 * @requires
 *   object.js for jsx.object#isMethod(),
 *   string.js for #esc(), #escURI()
 * 
 * @idl
 * 
 * interface HTTPResponseListener :: Function
 * {
 *   boolean HTTPResponseListener(IXMLHttpRequest x);
 *     // Handles the response for the HTTP request initiated with x.send()
 *     // SHOULD return a true-value if successful, a false-value otherwise
 * }
 * 
 * interface HTTPMethod
 * {
 *   const string GET="GET"
 *   const string POST="POST"
 * }
 * 
 * interface HTTPRequestReadyState
 * {
 *   const int COMPLETED=4
 * }
 * 
 * interface HTTPStatus {
 *   const RegExp OK_EXPR=/\b(0|2\d\d)\b/
 *   const RegExp FAILED_EXPR=/\b[45]\d\d\b/
 * }
 * 
 * interface HTTPRequest
 * {
 *   attribute string                URL
 *                                     setter=setURL(string)
 *                                     default=setURL();
 *   attribute HTTPMethod            method
 *                                     setter=setMethod(string)
 *                                     default=setMethod();
 *   attribute boolean               async
 *                                     setter=setAsync(boolean)
 *                                     default=setAsync();
 *   attribute string                data
 *                                     setter=setData(string)
 *                                     default=setData();
 *   attribute string                requestType
 *                                     setter=setRequestType(string)
 *                                     default=setRequestType();
 *   readonly attribute HTTPRequestReadyState readyState
 *   readonly attribute HTTPStatus            status
 *   attribute HTTPResponseListener   responseListener
 *   attribute HTTPResponseListener   successListener
 *   attribute HTTPResponseListener   errorListener
 *
 *   HTTPRequest HTTPRequest();
 *     // URL=document.URL, method="GET", async=true, successListener=null,
 *     // errorListener=null
 *
 *   HTTPRequest HTTPRequest(string sURL);
 *     // URL=sURL||document.URL, method="GET", async=true,
 *     // successListener=null, errorListener=null
 * 
 *   HTTPRequest HTTPRequest(string sURL, string sMethod);
 *     // URL=sURL||document.URL, method=sMethod||"GET", async=true,
 *     // successListener=null, errorListener=null
 * 
 *   HTTPRequest HTTPRequest(string sURL, string sMethod, boolean bAsync);
 *     // URL=sURL||document.URL, method=sMethod||"GET", async=bAsync,
 *
 *   HTTPRequest HTTPRequest(string sURL, string sMethod, boolean bAsync,
 *                           HTTPResponseListener fSuccessListener);
 *     // URL=sURL||document.URL, method=sMethod||"GET", async=bAsync,
 *     // successListener=fSuccessListener, errorListener=null
 * 
 *   HTTPRequest HTTPRequest(string sURL, string sMethod, boolean bAsync,
 *                           HTTPResponseListener fSuccessListener,
 *                           HTTPResponseListener fErrorListener);
 *     // URL=sURL||document.URL, method=sMethod||"GET", async=bAsync,
 *     // successListener=fSuccessListener, errorListener=fErrorListener
 * 
 *   boolean setURL(string sURL default="");
 *     // URL=sURL
 *
 *   boolean setMethod(string sMethod default="GET");
 *     // method=sMethod
 *
 *   boolean setAsync(boolean bAsync default=true);
 *     // async=bAsync
 *
 *   boolean setData(string sData default="");
 *     // data=sData
 *
 *   boolean setRequestType(string sRequestType
 *                          default="application/x-www-form-urlencoded");
 *     // requestType=sRequestType
 *
 *   boolean send(string sData, string sURL, string sMethod, boolean bAsync);
 *     // sData=null, URL=sURL||document.URL, method=sMethod||"GET",
 *     // bAsync=true
 * }
 * 
 * @end
 */

/**
 * Creates a new HTTPRequest object.
 * 
 * You can set up response listeners per argument (see below), or
 * {@link jsx.HTTPRequest.prototype#setResponseListener setResponseListener()},
 * {@link jsx.HTTPRequest.prototype#setSuccessListener setSuccessListener()},
 * and {@link jsx.HTTPRequest.prototype#setErrorListener setErrorListener()},
 * then call {@link jsx.HTTPRequest.prototype#send send()} to submit
 * the request.
 * 
 * @param sURL : optional string=document.URL
 *   Request URL.  The default is the URL of the sending resource.
 * @param sMethod : optional string=jsx.HTTPRequest.method.GET
 *   Request method.  Use the <code>jsx.HTTPRequest.method.GET</code>
 *   (default) and <code>.POST</code> properties to avoid problems
 *   caused by case mismatch, and other typos.
 * @param bAsync : optional boolean=true
 *   Pass <code>true</code> to make an asynchronous request (default),
 *   that is, a request that is processed in the background and does
 *   not interrupt user operation.
 * @param fSuccessListener : optional jsx.HTTPResponseListener=null
 *   The function to handle the response of a successful request
 *   (default: <code>null</code>).
 * @param fErrorListener : optional jsx.HTTPResponseListener=null
 *   The function to handle the response of a request that failed
 *   (default: <code>null</code>).
 * @constructor
 * @type jsx.HTTPRequest
 */

jsx.HTTPRequest = function(sURL, sMethod, bAsync, fSuccessListener, fErrorListener) {
  /* Enables factory use */
  var me = arguments.callee;
  if (this.constructor !== me)
  {
    return me.construct(arguments);
  }
  
  this.setURL(sURL, true);
  this.setMethod(sMethod);
  this.setAsync(bAsync);
  this.setSuccessListener(fSuccessListener);
  this.setErrorListener(fErrorListener);
  this.setData();
  this.setRequestType();
};

jsx.object.addProperties(
  {
    method: {
      /**
       * Use the predefined properties to avoid problems
       * caused by case mismatch and other typos.
       */
      GET: "GET",
      POST: "POST"
    },
  
    readyState: {
      UNINITIALIZED: 0,
      LOADING: 1,
      LOADED: 2,
      INTERACTIVE: 3,
      COMPLETED: 4
    },
    
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
  },
  jsx.HTTPRequest);

jsx.HTTPRequest.prototype = {
  constructor: jsx.HTTPRequest,
  
  /**
   * Cached XHR object
   * 
   * @protected
   */
  _xhr: null,
  
  /**
   * Method to be called onreadystatechange
   * 
   * @param x : XMLHttpRequest
   */
  responseListener: function(x) {
    var C = this.constructor;
  
    if (x.readyState === C.readyState.COMPLETED)
    {
      var
        jsx_object = jsx.object,
        oStatus = C.status,
        reqStatus = x.status;
      
      if (oStatus.OK_EXPR.test(reqStatus))
      {
        if (jsx_object.isMethod(this.successListener))
        {
          this.successListener(x);
        }
      }
      else if (oStatus.FAILED_EXPR.test(reqStatus))
      {
        if (jsx_object.isMethod(this.errorListener))
        {
          this.errorListener(x);
        }
      }
    }
  },
  
  /**
   * Sets the <code>URL</code> property.
   * 
   * @param sURL : string
   *   If not provided or a false-value, the
   *   URL of the sending recource is set.
   * @param bDontEncode : optional boolean
   *   If <code>true</code>, do not encode the request URI
   *   with {@link jsx.string#escURI()}.
   */
  setURL: function(sURL, bDontEncode) {
    if (!bDontEncode && sURL) sURL = escURI(sURL);
    this.URL = (sURL || document.URL);
  },

  /**
   * Sets the <code>method</code> property.  Use the
   * <code>HTTPRequest.method.(GET|POST)</code> properties
   * to avoid problems with character case and typos.
   * 
   * @param sMethod : optional string
   *   If not provided or a false-value, the value
   *   of <code>HTTPRequest.method.GET</code> is used.
   */
  setMethod: function(sMethod) {
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
   * @param bAsync : optional boolean
   *   If not provided or a true-value, the request will be asynchronous.
   */
  setAsync: function(bAsync) {
    this.async = (typeof bAsync != "undefined" ? !!bAsync : true);
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
   * @param fResponseListener : HTTPResponseListener
   * @throws jsx.InvalidArgumentError
   */
  setResponseListener: function(fResponseListener) {
    /* initialization */
    if (typeof this.responseListener == "undefined")
    {
      this.responseListener = new jsx.HTTPResponseListener();
      return true;
    }
    else if (jsx.object.isMethod(fResponseListener))
    {
      this.responseListener = fResponseListener;
      return (this.responseListener == fResponseListener);
    }
    else
    {
      jsx.throwThis("jsx.InvalidArgumentError",
        "jsx:HTTPRequest::setResponseListener: Argument is not a method");
      return false;
    }
  },

  /**
   * Defines the response Listener method to be used for handling
   * successful requests.
   * 
   * A <code>HTTPRequest</code> object is always initialized with
   * an inherited dummy success Listener that does nothing, if you
   * do not specify one.  Once initialized, passing a reference
   * to a non-callable object as argument throws an
   * {@link jsx#InvalidArgumentError InvalidArgumentError}
   * exception.
   * 
   * @param fSuccessListener : HTTPResponseListener
   * @throws jsx.InvalidArgumentError
   */
  setSuccessListener: function(fSuccessListener) {
    /* initialization */
    if (typeof this.successListener == "undefined")
    {
      this.successListener = new jsx.HTTPResponseListener();
      return true;
    }
    else if (jsx.object.isMethod(fSuccessListener))
    {
      this.successListener = fSuccessListener;
      return (this.successListener == fSuccessListener);
    }
    else
    {
      jsx.throwThis("jsx.InvalidArgumentError",
        "jsx:HTTPRequest::setResponseListener: Argument is not a method");
      return false;
    }
  },
  
  /**
   * Defines the response Listener method to be used for handling
   * unsuccessful requests.
   * 
   * A <code>HTTPRequest</code> object is always initialized with
   * an inherited dummy error Listener that does nothing, if you
   * do not specify one.  Once initialized, passing a reference
   * to a non-callable object as argument throws an
   * {@link jsx#InvalidArgumentError InvalidArgumentError}
   * exception.
   * 
   * @param fErrorListener : HTTPResponseListener
   * @throws jsx.InvalidArgumentError
   */
  setErrorListener: function(fErrorListener) {
    if (typeof this.errorListener == "undefined")
    {
      this.errorListener = new jsx.HTTPResponseListener();
      return true;
    }
    else if (jsx.object.isMethod(fErrorListener))
    {
      this.errorListener = fErrorListener;
      return (this.errorListener == this.errorListener);
    }
    else
    {
      jsx.throwThis('jsx.InvalidArgumentError',
        "jsx:HTTPRequest::setErrorListener: Argument is not a method");
      return false;
    }
  },

  /**
   * Sets the <code>data</code> property.
   * 
   * @param sData : optional string
   *   If not provided or a false-value, sets
   *   the property to the empty string.
   * @see HTTPRequest.prototype#resetData()
   */
  setData: function(sData) {
    this.data = (sData || "");
  },
    
  /**
   * Resets the <code>data</code> property to the empty string.
   * 
   * @see HTTPRequest.prototype#setData()
   */
  resetData: function() {
    this.setData();
  },

  /**
   * Retrieves the data to send in the request, and optionally the request
   * method, from an (X)HTML form.  TODO: select[multiple] elements
   * 
   * @param f : HTMLFormElement
   * @param bUseFormMethod: optional boolean
   *   If <code>true</code>, the form's request method becomes the
   *   <code>HTTPRequest</code> object's request method. The default
   *   is <code>false</code>.
   * @return boolean
   */
  getDataFromForm: function(f, bUseFormMethod) {
    var result = false, es, len;

    if (f && (es = f.elements) && (len = es.length))
    {
      if (bUseFormMethod) this.method = f.method;
      
      var aData = [];

      for (var i = 0; i < len; i++)
      {
        var o = es[i];
        if (o.name)
        {
          aData.push(esc(o.name) + "=" + esc(o.value != "" ? o.value : ""));
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
   * which is what Web browsers, although this media type is currently
   * (June 2006 CE) not registered with IANA, send as default then.
   * 
   * @param sRequestType : string
   *   <code>"application/x-www-form-urlencoded"</code>, if omitted or
   *   a false-value (like "", the empty string).
   */
  setRequestType: function(sRequestType) {
    this.requestType = sRequestType || "application/x-www-form-urlencoded";
  },

  /**
   * Returns a reference to an XML HTTP Request object.  Reuses an existing
   * object if possible (if it has processed the previous request); creates
   * a new object if necessary;
   * 
   * @protected
   * @type XMLHttpRequest|XMLHTTPRequest|Null
   * @return
   *   A reference to an XML HTTP Request object or <code>null</code>,
   *   if no such object can be created.
   */
  _getXHR: function() {
    var
      jsx_global = jsx.global,
      jsx_object = jsx.object,
      x = this._xhr;

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
    if (jsx_object.isMethod(jsx_global, "ActiveXObject"))
    {
      /*@cc_on @*/
      /*@if (@_jscript_version >= 5)
          try
          {
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
    if (!x && jsx_object.isMethod(jsx_global, "XMLHttpRequest"))
    {
      jsx.tryThis(
        function() { x = new XMLHttpRequest(); },
        function() { x = null; });
    }
    
    /* IceBrowser */
    if (!x && typeof window != "undefined"
           && jsx_object.isMethod(window, "createRequest"))
    {
      jsx.tryThis(
        function() { x = window.createRequest(); },
        function() { x = null; });
    }

    /* Update cache if unused */
    if (x && this._xhr === null) this._xhr = x;
    
    return x;
  },
  
  /**
   * Submits the HTTP request.
   * 
   * @param sData : optional string
   *   The data to form the request body.  If the request method is "GET",
   *   this argument is ignored and <code>null</code> is used instead (no body).
   *   If the request method is "POST", and this value is not provided, the
   *   value defaults to that of the <code>data</code> property, which is
   *   the empty string if not set different previously.
   * @param sURL : optional string
   *   The request URL.  If not provided, this value defaults to that of the
   *   <code>URL</code> property, which is the empty string if not set
   *   different previously.
   * @param sMethod : optional string
   *   The request method.  If not provided, this value defaults to that of
   *   the <code>HTTPRequest.method.GET</code> property, which is "GET".
   * @param bAsync : optional boolean
   *   The request is asynchronous if <code>true</code> is passed, synchronous
   *   if <code>false</code> is passed.  If not provided, this value defaults
   *   to that of the <code>async</code> property, which is <code>true</code>
   *   if not set different previously.
   * @type boolean
   * @return <code>true</code> if the XHR object could be created
   *   and <code>IXMLHTTPRequest::send()</code> was successful;
   *   <code>false</code> otherwise.  Note that "successful" does
   *   not imply that the server has actually received the message,
   *   and responded with an OK status code, only that the method
   *   could be called successfully.
   */
  send: function(sData, sURL, sMethod, bAsync) {
    var
      jsx_object = jsx.object,
      C = this.constructor,
      x = this._getXHR();

    if (!x || !jsx_object.isMethod(x, "open")) return false;
    
    /* Assume everything goes smoothly from here */
    var result = true;
    
    if (arguments.length < 1) sData = this.data;
    if (arguments.length < 2) sURL = this.URL;

    if (arguments.length < 3) sMethod = this.method;
    var bGET = (sMethod == C.method.GET);

    bAsync = (arguments.length > 3) ? !!bAsync : this.async;
    
    x.open(
      sMethod.toUpperCase(),
      sURL
        + ((bGET && sData)
            ? (!/[?&]$/.test(sURL)
                ? (sURL.indexOf("?") < 0 ? "?" : "&")
                : "")
              + sData
            : ""),
      bAsync);

    if (jsx_object.isMethod(x, "setRequestHeader"))
    {
      /* NOTE: Failure to call this method is _not_ considered a fatal error. */
      jsx.tryThis(
        function() {
          x.setRequestHeader("Content-Type", this.requestType);
        }
      );
    }
  
    if (bAsync)
    {
      var me = this;
      x.onreadystatechange = function() {
        // alert(x.readyState);
        // alert(x.status);
        
        // console.log("readyState = %i, status = %i", x.readyState, x.status);
        // console.log(C.status.OK_EXPR);
        
        if (jsx_object.isMethod(me.responseListener))
        {
          me.responseListener(x);
        }
        
        if (x.readyState == C.readyState.COMPLETED)
        {
        	x = null;
        }
      };
    }
    
    jsx.tryThis(
      function() { x.send(bGET ? null : (sData || this.data)); },
      function() { result = false; this.errorListener(x); });
    
    if (!bAsync)
    {
      if (jsx_object.isMethod(this.responseListener))
      {
        this.responseListener(x);
      }
        
      /* Handle stopped servers */
      jsx.tryThis(
        function() {
          if (C.status.OK_EXPR.test(x.status)) {
            result = true;
          }
        }
      );

      /* TODO: Is this error-prone? */
      x = null;
    }
    
    return result;
  }
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
 * var f = jsx.HTTPResponseListener(
 *   new Array(
 *     'statement;',
 *     'statement;'
 *   ).join(""));
 * </code></pre>
 * 
 * @param sCode
 * @type Function
 * @return A new <code>HTTPResponseListener</code> object
 */
jsx.HTTPResponseListener = function(sCode) {
  return Function("x", sCode || "");
};

/* Usage: */
// var x = new HTTPRequest("", HTTPRequest.method.GET, true, processResponse);
/* ... */
// x.send();