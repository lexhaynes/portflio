var $ = document.querySelectorAll.bind(document);


var nodes = {
	grid_items: $('.grid-item'),
	nav: document.getElementsByClassName('main-nav')[0],
}

var state = {
	screen_size: document.documentElement.clientWidth,
	scrollY: window.scrollY,
	previousScrollY: 0,
	is_mobile: false,
}

var positions = {
	nav_top: 555,
}

var constants = {
	mobile_breakpoint: 800,
	small_mobile_breakpoint: 600
}


var observers = {
	updateMobileState: function() {
		state.is_mobile = utils.isMobile();

		if (state.is_mobile) {
			grid.removeEventListeners();
		} else {
			grid.addEventListeners();
		}

	},
}


var utils = (function() {
	return {
		isMobile: function() {
			return state.screen_size > constants.mobile_breakpoint ? false : true;
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
					grid.toggleDivAndNearest(this, index), false 
				});	
				nodes.grid_items[key].addEventListener('mouseleave', function() { 
					grid.toggleDivAndNearest(this, index), false 
				});
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


var listeners = {
	scroll: function() {
		//console.log(this.scrollY);
		state.previousScrollY = state.scrollY;
		state.scrollY = this.scrollY || window.pageYOffset || document.documentElement.scrollTop;

		//if we are past the intro area
		if (state.scrollY > positions.nav_top) {
				utils.addClasses([
					[nodes.nav, 'fixed-top'],
					[nodes.nav.children[0], 'is-visible']
				]);
				//mobile very small screen
				if (state.screen_size < constants.small_mobile_breakpoint) {
					utils.addClass(nodes.nav, 'fixed-styles');
				} //if bigger mobile screen or desktop
				else {
					utils.addClass(nodes.nav, 'space-around');
				}
		} 
		//if we have scrolled back up to the intro area
		else {
			utils.removeClasses([
				[nodes.nav, 'fixed-top'],
				[nodes.nav.children[0], 'is-visible']
			]);
			//mobile very small screen
			if (state.screen_size < constants.small_mobile_breakpoint) {
				utils.removeClass(nodes.nav, 'fixed-styles');
			} //if bigger mobile screen or desktop
			else {
				utils.removeClass(nodes.nav, 'space-around');
			}			
		}
	},

	resize: function() {
		state.screen_size = document.documentElement.clientWidth;
		console.log('resized state.screen_size: ' + state.screen_size);
		observers.updateMobileState();
		//re-run the scroll handler
		//listeners.scroll();
	}
}

//INIT

observers.updateMobileState();

window.addEventListener('resize', listeners.resize, false);

window.addEventListener('scroll', listeners.scroll, false);


