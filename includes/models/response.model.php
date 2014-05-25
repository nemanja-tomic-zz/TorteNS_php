<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/16/14
 * Time: 11:46 PM
 */

class Response extends BaseModel {
	public $data;
	public $message;
	public $hasData = true;
	public $success = true;
	public $exceptionData;
}