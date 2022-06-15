<template>
  <div>
    <div v-show="showResult">
      <div>
        <div style="margin: 1%">
          <label class="spanSelect">三级品类id查询</label>
          <el-select
            v-model="categoryLevel3ID"
            placeholder="请选择三级品类"
            style="margin-right: 2%"
          >
            <el-option
              v-for="item in categoryLevel3Arr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <label class="spanSelect">该品类id为</label>
          <el-tag size="small">{{
            categoryLevel3ID == "" ? "未选" : categoryLevel3ID
          }}</el-tag>
        </div>
      </div>
      <div class="fomrContainer">
        <el-form
          :model="formData"
          @submit.native.prevent=""
          label-position="top"
        >
          <el-form-item label="活动类型">
            <el-select v-model="selectValue" placeholder="请选择">
              <el-option
                v-for="item in selectOpitions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动名字">
            <el-input v-model="formData.actName" style="width: 60%"></el-input>
          </el-form-item>
          <el-form-item label="活动内容">
            <el-input
              rows="4"
              type="textarea"
              v-model="formData.detailOfAct"
              style="width: 60%"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动时间">
            <div style="margin-top:-20px;">
              <el-date-picker
                v-model="formData.timeValue1"
                type="datetime"
                placeholder="选择起始日期时间"
              >
              </el-date-picker>
              <el-date-picker
                v-model="formData.timeValue2"
                type="datetime"
                placeholder="选择截止日期时间"
                style="margin: 2%"
              >
              </el-date-picker>
            </div>
          </el-form-item>
        </el-form>
        <el-button @click="submitForm" type="primary">提交</el-button>
      </div>
    </div>
    <div v-show="!showResult">
      <el-result icon="success" title="成功提示">
        <template slot="extra">
          <el-button type="primary" size="medium" @click="handleResult"
            >返回</el-button
          >
        </template>
      </el-result>
    </div>
  </div>
</template>
<script>
import { insertAct } from "@/api/activities";
import moment from "moment";
export default {
  data() {
    return {
      selectValue: "",
      selectOpitions: [
        {
          name: "活动满减",
          value: "FullMinus",
        },
        {
          name: "活动折扣",
          value: "Discount",
        },
        {
          name: "活动优惠券",
          value: "Coupon",
        },
      ],
      formData: {
        detailOfAct: "",
        actName: "",
        timeValue1: "",
        timeValue2: "",
      },
      categoryLevel3ID: "",
      showResult: true,
    };
  },
  created() {
    this.$store.dispatch("manage/getCategory", { level: 1 }); //获取到父类品类
    this.$store.dispatch("manage/getCategory", { level: 2 }); //获取到父类品类
    this.$store.dispatch("manage/getCategory", { level: 3 }); //获取到父类品类
  },
  methods: {
    submitForm() {
      let obj = {
        activityName: this.formData.actName,
      };
      let time1 = moment(this.formData.timeValue1).format(
        "YYYY-MM-DD-HH:mm:ss"
      );
      let time2 = moment(this.formData.timeValue2).format(
        "YYYY-MM-DD-HH:mm:ss"
      );
      let str = this.formData.detailOfAct;
      str += " Start ";
      str += time1;
      str += " End ";
      str += time2;
      obj.dsl = str;
      insertAct(obj).then((res) => {
        if (res.code == 0) {
          this.showResult = false;
        } else {
          this.selectValue = "";
          this.formData.detailOfAct = "";
          this.formData.actName = "";
          this.formData.timeValue1 = "";
          this.formData.timeValue2 = "";
          this.categoryLevel3ID = "";
          this.$message.warning(res.message || "error");
        }
      });
    },
    handleResult() {
      this.$router.replace("/management/CommActivities");
    },
  },
  watch: {
    selectValue(newVal) {
      this.formData.detailOfAct = newVal;
    },
  },
  computed: {
    categoryLevel3Arr() {
      return this.$store.state.manage.categoryLevel3;
    },
  },
};
</script>
<style scoped lang="scss">
.fomrContainer {
  margin-top: 10px;
  padding: 1%;
}
.spanSelect {
  font-size: 14px;
  margin-right: 2%;
  color: #606266;
}
</style>
