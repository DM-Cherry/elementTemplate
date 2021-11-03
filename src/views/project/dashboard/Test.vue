<template>
  <section>
    <div class="container-fluid mt-2">
      <div class="animated fadeIn">
        <h5 class="my-3">氨制冷房泄漏监测</h5>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>1号TDLAS</span>
              </div>
              <ColumnChart ref="tdlas1" />
              <el-row class="text-center border-top">
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics1.isAvg }}</h5>
                    <small class="mb-0">时均浓度值</small>
                    <div class="mb-0 small-size">（ppm*m）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics1.isMin }}</h5>
                    <small class="mb-0">最小浓度值</small>
                    <div class="mb-0 small-size">（ppm*m）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics1.isMAx }}</h5>
                    <small class="mb-0">最大浓度值</small>
                    <div class="mb-0 small-size">（ppm*m）</div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>2号TDLAS</span>
              </div>
              <ColumnChart ref="tdlas2" />
              <el-row class="text-center border-top">
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics2.isAvg }}</h5>
                    <small class="mb-0">时均浓度值</small>
                    <div class="mb-0 small-size">（ppm*m）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics2.isMin }}</h5>
                    <small class="mb-0">最小浓度值</small>
                    <div class="mb-0 small-size">（ppm*m）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics2.isMAx }}</h5>
                    <small class="mb-0">最大浓度值</small>
                    <div class="mb-0 small-size">（ppm*m）</div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>1号超声波</span>
              </div>
              <ColumnChart ref="sonic1" />
              <el-row class="text-center border-top">
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics4.isAvg }}</h5>
                    <small class="mb-0">时均声强值</small>
                    <div class="mb-0 small-size">（db）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics4.isMin }}</h5>
                    <small class="mb-0">最小声强值</small>
                    <div class="mb-0 small-size">（db）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics4.isMAx }}</h5>
                    <small class="mb-0">最大声强值</small>
                    <div class="mb-0 small-size">（db）</div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt-2">
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <el-button class="float-left py-1 mr-1" type="text" @click="viewImg('1')">
                  预览
                </el-button>
                <div class="float-left py-1">
                  <div class="point normal float-left"></div>
                  <div class="point warn float-left"></div>
                </div>
                <el-button
                  class="float-right py-1"
                  type="text"
                  @click="viewHistory('gateway-1234_1')"
                >
                  查看历史
                </el-button>
              </div>
              <div class="position-relative wrap">
                <div class="traffic-light clearfix">
                  <el-row :gutter="28" class="mx-0 light">
                    <el-col
                      :span="3"
                      v-for="(item, index) in tdls1Status"
                      :key="index"
                      class="text-center px-0"
                    >
                      <div
                        class="traffic-light-item"
                        :class="`${index === activeId ? 'fade' : ''}`"
                        :style="
                          `background-color:${item.deviceState === 'False' ? 'red' : 'green'}`
                        "
                      ></div>
                    </el-col>
                  </el-row>
                </div>
                <el-row :gutter="28" class="mx-0 clearfix my-3 serial-number">
                  <el-col
                    :span="3"
                    :key="index"
                    v-for="(item, index) in tdls1Status"
                    class="text-center px-0"
                  >
                    {{ index + 1 }}号
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <el-button class="float-left py-1 mr-1" type="text" @click="viewImg('2')">
                  预览
                </el-button>
                <div class="float-left py-1">
                  <div class="point normal float-left"></div>
                  <div class="point warn float-left"></div>
                </div>
                <el-button
                  class="float-right py-1"
                  type="text"
                  @click="viewHistory('gateway-1234_2')"
                >
                  查看历史
                </el-button>
              </div>
              <div class="position-relative wrap">
                <div class="traffic-light clearfix">
                  <el-row :gutter="28" class="mx-0 light">
                    <el-col
                      :span="3"
                      v-for="(item, index) in tdls2Status"
                      :key="index"
                      class="text-center px-0"
                    >
                      <div
                        class="traffic-light-item"
                        :class="`${index === activeId ? 'fade' : ''}`"
                        :style="
                          `background-color:${item.deviceState === 'False' ? 'red' : 'green'}`
                        "
                      ></div>
                    </el-col>
                  </el-row>
                </div>
                <el-row :gutter="28" class="mx-0 clearfix my-3 serial-number">
                  <el-col
                    :span="3"
                    :key="index"
                    v-for="(item, index) in tdls2Status"
                    class="text-center px-0"
                  >
                    {{ index + 1 }}号
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <h5 class="my-3">赛道出发1#区泄漏监测</h5>
        <el-row :gutter="20" class="mt-2">
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>3号TDLAS</span>
              </div>
              <ColumnChart ref="tdlas3" />
              <el-row class="text-center border-top">
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics3.isAvg }}</h5>
                    <small class="mb-0">时均浓度值</small>
                    <div class="mb-0 small-size">（ppm*m）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics3.isMin }}</h5>
                    <small class="mb-0">最小浓度值</small>
                    <div class="mb-0 small-size">（ppm*m）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics3.isMAx }}</h5>
                    <small class="mb-0">最大浓度值</small>
                    <div class="mb-0 small-size">（ppm*m）</div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>2号超声波</span>
              </div>
              <ColumnChart ref="sonic2" />
              <el-row class="text-center border-top">
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics5.isAvg }}</h5>
                    <small class="mb-0">时均声强值</small>
                    <div class="mb-0 small-size">（db）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics5.isMin }}</h5>
                    <small class="mb-0">最小声强值</small>
                    <div class="mb-0 small-size">（db）</div>
                  </div>
                </el-col>
                <el-col :span="8" class="right-line">
                  <div class="p-2">
                    <h5 class="mb-0">{{ statistics5.isMAx }}</h5>
                    <small class="mb-0">最大声强值</small>
                    <div class="mb-0 small-size">（db）</div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <span>视频展示区域</span>
              </div>
              <div style="height: 320px;">
                <iframe
                  :src="videoSrc"
                  height="100%"
                  width="100%"
                  id="F10524474"
                  allowfullscreen
                ></iframe>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mt-2">
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="clearfix">
                <!-- <el-button class="float-left py-1" type="text" @click="viewImg('3')">
                  预览
                </el-button> -->
                <div class="float-left py-1">
                  <div class="point normal float-left"></div>
                  <div class="point warn float-left"></div>
                </div>
                <el-button
                  class="float-right py-1"
                  type="text"
                  @click="viewHistory('gateway-1234_3')"
                >
                  查看历史
                </el-button>
              </div>
              <div class="position-relative wrap">
                <div class="traffic-light clearfix">
                  <el-row :gutter="28" class="mx-0 light">
                    <el-col
                      :span="3"
                      v-for="(item, index) in tdls3Status"
                      :key="index"
                      class="text-center px-0"
                    >
                      <div
                        class="traffic-light-item"
                        :class="`${index === activeId ? 'fade' : ''}`"
                        :style="
                          `background-color:${item.deviceState === 'False' ? 'red' : 'green'}`
                        "
                      ></div>
                    </el-col>
                  </el-row>
                </div>
                <el-row :gutter="28" class="mx-0 clearfix my-3 serial-number">
                  <el-col
                    :span="3"
                    :key="index"
                    v-for="(item, index) in tdls3Status"
                    class="text-center px-0"
                  >
                    {{ index + 1 }}号
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog title="历史数据" :visible.sync="histroyVisible">
      <el-table :data="tdlsHistroyData.list">
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="50"
          :index="indexMethod"
        ></el-table-column>
        <el-table-column
          align="center"
          property="deviceAngle"
          label="设备角度"
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
        <el-table-column prop="creatertime" label="创建日期" align="center" width="180">
          <template slot-scope="scope">
            <div>
              {{ $dayjs(scope.row.creatertime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column property="warnimg" align="center" label="报警预览">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px;"
              :src="scope.row.url"
              :preview-src-list="scope.row.srcList"
            ></el-image>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container mt-3">
        <el-pagination
          :current-page="tdlsHistroyData.pageNum"
          :page-sizes="page_sizes"
          :page-size="tdlsHistroyData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tdlsHistroyData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <!-- 分页 -->
    </el-dialog>
    <el-dialog title="平面图" :visible.sync="viewVisible">
      <el-image
        style="width: 100%; height: 100%;"
        :src="srcList[0]"
        :preview-src-list="srcList"
      ></el-image>
    </el-dialog>
  </section>
</template>

<script>
import ColumnChart from '@/components/Common/Dashboard/ColumnChart';
import qs from 'qs';

const restList = {
  list: [],
  total: 1,
  pageNum: 1,
  pageSize: 5,
};
export default {
  name: 'Dashboard',
  components: { ColumnChart },
  data() {
    return {
      isDev: true,
      videoSrc: '',
      histroyVisible: false,
      viewVisible: false,
      statistics2: {},
      statistics3: {},
      statistics1: {},
      statistics4: {},
      statistics5: {},
      tdlshistoryId: '',
      srcList: ['./static/images/dashboard/floor1.png'],
      page_sizes: [5, 10, 15, 20, 50],
      tdlsHistroyData: {
        list: [],
        total: 1,
        pageNum: 1,
        pageSize: 5,
      },
      activeId: 0,
      tdls1Status: [],
      tdls2Status: [],
      tdls3Status: [],
      dataTimer: null,
      carouselTimer: null,
    };
  },
  destroyed() {
    if (this.dataTimer) {
      clearInterval(this.dataTimer);
      this.dataTimer = null;
    }
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.carouselTimer = null;
    }
  },
  mounted() {
    this.isDev = process.env.NODE_ENV === 'development';
    this.srcList = this.isDev
      ? ['/static/images/dashboard/floor1.png']
      : ['./static/images/dashboard/floor1.png'];
    this.getVideo();
    this.getData();
    this.getCarousel();
    this.dataTimer = setInterval(() => {
      this.getData();
      if (this.activeId === 6) {
        this.activeId = 0;
      } else {
        this.activeId += 1;
      }
    }, 3000);
    this.carouselTimer = setInterval(() => {
      this.getCarousel();
    }, 21000);
  },
  methods: {
    filterData(data) {
      // 过滤数据
      const chartArr = [];
      data.forEach(item => chartArr.push(item.dataList));
      return chartArr;
    },
    getCarousel() {
      // 获取设备状态
      const request = [
        this.$axios.get(
          'tdlasDeviceMonitor/queryLineChartCarouselByDeviceCode?deviceCode=gateway-1234_1',
        ),
        this.$axios.get(
          'tdlasDeviceMonitor/queryLineChartCarouselByDeviceCode?deviceCode=gateway-1234_2',
        ),
        this.$axios.get(
          'tdlasDeviceMonitor/queryLineChartCarouselByDeviceCode?deviceCode=gateway-1234_3',
        ),
      ];
      try {
        this.$axios
          .all(request)
          .then(
            this.$axios.spread((carousel1, carousel2, carousel3) => {
              this.tdls1Status = carousel1.data.data;
              this.tdls2Status = carousel2.data.data;
              this.tdls3Status = carousel3.data.data;
            }),
          )
          .catch(err => {
            clearInterval(this.carouselTimer);
            this.carouselTimer = null;
            this.$message.error('请求失败，请稍后重试');
            console.log('err', err);
          });
      } catch (e) {
        clearInterval(this.carouselTimer);
        this.carouselTimer = null;
        this.$message.error(e);
        console.error('e', e);
      }
    },
    getData() {
      // 获取折线图数据
      const request = [
        this.$axios.get('/tdlasDeviceMonitor/queryLineChart?deviceCode=gateway-1234_1'),
        this.$axios.get('/tdlasDeviceMonitor/queryLineChart?deviceCode=gateway-1234_2'),
        this.$axios.get('/tdlasDeviceMonitor/queryLineChart?deviceCode=gateway-1234_3'),
        this.$axios.get('tdlasSonicWave/queryLineChart?deviceCode=1'),
        this.$axios.get('tdlasSonicWave/queryLineChart?deviceCode=2'),
      ];
      let echart1 = [];
      let echart2 = [];
      let echart3 = [];
      let echart4 = [];
      let echart5 = [];
      let date1 = [];
      let date2 = [];
      let date3 = [];
      let date4 = [];
      let date5 = [];
      try {
        this.$axios
          .all(request)
          .then(
            this.$axios.spread((tdlas1, tdlas2, tdlas3, sonic1, sonic2) => {
              this.statistics2 = tdlas2.data.data.statistics;
              this.statistics3 = tdlas3.data.data.statistics;
              this.statistics1 = tdlas1.data.data.statistics;
              this.statistics4 = sonic1.data.data.statistics;
              this.statistics5 = sonic2.data.data.statistics;
              echart1 = this.filterData(tdlas1.data.data.TdlasDeviceMonitorList);
              echart2 = this.filterData(tdlas2.data.data.TdlasDeviceMonitorList);
              echart3 = this.filterData(tdlas3.data.data.TdlasDeviceMonitorList);
              echart4 = this.filterData(sonic1.data.data.TdlasDeviceMonitorList);
              echart5 = this.filterData(sonic2.data.data.TdlasDeviceMonitorList);
              date1 = tdlas1.data.data.time;
              date2 = tdlas2.data.data.time;
              date3 = tdlas3.data.data.time;
              date4 = sonic1.data.data.time;
              date5 = sonic2.data.data.time;
              // eslint-disable-next-line no-unused-expressions
              this.$refs.tdlas1?.initialize(
                date1,
                echart1,
                ['#5694fb', '#71e8c5', '#57617B', '#f60', '#ffde33', '#6a7985', '#409EFF'],
                '（ppm*m）',
              );
              // eslint-disable-next-line no-unused-expressions
              this.$refs.tdlas2?.initialize(
                date2,
                echart2,
                ['#E69029', '#CC3E1A', '#E3AD0C', '#AAE30C', '#10E30C', '#0CE3AA', '#0C33E3'],
                '（ppm*m）',
              );
              // eslint-disable-next-line no-unused-expressions
              this.$refs.tdlas3?.initialize(
                date3,
                echart3,
                ['#D5A93A', '#3FC464', '#5DD6D2', '#2F4B91', '#940CE3', '#E30CD8', '#E30C5B'],
                '（ppm*m）',
              );
              // eslint-disable-next-line no-unused-expressions
              this.$refs.sonic1?.initialize(
                date4,
                echart4,
                ['#FF9040', '#FCFF40', '#40FFEC', '#40A3FF', '#4043FF', '#FF4059', '#AC40FF'],
                '（db）',
              );
              // eslint-disable-next-line no-unused-expressions
              this.$refs.sonic2?.initialize(
                date5,
                echart5,
                ['#A0350E', '#F49C0E', '#D0D259', '#218708', '#08E1B6', '#190774', '#EE0ED4'],
                '（db）',
              );
            }),
          )
          .catch(err => {
            clearInterval(this.dataTimer);
            this.dataTimer = null;
            this.$message.error('请求失败，请稍后重试');
            console.error(err);
          });
      } catch (e) {
        clearInterval(this.dataTimer);
        this.dataTimer = null;
        this.$message.error(e);
        console.error(e);
      }
    },
    async getVideo() {
      // 获取视频数据
      try {
        const response = await this.$axios.post(
          `https://api2.hik-cloud.com/oauth/token?${qs.stringify({
            client_id: 'd6f7b8b5288c47949f2f943bdf9597ec',
            client_secret: 'd30c818702b34c5bb41aa2430f44d8d5',
            grant_type: 'client_credentials',
          })}`,
        );
        if (response.status === 200) {
          const token = JSON.parse(JSON.stringify(response.data));
          if (token.access_token) {
            this.$axios
              .get(
                `https://api2.hik-cloud.com/v1/ezviz/account/info?access_token=${token.access_token}`,
              )
              .then(res => {
                if (res.data.code === 200) {
                  const data = JSON.parse(JSON.stringify(res.data.data));
                  this.videoSrc = `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://open.ys7.com/F10524474/1.live&autoplay=1&accessToken=${data.token}`;
                } else {
                  this.$message.error('获取视频流失败，请稍后重试');
                }
              });
          } else {
            this.$message.error('获取AccessTokenw为空，请稍后重试');
          }
        } else {
          this.$message.error('获取AccessToken失败，请稍后重试');
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
    viewImg(code) {
      // 查看3D图
      switch (code) {
        case '1':
          this.srcList = this.isDev
            ? ['/static/images/dashboard/floor1.png']
            : ['./static/images/dashboard/floor1.png'];
          break;
        case '2':
          this.srcList = this.isDev
            ? ['/static/images/dashboard/floor2.jpg']
            : ['./static/images/dashboard/floor2.jpg'];
          break;
        default:
          this.srcList = this.isDev
            ? ['/static/images/dashboard/floor1.png']
            : ['./static/images/dashboard/floor1.png'];
          break;
      }
      this.viewVisible = true;
    },
    getHistroy(code) {
      const params = {
        pageNum: this.tdlsHistroyData.pageNum,
        pageSize: this.tdlsHistroyData.pageSize,
      };
      const url = `tdlasDeviceLog/pageConditionBydeviceCodeList?deviceCode=${code}`;
      try {
        this.$axios.get(url, { params }).then(res => {
          if (res.status === 200 && res.data.code === 200) {
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
            this.tdlsHistroyData = JSON.parse(JSON.stringify(res.data.data));
            this.tdlsHistroyData.list = reduceData;
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
      this.tdlsHistroyData = restList;
      this.histroyVisible = true;
      this.getHistroy(id);
    },
    indexMethod(index) {
      return this.tdlsHistroyData.pageSize * (this.tdlsHistroyData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.tdlsHistroyData.pageSize) {
        return;
      }
      this.tdlsHistroyData.pageSize = pageSize;
      this.getHistroy(this.tdlshistoryId);
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.tdlsHistroyData.pageNum) {
        return;
      }
      this.tdlsHistroyData.pageNum = pageNum;
      this.getHistroy(this.tdlshistoryId);
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  .el-card__body {
    height: 320px;
  }
}
.small-size {
  font-size: 12px;
}
.light {
  line-height: 70px;
  .el-col-3 {
    width: 14%;
    height: 30px;
  }
}
.serial-number {
  .el-col-3 {
    width: 14%;
  }
}
.el-dropdown-link {
  color: #409eff;
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.right-line {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}
.wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 80px;
  margin: auto;
}
/* 灯框架 */
.traffic-light {
  /* 居中代码 */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  margin: auto;
  text-align: center;
  background: #282f2f;
  border-radius: 30px;
  box-shadow: 0 0 0 2px #eee inset;
}
.traffic-light-item {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.fade {
  animation: fade 3s linear 0s infinite;
}
.point {
  width: 10px;
  height: 10px;
  margin: 3px 30px 0 0;
  font-size: 12px;
  border-radius: 50%;
  &.normal {
    position: relative;
    background: green;
    &:after {
      position: absolute;
      width: 50px;
      margin: -4px 0 0 12px;
      content: '正常';
    }
  }
  &.warn {
    position: relative;
    background: red;
    &:after {
      position: absolute;
      width: 50px;
      margin: -4px 0 0 12px;
      content: '报警';
    }
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
