<template>
  <div class="home-page">
    <el-row :gutter="40">
      <el-col :span="12">
        <el-row :gutter="20" v-if="$tools.checkAdminPower('home', 'todo')">
          <el-col :span="24">
            <h2>待办</h2>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-card class="box-card">
                  <router-link :to="{path: '/review/list'}">
                  <h2>{{statistics.taskTobeReviewCount || 0}}<small>个</small></h2>
                  任务待审核
                  </router-link>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card">
                  <router-link :to="{path: '/finance/list'}">
                  <h2>{{statistics.withdrawTobeReviewCount || 0}}<small>个</small></h2>
                  提现待审核
                  </router-link>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card">
                  <router-link :to="{path: '/users/certifications'}">
                  <h2>{{statistics.certificationTobeReviewCount || 0}}<small>个</small></h2>
                  认证待审核
                  </router-link>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card">
                  <router-link :to="{path: '/tasks/list?status=3&nocache=1'}">
                  <h2>{{statistics.onSellReviewCount || 0}}<small>个</small></h2>
                  上架待审核
                  </router-link>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="$tools.checkAdminPower('home', 'today')">
          <el-col :span="24">
            <h2>今日数据</h2>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-card class="box-card blue">
                  <h2>{{statistics.todayNewUserCount || 0}}<small>个</small></h2>
                  新增用户
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card class="box-card">
                  <h2>{{statistics.todayTaskFinishCount || 0}}<small>个</small></h2>
                  完成任务
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card danger">
                  <div class="tips">
                    <el-popover
                      placement="top-start"
                      trigger="hover"
                      content="今天发布任务的服务费总和">
                      <span slot="reference">?</span>
                    </el-popover>
                  </div>
                  <h2>{{statistics.todayServicePrice || 0}}<small>元</small></h2>
                  任务服务费
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12" v-if="$tools.checkAdminPower('home', 'message')">
        <h2>
          最新动态
        </h2>
        <el-card class="box-card dynamic">
          <ul
            v-infinite-scroll="loadMore"
            :infinite-scroll-immediate="false"
            :infinite-scroll-disabled="finished">
            <li class="message-item" v-for="(item, index) in messageList" :key="index">
              <div class="flex">
                <div class="index">
                  {{index + 1}}
                </div>
                <div>
                  <div class="title">{{item.title}}<small>{{item.created_at | transLocalTime}}</small></div>
                  <div class="content" :title="item.content">{{item.content}}</div>
                </div>
              </div>
            </li>
          </ul>
          <div class="text-center" v-if="isMessageLoading">加载中...</div>
          <div class="text-center" v-else-if="finished && !messageList.length">暂无数据</div>
        </el-card>
      </el-col>
    </el-row>
    <template v-if="$tools.checkAdminPower('home', 'overview')">
      <h2>数据概览</h2>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card">
            <el-row :gutter="10">
              <el-col :span="8">
                领取任务总数
                <h3>{{statistics.grabTaskCount || 0}}<small>个</small></h3>
              </el-col>
              <el-col :span="16">
                <div class="progress">
                  <el-progress :text-inside="true" :stroke-width="16" :percentage="onGoingTaskCount || 0" :format="onGoingTaskCountFormat"></el-progress>
                  <span>进行中</span>
                </div>
                <div class="progress">
                  <el-progress :text-inside="true" :stroke-width="16" :percentage="onReviewingTaskCount || 0" :format="onReviewingTaskCountFormat"></el-progress>
                  <span>审核中</span>
                </div>
                <div class="progress">
                  <el-progress :text-inside="true" :stroke-width="16" :percentage="finishTaskTotalCount || 0" :format="finishTaskTotalCountFormat"></el-progress>
                  <span>已完成</span>
                </div>
                <div class="progress">
                  <el-progress :text-inside="true" :stroke-width="16" :percentage="expiredTaskCount || 0" :format="expiredTaskCountFormat"></el-progress>
                  <span>已过期</span>
                </div>
                <div class="progress">
                  <el-progress :text-inside="true" :stroke-width="16" :percentage="rejectTaskCount || 0" :format="rejectTaskCountFormat"></el-progress>
                  <span>已拒绝</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <el-row :gutter="10">
              <el-col :span="8">
                平台总金额
                <h3 v-if="statistics.userTotalMoney >= 10000">{{statistics.userTotalMoney | toTenThousand}}<small>万元</small></h3>
                <h3 v-else>{{statistics.userTotalMoney || 0}}<small>元</small></h3>
                平台总积分
                <h3 v-if="statistics.totalUserScore >= 10000">{{statistics.totalUserScore | toTenThousand}}<small>万</small></h3>
                <h3 v-else>{{statistics.totalUserScore || 0}}<small></small></h3>
              </el-col>
              <el-col :span="16">
                <el-progress :width="160" type="circle" color="rgb(230, 162, 60)" :percentage="withdrawTotalMoney || 0" :format="withdrawTotalMoneyFormat"></el-progress>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card danger">
            <h2 v-if="statistics.totalIncome >= 10000">{{statistics.totalIncome | toTenThousand}}<small>万元</small></h2>
            <h2 v-else>{{statistics.totalIncome || 0}}<small>元</small></h2>
            总收入
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <h2 v-if="statistics.totalOutcome >= 10000">{{statistics.totalOutcome | toTenThousand}}<small>万元</small></h2>
            <h2 v-else>{{statistics.totalOutcome || 0}}<small>元</small></h2>
            总支出
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <h2>{{statistics.userTotalCount || 0}}<small>个</small></h2>
            用户总数
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="box-card">
            <h2>{{statistics.taskTotalCount || 0}}<small>个</small></h2>
            任务总数
          </el-card>
          <el-card class="box-card">
            <h2>{{statistics.totalCertifiedUser || 0}}<small>个</small></h2>
            实名认证用户数
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>
<script>
import StatisticsProxy from '@/proxies/statistics';
import MessageProxy from '@/proxies/message';

