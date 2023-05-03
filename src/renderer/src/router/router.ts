import { createRouter, createWebHistory } from 'vue-router'
import layout from '@renderer/Layout/index.vue'
const AppRouter = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: '首页',
      component: layout,
      redirect: '/backTest',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: import('@renderer/views/Home/index.vue')
        },
        {
          path: '/backTest',
          name: 'backTest',
          component: import('@renderer/views/BackTest/index.vue'),
          meta: {
            name: 'BackTest'
          }
        },
        {
          path: '/edit',
          name: 'edit',
          component: import('@renderer/views/Edit/index.vue'),
          meta: {
            name: 'edit'
          }
        },
        {
          path: '/data',
          name: 'data',
          component: import('@renderer/views/Data/index.vue'),
          meta: {
            name: 'data'
          }
        }
      ]
    },
    {
      path: '/data_detail',
      name: 'DataDetail',
      component: import('@renderer/views/DataDetail/index.vue'),
      meta: {
        name: 'dataDetail'
      }
    }
  ]
})

export default AppRouter
