<?php

//error_reporting(0);
class Database
{
	private $server = "localhost";
	private $username = "root";
	private $password = "";
	public $con = null;
	
	public function connect()
	{
			if (!$con = mysql_connect($this->server, $this->username, $this->password))
				throw new Exception("Neuspela konekcija sa bazom podataka: ".mysql_error());
			if(!mysql_select_db("TorteDB", $con))
				throw new Exception("Ne postoji birana baza podataka na serveru.");
			$this->con = $con;
			return $this->con;
	}
	public function close()
	{
		return mysql_close($this->con);
	}
	public function fetch($result)
	{
		return mysql_fetch_assoc($result);
	}
	
}
?>