/** @type import('hardhat/config').HardhatUserConfig */
import "@nomicfoundation/hardhat-ethers";

import { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";
import { extendEnvironment } from "hardhat/config";
import { createProvider } from "hardhat/internal/core/providers/construction";
import { ethers } from "ethers";

extendEnvironment((hre) => {
  hre.changeNetwork = async function changeNetwork(newNetwork: string) {
    if (!this.config.networks[newNetwork]) {
      throw new Error(`changeNetwork: Couldn't find network '${newNetwork}'`);
    }

    this.network.name = newNetwork;
    this.network.config = this.config.networks[newNetwork];
    this.network.provider = await createProvider(this.config, newNetwork, this.artifacts);

    if (this.ethers) {
      this.ethers.provider = new HardhatEthersProvider(
        this.network.provider,
        newNetwork
      );
    }
  };
});

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10,
      },
      // Version of the EVM to compile for.
      // Affects type checking and code generation. Can be homestead,
      // tangerineWhistle, spuriousDragon, byzantium, constantinople,
      // petersburg, istanbul, berlin, london, paris, shanghai or cancun (default)
      evmVersion: "berlin",
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {},
    redB: {
      url: "http://63.33.55.29",
      accounts: [ethers.Wallet.createRandom().privateKey],
      httpHeaders: {
        "X-APIkey": ''
      }
    },
  },
};
