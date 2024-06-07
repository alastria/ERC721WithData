import AppError from "./AppError.exception";

export default class ContractInstanceNotFoundException extends AppError {
  constructor(contractName: string, contractAlias: string, addressList: string[]) {
    super(
      'ContractInstanceNotFoundException', 
      `Contract '${contractName}' with instance at '${contractAlias}' does not exist or is not deployed on the network. Please check that you are using a correct address, or that you deploy the contract with /deploy/${contractName} to deploy the contract.`, 
      { knownAddresses: addressList }, 
      400
    );
  }
}