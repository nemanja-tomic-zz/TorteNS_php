<?php
require_once "dbClass.php";
try
{
	$porudzbinaData = $_POST['data'];
	$db = new Database();
	$db->connect();
	
		$query = "UPDATE porudzbine SET
			napomena = '".$porudzbinaData['napomena']."',
			datumTransakcije = '".$porudzbinaData['datum']."'
			WHERE idPorudzbine = '".$porudzbinaData['idPorudzbine']."'";

			
	if (!mysql_query($query))
		throw new Exception("Doslo je do greske prilikom azuriranja podataka: ".mysql_error());
	if (mysql_affected_rows() > 0)
		$response = "<span class='uspeh'>Uspesno ste izmenili podatke.</span>";
	else
		$response = "<span class='neuspeh'>Zero rows affected</span>";
	$db->close();
}
catch(Exception $ex)
{
	$db->close();
	$response = "<span class='uspeh'>".$ex->getMessage()."</span>";
}
echo $response;
?>