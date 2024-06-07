import { AddressLike, BaseContract, ContractMethod, ContractMethodArgs, ContractTransactionReceipt, ContractTransactionResponse, Fragment, FunctionFragment, Interface, TransactionRequest, getAddress } from "ethers";

import ContractInstanceNotFoundException from "../types/exceptions/ContractInstanceNotFound.exception";
import ContractMethodNotFoundException from "../types/exceptions/ContractMethodNotFound.exception";
import ContractHolderNotFoundException from "../types/exceptions/ContractHolderNotFound.exception";
import ContractCollection from "../types/ContractCollection.type";
import ContractHolder from "../types/ContractHolder.type";
import Logger from "../helpers/logger.helper";

let logger: Logger;
let contracts: ContractCollection;

export function getContractHolder(contractName: string): ContractHolder {
  const contract: ContractHolder | undefined = contracts[contractName];

  if (!contract) {
    throw new ContractHolderNotFoundException(contractName, Object.keys(contracts));    
  }

  return contract;
}

export async function getContractInstance(contractName: string, contractAliasOrAddress: string): Promise<BaseContract> {
  const contractHolder: ContractHolder = getContractHolder(contractName);
  const contractInstance: BaseContract = contractHolder.contracts[contractAliasOrAddress];

  if (!contractInstance) {
    const errorToThrow = new ContractInstanceNotFoundException(contractName, contractAliasOrAddress, Object.keys(contractHolder.contracts));

    // If contractAlias is an address, attach to it.
    try {
      const address: string = getAddress(contractAliasOrAddress);
      const contract: BaseContract = contractHolder.factory.attach(address);
      const bytecode: string | null = await contract.getDeployedCode();

      if (bytecode === null || bytecode !== contractHolder.factory.bytecode) {
        throw errorToThrow;
      }

      return contract;
    } catch (e: any) {
      if (e instanceof ContractInstanceNotFoundException) {
        throw e;
      }

      throw errorToThrow;
    }
  }

  return contractInstance;
}

export async function getContractMethod(contractName: string, contractAliasOrAddress: string, methodName: string, args: ContractMethodArgs<any[]>): Promise<ContractMethod> {
  const contractInstance: BaseContract = await getContractInstance(contractName, contractAliasOrAddress);

  try {
    const func = contractInstance.getFunction(methodName);
    func.getFragment(...args);
    return func;
  } catch (exception: any) {
    logger.error(exception);
    throw new ContractMethodNotFoundException(contractName, contractAliasOrAddress, methodName, await contractInstance.getAddress(), getContractMethods(contractInstance.interface));
  }
}

export function getContractMethods(contractInterface: Interface): string[] {
  return contractInterface.fragments
      .filter((f: Fragment) => f instanceof FunctionFragment)
      .map((f: Fragment) => f as FunctionFragment)
      .map((f: FunctionFragment) => {
        const name = f.name;
        const mutability = f.stateMutability;
        const outputString = f.outputs.map(output => `${output.type}`).join(', ');
        const inputString = f.inputs.map(input => `${input.type} ${input.name}`).join(', ');

        let finalOutput;
        if (f.outputs.length < 1) {
          finalOutput = `void`
        } else if (f.outputs.length > 1) {
          finalOutput = `(${outputString})`
        }
        else {
          finalOutput = outputString;
        }

        return `${mutability} ${finalOutput} ${name}(${inputString})`;
      });
}

export async function deployContract(contractName: string, args: any[], options: TransactionRequest): Promise<BaseContract> {
  const contractHolder: ContractHolder = getContractHolder(contractName);
  const contract: BaseContract = await contractHolder.factory.deploy(...args, options);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  contractHolder.contracts[address] = contract;
  return contract;
}

export async function callContractMethod(contractName: string, contractAliasOrAddress: string, methodName: string, args: any[], options: TransactionRequest): Promise<any> {
  const func: ContractMethod = await getContractMethod(contractName, contractAliasOrAddress, methodName, args);
  let result: any = await func(...args, options);
  if (result.toObject instanceof Function) {
    result = result.toObject();
  }

  return result;
}

export async function executeContractMethod(contractName: string, contractAliasOrAddress: string, methodName: string, args: any[], options: TransactionRequest): Promise<ContractTransactionResponse | ContractTransactionReceipt | null> {
  const func: ContractMethod = await getContractMethod(contractName, contractAliasOrAddress, methodName, args);
  let executeTransaction: ContractTransactionResponse = await func(...args, options);
  logger.debug(`Tx response: ${JSON.stringify(executeTransaction)}`);

  if (executeTransaction.wait) {
    logger.info("Waiting for confirmations");
    const receipt: ContractTransactionReceipt | null = await executeTransaction.wait();
    logger.debug(`Tx receipt: ${JSON.stringify(receipt)}`);

    return receipt;
  } else {
    return executeTransaction;
  }
}

export async function initContractsService(_logger: Logger, _contracts: ContractCollection) {
  logger = _logger;
  contracts = _contracts;
}
