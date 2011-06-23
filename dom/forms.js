/**
 * <title>PointedEars' DOM Library: Forms</title>
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
 * Sets the <code>value</code> property of an <code>HTMLInputElement</code>
 * object, and its <code>title</code> property accordingly if specified.
 *
 * @author
 *   (C) 2004  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oInput : HTMLInputElement
 *   Required.  Reference to an HTMLInputElement object.
 * @param sValue : string
 *   New value of the <code>value</code> property of the
 *   HTMLInputElement object.
 * @param bSetTitle : optional boolean = false
 *   Specifies if the <code>title</code> property should be set to
 *   the same value as the <code>value</code> property.  The default
 *   is <code>false</code>.
 * @return boolean
 *   If <var>bSetTitle</var> evaluates to <code>false</code>
 *   or omitted:
 *
 *   <code>true</code> if the <code>value</code> property could be set
 *   properly, <code>false</code> otherwise.
 *
 *   If <var>bSetTitle</var> is <code>true</code>:
 *
 *   <code>true</code> if <em>both</em> the <code>value</code> and
 *   <code>title</code> properties could be set properly,
 *   <code>false</code> otherwise.
 */
jsx.dom.setValue = function(oInput, sValue, bSetTitle) {
  if (oInput && typeof oInput.value != "undefined")
  {
    oInput.value = sValue;
    if (bSetTitle && typeof oInput.title != "undefined")
    {
      oInput.title = sValue;
      return (oInput.value == sValue && oInput.title == sValue);
    }
    return (oInput.value == sValue);
  }

  return false;
};

/**
 * Retrieves the checked radio button of a radio button group.
 *
 * @author
 *   Copyright (C) 2004, 2007  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oForm : HTMLFormElement
 *   Required. Reference to an HTMLFormElement object to contain
 *   the radio button group.
 * @param sGroup : string
 *   Name of the radio button group from which the
 *   checked radio button should be retrieved.
 * @return object|boolean|HTMLInputElement
 *   <code>null</code> if <var>oForm</var> is invalid or there is no such
 *   <var>sGroup</var>;
 *   <code>false</code> if no radio button of <var>sGroup</var> is checked;
 *   a reference to the checked radio button otherwise
 */
jsx.dom.getCheckedRadio = function(oForm, sGroup) {
  var result = null, e, ig;
  if (oForm && (e = oForm.elements) && (ig = e[sGroup]))
  {
    result = false;
    for (var i = ig.length; i--;)
    {
      if (ig[i].checked)
      {
        result = ig[i];
        break;
      }
    }
  }

  return result;
};

/**
 * Removes all options from a HTMLSelectElement object.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oSelect : HTMLSelectElement
 *   Reference to a HTMLSelectElement object.
 * @param bAllowReload : boolean
 *   If <code>true</code>, reloads the document.
 * @return boolean
 *   <code>true</code> if successful, <code>false</code>
 *   otherwise.
 */
jsx.dom.removeOptions = function(oSelect, bAllowReload) {
  if (oSelect
      && oSelect.tagName
      && oSelect.tagName.toLowerCase() == "select")
  {
    var o = oSelect.options;
    if (o && o.length > 0)
    {
      /* shortcut if "length" property is not read-only */
      o.length = 0;
      while (o.length > 0)
      {
        if (jsx.object.isMethod(o, "remove"))
        {
          o.remove(o.length - 1);
        }
        else
        {
          o[o.length - 1] = null;
          if (bAllowReload)
          {
            history.go(0);
          }
        }
      }
      return true;
    }
  }

  return false;
};

/**
 * Adds an option to an HTMLSelectElement object.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oSelect : HTMLSelectElement
 *   Required reference to an HTMLSelectElement object.
 * @param sText : string
 *   Required text of the new HTMLOptionElement object.
 * @param iPosition : optional number
 *   Optional. If supported, inserts the new option there;
 *   otherwise the option is appended as last item.
 * @param sValue : optional string
 *   Optional value of the new HTMLOptionElement object.
 * @return object
 *   A reference to the new option if successful,
 *   <code>null</code> otherwise.
 */
