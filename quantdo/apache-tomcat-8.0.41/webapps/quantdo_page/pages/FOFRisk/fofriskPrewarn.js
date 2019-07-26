myapp.controller('fofriskPrewarnController',function($scope, $timeout, $rootScope) {
	
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;

					/*
					 * 产品组查询
					 */
					$scope.productGrouplistEntitys = [];	//左侧数据
					$scope.infoLists = [];		// 信息汇总
					$scope.isChecked = false;// 勾选框默认不选
					$scope.selectedProductGroup = [];// 用于更新右侧栏目
					$scope.productlistEntitys = [];// 产品组预警信息
					$scope.accountlistEntitys = [];// 资金账户
					$scope.operClientPositionlistEntitys = [];// 持仓
					$scope.operOrderlistEntitys = [];// 委托
					$scope.operTradelistEntitys = [];// 成交
					$scope.canClick=false;
					var date = new Date();

					// 产品组维度查询
					getAllproductGroup(function(result) {
						$scope.productGrouplistEntitys = angular.copy(result);
                        $scope.$apply();
					});
					
					// 勾选框功能函数
					// 单个选择
					$scope.recordChecked = function(x, listEntity) {
						$scope.canClick=true;
						if (x) {
							$scope.selectedProductGroup.push(listEntity);
							$scope.updateTable();
						} else {
							var index = $scope.selectedProductGroup
									.indexOf(listEntity);
							$scope.selectedProductGroup.splice(index, 1);
							$scope.updateTable();
						}
						$timeout(function() {
							$scope.canClick = false;
						}, 500);

					}

					// 全选
					$scope.addChecked = function(flag, productGrouplistEntitys) {
						$scope.canClick=true;
						if (flag) {
							$scope.selectedProductGroup = [];// 先清空再加入
							for(var i=0;i<productGrouplistEntitys.length;i++){
								$scope.selectedProductGroup.push(productGrouplistEntitys[i]);
							}	 
									
							$scope.isChecked = true;
							$scope.updateTable();
						} else {
							$scope.selectedProductGroup = [];
							$scope.isChecked = false;
							$scope.updateTable();
						}
						$timeout(function() {
							$scope.canClick = false;
						}, 500);

					}
					
					// 手动刷新
					$scope.refreshOperClient = function(){
						$scope.isOperClientQuery = true;
						// 更新持仓
						getAllposition(function(result) {
							$scope.operClientPositionlistEntitys = result;
							$timeout(function(){
								$scope.isOperClientQuery = false;
							},500);
						}, $scope.selectedProductGroup);
					}
					
					$scope.refreshOperOrder = function(){
						$scope.isOperOrderQuery = true;
						// 更新委托
						getAlloperOrder(function(result) {
							$scope.operOrderlistEntitys = result;
							$timeout(function(){
								$scope.isOperOrderQuery = false;
							},500);
						}, $scope.selectedProductGroup);
					}
					
					$scope.refreshOperTrade = function(){
						$scope.isOperTradeQuery = true;
						// 更新成交
						getAlloperTrade(function(result) {
							$scope.operTradelistEntitys = result;
							$timeout(function(){
								$scope.isOperTradeQuery = false;
							},500);
						}, $scope.selectedProductGroup);
					}
					
					$scope.refreshOperAccount = function(){
						$scope.isOperAccountQuery = true;
						// 更新资金
						getAllcapital(function(result) {
							$scope.accountlistEntitys = result;
							$timeout(function(){
								$scope.isOperAccountQuery = false;
							},500);
						}, $scope.selectedProductGroup);
					}
					
					// 数据表的更新
					$scope.updateTable = function() {
						clearInterval($scope.timer);
						
						if($scope.selectedProductGroup.length > 0){		//有勾选才查询
							
							// 产品组维度查询
							getProductGroupByCondition(function(result) {
								$scope.infoLists = angular.copy(result);
								
								// 更新资金
								getAllcapital(function(result) {
									$scope.accountlistEntitys = result;
									
									// 更新持仓
									getAllposition(function(result) {
										$scope.operClientPositionlistEntitys = result;
										
										// 更新委托
										getAlloperOrder(function(result) {
											$scope.operOrderlistEntitys = result;
											
											// 更新成交
											getAlloperTrade(function(result) {
												$scope.operTradelistEntitys = result;
												
												// 更新預警信息
												getAllproduct(function(result) {
													$scope.productlistEntitys = result;
													$scope.$apply();
													
													// 更新净值走势图
													getAllNetWorth(function(results){
														if(results == null || results.length == 0){	//没有查到数据
															return ;
														}
														
														$("#fofRiskNetWorth").html('');//先清空页面								
														var str="";
														for(var i=0;i<results.length;i++){
															var data=[];
															var result=results[i];
															for(var j=0;j<result.length;j++){
																
																if(result[j].netTime==null ||result[j].netTime=='')continue;// 如果时间为空，该条数据跳过
																var times=result[j].netTime.split(':');
																var tem=[];
																tem.push(Date.UTC(date.getFullYear(), date.getMonth(),
																		date.getDate(), times[0], times[1], times[2]));
																tem.push(result[j].netValue);									
																data.push(tem);
															}
															
															// 开始创建图表
															$scope.series[0].data = data;// 步骤一：添加数据
															$scope.series[0].name=result[0].fundInfo+'净值趋势';
															$scope.title.text =result[0].fundInfo+'净值趋势';
															var json = {};
															json.chart =$scope.chart;
															json.credits =$scope.credits;
															json.title =$scope.title;						
															json.legend =$scope.legend;
															json.xAxis =$scope.xAxis;
															json.yAxis =$scope.yAxis;
															json.series =$scope.series;
															json.plotOptions =$scope.plotOptions;
															str=" <div  class='col-xs-4'> <div id='container"+i+"'  style='width: 300px; height: 220px;margin: 0 auto'></div></div>"
															//动态添加展示位置
															$("#fofRiskNetWorth").append(str);
															//进行数据展示
															$("#container"+i).highcharts(json);
													    }			
													},$scope.selectedProductGroup);
														
												}, $scope.selectedProductGroup);
												
											}, $scope.selectedProductGroup);
											
										}, $scope.selectedProductGroup);
										
									}, $scope.selectedProductGroup);
									
								}, $scope.selectedProductGroup);
								
							}, $scope.selectedProductGroup);
							
							// 定时刷新
							$scope.timer = setInterval(function(){
								
								// 更新預警信息
								getAllproduct(function(result) {
									$scope.productlistEntitys = result;
									$scope.$apply();
									if($scope.currentTab.id == 5){
										// 更新净值走势图
										getAllNetWorth(function(results){
											if(results == null || results.length == 0)
												return ;				//没有查到数据
											
											$("#fofRiskNetWorth").html('');//先清空页面								
											var str="";
											for(var i=0;i<results.length;i++){
												var data=[];
												var result=results[i];
												for(var j=0;j<result.length;j++){
													
													if(result[j].netTime==null ||result[j].netTime=='')continue;// 如果时间为空，该条数据跳过
													var times=result[j].netTime.split(':');
													var tem=[];
													tem.push(Date.UTC(date.getFullYear(), date.getMonth(),
															date.getDate(), times[0], times[1], times[2]));
													tem.push(result[j].netValue);									
													data.push(tem);
												}
												
												// 开始创建图表
												$scope.series[0].data = data;// 步骤一：添加数据
												$scope.series[0].name=result[0].fundInfo+'净值趋势';
												$scope.title.text =result[0].fundInfo+'净值趋势';
												var json = {};
												json.chart =$scope.chart;
												json.credits =$scope.credits;
												json.title =$scope.title;						
												json.legend =$scope.legend;
												json.xAxis =$scope.xAxis;
												json.yAxis =$scope.yAxis;
												json.series =$scope.series;
												json.plotOptions =$scope.plotOptions;
												str=" <div  class='col-xs-4'> <div id='container"+i+"'  style='width: 300px; height: 220px;margin: 0 auto'></div></div>"
												//动态添加展示位置
												$("#fofRiskNetWorth").append(str);
												//进行数据展示
												$("#container"+i).highcharts(json);
										    }			
										},$scope.selectedProductGroup)
									}else if($scope.currentTab.id == 0) {
										// 产品组维度查询
										getProductGroupByCondition(function(result) {
											$scope.infoLists = result;
											$scope.$apply();
										}, $scope.selectedProductGroup);
									}
									
								}, $scope.selectedProductGroup);
								
							},30000);
							
						}else{
							$scope.selectedProductGroup = [];
							$scope.productlistEntitys = [];
							$scope.accountlistEntitys = [];
							$scope.operClientPositionlistEntitys = [];
							$scope.operOrderlistEntitys = [];
							$scope.operTradelistEntitys = [];
							$scope.infoLists = [];
							$("#fofRiskNetWorth").html('');
						}
						
					}
					
					/*
					 * Tab切换块儿
					 */
					// Tab切换部分--begin
					// 初始化
					$scope.tabs = [ {
						title : '净值信息汇总',
						id : 0
					}, {
						title : '持仓统计',
						id : 1
					}, {
						title : '当日委托',
						id : 2
					}, {
						title : '当日成交',
						id : 3
					}, {
						title : '资金信息',
						id : 4
					}, {
						title : '净值走势',
						id : 5
					} ];
					$scope.tab0 = true;
					$scope.tab1 = false;
					$scope.tab2 = false;
					$scope.tab3 = false;
					$scope.tab4 = false;
					$scope.tab5 = false;
					// 初始化tab

					$scope.currentTab = $scope.tabs[0];
					
					$scope.onClickTab = function(tab) {
						switch ($scope.currentTab.id) {
						case 0:
							$scope.tab0 = false;
							break;
						case 1:
							$scope.tab1 = false;
							break;
						case 2:
							$scope.tab2 = false;
							break;
						case 3:
							$scope.tab3 = false;
							break;
						case 4:
							$scope.tab4 = false;
							break;
						case 5:
							$scope.tab5 = false;
							break;
						default:

						}
						switch (tab.id) {
						case 0:
							$scope.tab0 = true;
							break;
						case 1:
							$scope.tab1 = true;
							// 更新持仓
							getAllposition(function(result) {
								$scope.operClientPositionlistEntitys = result;
								$scope.$apply();
							}, $scope.selectedProductGroup);
							break;
						case 2:
							$scope.tab2 = true;
							// 更新委托
							getAlloperOrder(function(result) {
								$scope.operOrderlistEntitys = result;
								$scope.$apply();
							}, $scope.selectedProductGroup);
							break;
						case 3:
							$scope.tab3 = true;
							// 更新成交
							getAlloperTrade(function(result) {
								$scope.operTradelistEntitys = result;
							}, $scope.selectedProductGroup);
							break;
						case 4:
							$scope.tab4 = true;
							// 更新资金
							getAllcapital(function(result) {
								$scope.accountlistEntitys = result;
								$scope.$apply();
							}, $scope.selectedProductGroup);
							break;
						case 5:
							$scope.tab5 = true;
							break;
						default:

						}
						$scope.currentTab = tab;
					}

					$scope.isActiveTab = function(tab) {
						return tab == $scope.currentTab;
					}
					// Tab切换--end

					$scope.orderStatus = clearConstant.orderStatus;// 报单状态
					$scope.traderTypes = clearConstant.tradeTypes; // 交易类型
					$scope.directions = clearConstant.tradeDirection; // 买卖
					$scope.offsetFlags = clearConstant.offsetFlag;// 开平
					$scope.investorTypes = clearConstant.investorType;// 投资者类型
					$scope.fundGroupRiskWarnTypes=clearConstant.fundGroupRiskWarnTypes;// 风控预警类别
                    $scope.fundGroupRiskWarnStatus=clearConstant.fundGroupStatus;// 产品组预警状态
                    
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
					// 投资者类型
					$scope.transInvestorType = function(investorType) {
						for (var i = 0; i < $scope.investorTypes.length; i++) {
							if ($scope.investorTypes[i].key == investorType) {
								return $scope.investorTypes[i].text;
							}
						}
					}
                    // 风控预警类别转换
					$scope.transRiskWarnTypes= function(riskWarnType){
						for (var i = 0; i < $scope.fundGroupRiskWarnTypes.length; i++) {
							if ($scope.fundGroupRiskWarnTypes[i].key == riskWarnType) {
								return $scope.fundGroupRiskWarnTypes[i].text;
							}
						}
					}
					// 风控预警状态转换
					$scope.transRiskWarnStatus=function(riskWarnStatus){
						for (var i = 0; i < $scope.fundGroupRiskWarnStatus.length; i++) {
							if ($scope.fundGroupRiskWarnStatus[i].key == riskWarnStatus) {
								return $scope.fundGroupRiskWarnStatus[i].text;
							}
						}
					}
					/*
					 * 净值走势
					 */
					/* ~~~~~~~~~~~图表样式~~~~~~~~~~~~ */
					
					// 图标整体样式
					$scope.chart = {
						zoomType : 'x',
						showAxes : true,
						renderTo: ''

					};
					// 版权信息
					$scope.credits = {
						enabled : false
					};
					// 定义图表主标题
					$scope.title = {
						text : ''
					};
					// x轴样式
					$scope.xAxis = {
						type : 'datetime',
						style: {         //字体样式
							   font: 'normal 1px Verdana, sans-serif'
						   },
						min : Date.UTC(date.getFullYear(), date.getMonth(),
								date.getDate(), 9, 30, 0),						
						max : Date.UTC(date.getFullYear(), date.getMonth(),
								date.getDate(), 15, 0, 0),
						minRange : 1800 * 1000,// 
						tickInterval : 3600 * 1000,// 刻度间隔
//						tickPixelInterval : 2,
						tickPositions : [
								Date.UTC(date.getFullYear(), date.getMonth(),
										date.getDate(), 9, 30, 0),
								Date.UTC(date.getFullYear(), date.getMonth(),
										date.getDate(), 10, 30, 0),
								Date.UTC(date.getFullYear(), date.getMonth(),
										date.getDate(), 11, 30, 0),
								Date.UTC(date.getFullYear(), date.getMonth(),
										date.getDate(), 13, 0, 0),
								Date.UTC(date.getFullYear(), date.getMonth(),
										date.getDate(), 14, 0, 0),
								Date.UTC(date.getFullYear(), date.getMonth(),
										date.getDate(), 15, 0, 0) ],
						labels : {
							formatter : function() {
								var returnTime=Highcharts.dateFormat('%H:%M ', this.value);
								                     return returnTime;
							}
						}
					};
					
					$scope.baselabelvalue = 1;// 中轴线位置
					// y轴样式
					$scope.yAxis = [
							{// 默认的y轴

								title : {
									text : ''
								},
								gridLineDashStyle : 'ShortDot',
								// tickPositions:[1.0],
								min : 0,
								max : 10,
								tickInterval : 2.5,
								showEmpty : false,
								labels : {
									formatter : function() {
										if (this.value > $scope.baselabelvalue) {
											return '<span style="color:red">'
													+ this.value + '</span>';
										}
										if (this.value == $scope.baselabelvalue) {
											return '<span style="color:black">'
													+ this.value + '</span>';
										}
										if (this.value < $scope.baselabelvalue) {
											return '<span style="color:green">'
													+ this.value + '</span>';
										}

									}
								},
								tickPositions :[0,0.5,1,1.5,2],
								useHTML : true,
								plotLines : [ {// 定义中轴线样式
									dashStyle : 'solid',
									color : '#222222',
									width : 2,

								} ]
							},
							{

								title : {
									text : ''
								},
								linkedTo : 0,
								gridLineDashStyle : 'ShortDot',
								opposite : true,
								useHTML : true,
								labels : {
									formatter : function() {
										var num = new Number(
												(this.value - $scope.baselabelvalue)
														/ $scope.baselabelvalue
														* 100);
										if (this.value > $scope.baselabelvalue) {
											return '<span style="color:red">'
													+ num.toFixed(2)
													+ '%</span>';
										}
										if (this.value == $scope.baselabelvalue) {
											return '<span style="color:black">'
													+ num.toFixed(2)
													+ '%</span>';
										}
										if (this.value < $scope.baselabelvalue) {
											return '<span style="color:green">'
													+ num.toFixed(2)
													+ '%</span>';
										}

									}
								},
								tickPositions :[0,0.5,1,1.5,2],//两个y轴都要设置
								

							}

					];
					$scope.yAxis[0].plotLines[0].value = $scope.baselabelvalue;
					$scope.legend = {
						enabled : false
					};
					$scope.tooltip = {
						shared : true

					};
					$scope.plotOptions = {
						spline : {
							dataLabels : {
								enabled : false
							},							
							color : '#FF0000',// 高于阈值显示红色
						// threshold: 1.0//设置阈值
						}
					};
					$scope.plotOptions.spline.threshold = $scope.baselabelvalue;
					$scope.series = [ {
						type : 'spline',
						name : '产品001净值',
						negativeColor : '#008800'// 低于阈值显示绿色
					} ];
				/* ~~~~~~~~~~~图表样式~~~结束~~~~~~~~~ */	
					
});
