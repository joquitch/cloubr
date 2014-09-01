'use strict';

angular.module('myApp.directives', [])
	.directive('crActionMenu', function($compile) {
		return  {
		  restrict: 'E',
		  controllerAs: 'actionMenuCtrl',
		  scope: {
			actions: '='
		  },
		  controller: [function(){
			var c = this;
			c.handleClick = handleClick;
			
			function handleClick(action){
				action.onClick();
			}
			
		  }],
		  link: function(scope, element, attrs){
			var $e = $(element);
			var $menu = $e.find('.menu');
			$menu.remove();
			$e.closest('body').append($menu);
			
			element.on('click', toggleMenu);
			$menu.on('click', toggleMenu);
			function toggleMenu(){				
				$menu.toggle();
				var $menuList = $menu.find('.menuList');
				$menuList.css('margin-top', 24 - ($menuList.outerHeight() / 2));				
			}
		  },
		  
		  template: '<i ng-if="actions.length" class="menuIcon fa fa-ellipsis-v"></i><div class="menu" style="display:none;"><ul class="menuList"><li class="menuListItem" ng-repeat="action in actions" ng-click="actionMenuCtrl.handleClick(action)">{{action.text}}</li></ul></div>'
		};
	})
	.directive('crHeader', function() {
		return  {
		  restrict: 'E',
		  replace: true,
		  scope: {
			actions: '=',
			title: '@'
		  },		  
		  template: '<div class="header">{{title}}<cr-action-menu actions="actions"></cr-action-menu></div>'
		};
	});
	  
	  
	  
    