window.AGL = window.AGL || {};

/**
 * 随机指定范围内N个不重复的数
 * 最简单最基本的方法
 * @param  {Number} min 指定范围最小值
 * @param  {Number} max 指定范围最大值
 * @param  {Number} n   随机数个数
 * @param  {Number} isCustomAlgorithm   是否使用自定义随机数算法
 * @return {Object}     返回随机数数组
 */
window.AGL.randomRange = function(min, max, n, isCustomAlgorithm) {

    // 随机数
    var random = function() {
        if (!isCustomAlgorithm) {
            return Math.random()
        }
        var seed = new Date().getTime(); // 时间种子
        seed = (seed * 9301 + 49297) % 233280; //为何使用这三个数?
        return seed / (233280.0);
    }

    var result = [];
    if (n > (max - min + 1) || max < min) {
        return result;
    }
    var count = 0;
    var num = 0;
    var flag = false;

    while (count < n) {
        num = Math.round(random() * (max - min)) + min;
        flag = true;
        for (var j = 0; j < n; j++) {
            if (num === result[j]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            result[count] = num;
            count++;
        }
    }
    return result;
}

/**
 * 获取浏览器参数值
 * 若需要在Controller中使用，可直接使用$location.$$search.name获得
 * @param  {String} name    参数名称
 * @param  {String} s       待查询的链接
 * @return {String}         参数值
 */
AGL.getQueryStringRegExp = function(name, s) {
    var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
    var uri = '';
    if (s) {
        uri = decodeURIComponent(s);
    } else {
        uri = window.location.search;
        if (!uri) {
            uri = window.location.href;
        }
    }
    if (reg.test(uri)) {
        var result = decodeURIComponent(RegExp.$2.replace(/\+/g, ' '));
        return result === '' ? '' : result;
    }
    return '';
}

/**
 * 是否是移动端(包括pc的移动模拟器)
 * @return {Boolean}
 */
AGL.isMobileBrowser = function() {
    var ua = navigator.userAgent.toLowerCase();
    var bIsIpad = ua.match(/ipad/i) == 'ipad';
    var bIsIphoneOs = ua.match(/iphone os/i) == 'iphone os';
    var bIsMidp = ua.match(/midp/i) == 'midp';
    var bIsUc7 = ua.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
    var bIsUc = ua.match(/ucweb/i) == 'ucweb';
    var bIsAndroid = ua.match(/android/i) == 'android';
    var bIsCE = ua.match(/windows ce/i) == 'windows ce';
    var bIsWM = ua.match(/windows mobile/i) == 'windows mobile';
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    } else {
        return false;
    }
}

/**
 * 是否是微信
 * @return {Boolean}
 */
AGL.isWeChatBrowser = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/**
 * 是否是微信并且是iphone
 * @return {Boolean}
 */
AGL.isWeChatBrowserInIphone = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger' && ua.indexOf('iphone') > 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 设置 htnl title
 * @param {String} title html 标题
 */
AGL.setTitle = function(title) {
    document.title = title;
    // hack 微信等webview中无法修改document.title的情况
    if (AGL.isWeChatBrowserInIphone()) {
        document.title = title;
        var i = document.createElement('iframe');
        i.src = AGL.SHARE_PIC;
        i.style.display = 'none';
        i.onload = function() {
            setTimeout(function() {
                i.remove();
            }, 9)
        }
        document.body.appendChild(i);
    }
}

/**
 * 微信重置分享内容
 * @param  {String} title   分享标题
 * @param  {String} content 分享内容
 * @param  {String} pic     分享图片url
 * @param  {String} url     分享内容跳转链接
 * @param  {Object} options 扩展对象
 * @return {type}
 */
AGL.wechatResetShare = function(title, content, pic, url, options) {
    if (!AGL.isWeChatBrowser()) return;
    try {
        var defaultPic = require('core/images/share.jpg'); // 生产上该路径为全路径

        // 测试环境需要重置下，补全路径
        // if (__TEST__) {
        //     defaultPic = AGL.appConfig.staticDomain + AGL.appConfig.releaseDir + '/' + defaultPic;
        // }
        var shareConfig = {
            title: title, // 分享标题
            desc: content, // 分享描述
            link: url || window.location.href, // 分享链接
            imgUrl: pic || defaultPic, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // 用户确认分享后执行的回调函数
                if (typeof options.success === 'function') {
                    options.success();
                }
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
                if (typeof options.cancel === 'function') {
                    options.cancel();
                }
            }
        };

        wx.ready(function() {
            //分享到朋友圈
            wx.onMenuShareTimeline(shareConfig);
            // 分享给朋友
            wx.onMenuShareAppMessage(shareConfig);
            // 分享到QQ
            wx.onMenuShareQQ(shareConfig);
            // 分享到腾讯微博
            wx.onMenuShareWeibo(shareConfig);
            // 分享到QQ空间
            wx.onMenuShareQZone(shareConfig);
        });
    } catch (e) {
        // console.log('wechatResetShare error');
    } finally {
        // console.log('wechatResetShare finally');
    }
};
