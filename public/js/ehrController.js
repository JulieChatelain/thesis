angular.module('ehr', []).controller('EHRCtrl', function($scope) {
	$scope.ehrMenuOptions = [ {
		name : "Histoire du diabète",
		url: "views/ehrOptions/diabHistory.html",
		show : true,
		unfold : true
	}, {
		name : "Traitements en cours",
		url: "",
		show : true,
		unfold : true
	}, {
		name : "Historique des traitements",
		url: "",
		show : true,
		unfold : true
	}, {
		name : "Antécédents principaux",
		url: "",
		show : true,
		unfold : true
	}, {
		name : "Antécédents personnels",
		url: "",
		show : true,
		unfold : true
	}, {
		name : "Antécédents familiaux",
		url: "",
		show : true,
		unfold : true
	}, {
		name : "Prises de sang",
		url: "",
		show : true,
		unfold : true
	}, {
		name : "Complications",
		url: "",
		show : true,
		unfold : true
	}, {
		name : "Facteurs de risque",
		url: "",
		show : true,
		unfold : true
	}, {
		name : "Maladies actuelles",
		url: "",
		show : true,
		unfold : true
	}, {
		name : "Historique des maladies",
		url: "",
		show : true,
		unfold : true
	} ];
});