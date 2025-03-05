import Axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import Qs from "qs";
import {RequestOptions, ResultParams} from "./type";
import {ContentTypeEnum, ResultEnum} from "./http-enum";
import {checkStatus} from "./check-status";
import {cloneDeep} from "lodash-es";
const getServerConfig = () => {
    return Axios.get('/config.json')
}
const baseURL = (await getServerConfig()).data.baseURL
// 请求队列
const pendingRequest = new Map();
// 生成请求Key
const generateReqKey = (config: AxiosRequestConfig) => {
    // 根据请求方案、请求地址、请求包体 判断是否为重复请求
    const {url, method, params, data} = config;
    return [method, url, Qs.stringify(params), Qs.stringify(data)].join("&");
};
// 将当前请求加入请求队列
const addPendingRequest = (config: AxiosRequestConfig) => {
    const requestKey = generateReqKey(config);
    config.cancelToken =
        config.cancelToken ||
        new Axios.CancelToken(cancel => {
            if (!pendingRequest.has(requestKey)) {
                pendingRequest.set(requestKey, cancel);
            }
        });
};
// 检查队列中是否存在重复请求，如果存在则取消已发的请求
const removePendingRequest = (config: AxiosRequestConfig) => {
    const requestKey = generateReqKey(config);
    if (pendingRequest.has(requestKey)) {
        const cancelToken = pendingRequest.get(requestKey);
        cancelToken(requestKey);
        pendingRequest.delete(requestKey);
    }
};
const handleError = (err: AxiosError) => {
    const _code = err.code ? parseInt(err.code) : 500;
    // 开发环境打印错误信息
    console.error(`===status:${_code};===errorMessageText:${err?.message}`);
    checkStatus(_code, err?.message);
};

class IAxios {
    private readonly options: RequestOptions;
    private instance: AxiosInstance | undefined;

    constructor(options: RequestOptions) {
        this.options = options;
    }

    request<T = any>(configs: AxiosRequestConfig, options?: RequestOptions): Promise<AxiosResponse<any>> {
        this.instance = Axios.create();
        const _conf: AxiosRequestConfig = cloneDeep(configs);
        const _opts: RequestOptions = Object.assign({}, this.options, options);
        // 格式化接口地址，兼容第三方接口
        _conf.url = baseURL + `${import.meta.env.VITE_API_URL}/${_conf.url}`;
        const {
            contentType,
            isShowErrorMessage,
            errorMessageText,
            isTransformRequestResult,
            isShowServerErrorMessage,
            isTimeout,
            timeoutNumber,
            ignorePendingRequest
        } = _opts;
        if (contentType) {
            // const userStore = useUserStore();
            _conf.headers = {
                ..._conf.headers,
                // 是否忽略token，默认不忽略
                // Authorization: ignoreToken ? "" : userStore.token,
                Authorization: "",
                "Content-Type": contentType
            };
        }
        // console.log(_conf.headers);
        // 是否需要设置超时时长
        if (isTimeout) {
            this.instance.defaults.timeout = timeoutNumber;
        }
        // request拦截器
        this.instance.interceptors.request.use((config: AxiosRequestConfig | any) => {
            // 检查是否存在重复请求，若存在则删除
            if (ignorePendingRequest) {
                removePendingRequest(config);
                addPendingRequest(config);
            }
            return config;
        }, undefined);
        // response拦截器
        this.instance.interceptors.response.use(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            (res: AxiosResponse<ResultParams | any>) => {
                const {data, config} = res;
                if (ignorePendingRequest) {
                    removePendingRequest(config);
                }
                if (config.responseType && config.responseType === "blob") {
                    return Promise.resolve({
                        data
                    });
                }

                switch (data.code) {
                    case ResultEnum.SUCCESS:
                        // 是否需要格式化接口出参
                        if (isTransformRequestResult) {
                            return Promise.resolve(data?.data);
                        } else {
                            return Promise.resolve(data);
                        }
                    default:
                        // 是否统一处理业务异常
                        if (isShowServerErrorMessage) {
                            handleError({
                                code: data?.code?.toString(),
                                config: config,
                                isAxiosError: false,
                                message: errorMessageText || data?.message,
                                name: "",
                                response: res,
                                toJSON: () => {
                                    return {};
                                }
                            });
                            return Promise.reject(data?.data);
                        }
                        alert(data?.message)
                        return Promise.reject(data?.data);
                    // return Promise.resolve(data);
                }
            },
            (err: AxiosError) => {
                if (ignorePendingRequest) {
                    removePendingRequest(err.config || {});
                }
                if (Axios.isCancel(err)) {
                    console.log("已取消的重复请求：" + err.message);
                }
                // 是否统一处理http接口请求异常
                if (isShowErrorMessage) {
                    const {data, statusText} = err?.response as AxiosResponse;

                    handleError({
                        ...err,
                        code: err.response?.status.toString(),
                        message: errorMessageText || data?.message || statusText
                    });
                }
                return Promise.reject(err?.response);
            }
        );
        // 接口请求
        return this.instance.request<T, AxiosResponse<T>>(_conf);
    }
}

/**
 * 请求类接口实现
 */
const Http = new IAxios({
    contentType: ContentTypeEnum.JSON,
    errorMessageText: "",
    ignoreToken: false,
    isParseToJson: true,
    isShowErrorMessage: true,
    isShowServerErrorMessage: false,
    isTimeout: true,
    isTransformRequestResult: true,
    joinParamsToUrl: false,
    serverErrorMessage: "",
    timeoutNumber: 5000,
    ignorePendingRequest: true
});
export default Http;
