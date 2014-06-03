$(document).ready(function () {
var ordersList = [];

    var data= {ime : "", naziv:"", cena:"", napomena:""};
    $.post("includes/api.php", {action: "filterorders", data: JSON.stringify(data)}, function(json){
        var obj = $.parseJSON(json);
        for (var i= 0; i<obj.data.length; i++) {
            //setuj pocetni dan - od datuma transakcije oduzeti dane spremanja
            var datumTransakcije = new Date (obj.data[i].datumTransakcije);
            var imeklase = "calendarClass"+(obj.data[i].idGrupe);

            var newObject = {
                id : obj.data[i].id,
                title: obj.data[i].naziv,
                start: datumTransakcije,
                end: datumTransakcije,
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
                console.log(event);
            },
            dayClick: function() {
                alert('a day has been clicked!');
            },
            eventMouseOver:function() {

            }
        });
        $('#calendar').fullCalendar('today');

    });



});

