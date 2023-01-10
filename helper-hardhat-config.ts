// type Config = {
//   [key: string]: {
//     name: string
//     _router: string
//     __name: string
//     __symbol: string
//   }
// }

type Config = {
  [key: string]: {
    name: string
    charityWalletAddress: string
  }
}

export const networkConfig: Config = {
  // 5: {
  //   name: 'goerli',
  //   _router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  //   __name: 'ReflectionToken',
  //   __symbol: 'RFT',
  // },
  // 31337: {
  //   name: 'hardhat',
  //   _router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  //   __name: 'ReflectionToken',
  //   __symbol: 'RFT',
  // },
  // localhost: {
  //   name: 'localhost',
  //   _router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  //   __name: 'ReflectionToken',
  //   __symbol: 'RFT',
  // },

  5: {
    name: 'goerli',
    charityWalletAddress: '0xF23a78BDb0D06fEd3410d3e45b4C180742B592c4',
  },
  31337: {
    name: 'hardhat',
    charityWalletAddress: '0xF23a78BDb0D06fEd3410d3e45b4C180742B592c4',
  },
  localhost: {
    name: 'localhost',
    charityWalletAddress: '0xF23a78BDb0D06fEd3410d3e45b4C180742B592c4',
  },
}

export const developmentChains: string[] = ['hardhat', 'localhost']
