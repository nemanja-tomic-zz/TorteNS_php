$(document).ready(function(){
	$("#torteMain").hide();
	$(".fieldset").hide();	
	$("#poruci").bind("click", function(){
		window.location.replace("unosPorudzbine.html");
	});
	$("#imgSubmit").bind("click", upload);
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
	$("#opis").bind("keyup", function(){
		getProizvod(getCookie("tipKok"));
	});
	$("#cena").bind("keyup", function(){
		getProizvod(getCookie("tipKok"));
	});

});

function fancyBox(id){
    var string = [];
    var data = {
        id : id
    };
	$.post("includes/api.php", {action: "getImages", data: JSON.stringify(data)}, function(json){
		var obj = $.parseJSON(json);
        if (obj.success) {
            $.each(obj.data, function(i, data){
                string.push("uploads/"+data.putanja+"/"+data.naziv);
            });
            if (string != "") {
                $.fancybox.open(string);
            } else {
                alert("Nema slika za izabrani proizvod.");
            }
        } else {
            $("#response").html(obj.message);
        }
	});
}

function getProizvod(tip){
	$("#torteMain").show('medium');
	filter = new Object();
	filter.naziv = $("#naziv").val();
	filter.cena = $("#cena").val();
	filter.opis = $("#opis").val();
    filter.idGrupe = tip;
	var td = "";
	var th = "";
	if(tip == "1")
		th = "<th>Tezina</th>";
	else
		th = "<th>Kolicina</th>";

	$.post("includes/api.php", {action: "filterProducts", data:JSON.stringify(filter)}, function(response){
		try
		{
			var obj = $.parseJSON(response);
			$("#tabelaProizvodi").empty();
			$("#tabelaProizvodi").append("<thead><tr><th>Naziv</th>"+th+"<th>Opis</th><th>Cena</th></tr></thead><tbody>");
			$.each(obj.data, function(i, item){
			if (tip == "1")
				td = "<td class='proizvodiTezina'>"+item.tezina+"</td>";
			else
				td = "<td class='proizvodiKolicina'>"+item.kolicina+"</td>";
				
				$("#tabelaProizvodi").append("<tr><td class='proizvodiNaziv'>"+item.naziv+"</td>"+td+"<td class='proizvodiOpis'>"+item.opis+"</td><td class='proizvodiCena'>"+item.cena+"</td><td class='proizvodiIzmena'><a onclick=popupInit('"+item.idProizvoda+"')><img src='public/assets/img/details.png' /></a><td class='proizvodiDelete'><a onclick=fancyBox('"+item.idProizvoda+"')><img src='public/assets/img/picture.png' /></a></td><td class='proizvodiDelete'><a onclick=deleteProizvod('"+item.idProizvoda+"')><img src='public/assets/img/delete.png' /></a></td></tr>");
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

function getData(productId){
    var data = {
        id: productId
    };
	$.post("includes/api.php", {action: "getProduct", data:JSON.stringify(data)}, function(json){
	    var response = $.parseJSON(json);
		$("#naziv1").val(response.data.naziv);
		$("#cena1").val(response.data.cena);
		$("#tezina1").val(response.data.tezina);
		$("#opis1").val(response.data.opis);
		$("#kolicina1").val(response.data.kolicina);
		setCookie("nazivProizvoda", response.data.naziv);
		setCookie("idProizvoda", productId);

        imgRequest(response.data.images, $("#sveSlike"));
	});
}

function deleteProizvod(id) {
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovaj proizvod? \n Brisanjem proizvoda nestace svi podaci iz porudzbina vezanim za njega.");
	if (conf == true) {
        var data = {
            id: id
        };
		$.post("includes/api.php", {action: "deleteProduct", data: JSON.stringify(data)}, function(data){
            var response = JSON.parse(data);
			getProizvod(getCookie("tipKok"));
			$("#response").html(response.message);
		});
	}
}

function deleteImg(imageId){
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovu sliku?");
	if (conf == true) {
        var data = {
            id: imageId
        };
		$.post("includes/api.php", {action: "deleteImage", data: JSON.stringify(data)}, function(json){
            var response = JSON.parse(json);
			$("#preview").html(response.message);
            if (response.success) {
                getData(getCookie("idProizvoda"));
            }
		});
	}
}

function popupInit(productId) {
    $("#preview").html('');
    $("#imgFile").val('');
    $(".fieldset").show();
    $('input[name="idProizvodaHidden"]').val(productId);
    $('input[name="tipHidden"]').val(getCookie("tipKok"));

    getData(productId);

    if (getCookie("tipKok") == '1') {
        $("#tezina1").show();
        $("#tdTezina").show();
        $("#kolicina1").hide();
        $("#tdKolicina").hide();
    } else {
        $("#tezina1").hide();
        $("#tdTezina").hide();
        $("#kolicina1").show();
        $("#tdKolicina").show();
    }

    $( "#dialog-form" ).dialog({
                autoOpen: true,
                height: 700,
                width: 700,
                modal: true,
                buttons: {
                    "Izmeni podatke": function() {
                        var proizvodData = new Object();
                        proizvodData.idProizvoda = productId;
                        proizvodData.naziv = $("#naziv1").val();
                        proizvodData.cena = $("#cena1").val();
                        proizvodData.tezina = $("#tezina1").val();
                        proizvodData.opis = $("#opis1").val();
                        proizvodData.kolicina = $("#kolicina1").val();

                        $.post("includes/api.php", {action: "updateProduct", data:JSON.stringify(proizvodData)}, function(jsonResponse){
                            var response = JSON.parse(jsonResponse);
                            $("#response").html(response.message);
                            getProizvod(getCookie("tipKok"));
                        });


                        $(this).dialog("close");
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                        deleteCookie("idProizvoda");
                        deleteCookie("nazivProizvoda");
                    }
                },
                close: function() {
                    getProizvod(getCookie("tipKok"));
                        deleteCookie("idProizvoda");
                        deleteCookie("nazivProizvoda");
                }

            });

}

function upload(){
	$("#preview").html('');
	$("#preview").html('<img src="public/assets/img/loader.gif" alt="Uploading...."/>');
	$("#uploadImg").ajaxForm({
            complete: function (data) {
                var obj = JSON.parse(data.responseText);
                if (obj.success) {
                    getData(getCookie("idProizvoda"));
                }
                $("#preview").html(obj.message);
            }
	}).submit();
}

function imgRequest(productImages, div){
    div.empty();
    if(productImages.length > 0) {
        var imagesContent = "";
        $.each(productImages, function(i, item){
            imagesContent += "<div class='slika'><img src='uploads/"+item.putanja+"/"+item.naziv+"' /><a onclick=deleteImg('"+item.idSlike+"')><img src='public/assets/img/delete.png' /></a></div>";
        });
        div.append(imagesContent);
    } else {
        div.html("There are no images attached to this product.");
    }
}

$(window).unload(function() {
  deleteCookie("tipKok");
});
