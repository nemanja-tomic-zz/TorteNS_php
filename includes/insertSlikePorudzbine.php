<?php
include('dbClass.php');

function uploadImg($image, $tip)
{
$dbObject = new Database();


	try
	{
	$time = time();										//uzimamo unix timestamp
	$name = (string)$time;								//dodeljujemo timestamp imenu fajla
	$niz = explode('.', $image['name']);				//parsiramo extenziju iz imena postovane slike
	$name .= ".".end($niz);								//dodajemo extenziju na kraj imena
	$dbObject->connect();								//
		$TARGET_PATH = "../uploads/".$tip."/";			//kompletiramo putanju i naziv fajla
		$TARGET_PATH .= $name;
		$size = $image['size'];
		
		if (!is_valid_type($image))
			throw new Exception("Slika nije u odgovarajucem formatu. Molimo izaberte jpg, bmp, gif ili png format.");
		if($size>(2048*1024))
			throw new Exception("Slika mora biti manja od 2MB.");
		if (file_exists($TARGET_PATH))
			throw new Exception("Vec postoji slika sa tim imenom.");
		
		if (!move_uploaded_file($image['tmp_name'], $TARGET_PATH))
			throw new Exception("Upload fajla nije uspeo,proveriti read/write dozvole.");

		
		
		$query = "insert into slike (naziv, velicina, tip, putanja) 
				values ('".$name."', '".$size."', '".$image['type']."', '".$tip."')";
		if(!$result = mysql_query($query))
			throw new Exception ("Neuspeli upit nad bazom: " . mysql_error());
		$response = mysql_insert_id();
		$dbObject->close();
	}
	catch(Exception $ex)
	{
		$dbObject->close();
		$response = "<span class='neuspeh'>".$ex->getMessage()."</span>";
	}
	return $response;	
}
function is_valid_type($file)
{
	// Niz koji sadrzi listu dozvoljenih ekstenzija
	$valid_types = array("jpg", "png", "gif", "bmp");
	$name = strtolower ( $file['name'] );
	list($txt, $ext) = explode(".", $name);
	if(in_array($ext,$valid_types))
	{
		return true;
	}
	else
	{
		return false;
	}
}
function insertSlikePorudzbine($a, $b)
{
	try
	{	
		$db = new Database();
		$db->connect();
		
		$query = "INSERT INTO slikeporudzbine (idSlike, idPorudzbine)
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

if ($_FILES['imgFile']['name'] <> "")
{
	$img = $_FILES['imgFile'];
	$idPorudzbine = $_POST['idPorudzbineHidden'];
	$type = $_POST['tipHidden'];
	
	$a = uploadImg($img, $type);
	if (is_int($a))
	{
		echo insertSlikePorudzbine($a, $idPorudzbine);
	}
	else
		echo $a;	
}
else
{
	echo "<span class='neuspeh'>Molimo izaberite sliku za upload.</span>";
}
?>