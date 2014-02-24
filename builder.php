<?php
/**
 * Builds a resource from several other ones.
 *
 * @version $Id$
 * @author
 * Copyright © 2011  Thomas 'PointedEars' Lahn &lt;php@PointedEars.de&gt;
 *
 * Part of PointedEars' JavaScript Extensions (JSX)
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

if (!function_exists('lcfirst'))
{
  function lcfirst ($name)
  {
    return strtolower(substr($name, 0, 1)) . substr($name, 1);
  }
}

/**
 * Builds a resource from several other ones.
 *
 * Information is passed via <code>$_GET</code>. Supports PHP-generated
 * resources; references to globals in resource SHOULD be avoided, but
 * MUST be declared if used.
 *
 * @author
 *   Copyright © 2011  Thomas 'PointedEars' Lahn &lt;php@PointedEars.de&gt;
 * @license http://www.gnu.org/licenses/gpl.html
 *   GNU General Public License, version 3 and later
 * @property-read string $version
 *   Class version
 * @property string $prefix
 *   Common path prefix for all resources
 * @property array $sources
 *   Sources to be processed in order
 * @property string $contentType
 *   Content-type to be used
 * @property-read array $typeMap
 *   Maps MIME media types to file extensions
 * @property boolean $debug
 *   If <code>true</code>, preserve original file content
 * @property boolean $verbose
 *   If <code>true</code>, produce verbose messages
 * @property-read int $commentCount
 *   Number of comments processed so far
 */
class ResourceBuilder
{
  const SCRIPT_CONTENT_TYPE = 'text/javascript';

  /**
    * Class version
   * @var string
   */
  protected $_version = '0.4.5';

  /**
   * Common path prefix for all resources
   * @var string
   */
  protected $_prefix = '';

  /**
   * Common path suffix for all resources.
   * Determined from <var>$_contentType</var> if <code>null</code>.
   * @var string
   */
  protected $_suffix = null;

  /**
   * Sources to be processed in order
   * @var array
   */
  protected $_sources = array();

  /**
   * Content-type to be used
   * @var string
   */
  protected $_contentType = self::SCRIPT_CONTENT_TYPE;

  /**
   * @property-read  array $typeMap
   *   Maps MIME media types to file extensions
   */
  protected $_typeMap = array(
    'text/javascript' => 'js',
    'text/css'        => 'css',
  );

  /**
   * If <code>true</code>, preserve original file content
   * @var boolean
   */
  protected $_debug = false;

  /**
   * If <code>true</code>, produce verbose messages
   * @var boolean
   */
  protected $_verbose = false;

  /**
   * If <code>true</code> or <code>false</code>, forces or forbids
   * the use of gzip.  The default is <code>false</code> which
   * gzips only if gzip=1 is specified and the client supports it.
   *
   * @var boolean
   */
  protected $_force_gzip = false;

  /**
   * Number of comments processed so far
   * @var int
   */
  protected $_commentCount = 0;

  protected $_jsxDeps = array(
    'collection'     => array('object'),
    'dom'            => array('object'),
    'dom/css'        => array('dom'),
    'dom/css/color'  => array('dom/css'),
    'dom/events'     => array('dom'),
    'dom/xpath'      => array('object'),
    'http'           => array('object'),
    'test/debug'     => array('object', 'types', 'array'),
    'types'          => array('object'),
  );

  /**
   * If <code>true</code>, resolve JSX dependencies statically
   * (EXPERIMENTAL)
   * @var boolean
   */
  protected $_resolve = false;

  public function __construct ()
  {
    if (isset($_GET['src']))
    {
      $params = array(
        'prefix',
        'suffix',
        'sources' => 'src',
        'contentType' => 'type',
        'debug',
        'verbose',
        'force_gzip' => 'gzip',
        'resolve'
      );

      foreach ($params as $property => $param)
      {
        if (isset($_GET[$param]))
        {
          $value = $_GET[$param];

          if (is_int($property))
          {
            $property = $param;
          }

          $this->$property = $value;
        }
      }

      $this->commentCount = 0;
    }
  }

  /**
   * Universal getter
   *
   * @param string $name Property name
   * @return mixed Property value
   * @throws DomainException if no specific getter or such a property exists
   */
  public function __get ($name)
  {
    $getter = 'get' . ucfirst($name);
    $property = '_' . lcfirst($name);

    if (method_exists($this, $getter))
    {
      return $this->$getter();
    }

    if (property_exists($this, $property))
    {
      return $this->$property;
    }

    $exceptionClass = 'DomainException';
    $message = "No method '$getter' or property '$property' on this object";

    if (function_exists($exceptionClass))
    {
      throw new $exceptionClass($message);
    }

    throw new Exception($message);
  }

