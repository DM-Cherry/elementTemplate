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
        path: 'histroy',
        name: 'project.histroy',
        meta: {
          name: '历史数据管理',
        },
        component: () => import('@/views/project/histroy/Index.vue'),
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
      // {
      //   path: 'test',
      //   name: 'project.test',
      //   meta: {
      //     name: '第二版',
      //   },
      //   component: () => import('@/views/project/dashboard/Test.vue'),
      // },
    ],
  },
];
