if (!this.dhtml)
{
  var dhtml = new Object();
  dhtml.supported = false;
  dhtml.visibility = function() {};
}

function accessing()
{
  if (dhtml.supported)
  {
    document.write(
      '<div class="standby" id="div_status">ACCESSING FILE <span id="dots"'
      + '>&nbsp;<\/span><\/div>');
  }
}


function loadIdx()
{
  if (dhtml.supported)
  {
    document.write(
        '<div class="standby" style="visibility: none;" id="div_status"'
      + '>LOADING INDEX <span id="dots">&nbsp;</span></div>');
  }
}

function animDots()
{
  var dotString = "";

  for (var i = 0; i < animDots.dotCounter; i++)
  {
    dotString += ". ";
  }

  if (dhtml.setCont)
  {
    dhtml.setCont("id", "dots", null, dotString);
  }

  if (dotCounter == 3)
  {
    animDots.dotCounter = 0;
  }
  else
  {
    animDots.dotCounter++;
  }
}
animDots.dotCounter = 0;

// disable both "dot" methods until reusing the "status" element works
/*
function dots()
{
  if (dhtml.supported && dhtml.visibility)
  {
    dots.divContent = getElem("id", "div_content");
    dots.divStatus = getElem("id", "div_status"), f;
    if (dots.divContent && dots.divStatus)
    {
      dhtml.visibility(dots.divContent, false);

      if (typeof divStatus.left != "undefined")
      {
        dots.divStatus.left = document.body.offsetWidth;
      }

      dhtml.visibility(divStatus, true);
    }
    else if ((dots.f = parent.frames['ufpdb_banner']))
    {
      dots.f.spanStatus.className = "standby";
      dhtml.setTextContent(dots.f.spanStatus, "ACCESSING FILE");
    }
  }

  if (dhtml.supported && dots.divContent && dots.divStatus)
  {
    dots.anim = window.setInterval("animDots();", 1000);
  }
}

function undots()
{
  if (dhtml.supported)
  {
    window.clearInterval(dots.anim);
    if (dots.divContent && dots.divStatus)
    {
      dots.divStatus.style.visibility = "hidden";
      dots.divContent.style.visibility = "visible";
    }
    else
    {
      dots.f.spanStatus.className = "";
      dhtml.setTextContent(f.spanStatus, "DATABASE");
    }
  }
}
*/
function dots() {}
function undots() {}

function getOffsets(a)
{
  var offset = 0;

  for (var i = 0, len = a.length; i < len; i++)
  {
    offset += a[i];
    a[i] = offset;
  }

  return a;
}

function blendWords(o, bBlendIn, iDelay)
{
  if (!iDelay)
  {
    iDelay = 1000;
  }

  if (o)
  {
    var sCont = getCont(o);
    if (sCont)
    {
      // blendWords.targets.push({target: o, timeouts: []});
      // var id = blendWords.targets.length - 1;

      var aWords = sCont.split(/\s+/), i, len;

      for (i = aWords.length; i--;)
      {
        aWords[i] = {
          value: aWords[i],
          delay: iDelay * Math.floor(aWords[i].length / sCont.length)
        };
      }

      if (bBlendIn)
      {
        var t = function()
        {
          window.clearTimeout(
            //blendWords.targets[id].timeouts[i]
            t);
          setTextContent(
            // blendWords.targets[id].target,
            o,
            // getTextContent(blendWords.targets[id].target)
            getTextContent(o)
              + ' '
              + aWords[i].value);
        };

        t.toString = function() {
          return 't();';
        };

        // var _setTimeout = function(f, delay, args)
        // {
        //   f.apply(this, args);
        // };

        for (i = 0, len = aWords.length; i < len; i++)
        {
          // blendWords.targets[id].timeouts[i] =
          var t2 = window.setTimeout(t, aWords[i].delay);
        }
      }
      else
      {
        //
      }
    }
  }
}
/**
 * @property : number = Internal ID of accessed object
 */
blendWords.targets = new Array();

/* LCARS widget prototypes */

function LCARSWidget(x, y)
{
	this.moveTo(x, y);
	this.elem = dhtml.createElement('div');
}

