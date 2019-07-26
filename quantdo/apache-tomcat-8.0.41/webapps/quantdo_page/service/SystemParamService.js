/**
 * Created by user on 2015/8/15.
 */

(function ($) {
    $.SystemParams = function () {
        this.getOperatorInfo = function (callback) {
            framework.service.request('importTradeService', 'getOperator', function (errCode, errMsg, result) {
                if (errCode > 0) {
                    layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
                }
                if (callback !== undefined || callback != null) {
                    callback(result);
                }
            });
        };
        this.showMsg = function (code) {
            var msg = this.getInfo(code);
            if (msg == "") {
                msg = "系统处理失败";
            }
            layer.msg(msg, {icon: 2, time: 2000});
        };

        // 定义异常信息
        var msgMap = {};
        msgMap[1003] = "不能重复添加";
        msgMap[1007] = "违反唯一约束";
        msgMap[2001] = "文件格式不正确，请导入txt格式的文件";
        msgMap[2002] = "文件格式不正确，请导入csv格式的文件";
        this.getInfo = function (errorCode) {
            return msgMap[errorCode];
        };
    };
})(jQuery);
var jqueryConst = new $.SystemParams();


String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substring(this.length - s.length) == s)
        return true;
    else
        return false;
    return true;
};

/**
 * 定义回车事件
 * @param e
 */
/*function myKeyup(e, o) {
    if (e.keyCode == 13) {
        var tag = getTagByTab(parseInt(o.getAttribute("tab")) + 1);
        if (tag) {
            tag.focus();
            if (tag.tagName == "INPUT") {
                //tag.select();
            }
            return false;
        }
    }
}*/

function kEvent(e, o) {
    if (e.keyCode == 32) {
    	var str = o.value;
    	o.value = '';
    	for(var i = 0;i < str.length;i++){
    		o.value += str[i].replace(/(^\s*)|(\s*$)/g, '');
    	}
    }
}


function getTagByTab(t) {
//    var inputs = document.getElementsByTagName("input");
//    for (var i = 0; i < inputs.length; i++) {
//        if (inputs[i].getAttribute("tab") == t)
//            return inputs[i];
//    }
//    var selects = document.getElementsByTagName("select");
//    for (var i = 0; i < selects.length; i++) {
//        if (selects[i].getAttribute("tab") == t)
//            return selects[i];
//    }
//    return false;

    var spans = document.getElementsByTagName("span");
    for (var j = 0; j < spans.length; j++) {
        if (spans[j].getAttribute("tab") == t)
            return spans[j];
    }

    var inputs = $(":input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute("tab") == t)
            return inputs[i];
    }
    return false;
}
