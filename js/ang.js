var app = angular.module('myApp', []);
angular.module('myApp').controller('apiHitCtrl', function($scope,$http) {
	$scope.alertPresent = false;
	$scope.alertMessage = "";
	$scope.successPresent = false;
	$scope.successMessage = "";
	$scope.closeAlert = function() {
		$scope.alertPresent = false;
		$scope.alertMessage = "";
	};
	$scope.closeSuccess = function() {
		$scope.successPresent = false;
		$scope.successMessage = "";
	};
	
	$http.get("https://nutanix.0x10.info/api/deals?type=json&query=api_hits")
	.then(function successCallback(response) {
		$scope.api_hits = response.data.api_hits;
	}, function errorCallback(response) {
		$scope.alertPresent = true;
		$scope.alertMessage = $scope.alertMessage + "Error occred while getting api hits. ";
	});
	
	$scope.deals = [];
	
	$http.get("https://nutanix.0x10.info/api/deals?type=json&query=list_deals")
	.then(function successCallback(response) {
		$scope.deals = response.data.deals;
		processDeals();
	}, function errorCallback(response) {
		$scope.alertPresent = true;
		$scope.alertMessage = $scope.alertMessage + "Error occred while getting api hits. ";
	});
	var likeString = 'totalLikes';
	$scope.totalLikes = localStorage.getItem(likeString) || 0;	
	localStorage.setItem(likeString,$scope.totalLikes);
	$scope.dealInGroups=[];	
	processDeals = function() {
		var group = 3,count = 1,threeGroup=[];
		
		$scope.deals.forEach(function(deal) {
			var shLink = deal.link.split("/");
			deal.showLink = shLink[0] + "//" + shLink[2] + "/..."
			var rateFloat = parseFloat(deal.rating);
			var rateInt = parseInt(deal.rating);
			deal.ratingNegList = [];
			if(rateFloat-rateInt > 0.00){
				deal.rateHalfReuired = true;
				for (var i = 0; i < (5-rateInt-1); i++) { 
					deal.ratingNegList.push(1);
				}
			}else {
				deal.rateHalfReuired = false;
				for (var i = 0; i < (5-rateInt); i++) { 
					deal.ratingNegList.push(i);
				}
			}
			deal.ratingPosList = [];
			for (var i = 0; i < rateInt; i++) { 
				deal.ratingPosList.push(i);
			}
			deal.discount = parseFloat(deal.discount);
			deal.actual_price = parseFloat(deal.actual_price);
			deal.final_price = Math.ceil(deal.actual_price - (deal.discount/100.0*deal.actual_price));
			deal.likes = localStorage.getItem(deal.name) || 0;
			localStorage.setItem(deal.name,deal.likes);
			threeGroup.push(deal);
			if(count%3==0){
				if(threeGroup.length>0) {
					$scope.dealInGroups.push(threeGroup);
					threeGroup =[];
				}
			}
			count = count + 1;
		});
		if(threeGroup.length>0) {	
			$scope.dealInGroups.push(threeGroup);
		}
		
	}
	$scope.updateLikesStorage = (function(dealName) {
		var totalLikes = localStorage.getItem(likeString);
		var itemLikes = localStorage.getItem(dealName);
		var itemLikes = parseInt(itemLikes) + 1;
		var totalLikes = parseInt(totalLikes) + 1;
		localStorage.setItem(likeString,totalLikes);
		localStorage.setItem(dealName,itemLikes);
		$scope.dealInGroups.forEach(function(group){
			group.forEach(function(d1){
				if(d1.name == dealName) {
					d1.likes = localStorage.getItem(dealName);
				}
			});
		});
		$scope.totalLikes = localStorage.getItem(likeString);
	});
	
	
});