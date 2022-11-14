<template>
  <section>
    <div><mtHeader /></div>
    <div style="padding: 30px 0 0 30px;">
    <div v-if="saleNfts.length === 0">没有在售的nft</div>
    <div class = "content-card-col"
        v-else 
        v-for="item in saleNfts"
        :key="item.id"
    >
        <el-card>
            <img
               :src="item.url"
               class="img-div-col"
               />
             <div class="card-div-col ">
                <li class="card-li"> <span>{{item.name}}   #{{item.id}}</span> 
                <img
                  src="../assets/img/network-logo.png"
                  style="cursor:pointer;"
                  @click="goOfficeUrl(item.url)"
                 />
                </li> 
                <li class="card-li">售价：{{item.price }} flow
                  <el-button  class="button-loot" style="float: right;" @click="purchase(item)">Buy Now</el-button>
                </li>
                
              </div>
          </el-card>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref,onMounted,getCurrentInstance,reactive } from 'vue'
import mtHeader from "../components/PageHeader.vue"
import { GET_NFTS_MARKET } from "../flow/scripts/get_nfts_market.scripts"
import { PURCHASE_LISTING } from "../flow/transaction/purchase_listing.tx"

const golbal  = getCurrentInstance()!.appContext.config.globalProperties

 onMounted(async () => {
    await getNftList()
   })

const currentDate = ref(new Date())

const activeName = ref('first')

interface saleModel {
    id:number;
    price:number;
    url:string;
    name:string;
    sellerAddress:string;
  }

   let saleNfts = reactive<Array<saleModel>>([])


//获取市场列表
const getNftList = async () =>{
   try{ 
       let res = await golbal.$fcl.query({
          cadence: GET_NFTS_MARKET ,
        })

        Object.keys(res).forEach((key) => {
          var e:saleModel = {
            id:0,
            price:0.0,
            url:"",
            name:"",   
            sellerAddress:""
          }
          e.id = Number(key)
          e.price = res[key].salePrice
          e.url = res[key].url
          e.name = res[key].name
          e.sellerAddress = res[key].sellerAddress 
          saleNfts.push(e)
       })

      }catch(err){
        console.log(err)
      }
 }


// 购买nft

 const purchase = async(item) => {
  try{
        let res=await golbal.$fcl.mutate({
          cadence: PURCHASE_LISTING,
          args:(arg,t)=>[
            arg(item.id,t.UInt64),
            arg(item.sellerAddress,t.Address),
          ],
          limit: 1000,
        })
        await golbal.$fcl.tx(res).onceSealed()
      }catch(err){
        console.log("err::"+err)
      }
 }

 const goOfficeUrl = (url) =>{
   window.location.href = url
 }

</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.card-li {
  font-size: 15px;
  line-height: 30px;
  color: rgb(7, 7, 7);
}
.card-content {
  /* margin-top: 13px; */
  line-height: 12px;
  padding-left: 15px;
  padding-right: 0px;
  /* display: flex; */
  /* justify-content: space-between; */
  /* align-items: center; */
}

.image-trade {
  width: 100%;
  display: block;
  display:inline-block;
}

.button-loot {
  padding: 2;
  min-height: auto;
  /* background-color: rgb(165, 118, 42); */
  color: white;
  background-image: linear-gradient(to right, #D444A3,#E4505F,#D74698);
}
.el-card {
    height: 90%;
    background-color: #EFE9E1;
    margin: 15px;
}
.demo-tabs > .el-tabs__content {
    font-weight:30;
}
</style>