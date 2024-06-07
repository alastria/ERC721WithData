import AppError from "./AppError.exception";

export default class ContractHolderNotFoundException extends AppError {
  constructor(contractName: string, contractList: string[]) {
    super(
      'ContractHolderNotFoundException', 
      `Contract '${contractName}' could not be found`, 
      { contracts: contractList }, 
      400
    );
  }
}