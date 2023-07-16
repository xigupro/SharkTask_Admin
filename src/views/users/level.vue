<template>
  <div
    class="xg-main user-level-page"
    v-loading="isListLoading">
    <div
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
          prop="name"
          label="等级名">
        </el-table-column>
        <el-table-column
          prop="description"
          label="介绍">
        </el-table-column>
        <el-table-column
          prop="task_count"
          key="task_count"
          label="需完成任务数">
        </el-table-column>
        <el-table-column
          prop="money_monthly"
          key="money_monthly"
          label="每月奖金">
          <template slot-scope="scope">
            {{scope.row.money_monthly}}元
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
                    v-if="$tools.checkAdminPower('users', 'editUserLevel')"
                    class="xg-popover-list__item"
                    @click.native="getDetail(scope.row)">
                    <span class="icon iconfont icon-edit-square"></span>
                    修改
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="修改" :visible.sync="dialogFormVisible">
      <el-form ref="form" :rules="rules" :model="form" style="max-width:500px" label-width="120px">
        <el-form-item prop="name" label="等级名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="介绍">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item prop="task_count" label="需完成任务数">
          <el-input type="number" v-model="form.task_count">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="task_limit" label="每日可领任务">
          <el-input type="number" v-model="form.task_limit">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="money_monthly" label="每月奖金">
          <el-input type="number" v-model="form.money_monthly">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="updateLevel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CheckForm from '@/mixins/checkform';
import UsersProxy from '@/proxies/users';

export default {
  name: 'banner-list',
  data() {
    return {
      form: {
        task_count: 0,
        invite_count: 0,
        award_ratio: 0,
        award_ratio_two: 0,
        task_limit: 0,
        money_monthly: 0,
        name: '',
        description: '',
      },
      dialogFormVisible: false,
      list: [],
      isListLoading: false,
      rules: {
        name: [
          { required: true, message: '请输入等级名', trigger: 'change' },
        ],
        description: [
          { required: true, message: '请输入介绍', trigger: 'change' },
        ],
        task_count: [
          { required: true, message: '请输入需完成任务数', trigger: 'change' },
        ],
        task_limit: [
          { required: true, message: '请输入每日可领任务', trigger: 'change' },
        ],
        money_monthly: [
          { required: true, message: '请输入每月奖金', trigger: 'change' },
        ],
      },
    };
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    getDetail(detail) {
      this.form.id = detail.id;
      this.form.name = detail.name;
      this.form.task_count = detail.task_count;
      this.form.invite_count = 0;
      this.form.award_ratio = 0;
      this.form.award_ratio_two = 0;
      this.form.task_limit = detail.task_limit;
      this.form.money_monthly = detail.money_monthly;
      this.form.description = detail.description;
      this.showDialog();
    },
    async getLevelList() {
      this.isListLoading = true;
      const res = await UsersProxy.getLevelList();
      this.isListLoading = false;
      if (res.success) {
        this.list = res.data;
      }
    },
    async updateLevel() {
      // 未通过校验
      if (!this.CheckForm('form')) {
        return;
      }
      const res = await UsersProxy.updateLevel(this.form);
      if (res.success) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getLevelList();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getLevelList();
  },
};
</script>
<style lang="scss">
.user-level-page {
  
}
</style>
