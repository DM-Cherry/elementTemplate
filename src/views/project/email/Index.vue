<template>
  <section>
    <div class="container-fluid mt-2">
      <div class="animated fadeIn">
        <el-row>
          <el-col>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>邮箱列表</span>
              </div>
              <Spin v-if="loading" size="large" fix />
              <template v-else>
                <el-form :inline="true" :model="search" class="demo-form-inline">
                  <el-form-item label="邮箱">
                    <el-input v-model="search.mail" placeholder="请输入邮箱" clearable></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getEmail">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="handleEdit('')">添加</el-button>
                  </el-form-item>
                </el-form>
                <div class="mb-3">
                  <el-table border :data="emailData.list" style="width: 100%;">
                    <el-table-column
                      align="center"
                      type="index"
                      label="序号"
                      width="50"
                      :index="indexMethod"
                    ></el-table-column>
                    <el-table-column align="center" prop="mail" label="邮箱"></el-table-column>
                    <el-table-column
                      align="center"
                      prop="creatertime"
                      label="创建日期"
                      :formatter="formatDate"
                      width="180"
                    ></el-table-column>
                    <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                        <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">
                          编辑
                        </el-button>
                        <el-button size="mini" type="danger" plain @click="handleRemove(scope.row)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 分页 -->
                  <div class="pagination-container mt-3">
                    <el-pagination
                      :current-page="emailData.pageNum"
                      :page-sizes="page_sizes"
                      :page-size="emailData.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="emailData.total"
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
    <el-dialog title="编辑邮箱" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form" :rules="rules">
        <el-form-item label="邮箱" prop="mail" label-width="50">
          <el-input v-model="form.mail" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import qs from 'qs';

export default {
  name: 'Email',
  data() {
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error('邮箱不能为空'));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的邮箱格式'));
        }
      }, 100);
    };
    return {
      loading: false,
      search: {
        mail: '',
      },
      form: {
        mail: '',
      },
      dialogVisible: false,
      type: 'add',
      page_sizes: [5, 10, 15, 20, 50],
      emailData: {
        list: [],
        total: 1,
        pageNum: 1,
        pageSize: 5,
      },
      rules: {
        mail: [{ validator: checkEmail, required: true, trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.getEmail();
  },
  methods: {
    // 格式化时间
    formatDate(row, column) {
      // 获取单元格数据
      const data = row[column.property];
      if (data === '') {
        return '';
      }
      const dt = new Date(data);
      let m = dt.getMonth() + 1;
      let d = dt.getDate();
      m = m < 10 ? `0${m}` : m;
      d = d < 10 ? `0${d}` : d;
      return `${dt.getFullYear()}-${m}-${d}`;
    },
    handleClose() {},
    getEmail() {
      this.loading = true;
      const params = Object.assign(this.search, {
        pageNum: this.emailData.pageNum,
        pageSize: this.emailData.pageSize,
      });
      try {
        this.$axios
          .get('/tdlasMail/byPageCondition', { params })
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.loading = false;
              this.emailData = JSON.parse(JSON.stringify(response.data.data));
            } else {
              this.loading = false;
              this.$message.error('获取邮箱列表失败');
            }
          })
          .catch(err => {
            console.error(err);
            this.loading = false;
            this.$message.error('获取邮箱列表失败');
          });
      } catch (error) {
        this.loading = false;
        this.$message.error(error);
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    submitForm() {
      this.loading = true;
      const url = this.type === 'add' ? '/tdlasMail/add' : '/tdlasMail/edit';
      if (this.type === 'edit') {
        // 过滤敏感字段以及空字段
        const formData = JSON.parse(JSON.stringify(this.form));
        const newForm = {};
        Object.keys(formData).forEach(key => {
          if (formData[key] && key !== 'creatertime') {
            newForm[key] = formData[key];
          }
        });
        this.form = newForm;
      }
      try {
        this.$axios
          .post(url, qs.stringify(this.form))
          .then(res => {
            if (res.data.code !== 200) {
              this.$message.error(res.data.msg);
            } else {
              const msg = this.type === 'add' ? '添加邮箱信息成功' : '编辑邮箱信息成功';
              this.$message.success(msg);
              this.getEmail();
            }
            this.dialogVisible = false;
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            const msg = this.type === 'add' ? '添加邮箱信息失败' : '编辑邮箱信息失败';
            this.$message.error(msg);
            console.error(err);
          });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        this.$message.error('请求失败，请稍后重试');
        this.loading = false;
      }
    },
    handleEdit(row) {
      if (row) {
        this.form = row;
        this.type = 'edit';
      } else {
        this.form = {
          email: '',
        };
        this.type = 'add';
      }
      this.dialogVisible = true;
    },
    handleRemove(row) {
      this.loading = true;
      // 删除用户
      try {
        this.$axios
          .delete(`/tdlasMail/delete?id=${row.id}`)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除邮箱信息成功');
              this.emailData.pageNum = 1;
              this.getEmail();
              this.loading = false;
            } else {
              this.loading = false;
              this.$message.success('删除邮箱信息失败，请稍后重试');
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message.success('删除邮箱信息失败，请稍后重试');
            console.error(err);
          });
      } catch (e) {
        console.error(e);
        this.$message.error('请求失败，请稍后重试');
        this.loading = false;
      }
    },
    indexMethod(index) {
      return this.emailData.pageSize * (this.emailData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.emailData.pageSize) {
        return;
      }
      this.emailData.pageSize = pageSize;
      this.getEmail();
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.emailData.pageNum) {
        return;
      }
      this.emailData.pageNum = pageNum;
      this.getEmail();
    },
  },
};
</script>

<style lang="scss" scoped></style>
