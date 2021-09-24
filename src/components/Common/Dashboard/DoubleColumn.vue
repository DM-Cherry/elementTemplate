<template>
  <div>
    <div ref="doublecolumnechart" style="width: 100%; height: 250px; margin: 0 auto;" />
  </div>
</template>

<script>
export default {
  name: 'DoubleColumn',
  data() {
    return {
      myechart: null,
      option: {
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          feature: {},
        },
        legend: {
          data: [],
          textStyle: {
            color: '#fff',
          },
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLabel: {
              color: '#fff',
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#fff',
                width: '1',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '声贝',
            axisLabel: {
              formatter: '{value} ',
              color: '#fff',
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#fff',
                width: '1',
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        grid: {
          top: '14%',
          left: '1%',
          right: '1%',
          bottom: '12%',
          containLabel: true,
        },
        series: [
          {
            // 左侧背景
            name: '',
            type: 'pictorialBar',
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,0.2)',
              },
            },
            animationDuration: 0,
            symbolRepeat: true,
            symbol: 'rect',
            symbolSize: [10, 10],
            symbolBoundingData: 250,
            symbolOffset: [-10, 0],
            data: [],
            barGap: 50,
            barCategoryGap: 0,
            z: -11,
            animationEasing: 'elasticOut',
            animationDelay(dataIndex, params) {
              return params.index * 30;
            },
          },
          {
            // 右侧背景
            type: 'pictorialBar',
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,0.2)',
              },
            },
            animationDuration: 0,
            symbolRepeat: true,
            symbol: 'rect',
            symbolSize: [10, 10],
            symbolBoundingData: 250,
            symbolOffset: [10, 0],
            data: [],
            barGap: 50,
            barCategoryGap: 0,
            z: -11,
            animationEasing: 'elasticOut',
            animationDelay(dataIndex, params) {
              return params.index * 30;
            },
          },
          {
            // 左侧方块
            name: '',
            type: 'pictorialBar',
            symbol: 'rect',
            symbolOffset: [-10, 0],
            z: -11,
            symbolRepeat: true,
            symbolSize: [10, 10],
            data: [],
            // barGap: 50,
            barCategoryGap: 100,
            animationEasing: 'elasticOut',
            animationDelay(dataIndex, params) {
              return params.index * 30;
            },
          },

          {
            // 右侧方块
            name: '',
            type: 'pictorialBar',
            symbol: 'rect',
            symbolOffset: [10, 0],
            z: -11,
            symbolRepeat: true,
            symbolSize: [10, 10],
            data: [],
            // barGap: 50,
            barCategoryGap: 100,
            animationEasing: 'elasticOut',
            animationDelay(dataIndex, params) {
              return params.index * 30;
            },
          },
          {
            name: '',
            type: 'line',
            data: [],
          },
          {
            name: '',
            type: 'line',
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    this.myechart = this.$echarts.init(this.$refs.doublecolumnechart);
  },
  destroyed() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    initialize(legend, xData, left, right, columnList, polyline, max) {
      this.option.legend.data = legend;
      this.option.xAxis[0].data = xData;
      this.option.series[0].data = left;
      this.option.series[1].data = right;
      this.option.series[2].name = columnList[0].name;
      this.option.series[2].data = columnList[0].value;
      this.option.series[3].name = columnList[1].name;
      this.option.series[3].data = columnList[1].value;
      this.option.series[4].name = polyline[0].name;
      this.option.series[4].data = polyline[0].value;
      this.option.series[5].name = polyline[1].name;
      this.option.series[5].data = polyline[1].value;
      this.option.yAxis[0].max = max;
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
