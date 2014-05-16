<?php
class Database
{
	private $server;
	private $username;
	private $password;
	private $port;
	private $dbName;
	/**
	 * @var PDO
	 */
	private $db;
	/**
	 * @var PDOStatement
	 */
	private $statement;

	function __construct(ConfigManager $config) {
		$this->server = $config->getDatabaseHost();
		$this->username = $config->getDatabaseUsername();
		$this->password = $config->getDatabasePassword();
		$this->port = $config->getDatabasePort();
		$this->dbName = $config->getDatabaseName();
		$this->db = new PDO("mysql:host={$this->server};dbname={$this->dbName}", $this->username, $this->password);
	}

	private function prepare($query) {
		$this->statement = $this->db->prepare($query);
	}

	private function execute($params) {
		if (!is_array($params)) {
			throw new InvalidArgumentException("Provided argument must be an array.");
		}
		$this->statement->execute($params);
	}

	public function query($query, $params) {
		$this->prepare($query);
		$this->execute($params);
	}

	public function fetchResults($className) {
		return $this->statement->fetchAll(PDO::FETCH_CLASS, $className);
	}

	public function fetchAsArray()
	{
		return $this->statement->fetchAll(PDO::FETCH_ASSOC);
	}
}