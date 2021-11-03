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
        coverImages: [
          {
            deviceAngle: '制冷房中心',
            deviceImage: 'https://www.csei.org.cn/image/3d/jfzx.jpg',
          },
          {
            deviceAngle: '制冷房门口',
            deviceImage: 'https://www.csei.org.cn/image/3d/jfmk.jpg',
          },
          {
            deviceAngle: '训练馆',
            deviceImage: 'https://www.csei.org.cn/image/3d/xlg.jpg',
          },
        ],
        sonicList: [
          {
            id: 1,
            name: '机房内超声波监测仪',
          },
          {
            id: 2,
            name: '出发1#区超声波监测仪',
          },
        ],
      },
    };
  },
};
