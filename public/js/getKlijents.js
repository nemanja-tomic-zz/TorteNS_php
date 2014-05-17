$(document).ready(function () {
    getKlijents();
    $(".fieldset").hide();
    $("#filterIme").bind("keyup", getKlijents);
    $("#filterPrezime").bind("keyup", getKlijents);
    $("#filterEmail").bind("keyup", getKlijents);
    $("#filterTelefon").bind("keyup", getKlijents);
    $("#poruci").bind('click', function () {
        window.location.replace("unosPorudzbine.html");
    });
    $("#aktuelne").bind('click', function () {
        window.location.replace("klijentPorudzbine.html");
    });
    $("#history").bind('click', function () {
        window.location.replace("klijentHistory.html");
    });
});

function popupInit(id) {

    $(".fieldset").show();
    getData(id);

    $("#dialog-form").dialog({
        autoOpen: true,
        height: 700,
        width: 700,
        modal: true,	//da se zatamni ostatak stranice
        buttons: {
            "Izmeni podatke": function () {
                var klijentData = new Object();
                klijentData.ime = $("#ime").val();
                userData = new Object();
                userData.idKlijenta = id;
                userData.ime = $("#ime").val();
                userData.prezime = $("#prezime").val();
                userData.telefon = $("#telefon").val();
                userData.telefon2 = $("#telefon2").val();
                userData.email = $("#email").val();
                userData.fblink = $("#fblink").val();
                userData.adresa = $("#adresa").val();
                userData.napomene = $("#napomene").val();
                //userData.rating = $("#rating").val();
                userData.status = $('input:radio[name=status]:checked').val();

                $.post("includes/api.php", {action: "updateClient", data: JSON.stringify(userData)}, function (data) {
                    $("#response").html(data);
                    getKlijents();
                });


                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
                deleteCookie("idKlijenta");
                deleteCookie("imeKlijenta");
            }
        },
        close: function () {
            getKlijents();
            deleteCookie("idKlijenta");
            deleteCookie("imeKlijenta");
        }

    });

}

function deleteKlijent(id) {
    var conf = confirm("Da li ste sigurni da zelite da obrisete klijenta?");
    if (conf == true) {
        var data = {
            id: id
        };
        $.post("includes/api.php", {action: "deleteClient", data: JSON.stringify(data)}, function (data) {
            getKlijents();
            var response = JSON.parse(data);
            $("#response").html(response.message);
        });
    }
}

function getKlijents() {
    var data = {
        imeF: $("#filterIme").val(),
        prezimeF: $("#filterPrezime").val(),
        emailF: $("#filterEmail").val(),
        telefonF: $("#filterTelefon").val()
    };
    var action = "getClients";

    $.post("includes/api.php", {data: JSON.stringify(data), action: action}, function (json) {
        try {
            var obj = $.parseJSON(json);
            var table = $("#tabela");
            table.empty();
            table.append("<thead><tr><th>Ime:</th><th>Prezime:</th><th>Adresa:</th><th>Telefon:</th><th>Email:</th><th>Status</th></tr></thead><tbody>");
            $.each(obj.data, function (i, item) {
                if (item.status == 1) {
                    tr = "<tr class='crnaLista'>";
                }
                else {
                    tr = "<tr>";
                }
                var statusTd = item.statusText;
                $("#tabela").append(tr + "<td class='klijentiIme'>" + item.ime + "</td><td class='klijentiPrezime'>" + item.prezime + "</td><td class='klijentiAdresa'>" + item.adresa + "</td><td class='klijentiTelefon'>" + item.telefon + "</td><td class='klijentiEmail'>" + item.email + "</td>" + statusTd + "<td class='klijentiFB'><a target='_blank' href='" + item.fblink + "'><img src='public/assets/img/fbimg.png' /></a></td><td class='klijentiDetails'><a onclick=popupInit('" + item.idKlijenta + "')><img alt='Izmeni podatke klijenta' title='Izmeni podatke klijenta' src='public/assets/img/details.png' /></a></td><td class='klijentiDelete'><a onclick='deleteKlijent(" + item.idKlijenta + ")'><img alt='Obrisi klijenta' title='Obrisi klijenta' src='public/assets/img/delete.png' /></a></td></tr>");
            });
            $(".crnaLista td").addClass("redBoja");
            table.append("</tbody>");
            table.tablesorter().tablesorterPager({container: $("#pager")});
        }
        catch (e) {
            $("#tabela").html("<tr><th>Error occurred:</th></tr><tr><td>" + e.message + json + "</td></tr>");
        }
    });
}
function getData(a) {
    var action = "getClient";
    var data = {
        id : a
    };
    $.post("includes/api.php", {action: action, data: JSON.stringify(data)}, function (data) {
        var response = $.parseJSON(data);
        var klijent = response.data;
        $("#ime").val(klijent.ime);
        $("#prezime").val(klijent.prezime);
        $("#telefon").val(klijent.telefon);
        $("#telefon2").val(klijent.telefon2);
        $("#adresa").val(klijent.adresa);
        $("#email").val(klijent.email);
        $("#fblink").val(klijent.fblink);
        $("#napomene").val(klijent.napomene);
        //slider(klijent.rating);
        $('input:radio[name=status]')[klijent.status].checked = true;
        setCookie("idKlijenta", a);
        var ime = klijent.ime + " " + klijent.prezime;
        setCookie("imeKlijenta", ime);
    });
}

function slider(rating) {
    $("#slider-range-min").slider({
        range: "min",
        value: rating,
        min: 0,
        max: 10,
        step: 0.5,
        slide: function (event, ui) {
            $("#rating").val(ui.value);
        }
    });
    $("#rating").val($("#slider-range-min").slider("value"));
}
