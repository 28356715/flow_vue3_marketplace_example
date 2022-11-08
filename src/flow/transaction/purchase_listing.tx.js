export const PURCHASE_LISTING = `
import NonFungibleToken from 0xNonFungibleToken
import ExampleNFT from 0xExample
import NFTStorefront from 0xExample
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

pub fun getOrCreateCollection(account: AuthAccount): &ExampleNFT.Collection{NonFungibleToken.Receiver} {
    if let collectionRef = account.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath) {
        return collectionRef
    }

    // create a new empty collection
    let collection <- ExampleNFT.createEmptyCollection() as! @ExampleNFT.Collection

    let collectionRef = &collection as &ExampleNFT.Collection
    
    // save it to the account
    account.save(<-collection, to: ExampleNFT.CollectionStoragePath)

    // create a public capability for the collection
    account.link<&ExampleNFT.Collection{NonFungibleToken.CollectionPublic, ExampleNFT.ExampleNFTCollectionPublic}>(ExampleNFT.CollectionPublicPath, target: ExampleNFT.CollectionStoragePath)

    return collectionRef
}

transaction(listingResourceID: UInt64, storefrontAddress: Address) {

    let paymentVault: @FungibleToken.Vault
    let exampleNFTCollection: &ExampleNFT.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let listing: &NFTStorefront.Listing{NFTStorefront.ListingPublic}

    prepare(account: AuthAccount) {

        //获取价格
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No Listing with that ID in Storefront")
        
        let price = self.listing.getDetails().salePrice

        //获取引用，取出钱

        let mainFLOWVault = account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FLOW vault from account storage")
        
        self.paymentVault <- mainFLOWVault.withdraw(amount: price)

        self.exampleNFTCollection = getOrCreateCollection(account: account)
    }

    execute {
        let item <- self.listing.purchase(
            payment: <-self.paymentVault
        )
        self.exampleNFTCollection.deposit(token: <-item)

        self.storefront.cleanup(listingResourceID: listingResourceID)
    }
}
`
