import {getEncryptToBase64 as encrypt, getDecryptByBase64 as decrypt} from "./encryption";

const encodeReserveRE = /[!'()*]/g;
const encodeReserveReplacer = c => "%" + c.charCodeAt(0).toString(16); //获取该字符的 ASCII 码值，再将其转换为十六进制字符串，并在前面加上 '%' 作为替换后的结果
const commaRE = /%2C/g; //英文逗号处理

const encode = str => encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ",");

const decode = decodeURIComponent;

/**
 * 判断字符串是否是base64
 * @param { string } str
 * @returns { boolean }
 */
function isBase64(str) {
    // 检查字符串是否为空或仅包含空白字符
    if (!str || str.trim() === "") {
        return false;
    }
    // 正则表达式匹配Base64的字符集，允许末尾有0-2个等号用于填充
    const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;

    // 首先检查字符串是否符合Base64的字符集规范
    if (!base64Pattern.test(str)) {
        return false;
    }

    try {
        return btoa(atob(str)) === str;
    } catch {
        return false;
    }
}

/**
 * 序列化对象 并加密
 * @param {Object} obj
 */
export const stringifyQuery = obj => {
    const res = obj
        ? Object.keys(obj)
            .map(key => {
                const val = obj[key];
                if (val === null || val === undefined) return encode(key);
                if (Array.isArray(val)) {
                    const result: string[] = [];
                    val.forEach(val2 => {
                        if (val2 === null || val2 === undefined) {
                            result.push(encode(key));
                        } else {
                            result.push(encode(key) + "=" + encode(val2));
                        }
                    });
                    return result.join("&");
                }
                return encode(key) + "=" + encode(val);
            })
            .join("&")
        : null;
    return res ? `${encrypt(res)}` : "";
};

/**
 * 解密  反序列化字符串参数
 * @param {String}} query
 */
export const parseQuery = (query: string) => {
    const res = {};

    query = query.trim().replace(/^(\?|#|&)/, "");
    if (!query) {
        return res;
    }
    // 解密
    query = isBase64(query) ? decrypt(query) : query;
    query.split("&").forEach(param => {
        const parts = param.split("=");
        // @ts-ignore
        const key = decode(parts.shift());
        const val = parts.length > 0 ? decode(parts.join("")) : null;
        if (res[key] === undefined) {
            res[key] = val;
        } else if (Array.isArray(res[key])) {
            res[key].push(val);
        } else {
            // 复原数组
            res[key] = [res[key], val];
        }
    });
    return res;
};
