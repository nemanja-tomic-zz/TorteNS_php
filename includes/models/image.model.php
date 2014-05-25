<?php
/**
 * Model which describes "slike" table from database.
 */
class Image extends BaseModel {
	public $idSlike;
	public $naziv;
	public $velicina;
	public $tip;
	public $putanja;
	public $tmpPath;
	public $groupName;
} 