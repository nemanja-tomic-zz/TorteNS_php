<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/16/14
 * Time: 11:51 PM
 */

class ClientController extends BaseController {
	/**
	 * @var ClientDb
	 */
	private $db;

	public function __construct(ConfigManager $config) {
		parent::__construct($config);
		$this->db = new ClientDb($config);
	}

	public function insertClient() {
		return true;
	}

	/**
	 * @param $clientId
	 * @return Client
	 */
	public function getClient($clientId) {
		$clientData = new Client();
		try {
			$clientData = $this->db->getClient($clientId);
			$clientData->statusText = ClientStatus::GetConstantName($clientData->status);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
		return $clientData;
	}

	public function getClients($fname, $lname, $email, $phone) {
		try {
			$clientList = $this->db->fetchClients($fname, $lname, $email, $phone);

			/** @var $client Client */
			foreach ($clientList as $client) {
				$client->statusText = ClientStatus::GetConstantName($client->status);
			}
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
		return $clientList;
	}

	public function deleteClient($clientId) {
		try {
			$this->db->deleteClient($clientId);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
	}
}