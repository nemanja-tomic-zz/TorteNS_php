<?php
//zahteva podatke za filtriranje ILI idPorudzbine ILI nista, a vraca podatke o porudzbinama u JSON formatu
require_once 'dbClass.php';
try
{
		$pom = false;	//proverava da li rezultat kverija sadrzi id grupe proizvoda
		$datum = Date('Y/m/d');
		if (isset($_POST['data']))
		{
			$porudzbina = $_POST['data'];
			$query = "SELECT * FROM porudzbine INNER JOIN (proizvod, klijent)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda AND porudzbine.idKlijenta = klijent.idKlijenta)
				WHERE datumTransakcije >= '".$datum."'
				AND naziv LIKE '%".$porudzbina['naziv']."%' 
				AND cena LIKE '".$porudzbina['cena']."%'
				AND CONCAT(ime,prezime) LIKE '%".$porudzbina['ime']."%'
				AND napomena LIKE '%".$porudzbina['napomena']."%'
				ORDER BY datumTransakcije ASC";
		}
		elseif (isset($_POST['id']))
		{
			$query = "SELECT proizvod.naziv, proizvod.cena, porudzbine.napomena, porudzbine.idKlijenta, porudzbine.idProizvoda, porudzbine.idPorudzbine, klijent.ime, klijent.prezime, porudzbine.datumTransakcije, grupa.naziv AS nazivGrupe
			FROM porudzbine AS porudzbine INNER JOIN (proizvod AS proizvod, klijent AS klijent, grupa AS grupa)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda 
				AND porudzbine.idKlijenta = klijent.idKlijenta 
				AND proizvod.idGrupe = grupa.idGrupe) 
				WHERE idPorudzbine = '".$_POST['id']."'";
			$pom = true;
		}
		elseif (isset($_POST['idKlijenta']))
		{
			$query = "SELECT * FROM porudzbine INNER JOIN (proizvod, klijent)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda AND porudzbine.idKlijenta = klijent.idKlijenta)  
				WHERE datumTransakcije >= '".$datum."' AND porudzbine.idKlijenta = '".$_POST['idKlijenta']."'
				ORDER BY datumTransakcije ASC";
		}
		elseif (isset($_POST['idKlijentaStare']))
		{
			$query = "SELECT * FROM porudzbine INNER JOIN (proizvod, klijent)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda AND porudzbine.idKlijenta = klijent.idKlijenta)  
				WHERE datumTransakcije < '".$datum."' AND porudzbine.idKlijenta = '".$_POST['idKlijentaStare']."'
				ORDER BY datumTransakcije ASC";
		}
		else
			$query = "SELECT * FROM porudzbine INNER JOIN (proizvod, klijent)
				ON (porudzbine.idProizvoda = proizvod.idProizvoda AND porudzbine.idKlijenta = klijent.idKlijenta)  
				WHERE datumTransakcije >= '".$datum."' 
				ORDER BY datumTransakcije ASC";
				
		$db = new DbHandler();
		$db->connect();
			if(!$result = mysql_query($query))
				throw new Exception("Neuspeli upit nad bazom: ".mysql_error());
			
			if (mysql_num_rows($result) == 0)
				throw new Exception("No data returned.");
		
			$data = Array();
			$jsonArray = Array();
			if ($pom == true)
			{
				while($row = $db->fetch($result))
				{
					$data['naziv'] = $row['naziv'];
					$data['cena'] = $row['cena'];
					$data['napomena'] = $row['napomena'];
					$data['idKlijenta'] = $row['idKlijenta'];
					$data['idProizvoda'] = $row['idProizvoda'];
					$data['idPorudzbine'] = $row['idPorudzbine'];
					$data['ime'] = $row['ime'];
					$data['prezime'] = $row['prezime'];
					$data['datum'] = $row['datumTransakcije'];
					$data['nazivGrupe'] = $row['nazivGrupe'];
					$jsonArray[] = $data;
				}
				$response = json_encode($jsonArray);
				$db->close();
				$pom = false;
			}
			else
			{
				while($row = $db->fetch($result))
				{
					$data['naziv'] = $row['naziv'];
					$data['cena'] = $row['cena'];
					$data['napomena'] = $row['napomena'];
					$data['idKlijenta'] = $row['idKlijenta'];
					$data['idProizvoda'] = $row['idProizvoda'];
					$data['idPorudzbine'] = $row['idPorudzbine'];
					$data['ime'] = $row['ime'];
					$data['prezime'] = $row['prezime'];
					$data['datum'] = $row['datumTransakcije'];
					$jsonArray[] = $data;
				}
				$response = json_encode($jsonArray);
				$db->close();
			}
}
catch(Exception $ex)
{
		$db->close();
		$response = $ex->getMessage();
	}
echo $response;
?>