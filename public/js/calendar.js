$(document).ready(function () {
var ordersList = [];

    var data= {ime : "", naziv:"", cena:"", napomena:""};
    $.post("includes/api.php", {action: "filterorders", data: JSON.stringify(data)}, function(json){
        var obj = $.parseJSON(json);
        for (var i= 0; i<obj.data.length; i++) {
            var imeklase = "calendarClass"+(obj.data[i].idGrupe);

            var newObject = {
                id : obj.data[i].idPorudzbine,
                title: obj.data[i].naziv,
                start: obj.data[i].startDate + "T00:00:00",
                end: obj.data[i].datumTransakcije+"T23:59:00",
                className : imeklase
            }
            ordersList.push(newObject);
            newObject = null;
        }

        var d = new Date();
        window.currentDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

        $('#calendar').fullCalendar({
            header: {
                left: 'prev today',
                center: 'title',
                //right: 'month,agendaWeek,agendaDay'
                right: 'today next'
            },
            defaultDate: window.currentDate,
            firstDay: 1,
            editable: false,
            events: ordersList,
            eventClick: function(event) {
                console.log(event.id);
                var data = {
                    id: event.id
                };
                $.post("includes/api.php", {action: "getOrder", data: JSON.stringify(data)}, function(response){
                    console.log(response);
                });
            },
            dayClick: function(e) {
                alert("KLIKNI NA EVENT USTA TE JEBEM");
            },
            eventMouseOver:function() {

            }
        });
        $('#calendar').fullCalendar('today');

    });



});

