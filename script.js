var $ = document.querySelectorAll.bind(document);


var nodes = {
	grid_items: $('.grid-item'),
	nav: document.getElementsByClassName('main-nav')[0],
	about: document.getElementById('about-banner'),
	contact: document.getElementById('contact-banner')
}

var state = {
	mobile_breakpoint: 800,
	screen_size: document.documentElement.clientWidth,
	scrollY: window.scrollY,
	nav_top: 590,
	banner1_top: 590,
	banner2_top: {
		desktop: 2580,
		mobile: 3636
	}
}

console.log('initial state.screen_size: ' + state.screen_size);
console.log('mobile breakpoint: ' + state.mobile_breakpoint);


//here, subscribe to state.screen_size and if it changes, run this function
if (state.screen_size > state.mobile_breakpoint) {
	console.log('yes');
	addGridEventListeners();
}

function addGridEventListeners() {
	Object.keys(nodes.grid_items).map(function(key, index) {
		nodes.grid_items[key].addEventListener('mouseenter', function() { 
			console.log('enter ', index);
			toggleDivAndNearest(this, index), false });	
		nodes.grid_items[key].addEventListener('mouseleave', function() { toggleDivAndNearest(this, index), false });
	});
}

function removeGridEventListeners() {
	Object.keys(nodes.grid_items).map(function(key, index) {
		nodes.grid_items[key].removeEventListener('mouseenter', false);	
		nodes.grid_items[key].removeEventListener('mouseleave', false);
	});
}


function toggleDivAndNearest(div, index) {
	div.classList.toggle('expanded');

	if (index % 2 ==0 ) {
		div.nextElementSibling.classList.toggle('contracted');
	} else {
		div.previousElementSibling.classList.toggle('contracted');
	}
}




function isBannerTop(el, scrollY) {
	var top = false;
	var rectTop = Math.floor(el.getBoundingClientRect().top);
	if (rectTop > -1 && rectTop < 1) {
		top = true;
	}
	return top;
}

function addRemoveFixedClass(el, scrollY) {
	console.log(el);
	var containerHeight = el.div.parentElement.clientHeight;
	var bannerGone = el.appears+containerHeight;

	if (scrollY > el.appears) {
		el.div.classList.add('fixed-top');
	}
	if (scrollY > bannerGone || scrollY < el.appears ) {
		el.div.classList.remove('fixed-top');
	}	
	
}

window.addEventListener('resize', function() {
	state.screen_size = document.documentElement.clientWidth;
	console.log('resized state.screen_size: ' + state.screen_size);
	if (state.screen_size > state.mobile_breakpoint) {
		removeGridEventListeners();
	} else {
		addGridEventListeners();
	}
})

window.addEventListener('scroll', function() {

	/* OPTIMIZE THIS -- CREATE A FIX TO TOP LIB */
	nodes.scrollY = this.scrollY;
	console.log('scrollY: ' + nodes.scrollY);

	if (nodes.scrollY > state.nav_top) {
		nodes.nav.classList.add('fixed-top');
		nodes.nav.children[0].classList.add('is-visible');

	} else {
		nodes.nav.classList.remove('fixed-top');
		nodes.nav.children[0].classList.remove('is-visible');
	}

	//check if the screen size is small and then set banner 2 top
	var banner2Top = state.screen_size > state.mobile_breakpoint ? state.banner2_top.desktop : state.banner2_top.mobile;
	
	var container1Height = nodes.about.parentElement.clientHeight;
	var banner1Gone = state.banner1_top+container1Height;

	var container2Height = nodes.contact.parentElement.clientHeight;
	var banner2Gone = banner2Top+container2Height;


	if (nodes.scrollY > state.banner1_top) {
		nodes.about.classList.add('fixed-top');
		nodes.about.previousElementSibling.classList.add('fixed-top');		
		nodes.about.previousElementSibling.classList.add('opacity-transition');	
		nodes.about.previousElementSibling.style.opacity = this.scrollY/1500;	
			
	}
	if (nodes.scrollY > banner1Gone || nodes.scrollY < state.banner1_top ) {
		nodes.about.classList.remove('fixed-top');
		nodes.about.previousElementSibling.classList.remove('fixed-top');		
		nodes.about.previousElementSibling.style.opacity = 0;	
	}	

	if (nodes.scrollY > banner2Top) {
		nodes.contact.classList.add('fixed-top');
		nodes.contact.previousElementSibling.classList.add('fixed-top');		
		nodes.contact.previousElementSibling.classList.add('opacity-transition');	
		nodes.contact.previousElementSibling.style.opacity = this.scrollY/3500;
	}
	if (nodes.scrollY > banner2Gone || nodes.scrollY < banner2Top ) {
		nodes.contact.classList.remove('fixed-top');
		nodes.contact.previousElementSibling.classList.remove('fixed-top');		
		nodes.contact.previousElementSibling.style.opacity = 0;	
	}	 	
})

