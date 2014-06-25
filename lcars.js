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

    function _setTexts (texts)
    {
      var keys = jsx.object.getKeys(texts);
      for (var i = 0, len = keys.length; i < len; ++i)
      {
        var key = keys[i];
        if (typeof this[key] == "string")
        {
          this[key] = texts[key];
        }
      }
    }

    return {
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
      },

      /**
       * @type Content
       * @memberOf lcars
       * @extends jsx.dom.widgets.Container
       */
      Content: (function lcars_Content () {
        lcars_Content._super.apply(this, arguments);
      }).extend(jsx.dom.widgets.Container, {
        TEXT_CURRENT_COORDS: "Your current coordinates on Terra",

        init: function () {
          this._target = document.getElementById("content");
        },

        setTexts: _setTexts,

        /**
         * @param {String} title
         * @param {String} language
         */
        showMap: function (language) {
          var map = this._gmaps_map;
          if (!map)
          {
            /* Disable transition when switching to "fixed" */
            this.setStyleProperty("transition", "none");
            this.setTargetProperty("className", "fixed");
            this.setInnerHTML(
              // '<select><option>Google Maps</option><option>OpenStreetMap</option></select>'
              '<div id="map-canvas" style="position: absolute; width: 100%; height: 100%"></div>');
            this.update();
          }

          if (!this._gmaps_script_loaded)
          {
            this._gmaps_script_loaded = jsx.dom.loadScript(
              "http://maps.googleapis.com/maps/api/js"
                + "?key=AIzaSyCpW3bu57j4V7_vcK_cVpvFkXMmKkKgADI"
                + "&sensor=true&callback=lcars.content.initGMap"
                + "&language=" + language);
          }
          else
          {
            lcars.multiDisplay.initGMap();
          }
        },

        initGMap: function () {
          var coords = lcars.getPosition().coords;
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

          var map = this._gmaps_map;
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
            jsx.dom.addEventListener(window, "resize", function () {
              jsx.dom.timeout.runAsync(function () {
                map.setCenter(center);
              }, 2000);
            });

            this._gmaps_map = map;
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

              var me = this;
              circle.addListener("click", function () {
                window.alert(me.TEXT_CURRENT_COORDS + "\n\n"
                  + jsx.dom.geolocation.getText());
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
          this.resetStyleProperty("transition");
        }
      }),

      FullscreenButton: (function lcars_FullscreenButton () {
        lcars_FullscreenButton._super.apply(this, arguments);
      }).extend(jsx.dom.widgets.Button, {
        elementType: "div",

        writeHTML: function () {
          document.write(this.text);
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
         * @type lcars.Content
         * @protected
         */
        _content: null,

        init: function () {
          this._title = new jsx.dom.widgets.Container(document.getElementById("title"));
          this._analysis = new jsx.dom.widgets.Container(document.getElementById("analysis"));
        },

        setTexts: _setTexts,

        setContent: function (value) {
          this._content = value;
        },

        getContent: function () {
          return this._content;
        },

        getTitle: function () {
          return this._title.getText();
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

        setAnalysis: function (data) {
          var rows = [];
          for (var i = 0, len = data.length; i < 3; ++i)
          {
            var item = data[i];
            var cells = [
              {
                elementType: "th",
                childNodes: [item.title + ":"]
              },
              {
                elementType: "td",
                childNodes: [item.value]
              }
            ];

            var item2;
            if (len > 3 && (item2 = data[i + 3]))
            {
              cells.push({
                elementType: "th",
                childNodes: [item2.title + ":"]
              });

              cells.push({
                elementType: "td",
                childNodes: [item2.value]
              });
            }

            rows.push({
              elementType: "tr",
              childNodes: cells
            });
          }

          this._analysis.setInnerHTML([{
            elementType: "table",
            childNodes: rows
          }]);

          this._analysis.update();
        },

        geolocate: function (title, language) {
          var me = this;
          var jsx_dom = jsx.dom;

          if (jsx.object.areHostMethods(window, "history", "pushState"))
          {
            var value = true;
            var stateTitle = document.title + ": Geolocation";
            var url = "#geolocation";
            window.history.pushState(value, stateTitle, url);

            var currentTitle = this.getTitle();
            var f = function f2 () {
              me.setTitle(currentTitle);
              me = null;
              jsx_dom.removeEventListener(window, "popstate", f2, false);
              jsx_dom = null;
            };
            jsx_dom.addEventListener(window, "popstate", f, false);
          }

          this.setTitle(title);

          var _geolocation = jsx_dom.geolocation;
          _geolocation.runAsync(function (position) {
            lcars.setPosition(position);
            var coords = position.coords;
            var altitudeAccuracy = coords.altitudeAccuracy;
            me.setAnalysis([
              {
                title: _geolocation.TEXT_LATITUDE,
                value: _geolocation.getLatitudeString()
              },
              {
                title: _geolocation.TEXT_LONGITUDE,
                value: _geolocation.getLongitudeString()
              },
              {
                title: _geolocation.TEXT_LAT_LNG_ACCURACY,
                value: _geolocation.getLatLngAccuracyString()
              },
              {
                title: _geolocation.TEXT_ALTITUDE,
                value: _geolocation.getAltitudeString()
                  + (altitudeAccuracy != null
                      ? " (" + _geolocation.getAltAccuracyString()
                        + " " + this.TEXT_ACCURACY + ")"
                      : "")
              },
              {
                title: _geolocation.TEXT_SPEED,
                value: _geolocation.getSpeedString()
              },
              {
                title: _geolocation.TEXT_HEADING,
                value: _geolocation.getHeadingString()
              }
            ]);

            me._content.showMap(language);
          });

          return false;
        }
      }),

      insertSound: function () {
        var beep = document.createElement("audio");
        if (beep)
        {
          beep.src = "/media/audio/sound/beep1med.wav";
          beep.preload = "auto";
          document.body.appendChild(beep);
        }

        var widgets = jsx.dom.xpath.evaluate(
          './/a[@href] | .//div[@onclick]',
          document.body);

        if (widgets)
        {
          var fMouseDown = function () {
            jsx.object.callIfMethod([beep, "play"]);
          };

          var fKeyDown = jsx.dom.createEventListener(function (e) {
            if (e.keyCode == 13)
            {
              fMouseDown(e);
            }
          });

          for (var i = widgets.length; i--;)
          {
            var widget = widgets[i];

            jsx.dom.addEventListener(widget, "mousedown", fMouseDown);
            jsx.dom.addEventListener(widget, "keydown", fKeyDown);
            jsx.dom.addEventListener(widget, "touch", fMouseDown);

            jsx.dom.replaceEventListener(widget, "click",
              jsx.dom.createEventListener((function (oldClickListener) {
                return function (e) {
                  function clickAction ()
                  {
                    var returnValue = true;

                    if (jsx.object.isMethod(oldClickListener))
                    {
                      returnValue = oldClickListener.call(e.currentTarget, e);
                    }

                    if (returnValue && e.currentTarget.href)
                    {
                      window.location = e.currentTarget.href;
                    }
                  }

                  if (beep.ended)
                  {
                    clickAction();
                  }
                  else
                  {
                    jsx.dom.timeout.runAsync(clickAction,
                      (beep.duration - beep.currentTime + 0.250) * 1000);
                    e.preventDefault();
                  }
                };
              }(widget.onclick))));
          }
        }
      }
    };
  }());
}

function toggleFullscreen (button)
{
  var nowIsFullscreen = fullscreen.isFullscreen();

  if (nowIsFullscreen)
  {
    fullscreen.cancel();
  }
  else
  {
    fullscreen.requestOn(document.documentElement, button);
  }
}