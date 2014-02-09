<?php
require_once 'dbClass.php';
//	zahteva idPorudzbine (int), vraca sve slike vezane za tu porudzbinu u JSON formatu
try
{
	$idPorudzbine = $_POST['idPorudzbine'];
	$db = new Database();
	$db->connect();
	
	$query = "SELECT * FROM slikePorudzbine INNER JOIN slike 
					ON slikePorudzbine.idSlike = slike.idSlike
					WHERE idPorudzbine = '".$idPorudzbine."'";
					
	if(!$result = mysql_query($query))
		throw new Exception("Neuspesno vracanje slika iz baze: ".mysql_error());
	$niz = Array();
	$jsonArray = Array();
	while($row = $db->fetch($result))
	{
		$niz['putanja'] = $row['putanja'];
		$niz['naziv'] = $row['naziv'];
		$niz['idSlike'] = $row['idSlike'];
		$niz['velicina'] = $row['velicina'];
		$niz['tip'] = $row['tip'];
		$jsonArray[] = $niz;
	}
	$response = json_encode($jsonArray);
	$db->close();
}
catch(Exception $ex)
{
	$db->close();
	$response = "<span class='neuspeh'>".$ex->getMessage()."</span>";
}
echo $response;

?>