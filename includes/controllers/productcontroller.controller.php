<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/18/14
 * Time: 9:56 AM
 */

class ProductController extends BaseController {
	public function __construct(ConfigManager $config) {
		parent::__construct($config);
			$this->db = new ProductDb($config);
	}

	public function deleteProduct($id) {
		try {
			$this->db->deleteRecord($id);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
	}

	public function filterProducts($naziv, $cena, $opis, $groupId) {
		$productList = array();
		try {
			$productList = $this->db->fetchProducts($naziv, $cena, $opis, $groupId);

			/** @var $product Product */
			foreach ($productList as $product) {
				$product->images = $this->db->fetchProductImages($product->idProizvoda);
			}
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
		return $productList;
	}

	public function getProduct($id) {
		$product = new Product();
		try {
			$product = $this->db->getRecord($id);
			$product->images = $this->db->fetchProductImages($product->idProizvoda);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
		return $product;
	}
} 