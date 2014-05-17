<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/17/14
 * Time: 12:01 PM
 */

class ClientDb extends DbHandler {

	/**
	 * @var ConfigManager
	 */
	private $config;

	public function __construct(ConfigManager $config) {
		$this->config = $config;
		parent::__construct($this->config);
	}

	/**
	 * @param $fname
	 * @param $lname
	 * @param $email
	 * @param $phone
	 * @return array
	 */
	public function fetchClients($fname, $lname, $email, $phone) {
		$query = "SELECT * FROM klijent WHERE ime LIKE ? AND prezime LIKE ?
				AND email LIKE ? AND telefon LIKE ?";
		$this->query($query, array($fname."%", $lname."%", $email."%", $phone."%"));
		return $this->fetchResults(Client::GetClassName());
	}

	/**
	 * @param $clientId int
	 */
	public function deleteClient($clientId) {
		$query = "DELETE FROM klijent WHERE idKlijenta = ?";
		$this->query($query, array($clientId));
	}

	/**
	 * @param $clientId int
	 * @throws PDOException
	 * @return Client
	 */
	public function getClient($clientId) {
		$query = "SELECT * FROM klijent WHERE idklijenta = ?";
		$this->query($query, array($clientId));
		if ($this->getRowCount() == 0) {
			throw new PDOException("Client with id = {$clientId} not found.");
		}
		$result = $this->fetchResults(Client::GetClassName());
		return $result[0];
	}
} 