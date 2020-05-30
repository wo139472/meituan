<template>
  <div class="goods">
        <!-- 菜单分类 -->
        <div class="menu-wrapper" ref="menuscroll">
            <ul>
                <!-- 专场 -->
                <li :class="['menu-item', currentIndex === 0 ? 'current' : '']" @click="selectMenu(0)">
                    <p class="text">
                        <span>{{operation.tag_name}}</span>
                        <img :src="operation.tag_icon">
                    </p>
                </li>
                <!-- 具体分类 -->
                <li :class="['menu-item', currentIndex === index + 1 ? 'current' : '']"
                    v-for="(item, index) in foods_tags" :key="index" @click="selectMenu(index + 1)">
                    <p class="text">
                        <span>{{item.name}}</span>
                        <img :src="item.icon" v-if="item.icon">
                    </p>
                    <i class="num" v-show="calc_count(item.spus)">{{calc_count(item.spus)}}</i>
                </li>
            </ul>
        </div>
        <!-- 食物列表 -->
        <div class="foods-wrapper" ref="foodscroll">
            <ul>
                <!-- 专场 -->
                <li class="container-list food-list-hook">
                    <div v-for="(item, index) in operation.operation_source_list" :key="index">
                        <img :src="item.pic_url">
                    </div>
                </li>
                <!-- 具体分类 -->
                <li class="food-list food-list-hook" v-for="(item, index) in foods_tags" :key="index">
                    <h3 class="title">{{item.name}}</h3>
                    <!-- 具体商品列表 -->
                    <ul>
                        <li class="food-item" v-for="food in item.spus" :key="food.id" @click="showDetail(food)">
                            <div class="icon" :style="head_bg(food.picture)"></div>
                            <div class="content">
                                <h3 class="name">{{food.name}}</h3>
                                <p class="desc" v-if="food.description">{{food.description}}</p>
                                <div class="extra">
                                    <span class="saled">{{food.month_saled_content}}</span>
                                    <span class="praised">{{food.praise_content}}</span>
                                </div>
                                <img class="product" :src="food.product_label_picture">
                                <p class="price">
                                    <span class="text">￥{{food.min_price}}</span>
                                    <span class="unit">/{{food.unit}}</span>
                                </p>
                            </div>
                            <Cartcontrol :food="food"></Cartcontrol>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- 购物车列表 -->
        <Shopcart :poi_info="poi_info" :select_foods="select_foods"></Shopcart>
        <!-- 商品详情 -->
        <Food :food="selectFood" ref="foodView"></Food>
    </div>
</template>

<script>
import BScroll from "better-scroll";
import Cartcontrol from "../components/Cartcontrol";
import Shopcart from "../components/Shopcart"
import Food from "../components/Food"

export default {
  data() {
    return {
      operation: {},
      foods_tags: [],
      poi_info:{},
      listHeight: [],
      scrollY: 0,
      menuscroll: {},
      foodscroll: {},
      selectFood: {}
    };
  },
  
   computed: {
        head_bg () {
            return (imgUrl) => `background-image:url(${imgUrl})`
        },
        currentIndex () { // 根据右侧滚动位置,获取对应索引
            for (let i = 0; i < this.listHeight.length; i++) {
                const h1 = this.listHeight[i]
                const h2 = this.listHeight[i + 1]
                if (this.scrollY >= h1 && this.scrollY < h2) {
                    return i
                }
            }
            return 0
        },
        select_foods () {
            const foods = []
            this.foods_tags.forEach(item => {
                item.spus.forEach(food => {
                    if (food.count > 0) foods.push(food)
                })
            })
            return foods
        }
    },
    mounted() {
        this.axios("/api/goods").then(res => {
        // console.log("1",res.data.data);
        let data = res.data.data;
        this.foods_tags = data.food_spu_tags;
        this.operation = data.container_operation_source;
        this.poi_info=data.poi_info;
        this.$nextTick(() => {
                    this.menuscroll = new BScroll(this.$refs.menuscroll, {
                        click: true
                    })
                    this.foodscroll = new BScroll(this.$refs.foodscroll, {
                        scrollY: true,
                        mousewheel: true,
                        probeType: 3,
                        click: true
                    })
                    this.foodscroll.on('scroll', pos => {
                        this.scrollY = Math.abs(Math.round(pos.y))
                    })
                    this.calcHeight()
                })
    }).catch(err => console.log(err))
  },
  methods:{
     calcHeight () {
            const foodList = this.$refs.foodscroll.getElementsByClassName('food-list-hook')
            let height = 0
            this.listHeight.push(height);
            [...foodList].map(elem => {
                height += elem.offsetHeight
                this.listHeight.push(height)
            })
        },
        selectMenu (index) {
            const foodList = this.$refs.foodscroll.getElementsByClassName('food-list-hook')
            const el = foodList[index]
            this.foodscroll.scrollToElement(el, 500)
        },
        calc_count (spus) {
            let count = 0
            spus.forEach(item => {
                if (item.count > 0) count += item.count
            })
            return count
        },
        showDetail (food) {
            this.selectFood = food
            this.$refs.foodView.showView()
        }
  },
  components:{
    Cartcontrol,
    Shopcart,
    Food
  }
};
</script>

