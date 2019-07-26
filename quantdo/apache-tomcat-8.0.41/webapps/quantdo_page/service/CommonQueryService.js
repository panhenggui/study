/**
 * Created by lihj on 2015/8/4.
 */
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.CommonQueryService = function(){	
	this.getAllExchanges = function(callback) {
	    framework.service.request('exchangeService', 'findAll', function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
	
	this.getTradeInfo = function(callback) {
	    framework.service.request('subAccountCapitalService', 'findByConditions', function (errCode, errMsg, result) {
	    	if (errCode != 0) {            
	            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
	    	}else if (callback !== undefined || callback != null) {
	            callback(result);
	        }
	    });
	}
}

//查询资产单元资金
function getCapitalFromSubAccount(callback, entity) {
    framework.service.request('subAccountCapitalService', 'findByQuery', entity.settleDate, entity.traderID, entity.accountID, entity.currency, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//查询资产单元资金
function getSubAccountCapitalBysubAccountIDEntity(subAccountID, callback) {
    framework.service.request('subAccountCapitalService', 'findBySubAccountIDQuery', subAccountID, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getAllSubAccount(callback) {
    framework.service.request('subCapitalAccountService', 'findAll', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getAllAccounts(callback) {
    framework.service.request('capitalAccountService', 'findAll', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//查询账户资金
function getCapitalFromAccount(callback, entity) {
    framework.service.request('accountCapitalQueryService', 'findByQueryCondition', entity.settleDate, entity.accountID, entity.currency, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据交易所ID查询对应的产品信息
function getProductByExchID(callback, entity) {
    framework.service.request('productService', 'findByCondition', entity, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//根据交易所ID查询对应的合约信息
function getInstrumentByExchID(callback, entity) {
    framework.service.request('instrumentService', 'findByCondition', entity, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


//根据产品ID查询产品对应的所有合约信息
function getInstrumentByProductID(callback, entity) {
    framework.service.request('instrumentService', 'findByProductID', entity.productID,entity.productType, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//查询资金账户持仓信息
function getPosition(callback,entity)
{
    framework.service.request('positionQueryService', 'findByQueryCondition', entity.settleDate, entity.accountID, entity.currency, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//查询到期合约持仓信息
function getDuePosition(callback,entity)
{
    framework.service.request('dueSubPositionQueryService', 'findByCondition', entity.settleDate,entity.productID,entity.delivDate, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

//查询资产单元持仓
function getSubPosition(callback,entity)
{
    framework.service.request('SubPositionService', 'findByQuery', entity.settleDate,entity.traderID,entity.accountID,entity.currency, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function queryTradeInfo(callback,entity)
{
    framework.service.request('tradeService', 'findByCondition', entity, function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function queryHoldDates(callback)
{
    framework.service.request('importTradeService', 'findAllHoldDates', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function queryFunds(callback)
{
    framework.service.request('importTradeService', 'findAllFundDates', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function queryUserTrade(callback)
{
    framework.service.request('userTraderService', 'findAll', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getTradeInfo(callback,entity) {
    framework.service.request('tradeService', 'findByConditions',entity, function (errCode, errMsg, result) {
    	if (errCode != 0) {            
            layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
    	}else if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function getMenuPermission(callback)
{
    framework.service.request('queryIndexMenuPermissionService', 'getMenuPermission', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function queryAmType(callback)
{
    framework.service.request('queryIndexMenuPermissionService', 'queryAmType', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function queryInstClientID(callback)
{
    framework.service.request('queryIndexMenuPermissionService', 'queryInstClientID', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

/**
 * 获取机构简称显示页面
 * @param callback
 */
function queryInstShortName(callback)
{
    framework.service.request('queryIndexMenuPermissionService', 'queryInstShortName', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}
/**
 * 获取机构简称显示页面
 * @param callback
 */
function findAllPersonInfor(callback)
{
    framework.service.request('comIndexShowService', 'findAllPersonInfor', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function findRoleId(callback)
{
    framework.service.request('comIndexShowService', 'findRoleId', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}


function logOutInsertLog(callback)
{
    framework.service.request('comIndexShowService', 'logOutInsertLog', function (errCode, errMsg, result) {
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function checkPassword(callback)
{
	framework.service.request('comIndexShowService', 'checkPassword', function (errCode, errMsg, result) {
        if (errCode > 0) {
        	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

function indexChangePwd(callback,oldPwd,newPwd,validcode)
{
    framework.service.request('ssoUserService', 'indexChangePwd', oldPwd, newPwd,validcode, function (errCode, errMsg, result) {
    	if (errCode == 6){
        	layer.msg(errMsg,{icon: 2});
        	callback(1);
        }else if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
            callback(1);
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

/**
 *  查询当前交易日
 * @param callback
 */
function generateHisData(callback)
{
    framework.service.request('otherIncomeSetService', 'generateHisData', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}

/**
 * 查询操作员
 */
function getUserName(callback)
{
    framework.service.request('queryIndexMenuPermissionService', 'getUserName', function (errCode, errMsg, result) {
        if (errCode > 0) {
            layer.msg(errMsg,{icon: 2});
        }
        if (callback !== undefined || callback != null) {
            callback(result);
        }
    });
}




/**
 *  更换金额汉字显示
 * @param callback
 */
function changeMoneyToChinese( money ){
	var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); // 汉字的数字
	var cnIntRadice = new Array("","拾","佰","仟"); // 基本单位
	var cnIntUnits = new Array("","万","亿","兆"); // 对应整数部分扩展单位
	var cnDecUnits = new Array("角","分","毫","厘"); // 对应小数部分单位
	var cnInteger = "整"; // 整数金额时后面跟的字符
	var cnIntLast = "元"; // 整型完以后的单位
	var maxNum = 999999999999999.9999; // 最大处理的数字
	
	var IntegerNum; // 金额整数部分
	var DecimalNum; // 金额小数部分
	var ChineseStr=""; // 输出的中文金额字符串
	var parts; // 分离金额后用的数组，预定义
	
	if( money == "" ){
		return "";
	}
	
	money = parseFloat(money);
	if( money >= maxNum ){
		layer.msg("超出最大处理数字",{icon:2});
		return "";
	}
	if( money == 0 ){
		ChineseStr = cnNums[0]+cnIntLast+cnInteger;
		return ChineseStr;
	}
	money = money.toString(); // 转换为字符串
	if( money.indexOf(".") == -1 ){
		IntegerNum = money;
		DecimalNum = '';
	}else{
		parts = money.split(".");
		IntegerNum = parts[0];
		DecimalNum = parts[1].substr(0,4);
	}
	if( parseInt(IntegerNum,10) > 0 ){// 获取整型部分转换
		zeroCount = 0;
		IntLen = IntegerNum.length;
	    for( i=0;i<IntLen;i++ ){
	    	n = IntegerNum.substr(i,1);
	    	p = IntLen - i - 1;
	    	q = p / 4;
	    	m = p % 4;
	    if( n == "0" ){
	    	zeroCount++;
	    }else{
	    	if( zeroCount > 0 ){
	    		ChineseStr += cnNums[0];
	    	}
	    	zeroCount = 0; // 归零
	    	ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
	    }
		    if( m==0 && zeroCount<4 ){
		    	ChineseStr += cnIntUnits[q];
		    }
	    }
	ChineseStr += cnIntLast;
	// 整型部分处理完毕
	}
	if( DecimalNum!= '' ){// 小数部分
		decLen = DecimalNum.length;
	    for( i=0; i<decLen; i++ ){
	    	n = DecimalNum.substr(i,1);
		    if( n != '0' ){
		    	ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
		    }
	    }
	}
	if( ChineseStr == '' ){
		ChineseStr += cnNums[0]+cnIntLast+cnInteger;
	}
	else if( DecimalNum == '' ){
		ChineseStr += cnInteger;
	}
	return ChineseStr;
}



