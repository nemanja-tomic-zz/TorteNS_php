<?php
class DbHandler
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

	protected function __construct(ConfigManager $config) {
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
		return $this->statement->execute($params);
	}

	protected function query($query, $params) {
		$this->prepare($query);
		if (!$this->execute($params)) {
			throw new PDOException($this->statement->errorInfo());
		}
	}

	protected function fetchResults($className) {
		$result = $this->statement->fetchAll(PDO::FETCH_CLASS, $className);
		return $result;
	}

	protected function fetchAsArray() {
		return $this->statement->fetchAll(PDO::FETCH_ASSOC);
	}

	/**
	 * @return int
	 */
	protected function getRowCount() {
		return $this->statement->rowCount();
	}
}