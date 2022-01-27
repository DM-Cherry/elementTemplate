export default [
  {
    path: '/project/',
    name: 'project.home',
    component: () => import('@/views/project/Index.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'project.dashboard',
        meta: {
          name: '仪表盘（代办事项）',
        },
        component: () => import('@/views/project/dashboard/Index.vue'),
      },
      {
        path: 'time',
        name: 'project.time',
        meta: {
          name: '实时数据',
        },
        component: () => import('@/views/project/time/Index.vue'),
      },
      {
        path: 'users',
        name: 'project.users',
        meta: {
          name: '用户管理',
        },
        component: () => import('@/views/project/users/Index.vue'),
      },
      {
        path: 'history',
        name: 'project.history',
        meta: {
          name: '历史数据管理',
        },
        component: () => import('@/views/project/history/Index.vue'),
      },
      {
        path: 'system',
        name: 'project.system',
        meta: {
          name: '系统配置管理',
        },
        component: () => import('@/views/project/system/Index.vue'),
      },
      {
        path: 'email',
        name: 'project.email',
        meta: {
          name: '邮箱配置管理',
        },
        component: () => import('@/views/project/email/Index.vue'),
      },
      {
        path: 'point',
        name: 'project.point',
        meta: {
          name: '测点距离配置',
        },
        component: () => import('@/views/project/point/Index.vue'),
      },
      {
        path: 'historylog',
        name: 'project.historylog',
        meta: {
          name: '日志',
        },
        component: () => import('@/views/project/log/Index.vue'),
      },
    ],
  },
];
