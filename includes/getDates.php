<?php
require_once 'dbClass.php';

try
{
	$db = new Database();
	$db->connect();
	
	$query = "SELECT datumTransakcije FROM porudzbine";
					
	if(!$result = mysql_query($query))
		throw new Exception("Neuspeli upit nad bazom: ".mysql_error());
	$niz = Array();
	$jsonArray = Array();
	while($row = $db->fetch($result))
	{
		$ceoDatum = $row['datumTransakcije'];
		$godina = date("Y",strtotime($ceoDatum));
		$mesec = date("m",strtotime($ceoDatum));
		$dan = date("d",strtotime($ceoDatum));
		$niz['godina'] = $godina;
		$niz['mesec'] = $mesec;
		$niz['dan'] = $dan;
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