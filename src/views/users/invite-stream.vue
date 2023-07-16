<template>
  <div
    class="xg-main invite-stream-page"
    v-loading="isListLoading">
    <div class="filter">
      <div class="info">{{nickName}} 的邀请奖励流水</div>
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="searchForm.type" placeholder="请选择类型">
            <el-option
              v-for="(key, value) in types"
              :key="`types${key}`"
              :label="key"
              :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
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
          prop="inviter"
          label="邀请人ID">
        </el-table-column>
        <el-table-column
          prop="task_id"
          label="任务ID">
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="award"
          label="奖金">
          <template slot-scope="scope">
            {{scope.row.award}}元
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
          <template slot-scope="scope">
            {{types[scope.row.type]}}
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
      </el-table>
      <el-pagination
        v-if="totalRecordCount > 0"
        background
        :layout="pageconf.simpleLayout"
        :page-sizes="pageconf.sizes"
        :page-size.sync="size"
        :current-page.sync="page"
        :total="totalRecordCount"
        @size-change="getStream"
        @current-change="getStream">
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
  name: 'invite-stream-list',
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
      types: {
        1: '任务奖励',
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
      this.getStream();
    },
    search() {
      this.page = 1;
      this.size = 10;
      this.getStream();
    },
    // 获取列表
    async getStream() {
      const params = {
        page: this.page,
        size: this.size,
        type: this.searchForm.type,
        userId: this.$route.query.id,
      };
      this.isListLoading = true;
      this.list = [];
      const res = await UserProxy.getInviteStream(params);
      this.isListLoading = false;
      if (!res.fail) {
        this.list = res.data.list;
        this.totalRecordCount = res.data.totalCount;
      }
    },
  },
  created() {
    this.getStream();
  },
};
</script>
<style lang="scss">
.invite-stream-page {
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
