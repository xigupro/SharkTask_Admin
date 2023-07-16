// 管理员权限
export default [
  {
    id: 'home',
    name: '仪表盘',
    child: [
      {
        id: 'todo',
        name: '待办',
      },
      {
        id: 'message',
        name: '最新动态',
      },
      {
        id: 'today',
        name: '今日数据',
      },
      {
        id: 'overview',
        name: '数据概览',
      },
    ],
  },
  {
    id: 'banners',
    name: '轮播图',
    child: [
      {
        id: 'add',
        name: '添加轮播图',
      },
      {
        id: 'edit',
        name: '修改',
      },
      {
        id: 'delete',
        name: '删除',
      },
    ],
  },
  {
    id: 'entries',
    name: '菜单',
    child: [
      {
        id: 'add',
        name: '添加菜单',
      },
      {
        id: 'edit',
        name: '修改',
      },
      {
        id: 'delete',
        name: '删除',
      },
    ],
  },
  {
    id: 'messages',
    name: '公告',
    child: [
      {
        id: 'add',
        name: '添加公告',
      },
      {
        id: 'edit',
        name: '修改',
      },
      {
        id: 'delete',
        name: '删除',
      },
    ],
  },
  {
    id: 'tasks',
    name: '任务',
    child: [
      {
        id: 'add',
        name: '添加任务',
      },
      {
        id: 'edit',
        name: '修改',
      },
      {
        id: 'delete',
        name: '删除',
      },
      {
        id: 'status',
        name: '上下架',
      },
      {
        id: 'grabList',
        name: '领取列表',
      },
      {
        id: 'reviewList',
        name: '交单链接',
      },
      {
        id: 'review',
        name: '审核',
      },
      {
        id: 'type',
        name: '分类管理',
      },
      {
        id: 'addType',
        name: '添加分类',
      },
      {
        id: 'editType',
        name: '编辑分类',
      },
      {
        id: 'deleteType',
        name: '删除分类',
      },
      {
        id: 'price',
        name: '刷新套餐',
      },
      {
        id: 'addPrice',
        name: '添加刷新套餐',
      },
      {
        id: 'editPrice',
        name: '编辑价格',
      },
      {
        id: 'deletePrice',
        name: '删除价格',
      },
    ],
  },
  {
    id: 'review',
    name: '审核',
    child: [
      {
        id: 'detail',
        name: '详情',
      },
      {
        id: 'delete',
        name: '删除',
      },
      {
        id: 'reject',
        name: '驳回',
      },
      {
        id: 'resolve',
        name: '审核通过',
      },
      {
        id: 'appeal',
        name: '审核申诉',
      },
      {
        id: 'handlingAppeal',
        name: '处理申诉',
      },
    ],
  },
  {
    id: 'goods',
    name: '商城',
    child: [
      {
        id: 'add',
        name: '添加商品',
      },
      {
        id: 'edit',
        name: '修改',
      },
      {
        id: 'delete',
        name: '删除',
      },
      {
        id: 'status',
        name: '上下架',
      },
      {
        id: 'orders',
        name: '订单管理',
      },
      {
        id: 'orderDeliver',
        name: '订单发货',
      },
      {
        id: 'orderCancel',
        name: '订单取消',
      },
      {
        id: 'type',
        name: '分类管理',
      },
      {
        id: 'addType',
        name: '添加分类',
      },
      {
        id: 'editType',
        name: '编辑分类',
      },
      {
        id: 'deleteType',
        name: '删除分类',
      },
    ],
  },
  {
    id: 'finance',
    name: '财务',
    child: [
      {
        id: 'exportWithdraw',
        name: '导出提现记录',
      },
      {
        id: 'exportStream',
        name: '导出金额流水',
      },
      {
        id: 'resolve',
        name: '提现通过',
      },
      {
        id: 'reject',
        name: '提现驳回',
      },
      {
        id: 'stream',
        name: '金额流水',
      },
    ],
  },
  {
    id: 'users',
    name: '用户',
    child: [
      {
        id: 'inviteList',
        name: '邀请的用户',
      },
      {
        id: 'moneyStream',
        name: '金额流水',
      },
      {
        id: 'invitationAward',
        name: '邀请奖励流水',
      },
      {
        id: 'scoreStream',
        name: '积分流水',
      },
      {
        id: 'editUser',
        name: '修改用户',
      },
      {
        id: 'recharge',
        name: '充值',
      },
      {
        id: 'reduce',
        name: '扣钱',
      },
      {
        id: 'editScore',
        name: '积分加减',
      },
      {
        id: 'freeze',
        name: '冻结',
      },
      {
        id: 'loginIps',
        name: '登录日志',
      },
      {
        id: 'certificationReview',
        name: '认证审核',
      },
      {
        id: 'handlingCertificationReview',
        name: '认证审核操作',
      },
      {
        id: 'certificationDetail',
        name: '认证详情',
      },
      {
        id: 'deleteCertification',
        name: '删除认证',
      },
      {
        id: 'userLevel',
        name: '用户等级设置',
      },
      {
        id: 'editUserLevel',
        name: '修改用户等级',
      },
      {
        id: 'exportUserList',
        name: '导出用户列表',
      },
    ],
  },
  {
    id: 'help',
    name: '帮助中心',
    child: [
      {
        id: 'add',
        name: '添加帮助文章',
      },
      {
        id: 'edit',
        name: '编辑帮助文章',
      },
      {
        id: 'delete',
        name: '删除帮助文章',
      },
      {
        id: 'type',
        name: '帮助文章分类管理',
      },
      {
        id: 'addType',
        name: '添加帮助文章分类',
      },
      {
        id: 'editType',
        name: '编辑帮助文章分类',
      },
      {
        id: 'deleteType',
        name: '删除帮助文章分类',
      },
    ],
  },
  {
    id: 'administrators',
    name: '管理员',
    child: [
      {
        id: 'add',
        name: '添加管理员',
      },
      {
        id: 'edit',
        name: '编辑',
      },
      {
        id: 'delete',
        name: '删除',
      },
      {
        id: 'logs',
        name: '操作日志',
      },
    ],
  },
  {
    id: 'system',
    name: '系统',
    child: [
      {
        id: 'base',
        name: '基础设置',
      },
      {
        id: 'task',
        name: '任务设置',
      },
      {
        id: 'sort',
        name: '竞价排名',
      },
      {
        id: 'entry',
        name: '功能开关',
      },
      {
        id: 'invite',
        name: '邀请设置',
      },
      {
        id: 'withdraw',
        name: '提现设置',
      },
      {
        id: 'recharge',
        name: '充值设置',
      },
      {
        id: 'score',
        name: '积分设置',
      },
      {
        id: 'share',
        name: '分享转发',
      },
      {
        id: 'agreement',
        name: '平台协议',
      },
      {
        id: 'update',
        name: '应用更新',
      },
      {
        id: 'pay',
        name: '支付设置',
      },
      {
        id: 'ad',
        name: 'APP广告',
      },
    ],
  },
];
