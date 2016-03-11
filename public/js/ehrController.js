angular.module('ehr', []).controller('EHRCtrl', function($scope) {
	
	$scope.currentDate = new Date();
	
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
	} , ];
	
	
	$scope.patients=[
		{
		    identifier: [{
		        value: 0
		    }],
		    name: [{
		        family: ["Dupont"],
		        given: ["Jean"]
		    }],
		    photo: [{url:"/img/avatar/male1.png"
		    }],
		    profession:["Charpentier"],
		    telecom: [{system:"phone",value:"04/339.87.40"}],
		    birthDate: new Date(1980,03,15)
		},
		{
		    identifier: [{
		        value: 1
		    }],
		    name: [{
		        family: ["Dupuis"],
		        given: ["Marie"]
		    }],
		    photo: [{url:"/img/avatar/female1.png"
		    }],
		    profession:["Institutrice"],
		    telecom: [{system:"phone",value:"04/111.22.33"}],
		    birthDate: new Date(1985,04,20)
		}              
	];
	$scope.patientId = 0;
	$scope.changePatient = function changePatient(id) {
		$scope.patientId = id;
	};
	$scope.calculateAge = function(birthday) {
	    var ageDifMs = Date.now() - new Date(birthday);
	    var ageDate = new Date(ageDifMs);
	    return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	
});