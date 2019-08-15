/**
 * sdk的导出方法
 */
interface iSDK {
    [index: string]: any;
    ut: number;
    header: object;
    clientid: string;
    current: string;
    xc_role: number;
    emit(name: string, data: any): void;
    on(name: string, fn: any): void;
    off(name: string, fn: any): void;
    /**
     * 基础方法，使用app提供的方法
     * @param name
     */
    use(name: string, other?: any): void;
    /**
     * 调用app的登录方法
     */
    login(): void;
}
declare const _sdk: iSDK;
export default _sdk;
