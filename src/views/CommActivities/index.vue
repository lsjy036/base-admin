<template>
  <div>
    <div class="checkBox">
      <el-button
        @click="insertActivity"
        type="primary"
        style="margin-right: 10px"
        >新增活动</el-button
      >
      <el-checkbox v-model="checked" @change="changeChecked"
        >仅查看上线活动</el-checkbox
      >
    </div>
    <div style="width: 96%; margin: auto">
      <el-table :data="allActivitiesData">
        <el-table-column
          prop="startDate"
          sortable
          label="活动开始日期"
        ></el-table-column>
        <el-table-column
          prop="startTime"
          label="活动开始时间"
        ></el-table-column>
        <el-table-column
          prop="endDate"
          sortable
          label="活动结束日期"
        ></el-table-column>
        <el-table-column prop="endTime" label="活动结束时间"></el-table-column>
        <el-table-column prop="activityName" label="活动名称"></el-table-column>
        <el-table-column label="活动类型">
          <template slot-scope="scope">
            {{
              scope.row.type == 1
                ? "优惠券"
                : scope.row.type == 2
                ? "满减"
                : "折扣"
            }}
          </template>
        </el-table-column>
        <el-table-column label="活动状态">
          <template slot-scope="scope">
            <span>
              {{ scope.row.online == 0 ? "下线" : "上线" }}
            </span>
            <el-dropdown
              trigger="click"
              @command="
                (command) => {
                  changeActStatus(command, scope.row);
                }
              "
            >
              <span class="el-dropdown-link">
                更改<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">上线</el-dropdown-item>
                <el-dropdown-item command="0">下线</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="活动详情">
          <template slot-scope="scope">
            <el-button
              @click="showDetailOfAct(scope.row)"
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
    <div>
      <el-dialog :visible.sync="showDialog.detailOfAct" title="活动详情">
        <el-descriptions title="用户信息" border :column="2">
          <el-descriptions-item label="活动类型">{{
            detailOfActCur.type == 1
              ? "优惠券"
              : detailOfActCur.type == 2
              ? "满减"
              : "折扣"
          }}</el-descriptions-item>
          <el-descriptions-item
            v-if="detailOfActCur.type == 3"
            label="活动折扣"
            >{{ detailOfActCur.discount }}</el-descriptions-item
          >
          <el-descriptions-item
            v-else-if="detailOfActCur.type == 2"
            label="活动满减"
            >{{
              "满" + detailOfActCur.fullPrice + "减" + detailOfActCur.reduce
            }}</el-descriptions-item
          >
          <el-descriptions-item
            v-else-if="detailOfActCur.type == 1"
            label="活动优惠"
            >{{ detailOfActCur.reduce }}</el-descriptions-item
          >
          <el-descriptions-item label="活动开始日期">{{
            detailOfActCur.startDate
          }}</el-descriptions-item>
          <el-descriptions-item label="活动开始时间">{{
            detailOfActCur.startTime
          }}</el-descriptions-item>
          <el-descriptions-item label="活动截止日期">{{
            detailOfActCur.endDate
          }}</el-descriptions-item>
          <el-descriptions-item label="活动截止时间">{{
            detailOfActCur.endTime
          }}</el-descriptions-item>
          <el-descriptions-item label="活动条件">{{
            detailOfActCur.actCondition
          }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { queryAllActivities, changeStatus,queryOnline } from "@/api/activities";
import moment from "moment";
export default {
  data() {
    return {
      detailOfActCur: "",
      allActivitiesData: [],
      checked: false,
      pageOption: {
        currentPage: 1,
        pageSizeSel: 10,
        totalNum: 0,
      },
      showDialog: {
        detailOfAct: false,
      },
    };
  },
  created() {
    this.handleQueryAllActivities();
  },
  methods: {
    handleQueryAllActivities() {
      let obj = {
        pageNo: this.pageOption.currentPage - 1,
        pageSize: this.pageOption.pageSizeSel,
      };
      queryAllActivities(obj).then((res) => {
        if (res.code == 0) {
          console.log("activities", res);
          this.allActivitiesData = res.result;
          this.pageOption.totalNum = res.totalNum;
          this.allActivitiesData.forEach((act) => {
            let mid1 = moment(act.startTime).format("YYYY-MM-DD HH:mm:ss");
            let mid2 = moment(act.endTime).format("YYYY-MM-DD HH:mm:ss");
            let arr1 = mid1.split(" ");
            let arr2 = mid2.split(" ");
            act.startDate = arr1[0];
            act.startTime = arr1[1];
            act.endDate = arr2[0];
            act.endTime = arr2[1];
          });
        } else {
          this.$message.warning(res.message || "error");
        }
      });
    },
    handleSizeChange(pageSize) {
      this.pageOption.pageSizeSel = pageSize;
      this.handleQueryAllActivities();
    },
    handleCurrentChange() {
      this.handleQueryAllActivities();
    },
    changeActStatus(command, row) {
      changeStatus({
        id: row.id,
        status: command,
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success("修改状态成功!请刷新页面!");
        } else {
          this.message.warning(res.message || "error!");
        }
      });
    },
    //展示活动详情
    showDetailOfAct(detail) {
      this.detailOfActCur = detail;
      let ind1 = detail.dsl.indexOf("[");
      let ind2 = detail.dsl.indexOf("Start");
      if (this.detailOfActCur.type == 3)
        this.detailOfActCur.discount = Number(detail.dsl.slice(9, ind2 - 1));
      else if (this.detailOfActCur.type == 2) {
        let arrPrice = detail.dsl.split(" ");
        console.log(arrPrice);
        this.detailOfActCur.fullPrice = arrPrice[1];
        this.detailOfActCur.reduce = arrPrice[2];
      } else if (this.detailOfActCur.type == 1) {
        this.detailOfActCur.reduce = Number(detail.dsl.slice(7, ind2 - 1));
      }
      this.detailOfActCur.actCondition = detail.dsl.slice(ind1, ind2 - 1);
      this.showDialog.detailOfAct = true;
    },
    //新增商品
    insertActivity() {
      this.$router.push("/management/InsetActivity");
    },
    //切换check值
    changeChecked(val) {
      if(val == false) {
        this.handleQueryAllActivities()
        return;
      }
      let obj = {
        pageNo: this.pageOption.currentPage - 1,
        pageSize: this.pageOption.pageSizeSel,
      };
      queryOnline(obj).then((res) => {
        if (res.code == 0) {
          console.log("activities", res);
          this.allActivitiesData = res.result;
          this.pageOption.totalNum = res.totalNum;
          this.allActivitiesData.forEach((act) => {
            let mid1 = moment(act.startTime).format("YYYY-MM-DD HH:mm:ss");
            let mid2 = moment(act.endTime).format("YYYY-MM-DD HH:mm:ss");
            let arr1 = mid1.split(" ");
            let arr2 = mid2.split(" ");
            act.startDate = arr1[0];
            act.startTime = arr1[1];
            act.endDate = arr2[0];
            act.endTime = arr2[1];
          });
        } else {
          this.$message.warning(res.message || "error");
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-size: 10px;
}
.checkBox {
  margin-top: 2%;
  padding-left: 2%;
  /deep/.el-checkbox {
    span {
      font-size: 2px;
    }
  }
}
</style>
