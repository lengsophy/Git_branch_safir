$.fn.MyFunction = function()
{
	$(document).on('mouseenter', '.hold-quickview', function () {
		$(this).find(":button").show();
	}).on('mouseleave', '.hold-quickview', function () {
		$(this).find(":button").hide();
	});
}