  /**
   * Universal setter
   *
   * @param string $name
   * @param mixed $value
   * @throws DomainException if no specific setter or such a property exists
   */
  public function __set ($name, $value)
  {
    $setter = 'set' . ucfirst($name);
    $property = '_' . lcfirst($name);

    if (method_exists($this, $setter))
    {
      return $this->$setter($value);
    }

    if (property_exists($this, $property))
    {
      $this->$property = $value;
    }
    else
    {
      $exceptionClass = 'DomainException';
      $message = "No method '$setter' or property '$property' on this object";

      if (function_exists($exceptionClass))
      {
        throw new $exceptionClass($message);
      }

      throw new Exception($message);
    }
  }

  /**
   * Sets the _sources property
   *
   * @param string|array $value  Sources to process
   */
  protected function setSources ($value)
  {
    if (!is_array($value))
    {
      $value = explode(',', $value);
    }

    $this->_sources = $value;
  }

  /**
   * Sets the _contentType property
   *
   * @param string $value
   */
  protected function setContentType ($value)
  {
    $this->_contentType = ($value ? $value : 'text/javascript');
  }

  /**
   * Sets the _debug property
   *
   * @param string $value
   */
  protected function setDebug ($value)
  {
    if ($value != 0)
    {
      $this->_debug = true;
    }
  }

  /**
   * Sets the _verbose property
   *
   * @param string $value
   */
  protected function setVerbose ($value)
  {
    if ($value != 0)
    {
      $this->_verbose = true;
    }
  }

  /**
   * Sets the <code>_force_gzip</code> property
   *
   * @param mixed $value
   */
  protected function setForce_gzip($value)
  {
    $this->_force_gzip = ($value !== null) ? !!$value : $value;
  }

  /**
   * Sets the <code>_resolve</code> property
   *
   * @param mixed $value
   */
  protected function setResolve ($value)
  {
    if ($value != 0)
    {
      $this->_resolve = true;
    }
  }

  /**
   * @param array $match
   *   Comment to work on
   * @return string
   *   Original comment or the empty string
   */
  protected function commentReplacer ($match)
  {
    ++$this->_commentCount;

    if ($this->_commentCount > 1)
    {
      return '';
    }

    return $match[0];
  }

  /**
   * Returns the passed string with all single-line
   * comments, leading and trailing whitespace removed.
   *
   * @param string $s Source code to process
   * @return string Processed source code
   * @todo Do not strip from within literals
   */
  protected function uncomment ($s)
  {
    return preg_replace('#^[\\t ]*//.*(?:\\r?\\n|\\r)*#m', '',
      preg_replace('/^\\s+|\\s+$/', '',
//         preg_replace(
//            '#/[\\t ]*\\*.*?\\*/[\\t ]*(?:\\r?\\n|\\n)*#s', '',
          $s
//         )
      )
    );
  }

  /**
   * Returns the passed string with all JSdoc comments
   * but the first one removed.
   *
   * @param string $s Source code to process
   * @return string Processed source code
   * @todo Do not strip from within literals
   */
  protected function stripJSdoc ($s)
  {
    $s = preg_replace_callback(
      '#[\\t ]*/\\*\\*(?:[^*]|\\*[^/])*\\*/(?:\\r?\\n|\\r)?#',
      array('self', 'commentReplacer'),
      $s);

    return $s;
  }

  /**
   * Resolves JSX dependencies from static information
   * @todo Use dynamic inline information
   *
   * @param array $sources
   *   List of required resources
   * @param array $new_sources [optional $name => $name]
   *   Associative array used internally to build the list
   *   of sources with their dependencies
   * @return array
   *   List of sources with their dependencies resolved
   */
  protected function resolveDeps (array $sources, array &$new_sources = array())
  {
    $deps = $this->jsxDeps;

    foreach ($sources as $name)
    {
      if (!array_key_exists($name, $new_sources)
          && array_key_exists($name, $deps))
      {
        $this->resolveDeps($deps[$name], $new_sources);
      }

      $new_sources[$name] = $name;
    }

    return $new_sources;
  }

