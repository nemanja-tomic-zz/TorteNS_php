<?php
/**
 * Model which describes "porudzbine" table from database.
 */
class Order extends BaseModel {
	public $idPorudzbine;
	public $napomena;
	public $datumPorucivanja;
	public $datumTransakcije;
	public $idKlijenta;
	public $idProizvoda;
	public $images;
    public $danispremanja;
    /**
     * @var DateTime represents start date of product preparation (cooking skillz)
     */
    public $startDate;
} 