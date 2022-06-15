<template>
  <div>
    <div class="barContainer">
      <label style="color: #666">查看品类总销量TOP</label>
      <div class="inputContainer">
        <el-input
          style="width: 20%; margin-right: 15px"
          type="text"
          v-model.number="topOpitions.categoryTopN"
        ></el-input>
        <el-button type="primary" @click="resetCategoryTopN">查看</el-button>
      </div>
      <div id="charts-category" class="echart"></div>
    </div>
    <div class="barContainer">
      <label style="color: #666">查看品牌总销量TOP</label>
      <div class="inputContainer">
        <el-input
          style="width: 20%; margin-right: 15px"
          type="text"
          v-model.number="topOpitions.brandTopN"
        ></el-input>
        <el-button type="primary" @click="resetBrandTopN">查看</el-button>
      </div>
      <div id="charts-brand" class="echart"></div>
    </div>
    <div class="barContainer">
      <label style="color: #666">查看商品总销量TOP</label>
      <div class="inputContainer">
        <el-input
          style="width: 20%; margin-right: 15px"
          type="text"
          v-model.number="topOpitions.commodityTopN"
        ></el-input>
        <el-button type="primary" @click="resetCommodityTopN">查看</el-button>
      </div>
      <div id="charts-commodity" class="echart"></div>
    </div>
  </div>
</template>
<script>
import { getCategoryTop, getTopNBrands, getTopNCommodity } from "@/api/finance";
export default {
  data() {
    return {
      topOpitions: {
        categoryTopN: 6,
        brandTopN: 6,
        commodityTopN: 6,
      },
      arrOption: {
        categoryNameArr: [],
        categorytotalpriceArr: [],
        brandNameArr: [],
        brandtotalPriceArr: [],
        commodityData: [],
      },
    };
  },
  mounted() {
    this.drawLine();
  },
  computed: {
    categoryOptions() {
      return {
        xAxis: {
          type: "category",
          data: this.arrOption.categoryNameArr,
          axisLabel: {
            color: "#333",
            //  让x轴文字方向为竖向
            interval: 0,
            formatter: function (value) {
              return value.split("").join("\n");
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.arrOption.categorytotalpriceArr,
            type: "bar",
            barWidth: "50%",
          },
        ],
        grid: {
          x: 50,
          y: 50,
          x2: 50,
          y2: 60,
          height: 200,
          borderWidth: 10,
        },
        label: {
          show: true,
          position: "top",
          textStyle: {
            //数值样式
            color: "#ccc",
            fontSize: 10,
          },
        },
      };
    },
    brandOptions() {
      return {
        xAxis: {
          type: "category",
          data: this.arrOption.brandNameArr,
          axisLabel: {
            color: "#333",
            //  让x轴文字方向为竖向
            interval: 0,
            formatter: function (value) {
              return value.split("").join("\n");
            },
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.arrOption.brandtotalPriceArr,
            type: "bar",
            barWidth: "50%",
          },
        ],
        grid: {
          x: 50,
          y: 50,
          x2: 50,
          y2: 60,
          height: 200,
          borderWidth: 10,
        },
        label: {
          show: true,
          position: "top",
          textStyle: {
            //数值样式
            color: "#ccc",
            fontSize: 10,
          },
        },
      };
    },
    commodityOptions() {
      return {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "sales",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            data: this.arrOption.commodityData,
          },
        ],
      };
    },
  },
  methods: {
    drawLine() {
      let categoryChart = this.$echarts.init(
        document.getElementById("charts-category")
      );
      let brandChart = this.$echarts.init(
        document.getElementById("charts-brand")
      );
      let commodityChart = this.$echarts.init(
        document.getElementById("charts-commodity")
      );
      getCategoryTop({ topN: this.topOpitions.categoryTopN }).then((res) => {
        if (res.code == 0) {
          res.result.forEach((val, ind) => {
            this.arrOption.categoryNameArr[ind] = val.category.name;
            this.arrOption.categorytotalpriceArr[ind] = val.totalPrice;
          });
          // 绘制图表
          categoryChart.setOption(this.categoryOptions);
        } else {
          this.$message.warning(res.message || "error!");
        }
      });
      getTopNBrands({ topN: this.topOpitions.brandTopN }).then((res) => {
        if (res.code == 0) {
          res.result.forEach((val, ind) => {
            this.arrOption.brandNameArr[ind] = val.brand.name;
            this.arrOption.brandtotalPriceArr[ind] = val.totalPrice;
          });
          // 绘制图表
          brandChart.setOption(this.brandOptions);
        } else {
          this.$message.warning(res.message || "error!");
        }
      });
      getTopNCommodity({ topN: this.topOpitions.commodityTopN }).then((res) => {
        if (res.code == 0) {
          res.result.forEach((val, ind) => {
            this.arrOption.commodityData[ind] = {
              name: val.name,
              value: val.saleVolume,
            };
          });
          // 绘制图表
          commodityChart.setOption(this.commodityOptions);
        } else {
          this.$message.warning(res.message || "error!");
        }
      });
    },
    //重新渲染品类top
    setOptionOfCategory() {
      let myChart = this.$echarts.getInstanceByDom(
        document.getElementById("charts-category")
      );
      getCategoryTop({ topN: this.topOpitions.categoryTopN }).then((res) => {
        if (res.code == 0) {
          this.arrOption.categoryNameArr = [];
          this.arrOption.categorytotalpriceArr = [];
          res.result.forEach((val, ind) => {
            this.arrOption.categoryNameArr[ind] = val.category.name;
            this.arrOption.categorytotalpriceArr[ind] = val.totalPrice;
          });
          myChart.setOption(this.categoryOptions);
        } else {
          this.$message.warning(res.message || "error!");
        }
      });
    },
    //重新渲染品牌top
    setOptionOfBrand() {
      let myChart = this.$echarts.getInstanceByDom(
        document.getElementById("charts-brand")
      );
      getTopNBrands({ topN: this.topOpitions.brandTopN }).then((res) => {
        if (res.code == 0) {
          this.arrOption.brandtotalPriceArr = [];
          this.arrOption.brandNameArr = [];
          res.result.forEach((val, ind) => {
            this.arrOption.brandNameArr[ind] = val.brand.name;
            this.arrOption.brandtotalPriceArr[ind] = val.totalPrice;
          });
          // 绘制图表
          myChart.setOption(this.brandOptions);
        } else {
          this.$message.warning(res.message || "error!");
        }
      });
    },
    //重新渲染商品top
    setOptionOfCommodity() {
      let myChart = this.$echarts.getInstanceByDom(
        document.getElementById("charts-commodity")
      );
      getTopNCommodity({ topN: this.topOpitions.commodityTopN }).then((res) => {
        if (res.code == 0) {
          this.arrOption.commodityData = [];
          res.result.forEach((val, ind) => {
            this.arrOption.commodityData[ind] = {
              name: val.name,
              value: val.saleVolume,
            };
          });
          // 绘制图表
          myChart.setOption(this.commodityOptions);
        } else {
          this.$message.warning(res.message || "error!");
        }
      });
    },
    resetCategoryTopN() {
      this.setOptionOfCategory();
    },
    resetBrandTopN() {
      this.setOptionOfBrand();
    },
    resetCommodityTopN() {
      this.setOptionOfCommodity();
    },
  },
};
</script>
<style scoped lang="scss">
.barContainer {
  margin-left: 2%;
  margin-top: 2%;
  .inputContainer {
    margin-top: 20px;
  }
  .echart {
    width: 1000px;
    height: 420px;
  }
}
</style>
