<template>
<div class="div-relative">
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo div-menu "
    mode="horizontal"
    text-color="black"
    active-text-color="#3781ED"
    :ellipsis="false"
    style="font-weight:700;height: 45px;"
    background-color="#ffffff00"
  >
    <div class="flex-grow"  />
    <el-menu-item class="menu-item-font" index="0" @click="gohome">address:{{userWalletAddress}}
    </el-menu-item>
    <el-menu-item class="menu-item-font" index="2" @click="goTrade">交易市场</el-menu-item>
    <el-menu-item class="menu-item-font" index="3" @click="goMintNft">铸造</el-menu-item>
     <el-menu-item  class="menu-item-font" index="4" @click="goCollections">Collections</el-menu-item>
    <el-menu-item  class="menu-item-font" v-if="!userWalletAddress" index="5" @click="login">Connet Wallet</el-menu-item>
    <el-menu-item class="menu-item-font"  v-else index="6" @click="logout">Log out</el-menu-item>
  </el-menu>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from  'vue-router'
import { ref } from 'vue'
import { getCurrentInstance } from 'vue'
import { Action, ElMessage, ElMessageBox } from 'element-plus'
// import { CREATE_ADMIN_STORE } from "../flow/transaction/create_admin_store.tx"

const activeIndex = ref(1)
var userWalletAddress = ref("")

//用户信息
const global  = getCurrentInstance()!.appContext.config.globalProperties

const setUser = ((user)=>{
  userWalletAddress.value =  user.addr
})
const userinfo = ref(global.$fcl.currentUser.subscribe(setUser))

// login
 const login = ( async ()=>{
       await global.$fcl.authenticate()
       await global.$fcl.currentUser.subscribe(setUser)
})
 const logout = ( async ()=>{
        await global.$fcl.unauthenticate()
        userWalletAddress.value =  ""
})

//导航
const router = useRouter()

const  goMintNft = (()=>{
   router.push({ path: '/mint' })
   activeIndex.value = 3
})

const  goTrade = (()=>{
   router.push({ path: '/trade' })
   activeIndex.value = 2
})
const  gohome = (()=>{
   router.push({ path: '/loot' })
   activeIndex.value = 1
})
const  goCollections = (()=>{
        if (!window.sessionStorage.getItem("CURRENT_USER")||(window.sessionStorage.getItem("CURRENT_USER")&&JSON.parse(window.sessionStorage.getItem("CURRENT_USER")!).addr==null)) {
          ElMessageBox.alert('先链接钱包~', {
            confirmButtonText: 'OK',
            type:'error',
          })
          return 
        }
      router.push({ path: '/collections' })
      activeIndex.value = 4
})

</script>

<style >
.flex-grow {
  flex-grow: 1;
}
 .mt-header{
     background-color: #199568e2;
     height: 20px;
 }
 .nav-font{
    color:"#9f6ab9";
    font-size:14px;
    font-weight:700;
 }
 .header-backgroud{
  background: url("../assets/img/header.png") no-repeat center center;
  background-size: 100% 100%;
  height: 222px;
 }
 .menu-item-font{
  font-size: 18px;

 }
  .menu-item-font:hover{
    background-image: linear-gradient(to right, #ED1E79,#522785);
    color: #ffffff!important;
 }

 .div-relative{
  position:relative;
  background: url("../assets/img/header.png") no-repeat center center;
  background-size: 100% 100%;
  height: 280px;
  }
  .div-menu{ 
    position:absolute; 
    left: 60%;
    top:80%;
    color: black;
    width: 250px;
    /* margin-bottom: 1%; */
  } 
 .el-menu--horizontal{
    border-bottom-color: #ffffff00!important;
  }
</style>