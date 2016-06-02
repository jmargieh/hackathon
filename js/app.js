$(function() {

// var availableTags = [
//       "ActionScript",
//       "AppleScript",
//       "Asp",
//       "BASIC",
//       "C",
//       "C++",
//       "Clojure",
//       "COBOL",
//       "ColdFusion",
//       "Erlang",
//       "Fortran",
//       "Groovy",
//       "Haskell",
//       "Java",
//       "JavaScript",
//       "Lisp",
//       "Perl",
//       "PHP",
//       "Python",
//       "Ruby",
//       "Scala",
//       "Scheme"
//     ];

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
  	$("#form-hotel").addClass('active');
  	$("#form-hotel-tab").addClass('active')

	$("#form-flight").removeClass('active');  	
  	$("#form-flight-tab").removeClass('active');
});
/////////// step-1-btn click /////////

/////////// step-2-btn click /////////
	$( "#step-2-btn" ).click(function() {
  	$("#form-car").addClass('active');
  	$("#form-car-tab").addClass('active')

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

  	$("#form-friends").addClass('active');
  	$("#form-friends-tab").addClass('active')
});
/////////// step-4-btn click /////////


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

		$("#date-div-0").clone().prop({ id: "date-div-"+ ++datesNumber }).appendTo("#all-dates-div");
	});


	$("#create-task").keyup(function(event){
    if(event.keyCode == 13){
        $('button#create-task').click();
    }
	});


	//  main button click function
	$('button#create-task').on('click', function(){


		// create the new li from the form input
		var task = $('input[name=task-insert]').val();
		var newTask = '<li>' + '<p>'+task+'</p>' + '</li>'
		$('#task-list').prepend(newTask);

		// clear form when button is pressed
		$('input').val('');

		// Alert if the form in submitted empty
		if (task.length == 0) {
			alert('please enter a task');
		};

		// makes other controls fade in when first task is created
		$('#controls').fadeIn();
		$('.task-headline').fadeIn();
	});

	// mark as complete
	$(document).on('click','li',function(){
		$(this).toggleClass('complete');
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