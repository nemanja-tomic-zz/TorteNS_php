<?php
require_once "dbClass.php";
try
{
	$db = new Database();
	$db->connect();
	
	$query = "SELECT * FROM grupa";
	
	if (!$result = mysql_query($query))
		throw new Exception("Neuspeli upit nad bazom: ".mysql_error());
	
	$data = Array();
	$json = Array();
	while($row = $db->fetch($result))
	{
		$data['id'] = $row['idGrupe'];
		$data['naziv'] = $row['naziv'];
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