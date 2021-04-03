import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@eth-optimism/plugins/hardhat/compiler";
import "@tenderly/hardhat-tenderly";
import "hardhat-deploy";

import { DEFAULT_MNEMONIC } from "./helpers/constants";
const mnemonic = process.env.MNEMONIC ? process.env.MNEMONIC : DEFAULT_MNEMONIC;
const accounts = {
  mnemonic,
};

import networks from "./networks.json";

module.exports = {
  networks: {
    localhost_l1: {
      url: networks.localhost.l1RpcUrl,
      accounts,
    },
    localhost_l2: {
      url: networks.localhost.l2RpcUrl,
      accounts,
    },
    kovan_l1: {
      url: networks.kovan.l1RpcUrl,
      accounts,
    },
    kovan_l2: {
      url: networks.kovan.l2RpcUrl,
      accounts,
    },
  },
  solidity: "0.7.6",
  ovm: {
    solcVersion: "0.7.6",
  },
};
