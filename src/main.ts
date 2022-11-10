import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//flow
import * as fcl from "@onflow/fcl";
import  * as flow from '../config/flow.config';
import '@/assets/css/main.css';
 import * as  properties from "../config/global.config"


fcl.config({
    // "discovery.wallet":flow.VUE_APP_WALLET_DISCOVERY , // Endpoint set to Testnet
    "discovery.wallet":'https://fcl-discovery.onflow.org/testnet/authn' , // Endpoint set to Testnet
    // "accessNode.api":flow.VUE_APP_ACCESS_NODE,
    "accessNode.api":'https://rest-testnet.onflow.org',

    "app.detail.title": "ExampleNFT",//dapp title   标题
    // "app.detail.icon":"https://placekitten.com/g/200/200" //dapp icon

    // 脚本和交易中的地址替换
    // "0xPioneerNFT":flow.VUE_APP_PIONEERNFT,
    "0xNonFungibleToken":flow.VUE_APP_NonFungibleToken,
    "0xFlowToken":flow.VUE_APP_FlowToken,
    "0xFungibleToken":flow.VUE_APP_FungibleToken,
    "0xExample":flow.VUE_EXAMPLE,

})

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.$fcl = fcl
app.config.globalProperties.$properties = properties
app.mount('#app')
