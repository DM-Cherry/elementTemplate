<template>
  <div class="container-fluid mt-2">
    <div class="animated fadeIn">
      <el-row>
        <el-col>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="float-left">日志</span>
            </div>
            <template>
              <el-form :inline="true" :model="search" class="demo-form-inline">
                <el-form-item label="标题">
                  <el-input
                    v-model="search.operTitle"
                    placeholder="请输入标题"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item label="用户名字">
                  <el-input
                    v-model="search.userName"
                    placeholder="请输入用户名字"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="getLogList('search')">查询</el-button>
                </el-form-item>
                <el-link :href="exportUrl" target="_blank" type="primary" class="mx-3 mt-2">
                  导出
                </el-link>
              </el-form>
              <div class="mb-3">
                <el-table
                  v-loading="loading"
                  border
                  :data="logData.list"
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
                    prop="userName"
                    @sort-change="sortTable"
                    label="用户名字"
                    width="120"
                    sortable="custom"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="operUrl"
                    label="路径"
                    sortable="custom"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="operTitle"
                    label="标题"
                    sortable="custom"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="operDescribe"
                    label="描述"
                    sortable="custom"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    prop="operTime"
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
                </el-table>
                <!-- 分页 -->
                <div class="pagination-container mt-3">
                  <el-pagination
                    :current-page="logData.pageNum"
                    :page-sizes="page_sizes"
                    :page-size="logData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="logData.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  ></el-pagination>
                </div>
                <!-- 分页 -->
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      loading: false,
      exportUrl: `${this.$store.state.default.apiBase}tlImportLogController/exportSysLog`,
      search: {
        operTitle: '',
        userName: '',
      },
      logData: {
        list: [],
        total: 1,
        pageNum: 1,
        pageSize: 5,
      },
      page_sizes: [5, 10, 15, 20, 50],
    };
  },
  mounted() {
    this.getLogList();
  },
  methods: {
    sortTable(current) {
      this.loading = true;
      let parameter = null;
      // eslint-disable-next-line default-case
      switch (current.prop) {
        case 'userName':
          parameter = 'user_name';
          break;
        case 'operUrl':
          parameter = 'oper_url';
          break;
        case 'operTitle':
          parameter = 'oper_title';
          break;
        case 'operDescribe':
          parameter = 'oper_describe';
          break;
        case 'operTime':
          parameter = 'oper_time';
          break;
      }
      try {
        this.$axios
          .get(
            `/tlImportLogController/byPageCondition?orderByParameter=${parameter}&orderByLift=${current.order}`,
          )
          .then(res => {
            if (res.data.code !== 200) {
              this.$message.error('获取排序数据失败，请稍后重试');
              this.loading = false;
            } else {
              this.loading = false;
              this.logData = JSON.parse(JSON.stringify(res.data.data));
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
    getLogList(source) {
      // 获取日志数据
      if (source === 'search') {
        this.logData.pageNum = 1;
        this.logData.pageSize = 5;
      }
      this.loading = true;
      const params = Object.assign(this.search, {
        pageNum: this.logData.pageNum,
        pageSize: this.logData.pageSize,
      });
      try {
        this.$axios
          .get('/tlImportLogController/byPageCondition', { params })
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.loading = false;
              this.logData = JSON.parse(JSON.stringify(response.data.data));
            } else {
              this.loading = false;
              this.$message.error('获取日志数据列表失败');
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
      return this.logData.pageSize * (this.logData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.logData.pageSize) {
        return;
      }
      this.logData.pageSize = pageSize;
      this.getLogList();
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.logData.pageNum) {
        return;
      }
      this.logData.pageNum = pageNum;
      this.getLogList();
    },
  },
};
</script>

<style scoped></style>
