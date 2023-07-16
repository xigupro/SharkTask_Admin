<template>
  <div class="xg-main task-form">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <h2>基本信息</h2>
      <el-form-item label="推荐">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.recommend">
          推荐后将显示在首页
        </el-checkbox>
      </el-form-item>
      <el-form-item label="推荐到期时间" v-if="form.recommend===1">
        <el-date-picker
          v-model="form.recommend_timeout"
          type="datetime"
          value-format="timestamp"
          placeholder="选择到期时间"
          clearble
          default-time="12:00:00">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="自动下架时间">
        <el-date-picker
          v-model="form.autoend_at"
          type="datetime"
          value-format="timestamp"
          placeholder="选择时间"
          default-time="12:00:00">
        </el-date-picker>
        <p class="text-gray">留空则不自动下架</p>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort" type="number"></el-input>
        <p class="text-gray">数字越大越靠前</p>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="thumbnail">
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
      <el-form-item label="赏金" prop="money">
        <el-input :disabled="form.created_from !== 1" type="number" v-model="form.money" @change="asyncMoney">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" autosize></el-input>
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
        <el-input :disabled="form.created_from !== 1" type="number" v-model="form.quantity"></el-input>
      </el-form-item>
      <el-form-item label="已领数量" prop="grab_quantity">
        <el-input type="number" v-model="form.grab_quantity"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="labels">
        <el-select
          v-model="form.labels"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="输入后按回车键"
        ></el-select>
      </el-form-item>
      <el-form-item label="时间限制" prop="limited_time">
        <el-input type="number" v-model="form.limited_time">
          <template slot="append">分钟</template>
        </el-input>
        <p class="text-gray">输入0则表示不限制时间</p>
      </el-form-item>
      <el-form-item label="审核时间" prop="review_time">
        <el-input type="number" v-model="form.review_time">
          <template slot="append">分钟</template>
        </el-input>
        <p class="text-gray">需在此时间内审核，否则将自动通过</p>
      </el-form-item>
      <el-form-item label="展示端" prop="clients">
        <el-checkbox-group v-model="form.clients">
          <el-checkbox :label="item.id" :key="`client${item.id}`" v-for="item in clients">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="可重复领">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.repeatable">
          开启后用户可以领取多次
        </el-checkbox>
      </el-form-item>
      <el-form-item label="用于简洁模式" v-show="form.created_from === 1">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.for_review">
          仅在小程序开启简洁模式时展示，普通任务不要勾选
        </el-checkbox>
      </el-form-item>
      <el-form-item label="位置">
        {{location.name}}
        <el-button size="small" @click="amapVisible = true">选择</el-button>
      </el-form-item>
      <h2>操作步骤</h2>
      <el-form-item
        class="text-step"
        v-for="(item, index) in form.textStep"
        :label="'步骤 ' + (index+1)"
        :key="`text${index}`">
        <el-input class="step-item" type="textarea" autosize v-model="item.value" placeholder="请输入详细的步骤"></el-input>
        <el-input class="step-item" type="textarea" autosize v-model="item.copyText" placeholder="请输入一键复制的内容"></el-input>
        <div class="image-list">
          <div class="image-item" v-for="(image, imageIndex) in item.images" :key="`${image}.${imageIndex}`">
            <video v-if="isVideo(image)" controls :src="image | getQiniuFullUrl" />
            <img v-else :src="image | getQiniuFullUrl" />
            <div class="image-cover">
              <i class="el-icon-view" @click="preview(image)"></i>
              <i class="el-icon-delete" @click="handleTextStepImageRemove(image, item.images, index, imageIndex)"></i>
            </div>
          </div>
          <el-upload
            class="image-upload"
            :action="uploadUrl"
            :accept="`${accessImage.concat(accessVideo).join(',')}`"
            :before-upload="beforeFileUpload"
            :data="qiniuData"
            :on-success="(res, file)=>{return handleTextStepImageSuccess(res, file, index)}">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <p class="text-gray">支持{{accessImage.concat(accessVideo).join('，')}}格式的文件</p>
        <el-button @click.prevent="removeTextStep(item)" type="text">删除</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="addTextStep" size="small">新增操作步骤</el-button>
      </el-form-item>
      <h2>提审步骤</h2>
      <el-form-item
        v-for="(item, index) in form.reviewStep"
        :label="'步骤 ' + (index+1)"
        :key="`review${item.value}`">
        <div class="step-item">
          <el-input v-model="item.name" type="textarea" placeholder="请输入要求" autosize></el-input>
          <el-input type="textarea" autosize v-model="item.copyText" placeholder="请输入一键复制的内容"></el-input>
        </div>
        <div class="image-list">
          <div class="image-item" v-if="item.value">
            <img :src="item.value | getQiniuFullUrl" />
            <div class="image-cover">
              <i class="el-icon-view" @click="preview(item.value)"></i>
              <i class="el-icon-delete" @click="handleReviewImageRemove(index)"></i>
            </div>
          </div>
          <el-upload
            v-else
            class="image-upload"
            :action="uploadUrl"
            :accept="`${accessImage.join(',')}`"
            :before-upload="beforeFileUpload"
            :data="qiniuData"
            :on-success="(res, file)=>{return handleReviewImageSuccess(res, file, index)}">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <el-button @click.prevent="removeReviewStep(item)" type="text">删除</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="addReviewStep" size="small">新增提审步骤</el-button>
      </el-form-item>
      <h2>提审字段</h2>
      <el-form-item v-for="(item, index) in form.reviewField" :label="'字段 ' + (index+1)" :key="`field${index}`">
        <el-input v-model="item.name" placeholder="请输入字段名"></el-input>
        <el-input v-model="item.placeholder" placeholder="请输入字段填写提示"></el-input>
        <el-button @click.prevent="removeReviewField(item)" type="text">删除</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="addReviewField" size="small">新增提审字段</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="submit">提交</el-button>
        <el-button size="medium" @click="gotoList">取消</el-button>
      </el-form-item>
    </el-form>
    <amap-selector :visible="amapVisible" @close="amapVisible = false" @change="handleLocationChange" />
  </div>
