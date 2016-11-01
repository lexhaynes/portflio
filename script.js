/*var $ = document.querySelectorAll.bind(document);
var gridItems = $('.grid-item');*/


/*Object.keys(gridItems).map(function(key, index) {

	gridItems[key].addEventListener('mouseenter', function() { toggleDivAndNearest(this, index) });	
	gridItems[key].addEventListener('mouseout', function() { toggleDivAndNearest(this, index) });
});*/

$('.grid-item').mouseenter(function() {
	$(this).toggleClass('expanded');
	console.log($(this).index());
	if ($(this).index() % 2 !=0 ) {
		$(this).prev().toggleClass('contracted');
	} else {
		$(this).next().toggleClass('contracted');
	}
}).mouseleave(function() {
	$(this).toggleClass('expanded');

	if ($(this).index() % 2 !=0 ) {
		$(this).prev().toggleClass('contracted');
	} else {
		$(this).next().toggleClass('contracted');
	}
})

/*function toggleDivAndNearest(div, index) {
	div.classList.toggle('expanded');

	if (index % 2 !=0 ) {
		div.previousElementSibling.classList.toggle('contracted')
	} else {
		div.nextElementSibling.classList.toggle('contracted')
	}
}*/