LCARSWidget.prototype = {
  constructor: LCARSWidget,

  moveTo: function(x, y) {
    this.x = x;
    this.y = y;
    if (dhtml.getStyle(this.obj, "display") == 'visible'){this.repaint();}
  }
};

/**
 * Creates a new LCARS Timer widget.
 *
 * Takes up to three arguments.  The first two may define the
 * relative position of the corresponding block element in CSS
 * units of length, while the third one allows to initialize
 * the timer in milliseconds.
 *
 * @param {String} x [optional]
 * @param {String} y [optional]
 * @param {Number} nStart [optional]
 */
function LCARSTimer(x, y, nStart)
{
	LCARSWidget.call(this, x, y);
	this.reset();
}

LCARSTimer.prototype = {
	constructor: LCARSTimer,

	reset: function()
	{
		this.value = 0;
	}
};

if (jsx.object.getFeature(jsx, "dom", "widgets"))
{
  /**
   * @type lcars
   * @memberOf __lcars
   * @namespace
   */
  var lcars = (/** @constructor */ function () {
    "use strict";

    return {
      /**
       * @type Content
       * @memberOf lcars
       * @extends jsx.dom.widgets.Container
       */
      Content: (function lcars_Content () {
        lcars_Content._super.apply(this, arguments);
      }).extend(jsx.dom.widgets.Container, {
        init: function () {
          this._target = document.getElementById("content");
        },

        /**
         * @param {String} title
         * @param {String} language
         */
        showMap: function (language) {
          //document.getElementById("content").innerHTML = "<\?php echo tr('Your current coordinates on Terra'); ?>\n\n" + this.getText(position);
          var content = document.getElementById("content");

          var map = lcars._gmaps_map;
          if (!map)
          {
            /* Disable transition while map is loading */
            content.style.transition = "none";
            content.className = "fixed";
            this.setInnerHTML(
              // '<select><option>Google Maps</option><option>OpenStreetMap</option></select>'
              '<div id="map-canvas" style="position: absolute; width: 100%; height: 100%"></div>');
            this.update();
          }

          var script = this._gmaps_script;
          if (!script)
          {
            script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://maps.googleapis.com/maps/api/js"
              + "?key=AIzaSyCpW3bu57j4V7_vcK_cVpvFkXMmKkKgADI"
              + "&sensor=true&callback=lcars.multiDisplay.initGMap"
              + "&language=" + language;
            document.body.appendChild(script);
            if (script.parentNode == document.body)
            {
              this._gmaps_script = script;
            }
          }
          else
          {
            lcars.multiDisplay.initGMap();
          }
        }
      }),

      /**
       * @type MultiDisplay
       * @extends jsx.dom.widgets.Container
       */
      MultiDisplay: (function lcars_MultiDisplay () {
        lcars_MultiDisplay._super.apply(this, arguments);
      }).extend(jsx.dom.widgets.Container, {
        TEXT_ACCURACY: "accuracy",
        TEXT_NOT_AVAILABLE: "N/A",

        /**
         * @memberOf lcars.MultiDisplay
         * @type jsx.dom.widgets.Container
         * @protected
         */
        _title: null,

        /**
         * @type jsx.dom.widgets.Container
         * @protected
         */
        _content: null,

        init: function () {
          this._title = new jsx.dom.widgets.Container(document.getElementById("title"));
          this._analysis = new jsx.dom.widgets.Container(document.getElementById("analysis"));
          this._content = new lcars.Content();
        },

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
        },

        /**
         * Sets the title of the multi-display
         *
         * @param {String} s
         *   New title
         */
        setTitle: function (s) {
          this._title.setText(s);
          this._title.update();
        },

        setAnalysis: function (table) {
          var s = "<table>";
          for (var i = 0, len = table.length; i < 3; ++i)
          {
            var item = table[i];
            s += "<tr><th>" + item.title + ":</th>"
              + "<td>" + item.value.replace(/\xA0/g, "&nbsp;") + "</td>";
            var item2;
            if (len > 3 && (item2 = table[i + 3]))
            {
              s += "<th>" + item2.title + ":</th>"
                + "<td>"
                + item2.value.replace(/\xA0/g, "&nbsp;").replace(/\//g, "∕")
                + "</td>";
            }
            s += "</tr>";
          }
          s += "</table>";

          this._analysis.setInnerHTML(s);
          this._analysis.update();
        },

        geolocate: function (title, language) {
          this.setTitle(title);

          var me = this;
          navigator.geolocation.getCurrentPosition(function (position) {
            lcars.setPosition(position);
            var coords = position.coords;
            var altitudeAccuracy = coords.altitudeAccuracy;
            var _geolocation = jsx.dom.geolocation;
            _geolocation.setPosition(position);
            me.setAnalysis([
              {
                title: "Latitude",
                value: _geolocation.getLatitudeString()
              },
              {
                title: "Longitude",
                value: _geolocation.getLongitudeString()
              },
              {
                title: "Lat/Lng Accuracy",
                value: _geolocation.getLatLngAccuracyString()
              },
              {
                title: "Altitude",
                value: _geolocation.getAltitudeString()
                  + (altitudeAccuracy != null
                      ? " (" + _geolocation.getAltAccuracyString()
                        + " " + this.TEXT_ACCURACY + ")"
                      : "")
              },
              {
                title: "Speed",
                value: _geolocation.getSpeedString()
              },
              {
                title: "Heading",
                value: _geolocation.getHeadingString()
              }
            ]);

            me._content.showMap(language);
            me = null;
          });

          return false;
        },

        initGMap: function () {
          var coords = lcars.getPosition().coords;
          //var title = document.getElementById("title");
          //title.firstChild.textContent = [coords.latitude.toFixed(), "° ", coords.longitude, "° (", coords.accuracy, "\xA0m)"].join("");
          var center = new google.maps.LatLng(coords.latitude, coords.longitude);

          var zoom = 9;
          var zoomAccuracy = [
            1e7, 5e6, 2e6, 2e6, 1e6, 5e5, 2e5, 1e5, 5e4,
            2e4, 1e4, 5e3, 2000, 2000, 1000, 500, 200,
            100, 50, 20
          ];

          var accuracy = coords.accuracy;
          if (!isNaN(accuracy))
          {
            for (var i = 0, len = zoomAccuracy.length; i < len; ++i)
            {
              if (accuracy > zoomAccuracy[i])
              {
                zoom = i;
                break;
              }
            }
          }

          var map = lcars._gmaps_map;
          if (!map)
          {
            var mapOptions = {
              center: center,
              zoom: zoom,
              mapTypeId: google.maps.MapTypeId.HYBRID,
              backgroundColor: "#000",
              noClear: true,
              scaleControl: true
            };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            lcars._gmaps_map = map;
          }
          else
          {
            map.setCenter(center);
            map.setZoom(zoom);
          }

          var circle = this._gmaps_circle;
          if (!circle)
          {
            if (!isNaN(coords.accuracy))
            {
              circle = new google.maps.Circle({
                map: map,
                center: center,
                radius: coords.accuracy,
                fillColor: "white",
                fillOpacity: 0.125,
                strokeColor: "white",
                strokeOpacity: 0.5
              });

              circle.addListener("click", function () {
                // TODO
//                window.alert("<\?php echo tr('Your current coordinates on Terra'); ?>\n\n"
                window.alert("Your current coordinates on Terra\n\n"
                  + jsx.dom.geolocation.getText(lcars.getPosition()));
              });

              this._gmaps_circle = circle;
            }
          }
          else
          {
            if (!isNaN(coords.accuracy))
            {
              circle.setCenter(center);
              circle.setRadius(coords.accuracy);
            }
            else
            {
              circle.setMap(null);
            }
          }

          /* Restore transition */
          document.getElementById("content").style.transition = "";
        }
      }),

      /**
       * @protected
       */
      _position: null,

     /**
       * @return {Position}
       */
      getPosition: function () {
        return this._position;
      },

      /**
       * @param {Position} position
       */
      setPosition: function (position) {
        this._position = position;
      }
    };
  }());
}