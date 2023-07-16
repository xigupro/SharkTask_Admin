/* ============
 * Axios
 * ============
 *
 * Promise based HTTP client for the browser and node.js.
 * 用作执行ajax请求.
 *
 * https://github.com/mzabriskie/axios
 */

import Vue from 'vue';
import Axios from 'axios';
import { Notification } from 'element-ui';
import Store from '@/store';
import qs from 'qs';
import { getItem } from '@/utils/storage';
import { encryptedData } from '@/utils/tools';
import {
  defaultTimeout,
  defaultDataType,
  jsonType,
} from '@/proxies/ajax.config';

// 接口地址
Axios.defaults.baseURL = window.API_CONFIG['app'];
// 超时时间
Axios.defaults.timeout = defaultTimeout;
// Axios.defaults.headers.common.Accept = defaultDataType;
Axios.defaults.headers['Content-Type'] = defaultDataType;

Axios.interceptors.request.use(
  (config) => {
    if (config.url !== '/login') {
      const session = getItem('session');
      if (!session || session === 'null' || session === 'undefined') {
        Store.dispatch('auth/logout');
      }

      config.headers.skey = session;
      if (config.dataType) { // 手动设置请求类型
        let requestType = ''; // 请求类型
        switch (config.dataType.toLowerCase()) {
          case 'json':
            requestType = jsonType; // json
            break;
          case 'form':
            requestType = defaultDataType; // form
            break;
          default:
            break;
        }
        config.headers['Content-Type'] = requestType;
      }
      if (config.method.toLowerCase() === 'post'
          && config.headers['Content-Type'] === defaultDataType) {
        if (config.data) {
          if (config.data.encryptedResult) {
            delete config.data.encryptedResult;
          }
          const encryptedResult = encryptedData(qs.stringify(config.data));
          if (encryptedResult) {
            config.data.encryptedResult = encryptedResult;
          }
        }
        config.data = qs.stringify(config.data);
      }
    }
    return config;
  },
  (err) => {
    Notification({
      type: 'error',
      title: '错误',
      message: err || '发起请求出错',
    });
    throw new Error(err);
  },
);

/**
 * 响应体拦截器
 */
Axios.interceptors.response.use(
  (res) => {
    const data = res.data;
    const code = data.code;

    if (/^2/.test(res.status) && code === '10000') {
      // 状态码是2开头，并且code等于10000则说明成功，这里的字段需要根据接口返回的数据格式来决定
      return data;
    } else if (code === '10005') {
      // token invalid
      Store.dispatch('auth/logout');
    }
    // 其他不成功情况
    if (code !== '10000') {
      console.error(data.message);
    }
    Notification({
      type: 'error',
      title: '错误',
      message: data.message || '服务器错误',
    });
    return Object.assign({}, data, { fail: true });
  },
  (err) => {
    console.error(err);
    const message = err.request ? '网络环境太差，请稍后再试' : err.response.data.message || '服务器错误';
    Notification({
      type: 'error',
      title: '错误',
      message: message,
    });
    return { fail: true, success: false };
  },
);
// 将Axios绑定到Vue
Vue.$http = Axios;
Object.defineProperty(Vue.prototype, '$http', {
  get() {
    return Axios;
  },
});
