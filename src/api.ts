/**
 * 枚举
 */
export const enum SDK_STATE {
    /**
     * 等待中
     */
    WAIT,
    /**
     * 初始化完成，是
     */
    READY
}
/**
 * 当前环境
 */
export const enum SDK_CURRENT {
    WXTOUCH = "wxtouch",
    ANDROID = "android",
    IOS = "ios"
}

export interface iEvent {
    [index: string]: any;
}

export interface iSDK {
    [index: string]: any;
    /**
     * 用户类型
     */
    ut: number;
    /**
     * app注入的header内容
     */
    header: object;
    /**
     * APP的客户端id
     */
    clientid: string;
    /**
     * 当前环境，默认“wxtouch”，app中取值：android、ios
     */
    current: SDK_CURRENT;
    /**
     * 用户身份
     */
    xc_role: number;
    emit(name: string, data: any): void;
    on(name: string, fn: any): void;
    off(name: string, fn: any): void;
    /**
     * 使用APP提供的方法
     * @param name
     * @param other
     */
    use(name: string, other?: any): void;
    /**
     * APP打开登录页
     */
    login?(): void;
    /**
     * 加入购物车
     * @param sku
     * @param num
     */
    addCart?(sku: string, num: number): void;
    openDetail?(): void;
    buy?(): void;
    openCart?(): void;
    setData?(): void;
    getData?(): void;
    search?(): void;
    orderPage?(): void;
    isCanGoBack?(): void;
    sharePage?(): void;
    setShareInfo?(): void;
    setTitle?(): void;
    wxpay?(): void;
    alipay?(): void;
    setMenu?(): void;
    myOrderPage?(): void;
}
