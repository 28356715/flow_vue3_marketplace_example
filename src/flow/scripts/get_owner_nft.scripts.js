export const GET_OWNER_NFT = `

import ExampleNFT from 0xExample

pub fun main (account: Address):[ExampleNFT.ExampleNFTMetadataView]{
    let account = getAccount(account)
    let collectionPublicRef = account.getCapability<&{ExampleNFT.ExampleNFTCollectionPublic}>(ExampleNFT.CollectionPublicPath)
                              .borrow()??panic("the collection is nil")

    let arr = collectionPublicRef.getIDs()
    var res:[ExampleNFT.ExampleNFTMetadataView] = []
    var i = 0

    while i < arr.length {
        let nft = collectionPublicRef.borrowExampleNFT(id:arr[i])??panic("the nft does not exist")
        let view = nft.resolveView(Type<ExampleNFT.ExampleNFTMetadataView>())!
        let exampleNFTDisplay = view as! ExampleNFT.ExampleNFTMetadataView

        res.append(exampleNFTDisplay)
        i=i+1
    
    }

    return res


}



`