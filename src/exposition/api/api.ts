import express, { Express, Request, Response } from "express";
import {
  BaseContract,
  ContractMethod,
  ContractTransactionReceipt,
  ContractTransactionResponse,
  TransactionRequest
} from "ethers";

import { getContractMethod } from "../../services/contracts.service";
import { callContractMethodController, deployContractController, executeContractMethodController } from "../controllers/contract.controller";
import handleControllerCall from "../controllers";

import Logger from "../../helpers/logger.helper";
import Config from "../../types/Config.type";
import { apiKeyMiddleware } from "../middleware/apiKey.middleware";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiKeyMiddleware);

let logger: Logger;
let config: Config;

app.post("/:contractName/deploy", async (req: Request, res: Response) => {
  const contractName: string = req.params.contractName;
  const requestMade: string = `POST /${contractName}/deploy`;

  logger.info(requestMade);
  logger.debug(`${requestMade} ${JSON.stringify(req.headers)} ${JSON.stringify(req.query)} ${JSON.stringify(req.body)}`);

  await handleControllerCall(req, res, logger, deployContractController);
});

app.get("/:contractName/:contractAliasOrAddress/:method", async (req: Request, res: Response) => {
  const contractName: string = req.params.contractName;
  const contractAliasOrAddress: string = req.params.contractAliasOrAddress;
  const methodName: string = req.params.method;
  const requestMade: string = `GET /${contractName}/${contractAliasOrAddress}/${methodName}`;

  logger.info(requestMade);
  logger.debug(`${requestMade} ${JSON.stringify(req.headers)} ${JSON.stringify(req.query)} ${JSON.stringify(req.body)}`);

  await handleControllerCall(req, res, logger, callContractMethodController);
});

app.post("/:contractName/:contractAliasOrAddress/:method", async (req: Request, res: Response) => {
  const contractName: string = req.params.contractName;
  const contractAliasOrAddress: string = req.params.contractAliasOrAddress;
  const methodName: string = req.params.method;
  const requestMade: string = `POST /${contractName}/${contractAliasOrAddress}/${methodName}`;

  logger.info(requestMade);
  logger.debug(`${requestMade} ${JSON.stringify(req.headers)} ${JSON.stringify(req.query)} ${JSON.stringify(req.body)}`);

  await handleControllerCall(req, res, logger, executeContractMethodController);
});

/**
 * Initialize de application
 */
export default async function startApi(
  _config: Config,
  _loggger: Logger
) {
  logger = _loggger;
  config = _config;

  logger.info("STARTING API");
  const appPort = config.PORT || 3000;
  app.listen(appPort);
  logger.info(`Express server running on port ${appPort}...`);
}
