<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/18/14
 * Time: 9:56 AM
 */

class ProductController extends BaseController {
	public function __construct(ConfigManager $config, PDO $db) {
		parent::__construct($config);
			$this->db = new ProductDb($config, $db);
	}

	public function deleteProduct($id) {
		try {
			$this->db->deleteRecord($id);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
	}

	public function filterProducts(ProductFilter $filter) {
		$productList = array();
		try {
			$productList = $this->db->fetchProducts($filter);

            /** @var $product Product */
            /*
			foreach ($productList as $product) {
				$product->images = $this->db->fetchProductImages($product->idProizvoda);
			}
            */

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

	public function updateProduct($productData) {
		try {
			$product = $this->prepareProductData($productData);
			$this->db->updateRecord($product);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
	}

	public function insertProduct($post) {
		$productId = 0;
		try {
			$productId = $this->db->insertRecord($this->prepareProductData($post));
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
		return $productId;
	}

	/**
	 * Inserts record into SlikeProizvod table in database.
	 *
	 * @param $productId
	 * @param $imageId
	 */
	public function bindProductImage($productId, $imageId) {
		try {
			$this->db->bindProductImage($productId, $imageId);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
	}

	/**
	 * @param $post array Data from $_POST
	 * @return Product
	 */
	private function prepareProductData($post) {
		$product = new Product();
		$product->naziv = $post['naziv'];
		if (isset($post['kolicina']))
			$product->kolicina = $post['kolicina'];
		if (isset($post['tezina']))
			$product->tezina = $post['tezina'];
		if (isset($post['idProizvoda'])) {
			$product->idProizvoda = $post['idProizvoda'];
		}
		$product->cena = $post['cena'];
		$product->opis = $post['opis'];
		if (isset($post['tip'])) {
			$product->idGrupe = $post['tip'];
		}
		return $product;
	}


} 