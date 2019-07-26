myapp.controller('businessGroupManageController', function ($scope,$rootScope, $timeout) {
	$scope.businessGroupService = new com.quantdo.orgClear.service.BusinessGroupManageService();
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    $scope.businessGroup_query = isShow("businessGroup_query");
    $scope.businessGroup_add = isShow("businessGroup_add");
    $scope.isInstClient = false;
    $scope.isUpd = false;
    $scope.queryEntity = {};
    $scope.modalEntity = {};
    $scope.instClients = [];//机构下拉框
    $scope.subAccountGroups = [];//业务组下拉框
    
    /*******公共方法***********/
    //获取修改权限
	$scope.getUpdatePermision = function(flag){
    	  var result = "";
	  	  if(flag){
	  		  result = "<a style='cursor:pointer;' class='row-operation-distance update-row'>修改</a>";
	  	  }
	  	  return result;
    }
    //获取删除权限
	$scope.getDeletePermision = function(flag){
    	  var result = "";
    	  if(flag){
    		  result = "<a style='cursor:pointer;' class='row-operation-distance delete-row'>删除</a>";
    	  }
    	  return result;
    }
	
    /*************创建表格**********************/
	$scope.datas = [];//表格数据集
	//表格列
	$scope.columns = [
					{"title":"序号", "data":"index", "visible":true},
					{"title":"机构", "data":"instClientName", "visible":true},
					{"title":"业务组代码", "data":"subAccountGroupID", "visible":true},
					{"title":"业务组名称", "data":"subAccountGroupName", "visible":true},
					{"title":"备注","data":"remark","visible":true},
					{"title":"创建人","data":"creator","visible":true},
					{"title":"创建日期", "data":"createDate", "visible":true},
					{"title":"id", "data":"id", "visible":false},
					{"title":"机构id", "data":"instClientID", "visible":false},
					{"title":"操作", "data":"action", "visible":true}
                  ];
	//表格属性
	$scope.arrObj = {
			 "order":[0, "asc"],
			 "dom": 'rt<"bottom"ipl>',
			 "fixedColumns":   {
 		        leftColumns: 0,
 		        rightColumns: 1
 		    }
	};
	
	//生成表格数据的公共方法
	$scope.tableDatas = function(result){
		$scope.datas = [];//表格数据集
		var operate1 = $scope.getUpdatePermision(isShow("businessGroup_update")); 
    	var operate2 = $scope.getDeletePermision(isShow("businessGroup_delete"));
		if(result){
			for(var i=0;i<result.length;i++){
				var con = result[i];
				con.action = operate1+operate2;
				con.index = i+1;
				$scope.datas.push(con);
			}
		}
		//重置表格数据
    	var table = $("#businessGroupManage_table").DataTable();
    	table.clear().draw();
    	table.rows.add($scope.datas).draw();
    	setTimeout(function(){
			$.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
		})
		$scope.getGroups();
	}
	
	//查询
	$scope.query = function(){
		$scope.businessGroupService.query($scope.queryEntity,function(result){
			if(result){
				$scope.tableDatas(result);
				$scope.$apply();
			}
		});
	}
	/************下拉框数据****************/
	 //获得业务组代码
   $scope.getGroups = function(){
   	$scope.businessGroupService.findGroups($scope.queryEntity,function(result){
			$scope.subAccountGroups = [];
			if(result){
				$scope.subAccountGroups = result;
			}
			$scope.$apply();
		});
   }
   
   //获得机构下拉框
   $scope.businessGroupService.findInsts(function(result){
   	$scope.instClients = [];
   	if(result){
   		$scope.instClients = result;
   		 $scope.queryEntity.instClientID = "";
			 $scope.isInstClient = false;
   		if($scope.instClients.length == 1){
   			 $scope.queryEntity.instClientID = $scope.instClients[0].instClientID;
   			 $scope.isInstClient = true;
   		}
   		//初始化表格
		$rootScope.initDataTable_new("businessGroupManage_table",$scope.columns,[],$scope.arrObj,$scope.query);
   		$scope.$apply();
   		//获得业务组
   		$scope.getGroups();
   	}
   });
   
    $scope.instChange = function(){
    	$scope.getGroups();
	 }
	/*********新增**************/
	//新增
    $scope.isHasJiGou = false;//新增页面，在没选择机构前，不允许填写业务组代码
	$scope.newAdd = function(){
		$scope.isHasJiGou = true;
		$scope.modalEntity = {};
		$scope.modalEntity.id = null;
		if($scope.instClients && $scope.instClients.length == 1){
			$scope.modalEntity.instClientID = $scope.instClients[0].instClientID;
			$scope.isHasJiGou = false;
			$scope.businessGroupService.getMaxGroupID($scope.modalEntity,function(result){
				$scope.formValidateReset();
				$scope.isUpd = false;
				if(result){
					$scope.modalEntity.subAccountGroupID = result;
				}
				$scope.$apply();
			});
		}else{
			$scope.formValidateReset();
			$scope.isUpd = false;
		}
	}
	//新增modal框，机构代码改变
	$scope.newAddInstChange = function(){
		$scope.businessGroupService.getMaxGroupID($scope.modalEntity,function(result){
			if(result){
				$scope.modalEntity.subAccountGroupID = result;
				$scope.isHasJiGou = false;
			}
			$scope.$apply();
		});
	}
	$scope.formValidateReset = function (){
     	$scope.myForm.subAccountGroupID.$setPristine();
     	$scope.myForm.subAccountGroupName.$setPristine();
     }
	
	//新增和修改公共效验方法
	$scope.xiaoyan = function(){
		if($rootScope.isNullOrBlanck($scope.modalEntity.instClientID)){
			layer.msg("机构不能为空", {
				icon : 2,
				time : 2000
			});
			return false;	
		}else 
			return true;
	}
	
	//点击修改
	 $("body").undelegate("#businessGroupManage_table_wrapper td .update-row","click");
	 $("body").delegate("#businessGroupManage_table_wrapper td .update-row","click",function(event){
		var table = $("#businessGroupManage_table").DataTable();
        var mytr = $(this).parents('tr');
        var upd = table.row(mytr).data();
        $("#businessGroupManageModal").modal("show"); //显示modal框
        $scope.modalEntity = {};
        $scope.isUpd = true; 
		$scope.modalEntity.instClientID = upd.instClientID;
		$scope.modalEntity.subAccountGroupID = upd.subAccountGroupID;
    	$scope.modalEntity.subAccountGroupName = upd.subAccountGroupName;
    	$scope.modalEntity.remark = upd.remark;
    	$scope.modalEntity.id = upd.id;
    	$scope.$apply();
	});
	
	//新增或修改
	$scope.saveOrUpd = function(){
		if(!$scope.xiaoyan()) return false;
		//新增
		if($scope.modalEntity.id == null){
			$scope.businessGroupService.save($scope.modalEntity,$scope.queryEntity,function(result){
				if(result){
					$scope.tableDatas(result);
					layer.msg("新增成功",{icon: 1});
					$("#businessGroupManageModal").modal("hide");
					$scope.$apply();
				}
			});
		}
		//修改
		else{
			$scope.businessGroupService.update($scope.modalEntity,$scope.queryEntity,function(result){
				if(result){
					$scope.tableDatas(result);
					layer.msg("修改成功",{icon: 1});
					$("#businessGroupManageModal").modal("hide");
					$scope.$apply();
				}
			});
		}
	}
	
	//删除
	 $("body").undelegate("#businessGroupManage_table_wrapper td .delete-row","click");
	 $("body").delegate("#businessGroupManage_table_wrapper td .delete-row","click",function(event){
			var table = $("#businessGroupManage_table").DataTable();
	        var mytr = $(this).parents('tr');
	        var delArr = table.row(mytr).data();
	        layer.confirm('确定要删除吗？', {
				icon : 3
			}, function(count) {
				$scope.businessGroupService.del(delArr,$scope.queryEntity,function(result){
					$scope.tableDatas(result);
					//更新产品下拉框数据
					$scope.tableDatas(result);
					layer.msg("删除成功", { icon : 1 });
					layer.close(count);
					$scope.$apply();
				});
			});
		 });
	 
	 
	$scope.isZZZ = false;
	$scope.groupIDKeyUp = function(value){
		if(value == "0000"){
			$scope.isZZZ = true;
		}else{
			$scope.isZZZ = false;
		}
		
	}
});

