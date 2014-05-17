<?php
include('dbClass.php');
require_once 'insertProizvod.php';

function uploadImg($image, $tip)
{
$dbObject = new DbHandler();


	try
	{
	$time = time();										//uzimamo unix timestamp
	$name = (string)$time;								//dodeljujemo timestamp imenu fajla
	$niz = explode('.', $image['name']);				//parsiramo extenziju iz imena postovane slike
	$name .= ".".end($niz);								//dodajemo extenziju na kraj imena
	$dbObject->connect();								//
	$TARGET_PATH = "../uploads/".$tip."/";				//kompletiramo putanju i naziv fajla
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
if (($_POST['naziv']) == '')
	echo "<span class='neuspeh'>Morate popuniti polje sa nazivom.</span>";
else
{
	$proizvod['naziv'] = $_POST['naziv'];
	if (isset($_POST['kolicina']))
		$proizvod['kolicina'] = $_POST['kolicina'];
	if (isset($_POST['tezina']))
		$proizvod['tezina'] = $_POST['tezina'];
	$proizvod['cena'] = $_POST['cena'];
	$proizvod['opis'] = $_POST['opis'];
	$proizvod['type'] = $_POST['tip'];

	if ($_FILES['slika']['name'] <> "")
	{	
		$img = $_FILES['slika'];
		$b = uploadimg($img, $proizvod['type']);
		if (is_int($b))
		{
			$a = insertProizvod($proizvod);
			if (is_int($a))
			{
				$c = insertSlikeProizvod($b, $a);
				echo $c;
			}
			else
				echo $a;
		}
		else
			echo $b;
	}
	else
	{
		$a = insertProizvod($proizvod);
		if (is_int($a))
			echo "<span class='uspeh'>Uneti podaci o proizvodu, bez slike.</span>";
		else
			echo $a;
	}


}

?>