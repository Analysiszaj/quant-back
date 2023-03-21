import { createRouter, createWebHistory } from 'vue-router'

const AppRouter = createRouter({
  history: createWebHistory(),
  routes: [
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
})

export default AppRouter
