function getPorudzbine(){
	$.post("includes/api.php", {action: "getIncomingOrders"}, function(response){
        var obj = $.parseJSON(response);
        var table = $("#indexTabela");
        var content = "";
        content += "<thead><tr><th>Ime</th><th>Prezime</th><th>Napomena</th><th>Za datum</th><th>Proizvod</th><th>Cena</th><th>Slika</th></tr></thead><tbody>";
        var dateHelper = new Date();
        $.each(obj.data, function(i, item){
            var jsDate = new Date(item.datumTransakcije);
            //if petlja koja povlaci liniju koja odvaja datume
            if (jsDate > dateHelper) {
                linija = "<tr><td class='homeLinija'></td><td class='homeLinija'></td>";
                linija += "<td class='homeLinija'></td><td class='homeLinija'></td>";
                linija += "<td class='homeLinija'></td><td class='homeLinija'></td>";
                linija += "<td class='homeLinija'></td></tr>";
                dateHelper = jsDate;
            } else {
                linija = "";
            }
            if (item.nazivSlike == undefined ) {
                img="<td></td>";
            } else {
                img = "<td class='indexSlikaTd'><a onclick=fancyBox('"+item.idProizvoda+"')><img class='indexSlika' src='"+"uploads/"+item.putanja+"/"+item.nazivSlike+"'/></a></td>";
            }
                content += linija+"<tr><td class='indexIme'>"+item.ime+"</td>";
            content += "<td class='indexPrezime'>"+item.prezime+"</td>";
            content += "<td class='indexNapomena'>"+item.napomena+"</td>";
            content += "<td class='indexZaDatum'>"+item.datumTransakcije+"</td>";
            content += "<td class='indexProizvod'>"+item.nazivProizvoda+"</td>";
            content += "<td class='indexCena'>"+item.cena+"</td>"+img+"</tr>";
        });
        content += "</tbody>";
        table.append(content);
	});
}
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