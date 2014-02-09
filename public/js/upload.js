$(document).ready(function(){
	$("#dugme").bind("click", upload);
});

function upload(){

 	$("#preview").html('');
	$("#preview").html('<img src="public/assets/img/loader.gif" alt="Uploading...."/>');
	$("#imageform").ajaxForm({
			target: '#preview'
	}).submit();
}