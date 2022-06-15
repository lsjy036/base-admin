<template>
  <div class="register-container">
    <el-form
      :model="registerForm"
      status-icon
      :rules="rules"
      ref="registerForm"
      label-width="100px"
      class="register-form"
      label-position="top"
    >
      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>
      <el-form-item prop="name" label="用户名">
        <el-input type="text" v-model="registerForm.name"></el-input>
      </el-form-item>
      <el-form-item prop="pass" label="密码">
        <el-input type="password" v-model="registerForm.pass"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass" label="确认密码">
        <el-input
          type="password"
          v-model="registerForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item class="button-container">
        <el-button type="primary" @click="handleRegister('registerForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('registerForm')">重置</el-button>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
        >
          <span>{{responese_res.message}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleClose"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("名字不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if(value.length < 6){
          callback(new Error("密码长度至少六位以上"));
      }
      else{
        if (this.registerForm.checkPass !== "") {
          this.$refs.registerForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        pass: "",
        checkPass: "",
        name: "",
      },
      responese_res:{},
      dialogVisible:false,
      rules: {
        name: [{ required: true, validator: checkName, trigger: "blur" }],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleRegister(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          this.$store
            .dispatch("/user/register", {
              name: this.registerForm.name,
              password: this.registerForm.pass,
            })
            .then((res) => {
              this.responese_res=res
              this.responese_res.message = "恭喜您，注册成功!"
              this.dialogVisible = true;
            })
            .catch((res) => {
                console.log(res)
              this.responese_res= res
              this.dialogVisible = true;
              console.log("注册失败");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClose(){
        if(this.responese_res.code == 0){
            this.dialogVisible=false;
            this.$router.replace('/login')
        }
        else{
            this.resetForm('registerForm')
            this.dialogVisible=false;
        }
    }
  },
};
</script>
<style scoped lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
$dark_gray: #889aa4;
.register-container {
  background-color: $bg;
  min-height: 100%;
  width: 100%;
  .title-container {
    position: relative;
    .title {
      color: $light_gray;
      font-size: 26px;
      text-align: center;
      font-weight: bold;
      margin: 0px auto 30px auto;
    }
  }
  .register-form {
    position: relative;
    width: 560px;
    margin: 0px auto;
    padding: 100px 35px;
    max-width: 100%;
    overflow: hidden;
  }

  .button-container {
    margin-top: 25px;
    text-align: center;
  }
}
</style>