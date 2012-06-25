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
  function lcfirst($name)
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
  /**
    * Class version
   * @var string
   */
  protected $_version = '0.4.3';

  /**
   * Common path prefix for all resources
   * @var string
   */
  protected $_prefix = '';

  /**
   * Sources to be processed in order
   * @var array
   */
  protected $_sources = array();
  
  /**
   * Content-type to be used
   * @var string
   */
  protected $_contentType = 'text/javascript';
  
  /**
   * @property-read  array $typeMap
   *   Maps MIME media types to file extensions
   */
  protected $_typeMap = array(
    'text/javascript' => 'js',
    'text/css' => 'css'
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
   * Number of comments processed so far
   * @var int
   */
  protected $_commentCount = 0;
  
  protected $_jsxDeps = array(
    'types'  => 'object',
    'xpath'  => 'object',
    'http'   => 'object,string',
    'debug'  => 'object,types,array',
    'dom'    => 'types',
    'css'    => 'dom,collection',
    'events' => 'dom',
  );
    
  public function __construct()
  {
    if (isset($_GET['src']))
    {
      if (isset($_GET['prefix']))
      {
        $this->prefix = $_GET['prefix'];
      }
      
      $this->sources = $_GET['src'];
      
      if (isset($_GET['type']))
      {
        $this->contentType = $_GET['type'];
      }
      
      if (isset($_GET['debug']))
      {
        $this->debug = $_GET['debug'];
      }
      
      if (isset($_GET['verbose']))
      {
        $this->verbose = $_GET['verbose'];
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
  public function __get($name)
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

    echo "$exceptionClass: $message\n";
  }

  /**
   * Universal setter
   *
   * @param string $name
   * @param mixed $value
   * @throws DomainException if no specific setter or such a property exists
   */
  public function __set($name, $value)
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

      echo "$exceptionClass: $message\n";
    }
  }
  
  /**
   * Sets the _sources property
   *
   * @param string|array $value  Sources to process
   */
  protected function setSources($value)
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
   * @param string $type
   */
  protected function setContentType($type)
  {
    $this->_contentType = ($type ? $type : 'text/javascript');
  }
  
  /**
   * Sets the _debug property
   *
   * @param string $debug
   */
  protected function setDebug($debug)
  {
    if ($debug != 0)
    {
      $this->_debug = true;
    }
  }

  /**
   * Sets the _verbose property
   *
   * @param string $verbose
   */
  protected function setVerbose($verbose)
  {
    if ($verbose != 0)
    {
      $this->_verbose = true;
    }
  }
  
  /**
   * @param array $match
   *   Comment to work on
   * @return string
   *   Original comment or the empty string
   */
  protected function commentReplacer($match)
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
   * comments, leading and trailing whitespace removed
   *
   * @param string $s Source code to process
   * @return string Processed source code
   * @todo Do not strip from within literals
   */
  protected function uncomment($s)
  {
    return preg_replace('#^[\\t ]*//.*(?:\\r?\\n|\\n)*#m', '',
      preg_replace('/^\\s+|\\s+$/', '',
//         preg_replace(
//            '#/[\\t ]*\\*.*?\\*/[\\t ]*(?:\\r?\\n|\\n)*#s', '',
          $s
//         )
      )
    );
  }

  /**
   * Returns the passed string with all JSdoc comments but the first one removed
   *
   * @param string $s Source code to process
   * @return string Processed source code
   * @todo Do not strip from within literals
   */
  protected function stripJSdoc($s)
  {
    $s = preg_replace_callback(
      '#/[\\t ]*\\*\\*.*?\\*/[\\t ]*(\\r?\\n|\\n)*#s',
      array('self', 'commentReplacer'),
      $s);
    
    return $s;
  }

  protected function resolveDeps()
  {
    $deps = $this->jsxDeps;
    $old_sources = $this->sources;
    $new_sources = $old_sources;
    
    /*
     * "css"
     *
     */
    
    $seen = array();
    
    foreach ($old_sources as $key => $source)
    {
      if (!array_key_exists($source, $seen))
      {
        $new_sources[] = $source;
        $seen[$source] = $key;
        
        if (array_key_exists($source, $deps))
        {
          /* if the needed script has dependencies */
          $source_deps = $deps[$source];

          if (!is_array($source_deps))
          {
            $source_deps = explode(',', $source_deps);
          }
          
          /* for all dependences of that script */
          foreach ($source_deps as $dep)
          {
            if (!array_key_exists($dep, $seen))
            {
              /*
               * if the dependency has not yet been included, insert it before
               * the script
               */
              /* Insert dependencies */
              /*
               * events   http ---> string
               *  |         |        |
               *  v         v        v
               * dom ---> types --> object <--- xpath
               *  ^          ^      ^
               *  |           \    /
               * css          debug
               *  |             |
               *  v             v
               * collection   array
               */
            }
          }
        }
      }
    }
  }
  
  public function output()
  {
    header('Content-Type: ' . $this->contentType);
    
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

    /* Cached resource expires in HTTP/1.1 caches 24h after last retrieval */
    header('Cache-Control: max-age=86400, s-maxage=86400, must-revalidate, proxy-revalidate');
    
    /* Cached resource expires in HTTP/1.0 caches 24h after last retrieval */
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 86400) . ' GMT');

    $prefix = $this->prefix;
    
//     $this->resolveDeps();
    
    echo "/*\n"
        . " * Compacted with PointedEars' ResourceBuilder {$this->version}\n"
        . ($this->verbose
            ?   " * Type:          {$this->contentType}\n"
              . " * Common Prefix: " . ($prefix ? $prefix : '<none>') . "\n"
               . " * Resources:     " . implode(', ', $this->sources) . "\n"
            : '')
        . " *\n"
        . " * Please see the original files for the complete source code.\n"
        . " */\n\n";
    
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
        echo "\n\n";
      }
      
      $file = $prefix . $source
        . (array_key_exists($this->contentType, $this->typeMap)
          ? '.' . $this->typeMap[$this->contentType]
          : '');

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
        $content = $this->uncomment($content);
        $content = $this->stripJSdoc($content);
      }
      
      if ($verbose)
      {
        $compactedSize = strlen($content);
        $totalCompactedSize += $compactedSize;
        $compactedSizeFormatted = number_format($compactedSize, 0, '.', "'");
        $ratioPercentage = $compactedSize / $originalSize * 100;
        $ratioFormatted = sprintf('%.1f %%', $ratioPercentage);
      }
      
      echo implode("\n", array(
        '/*',
        " * {$file}"
          . ($verbose
             ? ": {$originalSizeFormatted} bytes reduced to {$compactedSizeFormatted} bytes"
               . " ({$ratioFormatted})"
             : ""),
        " */\n"
      ));
      
      echo $content;
      
      if ($verbose)
      {
        $totalSizeFormatted = number_format($totalSize, 0, '.', "'");
        $totalCompactedSizeFormatted = number_format($totalCompactedSize, 0, '.', "'");
        $ratioPercentage = $totalCompactedSize / $totalSize * 100;
        $ratioFormatted = sprintf('%.1f %%', $ratioPercentage);
                
        echo "\n\n/*"
          . " Total of {$totalSizeFormatted} bytes reduced to {$totalCompactedSizeFormatted} bytes"
          . " ({$ratioFormatted}). */";
      }
    }
  }
}

$builder = new ResourceBuilder();
$builder->output();
