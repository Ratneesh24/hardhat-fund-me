// async function deployFunc(hre) {

// }


// module.exports.default = deployFunc

// module.exports = async (hre) => {
//     const {getNamedAccounts, deployments} = hre
// }

// both are same
const { networkConfig, developmentChains} = require("../helper-hardhat-config");
const { network } = require("hardhat");
 const {verify} = require("../utils/verify")
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    //if chain id is x use address y
    //if chain id is a use address b

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    let ethUsdPriceFeedAddress 
    if(developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }



    // welll what happens when we want to change chains?
    //when going for localhost or hardhat m=network we want to use a mock

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from : deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY)
    {
     await verify(fundMe.address, args)
    }
    log("----------------------------------------------------------")
 }
 module.exports.tags = ["all", "FundMe"]