/**
 * 通过postMessage和app交互
 * 1.js提前注入的情况下，合并sdk，判断是否app环境
 * 2.js延迟注入的情况下，缓存添加的方法
 */
import { SDK_STATE, SDK_CURRENT, iEvent, iSDK } from "./api";
/**
 * 启动时间
 */
const SDK_START = Date.now();
/**
 * 启动延迟等待时间,10秒之后默认不在app中
 */
const SDK_DELAY = 10000;
/**
 * sdk的状态
 */
let SDK_READY: SDK_STATE = SDK_STATE.WAIT;

/**
 * sdk的事件缓存
 */
const sdk_event: iEvent = {
    ready: []
};
let sdk_cache: Array<any> = [];
//兼容window
const win = window as any;

const _sdk: iSDK = {
    ut: 3,
    header: {},
    clientid: "",
    current: SDK_CURRENT.WXTOUCH,
    xc_role: 0,
    emit: function(name, data) {
        var list = sdk_event[name];
        if (!list || list.constructor !== Array) return;
        for (var i = 0, j = list.length; i < j; i++) {
            var item = list[i];
            if (typeof item === "function") {
                item.call(win.SDK, data);
            }
        }
    },
    on: function(name, fn) {
        if (!sdk_event[name]) {
            sdk_event[name] = [];
        }
        sdk_event[name].push(fn);
    },
    off: function(name, fn) {
        const list = sdk_event[name];
        const index = list.indexOf(fn);
        sdk_event[name].splice(index, 1);
    },
    use: function(name) {
        const arr = Array.prototype.slice.apply(arguments);
        if (SDK_READY === SDK_STATE.READY) {
            win.postMessage(JSON.stringify(arr));
        } else {
            if (win.SDK[name]) win.SDK[name].apply(win.SDK, arr);
            if (Date.now() - SDK_START < SDK_DELAY) sdk_cache.push(arr);
        }
    },
   
};

/**
 * 复制window.SDK上的内容，最后重新校正SDK内容
 */
function sdk_copy() {
    if (!win.SDK) return;
    for (const key in win.SDK) {
        const item = win.SDK[key];
        if (item) _sdk[key] = item;
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
        SDK_READY = SDK_STATE.READY;
    }
} else {
    win.SDK = _sdk;
}
/**
 * 监听注入函数，执行缓存函数
 */
_sdk.on("ready", function() {
    SDK_READY = SDK_STATE.READY;
    while (sdk_cache.length > 0) {
        const arr = sdk_cache.shift();
        win.postMessage(JSON.stringify(arr));
    }
});
export default _sdk;
