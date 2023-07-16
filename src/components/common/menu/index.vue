<template>
  <el-menu
    class="xg-menu"
    router
    :default-active="curMenuPath"
    mode="horizontal">
    <template v-for="(menu, index) in menus">
      <el-menu-item
        :index="menu.href"
        v-if="needShowMenu(menu)"
        :key="index.toString()">
        <span class="icon iconfont" :class="menu.icon"></span>
        {{ menu.name }}
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
/* ============
 * 主菜单
 * ============
 */
import menus from '@/constants/menus';

export default {
  name: 'main-menu',
  data() {
    return {
      menus: menus,
      curMenuPath: '',
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  methods: {
    // 初始化
    init() {
      this.curMenuPath = this.menus.find(c => c.href === this.$route.matched[0].path)
      .href;
    },
    // 是否显示菜单
    needShowMenu(menu) {
      return this.$tools.checkAdminPower(menu.id);
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss">
@include b(menu) {
  border-bottom: none!important;
  height: 60px;
  display: flex;
  .el-menu-item {
    padding: 0 20px;
  }
  @media screen and (max-width: 1024px) {
    .el-menu-item {
      padding: 0 10px;
      float: unset;
    }
  }
  .el-submenu__title {
    padding: 0;
  }
  .el-menu-item.is-active {
    border-bottom-color: $color-primary;
    background-color: $color-primary-light;
  }
  a {
    display: block;
  }
  .el-menu-item.is-active {
    color: $default-ft-color;
    font-weight: 400;
    a {
      color: $default-ft-color;
    }
  }

}
</style>

