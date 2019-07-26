/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('currentPositionController',function($scope,$rootScope) {

    //存储表格ID
    $scope.myID="#currentPosition_table";

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    $scope.dataset = [];//存储表格中的数据
  //init datatable
    $scope.currentPositioninitDataTables = function(table_id, table_columns, table_data,height,orderFlag){
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
                if (data[5] == "买") {
                    $("td", row).eq(5).addClass("myred");
                }
                else if (data[5] == "卖") {
                    $("td", row).eq(5).addClass("mygreen");
                }
                else{
                    $("td", row).eq(5).addClass("myblack");
                }
            }
        });
    }
    //初始化当前持仓对应的表格
    $scope.getTable = function(){
    	$scope.currentPositioninitDataTables("currentPosition_table",$rootScope.currentPosition_columns_array,$scope.dataset,180);
    };
    $scope.getTable();
})