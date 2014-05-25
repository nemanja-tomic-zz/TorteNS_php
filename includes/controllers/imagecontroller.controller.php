<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/19/14
 * Time: 5:53 PM
 */

class ImageController extends BaseController {

	const UPLOAD_ROOT = "../uploads/";

	public function __construct(ConfigManager $config) {
		parent::__construct($config);
		$this->db = new ImageDb($config);
	}

	/**
	 * Uploads the file and stores image to database.
	 *
	 * @param $file array $_FILES
	 * @param $groupName string
	 * @return int
	 */
	public function insertImage($file, $groupName) {
		$imageId = 0;
		try {
			$imageModel = new Image();

			$time = time();										//uzimamo unix timestamp
			$name = (string)$time;								//dodeljujemo timestamp imenu fajla
			$niz = explode('.', $file['name']);				//parsiramo extenziju iz imena postovane slike
			$name .= ".".end($niz);								//dodajemo extenziju na kraj imena
			$TARGET_PATH = $this::UPLOAD_ROOT.$groupName."/";				//kompletiramo putanju i naziv fajla
			$TARGET_PATH .= $name;
			$size = $file['size'];

			$imageModel->naziv = $name;
			$imageModel->putanja = $TARGET_PATH;
			$imageModel->tip = $file['type'];
			$imageModel->velicina = $size;
			$imageModel->tmpPath = $file['tmp_name'];
			$imageModel->groupName = $groupName;

			$this->uploadFile($imageModel);

			$imageId = $this->db->insertRecord($imageModel);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
		return $imageId;
	}

	public function deleteImage($imageId) {
		try {
			$image = $this->db->getRecord($imageId);
			$path = $this::UPLOAD_ROOT.$image->putanja.DIRECTORY_SEPARATOR.$image->naziv;
			if (file_exists($path) && !unlink($path)) {
				throw new Exception("Image could not be deleted from file system: ");
			}
			$this->db->deleteRecord($imageId);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
	}

	private function uploadFile(Image $file) {
		if (!$this->isValidImage($file))
			throw new Exception("Slika nije u odgovarajucem formatu. Molimo izaberte jpg, bmp, gif ili png format.");
		if($file->velicina > (2048 * 1024))
			throw new Exception("Slika mora biti manja od 2MB.");
		if (file_exists($file->putanja))
			throw new Exception("Vec postoji slika sa tim imenom.");
		if (!move_uploaded_file($file->tmpPath, $file->putanja))
			throw new Exception("Upload fajla nije uspeo,proveriti read/write dozvole.");
	}

	private function isValidImage(Image $file) {
		$valid_types = array("jpg", "png", "gif", "bmp");
		$name = strtolower ( $file->naziv );
		list($txt, $ext) = explode(".", $name);
		if(in_array($ext,$valid_types)) {
			return true;
		} else {
			return false;
		}
	}
}