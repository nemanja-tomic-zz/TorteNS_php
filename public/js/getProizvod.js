$(document).ready(function(){
	$("#torteMain").hide();
	$(".fieldset").hide();	
	$("#poruci").bind("click", function(){
		window.location.replace("unosPorudzbine.html");
	});
	$("#imgSubmit").bind("click", timeout);
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
	$("#opis").bind("keyup", function(){
		getProizvod(getCookie("tipKok"));
	});
	$("#cena").bind("keyup", function(){
		getProizvod(getCookie("tipKok"));
	});

});
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
function timeout(){
	upload();
	setTimeout(function(){
		imgRequest($('input[name="idProizvodaHidden"]').val(), $("#sveSlike"));
	}, 500);
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
			$("#tabelaProizvodi").empty();
			$("#tabelaProizvodi").append("<thead><tr><th>Naziv</th>"+th+"<th>Opis</th><th>Cena</th></tr></thead><tbody>");
			$.each(obj, function(i, item){
			if (type == "Torte")
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
function getData(a){
	$.post("includes/getProizvod.php", {id:a}, function(data){
	var proizvod = $.parseJSON(data);
		$("#naziv1").val(proizvod[0].naziv);
		$("#cena1").val(proizvod[0].cena);
		$("#tezina1").val(proizvod[0].tezina);
		$("#opis1").val(proizvod[0].opis);
		$("#kolicina1").val(proizvod[0].kolicina);
		setCookie("nazivProizvoda", proizvod[0].naziv);
		setCookie("idProizvoda", a);
	});
}

function deleteProizvod(id){
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovaj proizvod? \n Brisanjem proizvoda nestace svi podaci iz porudzbina vezanim za njega.");
	if (conf == true)
	{
		$.post("includes/deleteProizvod.php", {id:id}, function(data){
			getProizvod(getCookie("tipKok"));
			$("#response").html(data);
		});
	}
}
function deleteImg(id){
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovu sliku?");
	if (conf == true)
	{
		$.post("includes/deleteImg.php", {id:id}, function(data){
			$("#preview").html(data);
		});
		setTimeout(function(){
			imgRequest($('input[name="idProizvodaHidden"]').val(), $("#sveSlike"));
		}, 500);
	}
}

function popupInit(id)
{
$("#preview").html('');
$("#imgFile").val('');
$(".fieldset").show();
$('input[name="idProizvodaHidden"]').val(id);
$('input[name="tipHidden"]').val(getCookie("tipKok"));
getData(id);
if (getCookie("tipKok") == 'Torte')
{
	$("#tezina1").show();
	$("#tdTezina").show();
	$("#kolicina1").hide();
	$("#tdKolicina").hide();
}
else
{
	$("#tezina1").hide();
	$("#tdTezina").hide();
	$("#kolicina1").show();
	$("#tdKolicina").show();
}
imgRequest(id, $("#sveSlike"));
$( "#dialog-form" ).dialog({
			autoOpen: true,
			height: 700,
			width: 700,
			modal: true,	//da se zatamni ostatak stranice
			buttons: {
				"Izmeni podatke": function() {
					proizvodData=new Object();
					proizvodData.idProizvoda = id;
					proizvodData.naziv = $("#naziv1").val();
					proizvodData.cena = $("#cena1").val();
					proizvodData.tezina = $("#tezina1").val();
					proizvodData.opis = $("#opis1").val();
					proizvodData.kolicina = $("#kolicina1").val();
					
					$.post("includes/updateProizvod.php", {data:proizvodData}, function(data){
						$("#response").html(data);
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
			target: '#preview'
	}).submit();
	
}
function imgSenka(id){
	$.post("includes/getProizvodSlike.php", {idProizvoda:id}, function(json){
		return json;
	});
}
function imgRequest(id, div){
$.post("includes/getProizvodSlike.php", {idProizvoda:id}, function(json){
	try
		{
		div.empty();
			var obj = $.parseJSON(json);
			if(typeof obj =='object')
			{		
				$.each(obj, function(i, item){
					div.append("<div class='slika'><img src='uploads/"+item.putanja+"/"+item.naziv+"' /><a onclick=deleteImg('"+item.idSlike+"')><img src='public/assets/img/delete.png' /></a></div>");
				});
			}
			else
			{
				div.html(obj);
			}
		}
		catch(e)
		{
			$("#validateTips").html("Error occurred:"+json);
		}
});
}
$(window).unload(function() {
  deleteCookie("tipKok");
});
