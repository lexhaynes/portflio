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
	is_mobile: false
}

var positions = {
	nav_top: 646,
	banners: [
		{node: nodes.about, desktop: 646, mobile: 646},
		{node: nodes.contact, desktop: 2700, mobile: 3636}
	]
}

console.log('initial state.screen_size: ' + state.screen_size);
console.log('mobile breakpoint: ' + state.mobile_breakpoint);


//here, subscribe to state.screen_size and if it changes, run this function
updateMobileState();

function updateMobileState() {
	if (isMobile()) {
		state.is_mobile = true;
		removeGridEventListeners();
	} else {
		state.is_mobile = false;
		addGridEventListeners();
	}
}

function isMobile() {
	return state.screen_size > state.mobile_breakpoint ? false : true;
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


function addBannerEffects(banners) {
	var screen = state.is_mobile ? 'mobile' : 'desktop';

	banners.map(function(key, index) {
		var banner 			= positions.banners[index];
		var containerHeight = banner.node.parentElement.clientHeight;
		var bannerGone 		= banner.node[screen]+containerHeight;
		var opacity			= Math.abs( (nodes.scrollY-banner[screen])/500 )

		if (nodes.scrollY > banner[screen]) {
			banner.node.classList.add('fixed-top');
			banner.node.previousElementSibling.classList.add('fixed-top', 'opacity-transition');		
			banner.node.previousElementSibling.style.opacity = opacity;	
		}

		if (nodes.scrollY > bannerGone || nodes.scrollY < banner[screen] ) {
			banner.node.classList.remove('fixed-top');
			banner.node.previousElementSibling.classList.remove('fixed-top');		
			banner.node.previousElementSibling.style.opacity = 0;	
		}	
	});
}

function addNavEffects(nav) {
	if (nodes.scrollY > positions.nav_top) {
	nodes.nav.classList.add('fixed-top');
	nodes.nav.children[0].classList.add('is-visible');

	} else {
		nodes.nav.classList.remove('fixed-top');
		nodes.nav.children[0].classList.remove('is-visible');
	}
}

window.addEventListener('resize', function() {
	state.screen_size = document.documentElement.clientWidth;
	console.log('resized state.screen_size: ' + state.screen_size);
	updateMobileState();
})

window.addEventListener('scroll', function() {

	/* OPTIMIZE THIS -- CREATE A FIX TO TOP LIB */
	nodes.scrollY = this.scrollY;
	console.log('scrollY: ' + nodes.scrollY);

	addNavEffects(nodes.nav);

	addBannerEffects([nodes.about, nodes.contact]);	
});

