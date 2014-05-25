<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/17/14
 * Time: 12:01 PM
 */

class ClientDb extends DbHandler {

	public function __construct(ConfigManager $config) {
		parent::__construct($config);
	}

	/**
	 * @param $fname string
	 * @param $lname string
	 * @param $email string
	 * @param $phone string
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
	public function deleteRecord($clientId) {
		$query = "DELETE FROM klijent WHERE idKlijenta = ?";
		$this->query($query, array($clientId));
	}

	/**
	 * @param $clientId int
	 * @throws PDOException
	 * @return Client
	 */
	public function getRecord($clientId) {
		$query = "SELECT * FROM klijent WHERE idklijenta = ?";
		$this->query($query, array($clientId));
		if ($this->getRowCount() == 0) {
			throw new PDOException("Client with id = {$clientId} not found.");
		}
		$result = $this->fetchResults(Client::GetClassName());
		return $result[0];
	}

	public function insertRecord(BaseModel $model) {
		$query = "INSERT INTO klijent (ime, prezime, telefon, telefon2, email, fblink, adresa, napomene, status)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

		/** @var $client Client */
		$client = $model;
		$this->query($query, array($client->ime, $client->prezime, $client->telefon, $client->telefon2, $client->email, $client->fblink, $client->adresa, $client->napomene, $client->status));
	}

	public function updateRecord(BaseModel $model) {
		$query = "UPDATE klijent SET
			ime = ?, prezime = ?, telefon = ?, telefon2 = ?, adresa = ?, email = ?, fblink = ?,	napomene = ?, status = ?
			WHERE idKlijenta = ?";
		/** @var $client Client */
		$client = $model;
		$this->query($query, array($client->ime, $client->prezime, $client->telefon, $client->telefon2, $client->adresa, $client->email, $client->fblink, $client->napomene, $client->status, $client->idKlijenta));
	}

	public function getAllRecords() {
		$query = "SELECT * FROM klijent";
		$this->query($query, array());
		return $this->fetchResults(Client::GetClassName());
	}
}