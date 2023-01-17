import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import { networkConfig } from '../helper-hardhat-config'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { FBonk } from '../typechain-types'
import { JsonRpcSigner } from '@ethersproject/providers'

const impersonateAddress = async (address: string) => {
  network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  })
  const signer: JsonRpcSigner = await ethers.provider.getSigner(address)
  return signer
}

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
      const totalSupply = await fbonk.totalSupply()
      const devFee = await fbonk._devFee()
      const taxFee = await fbonk._taxFee()
      const liquidityFee = await fbonk._liquidityFee()
      expect(router).to.equal(networkConfig[network.config.chainId!].router)
      expect(totalSupply).to.equal(1000 * 10 ** 9)
      expect(devFee).to.equal(0)
      expect(taxFee).to.equal(4)
      expect(liquidityFee).to.equal(2)
    })
  })

  describe('setting fees', () => {
    it('revert when is not the owner setting dev fee', async () => {
      fbonk = fbonk.connect(signer2)
      await expect(fbonk.setDevFeePercent(2)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('revert when is not the owner setting tax fee', async () => {
      fbonk = fbonk.connect(signer2)
      await expect(fbonk.setTaxFeePercent(2)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('revert when is not the owner setting liquidity fee', async () => {
      fbonk = fbonk.connect(signer2)
      await expect(fbonk.setLiquidityFeePercent(2)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('updates dev fee', async () => {
      await fbonk.setDevFeePercent(2)
      const devFee = await fbonk._devFee()
      expect(devFee).to.equal(2)
    })

    it('updates tax fee', async () => {
      await fbonk.setTaxFeePercent(2)
      const taxFee = await fbonk._taxFee()
      expect(taxFee).to.equal(2)
    })

    it('updates liquidity fee', async () => {
      await fbonk.setLiquidityFeePercent(2)
      const liquidityFee = await fbonk._liquidityFee()
      expect(liquidityFee).to.equal(2)
    })
  })

  describe('managing fees list', () => {
    it('revert when is not the owner including in fees list', async () => {
      fbonk = fbonk.connect(signer2)
      await expect(fbonk.includeInFee(signer2.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('revert when is not the owner excluding from fees list', async () => {
      fbonk = fbonk.connect(signer2)
      await expect(fbonk.excludeFromFee(signer2.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('should be in tax fees list by default', async () => {
      const isExcludedFromFee = await fbonk.isExcludedFromFee(signer2.address)
      expect(isExcludedFromFee).to.equal(false)
    })

    it('owner should not be in tax fees by default', async () => {
      const isExcludedFromFee = await fbonk.isExcludedFromFee(owner.address)
      expect(isExcludedFromFee).to.equal(true)
    })

    it('remove account from tax fees list', async () => {
      await fbonk.excludeFromFee(signer2.address)

      const isExcludedFromFee = await fbonk.isExcludedFromFee(signer2.address)
      expect(isExcludedFromFee).to.equal(true)
    })

    it('add an account in tax fees list', async () => {
      await fbonk.excludeFromFee(signer2.address)
      await fbonk.includeInFee(signer2.address)
      const isExcludedFromFee = await fbonk.isExcludedFromFee(signer2.address)
      expect(isExcludedFromFee).to.equal(false)
    })
  })

  describe('managing rewards list', () => {
    it('revert when is not the owner excluding from rewards', async () => {
      fbonk = fbonk.connect(signer2)
      await expect(fbonk.excludeFromReward(signer2.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('revert when is not the owner including in rewards', async () => {
      fbonk = fbonk.connect(signer2)
      await expect(fbonk.includeInReward(signer2.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('reverts when including same account 2 times', async () => {
      await expect(fbonk.includeInReward(signer2.address)).to.be.revertedWith(
        'Account is already included',
      )
    })

    it('reverts when excluding more than one time', async () => {
      await fbonk.excludeFromReward(signer2.address)
      await expect(fbonk.excludeFromReward(signer2.address)).to.be.revertedWith(
        'Account is already excluded',
      )
    })

    it('should be in rewards list by default', async () => {
      const isExcludedFromReward = await fbonk.isExcludedFromReward(
        signer2.address,
      )
      expect(isExcludedFromReward).to.equal(false)
    })

    it('remove account from rewards list', async () => {
      await fbonk.excludeFromReward(signer2.address)

      const isExcludedFromReward = await fbonk.isExcludedFromReward(
        signer2.address,
      )
      expect(isExcludedFromReward).to.equal(true)
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
