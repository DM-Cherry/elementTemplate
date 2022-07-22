<template>
  <div class="login-container">
    <el-form
      class="login-form"
      auto-complete="on"
      :model="loginForm"
      ref="loginForm"
      label-position="left"
      :rules="loginRules"
    >
      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>
      <el-form-item prop="account">
        <el-input
          name="account"
          type="text"
          v-model="loginForm.account"
          auto-complete="off"
          placeholder="请输入用户名"
        >
          <i slot="suffix" class="el-input__icon el-icon-user" style="color: #023bcf;"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          name="password"
          type="password"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="请输入用户密码"
          show-password
        >
          <i slot="suffix" class="el-input__icon el-icon-lock" style="color: #023bcf;"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="imageCode">
        <el-input
          name="imageCode"
          type="text"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.imageCode"
          auto-complete="off"
          placeholder="请输入验证码"
        />
        <span class="imageCode" @click="refreshCode">
          <img id="code" :src="src" style="width: 130px; height: 47px;" />
        </span>
      </el-form-item>
      <el-button
        type="primary"
        style="width: 100%; margin-bottom: 30px;"
        :loading="loading"
        :disabled="processing"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import qs from 'qs';

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,20}$/;
      if (!value) {
        return callback(new Error('请输入密码！'));
      }
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的密码（数字、大小写英文、特殊字符8位以上）！'));
      }
      callback();
    };
    return {
      src: '',
      uuid: '',
      loginForm: {
        account: '',
        password: '',
        imageCode: '',
      },
      loading: false,
      processing: false,
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        imageCode: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
      },
    };
  },
  created() {},
  destroyed() {},
  mounted() {
    this.refreshCode();
    // this.src = `${this.$store.state.default.apiBase}api/kaptcha/defaultKaptcha?date=${new Date()}`;
  },
  methods: {
    refreshCode() {
      // 刷新验证码
      this.$axios.get('/api/kaptcha/captchaImage').then(res => {
        const response = JSON.parse(JSON.stringify(res.data));
        if (response.code === 200) {
          this.src = response.data.img;
          this.uuid = response.data.uuid;
        } else {
          this.$message.error('获取验证码失败，请稍后重试！');
        }
      });
    },
    handleLogin() {
      this.processing = true;
      this.loading = true;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 进行登录
          this.$axios
            .post('/user/login', qs.stringify(this.loginForm), {
              headers: {
                KAPTCHA_SESSION_KEY: this.uuid,
              },
            })
            .then(res => {
              console.log(res);
              if (res.status === 200 && res.data.code === 200) {
                const data = JSON.parse(JSON.stringify(res.data.data));
                this.$store.dispatch('Common/Auth/login', data.token);
                this.$store.dispatch('UserStore/fetch', data);
                this.$store.commit('SiteStore/permissions', data.permissionList);
                localStorage.setItem('permission', JSON.stringify(data.permissionList));
                this.$router.push({ path: '/project/dashboard' });
                this.$message.success('恭喜您，登录成功');
              } else {
                // 测试
                this.$message.error('登录失败，请稍后重试');
                this.refreshCode();
              }
              this.processing = false;
              this.loading = false;
            })
            .catch(e => {
              console.error(e);
              this.processing = false;
              this.loading = false;
              this.refreshCode();
              this.$message.error('登录失败，请您检查您的登录信息。');
            });
        } else {
          this.processing = false;
          this.loading = false;
          this.$message.error('请您检查您的登录信息输入是否正确！');
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    input {
      height: 47px;
      padding: 12px 5px 12px 15px;
      color: #333;
      background: transparent;
      border: 0;
      border-radius: 0;
      /* stylelint-disable */
      -webkit-appearance: none;
    }
    input::-webkit-input-placeholder {
      color: #fff !important;
    }
    input::-moz-input-placeholder {
      color: #fff !important;
    }
    input::-ms-input-placeholder {
      color: #fff !important;
    }
  }
  .el-form-item {
    color: #454545;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$background: url('../images/bg.jpg') !default;

.login-container {
  width: 100%;
  min-height: 100vh;
  min-width: 1440px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  background: $background no-repeat, #ffe400;
  background: $background no-repeat, -moz-linear-gradient(top, #ffd100, #ffe400);
  background: $background no-repeat, -o-linear-gradient(top, #ffd100, #ffe400);
  background: $background no-repeat,
    -webkit-gradient(linear, 0 0, 0 bottom, from(#ffd100), to(#ffe400));
  -moz-background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  .login-form {
    position: absolute;
    top: 25%;
    right: 5%;
    text-align: center;
    width: 520px;
    padding: 35px 35px 15px;
    background: rgba(255, 255, 255, 0.6);
  }
  .tips {
    margin-bottom: 10px;
    font-size: 14px;
    color: #fff;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    display: inline-block;
    width: 30px;
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      margin: 0 auto 40px;
      font-size: 26px;
      font-weight: bold;
      color: #000;
      text-align: center;
    }
    .set-language {
      position: absolute;
      top: 5px;
      right: 0;
      color: #fff;
    }
  }
  .show-pwd {
    position: absolute;
    top: 7px;
    right: 10px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .imageCode {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
//@media screen and (min-width: 1300px) {
//  .login-container {
//    width: 1500px !important;
//  }
//}
</style>
