<?php
require_once 'dbClass.php';

try {
	$idKlijenta = $_POST ['id'];
	
	$db = new DbHandler ();
	$db->connect ();
	
	$query = "DELETE FROM klijent WHERE idKlijenta = '" . $idKlijenta . "'";
	if (! mysql_query ( $query ))
		throw new Exception ( "Greska prilikom brisanja klijenta iz baze: " . mysql_error () );
	
	$db->close ();
	$response = "Uspesno ste obrisali klijenta.";
} catch ( Exception $ex ) {
	$db->close ();
	$response = $ex->getMessage ();
}
echo $response;
?>