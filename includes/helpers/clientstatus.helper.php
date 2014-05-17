<?php
/**
 * Enumerates all clients' statuses from Edita's point of view :)
 */
class ClientStatus {
	const Neocenjen = 0;
	const Nikako = 1;
	const Izbegavati = 2;
	const Ok = 3;
	const Super = 4;

	/**
	 * Returns constant name as string for provided constant value.
	 *
	 * @param $constantValue int
	 * @return string
	 */
	public static function GetConstantName($constantValue) {
		$reflected = new ReflectionClass(__CLASS__);
		$constants = $reflected->getConstants();
		$returnValue = "Undefined";

		foreach ($constants as $key => $value) {
			if ($value == $constantValue) {
				$returnValue = $key;
				break;
			}
		}
		return $returnValue;
	}
} 