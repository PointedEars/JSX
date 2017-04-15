<?php

require_once 'Application.php';
chdir('app');
// require_once 'models/databases/seriometer/SeriOMeterDb.php';

$application = \PointedEars\PHPX\Application::getInstance();
// $application->setDefaultDatabase(
//   $application->registerDatabase('seriometer', new SeriOMeterDb()));
$application->run();
