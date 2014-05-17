<?php
require_once 'dbClass.php';
$userData = $_POST['data'];
if (!isset($userData['status']))
		$userData['status'] = 0;
try
{
	$db = new DbHandler();
	$db->connect();
	if (($userData['telefon']) <> "")
	{	
		$check = "select * from klijent where telefon = '".$userData['telefon']."'";
		if (!$result = mysql_query($check))
			throw new Exception("Javila se greska: ".mysql_error());
	
		if (mysql_num_rows($result) <> 0)
			throw new Exception("Vec postoji klijent sa tim brojem telefona u bazi podataka");
		//$userData['rating'] = floatval($userData['rating']);		rejting zamenjen statusom (radio umesto slajdera)
		$trimedIme = trim($userData['ime']);
		$trimedPrezime = trim($userData['prezime']);
		$query = "INSERT INTO klijent (ime, prezime, telefon, telefon2, email, fblink, adresa, napomene, status) 	VALUES ('".$trimedIme."', '".$trimedPrezime."', '".$userData['telefon']."','".$userData['telefon2']."', '".$userData['email']."', '".$userData['fblink']."', '".$userData['adresa']."', '".$userData['napomene']."', '".$userData['status']."')";
		if (!mysql_query($query))
			throw new Exception("Neuspela registracija korisnika: ".mysql_error());
		$response = "Uspesno ste registrovali klijenta pod rednim brojem: ".mysql_insert_id();
		$db->close();
	}
	else
	{
		//$userData['rating'] = floatval($userData['rating']);
		$trimedIme = trim($userData['ime']);
		$trimedPrezime = trim($userData['prezime']);
		$query = "INSERT INTO klijent (ime, prezime, telefon, telefon2, email, fblink, adresa, status, napomene) 	VALUES ('".$trimedIme."', '".$trimedPrezime."', '".$userData['telefon']."','".$userData['telefon2']."', '".$userData['email']."', '".$userData['fblink']."', '".$userData['adresa']."', '".$userData['status']."', '".$userData['napomene']."')";
		if (!mysql_query($query))
			throw new Exception("Neuspela registracija korisnika: ".mysql_error());
		$response = "Uspesno ste registrovali klijenta pod rednim brojem: ".mysql_insert_id();
		$db->close();
	}
}
catch(Exception $ex)
{
	$response = $ex->getMessage();
	$db->close();
}
echo $response;
?>