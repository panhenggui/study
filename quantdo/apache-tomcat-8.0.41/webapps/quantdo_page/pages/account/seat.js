myapp.controller('SeatController',function($scope, $timeout) {

			$scope.apiLinkTypes=clearConstant.apiLinkTypes;
			$scope.seatSystems=clearConstant.seatSystems;
			$scope.seatSystem = new Array();// 通道系统
			$scope.tempEntity = {};
			$scope.tempEntity.recordIndex = -1;
			$scope.isUpdate = false;
			$scope.isExchID=false;
			$scope.pwdSeat = true;
			$scope.isShow=false;
			$scope.ModalEntity = {};
			$scope.ModalPwdEntity = {};
	        $scope.ModalTemPwdEntity= {};
			$scope.brokerageEntitys = {};// 经理公司代码
			$scope.exchEntitys = {};// 交易所代码
			$scope.seatId = "";
			$scope.listEntitys = {};
			// 表达验证
			function formValidateReset() {
				$scope.myForm.seatSystem.$setPristine();
				$scope.myForm.seatName.$setPristine();
				$scope.myForm.ipAddress.$setPristine();
				$scope.myForm.seatUser.$setPristine();
				$scope.myForm.seatPassword.$setPristine();
				$scope.myForm.reSeatPassword.$setPristine();
				$scope.myForm.brokerageFirmID.$setPristine();
				$scope.myForm.memberID.$setPristine();
			}
			// 查询经纪公司信息
			getAllBrokerageFirmEntity(function(result) {
				$scope.brokerageEntitys = result;

			})
			
			// 转换通道系统
			$scope.transSeatSystems = function(key){
				for(var i = 0;i < $scope.seatSystems.length;i++){
					if($scope.seatSystems[i].key == key){
						return $scope.seatSystems[i].text;
					}
				}
			}
			
			
			// 页面经纪公司代码转换经纪公司名称
		    $scope.transBrokerage = function (text) {
		        var count = $scope.brokerageEntitys.length;
		        for (var i = 0; i < count; i++) {
		            if ($scope.brokerageEntitys[i].brokerageFirmID == text) {
		                return $scope.brokerageEntitys[i].brokerageFirmName;
		            }
		        }
		    };
			// 查询交易所代码信息
			getAllExchanges(function(result) {
				$scope.exchEntitys = result;
			});
			// 初始化页面信息
			getAllSeatEntity(function(result) {
				$scope.listEntitys = result;
				$scope.queryExchIds = angular.copy($scope.listEntitys);
				$scope.seatSystem = angular.copy($scope.listEntitys);
				$scope.$apply();
			});

			// 初始化模态窗
			$scope.initParameter = function() {
				document.getElementById('show').style.display='none'
				$scope.isUpdate = false;
				$scope.ModalEntity={};
//				$scope.tempEntity = angular.copy(entity);
//				$scope.ModalEntity = angular.copy($scope.tempEntity);
//				$scope.seatSystem = angular.copy($scope.listEntitys);
//				console.log($scope.tempEntity);
				$scope.ModalEntity.apiLinkType = $scope.apiLinkTypes[0].key;
				$scope.ModalEntity.seatSystem = $scope.seatSystems[0].key;
				$scope.ModalEntity.brokerageFirmID = $scope.brokerageEntitys[0].brokerageFirmID;
				$scope.ModalEntity.exchID = "";
				/*$scope.seatSystemSelect($scope.ModalEntity.seatSystem);*/
				formValidateReset();
				$timeout(function() {
					document.getElementById("brokerageFirmID").focus();
				}, 500);

			};
			
			
			// 查询
			$scope.find = function(queryEntity) {
				$scope.isQuery = true;
				// clear
				$scope.listEntitys = {};
				findSeatEntity(function(result) {
					$scope.listEntitys = result;
					//$scope.$apply();
					$timeout(function() {
						$scope.isQuery = false;
					}, 1000);
				}, queryEntity);
			};
			//密码空格键验证
			$scope.isSeat = function (pwd,pwdAg){
				if(pwd == undefined || pwd == " " ||pwdAg == undefined || pwdAg == " "){
					$scope.pwdSeat = true;
				}else{
					$scope.pwdSeat = false;
				}
			}
			
			// 保存操作记录
			$scope.save = function(entity) {
				var index = entity.recordIndex;
				/*//当交易系统为CTP时，会员代码不能为空
				if(entity.seatSystem==1 && entity.memberID==undefined){
					layer.msg("当交易系统为CTP时，会员代码不能为空！", {
						icon : 2,
						time : 2000
					});
					return false;
				}*/
				//密码验证
				var pwd1 = $scope.ModalEntity.seatPassword.trim();
				var pwd2 = $scope.ModalEntity.reSeatPassword.trim();
				if(pwd1 != pwd2){
					layer.msg("两次密码输入不一致，请重新输入", {
						icon : 2,
						time : 2000
					});
					return false;
				}
				
				// 增加
				if (index == undefined) {
					entity.isActive = '1';
					//判断是否有数据
					if ($scope.listEntitys.length == 0) {
						entity.seatID = "4";
					}else{
						for (var i = 0; i < $scope.listEntitys.length; i++) {
								$scope.seatID = $scope.listEntitys[$scope.listEntitys.length-1].seatID;
								seatID = parseInt($scope.seatID);
								entity.seatID = seatID + 1;
						}
					}
					entity.apiLinkType="2";
					saveSeatEntity(function(result) {
						$scope.listEntitys.unshift(result);
						$scope.queryBrIds = angular
								.copy($scope.listEntitys);
						getAllSeatEntity(function(result) {
							$scope.listEntitys = result;
							$scope.$apply();
						});
					}, entity);

				} else {
					$scope.isUpdate = true;
					updateSeatEntity(function(result) {
						$scope.listEntitys.splice(index, 1, result);
						$scope.queryBrIds = angular
								.copy($scope.listEntitys);
						$scope.$apply();
					}, entity);

				}
				// 关闭窗口
				$("#seatModal").modal("hide");
			};

			// 删除
			$scope.remove = function(index, entity) {
				layer.confirm('删除交易通道会影响该用户的交易委托，确认删除吗？', {
					icon : 3
				}, function(count) {
					deleteSeat(entity.id);
					$scope.listEntitys.splice(index, 1);
					layer.close(count);
					$scope.queryBrIds = angular
							.copy($scope.listEntitys);
					$scope.$apply();
				});
			};

			// 修改
			$scope.initUpdateParam = function(index, entity) {
				document.getElementById('show').style.display='block';
				//$secop.isOK=true;
				$scope.pwdSeat = false;
				$scope.isUpdate = true;
				$scope.tempEntity = angular.copy(entity);
				$scope.tempEntity.recordIndex = index;
				$scope.ModalEntity = angular.copy($scope.tempEntity);
				$scope.ModalEntity.reSeatPassword=entity.seatPassword;
				/*//当交易系统为CTP时，会员代码不能为空
				if(entity.seatSystem==1){
					$scope.isShow=false;
				}else{
					$scope.isShow=true;
				}
				//通道类型
				if(entity.apiLinkType == 1){
					$scope.isOK=false;
				}else{
					$scope.isOK=true;
				}*/
				formValidateReset();
				$timeout(function() {
					document.getElementById("seatName").focus();
				}, 500);
			};
			
			
			 //修改密码
		    $scope.updateResetPwd = function (entity) {
		        if(entity.seatPassword != entity.reSeatPassword){
		            layer.msg("2次输入的密码不一致。",{icon:2});
		            return ;
		        }
		        $scope.ModalTemPwdEntity.seatPassword=entity.seatPassword;
		        entity=$scope.ModalTemPwdEntity;
		        updateSeatEntity(function(result) {
                    layer.msg("修改成功",{icon:1});
                    $scope.ModalPwdEntity = {}; 
                    $("#seatPwdReset").modal("hide");
                }, entity);
		    };
		    //密码重置
		    $scope.pwdReset = function(entity){
		        $scope.ModalTemPwdEntity= entity; 
		        $scope.ModalPwdEntity =  $scope.ModalTemPwdEntity;
		        $scope.ModalPwdEntity.seatPassword = undefined;
		        $scope.ModalPwdEntity.reSeatPassword = undefined;
		    };
			/*//当值变更时
			$scope.seatSystemSelect=function(ModalEntity){
				if(ModalEntity.seatSystem==3){
					$scope.ModalEntity.apiLinkType="1";
					$scope.ModalEntity.exchID = $scope.exchEntitys[0].exchID;
					$scope.isExchID=false;
				}else{
					$scope.ModalEntity.exchID = "";
					$scope.ModalEntity.apiLinkType="2";
					$scope.isExchID=true;
				}
			}*/
			/*$scope.seatSystemSelect=function(ModalEntity){
				if(ModalEntity.seatSystem==1){
					$scope.isShow=false;
				}else{
					$scope.isShow=true;
				}
			}*/

});