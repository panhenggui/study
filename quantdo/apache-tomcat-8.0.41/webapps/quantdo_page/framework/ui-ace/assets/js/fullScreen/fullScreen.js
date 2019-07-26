/**
 * Created by Quantdo on 2016/7/7.
 */
var EventUtil = {
    addHandler : function(element,type,handler){
        if(element.addEventListener){//检测传入的元素是否存在Dom2级方法
            element.addEventListener(type,handler,false);//false表示冒泡阶段
        }
        else if(element.attachEvent){//检测传入的元素是否是IE的方法
            element.attachEvent("on" + type,handler);
        }
        else{//DOM 0级方法
            element["on"+type] = handler;
        }
    },
    getEvent:function(event){
        return event?event:window.event;//返回对象的引用
    },
    getTarget: function(event){
        return event.target || event.srcElement;//返回对象的目标
    },
    preventDefault: function(event){
        if(event.preventDefault){
            event.preventDefault();
        }
        else{
            event.returnValue = false;
        }
    },
    stopPropagation: function(event){
        if(event.stopPropagation){
            event.stopPropagation(event);
        }
        else{
            event.cancelBubble = true;
        }
    },
    removeHandler: function(element,type,handler){
        if(element.removeEventListener){
            element.removeEventListener(type,handler.false);
        }
        else if(element.detachEvent){
            element.detachEvent("on"+type,handler);
        }
        else{
            element["on"+type] = null;
        }
    }
};
EventUtil.addHandler(document,"readystatechange",function(event){
    if(document.readyState != "complete"){
        //alert("页面尚未完全加载");
    }
})

//浏览器全屏
function launchFullscreen(element) {
    var fullState = fullscreen();
    if(fullState){
        exitFullscreen();
    }
    else
    {
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
}

//退出全屏
function exitFullscreen() {
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

//当前全屏状态
function fullscreen() {
    return document.fullscreen ||
        document.webkitIsFullScreen ||
        document.mozFullScreen ||
        false;
}