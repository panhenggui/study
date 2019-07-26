Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.FixedIncomeSetService = function(){	
	this.findAll = function(callback){
	    framework.service.request('fixedIncomeSetService', 'findAll', function (errCode, errMsg, result) {	        
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });		
	}

}

function getAllFixedIncomeSetEntity(callback) {
    framework.service.request('fixedIncomeSetService', 'getAllFixedIncomeSetEntity',function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function findByFixedIncomeSetEntity(callback,fundProduct) {
    framework.service.request('fixedIncomeSetService', 'findByFixedIncomeSetEntity',fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//新增从重复
function findByFixedIncomeSetEntityQuer(callback,fundProduct) {
    framework.service.request('fixedIncomeSetService', 'findByFixedIncomeSetEntityQuer',fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function removeFixedIncomeSet(callback,fundProduct)
{
    framework.service.request('fixedIncomeSetService', 'delete', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function updateFixedIncomeSet(callback,fundProduct)
{
    framework.service.request('fixedIncomeSetService', 'update', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function saveFixedIncomeSet(callback,fundProduct)
{
    framework.service.request('fixedIncomeSetService', 'add', fundProduct, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
function findFixedIncomeEntity(callback,FixedIncomeEntity)
{
    framework.service.request('fixedIncomeSetService', 'findFixedIncomeEntity', FixedIncomeEntity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function insertFixedIncome(callback,fixedIncomeEntity)
{
    framework.service.request('fixedIncomeSetService', 'insertFixedIncome', fixedIncomeEntity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg, {
				icon : 2,
				time : 3000
			});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//查 生效日期 应在产品有效期内

function findProduceByStartDate(callback,entity)
{
    framework.service.request('fixedIncomeSetService', 'findProduceByStartDate', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function findProduceByProductId(callback,entity)
{
    framework.service.request('fixedIncomeSetService', 'findProduceByProductId', entity, function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}





