<?php
require_once 'dbClass.php';

try
{
	$idPorudzbine = $_POST['id'];

	$db = new Database();
	$db->connect();
	
	$query = "DELETE FROM porudzbine WHERE idPorudzbine = '".$idPorudzbine."'";
	$slikeQ = "SELECT * FROM slikeporudzbine
			INNER JOIN slike ON slikeporudzbine.idSlike = slike.idSlike
			WHERE idPorudzbine = '".$idPorudzbine."'";
	if (!$result = mysql_query($slikeQ))
		throw new Exception("Greska u bazi podataka: ".mysql_error());
	
	while($row = $db->fetch($result))
	{
		if(!mysql_query("DELETE FROM slike WHERE idSlike = '".$row['idSlike']."'"))
			throw new Exception("Greska prilikom brisanja slike iz baze podataka: ".mysql_error());
			
		$naziv = $row['naziv'];
		$putanja = $row['putanja'];
	
		if (!unlink("../uploads/".$putanja."/".$naziv))
			throw new Exception("Neuspelo brisanje slike sa hard diska.");
	}
		
	if (!mysql_query($query))
		throw new Exception("Greska prilikom brisanja porudzbne iz baze: ".mysql_error());
	
	
	$db->close();
	$response = "<span class='uspeh'>Uspesno ste obrisali porudzbinu.</span>";
}
catch(Exception $ex)
{
	$db->close();
	$response = "<span class='neuspeh'>".$ex->getMessage()."</span>";
}
echo $response;
?>