myapp.controller('FofriskoperClientPositionController',function($scope, $timeout) {
					$scope.queryEntity = {}; // 实际查询对象

					$scope.queryAccountEntitys = []; // 查询帐号下拉框内容
					$scope.traderTypes = clearConstant.tradeTypes; // 交易类型
					$scope.directions = clearConstant.tradeDirection; // 买卖
					$scope.listEntitys = [];
					$scope.listEntity = {};
					$scope.sumPosition = 0;
					$scope.sumUsedMargin = 0;
					$scope.tmpEntity = {};
					$scope.productgroup = [];// 查询 产品组下拉框内容
					$scope.instClient = []; // 查询 机构名称下拉框内容
					$scope.isQuery = false;// 防止“查询”按钮被快速连击
					$scope.productgroupController = new com.quantdo.orgClear.service.fofFundGroupService();
					$scope.instClientController = new com.quantdo.orgClear.service.instClientService();
					$scope.fundGroupProductTypes = clearConstant.fundGroupTypes;// 产品组内产品类别
					$("[forType='date']").datepicker({
						language : 'zh-CN',
						weekStart : 1,
						autoclose : true,
						clearBtn : true,
						todayHighlight : true,
						format : 'yyyymmdd'
					});
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

					
					// 交易类型转换
					$scope.transTradeType = function(tradeType) {
						for (var i = 0; i < $scope.traderTypes.length; i++) {
							if ($scope.traderTypes[i].key == tradeType) {
								return $scope.traderTypes[i].text;
							}
						}
					}
					
					// 买卖方向转换
					$scope.transDirection = function(direction) {
						for (var i = 0; i < $scope.directions.length; i++) {
							if ($scope.directions[i].key == direction) {
								return $scope.directions[i].text;
							}
						}
					}

					$scope.tmpQuery = {};
					// 4、数据初始化
					// 4.1、进入页面时调用查询方法
					$scope.find = function(queryEntity) {
						$scope.listEntitys = [];
						$scope.isQuery = true;
						findfofriskoperClientPosition(function(result) {
							$scope.listEntitys = result;
							$scope.$apply();
						}, queryEntity.productgroupID,
								queryEntity.instclientID,
								queryEntity.instrumentId);

						$timeout(function() {
							$scope.isQuery = false;
						}, 1000);
					};

				});
