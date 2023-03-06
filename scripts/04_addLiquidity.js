

// Pool addresses
let USDT_USDC_500= '0x1FA8DDa81477A5b6FA1b2e149e93ed9C7928992F'

// Token addresses
let TETHER_ADDRESS= '0x9A676e781A523b5d0C0e43731313A708CB607508'
let USDC_ADDRESS= '0x0B306BF915C4d645ff596e518fAf3F9669b97016'
let WRAPPED_BITCOIN_ADDRESS= '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1'

// Uniswap contract address
let WETH_ADDRESS= '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
let FACTORY_ADDRESS= '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'
let SWAP_ROUTER_ADDRESS= '0x610178dA211FEF7D417bC0e6FeD39F05609AD788'
let NFT_DESCRIPTOR_ADDRESS= '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'
let POSITION_DESCRIPTOR_ADDRESS= '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'    
let POSITION_MANAGER_ADDRESS= '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'  

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
  Usdt: require("../artifacts/contracts/Tether.sol/Tether.json"),
  Usdc: require("../artifacts/contracts/UsdCoin.sol/UsdCoin.json"),
  UniswapV3Pool: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
};

const { Contract } = require("ethers")
const { Token } = require('@uniswap/sdk-core')
const { Pool, Position, nearestUsableTick } = require('@uniswap/v3-sdk')

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ])

  return {
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  }
}

async function main() {
  const [owner, signer2] = await ethers.getSigners();
  const provider = waffle.provider;

  const usdtContract = new Contract(TETHER_ADDRESS,artifacts.Usdt.abi,provider)
  const usdcContract = new Contract(USDC_ADDRESS,artifacts.Usdc.abi,provider)

  await usdtContract.connect(signer2).approve(POSITION_MANAGER_ADDRESS, ethers.utils.parseEther('1000'))
  await usdcContract.connect(signer2).approve(POSITION_MANAGER_ADDRESS, ethers.utils.parseEther('1000'))

  const poolContract = new Contract(USDT_USDC_500, artifacts.UniswapV3Pool.abi, provider)

  const poolData = await getPoolData(poolContract)
  
  const UsdtToken = new Token(31337, TETHER_ADDRESS, 18, 'USDT', 'Tether')
  const UsdcToken = new Token(31337, USDC_ADDRESS, 18, 'USDC', 'UsdCoin')
  
  const pool = new Pool(
    UsdtToken,
    UsdcToken,
    poolData.fee,
    poolData.sqrtPriceX96.toString(),
    poolData.liquidity.toString(),
    poolData.tick
  )

  const position = new Position({
    pool: pool,
    liquidity: ethers.utils.parseEther('1'),
    tickLower: nearestUsableTick(poolData.tick, poolData.tickSpacing) - poolData.tickSpacing * 2,
    tickUpper: nearestUsableTick(poolData.tick, poolData.tickSpacing) + poolData.tickSpacing * 2,
  })

  const { amount0: amount0Desired, amount1: amount1Desired} = position.mintAmounts

  params = {
    token0: TETHER_ADDRESS,
    token1: USDC_ADDRESS,
    fee: poolData.fee,
    tickLower: nearestUsableTick(poolData.tick, poolData.tickSpacing) - poolData.tickSpacing * 2,
    tickUpper: nearestUsableTick(poolData.tick, poolData.tickSpacing) + poolData.tickSpacing * 2,
    amount0Desired: amount0Desired.toString(),
    amount1Desired: amount1Desired.toString(),
    amount0Min: 0,
    amount1Min: 0,
    recipient: signer2.address,
    deadline: Math.floor(Date.now() / 1000) + (60 * 10)
  }

  const nonfungiblePositionManager = new Contract(
    POSITION_MANAGER_ADDRESS,
    artifacts.NonfungiblePositionManager.abi,
    provider
  )

  const tx = await nonfungiblePositionManager.connect(signer2).mint(
    params,
    { gasLimit: '1000000' }
  )
  const receipt = await tx.wait()
  console.log(receipt);
}

/*
npx hardhat run --network localhost scripts/04_addLiquidity.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });