/**
 * <title>PointedEars' DOM Library: Events</title>
 * @version $Id$
 * @requires dom.js
 *
 * @section Copyright & Disclaimer
 *
 * @author
 *   (C) 2004-2011 Thomas Lahn <js@PointedEars.de>
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

if (typeof jsx.dom == "undefined")
{
  jsx.dom = {};
}

/**
 * Adds an event-handling function (event listener) for a
 * DOM object as event target.  The following methods are
 * used (in order of preference):
 *
 * <ul>
 *   <li>addEventListener(...) method (W3C-DOM Level 2 Events)</li>
 *   <li>Assignment to event-handling property (MSIE 4+ and others)</li>
 * </ul>
 *
 * The attachEvent(...) method (proprietary to MSIE 5+) is not
 * used anymore because of the arbitrary execution order of
 * event listeners attached with it and because of `this' in
 * the event listener not referring to the event target then.
 *
 * @author
 *   (C) 2004-2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   <a href="http://pointedears.de/scripts/dhtml.js">dhtml.js</a>
 * @param oNode : Object
 *   Reference to the DOM object.
 * @param sEvent : string
 *   Required string to be used as event identifier.
 *   If the addEventListener(...) method is not available,
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @param fListener : Function
 *   Reference to the Function object that provides
 *   event-handling code.  Use <code>null</code> to
 *   detach the event listener if, and only if, the
 *   proprietary event handler property is available.
 * @return Object
 *   A reference to the added listener on success,
 *   <code>null</code> otherwise.
 *   Since addEventListener(...) returns no value and throws
 *   no exceptions (what a bad design!), it is considered to be
 *   successful always, while the new value of the proprietary
 *   event-handling property must match the assigned value for
 *   the method to be successful.
 * @see <a href="http://www.quirksmode.org/blog/archives/2005/08/addevent_consid.html">QuirksBlog: addEvent() considered harmful (2005-08 CE)</a>
 * @see <a href="dom2-events#Events-EventTarget-addEventListener">W3C DOM Level 2 Events: EventTarget::addEventListener</a>
 * @see <a href="msdn#workshop/author/dhtml/reference/methods/attachevent.asp">MSDN Library: attachEvent()</a>
 */
jsx.dom.addEventListener = function(oNode, sEvent, fListener) {
  var
    jsx_object = jsx.object,
    result = false,
    sHandler = "on" + sEvent;

  if (oNode && sEvent && jsx_object.isMethod(fListener))
  {
    if (jsx_object.isMethod(oNode, "addEventListener"))
    {
      oNode.addEventListener(sEvent, fListener, false);
      result = fListener;
    }
    else
    {
      /*
       * NOTE:
       * No more bogus feature tests here; MSHTML yields `null' for unset
       * listeners, Gecko yields `undefined'.
       * 
       * We also don't attempt to use MSHTML's buggy attachEvent() anymore;
       * thanks to Peter-Paul Koch for insight:
       * http://www.quirksmode.org/blog/archives/2005/08/addevent_consid.html
       */

      var oldListener = oNode[sHandler];

      if (!oldListener || typeof oldListener._listeners == "undefined")
      {
        var newListener = function(e) {
          if (!e)
          {
            e = (typeof window != "undefined" && window
                 && typeof window.event != "undefined"
                 && window.event);
          }

          var
            listeners = arguments.callee._listeners,
            fpCall = Function.prototype.call;

          for (var i = 0, len = listeners.length; i < len; i++)
          {
            /* May be undefined because _replaceEventListener() was applied */
            if (jsx_object.isMethod(listeners[i]))
            {
              /* Host object's methods need not implement call() */
              fpCall.call(listeners[i], this, e);
            }
          }
        };

        newListener._listeners = [];

        if (oldListener)
        {
          /* Avoid dependencies, so no Array.prototype.push() call */
          listeners = newListener._listeners;
          listeners[listeners.length] = oldListener;
        }

        oldListener = newListener;
      }

      listeners = oldListener._listeners;
      listeners[listeners.length] = fListener;

      /* TODO: Why this way? */
      oNode[sHandler] = oldListener;

      result = (oNode[sHandler] == oldListener) && oldListener || null;
    }
  }

  return result;
};

