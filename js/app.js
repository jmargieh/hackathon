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

		// remove nothing message
		if ('.nothing-message') {
			$('.nothing-message').hide('slide',{direction:'left'},300)
		};

		// create the new li from the form input
		var task = $('input[name=task-insert]').val();
		var newTask = '<li>' + '<p>'+task+'</p>' + '</li>'
		$('#task-list').append(newTask);

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