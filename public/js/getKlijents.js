$(document).ready(function(){
	getKlijents();
	$(".fieldset").hide();	
	$("#filterIme").bind("keyup", getKlijents);
	$("#filterPrezime").bind("keyup", getKlijents);
	$("#filterEmail").bind("keyup", getKlijents);
	$("#filterTelefon").bind("keyup", getKlijents);
	$("#poruci").bind('click', function(){
		window.location.replace("unosPorudzbine.html");
	});
	$("#aktuelne").bind('click', function(){
		window.location.replace("klijentPorudzbine.html");
	});
	$("#history").bind('click', function(){
		window.location.replace("klijentHistory.html");
	});
});

function popupInit(id)
{
	
$(".fieldset").show();
getData(id);

$( "#dialog-form" ).dialog({
			autoOpen: true,
			height: 700,
			width: 700,
			modal: true,	//da se zatamni ostatak stranice
			buttons: {
				"Izmeni podatke": function() {
					var klijentData = new Object();
					klijentData.ime = $("#ime").val();
					userData=new Object();
					userData.id = id;
					userData.ime = $("#ime").val();
					userData.prezime = $("#prezime").val();
					userData.telefon = $("#telefon").val();
					userData.telefon2 = $("#telefon2").val();
					userData.email = $("#email").val();
					userData.fblink = $("#fblink").val();
					userData.adresa = $("#adresa").val();
					userData.napomene = $("#napomene").val();
					//userData.rating = $("#rating").val();
					userData.status = $('input:radio[name=status]:checked').val();
					
					$.post("includes/updateKlijent.php", {data:userData}, function(data){
						$("#response").html(data);
						getKlijents();
					});
					 
					
					$(this).dialog("close");
				},
				Cancel: function() {
					$( this ).dialog( "close" );
					deleteCookie("idKlijenta");
					deleteCookie("imeKlijenta");
				}
			},
			close: function() {
				getKlijents();
				deleteCookie("idKlijenta");
				deleteCookie("imeKlijenta");
			}
			
		});
		
}

function deleteKlijent(id){
	var conf = confirm("Da li ste sigurni da zelite da obrisete klijenta?");
	if (conf == true)
	{
		$.post("includes/deleteKlijent.php", {id:id}, function(data){
			getKlijents();
			$("#response").html(data);
		});
	}
}

function getKlijents()
{
	var imeF = $("#filterIme").val();
	var prezimeF = $("#filterPrezime").val();
	var emailF = $("#filterEmail").val();
	var telefonF = $("#filterTelefon").val();

	$.post("includes/filteredKlijent.php",{ime:imeF, prezime:prezimeF, email:emailF, telefon:telefonF}, function(json){
		try
		{
			var statusTd = '';
			var obj = $.parseJSON(json);
			$("#tabela").empty();
			$("#tabela").append("<thead><tr><th>Ime:</th><th>Prezime:</th><th>Adresa:</th><th>Telefon:</th><th>Email:</th><th>Status</th></tr></thead><tbody>");
			$.each(obj, function(i, item){
			if (item.status == 1)
			{
				tr = "<tr class='crnaLista'>";
			}
			else
			{
				tr = "<tr>";
			}
			switch (item.status)
			{
				case '0':
					statusTd = "<td>Neocenjen</td>";
					break;
				case '1':
					statusTd = "<td>Nikako</td>";
					break;
				case '2':
					statusTd = "<td>Izbegavati</td>";
					break;
				case '3':
					statusTd = "<td>OK</td>";
					break;
				case '4':
					statusTd = "<td>Super</td>";
					break;
				default:
					statusTd = "<td>No status defined</td>"
			}
			$("#tabela").append(tr+"<td class='klijentiIme'>"+item.ime+"</td><td class='klijentiPrezime'>"+item.prezime+"</td><td class='klijentiAdresa'>"+item.adresa+"</td><td class='klijentiTelefon'>"+item.telefon+"</td><td class='klijentiEmail'>"+item.email+"</td>"+statusTd+"<td class='klijentiFB'><a target='_blank' href='"+item.fblink+"'><img src='public/assets/img/fbimg.png' /></a></td><td class='klijentiDetails'><a onclick=popupInit('"+item.idKlijenta+"')><img alt='Izmeni podatke klijenta' title='Izmeni podatke klijenta' src='public/assets/img/details.png' /></a></td><td class='klijentiDelete'><a onclick='deleteKlijent("+item.idKlijenta+")'><img alt='Obrisi klijenta' title='Obrisi klijenta' src='public/assets/img/delete.png' /></a></td></tr>");
			});
			$(".crnaLista td").addClass("redBoja");
			$("#tabela").append("</tbody>");
			$("#tabela").tablesorter().tablesorterPager({container: $("#pager")}); 
		}
		catch(e)
		{
			$("#tabela").html("<tr><th>Error occurred:</th></tr><tr><td>"+e.message+json+"</td></tr>");
		}
	});
}
function getData(a){
	$.post("includes/getKlijent.php", {id:a}, function(data){
	var klijent = $.parseJSON(data);
		$("#ime").val(klijent.ime);
		$("#prezime").val(klijent.prezime);
		$("#telefon").val(klijent.telefon);
		$("#telefon2").val(klijent.telefon2);
		$("#adresa").val(klijent.adresa);
		$("#email").val(klijent.email);
		$("#fblink").val(klijent.fblink);
		$("#napomene").val(klijent.napomene);
		//slider(klijent.rating);
		$('input:radio[name=status]')[klijent.status].checked = true;
		setCookie("idKlijenta", a);
		var ime = klijent.ime+" "+klijent.prezime;
		setCookie("imeKlijenta", ime);
	});
}

function slider(rating) {
		$( "#slider-range-min" ).slider({
			range: "min",
			value: rating,
			min: 0,
			max: 10,
			step: 0.5,
			slide: function( event, ui ) {
				$( "#rating" ).val(ui.value );
			}
		});
		$( "#rating" ).val( $( "#slider-range-min" ).slider( "value" ) );
}
