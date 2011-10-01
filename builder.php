<?php

if (!function_exists('lcfirst'))
{
  function lcfirst($name)
  {
    return strtolower(substr($name, 0, 1)) . substr($name, 1);
  }
}

class ResourceBuilder
{
  protected $_version = '0.4.2';
  
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
   * Maps MIME media types to file extensions
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
   * Returns the passed string with all multiline comments,
   * leading and trailing whitespace removed
   *
   * @param string $s Source code to process
   * @return string Processed source code
   * @todo Do not strip from within literals
   */
  protected function uncomment($s)
  {
    return preg_replace('/^\\s+|\\s+$/', '',
      preg_replace_callback(
      	'#/[\\t ]*\\*.*?\\*/[\\t ]*(\\r?\\n|\\n)*#s',
    		array('self', 'commentReplacer'),
        $s));
  }

  /**
   * Returns the passed string with all JSdoc comments but the first one,
   * leading and trailing whitespace removed
   *
   * @param string $s Source code to process
   * @return string Processed source code
   * @todo Do not strip from within literals
   */
  protected function stripJSdoc($s)
  {
    $s = preg_replace('/^\\s+|\\s+$/', '',
      preg_replace_callback(
      	'#/[\\t ]*\\*\\*.*?\\*/[\\t ]*(\\r?\\n|\\n)*#s',
        array('self', 'commentReplacer'),
        $s));
    
    return $s;
  }
  
  public function output()
  {
    header("Content-Type: {$this->contentType}");
    $prefix = $this->prefix;
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
    
    $totalSize = 0;
    $totalCompactedSize = 0;
    
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
      $originalSize = filesize("./$file");
      $totalSize += $originalSize;
      $originalSizeFormatted = number_format($originalSize, 0, '.', "'");
      $content = file_get_contents("./$file");
      
      if (!$this->debug)
      {
        $content = $this->stripJSdoc($content);
      }
      
      $compactedSize = strlen($content);
      $totalCompactedSize += $compactedSize;
      $compactedSizeFormatted = number_format($compactedSize, 0, '.', "'");
      $ratioPercentage = $compactedSize / $originalSize * 100;
      $ratioFormatted = sprintf('%.1f %%', $ratioPercentage);
      echo implode("\n", array(
      	'/*',
      	" * {$file}"
      	  . ($this->verbose
      	     ? ": {$originalSizeFormatted} bytes reduced to {$compactedSizeFormatted} bytes"
               . " ({$ratioFormatted})"
      	     : ""),
        " */\n"
      ));
      
      echo $content;
      
      if ($this->verbose)
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
