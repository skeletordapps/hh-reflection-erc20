import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-deploy'
import * as dotenv from 'dotenv'

dotenv.config()

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL as string
const PRIVATE_KEY = process.env.PRIVATE_KEY as string
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string
const FTMSCAN_API_KEY = process.env.FTMSCAN_API_KEY as string
const INFURA_NODE_HTTPS = process.env.INFURA_NODE_HTTPS as string
const config: HardhatUserConfig = {
  solidity: '0.8.17',
  // defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      // allowUnlimitedContractSize: true,
      // gas: 2100000,
      // gasPrice: 8000000000,
      // mining: {
      //   auto: true,
      //   interval: [500, 1000],
      // },
      forking: {
        url: INFURA_NODE_HTTPS,
        blockNumber: 10207858,
      },
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
      mining: {
        auto: true,
        interval: [500, 1000],
      },
      forking: {
        url: INFURA_NODE_HTTPS,
        blockNumber: 10207858,
      },
    },
    goerli: {
      chainId: 5,
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    opera: {
      chainId: 250,
      url: 'https://rpc.ftm.tools',
      accounts: [PRIVATE_KEY],
    },
    operaTest: {
      chainId: 4002,
      url: 'https://rpc.testnet.fantom.network',
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      opera: FTMSCAN_API_KEY,
      ftmTestnet: FTMSCAN_API_KEY,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
}

export default config
