/**
 * Created by Quantdo on 2016/5/19.
 */
myapp.controller("mymenuController",function($scope,$rootScope){

	/*getBrokerIDAndBrokerName(function(result){
        if(result.amType == "1"){
        	$rootScope.myriskAccountRiskControl = false;
        }
        if(result.amType == "2"){
        	$rootScope.myriskAccountRiskControl = true;
        }
        if(result.isSuperRisker == "0"){
        	$rootScope.isSuperRisker = false;
        }
        if(result.isSuperRisker == "1"){
        	$rootScope.isSuperRisker = true;
        }
	});*/
    var controlMenu = document.getElementById("control-menu").childNodes;
    
    //当由风险监控切换到风控设置页面时，不需要先点风控设置，再点击里面的菜单，可以直接点击菜单
    $rootScope.changeTabToTab = function(){
    	var sid = '#myfunc-system';
    	var fgid = '#riskManagement';
    	var sgid = '#riskControl';
    	var tgid = '#riskParameters';
    	var rgid = '#tradeRightManage';
    	var rqid = '#riskQueryMange';
    	
    	if(!($(sid).hasClass("menu-style"))){
            $(sid).addClass("menu-style");
            $($(sid)[0].childNodes[0]).removeClass("myopacity");
        }
        if(!($(tgid).hasClass("menu-style"))){
            $(tgid).addClass("menu-style");
            $($(tgid)[0].childNodes[0]).removeClass("myopacity");
        }

        $(fgid).removeClass("hidden");
        $(sgid).addClass("hidden");
        $(rgid).addClass("hidden");
        $(tgid).addClass("hidden");
        $(rqid).addClass("hidden");
        if(!$("#timer-right").hasClass("hidden")){
            $("#timer-right").addClass("hidden");
        }
        //关闭轮询
        $rootScope.stopTimer = false;
        clearTimeout($rootScope.timer);
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    }
    
    $rootScope.changeTabToTabForTradeRight = function(){
    	var sid = '#myfunc-tradeRight';
    	var fgid = '#tradeRightManage';
    	var sgid = '#riskManagement';
    	var tgid = '#riskParameters';
    	var rgid = '#riskControl';
    	var rqid = '#riskQueryMange';
    	
    	if(!($(sid).hasClass("menu-style"))){
            $(sid).addClass("menu-style");
            $($(sid)[0].childNodes[0]).removeClass("myopacity");
        }
        if(!($(tgid).hasClass("menu-style"))){
            $(tgid).addClass("menu-style");
            $($(tgid)[0].childNodes[0]).removeClass("myopacity");
        }

        $(fgid).removeClass("hidden");
        $(sgid).addClass("hidden");
        $(rgid).addClass("hidden");
        $(tgid).addClass("hidden");
        $(rqid).addClass("hidden");
        //关闭轮询
        if(!$("#timer-right").hasClass("hidden")){
            $("#timer-right").addClass("hidden");
        }
        $rootScope.stopTimer = false;
        clearTimeout($rootScope.timer);
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    }
    
    $rootScope.changeTabToTabForriskQuery = function(){
    	var sid = '#myfunc-riskQuery';
    	var fgid = '#tradeRightManage';
    	var sgid = '#riskManagement';
    	var tgid = '#riskParameters';
    	var rgid = '#riskControl';
    	var rqid = '#riskQueryMange';
    	
    	if(!($(sid).hasClass("menu-style"))){
            $(sid).addClass("menu-style");
            $($(sid)[0].childNodes[0]).removeClass("myopacity");
        }
        if(!($(tgid).hasClass("menu-style"))){
            $(tgid).addClass("menu-style");
            $($(tgid)[0].childNodes[0]).removeClass("myopacity");
        }

        $(fgid).addClass("hidden");
        $(sgid).addClass("hidden");
        $(rgid).addClass("hidden");
        $(tgid).addClass("hidden");
        $(rqid).removeClass("hidden");
        //关闭轮询
        if(!$("#timer-right").hasClass("hidden")){
            $("#timer-right").addClass("hidden");
        }
        $rootScope.stopTimer = false;
        clearTimeout($rootScope.timer);
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();
    }
    

    $scope.controlStyle = function(sid,fgid,sgid,rgid,rqid,tgid){
        if(!($(sid).hasClass("menu-style"))){
            $(sid).addClass("menu-style");
            $($(sid)[0].childNodes[0]).removeClass("myopacity");
        }
        if(!($(tgid).hasClass("menu-style"))){
            $(tgid).addClass("menu-style");
            $($(tgid)[0].childNodes[0]).removeClass("myopacity");
        }

        $(fgid).removeClass("hidden");
        $(sgid).addClass("hidden");
        $(rgid).addClass("hidden");
        $(tgid).addClass("hidden");
        $(rqid).addClass("hidden");
        
        $.fn.dataTable.tables( { visible: true, api: true } ).columns.adjust();

        for(var i=0;i<controlMenu.length;i++){
            if(controlMenu[i].nodeType == 1){
                if($(controlMenu[i])[0].childNodes[1].id != sid.substring(1,sid.length)){
                    $($(controlMenu[i])[0].childNodes[1]).removeClass("menu-style");
                    $($(controlMenu[i])[0].childNodes[1].childNodes[0]).addClass("myopacity");
                }
            }
        }
        $("#" + sessionStorage.listBrokerID+sessionStorage.listFundID).addClass("visitedA");

        if(sid == "#myfunc-show"){
            $("#timer-right").removeClass("hidden");
            var mytable = document.getElementById("riskFundTab");
            var outerContainer = document.getElementById("riskFundPar");
            outerContainer.removeChild(mytable);
            var newContainer = document.createElement("div");
            newContainer.id = "riskFundTab";
            newContainer.innerHTML = "<table id='getRiskFundNetResult_table' class='cell-border stripe' cellspacing='0' width='100%'></table>";
            outerContainer.appendChild(newContainer);
            //$("#getRiskFundNetResult_table").DataTable().destroy();
            setTimeout(function(){
                getRiskFundNetResult()
                    .then(function(result){
                        $scope.columns_array = [
							{ title: "机构代码"},
							{ title: "机构简称"},
                            { title: "产品代码"},
                            { title: "产品简称"},
                            { title: "单位净值"},
                            { title: "产品净值"},
                            { title: "当日涨跌幅"},
                            { title: "预警线"},
                            { title: "止损线"},
                            { title: "单位净值档位"},
                            { title: "净值日期"},
                            { title: "净值时间"}
                        ];
                        if(result.length>0){
                            var dtlidxlist = result[0].dtlidxlist;
                            for(var i=0;i<dtlidxlist.length;i++){
                                var tplName = {title:dtlidxlist[i].tplName};
                                var tplNameVaue = {title:dtlidxlist[i].tplNameVaue};
                                $scope.columns_array.push(tplNameVaue);
                                $scope.columns_array.push(tplName);
                            }
                        }
                        var con = result;
                        $scope.dataset = [];
                        for(var i=0;i<con.length;i++){
                            var tempArr = [con[i].brokerID,con[i].instClientAbbrName,con[i].fundProductID,con[i].fundProductName,parseFloat(con[i].unitNetValue).toFixed(4),parseFloat(con[i].fundNetValue).toFixed(2),
                                           $rootScope.changeUpDownRatio(con[i].upDownRatio),$rootScope.changeWarnLevelAndStopLossLevel(con[i].warnLevel),$rootScope.changeWarnLevelAndStopLossLevel(con[i].stopLossLevel),
                                           con[i].netValueLevel,con[i].netDate,con[i].netTime];
                            for(var j=0;j<con[i].dtlidxlist.length;j++){
                                var threshold = con[i].dtlidxlist[j].threshold;
                                var riskvalue = con[i].dtlidxlist[j].riskvalue;
                                //if(riskvalue>=threshold){
                                //    var myrowAndTd = {};
                                //    myrowAndTd.myrow = i;
                                //    myrowAndTd.mytd = j;
                                //    $rootScope.needHighlight.push(myrowAndTd);
                                //}
                                if(threshold != null){
                                    threshold = parseFloat(threshold).toFixed(2) + "%";
                                }
                                if(riskvalue != null){
                                    riskvalue = parseFloat(riskvalue).toFixed(2) + "%";
                                }
                                tempArr.push(threshold);
                                tempArr.push(riskvalue);
                            }
                            $scope.dataset.push(tempArr);
                        }
                        $scope.$apply();
                        $("#getRiskFundNetResult_table").DataTable({
                            data : $scope.dataset,
                            columns :$scope.columns_array,
                            scrollY: true,
                            paging: false,
                            fixedColumns:   {
                                leftColumns: 10
                            },
                            retrieve: true,
                            destroy:true,
                            scrollX: true,
                            order: [ 4, "asc" ],
                            dom : 'rt<"bottom"ipl>',
                            language: {
                                emptyTable: "没有符合条件的记录",
                                info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
                                infoEmpty: "显示 0 条到 0 条 共 0 条记录",
                                lengthMenu: "显示 _MENU_ 条 记录"
                            },
                            createdRow: function ( row, data, index ) {  
                            	var unitNetValueIndex = 4;  //单位净值
                            	var upDownRatioIndex = 6;   //涨跌幅
                            	var warnLevelIndex = 7;     //预警线
                            	var stopLossLevelIndex = 8; //止损线
                            	if(data[unitNetValueIndex]!=null&&data[unitNetValueIndex]!=""&&data[stopLossLevelIndex]!=null&&data[stopLossLevelIndex]!=""&&data[warnLevelIndex]!=null&&data[warnLevelIndex]!=""){
                            		if(parseFloat(data[unitNetValueIndex]).toFixed(4)-parseFloat(data[stopLossLevelIndex]).toFixed(4)<=0){
                            			 $("td", row).eq(unitNetValueIndex).addClass("mybackRed");
                            		}else if(parseFloat(data[unitNetValueIndex]).toFixed(4)-parseFloat(data[warnLevelIndex]).toFixed(4)<=0){
                            			 $("td", row).eq(unitNetValueIndex).addClass("myyellow");
                            		}else{
                            			$("td", row).addClass("mywhite");
                            		}
                            	}else if(data[unitNetValueIndex]!=null&&data[unitNetValueIndex]!=""&&data[warnLevelIndex]!=null&&data[warnLevelIndex]!=""&&(data[stopLossLevelIndex]==null||data[stopLossLevelIndex]=="")){
                            		if(parseFloat(data[unitNetValueIndex]).toFixed(4)-parseFloat(data[warnLevelIndex]).toFixed(4)<=0){
                            			 $("td", row).eq(unitNetValueIndex).addClass("myyellow");
                            		}else{
                            			$("td", row).addClass("mywhite");
                            		}
                            	}else if(data[unitNetValueIndex]!=null&&data[unitNetValueIndex]!=""&&data[stopLossLevelIndex]!=null&&data[stopLossLevelIndex]!=""&&(data[warnLevelIndex]==null||data[warnLevelIndex]=="")){
                            		if(parseFloat(data[unitNetValueIndex]).toFixed(4)-parseFloat(data[stopLossLevelIndex]).toFixed(4)<=0){
                            			 $("td", row).eq(unitNetValueIndex).addClass("mybackRed");
                            		}else{
                            			$("td", row).addClass("mywhite");
                            		}
                            	}else{
                            		$("td", row).addClass("mywhite");
                            	}
                            	//涨跌幅字体颜色
                            	if(data[upDownRatioIndex]!=null&&data[upDownRatioIndex]!=""&&data[upDownRatioIndex].substring(0,data[upDownRatioIndex].length-1)>0){
                            		 $("td", row).eq(upDownRatioIndex).addClass("myred");
                            	}else if(data[upDownRatioIndex]!=null&&data[upDownRatioIndex]!=""&&data[upDownRatioIndex].substring(0,data[upDownRatioIndex].length-1)<0){
                            		$("td", row).eq(upDownRatioIndex).addClass("mygreen");
                            	}else{
                            		$("td", row).eq(upDownRatioIndex).addClass("myblack");
                            	}
                            	//占比，阈值字体颜色
                                for(var i=13;i<data.length;){
                                    if(data[i] != null && parseFloat(data[i].substring(0,data[i].length-1))>=parseFloat(data[i-1].substring(0,data[i-1].length-1))){
                                        $("td", row).eq(i).addClass("myred");
                                    }
                                    else{
                                        $("td", row).eq(i).removeClass("myred");
                                    }
                                    i = i+2;
                                }
                            }
                        });
                        //$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
                    });
            },"200");
            //clearTimeout(sessionStorage.timer);
            if($rootScope.stopTimerFlag){
                $rootScope.timer = setTimeout(function(){
                    $rootScope.stopTimer = true;
                    $rootScope.circleFunc();
                },sessionStorage.newSetTimer);
            }
        }

        //关闭轮询
        if(sid == "#myfunc-system"){
            if(!$("#timer-right").hasClass("hidden")){
                $("#timer-right").addClass("hidden");
            }
            $rootScope.stopTimer = false;
            clearTimeout($rootScope.timer);
        }
        
        if(sid == "#myfunc-tradeRight"){
            if(!$("#timer-right").hasClass("hidden")){
                $("#timer-right").addClass("hidden");
            }
            $rootScope.stopTimer = false;
            clearTimeout($rootScope.timer);
        }
        
        if(sid == "#myfunc-purview-system"){
            if(!$("#timer-right").hasClass("hidden")){
                $("#timer-right").addClass("hidden");
            }
            $rootScope.stopTimer = false;
            clearTimeout($rootScope.timer);
        }
        
        if(sid == "#myfunc-riskQuery"){
            if(!$("#timer-right").hasClass("hidden")){
                $("#timer-right").addClass("hidden");
            }
            $rootScope.stopTimer = false;
            clearTimeout($rootScope.timer);
        }
    };
})