<style lang="scss" scoped>

.goods {
    display: flex;
    position: absolute;
    top: 200px;
    bottom: 51px;
    overflow: hidden;
    width: 100%;
    .menu-wrapper {
        flex: 0 0 85px;
        background-color: #f4f4f4;
        font-size: 11px;
        height: 100%;
        overflow: hidden;
        ul {
            .menu-item {
                padding: 17px 22px 17px 11px;
                border-bottom: 1px solid #e4e4e4;
                position: relative;
                .text {
                    font-size: 13px;
                    line-height: 17px;
                    vertical-align: middle;
                    overflow: hidden;
                    // 多行显示省略号
                    -webkit-line-clamp: 2;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    span {
                        position: relative;
                    }
                    img {
                        margin-left: 6px;
                        width: 13px;
                    }
                }
                i.num {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    border-radius: 50%;
                    background-color: red;
                    color: white;
                    width: 13px;
                    height: 13px;
                    line-height: 13px;
                    text-align: center;
                    text-align: center;
                    font-size: 7px;
                }
            }
            .menu-item:last-of-type {
                border-bottom: none;
            }
            .menu-item.current {
                background-color: white;
                font-weight: bold;
                margin-top: -1px;
            }
        }
    }
    .foods-wrapper {
        flex: 1;
        padding: 0px 10px 0 10px;
        ul {
            li.container-list {
                padding-bottom: 11px;
                border-bottom: 1px solid #e4e4e4;
                div {
                    img {
                        width: 100%;
                        margin-top: 11px;
                        border-radius: 5px;
                    }
                }
            }
            li.food-list {
                h3.title {
                    height: 13px;
                    margin: 0 0 0 9px;
                    padding-top: 12px;
                    position: relative;
                    font-size: 13px;
                    &::before {
                        content: '';
                        position: absolute;
                        left: -9px;
                        top: 12px;
                        width: 4px;
                        height: 13px;
                        background-color: #ffd161;
                        border-radius: 3px;
                        margin-right: 12px;
                    }
                }
                ul {
                    li.food-item {
                        margin-top: 12px;
                        display: flex;
                        align-items: center;
                        .icon {
                            margin-left: 11px;
                            width: 63px;
                            height: 75px;
                            background-size: cover;
                            background-position: center;
                        }
                        .content {
                            flex: 1;
                            margin-left: 11px;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-evenly;
                            h3.name {
                                max-width: 163px;
                                color: #333333;
                                font-size: 16px;
                                line-height: 21px;
                            }
                            p.desc {
                                font-size: 10px;
                                line-height: 19px;
                                color: #bfbfbf;
                                // 超出部分显示省略号
                                -webkit-line-clamp: 1;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                overflow: hidden;
                            }
                            img.product {
                                width: 61px;
                            }
                            .extra {
                                color: #bfbfbf;
                                font-size: 10px;
                            }
                            p.price {
                                .text {
                                    color: #fb4e44;
                                }
                            }
                        }
                        .cartcontrol {
                            position: relative;
                            left: 0;
                            top: 50%;
                        }
                    }
                }
            }
        }
    }
}
</style>