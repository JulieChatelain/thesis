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