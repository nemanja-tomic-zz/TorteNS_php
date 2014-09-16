<?php
abstract class DbHandler implements IDbActions
{
	private $server;
	private $username;
	private $password;
	private $port;
	private $dbName;
	/**
	 * @var PDO
	 */
	private static $db;
	/**
	 * @var PDOStatement
	 */
	private $statement;
	/**
	 * @var ConfigManager
	 */
	protected $config;

	protected function __construct(ConfigManager $config, PDO $dbConnection) {
		$this->server = $config->getDatabaseHost();
		$this->username = $config->getDatabaseUsername();
		$this->password = $config->getDatabasePassword();
		$this->port = $config->getDatabasePort();
		$this->dbName = $config->getDatabaseName();
		$this->config = $config;
        self::$db = $dbConnection;
	}

	private function prepare($query) {
		$this->statement = self::$db->prepare($query);
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
			$errorMessage = $this->statement->errorInfo();
			throw new PDOException($errorMessage["2"]);
		}
	}

	protected function fetchResults($className) {
		$result = $this->statement->fetchAll(PDO::FETCH_CLASS, $className);
		return $result;
	}

	protected function fetchAsArray() {
		return $this->statement->fetchAll(PDO::FETCH_ASSOC);
	}

	protected function lastInsertId() {
		return self::$db->lastInsertId();
	}

	/**
	 * @return int
	 */
	protected function getRowCount() {
		return $this->statement->rowCount();
	}
}