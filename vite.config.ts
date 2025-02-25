import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";
import Unocss from "unocss/vite";
export default ({command, mode}) => {
    // 获取环境变量
    const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd());
    return defineConfig({
        define: {
            'process.env': env,
        },
        plugins: [vue(),Unocss()],
        build: {
            outDir: 'dist', // 指定打包路径，默认为项目根目录下的 dist 目录
            sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
            // minify默认esbuild，esbuild模式下terserOptions将失效
            // vite3变化：Terser 现在是一个可选依赖，如果你使用的是 build.minify: 'terser'，你需要手动安装它 `npm add -D terser`
            minify: 'terser',
            terserOptions: {
                compress: {
                    keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
                    drop_console: env.VITE_BUILD_DROP_CONSOLE === 'true', // 去除 console
                    drop_debugger: true, // 去除 debugger
                },
            },
            chunkSizeWarningLimit: 1500, // chunk 大小警告的限制（以 kbs 为单位）
        },
        resolve: {
            // 配置路径别名
            alias: {
                "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
                "~": path.resolve("./src")
            }
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
};
