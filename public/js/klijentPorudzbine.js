var holiDays = new Array();
var tempNiz = new Array();
$(document).ready(function(){
	$(".fieldset").hide();	
	$("#opis").focus();
	getPorudzbina();
	$("#imgSubmit").bind("click", timeout);
	
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
	$.post("includes/getProizvodSlike.php", {idProizvoda:id}, function(json){
		try
		{
			var obj = $.parseJSON(json);
		
			$.each(obj, function(i, data){
				string.push("uploads/"+data.putanja+"/"+data.naziv);
			});
		
			$.fancybox.open(string);
		}
		catch(e)
		{
			alert(json);
		}
	});
	
	
}
function timeout(){
	upload();
	setTimeout(function(){
		imgRequest($('input[name="idProizvodaHidden"]').val(), $("#sveSlike"));
	}, 500);
}

function getPorudzbina(){
	var idKlijenta = getCookie('idKlijenta');
	$.post("includes/pregledPorudzbina.php", {idKlijenta:idKlijenta}, function(response){
		try
		{
			var obj = $.parseJSON(response);
			var img = "";
			$("#tabelaPorudzbine").empty();
			$("#tabelaPorudzbine").append("<thead><tr><th>Ime i prezime</th><th>Proizvod</th><th>Napomena</th><th>Cena</th><th>Za datum</th></tr></thead><tbody>");
			$.each(obj, function(i, item){
				
				$("#tabelaPorudzbine").append("<tr><td class='porudzbineIme'>"+item.ime+" "+item.prezime+"</td><td class='porudzbineNaziv'>"+item.naziv+"</td><td class='porudzbineNapomena'><pre class='kurchevPre' readonly='readonly'>"+item.napomena+"</pre></td><td class='porudzbineCena'>"+item.cena+"</td><td class='porudzbineDatum'>"+item.datum+"</td><td class='porudzbineDelete'><a onclick=fancyBox('"+item.idProizvoda+"')><img src='public/assets/img/picture.png' /></a></td><td class='porudzbineDelete'><a onclick=popupInit('"+item.idPorudzbine+"')><img src='public/assets/img/details.png' /></a></td><td class='porudzbineDelete'><a onclick=deletePorudzbina('"+item.idPorudzbine+"')><img src='public/assets/img/delete.png' /></a></td></tr>");
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
	$('input[name="idProizvodaHidden"]').val('');
	$('input[name="tipHidden"]').val('');
	var porudzbina = $.parseJSON(data);
		$("#proizvod").html(porudzbina[0].naziv);
		$("#klijent").html(porudzbina[0].ime+" "+porudzbina[0].prezime);
		$("#datepicker").val(porudzbina[0].datum);
		$("#opis").val(porudzbina[0].napomena);
		$('input[name="idProizvodaHidden"]').val(porudzbina[0].idProizvoda);
		$('input[name="tipHidden"]').val(porudzbina[0].nazivGrupe);
		imgRequest(porudzbina[0].idProizvoda, $("#sveSlike"));
	});
}

function popupInit(id)
{
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
			imgRequest($('input[name="idProizvodaHidden"]').val(), $("#sveSlike"));
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
  deleteCookie("idKlijenta");
});