<template>
  <div class="login-container">
    <el-form
      class="login-form"
      ref="loginForm"
      :rules="loginRules"
      :model="loginForm"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" fill="#889aa4" />
        </span>
        <el-input
          placeholder="请输入账户"
          v-model="loginForm.username"
          ref="username"
          autocomplete="on"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="lock" fill="#889aa4" />
        </span>
        <el-input
          ref="password"
          :type="passwordType"
          placeholder="请输入密码"
          show-password
          v-model="loginForm.password"
        >
        </el-input>
      </el-form-item>
      <el-button
        type="primary"
        style="width: 100%; margin-top: 20px"
        @click.native.prevent="handleLogin"
        :loading="loading"
        >点击登录</el-button
      >
    </el-form>
    <div class="register-container">
      <span class="register">还没有账户?</span>
      <el-button type="text" @click.native.prevent="toRegister"
        >点我注册</el-button
      >
    </div>
    <el-dialog title="登录提示" :visible.sync="dialogVisible" width="30%">
      <span>{{ responese_res }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空!"));
      } else {
        callback();
      }
    };
    const validateUsername = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("账户名不能为空!"));
      } else {
        return callback();
      }
    };
    return {
      passwordType: "password",
      dialogVisible: false,
      responese_res:"",
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      loading: false,
    };
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("user/login", {
              name: this.loginForm.username,
              password: this.loginForm.password,
            })
            .then(() => {
              this.loading = false;
              console.log("登录成功!");
              this.$router.push({ path:'/' })
            })
            .catch((mes) => {
              this.loading = false;
              this.responese_res = mes;
              this.dialogVisible = true;
              console.log("登录失败!");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toRegister() {
      this.$router.push("/register");
    },
    handleClose() {
        this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
$dark_gray: #889aa4;

.login-container {
  min-height: 100%;
  background-color: $bg;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .title-container {
    position: relative;
    .title {
      color: $light_gray;
      font-size: 26px;
      text-align: center;
      font-weight: bold;
      margin: 0px auto 40px auto;
    }
  }
  .svg-container {
    width: 30px;
    display: inline-block;
    vertical-align: middle;
    color: $dark_gray;
  }
  .svg-icon {
    height: 20px;
    width: 20px;
    margin-left: 10px;
    margin-top: 10px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 10px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin: 30px 0px;
  }
  .register-container {
    position: relative;
    margin: 15px auto;
    width: 150px;
    .register {
      color: $cursor;
      font-size: small;
    }
  }
}
</style>
