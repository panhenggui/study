myapp.controller('ExchClientController', function ($scope,$rootScope, $timeout) {
	//调用表格重绘函数
	$rootScope.setTabPaneScope($scope,"tabCallBackFunc");
	$scope.tabCallBackFunc = tabCallBackFunc;
	//1、实例化服务接口
	//1.1、交易客户服务接口
	$scope.service = new com.quantdo.orgClear.service.ExchClientService();
	//1.2、公用查询服务接口
	$scope.commonQueryservice = new com.quantdo.orgClear.service.CommonQueryService();
	//1.3、 实例化内部资金服务接口
	$scope.capitalAccountService = new com.quantdo.orgClear.service.CapitalAccountService();
	//1.4、 实例化会员服务接口
	$scope.memberService = new com.quantdo.orgClear.service.MemberService();	
	
	//2、定义页面数据模型
    $scope.queryEntity = {};
    $scope.tempEntity={};
    $scope.modalEntity = {};
    $scope.ExchClientDataset = [];
	
	// 按钮权限
    $scope.exchClient_query = isShow("exchClient_query");
    $scope.exchClient_add = isShow("exchClient_add");
    $scope.exchClient_update = isShow("exchClient_update");
    $scope.exchClient_delete = isShow("exchClient_delete");

	//定义固定列头
    $scope.ExchClient_columns = [
        {title: "序号"},
        {title: "id",visible:false},
        {title: "资金账号"},
        {title: "交易所代码"},
        {title: "客户代码"},
        {title: "会员代码"},
        {title: "交易类型"},
        {title: "交易权限"},
        {title: "操作员"},
        {title: "操作日期"},
        {title: "操作时间"},
		{title: "操作"}               
	];
    
    //2.1、交易类型
    $scope.tradeTypes = clearConstant.tradeTypes;   
    //2.2、是否活跃
    $scope.isActiveArray = clearConstant.isNotDatas;
    //2.3、交易权限
    $scope.tradeRights = clearConstant.tradeRights;

    
    //3、定义方法
    //3.1、查询交易客户
    /*    $scope.find = function (queryEntity) {
        $scope.listEntitys = {};               
        $scope.service.findByCondition(queryEntity,function (result) {
            $scope.listEntitys = result;
        	$scope.$apply();  
        });
    };  */
    
    $("body").undelegate("#ExchClient_dynamic_table_wrapper td .update-row","click");
    //表格修改事件
    $("body").delegate("#ExchClient_dynamic_table_wrapper td .update-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.ExchClientTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.initUpdateParam($scope.modalEntity,id);
        }, 1000);
    });
    $("body").undelegate("#ExchClient_dynamic_table_wrapper td .delete-row","click");
    //表格删除事件
    $("body").delegate("#ExchClient_dynamic_table_wrapper td .delete-row","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.ExchClientTable.row(mytr).data();
        var id = tempArr[1];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
       $scope.remove($scope.modalEntity,id);
    });

    // 根据页面条件查询
    $scope.find = function () {  	
    	$scope.isQuery = true;
		$scope.ExchClientDataset = [];
		$scope.listEntitys = [];
		$scope.service.findByCondition($scope.queryEntity,function(result){			
			$scope.isQuery = true;
			$scope.listEntitys = result;
			var con = result;
			for(var i = 0; i<con.length;i++){
				var operator = "";
				if($scope.exchClient_update){
					operator = operator.concat("<a class='update-row'>修改</a>");
				}if($scope.exchClient_delete){
					operator = operator.concat("<a class='delete-row'>删除</a>");
				}
//				var operator = "<a class='update-row'>修改</a><a class='delete-row'>删除</a>"
		    	var tempArr = [(i+1),con[i].id,con[i].innerAccountID,con[i].exchID,con[i].clientID,con[i].memberID,$scope.transTradeType(con[i].tradeType),$scope.transTradeRight(con[i].tradeRight)
		   					,con[i].operatorID,con[i].operateDate,con[i].operateTime,operator]
		    	$scope.ExchClientDataset.push(tempArr); 
		    	con[i].index = i+1;
			}
			$scope.listEntitys = con;
			//重新绘表
	        $scope.ExchClientTable.clear().draw();
	        $scope.ExchClientTable.rows.add($scope.ExchClientDataset).draw();
			$scope.$apply();
			$timeout(function() {
                $scope.isQuery = false;
            }, 1000);
		});
    };

    $scope.transTradeType = function(tradeType){
    	 var result = '';
    	 if(tradeType==1){
    		 result = '投机';
    	 }else if(tradeType==2){
    		 result = '套利';
    	 }else if(tradeType==3){
    		 result = '套保';
    	 }else if(tradeType==4){
    		 result = '做市商';
    	 }
    	 return result;
    }
    $scope.transTradeRight = function(tradeRight){
		     var result = '';
		   	 if(tradeRight==0){
		   		 result = '正常交易';
		   	 }else if(tradeRight==1){
		   		 result = '只可平仓';
		   	 }else if(tradeRight==2){
		   		 result = '禁止交易';
		   	 }
		   	 return result;
    }
    
    //3.2、保存交易客户
    $scope.save = function (entity) {    
         var index = entity.id; 
         var tableIndex = entity.index;
         //增加
         if (index == undefined) {
        	 $scope.service.findByExchAndClient(entity,function (fresult) {
                 if(fresult.length > 0){
                 	layer.msg('该交易所的客户代码已存在，请重新输入！', {
     					icon : 2
     				});
     				return false;
                 } else {
                	 $scope.service.findByExchAndTradeType(entity,function (fresult) {
                         if(fresult.length > 0){
                         	layer.msg('此资金账号所在的交易所的交易类型已存在，请更正后提交！', {
             					icon : 2
             				});
             				return false;
                         } else {
                          	$scope.service.add(entity,function (result) {
                          		$scope.listEntitys.push(result);  
                          		$scope.$apply();        		
                              	layer.msg("交易编码信息保存成功!", {icon : 1,time : 2000});
                                $scope.find();
                          	});   
                            //关闭窗口
                            $("#exchClientModal").modal("hide");
                         }
                      }); 
                 }
              });  
	    		
             //修改
         }
         else {
         	$scope.service.update(entity,function (result) {
         		result.index = tableIndex;
         		$scope.listEntitys.splice(tableIndex-1, 1, result);  
                $scope.ExchClientTable.cells().every( function () {
                    if((tableIndex-1) == this[0][0].row){
                    	if(this[0][0].column == 5){
                            this.data(entity.memberID);
                            $scope.$apply();
                        }
                        if(this[0][0].column == 6){
                            this.data($scope.transTradeType(entity.tradeType));
                            $scope.$apply();
                        }
                        if(this[0][0].column == 7){
                            this.data($scope.transTradeRight(entity.tradeRight));
                            $scope.$apply();
                        }
                    }

                } );
         		layer.msg("交易编码信息保存成功!", {icon : 1,time : 2000});
         		  //$scope.find();
         	});  
            //关闭窗口
            $("#exchClientModal").modal("hide");
         }
    };    
    //3.3、删除交易客户
    $scope.remove = function (entity,index) {
        //使用内置Index     
    	layer.confirm('确定删除该交易编码信息吗？', {
			icon : 3
		}, function(count) {
	    	$scope.service.remove(entity.id,function (result) {
	        	$scope.listEntitys.splice(index, 1);
	    		$scope.$apply();    		
	        	layer.msg("交易编码信息记录删除成功!", {icon : 1,time : 2000});
	        	$scope.find();
	    	});  
		});
    };    
    //3.4、初始化新增页面的参数
    $scope.initAddParam = function () {
    	$scope.isUpdate =false;
        $scope.modalEntity = {};
        if($scope.accountDatas.length>0){
        	$scope.modalEntity.innerAccountID = $scope.accountDatas[0].innerAccountID;
        }else{
        	layer.msg('无可用的主经纪商的资金账号，请先创建资金账号', {
					icon : 2
				});
				return false;
        }
        if($scope.exchangeDatas.length>0){
        	$scope.modalEntity.exchID = $scope.exchangeDatas[0].exchID;
        	 getAllMemberByExchId(function (result) {
                 if (result.length > 0) {
                     $scope.memberDatas = result;
                     $scope.modalEntity.memberID = $scope.memberDatas[0].memberID;
                     $scope.$apply();
                 }
             }, $scope.modalEntity.exchID,$scope.modalEntity.innerAccountID);
        } 
        if($scope.tradeRights.length>0){
        	$scope.modalEntity.tradeRight= $scope.tradeRights[0].key;
        }
        $scope.modalEntity.tradeType = $scope.tradeTypes[0].key;
        $scope.modalEntity.isActive = $scope.isActiveArray[0].key;
        $scope.isUpdate = false;

        $scope.formValidateReset();
        $timeout(function () {
       	 $("#exchClientModal").modal("show");
       }, 500);
     };    
    //3.5、初始化个性页面的参数
     $scope.initUpdateParam = function (entity,index) { 
    	 $scope.isUpdate =true;
    	 $scope.modalEntity =[];
         $scope.tempEntity = angular.copy(entity);
         $scope.tempEntity.recordIndex = index;        
         $scope.modalEntity = angular.copy($scope.tempEntity);
         getAllMemberByExchId(function (result) {
             if (result.length > 0) {
                 $scope.memberDatas = result;
                 $scope.modalEntity.memberID = $scope.memberDatas[0].memberID;
                 $scope.$apply();
             }
         }, $scope.modalEntity.exchID,$scope.modalEntity.innerAccountID);
         $scope.isUpdate = true;
         $scope.formValidateReset();
         $timeout(function () {
        	 $("#exchClientModal").modal("show");
        }, 500);
     };
     //3.6、表单校验信息重置
     $scope.formValidateReset = function (){
     	$scope.myForm.innerAccountID.$setPristine();
     	$scope.myForm.exchID.$setPristine();
     	$scope.myForm.clientID.$setPristine();
     	$scope.myForm.memberID.$setPristine();	
     } 
	 //根据交易所查询所有会员
     $scope.changeExchangs = function (exchId,innAccId) {
         $scope.modalEntity.memberID = "";
         $scope.memberDatas = [];
         //根据选择的交易所查询对应的产品
         getAllMemberByExchId(function (result) {
             if (result.length > 0) {
                 $scope.memberDatas = result;
                 $scope.modalEntity.memberID = $scope.memberDatas[0].memberID;
                 $scope.$apply();
             }
         }, exchId,innAccId);
     };
 	
     
     
    
    //4、数据初始化        
    //4.1、进入页面时调用查询方法
    $scope.find();
    //4.2 初始化交易所信息
    $scope.commonQueryservice.getAllExchanges(function (result) {
        $scope.exchangeDatas = result;
    });
    //4.3 初始化内部账户下拉列表
	findCapitalByBrokId(function (result) {
		 $scope.accountDatas = result;
		$scope.$apply();
   });    
	
	//初始化
    $(document).ready(function() {
		    	//会话列表初始化
		    	$scope.ExchClientTable = $('#ExchClient_dynamic_table').DataTable( {
			    		data : $scope.ExchClientDataset,
			        	columns :$scope.ExchClient_columns,
			            dom: 'rt<"bottom"iplB>',
			            fixedColumns:   {
			                leftColumns: 0,
			                rightColumns: 1
			            },
						buttons: []
		        } );
      });
	
  
      
});

