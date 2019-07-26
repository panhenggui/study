myapp.controller('SysStatusController', ['$scope','$rootScope','$sce',function($scope,$rootScope,$sce) {
	// 定义页面数据模型
    $scope.queryEntity = {};
    $scope.tempEntity = {};
    $scope.modalEntity = {};
    $scope.operSeatDataset = [];
    $scope.operSeatEntitys = [];

    	//调用表格重绘函数
        $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
        $scope.tabCallBackFunc = tabCallBackFunc;


    // 轮询按钮权限
    $scope.operSeat_start = isShow("start");

    $scope.operSeat_stop = isShow("stop");
        //初始值定义
    $scope.queryEntity.seconds = 10;
     $scope.status = "轮询中.....";
     $scope.isStart = true;

    /**
     * 获取服务器配置信息
     */
    $scope.convert = function(n){
        return $sce.trustAsHtml(n);
     }

    /**
    *获取业务监控数据
    */
  $scope.getBusinessStatus = function () {
        getBusinessStatus(function(result){
            $scope.serverBusiness = result;
            var tempArray = [] ;
            if( result == "" || result == null){
                var tem = {
                             name : "进程未同步",
                             dataSynchroStatus : "",
                              signInStatus : ""
                            }
                tempArray.push(tem);
                $scope.serverBusiness = tempArray ;
                $scope.$apply();
                return false ;
            }
            for(var i =0 ; i< result.length ; i++ ){
                var dataSynchro =  result[i].dataSynchroStatus
               var con = "";
                for(var j=0; j< dataSynchro.length ; j++ ){
                    con =con + dataSynchro[j];
                }
                var signIn = result[i].signInStatus;
                var con1 = "";
                for (var g = 0 ; g<signIn.length ; g++){
                     con1 = con1 + signIn[g] ;
                }

                var tem = {
                    name : result[i].name,
                    dataSynchroStatus : con,
                        signInStatus : con1
                }
                tempArray.push(tem);
            }
            $scope.serverBusiness = tempArray ;
            $scope.$apply();
        })
    }



    /**
    *获取进程监控数据
    */
  $scope.getServerInfo = function () {
      getSysAllStatus(function(result){
            $scope.serverMachine = result;
            var tempArray = [] ;
            if(result == "" || result == null){
                var tem = {
                    name : "进程未同步",
                    processStatus : "",
                    linkStatus : "" ,
                    memoryStatus : ""
                }
            tempArray.push(tem);
            $scope.serverMachine = tempArray ;
            $scope.$apply();
            }

            for(var i =0 ; i< result.length ; i++ ){
                var conProcess =  result[i].processStatus
                var con = "";
                for(var j=0; j< conProcess.length ; j++ ){
                    con =con + conProcess[j];
                }
                var conLink = result[i].linkStatus;
                var con1 = "";
                for (var g = 0 ; g<conLink.length ; g++){
                     con1 = con1 + conLink[g] ;
                }

                var tem = {
                    name : result[i].name,
                    processStatus : con,
                    linkStatus : con1 ,
                    memoryStatus : result[i].memoryStatus
                }
                tempArray.push(tem);
            }
            $scope.serverMachine = tempArray ;
            $scope.$apply();
        })
    }



    /**
    *服务器监控数据
    */
     $scope.getServerStatus = function () {
               getServerStatus(function(result){
               $scope.serverStatus = result
               var tempArray= [] ;
               if(result == null || result == ""){
                     var tem = {
                                     name : "服务器未同步",
                                     serverStatus : ""
                              }
               tempArray.push(tem);
               $scope.serverServer= tempArray ;
               $scope.$apply();
               return false
               }

               for(var i =0 ; i< result.length ; i++ ){
                     var server =  result[i].serverStatus
                     var con = "";
                     for(var j=0; j< server.length ; j++ ){
                        con =con + server[j];
                     }
                     var tem = {
                         name : result[i].name,
                         serverStatus : con

                     }
                    tempArray.push(tem);
               }
               $scope.serverServer= tempArray ;
               $scope.$apply();

           })
     }
     $scope.getServerStatus();
    $scope.getServerInfo();
    $scope.getBusinessStatus();

   // 执行轮询
         $scope.start = function(){
         	clearInterval($scope.timer);
         	$scope.status = "轮询中.....";
             $scope.isStart = true;
             $scope.isStop = false;
             $scope.timer = setInterval(function () {
             	$scope.getServerInfo();
             	$scope.getBusinessStatus();
            	$scope.getServerStatus();
                $scope.addTable();
         	}, $scope.queryEntity.seconds*1000);
         }

    // 定时器
    $scope.timer = setInterval(function () {
    	$scope.getServerInfo();
    	$scope.getBusinessStatus();
    	$scope.getServerStatus();
	}, $scope.queryEntity.seconds*1000);

    $scope.stop = function (){
    	$scope.isStart = false;
    	$scope.isStop = true;
    	$scope.status = "轮询停止";
    	clearInterval($scope.timer);
    }

}])