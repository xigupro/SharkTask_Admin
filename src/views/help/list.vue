<template>
  <div
    class="xg-main help-page"
    v-loading="isListLoading">
    <div class="main-header">
      <el-button
        v-if="$tools.checkAdminPower('help', 'add')"
        size="medium"
        type="primary"
        @click="navigateTo('help.add')">添加帮助文章</el-button>
      <el-button
        size="medium"
        v-if="$tools.checkAdminPower('help', 'type')"
        @click="navigateTo('help.type')">分类管理</el-button>
    </div>
    <div
      v-show="list.length > 0"
      class="xg-user__list">
      <el-table
        ref="userTable"
        :data="list">
        <el-table-column
          prop="title"
          show-overflow-tooltip
          label="标题">
        </el-table-column>
        <el-table-column
          prop="type_name"
          label="类型">
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          width="150px"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          key="updated_at"
          width="150px"
          label="更新时间">
          <template slot-scope="scope">
            {{scope.row.updated_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="150px"
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
                    v-if="$tools.checkAdminPower('help', 'edit')"
                    class="xg-popover-list__item"
                    @click.native="navigateTo('help.edit', scope.row.id)">
                    <span class="icon iconfont icon-edit-square"></span>
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('help', 'delete')"
                    class="xg-popover-list__item"
                    @click.native="removeConfirm(scope.row.id)">
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
        @size-change="getHelpArticleList"
        @current-change="getHelpArticleList">
      </el-pagination>
    </div>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import PAGECONFIG from '@/constants/pagination';
import HelpProxy from '@/proxies/help';

export default {
  name: 'entry-list',
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
  },
  methods: {
    navigateTo(routeName, id) {
      const params = {
        name: routeName,
        params: {},
      };
      if (id) {
        params.params.id = id;
      }
      this.$router.push(params);
    },
    // 获取列表
    async getHelpArticleList() {
      this.isListLoading = true;
      const params = {
        page: this.page,
        size: this.size,
      };
      const res = await HelpProxy.list(params);
      setTimeout(() => {
        this.isListLoading = false;
      }, 600);
      if (res.success) {
        this.list = res.data.list;
        this.totalRecordCount = res.data.totalCount;
      }
    },
    // 删除
    removeConfirm(id) {
      this.$confirm(
        '确定要删除这个帮助文章吗？',
        '删除帮助文章',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        this.remove(id);
      });
    },
    async remove(id) {
      const params = {
        id,
        // 记录操作日志
        log: {
          client: 1,
          content: `删除了ID为${id}的帮助文章`,
        },
      };
      const res = await HelpProxy.remove(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getHelpArticleList();
      }
    },
  },
  activated() {
    const { nocache } = this.$route.query;
    if (nocache === '1') {
      this.getHelpArticleList();
    }
  },
  created() {
    this.getHelpArticleList();
  },
};
</script>
<style lang="scss">
.help-page {
  .main-header {
    margin: 15px 0;
    .el-form-item:last-child {
      margin-right: 0;
    }
  }
  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .param {
    width: 170px;
    float: right;
  }
}
</style>
