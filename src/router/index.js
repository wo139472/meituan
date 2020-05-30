import Vue from 'vue'
import VueRouter from 'vue-router'
import Goods from "../views/Goods"
import Ratings from "../views/Ratings"
import Seller from "../views/Seller"

Vue.use(VueRouter)

  const routes = [
    {
      path:"/",
      name:"Goods",
      component: Goods
    },
    {
      path:"/ratings",
      name:"Ratings",
      component:Ratings
    },
    {
      path:"/seller",
      name:"Seller",
      component:Seller
    }
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  base: process.env.BASE_URL,
  routes
})

export default router
