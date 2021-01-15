<template>
  <div>
    <div ref="columnechart" style="width: 100%; height: 240px; margin: 0 auto;" />
  </div>
</template>

<script>
export default {
  name: 'ColumnChart',
  data() {
    return {
      myechart: null,
      option: {
        title: {
          text: '',
          // subtext: '纯属虚构',
          x: 'left',
        },
        color: [],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        // legend: {
        //   top: 10,
        //   right: '10%',
        //   data: ['数据1', '数据2'],
        // },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            name: 'h:m',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B',
              },
            },
            data: [],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [],
      },
    };
  },
  mounted() {
    this.myechart = this.$echarts.init(this.$refs.columnechart);
  },
  destroyed() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    initialize(projectNameList, data, color, unit) {
      this.option.xAxis[0].data = projectNameList;
      this.option.color = color;
      const dataArr = [];
      data.forEach((item, index) => {
        dataArr.push({
          name: `数据${index + 1}`,
          type: 'line',
          barWidth: 6,
          barGap: 0,
          label: '1',
          data: item,
        });
      });
      this.option.series = dataArr;
      this.option.yAxis[0].name = unit;
      this.myechart.setOption(this.option);
      window.addEventListener('resize', this.resize);
    },
    resize() {
      if (this.myechart) {
        setTimeout(() => {
          this.myechart.resize();
        }, 400);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
