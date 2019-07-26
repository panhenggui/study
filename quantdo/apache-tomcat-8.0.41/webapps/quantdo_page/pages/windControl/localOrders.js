/**
 * Created by Quantdo on 2016/6/6.
 */
myapp.controller('localOrdersController',function($scope,$rootScope) {
    //存储表格ID
    $scope.myID="#localOrders_table";

    //调用表格重绘函数
    $rootScope.setTabPaneScope($scope,"tabCallBackFunc");
    $scope.tabCallBackFunc = tabCallBackFunc;

    //存储表格中的数据
    $scope.dataset = [];

    //初始化本地报单表格
    $scope.getTable = function() {
        var columns_array = [
            {title: ""},
            {title: "账户编号"},//未作处理
            {title: "报单类型"},//未作处理
            {title: "合约代码"},//未作处理
            {title: "开平"},
            {title: "买卖"},
            {title: "投保"},
            {title: "价格"},
            {title: "报单量"},//未作处理
            {title: "报单状态"},
            {title: "风空单标识"}
        ];
        var table = initDataTables("localOrders_table", columns_array, $scope.dataset,200);
    }
    $scope.getTable();
})