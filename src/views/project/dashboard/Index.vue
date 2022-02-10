<template>
  <section class="dashboard-container">
    <div class="container-fluid">
      <div class="animated fadeIn">
        <div class="dashboard-header">
          <div class="header-title"><span class="name">氨泄漏实时动态监测预警系统</span></div>
          <div class="header-menu clearfix" v-if="menuList.length === 8">
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
                <span class="name float-left mt-2 ml-3">训练馆TDLAS</span>
                <div class="float-right mt-4 mr-4 cursor-pointer bells">
                  <el-image
                    :src="
                      warnStatus1
                        ? `${isDev ? '' : '.'}/static/images/dashboard/normal.png`
                        : `${isDev ? '' : '.'}/static/images/dashboard/warn.png`
                    "
                    @click="closeHistory('TDLAS-1')"
                  ></el-image>
                </div>
                <span
                  class="history float-right mt-4 mr-2 cursor-pointer"
                  @click="handleCallback('TDLAS-1')"
                >
                  点位回调
                </span>
                <span
                  class="history float-right mt-4 mr-2 cursor-pointer"
                  :class="`${closeDanger === 'TDLAS-1' ? '' : ''}`"
                  @click="viewHistory('TDLAS-1')"
                >
                  历史报警
                </span>
              </div>
              <div class="main-content">
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
            </div>
            <div class="main-data-l-b">
              <div class="chart-header clearfix">
                <span class="name float-left mt-2 ml-3">制冷机房门口TDLAS</span>
                <div class="float-right mt-4 mr-4 cursor-pointer bells">
                  <el-image
                    :src="
                      warnStatus2
                        ? `${isDev ? '' : '.'}/static/images/dashboard/normal.png`
                        : `${isDev ? '' : '.'}/static/images/dashboard/warn.png`
                    "
                    @click="closeHistory('TDLAS-3')"
                  ></el-image>
                </div>
                <span
                  class="history float-right mt-4 mr-2 cursor-pointer"
                  @click="handleCallback('TDLAS-3')"
                >
                  点位回调
                </span>
                <span
                  class="history float-right mt-4 mr-2 cursor-pointer"
                  @click="viewHistory('TDLAS-3')"
                >
                  历史报警
                </span>
              </div>
              <div class="main-content">
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
                <div class="equipment-img ml-3 mt-2">
                  <div v-for="(item, index) in staticData.coverImages" :key="index">
                    <el-image
                      style="height: 210px;"
                      v-if="index === activeOption"
                      :src="item['deviceImage']"
                      @click="previewImg(index)"
                    ></el-image>
                  </div>
                </div>
              </el-col>
              <el-col :span="12" class="middle-t-r clearfix">
                <span class="history pie-time" v-if="pieSearch.searchTime[0] !== ''">
                  {{ pieSearch.searchTime[0] + '-' + pieSearch.searchTime[1] }}
                </span>
                <span
                  class="history float-right mr-2 mt-1 cursor-pointer search-pie"
                  @click="searchPie()"
                >
                  查询
                </span>
                <Pie ref="pie" class="mt-2" />
              </el-col>
            </el-row>
            <div class="middle-b">
              <div class="clearfix middle-b-chart">
                <span class="float-right cursor-pointer history ml-3" @click="viewHistory('')">
                  历史报警
                </span>
                <div class="float-right sonic cursor-pointer" v-if="sonicList.length > 0">
                  <div class="float-left" v-for="(item, index) in sonicList" :key="index">
                    <div class="float-left cursor-pointer bells mr-1">
                      <el-image
                        @click="closeSonic(item.id)"
                        :src="
                          !item.status
                            ? `${isDev ? '' : '.'}/static/images/dashboard/normal.png`
                            : `${isDev ? '' : '.'}/static/images/dashboard/warn.png`
                        "
                      ></el-image>
                    </div>
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
              <div class="main-content">
                <div style="height: 195px;">
                  <iframe
                    :src="videoSrc"
                    height="100%"
                    width="100%"
                    id="F10524474"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>
            <div class="main-data-r-b">
              <div class="header clearfix">
                <div class="float-left mt-3 ml-4 cursor-pointer bells">
                  <el-image
                    :src="
                      warnStatus3
                        ? `${isDev ? '' : '.'}/static/images/dashboard/normal.png`
                        : `${isDev ? '' : '.'}/static/images/dashboard/warn.png`
                    "
                    @click="closeHistory('TDLAS-2')"
                  ></el-image>
                </div>
                <span
                  class="history float-left mt-3 ml-2 cursor-pointer"
                  @click="handleCallback('TDLAS-2')"
                >
                  点位回调
                </span>
                <span
                  class="history float-left mt-3 ml-4 cursor-pointer"
                  @click="viewHistory('TDLAS-2')"
                >
                  历史报警
                </span>
                <span class="name float-right mt-2 mr-3">制冷机房中心TDLAS</span>
              </div>
              <div class="main-content">
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
        <el-table-column
          align="center"
          property="deviceCode"
          label="设备编号"
          width="100"
        ></el-table-column>
        <el-table-column property="deviceState" align="center" label="设备状态" width="150">
          <template slot-scope="scope">
            <el-tag size="medium" type="danger" v-if="scope.row.deviceState === false">
              未解决
            </el-tag>
            <el-tag v-else size="medium" type="success">已解决</el-tag>
          </template>
        </el-table-column>
        <template v-if="tdlshistoryId !== ''">
          <el-table-column property="warnimg" align="center" label="报警预览">
            <template v-if="tdlshistoryId !== ''" slot-scope="scope">
              <el-image
                style="width: 50px; height: 50px;"
                :src="scope.row.url"
                :preview-src-list="scope.row.srcList"
                :z-index="3000"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            property="deviceAngle"
            label="设备角度"
            width="100"
          ></el-table-column>
          <el-table-column prop="creatertime" label="创建日期" align="center" width="180">
            <template slot-scope="scope">
              <div>
                {{ $dayjs(scope.row.creatertime).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column prop="createTime" label="创建日期" align="center" width="180">
            <template slot-scope="scope">
              <div>
                {{ $dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
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
    <el-dialog title="示意图" :visible.sync="imgVisible">
      <el-table border height="350" :data="imgList">
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          align="center"
          property="deviceCode"
          label="设备编号"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          property="deviceAngle"
          label="设备角度"
          width="100"
        ></el-table-column>
        <el-table-column property="warnimg" align="center" label="图片预览">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px;"
              :src="scope.row.deviceImage"
              :preview-src-list="scope.row.srcList"
              :z-index="3000"
            ></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <div class="swiper-dialog-container" v-if="swiperVisible">
      <el-button
        type="primary"
        icon="el-icon-close"
        @click="handleClose"
        class="close-swiper"
        circle
      ></el-button>
      <div class="swiper-container" ref="mySwiper">
        <div class="swiper-wrapper" v-if="swiperList.length">
          <div class="swiper-slide" v-for="(item, index) in swiperList" :key="index">
            <img
              style="height: 150px;"
              :src="item.deviceImage"
              :preview-src-list="[item.deviceImage]"
              :z-index="3000"
              :preview="item.deviceAngle"
            />
            <div>{{ item.deviceAngle }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="点位回调" :visible.sync="pointVisible">
      <el-form :model="pointForm">
        <el-form-item label="点位" label-width="80">
          <el-input type="number" v-model="pointForm.point" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pointVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePoint()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="日期选择" :visible.sync="searchTimeVisible">
      <el-row>
        <el-form :model="pieSearch">
          <el-form-item label="查询日期" prop="searchTime">
            <el-date-picker
              clearable
              v-model="pieSearch.searchTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button type="primary" @click="clearTime">一键清空</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="searchTimeVisible = false">取 消</el-button>
        <el-button type="primary" @click="getPie('search')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
// import ColumnChart from '@/components/Common/Dashboard/Column';
import ColumnChart from '@/components/Common/Dashboard/newColumn';
import Pie from '@/components/Common/Dashboard/Pie';
import DoubleColumn from '@/components/Common/Dashboard/DoubleColumn';
// import qs from 'qs';
// import login from '@/core/mixins/login';
// eslint-disable-next-line import/no-extraneous-dependencies
import Swiper from 'swiper';
import qs from 'qs';
import { mapGetters } from 'vuex';
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
      searchTimeVisible: false,
      pieSearch: {
        searchTime: ['', ''],
      },
      sonicStatusList: null,
      closeDanger: '',
      swiperVisible: false,
      imgVisible: false,
      imgList: [],
      newDate: '2020-01-01',
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
      warnStatus1: true,
      warnStatus2: true,
      warnStatus3: true,
      deviceState: '0',
      sonicDevice: 1,
      isDev: true,
      viewImgList: [],
      swiperContainer: null,
      swiperList: [],
      pointVisible: false,
      pointForm: {
        point: '',
        type: '',
      },
      sonicList: [],
      menuList: 0,
    };
  },
  computed: {
    ...mapGetters('UserStore', ['info']),
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
  created() {
    this.getSonicStatus();
    this.getImgList();
  },
  mounted() {
    this.menuList = JSON.parse(localStorage.getItem('permission'));
    this.isDev = process.env.NODE_ENV === 'development';
    this.getData();
    this.getPie();
    this.getVideo();
    this.getSonicData(this.sonicDevice);
    this.hourTimer = setInterval(() => {
      this.getPie();
      this.getSonicData(this.sonicDevice);
      this.getSonicStatus();
    }, 3000);
    this.timer = setInterval(() => {
      this.update = true;
      this.getData();
    }, 1600);
  },
  methods: {
    async getSonicStatus() {
      const res = await this.$axios.get('/tdlasSonicWave/getTdlasSonicState');
      if (res.status === 200) {
        const status = res.data.data;
        const sonicList = [
          {
            id: 1,
            name: '机房内超声波监测仪',
            deviceCode: '1',
            status: status.sonic1,
          },
          {
            id: 2,
            name: '出发1#区超声波监测仪',
            deviceCode: '2',
            status: status.sonic2,
          },
        ];
        this.$set(this, 'sonicList', sonicList);
      }
    },
    closeSonic(id) {
      this.$axios.post(`/tdlasSonicWave/relieve?deviceCode=${id}`).then(res => {
        if (res.status === 200) {
          this.$message.success('解除报警成功');
          this.getSonicStatus();
        } else {
          this.$message.error('解除报警失败请稍后重试！');
        }
      });
    },
    clearTime() {
      this.pieSearch.searchTime = ['', ''];
    },
    searchPie() {
      this.searchTimeVisible = true;
    },
    handleCallback(type) {
      this.pointVisible = true;
      this.pointForm.type = type;
      this.pointForm.point = '';
    },
    updatePoint() {
      const params = {
        tdlasCode: this.pointForm.type,
        point: this.pointForm.point,
      };
      this.$axios.post('/tdlasDeviceMonitor/tdlasFixedPosition', qs.stringify(params)).then(res => {
        if (res.status === 200) {
          this.$message.success('复位成功');
        } else {
          this.$message.error('复位失败请稍后重试！');
        }
        this.pointVisible = false;
      });
    },
    handleClose() {
      this.swiperVisible = false;
      this.swiperContainer = null;
    },
    prev() {
      this.$refs.mySwiper.swiper.slidePrev();
    },
    next() {
      this.$refs.mySwiper.swiper.slideNext();
    },
    getImgList() {
      const request = [
        this.$axios.get('/devcie3D/gettdlasDataConfigList?deviceCode=TDLAS-2'),
        this.$axios.get('/devcie3D/gettdlasDataConfigList?deviceCode=TDLAS-3'),
        this.$axios.get('/devcie3D/gettdlasDataConfigList?deviceCode=TDLAS-1'),
      ];
      this.$axios.all(request).then(
        this.$axios.spread((tdlas1, tdlas2, tdlas3) => {
          this.$nextTick(() => {
            this.viewImgList[0] = [this.staticData.coverImages[0]].concat(tdlas1.data.data);
            this.viewImgList[1] = [this.staticData.coverImages[1]].concat(tdlas2.data.data);
            this.viewImgList[2] = [this.staticData.coverImages[2]].concat(tdlas3.data.data);
          });
        }),
      );
    },
    previewImg(idx) {
      // this.imgList = this.viewImgList[idx];
      // this.viewImgList[idx].forEach(item => {
      //   // eslint-disable-next-line no-param-reassign
      //   item.srcList = [item.deviceImage];
      // });
      // this.imgVisible = true;
      this.swiperList = this.viewImgList[idx];
      this.swiperVisible = true;
      if (this.swiperContainer !== null) return;
      this.initSwiper();
    },
    initSwiper() {
      this.$nextTick(() => {
        this.swiperContainer = new Swiper('.swiper-container', {
          watchSlidesVisibility: true,
          observeParents: true,
          observer: true,
          slidesPerView: 5,
          spaceBetween: 30,
          slidesPerGroup: 1,
          loop: true,
          onSlideChangeEnd(swiper) {
            swiper.update();
          },
        });
      });
    },
    sonicChange(i, id) {
      this.activeSonic = i;
      this.sonicDevice = id;
      this.getSonicData(this.sonicDevice);
    },
    async getVideo() {
      // 获取视频数据
      try {
        const response = await this.$axios.post('/videoToken/getVideoToken');
        if (response.data && response.status === 200) {
          this.videoSrc = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://open.ys7.com/F34056591/1.live&autoplay=1&accessToken=${response.data.data}`;
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
          if (res.data && res.data.code === 200) {
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
        this.$axios.get(
          `/tdlasDeviceMonitor/queryLineChart?deviceCode=TDLAS-1&newDate=${this.newDate}`,
        ),
        this.$axios.get(
          `/tdlasDeviceMonitor/queryLineChart?deviceCode=TDLAS-3&newDate=${this.newDate}`,
        ),
        this.$axios.get(
          `/tdlasDeviceMonitor/queryLineChart?deviceCode=TDLAS-2&newDate=${this.newDate}`,
        ),
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
              if (tdlas1.data.data && tdlas2.data.data && tdlas3.data.data) {
                talsData1 = tdlas1.data.data;
                talsData2 = tdlas2.data.data;
                talsData3 = tdlas3.data.data;
                this.newDate = talsData1.newDate;
                this.warnStatus1 = talsData1.isWarning;
                this.warnStatus2 = talsData2.isWarning;
                this.warnStatus3 = talsData3.isWarning;
                this.statistics1 = talsData1.statistics;
                this.statistics2 = talsData2.statistics;
                this.statistics3 = talsData3.statistics;
                this.deviceState = talsData3.deviceState;
                indoor = this.filterData(talsData1.TdlasDeviceMonitorList);
                indoor2 = this.filterData(talsData2.TdlasDeviceMonitorList);
                indoor3 = this.filterData(talsData3.TdlasDeviceMonitorList);
                if (talsData1.time.length > 0 && indoor.length > 0) {
                  this.$nextTick(() => {
                    // eslint-disable-next-line no-unused-expressions
                    this.$refs.indoor?.initialize(
                      'ppm',
                      talsData1.time,
                      indoor,
                      talsData1.colourList,
                      talsData1.deviceAngleList,
                      this.update,
                    );
                  });
                }
                if (talsData2.time.length > 0 && indoor2.length > 0) {
                  this.$nextTick(() => {
                    // eslint-disable-next-line no-unused-expressions
                    this.$refs.indoor2?.initialize(
                      'ppm',
                      talsData2.time,
                      indoor2,
                      talsData1.colourList,
                      talsData2.deviceAngleList,
                      this.update,
                    );
                  });
                }
                if (talsData3.time.length > 0 && indoor3.length > 0) {
                  this.$nextTick(() => {
                    // eslint-disable-next-line no-unused-expressions
                    this.$refs.indoor3?.initialize(
                      'ppm',
                      talsData3.time,
                      indoor3,
                      talsData1.colourList,
                      talsData3.deviceAngleList,
                      this.update,
                    );
                  });
                }
              }
            }),
          )
          .catch(err => {
            const msg = err.msg || '请求超时，请稍后重试';
            this.$message.error(msg);
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
    getPie(type) {
      // 饼状图
      const color = ['#FF903A', '#EECE15', '#FF6061', '#823AFF', '#0BE0FF'];
      let pieData = null;
      try {
        this.$axios
          .get(
            `/tdlasDeviceMonitor/queryPieRadarChart?startTime=${this.pieSearch.searchTime[0]}&endTime=${this.pieSearch.searchTime[1]}`,
          )
          .then(res => {
            if (res.data && res.data.code === 200) {
              if (type === 'search') {
                this.searchTimeVisible = false;
              }
              pieData = res.data.data;
              // eslint-disable-next-line no-unused-expressions
              this.$refs.pie?.initialize(
                pieData.areaData,
                pieData.areaValueData,
                pieData.proportion,
                color,
              );
            } else {
              if (type === 'search') {
                this.searchTimeVisible = false;
              }
              this.$message.error('获取数据失败，请稍后重试');
              clearInterval(this.timer);
              this.timer = null;
            }
          });
      } catch (e) {
        if (type === 'search') {
          this.searchTimeVisible = false;
        }
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
          if (res.data && res.data.code === 200) {
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
                  deviceCode: cur.deviceCode,
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
    closeHistory(id) {
      const url = `/tdlasDeviceMonitor/tdlasControlDeploymentWithdrawal?tdlasCode=${id}`;
      try {
        this.$axios.get(url).then(res => {
          if (res.data && res.data.code === 200) {
            this.closeDanger = id;
            this.$message.success('成功关闭报警');
          } else {
            this.$message.error('关闭报警失败，请稍后重试');
          }
        });
      } catch (e) {
        console.error(e);
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
      }
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
//.el-image-viewer__wrapper {
//  bottom: 200px !important;
//}
.pswp {
  z-index: 3000 !important;
}

.el-image-viewer__img {
  max-height: 50% !important;
}

.app {
  /deep/ .app-body {
    position: relative;
    // declaration-no-important
    // property-no-vendor-prefix
    overflow-x: scroll !important;
    //min-width: 1400px;
  }
}
.swiper-dialog {
  /deep/.el-dialog {
    background: none;
  }
}

.swiper-dialog-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2001;
  margin: 0;
  overflow: auto;
  background: rgba(0, 0, 0, 0.3);
}
.swiper-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 200px;
}
.swiper-slide {
  padding-top: 10px;
  font-size: 18px;
  text-align: center;
  background: #fff;
}
.close-swiper {
  position: fixed;
  right: 80px;
  bottom: 280px;
  font-weight: bold;
}
.dashboard-container {
  height: 100%;
  min-width: 1400px;
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
      height: 40vh;
      padding: 10px;
      background: $left;
      background-repeat: no-repeat;
      background-size: 100% 35vh;
      .history {
        color: #88ede7;
      }
      .danger {
        color: red;
      }
      .main-content {
        position: relative;
        top: 40%;
        transform: translateY(-50%);
        .chart-footer {
          .data-item {
            position: relative;
            text-align: center;
            &:first-child,
            &:nth-child(2) {
              &:after {
                position: absolute;
                top: -5px;
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
  .main-data-middle {
    position: relative;
    height: 80vh;
    margin-top: -8px;
    background: $middle;
    background-repeat: no-repeat;
    background-size: 100% 75vh;
    .middle-header {
      text-align: center;
    }
    .middle-t {
      .history {
        color: #88ede7;
      }
      .pie-time {
        position: absolute;
        top: 14px;
        right: 60px;
      }
      .search-pie {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 999999;
      }
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
      position: absolute;
      bottom: 10%;
      left: 0;
      width: 100%;
      .middle-b-chart {
        .history {
          color: #88ede7;
        }
        .danger {
          color: red;
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
      height: 40vh;
      padding: 10px;
      text-align: right;
      background: $right;
      background-repeat: no-repeat;
      background-size: 100% 35vh;
      .header-title {
        display: inline-block;
      }
      .history {
        color: #88ede7;
      }
      .danger {
        color: red;
      }
      .main-content {
        position: relative;
        top: 40%;
        transform: translateY(-50%);
        .chart-footer {
          .data-item {
            position: relative;
            text-align: center;
            &:first-child,
            &:nth-child(2) {
              &:after {
                position: absolute;
                top: -5px;
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
}
.default-status {
  color: #fff;
}
.warning-status {
  color: red;
}
.bells {
  width: 20px;
  height: 20px;
}
</style>
