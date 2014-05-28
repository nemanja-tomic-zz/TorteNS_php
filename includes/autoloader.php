<?php
class Autoloader {
	private static $loader;

	public function __construct() {
		spl_autoload_register(array($this, 'Model'));
		spl_autoload_register(array($this, 'Helper'));
		spl_autoload_register(array($this, 'Controller'));
		spl_autoload_register(array($this, 'Library'));
		spl_autoload_register(array($this, 'Database'));
		spl_autoload_register(array($this, 'Interfaces'));
		set_include_path(get_include_path() . PATH_SEPARATOR . 'includes/');
	}

	public static function init() {
		if (self::$loader == null)
			self::$loader = new self ();

		return self::$loader;
	}

	public function Interfaces($class) {
		set_include_path(get_include_path() . PATH_SEPARATOR . 'interfaces/');
		spl_autoload_extensions('.interface.php');
		spl_autoload(strtolower($class));
	}

	public function Database($class) {
		set_include_path(get_include_path() . PATH_SEPARATOR . 'database/');
		spl_autoload_extensions('.database.php');
		spl_autoload(strtolower($class));
	}

	public function Library($class) {
		set_include_path(get_include_path() . PATH_SEPARATOR . 'libraries/');
		spl_autoload_extensions('.class.php,.interface.php,.library.php');
		spl_autoload(strtolower($class));
	}

	public function Controller($class) {
		set_include_path(get_include_path() . PATH_SEPARATOR . 'controllers/');
		spl_autoload_extensions('.controller.php');
		spl_autoload(strtolower($class));
	}

	public function Model($class) {
		set_include_path(get_include_path() . PATH_SEPARATOR . 'models/');
		spl_autoload_extensions('.model.php');
		spl_autoload(strtolower($class));
	}

	public function Helper($class) {
		set_include_path(get_include_path() . PATH_SEPARATOR . 'helpers/');
		spl_autoload_extensions('.helper.php');
		spl_autoload(strtolower($class));
	}
}