jsx.dom.addOption = function(oSelect, sText, iPosition, sValue) {
  if (oSelect
      && oSelect.tagName
      && typeof oSelect.tagName == "string"
      && oSelect.tagName.toLowerCase
      && oSelect.tagName.toLowerCase() == "select")
  {
    var oNew = new Option(sText);

    var o = oSelect.options;
    if (o)
    {
      if (o.add)
      {
        if (arguments.length >= 4
            && typeof oNew.value != "undefined")
        {
          oNew.value = sValue;
        }

        if (arguments.length > 2)
        {
          o.add(oNew, iPosition);
        }
        else
        {
          o.add(oNew);
        }
      }
      else
      {
        o[o.length] = oNew;
        o[o.length - 1].value =
          (arguments.length < 4
            ? ""
            : sValue);
      }

      return oNew;
    }
  }

  return null;
};

/**
 * Select a radio button depending on its value and, optionally,
 * its name.
 *
 * @author
 *   (C) 2003  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oForm : HTMLFormElement
 *   Reference to the <code>HTMLFormElement</code> object
 *   which contains the <code>HTMLInputElement</code> object.
 * @param aName : _
 *   Name of the radio button, i.e. the value of the
 *   <code>name</code> attribute of the respective
 *   <code>input</code> (X)HTML element or the value
 *   of the <code>name</code> property of the respective
 *   <code>HTMLInputElement</code> object.  Use an expression
 *   that is evaluated to <code>false</code> for the argument
 *   to be ignored.
 * @param sValue : string
 *   Value of the radio button, i.e. the value of the
 *   <code>value</code> attribute of the respective
 *   <code>input</code> (X)HTML element or the value
 *   of the <code>value</code> property of the respective
 *   <code>HTMLInputElement</code> object.
 */
jsx.dom.selectRadioBtn = function(oForm, aName, sValue) {
  for (var i = 0; i < oForm.elements.length; i++)
  {
    var curEl = oForm.elements[i];

    if (!curEl.disabled
        && curEl.type == "radio"
        && (!sName || curEl.name == sName)
        && curEl.value == sValue)
    {
      curEl.checked = true;
    }
  }
};

/**
 * Disables a form element or a collection of form elements.
 *
 * @author
 *   (C) 2003, 2010  Thomas Lahn &lt;dhtml.js@PointedEars.de&gt;
 * @partof
 *   http://pointedears.de/scripts/dhtml.js
 * @param oElementGroup : HTMLElement|HTML(Options)Collection
 *   Reference to the <code>HTMLElement</code> or to
 *   the <code>HTML(Options)Collection</code> object.
 * @param index : optional Number|String
 *   Optional number or string to specify
 *   one element within the collection.
 */
jsx.dom.disableElementGroup = function(oElementGroup, index) {
  if (oElementGroup)
  {
    if (oElementGroup[index]
        && typeof oElementGroup[index].disabled != "undefined")
    {
      oElementGroup[index].disabled = true;
    }
    else if (typeof oElementGroup.disabled != "undefined")
    {
      oElementGroup.disabled = true;
    }
  }
};

/**
 * Disables or enables form controls by name/ID.
 *
 * @param oForm : HTMLFormElement
 *   Reference to the <code>form</code> element object.
 * @params String|HTMLElement
 *   Names/IDs of the elements or references
 *   to the element objects to disable/enable.
 * @param bDisable : optional boolean
 *   If <code>false</code>, elements will be
 *   enabled, otherwise disabled.
 */
jsx.dom.disableElements = function(oForm) {
  if (oForm)
  {
    var len = arguments.length - 1, bDisable = arguments[len];
    if (bDisable && typeof bDisable == "boolean")
    {
      len = arguments.length - 2;
    }

    for (var i = 1; i < len; i++)
    {
      var a = arguments[i], o;
      if (typeof a != "object")
      {
        o = oForm.elements[a];
      }
      else
      {
        o = a;
      }

      var len2;
      if (typeof o.disabled != "undefined")
      {
        o.disabled = bDisable;
      }
      else if (typeof (len2 = o.length) != "undefined")
      {
        for (var j = len2; j--; 0)
        {
          var o2;
          if (typeof (o2 = o[j]).disabled != "undefined")
          {
            o2.disabled = bDisable;
          }
        }
      }
    }
  }
};

