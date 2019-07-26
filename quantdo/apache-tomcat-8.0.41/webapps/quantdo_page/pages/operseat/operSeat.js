myapp.controller('OperSeatController', function ($scope, $timeout,$rootScope) {
	// 调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    
	$scope.service = new com.quantdo.orgClear.service.OperSeatService();
	// 定义页面数据模型
    $scope.queryEntity = {};
    $scope.tempEntity = {};
    $scope.modalEntity = {};
    $scope.operSeatDataset = [];
    $scope.operSeatEntitys = [];
    // 初始值
    $scope.queryEntity.seconds = 5;
    $scope.status = "轮询中.....";
    $scope.isStart = true;
    // 按钮权限
    $scope.operSeat_start = isShow("operSeat_start");
    $scope.operSeat_stop = isShow("operSeat_stop");
    // 报盘接入方式
    $scope.linkManagerTypes = clearConstant.linkManagerTypes;
    
    // 列头
    $scope.operSeatColumns = [
        { title: "序号"},
        { title: "机构"},		{ title: "交易所"},		{ title: "会员编号"},
		{ title: "席位号/资金账号"},		{ title: "API类型"},		{ title: "是否活跃"},		{ title: "连接地址"},		{ title: "连接状态"},
		{ title: "交易日期"}    ]; 
    

    // 查询
    $scope.find = function(){
    	// 先清空
    	$scope.operSeatEntitys = [];
    	$scope.service.getAll(function(result){
	    	$scope.operSeatDataset = new Array();
	    	$scope.operSeatEntitys = result;
	    	var con = result;
	    	for(var i=0;i<con.length;i++){
	    		con[i].frontAddr = con[i].frontAddr.replace(/\.l/g,",l").replace(/\.f/g,",f").replace(/\.e/g,",f").replace(/\.s/g,",f") + ","
	    		con[i].frontAddr = con[i].frontAddr.replace(/l=tcp:..[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}:[\d]{1,5},/g,"").replace(/f=tcp:../g,"").replace(/e=tcp:../g,"").replace(/s=tcp:../g,"");
	    		con[i].frontAddr = con[i].frontAddr.substr(0,con[i].frontAddr.length-1);
				var dataArr = [(i+1),con[i].instClientName,con[i].exchID.replace(/Broker/,""),con[i].memberID,con[i].seatID,
					$scope.transferApiLinkType(con[i].apiLinkType),$scope.transferIsActive(con[i].isActive),
				    con[i].frontAddr,$scope.transferStatus(con[i].seatStatus),con[i].tradingDay];
				$scope.operSeatDataset.push(dataArr);
	    	}
	    	// 重新绘表
	        $scope.operSeatTable.clear().draw();
	        $scope.operSeatTable.rows.add($scope.operSeatDataset).draw();
	    });
    }
    
    // 转换
    $scope.transferApiLinkType = function(key){
    	var result = "";
    	if(key=='1'){
    		result='交易所';
    	}else if(key=='2'){
    		result='经纪商';
    	}
    	return result;
    }
    
    $scope.transferIsActive = function(key){
    	var result = "";
    	if(key=='0'){
    		result='否';
    	}else if(key=='1'){
    		result='是';
    	}
    	return result;
    }
    
    $scope.transferStatus = function(key){
    	var result = "";
    	if(key=='0'){
    		result='不活跃';
    	}else if(key=='1'){
    		result='已登录';
    	}else if(key=='2'){
    		result='已登出';
    	}
    	return result;
    }
    
    $scope.transferLinkManagerType = function(param){
    	var result = "";
    	for(var x in $scope.linkManagerTypes){
    		if(param == $scope.linkManagerTypes[x].key){
        		result = $scope.linkManagerTypes[x].text;
        	}
    	}
    	
    	return result;
    }
    // 初始化
    $(document).ready(function() {
    	// 会话列表初始化
    	$scope.operSeatTable = $('#operSeat_dynamic_table').DataTable( {
    		data : $scope.operSeatDataset,
        	columns :$scope.operSeatColumns,
            dom: 'rt<"bottom"iplB>',
			buttons: []
        } );
    	
    });
    
    $scope.find();
    
    // 执行轮询
    $scope.start = function(){
    	clearInterval($scope.timer);
    	$scope.status = "轮询中.....";
        $scope.isStart = true;
        $scope.isStop = false;
        $scope.timer = setInterval(function () {
        	$scope.find();
    	}, $scope.queryEntity.seconds*1000);
    }
   
    // 定时器
    $scope.timer = setInterval(function () {
    	$scope.find();
	}, $scope.queryEntity.seconds*1000);
    
    $scope.stop = function (){
    	$scope.isStart = false;
    	$scope.isStop = true;
    	$scope.status = "轮询停止";
    	clearInterval($scope.timer);
    }
});
