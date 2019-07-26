myapp.controller('TmpMoneyIOController', function ($scope, $timeout,$rootScope) {
	$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
	//1、实例化服务接口
	//1.1、 实例化出入金服务接口
	$scope.service = new com.quantdo.orgClear.service.TmpMoneyIOService();
	//1.2、 实例化内部资金服务接口
	$scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
	
    $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    //调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	
	//初始化查询选项
    $scope.isRecheckDatas = [
        {text: '未复核', key: '0'},
        {text: '复核', key: '1'}
    ];
	//2、定义页面数据模型
    $scope.queryEntity = {"isRecheck":""};
    $scope.tempEntity={};
    $scope.modalEntity = {};
    //2.1、是否
    $scope.isNotDatas = clearConstant.isNotDatas;
    //2.2、 银行代码
    $scope.bankIDDatas = clearConstant.bankIDDatas;
    //2.3、 资源类型
    $scope.moneyTypeDatas = clearConstant.moneyTypeDatas;
    
    $scope.tmpMoneyIO_query = isShow("tmpMoneyIO_query");
    $scope.tmpMoneyIO_in_add = isShow("tmpMoneyIO_in_add");
    $scope.tmpMoneyIO_out_add = isShow("tmpMoneyIO_out_add");
    $scope.tmpMoneyIO_update = isShow("tmpMoneyIO_update");
    $scope.tmpMoneyIO_delete = isShow("tmpMoneyIO_delete");

    
    $scope.TmpMoneyIODataset = [];  
      //定义固定列头
      $scope.TmpMoneyIO_column = [
             {title:"序号"},
             {title: "id",visible:false},
             {title: "结算日期"},
             {title: "资金账号"},
             {title: "银行代码"},
             {title: "银行账号"},
             {title: "出金"},
             {title: "入金"},
             {title: "出入金类型"},
             {title: "备注"},
             {title: "出入金状态"},
             {title: "操作员"},
             {title: "操作日期"},
             {title: "操作时间"},
   	  	     {title: "操作"}
       ]
    
    getAllBackAccountEntity(function (result) {
        $scope.bankAccounts = result;
    });

    //3、定义方法
    //3.1、查询出入金
/*    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};      
        $scope.isQuery = true;
        $scope.service.findByCondition(queryEntity,function (result) {
            $scope.listEntitys = result;
            $timeout(function() {
            	$scope.isQuery = false;
            	$scope.$apply();
              }, 1500);
        });
    }; */
    
  //表格修改事件
      $("body").undelegate("#TmpMoneyIO_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#TmpMoneyIO_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.TmpMoneyIOTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam($scope.modalEntity,id);
        }, 500);
    })
     $("body").undelegate("#TmpMoneyIO_dynamic_table_wrapper td .delete-row","click");
    $("body").delegate("#TmpMoneyIO_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.TmpMoneyIOTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $scope.remove($scope.modalEntity,id);
    })
    
    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.TmpMoneyIODataset = [];
		$scope.listEntitys = [];
		$scope.service.findByCondition($scope.queryEntity,function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator1 = $scope.getUpdate($scope.tmpMoneyIO_update);
				var operator2 = $scope.getDelete($scope.tmpMoneyIO_delete);
		    	var tempArr = [(i+1),con[i].id,con[i].settleDate,con[i].innerAccountID,con[i].bankID,con[i].bankAccount,con[i].moneyOut,con[i].moneyIn,$scope.transMoneyType(con[i].moneyType)
		    	               ,con[i].remark,$scope.transIsRecheck(con[i].isRecheck),con[i].operatorID,con[i].operateDate,con[i].operateTime,operator1+operator2]
		    	$scope.TmpMoneyIODataset.push(tempArr);
		    	con[i].index = i+1; 
			}
			$scope.listEntitys = con;
			//重新绘表
		    $scope.TmpMoneyIOTable.clear().draw();
	        $scope.TmpMoneyIOTable.rows.add($scope.TmpMoneyIODataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		});
    };
    $timeout(function() {
    	  $scope.find();
    }, 1000);
    
	$scope.getUpdate = function(flag){
		var result = "";
		if(flag){
			result = "<a class='update-row' data-toggle='modal' data-target='#tmpMoneyIOModal'>修改</a>"; 
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
    
    
    //3.2、保存出入金
    $scope.save = function (entity) {    	
        var index = entity.recordIndex;
        var tableIndex = entity.index;
        if($scope.modalEntity.operType==1 && $scope.modalEntity.moneyIn<=0){
        	layer.msg("入金金额必须大于0.",{icon: 2});
        	return false;
        }else if($scope.modalEntity.operType==2 && $scope.modalEntity.moneyOut<=0){
        	layer.msg("出金金额必须大于0.",{icon: 2});
        	return false;
        }
        //增加
        if (index == undefined) {
        	$scope.service.add(entity,function (result) {
        		$scope.find();
        		$scope.$apply();        		
                layer.msg("出入金信息保存成功!",{icon: 1, time: 2000});
                
        	});          	    		
            //修改
        } else {
        	$scope.service.update(entity,function (result) {
        		result.index = tableIndex;
        		$scope.listEntitys.splice(tableIndex-1, 1, result);  
        		$scope.TmpMoneyIOTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                        if(this[0][0].column == 6){
                            this.data(entity.moneyOut);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 7){
                            this.data(entity.moneyIn);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 9){
                            this.data(entity.remark);
                            $scope.$apply();
                        }
                    }

        		});
        		//$scope.find();      		
        		layer.msg("出入金信息保存成功!",{icon: 1, time: 2000});
        	});  
            
        }
        //关闭窗口
        $("#tmpMoneyIOModal").modal("hide");
    };    
    //3.3、删除出入金
    $scope.remove = function (entity,index) {
        //使用内置Index
    	if(entity.isRecheck == 1)
    	{
    		layer.msg("出入金信息已复核，不能删除！", {icon: 2, time: 3000});
            return false;
    	}
    	layer.confirm('确定删除？', {icon: 3}, function (count) {
    		$scope.service.remove(entity.id,function (result) {
            	$scope.listEntitys.splice(index, 1);
            	$scope.find();
        		$scope.$apply();    		
                layer.msg("出入金信息记录删除成功!",{icon: 1, time: 2000});
        	});
    		layer.close(count);
    	});
    };    
    //3.4、初始化新增页面的参数
    $scope.initAddParam = function (operType) {
        $scope.modalEntity = {};
        $scope.modalEntity.operType = operType;
        if(operType==1){
        	$scope.modalEntity.moneyOut = 0;
        }else{
        	$scope.modalEntity.moneyIn = 0;
        }
        $scope.modalEntity.bankID = $scope.bankIDDatas[0].key;        
        $scope.modalEntity.moneyType = $scope.moneyTypeDatas[0].key;  
        
        if($scope.accountDatas.length >0 )
        {
        	$scope.modalEntity.innerAccountID = $scope.accountDatas[0].innerAccountID;
        }
        $scope.modalEntity.isTrade = $scope.isNotDatas[0].key;    
        if($scope.bankAccounts.length >0 )
        {
        	$scope.modalEntity.bankAccount = $scope.bankAccounts[0].bankAccountID;  
        }
        
        $scope.isUpdate = false;
        document.getElementById("settleDate").disabled = false;
        document.getElementById("innerAccountID").disabled = false;
        document.getElementById("bankID").disabled = false;
        document.getElementById("bankAccount").disabled = false;
        document.getElementById("moneyType").disabled = false;
        document.getElementById("moneyIn").disabled = false;
        document.getElementById("moneyOut").disabled = false;
        $scope.formValidateReset();
     };    
    //3.5、初始化个性页面的参数
     $scope.initUpdateParam = function (entity,index) {         
         $scope.tempEntity = angular.copy(entity);
         $scope.tempEntity.recordIndex = index;        
         $scope.modalEntity = angular.copy($scope.tempEntity);
         if($scope.modalEntity.moneyIn>0){
        	 $scope.modalEntity.operType = 1;
         }else{
        	 $scope.modalEntity.operType = 2;
         }
         $scope.isUpdate = true;
         document.getElementById("settleDate").disabled = true;
         document.getElementById("innerAccountID").disabled = true;
         document.getElementById("bankID").disabled = true;
         document.getElementById("bankAccount").disabled = true;
         document.getElementById("moneyType").disabled = true;
         if (entity.isRecheck == 1)
         {
        	 document.getElementById("moneyIn").disabled = true;
             document.getElementById("moneyOut").disabled = true;
        	 
         }
         
         $scope.formValidateReset();
     };
     //3.6、表单校验信息重置
     $scope.formValidateReset = function (){
    	$scope.myForm.settleDate.$setPristine();     	
     	$scope.myForm.moneyOut.$setPristine();
    	$scope.myForm.bankAccount.$setPristine();
     	$scope.myForm.moneyIn.$setPristine();     	
     }     
    
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find($scope.queryEntity);
    //4.2 日历控件
    $("[forType='date']").datepicker({
        language: 'zh-CN',
        weekStart: 1,
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        format: 'yyyymmdd'
    });
    //4.3 初始化内部账户下拉列表
    findActiveCapitalByBrokId(function (result) {
		 $scope.accountDatas = result;
		$scope.$apply();
    });
    
    //页面出入金类型转换
    $scope.transMoneyType = function (key) {
        var count = $scope.moneyTypeDatas.length;
        for (var i = 0; i < count; i++) {
            if ($scope.moneyTypeDatas[i].key == key) {
                return $scope.moneyTypeDatas[i].text;
            }
        }
    }
    //页面复核
    $scope.transIsRecheck = function (key) {
        var count = $scope.isRecheckDatas.length;
        for (var i = 0; i < count; i++) {
            if ($scope.isRecheckDatas[i].key == key) {
                return $scope.isRecheckDatas[i].text;
            }
        }
    }
    
    //初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.TmpMoneyIOTable = $('#TmpMoneyIO_dynamic_table').DataTable( {
			    		data : $scope.TmpMoneyIODataset,
			        	columns :$scope.TmpMoneyIO_column,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });
    
});

