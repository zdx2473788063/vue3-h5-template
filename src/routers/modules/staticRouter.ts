import {RouteRecordRaw} from "vue-router";

export const layoutRouter: RouteRecordRaw[] = [
    {
        // 登录成功以后展示数据的路由[一级路由，可以将子路由放置Main模块中(核心)]
        path: "/", // 路由访问路径[唯一]
        name: "layout", // 命名路由[唯一]
        redirect: "/index", // path路径，<router-link name="/404"> 也是使用path进行跳转
        children: [
            {
                path: "/index", // [唯一]
                component: () => import("@/views/index.vue"),
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
    // {
    //     path: "/index", // [唯一]
    //     component: () => import("@/views/index.vue"),
    //     meta: {
    //         title: "首页", // 标题
    //     }
    // }
];