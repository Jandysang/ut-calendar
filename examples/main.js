import { createApp } from 'vue'
import App from './App.vue'


// 导入组件库
import utui from '../packages'
// 注册组件库
// Vue.use(utui)

// Vue.config.productionTip = false


const app = createApp(App)
app.use(utui);
app.config.productionTip = false;
app.mount('#app')