<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/19/14
 * Time: 5:55 PM
 */

class GroupDb extends DbHandler {

	public function __construct(ConfigManager $config) {
		parent::__construct($config);
	}

	/**
	 * @param $id int
	 * @return Group
	 * @throws PDOException
	 */
	public function getRecord($id) {
		$query = "SELECT * FROM grupa WHERE idGrupe = ?";
		$this->query($query, array($id));
		if ($this->getRowCount() == 0) {
			throw new PDOException("No groups found with provided id: {$id}.");
		}
		$result = $this->fetchResults(Group::GetClassName());
		return $result[0];
	}

	public function getAllRecords() {
		$query = "SELECT * FROM grupa";
		$this->query($query, array());
		if ($this->getRowCount() == 0) {
			throw new PDOException("No records found in table grupa.");
		}
		return $this->fetchResults(Group::GetClassName());
	}

	public function insertRecord(BaseModel $model) {
		// TODO: Implement insertRecord() method.
	}

	public function updateRecord(BaseModel $model) {
		// TODO: Implement updateRecord() method.
	}

	public function deleteRecord($id) {
		// TODO: Implement deleteRecord() method.
	}
}