import { network } from 'hardhat'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { developmentChains, networkConfig } from '../helper-hardhat-config'
import { DeployFunction } from 'hardhat-deploy/types'
import verify from '../utils/verify'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deployer } = await getNamedAccounts()
  const { deploy, log } = deployments
  const chainId: number = network.config.chainId!

  const router = networkConfig[chainId].router
  const tokenName = networkConfig[chainId].tokenName
  const tokenSymbol = networkConfig[chainId].tokenSymbol
  const args = [router, tokenName, tokenSymbol]

  const token = await deploy('RFToken', {
    contract: 'RFToken',
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
  })

  log('Contract deployed!')

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('Verifying...')
    await verify(token.address, args)
  }

  log('-------------------------------')
}

export default deploy
deploy.tags = ['all', 'rts']
