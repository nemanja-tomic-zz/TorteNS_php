$(document).ready(function(){
	$("#imgSubmit").bind("click", timeout);
	$("#finishBtn").bind("click", function(){
		deleteCookie("idPorudzbine");
		window.location.replace("index.html");
	});
	getSlikePorudzbine();
});
function getSlikePorudzbine(){
	var id = getCookie("idPorudzbine");
	$.post("includes/getSlikePorudzbine.php", {idPorudzbine:id}, function(data){
		try
		{
			var obj = $.parseJSON(data);
			$("#sveSlike").html("");
			$.each(obj, function(i, item){
				$("#sveSlike").append("<div class='slika'><img src='uploads/"+item.putanja+"/"+item.naziv+"' /><a onclick=deleteImg('"+item.idSlike+"')><img src='public/assets/img/delete.png' /></a></div>");
			});
		}
		catch(e)
		{
			$("#preview").html("Error occurred:"+data);
		}
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
	
}
function timeout(){
	$('input[name="idPorudzbineHidden"]').val(getCookie("idPorudzbine"));
	upload();
	setTimeout(function(){
		getSlikePorudzbine();
		$("#imgFile").val('');
	}, 1000);
}

function deleteImg(id){
	var conf = confirm("Da li ste sigurni da zelite da obrisete ovu sliku?");
	if (conf == true)
	{
		$.post("includes/deleteImg.php", {id:id}, function(data){
			$("#preview").html(data);
		});
		setTimeout(function(){
			getSlikePorudzbine();
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
