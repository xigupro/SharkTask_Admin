import BaseProxy from './base';

/**
 * 轮播管理的请求定义
 */

// 轮播管理
const apiUrlConf = {
  getBanners: '/banners/',
  removeBanner: '/banners/remove',
  addBanner: '/banners/add',
  updateBanner: '/banners/update',
};

class Banners extends BaseProxy {
  async getBanners(data) {
    const response = await this.submit('post', apiUrlConf.getBanners, data);
    return response;
  }
  async addBanner(data) {
    const response = await this.submit('post', apiUrlConf.addBanner, data);
    return response;
  }
  async updateBanner(data) {
    const response = await this.submit('post', apiUrlConf.updateBanner, data);
    return response;
  }
  async removeBanner(data) {
    const response = await this.submit('post', apiUrlConf.removeBanner, data);
    return response;
  }
}
const BannersProxy = new Banners();
export default BannersProxy;