/**
 * Adds a capturing event-handling function (event listener) for
 * a DOM object as event target.  Capturing means that the event
 * target receives the event before all other targets, before
 * event bubbling.  The following methods are used (in order of
 * preference):
 * 
 * <ul>
 *   <li>addEventListener(...) method (W3C DOM Level 2 Events)</li>
 *   <li>TODO: captureEvent(...) method (NS 4)</li>
 * </ul>
 * 
 * @author
 *   (C) 2007-2010 Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oNode : Node
 *   Reference to the DOM object.
 * @param sEvent : string
 *   Required string to be used as event identifier.
 *   If the addEventListener(...) method is not available,
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @param fListener : Function
 *   Reference to the Function object that provides
 *   event-handling code.  Use <code>null</code> to
 *   remove the event handler if, and only if, the
 *   proprietary event-handling property is available.
 * @return boolean
 *   <code>true</code> on success, <code>false</code> otherwise.
 * @see <a href="dom2-events#Events-EventTarget-addEventListener">W3C DOM Level 2 Events: EventTarget::addEventListener()</a>
 */
jsx.dom.addEventListenerCapture = function(oNode, sEvent, fListener) {
  if (oNode && sEvent && jsx.object.isMethod(fListener))
  {
    oNode.addEventListener(sEvent, fListener, true);
    return true;
  }

  return false;
};

/**
 * Replaces the event-handling function (event listener) for a
 * DOM object as event target.  The following methods are
 * used (in order of preference):
 * 
 * <ul>
 *   <li>removeEventListener() and addEventListener(...) methods
 *   (W3C-DOM Level 2)</li>
 *   <li>Assignment to event-handling property (MSIE 4+ and others)</li>
 * </ul>
 * 
 * Note that this still relies on the existence of the proprietary
 * event-handling property that yields a reference to the (first added)
 * event listener for the respective event.
 *
 * @author
 *   (C) 2007-2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oNode : Node
 *   Reference to the DOM object.
 * @param sEvent : string
 *   Required string to be used as event identifier.
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @param fListener : Function
 *   Reference to the Function object that provides
 *   event-handling code.  Use <code>null</code> to
 *   remove the event handler if, and only if, the
 *   proprietary event-handling property is available.
 * @param bUseCapture : optional boolean
 *   Optional. If <code>true</code>, the argument indicates that
 *   the user wishes to initiate capture.  Corresponds to the
 *   third parameter of the addEventListener(...) method, is
 *   ignored if that method is not supported by the DOM (object).
 * @return boolean
 *   <code>true</code> on success, <code>false</code> otherwise.
 *   Since addEventListener(...) returns no value and throws
 *   no exceptions, it is considered to be
 *   successful always, while the new value of the proprietary
 *   event-handling property must match the assigned value for
 *   the method to be successful.
 * @see <a href="dom2-events#Events-EventTarget-removeEventListener">W3C DOM Level 2 Events: EventTarget::removeEventListener()</a>
 * @see <a href="dom2-events#Events-EventTarget-addEventListener">W3C DOM Level 2 Events: EventTarget::addEventListener()</a>
 */
jsx.dom.replaceEventListener = function(oNode, sEvent, fListener, bUseCapture) {
  var
    jsx_object = jsx.object,
    result = false,
    sHandler = "on" + sEvent;

  if (oNode && sEvent && jsx_object.isMethod(fListener))
  {
    if (jsx_object.areMethods(oNode, ["removeEventListener", "addEventListener"]))
    {
      if (jsx_object.isMethod(oNode[sHandler]))
      {
        var fOldListener = oNode[sHandler];
        oNode.removeEventListener(sEvent, fOldListener, !!bUseCapture);
      }

      oNode.addEventListener(sEvent, fListener, !!bUseCapture);
      result = true;
    }
    else
    {
      oNode[sHandler] = fListener;
      result = (oNode[sHandler] == fListener);
    }
  }

  return result;
};

/**
 * Removes an event-handling function (event listener) for a
 * DOM object as event target.
 * <ul>
 *   <li>removeEventListener() and addEventListener(...) methods
 *   (W3C-DOM Level 2)</li>
 *   <li>Assignment to event-handling property (MSIE 4+ and others)</li>
 * </ul>
 * 
 * Note that this still relies on the existence of the proprietary
 * event-handling property that yields a reference to the (first added)
 * event listener for the respective event.
 *
 * @author
 *   (C) 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @param oNode : Node
 *   Reference to the DOM object.
 * @param sEvent : string
 *   Required string to be used as event identifier.
 *   `on' is used as its prefix to reference the respective
 *   proprietary event-handling property.
 * @param fListener : Function
 *   Reference to the Function object that provides
 *   event-handling code.  Is ignored to (re)set the
 *   proprietary event-handling property if available.
 * @param bUseCapture : optional boolean
 *   Optional. If <code>true</code>, the argument indicates that
 *   the user wished to initiate capture.  Corresponds to the
 *   third parameter of the removeEventListener(...) method, is
 *   ignored if that method is not supported by the DOM (object).
 * @return boolean
 *   <code>true</code> on success, <code>false</code> otherwise.
 *   Since removeEventListener(...) returns no value and throws
 *   no exceptions (what a bad design!), it is considered to be
 *   successful always, while attachEvent(...) returns success
 *   or failure, and the new value of the proprietary
 *   event-handling property must be <code>null</code> for
 *   the method to be successful.
 * @see <a href="dom2-events#Events-EventTarget-removeEventListener">W3C DOM Level 2 Events: EventTarget::removeEventListener()</a>
 * @see <a href="msdn#workshop/author/dhtml/reference/methods/detachevent.asp">MSDN Library: detachEvent()</a>
 */
