/**
 * @requires
 *   object.js for jsx.object#isMethod(),
 *   string.js for #esc(), #escURI()
 * 
 * @idl
 * 
 * interface HTTPResponseHandler :: Function
 * {
 *   boolean HTTPResponseHandler(IXMLHttpRequest x);
 *     // Handles the response for the HTTP request initiated with x.send()
 *     // SHOULD return a true-value if successful, a false-value otherwise
 * }
 * 
 * interface HTTPRequest
 * {
 *   attribute string requestType setter=setRequestType(string)
 *                                default=setRequestType();
 *
 *   void HTTPRequest();
 *     // URL=document.URL, method="GET", async=true, responseHandler=null,
 *     // errorHandler=null
 *
 *   void HTTPRequest(string sURL);
 *     // URL=sURL||document.URL, method="GET", async=true, responseHandler=null,
 *     // errorHandler=null
 * 
 *   void HTTPRequest(string sURL, string sMethod);
 *     // URL=sURL||document.URL, method=sMethod||"GET", async=true,
 *     // responseHandler=null, errorHandler=null
 * 
 *   void HTTPRequest(string sURL, string sMethod, boolean bAsync);
 *     // URL=sURL||document.URL, method=sMethod||"GET", async=bAsync,
 *
 *   void HTTPRequest(string sURL, string sMethod, boolean bAsync,
 *                    HTTPResponseHandler fResponseHandler);
 *     // URL=sURL||document.URL, method=sMethod||"GET", async=bAsync,
 *     // responseHandler=fResponseHandler, errorHandler=null
 * 
 *   void HTTPRequest(string sURL, string sMethod, boolean bAsync,
 *                    HTTPResponseHandler fResponseHandler,
 *                    HTTPResponseHandler fErrorHandler);
 *     // URL=sURL||document.URL, method=sMethod||"GET", async=bAsync,
 *     // responseHandler=fResponseHandler, errorHandler=fErrorHandler
 * 
 *   boolean setRequestType(string sRequestType
 *                          default="application/x-www-form-urlencoded");
 *     // requestType=sRequestType
 * 
 * }
 * 
 * @end
 */

/**
 * Creates a new HTTPRequest object when called as constructor.
 * Set up response handlers per argument (see below), or
 * {@link HTTPRequest.prototype#setResponseHandler} and
 * {@link HTTPRequest.prototype#setErrorHandler}, then call
 * {@link HTTPRequest.prototype#send} method to send the request.
 * 
 * @param sURL : optional string=document.URL
 *   Request URL.  The default is the URL of the sending resource.
 * @param sMethod : optional string=HTTPRequest.method.GET
 *   Request method.  Use the <code>HTTPRequest.method.GET</code>
 *   (default) and <code>.POST</code> properties to avoid problems
 *   caused by case mismatch, and other typos.
 * @param bAsync : optional boolean=true
 *   Pass <code>true</code> to make an asynchronous request (default),
 *   that is, a request that is processed in the background and does
 *   not interrupt user operation.
 * @param fResponseHandler : optional HTTPResponseHandler=null
 *   The function to handle the response of a successful request
 *   (default: <code>null</code>).
 * @param fErrorHandler : optional HTTPResponseHandler=null
 *   The function to handle the response of a request that failed
 *   (default: <code>null</code>).
 * @constructor
 * @return undefined
 */
function HTTPRequest(sURL, sMethod, bAsync, fResponseHandler, fErrorHandler)
{
  this.setURL(sURL);
  this.setMethod(sMethod);
  this.setAsync(bAsync);
  this.setResponseHandler(fResponseHandler);
  // this.setErrorHandler(fErrorHandler);
  this.setData();
  this.setRequestType();
}

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
      OK_EXPR: /\b(0|2\d\d)\b/,
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
  HTTPRequest);

