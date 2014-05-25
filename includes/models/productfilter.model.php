<?php
/**
 * Class ProductFilter
 *
 * Contains filter data used for building correct query to database.
 */
class ProductFilter {
	public $price;
	public $name;
	public $description;
	public $groupId;

	public function __construct($groupId, $price = "", $name = "", $description = ""){
		$this->price = isset($price) ? $price : "";
		$this->name = isset($name) ? $name : "";
		$this->description = isset($description) ? $description : "";
		$this->groupId = isset($groupId) ? $groupId : 1;
	}
} 