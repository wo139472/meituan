<template>
    <div class="header">
        <div class="top-wrapper">
            <div class="back-wrapper">
                <span class="icon-arrow_lift"></span>
            </div>
            <div class="search-wrapper">
                <span class="search-icon"></span>
                <input type="text" class="search-bar" placeholder="搜索店内商品">
            </div>
            <div class="more-wrapper">
                 <a class="spell-icon" href="#">拼单</a>
                <span class="more-btn">
                    <div class="s-radius"></div>
                    <div class="s-radius"></div>
                    <div class="s-radius"></div>
                </span>
            </div>
        </div>
         <div class="content-wrapper">
            <div class="icon" :style="pic_url"></div>
            <div class="name">
                <h3>{{poi_info.name}}</h3>
            </div>
            <div class="collect">
                <span class="icon-favorite" :class="{check:favorite}" @click="favoriteSeller"></span>
                <span>{{favorite ? '已收藏':'未收藏'}}</span>
            </div>
        </div>
        <!-- 公告内容 -->
        <div class="bulletin-wrapper" v-if="poi_info.discounts2">
            <img class="icon" :src="poi_info.discounts2[0].icon_url">
            <div class="content">{{poi_info.discounts2[0].info}}</div>
            <div class="detail" @click="isShow = true">
                {{poi_info.discounts2.length}}个活动
                <span class="icon-keyboard_arrow_right"></span>
            </div>
        </div>
         <!-- 背景 -->
        <div class="bg-wrapper" :style="content_url"></div>
         <!-- 公告详情 -->
        <transition name="detail">
            <div class="bulletin-detail" v-show="isShow">
                <div class="detail-wrapper">
                    <div class="main-wrapper" :style="poi_back_pic_url">
                        <div class="icon" :style="pic_url"></div>
                        <h3>{{poi_info.name}}</h3>
                        <!-- 评价 -->
                        <div class="score">
                            <Star :score="poi_info.wm_poi_score" :totalstar="totalstar"></Star>
                            <span>{{poi_info.wm_poi_score}}</span>
                        </div>
                        <p class="tip">
                            <span class="start_send_price">{{poi_info.min_price_tip}}</span><i>|</i>
                            <span class="send_price">{{poi_info.shipping_fee_tip}}</span><i>|</i>
                            <span class="deliver_time">{{poi_info.delivery_time_tip}}</span>
                        </p>
                        <p class="time">
                            配送时间
                            {{poi_info.shipping_time}}
                        </p>
                        <hr/>
                        <div class="discounts" v-if="poi_info.discounts2">
                            <p v-for="(item, index) in poi_info.discounts2" :key="index">
                                <img :src="item.icon_url">
                                <span>{{item.info}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="close-wrapper" @click="isShow = false">
                        <span class="icon-close"></span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Star from "./Star"
export default {
   props:{
       goods:{
           type:Object,
           isRequired:true
       },
       poi_info: {
            type: Object,
        }
   },
   data () {
        return {
            isShow: false, // 公告详情是否显示
            totalstar: 5,
            favorite: false
        }
    },
   methods:{
      testSellerIsFavorite() {
      let storage = window.localStorage;
      // 通过localStorage拿到所有已收藏的店家
      let result = storage.getItem("favorite-seller");
      // 用户有没有收藏过商家
      if (result) {
        let arr = JSON.parse(result); // 字符串转数组
        // 判断用户收藏的商铺中是否包含当前商铺
        let item = arr.find(n => n === this.poi_info.name);
        this.favorite = item ? true : false;
      } else {
        this.favorite = false;
      }
    },
    favoriteSeller() {
      let storage = window.localStorage;
      // 获取原来已经收藏的商家
      let result = storage.getItem("favorite-seller");
      // localStorage存储的数据是字符串，需要将字符串转化成js对象或者数组
      if (this.favorite) {
        // 取消收藏
        result = JSON.parse(result);

        result = result.filter(name => name !== this.poi_info.name);
      } else {
        if (result) {
          // favorite-seller 已经存放其他商家
          result = JSON.parse(result);
          result = [...result, this.poi_info.name];
        } else {
          result = [this.poi_info.name];
        }
      }
      storage.setItem("favorite-seller", JSON.stringify(result));
      this.testSellerIsFavorite();
    }
  },
  watch: {
    poi_info(newValue, oldValue) { // 当商家发生改变时，重新判断店铺是否收藏
        if(newValue.name !== oldValue.name) {
            this.testSellerIsFavorite()
        }
    }
  },
   
    computed: {
        content_url () {
            return `background-image:url(${this.poi_info.head_pic_url})`
        },
        pic_url () {
            return `background-image:url(${this.poi_info.pic_url})`
        },
        poi_back_pic_url () {
            return `background-image:url(${this.poi_info.poi_back_pic_url})`
        }
    },
    components:{
        Star
    }
}
</script>

<style lang="scss" scoped>
 .header {
    height: 140px;
    padding-top: 20px;
    // background:#ddd;
    .top-wrapper {
        width: 100%;
        height: 31px;
        display: flex;
        .back-wrapper {
            width: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
         .search-wrapper {
            flex: 1;
            position: relative;
            .search-icon {
                position: absolute;
                width: 28px;
                height: 31px;
                transform: scale(.5);
                background-size: 13px 13px;
                background: url('../assets/img/titans_h5_search@2x.png') no-repeat;
            }
            .search-bar {
                padding-left: 28px;
                outline: none;
                border: 0;
                background-color: #cdcdcc;
                width: 100%;
                height: 31px;
                box-sizing: border-box;
                border-radius: 16px;
            }
         }
         .more-wrapper {
            width: 65px;
            height: 17px;
            display: flex;
            align-items: center;
            padding: 7px 15px 7px 24px;
            .spell-icon {
                outline: none;
                font-size: 9px;
                width: 30px;
                height: 17px;
                line-height: 17px;
                border: 1px solid #fff;
                text-decoration: none;
                color: #fff;
                text-align: center;
            }
            .more-btn {
                float: right;
                width: 24px;
                height: 31px;
                margin-left: 15px;
                .s-radius {
                    margin: 13px 1px 0 0;
                    display: block;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background-color: #000;
                    border: 1px solid #fff;
                    float: left;
                }
            }
        }
    }
    .content-wrapper {
        padding: 17px 10px 11px 10px;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        .icon {
            width: 50px;
            height: 50px;
            background-position: center;
            background-size: 135% 100%;
            border-radius: 5px;
        }
        .name {
            margin-left: 11px;
            h3 {
                color: #fff;
                font-size: 16px;
                font-weight: bold;
            }
        }
        .collect {
            position: absolute;
            right: 10px;
            width: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            span {
                margin-top: 7px;
                display: block;
                font-size: 11px;
                color: #fff;
            }
            .icon-favorite {
                font-size: 24px;
                color: rgb(77, 85, 93);
                &.check {
                    color: rgb(240, 20, 20);
                }
            }
        }
    }
    .bulletin-wrapper {
        font-size: 11px;
        height: 16px;
        padding: 0 10px 10px 10px;
        color: #fff;
        line-height: 16px;
        .icon {
            height: 16px;
            float: left;
        }
        .content {
            margin-left: 6px;
            height: 16px;
            line-height: 16px;
            float: left;
        }
        .detail {
            height: 16px;
            line-height: 16px;
            float: right;
        }
    }
     .bg-wrapper {
        width: 100%;
        height: 160px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        background-size: 100% 135%;
        background-position: center;
    }
    .bulletin-detail {
        width: 100vw;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(98,98,98,.8);
        z-index: 1;
        .detail-wrapper {
            width: 100%;
            height: 100%;
            padding: 43px 20px 65px 20px;
            box-sizing: border-box;
                        
            
            .main-wrapper {
                width: 100%;
                height: 68vh;
                background-size: 100% 100%;
                border-radius: 6px;
                text-align: center;
                padding-top: 20px;
                .icon {
                    margin: 0 auto;
                    width: 60px;
                    height: 60px;
                    background-size: 100% 100%;
                }
                h3 {
                    margin-top: 13px;
                    font-size: 15px;
                    font-weight: bolder;
                    color: #fff;
                }
                .tip {
                    margin-top: 8px;
                    font-size: 11px;
                    color: #bababc;
                    i {
                        margin: 0 7px;
                    }
                }
                .time {
                    margin-top: 13px;
                    font-size: 9px;
                    color: #fff;
                }
                hr {
                    margin-top: 21px;
                    width: calc(100% - 40px);
                    transform: scaleY(.5);
                }
                .discounts {
                    text-align: center;
                    margin: 20px 20px 0 20px;
                    height: 16px;
                    font-size: 11px;
                    p {
                        img {
                            width: 16px;
                            height: 16px;
                            float: left;
                        }
                        span {
                            color: #fff;
                            margin-left: 10px;
                            height: 16px;
                            line-height: 16px;
                        }
                    }
                }
            }
            .close-wrapper {
                margin: 20px auto 0 auto;
                width: 40px;
                height: 40px;
                text-align: center;
                border-radius: 50%;
                border: 1px solid rgba(140, 140, 140, .9);
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgba(118, 118, 118, .7);
                .icon-close {
                    font-size: 15px;
                    color:#fff;
                }
            }
        }
    }
 }
 // Star组件
.score {
    margin: 6px 0 8px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
        margin-left: 7px;
        font-size: 10px;
        color:#fff;
    }
}

// 动画过渡
.detail-enter-active,.detail-leave-active {
    transition: 2s all;
}
.detail-enter,.detail-leave-to {
    opacity: 0;
}
.detail-enter-to,.detail-leave {
    opacity: 1;
}
</style>
