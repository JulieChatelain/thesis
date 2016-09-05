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
            },
            authorizations: function(data, success, error) {
            	$http.post(url + '/listAccess/', data).then(success,error);
            },
            requestAccess: function(data, success, error) {
            	$http.post(url + '/requestAccess', data).then(success,error);
            },
            approveAccess: function(data, success, error) {
            	$http.post(url + '/approveAccess', data).then(success,error);
            },
            removeAccess: function(data, success, error) {
            	$http.post(url + '/removeAccess', data).then(success,error);
            },
            changePassword: function(data, success, error) {
            	$http.post(url + '/changePassword', data).then(success,error);
            },
            updateProfile: function(data, success, error) {
            	$http.post(url + '/updateProfile', data).then(success,error);
            }
        };
    }
]);