import { BaseContract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-ethers";

import Logger from "../helpers/logger.helper";
import ContractCollection from "../types/ContractCollection.type";
import ContractHolder from "../types/ContractHolder.type";
import Contracts from "../types/Contracts.type";
import Contract from "../types/Contract.type";
import Config from "../types/Config.type";

export async function setupContract(contract: Contract, logger: Logger): Promise<ContractHolder> {
  const contractName = contract.name;
  const contractAlias = contract.alias;
  const contractAddress = contract.address;
  const contractAutoDeploy = contract.autoDeploy;

  logger.info(`Preparing contract ${contractName}...`);
  
  const contractFactory: ContractFactory = await ethers.getContractFactory(contractName);
  const contracts: Contracts = {};

  if (contractAddress) {
    logger.info(`Contract ${contractName} is already deployed at ${contractAddress}. Attaching...`);

    contracts[contractAlias] = contractFactory.attach(contractAddress);

    logger.info(`Attached correctly to ${contractName} at ${contractAddress} with alias ${contractAlias}.`);
  } else if (contractAutoDeploy) {
    logger.info(`Contract is not yet deployed, autoDeploy set to true. Deploying contract ${contractName}...`);

    const contract: BaseContract = await contractFactory.deploy();
    await contract.waitForDeployment();

    logger.info(`Contract ${contractName} deployed correctly at ${await contract.getAddress()} with alias ${contractAlias}`);
  } else {
    logger.info(`Contract ${contractName} does not have an address and autoDeploy is false. Contract Factory is ready`);
  }

  return { factory: contractFactory, contracts };
}

export async function deployAllContracts(config: Config, logger: Logger): Promise<ContractCollection> {
  const contracts: ContractCollection = {};
  logger.info(`Preparing ${config.CONTRACTS.length} contracts...`);

  for (const contract of config.CONTRACTS) {
    contracts[contract.name] = await setupContract(contract, logger);
  }

  logger.info(`Prepared ${config.CONTRACTS.length} contracts successfully.`);
  return contracts;
}
