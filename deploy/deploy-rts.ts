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

  // const _router = networkConfig[chainId]._router
  // const __name = networkConfig[chainId].__name
  // const __symbol = networkConfig[chainId].__symbol
  // const args = [_router, __name, __symbol]

  // console.log(deployer, args, network.name, developmentChains)

  const args = [networkConfig[chainId].charityWalletAddress]

  const token = await deploy('FlyPaper', {
    contract: 'FlyPaper',
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
