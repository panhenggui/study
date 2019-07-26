function userLogon(userName, passwd, callback,validcode) {

    framework.permission.logon(userName, passwd, function (errCode, errMsg) {
    	 if (errCode == 0) {
             callback(0);
             return;
         } else {
         	callback(errCode);
         }
        console.error("logon:" + errCode + " " + errMsg);

    },validcode,null);
}

function userLogout() {
    framework.permission.logout(function (errCode, errMsg) {

        if (errCode == 0) {

            if(window.localStorage.getItem("ipadress")){
                // const electron = window.require('electron');
                // const {ipcRenderer} = electron;
                // ipcRenderer.send("closeMainWindow");
            }else{
                window.location.href = "login/login.html";
            }
        }else{
            callback(false);
        }
        console.error("logout:" + errCode + " " + errMsg);
    });
}

