<template>
  <div class="menu-main">
    <div class="logo">
      <img src="@renderer/assets/0c2dcbe59da505451ebcddb262a9a041.webp" alt="" srcset="" />
    </div>

    <ul class="menu-bar">
      <li v-for="(item, key) in menuItemList" :key="key">
        <RouterLink
          :to="item.to"
          class="link-style"
          :class="{ active: route.meta.name === item.name }"
        >
          <i
            :class="[item.boxIcon, route.meta.name === item.name ? 'active' : '']"
            class="bx icon"
          ></i>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const menuItemList = ref<{ to: string; boxIcon: string; name: string }[]>([
  {
    to: '/work_table',
    boxIcon: 'bx-home',
    name: 'workTable'
  },
  {
    to: '/backTest',
    boxIcon: 'bxs-bar-chart-alt-2',
    name: 'backTest'
  },
  {
    to: '/edit',
    boxIcon: 'bxs-edit',
    name: 'edit'
  },
  {
    to: '/data',
    boxIcon: 'bxs-data',
    name: 'data'
  },
  {
    to: '/historical',
    boxIcon: 'bx-history',
    name: 'Historical'
  }
])
</script>

<style scoped>
.menu-main {
  width: 80px;
  background-color: var(--sidebar-color);
  padding: 10px;
  height: 100vh;
}
.logo {
  min-width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo img {
  width: 40px;
  border-radius: 6px;
}

.menu-bar li {
  height: 50px;
  margin-top: 10px;
}
.menu-bar li .link-style {
  height: 100%;
  display: flex;
  align-items: center;
  border-radius: 6px;
  text-decoration: none;
  transition: var(--tran-04);
}
.link-style:hover {
  background-color: var(--primary-color);
}
.link-style:hover .icon {
  color: var(--sidebar-color);
}

.link-style .icon {
  display: flex;
  justify-content: center;
  min-width: 60px;
  font-size: 24px;
  color: var(--text-color);
}
.active {
  background-color: var(--primary-color);
  color: var(--sidebar-color) !important;
}
</style>
