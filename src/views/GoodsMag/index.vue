<template>
  <div class="allContainer">
    <div class="screenByCategory">
      <el-button type="primary" @click="()=>{drawer = true;this.resetOptions();}"> 筛选 </el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="addGoods"
        >新增商品</el-button
      >
    </div>
    <div>
      <el-table :data="goodsData">
        <el-table-column prop="id" label="商品ID" width="80"> </el-table-column>
        <el-table-column prop="name" label="商品名"> </el-table-column>
        <el-table-column prop="brand.name" label="品牌名"> </el-table-column>
        <el-table-column prop="price" label="价格" sortable> </el-table-column>
        <el-table-column prop="category.name" label="品类"> </el-table-column>
        <el-table-column prop="saleVolume" label="销量" sortable>
        </el-table-column>
        <el-table-column prop="inventory" label="库存" sortable>
        </el-table-column>
        <el-table-column label="上下架状态">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.status == 0
                  ? "待定"
                  : scope.row.status == 1
                  ? "已上架"
                  : "已下架"
              }}
            </span>
            <el-dropdown
              trigger="click"
              @command="
                (command) => {
                  changeStatus(command, scope.row);
                }
              "
            >
              <span class="el-dropdown-link">
                更改<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">上架</el-dropdown-item>
                <el-dropdown-item command="2">下架</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="管理操作">
          <template slot-scope="scope">
            <el-dropdown
              @command="(comStr) => handleCommand(comStr, scope.row)"
              trigger="click"
            >
              <span class="el-dropdown-link spanMenu">
                下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="deleteGood"
                  >删除商品</el-dropdown-item
                >
                <el-dropdown-item command="updateGood"
                  >更新商品</el-dropdown-item
                >
                <el-dropdown-item command="detailGood"
                  >商品详情</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px; margin-bottom: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageOption.currentPage"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="pageOption.pageSizeSel"
          :total="pageOption.totalNum"
          layout="total, sizes, prev, pager, next"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 筛选商品的条件抽屉 -->
    <el-drawer :visible.sync="drawer" :direction="direction" size="25%">
      <template slot="title">
        <div class="drawerTitle">
          <span class="icon-container">
            <svg-icon icon-class="screen" fill="#fff" />
          </span>
          <span>筛选条件</span>
        </div>
      </template>
      <div class="body_select">
        <span>品牌选择</span>
        <el-select
          v-model="screenOpitions.brandOption"
          placeholder="请选择品牌名"
        >
          <el-option
            v-for="item in brandsOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="body_select">
        <span>一级品类选择</span>
        <el-select
          v-model="screenOpitions.selLevel1Category"
          placeholder="请选择品类名"
        >
          <el-option
            v-for="item in level1Categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="body_select">
        <span>二级品类选择</span>
        <el-select
          v-model="screenOpitions.selLevel2Category"
          placeholder="请选择品类名"
        >
          <el-option
            v-for="item in level2Categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="body_select">
        <span>三级品类选择</span>
        <el-select
          v-model="screenOpitions.selLevel3Category"
          placeholder="请选择品类名"
        >
          <el-option
            v-for="item in level3Categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="body_select">
        <span style="display: block">价格区间选择</span>
        <el-input
          v-model="screenOpitions.priceLow"
          style="width: 45%"
          @change="lowPrice"
        ></el-input>
        <div class="priceInpLeft"></div>
        <el-input
          v-model="screenOpitions.priceHigh"
          style="width: 45%"
          @change="highPrice"
        ></el-input>
        <span v-show="visibleOfDialog.priceVisible2" class="priceWarning"
          >价格区间设置有误!</span
        >
      </div>
      <div class="body_select">
        <span>排序方式</span>
        <el-select v-model="screenOpitions.sortBy" placeholder="请选择排序方式">
          <el-option
            v-for="item in sortByOption"
            :key="item.id"
            :label="item.name"
            :value="item.val"
          >
          </el-option>
        </el-select>
      </div>
      <div class="body_select">
        <span>升降顺序</span>
        <el-select
          v-model="screenOpitions.sortSel"
          placeholder="请选择排序方式"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.id"
            :label="item.name"
            :value="item.val"
          >
          </el-option>
        </el-select>
      </div>
      <div style="margin-bottom: 4%">
        <el-checkbox v-model="screenOpitions.onlyOnSaleOption"
          >仅查看上架商品</el-checkbox
        >
      </div>
      <div class="button-container">
        <el-button type="danger" @click="resetOptions">重置</el-button>
        <el-button type="primary" @click="sendScreenReq">确定</el-button>
      </div>
    </el-drawer>
    <!-- 更新商品的弹窗 -->
    <el-dialog
      :visible.sync="visibleOfDialog.updateGoodVisible"
      title="更新商品"
    >
      <el-form @submit.native.prevent="">
        <el-form-item label="商品名字">
          <el-input v-model="updateGoodNew.name" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input
            v-model="updateGoodNew.price"
            style="width: 30%"
            @input="checkInput"
          ></el-input>
          <span v-show="visibleOfDialog.priceVisible1" class="spanCheck"
            >请输入正确格式的价格</span
          >
        </el-form-item>
        <el-form-item label="商品品牌">
          <el-select
            v-model="updateGoodNew.brandID"
            placeholder="请选择品牌"
            style="margin-right: 40px"
          >
            <el-option
              v-for="item in brandsOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品品类">
          <el-select
            v-model="updateGoodNew.categoryID"
            placeholder="请选择品类"
            style="margin-right: 40px"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品详情">
          <el-input
            v-model.trim="updateGoodNew.detail"
            type="textarea"
            style="width: 60%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetUpdateGood">重置</el-button>
        <el-button type="primary" @click="sendUpdateGoodReq">确定</el-button>
      </div>
    </el-dialog>
    <!-- 显示商品详情的弹窗 -->
    <el-dialog
      :visible.sync="visibleOfDialog.detailOfGoodVisible"
      title="商品详情"
      lock-scroll
      @closed="closeDetailOfGood"
    >
      <div class="detailInfoContainer">
        <el-descriptions title="商品信息" :column="2" border>
          <el-descriptions-item label="商品名字">{{
            curViewGood.name
          }}</el-descriptions-item>
          <el-descriptions-item label="商品价格">{{
            curViewGood.price
          }}</el-descriptions-item>
          <el-descriptions-item label="商品描述">{{
            curViewGood.detail
          }}</el-descriptions-item>
          <el-descriptions-item label="商品品牌">{{
            curViewGood.brand ? curViewGood.brand.name : ""
          }}</el-descriptions-item>
          <el-descriptions-item label="商品品类">{{
            curViewGood.category ? curViewGood.category.name : ""
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div>
        <span class="commAttr">商品属性</span>
        <el-table border :data="curViewGood.props" stripe style="width: 80%">
          <el-table-column prop="name" label="属性名"> </el-table-column>
          <el-table-column prop="value" label="属性值"> </el-table-column>
        </el-table>
      </div>
      <div
        class="mainPicContainer"
        v-for="(itemPar, name) in picOfGoods"
        :key="name"
      >
        <span class="commAttr">{{ textOfPic[name] }}</span>
        <el-carousel
          height="300px"
          v-loading="loadingOfPic[name]"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.5)"
        >
          <el-carousel-item v-for="itemChild in itemPar" :key="itemChild.id">
            <el-image :src="itemChild.value" fit="fill" width="height:300px"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  categoryMap,
  deleteCommodity,
  putOnSaleById,
  putOfflineById,
  updateCommodity,
  getMainPicOfGood,
  getDetailPicOfGood,
} from "@/api/manage";
import { nanoid } from "nanoid";
export default {
  data() {
    return {
      screenData: {},
      pageOption: {
        pageSizeSel: 10,
        totalNum: 0,
        currentPage: 0,
      },
      updateGoodNew: {
        name: "",
        categoryID: "",
        brandID: "",
        price: "",
        detail: "",
      },
      screenOpitions: {
        brandOption: null,
        sortBy: null,
        sortSel: null,
        onlyOnSaleOption: null,
        selLevel1Category: null,
        selLevel2Category: null,
        selLevel3Category: null,
        priceLow: null,
        priceHigh: null,
      },
      updateGoodNow: {},
      sortByOption: [
        {
          id: 0,
          name: "根据价格排序",
          val: "commodity_price",
        },
        {
          id: 1,
          name: "根据销量排序",
          val: "sale_volume",
        },
      ],
      allCategories: [],
      drawer: false,
      visibleOfDialog: {
        detailOfGoodVisible: false,
        priceVisible1: false,
        priceVisible2: false,
        updateGoodVisible: false,
        categoryInsert: false,
      },
      direction: "rtl",
      picOfGoods: {
        mainPic: [],
        detailPic: [],
      },
      textOfPic: {
        mainPic: "商品主图",
        detailPic: "商品详情图",
      },
      loadingOfPic: {
        mainPic: true,
        detailPic: true,
      },
      curViewGood: {},
    };
  },
  created() {
    let Brandres = this.$store.state.manage.brands;
    if (Brandres.length === 0) {
      this.$store.dispatch("manage/getBrands");
    }
    this.$store.dispatch("manage/getCategory", { level: 1 }); //获取到父类品类
    this.$store.dispatch("manage/getCategory", { level: 2 }); //获取到二级品类
    //获取所有品类,在computed中根据父品类选择得到子品类
    categoryMap().then((response) => {
      if (response.code === 0) {
        this.allCategories = response.result;
      } else {
        console.log(response.message);
      }
    });
    this.$store
      .dispatch("manage/getGoods", {
        pageNo: 0,
        pageSize: 10,
      })
      .then((total) => {
        this.pageOption.totalNum = total;
      })
      .catch((error) => {
        this.$message.warning(error);
      });
    //获取所有品牌
    this.$store.dispatch("manage/getBrands");
  },
  computed: {
    options: function () {
      return 1;
    },
    level1Categories() {
      return this.$store.state.manage.categoryLevel1;
    },
    //直接返回全部二级品类
    level2OfCategory(){
      return this.$store.state.manage.categoryLevel2;
    },
    level2Categories() {
      if (!this.screenOpitions.selLevel1Category) return [];
      let ans = this.allCategories.find((val) => {
        return this.screenOpitions.selLevel1Category === val.id;
      });
      return ans.children;
    },
    level3Categories() {
      if (!this.screenOpitions.selLevel2Category) return [];
      let ans = this.level2Categories.find((val) => {
        return this.screenOpitions.selLevel2Category === val.id;
      });
      return ans.children;
    },
    sortOptions() {
      if (this.sortBy === "") {
        return [];
      } else
        return [
          {
            id: 1,
            name: "从高到低排序",
            val: true,
          },
          {
            id: 2,
            name: "从低到高排序",
            val: false,
          },
        ];
    },
    brandsOptions() {
      return this.$store.state.manage.brands;
    },
    goodsData() {
      return this.$store.state.manage.goods;
    },
    categoryOptions() {
      return this.$store.state.manage.categoryLevel2;
    },
  },
  methods: {
    //价格区间检查
    lowPrice(val) {
      if (val == "") return;
      let inp = Number(val);
      if (Number.isNaN(inp)) {
        this.visibleOfDialog.priceVisible2 = true;
      } else {
        if (this.screenOpitions.priceHigh == "")
          this.visibleOfDialog.priceVisible2 = false;
        else if (
          Number.isNaN(this.screenOpitions.priceHigh) ||
          Number(this.screenOpitions.priceHigh) <= inp
        )
          this.visibleOfDialog.priceVisible2 = true;
        else this.visibleOfDialog.priceVisible2 = false;
      }
    },
    highPrice(val) {
      if (val == "") return;
      let inp = Number(val);
      if (Number.isNaN(inp)) {
        this.visibleOfDialog.priceVisible2 = true;
      } else {
        if (this.screenOpitions.priceLow == "")
          this.visibleOfDialog.priceVisible2 = false;
        else if (
          Number.isNaN(this.screenOpitions.priceLow) ||
          Number(this.screenOpitions.priceLow) >= inp
        )
          this.visibleOfDialog.priceVisible2 = true;
        else this.visibleOfDialog.priceVisible2 = false;
      }
    },
    //监控价格输入合法
    checkInput(val) {
      let inp = Number(val);
      if (Number.isNaN(inp)) {
        this.visibleOfDialog.priceVisible1 = true;
      } else {
        this.visibleOfDialog.priceVisible1 = false;
      }
    },
    //新增商品
    addGoods() {
      this.$router.push("/management/AddGood");
    },
    //重置筛选条件
    resetOptions() {
      this.screenOpitions.brandOption = "";
      this.screenOpitions.sortBy = "";
      this.screenOpitions.sortSel = "";
      this.screenOpitions.onlyOnSaleOption = "";
      this.screenOpitions.selLevel1Category = "";
      this.screenOpitions.selLevel2Category = "";
      this.screenOpitions.selLevel3Category = "";
      this.screenOpitions.priceLow = "";
      this.screenOpitions.priceHigh = "";
    },
    //删除商品
    deleteGood({ id }) {
      deleteCommodity({ commodityId: id })
        .then((res) => {
          console.log(res);
          this.$message.success("删除成功,请刷新页面!");
        })
        .catch(() => {
          this.$message.warning("删除失败!");
        });
    },
    //修改状态
    changeStatus(command, row) {
      if (row.status == 1 && command == "1") {
        this.$message.warning("只有下架状态的商品能够被删除!");
        return;
      }
      if (command == "1") {
        putOnSaleById({ id: row.id }).then((res) => {
          if (res.code === 0) {
            this.$message.success({
              duration: 1000,
              message: "更改状态为上架!请刷新页面!",
            });
          } else {
            this.$message.warning({
              duration: 1000,
              message: res.message || "error",
            });
          }
        });
      } else {
        putOfflineById({ id: row.id }).then((res) => {
          if (res.code === 0) {
            this.$message.success({
              duration: 1000,
              message: "更改状态为下架!请刷新页面!",
            });
          } else {
            this.$message.warning({
              duration: 1000,
              message: res.message || "error",
            });
          }
        });
      }
    },
    //更新商品属性
    updateGood(good) {
      this.updateGoodNow = good;
      this.visibleOfDialog.updateGoodVisible = true;
    },
    resetUpdateGood() {
      this.updateGoodNew.id = "";
      this.updateGoodNew.name = "";
      this.updateGoodNew.categoryID = "";
      this.updateGoodNew.brandID = "";
      this.updateGoodNew.price = "";
      this.updateGoodNew.detail = "";
    },
    //发送更新商品请求
    sendUpdateGoodReq() {
      if (this.visible == true) return;
      let data = {
        id: "",
      };
      this.updateGoodNew.price = Number(this.updateGoodNew.price);
      Object.keys(this.updateGoodNew).forEach((val) => {
        console.log(this.updateGoodNew[val] == "", val);
        if (val == "categoryID" || val == "brandID") {
          console.log(
            this.updateGoodNew[val],
            this.updateGoodNow[val.slice(0, -2)].id
          );
          if (
            this.updateGoodNew[val] != this.updateGoodNow[val.slice(0, -2)].id
          )
            data[val] = this.updateGoodNew[val];
        } else if (
          this.updateGoodNew[val] != "" &&
          this.updateGoodNew[val] != this.updateGoodNow[val]
        )
          data[val] = this.updateGoodNew[val];
      });
      data.id = this.updateGoodNow.id;
      this.resetUpdateGood();
      console.log("更新data", data);
      updateCommodity(data).then((res) => {
        if (res.code === 0) {
          this.$message.success("更新成功,请刷新页面!");
        } else {
          return this.$message.warning(res.message || "error");
        }
      });
    },
    //筛选商品条件请求
    sendScreenReq() {
      this.screenData = {
        pageNo: 0,
        pageSize: this.pageOption.pageSizeSel,
      };
      this.screenData.brandId = this.screenOpitions.brandOption || null;
      if (this.screenOpitions.selLevel3Category != "")
        this.screenData.categoryId = this.screenOpitions.selLevel3Category;
      else if (this.screenOpitions.selLevel2Category != "")
        this.screenData.categoryId = this.screenOpitions.selLevel2Category;
      else if (this.screenOpitions.selLevel1Category != "")
        this.screenData.categoryId = this.screenOpitions.selLevel1Category;
      else this.screenData.categoryId = null;
      this.screenData.priceLow = Number(this.screenOpitions.priceLow) || null;
      this.screenData.priceHigh = Number(this.screenOpitions.priceHigh) || null;
      this.screenData.sortedBy = this.screenOpitions.sortBy || null;
      this.screenData.sortDesc = this.screenOpitions.sortSel || null;
      this.screenData.onlyOnSale = this.screenOpitions.onlyOnSaleOption || null;
      this.drawer = false;
      this.$store
        .dispatch("manage/getGoods", this.screenData)
        .then((total) => {
          this.pageOption.totalNum = total;
        });
    },
    //每页显示条数发生变化
    handleSizeChange(num) {
      this.pageOption.pageSizeSel = num;
      this.screenData.pageSize = num;
      this.screenData.pageNo = this.pageOption.currentPage - 1;
      this.$store
        .dispatch("manage/getGoods", this.screenData)
        .then((total) => {
          this.pageOption.totalNum = total;
        });
    },
    //页码发生变化
    handleCurrentChange(pageNum) {
      this.screenData.pageNo = pageNum - 1;
      this.screenData.pageSize = this.pageOption.pageSizeSel
      console.log(this.screenData)
      this.$store
        .dispatch("manage/getGoods", this.screenData)
        .then((total) => {
          this.pageOption.totalNum = total;
        });
    },
    //查看商品详情
    async detailGood(good) {
      this.curViewGood = JSON.parse(JSON.stringify(good));
      let obj = JSON.parse(good.props);
      this.curViewGood.props = [];
      Object.keys(obj).forEach((val) => {
        let t = {};
        t.name = val;
        t.value = obj[val];
        this.curViewGood.props.push(t);
      });
      this.visibleOfDialog.detailOfGoodVisible = true;
      //请求商品主图与详情图
      let resOfMain = await getMainPicOfGood({ commodityId: good.id });
      let resOfDetail = await getDetailPicOfGood({ commodityId: good.id });
      if (resOfMain.code == 0) {
        this.loadingOfPic.mainPic = false;
        this.picOfGoods.mainPic = [];
        resOfMain.result.forEach((val) => {
          let mid = {};
          mid.id = nanoid();
          mid.value = "data:image/png;base64," + val;
          this.picOfGoods.mainPic.push(mid);
        });
      } else {
        this.loadingOfPic.mainPic = false;
        this.$message.warning(resOfMain.message || "请求出错!");
      }
      //请求商品详情图
      if (resOfDetail.code == 0) {
        this.loadingOfPic.detailPic = false;
        this.picOfGoods.detailPic = [];
        resOfDetail.result.forEach((val) => {
          let mid = {};
          mid.id = nanoid();
          mid.value = "data:image/png;base64," + val;
          this.picOfGoods.detailPic.push(mid);
        });
      } else {
        this.loadingOfPic.detailPic = false;
        this.$message.warning(resOfDetail.message || "请求出错!");
      }
    },
    //关闭商品详情时
    closeDetailOfGood() {
      this.picOfGoods.mainPic = [];
      this.picOfGoods.detailPic = [];
      this.loadingOfPic.mainPic = true;
      this.loadingOfPic.detailPic = true;
      this.curViewGood = {};
    },
    //处理菜单操作
    handleCommand(str, row) {
      this[str](row);
    },
  },
};
</script>
<style scoped lang="scss">
.allContainer {
  width: 96%;
  margin-left: 3%;
}
.screenByCategory {
  margin-top: 20px;
}
.icon-container {
  width: 20px;
  height: 20px;
  margin: 3px;
}
.svg-icon {
  height: 15px;
  width: 15px;

  position: relative;
  top: 3px;
}
/deep/ .el-drawer__header {
  span,
  i {
    color: #fff;
    opacity: 0.9;
  }
}
/deep/ .el-drawer__body {
  overflow: auto;
  color: #fff;
  padding: 5px 5% 0 5%;
  .body_select {
    margin-bottom: 3%;
    span {
      opacity: 0.9;
      font-size: 13px;
      margin-bottom: 5px;
    }
    .el-select {
      margin-top: 5px;
      width: 100%;
    }
  }
}
/deep/ .el-drawer {
  background-color: #545c64;
}
/deep/ .el-drawer__body::-webkit-scrollbar {
  width: 4px;
  background-color: #545c64;
}
/deep/ .el-drawer__body::-webkit-scrollbar-thumb {
  border-radius: 2px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #fff;
}
.priceInpLeft {
  content: "";
  width: 15px;
  height: 2px;
  margin: 0px 2px 2px 2px;
  border-radius: 0.5px;
  display: inline-block;
  background-color: #fff;
}
.el-checkbox {
  color: rgb(254, 48, 48);
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-size: 10px;
}
.el-dropdown-menu {
  li {
    font-size: 11px;
    padding: 0px 15px 0 15px;
  }
}
.spanCheck {
  color: rgb(254, 48, 48);
  font-size: 10px;
  margin-left: 10px;
}
.priceWarning {
  display: inline-block;
  margin-top: 10px;
  color: rgb(254, 48, 48);
  font-size: 10px;
}
/deep/ .el-carousel {
  width: 300px;
}
.commAttr {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  display: inline-block;
  margin: 20px 0px 20px 0px;
}
.el-dialog_body {
  height: 600px;
  overflow-y: scroll;
}
.spanMenu {
  border: 5px solid #409eff;
  background-color: #409eff;
  color: #fff;
  border-radius: 5px;
}
</style>