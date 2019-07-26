myapp.controller('subCapitalAccountRegController', function($scope, $timeout,$rootScope) {
	$scope.subCapitalAccount = {};
	$scope.capitalAccountEntitys = [];
	$scope.allCapitalAccountEntitys = [];
	$scope.accountGroupEntitys = [];
	$scope.tmpSubCapitalAccount = {};
	$scope.marginTemplateEntitys = [];
	$scope.feeTemplateEntitys = [];
	$scope.subAccountTemplateReg = new Array();
	$scope.subAccountTemplate =new Array();
	$scope.radio = {};
	$scope.subCapitalAccount.traderID = sessionStorage.traderID;
	$scope.subCapitalAccount.subAccountID = sessionStorage.traderID;
	$scope.positionTypes = clearConstant.positionTypes;
	$scope.subCapitalAccount.positionType = $scope.positionTypes[0].key;
	
	$scope.isSelected1 = false;
	$scope.isSelected2 =true;
    $scope.isSelected3 = true;
    $scope.isSelected4 = true;
    $scope.x = false;
    $scope.y = false;

    //获取页面加载时所需数据集合
    findNotInGroup(function (result) {
    	if(result.length > 0){
    		$scope.capitalAccountEntitys = result;
            $scope.tmpSubCapitalAccount.innerAccountID = $scope.capitalAccountEntitys[0].innerAccountID;
            $scope.$apply();
    	}
    });
	
	findCapitalAccountReg(function (result) {
        $scope.allCapitalAccountEntitys = result;
    });
    
	getAllAccountGroupsEntity(function (result) {
        $scope.accountGroupEntitys = result;
        $scope.tmpSubCapitalAccount.accountGroupID = $scope.accountGroupEntitys[0].accountGroupID;
        $scope.$apply();
    });
	
	getAllFeeTemplateEntity(function (result){
		$scope.feeTemplateEntitys =result;
		if(result.length > 0){
			$scope.subAccountTemplate.feeTemplateID = $scope.feeTemplateEntitys[0].templateID;
		}
        $scope.$apply();
	});
	
	getAllMarginTemplate(function (result){
		$scope.marginTemplateEntitys =result;
		if(result.length > 0){
			$scope.subAccountTemplate.marginTemplateID = $scope.marginTemplateEntitys[0].templateID;
		}
        $scope.$apply();
	});
	
	//checkbox事件
	$scope.isMargin = function (x){
		if(x==true){
			if($scope.subAccountTemplate.marginTemplateID == undefined ||
					$scope.subAccountTemplate.marginTemplateID == ""){
				layer.msg("对应保证金率模板为空，不能选择该项", {
					icon : 2,
					time : 2000
				});
				$scope.x=false;
				$scope.isSelected3=true;
			}else{
				$scope.isSelected3=false;
			}
		}else{
			$scope.isSelected3=true;
		}
	}
	
	$scope.isFee = function (y){
		if(y==true){
			if($scope.subAccountTemplate.feeTemplateID == undefined ||
					$scope.subAccountTemplate.feeTemplateID == ""){
				layer.msg("对应手续费率模板为空，不能选择该项", {
					icon : 2,
					time : 2000
				});
				$scope.y=false;
				$scope.isSelected4=true;
			}else{
				$scope.isSelected4=false;
			}
		}else{
			$scope.isSelected4=true;
		}
	}
	
	// 重置表单验证信息
	function formValidateReset() {
		$scope.myForm.traderID.$setPristine();
		$scope.myForm.traderID.value="";
	}

	$scope.changeState = function (){
		if($scope.radio.selected=="1"){
			$scope.isSelected2=true;
			$scope.isSelected1=false;
		}
		if($scope.radio.selected=="2"){
			$scope.isSelected1=true;
			$scope.isSelected2=false;
		}
	}
	
	//转换内部资金帐号成资金帐号ID
	function transCapitalAccount(innerAccountID){
		for(var i = 0;i < $scope.allCapitalAccountEntitys.length;i++){
			if($scope.allCapitalAccountEntitys[i].innerAccountID == innerAccountID){
				return $scope.allCapitalAccountEntitys[i].accountID;
			}
		}
	}
	
	// 完成
	$scope.finish = function(subCapitalAccount) {
		findSubCapitalEntity(function(result) {
				if (result.length > 0) {
					layer.msg("此风险资金帐号已存在", {
						icon : 2,
						time : 2000
					});
					return false;
				} else {
					subCapitalAccount.isActive = '1';
					subCapitalAccount.subAccountName = sessionStorage.traderName;
					subCapitalAccount.innerAccountID = $scope.tmpSubCapitalAccount.innerAccountID;
					//选择对应资金帐号
					if($scope.radio.selected=="1"){
						subCapitalAccount.innerAccountID = $scope.tmpSubCapitalAccount.innerAccountID;
						subCapitalAccount.accountGroupID = null;
					}
					//选择对应资金帐号组
					else if($scope.radio.selected=="2"){
						subCapitalAccount.accountGroupID = $scope.tmpSubCapitalAccount.accountGroupID;
						subCapitalAccount.innerAccountID =null;
					}
					// 存入subCapitalAccount表
					saveSubCapitalEntity(function(result) {
						$scope.subAccountTemplateReg = [];
						if($scope.x==true){
							$scope.tmpRegEntity = {};
							$scope.tmpRegEntity.subAccountID = $scope.subCapitalAccount.subAccountID;
							$scope.tmpRegEntity.templateID = $scope.subAccountTemplate.marginTemplateID;
							$scope.tmpRegEntity.templateType = "1";
							$scope.subAccountTemplateReg.push($scope.tmpRegEntity);
						}
						if($scope.y==true){
							$scope.tmpRegEntity = {};
							$scope.tmpRegEntity.subAccountID = $scope.subCapitalAccount.subAccountID;
							$scope.tmpRegEntity.templateID = $scope.subAccountTemplate.feeTemplateID;
							$scope.tmpRegEntity.templateType = "2";
							$scope.subAccountTemplateReg.push($scope.tmpRegEntity);
						}
						if($scope.subAccountTemplateReg.length > 0){
							for(var i=0;i < $scope.subAccountTemplateReg.length;i++){
								saveSubAccountTemplate(function(tmp){},$scope.subAccountTemplateReg[i]);
							}
						}
					}, subCapitalAccount);
					layer.msg("开户成功", {
						icon : 1,
						time : 2000
					});
					$rootScope.addPane('资产单元开户','traderRegController','account/traderReg.html');
				}
			}, {
				subAccountID : subCapitalAccount.subAccountID
			});
		//window.location.href="#traderReg";

		
	}
});
