$(document).ready(function(){
	$("#submit").bind("click", insertUser);
});

function insertUser(){
var conf = confirm("Da li ste sigurni da zelite da registrujete klijenta?");
	if (conf == true)
	{
		userData = {
            ime : $("#ime").val(),
            prezime : $("#prezime").val(),
            telefon : $("#telefon").val(),
            telefon2 : $("#telefon2").val(),
            email : $("#email").val(),
            fblink : $("#fblink").val(),
            adresa : $("#adresa").val(),
            napomene : $("#napomena").val(),
            status : $('input:radio[name=status]:checked').val()
        };


		if(userData.ime != '')
		{
			$.post("includes/api.php", {action: "insertClient", data: JSON.stringify(userData)}, function(data){
                var response = JSON.parse(data);
				$("#dada").html(response.message);
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
	
