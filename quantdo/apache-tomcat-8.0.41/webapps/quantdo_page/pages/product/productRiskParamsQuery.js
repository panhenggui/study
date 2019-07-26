myapp.controller('productRiskParamsQueryController', function ($scope, $timeout) {
	
	$scope.productRiskParamsQueryService = new com.quantdo.orgClear.service.ProductRiskParamsQueryService();
	
	// 初始化页面参数
    $scope.queryEntity = {};
    $scope.queryInsts = [];
    $scope.queryProducts = [];
    $scope.ModalEntity = {};
    $scope.riskIndexSets = [];
	
    // 机构信息
    getInstClientQueryConditionList(function(result){
    	$scope.queryInsts = angular.copy(result);
    	$scope.queryEntity.instClientID = $scope.queryInsts[0].instClientID;
    	$scope.currentInst = $scope.queryInsts[0].instClientID;
    	if($scope.queryInsts.length > 1){
    		$scope.noInst = false;
    	}else{
    		$scope.noInst = true;
    	}
    	$scope.getProductsInfo($scope.currentInst);
    });
    
    // 根据机构筛选产品
    $scope.getProductsInfo = function(instClientID){
    	findFundProduct(function (result) {
        	$scope.queryProducts = angular.copy(result);
        	if($scope.queryProducts.length > 0){
        		$scope.queryEntity.fundProductID = $scope.queryProducts[0].fundProductID;
        	}
        	$scope.$apply();
        },{
        	instClientID: instClientID
        });
    }
    
    // 查询
    $scope.find = function(queryEntity){
    	$scope.isQuery = true;
    	
    	if(queryEntity.fundProductID == undefined || queryEntity.fundProductID.trim() == ''){
    		layer.msg("产品代码不能为空",{icon: 2});
    		$scope.isQuery = false;
    		return false;
    	}
    	
    	// 交易所报单频率控制
    	$scope.productRiskParamsQueryService.findRiskExchangeOrderControlByQuery(function(result){
    		if(result != null && result.length > 0){
    			$("#riskExchangeOrderControl_panel").show();
    			$scope.riskExchangeOrderControlDataset = [];
        		var con = angular.copy(result);
                for(var i = 0; i<con.length;i++){
                	var useLimitStr = "";
                	var useKillOrderStr = "";
                	
                	if(con[i].useLimit == "true"){
                		useLimitStr = "启用";
                	}else{
                		useLimitStr = "不启用";
                	}
                	
                	if(con[i].useKillOrder == "true"){
                		useKillOrderStr = "启用";
                	}else{
                		useKillOrderStr = "不启用";
                	}
                	
                    var tempArr = [(i+1),con[i].id,con[i].exchangeID,useLimitStr,con[i].maxOrderNum,useKillOrderStr];
    	            $scope.riskExchangeOrderControlDataset.push(tempArr);
                }
                
                $scope.riskExchangeOrderControlTable.clear().draw();
                $scope.riskExchangeOrderControlTable.rows.add($scope.riskExchangeOrderControlDataset).draw();
    		}else{
    			$("#riskExchangeOrderControl_panel").hide();
    		}
	    	
            
            // 期货数量控制
            $scope.productRiskParamsQueryService.findRiskFutureVolumeControlByQuery(function(result){
            	if(result != null && result.length > 0){
        			$("#riskFutureVolumeControl_panel").show();
	    	    	$scope.riskFutureVolumeControlDataset = [];
	        		var con = angular.copy(result);
	                for(var i = 0; i<con.length;i++){
	                	
	                    var tempArr = [(i+1),con[i].id,con[i].exchangeID,con[i].productID,con[i].maxPositionVolumeInstrument,
	                                   con[i].maxKillOrderVolumeInstrument,con[i].maxOpenVolumeProduct];
	    	            $scope.riskFutureVolumeControlDataset.push(tempArr);
	                }
	                
	                $scope.riskFutureVolumeControlTable.clear().draw();
	                $scope.riskFutureVolumeControlTable.rows.add($scope.riskFutureVolumeControlDataset).draw();
            	}else{
        			$("#riskFutureVolumeControl_panel").hide();
            	}
                
                // 同向反向控制
                $scope.productRiskParamsQueryService.findRiskDirectionControlByQuery(function(result){
                	if(result != null && result.length > 0){
            			$("#riskDirectionControl_panel").show();
	        	    	$scope.riskDirectionControlDataset = [];
	            		var con = angular.copy(result);
	                    for(var i = 0; i<con.length;i++){
	                    	
	                    	var useDirectionControlStr = "";
	                    	
	                    	if(con[i].useDirectionControl == "true"){
	                    		useDirectionControlStr = "启用";
	                    	}else{
	                    		useDirectionControlStr = "不启用";
	                    	}
	                    	
	                        var tempArr = [(i+1),con[i].id,con[i].exchangeID,useDirectionControlStr];
	        	            $scope.riskDirectionControlDataset.push(tempArr);
	                    }
	                    
	                    $scope.riskDirectionControlTable.clear().draw();
	                    $scope.riskDirectionControlTable.rows.add($scope.riskDirectionControlDataset).draw();
                	}else{
            			$("#riskDirectionControl_panel").hide();
                	}
                    
                    // 证券交易品种限制
                    $scope.productRiskParamsQueryService.findStockTradingVarietiesRestrictionIndexByQuery(function(result){
                    	if(result != null && result.length > 0){
                			$("#stockTradingVarietiesRestrictionIndex_panel").show();
	            	    	$scope.stockTradingVarietiesRestrictionIndexDataset = [];
	                		var con = angular.copy(result);
	                        for(var i = 0; i<con.length;i++){
	                        	
	                            var tempArr = [(i+1),con[i].info,con[i].buy,con[i].sell];
	            	            $scope.stockTradingVarietiesRestrictionIndexDataset.push(tempArr);
	                        }
	                        
	                        $scope.stockTradingVarietiesRestrictionIndexTable.clear().draw();
	                        $scope.stockTradingVarietiesRestrictionIndexTable.rows.add($scope.stockTradingVarietiesRestrictionIndexDataset).draw();
                    	}else{
                			$("#stockTradingVarietiesRestrictionIndex_panel").hide();
                    	}
                        
                        // 期货交易品种限制
                        $scope.productRiskParamsQueryService.findFutureVarietiesRestrictionIndexByQuery(function(result){
                        	if(result != null && result.length > 0){
                    			$("#futureVarietiesRestrictionIndex_panel").show();
	                	    	$scope.futureVarietiesRestrictionIndexDataset = [];
	                    		var con = angular.copy(result);
	                            for(var i = 0; i<con.length;i++){
	                            	
	                                var tempArr = [(i+1),con[i].info,con[i].buyOpen,con[i].buyFlat,con[i].sellOpen,con[i].sellFlat];
	                	            $scope.futureVarietiesRestrictionIndexDataset.push(tempArr);
	                            }
	                            
	                            $scope.futureVarietiesRestrictionIndexTable.clear().draw();
	                            $scope.futureVarietiesRestrictionIndexTable.rows.add($scope.futureVarietiesRestrictionIndexDataset).draw();
                        	}else{
                    			$("#futureVarietiesRestrictionIndex_panel").hide();
                        	}
                            
                            // 资产组合风控
                            $scope.productRiskParamsQueryService.findRiskIndexSetByQuery(function(result){
                            	if(result != null && result.length > 0){
                        			$("#riskIndexSet_panel").show();
	                    	    	$scope.riskIndexSetDataset = [];
	                        		var con = angular.copy(result);
	                        		$scope.riskIndexSets = angular.copy(result);
	                                for(var i = 0; i<con.length;i++){
	                                	
	                                	var operate = "<a class='backFilter update-row' style='cursor:pointer' data-toggle='modal' " +
	            						"data-target='#indicatorThresholdModal' name='ProductRiskParamsQueryService.findIndicatorThresholdByQuery'>阈值</a>";
	                                    var tempArr = [(i+1),con[i].id,con[i].indexName,con[i].descr,operate];
	                    	            $scope.riskIndexSetDataset.push(tempArr);
	                                }
	                                
	                                $scope.riskIndexSetTable.clear().draw();
	                                $scope.riskIndexSetTable.rows.add($scope.riskIndexSetDataset).draw();
                            	}else{
                        			$("#riskIndexSet_panel").hide();
                            	}
                                
                                // 市场占比
                                $scope.productRiskParamsQueryService.findRiskFundProductIdxByQuery(function(result){
                                	if(result != null && result.length > 0){
                            			$("#marketProportion_panel").show();
	                        	    	$scope.marketProportionDataset = [];
	                            		var con = angular.copy(result);
	                                    for(var i = 0; i<con.length;i++){
	                                    	
	                                        var tempArr = [(i+1),con[i].dictName,con[i].descr];
	                        	            $scope.marketProportionDataset.push(tempArr);
	                                    }
	                                    
	                                    $scope.marketProportionTable.clear().draw();
	                                    $scope.marketProportionTable.rows.add($scope.marketProportionDataset).draw();
                                	}else{
                            			$("#marketProportion_panel").hide();
                                	}
                                    
                                    // 持仓占比
                                    $scope.productRiskParamsQueryService.findRiskFundProductIdxByQuery(function(result){
                                    	if(result != null && result.length > 0){
                                			$("#positionProportion_panel").show();
	                            	    	$scope.positionProportionDataset = [];
	                                		var con = angular.copy(result);
	                                        for(var i = 0; i<con.length;i++){
	                                        	
	                                            var tempArr = [(i+1),con[i].dictName,con[i].descr];
	                            	            $scope.positionProportionDataset.push(tempArr);
	                                        }
	                                        
	                                        $scope.positionProportionTable.clear().draw();
	                                        $scope.positionProportionTable.rows.add($scope.positionProportionDataset).draw();
                                    	}else{
                                			$("#positionProportion_panel").hide();
                                    	}
                                        
                                        // 单位净值止损
                                        $scope.productRiskParamsQueryService.findUnitNetValueStopByQuery(function(result){
                                        	if(result != null && result.length > 0){
                                    			$("#unitNetValueStop_panel").show();
	                                	    	$scope.unitNetValueStopDataset = [];
	                                    		var con = angular.copy(result);
	                                            for(var i = 0; i<con.length;i++){
	                                            	
	                                                var tempArr = [(i+1),con[i].unitNetValue,con[i].valueType,con[i].action];
	                                	            $scope.unitNetValueStopDataset.push(tempArr);
	                                            }
	                                            
	                                            $scope.unitNetValueStopTable.clear().draw();
	                                            $scope.unitNetValueStopTable.rows.add($scope.unitNetValueStopDataset).draw();
                                        	}else{
                                    			$("#unitNetValueStop_panel").hide();
                                        	}
                                            
                                            // 日内最大回撤止损
                                            $scope.productRiskParamsQueryService.findDayMaxRetraceByQuery(function(result){
                                            	if(result != null && result.length > 0){
                                        			$("#dayMaxRetrace_panel").show();
	                                    	    	$scope.dayMaxRetraceDataset = [];
	                                        		var con = angular.copy(result);
	                                                for(var i = 0; i<con.length;i++){
	                                                	
	                                                    var tempArr = [(i+1),con[i].startDate,con[i].endDate,con[i].startTime,con[i].endTime,con[i].cond,con[i].dictName];
	                                    	            $scope.dayMaxRetraceDataset.push(tempArr);
	                                                }
	                                                
	                                                $scope.dayMaxRetraceTable.clear().draw();
	                                                $scope.dayMaxRetraceTable.rows.add($scope.dayMaxRetraceDataset).draw();
                                            	}else{
                                        			$("#dayMaxRetrace_panel").hide();
                                            	}
                                                
                                                // 净值分档占比
                                                $scope.productRiskParamsQueryService.findNetValueRatiosByQuery(function(result){
                                                	if(result != null && result.length > 0){
                                            			$("#netValueRatios_panel").show();
	                                        	    	$scope.netValueRatiosDataset = [];
	                                            		var con = angular.copy(result);
	                                                    for(var i = 0; i<con.length;i++){
	                                                    	
	                                                        var tempArr = [(i+1),con[i].netValue,con[i].startDate,con[i].endDate,
	                                                                       con[i].startTime,con[i].endTime,con[i].dictName,con[i].isRecovery,
	                                                                       con[i].groupName,con[i].name,con[i].threshold];
	                                        	            $scope.netValueRatiosDataset.push(tempArr);
	                                                    }
	                                                    
	                                                    $scope.netValueRatiosTable.clear().draw();
	                                                    $scope.netValueRatiosTable.rows.add($scope.netValueRatiosDataset).draw();
                                                	}else{
                                            			$("#netValueRatios_panel").hide();
                                                	}
                                                    
                                                },{
                                                	brokerID: queryEntity.instClientID,
                                            		fundId: queryEntity.fundProductID
                                                });
                                                
                                            },{
                                            	brokerID: queryEntity.instClientID,
                                        		fundId: queryEntity.fundProductID
                                            });
                                            
                                        },{
                                        	brokerID: queryEntity.instClientID,
                                    		fundID: queryEntity.fundProductID
                                        });
                                        
                                    },{
                                    	brokerID: queryEntity.instClientID,
                                		fundId: queryEntity.fundProductID,
                                		tplID: '9'
                                    });
                                    
                                },{
                                	brokerID: queryEntity.instClientID,
                            		fundId: queryEntity.fundProductID,
                            		tplID: '8'
                                });
                                
                            },{
                            	brokerID: queryEntity.instClientID,
                        		fundId: queryEntity.fundProductID
                            });
                            
                        },{
                        	brokerID: queryEntity.instClientID,
                    		fundID: queryEntity.fundProductID
                        });
                        
                    },{
                    	brokerID: queryEntity.instClientID,
                		fundID: queryEntity.fundProductID
                    });
                    
                },{
                	brokerID: queryEntity.instClientID,
            		fundID: queryEntity.fundProductID
                });
                
            },{
            	brokerID: queryEntity.instClientID,
        		fundID: queryEntity.fundProductID
            });
            
            
            
            $timeout(function() {
                $scope.isQuery = false;
            }, 1000);
    	},{
    		brokerID: queryEntity.instClientID,
    		fundID: queryEntity.fundProductID
    	});
    	
    };
    $("body").undelegate("#riskIndexSet_dynamic_table_wrapper td .update-row","click");
    // 阈值明细事件绑定
    $("body").delegate("#riskIndexSet_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.riskIndexSetTable.row(mytr).data();
        var id = tempArr[1];
        $scope.showIndicatorThreshold(id);
    });
    
    // 资产组合风控明细点击事件
    $scope.showIndicatorThreshold = function(mid){
    	// 资产组合风控阈值明细
        $scope.productRiskParamsQueryService.findIndicatorThresholdByQuery(function(result){
	    	$scope.indicatorThresholdDataset = [];
    		var con = angular.copy(result);
            for(var i = 0; i<con.length;i++){
            	
                var tempArr = [(i+1),con[i].date,con[i].time,con[i].cond1,con[i].cond2,con[i].dictName];
	            $scope.indicatorThresholdDataset.push(tempArr);
            }
            
            $scope.indicatorThresholdTable.clear().draw();
            $scope.indicatorThresholdTable.rows.add($scope.indicatorThresholdDataset).draw();
            $timeout(function(){
            	$scope.indicatorThresholdTable.columns.adjust().draw();
            },300);
            
        },{
        	mId: mid
        });
    }
    
    // 交易所报单频率控制
    $scope.riskExchangeOrderControl_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "交易所"},
        {title: "启用限制"},
        {title: "每秒最大报单数"},
        {title: "撤单计入统计"}
    ];
    
    // 期货数量控制
    $scope.riskFutureVolumeControl_columns = [
       {title: "序号"},
       {title: "id",visible:false},
       {title: "交易所"},
       {title: "品种"},
       {title: "合约最大持仓量"},
       {title: "合约最大撤单次数"},
       {title: "品种最大开仓量"}
    ];
    
    // 同向反向控制
    $scope.riskDirectionControl_columns = [
	   {title: "序号"},
	   {title: "id",visible:false},
	   {title: "交易所"},
	   {title: "启用同向反向控制"}
	];
    
    // 证券交易品种限制
    $scope.stockTradingVarietiesRestrictionIndex_columns = [
       {title: "序号"},
       {title: "资产类型"},
       {title: "买"},
       {title: "卖"}
    ];
    
    // 期货交易品种限制
    $scope.futureVarietiesRestrictionIndex_columns = [
       {title: "序号"},
       {title: "资产类型"},
       {title: "买开"},
       {title: "买平"},
       {title: "卖开"},
       {title: "卖平"}
    ];
    
    // 资产组合风控主表
    $scope.riskIndexSet_columns = [
       {title: "序号"},
       {title: "id",visible: false},
       {title: "指标名称"},
       {title: "指标计算公式描述"},
       {title: "操作"}
    ];
    
    // 资产组合风控阈值明细
    $scope.indicatorThreshold_columns = [
       {title: "序号"},
       {title: "生效日期"},
       {title: "生效时间"},
       {title: "生效条件"},
       {title: "指标范围"},
       {title: "控制方式"}
    ];
    
    // 市场占比
    $scope.marketProportion_columns = [
       {title: "序号"},
       {title: "资产类型"},
       {title: "指标描述"}
    ];
    
    // 持仓占比
    $scope.positionProportion_columns = [
       {title: "序号"},
       {title: "资产类型"},
       {title: "指标描述"}
    ];
    
    // 单位净值止损
    $scope.unitNetValueStop_columns = [
       {title: "序号"},
       {title: "单位净值"},
       {title: "净值类型"},
       {title: "风控方式"}
    ];
    
    // 日内最大回撤止损
    $scope.dayMaxRetrace_columns = [
       {title: "序号"},
       {title: "开始日期"},
       {title: "结束日期"},
       {title: "开始时间"},
       {title: "结束时间"},
       {title: "回撤比例"},
       {title: "控制方式"}
    ];
    
    // 净值分档占比
    $scope.netValueRatios_columns = [
       {title: "序号"},
       {title: "单位净值"},
       {title: "开始日期"},
       {title: "结束日期"},
       {title: "开始时间"},
       {title: "结束时间"},
       {title: "风控方式"},
       {title: "自动恢复"},
       {title: "资产类别"},
       {title: "风险指标"},
       {title: "阈值"}
    ];
    
    //初始化
    $(document).ready(function() {
    	// 交易所报单频率控制
    	$scope.riskExchangeOrderControlTable = $('#riskExchangeOrderControl_dynamic_table').DataTable( {
    		data : $scope.riskExchangeOrderControlDataset,
        	columns :$scope.riskExchangeOrderControl_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 期货数量控制
    	$scope.riskFutureVolumeControlTable = $('#riskFutureVolumeControl_dynamic_table').DataTable( {
    		data : $scope.riskFutureVolumeControlDataset,
        	columns :$scope.riskFutureVolumeControl_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 同向反向控制
    	$scope.riskDirectionControlTable = $('#riskDirectionControl_dynamic_table').DataTable( {
    		data : $scope.riskDirectionControlDataset,
        	columns :$scope.riskDirectionControl_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 证券交易品种限制
    	$scope.stockTradingVarietiesRestrictionIndexTable = $('#stockTradingVarietiesRestrictionIndex_dynamic_table').DataTable( {
    		data : $scope.stockTradingVarietiesRestrictionIndexDataset,
        	columns :$scope.stockTradingVarietiesRestrictionIndex_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 期货交易品种限制
    	$scope.futureVarietiesRestrictionIndexTable = $('#futureVarietiesRestrictionIndex_dynamic_table').DataTable( {
    		data : $scope.futureVarietiesRestrictionIndexDataset,
        	columns :$scope.futureVarietiesRestrictionIndex_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 资产组合风控主表
    	$scope.riskIndexSetTable = $('#riskIndexSet_dynamic_table').DataTable( {
    		data : $scope.riskIndexSetDataset,
        	columns :$scope.riskIndexSet_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 资产组合风控阈值明细
    	$scope.indicatorThresholdTable = $('#indicatorThreshold_dynamic_table').DataTable( {
    		data : $scope.indicatorThresholdDataset,
        	columns :$scope.indicatorThreshold_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 市场占比
    	$scope.marketProportionTable = $('#marketProportion_dynamic_table').DataTable( {
    		data : $scope.marketProportionDataset,
        	columns :$scope.marketProportion_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 持仓占比
    	$scope.positionProportionTable = $('#positionProportion_dynamic_table').DataTable( {
    		data : $scope.positionProportionDataset,
        	columns :$scope.positionProportion_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 单位净值止损
    	$scope.unitNetValueStopTable = $('#unitNetValueStop_dynamic_table').DataTable( {
    		data : $scope.unitNetValueStopDataset,
        	columns :$scope.unitNetValueStop_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 日内最大回撤止损
    	$scope.dayMaxRetraceTable = $('#dayMaxRetrace_dynamic_table').DataTable( {
    		data : $scope.dayMaxRetraceDataset,
        	columns :$scope.dayMaxRetrace_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	// 净值分档占比
    	$scope.netValueRatiosTable = $('#netValueRatios_dynamic_table').DataTable( {
    		data : $scope.netValueRatiosDataset,
        	columns :$scope.netValueRatios_columns,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
			]
        } );
    	
    	$("#riskExchangeOrderControl_panel").hide();
    	$("#riskFutureVolumeControl_panel").hide();
    	$("#riskDirectionControl_panel").hide();
    	$("#stockTradingVarietiesRestrictionIndex_panel").hide();
    	$("#futureVarietiesRestrictionIndex_panel").hide();
    	$("#riskIndexSet_panel").hide();
    	$("#marketProportion_panel").hide();
    	$("#positionProportion_panel").hide();
    	$("#unitNetValueStop_panel").hide();
    	$("#dayMaxRetrace_panel").hide();
    	$("#netValueRatios_panel").hide();
    	
    });
});

