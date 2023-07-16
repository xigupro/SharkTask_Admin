<template>
  <div
    class="xg-main message-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button
        v-if="$tools.checkAdminPower('entries', 'add')"
        size="medium"
        type="primary"
        @click="addMessage">添加公告</el-button>
    </div>
    <div
      v-show="list.length > 0"
      class="xg-user__list">
      <el-table
        ref="userTable"
        :data="list">
        <el-table-column
          prop="title"
          show-overflow-tooltip
          label="标题">
        </el-table-column>
        <el-table-column
          prop="content"
          show-overflow-tooltip
          label="内容">
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
          width="150px"
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
      <el-pagination
        v-if="totalRecordCount > 0"
        background
        :layout="pageconf.simpleLayout"
        :page-sizes="pageconf.sizes"
        :page-size.sync="size"
        :current-page.sync="page"
        :total="totalRecordCount"
        @size-change="getNoticeList"
        @current-change="getNoticeList">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit ? '更新公告' : '添加公告'" :visible.sync="dialogFormVisible" :destroy-on-close="true" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" style="max-width:500px" label-width="120px">
        <el-form-item label="公告标题">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content" autocomplete="off"></el-input>
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
import PAGECONFIG from '@/constants/pagination';
import MessageProxy from '@/proxies/message';
import CheckForm from '@/mixins/checkform';

export default {
  name: 'entry-list',
  data() {
    return {
      form: {
        title: '',
        content: '',
      },
      isEdit: false,
      dialogFormVisible: false,
      // 列表
      list: [],
      isListLoading: false,
      // 总条数
      totalRecordCount: 0,
      // 翻页数据
      pageconf: PAGECONFIG,
      // 当前页码
      page: PAGECONFIG.defaultPage,
      // 页容量
      size: 10,
      rules: {
        sort: [
          { type: Number, message: '请输入正确的排序值', trigger: 'blur' },
        ],
        title: [
          { max: 32, message: '最多输入32个字符', trigger: 'blur' },
        ],
        content: [
          { max: 10000, message: '最多输入10000个字符', trigger: 'blur' },
        ],
      },
    };
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  computed: {
    showNoRecord() {
      // 列表为空，且不是正在加载中
      return this.list.length < 1 && !this.isListLoading;
    },
  },
  methods: {
    addMessage() {
      this.isEdit = false;
      this.form = {
        title: '',
        content: '',
      };
      this.showDialog();
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    // 获取列表
    async getNoticeList() {
      this.isListLoading = true;
      const params = {
        page: this.page,
        size: this.size,
        type: 7,
      };
      const res = await MessageProxy.getNoticeList(params);
      setTimeout(() => {
        this.isListLoading = false;
      }, 600);
      if (res.success) {
        this.list = res.data.list;
        this.totalRecordCount = res.data.totalCount;
      }
    },
    getDetail(detail) {
      this.form.id = detail.id;
      this.form.title = detail.title;
      this.form.content = detail.content;
      this.isEdit = true;
      this.showDialog();
    },
    async submit() {
      // 未通过校验
      if (!this.CheckForm('form')) {
        return;
      }
      const res = await MessageProxy[this.isEdit ? 'updateNotice' : 'addNotice'](this.form);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getNoticeList();
        this.dialogFormVisible = false;
      }
    },
    // 删除
    removeConfirm(id) {
      this.showPopover = false;
      this.$confirm(
        '确定要删除这个公告吗？',
        '删除公告',
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
        // 记录操作日志
        log: {
          client: 1,
          content: `删除了ID为${id}的公告`,
        },
      };
      const res = await MessageProxy.remove(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getNoticeList();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getNoticeList();
  },
};
</script>
<style lang="scss">
.message-page {
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
