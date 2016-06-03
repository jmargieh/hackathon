$(function() {

/////////////////////////get myevents list/////////////////////////
function parseEvent(Event, key)
{

	var result = '<div class="user-review">';
	result = result + '<div class="row review-item">';
	result = result + '<div class="col-xs-12">';
	result = result + '<div class="review-header">';
	result = result + '<h4>' + Event['title'] + '</h4>';
	result = result + '<a href="event.html?eventId=' + key + '" class="btn">See details</a>';
	result = result + '</div>';
	result = result + '</div>';
	result = result + '<div class="col-xs-3 review-number">';
	if ("finalDate" in Event){
		fd = Event["finalDate"];
		result = result + '<ins>' + fd["fromTime"] +'-'+ fd["toTime"] + '@' + fd["eventDate"] + '</ins>';
	}
	else{
		result = result + '<ins>Event Not Closed Yet!</ins>';
	}
	result = result + '</div>';

	result = result + '<div class="col-xs-9 review-text my-profile" style="padding-bottom: 10px;">';
	result = result + '<ul>';
	result = result + '<li><span>Location: </span>' + Event["location"] + '</li>';
	result = result + '<li><span>Event type: </span>' + Event["eventType"] + '</li>';
	result = result + '<ul></div>'
	result = result + '<p style="margin-left: 15px; margin-top: 20px; padding-top: 20px;">' + Event["description"] + '</p>';
	result = result + '</div>';
	result = result + '</div>';

	return result;
}

function getEventsList()
{
	var gotEventsLIst = 0;
	var loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
	data = {"userId": loggedUser.id };
	console.log(data);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "https://glass-tribute-131519.appspot.com/alluserevents");
	xhr.onreadystatechange = function(){
	if(xhr.readyState == 4 && xhr.status == 200){
		if (gotEventsLIst == 0) {
			gotEventsLIst = 1;
			var response = JSON.parse(xhr.responseText);
			var newItem;
			for(var i=0; i<response.length; i++) {
				var key = Object.keys(response[i])[0];
				newItem = parseEvent(response[i][key], key);
				$('#events-list').append(newItem);
			}
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
}

getEventsList();

});