Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.ExerciseTradeService = function(){


}

function findExerciseTradeByCondition(entity,callback) {
    framework.service.request('exerciseTradeService', 'findByCondition',entity, function (errCode, errMsg, result) {

        if (errCode > 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function addExerciseTrade(trade,feeList,callback) {
    framework.service.request('exerciseTradeService', 'add', trade,feeList,function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errMsg,{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        }
    });
}




function updateExerciseTrade(object,feeList,callback) {
    framework.service.request('exerciseTradeService', 'update', object,feeList, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errMsg,{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        }        
    });
    
}



function deleteExerciseTrade(id,callback) {
    framework.service.request('exerciseTradeService', 'delete', id, function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        	return false;
        }
        if (callback !== undefined || callback != null) {        	
            callback(result);
        } 
    });
}
