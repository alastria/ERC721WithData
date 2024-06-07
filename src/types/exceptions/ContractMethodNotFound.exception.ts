import AppError from "./AppError.exception";

export default class ContractMethodNotFoundException extends AppError {
  constructor(contractName: string, contractAliasOrAddress: string, methodName: string, contractAddress: string, contractMethods: string[]) {
    super(
      'ContractMethodNotFoundException', 
      `Contract '${contractName}' does not have a method '${methodName}'`,
      { contract: {
        name: contractName,
        alias: contractAliasOrAddress,
        address: contractAddress,
        methods: contractMethods
      } }, 
      400
    );
  }
}