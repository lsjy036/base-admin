<template>
  <div>
    <div class="stockTableContainer">
      <el-table :data="stockData" style="width: 96%; margin: auto">
        <el-table-column prop="date" sortable label="订单日期">
        </el-table-column>
        <el-table-column prop="time" label="订单时间"> </el-table-column>
        <el-table-column prop="commodityDTO.name" label="进货商品"></el-table-column>
        <el-table-column prop="stockNum" label="进货数量"> </el-table-column>
        <el-table-column prop="stockPrice" sortable label="进货价"> </el-table-column>
        <el-table-column label="商品详情">
          <template slot-scope="scope">
            <el-button
              @click="showStockDetail(scope.row)"
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
    <el-dialog :visible.sync="showDialog.goodsDetail" title="进货商品详情" >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="商品名">{{curViewStock ? curViewStock.commodityDTO.name : ""}}</el-descriptions-item>
        <el-descriptions-item label="品牌">{{curViewStock ? curViewStock.commodityDTO.brand.name:""}}</el-descriptions-item>
        <el-descriptions-item label="品类">{{curViewStock ? curViewStock.commodityDTO.category.name:""}}</el-descriptions-item>
        <el-descriptions-item label="单价">{{curViewStock ? curViewStock.commodityDTO.price:""}}</el-descriptions-item>
        <el-descriptions-item label="状态">{{curViewStock ? (curViewStock.commodityDTO.status == 0 ? "待定":curViewStock.commodityDTO.status == 1?"上架":"下架"):""}}</el-descriptions-item>
        <el-descriptions-item label="库存">{{curViewStock ? curViewStock.commodityDTO.inventory:""}}</el-descriptions-item>
        <el-descriptions-item label="详情">{{curViewStock ? curViewStock.commodityDTO.detail:""}}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>
<script>
import { queryAllStock } from "@/api/manage";
import moment from "moment";
export default {
  data() {
    return {
      stockData: [],
      pageOption: {
        currentPage: 1,
        pageSizeSel: 10,
        totalNum: 0,
      },
      curViewStock:"",
      showDialog: {
        goodsDetail: false,
      },
    };
  },
  created() {
    this.handleQueryAllStock();
  },
  methods: {
    handleSizeChange(num) {
      this.pageOption.pageSizeSel = num;
      this.handleQueryAllStock();
    },
    handleCurrentChange() {
      this.handleQueryAllStock();
    },
    handleQueryAllStock() {
      let obj = {
        pageNo: this.pageOption.currentPage - 1,
        pageSize: this.pageOption.pageSizeSel,
      };
      queryAllStock(obj).then((res) => {
        if (res.code == 0) {
          this.stockData = res.result;
          this.pageOption.totalNum = res.totalNum;
          this.stockData.forEach((val) => {
            let mid = moment(val.stockTime).format("YYYY-MM-DD HH:mm:ss")
            let arr = mid.split(' ')
            val.date = arr[0]
            val.time = arr[1];
          });
        } else {
          this.$message.warning(res.message || "error");
        }
      });
    },
    //展示商品详细信息
    showStockDetail(stock){
        this.curViewStock=stock
        this.showDialog.goodsDetail=true
    },
  },
};
</script>
<style scoped lang="scss">
</style>
