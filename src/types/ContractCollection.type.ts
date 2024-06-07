import ContractHolder from "./ContractHolder.type";

export default interface ContractCollection {
  [key: string]: ContractHolder;
}
