$(document).ready(function(){
	$("#submit").bind("click", insertUser);
	test();

	$('#fblink').bind("keyup", function(){
		akoFejsbuk($("#fblink").val());
	});
        $('#ime').focusout(function(){
            if($("#ime").val() == "")
            {
		$("#prezime").autocomplete({
			source: window.dataPrezime
		});
            }
            else
            {
                $("#prezime").autocomplete({
                    source: prezimenoNizoTraz($("#ime").val())
                });
            }
        });
        $('#prezime').focusout(function(){
            if($("#prezime").val() == ""){
		$("#ime").autocomplete({
			source: window.dataIme
		});
            }
            else{
		$("#ime").autocomplete({
			source: imenoNizoTraz($("#prezime").val())
		});
            }
        });
});

//vraca sva prezimena koja odgovaraju prosledjenom imenu
//jebem ti mater unapred kad budem ovo citao

function imenoNizoTraz(prezime){
    var niz = [];
    $.each (window.sve, function (i, item){
        if (item.prezime == prezime)
            niz.push(item.ime);
    });
    return niz;
}

//i obrnuto

function prezimenoNizoTraz(ime){
    var niz = [];
    $.each (window.sve, function (i, item){
        if (item.ime == ime)
            niz.push(item.prezime);
    });
    return niz;
}

function insertUser(){
var conf = confirm("Da li ste sigurni da zelite da registrujete klijenta?");
	if (conf == true)
	{
		userData=new Object();
		userData.ime = $("#ime").val();
		userData.prezime = $("#prezime").val();
		userData.telefon = $("#telefon").val();
		userData.telefon2 = $("#telefon2").val();
		userData.email = $("#email").val();
		userData.fblink = $("#fblink").val();
		userData.adresa = $("#adresa").val();
		userData.napomene = $("#napomena").val();
		userData.status = $('input:radio[name=status]:checked').val();
	
		if(userData.ime != '')
		{
			$.post("includes/insertUser.php", {data:userData}, function(data){
				$("#dada").html(data);
			});
		}
		else
		{
			alert("Morate popuniti polje sa imenom klijenta.");
		}
	}
	
}
//da li postoji obj unutar arr
//ako vrati true dos'o je (dr) Dopoklapanja (i zena mu, Binda)
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
}
function toUpCase(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function akoFejsbuk(unetaAdresa){
	var tmp = [];
	$("#daLiFejsbuk").html('');
	tmp = unetaAdresa.split(".com/");
	for(var i = 0; i<window.fbLink.length; i++)
	{
		if(window.fbLink[i].indexOf(tmp[1]) != -1){
			$("#daLiFejsbuk").html("Vec postoji");
			break;
		}
	}
	//window.fbLink[i];
			
	console.log(tmp[1]);
}

function test(){
	window.dataIme = [];
	window.dataPrezime = [];
	window.fbLink = [];
	var imeTmp = "";
	var prezimeTmp = "";
	$.post("includes/filteredKlijent.php", {ime: "", prezime: "", email: "", telefon: ""} ,function(json){
	 try
		{
			var obj = $.parseJSON(json);
			window.sve = obj;
			$.each(obj, function(i, item){
			imeTmp = item.ime.toLowerCase();
			prezimeTmp = item.prezime.toLowerCase();
				if(!include(window.dataIme, imeTmp)){
					window.dataIme.push(imeTmp);
				}
				if(!include(window.dataPrezime, prezimeTmp))
					window.dataPrezime.push(prezimeTmp);
				if(!include(window.fbLink, item.fblink) && item.fblink != '')
					window.fbLink.push(item.fblink);
			});
			$.each(window.dataIme, function(i, ime){
				window.dataIme[i] = toUpCase(ime);
			});
			$.each(window.dataPrezime, function(i, prezime){
				window.dataPrezime[i] = toUpCase(prezime);
			});
                        
		}
		catch(e)
		{
			$("#dada").html(e.message);
		}
	});
	
	$("#prezime").autocomplete({
		source: window.dataPrezime
	});
        $("#ime").autocomplete({
		source: window.dataIme
	});
	
	
}
/*		PROSLA SLAJDER FUNKCIJA NEKADA DAVNO KORISCENA,DANAS ZABORAVLJENA i VREMENOM PREGAZENA	/// R.I.P.
$(function() {
		$( "#slider-range-min" ).slider({
			range: "min",
			value: 0,
			min: 0,
			max: 10,
			step: 0.5,
			slide: function( event, ui ) {
				$( "#rating" ).val(ui.value );
			}
		});
		$( "#rating" ).val( $( "#slider-range-min" ).slider( "value" ) );
	});
	*/
