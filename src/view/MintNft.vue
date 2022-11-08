<template>
  <div>
    <div>
        <mtHeader></mtHeader>
    </div>
    <div class="form-postion">
        <el-form :model="form" label-width="120px">
          <el-form-item label="url" class="item">
            <el-input v-model="form.url" />
          </el-form-item>
          <el-form-item label="name" class="item">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="介绍" class="item">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="mt-button" @click="mintNft">铸造</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" >
import mtHeader from "../components/PageHeader.vue"
import { MINT_EXAMPLE_NFT } from "../flow/transaction/mint_example_nft.tx"
import { ref, toRef,reactive } from 'vue'
import * as IPFS from 'ipfs-core'
import { getCurrentInstance } from 'vue'
import { Action, ElMessage, ElMessageBox } from 'element-plus'

interface properties {
  key:string;
  value:string;
}

const golbal  = getCurrentInstance()!.appContext.config.globalProperties
const fileList = ref([]);
const propertiesList:Array<properties> = reactive([{key:"01",value:"Art"},{key:"02",value:"Music"},{key:"03",value:"Video"},{key:"04",value:"Virtual Worlds"}])

// const file = {}
const form = reactive({
  name: '',
  desc: '',
  url:'https://ipfs.io/ipfs/QmSWoRgRzjb1t76tj2owXwb1APbSWUeAfz46W8ZxvevxKV',
  externalUrl:'',
  properties:'01'
})

// 铸造nft
const mintNft = async ()=>{
   try{
      let addr = JSON.parse(window.sessionStorage.getItem("CURRENT_USER")!).addr
        let name = form.name
        let desc = form.desc
                
        if (addr==null) {
          ElMessageBox.alert('先链接钱包~', {
            confirmButtonText: 'OK',
            type:'error',
          })
          return 
        }
         if (name=="") {
          ElMessageBox.alert('name不能为空~', {
            confirmButtonText: 'OK',
            type:'error',
          })
          return 
        }
        if (desc=="") {
          ElMessageBox.alert('desc不能为空~', {
            confirmButtonText: 'OK',
            type:'error',
          })
          return 
        }
        let res=await golbal.$fcl.mutate({
          cadence:MINT_EXAMPLE_NFT,
          args:(arg,t)=>[
            arg(name,t.String),//name: String
            arg("https://ipfs.io/ipfs/QmSWoRgRzjb1t76tj2owXwb1APbSWUeAfz46W8ZxvevxKV",t.String),//url.String,
            arg(desc,t.String),//escription: String
          ],
        })
        await golbal.$fcl.tx(res).onceSealed()
        console.log("res======="+res)
      }catch(err){
        console.log("err========="+err)
      }
}

const handleRemove = (file, fileList)=>{
        console.log(file, fileList)
      }
      //处理change文件系统
const handleChange =async (file)=>{
const ipfs = await IPFS.create()
const myFile= {
              path:'/tmp/'+ file.name,
              content:'test img'
              }
    console.log("开始执行这个方法了了==="+myFile)
    const result = await ipfs.add(myFile)
    console.info(result)
    }

const onSubmit = () => {
  console.log('submit!')
}




</script>
<style>
.item .el-form-item__label{
    /* color: rgba(0, 0, 0, 0.707); */
    font-weight: 500;
  }
  .form-postion {
    margin-left: 20%;
    margin-top: 5%;
    width: 45%;
  }
  /* 选中后的字体颜色 */
.el-radio__input.is-checked + .el-radio__label {
  color: #d4b728 !important;
}
/* 选中后小圆点的颜色 */
.el-radio__input.is-checked .el-radio__inner {
  background: #d4b728 !important;
  border-color: #d4b728 !important;
}
.mt-button {
  padding: 2;
  min-height: auto;
  /* background-color: rgb(165, 118, 42); */
  color: white;
  background-image: linear-gradient(to right, #D444A3,#E4505F,#D74698);
}

</style>