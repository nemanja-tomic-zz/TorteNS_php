<?php
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
error_reporting(-1);
class kurac implements SplObserver {

    public $nesto;
    /**
     * (PHP 5 &gt;= 5.1.0)<br/>
     * Receive update from subject
     * @link http://php.net/manual/en/splobserver.update.php
     * @param SplSubject $subject <p>
     * The <b>SplSubject</b> notifying the observer of an update.
     * </p>
     * @return void
     */
    public function update(SplSubject $subject)
    {
        var_dump("update ".$this->nesto);
    }
}
class picka implements SplSubject {

    private $observers = array();
    /**
     * (PHP 5 &gt;= 5.1.0)<br/>
     * Attach an SplObserver
     * @link http://php.net/manual/en/splsubject.attach.php
     * @param SplObserver $observer <p>
     * The <b>SplObserver</b> to attach.
     * </p>
     * @return void
     */
    public function attach(SplObserver $observer)
    {
        $this->observers[] = $observer;
    }

    /**
     * (PHP 5 &gt;= 5.1.0)<br/>
     * Detach an observer
     * @link http://php.net/manual/en/splsubject.detach.php
     * @param SplObserver $observer <p>
     * The <b>SplObserver</b> to detach.
     * </p>
     * @return void
     */
    public function detach(SplObserver $observer)
    {
        var_dump("detach");
    }

    /**
     * (PHP 5 &gt;= 5.1.0)<br/>
     * Notify an observer
     * @link http://php.net/manual/en/splsubject.notify.php
     * @return void
     */
    public function notify()
    {
        /** @var $obs SplObserver */
        foreach ($this->observers as $obs) {
            $obs->update($this);
        }
    }
}
$a = new kurac();
$a->nesto = "prvi";
$drugi = new kurac();
$drugi->nesto = "drugi";
$b = new picka();
$b->attach($a);
$b->attach($drugi);
$b->notify();
die();
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
				$response->data = $this->productController->filterProducts($this->data->naziv, $this->data->cena, $this->data->opis, $this->data->idGrupe);
				break;
			case ApiActions::GetProduct:
				$response->data = $this->productController->getProduct($this->data->id);
				break;
			case ApiActions::GetProducts:
				$groupId = $this->groupController->getGroupId($this->data->idGrupe);
				$response->data = $this->productController->filterProducts("", "", "", $groupId);
				break;
			case ApiActions::InsertProduct:
				$groupName = $this->groupController->getGroupName($_POST["tip"]);
				$this->productController->insertProduct($_POST, $_FILES, $groupName);
				//TODO: implement it this way:
				//$this->imageController->insertImage();
				//$this->productController->bindProductImage();
				$response->message = "Product successfully added!";
				break;
			default:
				throw new BadMethodCallException("Invalid API method called: ".$this->action);
		}
		return $response;
	}
}







