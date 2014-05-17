<?php
// zahteva nista ILI podatke za filtriranje ILI idProizvoda, vraca JSON sa podacima o proizvodima/proizvodu
require_once 'dbClass.php';
function getGroup($naziv)
{
	$db = new DbHandler();
	$db->connect();
	
	$query = "select * from grupa where naziv = '".$naziv."'";
	
	$result = mysql_query($query);
	$row = $db->fetch($result);
	$id = $row['idGrupe'];
	$db->close();
	return $id;
}

try
	{
		if (isset($_POST['grupa']))
			$grupa = getGroup($_POST['grupa']);
		if (isset($_POST['data']))
		{
			$proizvod = $_POST['data'];
			$query = "SELECT * FROM proizvod WHERE idGrupe = '".$grupa."' 
				AND naziv LIKE '%".$proizvod['naziv']."%' 
				AND cena LIKE '".$proizvod['cena']."%'
				AND opis LIKE '%".$proizvod['opis']."%'";
		}
		elseif (isset($_POST['id']))
		{
			$query = "SELECT * FROM proizvod WHERE idProizvoda = '".$_POST['id']."'";
		}
		else
			$query = "SELECT * FROM proizvod WHERE idGrupe = '".$grupa."'";
			
		
		
		$db = new DbHandler();
		$db->connect();
			if(!$result = mysql_query($query))
				throw new Exception("Neuspeli upit nad bazom: ".mysql_error());
			
			if (mysql_num_rows($result) == 0)
				throw new Exception("No data returned.");
		
			$data = Array();
			$jsonArray = Array();
			while($row = $db->fetch($result))
			{
				$data['naziv'] = $row['naziv'];
				$data['cena'] = $row['cena'];
				$data['tezina'] = $row['tezina'];
				$data['opis'] = $row['opis'];
				$data['kolicina'] = $row['kolicina'];
				$data['idProizvoda'] = $row['idProizvoda'];
				$data['idGrupe'] = $row['idGrupe'];
				$query2 = "SELECT * FROM slikeproizvod AS slipro
						INNER JOIN slike AS sli
						ON slipro.idSlike = sli.idSlike
						WHERE slipro.idProizvoda = '".$row['idProizvoda']."'";
				if (!$result2 = mysql_query($query2))
					throw new Exception("Neuspelo citanje slika: ".mysql_error());
				$row2 = $db->fetch($result2);
				$data['nazivSlike'] = $row2['naziv'];
				$data['idSlike'] = $row2['idSlike'];
				$data['putanja'] = $row2['putanja'];
				$jsonArray[] = $data;
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