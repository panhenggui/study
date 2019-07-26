myapp.controller('homeCtroller', function ($scope) {
	$scope.userInfo={};
	findAllPersonInfor(function (result) {
        $scope.userInfo=result;
        $scope.$apply();
    });
});