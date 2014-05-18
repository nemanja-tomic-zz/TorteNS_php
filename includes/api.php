<?php
$response = "Invalid request!";
if (isset($_POST["action"]) && $_POST["action"] != "") {
	try {
		$api = new Api($_POST["action"], $_POST["data"]);
		$response = $api->Execute();
	} catch (Exception $ex) {
		$response = $ex->getMessage();
	}
}
exit(json_encode($response));

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
//		$this->groupController = new GroupController($this->configManager);

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
				$groupId = $this->groupController->getGroupId($this->data->idGrupe);
				$response->data = $this->productController->filterProducts($this->data->naziv, $this->data->cena, $this->data->opis, $groupId);
				break;
			case ApiActions::GetProduct:
				$response->data = $this->productController->getProduct($this->data->id);
				break;
			case ApiActions::GetProducts:
				$groupId = $this->groupController->getGroupId($this->data->idGrupe);
				$response->data = $this->productController->filterProducts("", "", "", $groupId);
				break;
			default:
				throw new BadMethodCallException("Invalid API method called: ".$this->action);
		}
		return $response;
	}
}







