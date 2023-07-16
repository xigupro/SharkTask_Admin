<template>
  <div
    class="xg-main withdraw-page"
    v-loading="isListLoading">
    <div class="filter">
      <router-link :to="{name: 'finance.stream'}">
        <el-button
          v-if="$tools.checkAdminPower('finance', 'stream')"
          size="medium"
          type="primary">金额流水</el-button>
      </router-link>
    </div>
    <div class="filter">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="用户ID" v-model="searchForm.user_id" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="姓名" v-model="searchForm.truename" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="提现账号" v-model="searchForm.withdrawAccount" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.withdrawDateRange"
            type="datetimerange"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="提交开始日期"
            end-placeholder="提交结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" clearable placeholder="状态"  @change="search" class="form-item">
            <el-option
              v-for="item in status"
              :key="`status${item.value}`"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain type="primary" @click="search()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item v-if="$tools.checkAdminPower('finance', 'exportWithdraw')">
          <el-button type="success" plain @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="list.length > 0">
      <el-table
        ref="userTable"
        :data="list">
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="user_id"
          key="user_id"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="money"
          label="提现金额">
          <template slot-scope="scope">
            {{scope.row.money}} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          label="手续费率">
          <template slot-scope="scope">
            {{scope.row.commission_ratio}}%
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          width="120px"
          label="实际到账金额">
          <template slot-scope="scope">
            <strong class="text-danger">
              {{(scope.row.money - (scope.row.commission_ratio / 100) * scope.row.money) | fixMoney}}
            </strong>
          </template>
        </el-table-column>
        <el-table-column
          prop="certificate_truename"
          width="120px"
          label="认证真实姓名">
        </el-table-column>
        <el-table-column
          prop="truename"
          width="120px"
          label="提现真实姓名">
        </el-table-column>
        <el-table-column
          prop="withdraw_type"
          key="withdraw_type"
          show-overflow-tooltip
          label="提现方式">
          <template slot-scope="scope">
            {{scope.row.withdraw_type}} {{scope.row.withdraw_remark}}
          </template>
        </el-table-column>
        <el-table-column
          prop="withdraw_account"
          key="withdraw_account"
          show-overflow-tooltip
          width="300px"
          label="提现账号">
          <template slot-scope="scope">
            {{scope.row.withdraw_account}}
            <el-button
              size="mini"
              v-if="scope.row.withdraw_account"
              v-clipboard:copy="scope.row.withdraw_account"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">复制</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="收款二维码"
          width="180">
          <template slot-scope="scope" v-if="scope.row.withdraw_image">
            <el-popover trigger="hover" placement="top">
              <img style="height:300px;" :src="scope.row.withdraw_image | getQiniuFullUrl">
              <div slot="reference">
                <img class="image-mini" :src="scope.row.withdraw_image | getQiniuFullUrl">
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="handle_by"
          key="handle_by"
          label="处理人">
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          label="提交时间"
          show-overflow-tooltip
          width="100px">
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="handle_at"
          key="handle_at"
          show-overflow-tooltip
          label="审核时间"
          width="100px">
          <template slot-scope="scope">
            {{scope.row.handle_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          fixed="right"
          key="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status == 1">提现中</el-tag>
            <el-tag size="small" type="success" v-else-if="scope.row.status == 2">已提现</el-tag>
            <el-tooltip v-else-if="scope.row.status == 3" class="item" effect="dark" :content="scope.row.withdraw_remark" placement="top">
              <el-tag size="small" type="info">已驳回</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="openid"
          fixed="right"
          width="100px"
          key="openid"
          label="已绑定微信">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.openid">是</el-tag>
            <el-tag size="small" v-else>否</el-tag>
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
                  v-if="$tools.checkAdminPower('finance', 'resolve')"
                  class="xg-popover-list__item"
                  :disabled="scope.row.status != 1"
                  @click.native="withdrawResolve(scope.row)">
                  <span class="icon iconfont icon-check-circle"></span>
                  提现通过
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="$tools.checkAdminPower('finance', 'reject')"
                  class="xg-popover-list__item"
                  :disabled="scope.row.status != 1"
                  @click.native="showDialog(scope.row)">
                  <span class="icon iconfont icon-close-circle"></span>
                  驳回
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
        @size-change="getWithdraw"
        @current-change="getWithdraw">
      </el-pagination>
    </div>
    <el-dialog title="驳回" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="max-width:500px">
        <el-form-item label="理由" label-width="120px">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="withdrawReject">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import PAGECONFIG from '@/constants/pagination';
import WithdrawManageProxy from '@/proxies/withdraw';

export default {
  name: 'withdraw-list',
  data() {
    return {
      searchForm: {},
      status: [
        {
          label: '提现中',
          value: 1,
        }, {
          label: '已提现',
          value: 2,
        }, {
          label: '已驳回',
          value: 3,
        },
      ],
      form: {
        id: null,
        remark: '',
        userId: null,
        taskId: null,
      },
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
    };
  },
  computed: {
    showNoRecord() {
      // 列表为空，且不是正在加载中
      return this.list.length < 1 && !this.isListLoading;
    },
    handleBy() {
      return localStorage.getItem('username');
    },
  },
  methods: {
    async exportData() {
      const res = await WithdrawManageProxy.exportAll(this.searchForm);
      if (res.success) {
        window.open(`${window.API_CONFIG['app']}${res.data}`);
      }
    },
    reset() {
      this.searchForm = {};
      this.getWithdraw();
    },
    search() {
      this.page = 1;
      this.getWithdraw();
    },
    onCopy() {
      this.$notify.success({
        title: '成功',
        message: '复制成功',
      });
    },
    onError() {
      this.$notify.error({
        title: '错误',
        message: '复制失败',
      });
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.form.id = row.id;
      this.form.userId = row.user_id;
      this.form.taskId = row.task_id;
    },
    // 获取列表
    async getWithdraw() {
      const params = {
        page: this.page,
        size: this.size,
        ...this.searchForm,
      };
      this.isListLoading = true;
      const res = await WithdrawManageProxy.getWithdraw(params);
      setTimeout(() => {
        this.isListLoading = false;
      }, 600);
      if (res.success) {
        this.list = res.data.list;
        this.totalRecordCount = res.data.totalCount;
      }
    },
    async withdrawResolve(row) {
      const params = {
        id: row.id,
        userId: row.user_id,
        openid: row.openid,
        openid_type: row.openid_type,
        handleBy: this.handleBy,
        money: row.money - ((row.commission_ratio / 100) * row.money),
      };
      const tips = row.withdraw_type === '支付宝'
        ? '如果开启了企业付款到支付宝，审核通过将自动打款给用户，是否确认？'
        : '如果开启了企业付款到微信，审核通过将自动打款给用户，是否确认？';
      this.$confirm(
        row.openid || row.withdraw_account
        ? tips
        : '请确保已经扫码打款给用户，是否确认？',
        '审核通过',
      ).then(async () => {
        const method = row.withdraw_type === '支付宝' ? 'withdrawResolveByAlipay' : 'withdrawResolve';
        const res = await WithdrawManageProxy[method](params);
        if (!res.fail) {
          this.$notify.success({
            title: '成功',
            message: res.message,
          });
          // 刷新列表
          this.getWithdraw();
        }
      });
    },
    async withdrawReject() {
      this.form.handleBy = this.handleBy;
      const res = await WithdrawManageProxy.withdrawReject(this.form);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getWithdraw();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getWithdraw();
  },
};
</script>
<style lang="scss">
.withdraw-page {
  width: 100%;
  .image-mini {
    height: 50px;
    width: auto;
  }
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
}
</style>
