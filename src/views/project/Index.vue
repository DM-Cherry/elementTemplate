<template>
  <div class="app">
    <AppHeader />
    <div class="app-body">
      <Sidebar :nav-items="nav" />
      <main class="main">
        <router-view :key="$route.fullPath" />
      </main>
      <AppAside />
    </div>
  </div>
</template>

<script>
import { Header as AppHeader, Aside as AppAside, Sidebar } from '@/components/Admin/';
import admin from '@/core/mixins/admin';

export default {
  name: 'Project',
  components: { AppHeader, AppAside, Sidebar },
  mixins: [admin],
  data() {
    return {
      nav: [
        {
          id: 1,
          route_name: 'dashboard',
          name: '仪表盘',
          module: '',
          icon: 'fa fa-tachometer',
          url: '/project/dashboard',
          children: [],
          attributes: {
            target: '/project/dashboard',
          },
        },
        {
          id: 2,
          route_name: 'user',
          name: '用户管理',
          module: '',
          icon: 'fa fa-user-circle',
          children: [],
          url: '/project/users',
          attributes: {
            target: '/project/users',
          },
        },
        {
          id: 3,
          route_name: 'histroy',
          name: '历史数据管理',
          module: '',
          icon: 'fa fa-history',
          children: [],
          url: '/project/histroy',
          attributes: {
            target: '/project/histroy',
          },
        },
        {
          id: 4,
          route_name: 'system',
          name: '系统配置管理',
          module: '',
          icon: 'fa fa-cog',
          children: [],
          url: '/project/system',
          attributes: {
            target: '/project/system',
          },
        },
        {
          id: 5,
          route_name: 'email',
          name: '邮箱配置管理',
          module: '',
          icon: 'fa fa-envelope-square',
          children: [],
          url: '/project/email',
          attributes: {
            target: '/project/email',
          },
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.app {
  background-color: #f7f7f7;
}
[role='main'] {
  margin-top: 3rem;
}
</style>
