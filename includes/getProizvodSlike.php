<?php
require_once 'dbClass.php';

try
{
	$idProizvoda = $_POST['idProizvoda'];
	$db = new Database();
	$db->connect();
	
	$query = "SELECT * FROM slikeproizvod INNER JOIN slike 
					ON slikeproizvod.idSlike = slike.idSlike
					WHERE idProizvoda = '".$idProizvoda."'";
					
	if(!$result = mysql_query($query))
		throw new Exception("Neuspesno vracanje slika iz baze: ".mysql_error());
	if (mysql_num_rows($result) == 0)
		throw new Exception("Ne postoje slike za izabrani proizvod.");
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
	$response = $ex->getMessage();
}
echo $response;

?>