import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/global.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from '@renderer/router/router'
import 'boxicons'
import 'boxicons/css/boxicons.css'
const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.mount('#app')
