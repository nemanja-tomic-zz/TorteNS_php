<?php
class Autoloader {
	private static $loader;

	public function __construct() {
		spl_autoload_register(array($this, 'Model'));
		spl_autoload_register(array($this, 'Helper'));
		spl_autoload_register(array($this, 'Controller'));
		spl_autoload_register(array($this, 'Library'));
		set_include_path(get_include_path() . PATH_SEPARATOR . 'includes/');
	}

	public static function init() {
		if (self::$loader == null)
			self::$loader = new self ();

		return self::$loader;
	}

	public function Library($class) {
		set_include_path(get_include_path() . PATH_SEPARATOR . 'libraries/');
		spl_autoload_extensions('.library.php');
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