  public function output ()
  {
    $contentType = $this->contentType;

    header('Content-Type: ' . $contentType);

    header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

    /* Cached resource expires in HTTP/1.1 caches 24h after last retrieval */
    header('Cache-Control: max-age=86400, s-maxage=86400, must-revalidate, proxy-revalidate');

    /* Cached resource expires in HTTP/1.0 caches 24h after last retrieval */
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 86400) . ' GMT');

    $use_gzip = false;
    if (isset($_SERVER['HTTP_ACCEPT_ENCODING'])
        && preg_match('/\b((?:x-)?gzip)\s*,?/', $_SERVER['HTTP_ACCEPT_ENCODING'], $matches)
        && function_exists('gzencode'))
    {
      $force_gzip = $this->force_gzip;
      $use_gzip = ($force_gzip !== false);
      if ($use_gzip)
      {
        header("Content-Encoding: {$matches[1]}");
        header('Vary: Accept-Encoding');
      }
    }

    $prefix = $this->prefix;

    if ($contentType === self::SCRIPT_CONTENT_TYPE
        && $this->resolve)
    {
      $this->sources = $this->resolveDeps($this->sources);
    }

    $suffix = $this->suffix;
    $out = "/*\n"
        . " * Compacted with PointedEars' ResourceBuilder {$this->version}\n"
        . ($this->verbose
            ?   " * Type:          {$contentType}\n"
              . " * Common Prefix: " . ($prefix ? $prefix : '<none>') . "\n"
              . " * Common Suffix: " . $suffix . "\n"
              . " * Resources:     " . implode(', ', $this->sources)  . "\n"
            : '')
        . " *\n"
        . " * Please see the original files for the complete source code.\n"
        . " */\n\n";

    if (!$use_gzip)
    {
      echo $out;
    }

    $verbose = $this->verbose;

    /* Compute sizes only when needed */
    if ($verbose)
    {
      $totalSize = 0;
      $totalCompactedSize = 0;
    }

    foreach ($this->sources as $index => $source)
    {
      $this->commentCount = 0;

      if ($index > 0)
      {
        if ($use_gzip)
        {
          $out .= "\n\n";
        }
        else
        {
          echo "\n\n";
        }
      }

      $file = $prefix . $source
        . ($suffix !== null
            ? $suffix
            : (array_key_exists($contentType, $this->typeMap)
                ? '.' . $this->typeMap[$contentType]
                : ''));

      /* Minimum negotiation for dynamic content */
      if (!file_exists($file) && file_exists($file . '.php'))
      {
        $file .= '.php';
      }

      /*
       * NOTE: No file_get_contents(), so that PHP in resource gets parsed.
       * See globals caveat in class's PHPdoc.
       */
      ob_start();
        require_once $file;

        if ($verbose)
        {
          $originalSize = ob_get_length();
        }

        $content = ob_get_contents();
      ob_end_clean();

      if ($verbose)
      {
        $totalSize += $originalSize;
        $originalSizeFormatted = number_format($originalSize, 0, '.', "'");
      }

      if (!$this->debug)
      {
        /* Pass 1: Remove all single-line comments (i.e., disabled code) */
        $content = $this->uncomment($content);
        
        /*
         * Pass 2: Remove all JSdoc comments but the first one
         * (i.e., the copyright section)
         */
        $content = $this->stripJSdoc($content);
        
        /* Pass 3: Minimize (removes multi-line comments and extra whitespace) */
      }

      if ($verbose)
      {
        $compactedSize = strlen($content);
        $totalCompactedSize += $compactedSize;
        $compactedSizeFormatted = number_format($compactedSize, 0, '.', "'");
        $ratioPercentage = $compactedSize / $originalSize * 100;
        $ratioFormatted = sprintf('%.1f %%', $ratioPercentage);
      }

      $content =
          implode("\n", array(
            '/*',
            " * {$file}"
              . ($verbose
                 ? ": {$originalSizeFormatted} bytes reduced to {$compactedSizeFormatted} bytes"
                   . " ({$ratioFormatted})"
                 : ""),
            " */\n"
          ))
        . $content;

      if ($use_gzip)
      {
        $out .= $content;
      }
      else
     {
        echo $content;
      }
    }

    if ($verbose)
    {
      $totalSizeFormatted = number_format($totalSize, 0, '.', "'");
      $totalCompactedSizeFormatted = number_format($totalCompactedSize, 0, '.', "'");
      $ratioPercentage = $totalCompactedSize / $totalSize * 100;
      $ratioFormatted = sprintf('%.1f %%', $ratioPercentage);

      $summary = "\n\n/*"
        . " Total of {$totalSizeFormatted} bytes reduced to {$totalCompactedSizeFormatted} bytes"
        . " ({$ratioFormatted}). */";

      if ($use_gzip)
      {
        $out .= $summary;
      }
      else
      {
        echo $summary;
      }
    }

    if ($use_gzip)
    {
      $zipped = gzencode($out);
      //header('Content-Length: ' . strlen($zipped));
      echo $zipped;
    }
  }
}

$builder = new ResourceBuilder();
$builder->output();
