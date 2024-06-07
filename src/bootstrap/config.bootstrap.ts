import { readYamlFile } from "../helpers/yaml.helper";
import Config from "../types/Config.type";

export function initConfig(configPath: string): Config {
  // read from file
  const config = readYamlFile(configPath || "config.yaml");

  const envPort = process.env.DEV_APP_PORT;

  // update app
  config.PORT = envPort !== undefined ? parseInt(envPort) : config.PORT || 3000;
  config.NETWORK = process.env.NETWORK || config.NETWORK || 'hardhat';
  config.LOG_LEVELS.LOG_LEVEL_SYSTEM = process.env.LOG_LEVEL_SYSTEM || config.LOG_LEVELS.LOG_LEVEL_SYSTEM || "debug";
  config.LOG_LEVELS.LOG_LEVEL_FILE = process.env.LOG_LEVEL_FILE || config.LOG_LEVELS.LOG_LEVEL_FILE || "info";
  return config;
}
