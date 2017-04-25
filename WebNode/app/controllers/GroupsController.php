<?php

// require_once 'views/IndexView.php';

class GroupsController extends \PointedEars\PHPX\Controller
{
  /**
   * Creates a new controller for the index view
   *
   * @see Controller::__construct()
   */
  public function __construct ()
  {
    parent::__construct('GroupsView');
  }

  public function indexAction ()
  {
    error_reporting(E_ALL);
    ini_set('display_errors', true);
    $loader = require '../vendor/autoload.php';
    $connection = new Rvdv\Nntp\Connection\Connection('news.solani.org', 119, false, 30);
    $client = new Rvdv\Nntp\Client($connection);
    $client->connectAndAuthenticate('PointedEars', 'BDnTV7wa');
    require '../pointedears/nntp/src/Command/ListCommand.php';
    $groups = $client->sendCommand(new PointedEars\Nntp\Command\ListCommand())->getResult();
    $this->assign('groups', $groups);

    $this->render('layouts/groups/list.phtml');
  }
}