/**
 * @function
 */
jsx.dom.serializeForm = (function() {
  var
    rxSubmit = /(^|\s)(submit|image)(\s|$)/i,
    rxSelect = /(^|\s)(select(-one)?|undefined)(\s|$)/i,
    rxFileReset = /^\s*(file|reset)\s*$/i,
    rxObject = /^\s*object\s*$/i;
  
  /**
   * @param form : HTMLFormElement
   * @param submitButton : optional HTMLInputElement
   *   Reference to the submit button that should be successful.
   *   By default, only the first submit button is successful.
   * @return string
   *   The serialization of this form
   */
  return function(form, submitButton) {
    /**
     * @param control : HTMLSelectElement|HTMLInputElement|HTMLTextAreaElement|HTMLButtonElement
     */
    function serializeControl(control)
    {
      /* HTML 4.01: Controls that are disabled cannot be successful. */
      if (control.disabled)
      {
        return;
      }
      
      /*
       * If a form contains more than one submit button,
       * only the activated submit button is successful.
       * (here: the first one or the specified one)
       */
      var isSubmit = rxSubmit.test(control.type);
      if ((!gotSubmit && !submitButton || control != submitButton) || !isSubmit)
      {
        if (isSubmit)
        {
          gotSubmit = true;
        }
        
        /*
         * For menus, the control name is provided by a SELECT element
         * and values are provided by OPTION elements. Only selected
         * options may be successful. When no options are selected,
         * the control is not successful and neither the name nor any
         * values are submitted to the server when the form is submitted.
         */
        var m = rxSelect.exec(control.type);
        if (m)
        {
          /* select-one */
          if (m[3])
          {
            if (control.selectedIndex > -1)
            {
              /*
               * MSHTML 6 is buggy with <option>foo</option>;
               * always provide a `value' attribute!
               */
              items.add(control.name, control.options[control.selectedIndex].value);
            }
          }
          
          /* select */
          else if (m[2])
          {
            for (var i = 0, opts = control.options, len = opts && opts.length; i < len; i++)
            {
              var opt = opts[i];
              if (opt.selected)
              {
                /*
                 * MSHTML 6 is buggy with <option>foo</option>;
                 * always provide a `value' attribute!
                 */
                items.add(control.name, opt.value);
              }
            }
          }
        }
        
        /*
         * All "on" checkboxes may be successful.
         * For radio buttons that share the same value of the
         * name attribute, only the "on" radio button may be successful.
         */
        else if (!rxFileReset.test(control.type)
                  && !(rxObject.test(control.tagName) && control.declare)
                  && !/^\s*(checkbox|radio)\s*$/i.test(control.type)
                  || control.checked)
        {
          items.add(control.name, control.value);
        }
      }
    }
        
    var es = getFeature(form, "elements");
    if (!es)
    {
      return "";
    }

    var items = [];
    
    items.add = function(sName, sValue) {
      var s = esc(sName) + "=" + esc(sValue);
      this.push(s);
    };
    
    if (!jsx.object.isMethod(items, "push"))
    {
      items.push = function() {
        for (var i = 0, len = arguments.length; i < len; i++)
        {
          this[this.length] = arguments[i];
        }
      };
    }
    
    var gotSubmit = false;

    for (var i = 0, len = es.length; i < len; i++)
    {
      var e = es[i];
      
      /*
       * Elements with the same name create a NodeList object,
       * however options of select objects are also indexable in Gecko.
       */
      if (typeof e[0] != "undefined" && typeof e.options == "undefined")
      {
        for (var j = 0, len2 = e.length; j < len2; j++)
        {
          serializeControl(e[j]);
        }
      }
      else
      {
        serializeControl(e);
      }
    }
    
    return items.join("&");
  };
})();