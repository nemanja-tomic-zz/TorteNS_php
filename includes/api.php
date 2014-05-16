<?php
require_once 'autoloader.php';
Autoloader::init();

$configManager = new ConfigManager();

if ($configManager->isDebugMode()) {
	ini_set('display_startup_errors', 1);
	ini_set('display_errors', 1);
	error_reporting(-1);
}