$(document).ready(function(){
	$("#submit").bind("click", insertUser);
});

function insertUser(){
var conf = confirm("Da li ste sigurni da zelite da registrujete klijenta?");
	if (conf == true)
	{
		userData=new Object();
		userData.ime = $("#ime").val();
		userData.prezime = $("#prezime").val();
		userData.telefon = $("#telefon").val();
		userData.telefon2 = $("#telefon2").val();
		userData.email = $("#email").val();
		userData.fblink = $("#fblink").val();
		userData.adresa = $("#adresa").val();
		userData.napomene = $("#napomena").val();
		userData.status = $('input:radio[name=status]:checked').val();
	
		if(userData.ime != '')
		{
			$.post("includes/insertUser.php", {data:userData}, function(data){
				$("#dada").html(data);
			});
		}
		else
		{
			alert("Morate popuniti polje sa imenom klijenta.");
		}
	}
	
}

$(function() {
		$( "#slider-range-min" ).slider({
			range: "min",
			value: 0,
			min: 0,
			max: 10,
			step: 0.5,
			slide: function( event, ui ) {
				$( "#rating" ).val(ui.value );
			}
		});
		$( "#rating" ).val( $( "#slider-range-min" ).slider( "value" ) );
	});
	
