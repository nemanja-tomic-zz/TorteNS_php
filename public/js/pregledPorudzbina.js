var holiDays = new Array();
var tempNiz = new Array();
$(document).ready(function(){
	$(".fieldset").hide();	
	$("#opis").focus();
	getPorudzbina();
	$("#imgSubmit").bind("click", timeout);
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
			$("#datepicker").datepicker({
		dateFormat: 'yy/mm/dd',
		minDate: 0,
		firstDay: 1,
		dayNamesMin: ["Ne", "Po", "Ut", "Sr", "Ce", "Pe", "Su"],
		beforeShowDay: setHoliDays
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


function fancyBox(id){
var string = new Array();
	$.post("includes/getSlikePorudzbine.php", {idPorudzbine:id}, function(json){
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
			alert("Nema slika za izabranu porudzbinu.");
		}
	});
	
	
}
function timeout(){
	upload();
	setTimeout(function(){
		imgRequest($('input[name="idPorudzbineHidden"]').val(), $("#sveSlike"));
	}, 500);
}

function getPorudzbina(){
	filter = new Object();
	filter.naziv = $("#naziv").val();
	filter.cena = $("#cena").val();
	filter.ime = $("#ime").val();
	filter.napomena = $("#napomena").val();
	$.post("includes/pregledPorudzbina.php", {data:filter}, function(response){
		try
		{
			var obj = $.parseJSON(response);
			var img = "";
			$("#tabelaPorudzbine").empty();
			$("#tabelaPorudzbine").append("<thead><tr><th>Ime i prezime</th><th>porudzbina</th><th>Napomena</th><th>Cena</th><th>Za datum</th></tr></thead><tbody>");
			$.each(obj, function(i, item){
				
				$("#tabelaPorudzbine").append("<tr><td class='porudzbineIme'>"+item.ime+" "+item.prezime+"</td><td class='porudzbineNaziv'>"+item.naziv+"</td><td class='porudzbineNapomena'><pre class='kurchevPre' readonly='readonly'>"+item.napomena+"</pre></td><td class='porudzbineCena'>"+item.cena+"</td><td class='porudzbineDatum'>"+item.datum+"</td><td class='porudzbineDelete'><a onclick=fancyBox('"+item.idPorudzbine+"')><img src='public/assets/img/picture.png' /></a></td><td class='porudzbineDelete'><a onclick=popupInit('"+item.idPorudzbine+"')><img src='public/assets/img/details.png' /></a></td><td class='porudzbineDelete'><a onclick=deletePorudzbina('"+item.idPorudzbine+"')><img src='public/assets/img/delete.png' /></a></td></tr>");
			});
			$("#tabelaPorudzbine").append("</tbody>");
			$("#tabelaPorudzbine").tablesorter().tablesorterPager({container: $("#pager")}); 
		}
		catch(e)
		{
			$("#tabelaPorudzbine").html("<tr><th>Error occurred:</th></tr><tr><td>"+response+"</td></tr>");
		}
	});
}

function deletePorudzbina(id){
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovu porudzbinu?");
	if (conf == true)
	{
		$.post("includes/deletePorudzbina.php", {id:id}, function(data){
			getPorudzbina();
			$("#response").html(data);
			
		});
	}
}


function getData(a){
	
	$.post("includes/pregledPorudzbina.php", {id:a}, function(data){
	var porudzbina = $.parseJSON(data);
		$("#proizvod").html(porudzbina[0].naziv);
		$("#klijent").html(porudzbina[0].ime+" "+porudzbina[0].prezime);
		$("#datepicker").val(porudzbina[0].datum);
		$("#opis").val(porudzbina[0].napomena);
	});
}

function popupInit(id)
{
$("#preview").html('');
$("#imgFile").val('');
$(".fieldset").show();
$('input[name="idPorudzbineHidden"]').val(id);
getData(id);
dobijDatume();
imgRequest(id, $("#sveSlike"));
$( "#dialog-form" ).dialog({
			autoOpen: true,
			height: 700,
			width: 850,
			modal: true,	//da se zatamni ostatak stranice
			buttons: {
				"Izmeni podatke": function() {
					porudzbinaData=new Object();
					porudzbinaData.idPorudzbine = id;
					porudzbinaData.napomena = $("#opis").val();
					porudzbinaData.datum = $("#datepicker").val();
					
					$.post("includes/updatePorudzbina.php", {data:porudzbinaData}, function(data){
						$("#response").html(data);
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
			target: '#preview'
	}).submit();
	
}

function imgRequest(id, div){
$.post("includes/getSlikePorudzbine.php", {idPorudzbine:id}, function(json){
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
