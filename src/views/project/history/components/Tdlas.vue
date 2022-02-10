<template>
  <section>
    <!-- 测试 -->
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="设备编码">
        <el-input v-model="search.deviceCode" clearable placeholder="请输入设备编码"></el-input>
      </el-form-item>
      <el-form-item label="时间区间">
        <el-col :span="11">
          <el-date-picker
            v-model="search.startTime"
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
            v-model="search.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%;"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getHistory('search')">查询</el-button>
        <el-link
          :href="exportUrl"
          v-if="menuList.length === 8"
          target="_blank"
          type="primary"
          class="mx-3"
        >
          导出
        </el-link>
      </el-form-item>
    </el-form>
    <div class="mb-3">
      <el-table
        v-loading="loading"
        border
        :data="historyData.list"
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
          prop="deviceAngle"
          label="位置编号"
          width="180"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="deviceAmmoniaConcentration"
          label="浓度值ppm"
          width="200"
          sortable="custom"
        ></el-table-column>
        <el-table-column align="center" prop="deviceType" label="描述"></el-table-column>
        <el-table-column
          align="center"
          prop="creatertime"
          sortable="custom"
          label="创建日期"
          width="180"
        >
          <template slot-scope="scope">
            <div>
              {{ $dayjs(scope.row.creatertime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="deviceState"
          sortable="custom"
          label="解决状态"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag size="medium" type="danger" v-if="scope.row.deviceState === false">
              未解决
            </el-tag>
            <el-tag v-else size="medium" type="success">已解决</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.deviceState"
              plain
              @click="handleEdit(scope.row)"
            >
              已修复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container mt-3">
        <el-pagination
          :current-page="historyData.pageNum"
          :page-sizes="page_sizes"
          :page-size="historyData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="historyData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <!-- 分页 -->
    </div>
  </section>
</template>

<script>
export default {
  name: 'Tdlas',
  data() {
    return {
      menuList: 0,
      loading: false,
      search: {
        deviceCode: '',
        startTime: '',
        endTime: '',
      },
      exportUrl: `${this.$store.state.default.apiBase}tdlasDeviceLog/exportTdlasDeviceLog`,
      page_sizes: [5, 10, 15, 20, 50],
      historyData: {
        list: [],
        total: 1,
        pageNum: 1,
        pageSize: 5,
      },
      parameter: '',
      order: '',
    };
  },
  mounted() {
    this.menuList = JSON.parse(localStorage.getItem('permission'));
    this.getHistory();
  },
  methods: {
    sortTable(current) {
      // eslint-disable-next-line default-case
      switch (current.prop) {
        case 'deviceCode':
          this.parameter = 'device_code';
          break;
        case 'deviceAmmoniaConcentration':
          this.parameter = 'device_ammonia_concentration';
          break;
        case 'creatertime':
          this.parameter = 'creatertime';
          break;
        case 'deviceAngle':
          this.parameter = 'device_angle';
          break;
        case 'deviceState':
          this.parameter = 'device_state';
          break;
      }
      this.order = current.order;
      this.getHistory('sort');
    },
    handleEdit(row) {
      this.loading = true;
      try {
        this.$axios
          .post(`/tdlasDeviceLog/edit?id=${row.id}`)
          .then(res => {
            if (res.data.code !== 200) {
              this.$message.error('修改状态失败，请稍后重试');
            } else {
              this.$message.success('修改状态成功');
              this.getHistory();
            }
            this.loading = false;
          })
          .catch(err => {
            console.error(err);
            this.loading = false;
            this.$message.error('服务请求失败，请稍后重试');
          });
      } catch (e) {
        this.loading = false;
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
        console.error(e);
      }
    },
    getHistory(source) {
      if (source === 'search') {
        this.historyData.pageNum = 1;
        this.historyData.pageSize = 5;
        this.exportUrl = `${this.$store.state.default.apiBase}tdlasDeviceLog/exportTdlasDeviceLog?startTime=${this.search.startTime}&endTime=${this.search.endTime}&deviceCode=${this.search.deviceCode}`;
      }
      this.loading = true;
      const params = Object.assign(this.search, {
        pageNum: this.historyData.pageNum,
        pageSize: this.historyData.pageSize,
        orderByParameter: this.parameter,
        orderByLift: this.order,
      });
      try {
        this.$axios
          .get('/tdlasDeviceLog/byPageCondition', { params })
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.loading = false;
              this.historyData = JSON.parse(JSON.stringify(response.data.data));
            } else {
              this.loading = false;
              this.$message.error('获取历史数据列表失败');
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
    indexMethod(index) {
      return this.historyData.pageSize * (this.historyData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.historyData.pageSize) {
        return;
      }
      this.historyData.pageSize = pageSize;
      this.getHistory();
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.historyData.pageNum) {
        return;
      }
      this.historyData.pageNum = pageNum;
      this.getHistory();
    },
  },
};
</script>

<style scoped>
/deep/.el-date-editor .el-range-separator {
  width: 7% !important;
}
</style>
