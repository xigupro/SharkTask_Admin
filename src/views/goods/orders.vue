<template>
  <div class="xg-main orders-list-page">
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
          <el-input placeholder="商品ID" v-model="searchForm.goods_id" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="订单编号" v-model="searchForm.order_no" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="商品标题" v-model="searchForm.title" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.addDateRange"
            type="datetimerange"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="订单开始日期"
            end-placeholder="订单结束日期">
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
          prop="order_no"
          width="220px"
          label="订单号">
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="goods_id"
          label="商品ID">
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
          label="商品标题"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.title | filterBlank }}
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
          prop="money"
          label="商品金额">
          <template slot-scope="scope">
            {{ scope.row.price }} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="express_fee"
          label="邮费">
          <template slot-scope="scope">
            {{ scope.row.express_fee }} 元
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="收货人">
        </el-table-column>
        <el-table-column
          prop="tel"
          width="120px"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="address"
          width="200px"
          show-overflow-tooltip
          label="地址">
        </el-table-column>
        <el-table-column
          prop="express_no"
          width="160px"
          label="快递单号">
        </el-table-column>
        <el-table-column
          prop="created_at"
          width="150px"
          sortable="custom"
          label="下单时间">
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
            <el-tag size="small" :type="status[scope.row.status].type">
              {{status[scope.row.status].name}}
            </el-tag>
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
                  v-if="$tools.checkAdminPower('goods', 'orderDeliver')"
                  class="xg-popover-list__item"
                  :disabled="scope.row.status !== 1"
                  @click.native="showDeliverDialog(scope.row)">
                  <span class="icon iconfont icon-edit-square"></span>
                  发货
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="$tools.checkAdminPower('goods', 'orderCancel')"
                  class="xg-popover-list__item"
                  :disabled="scope.row.status !== 1"
                  @click.native="cancelConfirm(scope.row)">
                  <span class="icon iconfont icon-delete"></span>
                  取消
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
        @size-change="getOrderList"
        @current-change="getOrderList">
      </el-pagination>

    </div>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
    <el-dialog title="发货" :visible.sync="dialogFormVisible">
      <el-form :model="deliverForm" style="max-width:500px">
        <el-form-item label="快递单号" label-width="120px">
          <el-input v-model="deliverForm.express_no" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="deliver">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import PAGECONFIG from '@/constants/pagination';
  import GoodsManageProxy from '@/proxies/goods';
  
  const defaultSort = [{ prop: 'created_at', order: 'descending' }];
  export default {
    name: 'orders-list',
    data() {
      return {
        searchForm: {
          sort: defaultSort,
        },
        dialogFormVisible: false,
        deliverForm: {},
        status: [{
          id: 0,
          name: '全部',
        }, {
          id: 1,
          name: '待发货',
          type: 'warning',
        }, {
          id: 2,
          name: '已发货',
          type: 'success',
        }, {
          id: 3,
          name: '已取消',
          type: 'info',
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
        this.getOrderList();
      },
      reset() {
        this.page = 1;
        this.searchForm = { sort: defaultSort };
        this.getOrderList();
      },
      search() {
        this.page = 1;
        this.getOrderList();
      },
      showDeliverDialog(row) {
        this.deliverForm.id = row.id;
        this.dialogFormVisible = true;
      },
      // 取消
      cancelConfirm(row) {
        this.$confirm('确定要取消这个订单吗？', '取消订单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.orderCancel(row);
          });
      },
      async orderCancel(row) {
        const params = {
          id: row.id,
          userId: row.user_id,
          // 记录操作日志
          log: {
            client: 1,
            content: `取消了ID为${row.id}的订单`,
          },
        };
        const res = await GoodsManageProxy.cancelOrder(params);
        if (!res.fail) {
          this.$notify.success({
            title: '成功',
            message: '取消成功',
          });
          // 刷新列表
          this.getOrderList();
        }
      },
      async deliver() {
        const params = {
          ...this.deliverForm,
        };
        const res = await GoodsManageProxy.deliver(params);
        if (!res.fail) {
          this.$notify.success({
            title: '成功',
            message: '操作成功',
          });
          this.dialogFormVisible = false;
          // 刷新列表
          this.getOrderList();
        }
      },
      async getOrderList() {
        const params = {
          page: this.page,
          size: this.size,
          ...this.searchForm,
        };
        this.isListLoading = true;
        const res = await GoodsManageProxy.getOrderList(params);
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
        this.getOrderList(this.defaultpage);
      },
      async init() {
        const { status } = this.$route.query;
        if (!Number.isNaN(Number(status))) {
          this.searchForm.status = +status;
        }
        await this.getGoodsTypeList();
        await this.getOrderList();
      },
    },
    activated() {
      const { nocache } = this.$route.query;
      if (nocache === '1') {
        this.getOrderList();
      }
    },
    created() {
      this.init();
    },
  };
</script>
<style lang="scss">
  .orders-list-page {
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
