myapp.controller('RunMonitorController', ['$scope','$rootScope',function($scope,$rootScope) {
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    $scope.serverId = "";
    //是否显示状态图
    $scope.picShow = false;
    //是否第一次选择服务器
    $scope.firstFlag = 0;
    //$scope.unit = "%";
    $scope.showConnect = false;
    //是否显示席位详情信息
    $scope.seatDetailFlag = false;
    // 按钮权限
    $scope.runMonitor_cpu = isShow("runMonitor_cpu");
    $scope.runMonitor_storage = isShow("runMonitor_storage");
    $scope.runMonitor_upFlow = isShow("runMonitor_upFlow");
    $scope.runMonitor_downFlow = isShow("runMonitor_downFlow");
    $scope.runMonitor_saveValue = isShow("runMonitor_saveValue");
    
    /**
     * 获取服务器配置信息
     */
    $scope.getServerInfo = function () {
        getServerInfo(function(result){
            $scope.serverMachine = result;
            $scope.$apply();
        })
    }
    $scope.getServerInfo();
    /**
     * 显示席位详情信息
     */
    $scope.showSeatDetail = function(){
        window.clearInterval($scope.circle);
        $scope.seatDetailFlag = true;
    }
    /**
     * 隐藏席位详情信息
     */
    $scope.hideSeatDeatail = function(){
        $scope.changeServer($scope.serverId,$scope.selected);
        $scope.seatDetailFlag = false;
    }
    /**
     * 修改阈值
     * @param info
     * @param flag
     */
    $scope.changeNum = function(info,flag){
        if(flag === "cpu"){
            if(Number(info.cpuValue)>Number(100)){
                info.cpuValue = Number(0);
                return;
            }
            var cpuValue = info.cpuValue +"";
            if(cpuValue.charAt(cpuValue.length-1) != "."){
                info.cpuValue = Number(info.cpuValue);
            }
        }else if(flag === 'memory'){
            var memoryValue = info.memoryValue +"";
            if(memoryValue.charAt(memoryValue.length-1) != "."){
                info.memoryValue = Number(info.memoryValue);
            }
        }else if(flag === 'disc'){
            if(Number(info.discValue)>Number(100)){
                info.discValue = Number(0);
                return;
            }
            var discValue = info.discValue +"";
            if(discValue.charAt(discValue.length-1) != "."){
                info.discValue = Number(info.discValue);
            }
        }else if(flag === 'speed'){
            var speedValue = info.speedValue +"";
            if(speedValue.charAt(speedValue.length-1) != "."){
                info.speedValue = Number(info.speedValue);
            }
        }
    }
    /**
     * 选择服务器
     * @param ser
     */
    $scope.changeServer = function(serverId,selected){
        $scope.seatDetailFlag = false;
        if(selected.serverType == "2"){
            $scope.showConnect = true;
            //查询全部席位信息
            getAllSeatInfo(function(seatInfos){
                //获取席位总数
                $scope.seatAllNum = seatInfos.length;
                searchSyncApiId(selected.serverIP,selected.userName,selected.password,selected.logPath,function(apiIds){
                    //获取连接成功数量
                    $scope.seatSucessNum = apiIds.length;
                    angular.forEach(seatInfos,function(seatInfo,seatIndex){
                        angular.forEach(apiIds,function(apiId,apiIndex){
                            if(seatInfo.apiID === apiId){
                                seatInfo.connectFlag = true;
                            }else{
                                seatInfo.connectFlag = false;
                            }
                        })
                    })
                    $scope.seatInfos = seatInfos;
                    $scope.$apply();
                })
            })
        }else{
            $scope.showConnect = false;
        }
        if(serverId == undefined){
            window.clearInterval($scope.circle);
            $scope.firstFlag = 0
            $scope.userInfos=[];
        }else{
            if($scope.firstFlag === 0 || $scope.serverId === ""){
                findSystemResponse(serverId,function (result) {
                    $scope.userInfos=result;
                    $scope.firstFlag =1;
                    $scope.$apply();
                    $scope.serverId = serverId;
                    $scope.selected = selected;
                    window.clearInterval($scope.circle);
                    $scope.circle = setInterval(function(){
                        findSystemResponse(serverId,function (result) {
                            $scope.userInfos=result;
                            $scope.$apply();
                        })
                        if(selected.serverType == "2"){
                            $scope.showConnect = true;
                            //查询全部席位信息
                            getAllSeatInfo(function(seatInfos){
                                //获取席位总数
                                $scope.seatAllNum = seatInfos.length;
                                searchSyncApiId(selected.serverIP,selected.userName,selected.password,selected.logPath,function(apiIds){
                                    //获取连接成功数量
                                    $scope.seatSucessNum = apiIds.length;
                                    angular.forEach(seatInfos,function(seatInfo,seatIndex){
                                        angular.forEach(apiIds,function(apiId,apiIndex){
                                            if(seatInfo.apiID === apiId){
                                                seatInfo.connectFlag = true;
                                            }else{
                                                seatInfo.connectFlag = false;
                                            }
                                        })
                                    })
                                    $scope.seatInfos = seatInfos;
                                    $scope.$apply();
                                })
                            })
                        }else{
                            $scope.showConnect = false;
                        }
                    },60000);
                })
            }else {
                findSystemResponse(serverId,function (result) {
                    $scope.userInfos=result;
                    $scope.$apply();
                    $scope.serverId = serverId;
                    $scope.selected = selected;
                    window.clearInterval($scope.circle);
                    $scope.circle = setInterval(function(){
                        findSystemResponse(serverId,function (result) {
                            $scope.userInfos=result;
                            $scope.$apply();
                        })
                        if(selected.serverType == "2"){
                            $scope.showConnect = true;
                            //查询全部席位信息
                            getAllSeatInfo(function(seatInfos){
                                //获取席位总数
                                $scope.seatAllNum = seatInfos.length;
                                searchSyncApiId(selected.serverIP,selected.userName,selected.password,selected.logPath,function(apiIds){
                                    //获取连接成功数量
                                    $scope.seatSucessNum = apiIds.length;
                                    angular.forEach(seatInfos,function(seatInfo,seatIndex){
                                        angular.forEach(apiIds,function(apiId,apiIndex){
                                            if(seatInfo.apiID === apiId){
                                                seatInfo.connectFlag = true;
                                            }else{
                                                seatInfo.connectFlag = false;
                                            }
                                        })
                                    })
                                    $scope.seatInfos = seatInfos;
                                    $scope.$apply();
                                })
                            })
                        }else{
                            $scope.showConnect = false;
                        }
                    },60000);
                })

            }

        }
    }
    /**
     * 获取服务器信息详情信息
     * @param serverId
     */
    $scope.getAllInfo = function (serverId) {
        getAllInfo(serverId,function (result) {
            $scope.allInfo=result;
        });
    }
    //CPU状态图
    $scope.cpuPicture = function () {
        window.clearInterval($scope.circle);
        findServerPicInfo($scope.serverId,"cpu",function (result) {
            var myDate = new Date();
            $scope.dateTime = Date.UTC(myDate.getFullYear(),myDate.getMonth(),myDate.getDate());
            $scope.cpuInfo=result;
            $scope.yTitle = "系统CPU利用率（%）";
            $scope.title = "系统CPU使用率状态图";
            $scope.unit = "%";
            $scope.randerPic(result);
            $scope.picShow = true;
            $scope.$apply();
        });
    }
    //内存状态图
    $scope.memoryPicture = function () {

        findServerPicInfo($scope.serverId,"memory",function (result) {
            var myDate = new Date();
            $scope.dateTime = Date.UTC(myDate.getFullYear(),myDate.getMonth(),myDate.getDate());
            $scope.memoryInfo=result;
            $scope.yTitle = "系统已用内存（M）";
            $scope.title = "系统内存已用状态图";
            $scope.randerPic(result);
            $scope.picShow = true;
            $scope.$apply();
        });
    }
    //网卡状态图(上传)
    $scope.cardUploadPicture = function () {

        findServerPicInfo($scope.serverId,"upload",function (result) {
            var myDate = new Date();
            $scope.dateTime = Date.UTC(myDate.getFullYear(),myDate.getMonth(),myDate.getDate());
            $scope.uploadInfo=result;
            $scope.yTitle = "系统上传流量(KB/s)";
            $scope.title = "系统上传速度状态图";
            $scope.randerPic(result);
            $scope.picShow = true;
            $scope.$apply();
        });
    }
    //网卡状态图(下载)
    $scope.cardDownloadPicture = function () {

        findServerPicInfo($scope.serverId,"download",function (result) {
            var myDate = new Date();
            $scope.dateTime = Date.UTC(myDate.getFullYear(),myDate.getMonth(),myDate.getDate());
            $scope.downloadInfo=result;
            $scope.yTitle = "系统下载流量(KB/s)";
            $scope.title = "系统下载速度状态图";
            $scope.randerPic(result);
            $scope.picShow = true;
            $scope.$apply();
        });
    }
    //隐藏状态图
    $scope.hidePicture = function(){
        $scope.changeServer($scope.serverId,$scope.selected);
        $scope.picShow = false;
    }
    /**
     * 进程CPU使用率状态图
     */
    $scope.proCpuPic = function(processID){
        findproCpuPicInfo($scope.serverId,processID,function (result) {
            findProcessStartTime($scope.serverId,processID,function (startTime) {
                var startTime =  startTime.replace(/-/g,"/");
                var oDate = new Date(startTime);
                $scope.dateTime = Date.UTC(oDate.getFullYear(),oDate.getMonth(),oDate.getDate(),oDate.getHours(),oDate.getMinutes(),oDate.getSeconds());
                $scope.proCpuInfo=result;
                $scope.yTitle = "进程 "+processID+" CPU使用率（%）";
                $scope.title = "进程 "+processID+" CPU使用率状态图";
                $scope.randerPic(result);
                $scope.picShow = true;
                $scope.$apply();
            })
        });
    }
    /**
     * 进程CPU使用率状态图
     */
    $scope.proMemoryPic = function(processID){

        findproMemoryPicInfo($scope.serverId,processID,function (result) {
            findProcessStartTime($scope.serverId,processID,function (startTime) {
                var startTime =  startTime.replace(/-/g,"/");
                var oDate = new Date(startTime);
                $scope.dateTime = Date.UTC(oDate.getFullYear(),oDate.getMonth(),oDate.getDate(),oDate.getHours(),oDate.getMinutes(),oDate.getSeconds());
                $scope.proMemoryInfo=result;
                $scope.yTitle = "进程 "+processID+" 内存占用（M）";
                $scope.title = "进程 "+processID+" 内存占用状态图";
                $scope.randerPic(result);
                $scope.picShow = true;
                $scope.$apply();
            })
        });
    }
    /**
     * 获取磁盘使用率详情
     * @param filePath
     */
    $scope.discPic = function (filePath) {

        findDiscPicInfo($scope.serverId,filePath,function (result) {
            $scope.discInfo=result;
            $scope.randerPic(result);
            $scope.picShow = true;
            $scope.$apply();
        });
    }
    /**
     * 保存阈值
     */
    $scope.saveValue = function(){
        angular.forEach($scope.userInfos,function(data,index){
            if(data.type === "0"){
                updateServerValue(data.cpuValue,data.memoryValue,data.speedValue,data.serverID,function(result){
                        findSystemResponse($scope.serverId,function (result) {
                        $scope.userInfos=result;
                        $scope.$apply();
                    })
                })
            }else if(data.type === "2"){
                updateDiscValue(data.discValue,data.serverID,data.filePath,function(){
                    findSystemResponse($scope.serverId,function (result) {
                        $scope.userInfos=result;
                        $scope.$apply();
                    })
                })
            }
        })
    }
    //回执状态图
    $scope.randerPic = function(info){
        $('#container').highcharts({
            credits:{
                enabled:false
            },
            title: {
                text: $scope.title
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    minute: '%H:%M',
                }
            },
            yAxis: {
                title: {
                    enabled: true,
                    text: $scope.yTitle,
                    style: {
                        fontWeight: 'normal'
                    }
                }

            },
            legend: {
                enabled: true
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat: '<small>{point.key}</small><table>',
                pointFormat: '<tr><td style="color: {series.color}"></td>' +
                '<td style="text-align: right"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                valueDecimals: 2,
            },
            legend: {
                enabled: false
            },
            series: [{
                type:"area",
                pointStart:$scope.dateTime,
                pointInterval: 60000,
                data: info
            }]
        });
    }
}])