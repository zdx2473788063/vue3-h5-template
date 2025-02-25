import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { layoutRouter, staticRouter } from "./modules/staticRouter";
import { stringifyQuery, parseQuery } from "./modules/query";

// 路由访问两种模式：带#号的哈希模式，正常路径的web模式。
const routerMode: any = {
    hash: () => createWebHashHistory(),
    history: () => createWebHistory()
};

// .env配置文件读取
const mode = import.meta.env.VITE_ROUTER_MODE;

// 创建路由器对象
const router = createRouter({
    // 路由模式hash或者默认不带#
    history: routerMode[mode](import.meta.env.VITE_PUBLIC_URL),
    stringifyQuery,
    parseQuery,
    routes: [...layoutRouter, ...staticRouter],
    strict: false,
    // 滚动行为
    scrollBehavior() {
        return {
            left: 0,
            top: 0
        };
    }
});
export default router;
