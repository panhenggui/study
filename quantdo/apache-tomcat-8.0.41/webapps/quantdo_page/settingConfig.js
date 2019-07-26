/**
 * Created by QD_zengta on 2016/9/23.
 *
 * 设置的配置文件
 *
 */

'use strict';

const electron = require('electron');
var app = electron.app;
let configDir = app.getPath('userData');

var nconf = require('nconf').file({file: configDir + '/hotKeySetting.json'});

function saveSettings(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    nconf.save();
}

function readSettings(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
}

module.exports = {
    saveSettings: saveSettings,
    readSettings: readSettings
};