myapp.controller('FofriskOperInvestorAccountController',function($scope, $timeout) {

					$scope.listEntitys = {}; // table数据
					$scope.queryEntity = {}; // 实际查询对象
					$scope.productgroup = [];// 查询 产品组下拉框内容
					$scope.instClient = []; // 查询 机构名称下拉框内容
					$scope.isQuery = false;// 防止“查询”按钮被快速连击
					$scope.productgroupController = new com.quantdo.orgClear.service.fofFundGroupService();
					$scope.instClientController = new com.quantdo.orgClear.service.instClientService();
					$scope.fundGroupProductTypes = clearConstant.fundGroupTypes;// 产品组内产品类别
					
					// 初始化下拉框
					$scope.productgroupController.findByQuery(function(result) {
						$scope.productgroup = [];
						$scope.productgroup = result;
						$scope.$apply();
					}, {});
					$scope.instClientController.findInstClientByQuery(function(
							result) {
						$scope.instClient = [];
						$scope.instClient = result;
						$scope.$apply();
					}, {});

					$("[forType='date']").datepicker({
						language : 'zh-CN',
						weekStart : 1,
						autoclose : true,
						clearBtn : true,
						todayHighlight : true,
						format : 'yyyymmdd'
					});
					
					$scope.find = function(queryEntity) {
						$scope.listEntitys = [];
						$scope.isQuery = true;
						findoperInvestorAccount(function(result) {
							$scope.listEntitys = result;
							$scope.$apply();
						}, queryEntity.productgroupID,
								queryEntity.instclientID,
								queryEntity.instrumentID);
						$timeout(function() {
							$scope.isQuery = false;
						}, 1000);

					}

				});
