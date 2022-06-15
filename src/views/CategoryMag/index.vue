<template>
  <div class="main" style="margin:1%">
    <div style="margin:10px;">
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="insertCate"
        >新增品类</el-button
      >
    </div>
    <tree-table
      :data="allCategories"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
    >
      <template slot-scope="scope" slot="sort">
        <el-tag type="success" v-if="scope.row.level == 1">一级</el-tag>
        <el-tag type="warning" v-if="scope.row.level == 2">二级</el-tag>
        <el-tag type="danger" v-if="scope.row.level == 3">三级</el-tag>
      </template>
      <template slot-scope="scope" slot="opt">
        <el-button
          @click="removeCategory(scope.row.id)"
          size="mini"
          type="primary"
          >移除</el-button
        >
      </template>
    </tree-table>
    <!-- 新增品类的弹窗 -->
    <el-dialog
      :visible.sync="visibleOfDialog.categoryInsert"
      title="新增品类"
      @closed="confirmClose"
    >
      <el-tabs type="border-card" @tab-click="resetInsetCategorDetail">
        <el-tab-pane label="新增一级品类">
          <label style="margin-right: 8px">品类名字:</label>
          <el-input
            v-model="insertDetail.inputVal"
            style="width: 60%"
          ></el-input>
          <el-button
            @click="insertInputVal1"
            type="primary"
            style="margin-left: 8px"
            >新增</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="新增二级品类">
          <div>
            <label style="margin-right: 8px">父级品类:</label>
            <el-select
              v-model="insertDetail.parentId"
              placeholder="请选择品类"
              style="margin-right: 40px"
            >
              <el-option
                v-for="item in level1Categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option
            ></el-select>
          </div>
          <div style="margin-top: 20px">
            <label style="margin-right: 8px">品类名字:</label>
            <el-input
              v-model="insertDetail.inputVal"
              style="width: 60%"
            ></el-input>
            <el-button
              @click="insertInputVal2"
              type="primary"
              style="margin-left: 8px"
              >新增</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane label="新增三级品类">
          <div>
            <label style="margin-right: 8px">父级品类:</label>
            <el-select
              v-model="insertDetail.parentId"
              placeholder="请选择品类"
              style="margin-right: 40px"
            >
              <el-option
                v-for="item in level2OfCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option
            ></el-select>
          </div>
          <div style="margin-top: 20px">
            <label style="margin-right: 8px">品类名字:</label>
            <el-input
              v-model="insertDetail.inputVal"
              style="width: 60%"
            ></el-input>
            <el-button
              @click="insertInputVal2"
              type="primary"
              style="margin-left: 8px"
              >新增</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmClose">取 消</el-button>
        <el-button type="primary" @click="confirmClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { categoryMap, deleteCategory, insertCategory } from "@/api/manage";
export default {
  data() {
    return {
      allCategories: [],
      visibleOfDialog: {
        categoryInsert: false,
      },
      insertDetail: {
        inputVal: "",
        parentId: "",
      },
      columns: [
        {
          label: "品类ID",
          prop: "id",
        },
        {
          label: "品类名字",
          prop: "name",
        },
        {
          label: "商品数量",
          prop: "commodityNum",
        },
        {
          label: "级别",
          type: "template",
          template: "sort",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
    };
  },
  created() {
    this.$store.dispatch("manage/getCategory", { level: 1 }); //获取到父类品类
    this.$store.dispatch("manage/getCategory", { level: 2 }); //获取到二级品类
    categoryMap().then((res) => {
      if (res.code == 0) {
        this.allCategories = res.result;
        console.log(this.allCategories);
      } else {
        this.$message.warning(res.message || "error");
      }
    });
  },
  computed: {
    level1Categories() {
      return this.$store.state.manage.categoryLevel1;
    },
    //直接返回全部二级品类
    level2OfCategory() {
      return this.$store.state.manage.categoryLevel2;
    },
  },
  methods: {
    removeCategory(id) {
      deleteCategory({ id: id }).then((res) => {
        if (res.code == 0) {
          this.$message.success("删除成功!");
          categoryMap().then((res) => {
            if (res.code == 0) {
              this.allCategories = res.result;
              console.log(this.allCategories);
            } else {
              this.$message.warning(res.message || "error");
            }
          });
        } else {
          this.$message.error(res.message || "error");
        }
      });
    },
    //新增一级品类
    insertInputVal1() {
      if (this.insertDetail.inputVal == "") {
        this.$message.warning("品类名字不能为空!");
        return;
      }
      insertCategory({
        name: this.insertDetail.inputVal,
        parentId: 0,
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success("新增成功!");
          this.$store.dispatch("manage/getCategory", { level: 1 });
          this.resetInsetCategorDetail();
          categoryMap().then((res) => {
            if (res.code == 0) {
              this.allCategories = res.result;
              console.log(this.allCategories);
            } else {
              this.$message.warning(res.message || "error");
            }
          });
        } else {
          this.$message.success(res.message || "新增失败!");
          this.resetInsetCategorDetail();
        }
      });
    },
    //新增二级品类
    insertInputVal2() {
      if (this.insertDetail.inputVal == "") {
        this.$message.warning("品类名字不能为空!");
        return;
      }
      if (this.insertDetail.parentId == "") {
        this.$message.warning("父级品类名字不能为空!");
        return;
      }
      insertCategory({
        name: this.insertDetail.inputVal,
        parentId: this.insertDetail.parentId,
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success("新增成功!");
          this.$store.dispatch("manage/getCategory", { level: 2 });
          this.resetInsetCategorDetail();
          categoryMap().then((res) => {
            if (res.code == 0) {
              this.allCategories = res.result;
              console.log(this.allCategories);
            } else {
              this.$message.warning(res.message || "error");
            }
          });
        } else {
          this.$message.success(res.message || "新增失败!");
          this.resetInsetCategorDetail();
        }
      });
    },
    //关闭品类新增窗口
    confirmClose() {
      this.visibleOfDialog.categoryInsert = false;
      this.resetInsetCategorDetail();
    },
    //重置品类新增属性
    resetInsetCategorDetail() {
      this.insertDetail.inputVal = "";
      this.insertDetail.parentId = "";
      return true;
    },
    //打开新增品类dialog
    insertCate() {
      this.visibleOfDialog.categoryInsert = true;
    },
  },
};
</script>
<style scoped lang="scss">
.main {
  font-size: 14px;
  color: #606266;
  .zk-table {
    font-size: 14px;
    color: #606266;
    .zk-table_cell-inner {
      color: #909399;
      font-weight: 700;
    }
  }
}
</style>
