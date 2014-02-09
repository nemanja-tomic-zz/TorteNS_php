<?php
require_once 'dbClass.php';

	try
	{
		$id = $_POST['id'];
		$db = new Database();
		$db->connect();
	
		$query = "SELECT * FROM klijent WHERE idklijenta = '".$id."'";
	
		if (!$result = mysql_query($query))
			throw new Exception("Neuspelo izvrsavanje upita nad bazom: ".mysql_error());
	
		$data = Array();
	
		while ($row = $db->fetch($result))
		{
			$data['ime'] = trim($row['ime']);
			$data['prezime'] = trim($row['prezime']);
			$data['adresa'] = $row['adresa'];
			$data['telefon'] = $row['telefon'];
			$data['telefon2'] = $row['telefon2'];
			$data['email'] = $row['email'];
			$data['fblink'] = $row['fblink'];
			$data['napomene'] = $row['napomene'];
			$data['status'] = $row['status'];
		}
		$response = json_encode($data);
		$db->close();
	}
	catch(Exception $ex)
	{
		$db->close();
		$response = $ex->getMessage();
	}


	
echo $response;
?>