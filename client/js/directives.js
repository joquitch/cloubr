'use strict';

angular.module('myApp.directives', [])
	.directive('menu', function($compile) {
		return  {
		  restrict: 'E',
		  transclude: true,
		  scope: {
			items: '='
		  },
		  
		  link: function(scope, element, attrs){
			var $e = $(element);
			var $menu = $e.find('.menu');
			$menu.remove();
			$e.closest('body').append($menu);
			
			element.on('click', toggleMenu);
			$menu.on('click', toggleMenu);
			function toggleMenu(){				
				$menu.toggle();
			}
		  },
		  
		  template: '<i class="menuIcon fa fa-ellipsis-v"></i><div class="menu" style="display:none;"><ul class="menuList" ng-transclude></ul></div>'
		};
	});
	  
	  
	  
    