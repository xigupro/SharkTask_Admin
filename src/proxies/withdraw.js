import BaseProxy from './base';

/**
 * 用户提现
 */

const paths = {
  // 获取提现列表
  getWithdraw: '/withdraw/list',
  // 驳回提现
  withdrawReject: '/withdraw/reject',
  // 通过审核
  withdrawResolve: '/withdraw/resolve',
  // 通过审核，支付宝付款
  withdrawResolveByAlipay: '/withdraw/resolveByAlipay',
  // 导出提现列表
  exportAll: '/withdraw/exportAll',
};

class WithdrawManage extends BaseProxy {
  async getWithdraw(data) {
    const response = await this.submit('post', paths.getWithdraw, data);
    return response;
  }
  async withdrawReject(data) {
    const response = await this.submit('post', paths.withdrawReject, data);
    return response;
  }
  async withdrawResolve(data) {
    const response = await this.submit('post', paths.withdrawResolve, data);
    return response;
  }
  async withdrawResolveByAlipay(data) {
    const response = await this.submit('post', paths.withdrawResolveByAlipay, data);
    return response;
  }
  async exportAll(data) {
    const response = await this.submit('post', paths.exportAll, data);
    return response;
  }
}
const WithdrawManageProxy = new WithdrawManage();
export default WithdrawManageProxy;
