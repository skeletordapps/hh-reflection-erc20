type Config = {
  [key: string]: {
    name: string
    router: string
  }
}

export const networkConfig: Config = {
  5: {
    name: 'goerli',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  },
  250: {
    name: 'opera',
    router: '0xF491e7B69E4244ad4002BC14e878a34207E38c29',
  },
  4002: {
    name: 'operaTest',
    router: '0xa6AD18C2aC47803E193F75c3677b14BF19B94883',
  },
  31337: {
    name: 'hardhat',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // uniswap mainnet
  },
  localhost: {
    name: 'localhost',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // uniswap mainnet
  },
}

export const developmentChains: string[] = ['hardhat', 'localhost']
