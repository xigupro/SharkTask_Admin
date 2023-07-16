import BaseProxy from './base';

const apiUrlConf = {
  list: '/refresh/list',
  add: '/refresh/add',
  update: '/refresh/update',
  remove: '/refresh/remove',
};

class AdministratorsManage extends BaseProxy {
  async list(data) {
    const response = await this.submit('post', apiUrlConf.list, data);
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
}
const AdministratorsManageProxy = new AdministratorsManage();
export default AdministratorsManageProxy;
