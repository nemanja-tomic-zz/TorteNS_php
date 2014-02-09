var holiDays = new Array();
var tempNiz = new Array();
$(document).ready(function(){
	dobijDatume();
	getPorudzbine();
});

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
			monthNames: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
			beforeShowDay: setHoliDays,
			onSelect: function(date) {
					var url = "unosPorudzbine.html";
					setCookie("datum", date)
					window.location.href = url;
				},
			numberOfMonths: [3, 1]
		});
		
		}
		catch(e)
		{
			$("#msg").html(e.message);
		}
	});
}