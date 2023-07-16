/* ============
 * Main File
 * ============
 *
 * Will initialize the application.
 */
import Vue from 'vue';

/* ============
 * Plugins
 * ============
 *
 * Import and bootstrap the plugins.
 */
import VuexRouterSync from 'vuex-router-sync';
import VueClipboard from 'vue-clipboard2';
import '@/utils/index';
// 公共组件
import components from '@/components/index';
import store from '@/store';
import { router } from '@/routes';
import AmapVue from '@amap/amap-vue';
import './theme/index.scss';
import './theme/element-ui';
// 字体图标
import './icons/iconfont';
import './icons/iconfont.css';
import * as filters from './filters';
import * as storage from './utils/storage';
import * as tools from './utils/tools';
import App from './App';

VuexRouterSync.sync(store, router);

/* ============
 * Main App
 * ============
 *
 * Last but not least, we import the main application.
 */


// 注册全局通过过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// 注册全局组件
Vue.use(components);
Vue.use(VueClipboard);


Vue.config.productionTip = false;

AmapVue.config.version = '2.0'; // 默认2.0，这里可以不修改
AmapVue.config.key = window.API_CONFIG['amap_key'];
AmapVue.config.plugins = [
  'AMap.ToolBar',
  'AMap.MoveAnimation',
  'AMap.Geolocation',
  // 在此配置你需要预加载的插件，如果不配置，在使用到的时候会自动异步加载
];
Vue.use(AmapVue);

store.dispatch('auth/check');
Vue.prototype.$storage = storage; // 存储
Vue.prototype.$tools = tools; // 存储
/* eslint-disable no-new */
new Vue({
  /**
   * Bind the Vue instance to the HTML.
   */
  el: '#app',

  /**
   * The router.
   */
  router,

  /**
   * The Vuex store.
   */
  store,

  /**
   * Will render the application.
   *
   * @param {Function} h Will create an element.
   */
  render: h => h(App),
});
