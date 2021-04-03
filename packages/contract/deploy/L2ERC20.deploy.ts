import * as fs from "fs";
import * as path from "path";

import { LOG } from "../helpers/configs";
import { ERC20_NAME, ERC20_SYMBOL } from "../helpers/constants";
const filePath = "../networks.json";
import { removeLayerIdFromNetworkName } from "../helpers/utils";
import networks from "../networks.json";

const func = async (hre) => {
  const { deployments, network } = hre;
  const [signer] = await hre.ethers.getSigners();
  const { deploy } = deployments;
  const { name } = network;
  const networkName = removeLayerIdFromNetworkName(name);
  const { gasPrice, gasLimit } = networks[networkName];
  const log = LOG;
  const { address } = await deploy("L2ERC20", {
    from: signer.address,
    args: [networks.localhost.l2MessengerAddress, ERC20_NAME, ERC20_SYMBOL],
    gasPrice: hre.ethers.BigNumber.from(gasPrice),
    gasLimit,
    log,
  });
  networks[networkName].l2ERC20Address = address.toLowerCase();
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(networks));
  return address;
};

func.tags = ["L2ERC20"];
export default func;
