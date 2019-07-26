/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('exceptionInformationController',function($scope,$rootScope) {
	//$scope.riskWarnResultService = new com.quantdo.orgClear.service.RiskWarnResultService();
    //存储表格中的数据
    $scope.dataset = [];
    $scope.myID = "#exceptionInformation_table";
    
    $rootScope.riskWay = clearConstant.riskWay;
    $rootScope.isFundOrRiskAccount = clearConstant.isFundOrRiskAccount;
    //获取所有异常提示信息
    getRiskWarnResult()
        .then(function(result){
            var con = result;
            for(var i=0;i<con.length;i++){
            	var action = "";
            	if(con[i].isHandled==0) action = "<a style='cursor:pointer;' class='riskWarnResultDel'>[处理]</a>";
                var tempArr = [con[i].id,con[i].instClientID,con[i].instClientAbbrName,con[i].warnDate,con[i].warnTime,$rootScope.judegIsFund($rootScope.isFundOrRiskAccount,con[i].tplID),con[i].shortProductName,$rootScope.getShowValue($rootScope.riskTypesRiskStrom,con[i].riskType),
                    $rootScope.getShowValue($rootScope.riskWay,con[i].cfgAction),con[i].warnInfo,$rootScope.getShowValue($rootScope.changeStates,con[i].isHandled),action,con[i].warnLevel,con[i].isHandled];
                $scope.dataset.push(tempArr);
            }
            $rootScope.getTableExceptionInforMation($scope.dataset);
    })
    //初始化异常提示表格
    $rootScope.getTableExceptionInforMation = function(dataset) {
        $("#exceptionInformation_table").DataTable({
            data: dataset,
            columns: $rootScope.exceptionInformation_columns_array,
            scrollY: 200,
            paging: false,
            retrieve: true,
            destroy: true,
            order: [[ 10, "desc" ],[ 4, "desc" ]],
            scrollX: true,
            dom: '<"top"Bf>rt<"bottom"ipl>',
            buttons: [
                  {
                      extend: 'excelHtml5',
                      text: '导出',
                      title: '异常预警信息',
                      exportOptions: { columns: [ 0, 1, 2, 3,4,5,6,7,8,9] }
                  }
            ],
            language: {
                emptyTable: "没有符合条件的记录",
                info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
                infoEmpty: "显示 0 条到 0 条 共 0 条记录",
                lengthMenu: "显示 _MENU_ 条 记录",
                search:      "搜索:"
            },
            createdRow: function ( row, data, index ) {
                if(data[13] == 0){
                    $("td", row).addClass("mybackRed");
                }
                else if(data[9].indexOf("恢复合理范围")>0){
                    $("td", row).addClass("mywhite");
                }
                else{
                    $("td", row).addClass("myyellow");
                }
            }
        });
        $rootScope.compLoad.push($scope.myID);
    };
    
    $("body").delegate("#exceptionInformation_table td .riskWarnResultDel","click",function(event){
    	 var table = $("#exceptionInformation_table").DataTable();
         var mytr = $(this).parents('tr');
         var tempArr = table.row(mytr).data();
         var delEntity = {};
         delEntity.id = tempArr[0];
         delEntity.instClientID = tempArr[1];
         delEntity.fundProductID = tempArr[6];
         dealRisk(function(result) {
        	 getRiskWarnResult()
             .then(function(result){
                var con = result;
           	 $scope.exceptionInformation_dataset = [];
                for(var i=0;i<con.length;i++){
                	var action = "";
                	if(con[i].isHandled==0) action = "<a style='cursor:pointer;' class='riskWarnResultDel'>[处理]</a>";
                    var tempArr = [con[i].id,con[i].instClientID,con[i].instClientAbbrName,con[i].warnDate,con[i].warnTime,$rootScope.judegIsFund($rootScope.isFundOrRiskAccount,con[i].tplID),con[i].shortProductName,$rootScope.getShowValue($rootScope.riskTypesRiskStrom,con[i].riskType),
                        $rootScope.getShowValue($rootScope.riskWay,con[i].cfgAction),con[i].warnInfo,$rootScope.getShowValue($rootScope.changeStates,con[i].isHandled),action,con[i].warnLevel,con[i].isHandled];
                    $scope.exceptionInformation_dataset.push(tempArr);
                }
               	 destroyDatatable("exceptionInformation_table");
                 $rootScope.getTableExceptionInforMation($scope.exceptionInformation_dataset);
               
               /* var exception_table = $("#exceptionInformation_table").DataTable();
                exception_table.clear().draw();
                exception_table.rows.add($scope.exceptionInformation_dataset).draw();*/
             });
         }, delEntity);
    });
})