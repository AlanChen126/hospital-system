import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

//使用ElementPlus的图标
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 使用ElementPlus的图标，全部引入，按需遍历
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// createApp(App).mount('#app')
