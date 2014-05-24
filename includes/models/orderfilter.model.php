<?php

class OrderFilter {
	public $name;
	public $productName;
	public $price;
	public $note;

	public function __construct($name = "", $productName = "", $price = "", $note = "") {
		$this->name = $name;
		$this->productName = $productName;
		$this->price = $price;
		$this->note = $note;
	}
} 