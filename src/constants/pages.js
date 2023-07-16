// 客户端页面
// type=1内部链接，type=2三方链接，通常需要调方法生成，type=3自定义的外部链接
// 小程序暂时只支持type=1的链接
// params>type为param表示参数是以这种形式拼接/#/tasks/detail/2
// params>type为query表示参数是以这种形式拼接/#/tasks/detail?id=2
// 小程序始终以params>type为query的模式拼接参数
export default [
  { type: 1, name: '邀请用户', mp: '../invite/invite', h5: '/#/invite' },
  { type: 1, name: '我的邀请', mp: '../invite_list/invite_list', h5: '/#/invite/list' },
  { type: 1, name: '钱包', mp: '../my_wallet/my_wallet', h5: '/#/wallet/index' },
  { type: 1, name: '审核列表', mp: '../review_list/review_list', h5: '/#/review/list' },
  { type: 1, name: '充值', mp: '../recharge_money/recharge_money', h5: '/#/recharge/index' },
  { type: 1, name: '认证', mp: '../certification/certification', h5: '/#/certification/index' },
  { type: 1, name: '账号', mp: '../account/account', h5: '/#/account' },
  { type: 1, name: '我参与的', mp: '../my_task/my_task', h5: '/#/grabbed/index' },
  { type: 1, name: '关于', mp: '../about/about', h5: '/#/about' },
  { type: 1, name: '发布任务', mp: '../task_form/task_form', h5: '/#/task/form' },
  { type: 1, name: '自营任务', mp: '../self_tasks/self_tasks', h5: '/#/task/self' },
  { type: 1, name: '帮助中心', mp: '../help/index/index', h5: '/#/help' },
  { type: 1, name: '付费刷新', mp: '../refresh/refresh', h5: '/#/refresh/index' },
  { type: 1, name: '积分商城', mp: '../goods/list/index', h5: '/#/goods/list' },
  { type: 1, name: '合伙人专区', mp: '../partner/partner', h5: '/#/partner/index' },
  { type: 1, name: '签到', mp: '../sign/sign', h5: '/#/sign/index' },
  { type: 1, name: '客服', mp: 'kefu', h5: '' },
  {
    type: 1,
    name: '任务',
    mp: '../detail/detail',
    h5: '/#/tasks/detail',
    // type=param，则拼接了id的url为/#/tasks/detail/12
    params: { key: 'id', name: '任务ID', value: '', type: 'param' },
  },
  {
    type: 1,
    name: '分类',
    mp: '../tasks/tasks',
    h5: '/#/tasks',
    // type=query，则拼接了id的url为/#/tasks?id=12
    params: { key: 'id', name: '分类ID', value: '', type: 'query' },
  },
  // { type: 2, name: '闲玩', mp: '', h5: 'xianwan' },
  // { type: 2, name: '鱼玩', mp: '', h5: 'yuwan' },
  { type: 2, name: '多游', mp: '', h5: 'duoyou' },
  // 小程序自定义链接需设置业务域名
  { type: 3, name: '自定义', mp: '', h5: '' },
];

