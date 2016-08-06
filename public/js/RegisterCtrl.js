
app.controller('RegisterCtrl',function($log, $location, $localStorage, $scope, $http) {
	$scope.$log = $log;
	
	$scope.token = $localStorage.token;
	
	$scope.data = {
			userKind : 'patient',
			gender : 'male',
			eMail : '',
			password : '',
			confirmPass : '',
			nameFamily : '',
			nameGiven : '',
			birthDate : '',
			job : '',
			address : '',
			contactTel : '',
			telType : 'home',
			contactEmail : '',
			emailType : 'home',
			speakFrench : true,
			speakEnglish : false,
			speakDutch : false,
			speakGerman : false,
			mainLanguage : 'fr',
			speciality : '',
			workLocation : '',
			workTel : ''
	};
	
	$scope.bgCol = {"background-color" : "#f3e5f5"};
	$scope.matchingPasswords = false;
	
	/**
	 * Check if the two passwords match.
	 * Change the background color accordingly.
	 */
	$scope.checkPasswordMatch = function(password1, password2){
		if(password1.length > 6 && password2.length > 6 && password1 == password2){
			console.log("matching: " + password1 + " " + password2);
			$scope.bgCol["background-color"] = "#E1F5FE";
			$scope.matchingPasswords = true;
		}else{
			console.log("not matching: " + password1 + " " + password2);
			$scope.bgCol["background-color"] = "#f3e5f5";
			$scope.matchingPasswords = false;
			
		}
	};
	
	/**
	 * Register the user.
	 */
	$scope.register = function(){
		
		var data = $scope.data;
		
		$http.post('/register', data)
		   .then(
		       function(response){
		         console.log("Success data sent: ");
		       }, 
		       function(response){
			         console.log("Fail data sent");
		       }
		    );
	};
});

app.directive('validPassword', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, element, attr, mCtrl) {
	      function validation(value) {
	        if (value.length > 6) {
	          mCtrl.$setValidity('password', true);
	        } else {
	          mCtrl.$setValidity('password', false);
	        }
	        return value;
	      }
	      mCtrl.$parsers.push(validation);
	    }
	  };
	});