<template>
  <section>
    <aside class="aside-menu">
      <el-tabs>
        <el-tab-pane>
          <template slot="title">
            <i class="fas fa-user" />
          </template>
          <div class="p-3">
            <div class="clearfix">
              <h6 class="float-left" style="line-height: 40px;">个人信息</h6>
              <el-button class="float-right" type="text" @click="handleEdit()">编辑</el-button>
            </div>
            <hr class="transparent mx-3 mt-3" />
            <div class="aside-options px-5">
              <el-avatar
                v-if="!info || !info.avatar"
                :size="100"
                fit="cover"
                :src="
                  isDev
                    ? '/static/images/placeholder/avatar.png'
                    : './static/images/placeholder/avatar.png'
                "
              ></el-avatar>
              <el-avatar v-else :size="100" fit="cover" :src="info.avatar_url" alt="用户头像" />
            </div>
            <hr class="transparent mx-3 my-3" />
            <ul v-if="info" class="info">
              <li>
                姓名：
                <span class="text-muted">{{ info.realName || '' }}</span>
              </li>
              <li>
                手机：
                <span class="text-muted">{{ info.userName || '' }}</span>
              </li>
              <li>
                邮箱：
                <span class="text-muted">{{ info.mail || '' }}</span>
              </li>
            </ul>
          </div>
          <!-- <hr class="transparent my-3" />
        <div class="aside-options px-3 text-center">
          <el-button :block="true" type="danger" @click="logout">
            <i class="fas fa-sign-out-alt" />
            退出登录
          </el-button>
        </div> -->
        </el-tab-pane>
      </el-tabs>
    </aside>
    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="40%">
      <el-form
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="right"
        :inline="true"
      >
        <el-row>
          <el-col :sm="12" :md="12" :lg="12" class="filter-item">
            <el-form-item label="名称">
              <el-input v-model="form.realName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" class="filter-item">
            <el-form-item label="密码">
              <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" class="filter-item">
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model="form.mail" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :md="12" :lg="12" class="filter-item">
            <el-form-item label="电话" prop="phone">
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
import { mapGetters } from 'vuex';
import qs from 'qs';

export default {
  name: 'ZAside',
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
      isDev: true,
      dialogVisible: false,
      form: {
        realName: '',
        mail: '',
        password: '',
        phone: '',
      },
      rules: {
        mail: [{ validator: checkEmail }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
      },
    };
  },
  computed: {
    ...mapGetters('UserStore', ['info']),
  },
  mounted() {
    this.isDev = process.env.NODE_ENV === 'development';
  },
  methods: {
    logout() {
      this.$store.dispatch('Common/Auth/logout');
    },
    handleEdit() {
      this.form = JSON.parse(JSON.stringify(this.info));
      this.form.phone = this.info.userName;
      this.dialogVisible = true;
    },
    submitForm() {
      try {
        this.$axios
          .post('/user/updataUser', qs.stringify(this.form))
          .then(res => {
            if (res.data.code !== 200) {
              this.$message.error(`编辑信息失败，请稍后重试`);
            } else {
              this.$message.success(`编辑信息成功，请重新登录`);
              this.$router.push({ path: '/web/auth/login' });
            }
            this.loading = false;
            this.dialogVisible = false;
          })
          .catch(e => {
            console.error(e);
            this.$message.error('服务请求失败，请稍后重试');
            this.loading = false;
            this.dialogVisible = false;
          });
      } catch (e) {
        console.error(e);
        const err = e || '请求服务出错了，请稍后重试';
        this.$message.error(err);
        this.loading = false;
        this.dialogVisible = false;
      }
    },
  },
};
</script>

<style scoped>
.info {
  padding-left: 15px;
  font-size: 90%;
  line-height: 1.8;
  list-style: none;
}
</style>
