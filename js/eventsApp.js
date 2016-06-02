$(function() {

/////////////////////////get myevents list/////////////////////////
function parseEvent(Event)
{
	var result = '<div class="user-review">';
	result = result + '<div class="row review-item">';
	result = result + '<div class="col-xs-12">';
	result = result + '<div class="review-header">';
	result = result + '<h4>' + Event['title'] + '</h4>';
	result = result + '<a href="user-review.html#" class="btn">See details</a>';
	result = result + '</div>';
	result = result + '</div>';
	result = result + '</div>';
	result = result + '<div class="col-xs-3 review-number">';
	if ("finalDate" in obj){
		fd = Event["finalDate"];
		result = result + '<ins>' + fd["fromTime"] + '</ins>';
		result = result + '<ins>' + 'Day' + '</ins>';
		result = result + '<ins>' + fd["eventDate"] + '</ins>';

	}
	else{
		result = result + 'To be discussed...';
	}
	result = result + '</div>';
	result = result + '<div class="col-xs-9 review-text">';
	result = result + '<ul>';
	result = result + '<li><span class="icon fa fa-plus"></span>' + Event["location"] + '</li>';
	result = result + '<li><span class="icon fa fa-plus"></span>' + Event["eventType"] + '</li>';
	result = result + '<p>' + Event["description"] + '</p>';
	result = result + '</div>';
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
				newItem = parseEvent(response[i])
				$('events-list').append(newItem);
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