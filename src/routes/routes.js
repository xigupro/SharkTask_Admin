/* ============
 * Routes File
 * ============
 *
 * The routes and redirects are defined in this file.
 */
/* Layout */
import Layout from '@/components/common/layouts/default';

/**
 * meta里字段释义
 * 1. auth 是否需要授权才能访问该页面，默认需要授权（不设置或设置为true为需要授权，false为不需授权）
 * 2. menuName 菜单项的名字，面包屑导航时显示该名字
 * 3. parentMenuId 父菜单id，面包屑导航时用于跳转到父级菜单地址
 * 4. showLeftbar 是否显示左边菜单栏，默认显示，（不设置或设置为true为显示，false为不显示）
 * 5. showBreadcrumb 是否显示面包屑导航，默认显示（值同showLeftbar的设置）
 */

export default [
  {
    path: '/login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/login/index'),
    name: 'login',
    meta: {
      auth: false,
    },
  },
  {
    path: '/review',
    redirect: '/review/list',
    name: 'review',
    component: Layout,
    meta: {
      auth: true,
      menuName: '任务审核',
      menuId: 'review',
    },
    children: [
      {
        path: 'list',
        name: 'review.list',
        component: () =>
          import(/* webpackChunkName: "review.list" */ '@/views/review/list'),
        meta: {
          auth: true,
          menuName: '审核列表',
          keepAlive: true,
          parentMenuId: 'review',
        },
      },
      {
        path: 'appeals',
        name: 'review.appeals',
        component: () =>
          import(/* webpackChunkName: "review.appeals" */ '@/views/review/appeals'),
        meta: {
          auth: true,
          menuName: '申诉',
          parentMenuId: 'review',
        },
      },
    ],
  },
  // 财务
  {
    path: '/finance',
    redirect: '/finance/list',
    name: 'finance',
    component: Layout,
    meta: {
      auth: true,
      menuName: '财务',
      menuId: 'finance',
    },
    children: [
      {
        path: 'list',
        name: 'finance.list',
        component: () =>
          import(/* webpackChunkName: "finance.list" */ '@/views/finance/list'),
        meta: {
          auth: true,
          menuName: '提现列表',
          keepAlive: true,
          parentMenuId: 'finance',
        },
      },
      {
        path: 'stream',
        name: 'finance.stream',
        component: () =>
          import(/* webpackChunkName: "finance.stream" */ '@/views/finance/stream'),
        meta: {
          auth: true,
          menuName: '金额流水',
          parentMenuId: 'finance',
        },
      },
    ],
  },
  // 轮播管理
  {
    path: '/banners',
    redirect: '/banners/list',
    name: 'banners',
    component: Layout,
    meta: {
      auth: true,
      menuName: '轮播管理',
      menuId: 'banners',
    },
    children: [
      {
        path: 'list',
        name: 'banners.list',
        component: () =>
          import(/* webpackChunkName: "banners.list" */ '@/views/banners/list'),
        meta: {
          auth: true,
          menuName: '轮播列表',
          keepAlive: true,
          parentMenuId: 'banners',
        },
      },
    ],
  },
  // 菜单管理
  {
    path: '/entries',
    redirect: '/entries/list',
    name: 'entries',
    component: Layout,
    meta: {
      auth: true,
      menuName: '菜单管理',
      menuId: 'entries',
    },
    children: [
      {
        path: 'list',
        name: 'entries.list',
        component: () =>
          import(/* webpackChunkName: "entries.list" */ '@/views/entries/list'),
        meta: {
          auth: true,
          menuName: '菜单列表',
          keepAlive: true,
          parentMenuId: 'banners',
        },
      },
    ],
  },
  // user
  {
    path: '/users',
    redirect: '/users/list',
    name: 'users',
    component: Layout,
    meta: {
      auth: true,
      menuName: '用户管理',
      menuId: 'users',
    },
    children: [
      {
        path: 'list',
        name: 'user.list',
        component: () =>
          import(/* webpackChunkName: "user.list" */ '@/views/users/list'),
        meta: {
          auth: true,
          menuName: '用户列表',
          keepAlive: true,
          parentMenuId: 'users',
        },
      },
      {
        path: 'invited',
        name: 'user.invited',
        component: () =>
          import(/* webpackChunkName: "user.invited" */ '@/views/users/invited'),
        meta: {
          auth: true,
          menuName: '已邀请的用户',
          parentMenuId: 'users',
        },
      },
      {
        path: 'stream',
        name: 'user.stream',
        component: () =>
          import(/* webpackChunkName: "user.stream" */ '@/views/users/stream'),
        meta: {
          auth: true,
          menuName: '金额流水',
          parentMenuId: 'users',
        },
      },
      {
        path: 'score',
        name: 'user.score',
        component: () =>
          import(/* webpackChunkName: "user.score" */ '@/views/users/score-stream'),
        meta: {
          auth: true,
          menuName: '积分流水',
          parentMenuId: 'users',
        },
      },
      {
        path: 'ips',
        name: 'user.ips',
        component: () =>
          import(/* webpackChunkName: "user.ips" */ '@/views/users/login-ips'),
        meta: {
          auth: true,
          menuName: '登录日志',
          parentMenuId: 'users',
        },
      },
      {
        path: 'invite',
        name: 'user.invite',
        component: () =>
          import(/* webpackChunkName: "user.invite" */ '@/views/users/invite-stream'),
        meta: {
          auth: true,
          menuName: '邀请奖励流水',
          parentMenuId: 'users',
        },
      },
      {
        path: 'certifications',
        name: 'user.certifications',
        component: () =>
          import(/* webpackChunkName: "user.certifications" */ '@/views/users/certifications'),
        meta: {
          auth: true,
          menuName: '认证审核',
          parentMenuId: 'users',
        },
      },
      {
        path: 'level',
        name: 'user.level',
        component: () =>
          import(/* webpackChunkName: "user.level" */ '@/views/users/level'),
        meta: {
          auth: true,
          menuName: '用户等级',
          parentMenuId: 'users',
        },
      },
    ],
  },
  // home
  {
    path: '/home',
    redirect: '/home/index',
    name: 'home',
    component: Layout,
    meta: {
      auth: false,
      menuName: '仪表盘',
      menuId: 'home',
    },
    children: [
      {
        path: 'index',
        name: 'home.index',
        component: () =>
          import(/* webpackChunkName: "home.index" */ '@/views/home/index'),
        meta: {
          menuName: '仪表盘',
          parentMenuId: 'home',
          showBreadcrumb: false,
        },
      },
    ],
  },
  // 公告
  {
    path: '/message',
    redirect: '/message/list',
    name: 'message',
    component: Layout,
    meta: {
      auth: true,
      menuName: '公告',
      menuId: 'message',
    },
    children: [
      {
        path: 'list',
        name: 'message.list',
        component: () =>
          import(/* webpackChunkName: "message.list" */ '@/views/message/list'),
        meta: {
          auth: true,
          menuName: '列表',
          parentMenuId: 'message',
        },
      },
    ],
  },
  // help
  {
    path: '/help',
    redirect: '/help/list',
    name: 'help',
    component: Layout,
    meta: {
      auth: true,
      menuName: '帮助中心',
      menuId: 'help',
    },
    children: [
      {
        path: 'list',
        name: 'help.list',
        component: () =>
          import(/* webpackChunkName: "help.list" */ '@/views/help/list'),
        meta: {
          auth: true,
          menuName: '列表',
          keepAlive: true,
          parentMenuId: 'help',
        },
      },
      {
        path: 'type',
        name: 'help.type',
        component: () =>
          import(/* webpackChunkName: "help.type" */ '@/views/help/type'),
        meta: {
          auth: true,
          menuName: '帮助文章分类',
          parentMenuId: 'help',
        },
      },
      {
        path: 'add',
        name: 'help.add',
        component: () =>
          import(/* webpackChunkName: "help.add" */ '@/views/help/form'),
        meta: {
          auth: true,
          menuName: '添加帮助文章',
          parentMenuId: 'help',
        },
      },
      {
        path: 'edit/:id',
        name: 'help.edit',
        component: () =>
          import(/* webpackChunkName: "help.edit" */ '@/views/help/form'),
        meta: {
          auth: true,
          menuName: '修改帮助文章',
          parentMenuId: 'help',
        },
      },
    ],
  },
  // administrators
  {
    path: '/administrators',
    redirect: '/administrators/list',
    name: 'administrators',
    component: Layout,
    meta: {
      auth: true,
      menuName: '管理员',
      menuId: 'administrators',
    },
    children: [
      {
        path: 'list',
        name: 'administrators.list',
        component: () =>
          import(/* webpackChunkName: "administrators.list" */ '@/views/administrators/list'),
        meta: {
          auth: true,
          menuName: '列表',
          keepAlive: true,
          parentMenuId: 'administrators',
        },
      },
      {
        path: 'logs',
        name: 'administrators.logs',
        component: () =>
          import(/* webpackChunkName: "administrators.logs" */ '@/views/administrators/logs'),
        meta: {
          auth: true,
          menuName: '操作日志',
          parentMenuId: 'administrators',
        },
      },
    ],
  },

  // system
  {
    path: '/system',
    redirect: '/system/setting',
    name: 'system',
    component: Layout,
    meta: {
      auth: true,
      menuName: '系统',
      menuId: 'system',
    },
    children: [
      {
        path: 'setting',
        name: 'system.setting',
        component: () =>
          import(/* webpackChunkName: "system.setting" */ '@/views/system/setting'),
        meta: {
          auth: true,
          menuName: '设置',
          keepAlive: true,
          parentMenuId: 'system',
        },
      },
    ],
  },
  // 任务管理
  {
    path: '/tasks',
    redirect: '/tasks/list',
    name: 'tasks',
    component: Layout,
    meta: {
      auth: true,
      menuName: '任务管理',
      menuId: 'tasks',
    },
    children: [
      {
        path: 'list',
        name: 'task.list',
        component: () =>
          import(/* webpackChunkName: "task.list" */ '@/views/tasks/list'),
        meta: {
          auth: true,
          menuName: '任务列表',
          keepAlive: true,
          parentMenuId: 'tasks',
        },
      },
      {
        path: 'review/:taskId',
        name: 'task.review',
        component: () =>
          import(/* webpackChunkName: "task.review" */ '@/views/tasks/review'),
        meta: {
          auth: true,
          menuName: '领取列表',
          parentMenuId: 'tasks',
        },
      },
      {
        path: 'type',
        name: 'task.type',
        component: () =>
          import(/* webpackChunkName: "task.type" */ '@/views/tasks/type'),
        meta: {
          auth: true,
          menuName: '任务分类',
          parentMenuId: 'tasks',
        },
      },
      {
        path: 'refresh',
        name: 'task.refresh',
        component: () =>
          import(/* webpackChunkName: "task.refresh" */ '@/views/tasks/refresh'),
        meta: {
          auth: true,
          menuName: '刷新套餐',
          parentMenuId: 'tasks',
        },
      },
      {
        path: 'add',
        name: 'task.add',
        component: () =>
          import(/* webpackChunkName: "task.add" */ '@/views/tasks/form'),
        meta: {
          auth: true,
          menuName: '添加任务',
          parentMenuId: 'tasks',
        },
      },
      {
        path: 'edit/:id',
        name: 'task.edit',
        component: () =>
          import(/* webpackChunkName: "task.edit" */ '@/views/tasks/form'),
        meta: {
          auth: true,
          menuName: '修改任务',
          parentMenuId: 'tasks',
        },
      },
    ],
  },
  // 商品管理
  {
    path: '/goods',
    redirect: '/goods/list',
    name: 'goods',
    component: Layout,
    meta: {
      auth: true,
      menuName: '商品管理',
      menuId: 'goods',
    },
    children: [
      {
        path: 'list',
        name: 'goods.list',
        component: () =>
          import(/* webpackChunkName: "goods.list" */ '@/views/goods/list'),
        meta: {
          auth: true,
          menuName: '商品列表',
          keepAlive: true,
          parentMenuId: 'goods',
        },
      },
      {
        path: 'type',
        name: 'goods.type',
        component: () =>
          import(/* webpackChunkName: "goods.type" */ '@/views/goods/type'),
        meta: {
          auth: true,
          menuName: '商品分类',
          parentMenuId: 'goods',
        },
      },
      {
        path: 'orders',
        name: 'goods.orders',
        component: () =>
          import(/* webpackChunkName: "goods.orders" */ '@/views/goods/orders'),
        meta: {
          auth: true,
          menuName: '订单管理',
          parentMenuId: 'goods',
        },
      },
      {
        path: 'add',
        name: 'goods.add',
        component: () =>
          import(/* webpackChunkName: "goods.add" */ '@/views/goods/form'),
        meta: {
          auth: true,
          menuName: '添加商品',
          parentMenuId: 'goods',
        },
      },
      {
        path: 'edit/:id',
        name: 'goods.edit',
        component: () =>
          import(/* webpackChunkName: "goods.edit" */ '@/views/goods/form'),
        meta: {
          auth: true,
          menuName: '修改商品',
          parentMenuId: 'goods',
        },
      },
    ],
  },
  {
    path: '/',
    redirect: '/home',
    // redirect: {
    //   name: 'home',
    // },
  },
];
