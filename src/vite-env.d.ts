const component: DefineComponent<{}, {}, any>;

interface ImportMetaEnv {
    readonly VITE_TITLE: string;
    readonly VITE_BASE_URL: string;
    readonly VITE_BUILD_SOURCEMAP: string;
    readonly VITE_BUILD_DROP_CONSOLE: string;
    readonly VITE_PUBLIC_URL: string;
    readonly VITE_ROUTER_MODE: string;
    readonly VITE_SECRET_KEY: string;
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
