$(function() {


function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}


function getInviteesNames(invitessIds) {

	var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://glass-tribute-131519.appspot.com/names");
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
			var response = JSON.parse(xhr.responseText);
			for (var i = 0 ; i < response.length; i++) {
				var friend = response[i];
				var newFriend = '<li>' + '<p>'+friend+'</p>' + '</li>'
				$('#friends-list').append(newFriend);
			}
        }
        else{
            if(xhr.status == 408 ){
                console.log("error");
            }
        }
    };
    xhr.send(JSON.stringify(invitessIds));

}

function initEvent() {

	var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://glass-tribute-131519.appspot.com/event");
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
			var response = JSON.parse(xhr.responseText);
						console.log(response);
			getInviteesNames(response.invitees);
			$("#eventName").val(response.title);
			$("#eventDesc").val(response.description);
			$("#pac-input").val(response.location);
			$( "#eventTypeSpan" ).text(response.eventType);

			// create the new li from the form input
			for(var i = 0; i<response.shoppingList.length; i++) {
				var item = response.shoppingList[i].item;
				var newTask;
				if(response.shoppingList[i].userId && response.shoppingList[i].userId !== "") {
					newTask = '<li id="'+ response.shoppingList[i].userId +'" class="complete disabled">' + '<p>'+item+'</p>' + '</li>';
				}else {
					newTask = '<li>' + '<p>'+item+'</p>' + '</li>';
				}
				
				$('#task-list').prepend(newTask);
			}


			for( var j = 0; j < response.availableDates.length; j++) {
				var text = response.availableDates[j].eventDate + ' from: ' + response.availableDates[j].fromTime + ' to: ' + response.availableDates[j].toTime;
				var checkbox = '<input type="checkbox" id="' + j + '">';
				checkbox = checkbox + '<label for="my-profile__checkbox">' + text + '</label><br>';
				$("#dates-checkboxes").append(checkbox);
			}

        }
        else{
            if(xhr.status == 408 ){
                console.log("error");
            }
        }
    };
	var eventId = { "eventId": getQueryVariable('eventId') };
	localStorage.setItem("eventId",getQueryVariable('eventId'));
    xhr.send(JSON.stringify(eventId));

}

initEvent();

var jsonFriends = JSON.parse(localStorage.getItem("friendList"));
var friendArray = [];
for (var i = 0; i < jsonFriends.length; i++) {
	var JSONObj = { "label" : jsonFriends[i].name, "value"  : jsonFriends[i].name, "id" : jsonFriends[i].id };
	friendArray.push(JSONObj);
}


$("#friends-search").autocomplete({
      source: friendArray,
      select: function( event, ui ) {
      	console.log(ui);
      	// create the new li from the form input
		var friend = ui.item.value;
		var newFriend = '<li>' + '<p id='+ui.item.id+'>'+friend+'</p>' + '</li>'
		$('#friends-list').append(newFriend);

		// clear form when button is pressed
		$("#friends-search").val('');

		// Alert if the form in submitted empty
		if (friend.length == 0) {
			alert('please enter a task');
		};
      }
    });

});

$( document ).ready(function() {
 
 var datesNumber = 0;

/////////// step-1-btn click /////////
	$( "#step-1-btn" ).click(function() {
  	$("#form-car").addClass('active');
  	$("#form-car-tab").addClass('active')

  	localStorage.setItem("eventName",$("#eventName").val());
  	localStorage.setItem("eventDesc",$("#eventDesc").val());	

	$("#form-flight").removeClass('active');  	
  	$("#form-flight-tab").removeClass('active');
});
/////////// step-1-btn click /////////

/////////// step-2-btn click /////////
	$( "#step-2-btn" ).click(function() {
  	$("#form-friends").addClass('active');
  	$("#form-friends-tab").addClass('active')

  	$("#form-hotel").removeClass('active');
  	$("#form-hotel-tab").removeClass('active')
});
/////////// step-2-btn click /////////

/////////// step-3-btn click /////////
	$( "#step-3-btn" ).click(function() {
  	$("#form-car").removeClass('active');
  	$("#form-car-tab").removeClass('active')

  	$("#form-package").addClass('active');
  	$("#form-package-tab").addClass('active')
});
/////////// step-3-btn click /////////


/////////// step-4-btn click /////////
	$( "#step-4-btn" ).click(function() {
  	$("#form-package").removeClass('active');
  	$("#form-package-tab").removeClass('active')

  	$("#form-hotel").addClass('active');
  	$("#form-hotel-tab").addClass('active')
});
/////////// step-4-btn click /////////


	$( "#finish-btn" ).click(function() {
		// tab 1
		var eventName = localStorage.getItem("eventName");
		var eventDesc = localStorage.getItem("eventDesc");
		var eventType = $( "#eventType option:selected" ).text();
		var location = $("#pac-input").val();
		var dates = [];
		var itemsList = [];
		var invitees = [];
		//tab 2
		$( "#all-dates-div > div" ).each(function( index ) {
  			var eventDate =  $(this).children().find('.eventDate');
  			var from =  $(this).children().find('.date-from');
  			var to =  $(this).children().find('.date-to');
  			var dateObject = { "eventDate" : eventDate.val() , "fromTime": from.val() , "toTime": to.val() };
			dates.push(dateObject);
		});

		$( "#task-list li" ).each(function( index ) {
  			console.log( index + ": " + $( this ).text() );
  			var itemObject = { "item" : $( this ).text() , "userId": ''};
  			itemsList.push(itemObject);
		});

		$( "#friends-list li > p" ).each(function( index ) {
  			console.log( index + ": " + $( this ).attr("id") );
  			invitees.push($( this ).attr("id"));
		});

		console.log(itemsList);
		console.log(dates);
		console.log(invitees);

		var loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

		var event = {
  "userId": loggedUser.id,
  "title": eventName,
  "description": eventDesc,
  "eventType": eventType,
  "availableDates": dates,
  "shoppingList": itemsList,
  "invitees": invitees,
  "location": location
};

	var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://glass-tribute-131519.appspot.com/createevent");
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
			console.log("OK");
        }
        else{
            if(xhr.status == 408 ){
                console.log("error");
            }
        }
    };
    xhr.send(JSON.stringify(event));

console.log(event);


	});


