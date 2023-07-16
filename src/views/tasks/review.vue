<template>
  <div
    class="xg-main review-tasks-page"
    v-loading="isListLoading">
    <div class="filter">
      <el-form :inline="true">
        <el-form-item>
          <el-select clearable @change="search(searchForm)" v-model="searchForm.status" placeholder="按状态筛选">
            <el-option
              v-for="item in status"
              :key="`status${item.value}`"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div
      v-show="list.length > 0">
      <el-table
        ref="reviewTable"
        :data="list"
        >
        <el-table-column
          prop="review_id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="user_id"
          show-overflow-tooltip
          label="领取者ID">
        </el-table-column>
        <el-table-column
          prop="task_creator"
          key="task_creator"
          label="发布者ID">
        </el-table-column>
        <el-table-column
            prop="created_from"
            label="来源">
            <template slot-scope="scope">
              {{ scope.row.created_from | getCreatedFrom }}
            </template>
          </el-table-column>
        <el-table-column
          prop="money"
          key="money"
          label="任务金额">
          <template slot-scope="scope">
            {{scope.row.money}} 元
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
          prop="status"
          key="status"
          label="状态">
          <template slot-scope="scope">
            <template v-if="scope.row.deleted">
              <el-tag size="small" type="info">已取消</el-tag>
            </template>
            <template v-else>
              <el-tag size="small" v-if="scope.row.status == 1">审核中</el-tag>
              <el-tag size="small" type="success" v-else-if="scope.row.status == 2">审核通过</el-tag>
              <el-tooltip v-else-if="scope.row.status == 3" class="item" effect="dark" :content="scope.row.remark" placement="top">
                <el-tag size="small" type="info">已驳回</el-tag>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="审核资料">
          <template slot-scope="scope">
            <el-button
              v-if="$tools.checkAdminPower('review', 'detail')"
              type="text"
              @click="showReviewDetail(scope.row)">查看</el-button>
            <span v-else>无权查看</span>
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
                    v-if="$tools.checkAdminPower('review', 'reject')"
                    :disabled="scope.row.status != 1"
                    class="xg-popover-list__item"
                    @click.native="showDialog(scope.row)">
                    <span class="icon iconfont icon-close-circle"></span>
                    驳回
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('review', 'resolve')"
                    :disabled="scope.row.status != 1"
                    class="xg-popover-list__item"
                    @click.native="reviewResolve(scope.row.review_id, scope.row.user_id, scope.row.task_id)">
                    <span class="icon iconfont icon-check-circle"></span>
                    审核通过
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
        @size-change="getTaskGrabList"
        @current-change="getTaskGrabList">
      </el-pagination>
    </div>
    <el-dialog title="驳回" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="max-width:500px">
        <el-form-item label="理由" label-width="120px">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="reviewReject">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="70%" title="审核资料" :visible.sync="dialogReviewVisible">
      <p>审核步骤：</p>
      <el-table
        class="review-step"
        :data="pictures">
        <el-table-column
          label="要求"
          width="150px"
          prop="textStep">
          <template slot-scope="scope">
            {{scope.$index + 1}}.{{scope.row.textStep}}
          </template>
        </el-table-column>
        <el-table-column
          label="示例图"
          width="150px"
          prop="imageStep">
          <template slot-scope="scope">
            <el-image 
              class="image-item"
              :src="scope.row.imageStep"
              :preview-src-list="[scope.row.imageStep]"
              fit="cover">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="用户提交的审核图"
          prop="imageReview">
          <template slot-scope="scope">
            <div class="image-list">
              <el-image
                class="image-item"
                v-for="image in scope.row.imageReview" :key="image"
                :src="image"
                :preview-src-list="scope.row.imageReview"
                fit="cover">
              </el-image>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReviewVisible = false">关 闭</el-button>
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
      status: [{
        label: '审核中',
        value: 1,
      }, {
        label: '审核通过',
        value: 2,
      }, {
        label: '已驳回',
        value: 3,
      }],
      form: {
        id: null,
        remark: '',
        userId: null,
        taskId: null,
      },
      reviewDetail: {},
      searchForm: {},
      dialogReviewVisible: false,
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
      pictures: [],
    };
  },
  computed: {
    showNoRecord() {
      // 列表为空，且不是正在加载中
      return this.list.length < 1 && !this.isListLoading;
    },
    adminID() {
      return this.$storage.getItem('id');
    },
  },
  methods: {
    buildImageArray(list) {
      return list.map(item => window.API_CONFIG['qiniu_download'] + item);
    },
    async showReviewDetail(row) {
      this.reviewDetail = row;
      this.dialogReviewVisible = true;
      const images = JSON.parse(row.images);
      const reviewStep = row.reviewStep
        ? JSON.parse(row.reviewStep.replace(/\n/g, '').replace(/\r/g, ''))
        : [];
      this.pictures = reviewStep.map((item) => {
        const step = {
          imageStep: window.API_CONFIG['qiniu_download'] + item.image,
          textStep: item.text,
          imageReview: this.buildImageArray(images[item.id]),
        };
        return step;
      });
    },
    showDialog(row) {
      this.dialogFormVisible = true;
      this.form.id = row.review_id;
      this.form.userId = row.user_id;
      this.form.taskId = row.task_id;
    },
    search(params) {
      if (!params.status) {
        delete params.status;
      }
      this.getTaskGrabList(params);
    },
    // 获取列表
    async getTaskGrabList(search = {}) {
      const params = {
        page: this.page,
        size: this.size,
        task_id: this.$route.params.taskId,
        ...search,
      };
      this.isListLoading = true;
      const res = await TasksManageProxy.getTaskGrabList(params);
      this.isListLoading = false;
      if (res.success) {
        this.list = res.data.list;
        this.totalRecordCount = res.data.totalCount;
      }
    },
    async reviewResolve(id, userId, taskId) {
      const params = {
        id,
        userId,
        taskId,
        type: 3,
        reviewBy: this.adminID,
        reviewRole: 2,
        log: {
          client: 1,
          content: `通过了ID为${id}的审核，任务ID为${taskId}`,
        },
      };
      const res = await TasksManageProxy.reviewResolve(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getTaskGrabList();
      }
    },
    async reviewReject() {
      const params = {
        ...this.form,
        reviewBy: this.adminID,
        reviewRole: 2,
        // 记录操作日志
        log: {
          client: 1,
          content: `驳回了ID为${this.form.id}的审核，任务ID为${this.form.taskId}`,
        },
      };
      const res = await TasksManageProxy.reviewReject(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getTaskGrabList();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getTaskGrabList();
  },
};
</script>
<style lang="scss">
.review-tasks-page{
  width: 100%;
  .filter {
    margin: 20px 0;
    .el-form-item:last-child {
      margin-right: 0;
    }
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
    width: 200px;
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
