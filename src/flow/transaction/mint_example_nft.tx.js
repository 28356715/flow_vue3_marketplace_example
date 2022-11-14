export const MINT_EXAMPLE_NFT = `
import NonFungibleToken from 0xNonFungibleToken
import ExampleNFT from 0xExample

transaction(name:String,url:String,desc:String){
    let collectionRef:&ExampleNFT.Collection
    prepare(account:AuthAccount){

    // 铸造nft,colletion 存储nft
    if account.borrow<&ExampleNFT.Collection>(from:ExampleNFT.CollectionStoragePath)==nil {
    let colletion <- ExampleNFT.createEmptyCollection()
    
    account.save(<- colletion,to:ExampleNFT.CollectionStoragePath)

    account.link<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,ExampleNFT.ExampleNFTCollectionPublic}>(ExampleNFT.CollectionPublicPath,target:ExampleNFT.CollectionStoragePath)

    }
    self.collectionRef = account.borrow<&ExampleNFT.Collection>(from:ExampleNFT.CollectionStoragePath)??panic("no borrow ExampleNFT Collection ref")
    }

    execute {

    let nft <- ExampleNFT.mintNFT(name:name,url:url,desc:desc)

    self.collectionRef.deposit(token:<-nft)
    
    
    }

}

`
