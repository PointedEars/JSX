/**
 * <title>Script Engine Detection Library</title>
 * @file $Id$
 *
 * @author (C) 2004, 2013 <a href="mailto:js@PointedEars.de">Thomas Lahn</a>
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
  var jsx = new Object();
}

if (typeof jsx.engine == "undefined")
{
  /**
   * @namespace
   */
  jsx.engine = new Object();
}

/** @version */
jsx.engine.version = "$Revision$";

jsx.engine.copyright = "Copyright \xA9 2004, 2013";
jsx.engine.author = "Thomas Lahn";

/**
 * Contact address of the author
 */
jsx.engine.email = "js@PointedEars.de";

/**
 *  Base path of the script file resource
 */
jsx.engine.path = "http://PointedEars.de/scripts/";
// jsx.engine.docURL = this.path + "global.htm";

/**
 * Encapsulates information about the used script engine.
 */
function _EngineInfo ()
{
  /**
   * @param {string} version
   * @param {Array} versionMap
   * @param {string} fallback
   * @return {string|boolean}
   */
  function _inferVersion (version, versionMap, fallback)
  {
    function gte (v1, v2)
    {
      v1 = v1.split(".");
      v2 = v2.split(".");
      for (var i = 0, len = v1.length; i < len; ++i)
      {
        if (parseInt(v1[i], 10) < parseInt(v2[i], 10))
        {
          return false;
        }
      }

      return true;
    }

    var s = "";

    for (var i = versionMap.length; i--;)
    {
      var mapping = versionMap[i];
      if (gte(version, mapping[0]))
      {
        s = mapping[1];
        break;
      }
    }

    if (!s && fallback)
    {
      s = fallback;
    }

    return s;
  }

  if (typeof ScriptEngine == "function")
  {
    /* JScript */

    /**
     * @type string
     */
    var _vendor = "Microsoft";

    /**
     * @type string
     */
    var _name = ScriptEngine();

    /**
     * @type string
     */
    var _majorVersion =
      typeof ScriptEngineMajorVersion == "function"
      ? ScriptEngineMajorVersion()
      : 'x';

    /**
     * @type string
     */
    var _minorVersion =
      typeof ScriptEngineMinorVersion == "function"
      ? ScriptEngineMinorVersion()
      : 'xx';

    /**
     * @type string
     */
    var _buildVersion =
      typeof ScriptEngineBuildVersion == "function"
      ? ScriptEngineBuildVersion()
      : 'xxxx';

    /**
     * @type string
     */
    var _version =
      (_majorVersion != 'x'
        ? _majorVersion
            + (_minorVersion != 'xx'
                ? '.' + _minorVersion
                  + (_buildVersion != 'xxxx' ? '.' + _buildVersion : '')
                : '')
        : '');
  }
  else
  {
    var _inferred = true;

    if (typeof navigator != "undefined")
    {
      var ua = navigator.userAgent || "";

      if (typeof window != "undefined"
          && jsx.object.getFeature(window, "opera"))
      {
        _vendor = "Opera";
        _name = "ECMAScript";
      }
      else if (ua.indexOf("Konqueror") > -1)
      {
        _vendor = "KDE";
        _name = "JavaScript";
      }
      else if (ua.indexOf("WebKit") > -1)
      {
        var m = null;

        if (jsx.object.isMethod(ua, "match"))
        {
          if (ua.indexOf("Chrome") > -1)
          {
            m = ua.match(/\bChrome\/(\d+\.\d+(\.\d+)?)\b/);

            _vendor = "Google";
            _name = "V8";

            if (m)
            {
              var _minVersion = true;
              var s = _inferVersion(m[1],
                  [
                    [ "2.0.172", "0.4"],
                    [ "3.0.195", "1.2"],
                    [ "4.0.249", "1.3"],
                    [ "5.0.375", "2.1"],
                    [ "6.0.472", "2.2"],
                    [ "7.0.517", "2.3.11.22"],
                    [ "8.0.552", "2.4.9.19"],
                    [ "9.0.597", "2.5.9.6"],
                    ["10.0.648", "3.0.12.30"],
                    ["11.0.696", "3.1.8.16"],
                    ["12.0.742", "3.2.10.21"],
                    ["13.0.782", "3.3.10.17"],
                    ["14.0.835", "3.4.14.2"],
                    ["15.0.874", "3.5.10.9"],
                    ["16.0.891", "3.6.4"],
                    ["17.0.963", "3.7.12.29"],
                    ["18.0.1025", "3.8.9.19"],
                    ["19.0.1084", "3.9.24.7"],
                    ["20.0.1132", "3.10.6.0"],
                    ["21.0.1180", "3.11.10.6"],
                    ["22.0.1229", "3.12.19.4"],
                    ["23.0.1271", "3.13.7.1"],
                    ["24.0.1297", "3.14.4.1"],
                    ["25.0.1364", "3.15.11.5"],
                    ["26.0.1410", "3.16.14.9"],
                    ["27.0.1453", "3.17.6.14"],
                    ["28.0.1500", "3.18.5.5"],
                    ["29.0.1530", "3.19.9"]
                  ],
                  "0.3");

              if (s)
              {
                _version = s;
              }
            }
          }
          else
          {
            _vendor = "Apple";
            _name = "JavaScriptCore";

            m = ua.match(/\bAppleWebKit\/(\d+\.\d+(\.\d+)*)\b/);

            if (m)
            {
              _version = m[1];
            }
          }
        }
      }
      else if (typeof netscape != "undefined" || ua.indexOf("Gecko") > -1)
      {
        m = null;

        if (jsx.object.isNativeMethod(ua, "match"))
        {
          m = ua.match(/\brv:((\d+)\.\d+(\.\d+)*)\b/);
        }

        _vendor = "Netscape/Mozilla";
        _name = "JavaScript";

        if (m)
        {
          _minVersion = true;

          if (parseInt(m[2], 10) >= 5)
          {
            s = m[2];
          }
          else
          {
            s = _inferVersion(m[1],
              [
                ["0.6",   "1.5"],
                ["1.8",   "1.6"],
                ["1.8.1", "1.7"],
                ["1.9",   "1.8"],
                ["1.9.1", "1.8.1"],
                ["1.9.2", "1.8.2"],
                ["1.9.3", "1.8.5"]
              ]);
          }

          if (s)
          {
            _version = s;
          }
        }
      }
    }
  }

  function _getVendor ()
  {
    return _vendor;
  }
  this.getVendor = _getVendor;

  function _getName ()
  {
    return _name;
  }
  this.getName = _getName;

  function _getFullName ()
  {
    var vendor = _getVendor();
    return (vendor ? vendor + " " : "") + _getName();
  }
  this.getFullName = _getFullName;

  function _getMajorVersion ()
  {
    return _majorVersion;
  }
  this.getMajorVersion = _getMajorVersion;

  function _getMinorVersion ()
  {
    return _minorVersion;
  }
  this.getMinorVersion = _getMinorVersion;

  function _getVersion ()
  {
    return _version;
  }
  this.getVersion = _getVersion;

  function _isInferred ()
  {
    return !!_inferred;
  }
  this.isInferred = _isInferred;

  function _isMinVersion ()
  {
    return !!_minVersion;
  }
  this.isMinVersion = _isMinVersion;
}

/**
 * Returns name and version of the used script engine,
 * if available.
 *
 * @return {string}
 */
function _EngineInfo_prototype_toString ()
{
  var name = this.getName();
  return (name ? name + ' ' : '') + this.getVersion();
}
_EngineInfo.prototype.toString = _EngineInfo_prototype_toString;

jsx.engine.EngineInfo = _EngineInfo;