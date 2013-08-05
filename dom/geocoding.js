if (typeof jsx == "undefined")
{
  /**
   * @namespace
   */
  var jsx = {};
}

if (typeof jsx.dom == "undefined")
{
  /**
   * @namespace
   */
  jsx.dom = {};
}

/**
 * @namespace
 * @type jsx.dom.geocoding
 */
jsx.dom.geocoding = {
  /**
   * @function
   */
  Geocoder: (/** @constructor */ function () {
    /* stub */
  }).extend(null, {
    /**
     * @memberOf jsx.dom.geocoding.Geocoder#prototype
     * @param {GeocoderRequest} request
     * @param {Callable(Array[GeocoderResult], GeocoderStatus)} callback
     */
    geocode: function (request, callback) {
      /* stub */
    }
  }),

  /**
   * @constructor
   * @property {string} street
   * @property {string} zip
   * @property {string} place
   * @property {string} region
   * @property {string} country
   * @property {number} latitude
   * @property {number} longitude
   */
  GeocodingInput: function (properties) {
    jsx.object.extend(this, properties);
  },

  /**
   * @namespace
   */
  GeocoderStatus: {
    /**
     * There was a problem contacting the geocoding service.
     */
    ERROR: "ERROR",

    /**
     * This GeocoderRequest was invalid.
     */
    INVALID_REQUEST: "INVALID_REQUEST",

    /**
     * The response contains a valid GeocoderResponse.
     */
    OK: "OK",

    /**
     * The client application has gone over the requests limit
     * in too short a period of time.
     */
    OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",

    /**
     * The client application is not allowed to use the geocoder.
     */
    REQUEST_DENIED: "REQUEST_DENIED",

    /**
     * A geocoding request could not be processed due to a
     * server error.  The request may succeed if you try again.
     */
    UNKNOWN_ERROR: "UNKNOWN_ERROR",

    /**
     * No result was found for this GeocoderRequest.
     */
    ZERO_RESULTS: "ZERO_RESULTS",

    setProperties: function (source) {
      var _hasOwnProperty = jsx.object._hasOwnProperty;
      var keys = jsx.object.getKeys(this);
      for (var i = keys.length; i--;)
      {
        var key = keys[i];
        if (_hasOwnProperty(this, key) && typeof this[key] != "function")
        {
          this[key] = source[key];
        }
      }
    }
  },

  /**
   * @constructor
   * @property {boolean} continueFromLast = false
   * @property {boolean} dontOverwrite = false
   * @property {Callable(Array[GeocodingInput], int)} onbeforecode = null
   * @property {Callable(Array[GeocodingInput], int)} onaftercode = null
   * @property {Callable(Array[GeocodingInput])} oncomplete = null
   * @property {Callable(Array[GeocodingInput], GeocoderStatus)} onerror = null
   * @property {int} timeout
   */
  GeocodingOptions: function (properties) {
    jsx.object.extend(this, properties);
  },

  /**
   * @function
   */
  geocode: (function () {
    var _runAsync = jsx.object.getFeature(jsx, "dom", "timeout", "runAsync");
    var haveWarned = false;
    var lastData = null;
    var lastIndex = -1;

    /**
     * @param {Geocoder} geocoder
     * @param {Array[GeocodingInput]} data
     * @param {GeocodingOptions} options
     * @param {int} index = 0
     *   Start index
     * @return {boolean}
     */
    return function _geocode (geocoder, data, options, index) {
      function runNext (quick)
      {
        if (!_runAsync && !haveWarned)
        {
          jsx.warn(
            "You should provide jsx.dom.timeout.runAsync"
            + "in order to avoid server hammering");
          haveWarned = true;
        }

        (_runAsync || function (f) { f(); })(
          function () {
            _geocode(geocoder, data, options, index + 1);
          },
          quick ? null : (options.timeout || 200)
        );
      }

      if (!options)
      {
        options = {};
      }

      if (!index)
      {
        if (data != lastData || lastIndex < 0)
        {
          index = 0;
        }
        else if (options.continueFromLast)
        {
          index = lastIndex + 1;
        }
      }

      if (index >= data.length)
      {
        return false;
      }

      lastData = data;
      lastIndex = index;

      var location = data[index];

      var street = location.street;
      var zip = location.zip;
      var place = location.place;
      var region = location.region;
      var country = location.country;
      var address = (street || "")
        + (zip ? (street ? ", " : "") + zip : "")
        + (place ? ((street && !zip) ? ", " : " ") + place : "")
        + (region ? ((street || zip || place) ? ", " : "") + region : "")
        + (country ? ((street || zip || place || region) ? ", " : "") + country : "");

      if (location.latitude !== null
          && location.longitude !== null
          && options.dontOverwrite)
      {
        jsx.info('Ignoring already geocoded "' + address + '"');
        runNext(true);
        return true;
      }

      var GeocoderStatus = jsx.dom.geocoding.GeocoderStatus;
      if (options.statusPropertySource)
      {
        GeocoderStatus.setProperties(options.statusPropertySource);
      }

      if (typeof options.onbeforecode == "function")
      {
        options.onbeforecode(data, index);
      }

      jsx.info("jsx.dom.geocoding.geocode: " + address);

      geocoder.geocode(
        {
          'address': address
        },
        function (results, status) {
          switch (status)
          {
            case GeocoderStatus.OK:
              var loc = results[0].geometry.location;
              location.latitude = String(loc.lat());
              location.longitude = String(loc.lng());

              if (typeof options.onaftercode == "function")
              {
                options.onaftercode(data, index);
              }

              if (index < data.length - 1)
              {
                runNext();
              }
              else if (typeof options.oncomplete == "function")
              {
                options.oncomplete(data);
              }
              break;

            default:
              if (typeof options.onerror == "function")
              {
                return options.onerror(data, index, status);
              }
              break;
          }
        }
      );

      return true;
    };
  }())
};