<template>
  <div class="xg-main goods-list-page">
    <div class="main-header">
      <el-button
        v-if="$tools.checkAdminPower('goods', 'add')"
        type="primary"
        @click="go('goods.add')">添加商品</el-button>
      <el-button
        v-if="$tools.checkAdminPower('goods', 'type')"
        @click="go('goods.type')">分类管理</el-button>
      <el-button
        v-if="$tools.checkAdminPower('goods', 'orders')"
        type="primary"
        @click="go('goods.orders')">订单管理</el-button>
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
          <el-input placeholder="商品ID" v-model="searchForm.id" clearable class="form-item"></el-input>
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
          prop="thumbnail"
          key="thumbnail"
          label="缩略图">
          <template slot-scope="scope">
            <img style="height: 40px" :src="scope.row.thumbnail | getQiniuFullUrl">
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
          prop="money"
          label="单价">
          <template slot-scope="scope">
            {{ scope.row.price }} 元
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
            <el-tag size="small" type="info" v-else-if="scope.row.status == 0">已下架</el-tag>
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
                  v-if="$tools.checkAdminPower('goods', 'edit')"
                  class="xg-popover-list__item"
                  @click.native="edit(scope.row)">
                  <span class="icon iconfont icon-edit-square"></span>
                  编辑
                </el-dropdown-item>
                <template v-if="$tools.checkAdminPower('goods', 'status')">
                  <el-dropdown-item
                    v-if="scope.row.status == 1"
                    class="xg-popover-list__item"
                    @click.native="updateStatus(scope.row, 0)">
                    <span class="icon iconfont icon-vertical-align-botto"></span>
                    下架
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-else
                    class="xg-popover-list__item"
                    @click.native="updateStatus(scope.row, 1)">
                    <span class="icon iconfont icon-vertical-align-top"></span>
                    上架
                  </el-dropdown-item>
                </template>
                <el-dropdown-item
                  v-if="$tools.checkAdminPower('goods', 'delete')"
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
        @size-change="getGoodsList"
        @current-change="getGoodsList">
      </el-pagination>

    </div>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
  import PAGECONFIG from '@/constants/pagination';
  import GoodsManageProxy from '@/proxies/goods';
  
  const defaultSort = [{ prop: 'created_at', order: 'descending' }];
  export default {
    name: 'goods-list',
    data() {
      return {
        searchForm: {
          sort: defaultSort,
        },
        status: [{
          id: 0,
          name: '全部',
        }, {
          id: 1,
          name: '上架',
        }, {
          id: 2,
          name: '下架',
        }],
        // 列表
        list: [],
        isListLoading: false,
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
        this.getGoodsList();
      },
      reset() {
        this.page = 1;
        this.searchForm = { sort: defaultSort };
        this.getGoodsList();
      },
      search() {
        this.page = 1;
        this.getGoodsList();
      },
      go(routeName) {
        this.$router.push({
          name: routeName,
        });
      },
      // 编辑
      edit(row) {
        this.$router.push({
          name: 'goods.edit',
          params: {
            id: row.id,
          },
        });
      },
      // 删除
      delConfirm(row) {
        this.$confirm('确定要删除这个商品吗？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.del(row);
          });
      },
      async del(row) {
        const params = {
          id: row.id,
          // 记录操作日志
          log: {
            client: 1,
            content: `删除了ID为${row.id}的商品`,
          },
        };
        const res = await GoodsManageProxy.removeGoods(params);
        if (!res.fail) {
          this.$notify.success({
            title: '成功',
            message: '删除成功',
          });
          // 刷新列表
          this.getGoodsList();
        }
      },
      async updateStatus(row, status) {
        const params = {
          id: row.id,
          status,
        };
        // 记录操作日志
        params.log = {
          client: 1,
          content: `${Number(params.status) === 1 ? '上架' : '下架'}了ID为${row.id}的商品`,
        };
        const res = await GoodsManageProxy.updateStatus(params);
        if (!res.fail) {
          this.$notify.success({
            title: '成功',
            message: '更新成功',
          });
          // 刷新列表
          this.getGoodsList();
        }
      },
      async getGoodsList() {
        const params = {
          page: this.page,
          size: this.size,
          ...this.searchForm,
        };
        this.isListLoading = true;
        const res = await GoodsManageProxy.getGoodsList(params);
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
      async getGoodsTypeList() {
        const res = await GoodsManageProxy.getTypeList();
        this.types = res.data;
      },
      // 修改页容量
      handleSizeChange(newsize) {
        this.size = newsize;
        // 重新获取列表
        this.getGoodsList(this.defaultpage);
      },
      async init() {
        const { status } = this.$route.query;
        if (!Number.isNaN(Number(status))) {
          this.searchForm.status = +status;
        }
        await this.getGoodsTypeList();
        await this.getGoodsList();
      },
    },
    activated() {
      const { nocache } = this.$route.query;
      if (nocache === '1') {
        this.getGoodsList();
      }
    },
    created() {
      this.init();
    },
  };
</script>
<style lang="scss">
  .goods-list-page {
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
