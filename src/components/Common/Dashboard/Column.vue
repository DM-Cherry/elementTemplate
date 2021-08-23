<template>
  <div>
    <div ref="columnechart" style="width: 100%; height: 165px; margin: 0 auto;" />
  </div>
</template>

<script>
export default {
  name: 'Column',
  data() {
    return {
      myechart: null,
      option: {
        title: {
          text: '',
          x: 'left',
        },
        color: [],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
        },
        calculable: true,
        grid: {
          top: '14%',
          left: '4%',
          right: '4%',
          bottom: '12%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLabel: {
            textStyle: {
              color: 'rgb(0,253,255,0.6)',
            },
          },
        },
        yAxis: {
          name: '',
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: 'rgb(0,253,255,0.6)',
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgb(23,255,243,0.3)',
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(0,253,255,0.6)',
            },
          },
        },
        series: [],
      },
      firstXlist: [],
      firstValue: [],
      storageXlist: [],
      storageValue: [],
      columnTimer: null,
    };
  },
  mounted() {
    this.myechart = this.$echarts.init(this.$refs.columnechart);
  },
  destroyed() {
    if (this.columnTimer) {
      clearInterval(this.columnTimer);
      this.columnTimer = null;
    }
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    initialize(unit, xList, value, color, names, update) {
      const t = this;
      // t.columnTimer = setInterval(() => {
      if (update) {
        for (let i = 0; i < value.length; i += 1) {
          if (t.storageXlist.length > 0 && t.storageValue.length > 0) {
            t.storageXlist.concat(xList);
            t.storageValue[i].concat(value[i]);
          } else {
            t.storageXlist = xList;
            t.storageValue = value;
          }
          t.firstXlist.shift();
          t.firstValue[i].shift();
          t.firstXlist.push(t.storageXlist[0]);
          t.firstValue[i].push(t.storageValue[i][0]);
          t.storageXlist.shift();
          t.storageValue[i].shift();
        }
      } else {
        t.firstXlist = xList;
        t.firstValue = value;
      }
      const dataArr = [];
      for (let i = 0; i < names.length; i += 1) {
        let x = i;
        if (x > color.length - 1) {
          x = color.length - 1;
        }
        const data = {
          name: names[i],
          type: 'line',
          color: `${color[x]})`,
          smooth: true,
          areaStyle: {
            normal: {
              color: new t.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: `${color[x]}, 0.3)`,
                  },
                  {
                    offset: 0.8,
                    color: `${color[x]}, 0)`,
                  },
                ],
                false,
              ),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10,
            },
          },
          symbol: 'circle',
          symbolSize: 5,
          data: t.firstValue[i],
        };
        dataArr.push(data);
      }
      t.option.xAxis.data = t.firstXlist;
      t.option.series = dataArr;
      t.option.yAxis.name = unit || '';
      t.myechart.setOption(this.option);
      window.addEventListener('resize', this.resize);
      // }, 200);
      // this.option.xAxis.data = xList;
      // this.option.yAxis.name = unit || '';
      // this.myechart.setOption(this.option);
      // window.addEventListener('resize', this.resize);
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
