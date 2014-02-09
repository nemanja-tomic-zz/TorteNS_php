<?php
require_once "dbClass.php";
try
{
	$userData = $_POST['data'];
	$db = new Database();
	$db->connect();
	
	if (!isset($userData['status']))
		$userData['status'] = 0;
	
	$query = "UPDATE klijent SET
			ime = '".$userData['ime']."',
			prezime = '".$userData['prezime']."',
			telefon = '".$userData['telefon']."',
			telefon2 = '".$userData['telefon2']."',
			adresa = '".$userData['adresa']."',
			email = '".$userData['email']."',
			fblink = '".$userData['fblink']."',
			napomene = '".$userData['napomene']."',
			status = '".$userData['status']."' 
			WHERE idKlijenta = '".$userData['id']."'";
			
	if (!mysql_query($query))
		throw new Exception("Doslo je do greske prilikom azuriranja podataka: ".mysql_error());
	if (mysql_affected_rows() > 0)
		$response = "Uspesno ste izmenili podatke.";
	else
		$response = "Zero rows affected";
	$db->close();
}
catch(Exception $ex)
{
	$db->close();
	$response = $ex->getMessage();
}
echo $response;
?>