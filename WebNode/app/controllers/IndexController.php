<?php

// require_once 'views/IndexView.php';

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
    $this->render();
  }

  public function groupsAction ()
  {
    $this->render('layouts/index/groups.phtml');
  }

  public function threadsAction ()
  {
    $this->render('layouts/index/threads.phtml');
  }

  public function postingAction ()
  {
    $this->render('layouts/index/posting.phtml');
  }
}
