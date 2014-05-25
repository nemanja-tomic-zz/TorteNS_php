var holiDays = new Array();
var tempNiz = new Array();
$(document).ready(function(){
	$(".fieldset").hide();	
	$("#opis").focus();
	getPorudzbina();
	$("#imgSubmit").bind("click", upload);
	$("#naziv").bind("keyup", function(){
		getPorudzbina();
	});
	$("#ime").bind("keyup", function(){
		getPorudzbina();
	});
	$("#napomena").bind("keyup", function(){
		getPorudzbina();
	});
	$("#cena").bind("keyup", function(){
		getPorudzbina();
	});
	$("#kurchina").hide();
	$("#datepicker").bind('keyup', function(){
		$("#kurchina").hide("slow");
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
        $("#datepicker").datepicker({
            dateFormat: 'yy/mm/dd',
            minDate: 0,
            firstDay: 1,
            dayNamesMin: ["Ne", "Po", "Ut", "Sr", "Ce", "Pe", "Su"],
            beforeShowDay: setHoliDays
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


function fancyBox(id){
    var string = new Array();
    var data = {
       id : id
    };
	$.post("includes/api.php", {action: "getOrderImages", data: JSON.stringify(data)}, function(json){
		var obj = $.parseJSON(json);
		if (obj.success) {
            $.each(obj.data, function(i, data){
                string.push("uploads/"+data.putanja+"/"+data.naziv);
            });
            if (string != "") {
                $.fancybox.open(string);
            } else {
                alert("Nema slika za izabranu porudzbinu.");
            }
        } else {
            $("#response").html(obj.message);
        }
	});
	
	
}

function getPorudzbina(){
	var filter = {};
	filter.naziv = $("#naziv").val();
	filter.cena = $("#cena").val();
	filter.ime = $("#ime").val();
	filter.napomena = $("#napomena").val();
	$.post("includes/api.php", {action: "filterOrders", data: JSON.stringify(filter)}, function(response){
        var obj = $.parseJSON(response);
        var img = "";
        var table = $("#tabelaPorudzbine");
        var tableContent = "<thead><tr><th>Ime i prezime</th><th>porudzbina</th><th>Napomena</th><th>Cena</th><th>Za datum</th></tr></thead><tbody>";
        table.empty();
        $.each(obj.data, function(i, item) {
            tableContent += "<tr><td class='porudzbineIme'>"+item.ime+" "+item.prezime+"</td>";
            tableContent += "<td class='porudzbineNaziv'>"+item.naziv+"</td>";
            tableContent += "<td class='porudzbineNapomena'><pre class='kurchevPre' readonly='readonly'>"+item.napomena+"</pre></td>";
            tableContent += "<td class='porudzbineCena'>"+item.cena+"</td>";
            tableContent += "<td class='porudzbineDatum'>"+item.datumTransakcije+"</td>";
            tableContent += "<td class='porudzbineDelete'><a onclick=fancyBox('"+item.idPorudzbine+"')><img src='public/assets/img/picture.png' /></a></td>";
            tableContent += "<td class='porudzbineDelete'><a onclick=popupInit('"+item.idPorudzbine+"')><img src='public/assets/img/details.png' /></a></td>";
            tableContent += "<td class='porudzbineDelete'><a onclick=deletePorudzbina('"+item.idPorudzbine+"')><img src='public/assets/img/delete.png' /></a></td></tr>";
        });
        tableContent += "</tbody>";
        table.append(tableContent);
        table.tablesorter().tablesorterPager({container: $("#pager")});
	});
}

function deletePorudzbina(id){
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovu porudzbinu?");
	if (conf == true) {
        var data = {
            id: id
        };
		$.post("includes/api.php", {action: "deleteOrder", data: JSON.stringify(data)}, function(response){
			getPorudzbina();
            var obj = JSON.parse(response);
			$("#response").html(obj.message);
		});
	}
}


function getData(orderId){
	var data = {
        id : orderId
    };
	$.post("includes/api.php", {action: "getOrder", data: JSON.stringify(data)}, function(jsonResponse){
        var response = $.parseJSON(jsonResponse);
        var porudzbina = response.data;
		$("#proizvod").html(porudzbina.naziv);
		$("#klijent").html(porudzbina.ime+" "+porudzbina.prezime);
		$("#datepicker").val(porudzbina.datumTransakcije);
		$("#opis").val(porudzbina.napomena);
        setCookie("idPorudzbine", porudzbina.idPorudzbine);

        imgRequest(porudzbina.images, $("#sveSlike"))
	});
}

function popupInit(orderId) {
    $("#preview").html('');
    $("#imgFile").val('');
    $(".fieldset").show();
    $('input[name="idPorudzbineHidden"]').val(orderId);
    getData(orderId);
    dobijDatume();

    $( "#dialog-form" ).dialog({
        autoOpen: true,
        height: 700,
        width: 850,
        modal: true,	//da se zatamni ostatak stranice
        buttons: {
            "Izmeni podatke": function() {
                var porudzbinaData = new Object();
                porudzbinaData.idPorudzbine = orderId;
                porudzbinaData.napomena = $("#opis").val();
                porudzbinaData.datumTransakcije = $("#datepicker").val();

                $.post("includes/api.php", {action: "updateOrder", data: JSON.stringify(porudzbinaData)}, function(data){
                    var response = JSON.parse(data);
                    $("#response").html(response.message);
                    getPorudzbina();
                });


                $(this).dialog("close");
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            getPorudzbina();
        }
    });

}

function deleteImg(id){
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovu sliku?");
	if (conf == true)
	{
		$.post("includes/deleteImg.php", {id:id}, function(data){
			$("#preview").html(data);
		});
		setTimeout(function(){
			imgRequest($('input[name="idPorudzbineHidden"]').val(), $("#sveSlike"));
		}, 500);
	}
}

function upload(){
    $("#preview").html('');
    $("#preview").html('<img src="public/assets/img/loader.gif" alt="Uploading...."/>');
    $("#uploadImg").ajaxForm({
        complete: function (data) {
            var obj = JSON.parse(data.responseText);
            if (obj.success) {
                getData(getCookie("idPorudzbine"));
            }
            $("#preview").html(obj.message);
        }
    }).submit();
}

function imgRequest(orderImages, div){
	div.empty();
    if(orderImages.length > 0) {
        $.each(orderImages, function(i, item){
            div.append("<div class='slika'><img src='uploads/"+item.putanja+"/"+item.naziv+"' /><a onclick=deleteImg('"+item.idSlike+"')><img src='public/assets/img/delete.png' /></a></div>");
        });
    } else {
        div.html("There are no images for selected order.");
    }
}
