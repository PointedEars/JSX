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

jsx.dom.geolocation = {
  TEXT_LATITUDE: "Latitude",
  TEXT_NORTH_ABBR: "N",
  TEXT_SOUTH_ABBR: "S",
  TEXT_LONGITUDE: "Longitude",
  TEXT_WEST_ABBR: "W",
  TEXT_EAST_ABBR: "E",
  TEXT_LAT_LNG_ACCURACY: "Lat/Lng Accuracy",
  TEXT_ALTITUDE: "Altitude",
  TEXT_ALT_ACCURACY: "Alt. Accuracy",
  TEXT_SPEED: "Speed",
  TEXT_HEADING: "Heading",
  TEXT_NOT_AVAILABLE: "N/A",

  getPosition: function () {
    return this._position;
  },

  setPosition: function (value) {
    this._position = value;
  },

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

  getLatLngAccuracyString: function (position) {
    if (!position)
    {
      position = this.getPosition();
    }

    return position.coords.accuracy + "\xA0m";
  },

  getAltitudeString: function (position) {
    if (!position)
    {
      position = this.getPosition();
    }

    var altitude = position.coords.altitude;
    return (altitude != null
      ? altitude + "\xA0m"
      : this.TEXT_NOT_AVAILABLE);
  },

  getAltAccuracyString: function (pposition) {
    if (!position)
    {
      position = this.getPosition();
    }

    return (altitudeAccuracy != null
      ? altitudeAccuracy + "\xA0m"
      : this.TEXT_NOT_AVAILABLE);
  },

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