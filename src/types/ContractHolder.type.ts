import { ContractFactory } from "ethers";
import Contracts from "./Contracts.type";

export default interface ContractHolder {
  factory: ContractFactory;
  contracts: Contracts;
}