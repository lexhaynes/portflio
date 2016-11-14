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



var observers = {
	updateMobileState: function() {
		state.is_mobile = utils.isMobile();

		if (state.is_mobile) {
			grid.removeEventListeners()
		} else grid.addEventListeners();
	},
}


var utils = (function() {
	return {
		isMobile: function() {
			return state.screen_size > state.mobile_breakpoint ? false : true;
		},

		isScrollingUp: function () {
			return state.previousScrollY > state.scrollY ? true : false
		},

		addClass: function(el, className) {
			if (!el.classList.contains(className)) {
				el.classList.add(className)
			}
		},

		removeClass: function(el, className) {
			if (el.classList.contains(className)) {
				el.classList.remove(className)
			}
		},

		addClasses: function(args) {
			args.map(function(key, index) {
				utils.addClass(key[0], key[1]);
			})
		},

		removeClasses: function(args) {
			args.map(function(key, index) {
				utils.removeClass(key[0], key[1]);
			})
		},
	}
})();

var grid = (function() { 
	return {

		addEventListeners: function() {
			Object.keys(nodes.grid_items).map(function(key, index) {
				nodes.grid_items[key].addEventListener('mouseenter', function() { 
					console.log('enter ', index);
					grid.toggleDivAndNearest(this, index), false });	
				nodes.grid_items[key].addEventListener('mouseleave', function() { grid.toggleDivAndNearest(this, index), false });
			});
		},
		
		removeEventListeners: function() {
			Object.keys(nodes.grid_items).map(function(key, index) {
				nodes.grid_items[key].removeEventListener('mouseenter', false);	
				nodes.grid_items[key].removeEventListener('mouseleave', false);
			});
		},

		toggleDivAndNearest: function(div, index) {
			div.classList.toggle('expanded');

			if (index % 2 ==0 ) {
				div.nextElementSibling.classList.toggle('contracted');
			} else {
				div.previousElementSibling.classList.toggle('contracted');
			}
		},
	}
})();

var effects = {
	addBannerEffects: function(banners, scrollY) {
		var screen = state.is_mobile ? 'mobile' : 'desktop';

		banners.map(function(key, index) {
			var banner 			= positions.banners[index];
			var containerHeight = banner.node.parentElement.clientHeight;
			var bannerGone 		= banner.node[screen]+containerHeight;
			var opacity			= Math.abs( (state.scrollY-banner[screen])/1000 )

			if (scrollY > banner[screen]) {
				banner.node.previousElementSibling.style.opacity = opacity;
				utils.addClasses([
					[banner.node, 'fixed-top'],
					[banner.node.previousElementSibling, 'fixed-top', 'opacity-transition'],
				]);	
			}

			if (scrollY > bannerGone || scrollY < banner[screen] ) {
				utils.removeClasses([
					[banner.node, 'fixed-top'],
					[banner.node.previousElementSibling, 'fixed-top', 'opacity-transition'],
				]);			
				banner.node.previousElementSibling.style.opacity = 0;	
			}	
		});
	},
}
 

var handlers = {
	upScroll: function() {
		utils.removeClass(nodes.nav, 'slide-out');
	},	

	downScroll: function() {
		utils.addClass(nodes.nav, 'slide-out');
	}
}


var listeners = {
	scroll: function() {
		//console.log(this.scrollY);

		state.previousScrollY = state.scrollY;
		state.scrollY = this.scrollY || window.pageYOffset || document.documentElement.scrollTop;

		effects.addBannerEffects([nodes.about, nodes.contact], state.scrollY);	

		//if we are past the intro page area
		if (state.scrollY > positions.banners[0].desktop) {
			//if upscrolling
			if (utils.isScrollingUp()) {
				handlers.upScroll();
			} 
		
			else {
				handlers.downScroll();
			}
		} 
		//if we have scrolled up to the intro area
		else {
			utils.removeClasses([ 
				[nodes.nav, 'fixed-top'],
				[nodes.nav.children[0], 'is-visible'],
			])
		}
		
	},

	resize: function() {
		state.screen_size = document.documentElement.clientWidth;
		console.log('resized state.screen_size: ' + state.screen_size);
		observers.updateMobileState();
	}
}

//INIT

observers.updateMobileState();

window.addEventListener('resize', listeners.resize, false);

window.addEventListener('scroll', listeners.scroll, false);


