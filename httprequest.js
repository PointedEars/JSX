/**
 * @require
 *   types.js for #isMethod(),
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

function HTTPRequest(sURL, sMethod, bAsync, fResponseHandler, fErrorHandler)
{
  this.setURL(sURL);
  this.setMethod(sMethod);
  this.setAsync(bAsync);
  this.setResponseHandler(fResponseHandler);
  this.setErrorHandler(fErrorHandler);
  this.setData();
  this.setRequestType();
}

HTTPRequest.addProperties({
    method: {
      GET: "GET",
      POST: "POST"
    },
  
    readyState: {
      UNINITIALIZED: 0,
      LOADING: 1,
      LOADED: 2,
      INTERACTIVE: 3,
      COMPLETED: 4,
    },
  
    status: {
      OK_EXPR: /\b[02]\d\d\b/,
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

HTTPRequest.prototype = {
  constructor: HTTPRequest,

  /**
   * Sets the <code>URL</code> property.
   * 
   * @argument sURL: string
   *   If not provided or a false-value, the
   *   URL of the sending recource is set.
   * @argument bDontEncode: optional boolean
   *   If <code>true</code>, do not encode the request URL
   *   (with <code>escURI()</code> or <code>escape()</code>).
   */
  setURL: function(sURL, bDontEncode)
  {
    if (!bDontEncode) sURL = escURI(sURL);
    this.URL = (sURL || document.URL);
  },

  /**
   * Sets the <code>method</code> property.  Use the
   * <code>HTTPRequest.(GET|POST)</code> properties
   * to avoid problems with character case and typos.
   * 
   * @argument : optional string
   *   If not provided or a false-value, the value
   *   of <code>HTTPRequest.GET</code> is used.
   */
  setMethod: function(sMethod)
  {
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
   * @argument : optional boolean
   *   If not provided or a true-value, the request will be asynchronous.
   */
  setAsync: function(bAsync)
  {
    this.async = (typeof bAsync != "undefined" ? !!bAsync : true);
  },
  
  /**
   * Defines the response handler method to be used for handling
   * successful requests.
   * 
   * @argument : HTTPResponseHandler
   */
  setResponseHandler: function(fResponseHandler)
  {
    if (isMethod(fResponseHandler))
    {
      this.responseHandler = fResponseHandler;
      return (this.responseHandler == this.responseHandler);
    }
    else
    {
      _global.setErrorHandler();
      eval('throw new Error("Argument is not a method");');
      _global.clearErrorHandler();
      return false;
    }
  },

  /**
   * Defines the response handler method to be used for handling
   * successful requests.
   * 
   * @argument : HTTPResponseHandler
   */
  setErrorHandler: function(fErrorHandler)
  {
    if (isMethod(fErrorHandler))
    {
      this.errorHandler = fErrorHandler;
      return (this.errorHandler == this.errorHandler);
    }
    else
    {
      _global.setErrorHandler();
      eval('throw new Error("Argument is not a method");');
      _global.clearErrorHandler();
      return false;
    }
  },

  /**
   * Sets the <code>data</code> property.
   * 
   * @argument : optional string
   *   If not provided or a false-value, sets
   *   the property to the empty string.
   * @see HTTPRequest#resetData()
   */
  setData: function(sData)
  {
    this.data = (sData || "");
  },
  
  
  /**
   * Resets the <code>data</code> property to the empty string.
   * 
   * @see HTTPRequest#setData()
   */
  resetData: function()
  {
    this.setData();
  },

  /**
   * Retrieves the data to send in the request, and optionally the request
   * method, from an (X)HTML form.  TODO: select[multiple] elements
   * 
   * @argument f: HTMLFormElement
   * @argument  : optional boolean
   *   If <code>true</code>, the form's request method becomes the
   *   <code>HTTPRequest</code> object's request method. The default
   *   is <code>false</code>.
   * @type boolean
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
   * @param string sRequestType
   *   <code>"application/x-www-form-urlencoded"</code>, if omitted or
   *   a false-value (like "", the empty string)
   */
  setRequestType: function(sRequestType)
  {
    this.requestType = sRequestType || "application/x-www-form-urlencoded";
  },

  send: function(
    /** @type string  */ sData,
    /** @type string  */ sURL,
    /** @type string  */ sMethod,
    /** @type boolean */ bAsync)
  {
    var result = false, x = null;

    // Gecko, IE 7, and Opera 8.1
    if (isMethod(_global.XMLHttpRequest))
    {
      // eval() is needed here so that this compiles in ECMAScript < 3
      // (e.g. IE 4, NS 4)
      eval('try { x = new XMLHttpRequest(); } catch (e) { x = null; }');
    }
    
    // IE 6 (JScript allows for conditional compilation;
    // a ordinary comment to other script engines)
    if (!x && isMethod(_global.ActiveXObject))
    {
      /*@cc_on @*/
      /*@if (@_jscript_version >= 5)
          try
          {
            x = new ActiveXObject("Msxml2.XMLHTTP");
          }
          catch (e)
          {
            try
            {
              x = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e2)
            {
              x = null;
            }
          }
        @end @*/
    }
    
    // IceBrowser
    if (!x && isMethod(window.createRequest))
    {
      // see above
      eval('try { x = window.createRequest(); } catch (e) { x = null; }');
    }

    if (x && isMethod(x.open))
    {
      if (arguments.length < 2) sURL = this.URL;

      if (arguments.length < 3) sMethod = this.method;
      var bGET = (sMethod == this.constructor.method.GET);

      bAsync = (arguments.length > 3) ? !!bAsync  : this.async;
      
      x.open(
        sMethod,
        sURL
          + ((bGET && sData)
              ? (!/[?&]$/.test(sURL)
                  ? (sURL.indexOf("?") < 0 ? "?" : "&")
                  : "")
                + sData
              : ""),
        bAsync);

      if (isMethod(x.setRequestHeader))
      {
        // see above
        eval('try { x.setRequestHeader("Content-Type", this.requestType); }',
          + 'catch (e) {}');
      }
      
      if (bAsync)
      {
        x.onreadystatechange = function()
        {
          if (this.constructor.status.OK_EXPR.test(x.status)
              && isMethod(this.responseHandler))
          {
            this.responseHandler(x);
          }
          else if (isMethod(this.errorHandler))
          {
            this.errorHandler(x);
          }
  
          if (x.readyState == this.constructor.readyState.COMPLETED) x = null;
        }
      }

      x.send(bGET ? null : (sData || this.data));
      
      if (!bAsync)
      {
        if (this.constructor.status.OK_EXPR.test(x.status)
            && isMethod(this.responseHandler))
        {
          this.responseHandler(x);
          result = true;
        }
        else if (this.constructor.status.FAILED_EXPR.test(x.status)
                  && isMethod(this.errorHandler))
        {
          this.errorHandler(x);
        }

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
 * var f = new HTTPResponseHandler(
 *   new Array(
 *     'statement;',
 *     'statement;'
 *   ).join(""));
 * </code></pre>
 * 
 */
function HTTPResponseHandler(sCode)
{
  return Function("x", sCode);
}

function processResponse(x)
{
  // ...
}

// var x = new HTTPRequest("", HTTPRequest.GET, processResponse);
// ...
// x.send();