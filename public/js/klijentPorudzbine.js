var holiDays = new Array();
var tempNiz = new Array();
$(document).ready(function(){
	$(".fieldset").hide();	
	$("#opis").focus();
	getPorudzbina();
	$("#imgSubmit").bind("click", upload);
	
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
        id: id
    };
	$.post("includes/api.php", {action: "getImages", data:JSON.stringify(data)}, function(json){
        var obj = $.parseJSON(json);

        if (obj.hasData == false) {
            alert("There are no images for this product.");
            return;
        }

        $.each(obj.data, function(i, data){
            string.push("uploads/"+data.putanja+"/"+data.naziv);
        });

        $.fancybox.open(string);
	});
	
	
}

function getPorudzbina(){
	var idKlijenta = getCookie('idKlijenta');
    var data = {
        id: idKlijenta
    };
	$.post("includes/api.php", {action: "getOrdersByClient", data:JSON.stringify(data)}, function(response){
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
            content += "<td class='porudzbineCena'>"+item.cena+"</td><td class='porudzbineDatum'>"+item.datumTransakcije+"</td>";
            content += "<td class='porudzbineDelete'><a onclick=fancyBox('"+item.idProizvoda+"')><img src='public/assets/img/picture.png' /></a></td>";
            content += "<td class='porudzbineDelete'><a onclick=popupInit('"+item.idPorudzbine+"')><img src='public/assets/img/details.png' /></a></td>";
            content += "<td class='porudzbineDelete'><a onclick=deletePorudzbina('"+item.idPorudzbine+"')><img src='public/assets/img/delete.png' /></a></td></tr>";
        });
        content += "</tbody>";
        table.append(content);
        table.tablesorter().tablesorterPager({container: $("#pager")});
	});
}

function deletePorudzbina(id){
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovu porudzbinu?");
	if (conf == true) {
        var data = {
            id: id
        };
		$.post("includes/api.php", {action: "deleteOrder", data:JSON.stringify(data)}, function(json){
            var response = JSON.parse(json);
			$("#response").html(response.message);
            getPorudzbina();
		});
	}
}

function getData(a){
	var data = {
        id : a
    };
	$.post("includes/api.php", {action: "getOrder", data:JSON.stringify(data)}, function(data){
        $('input[name="idProizvodaHidden"]').val('');
        $('input[name="tipHidden"]').val('');
        var porudzbina = $.parseJSON(data);
        setCookie("idPorudzbine", porudzbina.data.idPorudzbine);
        $("#proizvod").html(porudzbina.data.naziv);
        $("#klijent").html(porudzbina.data.ime+" "+porudzbina.data.prezime);
        $("#datepicker").val(porudzbina.data.datumTransakcije);
        $("#opis").val(porudzbina.data.napomena);
        $('input[name="idProizvodaHidden"]').val(porudzbina.data.idProizvoda);
        $('input[name="tipHidden"]').val(porudzbina.data.idGrupe);
        imgRequest(porudzbina.data.images, $("#sveSlike"));
	});
}

function popupInit(id) {
    $("#preview").html('');
    $("#imgFile").val('');
    $(".fieldset").show();
    getData(id);
    dobijDatume();
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
                        porudzbinaData.datumTransakcije = $("#datepicker").val();

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

function deleteImg(id){
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovu sliku?");
	if (conf == true) {
        var data = {
            id: id
        };
		$.post("includes/api.php", {action: "deleteImage", data:JSON.stringify(data)}, function(data){
            var response = JSON.parse(data);
			$("#preview").html(response.message);
            if (response.success == true) {
                getData(getCookie("idPorudzbine"));
            }
		});
	}
}

function upload(){
    $("#preview").html('');
    $("#preview").html('<img src="public/assets/img/loader.gif" alt="Uploading...."/>');
    $("#uploadImg").ajaxForm({
        complete: function (data) {
            var obj = JSON.parse(data.responseText);
            if (obj.success == true) {
                getData(getCookie("idPorudzbine"));
            }
            $("#preview").html(obj.message);
        }
    }).submit();
}

function imgRequest(imagesList, div){
    div.empty();
    if(imagesList.length > 0) {
        $.each(imagesList, function(i, item){
            div.append("<div class='slika'><img src='uploads/"+item.putanja+"/"+item.naziv+"' /><a onclick=deleteImg('"+item.idSlike+"')><img src='public/assets/img/delete.png' /></a></div>");
        });
    } else {
        div.html("There are no images for this order.");
    }
}
$(window).unload(function() {
  //deleteCookie("idKlijenta");
});
