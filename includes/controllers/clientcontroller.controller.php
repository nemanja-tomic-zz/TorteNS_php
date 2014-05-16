<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/16/14
 * Time: 11:51 PM
 */

class ClientController {

	/**
	 * @var Database
	 */
	private $dbHandler;

	public function __construct(Database $database) {
		$this->dbHandler = $database;
	}

	public function insertClient() {
		return true;
	}

	public function getClient($clientId) {
		return true;
	}

	public function getClients() {
		return true;
	}
}