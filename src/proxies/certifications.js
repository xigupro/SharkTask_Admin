import BaseProxy from './base';

/**
 * 用户实名认证的请求定义
 */

const apiUrlConf = {
  getCertificationList: '/certifications/get',
  getCertificationDetail: '/certifications/detail',
  updateCertification: '/certifications/update',
  reviewCertification: '/certifications/review',
  removeCertification: '/certifications/remove',
};

class CertificationManage extends BaseProxy {
  async getCertificationList(data) {
    const response = await this.submit('post', apiUrlConf.getCertificationList, data);
    return response;
  }
  async getCertificationDetail(data) {
    const response = await this.submit('post', apiUrlConf.getCertificationDetail, data);
    return response;
  }
  async updateCertification(data) {
    const response = await this.submit('post', apiUrlConf.updateCertification, data);
    return response;
  }
  async reviewCertification(data) {
    const response = await this.submit('post', apiUrlConf.reviewCertification, data);
    return response;
  }
  async removeCertification(data) {
    const response = await this.submit('post', apiUrlConf.removeCertification, data);
    return response;
  }
}
const CertificationManageProxy = new CertificationManage();
export default CertificationManageProxy;
