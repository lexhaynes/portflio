var $ = document.querySelectorAll.bind(document);
var gridItems = $('.grid-item');


Object.keys(gridItems).map(function(key, index) {

	gridItems[key].addEventListener('mouseenter', function() { 
		console.log('enter ', index);
		toggleDivAndNearest(this, index), false });	
	gridItems[key].addEventListener('mouseleave', function() { toggleDivAndNearest(this, index), false });
});


function toggleDivAndNearest(div, index) {
	div.classList.toggle('expanded');

	if (index % 2 ==0 ) {
		div.nextElementSibling.classList.toggle('contracted');
	} else {
		div.previousElementSibling.classList.toggle('contracted');
	}
}


var about = document.getElementById('about-banner');
var contact = document.getElementById('contact-banner');


window.addEventListener('scroll', function() {
	console.log(this.scrollY);
	var banner1Appears = 970;
	var banner2Appears = 3000;
	
	var container1Height = about.parentElement.clientHeight;
	var banner1Gone = banner1Appears+container1Height;

	var container2Height = contact.parentElement.clientHeight;
	var banner2Gone = banner2Appears+container2Height;

	if (this.scrollY > banner1Appears) {
		about.classList.add('fixed-top');
	}
	if (this.scrollY > banner1Gone || this.scrollY < banner1Appears ) {
		about.classList.remove('fixed-top');
	}	

	if (this.scrollY > banner2Appears) {
		contact.classList.add('fixed-top');
	}
	if (this.scrollY > banner2Gone || this.scrollY < banner2Appears ) {
		contact.classList.remove('fixed-top');
	}

	 	
})

