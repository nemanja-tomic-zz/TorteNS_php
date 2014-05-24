var holiDays = new Array();
var tempNiz = new Array();
$(document).ready(function(){
	$(".fieldset").hide();	
	$("#opis").focus();
	getPorudzbina();
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
	
});

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
	filter = new Object();
	filter.naziv = $("#naziv").val();
	filter.cena = $("#cena").val();
	filter.ime = $("#ime").val();
	filter.napomena = $("#napomena").val();
	$.post("includes/api.php", {action: "filterOldOrders", data:JSON.stringify(filter)}, function(response){
        var obj = $.parseJSON(response);
        var img = "";
        var table = $("#tabelaPorudzbine");
        var content = "";
        table.empty();
		content += "<thead><tr><th>Ime i prezime</th><th>Proizvod</th><th>Napomena</th><th>Cena</th><th>Za datum</th></tr></thead><tbody>";
        $.each(obj.data, function(i, item){
            content += "<tr><td class='porudzbineIme'>"+item.ime+" "+item.prezime+"</td>";
            content += "<td class='porudzbineNaziv'>"+item.naziv+"</td>";
            content += "<td class='porudzbineNapomena'><pre class='kurchevPre' readonly='readonly'>"+item.napomena+"</pre></td>";
            content += "<td class='porudzbineCena'>"+item.cena+"</td>";
            content += "<td class='porudzbineDatum'>"+item.datumTransakcije+"</td>";
            content += "<td class='porudzbineDelete'><a onclick=fancyBox('"+item.idProizvoda+"')><img src='public/assets/img/picture.png' /></a></td>";
            content += "<td class='porudzbineDelete'><a onclick=popupInit('"+item.idPorudzbine+"')><img src='public/assets/img/details.png' /></a></td></tr>";
        });
        content += "</tbody>";
        table.append(content);
        $("#tabelaPorudzbine").tablesorter().tablesorterPager({container: $("#pager")});
	});
}

function getData(orderId){
	var data = {
        id: orderId
    };
	$.post("includes/api.php", {action: "getOrder", data: JSON.stringify(data)}, function(response){
	$('input[name="idProizvodaHidden"]').val('');
	$('input[name="tipHidden"]').val('');
	var porudzbina = $.parseJSON(response);
    var order = porudzbina.data;
		$("#proizvod").html(order.naziv);
		$("#klijent").html(order.ime+" "+order.prezime);
		$("#datepicker").html(order.datumTransakcije);
		$("#opis").val(order.napomena);
		$('input[name="idProizvodaHidden"]').val(order.idProizvoda);
		$('input[name="tipHidden"]').val(order.nazivGrupe);
        setCookie("idPorudzbine", order.idPorudzbine);
		imgRequest(order.images, $("#sveSlike"));
	});
}

function popupInit(id) {
    $("#preview").html('');
    $("#imgFile").val('');
    $(".fieldset").show();
    getData(id);
    $( "#dialog-form" ).dialog({
        autoOpen: true,
        height: 700,
        width: 850,
        modal: true,	//da se zatamni ostatak stranice
        buttons: {
            "Izmeni podatke": function() {
                var porudzbinaData = new Object();
                porudzbinaData.idPorudzbine = id;
                porudzbinaData.napomena = $("#opis").val();
                porudzbinaData.datumTransakcije = $("#datepicker").html();

                $.post("includes/api.php", {action: "updateOrder", data:JSON.stringify(porudzbinaData)}, function(data){
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
