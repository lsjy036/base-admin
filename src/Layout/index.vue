<template>
  <div>
    <el-container>
      <el-aside width="isCollapse ? 64px : 200px">
        <sidebar class="sidebar-container"/>
      </el-aside>
      <el-main :class="{isCollapse:isCollapse,isNotCollapse:!isCollapse}">
        <div class="main-container">
          <div class="fixed-header">
            <navabar />
          </div>
          <app-main />
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Sidebar from "./components/Sidebar";
import Navabar from "./components/Navbar.vue";
import AppMain from "./components/AppMain.vue";
export default {
  components: {
    Sidebar,
    Navabar,
    AppMain,
  },
  computed: {
    isCollapse() {
      return this.$store.state.app.sidebar.isCollapse;
    },
  },
};
</script>
<style scoped lang="scss" >
.main-container {
  min-height: 100%;
  overflow: hidden;
}
.sidebar-container {
  min-height: 100%;
  font-size: 0px;
  width:200px;
  position: fixed;
  top: 0px;
  left: 0px;
  overflow-y: auto;
}
.isCollapse{
  padding: 0px;
  overflow-y: hidden;
  margin-left: 66px;
}
.isNotCollapse{
  padding: 0px;
  overflow-y: hidden;
  margin-left: 200px;
}
</style>
