myapp.controller('mortgageController', function ($scope, $timeout, $rootScope) {
	$("[forType='date']").datepicker({
	    language:  'zh-CN',
	    weekStart: 1,	
	    autoclose: true,
	    clearBtn: true,	    
	    todayHighlight: true,
	    format: 'yyyymmdd'
	});	
	//1、实例化服务接口
	//1.1、 实例化客户实时持仓服务接口
	//1.2、公用查询服务接口
	$scope.instClientService = new com.quantdo.orgClear.service.instClientService();
	$scope.mortgageService = new com.quantdo.orgClear.service.MortgageService();
	
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.tabFlag = "mortgage";
	$scope.isStart = false;
    $scope.isStop = true;
    $scope.status = "轮询停止";
    $scope.targetModal = "#mortgageModal";
    $scope.queryEntity = {};
    
    
    $scope.mortgage_deal = isShow("mortgage_deal");
    $scope.mortgage_stop = isShow("mortgage_stop");
    $scope.mortgage_add = isShow("mortgage_add");
    $scope.mortgage_update = isShow("mortgage_update");
    $scope.mortgage_delete = isShow("mortgage_delete");
    
	//2、定义页面数据模型
    $scope.queryEntity = {
    		instclientID: '',
    		mortgageID: '',
    		contractID: '',
    		mortgageType: ''
    };
    
    $scope.queryEntity.beginDate = clearConstant.formatDate(new Date());
    $scope.queryEntity.endDate = clearConstant.formatDate(new Date());
    
    $scope.mortgageTypes = clearConstant.mortgageTypes;	//抵押品类别
    $scope.mortgageStatus = clearConstant.mortgageStatus;	//抵押品合同状态
    
    $scope.listEntitys = [];
    $scope.listEntity = {};
    $scope.tmpEntity = {};
    $scope.ModalEntity = {};
    $scope.instruments = [];
    
    //初始化机构信息
    $scope.instClientList = [];
    getInstClientQueryConditionList(function(result){
    	$scope.instClientList = angular.copy(result);
    	if($scope.instClientList.length > 1){
    		$scope.queryEntity.instClientID = "";
    	}else{
    		$scope.queryEntity.instClientID = $scope.instClientList[0].instClientID;
    	}
    	
    	queryInstClientID(function(inst){
        	if(inst != undefined){
        		$scope.noInst = true;
        	}else{
        		$scope.noInst = false;
        	}
        	$scope.$apply();
        });
    });
    
    // 获取抵押品信息
    $scope.mortgageService.findDistinctMortgageID(function(result){
    	$scope.queryMortgages = result;
    	$scope.$apply();
    });
    
    $scope.transMortgageType = function (key){
    	for(var i = 0;i < $scope.mortgageTypes.length;i++){
			if($scope.mortgageTypes[i].key == key){
				return $scope.mortgageTypes[i].text;
			}
		}
    }
    
    $scope.transMortgageStatus = function (key){
    	for(var i = 0;i < $scope.mortgageStatus.length;i++){
			if($scope.mortgageStatus[i].key == key){
				return $scope.mortgageStatus[i].text;
			}
		}
    }
    
    // 查询
    $scope.tmpQuery = {};
    $scope.find = function (queryEntity)  {
    	$scope.listEntitys = [];
    	$scope.status = "轮询中.....";
        $scope.isStart = true;
        $scope.isStop = false;
    	$scope.tmpQuery = angular.copy(queryEntity);
    	$scope.targetModal = "";
    	
        if(queryEntity.beginDate > queryEntity.endDate){
    		layer.msg('开始日期不能大于结束日期！！', {
				icon : 2
			});
			return false;
    	}
        
        clearInterval($scope.timer);
        $scope.listEntitys = {};
        $scope.mortgageService.findByQuery(function(result){
        	$scope.listEntitys = result;
        	$scope.refleshTable(result);
        	$scope.$apply();
        },$scope.tmpQuery,$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
        
        $scope.timer = setInterval(function(){
        	$scope.mortgageService.findByQuery(function(result){
        		$scope.refleshTable(result);
            	$scope.$apply();
            },$scope.tmpQuery,$scope.tmpQuery.beginDate,$scope.tmpQuery.endDate);
        },5000);
        
    };
    $scope.find($scope.queryEntity);
    
    $scope.stop = function (){
    	clearInterval($scope.timer);
    	$scope.isStart = false;
    	$scope.isStop = true;
    	$scope.status = "轮询停止";
    	$scope.targetModal = "#mortgageModal";
    }
    
    function formValidateReset(){
    	$scope.myForm.$setPristine();
    }
    
    // 根据抵押品类型加载抵押品下拉框
    $scope.loadMortgageByType = function(mortgageType){
    	findInstrumentEntity(function(result){
    		$scope.instruments = result;
    		if(!$scope.isUpdate){
    			if($scope.instruments.length > 0){
        			$scope.ModalEntity.mortgageID = $scope.instruments[0].instrumentID;
        		}else{
        			$scope.ModalEntity.mortgageID = "";
        		}
        		$scope.$apply();
    		}else{
    			
    		}
    	},{
    		productType: mortgageType
    	});
    }
    
    // 新增初始化
    $scope.initParameter = function () {
    	$scope.isUpdate = false;
    	$scope.isInit = true;
    	$scope.notClick=false;
    	formValidateReset();
        $scope.ModalEntity = {};
        $scope.ModalEntity.instClientID = $scope.instClientList[0].instClientID;
        $scope.ModalEntity.mortgageType = $scope.mortgageTypes[0].key;
        $scope.ModalEntity.mortgageStatus = $scope.mortgageStatus[0].key;
        $scope.mortgageService.getCurrentTradingDate(function(result){
        	if(result != null){
        		$scope.ModalEntity.tradeDate = result;
        		$scope.loadMortgageByType($scope.ModalEntity.mortgageType);
        	}else{
        		layer.msg("获取当前交易日失败",{icon: 2});
        		return false;
        	}
        });
    };

    //修改初始化
    $scope.initUpdateParam = function (index, entity) {
    	if($scope.isStart){
    		layer.msg("轮询状态不允许修改",{icon: 2,time: 1500});
    		return false;
    	}else{
    		$scope.isUpdate = true;
        	$scope.isInit = false;
        	$scope.notClick=false;
        	$("#mortgageModal").modal("show");
            $scope.tempEntity = angular.copy(entity);
            
            $scope.tempEntity.recordIndex = index;
            $scope.ModalEntity = angular.copy($scope.tempEntity);
            findInstrumentEntity(function(result){
        		$scope.instruments = result;
        		if(!$scope.isUpdate){
        			if($scope.instruments.length > 0){
            			$scope.ModalEntity.mortgageID = $scope.instruments[0].instrumentID;
            		}else{
            			$scope.ModalEntity.mortgageID = "";
            		}
        		}else{
        			for(var i=0;i<result.length;i++){
        				if(result[i].mortgageID == entity.mortgageID){
        					$scope.ModalEntity.mortgageID = result[i].mortgageID;
        				}
        			}
        		}
                formValidateReset();
                $scope.$apply();
        	},{
        		productType: entity.mortgageType
        	});
    	}
    };
    
    // 保存
    $scope.save = function (entity) {
    	$scope.notClick = true;
        var index = entity.id;
        var tableIndex = entity.index;
        
        $scope.tmpSaveEntity = {};
        $scope.tmpSaveEntity = angular.copy(entity);
        
        if(parseFloat(entity.preWarnLine) < parseFloat(entity.stopLossLine)){
        	layer.msg("预警线不能低于止损线", {icon: 2});
        	$scope.notClick=false;
        	return false;
        }
        
        //增加
        if (index == undefined) {
        	$scope.mortgageService.findByAddInfo(function (result){
        		if(result.length > 0){
        			$scope.notClick=false;
        			layer.msg("新增失败，不可重复", {
						icon : 2,
						time : 2000
					});
        		}else{
        			$scope.mortgageService.add(function (addResult){
        				if(addResult != null){
        					//关闭窗口
            				layer.msg("新增成功", {
        						icon : 1,
        						time : 1500
        					});
            		        $("#mortgageModal").modal("hide");
            		        $scope.notClick = false;

            		        $scope.mortgageService.findByQuery(function(result){
            		        	$scope.listEntitys = angular.copy(result);
            		        	$scope.refleshTable(result);
            		        	 $scope.mortgageService.findDistinctMortgageID(function(result){
         		                	$scope.queryMortgages = result;
         		                	$scope.queryEntity.mortgageID = ""
         		                	$scope.$apply();
         		                });
            		        },{},'','');
            		        
        				}else{
        					layer.msg("新增失败",{icon: 2});
        					$scope.notClick=false;
        				}
        			},$scope.tmpSaveEntity);
            	}
        	},$scope.tmpSaveEntity);
            //修改
        } else {
        	$scope.mortgageService.update(function (addResult){
        		if(addResult != null){
        			/*addResult.index = tableIndex;
            		$scope.listEntitys.splice(tableIndex-1, 1, addResult);  
            		      		
            		$scope.mortgageTable.cells().every( function () {
    	                    if((tableIndex-1) == this[0][0].row){
    	                        if(this[0][0].column == 7){
    	                            this.data(entity.mortgageAmount);
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 8){
    	                            this.data(entity.mortgageValue);
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 9){
    	                            this.data(entity.lastPrice);
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 10){
    	                            this.data(entity.lastMarketValue);
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 11){
    	                            this.data(entity.warnMsg);
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 12){
    	                            this.data($scope.transMortgageStatus(entity.mortgageStatus));
    	                            $scope.$apply();
    	                        }
    	                        if(this[0][0].column == 16){
    	                            this.data(entity.remarks);
    	                            $scope.$apply();
    	                        }
    	                    }

    	            });*/
        			$scope.find($scope.queryEntity);
    	        	$scope.stop();
        			//关闭窗口
            		layer.msg("修改成功", {
    					icon : 1,
    					time : 1500
    				});
    		        $("#mortgageModal").modal("hide");
    		        $scope.notClick = false;
    		        /*$scope.mortgageService.findByQuery(function(result){
    		        	$scope.listEntitys = angular.copy(result);
    		        	$scope.refleshTable(result);
    		        	 $scope.mortgageService.findDistinctMortgageID(function(result){
 		                	$scope.queryMortgages = result;
 		                	$scope.queryEntity.mortgageID = ""
 		                	$scope.$apply();
 		                });
    		        },{},'','');*/
        		}else{
					layer.msg("修改失败",{icon: 2});
					$scope.notClick=false;
				}
			},$scope.tmpSaveEntity);
        }
    };
    
    //删除
    $scope.remove = function (entity, index) {
    	if($scope.isStart){
    		layer.msg("轮询状态不允许删除",{icon: 2, time: 1500});
    		return false;
    	}else{
    		//使用内置Index
        	layer.confirm('确定删除该条记录？', {icon: 3}, function (count) {
        		$scope.mortgageService.remove(function (){
        			layer.msg("删除成功",{icon: 1});
        			$scope.listEntitys.splice(index, 1);
        			$timeout(function() {
        	        	$scope.find($scope.queryEntity);
        	        	$scope.stop();
        	        }, 500);
        			$scope.$apply();
        		}, entity.id);
                layer.close(count);
            });
    	}
    };
    
  //定义固定列头
    $scope.mortgage_columns = [
        {title: "序号"},
        {title: "id",visible:false},
		{title: "交易日期"},
		{title: "所属机构"},
		{title: "抵押合同编号"},
		{title: "抵押品类型"},
		{title: "抵押品"},
		{title: "抵押数量"},
		{title: "抵押金额"},
		{title: "最新价"},
		{title: "最新市值"},
		{title: "当前资金占比预警信息"},
		{title: "抵押合同状态"},
		{title: "操作人"},
		{title: "操作日期"},
		{title: "操作时间"},
		{title: "备注"},
		{title: "操作"},
		{title: "当前资金占比预警信息颜色控制",visible:false}
	]
    
    $scope.mortgageDataset = [];
    
    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.mortgageTable = $('#mortgage_dynamic_table').DataTable( {
	    		data : $scope.mortgageDataset,
	        	columns :$scope.mortgage_columns,
	            dom: 'rt<"bottom"iplB>',
	            fixedColumns:   {
	                leftColumns: 0,
	                rightColumns: 2
	            },
				buttons: [],
				"createdRow": function ( row, data, index ) {
		            if ( data[18] == 1 ) {
		                $('td', row).eq(10).addClass('tdRedBgColor');
		            }else if( data[18] == 2 )
		            {
		            	$('td', row).eq(10).addClass('tdYellowBgColor');
		            }
		        }
        } );
    });
    $("body").undelegate("#mortgage_dynamic_table_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#mortgage_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.mortgageTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.initUpdateParam(id,$scope.modalEntity);
    })  ;
    
    $("body").undelegate("#mortgage_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#mortgage_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.mortgageTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove($scope.modalEntity,id);
    });
    
    // 保存
    $scope.refleshTable = function (entity) {
    	var con = entity;
    	$scope.mortgageDataset = [];
		for(var i = 0; i<con.length;i++){
			var operator1 = $scope.getUpdate($scope.mortgage_update);
			var operator2 = $scope.getDelete($scope.mortgage_delete);
	    	var tempArr = [(i+1),con[i].id,con[i].tradeDate,con[i].instClientID,con[i].contractID,$scope.transMortgageType(con[i].mortgageType),con[i].mortgageID
	    	               ,con[i].mortgageAmount,con[i].mortgageValue,con[i].lastPrice,con[i].lastMarketValue,con[i].warnMsg
	    	               ,$scope.transMortgageStatus(con[i].mortgageStatus),con[i].operatorID,con[i].operateDate,con[i].operateTime,con[i].remarks
	    	               ,operator1+operator2,con[i].warnLevel]
	    	$scope.mortgageDataset.push(tempArr);
	    	con[i].index = i+1;
		}
		$scope.listEntitys = con;
		//重新绘表
        $scope.mortgageTable.clear().draw();
        $scope.mortgageTable.rows.add($scope.mortgageDataset).draw();
    }
    
	$scope.getUpdate = function(flag){
		var result = "";
		if(flag){
			result = "<a class='update-row' data-toggle='modal'>修改</a>"; 
		}
		return result;
	}

	$scope.getDelete = function(flag){
		var result = "";
		if(flag){
			result = "<a class='delete-row'>删除</a>";
		}
		return result;
	}	
    
});

