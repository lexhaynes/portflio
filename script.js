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
	previousScrollY: 0,
	is_mobile: false
}

var positions = {
	nav_top: 620,
	banners: [
		{node: nodes.about, desktop: 660, mobile: 660},
		{node: nodes.contact, desktop: 2642, mobile: 3636}
	]
}

var els = {
	bannerHeight: window.getComputedStyle(document.getElementById('about-banner')).height.replace(/\D/g,'')
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
		var opacity			= Math.abs( (state.scrollY-banner[screen])/1000 )

		if (state.scrollY > banner[screen]) {
			banner.node.previousElementSibling.style.opacity = opacity;
			addClasses([
				[banner.node, 'fixed-top'],
				[banner.node.previousElementSibling, 'fixed-top', 'opacity-transition'],
			]);	
		}

		if (state.scrollY > bannerGone || state.scrollY < banner[screen] ) {
			removeClasses([
				[banner.node, 'fixed-top'],
				[banner.node.previousElementSibling, 'fixed-top', 'opacity-transition'],
			]);			
			banner.node.previousElementSibling.style.opacity = 0;	
		}	
	});
}


function addClass(el, className) {
	if (!el.classList.contains(className)) {
		el.classList.add(className)
	}
}
function removeClass(el, className) {
	if (el.classList.contains(className)) {
		el.classList.remove(className)
	}
}

function addClasses(args) {
	args.map(function(key, index) {
		addClass(key[0], key[1]);
	})
}

function removeClasses(args) {
	args.map(function(key, index) {
		removeClass(key[0], key[1]);
	})
}

function isScrollingUp() {
	return state.previousScrollY > state.scrollY ? true : false
}

function handleUpScroll() {
	removeClass(nodes.nav, 'slide-out');
	addClasses([ 
		[nodes.nav, 'fixed-top'],
		[nodes.nav.children[0], 'is-visible'],
	])
}


function handleDownScroll() {
	removeClasses([ 
		[nodes.nav, 'fixed-top'],
		[nodes.nav.children[0], 'is-visible'],
	])
	addClass(nodes.nav, 'slide-out');
}

var handlers = {
	scroll: function() {
		//console.log(this.scrollY);

		state.previousScrollY = state.scrollY;
		state.scrollY = this.scrollY || window.pageYOffset || document.documentElement.scrollTop;

		addBannerEffects([nodes.about, nodes.contact]);	

		//if we are past the intro page area
		if (state.scrollY > positions.banners[0].desktop) {
			//if upscrolling
			if (isScrollingUp()) {
				handleUpScroll();
			} 
		
			else {
				handleDownScroll();
			}
		} 
		//if we have scrolled up to the intro area
		else {
			removeClasses([ 
				[nodes.nav, 'fixed-top'],
				[nodes.nav.children[0], 'is-visible'],
			])
		}
		
	},

	resize: function() {
		state.screen_size = document.documentElement.clientWidth;
		console.log('resized state.screen_size: ' + state.screen_size);
		updateMobileState();
	}
}

window.addEventListener('resize', handlers.resize, false);

window.addEventListener('scroll', handlers.scroll, false);


