/**
 * <title>Global Object Support Library</title>
 * 
 * @file global.js
 * @partof PointedEars' JavaScript Extensions (JSX)
 */
 
/**
 * @property email
 *   Contact address of the author.
 * @property path
 *   Base path of the script file resource.
 */
function Global()
{
/** @version */
  this.version = "0.2.2004100821";
/**
 * @author
 *   (C) 2004  Thomas Lahn &lt;global.js@PointedEars.de&gt;
 */
  this.copyright = "Copyright \xA9 2004";
  this.author    = "Thomas Lahn";
  this.email     = "global.js@PointedEars.de";
  this.path      = "http://pointedears.de/scripts/";
// this.docURL = this.path + "global.htm";
/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public Licnse
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License (GPL) for more details.
 *
 * You should have received a copy of the GNU GPL along with this
 * program (COPYING file); if not, go to [1] or write to the Free
 * Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
 * MA 02111-1307, USA.
 * 
 * [1] <http://www.gnu.org/licenses/licenses.html#GPL>
 */
/*
 * Refer global.htm file for documentation. 
 *
 * This document contains JavaScriptDoc. See
 * http://pointedears.de/scripts/JSDoc/
 * for details.
 */
}

/**
 * Encapsulates information about the used script engine.
 * 
 * @property string name
 * @property string majorVersion
 * @property string buildVersion
 * @property string version
 */
function Engine()
{
  this.name =
    typeof ScriptEngine == "function"
    ? ScriptEngine()
    : '';

  this.majorVersion =
    typeof ScriptEngineMajorVersion == "function"
    ? ScriptEngineMajorVersion()
    : 'x';

  this.minorVersion = 
    typeof ScriptEngineMinorVersion == "function"
    ? ScriptEngineMinorVersion()
    : 'xx';

  this.buildVersion = 
    typeof ScriptEngineBuildVersion == "function"
    ? ScriptEngineBuildVersion()
    : 'xxxx';

  this.version =
    (this.majorVersion != 'x'
     ? this.majorVersion
       + (this.minorVersion != 'xx'
        ? '.' + this.minorVersion
          + (this.buildVersion != 'xxxx' ? '.' + this.buildVersion : '')
        : '')
   : '');
}

/**
 * Returns name and version of the used script engine,
 * if available.
 * 
 * @return type string
 */
Engine.prototype.toString = function()
{
  return (this.name ? this.name + ' ' : '') + this.version;
}