//////// suggested post list items //////

var gotSuggested = 0;

$("#suggested-tab").click(function() {
	var itemsList = [], eventType, data;
	$( "#task-list li" ).each(function( index ) {
  		console.log( index + ": " + $( this ).text() );
  		itemsList.push($( this ).text());
	});
	console.log(itemsList);
	eventType = $( "#eventType option:selected" ).text();
	data = { "eventType" : eventType , "shoppingList"  : itemsList };
	console.log(data);


	var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://glass-tribute-131519.appspot.com/suggested");
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
			if (gotSuggested == 0) {
			gotSuggested = 1;
			var response = JSON.parse(xhr.responseText);
			var newItem;
			$('#task-list-suggested').empty();
			for(var i=0; i<response.length; i++) {
				newItem = '<li>' + '<p>'+response[i]+'</p>' + '</li>'
				$('#task-list-suggested').prepend(newItem);
			}

			$('#task-list-suggested li').click(function(e) 
    		{ 
    			var newTask = '<li>' + '<p>'+$( this ).text() +'</p>' + '</li>'
				$('#task-list').prepend(newTask);
     			$( this ).remove();
    		});
			
            console.log(response);
			}
        }
        else{
            if(xhr.status == 408 ){
                console.log("error");
            }
        }
    };
    xhr.send(JSON.stringify(data));


});
/////// suggested post list items ////////


	$("#add-date-btn").click(function() {
		var goodDates = [];
		$( "#dates-checkboxes :input" ).each(function( index ) {
  			if ($( this ).is(":checked") ) {
  				goodDates.push(parseInt($( this ).attr('id')));
  			}
		});

		var loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
		var object = {"eventId": localStorage.getItem("eventId"), "userId": loggedUser.id, "goodDates": goodDates  };

		var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://glass-tribute-131519.appspot.com/dates");
        xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
			alert("Dates confirmed");
			window.location = "myEvents.html"
        }
        else{
            if(xhr.status == 408 ){
                console.log("error");
            }
        }
    };

	console.log(object);
    xhr.send(JSON.stringify(object));




	});


	$("#create-task").keyup(function(event){
    if(event.keyCode == 13){
        $('button#create-task').click();
    }
	});


	//  main button click function
	$('button#create-task').on('click', function(){
		var data;
		var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://glass-tribute-131519.appspot.com/items");
        xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
			alert("those items are your responsibility!");
        }
        else{
            if(xhr.status == 408 ){
                console.log("error");
            }
        }
    };

		var itemsList = [];
		$( "#task-list li" ).each(function( index ) {
  		console.log( index + ": " + $( this ).text() );
  		var userId;
  		if($( this ).attr('id')) {
  			userId = $( this ).attr('id');
  		} else {
  			userId="";
  		}
  		var itemObject = { "item" : $( this ).text() , "userId": userId };
  		itemsList.push(itemObject);
		});

		var eventId = localStorage.getItem("eventId");
		var dataObject = { "eventId": eventId, "shoppingList": itemsList };
		console.log(dataObject);
    xhr.send(JSON.stringify(dataObject));


	});

	// mark as complete
	$(document).on('click','li',function(){
		var loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
		$(this).toggleClass('complete');

		if ($(this).attr('id')) {
        $(this).removeAttr('id');
    } else {
        $(this).attr("id",loggedUser.id);
    }
	});
	
	// double click to remove
	$(document).on('dblclick','li',function(){
		$(this).remove();
	});

	// Clear all tasks button
	$('button#clear-all-tasks').on('click', function(){
		$('#task-list li').remove();
		$('.task-headline').fadeOut();
		$('#controls').fadeOut();
		$('.nothing-message').show('fast');
	});


});