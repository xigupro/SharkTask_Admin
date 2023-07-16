<template>
  <el-dialog title="位置选择" :visible="visible" @close="$emit('close')">
    <div class="coord-picker">
      <div class="map-container">
        <amap
          cache-key="coord-picker-map"
          mmap-style="amap://styles/whitesmoke"
          async
          :center.sync="center"
          :zoom.sync="zoom"
          is-hotspot
          @click="onMapClick"
        >
          <amap-satellite-layer :visible="satellite" />

          <amap-marker v-if="position" :position.sync="position" draggable />

          <div class="result-panel">
            <el-input
              v-model="query"
              placeholder="输入关键词"
              @input="search(true)"
            />
          </div>
          <div class="result-list" v-loading="searching">
            <template v-if="results.length">
              <div
                class="result-item"
                :class="result.name === positionName ? 'active' : ''"
                v-for="(result, index) in results"
                :key="`${result.address}_${index}`"
                @click="focus(result)"
              >
                <div class="name">{{ result.name }}</div>
                <div class="address">{{ result.address }}</div>
              </div>
            </template>
            <no-record v-else />
          </div>
        </amap>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="handleOk">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { loadAmap, loadPlugins } from '@amap/amap-vue';

export default {
  name: 'amap-selector',
  props: {
    visible: Boolean,
  },
  data() {
    return {
      center: null,
      zoom: 15,
      query: '',
      searching: false,
      tips: [],
      results: [],
      position: null,
      positionName: '',
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      satellite: false,
    };
  },
  computed: {
    wrapper() {
      return this.$refs.wrapper;
    },
    positionText() {
      if (!this.position) return '';
      return `${this.position[0]}, ${this.position[1]}`;
    },
  },
  created() {
    this.$ready = new Promise(async (resolve) => {
      const AMap = await loadAmap();
      await loadPlugins([
        'AMap.PlaceSearch',
        'AMap.AutoComplete',
        'AMap.Geolocation',
      ]);

      this.ps = new AMap.PlaceSearch({
        pageSize: this.pageSize,
      });
      this.ac = new AMap.AutoComplete();
      this.geo = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：5s
        position: 'RB', // 定位按钮的停靠位置
        offset: [10, 20], // 定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
        zoomToAccuracy: true, // 定位成功后是否自动调整地图视野到定位点
      });
      this.geo.getCurrentPosition((status, result) => {
        if (status === 'complete') {
          this.center = [result.position.lng, result.position.lat];
          this.onMapClick({
            lnglat: { lng: result.position.lng, lat: result.position.lat },
          });
        }
      });

      resolve();
    });
  },
  methods: {
    handleOk() {
      this.$emit('change', {
        position: this.position,
        name: this.positionName,
      });
    },
    onMapClick(e) {
      if (e.lnglat) {
        this.position = [e.lnglat.lng, e.lnglat.lat];
        this.ps.searchNearBy('', this.position, 2000, (status, result) => {
          if (status === 'complete' && result.poiList) {
            this.results = result.poiList.pois;
            this.total = result.poiList.count;
          } else {
            this.results = [];
            this.total = 0;
          }
        });
      } else {
        this.position = null;
      }
    },
    async search(clear = false) {
      if (clear) {
        this.results = [];
        this.total = 0;
        this.pageIndex = 1;
        this.ps.setPageIndex(1);
      }

      this.searching = true;
      const { query } = this;
      this.ps.search(query, (status, result) => {
        this.searching = false;
        if (query !== this.query) return;

        if (status === 'complete' && result.poiList) {
          this.results = result.poiList.pois;
          this.total = result.poiList.count;
        } else {
          this.results = [];
          this.total = 0;
        }
      });
    },
    async autoComplete(kw) {
      if (!kw) {
        this.tips = [];
      } else {
        this.ac.search(kw, (status, result) => {
          if (kw !== this.query) return;
          if (status === 'complete' && result.tips) {
            this.tips = Array.from(new Set(result.tips.map(tip => tip.name)));
          } else {
            this.tips = [];
          }
        });
      }
    },
    focus(poi) {
      const pos = [poi.location.lng, poi.location.lat];
      this.position = [...pos];
      this.positionName = poi.name;
      this.center = [...pos];
    },
    reset() {
      this.ps.setPageIndex(1);
      this.results = [];
      this.tips = [];
      this.total = 0;
    },
  },
  watch: {
    pageIndex(value) {
      this.$ready.then(() => {
        this.ps.setPageIndex(value);
        this.search(false);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: calc(100vh - 40px);
}

.result-panel {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding-bottom: 10px;
  box-sizing: border-box;
  display: flex;
  background-color: #fff;
  .search-bar {
    display: flex;
    align-items: center;
    .text {
      text-overflow: ellipsis;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
.result-list {
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  overflow-y: auto;
  width: 100%;
  height: 40%;
  box-sizing: border-box;
  border-bottom: 25px solid #fff;
  border-top: 25px solid #fff;
  .result-item {
    border-bottom: 1px solid #efefef;
    padding-bottom: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    &:hover,&:active {
      opacity: 0.6;
    }
    &.active {
      color: #409EFF;
    }
    .name {
      font-size: 15px;
    }
    .address {
      font-size: 12px;
      color: #888;
    }
  }
}
</style>
