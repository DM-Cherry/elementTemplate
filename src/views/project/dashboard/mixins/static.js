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
            name: '制冷房-中',
          },
          {
            id: 2,
            name: '制冷房-门',
          },
          {
            id: 3,
            name: '训练馆',
          },
        ],
        equImages: [
          `${process.env.NODE_ENV === 'development' ? '' : '.'}/static/images/dashboard/floor1.png`,
          `${process.env.NODE_ENV === 'development' ? '' : '.'}/static/images/dashboard/floor1.png`,
          `${process.env.NODE_ENV === 'development' ? '' : '.'}/static/images/dashboard/floor4.png`,
        ],
        sonicList: [
          {
            id: 1,
            name: '机房内超声波监测仪',
          },
          {
            id: 2,
            name: '出发区超声波监测仪',
          },
        ],
      },
    };
  },
};
