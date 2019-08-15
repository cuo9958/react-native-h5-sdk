/**
 * 通过postMessage和app交互
 * 1.js提前注入的情况下，合并sdk，判断是否app环境
 * 2.js延迟注入的情况下，缓存添加的方法
 */
let SDK_READY = false;
let sdk_event = {
    ready: []
};
let sdk_cache = [];
const _sdk = {
    ut: 3,
    header: {},
    clientid: "",
    current: "wxtouch",
    xc_role: 0,
    emit: function(name, data) {
        var list = sdk_event[name];
        if (!list || list.constructor !== Array) return;
        for (var i = 0, j = list.length; i < j; i++) {
            var item = list[i];
            if (typeof item === "function") {
                item.call(SDK, data);
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
        var list = sdk_event[name];
        var index = list.indexOf(fn);
        sdk_event[name].splice(index, 1);
    },
    use: function() {
        const arr = Array.prototype.slice.apply(arguments);
        if (SDK_READY) {
            window.postMessage(JSON.stringify(arr));
        } else {
            if (window.SDK[name]) window.SDK[name].apply(window.SDK, arr);
            sdk_cache.push(arr);
        }
    }
};
const fn = function(name) {
    return function() {
        if (!SDK_READY) return;
        _sdk.use(name, ...arguments);
    };
};
/**
 * 加入预置的方法
 */
_sdk.login = fn("login");
/**
 * 复制window.SDK上的内容，最后重新校正SDK内容
 */
function sdk_copy() {
    if (!window.SDK) return;
    for (const key in window.SDK) {
        const item = window.SDK[key];
        if (item) _sdk[key] = item;
    }
    window.SDK = _sdk;
}
/**
 * 提前注入
 * 根据sdk内容做初始化
 */
if (window.SDK) {
    sdk_copy();
    if (window.SDK.current === "android" || window.SDK.current === "ios") {
        SDK_READY = true;
    }
} else {
    window.SDK = _sdk;
}
/**
 * 监听注入函数，执行缓存函数
 */
_sdk.on("ready", function() {
    SDK_READY = true;
    while (sdk_cache.length > 0) {
        const arr = sdk_cache.shift();
        window.postMessage(JSON.stringify(arr));
    }
});
module.exports = _sdk;
