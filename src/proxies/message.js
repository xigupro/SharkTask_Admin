import BaseProxy from './base';

const apiUrlConf = {
  getNoticeList: '/messages/getNoticeList',
  list: '/messages/list',
  updateNotice: '/messages/updateNotice',
  addNotice: '/messages/addNotice',
  remove: '/messages/remove',
};

class Message extends BaseProxy {
  async getNoticeList(data) {
    const response = await this.submit('post', apiUrlConf.getNoticeList, data);
    return response;
  }

  async list(data) {
    const response = await this.submit('post', apiUrlConf.list, data);
    return response;
  }

  async updateNotice(data) {
    const response = await this.submit('post', apiUrlConf.updateNotice, data);
    return response;
  }

  async addNotice(data) {
    const response = await this.submit('post', apiUrlConf.addNotice, data);
    return response;
  }

  async remove(data) {
    const response = await this.submit('post', apiUrlConf.remove, data);
    return response;
  }
}
const MessageProxy = new Message();
export default MessageProxy;
