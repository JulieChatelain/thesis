app.controller('loginCtrl',function($log, $scope, $http) {
	$scope.signin = function(data, success, error) {
        $http.post(baseUrl + '/authenticate', data).success(success).error(error)
    };
    $scope.me = function(success, error) {
        $http.get(baseUrl + '/me').success(success).error(error)
    };
    $scope.logout = function(success) {
        changeUser({});
        delete $localStorage.token;
        success();
    };
});