export default {
  data() {
    return {
      statistics: {},
      page: 1,
      size: 10,
      messageList: [],
      isMessageLoading: false,
      totalRecordCount: 0,
      isLoading: false,
      finished: false,
    };
  },
  computed: {
    onGoingTaskCount() {
      if (isNaN(this.statistics.onGoingTaskCount) || isNaN(this.statistics.grabTaskCount)) {
        return 0;
      }
      return (this.statistics.onGoingTaskCount / this.statistics.grabTaskCount) * 100;
    },
    onReviewingTaskCount() {
      if (isNaN(this.statistics.onReviewingTaskCount) || isNaN(this.statistics.grabTaskCount)) {
        return 0;
      }
      return (this.statistics.onReviewingTaskCount / this.statistics.grabTaskCount) * 100;
    },
    finishTaskTotalCount() {
      if (isNaN(this.statistics.finishTaskTotalCount) || isNaN(this.statistics.grabTaskCount)) {
        return 0;
      }
      return (this.statistics.finishTaskTotalCount / this.statistics.grabTaskCount) * 100;
    },
    expiredTaskCount() {
      if (isNaN(this.statistics.expiredTaskCount) || isNaN(this.statistics.grabTaskCount)) {
        return 0;
      }
      return (this.statistics.expiredTaskCount / this.statistics.grabTaskCount) * 100;
    },
    rejectTaskCount() {
      if (isNaN(this.statistics.rejectTaskCount) || isNaN(this.statistics.grabTaskCount)) {
        return 0;
      }
      return (this.statistics.rejectTaskCount / this.statistics.grabTaskCount) * 100;
    },
    withdrawTotalMoney() {
      if (isNaN(this.statistics.withdrawTotalMoney) || isNaN(this.statistics.taskTotalPaySum)) {
        return 0;
      }
      return (this.statistics.withdrawTotalMoney / this.statistics.taskTotalPaySum) * 100;
    },
  },
  methods: {
    onGoingTaskCountFormat() {
      return `${this.statistics.onGoingTaskCount || 0}`;
    },
    onReviewingTaskCountFormat() {
      return `${this.statistics.onReviewingTaskCount || 0}`;
    },
    finishTaskTotalCountFormat() {
      return `${this.statistics.finishTaskTotalCount || 0}`;
    },
    expiredTaskCountFormat() {
      return `${this.statistics.expiredTaskCount || 0}`;
    },
    rejectTaskCountFormat() {
      return `${this.statistics.rejectTaskCount || 0}`;
    },
    withdrawTotalMoneyFormat() {
      const money = this.statistics.withdrawTotalMoney || 0;
      return `已提现${money >= 10000 ? `${(money / 10000).toFixed(3)}万元` : `${money}元`}`;
    },
    loadMore() {
      this.isMessageLoading = true;
      setTimeout(() => {
        this.getMessageList();
      }, 500);
    },
    async getMessageList() {
      const params = {
        userId: 1, // 1则表明为后台管理的消息
        page: this.page,
        size: this.size,
      };
      const res = await MessageProxy.list(params);
      this.isMessageLoading = false;
      if (res.success) {
        // 如果是获取第一页就清空整个列表TODO
        if (this.page === 1) {
          this.messageList = [];
        }
        this.page += 1;
        this.messageList = this.messageList.concat(res.data.list);
        this.totalRecordCount = res.data.totalCount;
        // 无数据
        if (this.messageList.length === this.totalRecordCount || !res.data.list.length) {
          this.finished = true;
        } else if (this.messageList.length < this.totalRecordCount) {
        // 还有数据
          this.finished = false;
        }
      }
    },
    async getStatistics() {
      this.isLoading = true;
      const res = await StatisticsProxy.get();
      this.isLoading = false;
      if (!res.fail) {
        this.statistics = res.data;
      }
    },
  },
  created() {
    this.getStatistics();
  },
};
</script>
<style lang="scss">
  .home-page {
    width: 100%;
    .flex {
      display: flex;
      align-items: center;
    }
    .dynamic {
      background-color: #fff;
      height: 270px;
      overflow-y: auto;
      .message-item {
        text-align: left;
        padding: 10px;
        &:hover {
          background-color: #fafafa;
        }
        .index {
          font-weight: bold;
          width: 30px;
          height: 30px;
          background-color: #eee;
          border-radius: 50%;
          text-align: center;
          line-height: 30px;
          margin-right: 10px;
          flex-shrink: 0;
        }
        .title {
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: center;
          small {
            color: #999;
            font-weight: 400;
          }
        }
        .content {
          width: 500px;
          overflow: hidden;
          color: #666;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    h2 {
      small {
        font-size: 14px;
      }
    }
    .box-card {
      text-align: center;
      border-radius: 2px;
      box-shadow: 0 0px 6px 0 rgba(180, 180, 180, 0.2);
      border: none;
      margin-bottom: 20px;
      position: relative;
      h3 {
        font-size: 26px;
        margin-top: 0;
        white-space: nowrap;
        small {
          font-size: 12px;
        }
      }
      .el-progress__text {
        font-size: 14px!important;
      }
      .progress {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
        .el-progress {
          flex-grow: 1;
        }
        span {
          margin-left: 5px;
          font-size: 12px;
          color: #666;
        }
      }
      .tips {
        position: absolute;
        top: 5px;
        right: 10px;
        color: #999;
        cursor: pointer;
      }
      &.flex-vertical {
        .el-card__body {
          height: 165px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      }
      &.green,
      &.blue,
      &.warning,
      &.danger,
      &.info {
        color: #fff;
        .tips {
          color: #fff;
        }
      }
      &.green {
        background-color: #67C23A;
      }
      &.blue {
        background-color: #409EFF;
      }
      &.warning {
        background-color: #E6A23C;
      }
      &.danger {
        background-color: #F56C6C;
      }
      &.info {
        background-color: #909399;
      }
      h2 {
        font-size: 24px;
        margin: 0;
      }
    }
  }
</style>
