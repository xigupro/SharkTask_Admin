// 菜单
export default [
  {
    id: 'home',
    href: '/home',
    name: '仪表盘',
    icon: 'icon-dashboard',
  },
  {
    id: 'banners',
    href: '/banners',
    name: '轮播',
    icon: 'icon-image',
  },
  {
    id: 'entries',
    href: '/entries',
    name: '菜单',
    icon: 'icon-appstore',
  },
  {
    id: 'tasks',
    href: '/tasks',
    name: '任务',
    icon: 'icon-menu',
  },
  {
    id: 'review',
    href: '/review',
    name: '审核',
    icon: 'icon-filesearch',
  },
  {
    id: 'goods',
    href: '/goods',
    name: '商城',
    icon: 'icon-shop',
  },
  {
    id: 'finance',
    href: '/finance',
    name: '财务',
    icon: 'icon-moneycollect',
  },
  {
    id: 'users',
    href: '/users',
    name: '用户',
    icon: 'icon-user',
  },
  {
    id: 'message',
    href: '/message',
    name: '公告',
    icon: 'icon-message',
  },
  {
    id: 'help',
    href: '/help',
    name: '帮助中心',
    icon: 'icon-question-circle',
  },
  {
    id: 'administrators',
    href: '/administrators',
    name: '管理员',
    icon: 'icon-team',
    submenus: [
      {
        href: '/administrators/list',
        name: '列表',
      },
    ],
  },
  {
    id: 'system',
    href: '/system',
    name: '系统',
    icon: 'icon-setting',
    submenus: [
      {
        href: '/system/setting',
        name: '设置',
      },
    ],
  },
];
