var holiDays = new Array();
var tempNiz = new Array();
//var holiDays =[[2012,01,01,'New Years Day'],[2012,01,01,'Pongal'],[2012,12,25,'Christmas Day']];
$(document).ready(function(){
	
	$("#kurchina").hide();
	$("#datepicker").bind('keyup', function(){
		$("#kurchina").hide("slow");
	});
	$("#datepicker").datepicker({
		dateFormat: 'yy/mm/dd',
		minDate: 0,
		firstDay: 1,
		dayNamesMin: ["Ne", "Po", "Ut", "Sr", "Ce", "Pe", "Su"],
		beforeShowDay: setHoliDays,
		onSelect: function(date) {
					schedule(date);
				}
	});
	if (getCookie("idKlijenta") != "")
	{
		$("#klijent").html(getCookie("imeKlijenta"));
		deleteCookie("imeKlijenta");
	}
	if (getCookie("idProizvoda") != "")
	{
		$("#proizvod").html(getCookie("nazivProizvoda"));
		deleteCookie("nazivProizvoda");
	}
	if (getCookie("datum") != "")
	{
		$("#datepicker").val(getCookie("datum"));
		schedule(getCookie("datum"));
		deleteCookie("datum");
	}
	dobijDatume();
	$(".fieldset").hide();	
	$(".fieldsetP").hide();	
	$("#torteMain").hide();
	$("#filterIme").bind("keyup", getKlijents);
	$("#filterPrezime").bind("keyup", getKlijents);
	$("#filterEmail").bind("keyup", getKlijents);
	$("#filterTelefon").bind("keyup", getKlijents);
	$("#browseKlijent").bind('click', browseKlijent);
	$("#browseProizvod").bind('click', browseProizvod);
	$("#btnNext").bind('click', insertPorudzbina);
	$("#torteBtn").bind("click",{tip:"Torte"}, function(event){
		getProizvod(event.data.tip);
		setCookie("tipKok", "Torte");
	});
	$("#cupsBtn").bind("click",{tip:"Cupcakes"}, function(event){
		getProizvod(event.data.tip);
		setCookie("tipKok", "Cupcakes");
	});
	$("#figuriceBtn").bind("click",{tip:"Figurice"}, function(event){
		getProizvod(event.data.tip);
		setCookie("tipKok", "Figurice");
	});
	$("#miscBtn").bind("click",{tip:"Ostali Proizvodi"}, function(event){
		getProizvod(event.data.tip);
		setCookie("tipKok", "Ostali Proizvodi");
	});
	$("#naziv").bind("keyup", function(){
		getProizvod(getCookie("tipKok"));
	});
	$("#cena").bind("keyup", function(){
		getProizvod(getCookie("tipKok"));
	});
});

function dobijDatume() {
	$.post("includes/getDates.php", function(json){
	 try
		{
			var obj = $.parseJSON(json);
			$.each(obj, function(i, item){
				tempNiz.push(item.godina);
				tempNiz.push(item.mesec);
				tempNiz.push(item.dan);
				holiDays.push(tempNiz);
				tempNiz = [];
			});
		}
		catch(e)
		{
			$("#image").html(e.message);
		}
	});
}

function setHoliDays(date) {
   for (i = 0; i < holiDays.length; i++) {
     if (date.getFullYear() == holiDays[i][0]
    	  && date.getMonth() == holiDays[i][1] - 1
          && date.getDate() == holiDays[i][2]) {
        return [true, 'holiday'];
     }
   }
  return [true, ''];
}

function schedule(date){
	$.post("includes/schedule.php", {datum:date}, function(response){
		try
		{
		if ($("#datepicker").val() != "")
			$("#kurchina").show("slow");
			var obj = $.parseJSON(response);
			$("#schedule").empty();
			$("#schedule").append("<thead><th class='scheduleImeH'>Ime</th><th class='schedulePrezimeH'>Prezime</th><th class='scheduleNapomenaH'>Napomena</th><th class='scheduleProizvodH'>Proizvod</th><th class='scheduleCenaH'>Cena</th></thead><tbody>");
			$.each(obj, function(i, item){
				$("#schedule").append("<tr><td class='scheduleIme'>"+item.ime+"</td><td class='schedulePrezime'>"+item.prezime+"</td><td class='scheduleNapomena'>"+item.napomena+"</td><td class='scheduleProizvod'>"+item.naziv+"</td><td class='scheduleCena'>"+item.cena+"</td></tr>");
			});
			$("#schedule").append("</tbody>");
		}
		catch(e)
		{
			$("#schedule").empty();
			$("#schedule").append(response);
		}
	});
}

function insertPorudzbina(){
	var a = $("#klijent").html();
	var b = $("#proizvod").html();
	if ((a != "") && (b != "") && ($("#datepicker").val() != ""))
	{
	data = new Object();
	data.idKlijenta = getCookie("idKlijenta");
	data.idProizvoda = getCookie("idProizvoda");
	data.napomena = $("#napomena").val();
	data.datumTransakcije = $("#datepicker").val();	
	$.post("includes/insertPorudzbina.php", {data:data}, function(response){
		var a = String(response);
		if (a.length > 29)
			alert(a);
		else
		{
			//setCookie("idPorudzbine", a);		ukinuli smo slike za porudzbine
			window.location.replace("index.html");
			$("#klijent").empty();
			$("#proizvod").empty();
			$("#datepicker").val("");
			$("#napomena").val("");
			deleteCookie("idKlijenta");
			deleteCookie("idProizvoda");
			deleteCookie("nazivProizvoda");
		}
	});
	}
	else
	{
		alert("Morate popuniti sva polja.");
	}
}


