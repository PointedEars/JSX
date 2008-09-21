/**
 * @requires types.js
 */

/**
 * Wrapper for a safer <code>try</code>...<code>catch</code>. 
 * 
 * Attempts to evaluate a value as a <i>StatementList</i>, and attempts
 * to evaluate another value as a <i>StatementList</i> if an exception
 * is thrown in the process.  The argument identifiers may be used
 * in each value to refer to the used values; the <code>code</code>
 * word may be used to the refer to the entire constructed
 * <code>try</code>...<code>catch</code> string that is evaluated
 * as a <i>Program</i>. 
 * 
 * @param statements 
 *   Value to be evaluated as a <i>StatementList</i>.
 *   Called if a <code>Function</code> object reference, converted
 *   to string if not a string, and used as-is otherwise.
 *   For compatibility, the <code>undefined</code> value
 *   is evaluated like the empty string. 
 * @param errorHandlers
 *   Value to be evaluated as a <i>StatementList</i> in case of an
 *   exception.  Called if a <code>Function</code> object reference,
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
 * @partof JSX:exception.js
 */
function tryThis(statements, errorHandlers)
{
  /**
   * @param s  Value to be stringified
   * @return   Stringified version of <code>s</code>
   */
  function stringify(s)
  {
    if (typeof s == "function")
    {
      s = "(" + s + ")()";
    }
    else if (typeof s == "undefined")
    {
      s = "";
    }
    
    return s;
  }
  
  statements = stringify(statements);
  errorHandlers = stringify(errorHandlers);
  
  var code = 'try { ' + statements + ' }'
           + 'catch (e) { ' + errorHandlers + ' }';
  
  return eval(code);
}

/**
 * Throws a qualified exception, including an execution context hint
 * if provided, followed by an error message.
 *
 * @param sErrorType : string
 *   Identifier of the constructor for the error type
 * @param sMessage : string
 *   Error message to be displayed
 * @param fContext : Callable
 *   Optional callable object to specify the context
 *   where the exception occurred.
 * @author 
 *   Copyright (c) 2008 Thomas 'PointedEars' Lahn <cljs@PointedEars.de>.
 *   Distributed under the GNU GPL v3 and later.
 * @partof JSX:exception.js 
 * @see JSX:types.js:isMethodType()
 */
function throwException(sErrorType, sMessage, fContext)
{
  if (isMethodType(typeof sErrorType) && sErrorType)
  {
    sErrorType = "(" + sErrorType + ")";
  }
  
  var sContext = "";
  
  if (isMethodType(typeof fContext) && fContext)
  {
    sContext = (String(fContext).match(/^\s*(function[^)]+\))/)
                 || [0, null])[1];
  }

  var message = (sContext ? sContext + ': ' : '')
              + (sMessage ? String(sMessage).replace(/['"\\]/g, '\\$&') : '');

  var throwPrefix = '  throw new ' + sErrorType + '("' + message;
  eval(throwPrefix + '");');
/*
  eval(
      'try'
    + '{'
    // throw so that we can try obtaining a stack trace
    + throwPrefix + '");'
    + '}'
    + 'catch (e)'
    + '{'
    + '  var stack = e.stack;'
    + '  if (typeof stack == "string")'
    + '  {'
    // re-throw with stack trace if available
    + throwPrefix + '\\nStack trace:" + stack.split("\\n").reverse().slice(0, stack.length - 3).join("\\n"));'
    + '  }'
    + '  else'
    + '  {'
    + throwPrefix + '");'
    + '  }'
    + '}');
*/
}

// first variant from math.js
/*
function throwException(e)
{
  var supportsTry = false;

  _global.onerror = function()
  {
    this.onerror = null;
    return true;
  }

  eval('try { supportsTry = true; } catch (e2) {}');

  if (supportsTry)
  { 
    eval('throw e;');
    _global.onerror();
  }
}
*/