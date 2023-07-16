import BaseProxy from './base';

/**
 * 管理员的请求定义
 */

// 管理员
const apiUrlConf = {
  getAdminList: '/administrator/list',
  addAdmin: '/administrator/add',
  updateAdmin: '/administrator/update',
  removeAdmin: '/administrator/remove',
  getLogList: '/log/list',
};

class AdministratorsManage extends BaseProxy {
  async getAdminList(data) {
    const response = await this.submit('post', apiUrlConf.getAdminList, data);
    return response;
  }
  async addAdmin(data) {
    const response = await this.submit('post', apiUrlConf.addAdmin, data);
    return response;
  }
  async updateAdmin(data) {
    const response = await this.submit('post', apiUrlConf.updateAdmin, data);
    return response;
  }
  async removeAdmin(data) {
    const response = await this.submit('post', apiUrlConf.removeAdmin, data);
    return response;
  }
  async getLogList(data) {
    const response = await this.submit('post', apiUrlConf.getLogList, data);
    return response;
  }
}
const AdministratorsManageProxy = new AdministratorsManage();
export default AdministratorsManageProxy;
