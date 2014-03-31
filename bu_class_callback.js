(function ()
{
	"use strict";

var directives = angular.module('BuClassCallbackDirective', []).
	/**
	 * It can be used like
	 * bu-class-callback="{'_animate' : {on: commentsAreShown, after: 'f()'}}"
	 */
	directive('buClassCallback', ['$animate', function ($animate) {
		// @link all these functions are taken from angular's classDirective and rewritten a little
		function flattenClasses(classVal)
		{
			var classes = {};
			if (angular.isArray(classVal)) {
				angular.forEach(classVal, function (v) {
					classes[v] = '';
				});

			}
			else if (angular.isObject(classVal))
			{
					angular.forEach(classVal, function (v, k)
					{
						if (v && v.on) {
							classes[k] = v.after;
						}
					});
			}
			else {
				classes[classVal] = '';
			}

			return classes;
		}

		function tokenDifference(obj1, obj2)
		{
			var values = [];

			outer:
				for (var key1 in obj1)
				{
					if (obj1.hasOwnProperty(key1))
					{
						if (obj2.hasOwnProperty(key1)) {
							continue outer;
						}
						values.push({clas: key1, after: obj1[key1]});
					}
				}
			return values;
		}

		function updateClass($el, $scope, newClasses, oldClasses)
		{
			var toAdd = tokenDifference(newClasses, oldClasses);
			var toRemove = tokenDifference(oldClasses, newClasses);

			if (toAdd.length)
			{
				angular.forEach(toAdd, function _toAdd(v) {
					$animate.addClass($el, v.clas, function afterAdd() {
						if (v.after)
						{
							$scope.$eval(v.after);
							if(! $scope.$$phase) {
								$scope.$digest();
							}
						}
					});
				});
			}
			if (toRemove.length)
			{
				angular.forEach(toRemove, function _toAdd(v) {
					$animate.removeClass($el, v.clas, function afterAdd() {
						if (v.after)
						{
							$scope.$eval(v.after);
							if(! $scope.$$phase) {
								$scope.$digest();
							}
						}
					});
				});
			}
		}

		function addClass($el, $scope, toAdd)
		{
			angular.forEach(toAdd, function _toAdd(v, k) {
				$animate.addClass($el, k, function afterAdd(v) {
					if (v.after) {
						$scope.$eval(v.after);
					}
				});
			});
		}

		return {
			restrict: 'A',
			link: function link($scope, $el, attrs)
			{
				var oldVal;
				$scope.$watch(attrs.buClassCallback, ngClassWatchAction, true);

				function ngClassWatchAction(newVal)
				{
						var newClasses = flattenClasses(newVal || '');
						if (! oldVal) {
							addClass($el, $scope, newClasses);
						}
						else
						{
							if (! angular.equals(newVal, oldVal)) {
								updateClass($el, $scope, newClasses, flattenClasses(oldVal));
							}
						}
					oldVal = angular.copy(newVal);
				}
			}
		};
	}]);
}());
