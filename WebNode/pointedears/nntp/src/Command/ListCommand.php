<?php

namespace PointedEars\Nntp\Command;

use Rvdv\Nntp\Exception\RuntimeException;
use Rvdv\Nntp\Response\Response;

/**
 * ListCommand.
 *
 * @author Thomas 'PointedEars' Lahn <php@PointedEars.de>
 */
class ListCommand extends \Rvdv\Nntp\Command\Command implements \Rvdv\Nntp\Command\CommandInterface
{
    /**
     * @var string
     */
    private $param;

    /**
     * Constructor.
     *
     * @param string $group The name of the group.
     */
    public function __construct($what='')
    {
        $this->what = $what;

        parent::__construct([], true);
    }

    /**
     * {@inheritdoc}
     */
    public function execute()
    {
        return sprintf('LIST %s', $this->what);
    }

    /**
     * {@inheritdoc}
     */
    public function getExpectedResponseCodes()
    {
        /* TODO */
        return [
            Response::INFORMATION_FOLLOWS => 'onListReceived',
            // Response::NO_SUCH_GROUP  => 'onNoSuchGroup',
        ];
    }

    public function onListReceived(\Rvdv\Nntp\Response\MultiLineResponse $response)
    {
        $lines = $response->getLines()->toArray();
        $this->result = array_map(
          function ($groupInfo) {
            return array_combine(
              ['name', 'high', 'low', 'status'],
              explode(' ', $groupInfo));
          },
          $lines);
        // var_dump($this->result);
    }

    public function onNoSuchGroup(Response $response)
    {
        throw new RuntimeException(sprintf('A group with name %s does not exists on server', $this->group));
    }
}
