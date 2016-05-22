(function () {
  /*
   * Asynchronous loading of dependencies and synchronous execution
   * of dependency code:
   *
   * 1. Load dependencies and their dependencies asynchronously, thereby
   *    registering those and the code to be executed in a global data structure
   *    (jsx.require._data).
   * 2. When all dependencies and their dependencies have been loaded,
   *    determine the dependency tree, and execute the dependencies’ codes
   *    in the correct order according to that tree.
   * 3. When all dependency code has been executed, execute the code
   *    that requires the dependencies.
   */

  jsx.loadScript = function (src, type, onLoad, onError) {
    var script = document.createElement("script");
    script.type = type || "text/javascript";
    script.src = src;

    var argc = arguments.length;
    if (argc > 2)
    {
      script.onload = onLoad;
    }

    if (argc > 3)
    {
      script.onerror = onError;
    }

    (document.head || (document.getElementsByTagName("head") || [])[0] || document.body)
      .appendChild(script);
  };

  function _sortByLengthDescending (a, b)
  {
    return b.length - a.length;
  }

  jsx.require = function jsx_require (dependencies, onSuccess, onFailure, urnPrefixes, recursive) {
    /* TODO: Backwards compatibility: Implement Promise if not already implemented */
    if (typeof Promise != "function")
    {
      jsx.warn("require.js: Promise is not supported. Aborting.");
      return;
    }

    if (!urnPrefixes) urnPrefixes = jsx.urnPrefixes;

    if (typeof urnPrefixes == "object" && urnPrefixes)
    {
      var rxURNPrefix = new RegExp(
          "^("
        + Object.keys(urnPrefixes).sort(_sortByLengthDescending).join("|")
        + "):");
    }

    var modules = jsx_require._data.modules;

    if (!Array.isArray(dependencies)) dependencies = [dependencies];

    var loadPromises = [];
    dependencies.forEach(function (dependency) {
      if (!(dependency in modules))
      {
        modules[dependency] = Object.create(null);
      }

      if (modules[dependency].loaded) return;

      var loadPromise = modules[dependency].loadPromise = new Promise(function (resolve, reject) {
        var dependencyURIref = rxURNPrefix
          ? dependency.replace(rxURNPrefix, function (match, prefix) {
              return urnPrefixes[prefix];
            })
          : dependency;

        jsx.loadScript(
          dependencyURIref,
          null,
          function () {
            jsx.info(this.src + " loaded.");
            console.log("Temporary dependency data:\n", JSON.stringify(modules));

            /*
             * Load dependency’s dependencies unless they are already loaded;
             * _then_ resolve the _load_ promise
             */
            var depDependencies = modules[dependency].dependencies;
            if (depDependencies)
            {
              jsx_require(depDependencies, resolve, reject, urnPrefixes, true);
            }
          },
          function () {
            reject();
          }
        );
      });

      loadPromise
        .then(function () {
          modules[dependency].loaded = true;
        })
        /*jshint -W024*/
        .catch(function () {
        /*jshint +W024*/
          modules[dependency].loaded = false;
        });

      loadPromises.push(loadPromise);
    });

    var depList = jsx_require._data.depList;
    var depSeen = jsx_require._data.depSeen;

    Promise.all(loadPromises).then(function () {
      /* All dependencies and their dependencies have been loaded */

      /* Build list of dependencies in the correct order, skip duplicates */
      console.log("Final dependency data:\n", JSON.stringify(modules));
      dependencies.forEach(function (dependency) {
        if (!(dependency in depSeen))
        {
          /* TODO: Is this safe or do we have to track the dependency position? */
          depList.push(dependency);

          depSeen[dependency] = true;
        }
      });
      console.log("Dependencies list:", depList);

      if (!recursive)
      {
        /* Execute dependency sources in the correct order */
        depList.forEach(function (dependency) {
          var onfulfilled = modules[dependency].onfulfilled;
          if (typeof onfulfilled == "function") onfulfilled();
        });
      }

      /* Run our code */
      onSuccess();
    });

    /* TODO: Support callback for handling failed dependencies */
  };
  jsx.require._data = {
    modules: Object.create(null),
    depList: [],
    depSeen: Object.create(null)
  };

  jsx.define = function (moduleName, dependencies, onFulfilled) {
    if (!Array.isArray(dependencies))
    {
      dependencies = ((dependencies != null) ? [dependencies] : []);
    }

    jsx.require._data.modules[moduleName] = {
      dependencies: dependencies,
      onfulfilled: onFulfilled
    };
  };
}());

jsx.require("require:lib1.js", function () {
  jsx.info("Executing our code");
  console.log("jsx.lib1 =", jsx.lib1, "\njsx.lib2 =", jsx.lib2, "\njsx.lib3 = ", jsx.lib3);
});

jsx.info("require.js loaded.");
