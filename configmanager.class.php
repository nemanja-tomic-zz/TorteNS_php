<?php
class ConfigManager {
	
	private $databaseConfig;
	
	public function ConfigManager() {
		$configuration = parse_ini_file("config.ini", true);
		$this->databaseConfig = $configuration["DATABASE"];
		$this->autoloadRegister();
	}
	
	public function getDatabaseHost() {
		return $this->databaseConfig["db_host"];
	}
	
	private function parseString($stringValue) {
		
	}
	
	private function autoloadRegister() {
		spl_autoload_register(function($className){
			set_include_path(get_include_path().PATH_SEPARATOR."includes");
			require_once $className.".class.php";
		});
	}
}
?>