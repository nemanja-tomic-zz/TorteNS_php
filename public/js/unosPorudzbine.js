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
	$("#torteBtn").bind("click",{tip:"1"}, function(event){
		getProizvod(event.data.tip);
		setCookie("tipKok", "1");
	});
	$("#cupsBtn").bind("click",{tip:"3"}, function(event){
		getProizvod(event.data.tip);
		setCookie("tipKok", "3");
	});
	$("#figuriceBtn").bind("click",{tip:"4"}, function(event){
		getProizvod(event.data.tip);
		setCookie("tipKok", "4");
	});
	$("#miscBtn").bind("click",{tip:"5"}, function(event){
		getProizvod(event.data.tip);
		setCookie("tipKok", "5");
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
	var clientName = $("#klijent").html();
	var productName = $("#proizvod").html();
    var data;
    if ((clientName != "") && (productName != "") && ($("#datepicker").val() != "")) {
        data = {};
        data.idKlijenta = getCookie("idKlijenta");
        data.idProizvoda = getCookie("idProizvoda");
        data.napomena = $("#napomena").val();
        data.datumTransakcije = $("#datepicker").val();
        $.post("includes/api.php", {action: "insertOrder", data: JSON.stringify(data)}, function (response) {
            var obj = JSON.parse(response);
            if (obj.success == false) {
                alert(obj.message);
            } else {
                //setCookie("idPorudzbine", a);		ukinuli smo slike za porudzbine
                $("#klijent").empty();
                $("#proizvod").empty();
                $("#datepicker").val("");
                $("#napomena").val("");
                deleteCookie("idKlijenta");
                deleteCookie("idProizvoda");
                deleteCookie("nazivProizvoda");
                window.location.replace("index.html");
            }
        });
    } else {
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


function getKlijents() {
    var data = {
        imeF: $("#filterIme").val(),
        prezimeF: $("#filterPrezime").val(),
        emailF: $("#filterEmail").val(),
        telefonF: $("#filterTelefon").val()
    };
    var action = "getClients";

    $.post("includes/api.php", {data: JSON.stringify(data), action: action}, function (json) {
        var obj = $.parseJSON(json);
        var table = $("#tabelaKlijent");
        var content = "";
        table.empty();
        content += "<thead><tr><th>Ime:</th><th>Prezime:</th><th>Adresa:</th><th>Telefon:</th><th>Email:</th><th>Status:</th></tr></thead><tbody>";
        $.each(obj.data, function(i, item){
            content += "<tr><td class='klijentiIme'>"+item.ime+"</td>";
            content += "<td class='klijentiPrezime'>"+item.prezime+"</td>";
            content += "<td class='klijentiAdresa'>"+item.adresa+"</td>";
            content += "<td class='klijentiTelefon'>"+item.telefon+"</td>";
            content += "<td class='klijentiEmail'>"+item.email+"</td>";
            content += "<td class='klijentiStatus'>"+item.statusText+"</td>";
            content += "<td class='klijentiFB'><a target='_blank' href='"+item.fblink+"'><img src='public/assets/img/fbimg.png' /></a></td>";
            content += "<td class='klijentiFB'><a onclick=selectKlijent('"+item.idKlijenta+"','"+item.prezime+"','"+item.ime+"')><img src='public/assets/img/forward.png' /></a></td></tr>";
        });
        content += "</tbody>";
        table.append(content);
        table.tablesorter().tablesorterPager({container: $("#pager")});
	});
}

function getProizvod(tip){
	$("#torteMain").show('medium');
	filter = new Object();
	filter.naziv = $("#naziv").val();
	filter.cena = $("#cena").val();
	filter.opis = $("#opis").val();
    filter.idGrupe = tip;
	type = tip;
	var td = "";
	var th = "";
	if(type == "Torte")
		th = "<th>Tezina</th>";
	else
		th = "<th>Kolicina</th>";
    //getProizvod.php
	$.post("includes/api.php", {action: "filterProducts", data:JSON.stringify(filter)}, function(response){
        var obj = $.parseJSON(response);
        var naziv = "";
        $("#tabelaProizvodi").empty();
        $("#tabelaProizvodi").append("<thead><tr><th>Naziv</th>"+th+"<th>Opis</th><th>Cena</th></tr></thead><tbody>");
        $.each(obj.data, function(i, item){
        if (type == "Torte")
            td = "<td class='proizvodiTezina'>"+item.tezina+"</td>";
        else
            td = "<td class='proizvodiKolicina'>"+item.kolicina+"</td>";

        $("#tabelaProizvodi").append("<tr><td class='proizvodiNaziv'>"+item.naziv+"</td>"+td+"<td class='proizvodiOpis'>"+item.opis+"</td><td class='proizvodiCena'>"+item.cena+"</td><td class='proizvodiDelete'><a onclick=fancyBox('"+item.idProizvoda+"')><img src='public/assets/img/picture.png' /></a></td><td class='proizvodiDelete'><a onclick=selectProizvod('"+item.idProizvoda+"')><img src='public/assets/img/forward.png' /></a></td></tr>");
        });
        $("#tabelaProizvodi").append("</tbody>");
        $("#tabelaProizvodi").tablesorter().tablesorterPager({container: $("#pager")});
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
    //getProizvod.php
    var data = {
        id: id
    };
	$.post("includes/api.php", {action: "getProduct", data: JSON.stringify(data)}, function(json){
		var da = $.parseJSON(json);
		var proizvod = da.data.naziv;
		$("#proizvod").html(proizvod);
	});

	$.post("includes/api.php", {action: "getImages", data: JSON.stringify(data)}, function(json){
		var obj = $.parseJSON(json);
		var string = "";
		$("#image").empty();
        string = "uploads/"+obj.data[0].putanja+"/"+obj.data[0].naziv;
        $("#image").html("<img class='image' src='"+string+"' alt='' title='' />");
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
