<template>
  <div class="default-layout">
    <xg-header></xg-header>

    <div class="container">
      <xg-breadcrumb></xg-breadcrumb>

      <el-container class="xg-wrap">
        <xg-leftbar></xg-leftbar>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-container>
      <el-footer>
      </el-footer>
    </div>
  </div>
</template>

<script>
/* ============
  * Default Layout
  * ============
  */
import XgHeader from '@/components/common/header';
import XgBreadcrumb from '@/components/common/breadcrumb';
import XgLeftbar from '@/components/common/leftbar';

export default {
  name: 'default-layout',

  components: {
    XgHeader,
    XgBreadcrumb,
    XgLeftbar,
  },

  data() {
    return {
      activeIndex: '1',
      menuCollapsed: false,
    };
  },

  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>

<style lang="scss" scoped>
.default-layout {
  .container {
    padding-top: 60px;
  }
}
</style>