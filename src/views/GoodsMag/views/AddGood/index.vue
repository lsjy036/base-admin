<template>
  <div class="formContainer">
    <el-form @submit.native.prevent="">
      <el-form-item label="商品名字">
        <el-input v-model="goodAttr.name" style="width: 30%"></el-input>
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input
          v-model="goodAttr.price"
          style="width: 30%"
          @input="checkInput"
        ></el-input>
        <span v-show="visible" class="spanCheck">请输入正确格式的价格</span>
      </el-form-item>
      <el-form-item label="商品品牌与品类">
        <el-select
          v-model="goodAttr.brandID"
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
        <el-select v-model="goodAttr.categoryID" placeholder="请选择品类">
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品主图" style="width: 50%">
        <el-upload
          class="upload-demo"
          action="#"
          multiple
          :auto-upload="false"
          :before-upload="beforeAvatarUpload1"
          :on-change="handleChange1"
          :on-remove="handleRemove1"
          :on-exceed="handleExceed"
          :limit="10"
          :file-list="fileList1"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件,且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品详情页图片" style="width: 50%">
        <el-upload
          class="upload-demo"
          action="#"
          multiple
          :auto-upload="false"
          :on-change="handleChange2"
          :on-remove="handleRemove2"
          :before-upload="beforeAvatarUpload2"
          :limit="10"
          :on-exceed="handleExceed"
          :file-list="fileList2"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件,且不超过2MB
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品详情">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
          style="width: 80%"
          v-model="goodAttr.detail"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品属性添加">
        <br />
        <div class="inputContainer">
          <span>属性名字</span>
          <el-input
            placeholder="请输入属性名字"
            style="width: 50%"
            v-model="addGoodProp.name"
          ></el-input>
        </div>
        <div class="inputContainer">
          <span>属性描述</span>
          <el-input
            placeholder="请输入属性描述"
            style="width: 50%"
            v-model="addGoodProp.detail"
          ></el-input>
          <el-button style="margin-left: 10px" type="primary" @click="addProp"
            >添加</el-button
          >
        </div>
        <el-table :data="tableData" border style="width: 80%">
          <el-table-column prop="name" label="属性名字"> </el-table-column>
          <el-table-column prop="detail" label="属性描述"></el-table-column>
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
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="submitGoodAttr">提交</el-button>
        <span style="font-size: 8px">如已完成页面填写,请点击</span>
  </div>
</template>
<script>
import { uploadImgToBase64 } from "@/utils/manage";
export default {
  name: "AddGood",
  data() {
    return {
      fileList1: [],
      fileList2: [],
      visible: false,
      goodAttr: {
        name: "",
        categoryID: "",
        brandID: "",
        price: "",
        props: "",
        detail: "",
        mainPicBase64: [],
        detailPicBase64: [],
      },
      tableData: [],
      addGoodProp: {
        name: "",
        detail: "",
      },
    };
  },
  created() {
    let res = this.$store.state.manage.brands;
    this.$store.dispatch("manage/getCategory", { level: 3 });
    if (res.length === 0) {
      this.$store.dispatch("manage/getBrands");
    }
  },
  computed: {
    brandsOptions() {
      return this.$store.state.manage.brands;
    },
    categoryOptions() {
      return this.$store.state.manage.categoryLevel3;
    },
  },
  methods: {
    checkInput(val) {
      let inp = Number(val);
      if (Number.isNaN(inp)) {
        this.visible = true;
      } else {
        this.visible = false;
      }
    },
    //添加商品属性
    addProp() {
      if (this.addGoodProp.name == "" || this.addGoodProp.detail == "") {
        this.$message.warning("属性不能为空!");
        return;
      }
      this.tableData.push({
        name: this.addGoodProp.name,
        detail: this.addGoodProp.detail,
      });
      this.addGoodProp.name = "";
      this.addGoodProp.detail = "";
    },
    //删除商品属性
    deleteRow(ind) {
      this.$delete(this.tableData, ind);
    },
    //移除商品图片
    handleRemove1(file, fileList) {
      this.fileList1 = fileList;
    },
    //文件超出数目限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择10个文件,本次选择了 ${files.length} 个文件,共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    //将商品图片文件状态同步到fileList1中
    handleChange1(file) {
      this.fileList1.push(file);
    },
    //商品图片上传之前判断图片大小
    beforeAvatarUpload1(file) {
      const accept = ["image/jpg", "image/png", "image/jpeg"];
      const isJPG = accept.includes(file.type);
      const isLt500K = file.size / 1024 < 500;
      if (!isJPG) {
        this.$message.error("图片格式不对!");
      }
      if (!isLt500K) {
        this.$message.error("上传图片大小不能超过500KB!");
      }
      return isJPG && isLt500K;
    },
    //将商品详情图片状态同步到fileList2
    handleChange2(file) {
      this.fileList2.push(file);
    },
    //商品详情图片上传之前判断图片大小
    beforeAvatarUpload2(file) {
      const accept = ["image/jpg", "image/png", "image/jpeg"];
      const isJPG = accept.includes(file.type);
      const isLt500K = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("图片格式不对!");
      }
      if (!isLt500K) {
        this.$message.error("上传图片大小不能超过2MB!");
      }
      return isJPG && isLt500K;
    },
    //移除商品详情图片
    handleRemove2(file, fileList) {
      this.fileList2 = fileList;
    },
    //处理数据以及提交表单
    async submitGoodAttr() {
      if (
        this.goodAttr.name == "" ||
        this.goodAttr.categoryID == "" ||
        this.goodAttr.brandID == "" ||
        this.goodAttr.price == ""
      ) {
        this.$message.error("页面填写尚未完成!");
        return Promise.reject();
      }
      this.goodAttr.price = Number(this.goodAttr.price);
      if (Number.isNaN(this.goodAttr.price)) {
        this.$message.warning("商品价格设置有误!");
        return;
      }
      //将图片转变成base64
      if (this.fileList1.length !== 0) {
        const mainImgProm = this.fileList1.map(async (file) => {
          const response = await uploadImgToBase64(file.raw);
          return response.result.replace(/.*;base64,/, ""); // 去掉data:image/jpeg;base64,
        });
        //商品图片以及商品详情图片传入数组中
        for (const textPromise of mainImgProm) {
          this.goodAttr.mainPicBase64.push(await textPromise);
        }
      }
      if (this.fileList2.length !== 0) {
        const detailImgProm = this.fileList2.map(async (file) => {
          const response = await uploadImgToBase64(file.raw);
          return response.result.replace(/.*;base64,/, ""); // 去掉data:image/jpeg;base64,
        });
        for (const textPromise of detailImgProm) {
          this.goodAttr.detailPicBase64.push(await textPromise);
        }
      }
      //处理商品详情为json字符串
      let detailObj = {};
      this.tableData.forEach((val) => {
        detailObj[val.name] = val.detail;
      });
      this.goodAttr.props = JSON.stringify(detailObj);
      let dataGood = {};
      Object.keys(this.goodAttr).forEach((val) => {
        dataGood[val] = this.goodAttr[val];
      });
      this.$store
        .dispatch("manage/insertGood", dataGood)
        .then(() => {
          this.$message.success("新增商品成功!");
          this.$router.push('/management/goodsmag')
        })
        .catch(() => {
          this.$message.warning("新增商品失败");
        });
        return false
    },
  },
};
</script>

<style scoped lang="scss">
.formContainer {
  margin: 10px 50px 0px 50px;
}
span {
  margin-right: 20px;
}
.inputContainer {
  margin-bottom: 15px;
}
.spanCheck {
  color: red;
  font-size: 10px;
  margin-left: 10px;
}
</style>