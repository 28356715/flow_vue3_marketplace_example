export const GET_NFTS_MARKET = `
import NFTStorefront from 0xExample

pub fun main():{UInt64: NFTStorefront.ListingView} {
    return NFTStorefront.ListingForSales
}
`