jsx.dom.removeEventListener = function(oNode, sEvent, fListener, bUseCapture) {
  var
    result = false,
    jsx_object = jsx.object,
    sHandler = "on" + sEvent;

  if (oNode && sEvent)
  {
    if (jsx_object.isMethod(fListener))
    {
      if (jsx_object.isMethod(oNode, "removeEventListener"))
      {
        oNode.removeEventListener(sEvent, fListener, bUseCapture);
        return true;
      }
    }

    if (jsx_object.isMethod(oNode, sHandler))
    {
      var
        handler = oNode[sHandler],
        listeners = handler._listeners;
      
      if (listeners)
      {
        for (var i = listeners.length; i--;)
        {
          if (listeners[i] == fListener)
          {
            delete listeners[i];
            result = (typeof listeners[i] == "undefined");
          }
        }
      }
      else
      {
        handler = oNode[sHandler] = null;
        result = (handler == null);
      }
    }
  }

  return result;
};

/**
 * Returns a reference to a <code>Function</code> that can be used as event listener.
 * Differences between DOM implementations are smoothed out as much as
 * possible (e.g., the first argument of that function will be a reference
 * to the <code>Event</code> instance regardless if the DOM implementation passes it,
 * and you can use the <code>target</code> property even if
 * the DOM implementation supports <code>srcElement</code> instead.)
 * 
 * @param f : Callable
 *   Reference to the object that contains the actual listener code
 * @return Function
 *   A reference to a <code>Function</code> that can be used as event listener.
 */
jsx.dom.createEventListener = function(f) {
  var jsx_object = jsx.object;
  
  function listener(e)
  {
    if (typeof e == "undefined"
      && typeof window != "undefined"
      && typeof window.event != "undefined"
      && window.event)
    {
      e = window.event;
    }

    /*
     * NOTE: Should not augment host objects, and cannot inherit from Events,
     * so values need to be copied
     */
    var e2 = {originalEvent: e};
    var properties = ["type", "charCode", "keyCode",
                      "shiftKey", "ctrlKey", "altKey", "metaKey"];
    for (var i = properties.length; i--;)
    {
      var property = properties[i];
      e2[property] = e[property];
    }
    
    /* FIXME: addProperties() does not work well with host objects */
    e2.getProperty = function(p) {
      return e[p];
    };

    e2.target = (typeof e.target != "undefined")
              ? e.target
              : (typeof e.srcElement != "undefined")
                  ? e.srcElement
                  : null,
  
    e2.stopPropagation = (function(e) {
      if (jsx_object.isMethod(e, "stopPropagation"))
      {
        return function() {
          e.stopPropagation();
        };
      }
      else if (typeof e.cancelBubble != "undefined")
      {
        return function() {
          e.cancelBubble = true;
        };
      }
    })(e);

    e2.preventDefault = (function(e) {
      if (jsx_object.isMethod(e, "preventDefault"))
      {
        return function() {
          return e.preventDefault();
        };
      }
      else if (typeof e.returnValue != "undefined")
      {
        return function() {
          e.returnValue = false;
        };
      }
    })(e);
    
    e2.initEvent = (function() {
      if (jsx_object.isMethod(e, "initEvent"))
      {
        return function(eventTypeArg, canBubbleArg, cancelableArg) {
          return e.initEvent(eventTypeArg, canBubbleArg, cancelableArg);
        };
      }

      return function() {};
    })();

    return f(e2);
  }
  
  /* Strict W3C DOM Level 2 Events compatibility */
  listener.handleEvent = function(e) {
    return this(e);
  };
  
  return listener;
};

/**
 * Prevents the default action for an event.
 * 
 * @param e : Event
 * @return boolean
 *   <code>true</code> if <var>e</var> is not a valid value,
 *   <code>false</code> otherwise.  The return value of this
 *   method can be used to return a value to the event-handler.
 */
jsx.dom.preventDefault = function(e) {
  if (!e)
  {
    return true;
  }
  
  if (jsx.object.isMethod(e, "preventDefault"))
  {
    e.preventDefault();
  }
    
  if (typeof e.returnValue != "undefined")
  {
    e.returnValue = false;
  }
  
  return false;
};