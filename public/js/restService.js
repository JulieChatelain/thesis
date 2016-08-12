'use strict';

app.factory('Rest', ['$http', function($http){
	
        var url = "http://localhost:3000";
        
        return {
            menu: function(success, error) {
                $http.get(url + '/ehrmenu').then(success,error);
            },
            patients: function(success, error) {
                $http.get(url + '/rest/patient').then(success,error);
            },
            patient: function(patientId, success, error) {
                $http.get(url + '/rest/' + patientId).then(success,error);
            },
            resource: function(resource, success, error) {
                $http.get(url + '/rest/' + resource).then(success,error);
            }
        };
    }
]);