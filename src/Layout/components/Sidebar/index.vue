<template>
  <div class="tac"  @click="clickMenu($event)">
    <el-menu
      :default-active="this.$route.path"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      router
      :collapse-transition="false"
    >
      <el-menu-item index="/finance">
        <i class="el-icon-s-order"></i>
        <span slot="title">销量排名</span>
      </el-menu-item>
      <el-submenu index="/management">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>管理业务</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/management/goodsmag">商品管理</el-menu-item>
          <el-menu-item index="/management/brandsmag">品牌管理</el-menu-item>
          <el-menu-item index="/management/categorymag">品类管理</el-menu-item>
          <el-menu-item index="/management/ordersmag">订单管理</el-menu-item>
          <el-menu-item index="/management/orderbackmag">退货管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/management/commactivities">
        <i class="el-icon-menu"></i>
        <span slot="title">商品活动</span>
      </el-menu-item>
      <el-menu-item index="/management/purchaseInfo">
        <i class="el-icon-s-claim"></i>
        <span slot="title">进货信息</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activePath: "",
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    isCollapse() {
      return this.$store.state.app.sidebar.isCollapse;
    },
  },
  methods: {
    clickMenu(eve) {
      console.log("eve,",eve.path[0].innerText)
        sessionStorage.setItem("pageName",eve.path[0].innerText);
    },
  },
};
</script>
<style scoped lang="scss">
.tac {
  height: 100%;
  .el-menu-vertical-demo {
    height: 100%;
  }
}
</style>