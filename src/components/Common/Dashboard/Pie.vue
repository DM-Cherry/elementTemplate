<template>
  <div>
    <div ref="pieechart" style="width: 100%; height: 230px; margin: 0 auto;" />
  </div>
</template>

<script>
export default {
  name: 'Pie',
  data() {
    return {
      myechart: null,
      option: {
        tooltip: {},
        radar: {
          shape: 'circle',
          scale: true,
          indicator: [],
          center: ['50%', '50%'],
          radius: '40%',
          startAngle: 30,
          name: {
            show: true,
            color: 'transparent',
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(32,126,255, .5)',
              // opacity: 0.2
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(32,126,255, .5)',
              // opacity: 0.2
            },
          },
          splitArea: {
            areaStyle: {
              color: 'rgba(32,126,255, 0.1)',
            },
          },
        },
        polar: {
          radius: '40%',
        },
        angleAxis: {
          min: 0,
          max: 360,
          interval: 5,
          clockwise: false,
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        radiusAxis: {
          min: 0,
          max: 100,

          axisLabel: {
            textStyle: {
              color: 'rgba(29,208,240,.5)',
            },
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
        },
        series: [
          {
            type: 'radar',
            data: [
              {
                value: [],
                name: '指数',
                max: 100,
                areaStyle: {
                  normal: {
                    color: {
                      type: 'radial',
                      x: 0.5,
                      y: 0.5,
                      r: 0.5,
                      colorStops: [
                        {
                          offset: 0,
                          color: 'rgba(32,126,255, 0.5)', // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: 'rgba(32,126,255, 0.1)', // 100% 处的颜色
                        },
                      ],
                      global: false,
                    },
                  },
                },
              },
            ],
          },
          {
            type: 'pie',
            startAngle: 0,
            data: [],
            radius: ['45%', '60%'],
            name: '',
            itemStyle: {
              normal: {
                // borderColor: 'white'
              },
            },
            label: {
              normal: {
                position: 'top',
                fontSize: '12',
                color: '#fff',
              },
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.myechart = this.$echarts.init(this.$refs.pieechart);
  },
  destroyed() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    initialize(data, areaValueData, proportion, color) {
      this.option.color = color;
      this.option.radar.indicator = data;
      this.option.series[0].data[0].value = areaValueData;
      this.option.series[1].data = proportion;
      this.myechart.setOption(this.option);
      window.addEventListener('resize', this.resize);
    },
  },
};
</script>
