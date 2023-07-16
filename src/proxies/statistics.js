import BaseProxy from './base';

/**
 * 仪表盘统计
 */

const apiUrlConf = {
  get: '/statistics/getDashboardData',
};

class Statistics extends BaseProxy {
  async get(data) {
    const response = await this.submit('post', apiUrlConf.get, data);
    return response;
  }
}
const StatisticsProxy = new Statistics();
export default StatisticsProxy;
