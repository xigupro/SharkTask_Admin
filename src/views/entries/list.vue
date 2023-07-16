<template>
  <div
    class="xg-main entry-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button
        v-if="$tools.checkAdminPower('entries', 'add')"
        size="medium"
        type="primary"
        @click="addEntry">添加菜单</el-button>
    </div>
    <div
      v-show="list.length > 0"
      class="xg-user__list">
      <el-table
        ref="userTable"
        :data="list"
        >
        <el-table-column
          prop="sort"
          width="80px"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="icon"
          key="icon"
          label="图标">
          <template slot-scope="scope">
            <img style="height: 40px" :src="scope.row.icon | getQiniuFullUrl">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="菜单名称">
        </el-table-column>
        <el-table-column
          prop="client"
          width="200px"
          label="展示端">
          <template slot-scope="scope">
            {{scope.row.client | transformClientName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="client"
          label="展示位置">
          <template slot-scope="scope">
            {{scope.row.type | transformTypeName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="is_show"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_show">显示</el-tag>
            <el-tag v-else type="info">隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          width="150px"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          key="updated_at"
          width="150px"
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
                    v-if="$tools.checkAdminPower('entries', 'edit')"
                    class="xg-popover-list__item"
                    @click.native="getDetail(scope.row)">
                    <span class="icon iconfont icon-edit-square"></span>
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('entries', 'delete')"
                    class="xg-popover-list__item"
                    @click.native="removeConfirm(scope.row.id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="isEdit ? '更新菜单' : '添加菜单'" :visible.sync="dialogFormVisible" :destroy-on-close="true" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" style="max-width:500px" label-width="120px">
        <el-form-item label="图标">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :on-error="handleError"
            :before-upload="beforeImageUpload"
            :data="qiniuData">
            <img class="thumbnail" v-if="form.icon" :src="form.icon | getQiniuFullUrl">
            <i v-else slot="default" class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="number" v-model="form.sort" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述文案">
          <el-input v-model="form.sub_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字体颜色">
          <el-color-picker v-model="form.font_color"></el-color-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="form.is_show" :label="1">显示</el-radio>
          <el-radio v-model="form.is_show" :label="0">隐藏</el-radio>
        </el-form-item>
        <el-form-item label="展示端" prop="client">
          <el-checkbox-group v-model="form.client" @change="cleanSelectedPage">
            <el-checkbox :label="key" v-for="(val, key) in clientMap" :key="key">{{val}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="展示位置" prop="type">
          <el-checkbox-group v-model="form.type">
            <el-checkbox :label="key" v-for="(val, key) in typeMap" :key="key">{{val}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="跳转页面" prop="selectedPage">
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
          <div class="text-gray">小程序端暂不支持闲玩和自定义</div>
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
import Clients from '@/constants/clients';
import EntriesProxy from '@/proxies/entries';
import CheckForm from '@/mixins/checkform';

const TypeMap = {
  1: '首页',
  2: '发现',
};
export default {
  name: 'entry-list',
  data() {
    return {
      qiniuData: {
        token: '',
      },
      typeMap: TypeMap,
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      uploadUrl: window.API_CONFIG['qiniu_upload'],
      clientMap: Clients,
      form: {
        client: ['1'],
        type: ['1'],
        icon: '',
        sort: 0,
        is_show: 1,
        name: '',
        sub_name: '',
        url: '',
        mpUrl: '',
        font_color: '#333',
        selectedPage: null,
      },
      isEdit: false,
      dialogFormVisible: false,
      // 列表
      list: [],
      isListLoading: false,
      pages: ClientPages,
      rules: {
        client: [
          { required: true, message: '请选择展示端', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择展示位置', trigger: 'change' },
        ],
        name: [
          { max: 5, message: '最多输入5个字符', trigger: 'blur' },
        ],
        sub_name: [
          { max: 15, message: '最多输入15个字符', trigger: 'blur' },
        ],
        selectedPage: [
          { required: true, message: '请选择跳转页面', trigger: 'change' },
        ],
      },
    };
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  filters: {
    transformTypeName(key) {
      if (!key) {
        return '';
      }
      const result = [];
      const keyArray = key.split(',');
      keyArray.forEach((item) => {
        result.push(TypeMap[item]);
      });
      return result.join(',');
    },
  },
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
  },
  methods: {
    cleanSelectedPage() {
      this.form.selectedPage = null;
      this.form.url = '';
      this.form.mpUrl = '';
    },
    handleImageSuccess(res) {
      this.form.icon = res.key;
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
    addEntry() {
      this.isEdit = false;
      this.form = {
        client: ['1'],
        type: ['1'],
        icon: '',
        sort: 0,
        is_show: 1,
        name: '',
        sub_name: '',
        url: '',
        mpUrl: '',
        font_color: '#333',
        selectedPage: null,
      };
      this.showDialog();
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    // 获取列表
    async getList() {
      this.isListLoading = true;
      const params = {
        client: '',
        type: '',
      };
      const res = await EntriesProxy.list(params);
      this.isListLoading = false;
      this.list = res.data;
    },
    getDetail(detail) {
      this.form.id = detail.id;
      this.form.client = detail.client.split(',');
      this.form.type = detail.type ? detail.type.split(',') : ['1'];
      this.form.icon = detail.icon;
      this.form.sort = detail.sort;
      this.form.is_show = detail.is_show;
      this.form.name = detail.name;
      this.form.sub_name = detail.sub_name;
      this.form.url = detail.url;
      this.form.mpUrl = detail.mp_url;
      this.form.font_color = detail.font_color;
      this.form.selectedPage = this.pages.find(item => item.h5 === detail.url);
      this.isEdit = true;
      this.showDialog();
    },
    async submit() {
      // 未通过校验
      if (!this.CheckForm('form')) {
        return;
      }
      const res = await EntriesProxy[this.isEdit ? 'update' : 'add'](this.form);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getList();
        this.dialogFormVisible = false;
      }
    },
    // 删除
    removeConfirm(id) {
      this.showPopover = false;
      this.$confirm(
        '确定要删除这个菜单吗？',
        '删除菜单',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        this.remove(id);
      });
    },
    async remove(id) {
      const params = {
        id,
      };
      const res = await EntriesProxy.remove(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getList();
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
    this.getList();
  },
};
</script>
<style lang="scss">
.entry-page {
  .main-header {
    margin: 15px 0;
    .el-form-item:last-child {
      margin-right: 0;
    }
  }
  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .param {
    width: 170px;
    float: right;
  }
}
</style>
