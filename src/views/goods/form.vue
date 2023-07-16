<template>
  <div class="xg-main goods-form">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <h2>基本信息</h2>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort" type="number"></el-input>
        <p class="text-gray">数字越大越靠前</p>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="sub_title">
        <el-input v-model="form.sub_title"></el-input>
      </el-form-item>
      <el-form-item label="缩略图" prop="thumbnail">
        <el-upload
          drag
          :action="uploadUrl"
          :show-file-list="false"
          :accept="accessImage.join(',')"
          :on-success="handleThumbnailSuccess"
          :on-error="handleError"
          :before-upload="beforeFileUpload"
          :data="qiniuData">
          <img v-if="form.thumbnail" :src="form.thumbnail | getQiniuFullUrl">
          <div v-else class="el-default">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过5mb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input type="number" v-model="form.price">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="邮费" prop="express_fee">
        <el-input type="number" v-model="form.express_fee">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-select v-model="form.type" filterable :popper-append-to-body="false" placeholder="请选择">
          <el-option
            v-for="(item, index) in types"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input type="number" v-model="form.quantity"></el-input>
      </el-form-item>
      <h2>详情</h2>
      <el-form-item>
        <div class="image-list">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="imageList"
            :accept="`${accessImage.join(',')}`"
            :before-upload="beforeFileUpload"
            :data="qiniuData"
            :on-preview="handlePictureCardPreview"
            :on-success="(res, file)=>{return handleImageUploadSuccess(res, file)}"
            :on-remove="handleImageRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
        <p class="text-gray">支持{{accessImage.join('，')}}格式的文件</p>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="submit">提交</el-button>
        <el-button size="medium" @click="gotoList">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CheckForm from '@/mixins/checkform';
import GoodssManageProxy from '@/proxies/goods';
import CommonProxy from '@/proxies/common';
import { getQiniuFullUrl } from '@/filters';

export default {
  data() {
    return {
      accessImage: ['.png', '.jpg', '.jpeg'],
      qiniuData: {
        token: '',
      },
      imageList: [],
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      uploadUrl: window.API_CONFIG['qiniu_upload'],
      form: {
        sort: 0,
        title: '',
        sub_title: '',
        thumbnail: '',
        price: 1,
        express_fee: 0,
        type: '',
        quantity: 100,
        status: 1,
        content: [],
      },
      dialogImageUrl: '',
      dialogVisible: false,
      types: [],
      isEdit: false,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        thumbnail: [
          { required: true, message: '请上传缩略图', trigger: 'change' },
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'change' },
        ],
        express_fee: [
          { required: true, message: '请输入邮费', trigger: 'change' },
        ],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'change' },
        ],
        limited_time: [
          { required: true, message: '请输入时间限制', trigger: 'change' },
        ],
        review_time: [
          { required: true, message: '请输入审核时间', trigger: 'change' },
        ],
      },
    };
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  methods: {
    handleImageRemove(file) {
      this.form.content = this.form.content.filter(item => item !== file.response.key);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    preview(image) {
      window.open(getQiniuFullUrl(image));
    },
    async getTypes() {
      const res = await GoodssManageProxy.getTypeList();
      this.types = res.data;
      this.form.type = this.types && this.types.length ? this.types[0].id : '';
    },
    gotoList() {
      this.$router.push({
        path: '/goods/list?nocache=1',
      });
    },
    async submit() {
      // 未通过校验
      if (!this.CheckForm('form')) {
        return;
      }
      const params = {
        ...this.form,
        status: 1,
      };
      if (this.isEdit) {
        // 记录操作日志
        params.log = {
          client: 1,
          content: `编辑了ID为${this.form.id}的商品`,
        };
      }
      const res = await GoodssManageProxy[this.isEdit ? 'updateGoods' : 'addGoods'](params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: '操作成功',
        });
        // 返回列表
        this.gotoList();
      }
    },
    async getDetail(goodsId) {
      const res = await GoodssManageProxy.getGoodsDetail({
        id: goodsId,
      });
      if (!res.fail) {
        this.form = {
          ...res.data,
          content: res.data.content ? res.data.content.split(',') : [],
        };
        this.imageList = this.form.content.map(item =>
          ({ name: item, url: getQiniuFullUrl(item) }));
      }
    },
    async getQiniuToken() {
      const res = await CommonProxy.getQiniuUploadToken();
      if (res.success) {
        this.qiniuData.token = res.data.uptoken;
      }
    },
    beforeFileUpload(file) {
      const type = file.type.split('/');
      if (type[0] === 'video') {
        // 如果是视频文件，则携带后缀
        this.qiniuData.key = `${this.$tools.randomString()}.${type[1]}`;
      }
      return true;
    },
    handleThumbnailSuccess(res) {
      this.form.thumbnail = res.key;
    },
    handleImageUploadSuccess(res) {
      this.form.content.push(res.key);
      console.info(this.form);
      if (this.qiniuData.key) {
        delete this.qiniuData.key;
      }
    },
    handleError() {
      this.$notify.error({
        title: '错误',
        message: '上传失败',
      });
    },
  },
  created() {
    this.getTypes();
    this.getQiniuToken();
    const goodsId = this.$route.params.id;
    if (goodsId) {
      this.getDetail(goodsId);
      this.isEdit = true;
    }
  },
};
</script>
<style lang="scss" scoped>
@include b(main) {
  padding: 20px;
}
</style>
<style lang="scss">
  .goods-form {
    .el-form {
      .el-input,.el-textarea {
        width: 420px;
      }
      .el-upload-dragger {
        width: 420px;
        margin: 10px 0;
        img {
          max-height: 180px;
          max-height: 180px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .el-upload-list__item-thumbnail {
        object-fit: cover;
      }
    }
    .step-item {
      margin-bottom: 10px;
    }
    .image-list {
      &:after {
        clear: both;
        display: table;
        content: '';
      }
      .image-item {
        position: relative;
        &:hover .image-cover {
          display: unset;
        }
      }
      .image-cover {
        position: absolute;
        background-color: rgba(0, 0, 0, .5);
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        line-height: 146px;
        vertical-align: top;
        text-align: center;
        font-size: 28px;
        color: #fff;
        display: none;
      }
      .image-item,.image-upload {
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 6px;
        box-sizing: border-box;
        float: left;
        line-height: 0;
        border: 1px dashed #c0ccda;
        img,video {
          width: 146px;
          height: 146px;
          object-fit: contain;
        }
        &:hover {
          border-color: #409eff;
          cursor: pointer;
        }
      }
      .image-upload {
        width: 146px;
        height: 146px;
        text-align: center;
        font-size: 28px;
        color: #8c939d;
        background-color: #fbfdff;
        cursor: pointer;
        line-height: 146px;
        vertical-align: top;
        .el-upload-list {
          display: none;
        }
      }
    }
  }
</style>
