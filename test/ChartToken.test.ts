import chai, { expect } from 'chai'
import { ethers } from 'hardhat'

describe('ChartToken', () => {
  let chartToken: any
  let owner: any
  let signer2: any
  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[0]
    signer2 = accounts[1]

    const ChartToken = await ethers.getContractFactory('ChartToken', owner)

    chartToken = await ChartToken.deploy()
  })

  describe('transfer', () => {
    it('transfers tokens, reduces supply and wallet balances', async () => {
      let ownerBalance
      let signer2Balance
      let totalSupply

      totalSupply = await chartToken.totalSupply()
      ownerBalance = await chartToken.balanceOf(owner.address)
      // signer2Balance = await chartToken.balanceOf(signer2.address)

      expect(totalSupply).to.equal(ethers.utils.parseEther('10'))
      expect(ownerBalance).to.equal(ethers.utils.parseEther('10'))

      await chartToken
        .connect(owner)
        .transfer(signer2.address, ethers.utils.parseEther('5'))

      totalSupply = await chartToken.totalSupply()
      ownerBalance = await chartToken.balanceOf(owner.address)
      signer2Balance = await chartToken.balanceOf(signer2.address)

      expect(totalSupply).to.equal(
        ethers.utils.parseEther((10 - 5 * 0.5).toString()),
      )
      expect(ownerBalance).to.equal(ethers.utils.parseEther('5'))
      expect(signer2Balance).to.equal(ethers.utils.parseEther('2.5'))
    })
  })
})
