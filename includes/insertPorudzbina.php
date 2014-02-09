<?php
require_once 'dbClass.php';
function insertPorudzbina($data)
{
try
{
	$db = new Database();
	$db->connect();
	
	$now = date('Y-m-d');
	
	$query = "INSERT INTO porudzbine (datumPorucivanja, idKlijenta, idProizvoda, napomena, datumTransakcije) 
			VALUES ('".$now."', '".$data['idKlijenta']."', '".$data['idProizvoda']."','"
			.$data['napomena']."', '".$data['datumTransakcije']."')";

		if (!mysql_query($query))
			throw new Exception("Neuspeli unos proizvoda: ".mysql_error());
		$response = mysql_insert_id();
		$db->close();
}
catch(Exception $ex)
{
	$response = "<span class='neuspeh'>".$ex->getMessage()."</span>";
	$db->close();
}
return $response;
}
$podaci = $_POST['data'];
echo insertPorudzbina($podaci);

?>