$(document).ready(function () {
    var d = new Date();
    window.currentDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            //right: 'month,agendaWeek,agendaDay'
            right: 'month,agendaWeek'
        },
        defaultDate: window.currentDate,
        firstDay: 1,
        editable: false,
        events: [
            {
                title: 'All Day Event',
                name: 'ol dej ivent',
                start: '2014-05-04'
            },
            {
                title: 'All Day Event',
                name: 'ol dej ivent',
                start: '2014-05-01'
            },
            {
                title: 'All Day Event',
                name: 'ol dej ivent',
                start: '2014-05-07'
            },
            {
                title: 'All Day Event',
                name: 'ol dej ivent',
                start: '2014-05-08'
            },
            {
                title: 'All Day Event',
                name: 'ol dej ivent',
                start: '2014-05-01'
            },
            {
                title: 'All Day Event',
                name: 'ol dej ivent',
                start: '2014-05-01'
            },
            {
                title: 'Long Event',
                name: 'ol dej ivent',
                start: '2014-05-07',
                end: '2014-05-10'
            },
            {
                title: 'All Day Event',
                name: 'ol dej ivent',
                start: '2014-05-01'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: '2014-04-09T16:00:00',
                name: 'ol dej ivent'
            },
            {
                id: 999,
                name: 'ol dej ivent',
                title: 'Repeating Event',
                start: '2014-05-16T16:00:00'
            },
            {
                title: 'Meeting',
                name: 'ol dej ivent',
                start: '2014-04-12T10:30:00',
                end: '2014-01-12T12:30:00'
            },
            {
                title: 'Lunch',
                name: 'ol dej ivent',
                start: '2014-01-12T12:00:00'
            },
            {
                title: 'Birthday Party',
                name: 'ol dej ivent',
                start: '2014-01-13T07:00:00'
            },
            {
                title: 'Click for Google',
                name: 'ol dej ivent',
                url: 'http://google.com/',
                start: '2014-01-28'
            }
        ],
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

