<?php
require_once 'dbClass.php';

try
	{
		if (isset($_POST['ime']))
			$ime = $_POST['ime'];
		if (isset($_POST['prezime']))
			$prezime = $_POST['prezime'];
		if (isset($_POST['email']))
			$email = $_POST['email'];
		if (isset($_POST['telefon']))
			$telefon = $_POST['telefon'];
			
		$query = "SELECT * FROM klijent WHERE ime LIKE '".$ime."%' AND prezime LIKE '".$prezime."%'
				AND email LIKE '".$email."%' AND telefon LIKE '".$telefon."%'";
		
		$db = new Database();
		$db->connect();
		
		if(!$result = mysql_query($query))
			throw new Exception("Neuspeli upit nad bazom: ".mysql_error());
			
		if (mysql_num_rows($result) == 0)
			throw new Exception("No data returned.");
		
		$data = Array();
		$jsonArray = Array();
		while($row = $db->fetch($result))
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
			$data['idKlijenta'] = $row['idKlijenta'];
			$jsonArray[] = $data;
		}
		$response = json_encode($jsonArray);
		$db->close();
	}
	catch(Exception $ex)
	{
		$db->close();
		$response = $ex->getMessage();
	}
echo $response;
?>