import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 引入路由
import router from "./routers";
import "uno.css";
// 创建app
const app = createApp(App);
// 注册路由
app.use(router);
// 挂载
app.mount("#app");

