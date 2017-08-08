/*jshint -W098*/
var jsx = (function () {
/*jshint +W098*/
  var
    _head = null,
    _body = null;

  /**
   * Loads a script resource
   *
   * Inserts a `script` element into an (X)HTML document.
   *
   * @param  {string} uri
   *   URI of the script resource
   * @param  {Object} options
   *   Properties of the referred object are considered options.
   *   Supported options include:
   *     - type:       `type` attribute of the `script` element
   *     - onerror:    `error` event listener of the `script` element
   *     - onload:     `load` event listener of the `script` element
   *     - parentNode: Element object representing the element to which
   *                   the `script` element should be appended as child element.
   * @return {boolean}
   *   <code>true</code> if all the script resource could be loaded,
   *   <code>false</code> otherwise.
   * @see #require()
   */
  function _loadScript (uri, options)
  {
    var
      publicId,
      script =
        (document.doctype
          && (publicId = document.doctype.publicId)
          && publicId.toLowerCase().indexOf("xhtml") > -1)
        ? document.createElementNS("http://www.w3.org/1999/xhtml", "script")
        : document.createElement("script");

    if (!script) return false;

    if (!options || options.type != "")
    {
      script.type = (!options || typeof options.type == "undefined"
        ? "text/javascript"
        : options.type);
    }

    if (options)
    {
      if (typeof options.onload != "undefined")
      {
        if (typeof script.onload != "undefined")
        {
          script.onload = options.onload;
        }
        else
        {
          script.addEventListener("load", options.onload, false);
        }
      }

      if (typeof options.onerror != "undefined")
      {
        if (typeof script.onerror != "undefined")
        {
          script.onerror = options.onerror;
        }
        else
        {
          script.addEventListener("error", options.onerror, false);
        }
      }
    }

    script.src = uri;

    /* NOTE: _head and _body are cached per global context; cannot access method cross-frame */
    if (!_head && !_body) _head = document.head || document.getElementsByTagName("head")[0];
    if (!_head && !_body) _body = document.body;
    if (!((options && options.parentNode) || _head || _body)) return false;

    ((options && options.parentNode) || _head || _body).appendChild(script);
    return true;
  }

  function _ModuleRegistry () {}
  Object.assign(_ModuleRegistry.prototype, {
    add: function (id, properties) {
      var module = new _Module(Object.assign(properties || Object.create(null), {id: id}));

      if (!("_items" in this)) this._items = Object.create(null);
      this._items[id] = module;

      return module;
    },

    remove: function (id) {
      return (("_items" in this) && (delete this._items[id]));
    },

    get: function (id) {
      return (("_items" in this) ? this._items[id] : null);
    },

    has: function (id) {
      return (("_items" in this) && (id in this._items));
    }
  });

  var _modules = new _ModuleRegistry();

  function _Module (properties)
  {
    properties && Object.keys(properties).forEach(function (key) {
      /* Do not override inherited methods */
      if (typeof this[key] != "function")
      {
        this[key] = properties[key];
      }
    }.bind(this));
  }

  Object.assign(_Module.prototype, {
    execute: function () {
      this.code();

      this.executed = true;

      /* If other modules depend on this module, tell them its symbols are available now */
      if (this.dependents)
      {
        Object.keys(this.dependents).forEach(function (dependent) {
          _modules.get(dependent).resolve();
        });
      }
    },
    resolve: function () {
      /* If all dependencies have been resolved, execute this module's code */
      if (this.dependencies.every(function (dependency) {
            return _modules.get(dependency).executed;
          }))
      {
        this.execute();
      }
    }
  });

  /**
   * Executes code if all specified module dependencies are resolved
   *
   * @param  {string|Array[string]} dependencies
   *   Module ID(s) or URIs
   * @param  {Function|string} dependent
   *   Function to be called, or module ID of the module to be executed
   * @return {Array[string]}
   *   List of the module IDs of failed dependencies
   */
  function _require (dependencies, dependent)
  {
    if (!Array.isArray(dependencies)) dependencies = [dependencies];

    /*
     * Allow this also to work without calling module, to _call_ dependent()
     * if dependencies are resolved.
     */
    if (typeof dependent == "function")
    {
      var uuid = "module_" + (new Date()).getTime() + "_" + Math.floor(Math.random() * 1e13);
      _modules.add(uuid, {
        dependencies: dependencies,
        loaded: true,

        code: dependent
      });
    }

    var failedDeps = [];

    dependencies.forEach(function (dependency) {
      if (!(_modules.has(dependency))) _modules.add(dependency);

      var module = _modules.get(dependency);

      /*
       * Define <var>dependent</var> to be a dependent of module <var>dependency</var>,
       * so that when <var>dependency</var> was _executed_, and all other dependencies
       * had been executed, <var>dependent</var>'s code can be and is executed, as
       * the promises have all been fulfilled.
       */
      if (!module.dependents) module.dependents = Object.create(null);
      module.dependents[uuid || dependent] = true;

      /* require only once */
      if (module.executed) return true;

      Object.assign(module, {
        loaded: false,

        executed: false
      });

      /* Resolve URNs */
      var
        uri = dependency,
        m;
      if ((m = uri.match(/^([^:]+):([^\/]|\/[^\/])/)))
      {
        var scheme = m[1];
        var prefixURI = (_require.urnPrefixes || Object.create(null))[scheme];
        if (typeof prefixURI != "undefined")
        {
          uri = uri.replace(m[0], prefixURI + m[2]);
        }
        else
        {
          jsx.warn('jsx.require.urnPrefixes["' + scheme + '"] is not defined.'
            + ' Leaving it unchanged.\nDid you mean "' + scheme + '://..."?');
        }
      }

      /* TODO: Allow not appending ".js" suffix? */
      if (uri.lastIndexOf(".js") < 0)
      {
        uri += ".js";
      }

      module.uri = uri;

      if (!_loadScript(uri)) failedDeps.push(dependency);
    });

    return failedDeps;
  }

  return {
    modules: _modules,

    loadScript: _loadScript,

    /**
     * Defines a module with dependencies
     *
     * @param  {string} id
     *   Module ID
     * @param  {Array[string]}
     *   IDs of the dependencies of this module
     * @param  {Function} code
     *   Module code
     * @return {Array[string]}
     *   List of the module IDs of failed dependencies
     * @see #require()
     */
    define: function (id, dependencies, code) {
      if (!dependencies) dependencies = [];

      if (!(_modules.has(id))) _modules.add(id);

      var module = _modules.get(id);

      Object.assign(module, {
        id: id,
        dependencies: dependencies,
        loaded: true,

        code: code
      });

      if (dependencies.length < 1)
      {
        return module.execute();
      }

      return _require(dependencies, id);
    },

    require: _require,

    ModuleRegistry: _ModuleRegistry,
    Module: _Module
  };
}());
