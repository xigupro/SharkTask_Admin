import BaseProxy from './base';

/**
 * 用户管理的请求定义
 */

// 接口地址
const apiUrlConf = {
  // 获取用户列表
  getUserList: '/user/all',
  exportAll: '/user/exportAll',
  getInvitedUsers: '/user/invitedUsers',
  // 更新用户
  updateUser: '/user/update',
  updateScore: '/score/add',
  scoreStream: '/score/stream',
  getInviteStream: '/invite/getInviteStream',
  getLoginIps: '/login/ips',
  getLevelList: '/user/getLevelList',
  updateLevel: '/user/updateLevel',
};

class UserManage extends BaseProxy {
  // 获取用户列表
  async getUserList(data) {
    const response = await this.submit('post', apiUrlConf.getUserList, data);
    return response;
  }
  // 导出用户列表
  async exportAll(data) {
    const response = await this.submit('post', apiUrlConf.exportAll, data);
    return response;
  }
  // 获取已邀请用户列表
  async getInvitedUsers(data) {
    const response = await this.submit('post', apiUrlConf.getInvitedUsers, data);
    return response;
  }
  // 更新用户
  async updateUser(data) {
    const response = await this.submit('post', apiUrlConf.updateUser, data);
    return response;
  }
  // 加减积分
  async updateScore(data) {
    const response = await this.submit('post', apiUrlConf.updateScore, data);
    return response;
  }
  // 积分流水
  async scoreStream(data) {
    const response = await this.submit('post', apiUrlConf.scoreStream, data);
    return response;
  }
  // 邀请奖励流水
  async getInviteStream(data) {
    const response = await this.submit('post', apiUrlConf.getInviteStream, data);
    return response;
  }
  // 用户登录日志
  async getLoginIps(data) {
    const response = await this.submit('post', apiUrlConf.getLoginIps, data);
    return response;
  }
  // 获取等级列表
  async getLevelList(data) {
    const response = await this.submit('post', apiUrlConf.getLevelList, data);
    return response;
  }
  // 更新等级
  async updateLevel(data) {
    const response = await this.submit('post', apiUrlConf.updateLevel, data);
    return response;
  }
}
const UserManageProxy = new UserManage();
export default UserManageProxy;
