<?php
/**
 * Created by PhpStorm.
 * User: Nemanja
 * Date: 5/19/14
 * Time: 5:53 PM
 */

class GroupController extends BaseController {
	public function __construct(ConfigManager $config) {
		parent::__construct($config);
		$this->db = new GroupDb($config);
	}

	/**
	 * Returns group name by provided groupId.
	 * If no groups are found by provided ID, exception is thrown.
	 *
	 * @param $groupId int
	 * @return Group
	 */
	public function getGroupName($groupId) {
		$groupModel = new Group();
		try {
			$groupModel = $this->db->getRecord($groupId);
		} catch(Exception $ex) {
			$this->HandleException($ex);
		}
		return $groupModel;
	}
} 