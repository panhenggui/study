'use babel';

const electron = require('electron');
const app = electron.app;
const fs = require('fs');
//const unzip = require("unzip");
//const nconf = require("nconf");

const BrowserWindow = electron.BrowserWindow;

//主进程
const ipc = require('electron').ipcMain;


var downloadItem = null;
var downloadState = null;

/**
 * 打包时放开注释
 */
let path = app.getAppPath();
let resourcePath =path.substr(0, path.lastIndexOf('\\'));

var iniData = [];
fs.readFile(resourcePath.substr(0,resourcePath.lastIndexOf('\\')) + '\\config.ini','utf-8', function(err, data) {
    if(err) {
        global.frameworkConfig = {
            domain: 'http://127.0.0.1:8080',
            projectName: 'quantdo'
        };
    } else{
        /*iniData = data.split("=");
        console.log("hhh" + iniData[1]);
        global.frameworkConfig = {
            domain: iniData[1].substr(0,iniData[1].indexOf(";")).trim(),
            wsdomain: iniData[2].substr(0,iniData[2].indexOf(";")).trim(),
            projectName: iniData[3].substr(0,iniData[3].indexOf(";")).trim()
        };*/
        global.configArr = new Array();
        try{
            var configStr = "";
            //按行分组
            var fileConfig = data.split(/[\n\r]/);
            for(var i=0;i<fileConfig.length;i++){
                var tmpConfig = fileConfig[i];
                if(tmpConfig == undefined || tmpConfig==null || tmpConfig.trim()=="") continue;
                tmpConfig = tmpConfig.replace(/\t/g,'').trim();//去掉空格和tab
                if(tmpConfig.charAt(0)=="#")continue;
                configStr = configStr + tmpConfig;
            }
            iniData = configStr.split(",");
            for(var i=0;i<iniData.length;i++){
                var tmpIniData = iniData[i];
                if(tmpIniData == undefined || tmpIniData==null || tmpIniData.trim()=="") continue;
                var tmpIniData2 = tmpIniData.split("=");
                global.configArr.push({
                    id:i,
                    text:tmpIniData.split("{")[0],
                    domain:tmpIniData2[1].substr(0,tmpIniData2[1].indexOf(";")).trim(),
                    wsdomain: tmpIniData2[2].substr(0,tmpIniData2[2].indexOf(";")).trim(),
                    projectName: tmpIniData2[3].substr(0,tmpIniData2[3].indexOf(";")).trim()
                })
            }
            global.frameworkConfig = {
                domain: global.configArr[0].domain,
                wsdomain: global.configArr[0].wsdomain,
                projectName: global.configArr[0].projectName
            };
        }catch(e){
            dialog.showErrorBox('配置文件config.ini异常','');
            app.quit();
        }
    }
});

var loginWindow = null;
var flag = false;
app.on('ready',function(){
    loginWindow = new BrowserWindow({
        resizable:false,
        // x:0,
        // y:0,
        width: 600,
        height: 450,
        title:"登录",
        show:false,
        backgroundColor:"#fff",
        center:true
    });
    loginWindow.loadURL('file://' + __dirname + '/pages/login/clientLogin.html#/login?id=' + loginWindow.id); //主窗口
    //loginWindow.openDevTools();  //打开开发工具
    loginWindow.setMenu(null);
    loginWindow.on("close",function(){
        flag = false;
        var allWindows = BrowserWindow.getAllWindows();
        for(var i=0;i<allWindows.length;i++){
            if(allWindows[i].isVisible()){
                flag = true;
            }
        }
    });
    loginWindow.once('ready-to-show', () => {
        loginWindow.show()
    });
    loginWindow.on("closed",function(){
        loginWindow = null;
        if(flag){
            app.quit();
        }
    });
    //阻止原窗口的标题改变
    loginWindow.on("page-title-updated",function(event){
        event.preventDefault();
    });

});

var mainWindow = null;
ipc.on("menuPage",function(e,arg){
    // if (mainWindow == null){
        mainWindow = new BrowserWindow({
            //resizable:false,
            x:0,
            y:0,
            width: 1280,
            minWidth: 1000,
            height: 1024,
            minHeight: 600,
            //maxHeight: 200,
            title:"全球交易系统",
            // show:false,
            backgroundColor:"#fff"
            //movable:false
            // center:true
        });
        mainWindow.loadURL('file://' + __dirname + '/pages/index.html#/home?id=' + mainWindow.id); //主窗口
        // mainWindow.openDevTools();  //打开开发工具
        mainWindow.on("close",function() {
            flag = false;
            var allWindows = BrowserWindow.getAllWindows();
            for(var i=0;i<allWindows.length;i++){
                if(allWindows[i].isVisible()){
                    flag = true;
                }
            }
        });

        mainWindow.once('ready-to-show', () => {
            mainWindow.show()
        });
        mainWindow.on("closed",function(){
            mainWindow = null;
            if(flag){
                app.quit();
            }
        });
        //不显示菜单栏
        mainWindow.setMenu(null);
        //阻止原窗口的标题改变
        mainWindow.on("page-title-updated",function(event){
            event.preventDefault();
        });
   //  } else {
   //     mainWindow.show();
   // }
});

/**
 * 隐藏窗口
 */
ipc.on("hideWindow",function(e,windowID){
    if(windowID !== undefined){
        let currentWindow = BrowserWindow.fromId(windowID);
        if (currentWindow !== null){
            currentWindow.hide();
        }
    }
});

/**
 * 显示窗口
 */
ipc.on("showWindow",function(e,id){
    if(id !== undefined){
        let currentWindow = BrowserWindow.fromId(Number(id));
        if (currentWindow !== null){
            currentWindow.show();
        }
    }
});

/**
 * 关闭除登录页面以外的所有界面
 */
ipc.on("closeMainWindow",function(e){
    var allWindows = BrowserWindow.getAllWindows();
    for(var i=0;i<allWindows.length;i++){
        console.log(allWindows[i].webContents.getURL().split("?")[0].split("#/")[1]);
        if(allWindows[i].webContents.getURL().split("?")[0].split("#/")[1] !== "login"){
            allWindows[i].hide();
        }
        else{
            allWindows[i].show();
        }
    }
});

app.on('certificate-error', function (event, webContents, url, error, certificate, callback) {
    event.preventDefault();
    callback(true);
});
