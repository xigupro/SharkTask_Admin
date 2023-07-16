import BaseProxy from './base';

/**
 * 签到
 */

const apiUrlConf = {
  list: '/sign/list',
  add: '/sign/add',
  update: '/sign/update',
  remove: '/sign/remove',
};

class Statistics extends BaseProxy {
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
const StatisticsProxy = new Statistics();
export default StatisticsProxy;
