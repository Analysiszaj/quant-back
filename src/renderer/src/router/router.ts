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
          path: '/historical',
          name: 'Historical',
          component: import('@renderer/views/Historical/index.vue')
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
    },
    {
      path: '/back_test_detail',
      name: 'BackTestDetail',
      component: import('@renderer/views/BackTestDetail/index.vue'),
      meta: {
        name: 'backtestdetail'
      }
    },
    {
      path: '/tran_detail',
      name: 'TranDetail',
      component: import('@renderer/views/TranDetail/index.vue'),
      meta: {
        name: 'TranDetail'
      }
    }
  ]
})

export default AppRouter
