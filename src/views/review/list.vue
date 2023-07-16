<template>
  <div
    class="xg-main review-page"
    v-loading="isListLoading">
    <div class="filter">
      <router-link v-if="$tools.checkAdminPower('review', 'appeal')" style="margin-right: 20px" :to="{name: 'review.appeals'}">
        <el-button type="primary">审核申诉</el-button>
      </router-link>
      <el-form :inline="true">
        <el-form-item>
          <el-checkbox v-model="onlySelf">不显示非自营任务</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="请选择"  @change="search">
            <el-option
              v-for="item in status"
              :key="`status${item.value}`"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="任务标题" v-model="searchForm.taskTitle" clearable class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="领取人ID" v-model="searchForm.userId" clearable class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="任务ID" v-model="searchForm.taskId" clearable class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="审核ID" v-model="searchForm.id" clearable class="input-with-select"></el-input>
        </el-form-item>
        <el-form-item style="width: 160px">
          <el-button plain type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
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
          prop="id"
          width="90px"
          label="审核ID">
        </el-table-column>
        <el-table-column
          prop="task_id"
          width="90px"
          label="任务ID">
        </el-table-column>
        <el-table-column
          prop="title"
          width="150px"
          show-overflow-tooltip
          label="任务标题">
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
          label="创建时间"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="review_by"
          key="review_by"
          width="90px"
          label="审核人ID">
        </el-table-column>
        <el-table-column
          prop="review_role"
          key="review_role"
          show-overflow-tooltip
          label="审核人角色">
          <template slot-scope="scope">
            {{scope.row.review_role == 1 ? '用户' : '管理员'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          key="updated_at"
          show-overflow-tooltip
          label="审核时间">
          <template slot-scope="scope">
            {{scope.row.updated_at | transLocalTime}}
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
              <el-tag size="small" type="info" v-else-if="scope.row.status == 4">保存草稿</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="images"
          key="images"
          width="100px"
          label="审核资料">
          <template slot-scope="scope">
            <el-button type="text" @click="showReviewDetail(scope.row)">查看</el-button>
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
                    @click.native="reviewResolve(scope.row.id, scope.row.user_id, scope.row.task_id)">
                    <span class="icon iconfont icon-check-circle"></span>
                    审核通过
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('review', 'delete')"
                    class="xg-popover-list__item"
                    :disabled="(!!scope.row.deleted)"
                    @click.native="reviewRemove(scope.row.id, scope.row.task_id)">
                    <span class="icon iconfont icon-delete"></span>
                    取消任务
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
        @size-change="reviewTasks"
        @current-change="reviewTasks">
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
      <p v-for="(item, index) in fields" :key="`field${index}`">
        {{item.name}}: {{item.reviewValue}}
      </p>
      <br>
      <p>审核步骤：</p>
      <el-table
        class="review-step"
        :data="pictures">
        <el-table-column
          fixed="left"
          label="要求"
          width="150px"
          prop="textStep">
          <template slot-scope="scope">
            {{scope.$index + 1}}.{{scope.row.textStep}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="left"
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
      <div slot="footer" class="dialog-footer" v-if="reviewDetail.status === 1">
        <el-button
          type="primary"
          @click="reviewResolve(reviewDetail.id, reviewDetail.user_id, reviewDetail.task_id)">
            通过
        </el-button>
        <el-button @click="showDialog(reviewDetail)">驳回</el-button>
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
      onlySelf: true,
      status: [{
        label: '全部状态',
        value: 0,
      }, {
        label: '审核中',
        value: 1,
      }, {
        label: '审核通过',
        value: 2,
      }, {
        label: '已驳回',
        value: 3,
      }, {
        label: '保存草稿',
        value: 4,
      }],
      form: {
        id: null,
        remark: '',
        userId: null,
        taskId: null,
      },
      reviewDetail: {},
      fields: [],
      searchForm: {
        status: 0,
        id: null,
        taskTitle: null,
        userId: null,
        taskId: null,
      },
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
      this.fields = row.fields && row.fields !== 'undefined'
        ? JSON.parse(row.fields)
        : [];
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
      this.form.id = row.id;
      this.form.userId = row.user_id;
      this.form.taskId = row.task_id;
    },
    search() {
      this.page = 1;
      this.reviewTasks();
    },
    reset() {
      this.searchForm = {
        status: 0,
        id: null,
        taskTitle: null,
        userId: null,
        taskId: null,
      };
      this.reviewTasks();
    },
    // 获取列表
    async reviewTasks() {
      const params = {
        page: this.page,
        size: this.size,
        ...this.searchForm,
      };
      if (this.onlySelf) {
        params.createdFrom = 1;
      }
      this.isListLoading = true;
      this.list = [];
      try {
        const {
          data: { list, totalCount },
        } = await TasksManageProxy.reviewTasks(params);
        this.list = list;
        this.totalRecordCount = totalCount;
        this.isListLoading = false;
      } catch (error) {
        this.isListLoading = false;
        this.$notify.error({
          title: '错误',
          message: '获取审核列表出错',
        });
      }
    },
    reviewResolve(id, userId, taskId) {
      this.$confirm('此操作不可撤销, 是否继续?', '确认通过审核？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const params = {
          id,
          userId,
          taskId,
          type: 3,
          taskType: 3,
          reviewBy: this.adminID,
          reviewRole: 2,
          // 记录操作日志
          log: {
            client: 1,
            content: `通过了ID为${id}的审核，任务ID为${taskId}`,
          },
        };
        const res = await TasksManageProxy.reviewResolve(params);
        if (!res.fail) {
          this.dialogReviewVisible = false;
          this.$notify.success({
            title: '成功',
            message: res.message,
          });
          // 刷新列表
          this.reviewTasks();
        }
      });
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
        this.dialogReviewVisible = false;
        this.dialogFormVisible = false;
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.reviewTasks();
      }
    },
    reviewRemove(reviewId, taskId) {
      this.$confirm('此操作将取消用户领取的任务，并回收任务数量, 是否继续?', '确认取消？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const params = {
          id: reviewId,
          task_id: taskId,
          // 记录操作日志
          log: {
            client: 1,
            content: `取消了ID为${reviewId}的审核，任务ID为${taskId}`,
          },
        };
        const res = await TasksManageProxy.reviewRemove(params);
        if (!res.fail) {
          this.$notify.success({
            title: '取消成功',
            message: res.message,
          });
          // 刷新列表
          this.reviewTasks();
        }
      });
    },
  },
  created() {
    this.reviewTasks();
  },
};
</script>
<style lang="scss">
.review-page{
  width: 100%;
  .filter {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    .el-form-item {
      width: 130px;
      &:last-child {
        margin-right: 0;
      }
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
    width: 130px;
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
