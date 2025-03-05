const component: DefineComponent<{}, {}, any>;

interface ImportMetaEnv {
    readonly VITE_TITLE: string;
    readonly VITE_API_URL: string;
    readonly VITE_BUILD_SOURCEMAP: string;
    readonly VITE_BUILD_DROP_CONSOLE: string;
    readonly VITE_PUBLIC_URL: string;
    readonly VITE_ROUTER_MODE: string;
    readonly VITE_SECRET_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
