<?php
require_once 'dbClass.php';
function insertProizvod($product)
{
try
{
	$db = new DbHandler();
	$db->connect();
	//automatsko uzimanje vrednosti idgrupe iz tabele grupa
	if (!isset($product['kolicina']))
		$product['kolicina'] = "";
	if (!isset($product['tezina']))
		$product['tezina'] = "";
		
	$typeQ = "SELECT * FROM grupa WHERE naziv = '".$product['type']."'";
	if (!$result = mysql_query($typeQ))
		throw new Exception("Javila se greska: ".mysql_error());
	if (mysql_num_rows($result) == 0)
		throw new Exception("Ne postoji takva grupa proizvoda u bazi podataka. ".mysql_error());
	$row = $db->fetch($result);
	$type = $row['idGrupe'];
	/////////////////////////////////////////////////////////
	
	if ($product['type'] = "torte")
		$check = "SELECT * FROM proizvod WHERE naziv = '".$product['naziv']."' 
				AND tezina = '".$product['tezina']."'";
	else
		$check = "SELECT * FROM proizvod WHERE naziv = '".$product['naziv']."' 
				AND kolicina = '".$product['kolicina']."'";
				
	$query = "INSERT INTO proizvod (naziv, cena, tezina, opis, kolicina, idGrupe) 
			VALUES ('".$product['naziv']."', '".$product['cena']."', '".$product['tezina']."','"
			.$product['opis']."', '".$product['kolicina']."', '".$type."')";
	
	if (!$resultChk = mysql_query($check))
		throw new Exception("Javila se greska: ".mysql_error());
	
	if (mysql_num_rows($resultChk) <> 0)
		throw new Exception("Vec postoji takav proizvod u bazi podataka");	//greska ukoliko vec postoji
	else
	{
		if (!mysql_query($query))
			throw new Exception("Neuspeli unos proizvoda: ".mysql_error());
		$response = mysql_insert_id();
		$db->close();
	}
}
catch(Exception $ex)
{
	$response = "<span class='neuspeh'>".$ex->getMessage()."</span>";
	$db->close();
}
return $response;
}
function insertSlikeProizvod($a, $b)
{
	try
	{	
		$db = new DbHandler();
		$db->connect();
		
		$query = "INSERT INTO slikeproizvod (idSlike, idProizvoda)
				VALUES ('".$a."', '".$b."')";
				
		if (!mysql_query($query))
			throw new Exception("Greska pri upitu nad bazom. ".mysql_error());
		
		$response = "<span class='uspeh'>Uspesno uneseno.</span>";
	}
	catch(Exception $ex)
	{
		$db->close();
		$response = "<span class='neuspeh'>".$ex->getMessage()."</span>";
	}
	return $response;
}
?>