var clndr = {};

var today = moment().format('YYYY-MM-DD');
var task_number = 0;
var checked_number = 0;

$( function() {
  // PARDON ME while I do a little magic to keep these events relevant for the rest of time...

  var events = [];

  clndr = $('#full-clndr').clndr({
    template: $('#full-clndr-template').html(),
    clickEvents: {
      click: function (target) {
        DATE = target.date['_i'];
	document.getElementById("task_date").innerHTML = DATE;

	show_tasks(DATE);

	var inner_html = target.element.innerHTML;
	target.element.innerHTML="<span data-toggle='modal' data-target='#tasks_submit'>"+ inner_html + "</span>"
	setTimeout(function(){ target.element.innerHTML = "<span class='day-number'>" + target.date['_a'][2] + "</span> ";}, 1000);
	document.getElementById('Date').value = DATE;

	if(DATE == today){
	  document.getElementsByClassName("event-listing-title")[0].innerHTML="TASKS TODAY";
	} else {
	  document.getElementsByClassName("event-listing-title")[0].innerHTML="TASKS THIS DATE";
	}
	//console.log('Cal-1 clicked: ', target)
      },
      onMonthChange: function () {
        show_color();
      }
    },
    events: events,
    forceSixRows: true
  });
  
  $('#t_submit').click(function (){
    form = document.getElementsByTagName('form')[0]; 	 
    form.submit();
  });
});

function show_tasks(date){
  $.getJSON($SCRIPT_ROOT + '/tasks', 
	     {DATE: date},
	     function (data){
	         i = 1;
		 task_number = 0;
		 checked_number = 0;
	         for(x in data){
		     //console.log(data[x]);
		     task_label = "T" + x;
		     check_label = x + "_";
		     checkbox_label = "checkbox" + x.substr(-1);
		     if(data[x] != ""){
			 task_number++;	
		         Data = data[x].split("+");
		         document.getElementById(x).value = Data[0];
		         document.getElementById(task_label).innerHTML = " " + Data[0];
		         document.getElementById(check_label).style = "display:block";
		         if(Data[1] == "True"){
			     document.getElementById(checkbox_label).checked = true;
			     checked_number++;
		         } else {
			     document.getElementById(checkbox_label).checked = false;
			 }
		     } else {
		         document.getElementById(x).value = "";
		         document.getElementById(task_label).innerHTML = "";
		         document.getElementById(check_label).style = "display:none";
		     }
		     i++;
	         }
		 //console.log(task_number);
		 //console.log(checked_number);
		 if(task_number != 0){
  		     D = date.split("-");
		     for(x in D){
    		       D[x] = parseInt(D[x]);
    		       if(x == 1){
      			 D[x] = D[x]-1;
    		       }
  		     }
		     date_from_now = moment(D).fromNow().substr(0,2);
		     //console.log(moment(D).fromNow());
		     if(checked_number == 0){
			 if(date_from_now == "in" || today == date){
		           document.getElementById(date).style = "background:#71bbd2"
			 } else {
		           document.getElementById(date).style = "background:#ff5a45"
			 }
                     } else if (checked_number < task_number){
		         document.getElementById(date).style = "background:#FAEBD7"
		     } else if (checked_number == task_number){
		         document.getElementById(date).style = "background:#97ce7f"
		     }
		 }
	 });
}

function check(x){
  id = x.id; 
  i = id.substr(id.length-1,1);
  Task_id = "TTask" + i;
  task = document.getElementById(Task_id).innerHTML;
  if(x.checked){
  	console.log("checked");
	checked_number++;
  	$.getJSON($SCRIPT_ROOT + '/checked',
  			 { DATE:DATE, TASK: task},
  			 function (data){
  			   console.log(data);
  			 });
  } else {
  	console.log("unchecked");
	checked_number--;
  	$.getJSON($SCRIPT_ROOT + '/unchecked',
  			 { DATE:DATE, TASK: task},
  			 function (data){
  			   console.log(data);
  			 });
  }
  //console.log(checked_number);
  date = document.getElementById("task_date").innerHTML;
  if(task_number != 0){
    D = date.split("-");
    for(x in D){
      D[x] = parseInt(D[x]);
      if(x == 1){
        D[x] = D[x]-1;
      }
    }
    date_from_now = moment(D).fromNow().substr(0,2);
    //console.log(moment(D).fromNow());
    if(checked_number == 0){
      if(date_from_now == "in" || today == date){
        document.getElementById(date).style = "background:#71bbd2"
      } else {
        document.getElementById(date).style = "background:#ff5a45"
      }
    } else if (checked_number < task_number){
        document.getElementById(date).style = "background:#FAEBD7"
    } else if (checked_number == task_number){
	document.getElementById(date).style = "background:#97ce7f"
    }
  }
}

window.onload = function(){
  show_color();
}

function show_color(){
  var first_day = document.getElementsByClassName("calendar-dow-0")[0];
  first_day = first_day.id.split("-");
  for(x in first_day){
    first_day[x] = parseInt(first_day[x]);
    if(x == 1){
      first_day[x] = first_day[x]-1;
    }
  }
  day = moment(first_day).format('YYYY-MM-DD');
  for(var i=0; i<42; i++){
    //console.log(day);
    show_tasks(day);
    day=moment(day).add('day', 1).format('YYYY-MM-DD');
  }
  show_tasks(today);
  document.getElementsByClassName("event-listing-title")[0].innerHTML="TASKS TODAY";
}
