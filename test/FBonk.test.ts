import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import { networkConfig } from '../helper-hardhat-config'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { FBonk } from '../typechain-types'

describe('FBonk', () => {
  let fbonk: FBonk
  let owner: SignerWithAddress
  let signer2: SignerWithAddress
  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[0]
    signer2 = accounts[1]

    const FBonk = await ethers.getContractFactory('FBonk', owner)

    fbonk = await FBonk.deploy(networkConfig[network.config.chainId!].router)
  })

  describe('constructor', () => {
    it('should initializes correctly', async () => {
      const router = await fbonk.uniswapV2Router()
      expect(router).to.equal(networkConfig[network.config.chainId!].router)
    })
  })

  // describe('transfer', () => {
  //   it('transfers tokens, reduces supply and wallet balances', async () => {
  //     let ownerBalance
  //     let signer2Balance
  //     let totalSupply

  //     totalSupply = await chartToken.totalSupply()
  //     ownerBalance = await chartToken.balanceOf(owner.address)
  //     // signer2Balance = await chartToken.balanceOf(signer2.address)

  //     expect(totalSupply).to.equal(ethers.utils.parseEther('10'))
  //     expect(ownerBalance).to.equal(ethers.utils.parseEther('10'))

  //     await chartToken
  //       .connect(owner)
  //       .transfer(signer2.address, ethers.utils.parseEther('5'))

  //     totalSupply = await chartToken.totalSupply()
  //     ownerBalance = await chartToken.balanceOf(owner.address)
  //     signer2Balance = await chartToken.balanceOf(signer2.address)

  //     expect(totalSupply).to.equal(
  //       ethers.utils.parseEther((10 - 5 * 0.5).toString()),
  //     )
  //     expect(ownerBalance).to.equal(ethers.utils.parseEther('5'))
  //     expect(signer2Balance).to.equal(ethers.utils.parseEther('2.5'))
  //   })
  // })
})
