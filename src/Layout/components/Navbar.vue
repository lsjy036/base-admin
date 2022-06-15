<template>
  <div class="navbar">
    <Hamburger class="hamburger-container" />
    <div class="breadCrumbContainer">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/finance' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageNameCur}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right-menu" v-if="pageName">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div class="user-avatar">
            <svg-icon icon-class="portrait" fill="#fff" />
          </div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import Hamburger from "@/components/Hamburger";
import { mapGetters } from "vuex";

export default {
  data(){
    return {
      pageNameCur:"",
    }
  },
  components: {
    Hamburger,
  },
  created() {
    this.pageNameCur = sessionStorage.getItem('pageName')
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$router.push("/login");
      });
    },
  },
  computed: {
    ...mapGetters(["sidebar"]),
    pageName(){
      return this.$route.path
    }
  },
  watch:{
    pageName:{
      handler(){
       this.pageNameCur = sessionStorage.getItem('pageName')
      }
    }
  }
};
</script>
<style scoped lang="scss">
.navbar {
  height: 50px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  line-height: 50px;
  .breadCrumbContainer{
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
  }
  .hamburger-container {
    float: left;
    cursor: pointer;
    line-height: 46px;
    height: 100%;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          display: inline-block;
          cursor: pointer;
          width: 40px;
          height: 40px;
          background: #545c64;
          border-radius: 25px;
          text-align: center;
          .svg-icon {
            height: 28px;
            width: 28px;
          }
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
