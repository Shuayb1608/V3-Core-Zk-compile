// Token addresses
let TETHER_ADDRESS= '0x59b670e9fA9D0A427751Af201D676719a970857b'
let USDC_ADDRESS= '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1'
let WRAPPED_BITCOIN_ADDRESS= '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'

// Uniswap contract address
let WETH_ADDRESS= '0x0B306BF915C4d645ff596e518fAf3F9669b97016'
let FACTORY_ADDRESS= '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1'
let SWAP_ROUTER_ADDRESS= '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE'
let NFT_DESCRIPTOR_ADDRESS= '0x68B1D87F95878fE05B998F19b66F4baba5De1aed'
let POSITION_DESCRIPTOR_ADDRESS= '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c'       
let POSITION_MANAGER_ADDRESS= '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d'


const artifacts = {
  UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

const { Contract, BigNumber } = require("ethers")
const bn = require('bignumber.js')
const { waffle, ethers } = require("hardhat")
bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 })

const provider = waffle.provider;

function encodePriceSqrt(reserve1, reserve0) {
  return BigNumber.from(new bn(reserve1.toString())
    .div(reserve0.toString())
    .sqrt()
    .multipliedBy(new bn(2).pow(96))
    .integerValue(3)
    .toString()
  )
}

const nonfungiblePositionManager = new Contract(
  POSITION_MANAGER_ADDRESS,
  artifacts.NonfungiblePositionManager.abi,
  provider
)
const factory = new Contract(
  FACTORY_ADDRESS,
  artifacts.UniswapV3Factory.abi,
  provider
)

async function deployPool(token0, token1, fee, price) {
  const [owner] = await ethers.getSigners();
  let aaloo = await nonfungiblePositionManager.connect(owner);
  let kachalu = await aaloo.createAndInitializePoolIfNecessary(
    token0,
    token1,
    fee,
    price,
    { gasLimit: 5000000 }
  )
  // await kachalu.wait();
  console.log(kachalu, "kachalu");
  const poolAddress = await factory.connect(owner).getPool(
    token0,
    token1,
    fee,
  )
  return poolAddress
}


async function main() {
  console.log('encode Price >>' ,await encodePriceSqrt(1, 1).toString());
  const usdtUsdc500 = await deployPool(TETHER_ADDRESS, USDC_ADDRESS, 3000, encodePriceSqrt(1, 1));
  console.log('USDT_USDC_500=', `'${usdtUsdc500}'`);
}

/*
npx hardhat run --network localhost scripts/03_deployPools.js
*/

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });