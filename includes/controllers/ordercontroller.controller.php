<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/19/14
 * Time: 5:53 PM
 */

class OrderController extends BaseController {
	public function __construct(ConfigManager $config) {
		parent::__construct($config);
		$this->db = new OrderDb($config);
	}

	public function filterOrders(OrderFilter $filter, $newOrders = true) {
		$returnList = array();
		try {
			$orderList = $this->db->fetchOrders($filter);
			if ($newOrders) {
				for ($i = 0; $i < count($orderList); $i++) {
					if (strtotime($orderList[$i]->datumTransakcije) >= strtotime(Date('Y-m-d'))) {
						$returnList[] = $orderList[$i];
					}
				}
			} else {
				for ($i = 0; $i < count($orderList); $i++) {
					if (strtotime($orderList[$i]->datumTransakcije) < strtotime(Date('Y/m/d'))) {
						$returnList[] = $orderList[$i];
					}
				}
			}

		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
		return $returnList;
	}

	public function getOrder($id) {
		$orderData = new Order();
		try {
			$orderData = $this->db->getRecord($id);
			$orderData->images = $this->db->fetchOrderImages($id);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
		return $orderData;
	}

	public function getAllOrderDates() {
		$dates = array();
		try {
			$dates = $this->db->getAllOrderDates();
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
		return $dates;
	}

	public function updateOrder($data) {
		try {
			$this->db->updateRecord($this->prepareOrderData($data));
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
	}

	public function deleteOrder($id) {
		try {
			$this->db->deleteRecord($id);
		} catch (Exception $ex) {
			$this->HandleException($ex);
		}
	}

	/**
	 * @param $data
	 * @return Order
	 */
	private function prepareOrderData($data) {
		$order = new Order();
		$order->datumPorucivanja = isset($data->datumPorucivanja) ? $data->datumPorucivanja : "";
		$order->datumTransakcije = isset($data->datumTransakcije) ? $data->datumTransakcije : "";
		$order->idPorudzbine = isset($data->idPorudzbine) ? $data->idPorudzbine : "";
		$order->napomena = isset($data->napomena) ? $data->napomena : "";
		return $order;
	}
} 