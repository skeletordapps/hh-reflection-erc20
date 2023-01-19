import { expect } from 'chai'
import { ethers, network } from 'hardhat'
import { networkConfig } from '../helper-hardhat-config'
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import type { RFToken } from '../typechain-types'
import { JsonRpcSigner } from '@ethersproject/providers'

const impersonateAddress = async (address: string) => {
  network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [address],
  })
  const signer: JsonRpcSigner = await ethers.provider.getSigner(address)
  return signer
}

describe('RFToken', () => {
  let rftoken: RFToken
  let owner: SignerWithAddress
  let signer2: SignerWithAddress
  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[0]
    signer2 = accounts[1]

    const RFToken = await ethers.getContractFactory('RFToken', owner)
    const chainId = network.config.chainId!
    const router = networkConfig[chainId].router
    const tokenName = networkConfig[chainId].tokenName
    const tokenSymbol = networkConfig[chainId].tokenSymbol
    rftoken = await RFToken.deploy(router, tokenName, tokenSymbol)
  })

  describe('constructor', () => {
    it('should initializes correctly', async () => {
      const name = await rftoken.name()
      const symbol = await rftoken.symbol()
      const decimals = await rftoken.decimals()
      const router = await rftoken.uniswapV2Router()
      const totalSupply = await rftoken.totalSupply()
      const devFee = await rftoken._devFee()
      const taxFee = await rftoken._taxFee()
      const liquidityFee = await rftoken._liquidityFee()
      const ownerBalance = await rftoken.balanceOf(owner.address)
      const maxTxAmount = await rftoken._maxTxAmount()

      expect(name).to.equal('RFToken')
      expect(symbol).to.equal('RFT')
      expect(decimals).to.equal(9)
      expect(router).to.equal(networkConfig[network.config.chainId!].router)
      expect(totalSupply.toString()).to.equal('1000000000000000000')
      expect(devFee).to.equal(0)
      expect(taxFee).to.equal(3)
      expect(liquidityFee).to.equal(3)
      expect(ownerBalance.toString()).to.equal('1000000000000000000')
      expect(maxTxAmount.toString()).to.equal('2000000000000000')
    })
  })

  describe('setting fees', () => {
    it('revert when is not the owner setting dev fee', async () => {
      rftoken = rftoken.connect(signer2)
      await expect(rftoken.setDevFeePercent(2)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('revert when is not the owner setting tax fee', async () => {
      rftoken = rftoken.connect(signer2)
      await expect(rftoken.setTaxFeePercent(2)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('revert when is not the owner setting liquidity fee', async () => {
      rftoken = rftoken.connect(signer2)
      await expect(rftoken.setLiquidityFeePercent(2)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('updates dev fee', async () => {
      await rftoken.setDevFeePercent(2)
      const devFee = await rftoken._devFee()
      expect(devFee).to.equal(2)
    })

    it('updates tax fee', async () => {
      await rftoken.setTaxFeePercent(2)
      const taxFee = await rftoken._taxFee()
      expect(taxFee).to.equal(2)
    })

    it('updates liquidity fee', async () => {
      await rftoken.setLiquidityFeePercent(2)
      const liquidityFee = await rftoken._liquidityFee()
      expect(liquidityFee).to.equal(2)
    })
  })

  describe('managing fees list', () => {
    it('revert when is not the owner including in fees list', async () => {
      rftoken = rftoken.connect(signer2)
      await expect(rftoken.includeInFee(signer2.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('revert when is not the owner excluding from fees list', async () => {
      rftoken = rftoken.connect(signer2)
      await expect(rftoken.excludeFromFee(signer2.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('should be in tax fees list by default', async () => {
      const isExcludedFromFee = await rftoken.isExcludedFromFee(signer2.address)
      expect(isExcludedFromFee).to.equal(false)
    })

    it('owner should not be in tax fees by default', async () => {
      const isExcludedFromFee = await rftoken.isExcludedFromFee(owner.address)
      expect(isExcludedFromFee).to.equal(true)
    })

    it('remove account from tax fees list', async () => {
      await rftoken.excludeFromFee(signer2.address)

      const isExcludedFromFee = await rftoken.isExcludedFromFee(signer2.address)
      expect(isExcludedFromFee).to.equal(true)
    })

    it('add an account in tax fees list', async () => {
      await rftoken.excludeFromFee(signer2.address)
      await rftoken.includeInFee(signer2.address)
      const isExcludedFromFee = await rftoken.isExcludedFromFee(signer2.address)
      expect(isExcludedFromFee).to.equal(false)
    })
  })

  describe('managing rewards list', () => {
    it('revert when is not the owner excluding from rewards', async () => {
      rftoken = rftoken.connect(signer2)
      await expect(
        rftoken.excludeFromReward(signer2.address),
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('revert when is not the owner including in rewards', async () => {
      rftoken = rftoken.connect(signer2)
      await expect(rftoken.includeInReward(signer2.address)).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })

    it('reverts when including same account 2 times', async () => {
      await expect(rftoken.includeInReward(signer2.address)).to.be.revertedWith(
        'Account is already included',
      )
    })

    it('reverts when excluding more than one time', async () => {
      await rftoken.excludeFromReward(signer2.address)
      await expect(
        rftoken.excludeFromReward(signer2.address),
      ).to.be.revertedWith('Account is already excluded')
    })

    it('should be in rewards list by default', async () => {
      const isExcludedFromReward = await rftoken.isExcludedFromReward(
        signer2.address,
      )
      expect(isExcludedFromReward).to.equal(false)
    })

    it('remove account from rewards list', async () => {
      await rftoken.excludeFromReward(signer2.address)

      const isExcludedFromReward = await rftoken.isExcludedFromReward(
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
