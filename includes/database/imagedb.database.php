<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/19/14
 * Time: 5:55 PM
 */

class ImageDb extends DbHandler {

	public function __construct(ConfigManager $config, PDO $db) {
		parent::__construct($config, $db);
	}

	/**
	 * @param $id int
	 * @return Image
	 */
	public function getRecord($id) {
		$query = "SELECT * FROM slike WHERE idSlike = ?";
		$this->query($query, array($id));
		$result = $this->fetchResults(Image::GetClassName());
		return $result[0];
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
		$query = "DELETE FROM slike WHERE idSlike = ?";
		$this->query($query, array($id));
	}
}