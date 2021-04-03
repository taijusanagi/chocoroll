import * as fs from "fs";
import * as path from "path";

import { LOG } from "../helpers/configs";
import { DEFAULT_MNEMONIC } from "../helpers/constants";
import { ERC721_NAME, ERC721_SYMBOL } from "../helpers/constants";
const filePath = "../networks.json";
import { removeLayerIdFromNetworkName, getSigner } from "../helpers/utils";
import networks from "../networks.json";

const mnemonic = process.env.MNEMONIC ? process.env.MNEMONIC : DEFAULT_MNEMONIC;

const func = async (hre) => {
  const { deployments, network } = hre;
  const { deploy } = deployments;
  const { name } = network;
  const networkName = removeLayerIdFromNetworkName(name);
  const { l1GasPrice, gasLimit, l1Provider } = networks[networkName];
  const log = LOG;
  const signer = getSigner(l1Provider);
  const signerAddress = await signer.getAddress();

  const { address } = await deploy("L1ERC721", {
    from: signerAddress,
    args: [ERC721_NAME, ERC721_SYMBOL],
    gasPrice: hre.ethers.BigNumber.from(l1GasPrice),
    gasLimit,
    log,
  });
  networks[networkName].l1ERC721Address = address.toLowerCase();
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(networks));
  return address;
};
func.tags = ["L1ERC721"];
export default func;
