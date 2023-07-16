
import BaseProxy from './base';

/**
 * 通用的请求定义
 */

// 接口地址
const apiUrlConf = {
  // 获取七牛上传token
  getQiniuUploadToken: '/upload/token',
};

class CommonApi extends BaseProxy {
  // 获取七牛上传token
  async getQiniuUploadToken() {
    const res = await this.submit('post', apiUrlConf.getQiniuUploadToken);
    return res;
  }
}
const CommonProxy = new CommonApi();
export default CommonProxy;
