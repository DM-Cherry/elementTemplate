<template>
  <div ref="myechart" class="pie-chart" />
</template>
<script>
export default {
  name: 'PieChart',
  data() {
    return {
      myechart: null,
      option: {
        title: {
          text: '',
          // subtext: '纯属虚构',
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        color: [
          '#5694fb',
          '#52c8c9',
          '#f2a38e',
          '#f4c79a',
          '#52c8c9',
          '#94baff',
          '#94baff',
          '#9e81f1',
          '#e28269',
        ],
        series: {
          name: '',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          // label: {
          //   normal: {
          //     textStyle: {
          //       color: '#333',
          //       fontSize: 14
          //     },
          //     fontSize: 14,
          //     position: 'outside',
          //     formatter: '{b}: {c} ({d}%)'
          //   }
          // },
          // labelLine: { normal: { show: false } },
          data: [],
        },
      },
    };
  },
  mounted() {
    this.myechart = this.$echarts.init(this.$refs.myechart); // 初始化一个echarts
  },
  destroyed() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    resize() {
      if (this.myechart) {
        setTimeout(() => {
          this.myechart.resize();
        }, 400);
      }
    },
    initialize(title, piedata) {
      this.option.series.data = piedata;
      this.option.title.text = title;
      this.myechart.setOption(this.option);
      window.addEventListener('resize', this.resize);
    },
  },
};
</script>
<style lang="scss" scoped>
.pie-chart {
  width: 100%;
  height: 250px;
  margin: 0 auto;
}
@media screen and (min-width: 1200px) and (max-width: 1600px) {
  .pie-chart {
    height: 220px;
  }
}
</style>
