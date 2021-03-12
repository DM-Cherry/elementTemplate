export default {
  data() {
    return {
      staticData: {
        routerList: [
          {
            name: '报警邮箱',
            url: '/project/email',
          },
          {
            name: '用户管理',
            url: '/project/users',
          },
          {
            name: '系统配置',
            url: '/project/system',
          },
          {
            name: '历史数据',
            url: '/project/histroy',
          },
        ],
        options: [
          {
            id: 1,
            name: '设备1',
          },
          {
            id: 2,
            name: '设备2',
          },
          {
            id: 3,
            name: '设备3',
          },
        ],
        equImages: [
          '/static/images/dashboard/floor1.jpg',
          '/static/images/dashboard/floor1.jpg',
          '/static/images/dashboard/floor1.jpg',
        ],
        sonicList: [
          {
            id: 1,
            name: '设备1',
          },
          {
            id: 2,
            name: '设备2',
          },
        ],
      },
    };
  },
};
