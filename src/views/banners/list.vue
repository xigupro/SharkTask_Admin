<template>
  <div
    class="xg-main banner-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button
        v-if="$tools.checkAdminPower('banners', 'add')"
        size="medium"
        type="primary"
        @click="addBanner">添加轮播图</el-button>
    </div>
    <div
      v-show="list.length > 0"
      class="xg-user__list">
      <el-table
        ref="userTable"
        :data="list"
        >
        <el-table-column
          prop="image"
          key="image"
          label="图片">
          <template slot-scope="scope">
            <img style="height: 60px;max-width:100%" :src="scope.row.image | getQiniuFullUrl">
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="展示位置">
          <template slot-scope="scope">
            {{typeMap.find(item => item.value === scope.row.type).label}}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          show-overflow-tooltip
          label="跳转页面">
        </el-table-column>
        <el-table-column
          prop="client"
          label="展示端">
          <template slot-scope="scope">
            {{scope.row.client | transformClientName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          key="updated_at"
          label="更新时间">
          <template slot-scope="scope">
            {{scope.row.updated_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
              <el-dropdown
                trigger="click"
                placement="bottom">
                <span class="el-dropdown-link">
                  <span class="icon iconfont icon-ellipsis"></span>
                </span>
                <el-dropdown-menu
                  slot="dropdown"
                  class="xg-popover-list">
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('banners', 'edit')"
                    class="xg-popover-list__item"
                    @click.native="getDetail(scope.row)">
                    <span class="icon iconfont icon-edit-square"></span>
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('banners', 'delete')"
                    class="xg-popover-list__item"
                    @click.native="removeBanner(scope.row.id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="isEdit ? '更新轮播' : '添加轮播'" :visible.sync="dialogFormVisible" :destroy-on-close="true" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" style="max-width:500px" label-width="120px">
        <el-form-item label="展示位置" required>
          <el-radio v-for="(item, index) in typeMap" :key="index" v-model="form.type" :label="item.value">{{item.label}}</el-radio>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            drag
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :on-error="handleError"
            :before-upload="beforeImageUpload"
            :data="qiniuData">
            <img v-if="form.image" :src="form.image | getQiniuFullUrl">
            <div v-else class="el-default">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </div>
            <div class="el-upload__tip" slot="tip">{{imageUploadTips}}</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="展示端" prop="client">
          <el-checkbox-group v-model="form.client" @change="cleanSelectedPage">
            <el-checkbox :label="key" v-for="(val, key) in clientMap" :key="key">{{val}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="跳转页面" prop="title">
          <el-select v-model="form.selectedPage" value-key="name" placeholder="请选择">
            <el-option
              v-for="item in pages"
              :key="item.name"
              :disabled="form.client.includes('1') && item.type !== 1"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          <el-input class="param" v-if="form.selectedPage && form.selectedPage.params" :placeholder="`请输入${form.selectedPage.params.name}`" v-model="form.selectedPage.params.value" autocomplete="off"></el-input>
          <el-input class="param" v-if="form.selectedPage && form.selectedPage.type ===3" v-model="form.url" autocomplete="off" placeholder="请输入完整的链接"></el-input>
          <div class="text-gray">小程序端暂不支持多游和自定义</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import ClientPages from '@/constants/pages';
import CommonProxy from '@/proxies/common';
import BannersProxy from '@/proxies/banners';
import Clients from '@/constants/clients';
import CheckForm from '@/mixins/checkform';

export default {
  name: 'banner-list',
  data() {
    return {
      clientMap: Clients,
      typeMap: [{
        value: 1,
        label: '首页主轮播',
        tips: '只能上传jpg/png文件，且不超过5MB，建议宽高比例 9:4',
      }, {
        value: 2,
        label: '首页副轮播',
        tips: '只能上传jpg/png文件，且不超过5MB，建议宽高比例 4.5:1',
      }, {
        value: 3,
        label: '个人中心',
        tips: '只能上传jpg/png文件，且不超过5MB，建议宽高比例 4.5:1',
      }],
      qiniuData: {
        token: '',
      },
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      uploadUrl: window.API_CONFIG['qiniu_upload'],
      form: {
        client: ['1'],
        type: 1,
        image: '',
        title: '',
        url: '',
        mpUrl: '',
        createdBy: this.$storage.getItem('username'),
        selectedPage: null,
      },
      dialogFormVisible: false,
      // 列表
      list: [],
      isListLoading: false,
      isEdit: false,
      pages: ClientPages,
      rules: {
        image: [
          { required: true, message: '请上传轮播图', trigger: 'change' },
        ],
        client: [
          { required: true, message: '请选择展示端', trigger: 'change' },
        ],
        title: [
          { required: true, message: '请选择跳转页面', trigger: 'change' },
        ],
      },
    };
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  watch: {
    'form.selectedPage': {
      handler(val) {
        if (val) {
          let url = '';
          let mpUrl = '';
          if (val.params) {
            if (val.params.type === 'param') {
              url = `${val.h5}/${val.params.value}`;
            } else {
              url = `${val.h5}?${val.params.key}=${val.params.value}`;
            }
            mpUrl = `${val.mp}?${val.params.key}=${val.params.value}`;
          } else {
            url = val.h5;
            mpUrl = val.mp;
          }
          this.form.url = url;
          this.form.mpUrl = mpUrl;
          this.form.title = val.name;
        }
      },
      deep: true,
    },
  },
  computed: {
    showNoRecord() {
      // 列表为空，且不是正在加载中
      return this.list.length < 1 && !this.isListLoading;
    },
    handleBy() {
      return localStorage.getItem('username');
    },
    imageUploadTips() {
      return this.typeMap.find(item => item.value === this.form.type).tips;
    },
  },
  methods: {
    cleanSelectedPage() {
      this.form.selectedPage = null;
      this.form.url = '';
      this.form.mpUrl = '';
    },
    handleImageSuccess(res) {
      this.form.image = res.key;
    },
    handleError() {
      this.$notify.error({
        title: '错误',
        message: '上传失败',
      });
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt5M = file.size / 1024 < 5120;
      let result = true;
      if (!isJPG && !isPNG) {
        this.$notify.error({
          title: '错误',
          message: '只能上传JPG/PNG格式的图片',
        });
        result = false;
      }
      if (!isLt5M) {
        this.$notify.error({
          title: '错误',
          message: '图片大小不能超过5mb',
        });
        result = false;
      }
      return result;
    },
    addBanner() {
      this.isEdit = false;
      this.form = {
        client: ['1'],
        image: '',
        type: 1,
        title: '',
        url: '',
        mpUrl: '',
        createdBy: this.$storage.getItem('username'),
        selectedPage: null,
      };
      this.showDialog();
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    // 获取列表
    async getBanners() {
      this.isListLoading = true;
      const params = {
        client: '',
      };
      const res = await BannersProxy.getBanners(params);
      this.isListLoading = false;
      if (res.success) {
        this.list = res.data;
      }
    },
    async submit() {
      // 未通过校验
      if (!this.CheckForm('form')) {
        return;
      }
      const res = await BannersProxy[this.isEdit ? 'updateBanner' : 'addBanner'](this.form);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getBanners();
        this.dialogFormVisible = false;
      }
    },
    getDetail(detail) {
      this.form.id = detail.id;
      this.form.client = detail.client.split(',');
      this.form.title = detail.title;
      this.form.type = detail.type;
      this.form.image = detail.image;
      this.form.url = detail.url;
      this.form.mpUrl = detail.mpUrl;
      this.form.selectedPage = this.pages.find(item => item.h5 === detail.url);
      this.isEdit = true;
      this.showDialog();
    },
    async removeBanner(id) {
      const params = {
        id,
      };
      const res = await BannersProxy.removeBanner(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getBanners();
        this.dialogFormVisible = false;
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
    this.getBanners();
  },
};
</script>
<style lang="scss">
.banner-page {
  .main-header {
    margin: 15px 0;
  }
  .el-upload-dragger {
    img {
      max-height: 180px;
      width: 100%;
    }
  }
  .param {
    width: 170px;
    float: right;
  }
}
</style>
