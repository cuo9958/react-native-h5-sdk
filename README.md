## app和h5的交互协议


### React-Native接入准备

```javascript
<WebView
    ref="webview"
    javaScriptEnabled={true}
    mixedContentMode="always"
    startInLoadingState={false}
    scalesPageToFit={true}
    onMessage={(t) => this.onMessage(t)}
    onLoad={(e) => this.loaded()}
/>
//接收h5发送的消息
onMessage(t) {
    try {
        let data = t.nativeEvent.data;
        if (data) {
            let args = JSON.parse(data);
            let name = args.shift();
            if (this[name]) this[name].call(this, ...args);
        }
    } catch (e) {
        //
    }
}
loaded(){
    const js=`var _sdk=window.SDK||{};
        _sdk.current="${platform.OS}";
        _sdk.emit&&_sdk.emit("ready");`
    this.refs.webview.injectJavaScript(js);
}
```

### h5中的使用方式

```javascript
import sdk from "react-native-h5-sdk"

sdk.login();//调用APP的登录方法
```