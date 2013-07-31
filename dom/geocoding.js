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
   * @type jsx.dom.geocoding.Geocoder
   * @memberOf __jsx.dom.geocoding.Geocoder
   */
  Geocoder: (/** @constructor */ function () {
  }).extend(null, {
    /**
     * @memberOf jsx.dom.geocoding.Geocoder#prototype
     * @param {GeocoderRequest} request
     * @param {Callable(Array[<GeocoderResult>], GeocoderStatus)} callback
     */
    geocode: function (request, callback) {

    }
  }),

  /**
   * @type jsx.dom.geocoding.GeocodingInput
   * @memberOf __jsx.dom.geocoding.GeocodingInput
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
      var keys = jsx.object.getKeys(this);
      for (var i = keys.length; i--;)
      {
        var key = keys[i];
        if (typeof this[key] != "function")
        {
          this[key] = source[key];
        }
      }
    }
  },

  /**
   * @type jsx.dom.geocoding.GeocodeOptions
   * @memberOf __jsx.dom.geocoding.GeocodeOptions
   * @constructor
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

    /**
     * @param {Geocoder} geocoder
     * @param {Array[GeocodingInput]} data
     * @param {GeocodingOptions} options
     * @param {int} start = 0
     *   Start index
     * @return {boolean}
     */
    return function _geocode (geocoder, data, options, index) {
      if (!options)
      {
        options = {};
      }

      if (!index)
      {
        index = 0;
      }

      var location = data[index];

      var GeocoderStatus = jsx.dom.geocoding.GeocoderStatus;
      if (options.statusPropertySource)
      {
        GeocoderStatus.setProperties(options.statusPropertySource);
      }

      if (typeof options.onbeforecode == "function")
      {
        options.onbeforecode(data, index);
      }

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

      jsx.info(address);

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
                if (!_runAsync && !haveWarned)
                {
                  jsx.warn(
                    "You should provide jsx.dom.timeout.runAsync"
                    + "in order to avoid server hammering");
                  haveWarned = true;
                }

                (_runAsync || function (f) { f(); })(function () {
                  _geocode(geocoder, data, options, index + 1);
                }, options.timeout || 200);
              }
              else if (typeof options.oncomplete == "function")
              {
                options.oncomplete(data);
              }
              break;

            case GeocoderStatus.ERROR:
            case GeocoderStatus.INVALID_REQUEST:
            case GeocoderStatus.OVER_QUERY_LIMIT:
            default:
              if (typeof options.onerror == "function")
              {
                options.onerror(data, index, status);
              }
              break;
          }
        }
      );

      return true;
    };
  }())
};