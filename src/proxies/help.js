import BaseProxy from './base';

/**
 * 帮助管理的请求定义
 */

// 帮助管理
const apiUrlConf = {
  list: '/help/list',
  typeList: '/help/typeList',
  detail: '/help/detail',
  add: '/help/add',
  update: '/help/update',
  remove: '/help/remove',
  // 删除分类
  removeType: '/help/removeType',
  // 添加分类
  addType: '/help/addType',
  // 更新分类
  updateType: '/help/updateType',
};

class Help extends BaseProxy {
  async list(data) {
    const response = await this.submit('post', apiUrlConf.list, data);
    return response;
  }
  async typeList(data) {
    const response = await this.submit('post', apiUrlConf.typeList, data);
    return response;
  }
  async detail(data) {
    const response = await this.submit('post', apiUrlConf.detail, data);
    return response;
  }
  async add(data) {
    const response = await this.submit('post', apiUrlConf.add, data);
    return response;
  }
  async update(data) {
    const response = await this.submit('post', apiUrlConf.update, data);
    return response;
  }
  async remove(data) {
    const response = await this.submit('post', apiUrlConf.remove, data);
    return response;
  }
  async removeType(data) {
    const response = await this.submit('post', apiUrlConf.removeType, data);
    return response;
  }
  async addType(data) {
    const response = await this.submit('post', apiUrlConf.addType, data);
    return response;
  }
  async updateType(data) {
    const response = await this.submit('post', apiUrlConf.updateType, data);
    return response;
  }
}
const HelpProxy = new Help();
export default HelpProxy;
