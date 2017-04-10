window.AGL = window.AGL || {};

// 下面为《HTML5 Canvas 核心技术》给出的兼容主流浏览器的requestNextAnimationFrame
// 和 cancelNextRequestAnimationFrame方法
window.requestAnimationFrame = (function() {
    /* eslint no-unused-vars: "off" */
    var originalWebkitRequestAnimationFrame = undefined,
        wrapper = undefined,
        callback = undefined,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

    // Workaround for Chrome 10 bug where Chrome
    // does not pass the time to the animation function

    if (window.webkitRequestAnimationFrame) {
        // Define the wrapper

        wrapper = function(time) {
            if (time === undefined) {
                time = +new Date();
            }
            self.callback(time);
        };

        // Make the switch

        originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

        window.webkitRequestAnimationFrame = function(callback, element) {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback

            originalWebkitRequestAnimationFrame(wrapper, element);
        }
    }

    // Workaround for Gecko 2.0, which has a bug in
    // mozRequestAnimationFrame() that restricts animations
    // to 30-40 fps.

    if (window.mozRequestAnimationFrame) {
        // Check the Gecko version. Gecko is used by browsers
        // other than Firefox. Gecko 2.0 corresponds to
        // Firefox 4.0.

        index = userAgent.indexOf('rv:');

        if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
                // Forces the return statement to fall through
                // to the setTimeout() function.

                window.mozRequestAnimationFrame = undefined;
            }
        }
    }

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function(callback, element) {
            var start,
                finish;

            window.setTimeout(function() {
                start = +new Date();
                callback(start);
                finish = +new Date();

                self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);

        };
}());

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
        window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
        window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
        window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
        window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
        window.clearTimeout);
}

/**
 * 随机指定范围内N个不重复的数
 * 最简单最基本的方法
 * @param  {Number} min 指定范围最小值
 * @param  {Number} max 指定范围最大值
 * @param  {Number} n   随机数个数
 * @return {Object}     返回随机数数组
 */
window.AGL.randomCommon = function(min, max, n) {
    var result = [];
    if (n > (max - min + 1) || max < min) {
        return result;
    }
    var count = 0;
    var num = 0;
    var flag = false;

    while (count < n) {
        num = Math.round(Math.random() * (max - min)) + min;
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
