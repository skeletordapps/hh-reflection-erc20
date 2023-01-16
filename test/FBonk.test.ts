// import { getNamedAccounts, network, ethers, deployments } from 'hardhat'
// import { developmentChains } from '../helper-hardhat-config'
// import { assert, expect } from 'chai'
// import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
// import type { FBonk } from '../typechain-types'
// import { networkConfig } from '../helper-hardhat-config'

// !developmentChains.includes(network.name)
//   ? describe
//   : describe('Wheel Unit Tests', () => {
//       let fbonk: FBonk
//       let deployer: string
//       let accounts: SignerWithAddress[]
//       let owner: SignerWithAddress

//       beforeEach(async () => {
//         accounts = await ethers.getSigners()
//         deployer = (await getNamedAccounts()).deployer

//         await deployments.fixture(['all'])

//         const fbonkFactory = await ethers.getContractFactory(
//           'FBonk',
//           accounts[0],
//         )
//         fbonk = await fbonkFactory.deploy(networkConfig[31337].router)
//         await fbonk.deployed()
//       })

//       it('asdf', async () => {
//         const name = await fbonk.name()
//         expect(name).to.be.equal('FBonk')
//       })
//     })
