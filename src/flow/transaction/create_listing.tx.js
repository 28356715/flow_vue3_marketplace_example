//上架
export const CREATE_LISTING = `
import NonFungibleToken from 0xNonFungibleToken
import ExampleNFT from 0xExample
import NFTStorefront from 0xExample
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

pub fun getOrCreateStorefront(account: AuthAccount): &NFTStorefront.Storefront {
    if let storefrontRef = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) {
        return storefrontRef
    }
    
    let storefront <- NFTStorefront.createStorefront()

    let storefrontRef = &storefront as &NFTStorefront.Storefront

    account.save(<-storefront, to: NFTStorefront.StorefrontStoragePath)

    account.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)

    return storefrontRef
}

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let flowReceiver: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let exampleNFTProvider: Capability<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic,NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront
    let address:Address

    prepare(account: AuthAccount) {

        let exampleCollectionPrivatePath = /private/ExampleNFTCollection
   
           //1. nftProviderCapability
   
           //2.salecut
   
           self.flowReceiver = account.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
   
           if !account.getCapability<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic,NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(exampleCollectionPrivatePath)!
              .check() {
              account.link<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic,NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(exampleCollectionPrivatePath,target:ExampleNFT.CollectionStoragePath)
              }
   
           self.exampleNFTProvider = account.getCapability<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic,NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(exampleCollectionPrivatePath)
   
           self.address = account.address
   
           self.storefront = getOrCreateStorefront(account:account)
   
       }
    

//4. 执行方法
    execute {
        let saleCut = NFTStorefront.SaleCut(
            receiver: self.flowReceiver,
            amount: saleItemPrice
        )
        self.storefront.createListing(
            nftProviderCapability: self.exampleNFTProvider,
            nftID: saleItemID,
            saleCuts: [saleCut],
            sellerAddress:self.address
        )
    }
}
 
`
