<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/17/14
 * Time: 1:19 PM
 */

abstract class BaseController {
	/**
	 * @var ConfigManager
	 */
	protected $config;

	protected function __construct(ConfigManager $config) {
		$this->config = $config;
	}

	protected function HandleException(Exception $ex) {
		switch (get_class($ex)) {
			case "PDOException":
				throw new Exception("Database error occurred, please contact administrator or technical support for more info.");
			default:
				throw $ex;
				break;
		}
	}


} 