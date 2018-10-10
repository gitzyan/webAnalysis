;(function (window) {
  // 公共方法
  var ApexAnalysis = {
    //获取cookie
    getCookie: function (key) {
      var search = key + "=";  //查询检索的值
      var returnValue = "";  //返回值
      if (document.cookie.length > 0){
        var sd = document.cookie.indexOf(search);
        if (sd !== -1) {
          sd += search.length;
          var end = document.cookie.indexOf(";", sd);
          if (end === -1){
            end = document.cookie.length;
          }
          returnValue = decodeURIComponent(document.cookie.substring(sd, end))
        }
      }
      return returnValue;
    },
    //获取地址栏参数
    getQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null){
        return decodeURIComponent(r[2]);
      } else {
        return '';
      }
    },
    // 获取浏览器时间
    getFormatTime: function () {
      var now = new Date();
      var year = now.getFullYear();
      var month = addZero(now.getMonth() + 1);
      var day = addZero(now.getDate());
      var hh = addZero(now.getHours());
      var mm = addZero(now.getMinutes());
      var ss = addZero(now.getSeconds());
      var dateArr = [year, month, day];
      var timeArr = [hh, mm, ss];
      var clock = dateArr.join('-');
      var clock1 = timeArr.join(':');
      clock += ' ' + clock1;
      return clock;

      // 在小于10的数字前加0
      function addZero(time) {
        return time < 10 ? '0' + time : time;
      }
    },
    // 发送ajax请求
    ajax: function (obj) {
      obj = obj || {}
      var url = obj.url || '';
      var option = obj.option || '';
      var callback = obj.callback || '';
      var type = obj.type || 'GET';
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("");;
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          callback(xhr.responseText);
        }
      };
      xhr.open(type, url, true);
      if(type === 'GET') {
        xhr.send()
      } else {
        xhr.setRequestHeader("Content-type","application/json");
        xhr.send(JSON.stringify(option));
      }
    }
  }

  // PV事件
  function listenPV(isDev) {
    var params = {
      terminal: 'WEB',
      Event: 'PV',
      pageUrl: window.location.href,
      referer: ApexAnalysis.getCookie('s7') || '',
      cmpid: ApexAnalysis.getQueryString('cmpid'),
      inpid: ApexAnalysis.getQueryString('inpid'),
      OS: ApexAnalysis.getCookie('s1') || '',
      Language: ApexAnalysis.getCookie('s3') || '',
      version: ApexAnalysis.getCookie('s2') || '',
      pvId: ApexAnalysis.getCookie('s5') || '',
      visitorId: ApexAnalysis.getCookie('s6') || '',
      visitId: ApexAnalysis.getCookie('s4') || '',
      userId: ApexAnalysis.getCookie('u1') || ''
    }
    // 上传数据
    // ApexAnalysis.ajax({
    //   type: 'POST',
    //   url: 'http://api.apiopen.top/singlePoetry',
    //   option: params,
    //   callback: function (data) {
    //     console.log(data);
    //   }
    // })

    // 开发环境输出参数
    if(!!isDev) {
      console.log(params)
    };
  }

  // EVENT 监听
  function listenTags(isDev) {
    // 获取标签
    function getEle(ele, eventType) {
      var eles =  document.getElementsByTagName(ele);
      for(var i = 0; i < eles.length; i++) {
        addEvent(eles[i], eventType)
      }
    }
    // 注册事件
    // a 标签
    getEle('a', 'click')
    // input 标签
    getEle('input', 'click')
    // button 标签
    getEle('button', 'click')

    // 兼容ie
    function addEvent(element, eventType) {
      if(!!element.addEventListener) {
        element.addEventListener(eventType, handler)
      } else {
        element['on' + eventType] = handler
      }

      // 事件监听执行的函数
      function handler(e) {
        e = e || window.event;
        var ele = e.target || e.srcElement;
        var targetClass = ele.getAttribute('class') || '';
        var targetAttr = '';
        if(element.tagName.toLowerCase() === 'a') {
          targetAttr = ele.getAttribute('href') || '';
        } else if(element.tagName.toLowerCase() === 'input') {
          targetAttr = ele.getAttribute('name') || '';
        } else {
          targetAttr = ele.innerText || '';
        }
        // 追溯路径
        var targetElementList = [ele];
        while (ele.parentNode && ele.parentNode !== 'body') {
          targetElementList.push(ele.parentNode);
          ele = ele.parentNode;
        }
        var params = {
          terminal: 'WEB',
          targetPath: targetElementList,
          eventName: eventType + '_' + element.tagName.toLowerCase() + '_' + targetClass + '_' + targetAttr,
          e_time: ApexAnalysis.getFormatTime(),
          userId: ApexAnalysis.getCookie('u1') || '',
          clientX: Math.round(e.clientX) || '',
          clientY: Math.round(e.clientY) || '',
          screenX: Math.round(e.screenX) || '',
          screenY: Math.round(e.screenY) || '',
          pageX: e.pageX ? Math.round(e.pageX) :
            Math.round(e.clientX + (document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft : document.body.scrollLeft)) || '',
          pageY: e.pageY ? Math.round(e.pageY) :
            Math.round(e.clientY + (document.documentElement.scrollLeft ?
              document.documentElement.scrollLeft : document.body.scrollHeight)) || '' || '',
          offsetX: Math.round(e.offsetX) || '',
          offsetY: Math.round(e.offsetY) || ''
        };
        // 上传数据
        // ApexAnalysis.ajax({
        //   type: 'POST',
        //   url: 'http://api.apiopen.top/singlePoetry',
        //   option: params,
        //   callback: function (data) {
        //     console.log(data);
        //   }
        // })

        // 开发环境输出参数
        if(!!isDev) {
          console.log(params)
        };
      }
    }
}

  // 触发
  function autoTrigger(analysis, isDev) {
    isDev = isDev || false;
    // 开关
    if(!!analysis){
      listenPV(isDev);
      listenTags(isDev);
    }
  }
  window.autoTrigger = autoTrigger;
})(window)