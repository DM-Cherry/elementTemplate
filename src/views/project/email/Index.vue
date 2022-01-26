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
              <template>
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
                  <el-table border v-loading="loading" :data="emailData.list" style="width: 100%;">
                    <el-table-column
                      align="center"
                      type="index"
                      label="序号"
                      width="50"
                      :index="indexMethod"
                    ></el-table-column>
                    <el-table-column align="center" prop="mail" label="邮箱"></el-table-column>
                    <el-table-column align="center" prop="deviceCode" label="类型">
                      <template slot-scope="scope">
                        <el-tag v-if="scope.row.deviceCode === '1'" type="success">实时</el-tag>
                        <el-tag v-else>定时</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="creatertime" label="创建日期" width="180">
                      <template slot-scope="scope">
                        <div>
                          {{ $dayjs(scope.row.creatertime).format('YYYY-MM-DD HH:mm:ss') }}
                        </div>
                      </template>
                    </el-table-column>
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
      <el-form :model="form" :rules="rules" label-position="left" ref="emailForm">
        <el-form-item label="邮箱" prop="mail" label-width="50">
          <el-input v-model="form.mail" autocomplete="off" style="width: 70%;"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="deviceCode" label-width="50">
          <el-select v-model="form.deviceCode" placeholder="请选择">
            <el-option key="1" label="实时" value="1"></el-option>
            <el-option key="2" label="定时" value="2"></el-option>
          </el-select>
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
        deviceCode: '',
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
        deviceCode: [
          {
            message: '请选择类型',
            required: true,
            trigger: 'change',
          },
        ],
      },
    };
  },
  computed: {},
  mounted() {
    this.getEmail();
  },
  methods: {
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
              this.emailData = JSON.parse(JSON.stringify(response.data.data));
            } else {
              this.$message.error('获取邮箱列表失败');
            }
            this.loading = false;
          })
          .catch(err => {
            console.error(err);
            this.loading = false;
            this.$message.error('服务发送失败，获取邮箱列表失败');
          });
      } catch (e) {
        const err = e || '请求服务出错了，请稍后重试';
        this.loading = false;
        this.$message.error(err);
        console.error(e);
      }
    },
    submitForm() {
      this.loading = true;
      const url = this.type === 'add' ? '/tdlasMail/add' : '/tdlasMail/edit';
      this.$refs.emailForm.validate(valid => {
        if (valid) {
          if (this.type === 'edit') {
            // 过滤敏感字段以及空字段
            const formData = JSON.parse(JSON.stringify(this.form));
            console.log('formData', formData);
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
            const err = e || '请求服务出错了，请稍后重试';
            console.error(e);
            this.$message.error(err);
            this.loading = false;
          }
        } else {
          this.$message.error('请输入必填信息！');
        }
      });
    },
    handleEdit(row) {
      if (row) {
        this.form = JSON.parse(JSON.stringify(row));
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
          .get(`/tdlasMail/delete?id=${row.id}`)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除邮箱信息成功');
              this.emailData.pageNum = 1;
              this.getEmail();
            } else {
              this.$message.success('删除邮箱信息失败，请稍后重试');
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            this.$message.success('删除邮箱信息失败，请稍后重试');
            console.error(err);
          });
      } catch (e) {
        console.error(e);
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
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
