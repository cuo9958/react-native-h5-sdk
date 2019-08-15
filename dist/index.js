"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 启动时间
 */
var SDK_START = Date.now();
/**
 * 启动延迟等待时间,10秒之后默认不在app中
 */
var SDK_DELAY = 10000;
/**
 * sdk的状态
 */
var SDK_READY = 0 /* WAIT */;
/**
 * sdk的事件缓存
 */
var sdk_event = {
    ready: []
};
var sdk_cache = [];
//兼容window
var win = window;
var _sdk = {
    ut: 3,
    header: {},
    clientid: "",
    current: "wxtouch" /* WXTOUCH */,
    xc_role: 0,
    emit: function (name, data) {
        var list = sdk_event[name];
        if (!list || list.constructor !== Array)
            return;
        for (var i = 0, j = list.length; i < j; i++) {
            var item = list[i];
            if (typeof item === "function") {
                item.call(win.SDK, data);
            }
        }
    },
    on: function (name, fn) {
        if (!sdk_event[name]) {
            sdk_event[name] = [];
        }
        sdk_event[name].push(fn);
    },
    off: function (name, fn) {
        var list = sdk_event[name];
        var index = list.indexOf(fn);
        sdk_event[name].splice(index, 1);
    },
    use: function (name) {
        var arr = Array.prototype.slice.apply(arguments);
        if (SDK_READY === 1 /* READY */) {
            win.postMessage(JSON.stringify(arr));
        }
        else {
            if (win.SDK[name])
                win.SDK[name].apply(win.SDK, arr);
            if (Date.now() - SDK_START < SDK_DELAY)
                sdk_cache.push(arr);
        }
    },
};
/**
 * 复制window.SDK上的内容，最后重新校正SDK内容
 */
function sdk_copy() {
    if (!win.SDK)
        return;
    for (var key in win.SDK) {
        var item = win.SDK[key];
        if (item)
            _sdk[key] = item;
    }
    win.SDK = _sdk;
}
/**
 * 提前注入
 * 根据sdk内容做初始化
 */
if (win.SDK) {
    sdk_copy();
    if (win.SDK.current === "android" || win.SDK.current === "ios") {
        SDK_READY = 1 /* READY */;
    }
}
else {
    win.SDK = _sdk;
}
/**
 * 监听注入函数，执行缓存函数
 */
_sdk.on("ready", function () {
    SDK_READY = 1 /* READY */;
    while (sdk_cache.length > 0) {
        var arr = sdk_cache.shift();
        win.postMessage(JSON.stringify(arr));
    }
});
exports.default = _sdk;
