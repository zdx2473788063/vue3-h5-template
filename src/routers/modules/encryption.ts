import CryptoJS from "crypto-js";
import CryptoJSCore from "crypto-js/core";
import AES from "crypto-js/aes";
import ZeroPadding from "crypto-js/pad-zeropadding";
import Utf8, {parse} from "crypto-js/enc-utf8";
import Base64 from "crypto-js/enc-base64";

/*
 * 加密 解密
 */
const keyHex = parse(import.meta.env.VITE_SECRET_KEY); // 十六位数作为密钥
const ivHex = CryptoJS.lib.WordArray.random(128 / 8); // 十六位数作为密钥偏移量 随机生成

/**
 * 加密
 * @param {String} key
 * @returns {string}
 */
// 加密后的结果通常是一个CipherParams对象，其中包含了加密后的密文数据，而密文数据本身是一个WordArray对象。同样，在解密过程中，解密后的结果也是一个WordArray对象。
export const getEncrypt = key => {
    try {
        key = JSON.stringify(key);
    } catch (e) {
        console.warn(e);
    }
    //   key需要是WordArray类型
    return JSON.stringify({
        encrypt: AES.encrypt(key, keyHex, {
            mode: CryptoJSCore.mode.CBC,
            padding: ZeroPadding,
            iv: ivHex
        }).toString(),
        iv: ivHex
    });
};

/**
 * 加密后转base64
 * @param key
 */
export const getEncryptToBase64 = (key: string) => {
    const encryptStr = getEncrypt(key);
    const wordArray = Utf8.parse(encryptStr); //转为WordArray对象
    return Base64.stringify(wordArray);
};

/**
 * 对加密数据进行解密
 */
export const getDecrypt = (params: any) => {
    let data = JSON.parse(params);
    const encrypt = data.encrypt as string;
    let decrypted = AES.decrypt(encrypt, keyHex, {
        mode: CryptoJSCore.mode.CBC,
        padding: ZeroPadding,
        iv: data.iv
    }).toString(Utf8); //转换为指定编码的字符串
    try {
        decrypted = JSON.parse(decrypted);
    } catch (e) {
        console.warn(e);
    }
    return decrypted;
};

/**
 * 对base64数据解密  先解析base64，在做解密
 * @param {String} data
 * @returns {string}
 */
export const getDecryptByBase64 = data => {
    // 将Base64字符串转换为WordArray
    const parsedWordArray = Base64.parse(data);
    //   WordArray对象转换成一个UTF-8编码的字符串
    const decryptStr = Utf8.stringify(parsedWordArray);

    return getDecrypt(decryptStr);
};
