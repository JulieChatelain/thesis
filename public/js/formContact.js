var app = angular.module("formContact", []);

app.filter('range', function() {
	return function(input, total) {
		total = parseInt(total);
		for (var i = 1; i <= total; i++) {
			input.push(i);
		}
		return input;
	};
});

app.controller("formContactCtrl", function($scope, $log) {
	
	$scope.currentDate = new Date();
	$scope.dateDiag = new Date(2009,03,15);
	$scope.diabSince = new Date($scope.currentDate - $scope.dateDiag);
	$scope.diabSince = $scope.diabSince.getUTCFullYear() - 1970;
	$scope.symptoms = {desc:"Fatigue, perte de poids, soif extrême.", editing: false};
	$scope.symptomsTime = {desc:"6 mois", editing: false};
	$scope.age = 25;
	$scope.job = {desc:"Mécanicien", editing: false};
	$scope.tel = {desc:"xxxx/xx.xx.xx", editing: false};
	$scope.name = {desc:"Jean", editing: false};
	$scope.familyName = {desc:"Dupont", editing: false};
	$scope.hospitalisation = {desc:"Non", where:"",why:"", editing: false};
	$scope.treatmentSince = {desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
			"Nam sit amet nibh ligula. Quisque nec magna orci. Curabitur augue neque, " +
			"commodo sed consequat non, mollis vulputate leo. Mauris malesuada rutrum metus, " +
			"nec rutrum mauris molestie sed. Vivamus at arcu eget dolor malesuada pharetra " +
			"rutrum et est.", editing: false};
	$scope.qualityGlycControle = {desc:"Très bon contrôle.", editing: false};
	$scope.hypoCorrection = {desc:"Mange une banane.", editing: false};
	$scope.hypoSchedule = {desc:"Le plus souvent le matin.", editing: false};
	
	$scope.mainHistory = ["Soeur diabétique"];
	$scope.familyHistory = [{desc:"Soeur diabétique", main:true},{desc:"Père daltonien", main:false}];
	
	$scope.drugsDiabetes = [ {
		quantity : 1,
		unit : "comprimé",
		name : "test",
		freq : "2 fois par jour",
		time : "6 mois",
		dateAdded : "02-01-2016",
		addedBy : "Dr. XXXX",
		dateModified : "",
		modifiedBy : "",
		modified : false,
		editing : [ false, false, false, false, false ]
	} ];

	$scope.drugsOther = [ {
		quantity : 3,
		unit : "comprimés",
		name : "Medicament X",
		freq : "4 fois par jour",
		time : "2 semaines",
		dateAdded : "01-01-2015",
		addedBy : "Dr. XXXX",
		dateModified : "01-02-2016",
		modifiedBy : "Dr. YYYYY",
		modified : true,
		editing : [ false, false, false, false, false ]
	} ];

	$scope.otherTreatments = [ {
		desc : "Une tisane à la camomille avant d'aller dormir",
		dateAdded : "01-01-2015",
		addedBy : "Dr. XXXX",
		dateModified : "01-02-2016",
		modifiedBy : "Dr. YYYYY",
		modified : true,
		editing : false
	}, {
		desc : "Une séance de massage par mois",
		dateAdded : "02-01-2016",
		addedBy : "Dr. XXXX",
		dateModified : "",
		modifiedBy : "",
		modified : false,
		editing : false
	} ];

	$scope.lipoZones = [ {
		number : 2,
		location : "Abdomen (à gauche)",
		editing : [ false, false ]
	} ];

	$scope.activities = [ {
		desc : "Jogging de deux heures tous les jours",
		editing : false
	} ];

	$scope.glycChecks = [ {
		date : "01-01-2016",
		HbA1c : 50
	}, {
		date : "01-02-2016",
		HbA1c : 51
	} ];

	$scope.units = [ "comprimé(s)", "injection", "ml", "gr" ];
	$scope.drugsNames = [ "Medicament1", "Produit1", "Test" ];
	$scope.frequencies = [ "1 fois par jour", "2 fois par jour",
			"1 fois par semaine" ];
	$scope.times = [ "1 semaines", "3 semaines", "1 mois", "6 mois",
			"indéterminé" ];

	$scope.insulines = [ {
		time : "08:00",
		quantity: 2.2,
		type : "Mixte (10-12h)",
		editing : [false,false,false]
	}, {
		time : "12:00",
		quantity: 3.1,
		type : "Rapide (5-7h)",
		editing : [false,false,false]
	}, {
		time : "19:00",
		quantity: 1.2,
		type : "Rapide (5-7h)",
		editing : [false,false,false]
	}, {
		time : "23:00",
		quantity: 2.1,
		type : "Lente (24h)",
		editing : [false,false,false]
	} ];

	$scope.autoControls = [ {
		time : "08:00",
		value : 0.70,
		editing : false
	}, {
		time : "12:00",
		value : 1.00,
		editing : false
	}, {
		time : "19:00",
		value : 1.70,
		editing : false
	}, {
		time : "23:00",
		value : 1.70,
		editing : false
	} ];

	$scope.addNew = function(items, item) {
		items.push(item);
	};

	$scope.del = function(items, item) {
		var id = items.indexOf(item);
		items.splice(id, 1);
	};

	$scope.edit = function(item, k) {
		if (k >= 0)
			item.editing[k] = true;
		else
			item.editing = true;
	};

	$scope.done = function(item, k) {
		if (k >= 0)
			item.editing[k] = false;
		else
			item.editing = false;
	};

	$scope.newItem = function newItem(type, value) {
		switch (type) {
		case 'drug':
			return {
				quantity : 0,
				unit : "",
				name : "",
				freq : "",
				time : "",
				dateAdded :  new Date(),
				addedBy : "Dr. YYYY XXXXX",
				dateModified : "",
				modifiedBy : "",
				modified : false,
				editing : [ false, false, false, false, false ]
			};
			break;
		case 'treatment':
			return {
				desc : "",
				dateAdded :  new Date(),
				addedBy : "Dr. YYYY XXXXX",
				dateModified : "",
				modifiedBy : "",
				modified : false,
				editing : false
			};
			break;
		case 'glycControl':
			var val = value || 48;
			return {
				date : new Date(),
				HbA1c : val
			};
			break;
		case 'zone':
			return {
				number : 1,
				location : "",
				editing : [ false, false ]
			};
			break;
		default:
			return {};
		}
	};

});
