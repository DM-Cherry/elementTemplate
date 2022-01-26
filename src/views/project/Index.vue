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
import { Aside as AppAside, Header as AppHeader, Sidebar } from '@/components/Admin/';
import admin from '@/core/mixins/admin';
import { mapGetters } from 'vuex';

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
          visible: false,
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
          visible: false,
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
          visible: false,
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
          visible: false,
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
          visible: false,
          url: '/project/email',
          attributes: {
            target: '/project/email',
          },
        },
        {
          id: 6,
          route_name: 'time',
          name: '实时数据',
          module: '',
          icon: 'fa fa-calendar',
          children: [],
          visible: false,
          url: '/project/time',
          attributes: {
            target: '/project/time',
          },
        },
        {
          id: 7,
          route_name: 'point',
          name: '测点距离配置',
          module: '',
          icon: 'fa fa-podcast',
          children: [],
          visible: false,
          url: '/project/point',
          attributes: {
            target: '/project/point',
          },
        },
        {
          id: 8,
          route_name: 'historylog',
          name: '日志',
          module: '',
          icon: 'fa fa-window-maximize',
          children: [],
          visible: false,
          url: '/project/historylog',
          attributes: {
            target: '/project/historylog',
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters('UserStore', ['info']),
  },
  mounted() {},
  methods: {},
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
