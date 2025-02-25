import request from "@/utils/http";
import {ContentTypeEnum, RequestTypeEnum} from "@/utils/http/http-enum";

/**
 * 接口名
 * @param data 接口参数
 */
export const example = (data: FormData) => {
    return request.request(
        {
            method: RequestTypeEnum.POST,
            url: "system/example/api",
            data: data
        },
        {
            contentType: ContentTypeEnum.FORM_DATA
        }
    );
};