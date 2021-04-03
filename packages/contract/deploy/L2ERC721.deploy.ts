import * as fs from "fs";
import * as path from "path";

import { LOG } from "../helpers/configs";
import { ERC721_NAME, ERC721_SYMBOL } from "../helpers/constants";
const filePath = "../networks.json";
import { removeLayerIdFromNetworkName, getSigner } from "../helpers/utils";
import networks from "../networks.json";

const func = async (hre) => {
  const { deployments, network } = hre;
  const { deploy } = deployments;
  const { name } = network;
  const networkName = removeLayerIdFromNetworkName(name);
  const { l2GasPrice, gasLimit, l2Provider, l2MessengerAddress } = networks[networkName];
  const log = LOG;
  const signer = getSigner(l2Provider);
  const signerAddress = await signer.getAddress();
  const { address } = await deploy("L2ERC721", {
    from: signerAddress,
    args: [l2MessengerAddress, ERC721_NAME, ERC721_SYMBOL],
    gasPrice: hre.ethers.BigNumber.from(l2GasPrice),
    gasLimit,
    log,
  });
  networks[networkName].l2ERC721Address = address.toLowerCase();
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(networks));
  return address;
};

func.tags = ["L2ERC721"];
export default func;
