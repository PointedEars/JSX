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
    /* TODO: Move this to GroupsController for XHR */
    error_reporting(E_ALL);
    ini_set('display_errors', true);
    $loader = require '../vendor/autoload.php';
    $connection = new Rvdv\Nntp\Connection\Connection('news.solani.org', 119, false, 30);
    $client = new Rvdv\Nntp\Client($connection);
    $client->connectAndAuthenticate('PointedEars', 'BDnTV7wa');
    require '../pointedears/nntp/src/Command/ListCommand.php';
    $groups = $client->sendCommand(new PointedEars\Nntp\Command\ListCommand())->getResult();
    $this->assign('groups', $groups);
    /* end move */

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
