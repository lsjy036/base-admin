<template>
  <div class="table-container">
    <div style="margin-bottom: 30px">
      <el-input
        prefix-icon="el-icon-search"
        v-model="searchBra"
        placeholder="请输入品牌名进行搜索"
        class="searchBrandInput"
      ></el-input>
      <el-input
        v-model="addBrandInp"
        placeholder="请输入品牌名进行添加"
        style="width: 30%; margin-right: 2%; margin-left: 10%"
      ></el-input>
      <el-button type="primary" icon="el-icon-plus" @click="addBrands">新增</el-button>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="品牌ID"> </el-table-column>
      <el-table-column prop="name" label="品牌名"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {insertBrand} from '@/api/manage'
export default {
  data() {
    return {
      addBrandInp: "",
      searchBra: "",
      tag: false,
    };
  },
  created() {
    this.$store.dispatch("manage/getBrands");
  },
  computed: {
    tableData() {
      return this.$store.state.manage.brands.filter((val) => {
        return val.name.includes(this.searchBra);
      });
    },
  },
  methods: {
    deleteRow(ind) {
      this.$store
        .dispatch("manage/deleteBrand", { id: this.tableData[ind].id })
        .then(() => {
          this.$message.success("删除品牌成功!");
        })
        .catch((val) => {
          this.$message.warning(val);
        });
    },
    async addBrands(){
        let data = {name:this.addBrandInp}
        let res = await insertBrand(data)
        if(res.code === 0){
            this.$message.success('新增品牌成功!')
            this.$store.dispatch('manage/getBrands')
        }
        else{
            this.$message.error(res.message || 'error')
        }
    },
  },
};
</script>
<style scoped lang="scss">
.table-container {
  width: 80%;
  margin-left: 10%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.searchBrandInput {
  border: 0px;
  width: 30%;
  margin-right: 3%;
}
</style>