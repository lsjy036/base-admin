<template>
  <div class="body">
    <el-table :data="orderBackData">
      <el-table-column prop="date" sortable label="退货日期"> </el-table-column>
      <el-table-column prop="time" label="退货时间"> </el-table-column>
      <el-table-column prop="orderInfoDTO.customerName" label="买家昵称">
      </el-table-column>
      <el-table-column prop="backNum" label="退货数量"> </el-table-column>
      <el-table-column prop="price" sortable label="退款"></el-table-column>
      <el-table-column label="退货详情">
        <template slot-scope="scope">
          <el-button
            @click="showDeatilOfOrderBack(scope.row)"
            type="primary"
            size="mini"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog
      :visible.sync="showDialog.orderBackDetail"
      title="退货详情"
      class="goodDetail"
    >
    <div>
      <el-descriptions
        :column="2"
        border
        title="退货商品信息"
        class="goodDetail"
      >
        <el-descriptions-item label="商品名">{{
          orderBackViewCur ? orderBackViewCur.commodityDTO.name : ""
        }}</el-descriptions-item>
        <el-descriptions-item label="品牌">{{
          orderBackViewCur ? orderBackViewCur.commodityDTO.brand.name : ""
        }}</el-descriptions-item>
        <el-descriptions-item label="品类">{{
          orderBackViewCur ? orderBackViewCur.commodityDTO.category.name : ""
        }}</el-descriptions-item>
        <el-descriptions-item label="单价">{{
          orderBackViewCur ? orderBackViewCur.commodityDTO.price : ""
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{
          orderBackViewCur
            ? orderBackViewCur.commodityDTO.status == 0
              ? "待定"
              : orderBackViewCur.commodityDTO.status == 1
              ? "上架"
              : "下架"
            : ""
        }}</el-descriptions-item>
        <el-descriptions-item label="库存">{{
          orderBackViewCur ? orderBackViewCur.commodityDTO.inventory : ""
        }}</el-descriptions-item>
        <el-descriptions-item label="详情">{{
          orderBackViewCur ? orderBackViewCur.commodityDTO.detail : ""
        }}</el-descriptions-item>
      </el-descriptions>
      </div>
      <div style="margin-top:20px;">
      <el-descriptions :column="2" border title="退货订单信息">
        <el-descriptions-item label="订单日期">{{
          orderBackViewCur ? orderBackViewCur.orderInfoDTO.date : ""
        }}</el-descriptions-item>
        <el-descriptions-item label="订单时间">{{
          orderBackViewCur ? orderBackViewCur.orderInfoDTO.time : ""
        }}</el-descriptions-item>
        <el-descriptions-item label="订单用户名">{{
          orderBackViewCur ? orderBackViewCur.orderInfoDTO.customerName : ""
        }}</el-descriptions-item>
        <el-descriptions-item label="订单总金额">{{
          orderBackViewCur ? orderBackViewCur.orderInfoDTO.orderPrice : ""
        }}</el-descriptions-item>
      </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryAllOrdersBack } from "@/api/manage";
import moment from "moment";
export default {
  data() {
    return {
      orderBackData: [],
      orderBackViewCur: "",
      pageOption: {
        currentPage: 1,
        pageSizeSel: 10,
        totalNum: 0,
      },
      showDialog: {
        orderBackDetail: false,
      },
    };
  },
  created() {
    this.handleQueryOrdersBack();
  },
  methods: {
    handleSizeChange(num) {
      this.pageOption.pageSizeSel = num;
      this.handleQueryOrdersBack();
    },
    handleCurrentChange() {
      this.handleQueryOrdersBack();
    },
    handleQueryOrdersBack() {
      let obj = {
        pageNo: this.pageOption.currentPage - 1,
        pageSize: this.pageOption.pageSizeSel,
      };
      queryAllOrdersBack(obj).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.orderBackData = res.result;
          this.pageOption.totalNum = res.totalNum;
          this.orderBackData.forEach((ord) => {
            let mid = moment(ord.backOrderTime).format("YYYY-MM-DD HH:mm:ss")
            let arr = mid.split(' ')
            ord.date = arr[0];
            ord.time = arr[1];
          });
        } else {
          this.$message.warning(res.message || "error");
        }
      });
    },
    //显示退货订单详情
    showDeatilOfOrderBack(order) {
      this.orderBackViewCur = order;
      this.orderBackViewCur.orderInfoDTO.date =
        this.orderBackViewCur.orderInfoDTO.orderTime.slice(0, 10);
      this.orderBackViewCur.orderInfoDTO.time =
        this.orderBackViewCur.orderInfoDTO.orderTime.slice(11, 19);

      this.showDialog.orderBackDetail = true;
    }
  },
};
</script>
<style scoped lang="scss">
/deep/ .el-descriptions_headers {
    
      font-size: 10px;
      font-weight: 500;
      color: #909399;
    
  }
</style>
