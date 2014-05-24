<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/19/14
 * Time: 5:55 PM
 */

class OrderDb extends DbHandler {

	public function __construct(ConfigManager $config) {
		parent::__construct($config);
	}

	/**
	 * @param $id
	 * @return Order
	 * @throws Exception
	 */
	public function getRecord($id) {
		$query = "SELECT proizvod.naziv, proizvod.cena, porudzbine.napomena, porudzbine.idKlijenta, porudzbine.idProizvoda, porudzbine.idPorudzbine, klijent.ime, klijent.prezime, porudzbine.datumTransakcije, grupa.naziv AS nazivGrupe
			FROM porudzbine AS porudzbine
			INNER JOIN (proizvod AS proizvod, klijent AS klijent, grupa AS grupa)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda
				AND porudzbine.idKlijenta = klijent.idKlijenta
				AND proizvod.idGrupe = grupa.idGrupe)
				WHERE idPorudzbine = ?";
		$this->query($query, array($id));
		if ($this->getRowCount() == 0) {
			throw new Exception("Order with id = {$id} not found!");
		}
		$result = $this->fetchResults(Order::GetClassName());
		return $result[0];
	}

	public function getAllRecords() {
		// TODO: Implement getAllRecords() method.
	}

	public function insertRecord(BaseModel $model) {
		// TODO: Implement insertRecord() method.
	}

	public function updateRecord(BaseModel $model) {
		/** @var $order Order */
		$order = $model;
		$query = "UPDATE porudzbine SET
			napomena = ?,
			datumTransakcije = ?
			WHERE idPorudzbine = ?";
		$this->query($query, array($order->napomena, $order->datumTransakcije, $order->idPorudzbine));
	}

	public function deleteRecord($id) {
		$query = "DELETE FROM porudzbine WHERE idPorudzbine = ?";
		$this->query($query, array($id));
	}

	public function fetchOrders(OrderFilter $filter) {
		$query = "SELECT * FROM porudzbine INNER JOIN (proizvod, klijent)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda AND porudzbine.idKlijenta = klijent.idKlijenta)
				WHERE naziv LIKE ?
				AND cena LIKE ?
				AND CONCAT(ime,prezime) LIKE ?
				AND napomena LIKE ?
				ORDER BY datumTransakcije ASC";
		$this->query($query, array("%".$filter->productName."%", $filter->price."%", "%".$filter->name."%", "%".$filter->note."%"));
		return $this->fetchResults(Order::GetClassName());
	}

	public function getAllOrderDates() {
		$query = "SELECT datumTransakcije FROM porudzbine";
		$this->query($query, array());
		$result = $this->fetchAsArray();

		$response = Array();
		foreach ($result as $row) {
			$ceoDatum = $row['datumTransakcije'];
			$model = new OrderDate();
			$model->dan = date("d",strtotime($ceoDatum));
			$model->mesec = date("m",strtotime($ceoDatum));
			$model->godina = date("Y",strtotime($ceoDatum));
			$response[] = $model;
		}
		return $response;
	}

	public function fetchOrderImages($id) {
		$images = array();
		$query = "SELECT * FROM slikePorudzbine INNER JOIN slike
					ON slikePorudzbine.idSlike = slike.idSlike
					WHERE idPorudzbine = ?";
		$this->query($query, array($id));
		if ($this->getRowCount() > 0) {
			$images = $this->fetchResults(Image::GetClassName());
		}
		return $images;
	}
}