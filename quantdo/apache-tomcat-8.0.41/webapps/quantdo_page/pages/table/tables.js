myapp.controller('tablesController', function($scope, DTOptionsBuilder, DTColumnDefBuilder) {

    // init
    $scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notSortable(),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
        DTColumnDefBuilder.newColumnDef(5),
        DTColumnDefBuilder.newColumnDef(6).notSortable()
    ];

    getAllTestEntity(function(result) {
        $scope.testEntitys = result;
    });

    //删除
    $scope.delete = function(index){
        $scope.testEntitys.splice(index, 1);
    };

});
