// import 'hardhat-typechain'
// import '@nomiclabs/hardhat-ethers'
// import '@nomiclabs/hardhat-waffle'
// import '@nomiclabs/hardhat-etherscan'



// const ALCHEMY_API_KEY = "2nVs0vDzrbFi_iejEPRl57Ik5vF6xl5v";
// const GOERLI_PRIVATE_KEY = "3b73085e56f2facbd8e6f5f5e84250e49763deb6639b44175773a9137f8bb86a";


// export default {
//   networks: {
//     hardhat: {
//       allowUnlimitedContractSize: false,
//     },
//     mainnet: {
//       url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     ropsten: {
//       url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     rinkeby: {
//       url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     goerli: {
//       url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     // goerli: {
//     //   url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
//     //   accounts: [GOERLI_PRIVATE_KEY]
//     // },
//     kovan: {
//       url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     arbitrumRinkeby: {
//       url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     arbitrum: {
//       url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     optimismKovan: {
//       url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     optimism: {
//       url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     mumbai: {
//       url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//     polygon: {
//       url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
//     },
//   },
//   etherscan: {
//     // Your API key for Etherscan
//     // Obtain one at https://etherscan.io/
//     apiKey: process.env.ETHERSCAN_API_KEY,
//   },
//   solidity: {
//     version: '0.7.6',
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 800,
//         details: { yul: false },

//       },
//       metadata: {
//         // do not include the metadata hash, since this is machine dependent
//         // and we want all generated code to be deterministic
//         // https://docs.soliditylang.org/en/v0.7.6/metadata.html
//         bytecodeHash: 'none',
//       },
//     },
//   },
// }




require ("@nomiclabs/hardhat-waffle");
require('@matterlabs/hardhat-zksync-deploy');
require( '@matterlabs/hardhat-zksync-solc');

const ALCHEMY_API_KEY = "3mQyQQlouZSpP9urDglk3M9XLmlgoxmp";
const GOERLI_API_KEY = "I5AsJB8XX-iWDL0WmdODLAtjNSSvfi_x";
const MUMBAI_PRIVATE_KEY = "0xadf787d3490ae2a37e70df7fc654be598cd91d6f2932f68bc62c99b2e88bb376";

module.exports = {
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: true },
      },
    }
  },

  zksolc: {
    version: "1.3.1",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",

  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [MUMBAI_PRIVATE_KEY]
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API_KEY}`,
      accounts: [MUMBAI_PRIVATE_KEY]
    },
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: "goerli", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
    hardhat: {
      zksync: true
    }
  },
};

