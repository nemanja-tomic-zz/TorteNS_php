<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/16/14
 * Time: 11:51 PM
 */

class ClientController {

	/**
	 * @var DbHandler
	 */
	private $dbHandler;
	/**
	 * @var ConfigManager
	 */
	private $config;
	/**
	 * @var ClientDb
	 */
	private $db;

	public function __construct(ConfigManager $config) {
		$this->config = $config;
		$this->db = new ClientDb($config);
	}

	public function insertClient() {
		return true;
	}

	public function getClient($clientId) {
		return true;
	}

	public function getClients($fname, $lname, $email, $phone) {
		$clientList = $this->db->fetchClients($fname, $lname, $email, $phone);

		/** @var $client Client */
		foreach ($clientList as $client) {
			$client->statusText = ClientStatus::GetConstantName($client->status);
		}

		return $clientList;
	}
}