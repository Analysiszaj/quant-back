import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/global.scss'
import router from '@renderer/router/router'
import 'boxicons'
import 'boxicons/css/boxicons.css'
const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.mount('#app')
