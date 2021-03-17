<template>
  <section class="dashboard-container">
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
                  <el-form-item label="修复状态">
                    <el-select v-model="search.trueAndFalse" placeholder="请选择修复状态">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getSonic">查询</el-button>
                  </el-form-item>
                </el-form>
                <div class="mb-3">
                  <el-table v-loading="loading" border :data="sonicData.list" style="width: 100%;">
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
                      prop="l"
                      label="瞬时声强"
                      width="180"
                    ></el-table-column>
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
                          :disabled="scope.row.trueAndFalse"
                          plain
                          @click="handleEdit(scope.row)"
                        >
                          已修复
                        </el-button>
                        <el-button size="mini" type="default" plain @click="handleEdit(scope.row)">
                          查看详情
                        </el-button>
                      </template>
                    </el-table-column>
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
  name: 'Sonic',
  data() {
    return {
      loading: false,
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
    getSonic() {
      this.loading = true;
      const params = Object.assign(this.search, {
        pageNum: this.sonicData.pageNum,
        pageSize: this.sonicData.pageSize,
      });
      try {
        this.$axios
          .get('/tdlasSonicWave/byPageCondition', { params })
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.loading = false;
              this.sonicData = JSON.parse(JSON.stringify(response.data.data));
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
    handleEdit() {},
    indexMethod(index) {
      return this.sonicData.pageSize * (this.sonicData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.sonicData.pageSize) {
        return;
      }
      this.sonicData.pageSize = pageSize;
      // this.getSonic();
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.sonicData.pageNum) {
        return;
      }
      this.sonicData.pageNum = pageNum;
      // this.getSonic();
    },
  },
};
</script>

<style scoped></style>
