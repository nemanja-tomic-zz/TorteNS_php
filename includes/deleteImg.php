<?php
//zahteva idSlike, brise sliku sa tim id-om iz baze i sa hard diska
require_once 'dbClass.php';
function deleteImg($idImg)
{
try
{
	

	$db = new Database();
	$db->connect();
	
	$select = "select * from slike where idSlike = '".$idImg."'";
	if(!$result = mysql_query($select))
		throw new Exception("Greska! ".mysql_error());
	
	$row = $db->fetch($result);
	$naziv = $row['naziv'];
	$putanja = $row['putanja'];
	
	if (!unlink("../uploads/".$putanja."/".$naziv))
		throw new Exception("Neuspelo brisanje slike sa diska.");
	
	$query = "DELETE FROM slike WHERE idSlike = '".$idImg."'";
	if (!mysql_query($query))
		throw new Exception("Greska prilikom brisanja slike iz baze: ".mysql_error());
	
	$db->close();
	$response = "<span class='uspeh'>Uspesno ste obrisali sliku.</span>";
}
catch(Exception $ex)
{
	$db->close();
	$response = "<span class='neuspeh'>".$ex->getMessage()."</span>";
}
return $response;
}
$idImg = $_POST['id'];
echo deleteImg($idImg);
?>