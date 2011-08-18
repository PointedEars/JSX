<?php

class ResourceBuilder
{
  protected $_version = '0.2';
  
  /**
   * Sources to be processed in order
   * @var array
   */
  protected $_sources = array();
  
  /**
   * Content-type to be used
   * @var string
   */
  protected $_contentType;
  
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
      $this->sources = $_GET['src'];
      $this->contentType = isset($_GET['type']) ? $_GET['type'] : '';
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

    throw new DomainException(
    	"No method '$getter' or property '$property' on this object");
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
      throw new DomainException(
      	"No method '$setter' or property '$property' on this object");
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
    ++$this->commentCount;

    if ($this->commentCount > 1)
    {
      return '';
    }

    return $match[0];
  }

  /**
   * @param string $s Source code to process
   * @return string Processed source code
   */
  protected function uncomment($s)
  {
    return preg_replace('/^\\s+|\\s+$/', '',
      preg_replace_callback(
        '#/[\\t ]*\\*(?:[^*/]|\\*[^/]|/)*\\*(\\r?\\n|\\n)*/#',
    		array('self', 'commentReplacer'),
        $s));
  }
  
  public function output()
  {
    header("Content-Type: {$this->contentType}");
    echo implode("\n", array(
           '/*',
           " * Compacted with PointedEars' ResourceBuilder {$this->version}",
           " * Type: {$this->contentType}",
           " * Resources: " . implode(', ', $this->sources),
           " */\n\n"));
    
    foreach ($this->sources as $index => $source)
    {
      if ($index > 0)
      {
        echo "\n\n";
      }
      
      $file = $source
        . (array_key_exists($this->contentType, $this->typeMap)
          ? '.' . $this->typeMap[$this->contentType]
          : '');
      echo "/* Please see {$file} for the complete source code */\n";
      ob_start();
        require_once "./$file";
        $content = ob_get_contents();
      ob_end_clean();
      echo $this->uncomment($content);
    }
  }
}

$builder = new ResourceBuilder();
$builder->output();
