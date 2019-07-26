myapp.controller('RoleManageController', function ($scope, $rootScope,$timeout) {	
	//调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
	
	$scope.ModalEntity = {};
	$scope.listEntitys = [];
	$scope.menu = [];
	$scope.queryEntity={};
	$scope.roleManageDataset=[];
	$scope.roleManageMenuDataset=[];
	
	// 按钮权限
	$scope.roleManage_query = isShow("roleManage_query");
	$scope.roleManage_set = isShow("roleManage_set");
	
	//定义角色管理表的固定列头
    $scope.roleManage_columns = [
		{title: "角色代码"},
		{title: "角色名称"},
		{title: "操作"}                
	]
    $scope.roleManageMenu_columns = [
 		{title: "序号"},
 		{title: "菜单"}                
 	]
    //初始化
    /*getAllRole(function(result){
    	$scope.listEntitys = result;
		$scope.allEntitys = result;
		$scope.$apply();
	});*/
    //表格设置角色权限事件
    $("body").undelegate("#roleManage_dynamic_table_wrapper td .update-row","click");
    $("body").delegate("#roleManage_dynamic_table_wrapper td .update-row","click",function(){  	
        var mytr = $(this).parents("tr");
        $('#isUpdateRelateUser').prop('checked', false);
        var tempArr = $scope.roleManageTable.row(mytr).data();
        var id = tempArr[0];
        $scope.drawTree(id);
    });
    
    $("body").undelegate("#roleManage_dynamic_table_wrapper  td  .update-row2","click");
    $("body").delegate("#roleManage_dynamic_table_wrapper  td  .update-row2","click",function(){
    	var mytr = $(this).parents("tr");
        var tempArr = $scope.roleManageTable.row(mytr).data();
        var id = tempArr[0];
        for(var i = 0;i<$scope.listEntitys.length;i++){
        	if(id==$scope.listEntitys[i].id){
        		$scope.modalEntity = $scope.listEntitys[i];
        	}
        }
        $timeout(function() {
        	$scope.showMenu($scope.modalEntity);
         }, 300);
        $scope.$apply();
    })
    
    // 查询(前台分页)
    $scope.find = function(){
    	//将数据集赋值为空
    	$scope.roleManageDataset = [];
    	//更新表格对应的数据集
    	findRoleList(function (result) {
    		var con = result;
    		var tempArray = new Array();
            for(var i = 0; i<con.length;i++){
            	var operate = "";
            	if($scope.roleManage_set){
            		operate = "<a class='row-operation-distance right-row update-row' data-toggle='modal' data-target='#roleSetting_setModal'>设置</a>";
            	}
	            if( con[i].id==6 || con[i].id==8 ||con[i].id==13){
            		operate = "";
            	}
                var tempArr = [con[i].id,con[i].roleName, operate];
	            $scope.roleManageDataset.push(tempArr);
            }
            //重新绘表
            $scope.roleManageTable.clear().draw();
            $scope.roleManageTable.rows.add($scope.roleManageDataset).draw();
        }, $scope.queryEntity.roleName);
    }
    $scope.find();

    //初始化
    $(document).ready(function() {
    	//会话列表初始化
    	$scope.roleManageTable = $('#roleManage_dynamic_table').DataTable( {
    		data : $scope.roleManageDataset,
        	columns :$scope.roleManage_columns,
//        	scrollY: 300,
//          scrollX: true,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
/*			    {
			        text: '导出',
			    }*/
			]
        } );
    	
    	//会话列表初始化
    	$scope.roleManageMenuTable = $('#roleManageMenu_dynamic_table').DataTable( {
    		data : $scope.roleManageMenuDataset,
        	columns :$scope.roleManageMenu_columns,
        	"bInfo" : false,
//        	scrollY: 300,
//          scrollX: true,
            dom: 'rt<"bottom"iplB>',
            fixedColumns:   {
                leftColumns: 0,
                rightColumns: 1
            },
			buttons: [
/*			    {
			        text: '导出',
			    }*/
			]
        } );
    	
    });
    
  //============================================================权限树生成============================================================
    $scope.drawTree = function (id) {
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "ps", "N": "ps" },
                    autoCheckTrigger: true
                }
            }
        };
        $scope.ModalEntity.roleID = id;
        var treeObj =null;
        getAllMenu(function (result) {
            if (result.length > 0) {
            	$.fn.zTree.init($("#rightTree"), setting, result);
            	treeObj = $.fn.zTree.getZTreeObj("rightTree");
                var nodes = treeObj.getNodes();              
                for(var i=0;i<nodes[0].children.length;i++){
                	for(var j=0;j<nodes[0].children[i].children.length;j++){
                			treeObj.expandNode(nodes[0].children[i].children[j], false, null, null);  
                	}
                }
            }
        }, id);
    };


    /**
     * 保存权限设置
     */
    $scope.saveRight = function () {
        var Entitys = new Array();
        var treeObj = $.fn.zTree.getZTreeObj("rightTree");
        var roleID = $scope.ModalEntity.roleID;

        var isUpdateRelateUser = null;
        if($('#isUpdateRelateUser').is(':checked'))
        	isUpdateRelateUser = true;
        else
        	isUpdateRelateUser = false;
        
        var nodes = treeObj.getCheckedNodes(true);
        angular.forEach(nodes, function (node, index, array) {
            var Entity = new Object();
            Entity.id = node.id;
            Entity.pId = node.pId == null ? 0 : node.pId;
            Entity.name = node.name;
            Entity.url = node.url;
            Entity.open = node.open;
            Entity.roleId = roleID;
            Entitys.push(Entity);
        });

        //保存角色权限
        saveRoleMenuList(function (result) {
        	},isUpdateRelateUser,roleID, Entitys);
        	$("#roleSetting_setModal").modal("hide");
        	layer.msg("角色权限保存完成！", {icon: 1, time: 2000});
    	}
    
	
});
