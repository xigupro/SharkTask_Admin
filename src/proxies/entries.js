import BaseProxy from './base';

const apiUrlConf = {
  list: '/entries/list',
  remove: '/entries/remove',
  add: '/entries/add',
  update: '/entries/update',
};

class Banners extends BaseProxy {
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
const BannersProxy = new Banners();
export default BannersProxy;