HTTPRequest.prototype = {
  constructor: HTTPRequest,

  /**
   * Sets the <code>URL</code> property.
   * 
   * @param sURL : string
   *   If not provided or a false-value, the
   *   URL of the sending recource is set.
   * @param bDontEncode : optional boolean
   *   If <code>true</code>, do not encode the request URL
   *   (with <code>escURI()</code> or <code>escape()</code>).
   */
  setURL: function(sURL, bDontEncode) {
    if (!bDontEncode && sURL) sURL = esc(sURL);
    this.URL = (sURL || document.URL);
  },

  /**
   * Sets the <code>method</code> property.  Use the
   * <code>HTTPRequest.(GET|POST)</code> properties
   * to avoid problems with character case and typos.
   * 
   * @param sMethod : optional string
   *   If not provided or a false-value, the value
   *   of <code>HTTPRequest.GET</code> is used.
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
   * Defines the response handler method to be used for handling
   * successful requests.  A HTTPRequest object is always initialized
   * with a dummy response handler that does nothing, if you do not
   * specify one.  Once initialized, passing a reference to a non-callable
   * object as argument, throws an InvalidArgumentException.
   * 
   * @param fResponseHandler : HTTPResponseHandler
   * @throws InvalidArgumentException
   */
  setResponseHandler: function(fResponseHandler) {
    // initialization
    if (typeof this.responseHandler == "undefined")
    {
      this.responseHandler = new HTTPResponseHandler();
      return true;
    }
    else if (jsx.object.isMethod(fResponseHandler))
    {
      this.responseHandler = fResponseHandler;
      return (this.responseHandler == fResponseHandler);
    }
    else
    {
      _global.setErrorHandler();
      eval('throw new Error('
        + '"jsx:HTTPRequest::setResponseHandler: Argument is not a method");');
      _global.clearErrorHandler();
      return false;
    }
  },

  /**
   * Defines the response handler method to be used for handling
   * unsuccessful requests.
   * 
   * @param : HTTPResponseHandler
   */
   /*
  setErrorHandler: function(fErrorHandler) {
    if (typeof this.errorHandler == "undefined")
    {
      this.errorHandler = new HTTPResponseHandler();
    }
    else if (jsx.object.isMethod(fErrorHandler))
    {
      this.errorHandler = fErrorHandler;
      return (this.errorHandler == this.errorHandler);
    }
    else
    {
      _global.setErrorHandler();
      eval('throw new Error('
        + '"jsx:HTTPRequest::setErrorHandler: Argument is not a method");');
      _global.clearErrorHandler();
      return false;
    }
  },
*/
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
  resetData: function()
  {
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
  getDataFromForm: function(f, bUseFormMethod)
  {
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
   */
  send: function(sData, sURL, sMethod, bAsync) {
    var
      result = false,
      jsx_object = jsx.object,
      x = null;

    /*
     * Feature detection based on Jim Ley's XML HTTP Request tutorial
     * at <http://jibbering.com/2002/4/httprequest.html>
     */

    /*
     * IE 6+ (JScript allows for conditional compilation; an ordinary comment
     * to other script engines).  Note that IE 7 supports XMLHttpRequest() but
     * currently not for `file:' URIs, so we don't prefer that wrapper (see
     * <http://xhab.blogspot.com/2006/11/ie7-support-for-xmlhttprequest.html>).
     */
    if (jsx_object.isMethod(jsx.global, "ActiveXObject"))
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
    if (!x && jsx_object.isMethod(jsx.global, "XMLHttpRequest"))
    {
      /*
       * eval() is needed here so that this compiles in ECMAScript < 3
       * (e.g. IE 4, NS 4)
       */
      eval('try { x = new XMLHttpRequest(); } catch (e) { x = null; }');
    }
    
    /* IceBrowser */
    if (!x && typeof window != "undefined"
        && jsx_object.isMethod(window, "createRequest"))
    {
      /* see above */
      eval('try { x = window.createRequest(); } catch (e) { x = null; }');
    }
    
    if (x) //  && jsx_object.isMethod(x.open)
    {
      if (arguments.length < 2) sURL = this.URL;

      if (arguments.length < 3) sMethod = this.method;
      var bGET = (sMethod == this.constructor.method.GET);

      bAsync = (arguments.length > 3) ? !!bAsync  : this.async;
      
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

//      if (jsx_object.isMethod(x.setRequestHeader))
//      {
        // see above
        eval('try { x.setRequestHeader("Content-Type", this.requestType); }'
          + 'catch (e) {}');
//      }
      
      if (bAsync)
      {
        var me = this;
        x.onreadystatechange = function()
        {
          // alert(x.readyState);
          // alert(x.status);
          
          // console.log("readyState = %i, status = %i", x.readyState, x.status);
          // console.log(me.constructor.status.OK_EXPR);
          
//          if (x.readyState > HTTPRequest.readyState.LOADED
//              && me.constructor.status.OK_EXPR.test(x.status))
//          {
          me.responseHandler(x);
//          }
//          else
//          {
//            me.errorHandler(x);
//          }
          
          if (x.readyState == me.constructor.readyState.COMPLETED)
          {
          	x = null;
          }
        };
      }
      
      eval('try { x.send(bGET ? null : (sData || this.data)); }'
        + 'catch (e) { /*this.errorHandler();*/ }');
      
      if (!bAsync)
      {
//        if (this.constructor.status.OK_EXPR.test(x.status)
//            && jsx_object.isMethod(this.responseHandler))
//        {
        this.responseHandler(x);
          
          // Handle stopped servers
          eval('try { if (this.constructor.status.OK_EXPR.test(x.status)) {'
            + 'result = true;'
            + '} } catch {}');
//        }
//        else if (this.constructor.status.FAILED_EXPR.test(x.status)
//                  && jsx_object.isMethod(this.errorHandler))
//        {
//          this.errorHandler(x);
//        }

        x = null;
      }
    }
    
    return result;
  }
};

/**
 * A HTTPResponseHandler object is a specialized Function object
 * that takes an IXMLHttpRequest object <code>x</code>as its only
 * argument.  This method is a factory to create such an object.
 * 
 * Recommended usage:
 * <pre><code>
 * var f = HTTPResponseHandler(
 *   new Array(
 *     'statement;',
 *     'statement;'
 *   ).join(""));
 * </code></pre>
 * 
 * @param sCode
 * @return Function
 *   A new <code>HTTPResponseHandler</code> object
 */
function HTTPResponseHandler(sCode)
{
  return Function("x", sCode || "");
}

/**
 * @param x
 */
function processResponse(x)
{
  /* ... */
}

// var x = new HTTPRequest("", HTTPRequest.GET, processResponse);
/* ... */
// x.send();