<template>
  <div
    class="xg-main system-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button
        v-if="$tools.checkAdminPower('tasks', 'addType')"
        type="primary"
        @click="showDialog">添加分类</el-button>
    </div>
    <div
      v-show="list.length > 0"
      class="xg-type__list">
      <el-table
        ref="typeTable"
        :data="list"
        >
         <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="分类名">
        </el-table-column>
        <el-table-column
          prop="review_name"
          label="简洁模式分类名">
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
                    v-if="$tools.checkAdminPower('tasks', 'editType')"
                    class="xg-popover-list__item"
                    @click.native="edit(scope.row)">
                    <span class="icon iconfont icon-edit-square"></span>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('tasks', 'deleteType')"
                    class="xg-popover-list__item"
                    @click.native="removeType(scope.row.id)">
                    <span class="icon iconfont icon-delete"></span>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="isEdit ? '编辑分类': '添加分类'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" style="max-width:500px" label-width="120px">
        <el-form-item label="分类名" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简洁模式分类名" prop="review_name">
          <el-input v-model="form.review_name" autocomplete="off"></el-input>
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
import TasksManageProxy from '@/proxies/tasks';

export default {
  name: 'type-list',
  data() {
    return {
      form: {
        name: '',
        review_name: '',
      },
      dialogFormVisible: false,
      isEdit: false,
      // 列表
      list: [],
      isListLoading: false,
      rules: {
        name: [
          { required: true, message: '请输入分类名', trigger: 'change' },
        ],
        review_name: [
          { required: true, message: '请输入简洁模式分类名', trigger: 'change' },
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
    showDialog() {
      this.dialogFormVisible = true;
    },
    edit(data) {
      this.showDialog();
      this.isEdit = true;
      this.form.name = data.name;
      this.form.review_name = data.review_name;
      this.form.id = data.id;
    },
    // 获取列表
    async getTypes() {
      this.isListLoading = true;
      this.list = [];
      const res = await TasksManageProxy.getTypes();
      this.list = res.data;
      this.isListLoading = false;
    },
    async submit() {
      // 未通过校验
      if (!this.CheckForm('form')) {
        return;
      }
      const res = await TasksManageProxy[this.isEdit ? 'updateType' : 'addType'](this.form);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getTypes();
        this.dialogFormVisible = false;
        this.isEdit = false;
      }
    },
    async removeType(id) {
      const params = {
        id,
      };
      const res = await TasksManageProxy.removeType(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getTypes();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getTypes();
  },
};
</script>
<style lang="scss">
.system-page {
  .main-header {
    margin: 20px 0;
  }
}
</style>
