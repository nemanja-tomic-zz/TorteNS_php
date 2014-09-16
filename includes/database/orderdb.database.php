<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/19/14
 * Time: 5:55 PM
 */

class OrderDb extends DbHandler {

	public function __construct(ConfigManager $config, PDO $db) {
		parent::__construct($config, $db);
	}

	/**
	 * @param $id
	 * @return Order
	 * @throws Exception
	 */
	public function getRecord($id) {
		$query = "SELECT proizvod.naziv, proizvod.cena, porudzbine.napomena, porudzbine.idKlijenta, porudzbine.idProizvoda, porudzbine.idPorudzbine, klijent.ime, klijent.prezime, porudzbine.datumTransakcije, grupa.naziv AS nazivGrupe, grupa.idGrupe
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
		$query = "SELECT * FROM porudzbine";
		$this->query($query, array());
		return $this->fetchResults(Order::GetClassName());
	}

	/**
	 * @param BaseModel $model
	 * @return int
	 */
	public function insertRecord(BaseModel $model) {
		/** @var $order Order */
		$order = $model;
		$query = "INSERT INTO porudzbine (datumPorucivanja, idKlijenta, idProizvoda, napomena, datumTransakcije)
			VALUES (?, ?, ?, ?, ?)";
		$this->query($query, array(Date("Y-m-d"), $order->idKlijenta, $order->idProizvoda, $order->napomena, $order->datumTransakcije));
		return $this->lastInsertId();
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

    /**
     * @param OrderFilter $filter
     * @return Order[]
     */
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

	public function getOrdersByDate($date) {
		$query = "SELECT * FROM porudzbine INNER JOIN (proizvod, klijent)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda AND porudzbine.idKlijenta = klijent.idKlijenta)
				WHERE porudzbine.datumTransakcije = ?";
		$this->query($query, array($date));
		return $this->fetchResults(Order::GetClassName());
	}

	public function getOrdersByClient($id) {
		$query = "SELECT * FROM porudzbine INNER JOIN (proizvod, klijent)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda AND porudzbine.idKlijenta = klijent.idKlijenta)
				WHERE porudzbine.idKlijenta = ?";
		$this->query($query, array($id));
		return $this->fetchResults(Order::GetClassName());
	}

    public function getIncomingOrders() {
        $result = array();
        $query = "SELECT sve.ime, sve.prezime,
				sve.idPorudzbine, sve.idKlijenta, sve.idProizvoda, sve.napomena, sve.datumTransakcije,
				sve.naziv AS nazivProizvoda, sve.cena, sve.idGrupe,
				sli.naziv AS nazivSlike, sli.putanja, sli.idSlike
				FROM (SELECT kli.ime, kli.prezime,
				por.idPorudzbine, por.idKlijenta, por.idProizvoda, por.napomena, por.datumTransakcije,
				pro.naziv, pro.cena, pro.idGrupe
				FROM porudzbine AS por
				INNER JOIN (proizvod AS pro, klijent AS kli)
				ON (por.idProizvoda = pro.idProizvoda AND por.idKlijenta = kli.idKlijenta)
				WHERE por.datumTransakcije BETWEEN ? AND ?) AS sve
				LEFT JOIN (slikeproizvod AS slipro, slike AS sli)
				ON (sve.idProizvoda = slipro.idProizvoda AND slipro.idSlike = sli.idSlike)
				GROUP BY sve.idPorudzbine ORDER BY sve.datumTransakcije ASC";
        $this->query($query, array(Date("Y/m/d"), date('Y/m/d', strtotime("+7 days"))));
        if ($this->getRowCount() > 0) {
            $result = $this->fetchAsArray();
        }
        return $result;
    }
}