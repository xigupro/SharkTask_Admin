<template>
  <div
    class="xg-main login-ips-page"
    v-loading="isListLoading">
    <div class="filter">
      <div class="info">{{nickName}} 的登录日志</div>
    </div>
    <div
      v-show="list.length > 0"
      class="list">
      <el-table
        ref="streamTable"
        :data="list"
        >
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="ip"
          width="130px"
          label="IP地址">
        </el-table-column>
        <el-table-column
          prop="country"
          label="国家">
        </el-table-column>
        <el-table-column
          prop="region"
          label="省份">
        </el-table-column>
        <el-table-column
          prop="city"
          label="城市">
        </el-table-column>
        <el-table-column
          prop="lon"
          label="经度">
        </el-table-column>
        <el-table-column
          prop="lat"
          label="纬度">
        </el-table-column>
        <el-table-column
          prop="org"
          label="网络运营商">
        </el-table-column>
        <el-table-column
          prop="login_type"
          key="login_type"
          label="登录方式"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.login_type | getLoginType}}
          </template>
        </el-table-column>
        <el-table-column
          prop="login_client"
          key="login_client"
          label="客户端"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.login_client | getCreatedFrom}}
          </template>
        </el-table-column>
        <el-table-column
          prop="device"
          show-overflow-tooltip
          label="设备信息">
        </el-table-column>
        <el-table-column
          prop="login_at"
          key="login_at"
          label="登录时间"
          show-overflow-tooltip
          width="100px">
          <template slot-scope="scope">
            {{scope.row.login_at | transLocalTime}}
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
        @size-change="getLoginIps"
        @current-change="getLoginIps">
      </el-pagination>
    </div>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import PAGECONFIG from '@/constants/pagination';
import UserProxy from '@/proxies/users';

export default {
  name: 'login-ips-list',
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
      searchForm: {
        type: null,
      },
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
  methods: {
    reset() {
      this.searchForm.type = null;
      this.page = 1;
      this.size = 10;
      this.getLoginIps();
    },
    search() {
      this.page = 1;
      this.size = 10;
      this.getLoginIps();
    },
    // 获取列表
    async getLoginIps() {
      const params = {
        page: this.page,
        size: this.size,
        type: this.searchForm.type,
        userId: this.$route.query.id,
      };
      this.isListLoading = true;
      this.list = [];
      const res = await UserProxy.getLoginIps(params);
      this.isListLoading = false;
      if (!res.fail) {
        this.list = res.data.list;
        this.totalRecordCount = res.data.totalCount;
      }
    },
  },
  created() {
    this.getLoginIps();
  },
  activated() {
    this.getLoginIps();
  },
};
</script>
<style lang="scss">
.login-ips-page {
  width: 100%;
  .filter {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-form-item {
      margin-bottom: 0;
      &:last-child {
        margin-right: 0;
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
