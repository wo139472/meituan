<template>
  <div id="app">
    <EleHeader :goods="goods" :poi_info="poi_info"/>
    <div class="nav">
      <router-link to="/" tag="div" class="nav-item" exact>点菜</router-link>
      <router-link to="/ratings" tag="div" class="nav-item">评价({{comment_num}})</router-link>
      <router-link to="/seller" tag="div" class="nav-item">商家</router-link>
    </div>
    <keep-alive>
          <router-view :goods="goods"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import EleHeader from "./components/EleHeader"

export default {
  data() {
    return {
      goods: {},
      poi_info:{},
      comment_num: 0,
    };
  },
  components: {
    EleHeader
  },
  mounted() {
    this.axios("/api/goods").then(res => {
      console.log(res.data.data)
      this.seller = res.data.data;
      this.poi_info = res.data.data.poi_info;
    }),
    this.axios("/api/ratings").then(res=>{
      this.comment_num = res.data.data.comment_num
    })
  }
};
</script>

<style lang="scss">
.auto-img {
  width: 100%;
  height: 100%;
}
#app {
    width: 100vw;
    overflow: hidden;
}
.nav{
  display:flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  justify-content: space-evenly;
  border-bottom: 1px solid #e4e4e4;
     .nav-item {
        flex: 1;
        text-align: center;
        text-decoration: none;
        color: #666666;
        font-size: 13px;
    }
    .active {
        color: #FFBB22;
        position: relative;
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            height: 5px;
            width: 21px;
            transform: translateX(-50%);
            background-color: #FFBB22;
            border-radius: 3px;
        }
    }
}
</style>
