import BaseProxy from './base';

/**
 * 商品管理
 */

class Goods extends BaseProxy {
  async getGoodsList(data) {
    const res = await this.submit('post', '/goods/list', data);
    return res;
  }

  async getOrderList(data) {
    const res = await this.submit('post', '/goods/orders', data);
    return res;
  }

  async getOrderDetail(data) {
    const res = await this.submit('post', '/goods/orderDetail', data);
    return res;
  }

  async cancelOrder(data) {
    const res = await this.submit('post', '/goods/cancelOrder', data);
    return res;
  }

  async deliver(data) {
    const res = await this.submit('post', '/goods/deliver', data);
    return res;
  }

  async removeGoods(data) {
    const res = await this.submit('post', '/goods/remove', data);
    return res;
  }

  async getGoodsDetail(data) {
    const res = await this.submit('post', '/goods/detail', data);
    return res;
  }

  async addGoods(data) {
    const res = await this.submit('post', '/goods/add', data);
    return res;
  }

  async updateGoods(data) {
    const res = await this.submit('post', '/goods/update', data);
    return res;
  }

  async updateStatus(data) {
    const res = await this.submit('post', '/goods/updateStatus', data);
    return res;
  }

  async getTypeList(data) {
    const res = await this.submit('post', '/goods/types', data);
    return res;
  }

  async removeType(data) {
    const response = await this.submit('post', '/goods/removeType', data);
    return response;
  }

  async addType(data) {
    const response = await this.submit('post', '/goods/addType', data);
    return response;
  }

  async updateType(data) {
    const response = await this.submit('post', '/goods/updateType', data);
    return response;
  }
}
const GoodsProxy = new Goods();
export default GoodsProxy;
