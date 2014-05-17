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
} 