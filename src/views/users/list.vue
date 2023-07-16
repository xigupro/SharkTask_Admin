<template>
  <div
    class="xg-main user-page">
    <div class="filter">
      <router-link :to="{name: 'user.certifications'}">
        <el-button
          v-if="$tools.checkAdminPower('users', 'certificationReview')"
          type="primary">认证审核</el-button>
      </router-link>
      <router-link :to="{name: 'user.level'}">
        <el-button
          v-if="$tools.checkAdminPower('users', 'userLevel')">用户等级设置</el-button>
      </router-link>
    </div>
    <div class="filter">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="昵称" v-model="searchForm.nickname" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="用户ID" v-model="searchForm.userId" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="用户名" v-model="searchForm.username" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="手机号" v-model="searchForm.phone" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.registerDateRange"
            type="datetimerange"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="注册开始日期"
            end-placeholder="注册结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button plain type="primary" @click="search()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item v-if="$tools.checkAdminPower('users', 'exportUserList')">
          <el-button type="success" plain @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      v-show="list.length > 0"
      class="list">
      <el-table
        ref="userTable"
        @sort-change="handleSortChange"
        :default-sort="searchForm.sort[0]"
        :data="list"
        v-loading="isListLoading"
        >
        <el-table-column
          fixed
          prop="id"
          label="ID"
          width="60px">
        </el-table-column>
        <el-table-column
          prop="username"
          width="150px"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="phone"
          width="150px"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="nick_name"
          width="100px"
          show-overflow-tooltip
          label="微信昵称">
        </el-table-column>
        <el-table-column
          prop="avatar"
          key="avatar"
          label="头像"
          width="100px">
          <template slot-scope="scope">
            <img :src="scope.row.avatar | getQiniuFullUrl" style="width:30px">
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别">
          <template slot-scope="scope">
            {{scope.row.gender == 1 ? '男' : '女'}}
          </template>
        </el-table-column>
        <el-table-column
          key="location"
          width="100px"
          show-overflow-tooltip
          label="位置">
          <template slot-scope="scope">
            {{scope.row.country}}/{{scope.row.province}}/{{scope.row.city}}
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          sortable="custom"
          show-overflow-tooltip
          label="积分"
          width="80px">
        </el-table-column>
        <el-table-column
          prop="account_amount"
          key="account_amount"
          sortable="custom"
          label="总余额"
          width="100px">
          <template slot-scope="scope">
            {{scope.row.account_amount}} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="withdraw_amount"
          key="withdraw_amount"
          label="提现中"
          sortable="custom"
          width="100px">
          <template slot-scope="scope">
            {{scope.row.withdraw_amount}} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="finished_amount"
          key="finished_amount"
          label="已提现"
          sortable="custom"
          width="100px">
          <template slot-scope="scope">
            {{scope.row.finished_amount}} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="task_limit"
          key="task_limit"
          label="可接任务数"
          width="100px">
          <template slot-scope="scope">
            {{scope.row.task_limit < 0 ? '不限制' : scope.row.task_limit}}
          </template>
        </el-table-column>
        <el-table-column
          prop="refresh_count"
          key="refresh_count"
          label="刷新次数"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="inviter"
          key="inviter"
          label="邀请人"
          width="100px">
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          sortable="custom"
          label="注册时间"
          show-overflow-tooltip
          width="100px">
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          width="100px"
          label="等级">
          <template slot-scope="scope">
            <el-tag :type="levelTagMap[scope.row.level]">{{levelList.find(item => item.level === scope.row.level).name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="80px"
          sortable="custom"
          label="状态">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.status == 1">正常</el-tag>
            <el-tag size="small" type="info" v-else>冻结</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_certified"
          width="100px"
          fixed="right"
          sortable="custom"
          label="已认证">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.is_certified == 1">是</el-tag>
            <el-tag size="small" type="info" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right">
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
                    v-if="$tools.checkAdminPower('users', 'inviteList')"
                    class="xg-popover-list__item"
                    @click.native="showInvitedUsers(scope.row)">
                    <span class="icon iconfont icon-team"></span>
                    邀请的用户
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'moneyStream')"
                    class="xg-popover-list__item"
                    @click.native="showUserStream(scope.row)">
                    <span class="icon iconfont icon-audit"></span>
                    金额流水
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'invitationAward')"
                    class="xg-popover-list__item"
                    @click.native="showInviteStream(scope.row)">
                    <span class="icon iconfont icon-trophy"></span>
                    邀请奖励流水
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'scoreStream')"
                    class="xg-popover-list__item"
                    @click.native="showUserScoreStream(scope.row)">
                    <span class="icon iconfont icon-fire"></span>
                    积分流水
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'editUser')"
                    class="xg-popover-list__item"
                    @click.native="showAccountDialog(scope.row)">
                    <span class="icon iconfont icon-user"></span>
                    修改用户
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'recharge')"
                    class="xg-popover-list__item"
                    @click.native="showRechargeDialog(scope.row)">
                    <span class="icon iconfont icon-moneycollect"></span>
                    充值
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'reduce')"
                    class="xg-popover-list__item"
                    @click.native="showReduceDialog(scope.row)">
                    <span class="icon iconfont icon-Batchfolding"></span>
                    扣钱
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'editScore')"
                    class="xg-popover-list__item"
                    @click.native="showScoreDialog(scope.row)">
                    <span class="icon iconfont icon-diff"></span>
                    积分加减
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'freeze')"
                    class="xg-popover-list__item"
                    @click.native="updateUserConfirm('status', scope.row.status == 1 ? 2 : 1, scope.row.id)">
                    <span class="icon iconfont" :class="scope.row.status == 1 ? 'icon-lock' : 'icon-unlock'"></span>
                    {{ scope.row.status == 1 ? '冻结' : '解冻' }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'loginIps')"
                    class="xg-popover-list__item"
                    @click.native="showUserLoginIps(scope.row)">
                    <span class="icon iconfont icon-bulb"></span>
                    登录日志
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
        @size-change="getUserList"
        @current-change="getUserList">
      </el-pagination>
    </div>
    <el-dialog title="修改用户" :visible.sync="dialogAccountFormVisible">
      <el-form style="max-width:500px" ref="accountForm" :rules="rules" :model="accountForm">
        <el-form-item label="用户名" prop="username" label-width="140px">
          <el-input type="text" v-model="accountForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="140px">
          <el-input type="text" show-password v-model="accountForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="剩余可接任务数量" prop="taskLimit" label-width="140px">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-input type="number" v-model="accountForm.taskLimit" autocomplete="off"></el-input>
            </el-col>
            <el-col :span="12">
              <span>设为小于或等于-1则无限制</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="任务刷新次数" prop="refresh_count" label-width="140px">
          <el-input type="text" v-model="accountForm.refresh_count" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" label-width="140px">
          <el-input type="text" v-model="accountForm.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAccountFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="updateUserAccount">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="充值" :visible.sync="dialogRechargeFormVisible">
      <el-form style="max-width:500px" ref="rechargeForm" :rules="rules" :model="rechargeForm">
        <el-form-item label="总余额" label-width="140px">
          {{rechargeForm.account_amount}}元
        </el-form-item>
        <el-form-item label="充值金额" label-width="140px" prop="rechargeMoney">
          <el-input type="number" min="0" v-model="rechargeForm.rechargeMoney" autocomplete="off">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="说明" label-width="140px" prop="money">
          <el-input v-model="rechargeForm.remark" autocomplete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRechargeFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="updateUserAmount">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="扣钱" :visible.sync="dialogReduceFormVisible">
      <el-form style="max-width:500px" ref="reduceForm" :rules="rules" :model="reduceForm">
        <el-form-item label="总余额" label-width="140px">
          {{reduceForm.account_amount}}元
        </el-form-item>
        <el-form-item label="扣取金额" label-width="140px" prop="money">
          <el-input type="number" min="0" v-model="reduceForm.money" autocomplete="off">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="说明" label-width="140px" prop="money">
          <el-input v-model="reduceForm.remark" autocomplete="off">
          </el-input>
          操作之前请与用户充分沟通！
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReduceFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="reduceUserAmount">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="积分" :visible.sync="dialogScoreFormVisible">
      <el-form style="max-width:500px" ref="scoreForm" :rules="rules" :model="scoreForm">
        <el-form-item label="剩余积分" label-width="140px">
          {{scoreForm.score}}
        </el-form-item>
        <el-form-item label="充值积分" label-width="140px" prop="value">
          <el-input type="number" min="0" v-model="scoreForm.value" autocomplete="off">
          </el-input>
          <div class="text-gray">输入负数则扣分</div>
        </el-form-item>
        <el-form-item label="说明" label-width="140px" prop="money">
          <el-input v-model="scoreForm.remark" autocomplete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogScoreFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="updateUserScore">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import CheckForm from '@/mixins/checkform';
