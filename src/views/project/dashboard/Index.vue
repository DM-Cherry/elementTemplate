<template>
  <section class="dashboard-container">
    <div class="container-fluid">
      <div class="animated fadeIn">
        <div class="dashboard-header">
          <div class="header-title"><span class="name">氨泄漏实时动态监测预警系统</span></div>
          <div class="header-menu clearfix">
            <div v-for="(item, index) in staticData.routerList" :key="index" class="menu-item">
              <router-link :to="item.url" class="menu-item-link">
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>
        <el-row :gutter="20" class="main-data">
          <el-col :span="7" class="main-data-left">
            <div class="main-data-l-t">
              <div class="chart-header clearfix">
                <span class="name float-left mt-2 ml-3">1号TDLAS设备（室内）</span>
                <span
                  class="history float-right mt-4 mr-4 cursor-pointer"
                  @click="viewHistory('gateway-1234_1')"
                >
                  历史报警
                </span>
              </div>
              <div class="chart">
                <ColumnChart ref="indoor" />
              </div>
              <el-row class="chart-footer">
                <el-col :span="8" class="data-item">
                  <div class="data-name">时均浓度值</div>
                  <p>{{ statistics1.isAvg }}</p>
                </el-col>
                <el-col :span="8" class="data-item">
                  <div class="data-name">最大浓度值</div>
                  <p>{{ statistics1.isMAx }}</p>
                </el-col>
                <el-col :span="8" class="data-item">
                  <div class="data-name">最小浓度值</div>
                  <p>{{ statistics1.isMin }}</p>
                </el-col>
              </el-row>
            </div>
            <div class="main-data-l-b">
              <div class="chart-header clearfix">
                <span class="name float-left mt-2 ml-3">1号TDLAS设备（室内）</span>
                <span
                  class="history float-right mt-4 mr-4 cursor-pointer"
                  @click="viewHistory('gateway-1234_2')"
                >
                  历史报警
                </span>
              </div>
              <div class="chart">
                <ColumnChart ref="indoor2" />
              </div>
              <el-row class="chart-footer">
                <el-col :span="8" class="data-item">
                  <div class="data-name">时均浓度值</div>
                  <p>{{ statistics2.isAvg }}</p>
                </el-col>
                <el-col :span="8" class="data-item">
                  <div class="data-name">最大浓度值</div>
                  <p>{{ statistics2.isMAx }}</p>
                </el-col>
                <el-col :span="8" class="data-item">
                  <div class="data-name">最小浓度值</div>
                  <p>{{ statistics2.isMin }}</p>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="10" class="main-data-middle">
            <div class="middle-header mt-2">
              <span class="theme-name">监测位示意图</span>
            </div>
            <el-row class="middle-t">
              <el-col :span="12" class="middle-t-l">
                <div class="options clearfix mt-2">
                  <div
                    class="option-item cursor-pointer float-left ml-3"
                    v-for="(item, index) in staticData.options"
                    :key="index"
                    @click="activeOption = index"
                  >
                    <small class="small-name" :class="`${index === activeOption ? 'active' : ''}`">
                      {{ item.name }}
                    </small>
                  </div>
                </div>
                <div class="equipment-img ml-3 mt-1">
                  <div v-for="(item, index) in staticData.equImages" :key="index">
                    <el-image
                      style="height: 210px;"
                      v-if="index === activeOption"
                      :src="`${isDev ? '' : './'}${item}`"
                    ></el-image>
                  </div>
                </div>
              </el-col>
              <el-col :span="12" class="middle-t-r clearfix">
                <div class="float-right mr-1">
                  <el-image
                    :src="
                      deviceState === '0'
                        ? `${isDev ? '' : '.'}/static/images/dashboard/normal.png`
                        : `${isDev ? '' : '.'}/static/images/dashboard/warn.png`
                    "
                  ></el-image>
                </div>
                <Pie ref="pie" class="mt-2" />
              </el-col>
            </el-row>
            <div class="middle-b">
              <div class="clearfix middle-b-chart">
                <span class="float-right cursor-pointer history ml-3" @click="viewHistory('')">
                  历史报警
                </span>
                <div class="float-right sonic cursor-pointer">
                  <div
                    class="float-left"
                    v-for="(item, index) in staticData.sonicList"
                    :key="index"
                  >
                    <span
                      :class="`${index === activeSonic ? 'active' : ''}`"
                      class="mr-3"
                      @click="sonicChange(index, item.id)"
                    >
                      {{ item.name }}
                    </span>
                  </div>
                </div>
              </div>
              <DoubleColumn ref="doublecolumn" />
            </div>
          </el-col>
          <el-col :span="7" class="main-data-right">
            <div class="main-data-l-t px-3">
              <span class="header-title mt-2 mr-2">监控摄像</span>
              <div style="height: 195px;" class="mt-1">
                <iframe
                  :src="videoSrc"
                  height="100%"
                  width="100%"
                  id="F10524474"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
            <div class="main-data-r-b">
              <div class="header clearfix">
                <span
                  class="history float-left mt-3 ml-4 cursor-pointer"
                  @click="viewHistory('gateway-1234_3')"
                >
                  历史报警
                </span>
                <span class="name float-right mt-2 mr-2">1号TDLAS设备（室内）</span>
              </div>
              <div class="chart mt-1">
                <ColumnChart ref="indoor3" />
              </div>
              <el-row class="chart-footer">
                <el-col :span="8" class="data-item">
                  <div class="data-name">时均浓度值</div>
                  <p>{{ statistics3.isAvg }}</p>
                </el-col>
                <el-col :span="8" class="data-item">
                  <div class="data-name">最大浓度值</div>
                  <p>{{ statistics3.isMAx }}</p>
                </el-col>
                <el-col :span="8" class="data-item">
                  <div class="data-name">最小浓度值</div>
                  <p>{{ statistics3.isMin }}</p>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="历史数据" :visible.sync="historyVisible">
      <el-table :data="tdlsHistoryData.list">
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="50"
          :index="indexMethod"
        ></el-table-column>
        <el-table-column property="deviceState" align="center" label="设备状态" width="150">
          <template slot-scope="scope">
            <el-tag size="medium" type="danger" v-if="scope.row.deviceState === false">
              未解决
            </el-tag>
            <el-tag v-else size="medium" type="success">已解决</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creatertime" label="创建日期" align="center" width="180">
          <template slot-scope="scope">
            <div>
              {{ $dayjs(scope.row.creatertime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <template v-if="tdlshistoryId !== ''">
          <el-table-column property="warnimg" align="center" label="报警预览">
            <template v-if="tdlshistoryId !== ''" slot-scope="scope">
              <el-image
                style="width: 50px; height: 50px;"
                :src="scope.row.url"
                :preview-src-list="scope.row.srcList"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            property="deviceAngle"
            label="设备角度"
            width="100"
          ></el-table-column>
        </template>
        <template v-else>
          <el-table-column
            align="center"
            property="deviceCode"
            label="设备编号"
            width="100"
          ></el-table-column>
          <el-table-column align="center" property="l" label="瞬时" width="100"></el-table-column>
          <el-table-column align="center" property="leq" label="等效" width="100"></el-table-column>
        </template>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container mt-3">
        <el-pagination
          :current-page="tdlsHistoryData.pageNum"
          :page-sizes="page_sizes"
          :page-size="tdlsHistoryData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tdlsHistoryData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <!-- 分页 -->
    </el-dialog>
  </section>
</template>

<script>
import ColumnChart from '@/components/Common/Dashboard/Column';
import Pie from '@/components/Common/Dashboard/Pie';
import DoubleColumn from '@/components/Common/Dashboard/DoubleColumn';
// import qs from 'qs';
// import login from '@/core/mixins/login';
import staticData from './mixins/static';

const restList = {
  list: [],
  total: 1,
  pageNum: 1,
  pageSize: 5,
};
export default {
  name: 'Dashboard',
  components: { ColumnChart, Pie, DoubleColumn },
  mixins: [staticData],
  data() {
    return {
      timer: null,
      hourTimer: null,
      update: false,
      videoSrc: '',
      activeSonic: 0,
      activeOption: 0,
      historyVisible: false,
      tdlshistoryId: '',
      page_sizes: [5, 10, 15, 20, 50],
      tdlsHistoryData: {
        list: [],
        total: 1,
        pageNum: 1,
        pageSize: 5,
      },
      statistics1: {},
      statistics2: {},
      statistics3: {},
      deviceState: '0',
      sonicDevice: 1,
      isDev: true,
    };
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.hourTimer) {
      clearInterval(this.hourTimer);
      this.hourTimer = null;
    }
  },
  mounted() {
    this.isDev = process.env.NODE_ENV === 'development';
    this.getData();
    this.getPie();
    this.getVideo();
    this.getSonicData(this.sonicDevice);
    this.hourTimer = setInterval(() => {
      this.getPie();
      this.getSonicData(this.sonicDevice);
    }, 3600000);

    this.timer = setInterval(() => {
      this.update = true;
      this.getData();
    }, 5000);
  },
  methods: {
    sonicChange(i, id) {
      this.activeSonic = i;
      this.sonicDevice = id;
      this.getSonicData(this.sonicDevice);
    },
    async getVideo() {
      // 获取视频数据
      try {
        const response = await this.$axios.post('/videoToken/getVideoToken');
        if (response.status === 200) {
          this.videoSrc = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://open.ys7.com/F10524474/1.live&autoplay=1&accessToken=${response.data.data}`;
        } else {
          this.$message.error('获取视频流失败，请稍后重试');
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
    getSonicData(id) {
      // 获取声波数据
      const url = `/tdlasSonicWave/queryLineChart?deviceCode=${id}`;
      let sonicData = null;
      try {
        this.$axios.get(url).then(res => {
          if (res.data.code === 200) {
            sonicData = JSON.parse(JSON.stringify(res.data.data));
            this.$refs.doublecolumn.initialize(
              sonicData.legend,
              sonicData.xData,
              sonicData.left,
              sonicData.right,
              sonicData.columnList,
              sonicData.polyline,
              sonicData.ListMax,
            );
          } else {
            this.$message.error('获取图表数据失败，请稍后重试');
            clearInterval(this.hourTimer);
            this.hourTimer = null;
          }
        });
      } catch (e) {
        console.error(e);
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
        clearInterval(this.hourTimer);
        this.hourTimer = null;
      }
    },
    filterData(data) {
      // 过滤数据
      const chartArr = [];
      data.forEach(item => item.dataList.length !== 0 && chartArr.push(item.dataList));
      return chartArr;
    },
    getData() {
      // 获取折线图
      const request = [
        this.$axios.get('/tdlasDeviceMonitor/queryLineChart?deviceCode=gateway-1234_1'),
        this.$axios.get('/tdlasDeviceMonitor/queryLineChart?deviceCode=gateway-1234_2'),
        this.$axios.get('/tdlasDeviceMonitor/queryLineChart?deviceCode=gateway-1234_3'),
      ];
      let indoor = [];
      let indoor2 = [];
      let indoor3 = [];
      let talsData1 = null;
      let talsData2 = null;
      let talsData3 = null;
      try {
        this.$axios
          .all(request)
          .then(
            this.$axios.spread((tdlas1, tdlas2, tdlas3) => {
              talsData1 = tdlas1.data.data;
              talsData2 = tdlas2.data.data;
              talsData3 = tdlas3.data.data;
              this.statistics1 = talsData1.statistics;
              this.statistics2 = talsData2.statistics;
              this.statistics3 = talsData3.statistics;
              this.deviceState = talsData3.deviceState;
              indoor = this.filterData(talsData1.TdlasDeviceMonitorList);
              indoor2 = this.filterData(talsData2.TdlasDeviceMonitorList);
              indoor3 = this.filterData(talsData3.TdlasDeviceMonitorList);
              // eslint-disable-next-line no-unused-expressions
              this.$refs.indoor?.initialize(
                'ppm*m',
                talsData1.time,
                indoor,
                talsData1.colourList,
                talsData1.deviceAngleList,
                this.update,
              );
              // eslint-disable-next-line no-unused-expressions
              this.$refs.indoor2?.initialize(
                'ppm*m',
                talsData2.time,
                indoor2,
                talsData1.colourList,
                talsData2.deviceAngleList,
                this.update,
              );
              // eslint-disable-next-line no-unused-expressions
              this.$refs.indoor3?.initialize(
                'ppm*m',
                talsData3.time,
                indoor3,
                talsData1.colourList,
                talsData3.deviceAngleList,
                this.update,
              );
            }),
          )
          .catch(err => {
            this.$message.error('请求失败，请稍后重试');
            console.error(err);
            clearInterval(this.timer);
            this.timer = null;
          });
      } catch (e) {
        clearInterval(this.timer);
        this.timer = null;
        this.$message.error(e);
        console.error(e);
      }
    },
    getPie() {
      // 饼状图
      const color = ['#FF903A', '#EECE15', '#FF6061', '#823AFF', '#0BE0FF'];
      let pieData = null;
      try {
        this.$axios.get('tdlasDeviceMonitor/queryPieRadarChart').then(res => {
          if (res.data.code === 200) {
            pieData = res.data.data;
            // eslint-disable-next-line no-unused-expressions
            this.$refs.pie?.initialize(
              pieData.areaData,
              pieData.areaValueData,
              pieData.proportion,
              color,
            );
          } else {
            this.$message.error('获取数据失败，请稍后重试');
            clearInterval(this.timer);
            this.timer = null;
          }
        });
      } catch (e) {
        this.$message.error(e);
        console.error(e);
        clearInterval(this.hourTimer);
        this.hourTimer = null;
      }
    },
    getHistory(code) {
      // 历史报警
      const params = {
        pageNum: this.tdlsHistoryData.pageNum,
        pageSize: this.tdlsHistoryData.pageSize,
      };
      const url = code
        ? `tdlasDeviceLog/pageConditionBydeviceCodeList?deviceCode=${code}`
        : 'tdlasSonicWave/byPageCondition';
      try {
        this.$axios.get(url, { params }).then(res => {
          if (res.status === 200 && res.data.code === 200) {
            this.tdlsHistoryData = JSON.parse(JSON.stringify(res.data.data));
            if (code) {
              const data = res.data.data.list;
              const reduceData = data.reduce((acc, cur) => {
                acc.push({
                  deviceAngle: cur.deviceAngle,
                  deviceState: cur.deviceState,
                  url: cur.deviceImage,
                  srcList: cur.deviceImage ? [cur.deviceImage] : [],
                  creatertime: cur.creatertime,
                });
                return acc;
              }, []);
              this.tdlsHistoryData.list = reduceData;
            }
          } else {
            this.$message.error('获取历史数据失败，请稍后重试');
          }
        });
      } catch (e) {
        console.error(e);
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
      }
    },
    viewHistory(id) {
      // 查看历史
      this.tdlshistoryId = id;
      this.tdlsHistoryData = restList;
      this.historyVisible = true;
      this.tdlsHistoryData.pageNum = 1;
      this.tdlsHistoryData.pageSize = 5;
      this.getHistory(id);
    },
    indexMethod(index) {
      return this.tdlsHistoryData.pageSize * (this.tdlsHistoryData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.tdlsHistoryData.pageSize) {
        return;
      }
      this.tdlsHistoryData.pageSize = pageSize;
      this.getHistory(this.tdlshistoryId);
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.tdlsHistoryData.pageNum) {
        return;
      }
      this.tdlsHistoryData.pageNum = pageNum;
      this.getHistory(this.tdlshistoryId);
    },
  },
};
</script>

<style lang="scss">
@import './scss/core/_dashboard';
.app {
  /deep/ .app-body {
    // declaration-no-important
    // property-no-vendor-prefix
    overflow-x: scroll !important;
  }
}
.dashboard-container {
  height: 100%;
  min-width: 1380px;
  // declaration-no-important
  // property-no-vendor-prefix
  overflow-x: scroll !important;
  background: #060d2a;
}

.dashboard-header {
  padding: 30px 20px;
  .header-title {
    height: 60px;
    text-align: center;
    background: $header;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% auto;
    .name {
      font-size: 28px;
      font-weight: 500;
      color: #fff;
    }
  }
  .header-menu {
    margin: -30px 10% 0;
    .menu-item {
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: $menu;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100px auto;
      .menu-item-link {
        font-size: 14px;
        color: #fff;
      }
      &:nth-child(1),
      &:nth-child(2) {
        float: left;
      }
      &:nth-child(3),
      &:nth-child(4) {
        float: right;
      }
      &:nth-child(1),
      &:nth-child(4) {
        margin-right: 50px;
      }
    }
  }
}

.main-data {
  color: #fff;
  .main-data-left {
    .main-data-l-t,
    .main-data-l-b {
      height: 280px;
      background: $left;
      background-repeat: no-repeat;
      background-size: 100% auto;
      .history {
        color: #88ede7;
      }
      .chart-footer {
        .data-item {
          position: relative;
          text-align: center;
          &:first-child,
          &:nth-child(2) {
            &:after {
              position: absolute;
              top: 0;
              right: 0;
              width: 2px;
              height: 30px;
              background: #fff;
              content: '';
            }
          }
          .data-name {
            margin-top: -5px;
          }
        }
      }
    }
  }
  .main-data-middle {
    height: 560px;
    margin-top: -8px;
    background: $middle;
    background-repeat: no-repeat;
    background-size: 100% 540px;
    .middle-header {
      text-align: center;
    }
    .middle-t {
      .middle-t-l {
        .options {
          .option-item {
            width: 74px;
            line-height: 28px;
            text-align: center;
            background: $option_btn;
            background-repeat: no-repeat;
            background-size: 100% auto;
            .small-name {
              color: #fff;
              &.active {
                color: #88ede7;
              }
            }
          }
        }
      }
    }
    .middle-b {
      .middle-b-chart {
        .history {
          color: #88ede7;
        }
        .sonic {
          .active {
            color: #88ede7;
          }
        }
      }
    }
  }
  .main-data-right {
    .main-data-l-t,
    .main-data-r-b {
      height: 280px;
      text-align: right;
      background: $right;
      background-repeat: no-repeat;
      background-size: 100% auto;
      .header-title {
        display: inline-block;
      }
      .history {
        color: #88ede7;
      }
      .chart-footer {
        .data-item {
          position: relative;
          text-align: center;
          &:first-child,
          &:nth-child(2) {
            &:after {
              position: absolute;
              top: 0;
              right: 0;
              width: 2px;
              height: 30px;
              background: #fff;
              content: '';
            }
          }
          .data-name {
            margin-top: -5px;
          }
        }
      }
    }
  }
}
</style>
