<?php

interface IDbActions {
	public function getRecord($id);

	public function getAllRecords();

	public function insertRecord(BaseModel $model);

	public function updateRecord(BaseModel $model);

	public function deleteRecord($id);
}