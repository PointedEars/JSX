<?php

require_once 'views/IndexView.php';

class IndexController extends \PointedEars\PHPX\Controller
{
  /**
   * Creates a new controller for the index view
   *
   * @see Controller::__construct()
   */
  public function __construct ()
  {
    parent::__construct('IndexView');
  }

  public function indexAction ()
  {
    require_once '../data.inc';

    $min_percentage = 100;
    $min_series = null;

    $data = array(
        'urns' => array(
            'wiki' => 'http://de.wikipedia.org/wiki/'
        )
    );

    $serien = SeriesMapper::getInstance()->getList($serien);

    foreach ($serien as $key => &$serie)
    {
      if ($serie->total > 0)
      {
        if (!$serie->ignore && $serie->percentage < $min_percentage)
        {
          $min_percentage = $serie->percentage;
          $min_series = $key;
        }
      }
    }

    $this->assign('serien', $serien);
    $this->assign('min_series', $min_series);
    $this->render();
  }
}
