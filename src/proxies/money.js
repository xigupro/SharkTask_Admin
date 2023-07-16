
import BaseProxy from './base';

/**
 * 金钱请求定义
 */

const apiUrlConf = {
  add: '/money/add',
  reduce: '/money/reduce',
  stream: '/money/stream',
  exportAll: '/money/exportAll',
};

class MoneyApi extends BaseProxy {
  // 加钱
  async add(data) {
    const response = await this.submit('post', apiUrlConf.add, data);
    return response;
  }
  // 减钱
  async reduce(data) {
    const response = await this.submit('post', apiUrlConf.reduce, data);
    return response;
  }
  // 流水
  async stream(data) {
    const response = await this.submit('post', apiUrlConf.stream, data);
    return response;
  }
  // 导出流水
  async exportAll(data) {
    const response = await this.submit('post', apiUrlConf.exportAll, data);
    return response;
  }
}
const MoneyProxy = new MoneyApi();
export default MoneyProxy;
