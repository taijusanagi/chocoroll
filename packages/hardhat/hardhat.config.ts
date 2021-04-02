import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@eth-optimism/plugins/hardhat/compiler";

const mnemonic = "test test test test test test test test test test test junk";

module.exports = {
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
    },
    optimism: {
      url: "http://localhost:8545",
      accounts: {
        mnemonic,
      },
    },
  },
  solidity: "0.7.6",
  ovm: {
    solcVersion: "0.7.6",
  },
  namedAccounts: {
    deployer: 0,
  },
};
