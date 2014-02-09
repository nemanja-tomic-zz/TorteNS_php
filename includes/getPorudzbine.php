<?php
require_once 'dbClass.php';
//vraca kompletne podatke o prvih 10 porudzbina koje slede u odnosu na trenutni datum


try
	{
		$db = new Database();
		$db->connect();
		$date = Date("Y/m/d");
		$endDate = date('Y/m/d', strtotime("+7 days"));
		
		$query = "SELECT sve.ime, sve.prezime, sve.telefon, sve.telefon2,
				sve.idPorudzbine, sve.idKlijenta, sve.idProizvoda, sve.napomena, sve.datumTransakcije,
				sve.naziv AS nazivProizvoda, sve.cena, sve.idGrupe,
				sli.naziv AS nazivSlike, sli.putanja, sli.idSlike
				FROM (SELECT kli.ime, kli.prezime, kli.telefon, kli.telefon2,
				por.idPorudzbine, por.idKlijenta, por.idProizvoda, por.napomena, por.datumTransakcije,
				pro.naziv, pro.cena, pro.idGrupe
				FROM porudzbine AS por
				INNER JOIN (proizvod AS pro, klijent AS kli)
				ON (por.idProizvoda = pro.idProizvoda AND por.idKlijenta = kli.idKlijenta)
				WHERE por.datumTransakcije BETWEEN '".$date."' AND '".$endDate."') AS sve
				LEFT JOIN (slikeproizvod AS slipro, slike AS sli)
				ON (sve.idProizvoda = slipro.idProizvoda AND slipro.idSlike = sli.idSlike)
				GROUP BY sve.idPorudzbine ORDER BY sve.datumTransakcije ASC";
		
		if(!$result = mysql_query($query))
			throw new Exception("Neuspeli upit nad bazom: ".mysql_error());
			
		if (mysql_num_rows($result) == 0)
			throw new Exception("Nema zakazanih porudzbina.");
		
		$data = Array();
		$jsonArray = Array();
		while($row = $db->fetch($result))
		{
			$data['ime'] = $row['ime'];
			$data['prezime'] = $row['prezime'];
			$data['telefon'] = $row['telefon'];
			$data['telefon2'] = $row['telefon2'];
			$data['idPorudzbine'] = $row['idPorudzbine'];
			$data['idKlijenta'] = $row['idKlijenta'];
			$data['idProizvoda'] = $row['idProizvoda'];
			$data['napomena'] = $row['napomena'];
			$data['nazivProizvoda'] = $row['nazivProizvoda'];
			$data['cena'] = $row['cena'];
			$data['idGrupe'] = $row['idGrupe'];
			$data['napomena'] = $row['napomena'];
			$data['nazivSlike'] = $row['nazivSlike'];
			$data['putanja'] = $row['putanja'];
			$data['datumTransakcije'] = Date('d.m.Y.', strtotime($row['datumTransakcije']));
			$data['datum'] = Date('d', strtotime($row['datumTransakcije']));
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