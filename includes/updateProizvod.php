<?php
require_once "dbClass.php";
try
{
	$proizvodData = $_POST['data'];
	$db = new DbHandler();
	$db->connect();
	
	$query = "UPDATE proizvod SET
			naziv = '".$proizvodData['naziv']."',
			cena = '".$proizvodData['cena']."',
			opis = '".$proizvodData['opis']."',
			kolicina = '".$proizvodData['kolicina']."',
			tezina = '".$proizvodData['tezina']."'
			WHERE idProizvoda = '".$proizvodData['idProizvoda']."'";
			
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