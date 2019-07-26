myapp.controller('SubAccountGroupController', function($scope, $timeout) {

	$scope.tempEntity = {};
	$scope.tempEntity.recordIndex = -1;
	$scope.traders = {};
	$scope.ModalEntity = {};
	$scope.listEntitys = new Array();

	// 初始化页面记录
	getAllAccountGroupEntity(function(result) {
		$scope.listEntitys = result;
	});
	
	function formValidateReset() {
        $scope.myForm.subAccountGroupID.$setPristine();
        $scope.myForm.subAccountGroupName.$setPristine();
    }
	// 查询
	$scope.find = function(queryEntity) {
		findAccountGroupByQuery(function(result) {
			$scope.listEntitys = result;
			$scope.$apply();
			
		}, queryEntity);
	};

	// 删除
	$scope.remove = function(index, entity) {
		layer.confirm('确定删除？', {
			icon : 3
		}, function(count) {
			deleteGroupEntity(entity.id);
			$scope.listEntitys.splice(index, 1);
			layer.close(count);
			$scope.$apply();
		});
	};

	$scope.initParameter = function(index, entity) {
		$scope.isUpdate = false;
		formValidateReset();
		$scope.tempEntity = angular.copy(entity);
		$scope.ModalEntity = angular.copy($scope.tempEntity);
		$scope.seatSystem = angular.copy($scope.listEntitys);
		$timeout(function() {
			document.getElementById("subAccountGroupID").focus();
		}, 500);

	};

	// 修改初始化信息
	$scope.initUpdateParam = function(index, entity) {
		$scope.tempEntity = angular.copy(entity);
		$scope.tempEntity.recordIndex = index;
		$scope.ModalEntity = angular.copy($scope.tempEntity);
		$scope.isUpdate = true;
	};

	// 保存操作记录
	$scope.save = function(entity) {
		var index = entity.recordIndex;
		// 修改
		if (index != undefined) {
			updateAllAccountGroupEntity(function(result) {
				$scope.listEntitys.splice(index, 1, result);
				$scope.$apply();
			}, entity);
			// 新增
		} else {
			entity.isActive = '1';
			saveAccountGroupEntity(function(result) {
				$scope.listEntitys.push(result);
				$scope.$apply();
			}, entity);
		}
		$("#myModal").modal("hide");
	};
	
});
