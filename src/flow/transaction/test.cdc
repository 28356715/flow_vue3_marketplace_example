import ExampleNFT from "../../../cadence/ExampleNFT.cdc"

import FungibleToken from "../../../cadence/FungibleToken.cdc"
import NonFungibleToken from "../../../cadence/NonFungibleToken.cdc"
import FlowToken from "../../../cadence/FlowToken.cdc"
import NFTStorefront from "../../../cadence/NFTStorefront.cdc"


// storefront 或者 创建 storefront
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