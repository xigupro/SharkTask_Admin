<template>
  <div
    class="xg-main refresh-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button
        v-if="$tools.checkAdminPower('tasks', 'addPrice')"
        size="medium"
        type="primary"
        @click="showDialog">添加刷新套餐</el-button>
      用户购买刷新次数后，可用来刷新自己发布的任务，以达到暂时提升排名的效果。
    </div>
    <div
      v-show="list.length > 0"
      class="xg-user__list">
      <el-table
        ref="userTable"
        :data="list"
        >
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="count"
          label="次数">
        </el-table-column>
        <el-table-column
          prop="price"
          key="price"
          label="价格">
          <template slot-scope="scope">
            {{scope.row.price}}元
          </template>
        </el-table-column>
        <el-table-column
          prop="original_price"
          key="original_price"
          label="原价">
          <template slot-scope="scope">
            {{scope.row.original_price}}元
          </template>
        </el-table-column>
        <el-table-column
          prop="is_show"
          key="is_show"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_show == 1">显示</el-tag>
            <el-tag v-else type="info">隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          width="200px"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          key="updated_at"
          width="200px"
          show-overflow-tooltip
          label="更新时间">
          <template slot-scope="scope">
            {{scope.row.updated_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
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
                    v-if="$tools.checkAdminPower('tasks', 'editPrice')"
                    class="xg-popover-list__item"
                    @click.native="edit(scope.row)">
                    <span class="icon iconfont icon-edit-square"></span>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('tasks', 'deletePrice')"
                    class="xg-popover-list__item"
                    @click.native="remove(scope.row.id)">
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
        @size-change="getList"
        @current-change="getList">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit ? '编辑': '添加'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" style="max-width:500px" label-width="120px">
        <el-form-item label="次数" prop="count">
          <el-input v-model="form.count" type="number"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="原价" prop="original_price">
          <el-input v-model="form.original_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="显示" prop="is_show">
          <el-switch :active-value="1" :inactive-value="0" v-model="form.is_show"></el-switch>
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
import CheckForm from '@/mixins/checkform';
import PAGECONFIG from '@/constants/pagination';
import RefreshProxy from '@/proxies/refresh';

export default {
  name: 'refresh-list',
  data() {
    return {
      form: {
        count: null,
        price: null,
        original_price: null,
        is_show: 1,
      },
      dialogFormVisible: false,
      isEdit: false,
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
        count: [
          { required: true, message: '请输入刷新次数', trigger: 'change' },
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'change' },
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
    handleBy() {
      return localStorage.getItem('username');
    },
    role() {
      return localStorage.getItem('role');
    },
    id() {
      return localStorage.getItem('id');
    },
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    edit(data) {
      this.showDialog();
      this.isEdit = true;
      this.form.count = data.count;
      this.form.price = data.price;
      this.form.original_price = data.original_price;
      this.form.is_show = data.is_show;
      this.form.id = data.id;
    },
    // 获取列表
    async getList() {
      const params = {
        page: this.page,
        size: this.size,
      };
      this.isListLoading = true;
      this.list = [];
      try {
        const {
          data: { list, totalCount },
        } = await RefreshProxy.list(params);
        this.list = list;
        this.totalRecordCount = totalCount;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$notify.error({
          title: '错误',
          message: '获取管理员列表出错',
        });
      }
    },
    async submit() {
      // 未通过校验
      if (!this.CheckForm('form')) {
        return;
      }
      const res = await RefreshProxy[this.isEdit ? 'update' : 'add'](this.form);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getList();
        this.dialogFormVisible = false;
        this.isEdit = false;
      }
    },
    async remove(id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const params = {
          id,
        };
        const res = await RefreshProxy.remove(params);
        if (!res.fail) {
          this.$notify.success({
            title: '成功',
            message: res.message,
          });
          // 刷新列表
          this.getList();
          this.dialogFormVisible = false;
        }
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style lang="scss">
.refresh-page {
  .main-header {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
  }
}
</style>
