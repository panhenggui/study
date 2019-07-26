//Namespace.register("com.quantdo.orgClear.service");
Namespace.register("com.quantdo.orgClear.service");
com.quantdo.orgClear.service.SeatUserService = function(){
    this.find = function(callback,entity){
        framework.service.request('seatUserService', 'find',entity, function (errCode, errMsg, result) {
            if (errCode != 0) {
                layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result),{icon: 2});
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    };

    //改变席位连接状态
    this.changeSeatIsConnect = function (callback, entity, flag) {
        framework.service.request('seatUserService', 'changeSeatIsConnect', entity, flag, function (errCode, errMsg, result) {
            if(errCode > 0) {
                layer.confirm(errCode + ': ' + errMsg,{icon:2,btn:['关闭']});
                layer.closeAll('loading');
            }else if (callback !== undefined || callback != null) {
                callback(result);
            }
        });
    }

  //查询
    this.findSeatUserByquery = function (callback,entity,flag) {
      framework.service.request('seatUserService', 'findSeatUser',entity,flag, function (errCode, errMsg, result) {
          if (errCode > 0) {
              layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
          }
          if (callback !== undefined || callback != null) {
              callback(result);
          }
      });
  }


   //添加席位用户信息
   this.saveSeatUser = function (callback, entity,captchaCode) {
      framework.service.request('seatUserService', 'add', entity,captchaCode, function (errCode, errMsg, result) {
    	  if(errCode > 0) {
    		  layer.msg(errMsg,{icon: 2});
              callback(1);
          }
          if (callback !== undefined || callback != null) {
              callback(result);
          }
      });
   }

  //删除席位用户信息
   this.deleteSeatUser = function(callback,id) {
      framework.service.request('seatUserService', 'delete', id, function (errCode, errMsg, result) {
          if (errCode > 0) {
              console.error(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
          }
          if (callback !== undefined || callback != null) {
              callback(result);
          }
      });
  }


  //validateAccountSeatUserInfo
   this.validateAccountSeatUserInfo =function(callback, entity) {
      framework.service.request('seatUserService', 'validateAccountSeatUserInfo', entity, function (errCode, errMsg, result) {
          if (errCode > 0) {
              layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
          }
          if (callback !== undefined || callback != null) {
              callback(result);
          }
      });
  }



  //validateAccountSeatUserInfo
  this.updatePassword = function(callback, entity,captchaCode) {
    framework.service.request('seatUserService', 'updatePassword', entity,captchaCode, function (errCode, errMsg, result) {
    	 if (errCode > 0) {
         	layer.msg(errMsg,{icon: 2});
             callback(1);
         }
         if (callback !== undefined || callback != null) {
             callback(result);
         }
    });
  }
  
    this.checkSeat = function(callback, entity) {
	    framework.service.request('seatUserService', 'checkSeat', entity, function (errCode, errMsg, result) {
            if (errCode > 0) {
            	layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
            }
            if (callback !== undefined || callback != null) {
            	callback(result);
            }
        });
	}
    
}
