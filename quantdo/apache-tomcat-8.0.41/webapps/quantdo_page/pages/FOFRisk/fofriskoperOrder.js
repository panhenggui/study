myapp.controller('FofriskOperOrderController',function($scope, $timeout) {
					$scope.searchTypes = clearConstant.operClientPositon_searchType; // 查询方式下拉框内容
					$scope.orderStatus = clearConstant.orderStatus;// 报单状态
					$scope.directions = clearConstant.tradeDirection;// 买卖
					$scope.offsetFlags = clearConstant.offsetFlag;// 开平
					$scope.traderTypes = clearConstant.tradeTypes;// 交易所类型
					$scope.investorTypes = clearConstant.investorType;// 投资者类型
					// 2、定义页面数据模型
					$scope.queryEntity = {}; // 实际查询对象
					$scope.listEntitys = [];
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

					// -------------------------------------------
					$scope.tmpQuery = {};
					$scope.find = function(queryEntity) {
						$scope.isQuery = true;

						$timeout(function() {
							$scope.isQuery = false;
						}, 1000);
					};

					// 买卖
					$scope.transDirection = function(direction) {
						for (var i = 0; i < $scope.directions.length; i++) {
							if ($scope.directions[i].key == direction) {
								return $scope.directions[i].text;
							}
						}
					}
					// 开平
					$scope.transOffsetFlag = function(offsetFlag) {
						for (var i = 0; i < $scope.offsetFlags.length; i++) {
							if ($scope.offsetFlags[i].key == offsetFlag) {
								return $scope.offsetFlags[i].text;
							}
						}
					}
					// 报单状态
					$scope.transOrderStatus = function(orderStatusl) {
						for (var i = 0; i < $scope.orderStatus.length; i++) {
							if ($scope.orderStatus[i].key == orderStatusl) {
								return $scope.orderStatus[i].text;
							}
						}
					}
					// 交易类型
					$scope.transTradeType = function(tradeType) {
						for (var i = 0; i < $scope.traderTypes.length; i++) {
							if ($scope.traderTypes[i].key == tradeType) {
								return $scope.traderTypes[i].text;
							}
						}
					}
					// 投资者类型
					$scope.transInvestorType = function(investorType) {
						for (var i = 0; i < $scope.investorTypes.length; i++) {
							if ($scope.investorTypes[i].key == investorType) {
								return $scope.investorTypes[i].text;
							}
						}
					}

					$scope.find = function(queryEntity) {
						$scope.listEntitys = [];
						$scope.isQuery = true;
						findfofriskoperOrder(function(result) {
							$scope.listEntitys = result;
							$scope.$apply();
						}, queryEntity.productgroupID,
								queryEntity.instclientID,
								queryEntity.instrumentID);

						$timeout(function() {
							$scope.isQuery = false;
						}, 1000);
					};
});
