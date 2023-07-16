<template>
  <div
    class="xg-main invited-page"
    v-loading="isListLoading">
    <div class="filter">
      {{nickName}} 总共邀请了 <strong>{{totalRecordCount}}</strong> 位用户
    </div>
    <div
      v-show="list.length > 0"
      class="list">
      <el-table
        ref="userTable"
        :data="list"
        >
        <el-table-column
          fixed
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          fixed
          prop="nick_name"
          show-overflow-tooltip
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="avatar"
          key="avatar"
          label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" style="width:30px">
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
          width="250px"
          show-overflow-tooltip
          label="地区">
          <template slot-scope="scope">
            {{scope.row.country}}/{{scope.row.province}}/{{scope.row.city}}
          </template>
        </el-table-column>
        <el-table-column
          prop="account_amount"
          key="account_amount"
          label="总余额">
          <template slot-scope="scope">
            {{scope.row.account_amount}} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="withdraw_amount"
          key="withdraw_amount"
          label="提现中">
          <template slot-scope="scope">
            {{scope.row.withdraw_amount}} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="finished_amount"
          key="finished_amount"
          label="已提现">
          <template slot-scope="scope">
            {{scope.row.finished_amount}} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          label="创建时间"
          show-overflow-tooltip>
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
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.status == 1">正常</el-tag>
            <el-tag size="small" type="info" v-else>冻结</el-tag>
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
        @size-change="getInvitedUsers"
        @current-change="getInvitedUsers">
      </el-pagination>
    </div>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import PAGECONFIG from '@/constants/pagination';
import UsersProxy from '@/proxies/users';
import checkFuncAuth from '@/mixins/checkFuncAuth';

export default {
  name: 'user-list',
  data() {
    return {
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
    nickName() {
      return this.$route.query.nick_name;
    },
  },
  mixins: [
    // 判断功能权限
    checkFuncAuth,
  ],
  methods: {
    // 获取列表
    async getInvitedUsers() {
      const params = {
        page: this.page,
        size: this.size,
        userId: this.$route.query.id,
      };
      this.isListLoading = true;
      this.list = [];
      try {
        const {
          data: { list, totalCount },
        } = await UsersProxy.getInvitedUsers(params);
        this.list = list;
        this.totalRecordCount = totalCount;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$notify.error({
          title: '错误',
          message: '获取用户列表出错',
        });
      }
    },
  },
  created() {
    this.getInvitedUsers();
  },
};
</script>
<style lang="scss">
.invited-page {
  width: 100%;
  .filter {
    margin: 20px 0;
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
