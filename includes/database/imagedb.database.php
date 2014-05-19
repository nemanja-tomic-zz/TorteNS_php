<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/19/14
 * Time: 5:55 PM
 */

class ImageDb extends DbHandler {

	public function __construct(ConfigManager $config) {
		parent::__construct($config);
	}

	public function getRecord($id) {
		// TODO: Implement getRecord() method.
	}

	public function getAllRecords() {
		// TODO: Implement getAllRecords() method.
	}

	public function insertRecord(BaseModel $model) {
		/** @var $imageModel Image */
		$imageModel = $model;
		$query = "insert into slike (naziv, velicina, tip, putanja)
				values (?, ?, ?, ?)";
		$this->query($query, array($imageModel->naziv, $imageModel->velicina, $imageModel->tip, $imageModel->groupName));
		return $this->lastInsertId();
	}

	public function updateRecord(BaseModel $model) {
		// TODO: Implement updateRecord() method.
	}

	public function deleteRecord($id) {
		// TODO: Implement deleteRecord() method.
	}
}