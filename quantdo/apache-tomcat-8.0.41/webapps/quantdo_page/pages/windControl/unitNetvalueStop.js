/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('unitNetvalueStopController',function($scope,$rootScope) {
	
	$scope.unitNetvalueStopService = new com.quantdo.orgClear.service.UnitNetvalueStopService();

	//设置按钮的名称
	var constant_temp = new com.quantdo.orgClear.constant.ClearConstants();
	$scope.unitNetvalueStop_buttonName_detail_save = constant_temp.buttonName.setPara;
	$scope.unitNetvalueStop_buttonName_detail_update = constant_temp.buttonName.resetPara;
	$scope.unitNetvalueStop_buttonName_save = constant_temp.buttonName.saveData;
	$scope.unitNetvalueStop_buttonName_update = constant_temp.buttonName.updateData;
	$scope.unitNetValueStopShow = false;
    //存储表格ID
    $scope.unitNetvalueStopEntity={};
    $scope.entity = {};
    $scope.dataset = [];//存储表格中的数据  
    $scope.entity.id="";
    $scope.buttonEdit = true;
    $scope.unitNetValueStopActionCode = false;
    
    $("body").delegate("#unitNetvalueStop_valueType", "change", function (){
    	if(document.getElementById("unitNetvalueStop_valueType").value=="2"){
    		//if($scope.warnFlag){
    		if(document.getElementById("unitNetvalueStop_warnFlag").value!="0"){
    			layer.alert("预警线已存在，不能重复添加");
    			document.getElementById("unitNetvalueStop_valueType").value="1";
    		}else{
    			document.getElementById("unitNetvalueStop_actionCode").value="3";
    		}
    	}
    	if(document.getElementById("unitNetvalueStop_valueType").value=="3"){
    		//if($scope.stopLossFlag){
    		if(document.getElementById("unitNetvalueStop_stopLossFlag").value!="0"){
    			layer.alert("止损线已存在，不能重复添加");
    			document.getElementById("unitNetvalueStop_valueType").value="1";
    		}else{
    			document.getElementById("unitNetvalueStop_actionCode").value="1";
    		}
    	}
    })
    
    //初始化数据
    $scope.unitNetAddButtonIsShow = false;
    $scope.originData = function(isControl){   
    	debugger;
    	document.getElementById("unitNetvalueStop_warnFlag").value="0";
    	document.getElementById("unitNetvalueStop_stopLossFlag").value="0";
    	/*$scope.warnFlag = false;
	    $scope.stopLossFlag = false;*/
    	var fundID = sessionStorage.listFundID;
    	$scope.unitNetvalueStopService.findConditionByBrokerIDAndFundID(function(result){
    		$scope.dataset = [];
    		var con = result;
            for(var i=0;i<con.length;i++){
            	debugger;
            	if(con[i].valueType == "2"){
            		//$scope.warnFlag = true;
            		document.getElementById("unitNetvalueStop_warnFlag").value=con[i].unitNetvalue;
            	}
            	if(con[i].valueType == "3"){
            		//$scope.stopLossFlag = true;
            		document.getElementById("unitNetvalueStop_stopLossFlag").value=con[i].unitNetvalue;
            	}
                var tempArr = [i+1,con[i].unitNetvalue,con[i].id,$scope.changeValueType(con[i].valueType),$rootScope.changeState(con[i].actionCode),$scope.tagTypeChange(con[i].tagType),
                               "<a style='cursor:pointer;' name='UnitNetvalueStopService.saveUnitNetvalueStop' class='backFilter upCombine'>[修改]</a>"+
                               "<a style='cursor:pointer;' name='UnitNetvalueStopService.deleteUnitNetvalueStop' class='backFilter delCombine'>[删除]</a>"];
                $scope.dataset.push(tempArr); 
            }
            $scope.getTable();
            if(isControl){
               var myfilter = document.getElementsByClassName("backFilter");
       		   hideAfterFilter($rootScope.filterEntity,myfilter);
       		   $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
            }
            $scope.unitNetAddButtonIsShow = true;
  	    	$scope.$apply();
    	},fundID,sessionStorage.listBrokerID);
    };
    
    $scope.originData(true);
    
    $('#unitNetvalueStop_table').on( 'page.dt', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       }); 
       
       $("body").delegate('#unitNetvalueStop_table_length div').on('change', 'select[name="unitNetvalueStop_table_length"]', function () {
       	setTimeout(function(){
       		var myfilter = document.getElementsByClassName("backFilter");
           	hideAfterFilter($rootScope.filterEntity,myfilter);
       	})
       });
    
    //表格重绘
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
    
    //记录单位净值止损设置
    $scope.columns_array = [
            { title: "序号"},
            { title: "单位净值"},
            { title: "id",visible:false},
            {title:"净值类型"},
            { title: "风控方式"},
            { title: "触发方式",visible:false},
            { title: "操作"}
    ];
    
    //初始化数据表
    $scope.initDataTables = function(id,columns,data) {
        return $("#" + id).DataTable({
            data: data,
            columns: columns,
            scrollX: true,
            dom : 'rt<"bottom"ipl>',
            language: {
            	emptyTable: "没有符合条件的记录",
                info: " _START_ 到 _END_  共 _TOTAL_ 条",
                infoEmpty: " 0 到 0  共 0 条",
                lengthMenu: "显示 _MENU_ 条",
                paginate: {
                    first: "首页",
                    last: "末页",
                    next: "下一页",
                    previous: "上一页"
                }
            }
        });
    }; 
    
    //转换状态
    $rootScope.changeState = function(id){
        var name = "";
        if("1"==id){
            name = "控制权限";
        }
        if("2" == id){
            name = "清仓";
        }
        if("3" == id){
            name = "预警";
        }
        return name;
    }
    //转换状态
    $rootScope.opChangeState = function(name){
        var id = "";
        if("控制权限"==name){
            id = "1";
        }
        if("清仓" == name){
        	id = "2";
        }
        if("预警" == name){
        	id = "3";
        }
        return id;
    }
    $scope.changeValueType = function(valueType){
    	var name = "";
    	if("2"==valueType){
    		name = "预警线";
    	}
    	if("3"==valueType){
    		name = "止损线";
    	}
    	return name;
    }
    $scope.changeValueType2 = function(valueType){
    	var id = "1";
    	if("预警线"==valueType){
    		id = "2";
    	}
    	if("止损线"==valueType){
    		id = "3";
    	}
    	return id;
    }
    $scope.tagTypeChange2 = function(tagType){
    	var id = "";
    	if("等于阈值时触发风控"==tagType){
    		id = "<=";
    	}
    	if("超过阈值时触发风控"==tagType){
    		id = "<";
    	}
    	return id;
    }
    $scope.tagTypeChange = function(tagType){
    	var name = "";
    	if("<="==tagType){
    		name = "等于阈值时触发风控";
    	}
    	if("<"==tagType){
    		name = "超过阈值时触发风控";
    	}
    	return name;
    }
    //点击新增
    $scope.showDetail = function(){
    	$scope.unitNetValueStopShow = true;
    	$scope.addUnitNetvalueStop();
    	$scope.unitNetValueStopActionCode = false;
    	
    }
    //点击取消修改
    $scope.giveUpUpdate = function(){
    	$scope.addUnitNetvalueStop();
    	$scope.unitNetValueStopShow = false;
    }
    //初始化资金账户总持仓表格
    $scope.getTable = function() {
        var table = $scope.initDataTables("unitNetvalueStop_table",$scope.columns_array, $scope.dataset);
        document.getElementById("unitNetvalueStop_actionCode").value="1";
    };
    
    //删除按钮
    $("body").delegate("#unitNetvalueStop_table td .delCombine", "click", function (){
    	 var fundID = sessionStorage.listFundID;
    	 var table = $("#unitNetvalueStop_table").DataTable();
    	 var mytr = $(this).parents('tr');
         var id = table.row(mytr).data()[2];
         layer.confirm("确定删除该条信息？", {icon: 3}, function (count) {
        	layer.load(2, {
   	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
   	 	   	});
	        //初始化数据
	        $scope.unitNetvalueStopService.deleteUnitNetvalueStop(function(result){   	
	        	if(result==true){
	                destroyDatatable("unitNetvalueStop_table");
	                $scope.originData(false);
	                $scope.addUnitNetvalueStop();
	                $scope.unitNetValueStopShow = false;
	                $scope.$apply();
	                layer.alert("删除成功");
	        	}else{
	        		layer.alert("删除失败");
	        	}
	        	layer.closeAll('loading');
	        },id,fundID,sessionStorage.listBrokerID,"true");
        });
    });
    
    //修改按钮
    $("body").delegate("#unitNetvalueStop_table td .upCombine", "click", function (){
    	$scope.unitNetValueStopShow = true;
  	    $scope.buttonEdit = false;
  	    $scope.unitNetValueStopActionCode = true;
 	      //为选中的行设置选中色
        if($(this).closest('tr').hasClass("selected")){
            $(this).closest('tr').removeClass("selected");
        }
        else{
            $("tr.selected").removeClass("selected");
            $(this).closest('tr').addClass("selected");
        }
        var table = $("#unitNetvalueStop_table").DataTable();
        var tr = $(this).closest('tr');
        var tempArr = table.row(tr).data();
        $scope.entity.id = tempArr[2];
        $scope.entity.unitNetvalue = tempArr[1];
        $scope.entity.valueType = $scope.changeValueType2(tempArr[3]);
        $scope.entity.actionCode = $rootScope.opChangeState(tempArr[4]);
        $scope.entity.tagType = $scope.tagTypeChange2(tempArr[5]);
        document.getElementById('unitNetvalueStop_unitNetvalue').value = tempArr[1];
        var valueType = $scope.changeValueType2(tempArr[3]);
        var actionCode = $rootScope.opChangeState(tempArr[4]);
        var tagType = $scope.tagTypeChange2(tempArr[5]);
        for(var i=0;i<document.getElementById('unitNetvalueStop_valueType').length;i++){
      	  if(document.getElementById('unitNetvalueStop_valueType')[i].value==valueType){
          	  document.getElementById('unitNetvalueStop_valueType')[i].selected = true;
            }
        }
        for(var i=0;i<document.getElementById('unitNetvalueStop_actionCode').length;i++){
      	  if(document.getElementById('unitNetvalueStop_actionCode')[i].value==actionCode){
          	  document.getElementById('unitNetvalueStop_actionCode')[i].selected = true;
            }
        }
        for(var i=0;i<document.getElementById('unitNetvalueStop_tagType').length;i++){
        	  if(document.getElementById('unitNetvalueStop_tagType')[i].value==tagType){
            	  document.getElementById('unitNetvalueStop_tagType')[i].selected = true;
              }
          }
        $scope.$apply();
    });
    
	//保存
	$scope.saveUnitNetvalueStop = function(entity){
		$scope.unitEntity={};
		$scope.unitEntity.unitNetvalue=document.getElementById("unitNetvalueStop_unitNetvalue").value;
		$scope.unitEntity.actionCode = $("#unitNetvalueStop_actionCode").val();
		$scope.unitEntity.id = $scope.entity.id;
		$scope.unitEntity.fundID = sessionStorage.listFundID;
		$scope.unitEntity.valueType = $("#unitNetvalueStop_valueType").val();
		$scope.unitEntity.tagType = $("#unitNetvalueStop_tagType").val();	
			
		var unitNetvalue = document.getElementById("unitNetvalueStop_unitNetvalue").value;
		var actionCode = $("#unitNetvalueStop_actionCode").val();
		var id = $scope.entity.id;
		var fundID = sessionStorage.listFundID;
		var valueType = document.getElementById("unitNetvalueStop_valueType").value;
		var tagType = document.getElementById("unitNetvalueStop_tagType").value;
		
		//单位净值必须在0到100之间
		if(unitNetvalue>0){
			var point2 = unitNetvalue.length-1;
    		var point1 = unitNetvalue.indexOf(".");
    		if(point1>=0){
    			var str = unitNetvalue.substring(point1,point2);
    			if(str.length>4){
    				layer.alert("单位净值的小数位不能超过四位"); 
                	return false;
    			}
    		}
    		if(unitNetvalue>100){
    			layer.alert("单位净值的取值范围是：0.0001~100.0000"); 
            	return false;
    		}
    		
    		/**止损线<预警线*/
    		debugger;
    		var warnLevelTmp = document.getElementById("unitNetvalueStop_warnFlag").value;
    		var stopLossLevelTmp = document.getElementById("unitNetvalueStop_stopLossFlag").value;
    		//如果新加数据是预警线
    		if(valueType == "2"){
    			if(stopLossLevelTmp != "0"){
    				if(stopLossLevelTmp-unitNetvalue>=0){
    					layer.alert("预警线应大于止损线"); 
    	            	return false;
    				}
    			}
    		}
    		//如果新加数据是止损线
    		if(valueType == "3"){
    			if(warnLevelTmp != "0"){
    				if(warnLevelTmp-unitNetvalue<=0){
    					layer.alert("止损线应小于预警线"); 
    	            	return false;
    				}
    			}
    		}
    		
			$scope.unitNetvalueStopService.findConditionByBrokerIDAndFundID(function(result){
				var flag = false;
				var con = result;
				for(var i=0;i<con.length;i++){
					lValue = parseFloat(unitNetvalue);
					sValue = parseFloat(con[i].unitNetvalue);
					if(id=="" ||id==undefined || id == null){
						if(lValue==sValue){
							flag = true;
						}
					}else{
						if(lValue==sValue && con[i].id != id){
							flag = true;
						}
					}
				}
				if(flag){
					layer.alert("单位净值不可重复,请重新填写");
					document.getElementById("unitNetvalueStop_unitNetvalue").value="";
					return false;
				}
				if(id=="" ||id==undefined || id == null){
					layer.load(2, {
		     	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
		     	 	   	});
					$scope.unitNetvalueStopService.saveUnitNetvalueStop(function(result){
						if(result==true){
							destroyDatatable("unitNetvalueStop_table");
							$scope.originData(false);
							$scope.addUnitNetvalueStop();
							$scope.unitNetValueStopShow = false;
							$scope.$apply();
							layer.alert("新增成功");
						}else{
							layer.alert("新增失败");
						}
						layer.closeAll('loading');
						return false;
					},unitNetvalue,actionCode,fundID,sessionStorage.listBrokerID,valueType,tagType,"true");
				}else{
				//判断修改时是否有数据变动(什么都没动)
				//if(!flag&&!(unitNetvalue==$scope.entity.unitNetvalue && actionCode==$scope.entity.actionCode)||flag&&!(actionCode==$scope.entity.actionCode)){
					layer.load(2, {
		     	 		   shade: [0.5,'#fff'] //0.1透明度的白色背景
		     	 	   	});
					$scope.unitNetvalueStopService.updateUnitNetvalueStop(function(result){
						if(result==true){
							destroyDatatable("unitNetvalueStop_table");
							$scope.originData(false);
							$scope.addUnitNetvalueStop();
							$scope.unitNetValueStopShow = false;
							$scope.$apply();
							layer.alert("修改成功");
						}else{
							layer.alert("修改失败");
						}
						layer.closeAll('loading');
						return false;
					},$scope.unitEntity,sessionStorage.listBrokerID);
				}
			},fundID,sessionStorage.listBrokerID);
		}else{
			if(unitNetvalue==""){
				layer.alert("单位净值不可为空,请重新填写");
				document.getElementById("unitNetvalueStop_unitNetvalue").value="";
				document.getElementById("unitNetvalueStop_actionCode").value="1";
				$scope.$apply();
			}else{
				layer.alert("单位净值的取值范围是：0.0001~100.0000"); 
				return false;
			}
		}
	};
	
	//初始化输入框
	$scope.addUnitNetvalueStop = function(){
		document.getElementById("unitNetvalueStop_unitNetvalue").value="";
		document.getElementById("unitNetvalueStop_actionCode").value="1";
		document.getElementById("unitNetvalueStop_valueType").value="1";
		document.getElementById("unitNetvalueStop_tagType").value="<=";
		$scope.buttonEdit = true;
		$scope.unitNetValueStopActionCode = false;
		$scope.entity = {};
	}
})