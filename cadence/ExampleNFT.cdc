import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"

pub contract ExampleNFT: NonFungibleToken {

    // Events
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, kind: UInt8, rarity: UInt8)

    // Named Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    // totalSupply
    // The total number of nft that have been minted
    pub var totalSupply: UInt64
   
   // nft view
    pub struct ExampleNFTMetadataView {
        pub let id: UInt64
        pub let name: String
        pub let url: String
        pub let desc: String

        init( 
        id: UInt64,
        name: String,
        url: String,
        desc: String) {
            self.id=id
            self.name=name
            self.desc=desc
            self.url=url
        }
     }

    pub resource NFT: NonFungibleToken.INFT,MetadataViews.Resolver {

        pub let id: UInt64
        pub let name: String
        pub let url:String
        pub let desc: String

        init(id: UInt64,name: String, url: String,desc: String) {
            self.id = id
            self.name = name
            self.url = url
            self.desc = desc
        }

        pub fun getViews(): [Type] {
            return [
                Type<ExampleNFTMetadataView>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<ExampleNFTMetadataView>():
                     return ExampleNFTMetadataView(
                        id: self.id,
                        name: self.name,
                        url:self.url,
                        desc: self.desc,
                    )
            }

            return nil
        }
    }

        // This is the interface that users can cast their exampleNFT Collection as
    // to allow others to deposit exampleNFT into their Collection. It also allows for reading
    // the details of exampleNFT in the Collection.
    pub resource interface ExampleNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowExampleNFT(id: UInt64): &ExampleNFT.NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow ExampleNFT reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection
    // A collection of NFTs owned by an account
    pub resource Collection: ExampleNFTCollectionPublic,NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        //
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        // withdraw
        // Removes an NFT from the collection and moves it to the caller
        //
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit
        // Takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        //
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @ExampleNFT.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs
        // Returns an array of the IDs that are in the collection
        //
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT
        // Gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        //
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        // borrowExampleNFT
        // Gets a reference to an NFT in the collection as a ExampleNFT,
        // exposing all of its fields (including the typeID & rarityID).
        // This is safe as there are no functions that can be called on the ExampleNFT.
        //
        pub fun borrowExampleNFT(id: UInt64): &ExampleNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &ExampleNFT.NFT
            } else {
                return nil
            }
        }

        // destructor
        destroy() {
            destroy self.ownedNFTs
        }

        // initializer
        //
        init () {
            self.ownedNFTs <- {}
        }
    }

    // createEmptyCollection
    // public function that anyone can call to create a new empty collection
    //
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub fun mintNFT(
            name: String, 
            url: String,
            desc: String): @NFT {
            let nft <- create NFT(id:self.totalSupply,name:name,url:url,desc:desc)
            
            self.totalSupply = self.totalSupply + (1 as UInt64)  

            return  <- nft

            }

    init(){
            // Set our named paths
        self.CollectionStoragePath = /storage/ExampleNFTCollection
        self.CollectionPublicPath = /public/ExampleNFTCollection
       
        // Initialize the total supply
        self.totalSupply = 0
        emit ContractInitialized()
    }

    
}
 