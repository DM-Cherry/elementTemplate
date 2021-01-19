<template>
  <section>
    <div class="container-fluid mt-2">
      <div class="animated fadeIn">
        <el-row>
          <el-col>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>用户列表</span>
              </div>
              <template>
                <el-form :inline="true" :model="search" class="demo-form-inline">
                  <el-form-item label="手机号">
                    <el-input
                      v-model="search.phone"
                      placeholder="请输入手机号"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="用户名">
                    <el-input
                      v-model="search.realName"
                      placeholder="请输入用户名称"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="getUsers">查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="handleEdit('')">添加</el-button>
                  </el-form-item>
                </el-form>
                <div class="mb-3">
                  <el-table v-loading="loading" border :data="usersData.list" style="width: 100%;">
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
                      label="账号"
                      width="100"
                    ></el-table-column>
                    <el-table-column
                      align="center"
                      prop="realName"
                      label="用户名"
                      width="100"
                    ></el-table-column>
                    <el-table-column align="center" prop="password" label="密码"></el-table-column>
                    <el-table-column align="center" prop="mail" label="邮箱"></el-table-column>
                    <el-table-column align="center" prop="phone" label="电话"></el-table-column>
                    <el-table-column align="center" prop="createTime" label="创建日期" width="120">
                      <template slot-scope="scope">
                        <div>
                          {{ $dayjs(scope.row.createTime).format('YYYY-MM-DD') }}
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
                      :current-page="usersData.pageNum"
                      :page-sizes="page_sizes"
                      :page-size="usersData.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="usersData.total"
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
    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="40%">
      <el-form :model="form" :rules="rules" :inline="true">
        <el-row>
          <el-col :sm="12" :md="12" :lg="12" class="filter-item">
            <el-form-item label="名称" label-width="50" label-position="right">
              <el-input v-model="form.realName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" class="filter-item">
            <el-form-item label="密码" label-width="50" label-position="right">
              <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" class="filter-item">
            <el-form-item label="邮箱" label-width="50" prop="mail" label-position="right">
              <el-input v-model="form.mail" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" class="filter-item">
            <el-form-item label="电话" prop="phone" label-width="50" label-position="right">
              <el-input v-model="form.phone" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
  name: 'Users',
  data() {
    const checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (value !== '') {
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback();
          } else {
            callback(new Error('请输入正确的邮箱格式'));
          }
        }, 100);
      }
    };
    return {
      loading: false,
      search: {
        phone: '',
        realName: '',
      },
      type: 'add',
      page_sizes: [5, 10, 15, 20, 50],
      form: {
        realName: '',
        mail: '',
        password: '',
        phone: '',
      },
      dialogVisible: false,
      usersData: {
        list: [],
        total: 1,
        pageNum: 1,
        pageSize: 5,
      },
      rules: {
        mail: [{ validator: checkEmail }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    submitForm() {
      // 提交用户信息
      this.loading = true;
      const url = this.type === 'add' ? '/user/addUser' : '/user/updataUser';
      if (this.type === 'edit') {
        // 过滤敏感字段以及空字段
        const formData = JSON.parse(JSON.stringify(this.form));
        const newForm = {};
        Object.keys(formData).forEach(key => {
          if (formData[key] && key !== 'createTime' && key !== 'updateTime') {
            newForm[key] = formData[key];
          }
        });
        this.form = newForm;
      }
      try {
        this.$axios.post(url, qs.stringify(this.form)).then(res => {
          const msg = this.type === 'add' ? '添加用户信息' : '编辑用户信息';
          if (res.data.code !== 200) {
            this.$message.error(`${msg}失败，请稍后重试`);
          } else {
            this.$message.success(`${msg}成功`);
            this.getUsers();
          }
          this.loading = false;
          this.dialogVisible = false;
        });
      } catch (e) {
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
        console.error(e);
        this.loading = false;
      }
    },
    getUsers() {
      // 获取用户列表
      this.loading = true;
      const params = Object.assign(this.search, {
        pageNum: this.usersData.pageNum,
        pageSize: this.usersData.pageSize,
      });
      try {
        this.$axios
          .get('/user/userList', { params })
          .then(response => {
            if (response.status === 200 && response.data.code === 200) {
              this.usersData = JSON.parse(JSON.stringify(response.data.data));
            } else {
              this.$message.error('获取用户列表失败，请稍后重试');
            }
            this.loading = false;
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
        console.error(e);
      }
    },
    handleEdit(row) {
      if (row) {
        this.form = JSON.parse(JSON.stringify(row));
        this.type = 'edit';
      } else {
        this.form = {
          realName: '',
          mail: '',
          password: '',
          phone: '',
        };
        this.type = 'add';
      }
      this.dialogVisible = true;
    },
    handleRemove(row) {
      // 删除用户
      try {
        this.$axios
          .delete(`/user/userDelete?id=${row.userId}`)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除用户信息成功');
              this.usersData.pageNum = 1;
              this.getUsers();
            } else {
              this.$message.error('删除用户信息失败，请稍后重试');
            }
          })
          .catch(err => {
            console.error(err);
            this.$message.error('服务请求失败，请稍后重试');
          });
      } catch (e) {
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
        console.error(e);
      }
    },
    indexMethod(index) {
      return this.usersData.pageSize * (this.usersData.pageNum - 1) + index + 1;
    },
    // 分页
    handleSizeChange(pageSize) {
      if (pageSize === this.usersData.pageSize) {
        return;
      }
      this.usersData.pageSize = pageSize;
      this.getUsers();
    },
    handleCurrentChange(pageNum) {
      if (pageNum === this.usersData.pageNum) {
        return;
      }
      this.usersData.pageNum = pageNum;
      this.getUsers();
    },
  },
};
</script>

<style lang="scss" scoped></style>
