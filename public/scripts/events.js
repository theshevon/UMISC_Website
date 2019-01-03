var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var d = new Date();
var currentDay = d.getDate();
var currentMonth = d.getMonth();
var currentYear = d.getFullYear();

init();

$(".fas").on("click", function(event){
	if ($(this).hasClass("fa-angle-left")){
		if (currentMonth === 0){
			currentMonth = 11;
			currentYear--;
		}else{
			currentMonth--;
		}
	}else{
		if (currentMonth === 11){
			currentMonth = 0;
			currentYear++;
		}else{
			currentMonth++;
		}
	}

	changeMonth(currentMonth, currentYear);
	event.stopPropagation();
});

$(".close-button").on("click", function(){
	$(".pop-up-container").fadeOut(function(){
		$(this).css("display", "none");
	});
});

$(".test-btn").on("click", function(){
	$(".pop-up-container").hide();
	$(".pop-up-container").fadeIn();
	$(".pop-up-container").css("display", "flex");
});

function init(){

	$("#content").hide();

	$("#month").text(months[currentMonth]);
	$("#year").text(currentYear);

	$("#content").fadeIn(500);
}

function changeMonth(month, year){
	$("#content").fadeOut(500, function(){
		$("#month").text(months[currentMonth]);
		$("#year").text(currentYear);
	});
	$("#content").fadeIn(500);
}
