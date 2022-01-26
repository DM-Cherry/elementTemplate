<template>
  <section class="sonic">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="设备编码">
        <el-input v-model="search.deviceCode" clearable placeholder="请输入设备编码"></el-input>
      </el-form-item>
      <el-form-item label="时间区间">
        <el-col :span="11">
          <el-date-picker
            v-model="search.creatertime1"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>
        <el-col class="line" style="text-align: center;" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker
            v-model="search.creatertime2"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getSonic('search')">查询</el-button>
        <el-link :href="exportUrl" target="_blank" type="primary" class="mx-3">
          导出
        </el-link>
      </el-form-item>
    </el-form>
    <div class="mb-3">
      <el-table
        v-loading="loading"
        border
        :data="sonicData.list"
        @sort-change="sortTable"
        style="width: 100%;"
      >
        <el-table-column
          align="center"
          type="index"
          label="序号"
          width="50"
          :index="indexMethod"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="deviceCode"
          sortable="custom"
          label="设备编码"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="l"
          label="瞬时声强"
          sortable="custom"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="leq"
          label="等效声强"
          sortable="custom"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="creatertime"
          label="创建日期"
          sortable="custom"
          width="180"
        >
          <template slot-scope="scope">
            <div>
              {{ $dayjs(scope.row.creatertime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column align="center" prop="deviceState" label="解决状态" width="80">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-tag size="medium" type="danger" v-if="scope.row.deviceState === false">-->
        <!--              未解决-->
        <!--            </el-tag>-->
        <!--            <el-tag v-else size="medium" type="success">已解决</el-tag>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column align="center" prop="trueAndFalse" label="故障状态" width="80">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-tag size="medium" type="warning" v-if="scope.row.trueAndFalse === '0'">-->
        <!--              待确认-->
        <!--            </el-tag>-->
        <!--            <el-tag v-if="scope.row.trueAndFalse === '1'" size="medium" type="danger">故障</el-tag>-->
        <!--            <el-tag v-if="scope.row.trueAndFalse === '2'" size="medium" type="info">误报</el-tag>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column label="操作" align="center">-->
        <!--          <template slot-scope="scope">-->
        <!--            <el-button-->
        <!--              size="mini"-->
        <!--              type="primary"-->
        <!--              :disabled="scope.row.deviceState || scope.row.trueAndFalse === '2'"-->
        <!--              plain-->
        <!--              @click="handleRepairEdit(scope.row)"-->
        <!--            >-->
        <!--              已修复-->
        <!--            </el-button>-->
        <!--            <el-button-->
        <!--              size="mini"-->
        <!--              type="primary"-->
        <!--              :disabled="scope.row.deviceState"-->
        <!--              plain-->
        <!--              @click="handlefaultEdit(scope.row, '1')"-->
        <!--            >-->
        <!--              发生故障-->
        <!--            </el-button>-->
        <!--            <el-button-->
        <!--              size="mini"-->
        <!--              type="primary"-->
        <!--              :disabled="scope.row.deviceState"-->
        <!--              plain-->
        <!--              @click="handlefaultEdit(scope.row, '2')"-->
        <!--            >-->
        <!--              故障误报-->
        <!--            </el-button>-->
        <!--            <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">-->
        <!--              故障查询-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container mt-3">
        <el-pagination
          :current-page="sonicData.pageNum"
          :page-sizes="page_sizes"
          :page-size="sonicData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="sonicData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <!-- 分页 -->
    </div>
    <el-dialog title="历史数据" :visible.sync="historyVisible" :modal-append-to-body="false">
      <DoubleColumn ref="doublecolumn" />
    </el-dialog>
  </section>
</template>

<script>
import DoubleColumn from '@/components/Common/Dashboard/DoubleColumn';

export default {
  name: 'Sonic',
  components: {
    DoubleColumn,
  },
  data() {
    return {
      loading: false,
      historyVisible: false,
      activeOption: 0,
      exportUrl: `${this.$store.state.default.apiBase}tdlasSonicWave/exportTdlasSonic`,
      options: [
        {
          value: true,
          label: '已修复',
        },
        {
          value: false,
          label: '未修复',
        },
      ],
      search: {
        deviceCode: '',
        creatertime1: '',
        creatertime2: '',
      },
      sonicData: {
        list: [],
        total: 1,
        pageNum: 1,
        pageSize: 5,
      },
      page_sizes: [5, 10, 15, 20, 50],
    };
  },
  mounted() {
    this.getSonic();
  },
  methods: {
    sortTable(current) {
      console.log(current);
      this.loading = true;
      let parameter = null;
      // eslint-disable-next-line default-case
      switch (current.prop) {
        case 'deviceCode':
          parameter = 'device_code';
          break;
        case 'l':
          parameter = 'l';
          break;
        case 'leq':
          parameter = 'leq';
          break;
        case 'creatertime':
          parameter = 'create_time';
          break;
      }
      try {
        this.$axios
          .get(
            `/tdlasSonicWave/byPageConditionList?orderByParameter=${parameter}&orderByLift=${current.order}`,
          )
          .then(res => {
            if (res.data.code !== 200) {
              this.$message.error('获取排序数据失败，请稍后重试');
              this.loading = false;
            } else {
              this.loading = false;
              this.sonicData = JSON.parse(JSON.stringify(res.data.data));
              console.log('获取最新信息');
            }
          });
      } catch (e) {
        this.loading = false;
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
        console.error(e);
      }
    },
    handleRepairEdit(row) {
      // 解决状态修改
      this.loading = true;
      try {
        this.$axios
          .post(`/tdlasSonicWave/deviceStateEdit?id=${row.id}`)
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.$message.success('修改状态成功');
              this.getSonic();
            } else {
              this.$message.error('修改状态失败');
              this.loading = false;
            }
          })
          .catch(err => {
            console.error(err);
            this.loading = false;
            this.$message.error('服务请求失败，请稍后重试');
          });
      } catch (e) {
        const err = e || '请求服务出错了，请稍后重试';
        this.loading = false;
        this.$message.error(err);
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
    handlefaultEdit(row, status) {
      // 故障状态修改
      this.loading = true;
      try {
        this.$axios
          .post(`/tdlasSonicWave/trueAndFalseEdit?id=${row.id}&trueAndFalse=${status}`)
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.$message.success('修改故障状态成功');
              this.getSonic();
            } else {
              this.loading = false;
              this.$message.error('修改状态失败');
            }
          })
          .catch(err => {
            console.error(err);
            this.loading = false;
            this.$message.error('服务请求失败，请稍后重试');
          });
      } catch (e) {
        const err = e || '请求服务出错了，请稍后重试';
        this.loading = false;
        this.$message.error(err);
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
    getSonic(source) {
      if (source === 'search') {
        this.sonicData.pageNum = 1;
        this.sonicData.pageSize = 5;
      }
      // 获取声波数据
      this.loading = true;
      const params = Object.assign(this.search, {
        pageNum: this.sonicData.pageNum,
        pageSize: this.sonicData.pageSize,
      });
      try {
        this.$axios
          .get('/tdlasSonicWave/byPageConditionList', { params })
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.sonicData = JSON.parse(JSON.stringify(response.data.data));
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error('获取声波历史数据列表失败');
            }
          })
          .catch(err => {
            console.error(err);
            this.loading = false;
            this.$message.error('服务请求失败，请稍后重试');
          });
      } catch (e) {
        const err = e || '请求服务出错了，请稍后重试';
        this.loading = false;
        this.$message.error(err);
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
    handleEdit(row) {
      // 故障查询图表
      this.loading = true;
      this.historyVisible = true;
      let sonicChart = null;
      try {
        this.$axios
          .get(`/tdlasSonicWave/queryLogLineChart?sonicId=${row.sonicId}`)
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              sonicChart = JSON.parse(JSON.stringify(response.data.data));
              this.$nextTick(() => {
                this.$refs.doublecolumn.initialize(
                  sonicChart.legend,
                  sonicChart.xData,
                  sonicChart.left,
                  sonicChart.right,
                  sonicChart.columnList,
                  sonicChart.polyline,
                  sonicChart.ListMax,
                );
              });
              this.loading = false;
            } else {
              this.loading = false;
              this.historyVisible = false;
              this.$message.error('获取声波故障数据列表失败');
            }
          })
          .catch(err => {
            console.error(err);
            this.loading = false;
            this.historyVisible = false;
            this.$message.error('服务请求失败，请稍后重试');
          });
      } catch (e) {
        this.loading = false;
        this.historyVisible = false;
        const err = e || '请求服务出错了，请稍后重试';
        // this.loading = false;
        this.$message.error(err);
        // eslint-disable-next-line no-console
        console.error(e);
      }
    },
    indexMethod(index) {
      return this.sonicData.pageSize * (this.sonicData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.sonicData.pageSize) {
        return;
      }
      this.sonicData.pageSize = pageSize;
      this.getSonic();
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.sonicData.pageNum) {
        return;
      }
      this.sonicData.pageNum = pageNum;
      this.getSonic();
    },
  },
};
</script>

<style lang="scss">
.sonic {
  .el-dialog__header {
    background: #060d2a;
    border-bottom: 1px solid #fff;
    .el-dialog__title {
      color: #fff;
    }
  }
  .el-dialog__body {
    background: #060d2a;
  }
}
</style>
