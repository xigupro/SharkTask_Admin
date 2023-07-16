import BaseProxy from './base';

/**
 * 系统管理的请求定义
 */

// 系统管理
const apiUrlConf = {
  get: '/system/get',
  update: '/system/update',
};

class System extends BaseProxy {
  async get(data) {
    const response = await this.submit('post', apiUrlConf.get, data);
    return response;
  }
  async update(data) {
    const response = await this.submit('post', apiUrlConf.update, data);
    return response;
  }
}
const SystemProxy = new System();
export default SystemProxy;
