$(document).ready(function(){
	tabsInit();
	$("#submitTorte").bind("click", insertTorte);
	$("#submitCups").bind("click", insertCups);
	$("#submitFigurice").bind("click", insertFigurice);
	$("#submitMisc").bind("click", insertMisc);
});
function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
}

function tabsInit() {
		$( "#tabs" ).tabs({
			ajaxOptions: {
				error: function( xhr, status, index, anchor ) {
					$( anchor.hash ).html(
						"Couldn't load this tab. We'll try to fix this as soon as possible. " +
						"If this wouldn't be a demo." );
				}
			}
		});
}

function insertTorte(){

	$("#preview").html('');
	$("#preview").html('<img src="public/assets/img/loader.gif" alt="Uploading...."/>');
	$("#formTorte").ajaxForm({
			target: '#preview'
	}).submit();
}
function insertCups(){

	$("#previewCups").html('');
	$("#previewCups").html('<img src="public/assets/img/loader.gif" alt="Uploading...."/>');
	$("#formCups").ajaxForm({
			target: '#previewCups'
	}).submit();
}
function insertFigurice(){
	$("#previewFigurice").html('');
	$("#previewFigurice").html('<img src="public/assets/img/loader.gif" alt="Uploading...."/>');
	$("#formFigurice").ajaxForm({
			target: '#previewFigurice'
	}).submit();
}
function insertMisc(){
	$("#previewMisc").html('');
	$("#previewMisc").html('<img src="public/assets/img/loader.gif" alt="Uploading...."/>');
	$("#formMisc").ajaxForm({
			target: '#previewMisc'
	}).submit();
}

