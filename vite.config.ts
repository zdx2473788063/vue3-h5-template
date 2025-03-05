import {defineConfig, loadEnv, ConfigEnv, UserConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";
import Unocss from "unocss/vite";
import {pxToViewport} from "./plugins/pxto-viewport"
import topLevelAwait from 'vite-plugin-top-level-await';
// @ts-ignore
export default (({command, mode}: ConfigEnv): UserConfig => {
    // 获取环境变量
    const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd());
    return defineConfig({
        define: {
            'process.env': env,
        },
        plugins: [vue(), Unocss(),topLevelAwait()],
        resolve: {
            // 配置路径别名
            alias: {
                "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
                "~": path.resolve("./src")
            }
        },
        css: {
            postcss: {
                plugins: [
                    pxToViewport()
                ]
            },
        },
        server: {
            host: "0.0.0.0", // 配置localhost、本机IP地址
            port: 8899, // 端口号
            hmr: true, // 热更新
            open: true // 自动打开
        },
        // 预编译，增加访问速度，针对node_modules
        optimizeDeps: {
            include: [
                "vue",
                "vue-routers",
                "axios",
            ]
        }
    });
})