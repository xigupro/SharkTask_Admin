<template>
  <div class="xg-main help-form">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
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
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <div id="editor"></div>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="submit">提交</el-button>
        <el-button size="medium" @click="gotoList">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import WangEditor from 'wangeditor';
import CheckForm from '@/mixins/checkform';
import HelpProxy from '@/proxies/help';
import CommonProxy from '@/proxies/common';

export default {
  data() {
    return {
      qiniuData: {
        token: '',
      },
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      uploadUrl: window.API_CONFIG['qiniu_upload'],
      form: {
        title: '',
        content: '',
        type: '',
      },
      types: [],
      isEdit: false,
      editor: null,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'change' },
          { max: 1024, message: '标题字数不能大于1024', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'change' },
        ],
      },
    };
  },
  mounted() {
    this.initWangEditor();
  },
  beforeDestroy() {
    this.editor.destroy();
    this.editor = null;
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  methods: {
    initWangEditor() {
      const editor = new WangEditor('#editor');
      editor.config.zIndex = 999;
      editor.config.uploadImgServer = this.uploadUrl;
      editor.config.uploadImgParams = this.qiniuData;
      editor.config.uploadImgMaxLength = 1;
      editor.config.showLinkImg = false;
      editor.config.uploadFileName = 'file';
      editor.config.qiniu = true;
      editor.config.customAlert = (s, t) => {
        if (s !== '插入图片错误') {
          this.$notify[t]({ message: s });
        }
      };
      editor.config.uploadImgHooks = {
        success: (res) => {
          console.info(res);
        },
        fail: (err) => {
          console.info(err);
          this.$notify.error({
            title: '错误',
            message: '上传失败',
          });
        },
        customInsert: (insertImgFn, result) => {
          insertImgFn(`${window.API_CONFIG['qiniu_download']}${result.key}`);
        },
      };
      editor.config.onchange = (newHtml) => {
        this.form.content = newHtml;
      };
      editor.create();
      this.editor = editor;
    },
    async getHelpTypeList() {
      const res = await HelpProxy.typeList();
      this.types = res.data;
    },
    gotoList() {
      this.$router.push({
        path: '/help/list?nocache=1',
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
      const res = await HelpProxy[this.isEdit ? 'update' : 'add'](params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: '操作成功',
        });
        // 返回列表
        this.gotoList();
      }
    },
    async getDetail(articleId) {
      const res = await HelpProxy.detail({
        id: articleId,
      });
      if (!res.fail) {
        this.form = res.data;
        this.editor.txt.html(res.data.content);
      }
    },
    async getQiniuToken() {
      const res = await CommonProxy.getQiniuUploadToken();
      if (res.success) {
        this.qiniuData.token = res.data.uptoken;
      }
    },
  },
  created() {
    this.getQiniuToken();
    this.getHelpTypeList();
    const articleId = this.$route.params.id;
    if (articleId) {
      this.getDetail(articleId);
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
  .help-form {
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
