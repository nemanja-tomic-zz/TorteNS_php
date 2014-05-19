<?php
$response = "Invalid request!";
if (isset($_POST["action"]) && $_POST["action"] != "") {
	try {
		$data = (isset($_POST["data"])) ? $_POST["data"] : "";
		$api = new Api($_POST["action"], $data);
		$response = $api->Execute();
	} catch (Exception $ex) {
		$response = $ex->getMessage();
	}
}
echo json_encode($response);
exit();

class Api {

	private $action;
	private $data;
	/**
	 * @var ConfigManager
	 */
	private $configManager;
	/**
	 * @var ClientController
	 */
	private $clientController;
	/**
	 * @var ProductController
	 */
	private $productController;
	/**
	 * @var GroupController
	 */
	private $groupController;
	/**
	 * @var ImageController
	 */
	private $imageController;

	public function __construct($action, $data) {
		require_once 'autoloader.php';
		Autoloader::init();

		$this->action = strtolower($action);
		$this->data = json_decode($data);

		$this->Initialize();
	}

	private function Initialize() {
		$this->configManager = new ConfigManager();
		$this->clientController = new ClientController($this->configManager);
		$this->productController = new ProductController($this->configManager);
		$this->groupController = new GroupController($this->configManager);
		$this->imageController = new ImageController($this->configManager);

		if ($this->configManager->isDebugMode()) {
			ini_set('display_startup_errors', 1);
			ini_set('display_errors', 1);
			error_reporting(-1);
		}
	}

	/**
	 * @return Response
	 * @throws BadMethodCallException
	 */
	public function Execute() {
		$response = new Response();
		switch ($this->action) {
			case ApiActions::GetClients:
				$response->data = $this->clientController->filterClients($this->data->imeF, $this->data->prezimeF, $this->data->emailF, $this->data->telefonF);
				break;
			case ApiActions::GetClient:
				$response->data = $this->clientController->getClient($this->data->id);
				break;
			case ApiActions::DeleteClient:
				$this->clientController->deleteClient($this->data->id);
				$response->message = "Client successfully deleted!";
				break;
			case ApiActions::InsertClient:
				$this->clientController->insertClient($this->data);
				$response->message = "Client successfully added!";
				break;
			case ApiActions::UpdateCLient:
				$this->clientController->updateClient($this->data);
				$response->message = "Client successfully updated!";
				break;
			case ApiActions::DeleteProduct:
				$this->productController->deleteProduct($this->data->id);
				break;
			case ApiActions::FilterProducts:
				$filter = new ProductFilter($this->data->idGrupe, $this->data->cena, $this->data->naziv, $this->data->opis);
				$response->data = $this->productController->filterProducts($filter);
				break;
			case ApiActions::GetProduct:
				$response->data = $this->productController->getProduct($this->data->id);
				break;
			case ApiActions::GetProducts:
				$response->data = $this->productController->filterProducts(new ProductFilter($this->data->groupId));
				break;
			case ApiActions::InsertProduct:
				$group = $this->groupController->getGroupName($_POST["tip"]);
				$productId = $this->productController->insertProduct($_POST);
				if ($_FILES['slika']['name'] <> "") {
					$imageId = $this->imageController->insertImage($_FILES['slika'], $group->naziv);
					$this->productController->bindProductImage($productId, $imageId);
				}
				$response->message = "Product successfully added!";
				break;
			default:
				throw new BadMethodCallException("Invalid API method called: ".$this->action);
		}
		return $response;
	}
}