function browseKlijent(){
	$(".fieldset").show();
	getKlijents();
	$( "#dialog-form" ).dialog({
			autoOpen: true,
			height: 700,
			width: 1150,
			modal: true,	//da se zatamni ostatak stranice
			close: function() {
				$(".fieldset").hide();
			}
			
	});
}

function browseProizvod(){
	$(".fieldsetP").show();
	//getProizvod('Torte');
	$( "#dialog-formP" ).dialog({
			autoOpen: true,
			height: 700,
			width: 1150,
			modal: true,	//da se zatamni ostatak stranice
			close: function() {
				$(".filedsetP").hide();
			}
			
	});
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
			var statusTd = "";
			var obj = $.parseJSON(json);
			$("#tabelaKlijent").empty();
			$("#tabelaKlijent").append("<thead><tr><th>Ime:</th><th>Prezime:</th><th>Adresa:</th><th>Telefon:</th><th>Email:</th><th>Status:</th></tr></thead><tbody>");
			$.each(obj, function(i, item){
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
			
				$("#tabelaKlijent").append("<tr><td class='klijentiIme'>"+item.ime+"</td><td class='klijentiPrezime'>"+item.prezime+"</td><td class='klijentiAdresa'>"+item.adresa+"</td><td class='klijentiTelefon'>"+item.telefon+"</td><td class='klijentiEmail'>"+item.email+"</td>"+statusTd+"<td class='klijentiFB'><a target='_blank' href='"+item.fblink+"'><img src='public/assets/img/fbimg.png' /></a></td><td class='klijentiFB'><a onclick=selectKlijent('"+item.idKlijenta+"','"+item.prezime+"','"+item.ime+"')><img src='public/assets/img/forward.png' /></a></td></tr>");
			});
			$("#tabelaKlijent").append("</tbody>");
			$("#tabelaKlijent").tablesorter().tablesorterPager({container: $("#pager")}); 
		}
		catch(e)
		{
			$("#tabelaKlijent").html("<tr><th>Error occurred:</th></tr><tr><td>"+json+"</td></tr>");
		}
	});
}

function getProizvod(tip){
	$("#torteMain").show('medium');
	filter = new Object();
	filter.naziv = $("#naziv").val();
	filter.cena = $("#cena").val();
	filter.opis = $("#opis").val();
	type = tip;
	var td = "";
	var th = "";
	if(type == "Torte")
		th = "<th>Tezina</th>";
	else
		th = "<th>Kolicina</th>";
	$.post("includes/getProizvod.php", {data:filter, grupa:type}, function(response){
		try
		{
			var obj = $.parseJSON(response);
			var naziv = "";
			$("#tabelaProizvodi").empty();
			$("#tabelaProizvodi").append("<thead><tr><th>Naziv</th>"+th+"<th>Opis</th><th>Cena</th></tr></thead><tbody>");
			$.each(obj, function(i, item){
			if (type == "Torte")
				td = "<td class='proizvodiTezina'>"+item.tezina+"</td>";
			else
				td = "<td class='proizvodiKolicina'>"+item.kolicina+"</td>";
			
			$("#tabelaProizvodi").append("<tr><td class='proizvodiNaziv'>"+item.naziv+"</td>"+td+"<td class='proizvodiOpis'>"+item.opis+"</td><td class='proizvodiCena'>"+item.cena+"</td><td class='proizvodiDelete'><a onclick=fancyBox('"+item.idProizvoda+"')><img src='public/assets/img/picture.png' /></a></td><td class='proizvodiDelete'><a onclick=selectProizvod('"+item.idProizvoda+"')><img src='public/assets/img/forward.png' /></a></td></tr>");
			});
			$("#tabelaProizvodi").append("</tbody>");
			$("#tabelaProizvodi").tablesorter().tablesorterPager({container: $("#pager")}); 
		}
		catch(e)
		{
			$("#tabelaProizvodi").html("<tr><th>Error occurred:</th></tr><tr><td>"+response+"</td></tr>");
		}
	});
}

function selectKlijent(id, prezime, ime){
	$( "#dialog-form" ).dialog('close');
	setCookie("idKlijenta", id);
	$("#klijent").html(ime+" "+prezime);
}

function selectProizvod(id){
	$( "#dialog-formP" ).dialog('close');
	setCookie("idProizvoda", id);
	$.post("includes/getProizvod.php", {id:id}, function(json){
		var da = $.parseJSON(json);
		var proizvod = da[0].naziv;
		$("#proizvod").html(proizvod);
	});
	
	$.post("includes/getProizvodSlike.php", {idProizvoda:id}, function(json){
		try
		{
		var obj = $.parseJSON(json);
		var string = "";
		$("#image").empty();
			string = "uploads/"+obj[0].putanja+"/"+obj[0].naziv;
			$("#image").html("<img class='image' src='"+string+"' alt='' title='' />");
			
		}
		catch(e)
		{
			$("#image").html(json);
		}
	});
}

function fancyBox(id){
var string = new Array();
	$.post("includes/getProizvodSlike.php", {idProizvoda:id}, function(json){
		var obj = $.parseJSON(json);
		
		$.each(obj, function(i, data){
			string.push("uploads/"+data.putanja+"/"+data.naziv);
		});
		if (string != "")
		{
		$.fancybox.open(string);
		}
		else
		{
			alert("Nema slika za izabrani proizvod.");
		}
	});
	
	//
	
}
