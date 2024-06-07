import { BaseContract, ContractMethod, ContractTransactionReceipt, ContractTransactionResponse, TransactionRequest } from "ethers";
import { Request } from "express";

import { callContractMethod, deployContract, executeContractMethod, getContractMethod, getContractMethods } from "../../services/contracts.service";
import AppResult from "../../types/AppResult.type";
import Logger from "../../helpers/logger.helper";

let logger: Logger;

export async function deployContractController(req: Request): Promise<AppResult> {
  const contractName: string = req.params.contractName;
  const args: any[] = req.body.args || [];
  const options: TransactionRequest = req.body.options || {};

  const contract: BaseContract = await deployContract(contractName, args, options);
  const address = await contract.getAddress();
  return {
    statusCode: 201,
    body: {
      message: "Contract deployed correctly",
      contract: {
        name: contractName,
        address: address,
        methods: getContractMethods(contract.interface)
      }
    }
  };
}

export async function callContractMethodController(req: Request): Promise<AppResult> {
  const contractName: string = req.params.contractName;
  const contractAliasOrAddress: string = req.params.contractAliasOrAddress;
  const methodName: string = req.params.method;
  const args: any[] = req.body.args || [];
  const options: TransactionRequest = req.body.options || {};

  const result = await callContractMethod(contractName, contractAliasOrAddress, methodName, args, options);

  return {
    statusCode: 200,
    body: {
      message: 'Success',
      result
    }
  };
}

export async function executeContractMethodController(req: Request): Promise<AppResult> {
  const contractName: string = req.params.contractName;
  const contractAliasOrAddress: string = req.params.contractAliasOrAddress;
  const methodName: string = req.params.method;
  const args: any[] = req.body.args || [];
  const options: TransactionRequest = req.body.options || {};

  const result: ContractTransactionResponse | ContractTransactionReceipt | null = await executeContractMethod(contractName, contractAliasOrAddress, methodName, args, options);

  return {
    statusCode: 201,
    body: {
      message: result instanceof ContractTransactionReceipt ? 'Transaction executed' : 'Transacion processed',
      result
    }
  }
}

export default function initContractController(_logger: Logger) {
  logger = _logger;
}