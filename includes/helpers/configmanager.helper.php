<?php
class ConfigManager {

	private $databaseConfig;
	private $generalConfig;
	
	public function __construct() {
		$configPath = "..//config.ini";
		if (!$configuration = parse_ini_file($configPath, true)) {
			$error = error_get_last();
			throw new Exception("Configuration file not found => ".$error["message"]);
		}
		$this->databaseConfig = $configuration["DATABASE"];
		$this->generalConfig = $configuration["GENERAL"];
	}

	/**
	 * Indicates whether the application is set to run in debug mode or not.
	 *
	 * @return bool
	 */
	public function isDebugMode() {
		return $this->parseBoolean($this->generalConfig["debug"]);
	}

	/**
	 * Returns current version of the application.
	 *
	 * @return string
	 */
	public function getVersion() {
		return $this->parseString($this->generalConfig["version"]);
	}

	/**
	 * Returns the value of database host from configuration file. If the value is not set, empty string is returned.
	 *
	 * @return string Database host value from config.ini
	 */
	public function getDatabaseHost() {
		return $this->parseString($this->databaseConfig["db_host"]);
	}

	/**
	 * Returns the value of database username from configuration file. If the value is not set, empty string is returned.
	 *
	 * @return string Database username value from config.ini
	 */
	public function getDatabaseUsername() {
		return $this->parseString($this->databaseConfig["db_user"]);
	}

	/**
	 * Returns the value of database password from configuration file. If the value is not set, empty string is returned.
	 *
	 * @return string Database password value from config.ini
	 */
	public function getDatabasePassword() {
		return $this->parseString($this->databaseConfig["db_pass"]);
	}

	/**
	 * Returns the value of database username from configuration file. If the value is not set, empty string is returned.
	 *
	 * @return string Database username value from config.ini
	 */
	public function getDatabaseName() {
		return $this->parseString($this->databaseConfig["db_name"]);
	}

	/**
	 * Returns the value of database port from configuration file. If the value is not set, empty string is returned.
	 *
	 * @return integer Database port value from config.ini
	 */
	public function getDatabasePort() {
		return $this->parseInteger($this->databaseConfig["db_port"]);
	}

	/**
	 * @param $stringValue
	 * @throws InvalidArgumentException
	 * @return string
	 */
	private function parseString($stringValue) {
		if (!isset($stringValue) || !is_string($stringValue) || strlen($stringValue) <= 0) {
			throw new InvalidArgumentException("Invalid configuration value provided: ".$stringValue);
		}
		return $stringValue;
	}

	/**
	 * @param $intValue
	 * @throws InvalidArgumentException
	 * @return int
	 */
	private function parseInteger($intValue) {
		if (!isset($intValue) || !is_numeric($intValue)) {
			throw new InvalidArgumentException("Invalid configuration value provided: ".$intValue);
		}
		return (int)$intValue;
	}

	/**
	 * @param $boolValue
	 * @throws InvalidArgumentException
	 * @return bool
	 */
	private function parseBoolean($boolValue) {
		$returnValue = false;
		if (isset($boolValue)) {
			$boolValue = strtolower($boolValue);

			switch ($boolValue) {
				case "true":
				case "1":
					$returnValue = true;
					break;
				case "false":
				case "0":
					$returnValue = false;
					break;
				default:
					throw new InvalidArgumentException("Invalid configuration value provided: ".$boolValue);
					break;
			}
		}
		return $returnValue;
	}
}