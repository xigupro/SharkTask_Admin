<template>
  <div
    class="xg-main log-list-page"
    v-loading="isListLoading">
    <div class="filter">
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="内容" v-model="searchForm.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="操作人" v-model="searchForm.user" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.createDateRange"
            type="datetimerange"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button plain type="primary" @click="search(searchForm)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
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
          prop="user"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="操作IP">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容">
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          label="操作时间">
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
        @size-change="getLogList"
        @current-change="getLogList">
      </el-pagination>
    </div>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import PAGECONFIG from '@/constants/pagination';
import AdministratorsManageProxy from '@/proxies/administrators';

export default {
  name: 'system-list',
  data() {
    return {
      searchForm: {},
      clientMap: {
        1: '后台管理',
        2: '微信小程序',
        3: 'H5',
        4: '安卓',
        5: 'iOS',
      },
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
  },
  methods: {
    reset() {
      this.searchForm = {};
      this.getLogList();
    },
    search(params) {
      this.page = 1;
      this.getLogList(params);
    },
    // 获取列表
    async getLogList() {
      const params = {
        page: this.page,
        size: this.size,
        ...this.searchForm,
      };
      this.isListLoading = true;
      const res = await AdministratorsManageProxy.getLogList(params);
      setTimeout(() => {
        this.isListLoading = false;
      }, 600);
      if (res.success) {
        this.list = res.data.list;
        this.totalRecordCount = res.data.totalCount;
      }
    },
  },
  created() {
    this.getLogList();
  },
};
</script>
<style lang="scss">
.log-list-page {
  .filter {
    margin: 20px 0;
    .el-form-item {
      margin-bottom: 0;
      &:last-child {
        margin-right: 0;
      }
      .form-item {
        width: 120px;
      }
    }
  }
}
</style>
