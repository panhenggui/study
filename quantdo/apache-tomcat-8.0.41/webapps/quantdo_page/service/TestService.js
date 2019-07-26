function getAllTestEntity(callback) {

    //framework.service.request('testService', 'getAllTestEntity', function(errCode, errMsg, result) {
    //
    //    if(errCode > 0) {
    //        layer.msg(errCode + ': ' + errMsg + '\n' + JSON.stringify(result));
    //    }
    //
    //    if(callback !== undefined || callback != null) {
    //        callback(result);
    //    }
    //
    //});
//

    callback([
        {domain:"app1.com",price:45,clicks:3330,update:'Feb 12',status:'Expiring'},
        {domain:"base.com",price:35,clicks:2595,update:'Feb 18',status:'Registered'},
        {domain:"max.com",price:60,clicks:4400,update:'Mar 11',status:'Expiring'},
        {domain:"best.com",price:75,clicks:6500,update:'Apr 03',status:'Flagged'},
        {domain:"pro.com",price:55,clicks:4250,update:'Jan 21',status:'Registered'},
        {domain:"team.com",price:40,clicks:3200,update:'Feb 09',status:'Flagged'},
        {domain:"up.com",price:95,clicks:8520,update:'Feb 22',status:'Sold'},
        {domain:"view.com",price:45,clicks:4100,update:'Mar 12',status:'Registered'},
        {domain:"nice.com",price:38,clicks:3940,update:'Feb 12',status:'Sold'},
        {domain:"fine.com",price:25,clicks:2983,update:'Apr 01',status:'Expiring'},
        {domain:"good.com",price:50,clicks:6500,update:'Feb 02',status:'Flagged'},
        {domain:"great.com",price:55,clicks:6400,update:'Feb 24',status:'Registered'},
        {domain:"shine.com",price:25,clicks:2200,update:'Apr 01',status:'Flagged'},
        {domain:"rise.com",price:42,clicks:3900,update:'Feb 01',status:'Sold'},
        {domain:"above.com",price:35,clicks:3420,update:'Mar 12',status:'Expiring'},
        {domain:"share.com",price:30,clicks:3200,update:'Feb 11',status:'Sold'},
        {domain:"fair.com",price:35,clicks:3900,update:'Mar 26',status:'Flagged'},
        {domain:"year.com",price:48,clicks:3990,update:'Feb 15',status:'Expiring'},
        {domain:"day.com",price:55,clicks:5600,update:'Jan 29',status:'Sold'},
        {domain:"light.com",price:40,clicks:3100,update:'Feb 17',status:'Registered'},
        {domain:"sight.com",price:58,clicks:6100,update:'Feb 19',status:'Flagged'},
        {domain:"right.com",price:50,clicks:4400,update:'Apr 01',status:'Expiring'},
        {domain:"once.com",price:20,clicks:1400,update:'Apr 04',status:'Sold'}
    ]);
}

function uploadFile(files) {
    framework.file.upload('testService', 'uploadFile', ['file1'], function(errCode, errMsg) {
        layer.msg(errCode + ': ' + errMsg);
    });
}