</template>
<script>
import CheckForm from '@/mixins/checkform';
import TasksManageProxy from '@/proxies/tasks';
import CommonProxy from '@/proxies/common';
import { getQiniuFullUrl } from '@/filters';
import AmapSelector from '@/components/business/amap-selector';

export default {
  components: { AmapSelector },
  data() {
    return {
      amapVisible: false,
      location: {
        name: '',
        position: [],
      },
      accessImage: ['.png', '.jpg', '.jpeg'],
      accessVideo: ['.mp4', '.rmvb', '.mpeg', '.avi', '.3gp', '.mov'],
      qiniuData: {
        token: '',
      },
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      uploadUrl: window.API_CONFIG['qiniu_upload'],
      form: {
        sort: 0,
        title: '',
        thumbnail: '',
        money: 1,
        vip_money: 0,
        description: '',
        type: '',
        limited_time: 60,
        review_time: 4320,
        labels: [],
        textStep: [],
        reviewStep: [],
        reviewField: [],
        for_review: 0,
        repeatable: 1,
        removeReviewStepIds: [],
        removeReviewFieldIds: [],
        quantity: 100,
        grab_quantity: 0,
        recommend: 0,
        need_vip: 0,
        created_from: 1,
        created_by: null,
        recommend_timeout: '',
        autoend_at: '',
        clients: ['1', '2', '3', '4'],
      },
      clients: [
        { id: '1', name: '小程序' },
        { id: '2', name: 'H5' },
        { id: '3', name: '安卓' },
        { id: '4', name: 'iOS' },
      ],
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
          { required: true, message: '请上传任务图标', trigger: 'change' },
        ],
        money: [
          { required: true, message: '请输入赏金', trigger: 'change' },
        ],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'change' },
        ],
        grab_quantity: [
          { required: true, message: '请输入已领数量', trigger: 'change' },
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'change' },
        ],
        limited_time: [
          { required: true, message: '请输入时间限制', trigger: 'change' },
        ],
        review_time: [
          { required: true, message: '请输入审核时间', trigger: 'change' },
        ],
        clients: [
          { required: true, message: '请选择展示端', trigger: 'change' },
        ],
      },
    };
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  methods: {
    handleLocationChange(location) {
      this.amapVisible = false;
      this.location = location;
    },
    preview(image) {
      window.open(getQiniuFullUrl(image));
    },
    isVideo(item) {
      const image = item.split('.');
      const length = image.length;
      return length > 1 && this.accessVideo.includes(`.${image[length - 1]}`);
    },
    asyncMoney() {
      this.form.vip_money = this.form.money;
    },
    async getTypes() {
      const res = await TasksManageProxy.getTypes();
      this.types = res.data;
      this.form.type = this.types && this.types.length ? this.types[0].id : '';
    },
    buildImageArray(images) {
      if (images instanceof Array) {
        return images.map(image => ({
          key: image,
          name: image,
          url: getQiniuFullUrl(image),
        }));
      } else {
        return [];
      }
    },
    removeTextStep(item) {
      const index = this.form.textStep.indexOf(item);
      if (index !== -1) {
        this.form.textStep.splice(index, 1);
      }
    },
    removeReviewStep(step) {
      this.form.reviewStep.forEach((item, index) => {
        if (item.key === step.key) {
          this.form.reviewStep.splice(index, 1);
          if (!item.isNew) {
            // 如果是已经存过数据库，则标记此条数据为删除
            this.form.removeReviewStepIds.push(item.key);
          }
        }
      });
    },
    removeReviewField(field) {
      this.form.reviewField.forEach((item, index) => {
        if (item.key === field.key) {
          this.form.reviewField.splice(index, 1);
          if (!item.isNew) {
            // 如果是已经存过数据库，则标记此条数据为删除
            this.form.removeReviewFieldIds.push(item.key);
          }
        }
      });
    },
    addTextStep() {
      this.form.textStep.push({
        value: '',
        copyText: '',
        images: [],
        key: Date.now(),
      });
    },
    addReviewStep() {
      this.form.reviewStep.push({
        value: '',
        copyText: '',
        name: '',
        key: Math.floor(Date.now() / 100),
        isNew: true,
      });
    },
    addReviewField() {
      this.form.reviewField.push({
        placeholder: '',
        name: '',
        key: Math.floor(Date.now() / 100),
        isNew: true,
      });
    },
    gotoList() {
      this.$router.push({
        path: '/tasks/list?nocache=1',
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
        location_name: this.location.position ? this.location.name : '',
        longitude: this.location.position ? this.location.position[0] : null,
        latitude: this.location.position ? this.location.position[1] : null,
      };
      if (!this.isEdit) {
        // 如果是添加，则添加创建者、创建来源字段
        params.created_from = 1;
        params.created_by = this.$storage.getItem('id');
      } else {
        // 记录操作日志
        params.log = {
          client: 1,
          content: `编辑了ID为${this.form.id}的任务`,
        };
      }
      // 如果勾选了推荐，但没选到期时间，则提示
      if (params.recommend && !params.recommend_timeout) {
        this.$notify.error({
          title: '错误',
          message: '请填写推荐到期时间',
        });
        return;
      }
      if (!params.textStep.length) {
        this.$notify.error({
          title: '错误',
          message: '请添加操作步骤',
        });
        return;
      }
      if (!params.reviewStep.length) {
        this.$notify.error({
          title: '错误',
          message: '请添加审核步骤',
        });
        return;
      }
      if (params.reviewField.some(item => !item.name)) {
        this.$notify.error({
          title: '错误',
          message: '请填写提审字段名',
        });
        return;
      }
      const res = await TasksManageProxy[this.isEdit ? 'updateTask' : 'addTask'](params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: '操作成功',
        });
        // 返回列表
        this.gotoList();
      }
    },
    async getDetail(taskId) {
      const res = await TasksManageProxy.getDetail({
        taskId,
      });
      if (!res.fail) {
        this.form = res.data;
        this.location = {
          name: res.data.location_name,
          position: [res.data.longitude, res.data.latitude],
        };
        this.form.removeReviewStepIds = [];
        this.form.removeReviewFieldIds = [];
        this.form.labels = res.data.labels ? res.data.labels.split(',') : [];
        this.form.textStep = res.data.textStep.map((item) => {
          const textStep = {
            value: item.text,
            copyText: item.copy_text,
            key: item.id,
            images: item.images ? item.images.split(',') : [],
          };
          return textStep;
        });
        this.form.reviewStep = res.data.reviewStep.map((item) => {
          const reviewStep = {
            value: item.image,
            copyText: item.copy_text,
            name: item.text,
            key: item.id,
            isNew: false,
          };
          return reviewStep;
        });
        this.$set(this.form, 'clients', res.data.client ? res.data.client.split(',') : []);
        if (Array.isArray(res.data.reviewField)) {
          this.form.reviewField = res.data.reviewField.map((item) => {
            const reviewField = {
              placeholder: item.placeholder,
              name: item.name,
              key: item.id,
              isNew: false,
            };
            return reviewField;
          });
        }
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
    handleReviewImageSuccess(res, file, index) {
      this.form.reviewStep[index].value = res.key;
    },
    handleReviewImageRemove(index) {
      this.form.reviewStep[index].value = '';
    },
    handleTextStepImageRemove(file, fileList, index, imageIndex) {
      fileList.splice(imageIndex, 1);
      this.form.textStep[index].images = fileList;
    },
    handleTextStepImageSuccess(res, file, index) {
      this.form.textStep[index].images.push(res.key);
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
    const taskId = this.$route.params.id;
    if (taskId) {
      this.getDetail(taskId);
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
  .task-form {
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
