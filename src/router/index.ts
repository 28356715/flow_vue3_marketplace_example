import trade from '@/view/TradingHall.vue'

import { createRouter,createWebHashHistory} from "vue-router";
const routes = [
  { path: "/", component: trade },  
    {
      path: '/trade',
      name: 'trade',
      component: trade,
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import(/* webpackChunkName: "trade" */ '@/view/MyCollections.vue'),
    },
    {
      path: '/mint',
      name: 'mint',
      component: () => import(/* webpackChunkName: "mint" */ '@/view/MintNft.vue'),
    },
  
  ]
  const router = createRouter({
    history:createWebHashHistory(),
    routes:routes
  })

  export default router

