<template>
  <div
    class="xg-main appeal-page"
    v-loading="isLoading">
    <div
      v-show="list.length > 0">
      <el-table
        ref="reviewTable"
        :data="list"
        >
        <el-table-column
          prop="id"
          width="90px"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="task_id"
          width="90px"
          label="任务ID">
        </el-table-column>
        <el-table-column
          prop="review_id"
          width="90px"
          label="审核ID">
        </el-table-column>
        <el-table-column
          prop="user_id"
          key="user_id"
          width="90px"
          label="领取人ID">
        </el-table-column>
        <el-table-column
          prop="task_creator"
          key="task_creator"
          width="90px"
          label="发布人ID">
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          label="提交时间"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          key="updated_at"
          label="更新时间"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.updated_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          key="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.status == 1">待回复</el-tag>
            <el-tag size="small" type="success" v-else-if="scope.row.status == 2">已回复</el-tag>
            <el-tag size="small" type="info" v-else-if="scope.row.status == 3">已撤销</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
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
                    v-if="$tools.checkAdminPower('review', 'handlingAppeal')"
                    class="xg-popover-list__item"
                    @click.native="showDialog(scope.row)">
                    <span class="icon iconfont icon-check-circle"></span>
                    {{scope.row.status != 1 ? '查看' : '回复'}}
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
        @size-change="getAppealList"
        @current-change="getAppealList">
      </el-pagination>
    </div>
    <el-dialog title="回复申诉" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="max-width:500px">
        <el-form-item label="申诉内容" label-width="120px">
          {{form.content}}
        </el-form-item>
        <el-form-item label="相关图片" label-width="120px">
          <div class="image-list">
            <el-image
              class="image-item"
              v-for="image in form.images" :key="image"
              :src="image"
              :preview-src-list="form.images"
              fit="cover">
            </el-image>
          </div>
        </el-form-item>
        <el-form-item label="结果" label-width="120px">
          <el-input type="textarea" placeholder="请输入回复内容" autosize v-model="form.result" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="form.status === 1">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="updateAppeal">回 复</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import PAGECONFIG from '@/constants/pagination';
import TasksManageProxy from '@/proxies/tasks';

export default {
  name: 'review-list',
  data() {
    return {
      form: {
        id: null,
        remark: '',
        status: null,
        result: '',
        user_id: null,
        task_id: null,
      },
      dialogReviewVisible: false,
      dialogFormVisible: false,
      // 列表
      list: [],
      isLoading: false,
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
      return this.list.length < 1 && !this.isLoading;
    },
  },
  methods: {
    buildImageArray(list) {
      return list.map(item => window.API_CONFIG['qiniu_download'] + item);
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.form.content = row.content;
      const images = row.images ? row.images.split(',') : [];
      this.form.images = this.buildImageArray(images);
      this.form.id = row.id;
      this.form.status = row.status;
      this.form.result = row.result;
      this.form.user_id = row.user_id;
      this.form.task_id = row.task_id;
      this.form.review_id = row.review_id;
    },
    // 获取列表
    async getAppealList() {
      const params = {
        page: this.page,
        size: this.size,
      };
      if (this.onlySelf) {
        params.createdFrom = 1;
      }
      this.isLoading = true;
      this.list = [];
      const res = await TasksManageProxy.getAppealList(params);
      this.list = res.data.list;
      this.totalRecordCount = res.data.totalCount;
      this.isLoading = false;
    },
    async updateAppeal() {
      const params = {
        status: 2,
        result: this.form.result,
        user_id: this.form.user_id,
        task_id: this.form.task_id,
        review_id: this.form.review_id,
        // 记录操作日志
        log: {
          client: 1,
          content: `回复了审核ID为${this.form.review_id}的申诉`,
        },
      };
      const res = await TasksManageProxy.updateAppeal(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getAppealList();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getAppealList();
  },
};
</script>
<style lang="scss">
.appeal-page{
  width: 100%;
  .filter {
    margin: 20px 0;
  }
  .image-list {
    white-space: nowrap;
    word-break: keep-all;
    overflow-y: auto;
  }
  .image-item {
    width: 100px;
    height: 100px;
    margin-right: 15px;
    &:last-child {
      margin-right: 0;
    }
  }
  .el-select {
    width: 100px;
  }
  .review {
    .review-img{
      img {
        max-width: 200px;
      }
    }
  }
}
</style>
