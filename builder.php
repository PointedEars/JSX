<?php

if (!function_exists('lcfirst'))
{
  function lcfirst($name)
  {
    return strtolower(substr($name, 0, 1)) . substr($name, 1));
  }
}

class ResourceBuilder
{
  protected $_version = '0.4';
  
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
  
  protected $_typeMap = array(
  	'text/javascript' => 'js',
    'text/css' => 'css'
  );
  
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
    else if (property_exists($this, $property))
    {
      return $this->$property;
    }

    $exceptionClass = 'DomainException';
    $message = "No method '$getter' or property '$property' on this object";
    
    if (function_exists($exceptionClass))
    {
      throw new $exceptionClass($message);
    }
    else
    {
      echo "$exceptionClass: $message\n";
    }
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
    else if (property_exists($this, $property))
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
      else
      {
        echo "$exceptionClass: $message\n";
      }
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
    echo implode("\n", array(
           '/*',
           " * Compacted with PointedEars' ResourceBuilder {$this->version}",
           " * Type: {$this->contentType}",
           " * Prefix: {$this->prefix}",
           " * Resources: " . implode(', ', $this->sources),
           " */\n\n"));
    
    foreach ($this->sources as $index => $source)
    {
      $this->commentCount = 0;
      
      if ($index > 0)
      {
        echo "\n\n";
      }
      
      $file = $this->prefix . $source
        . (array_key_exists($this->contentType, $this->typeMap)
          ? '.' . $this->typeMap[$this->contentType]
          : '');
      echo "/* Please see {$file} for the complete source code */\n";
      $content = file_get_contents("./$file");
      echo $this->stripJSdoc($content);
    }
  }
}

$builder = new ResourceBuilder();
$builder->output();
