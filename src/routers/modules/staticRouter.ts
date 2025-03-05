import { RouteRecordRaw } from "vue-router";

export const staticRouter: RouteRecordRaw[] = [
    {
        path: "/index", // [唯一]
        component: () => import("@/views/index.vue"),
        meta: {
            title: "首页", // 标题
        }
    }
];