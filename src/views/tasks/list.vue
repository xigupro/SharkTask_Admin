<template>
  <div class="xg-main task-list-page">
    <div class="main-header">
      <el-button
        v-if="$tools.checkAdminPower('tasks', 'add')"
        type="primary"
        @click="go('task.add')">添加任务</el-button>
      <el-button
        v-if="$tools.checkAdminPower('tasks', 'type')"
        @click="go('task.type')">分类管理</el-button>
      <el-button
        v-if="$tools.checkAdminPower('tasks', 'price')"
        type="primary"
        @click="go('task.refresh')">刷新套餐</el-button>
    </div>
    <div class="main-header">
      <el-form :inline="true">
        <el-form-item>
          <el-select clearable v-model="searchForm.status" placeholder="状态" @change="search">
            <el-option
              v-for="(item, index) in status"
              :key="`status${index}`"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="searchForm.type" filterable placeholder="分类" @change="search">
            <el-option
              v-for="(item, index) in types"
              :key="`type${index}`"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="任务ID" v-model="searchForm.id" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="标题" v-model="searchForm.title" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.addDateRange"
            type="datetimerange"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="发布开始日期"
            end-placeholder="发布结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button plain type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div
      class="xg-group__list">
      <el-table
        v-show="list.length > 0"
        empty-text="-"
        ref="newsTable"
        v-loading="isListLoading"
        @sort-change="handleSortChange"
        :default-sort="searchForm.sort[0]"
        :data="list"
        >
        <el-table-column
          width="60px"
          fixed
          prop="recommend"
          label="">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.recommend">荐</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          fixed
          width="50px"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="sort"
          width="50px"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="created_by"
          width="80px"
          label="发布者">
        </el-table-column>
        <el-table-column
          width="100px"
          prop="created_from"
          label="来源">
          <template slot-scope="scope">
            {{ scope.row.created_from | getCreatedFrom }}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          width="200px"
          label="标题"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.title | filterBlank }}
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          sortable="custom"
          label="剩余">
          <template slot-scope="scope">
            {{ scope.row.quantity || 0 }}份
          </template>
        </el-table-column>
        <el-table-column
          prop="grab_quantity"
          sortable="custom"
          width="100px"
          label="已领取">
          <template slot-scope="scope">
            <span class="text-danger">{{ scope.row.grab_quantity || 0 }}</span>份
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          sortable="custom"
          label="赏金">
          <template slot-scope="scope">
            {{ scope.row.money }} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="service_price"
          sortable="custom"
          width="100px"
          label="服务费">
          <template slot-scope="scope">
            {{ scope.row.service_price }} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型">
          <template slot-scope="scope">
              {{ getTypeName(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="150px"
          sortable="custom"
          label="发布时间">
          <template slot-scope="scope">
              {{ scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          width="150px"
          sortable="custom"
          label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.updated_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          fixed="right"
          width="100"
          label="状态">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.status == 1">已上架</el-tag>
            <el-tag size="small" type="info" v-else-if="scope.row.status == 2">已下架</el-tag>
            <el-tag size="small" type="primary" v-else-if="scope.row.status == 3">待审核</el-tag>
            <el-tooltip v-else-if="scope.row.status == 4" effect="dark" :content="scope.row.status_text" placement="top">
              <el-tag size="small" type="warning">审核不通过</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
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
                  v-if="$tools.checkAdminPower('tasks', 'edit')"
                  class="xg-popover-list__item"
                  @click.native="edit(scope.row)">
                  <span class="icon iconfont icon-edit-square"></span>
                  编辑
                </el-dropdown-item>
                <template v-if="$tools.checkAdminPower('tasks', 'status')">
                  <el-dropdown-item
                    v-if="scope.row.status == 1"
                    class="xg-popover-list__item"
                    @click.native="updateStatus(scope.row)">
                    <span class="icon iconfont icon-vertical-align-botto"></span>
                    下架
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-else
                    class="xg-popover-list__item"
                    @click.native="updateStatus(scope.row)">
                    <span class="icon iconfont icon-vertical-align-top"></span>
                    上架
                  </el-dropdown-item>
                </template>
                <el-dropdown-item
                  v-if="$tools.checkAdminPower('tasks', 'grabList')"
                  class="xg-popover-list__item"
                  @click.native="review(scope.row.id)">
                  <span class="icon iconfont icon-filesearch"></span>
                  领取列表
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="$tools.checkAdminPower('tasks', 'reviewList')"
                  class="xg-popover-list__item"
                  @click.native="getReviewUrl(scope.row.id, scope.row.title)">
                  <span class="icon iconfont icon-link"></span>
                  交单链接
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="$tools.checkAdminPower('tasks', 'review')"
                  class="xg-popover-list__item"
                  @click.native="showReviewDialog(scope.row)">
                  <span class="icon iconfont icon-securityscan"></span>
                  审核
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="$tools.checkAdminPower('tasks', 'delete')"
                  class="xg-popover-list__item"
                  @click.native="delConfirm(scope.row)">
                  <span class="icon iconfont icon-delete"></span>
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-if="totalCount > 0"
        background
        :layout="pageconf.simpleLayout"
        :page-sizes="pageconf.sizes"
        :page-size.sync="size"
        :current-page.sync="page"
        :total="totalCount"
        @size-change="getTasks"
        @current-change="getTasks">
      </el-pagination>

    </div>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
    <el-dialog title="审核" :visible.sync="dialogFormVisible">
      <el-form :model="reviewForm" style="max-width:500px">
        <el-form-item label="结果" label-width="120px">
          <el-input v-model="reviewForm.text" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="updateStatus(reviewRow, 4, reviewForm.text)">驳回</el-button>
        <el-button size="medium" type="primary" @click="updateStatus(reviewRow, 1)">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import PAGECONFIG from '@/constants/pagination';
  import TasksManageProxy from '@/proxies/tasks';
  import { encryptByDESModeEBC } from '@/utils/tools';
  
  const defaultSort = [{ prop: 'recommend', order: 'descending' }];
  export default {
    name: 'task-list',
    data() {
      return {
        dialogFormVisible: false,
        reviewRow: null,
        reviewForm: {
          text: '',
        },
        searchForm: {
          sort: defaultSort,
        },
        recommend: [{
          id: 0,
          name: '全部',
        }, {
          id: 1,
          name: '推荐',
        }],
        status: [{
          id: 0,
          name: '全部',
        }, {
          id: 1,
          name: '上架',
        }, {
          id: 2,
          name: '下架',
        }, {
          id: 3,
          name: '待审核',
        }, {
          id: 4,
          name: '审核不通过',
        }],
        // 列表
        list: [],
        isListLoading: false,
        showPopover: false,
        curPopover: -1,
        // 翻页数据
        pageconf: PAGECONFIG,
        // 默认页起点
        defaultpage: PAGECONFIG.defaultpage,
        // 当前页码
        page: PAGECONFIG.defaultpage,
        // 页容量
        size: PAGECONFIG.defaultsize,
        // 总条数
        totalCount: 0,
        types: [],
        // 草稿箱数量
        draftCount: 0,
      };
    },
    computed: {
      showNoRecord() {
        // 列表为空，且不是正在加载中
        return this.list.length < 1 && !this.isListLoading;
      },
    },
    methods: {
      // 排序
      handleSortChange({ prop, order }) {
        this.searchForm.sort = [{ prop, order }];
        this.getTasks();
      },
      reset() {
        this.page = 1;
        this.searchForm = { sort: defaultSort };
        this.getTasks();
      },
      search() {
        this.page = 1;
        this.getTasks();
      },
      go(routeName) {
        this.$router.push({
          name: routeName,
        });
      },
      showReviewDialog(row) {
        this.dialogFormVisible = true;
        this.reviewRow = row;
      },
      review(id) {
        this.$router.push({
          name: 'task.review',
          params: {
            taskId: id,
          },
        });
      },
      getReviewUrl(id, title) {
        const value = encryptByDESModeEBC(`${id}&${title}`);
        const url = `${window.API_CONFIG['shop']}/#/tasks/review/${encodeURIComponent(value)}`;
        this.$alert(url, '交单链接', {
          confirmButtonText: '一键复制',
          callback: () => {
            this.$copyText(url).then(() => {
              this.$notify.success({
                title: '成功',
                message: '复制成功',
              });
            }, () => {
              this.$notify.error({
                title: '失败',
                message: '复制失败',
              });
            });
          },
        });
      },
      // 编辑
      edit(row) {
        this.$router.push({
          name: 'task.edit',
          params: {
            id: row.id,
          },
        });
      },
      // 删除
      delConfirm(row) {
        const title = '删除确认';
        const tips = Number(row.created_from) === 1
          ? '确定要删除这个任务吗？'
          : '删除后将退还剩余佣金，已被领取的任务依然有效，且其佣金和服务费不退还，是否删除？';
        this.showPopover = false;
        this.$confirm(tips, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.del(row);
          })
          .catch(() => {
          });
      },
      async del(row) {
        const params = {
          taskId: row.id,
          // 记录操作日志
          log: {
            client: 1,
            content: `删除了ID为${row.id}的任务`,
          },
        };
        const res = await TasksManageProxy.removeTask(params);
        if (!res.fail) {
          this.$notify.success({
            title: '成功',
            message: '删除成功',
          });
          // 刷新列表
          this.getTasks();
        }
      },
      async updateStatus(row, status, text) {
        const params = {
          taskId: row.id,
          creator: row.created_by,
          status: status || (row.status === 1 ? 2 : 1),
        };
        // 记录操作日志
        params.log = {
          client: 1,
          content: `${Number(params.status) === 1 ? '上架' : '下架'}了ID为${row.id}的任务`,
        };
        if (params.status === 4) {
          params.status_text = text;
        }
        const res = await TasksManageProxy.updateTaskStatus(params);
        if (!res.fail) {
          this.$notify.success({
            title: '成功',
            message: '更新成功',
          });
          this.dialogFormVisible = false;
          // 刷新列表
          this.getTasks();
        }
      },
      async getTasks() {
        const params = {
          page: this.page,
          size: this.size,
          ...this.searchForm,
        };
        this.isListLoading = true;
        const res = await TasksManageProxy.getTasks(params);
        setTimeout(() => {
          this.isListLoading = false;
        }, 600);
        if (res.success) {
          this.list = res.data.list;
          this.totalCount = res.data.totalCount;
        }
      },
      getTypeName(id) {
        const item = this.types.find(type => type.id === id);
        return item ? item.name : '';
      },
      async getTypes() {
        const res = await TasksManageProxy.getTypes();
        this.types = res.data;
      },
      // 修改页容量
      handleSizeChange(newsize) {
        this.size = newsize;
        // 重新获取列表
        this.getTasks(this.defaultpage);
      },
      async init() {
        const { status } = this.$route.query;
        if (!Number.isNaN(Number(status))) {
          this.searchForm.status = +status;
        }
        await this.getTypes();
        await this.getTasks();
      },
    },
    activated() {
      const { nocache } = this.$route.query;
      if (nocache === '1') {
        this.getTasks();
      }
    },
    created() {
      this.init();
    },
  };
</script>
<style lang="scss">
  .task-list-page {
    width: 100%;
    .main-header {
      margin-top: 20px;
      .form-item {
        width: 120px;
      }
      .el-form-item {
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .el-select {
      width: 100px;
    }
  }
</style>
