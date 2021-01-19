<template>
  <section>
    <div class="container-fluid mt-2">
      <div class="animated fadeIn">
        <el-row>
          <el-col>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>历史报警数据</span>
              </div>
              <template>
                <el-form :inline="true" :model="search" class="demo-form-inline">
                  <el-form-item label="设备编码">
                    <el-input v-model="search.deviceCode" placeholder="请输入设备编码"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getHistroy">查询</el-button>
                    <el-link :href="exportUrl" target="_blank" type="primary" class="mx-3">
                      导出
                    </el-link>
                  </el-form-item>
                </el-form>
                <div class="mb-3">
                  <el-table
                    v-loading="loading"
                    border
                    :data="histroyData.list"
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
                      label="设备编码"
                    ></el-table-column>
                    <el-table-column
                      align="center"
                      prop="deviceAngle"
                      label="位置编号"
                      width="180"
                    ></el-table-column>
                    <el-table-column
                      align="center"
                      prop="deviceAmmoniaConcentration"
                      label="氨浓度"
                      width="80"
                    ></el-table-column>
                    <!-- <el-table-column
                      align="center"
                      prop="grade"
                      label="报警等级"
                      width="100"
                    ></el-table-column> -->
                    <el-table-column align="center" prop="creatertime" label="创建日期" width="120">
                      <template slot-scope="scope">
                        <div>
                          {{ $dayjs(scope.row.creatertime).format('YYYY-MM-DD') }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="deviceState" label="解决状态" width="100">
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
                      :current-page="histroyData.pageNum"
                      :page-sizes="page_sizes"
                      :page-size="histroyData.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="histroyData.total"
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
  </section>
</template>

<script>
export default {
  name: 'Histroy',
  data() {
    return {
      loading: false,
      search: {
        deviceCode: '',
      },
      exportUrl: `${this.$store.state.default.apiBase}/tdlasDeviceMonitor/exportSelectedPromotion`,
      page_sizes: [5, 10, 15, 20, 50],
      histroyData: {
        list: [],
        total: 1,
        pageNum: 1,
        pageSize: 5,
      },
    };
  },
  mounted() {
    this.getHistroy();
  },
  methods: {
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
              this.getHistroy();
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
    getHistroy() {
      this.loading = true;
      const params = Object.assign(this.search, {
        pageNum: this.histroyData.pageNum,
        pageSize: this.histroyData.pageSize,
      });
      try {
        this.$axios
          .get('/tdlasDeviceLog/byPageCondition', { params })
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.loading = false;
              this.histroyData = JSON.parse(JSON.stringify(response.data.data));
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
      return this.histroyData.pageSize * (this.histroyData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.histroyData.pageSize) {
        return;
      }
      this.histroyData.pageSize = pageSize;
      this.getHistroy();
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.histroyData.pageNum) {
        return;
      }
      this.histroyData.pageNum = pageNum;
      this.getHistroy();
    },
  },
};
</script>

<style lang="scss" scoped></style>
