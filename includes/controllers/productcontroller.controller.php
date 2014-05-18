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

	public function insertProduct($post, $file, $groupName) {
		try {
			$productId = $this->db->insertRecord($this->prepareProductData($post));
			if ($_FILES['slika']['name'] <> "") {
				$imageId = $this->uploadImage($_FILES["slika"], $groupName);
				$this->db->bindProductImage($productId, $imageId);
			}
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
		$product->cena = $post['cena'];
		$product->opis = $post['opis'];
		$product->idGrupe = $post['tip'];
		return $product;
	}

	private function uploadImage($image, $groupName) {
		$time = time();										//uzimamo unix timestamp
		$name = (string)$time;								//dodeljujemo timestamp imenu fajla
		$niz = explode('.', $image['name']);				//parsiramo extenziju iz imena postovane slike
		$name .= ".".end($niz);								//dodajemo extenziju na kraj imena
									//
		$TARGET_PATH = "../../uploads/".$groupName."/";				//kompletiramo putanju i naziv fajla
		$TARGET_PATH .= $name;
		$size = $image['size'];

		if (!$this->isValidImage($image))
			throw new Exception("Slika nije u odgovarajucem formatu. Molimo izaberte jpg, bmp, gif ili png format.");
		if($size>(2048*1024))
			throw new Exception("Slika mora biti manja od 2MB.");
		if (file_exists($TARGET_PATH))
			throw new Exception("Vec postoji slika sa tim imenom.");

		if (!move_uploaded_file($image['tmp_name'], $TARGET_PATH))
			throw new Exception("Upload fajla nije uspeo,proveriti read/write dozvole.");

		return $this->db->insertProductImage($name, $size, $image['type'], $groupName);
	}

	private function isValidImage($file) {
		// Niz koji sadrzi listu dozvoljenih ekstenzija
		$valid_types = array("jpg", "png", "gif", "bmp");
		$name = strtolower ( $file['name'] );
		list($txt, $ext) = explode(".", $name);
		if(in_array($ext,$valid_types)) {
			return true;
		} else {
			return false;
		}
	}
} 