import PAGECONFIG from '@/constants/pagination';
import UsersProxy from '@/proxies/users';
import MoneyProxy from '@/proxies/money';
import checkFuncAuth from '@/mixins/checkFuncAuth';

const defaultSort = [{ prop: 'created_at', order: 'descending' }];
export default {
  name: 'user-list',
  data() {
    return {
      levelTagMap: {
        1: 'info',
        2: 'success',
        3: '',
        4: 'warning',
        5: 'danger',
      },
      accountForm: {
        username: '',
        password: '',
        userId: null,
        taskLimit: 0,
        refresh_count: 0,
        phone: '',
      },
      rechargeForm: {
        userId: null,
        rechargeMoney: 0,
        account_amount: 0,
        remark: '',
      },
      reduceForm: {
        userId: null,
        money: 0,
        remark: '',
        account_amount: 0,
      },
      scoreForm: {
        userId: null,
        value: 0,
        score: 0,
        remark: '',
      },
      searchForm: {
        sort: defaultSort,
      },
      dialogAccountFormVisible: false,
      dialogRechargeFormVisible: false,
      dialogReduceFormVisible: false,
      dialogScoreFormVisible: false,
      levelList: [],
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
        taskLimit: [
          { required: true, message: '请输入剩余可接任务数量', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]{6,18}$/, message: '请输入6~18位英文/数字用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        rechargeMoney: [
          { required: true, message: '请输入金额', trigger: 'blur' },
        ],
        phone: [
          { pattern: /^(1[3,4,5,7,8,9])\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    showNoRecord() {
      // 列表为空，且不是正在加载中
      return this.list.length < 1 && !this.isListLoading;
    },
  },
  mixins: [
    // 判断功能权限
    checkFuncAuth,
    // 表单校验
    CheckForm,
  ],
  methods: {
    async getLevelList() {
      const res = await UsersProxy.getLevelList();
      if (res.success) {
        this.levelList = res.data;
      }
    },
    async exportData() {
      const res = await UsersProxy.exportAll(this.searchForm);
      if (res.success) {
        window.open(`${window.API_CONFIG['app']}${res.data}`);
      }
    },
    // 排序
    handleSortChange({ prop, order }) {
      this.searchForm.sort = [{ prop, order }];
      this.getUserList();
    },
    reset() {
      this.searchForm = { sort: defaultSort };
      this.getUserList();
    },
    search() {
      this.page = 1;
      this.getUserList();
    },
    showRechargeDialog(row) {
      this.dialogRechargeFormVisible = true;
      this.rechargeForm.userId = row.id;
      this.rechargeForm.account_amount = row.account_amount;
    },
    showReduceDialog(row) {
      this.dialogReduceFormVisible = true;
      this.reduceForm.userId = row.id;
      this.reduceForm.account_amount = row.account_amount;
    },
    showScoreDialog(row) {
      this.dialogScoreFormVisible = true;
      this.scoreForm.userId = row.id;
      this.scoreForm.score = row.score;
    },
    showAccountDialog(row) {
      this.dialogAccountFormVisible = true;
      this.accountForm.username = row.username;
      this.accountForm.password = row.password;
      this.accountForm.taskLimit = row.task_limit;
      this.accountForm.userId = row.id;
      this.accountForm.refresh_count = row.refresh_count;
      this.accountForm.phone = row.phone;
    },
    // 获取列表
    async getUserList() {
      const params = {
        page: this.page,
        size: this.size,
        ...this.searchForm,
      };
      this.isListLoading = true;
      const res = await UsersProxy.getUserList(params);
      setTimeout(() => {
        this.isListLoading = false;
      }, 600);
      if (res.success) {
        this.list = res.data.list;
        this.totalRecordCount = res.data.totalCount;
      }
    },
    showInvitedUsers(row) {
      this.$router.push({
        path: '/users/invited',
        query: {
          id: row.id,
          nick_name: row.nick_name || row.username,
        },
      });
    },
    showUserStream(row) {
      this.$router.push({
        path: '/users/stream',
        query: {
          id: row.id,
          nick_name: row.nick_name || row.username,
        },
      });
    },
    showInviteStream(row) {
      this.$router.push({
        path: '/users/invite',
        query: {
          id: row.id,
          nick_name: row.nick_name || row.username,
        },
      });
    },
    showUserScoreStream(row) {
      this.$router.push({
        path: '/users/score',
        query: {
          id: row.id,
          nick_name: row.nick_name || row.username,
        },
      });
    },
    showUserLoginIps(row) {
      this.$router.push({
        path: '/users/ips',
        query: {
          id: row.id,
          nick_name: row.nick_name || row.username,
        },
      });
    },
    updateUserConfirm(key, val, id) {
      this.$confirm(
        `${val === 1 ? '解冻后，用户可以正常操作客户端功能' : '冻结后，用户无法操作客户端功能'}`,
        `${val === 1 ? '确认解冻用户?' : '确认冻结用户?'}`,
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          this.updateUserStatus(key, val, id);
        });
    },
    // 更新用户状态
    async updateUserStatus(key, val, id) {
      const params = {
        userId: id,
        [key]: val,
      };
      const res = await UsersProxy.updateUser(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getUserList();
      }
    },
    // 充值
    async updateUserAmount() {
      const { userId, rechargeMoney, remark } = this.rechargeForm;
      const params = {
        userId,
        money: rechargeMoney,
        type: 1,
        remark,
        log: {
          client: 1,
          content: `给ID为${userId}的用户充值了${rechargeMoney}元`,
        },
      };
      const res = await MoneyProxy.add(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getUserList();
        this.dialogRechargeFormVisible = false;
      }
    },
    // 扣钱
    async reduceUserAmount() {
      const params = {
        userId: this.reduceForm.userId,
        money: this.reduceForm.money,
        remark: this.reduceForm.remark,
      };
      const res = await MoneyProxy.reduce(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getUserList();
        this.dialogReduceFormVisible = false;
      }
    },
    // 加减积分
    async updateUserScore() {
      const params = {
        user_id: this.scoreForm.userId,
        score: this.scoreForm.value,
        remark: this.scoreForm.remark || (this.scoreForm.value > 0 ? '平台赠送' : '平台扣除'),
        type: 7,
      };
      const res = await UsersProxy.updateScore(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getUserList();
        this.dialogScoreFormVisible = false;
      }
    },
    async updateUserAccount() {
      // 未通过校验
      if (!this.CheckForm('accountForm')) {
        return;
      }
      const params = {
        ...this.accountForm,
        log: {
          client: 1,
          content: `修改了ID为${this.accountForm.userId}的用户信息`,
        },
      };
      const res = await UsersProxy.updateUser(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getUserList();
        this.dialogAccountFormVisible = false;
      }
    },
  },
  created() {
    this.getLevelList();
    this.getUserList();
  },
};
</script>
<style lang="scss">
.user-page {
  width: 100%;
  .filter {
    margin: 20px 0;
    .el-form-item {
      margin-bottom: 0;
      &:last-child {
        margin-right: 0;
      }
      .form-item {
        width: 110px;
      }
    }
  }
  .list {
    .el-table .cell {
      word-break: keep-all;
    }
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>
