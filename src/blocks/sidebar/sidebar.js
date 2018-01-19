$( document ).ready(function(){
	$('.sidebar-control').click(function(){
		$(this).toggleClass('close');
		$('.sidebar').toggleClass('hide');
	});
});