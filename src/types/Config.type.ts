import Contract from "./Contract.type";

export default interface Config {
  SERVICE_NAME: string;
  PORT: number;
  NETWORK: string;
  CONTRACTS: Contract[];
  LOG_LEVELS: { LOG_LEVEL_SYSTEM: string; LOG_LEVEL_FILE: string };
}
