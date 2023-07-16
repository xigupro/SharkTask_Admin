<template>
  <div
    class="xg-main administrator-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button
        v-if="$tools.checkAdminPower('administrators', 'add')"
        size="medium"
        type="primary"
        @click="showDialog">添加管理员</el-button>
      <el-button
        v-if="$tools.checkAdminPower('administrators', 'logs')"
        size="medium"
        @click="go('administrators.logs')">操作日志</el-button>
    </div>
    <div
      v-show="list.length > 0"
      class="xg-user__list">
      <el-table
        ref="userTable"
        :data="list"
        >
        <el-table-column
          fixed
          prop="id"
          label="ID"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="username"
          label="管理员账号">
        </el-table-column>
        <el-table-column
          prop="role"
          key="role"
          label="角色">
          <template slot-scope="scope">
            {{scope.row.role == 1 ? '超管' : '操作员'}}
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
          show-overflow-tooltip
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
                    v-if="(scope.row.role != 1 || role == 1) && $tools.checkAdminPower('administrators', 'edit')"
                    class="xg-popover-list__item"
                    @click.native="edit(scope.row)">
                    <span class="icon iconfont icon-edit-square"></span>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.role != 1 && $tools.checkAdminPower('administrators', 'delete')"
                    class="xg-popover-list__item"
                    @click.native="removeAdmin(scope.row.id)">
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
        @size-change="getAdminList"
        @current-change="getAdminList">
      </el-pagination>
    </div>
    <el-dialog width="80%" :title="isEdit ? '编辑管理员': '添加管理员'" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="账号" prop="username" style="max-width:500px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="max-width:500px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <template v-if="form.role != 1">
            <div class="checkbox-group" v-for="(power, powerIndex) in powerList" :key="power.id">
              <div class="group-header">
                <el-checkbox :indeterminate="isIndeterminate[power.id]" v-model="checkAll[power.id]" @change="(isChecked) => {return handleCheckAllChange(power, isChecked)}">
                {{power.name}}
                </el-checkbox>
              </div>
              <div class="group-body">
                <el-checkbox
                  @change="(isChecked) => {return handleCheckedPowersChange(isChecked, child.id, power, powerIndex)}"
                  v-for="child in power.child"
                  :true-label="'1'"
                  :false-label="'0'"
                  :value="checkedPowers[power.id] ? checkedPowers[power.id][child.id] : '0'"
                  :label="child.id"
                  :key="`${power.id}-${child.id}`">{{child.name}}</el-checkbox>
              </div>
            </div>
          </template>
          <template v-else>
            超级管理员拥有所有权限
          </template>
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
import Power from '@/constants/powers';
import AdministratorsManageProxy from '@/proxies/administrators';

export default {
  name: 'system-list',
  data() {
    return {
      form: {
        username: '',
        password: '',
        role: null,
      },
      checkedPowers: {},
      checkAll: {},
      isIndeterminate: {},
      powerList: Power,
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
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
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
    go(routeName) {
      this.$router.push({
        name: routeName,
      });
    },
    handleCheckAllChange(power, isChecked) {
      power.child.forEach((child) => {
        this.checkedPowers[power.id][child.id] = isChecked ? '1' : '0';
      });
      this.$set(this.isIndeterminate, power.id, false);
    },
    handleCheckedPowersChange(isChecked, child, power, index) {
      this.checkedPowers[power.id][child] = isChecked;
      this.$set(this.checkedPowers[power.id], child, isChecked);
      let checkedCount = 0;
      for (const key in this.checkedPowers[power.id]) {
        if (this.checkedPowers[power.id][key] === '1') {
          checkedCount += 1;
        }
      }
      this.$set(this.checkAll, power.id, checkedCount === this.powerList[index].child.length);
      this.$set(
        this.isIndeterminate,
        power.id,
        checkedCount > 0 && checkedCount < this.powerList[index].child.length,
      );
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    edit(data) {
      this.showDialog();
      this.isEdit = true;
      this.form.username = data.username;
      this.form.password = data.password;
      this.form.role = data.role;
      if (data.powers) {
        this.checkedPowers = JSON.parse(decodeURIComponent(data.powers));
        for (const powerKey in this.checkedPowers) {
          let isCheck = true;
          let checkCount = 0;
          for (const childKey in this.checkedPowers[powerKey]) {
            if (this.checkedPowers[powerKey][childKey] === '0') {
              // 只要有未勾选的，都不是全选
              isCheck = false;
            } else {
              checkCount += 1;
            }
          }
          // 是否全选
          this.$set(this.checkAll, powerKey, isCheck);
          // 是否半选，未全选且选择数量大于0
          this.$set(this.isIndeterminate, powerKey, !isCheck && checkCount > 0);
        }
      }
      this.form.id = data.id;
    },
    // 获取列表
    async getAdminList() {
      const params = {
        page: this.page,
        size: this.size,
      };
      this.isListLoading = true;
      this.list = [];
      try {
        const {
          data: { list, totalCount },
        } = await AdministratorsManageProxy.getAdminList(params);
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
      const params = {
        ...this.form,
        powers: this.checkedPowers,
      };
      const res = await AdministratorsManageProxy[this.isEdit ? 'updateAdmin' : 'addAdmin'](params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getAdminList();
        this.dialogFormVisible = false;
        this.isEdit = false;
      }
    },
    async removeAdmin(id) {
      const params = {
        id,
      };
      const res = await AdministratorsManageProxy.removeAdmin(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getAdminList();
        this.dialogFormVisible = false;
      }
    },
    initCheckedPowers() {
      this.powerList.forEach((item) => {
        this.$set(this.checkedPowers, item.id, {});
        item.child.forEach((child) => {
          this.$set(this.checkedPowers[item.id], child.id, '0');
        });
      });
    },
  },
  created() {
    this.initCheckedPowers();
    this.getAdminList();
  },
};
</script>
<style lang="scss">
.administrator-page {
  .main-header {
    margin: 15px 0;
    .el-form-item:last-child {
      margin-right: 0;
    }
  }
  .checkbox-group {
    margin-bottom: 20px;
    .group-header {
      background-color: aliceblue;
      padding-left: 10px;
    }
    .group-body {
      padding-left: 10px;
    }
  }
}
</style>
