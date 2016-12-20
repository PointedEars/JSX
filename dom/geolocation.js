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
 * @type jsx.dom.geolocation
 */
jsx.dom.geolocation = {
  /**
   * Character used to separate a number from a unit of length.
   *
   * The default is U+2009 THIN SPACE.
   */
  TEXT_THIN_SPACE: "\u2009",

  TEXT_LATITUDE: "Latitude",

  /**
   * Abbreviation used for latitudes at the equator or in the
   * Northern hemisphere
   */
  TEXT_NORTH_ABBR: "N",

  /**
   * Abbreviation used for latitudes in the Southern hemisphere.
   */
  TEXT_SOUTH_ABBR: "S",

  TEXT_LONGITUDE: "Longitude",

  /**
   * Abbreviation used for longitudes at or west of
   * the IERS Reference Meridian.
   */
  TEXT_WEST_ABBR: "W",

  /**
   * Abbreviation used for longitudes east of
   * the IERS Reference Meridian.
   */
  TEXT_EAST_ABBR: "E",
  TEXT_LAT_LNG_ACCURACY: "Lat/Lng Accuracy",
  TEXT_ALTITUDE: "Altitude",

  /**
   * Text to use for altitude accuracy
   */
  TEXT_ALT_ACCURACY: "Alt. Accuracy",

  TEXT_SPEED: "Speed",
  TEXT_HEADING: "Heading",
  TEXT_NOT_AVAILABLE: "N/A",

  /**
   * @return {Position}
   *   The <code>Position</code> stored in this object.
   */
  getPosition: function () {
    return this._position;
  },

  /**
   * Sets the {Position} stored in this object.
   *
   * Automatically called from {@link #runAsync()} when
   * geolocation is successful.  Can be manually called
   * to ease calling several methods of this object that
   * return human-readable string representations of that
   * <code>Position</code>.
   *
   * @param {Position} value
   * @return {jsx.dom.geolocation}
   */
  setPosition: function (value) {
    this._position = value;
    return this;
  },

  /**
   * @return {PositionError}
   *   The <code>PositionError</code> stored in this object.
   */
  getPositionError: function () {
    return this._positionError;
  },

  /**
   * Sets the {PositionError} stored in this object.
   *
   * Automatically called from {@link #runAsync()}.
   *
   * @param {PositionError} value
   * @return {jsx.dom.geolocation}
   */
  setPositionError: function (value) {
    this._positionError = value;
    return this;
  },

  /**
   * @return {PositionOptions}
   *   The <code>PositionOptions</code> stored in this object.
   */
  getPositionOptions: function () {
    return this._positionOptions;
  },

  /**
   * Sets the {PositionOptions} stored in this object.
   *
   * Automatically called from {@link #runAsync()}.
   *
   * @param {PositionOptions} value
   * @return {jsx.dom.geolocation}
   */
  setPositionOptions: function (value) {
    this._positionOptions = value;
    return this;
  },

  /**
   * @return {boolean}
   *   <code>true</code> if geolocation is available,
   *   <code>false</code> otherwise.
   */
  isAvailable: function () {
    return jsx.object.isHostMethod(navigator, "geolocation", "getCurrentPosition");
  },

  /**
   * Runs geolocation asynchronously.
   *
   * @param {Callable} successCallback
   *   Called when geolocation was completed
   * @param {Callable} errorCallback
   *   Called when geolocation was unsuccessful
   * @param {PositionOptions} options
   *   Options for the Geolocation API
   * @return {boolean}
   *   <code>true</code> if geolocation is supported,
   *   <code>false</code> otherwise.
   */
  runAsync: function (successCallback, errorCallback, options) {
    if (!this.isAvailable()) return false;
    if (!options && options !== null) options = null;

    this.setPositionOptions(options);

    var me = this;
    navigator.geolocation.getCurrentPosition(
      function (position) {
        me.setPosition(position);
        me.setPositionError(null);
        me = null;
        successCallback(position);
      },
      function (positionError) {
        me.setPositionError(positionError);
        me = null;
        if (typeof errorCallback =="function") errorCallback(positionError);
      },
      options
    );

    return true;
  },

  /**
   * Sets the texts used for human-readable string representations
   * of a {Position} as returned by methods of this object.
   *
   * @param {Object} texts
   *   Object whose keys identify the keys of this object to be
   *   set.  Usually an external i18n provider would define the
   *   values.
   * @return {jsx.dom.geolocation}
   */
  setTexts: function (texts) {
    var keys = jsx.object.getKeys(texts);
    for (var i = 0, len = keys.length; i < len; ++i)
    {
      var key = keys[i];
      if (typeof this[key] == "string")
      {
        this[key] = texts[key];
      }
    }

    return this;
  },

  /**
   * Returns the string representation of a {Position}'s latitude
   * in human-readable form.
   *
   * @param {Position} position = this.getPosition()
   * @return {string}
   */
  getLatitudeString: function (position) {
    if (!position)
    {
      position = this.getPosition();
    }

    var latitude = position.coords.latitude;
    return (latitude != null
      ? Math.abs(latitude) + "°\xA0"
        + (latitude < 0 ? this.TEXT_SOUTH_ABBR : this.TEXT_NORTH_ABBR)
      : this.TEXT_NOT_AVAILABLE);
  },

  /**
   * Returns the string representation of a {Position}'s longitude
   * in human-readable form.
   *
   * @param {Position} position = this.getPosition()
   * @return {string}
   */
  getLongitudeString: function (position) {
    if (!position)
    {
      position = this.getPosition();
    }

    var longitude = position.coords.longitude;
      return (longitude != null
        ? Math.abs(longitude) + "°\xA0"
          + (longitude < 0 ? this.TEXT_WEST_ABBR : this.TEXT_EAST_ABBR)
        : this.TEXT_NOT_AVAILABLE);
  },

  /**
   * Returns the string representation of a {Position}'s
   * latitude/longitude accuracy in human-readable form.
   *
   * @param {Position} position = this.getPosition()
   * @return {string}
   */
  getLatLngAccuracyString: function (position) {
    if (!position)
    {
      position = this.getPosition();
    }

    return position.coords.accuracy + this.TEXT_THIN_SPACE + "m";
  },

  /**
   * Returns the string representation of a {Position}'s altitude
   * in human-readable form.
   *
   * @param {Position} position = this.getPosition()
   * @return {string}
   */
  getAltitudeString: function (position) {
    if (!position)
    {
      position = this.getPosition();
    }

    var altitude = position.coords.altitude;
    return (altitude != null
      ? altitude + this.TEXT_THIN_SPACE + "m"
      : this.TEXT_NOT_AVAILABLE);
  },

  /**
   * Returns the string representation of a {Position}'s altitude
   * accuracy in human-readable form.
   *
   * @param {Position} position = this.getPosition()
   * @return {string}
   */
  getAltAccuracyString: function (position) {
    if (!position)
    {
      position = this.getPosition();
    }

    var altitudeAccuracy = position.coords.altitudeAccuracy;
    return (altitudeAccuracy != null
      ? altitudeAccuracy + this.TEXT_THIN_SPACE + "m"
      : this.TEXT_NOT_AVAILABLE);
  },

  /**
   * Returns the string representation of a {Position}'s speed
   * in human-readable form.
   *
   * @param {Position} position = this.getPosition()
   * @return {string}
   */
  getSpeedString: function (position) {
    if (!position)
    {
      position = this.getPosition();
    }

    var speed = position.coords.speed;
    return (speed != null && !isNaN(speed)
      ? speed + " m/s"
      : this.TEXT_NOT_AVAILABLE);
  },

  /**
   * Returns the string representation of a {Position}'s heading
   * in human-readable form.
   *
   * @param {Position} position = this.getPosition()
   * @return {string}
   */
  getHeadingString: function (position) {
    if (!position)
    {
      position = this.getPosition();
    }

    var heading = position.coords.heading;
    return (heading != null && !isNaN(heading)
      ? heading + "°"
      : this.TEXT_NOT_AVAILABLE);
  },

  /**
   * Returns the string representation of a {Position} in
   * human-readable form.
   *
   * @param {Position} position = this.getPosition()
   * @return {string}
   */
  getText: function (position) {
    return [
      this.TEXT_LATITUDE + ": " + this.getLatitudeString(position),
      this.TEXT_LONGITUDE + ": " + this.getLongitudeString(position),
      this.TEXT_LAT_LNG_ACCURACY + ": " + this.getLatLngAccuracyString(position),
      this.TEXT_ALTITUDE + ": " + this.getAltitudeString(position),
      this.TEXT_ALT_ACCURACY + ": " + this.getAltAccuracyString(position),
      this.TEXT_SPEED + ": " + this.getSpeedString(position),
      this.TEXT_HEADING + ": " + this.getHeadingString(position)
    ].join("\n");
  }
};
