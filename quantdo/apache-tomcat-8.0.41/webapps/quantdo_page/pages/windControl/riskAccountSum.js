/**
 * Created by Quantdo on 2016/7/14.
 */
myapp.controller('riskAccountSumController',function($scope,$rootScope) {
    //保存表格中的数据
    $scope.riskAccount_dataset = [];

    //存储表格ID
    $scope.myID="#riskAccountSum_table";

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;
    //init datatable
    $scope.riskAccountSumInitDataTables = function(table_id, table_columns, table_data,height,orderFlag){
        return $("#" + table_id).DataTable({
            data : table_data,
            columns :table_columns,
            scrollY: height,
            paging: false,
            retrieve: true,
            destroy:true,
            autoWidth: false,
            //fixedColumns:   {
            //    leftColumns: fixedColumns
            //},
            scrollX: true,
            dom : 'rt<"bottom"ipl>',
            ordering: !orderFlag,
            //paging:   false,
            //pagingType: "full_numbers",
            language: {
                emptyTable: "没有符合条件的记录",
                info: "显示 _START_ 条到 _END_ 条 共 _TOTAL_ 条记录",
                infoEmpty: "显示 0 条到 0 条 共 0 条记录",
                lengthMenu: "显示 _MENU_ 条 记录"
                //paginate: {
                //    first: "首页",
                //    last: "末页",
                //    next: "下一页",
                //    previous: "上一页"
                //}
            },
            createdRow: function ( row, data, index ) {
                if (data[4] == "买") {
                    $("td", row).eq(4).addClass("myred");
                }
                else if (data[4] == "卖") {
                    $("td", row).eq(4).addClass("mygreen");
                }
                else{
                    $("td", row).eq(4).addClass("myblack");
                }
            }
        });
    }
    //从数据库中获取风控账户总持仓的信息
    getRiskAccountSum("")
        .then(function(result){
            var con = result;
            for(var i=0;i<con.length;i++){
                var tempArr = [con[i].brokerID,con[i].brokerName,con[i].exchID,con[i].instrumentID,$rootScope.getShowValue($rootScope.tradeDirection,con[i].direction),con[i].position];
                $scope.riskAccount_dataset.push(tempArr);
            }
            $scope.riskAccountSumInitDataTables("riskAccountSum_table",$rootScope.riskAccountSum,$scope.riskAccount_dataset,180);
            $rootScope.compLoad.push($scope.myID);
        });
})