<?php
require_once 'dbClass.php';

try
{
	$idProizvoda = $_POST['id'];

	$db = new DbHandler();
	$db->connect();
	
	$query = "DELETE FROM proizvod WHERE idProizvoda = '".$idProizvoda."'";
	if (!mysql_query($query))
		throw new Exception("Greska prilikom brisanja proizvoda iz baze: ".mysql_error());
	
	$db->close();
	$response = "<span class='uspeh'>Uspesno ste obrisali proizvod.</span>";
}
catch(Exception $ex)
{
	$db->close();
	$response = "<span class='neuspeh'>".$ex->getMessage()."</span>";
}
echo $response;
?>