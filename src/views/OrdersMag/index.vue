<template>
  <div>
    <div class="searchOrderByOpi">
      <span>通过订单用户搜索:</span>
      <el-input
        v-model="searchOption.orderByUserName"
        placeholder="请输入订单用户名进行搜索"
        style="width: 20%; margin: 2% 2% 0 2%"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleSearchByName"
        >搜索</el-button
      >
    </div>
    <div class="searchOrderByOpi">
      <span>通过订单时间搜索:</span>
      <el-date-picker
        v-model="searchOption.timeValue1"
        type="datetime"
        placeholder="选择起始日期时间"
        style="margin-left: 2%"
      >
      </el-date-picker>
      <el-date-picker
        v-model="searchOption.timeValue2"
        type="datetime"
        placeholder="选择截止日期时间"
        style="margin: 2%"
      >
      </el-date-picker>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleSearchByTime"
        >搜索</el-button
      >
    </div>
    <div class="searchOrderByOpi">
      <el-button type="primary" icon="el-icon-view" @click="handleAllOrders"
        >查看全部订单</el-button
      >
    </div>

    <!-- 订单列表 -->
    <div class="orderTable" style="margin: 10px">
      <el-table :data="ordersData">
        <el-table-column prop="id" label="订单ID" width="80">
        </el-table-column>
        <el-table-column prop="date" sortable label="订单日期">
        </el-table-column>
        <el-table-column prop="time" label="订单时间"> </el-table-column>
        <el-table-column prop="customerName" label="买家昵称">
        </el-table-column>
        <el-table-column prop="orderPrice" sortable label="订单总价">
        </el-table-column>
        <el-table-column label="订单商品">
          <template slot-scope="scope">
            <el-button
              @click="showGoodsOfOrder(scope.row)"
              type="primary"
              size="mini"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-left: 2%; margin-top: 10px; margin-bottom: 20px">
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
    <el-dialog :visible.sync="showDialog.goodOfOrder" title="订单商品" @closed="resetDialog">
      <el-table :data="goodsOfOrder" style="width: 100%; margin: auto" border>
        <el-table-column prop="name" label="商品名"></el-table-column>
        <el-table-column prop="brandName" label="品牌"></el-table-column>
        <el-table-column prop="categoryName" label="品类"></el-table-column>
        <el-table-column prop="num" label="购买数量"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="status" label="商品状态">
          <template slot-scope="scope">
            <span>
              {{ goodsStatus[scope.row.status - 1] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import {
  getOrders,
  queryGood,
  searchOrdersByName,
  searchOrdersByTime,
} from "@/api/manage";
export default {
  data() {
    return {
      ordersData: [],
      timeCheck: false,
      searchOption: {
        timeValue1: "",
        timeValue2: "",
        orderByUserName: "",
      },
      pageOption: {
        currentPage: 1,
        pageSizeSel: 10,
        totalNum: 0,
      },
      goodsStatus: ["进行中", "已付款", "已收货", "已退款"],
      showDialog: {
        goodOfOrder: false,
      },
      goodsOfOrder: [],
    };
  },
  created() {
    this.handleAllOrders();
  },
  methods: {
    //页面显示条数发生改变
    handleSizeChange(num) {
      this.pageOption.pageSizeSel = num;
      this.handleAllOrders();
    },
    //页码发生变化
    handleCurrentChange() {
      this.handleAllOrders();
    },
    //展示订单商品详情
    async showGoodsOfOrder(row) {
      let goodsObj = row.detail;
      let resArr = [];
      const responseArr = Object.keys(goodsObj).map(async (val) => {
        let id = Number(val);
        let res = await queryGood({ id: id });
        return res;
      });
      for (const response of responseArr) {
        resArr.push(await response);
      }
      for (const response of resArr) {
        if (response.code == 0) {
          let result = response.result;
          let mid = {};
          mid.name = result.name;
          mid.categoryName = result.category.name;
          mid.brandName = result.brand.name;
          mid.num = goodsObj[result.id].number;
          mid.orderStatus = goodsObj[result.id].status;
          mid.price = goodsObj[result.id].price;
          mid.status = goodsObj[result.id].status;
          this.goodsOfOrder.push(mid);
        }
      }
      this.showDialog.goodOfOrder = true;
    },
    //通过订单用户搜索订单
    handleSearchByName() {
      if (this.searchOption.orderByUserName == "") return;
      let obj = {
        customerName: this.searchOption.orderByUserName,
        pageNo: 0,
        pageSize: 10,
      };
      searchOrdersByName(obj).then((res) => {
        if (res.code == 0) {
          this.ordersData = res.result;
          this.pageOption.totalNum = res.totalNum;
          this.ordersData.forEach((val) => {
            val.date = val.orderTime.slice(0, 10);
            val.time = val.orderTime.slice(11, 19);
          });
        } else {
          this.$message.warning(res.message || "error");
        }
        this.searchOption.orderByUserName = "";
      });
    },
    //查看全部订单
    handleAllOrders() {
      let obj = {
        pageNo: this.pageOption.currentPage - 1,
        pageSize: this.pageOption.pageSizeSel,
      };
      getOrders(obj).then((res) => {
        if (res.code == 0) {
          this.ordersData = res.result;
          this.pageOption.totalNum = res.totalNum;
          this.ordersData.forEach((val) => {
            let mid = moment(val.orderTime).format("YYYY-MM-DD HH:mm:ss");
            let arr = mid.split(" ");
            val.date = arr[0];
            val.time = arr[1];
          });
        } else {
          this.$message.warning(res.message || "error");
        }
      });
    },
    //通过时间搜索订单
    handleSearchByTime() {
      let value1 = this.searchOption.timeValue1.valueOf();
      let value2 = this.searchOption.timeValue2.valueOf();
      var formatDate1 = new Date(value1);
      var formatDate2 = new Date(value2);
      if (value1 != "" && value2 != "") {
        if (formatDate1 > formatDate2) {
          this.$message.warning({
            message: "截止时间比较大于起始时间",
            duration: 1500,
          });
          return;
        }
      }
      let obj = {
        pageNo: 0,
        pageSize: 10,
      };
      if (value1) obj.startTime = value1;
      if (value2) obj.endTime = value2;
      searchOrdersByTime(obj).then((res) => {
        if (res.code == 0) {
          this.ordersData = res.result;
          this.pageOption.totalNum = res.totalNum;
          this.ordersData.forEach((val) => {
            val.date = val.orderTime.slice(0, 10);
            val.time = val.orderTime.slice(11, 19);
          });
        } else {
          this.$message.warning(res.message || "error");
        }
        (this.searchOption.timeValue1 = ""),
          (this.searchOption.timeValue1 = "");
      });
    },
    //重置dialog数据
    resetDialog(){
      this.goodsOfOrder = []
    }
  },
};
</script>
<style scoped lang="scss">
.searchOrderByOpi {
  padding-left: 2%;
  font-size: 14px;
  font-weight: 700;
  color: #909399;
}
</style>