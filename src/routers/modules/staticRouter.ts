import { RouteRecordRaw } from "vue-router";

// import Layout from "@/layout/index.vue";
import { HOME_URL} from "@/config";

/**
 * LayoutRouter (布局路由)
 */
export const layoutRouter: RouteRecordRaw[] = [
    {
        path: "/", // 路由访问路径[唯一]
        name: "home", // 命名路由[唯一]
        redirect: HOME_URL,
        children: [
            {
                path: HOME_URL, // [唯一]
                component: () => import("@/views/home/index.vue"),
                meta: {
                    title: "首页", // 标题
                    visible: true, // 代表路由在菜单中是否隐藏，是否隐藏[false 隐藏，true 显示]
                    keepAlive: true // 是否缓存路由数据[true 是，false 否]
                }
            }
        ]
    }
];

export const staticRouter: RouteRecordRaw[] = [
    {
        path: "/home/index", // [唯一]
        component: () => import("@/views/home/index.vue"),
        meta: {
            title: "首页", // 标题
            visible: true, // 代表路由在菜单中是否隐藏，是否隐藏[false 隐藏，true 显示]
            keepAlive: true // 是否缓存路由数据[true 是，false 否]
        }
    },
];