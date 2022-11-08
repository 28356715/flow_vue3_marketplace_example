<template>
  <section>
    <div><mtHeader /></div>
    <div style="padding: 30px 0 0 30px;">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="collection" name="first">
            <div v-if="collectionNfts.length==0">网络错误 或是 钱包里没有nft,可以去铸造页面铸造专属自己的nft~</div>
            <div v-else>
                <!-- <div style="padding: 30px 0 0 30px;"> -->
                <div class = "content-card-row"
                v-for="nft in collectionNfts"
                :key="nft.id"
                >
               <el-card>
                  <img v-if="nft.url"
                    :src="nft.url"
                    class="img-div-row"
                    />
                    <img v-else
                    src="../assets/img/meta.png"
                    class="img-div-row"
                    />
                  <div class="card-div-row">
                        <li class="card-li"> <span> {{nft.name}} #{{nft.id}}</span> 
                             <img
                               src="../assets/img/network-logo.png"
                            />
                        </li>
                        <li class="card-li" v-if="nft.desc.length>20"> 
                             <el-tooltip
                              class="box-item"
                              effect="dark"
                              :content="nft.desc"
                              placement="right"
                            >
                              <span> desc:{{nft.desc.substring(0,19)}}<span style="color: #D444A3">...</span></span>
                            </el-tooltip>
                         </li> 
                        <li class="card-li" v-else> <span> desc:{{nft.desc}}</span> 
                        </li> 
                      
                        <div style="display: flex; align-items: center">
                            <el-popover placement="bottom" :width="400" trigger="click">
                              <template #reference>
                                  <el-button class="button-sell-style" >出售</el-button>
                               </template>
                                  <el-form
                                    ref="formRef"
                                    :model="saleDetails"
                                    label-width="120px"
                                    class="demo-dynamic"
                                  >
                                     <el-form-item
                                          prop="price"
                                          label="售价"
                                          :rules="[
                                            {
                                              required: true,
                                              message: '售价不能为空',
                                              trigger: 'blur',
                                            },
                                          ]"
                                        >
                                        <el-input v-model="saleDetails.price" />
                                     </el-form-item>
                                     <el-form-item
                                          prop="url"
                                          label="url介绍"
                                        >
                                          <el-input v-model="saleDetails.url" />
                                     </el-form-item>
                                     <el-form-item>
                                          <el-button  @click="create_listing(nft,saleDetails)" class="button-sell-style">上架</el-button>
                                     </el-form-item>
                                      </el-form>
                                    </el-popover>
                        </div>
                  </div>
                </el-card>  
                <!-- </div> -->
               </div>
             </div>
          </el-tab-pane>
        </el-tabs>
    </div>
  </section>
</template>
<script setup lang="ts">
   import mtHeader from "../components/PageHeader.vue"
   import { ref,onMounted, reactive, toRefs } from 'vue'
   import type { FormInstance } from 'element-plus'
   import { GET_OWNER_NFT } from "../flow/scripts/get_owner_nft.scripts"
   import { getCurrentInstance } from 'vue'
   import { CREATE_LISTING } from "../flow/transaction/create_listing.tx"

   const golbal  = getCurrentInstance()!.appContext.config.globalProperties
   let addr = JSON.parse(window.sessionStorage.getItem("CURRENT_USER")!).addr


  
  interface properties {
    key:number;
    value:string;
  }
  interface nft {
    id:string;
    name:string;
    desc:string;
    url:string;
  }
  interface saleModel {
    price:number;
    url:string;
  }


   const activeName = ref('first')
   const EventDetails = ref({})

   let collectionNfts = reactive<Array<nft>>([])
    const saleDetails:saleModel = reactive({
          price:0,
          url:""
          }) 
   const formRef = ref<FormInstance>()
   const eventFormRef = ref<FormInstance>()
   const flow  = getCurrentInstance()!.appContext.config.globalProperties
   var userWalletAddress = ref("")
   const userinfo = ref({})
 

   onMounted(async ()=>{
    await get_owner_nft()
   })

    // 获取collection内nft 列表
   const get_owner_nft = async () =>{
   try{ 
       let res = await flow.$fcl.query({
          cadence:GET_OWNER_NFT,
          args:(arg,t)=>[
            arg(addr,t.Address),//recipient: Address,
          ],
        })

        if(res.size!==0){
          res.forEach(element => {
          collectionNfts.push(element)
        });
        }

      }catch(err){
        console.log("err==========="+err)
      }
 }
//nft上架出售
const create_listing =  async (nft,saleDetails) =>{
  console.log("id====="+JSON.stringify(nft.id)+"===price====="+saleDetails.price)
    try{
        let res=await golbal.$fcl.mutate({
          cadence: CREATE_LISTING,
          args:(arg,t)=>[
            arg(nft.id,t.UInt64),//ecipient: Address,
            arg(saleDetails.price,t.UFix64),//name: String
          ],
          limit: 1000,
        })
        await golbal.$fcl.tx(res).onceSealed()
        console.log("res======="+res)
      }catch(err){
        console.log("err========="+err)
      }
 }


  const sell = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error!')
      return false
    }
  })
}



  const sponsor = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!====='+valid)
    } else {
      console.log('error submit!')
      return false
    }
  })
}  

</script>
<style>
 .activity-stauts {
  background-image: linear-gradient(to right, #BB94FE,#3AD3FD,#BB94FE);
 }
 .activity-icon{
  font-size: 18px;
 }

</style>