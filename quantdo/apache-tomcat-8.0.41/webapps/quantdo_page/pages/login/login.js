
var errFlag=0;
var aaa = "";
//初始化验证码图片
window.onload = function() {
    validCodeLoad();
    $('#validImg').on('click', function(e) {
        validCodeLoad();
    });
    
    $("title").html(systemName);
    $(".login-title").html("<span class='icon-login'></span>  " + systemName);

    var passwordInput = document.getElementById("password");
    //禁止复制
    passwordInput.oncopy = function(){
        return false;
    }
    //禁止粘贴
    passwordInput.onpaste = function(){
        return false;
    }
};


function logon() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var validcode = document.getElementById("validcode").value;
    if(window.localStorage.getItem("encryption")!= null,"" != window.localStorage.getItem("encryption")){
        window.localStorage.removeItem("encryption");
    }

    password = encode(username + password + "Qdo");
    userLogon(username, password, function (valid) {
    	 if (valid == 0) {
    		 localStorage.setItem("userName",username);
             //localStorage.setItem("loginWindowId",Number(splitWindowUrl()));
             //document.getElementById("username").value = "";
             //document.getElementById("password").value = "";
             //document.getElementById("validcode").value = "";
             //ipcRenderer.send("hideWindow",Number(splitWindowUrl()));
             //ipcRenderer.send("menuPage");
             window.location.href = "../index.html#/home";
         } else if (valid == 1) {
         	errFlag=1;
             aaa = layer.alert('用户名或密码错误,请重新输入', {
                 icon: 2,
                 offset: [window.innerHeight/5+'px', window.innerWidth/2-100+"px"],
                 skin: 'layer-ext-moon'
             })
         } else if (valid == 3) {
         	errFlag=1;
             aaa = layer.alert('系统许可证无效，请联系管理员', {
                 icon: 2,
                 offset: [window.innerHeight/5+'px', window.innerWidth/2-100+"px"],
                 skin: 'layer-ext-moon'
             })
         }else if (valid == 2) {
          	errFlag=1;
            aaa = layer.alert('用户已被锁定，请在20分钟后重试！', {
                icon: 2,
                offset: [window.innerHeight/5+'px', window.innerWidth/2-100+"px"],
                skin: 'layer-ext-moon'
            })
        }else if (valid == 6) {
        	errFlag=1;
		    aaa = layer.alert('验证码错误', {
		        icon: 2,
		        offset: [window.innerHeight/5+'px', window.innerWidth/2-100+"px"],
		        skin: 'layer-ext-moon'
		    });
		    $("#validcode").val('');
          } 
    	 // 重新加载验证码
         validCodeLoad();
    }, validcode);
}

// public method for encoding
function encode(input) {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = utf8_encode(input);
    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
}

utf8_encode = function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }
    return utftext;
}


function logback(){
	window.location.href = "../pages/index.html#/home";
}

function myKeyup(e, o) {
    if (e.keyCode == 13) {
    	if(errFlag == 1){
    		layer.close(aaa);
    		errFlag = 0;
    		aaa = "";
    		return;
    	}
    	 var tag = getTagByTab(parseInt(o.getAttribute("tab")) + 1);
         if (tag) {
             tag.focus();
             if (tag.tagName == "INPUT") {
                 tag.select();
             }
             return true;
         }
         logon();
    }
    
}

function getTagByTab(t) {
//  var inputs = document.getElementsByTagName("input");
//  for (var i = 0; i < inputs.length; i++) {
//      if (inputs[i].getAttribute("tab") == t)
//          return inputs[i];
//  }
//  var selects = document.getElementsByTagName("select");
//  for (var i = 0; i < selects.length; i++) {
//      if (selects[i].getAttribute("tab") == t)
//          return selects[i];
//  }
//  return false;

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

//加载验证码
function validCodeLoad() {
	var o = framework.internal.getFullUrl('/captcha?d='+new Date().getTime());
	if(document.getElementById("validImg") != null){
		document.getElementById("validImg").src = o;
	}
}
