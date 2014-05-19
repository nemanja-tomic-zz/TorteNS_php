<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/18/14
 * Time: 1:07 PM
 */

class ProductDb extends DbHandler {

	public function __construct(ConfigManager $config) {
		parent::__construct($config);
	}

	/**
	 * @param $id
	 * @return Product
	 * @throws PDOException
	 */
	public function getRecord($id) {
		$query = "SELECT * FROM proizvod WHERE idProizvoda = ?";
		$this->query($query, array($id));
		if ($this->getRowCount() == 0) {
			throw new PDOException("Product with id = {$id} not found!");
		}
		$products = $this->fetchResults(Product::GetClassName());
		return $products[0];
	}

	public function getAllRecords() {
		$query = "SELECT * FROM proizvod";
		$this->query($query, array());
		return $this->fetchResults(Product::GetClassName());
	}

	public function insertRecord(BaseModel $model) {
		/** @var $product Product */
		$product = $model;
		$query = "INSERT INTO proizvod (naziv, cena, tezina, opis, kolicina, idGrupe)
			VALUES (?, ?, ?, ?, ?, ?)";
		$this->query($query, array($product->naziv, $product->cena, $product->tezina, $product->opis, $product->kolicina, $product->idGrupe));
		return $this->lastInsertId();
	}

	public function updateRecord(BaseModel $model) {
		// TODO: Implement updateRecord() method.
	}

	public function deleteRecord($id) {
		$query = "DELETE FROM proizvod WHERE idProizvoda = ?";
		$this->query($query, array($id));
	}

	public function fetchProducts(ProductFilter $filter) {
		$query = "SELECT * FROM proizvod WHERE idGrupe = ?
				AND naziv LIKE ?
				AND cena LIKE ?
				AND opis LIKE ?";
		$this->query($query, array($filter->groupId, "%".$filter->name."%", $filter->price."%", "%".$filter->description."%"));
		return $this->fetchResults(Product::GetClassName());
	}

	public function fetchProductImages($id) {
		$productImages = array();
		$query = "SELECT * FROM slikeproizvod AS slipro
						INNER JOIN slike AS sli
						ON slipro.idSlike = sli.idSlike
						WHERE slipro.idProizvoda = ?";
		$this->query($query, array($id));
		if ($this->getRowCount() > 0) {
			$productImages = $this->fetchResults(Image::GetClassName());
		}
		return $productImages;
	}

	public function bindProductImage($productId, $imageId) {
		$query = "INSERT INTO slikeproizvod (idSlike, idProizvoda)
				VALUES (?, ?)";
		$this->query($query, array($imageId, $productId));
	}

}