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

function getPorudzbina(){
	filter = new Object();
	filter.naziv = $("#naziv").val();
	filter.cena = $("#cena").val();
	filter.ime = $("#ime").val();
	filter.napomena = $("#napomena").val();
	$.post("includes/starePorudzbine.php", {data:filter}, function(response){
		try
		{
			var obj = $.parseJSON(response);
			var img = "";
			$("#tabelaPorudzbine").empty();
			$("#tabelaPorudzbine").append("<thead><tr><th>Ime i prezime</th><th>Proizvod</th><th>Napomena</th><th>Cena</th><th>Za datum</th></tr></thead><tbody>");
			$.each(obj, function(i, item){
				
				$("#tabelaPorudzbine").append("<tr><td class='porudzbineIme'>"+item.ime+" "+item.prezime+"</td><td class='porudzbineNaziv'>"+item.naziv+"</td><td class='porudzbineNapomena'><pre class='kurchevPre' readonly='readonly'>"+item.napomena+"</pre></td><td class='porudzbineCena'>"+item.cena+"</td><td class='porudzbineDatum'>"+item.datum+"</td><td class='porudzbineDelete'><a onclick=fancyBox('"+item.idProizvoda+"')><img src='public/assets/img/picture.png' /></a></td><td class='porudzbineDelete'><a onclick=popupInit('"+item.idPorudzbine+"')><img src='public/assets/img/details.png' /></a></td></tr>");
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



function getData(a){
	
	$.post("includes/pregledPorudzbina.php", {id:a}, function(data){
	$('input[name="idProizvodaHidden"]').val('');
	$('input[name="tipHidden"]').val('');
	var porudzbina = $.parseJSON(data);
		$("#proizvod").html(porudzbina[0].naziv);
		$("#klijent").html(porudzbina[0].ime+" "+porudzbina[0].prezime);
		$("#datepicker").html(porudzbina[0].datum);
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
					porudzbinaData.datum = $("#datepicker").html();
					
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




function imgRequest(id, div){
$.post("includes/getProizvodSlike.php", {idProizvoda:id}, function(json){
	try
		{
		div.empty();
			var obj = $.parseJSON(json);
			if(typeof obj =='object')
			{		
				$.each(obj, function(i, item){
					div.append("<div class='slika'><img src='uploads/"+item.putanja+"/"+item.naziv+"' /></div>");
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
