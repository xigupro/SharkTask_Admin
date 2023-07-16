<template>
  <div
    class="xg-main certification-page"
    v-loading="isListLoading">
    <div class="filter">
      <el-form :inline="true">
        <el-form-item>
          <el-date-picker
            class="form-item"
            v-model="searchForm.createdAt"
            clearable
            type="datetime"
            format="yyyy-MM-dd"
            placeholder="提交时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="用户ID" v-model="searchForm.userId" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="真实姓名" v-model="searchForm.truename" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="手机号" v-model="searchForm.phone" clearable class="form-item"></el-input>
        </el-form-item>
        <el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" clearable placeholder="状态"  @change="search" class="form-item">
            <el-option
              v-for="item in status"
              :key="`status${item.value}`"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
          <el-button plain type="primary" @click="search(searchForm)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      v-show="list.length > 0"
      class="xg-type__list">
      <el-table
        ref="certificationTable"
        :data="list"
        >
        <el-table-column
          prop="id"
          width="60px"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="user_id"
          width="80px"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="truename"
          width="100px"
          label="真实姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          width="120px"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="created_at"
          key="created_at"
          label="提交时间">
          <template slot-scope="scope">
            {{scope.row.created_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updated_at"
          key="updated_at"
          show-overflow-tooltip
          label="更新时间">
          <template slot-scope="scope">
            {{scope.row.updated_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="reviewed_at"
          key="reviewed_at"
          show-overflow-tooltip
          label="审核时间">
          <template slot-scope="scope">
            {{scope.row.reviewed_at | transLocalTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          width="100px"
          label="审核状态">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.status == 1">通过</el-tag>
            <el-tag size="small" type="info" v-else-if="scope.row.status == 2">驳回</el-tag>
            <el-tag size="small" type="primary" v-else>待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="60px"
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
                    v-if="!scope.row.status && $tools.checkAdminPower('users', 'handlingCertificationReview')"
                    class="xg-popover-list__item"
                    @click.native="detail(scope.row)">
                    <span class="icon iconfont icon-edit-square"></span>
                    审核
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-else-if="$tools.checkAdminPower('users', 'certificationDetail')"
                    class="xg-popover-list__item"
                    @click.native="detail(scope.row)">
                    <span class="icon iconfont icon-detail"></span>
                    详情
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="$tools.checkAdminPower('users', 'deleteCertification')"
                    class="xg-popover-list__item"
                    @click.native="remove(scope.row)">
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
        @size-change="getCertificationList"
        @current-change="getCertificationList">
      </el-pagination>
    </div>
    <el-dialog title="认证资料" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" style="max-width:500px" label-width="120px">
        <el-form-item label="真实姓名" prop="truename">
          <el-input v-model="form.truename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="证件" prop="certificate">
          <a target="_blank" :href="form.certificate | getQiniuFullUrl">
            <img :src="form.certificate | getQiniuFullUrl" style="height: 100px;">
          </a>
        </el-form-item>
        <!-- <el-form-item label="微信收款码" prop="wxpay_code">
          <a target="_blank" :href="form.wxpay_code | getQiniuFullUrl" v-if="form.wxpay_code">
            <img :src="form.wxpay_code | getQiniuFullUrl" style="height: 100px;">
          </a>
        </el-form-item>
        <el-form-item label="支付宝收款码" prop="alipay_code" v-if="form.alipay_code">
          <a target="_blank" :href="form.alipay_code | getQiniuFullUrl">
            <img :src="form.alipay_code | getQiniuFullUrl" style="height: 100px;">
          </a>
        </el-form-item> -->
        <el-form-item label="审核结果" prop="result">
          <el-input v-model="form.result" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="form.status == 0">
        <el-button size="medium" type="primary" @click="review(1)">通过</el-button>
        <el-button size="medium" @click="review(2)">驳回</el-button>
      </div>
    </el-dialog>
    <!-- 列表为空时 -->
    <no-record v-if="showNoRecord"/>
  </div>
</template>
<script>
import CheckForm from '@/mixins/checkform';
import PAGECONFIG from '@/constants/pagination';
import CertificationManageProxy from '@/proxies/certifications';

export default {
  name: 'certification-list',
  data() {
    return {
      searchForm: {},
      form: {
        truename: '',
        phone: '',
        remark: '',
        certificate: '',
        wxpay_code: '',
        alipay_code: '',
        result: '',
        userId: '',
        idCard: '',
      },
      status: [{
        label: '待审核',
        value: 0,
      }, {
        label: '审核通过',
        value: 1,
      }, {
        label: '审核驳回',
        value: 2,
      }],
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
      rules: {
        truename: [
          { required: true, message: '请输入真实姓名', trigger: 'change' },
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'change' },
        ],
      },
    };
  },
  mixins: [
    // 表单校验
    CheckForm,
  ],
  computed: {
    showNoRecord() {
      // 列表为空，且不是正在加载中
      return this.list.length < 1 && !this.isListLoading;
    },
  },
  methods: {
    reset() {
      this.searchForm = {};
      this.getCertificationList();
    },
    search(params) {
      this.page = 1;
      this.getCertificationList(params);
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    detail(data) {
      this.showDialog();
      this.form.truename = data.truename;
      this.form.phone = data.phone;
      this.form.remark = data.remark;
      this.form.idCard = data.id_card;
      this.form.certificate = data.certificate;
      this.form.wxpay_code = data.wxpay_code;
      this.form.alipay_code = data.alipay_code;
      this.form.userId = data.user_id;
      this.form.result = data.result || '';
      this.form.status = data.status;
    },
    // 获取列表
    async getCertificationList() {
      const params = {
        page: this.page,
        size: this.size,
        ...this.searchForm,
      };
      this.isListLoading = true;
      const res = await CertificationManageProxy.getCertificationList(params);
      setTimeout(() => {
        this.isListLoading = false;
      }, 600);
      if (res.success) {
        this.list = res.data.list;
        this.totalRecordCount = res.data.totalCount;
      }
    },
    async review(status) {
      if (!this.CheckForm('form')) {
        return;
      }
      const params = {
        ...this.form,
        status,
        reviewedAt: new Date().getTime(),
      };
      const res = await CertificationManageProxy.reviewCertification(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getCertificationList();
        this.dialogFormVisible = false;
      }
    },
    async remove(row) {
      const params = {
        id: row.id,
        userId: row.user_id,
      };
      const res = await CertificationManageProxy.removeCertification(params);
      if (!res.fail) {
        this.$notify.success({
          title: '成功',
          message: res.message,
        });
        // 刷新列表
        this.getCertificationList();
        this.dialogFormVisible = false;
      }
    },
  },
  created() {
    this.getCertificationList();
  },
};
</script>
<style lang="scss">
.certification-page {
  .filter {
    margin: 20px 0;
    .el-form-item {
      margin-bottom: 0;
      &:last-child {
        margin-right: 0;
      }
      .form-item {
        width: 160px;
      }
    }
  }
}
</style>
