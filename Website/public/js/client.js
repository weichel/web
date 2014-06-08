$(document).ready(function(){
	$( "#button1" ).click(function() {
		var username = $('#user1').val();
		var password = $('#pass1').val();
		var company = $('#company1').val();

		$.ajax({
			type:"POST",
			url: 'http://localhost:8888/join',
			dataType: "text json",
			data: {
				username: username,
				password: password,
				company: company
			},
		}).done(function (result) {

				$("#join").remove();
			
		});	
		
	});
		

	$( "#button2" ).click(function() {
		var username = $('#user2').val();
		var password = $('#pass2').val();

		$.ajax({
			type:"POST",
			url: 'http://localhost:8888/login',
			dataType: "text json",
			data: {
				username: username,
				password: password
			},
		}).done(function (result) {
		
				$("#join").remove();
				$("#login").remove();
			
		});	
		
	});	
		
		
});

