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
	if (getCookie("idKlijenta") != "") {
		$("#klijent").html(getCookie("imeKlijenta"));
		deleteCookie("imeKlijenta");
	}
	if (getCookie("idProizvoda") != "")	{
		$("#proizvod").html(getCookie("nazivProizvoda"));
		deleteCookie("nazivProizvoda");
	}
	if (getCookie("datum") != "")	{
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
	$.post("includes/api.php", {action: "getAllOrderDates"}, function(json){
        var obj = $.parseJSON(json);
        $.each(obj.data, function(i, item){
            tempNiz.push(item.godina);
            tempNiz.push(item.mesec);
            tempNiz.push(item.dan);
            holiDays.push(tempNiz);
            tempNiz = [];
        });
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

/**
 * Gets all previously scheduled orders for provided date.
 *
 * @param date
 */
function schedule(date){
    var data = {
        datum: date
    };
    var jsDate = new Date(date);
	$.post("includes/api.php", {action: "getOrdersByDate", data:JSON.stringify(data)}, function(response){
		if ($("#datepicker").val() != "") {
			$("#kurchina").show("slow");
        }
        var obj = $.parseJSON(response);
        var table = $("#schedule");
        var content = "";
        table.empty();
        if (obj.hasData == false) {
            $("#prescheduledOrdersTxt").text("There are no scheduled orders for "+jsDate.toDateString()+".");
            return;
        } else {
            $("#prescheduledOrdersTxt").text("Scheduled orders for "+jsDate.toDateString()+":");
        }
        content += "<thead><th class='scheduleImeH'>Ime</th><th class='schedulePrezimeH'>Prezime</th><th class='scheduleNapomenaH'>Napomena</th><th class='scheduleProizvodH'>Proizvod</th><th class='scheduleCenaH'>Cena</th></thead><tbody>";
        $.each(obj.data, function(i, item){
            content += "<tr><td class='scheduleIme'>"+item.ime+"</td>";
            content += "<td class='schedulePrezime'>"+item.prezime+"</td>";
            content += "<td class='scheduleNapomena'>"+item.napomena+"</td>";
            content += "<td class='scheduleProizvod'>"+item.naziv+"</td>";
            content += "<td class='scheduleCena'>"+item.cena+"</td></tr>";
        });
        content += "</tbody>";
        table.append(content);
	});
}

/**
 * Creates new order and redirects to homepage.
 * Makes AJAX call to "insertOrder" API method.
 */
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

/**
 * Opens a modal dialog for client browsing and selection.
 */
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

/**
 * Opens a modal dialog for product browsing and selection.
 */
function browseProizvod(){
	$(".fieldsetP").show();
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

/**
 * Generates and fills the table with clients data by provided filter.
 * Called every time on keyUp event for any of the filter fields.
 * Makes AJAX call to "getClients" API method.
 */
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

/**
 * Generates and fills the table with products data belonging to the desired group.
 * Called every time on keyUp event for any of the filter fields.
 * Makes AJAX call to "filterProducts" API method.
 *
 * @param tip Product group ID needs to be provided.
 */
function getProizvod(tip){
	$("#torteMain").show('medium');
	filter = new Object();
	filter.naziv = $("#naziv").val();
	filter.cena = $("#cena").val();
	filter.opis = $("#opis").val();
    filter.idGrupe = tip;
    var type = tip;
	var td = "";
	var th = "";
	if(type == "1")
		th = "<th>Tezina</th>";
	else
		th = "<th>Kolicina</th>";

	$.post("includes/api.php", {action: "filterProducts", data:JSON.stringify(filter)}, function(response){
        var obj = $.parseJSON(response);
        var table = $("#tabelaProizvodi");
        var content = "";
        table.empty();
        content += "<thead><tr><th>Naziv</th>"+th+"<th>Opis</th><th>Cena</th></tr></thead><tbody>";
        $.each(obj.data, function(i, item){
            if (type == "1")
                td = "<td class='proizvodiTezina'>"+item.tezina+"</td>";
            else
                td = "<td class='proizvodiKolicina'>"+item.kolicina+"</td>";

            content += "<tr><td class='proizvodiNaziv'>"+item.naziv+"</td>";
            content += td;
            content += "<td class='proizvodiOpis'>"+item.opis+"</td>";
            content += "<td class='proizvodiCena'>"+item.cena+"</td>";
            content += "<td class='proizvodiDelete'><a onclick=fancyBox('"+item.idProizvoda+"')><img src='public/assets/img/picture.png' /></a></td>";
            content += "<td class='proizvodiDelete'><a onclick=selectProizvod('"+item.idProizvoda+"')><img src='public/assets/img/forward.png' /></a></td></tr>";
        });
        content += "</tbody>";
        table.append(content);
        table.tablesorter().tablesorterPager({container: $("#pager")});
	});
}

/**
 * Called when user selects desired client for creating new order.
 *
 * @param id Selected client's ID, further stored into idKlijenta cookie.
 * @param prezime Selected client's last name, used only for displaying on "Klijent" label.
 * @param ime Selected client's first name, used only for displaying on "Klijent" label.
 */
function selectKlijent(id, prezime, ime){
	$( "#dialog-form" ).dialog('close');
	setCookie("idKlijenta", id);
	$("#klijent").html(ime+" "+prezime);
}

/**
 * Called when user selects desired product for creating new order.
 * Makes AJAX calls to "getProduct" and "getImages" API methods.
 *
 * @param id Selected product's id, further stored into "idProizvoda" cookie.
 */
function selectProizvod(id){
	$( "#dialog-formP" ).dialog('close');
	setCookie("idProizvoda", id);
    var data = {
        id: id
    };
	$.post("includes/api.php", {action: "getProduct", data: JSON.stringify(data)}, function(json){
		var response = $.parseJSON(json);
		var proizvod = response.data.naziv;
		$("#proizvod").html(proizvod);
	});

	$.post("includes/api.php", {action: "getImages", data: JSON.stringify(data)}, function(json){
		var obj = $.parseJSON(json);
		$("#image").empty();
        var string = "uploads/"+obj.data[0].putanja+"/"+obj.data[0].naziv;
        $("#image").html("<img class='image' src='"+string+"' alt='' title='' />");
	});
}

/**
 * Fires up FancyBox image gallery for displaying all images for product with provided ID.
 * Makes AJAX call to "getImages" API method.
 *
 * @param id Product id for which to display images.
 */
function fancyBox(id){
    var string = new Array();
    var data = {
        id: id
    };
	$.post("includes/api.php", {action: "getImages", data:JSON.stringify(data)}, function(json){
		var response = $.parseJSON(json);
		
		$.each(response.data, function(i, item){
			string.push("uploads/"+item.putanja+"/"+item.naziv);
		});
		if (string != "") {
		    $.fancybox.open(string);
		} else {
			alert("Nema slika za izabrani proizvod.");
		}
	});
}
