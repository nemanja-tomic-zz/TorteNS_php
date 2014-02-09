<?php
require_once 'dbClass.php';

	try
	{
		$datum = $_POST['datum'];
		$db = new Database();
		$db->connect();
	
		$query = "SELECT * FROM porudzbine INNER JOIN (proizvod, klijent)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda AND porudzbine.idKlijenta = klijent.idKlijenta)
				WHERE porudzbine.datumTransakcije = '".$datum."'";
	
		if (!$result = mysql_query($query))
			throw new Exception("Neuspelo izvrsavanje upita nad bazom: ".mysql_error());
		if (mysql_num_rows($result) == 0)
			throw new Exception("Nema zakazanih porudzbina za taj datum.");
		$data = Array();
		$json = Array();
		while ($row = $db->fetch($result))
		{
			$data['naziv'] = $row['naziv'];
			$data['idPorudzbine'] = $row['idPorudzbine'];
			$data['idProizvoda'] = $row['idProizvoda'];
			$data['napomena'] = $row['napomena'];
			$data['cena'] = $row['cena'];
			$data['ime'] = $row['ime'];
			$data['prezime'] = $row['prezime'];
			$json[] = $data;
		}
		$response = json_encode($json);
		$db->close();
	}
	catch(Exception $ex)
	{
		$db->close();
		$response = $ex->getMessage();
	}


	
echo $response;
?>