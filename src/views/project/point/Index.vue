<template>
  <div class="container-fluid mt-2">
    <div class="animated fadeIn">
      <el-row>
        <el-col>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="float-left">测点距离配置</span>
            </div>
            <template>
              <section class="point">
                <el-form :inline="true" :model="search" class="demo-form-inline">
                  <el-form-item label="设备编号">
                    <el-input
                      v-model="search.deviceCode"
                      clearable
                      placeholder="请输入设备编号"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="角度">
                    <el-input
                      v-model="search.deviceAngle"
                      clearable
                      placeholder="请输入角度"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getPoint('search')">查询</el-button>
                  </el-form-item>
                </el-form>
                <div class="mb-3">
                  <el-table
                    v-loading="loading"
                    border
                    :data="pointData.list"
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
                      label="设备编码"
                      width="100"
                    ></el-table-column>
                    <el-table-column
                      align="center"
                      prop="deviceAngle"
                      label="角度"
                      sortable="custom"
                    ></el-table-column>
                    <el-table-column align="center" prop="deviceImage" label="图片">
                      <template slot-scope="scope">
                        <el-image
                          style="width: 50px; height: 50px;"
                          :src="scope.row.deviceImage"
                          :preview-src-list="[scope.row.deviceImage]"
                          :z-index="3000"
                        ></el-image>
                        <el-upload
                          action="#"
                          :auto-upload="false"
                          :show-file-list="false"
                          :on-change="handleChangeRestsFile"
                          accept="image/jpeg,image/jpg,image/png,image/gif,"
                        >
                          <el-button size="small" type="success" plain @click="editImg(scope.row)">
                            点击修改
                          </el-button>
                        </el-upload>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="deviceDistance" label="距离（米）">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.deviceDistance" style="width: 70%;" />
                        <el-button type="primary" size="small" @click="saveDistance(scope.row)">
                          保存
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 分页 -->
                  <div class="pagination-container mt-3">
                    <el-pagination
                      :current-page="pointData.pageNum"
                      :page-sizes="page_sizes"
                      :page-size="pointData.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="pointData.total"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                    ></el-pagination>
                  </div>
                  <!-- 分页 -->
                </div>
              </section>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import qs from 'qs';

export default {
  name: 'Index',
  data() {
    return {
      loading: false,
      currentId: '',
      search: {
        deviceCode: '',
        deviceAngle: '',
      },
      pointData: {
        list: [],
        total: 1,
        pageNum: 1,
        pageSize: 5,
      },
      page_sizes: [5, 10, 15, 20, 50],
      parameter: '',
      order: '',
    };
  },
  mounted() {
    this.getPoint();
  },
  methods: {
    sortTable(current) {
      this.parameter = 'device_angle';
      this.order = current.order;
      this.getPoint('sort');
    },
    editImg(row) {
      this.loading = true;
      this.currentId = row.id;
    },
    handleChangeRestsFile(file) {
      const formData = new FormData();
      formData.append('deviceImage', file.raw);
      formData.append('id', this.currentId);
      this.$axios
        .post('/tdlasDataConfigController/upload', formData)
        .then(res => {
          if (res.data && res.data.code === 200) {
            this.$message.success('修改成功');
            this.getPoint();
          } else {
            this.$message.error('修改失败，请稍后重试');
          }
          this.loading = false;
        })
        .catch(err => {
          console.error(err);
          this.loading = false;
          this.$message({
            message: '服务错误，保存失败',
            type: 'error',
          });
        });
    },
    saveDistance(row) {
      this.loading = true;
      const params = {
        id: row.id,
        deviceDistance: row.deviceDistance,
      };
      this.$axios
        .post('/tdlasDataConfigController/edit', qs.stringify(params))
        .then(res => {
          if (res.data && res.data.code === 200) {
            this.$message.success('保存成功');
            this.getPoint();
          } else {
            this.$message.error('保存失败，请稍后重试');
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
          this.$message({
            message: '服务错误，保存失败',
            type: 'error',
          });
        });
    },
    getPoint(type) {
      // 获取声波数据
      this.loading = true;
      if (type === 'search') {
        this.pointData.pageNum = 1;
        this.pointData.pageSize = 5;
      }
      const params = Object.assign(this.search, {
        pageNum: this.pointData.pageNum,
        pageSize: this.pointData.pageSize,
        orderByParameter: this.parameter,
        orderByLift: this.order,
      });
      try {
        this.$axios
          .get('/tdlasDataConfigController/byPageCondition', { params })
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.pointData = JSON.parse(JSON.stringify(response.data.data));
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.error('获取数据列表失败');
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
      return this.pointData.pageSize * (this.pointData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.pointData.pageSize) {
        return;
      }
      this.pointData.pageSize = pageSize;
      this.getPoint();
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.pointData.pageNum) {
        return;
      }
      this.pointData.pageNum = pageNum;
      this.getPoint();
    },
  },
};
</script>

<style lang="scss">
.point {
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
